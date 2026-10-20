


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE TYPE "public"."purchase_order_payment_method" AS ENUM (
    'cod',
    'card'
);


ALTER TYPE "public"."purchase_order_payment_method" OWNER TO "postgres";


CREATE TYPE "public"."purchase_order_status" AS ENUM (
    'draft',
    'pending',
    'partially_received',
    'closed',
    'cancelled',
    'overdue'
);


ALTER TYPE "public"."purchase_order_status" OWNER TO "postgres";


CREATE TYPE "public"."sku_receiving_status" AS ENUM (
    'pending',
    'in_progress',
    'partially_received',
    'received',
    'variance_flagged',
    'overdue'
);


ALTER TYPE "public"."sku_receiving_status" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."add_inventory_item_transaction"("p_sku_code" "text", "p_name" "text", "p_unit" "text", "p_category_id" "uuid", "p_unit_price" numeric, "p_supplier_id" "uuid", "p_initial_stock" numeric, "p_user_id" "uuid") RETURNS json
    LANGUAGE "plpgsql"
    AS $$
DECLARE
  v_sku_id UUID;
  v_result JSON;
BEGIN
  -- Insert SKU and get ID
  -- Note: The skus_create_inventory_stock trigger will auto-create
  -- an inventory_stock record with on_hand_qty = 0
  INSERT INTO skus (
    sku_code,
    name,
    unit,
    category_id,
    standard_unit_price,
    created_by
  ) VALUES (
    p_sku_code,
    p_name,
    p_unit,
    p_category_id,
    p_unit_price,
    p_user_id
  )
  RETURNING id INTO v_sku_id;

  -- Verify SKU was created
  IF v_sku_id IS NULL THEN
    RAISE EXCEPTION 'SKU insert failed, v_sku_id is NULL';
  END IF;

  -- Insert supplier link
  INSERT INTO sku_suppliers (
    sku_id,
    supplier_id,
    is_primary,
    supplier_sku_code,
    created_by
  ) VALUES (
    v_sku_id,
    p_supplier_id,
    TRUE,
    p_sku_code,
    p_user_id
  );

  -- Update inventory stock quantity
  -- (Record already exists from trigger, just update the quantity)
  UPDATE inventory_stock 
  SET on_hand_qty = p_initial_stock
  WHERE sku_id = v_sku_id;

  -- Return success with SKU ID
  v_result := json_build_object(
    'success', TRUE,
    'sku_id', v_sku_id
  );

  RETURN v_result;

EXCEPTION
  WHEN unique_violation THEN
    RAISE EXCEPTION 'SKU code already exists';
  WHEN OTHERS THEN
    -- Automatic rollback happens here
    RAISE;
END;
$$;


ALTER FUNCTION "public"."add_inventory_item_transaction"("p_sku_code" "text", "p_name" "text", "p_unit" "text", "p_category_id" "uuid", "p_unit_price" numeric, "p_supplier_id" "uuid", "p_initial_stock" numeric, "p_user_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."confirm_sku_receiving"("p_purchase_order_id" "uuid", "p_receipt_datetime" timestamp with time zone, "p_receiving_location" "text", "p_line_items" "jsonb", "p_delivery_note_number" "text" DEFAULT NULL::"text", "p_vehicle_ref" "text" DEFAULT NULL::"text", "p_notes" "text" DEFAULT NULL::"text") RETURNS "uuid"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public', 'pg_temp'
    AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_po_status public.purchase_order_status;
  v_receiving_id uuid;
  v_invalid_item uuid;
  v_has_rejects boolean;
  v_po_complete boolean;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'You must be logged in to receive goods.';
  END IF;

  IF NOT public.current_user_has_any_role(
    ARRAY['super_admin', 'operations_manager', 'store_keeper']
  ) THEN
    RAISE EXCEPTION 'You do not have permission to receive goods.';
  END IF;

  -- Lock the PO so concurrent receipts against it are serialized.
  SELECT status INTO v_po_status
  FROM purchase_orders
  WHERE id = p_purchase_order_id
  FOR UPDATE;

  IF v_po_status IS NULL THEN
    RAISE EXCEPTION 'Purchase order not found.';
  END IF;

  IF v_po_status NOT IN ('pending', 'partially_received', 'overdue') THEN
    RAISE EXCEPTION 'Purchase order is % and cannot be received.', v_po_status;
  END IF;

  CREATE TEMP TABLE _receiving_lines ON COMMIT DROP AS
  SELECT
    l.purchase_order_item_id,
    l.qty_received,
    l.qty_rejected,
    NULLIF(btrim(l.variance_reason), '') AS variance_reason
  FROM jsonb_to_recordset(p_line_items) AS l(
    purchase_order_item_id uuid,
    qty_received numeric,
    qty_rejected numeric,
    variance_reason text
  )
  WHERE coalesce(l.qty_received, 0) + coalesce(l.qty_rejected, 0) > 0;

  IF NOT EXISTS (SELECT 1 FROM _receiving_lines) THEN
    RAISE EXCEPTION 'Enter a received or rejected quantity for at least one line.';
  END IF;

  IF EXISTS (
    SELECT 1 FROM _receiving_lines
    WHERE qty_received < 0 OR qty_rejected < 0
  ) THEN
    RAISE EXCEPTION 'Quantities cannot be negative.';
  END IF;

  -- Lock the PO lines and verify each incoming line belongs to this PO and
  -- does not exceed what is still outstanding.
  PERFORM 1
  FROM purchase_order_items
  WHERE purchase_order_id = p_purchase_order_id
  FOR UPDATE;

  SELECT l.purchase_order_item_id INTO v_invalid_item
  FROM _receiving_lines l
  LEFT JOIN purchase_order_items poi
    ON poi.id = l.purchase_order_item_id
   AND poi.purchase_order_id = p_purchase_order_id
  WHERE poi.id IS NULL
     OR l.qty_received + l.qty_rejected > poi.ordered_qty - poi.received_qty
  LIMIT 1;

  IF v_invalid_item IS NOT NULL THEN
    RAISE EXCEPTION 'Line % is not on this PO or exceeds the remaining quantity.',
      v_invalid_item;
  END IF;

  SELECT bool_or(qty_rejected > 0) INTO v_has_rejects FROM _receiving_lines;

  SELECT bool_and(
    poi.received_qty + coalesce(l.qty_received, 0) >= poi.ordered_qty
  ) INTO v_po_complete
  FROM purchase_order_items poi
  LEFT JOIN _receiving_lines l ON l.purchase_order_item_id = poi.id
  WHERE poi.purchase_order_id = p_purchase_order_id;

  INSERT INTO sku_receivings (
    purchase_order_id,
    receipt_datetime,
    delivery_note_number,
    received_by,
    receiving_location,
    vehicle_ref,
    status,
    notes
  ) VALUES (
    p_purchase_order_id,
    coalesce(p_receipt_datetime, now()),
    NULLIF(btrim(p_delivery_note_number), ''),
    v_user_id,
    p_receiving_location,
    NULLIF(btrim(p_vehicle_ref), ''),
    CASE
      WHEN v_has_rejects THEN 'variance_flagged'
      WHEN v_po_complete THEN 'received'
      ELSE 'partially_received'
    END::sku_receiving_status,
    NULLIF(btrim(p_notes), '')
  )
  RETURNING id INTO v_receiving_id;

  -- sku_id comes from the PO line, never from the client.
  -- qty_expected is captured before received_qty is bumped below, so it is
  -- what was still outstanding when this delivery arrived.
  INSERT INTO sku_receiving_line_items (
    sku_receiving_id,
    purchase_order_item_id,
    sku_id,
    qty_expected,
    qty_received,
    qty_rejected,
    variance_reason
  )
  SELECT
    v_receiving_id,
    l.purchase_order_item_id,
    poi.sku_id,
    poi.ordered_qty - poi.received_qty,
    l.qty_received,
    l.qty_rejected,
    l.variance_reason
  FROM _receiving_lines l
  JOIN purchase_order_items poi ON poi.id = l.purchase_order_item_id;

  UPDATE purchase_order_items poi
  SET received_qty = poi.received_qty + l.qty_received
  FROM _receiving_lines l
  WHERE poi.id = l.purchase_order_item_id
    AND l.qty_received > 0;

  -- Stock row normally exists (skus trigger), upsert is a safety net.
  INSERT INTO inventory_stock (sku_id, on_hand_qty)
  SELECT poi.sku_id, sum(l.qty_received)
  FROM _receiving_lines l
  JOIN purchase_order_items poi ON poi.id = l.purchase_order_item_id
  WHERE l.qty_received > 0
  GROUP BY poi.sku_id
  ON CONFLICT (sku_id) DO UPDATE
  SET on_hand_qty = inventory_stock.on_hand_qty + EXCLUDED.on_hand_qty;

  UPDATE purchase_orders
  SET status = CASE
    WHEN v_po_complete THEN 'closed'
    ELSE 'partially_received'
  END::purchase_order_status
  WHERE id = p_purchase_order_id;

  RETURN v_receiving_id;
END;
$$;


ALTER FUNCTION "public"."confirm_sku_receiving"("p_purchase_order_id" "uuid", "p_receipt_datetime" timestamp with time zone, "p_receiving_location" "text", "p_line_items" "jsonb", "p_delivery_note_number" "text", "p_vehicle_ref" "text", "p_notes" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."create_inventory_stock_for_new_sku"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  INSERT INTO public.inventory_stock (sku_id)
  VALUES (NEW.id)
  ON CONFLICT (sku_id) DO NOTHING;

  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."create_inventory_stock_for_new_sku"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."current_user_has_any_role"("role_names" "text"[]) RETURNS boolean
    LANGUAGE "sql" STABLE SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    JOIN public.roles r ON r.id = ur.role_id
    WHERE ur.user_id = auth.uid()
      AND r.name = ANY(role_names)
  );
$$;


ALTER FUNCTION "public"."current_user_has_any_role"("role_names" "text"[]) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_dashboard_metrics"("p_timezone" "text" DEFAULT 'UTC'::"text") RETURNS TABLE("open_po_count" integer, "draft_po_count" integer, "pending_delivery_count" integer, "urgent_delivery_count" integer, "low_stock_count" integer, "critical_stock_count" integer, "spend_mtd" numeric, "spend_prev_period" numeric)
    LANGUAGE "plpgsql" STABLE
    SET "search_path" TO 'public'
    AS $$
DECLARE
  v_today date;
  v_month_start date;
  v_prev_month_start date;
  v_days_into_month int;
BEGIN
  BEGIN
    v_today := (now() AT TIME ZONE coalesce(p_timezone, 'UTC'))::date;
  EXCEPTION WHEN invalid_parameter_value THEN
    v_today := (now() AT TIME ZONE 'UTC')::date;
  END;

  v_month_start := date_trunc('month', v_today)::date;
  v_prev_month_start := (v_month_start - interval '1 month')::date;
  v_days_into_month := v_today - v_month_start;

  RETURN QUERY
  SELECT
    -- Open POs: everything not closed or cancelled (drafts still need approval).
    (SELECT count(*)::int FROM purchase_orders
      WHERE status IN ('draft', 'pending', 'partially_received', 'overdue')),
    (SELECT count(*)::int FROM purchase_orders
      WHERE status = 'draft'),

    -- Pending deliveries: POs still expecting goods; urgent = overdue or due
    -- within the next 2 days.
    (SELECT count(*)::int FROM purchase_orders
      WHERE status IN ('pending', 'partially_received', 'overdue')),
    (SELECT count(*)::int FROM purchase_orders
      WHERE status IN ('pending', 'partially_received', 'overdue')
        AND (status = 'overdue' OR expected_delivery_date <= v_today + 2)),

    -- Stock alerts from the computed stock_status column.
    (SELECT count(*)::int FROM inventory_stock
      WHERE stock_status IN ('low', 'critical')),
    (SELECT count(*)::int FROM inventory_stock
      WHERE stock_status = 'critical'),

    -- Spend: committed POs (not draft or cancelled) ordered this month so far,
    -- and the same number of days in the previous month for a fair comparison.
    (SELECT coalesce(sum(total_amount), 0) FROM purchase_orders
      WHERE status NOT IN ('draft', 'cancelled')
        AND order_date >= v_month_start
        AND order_date <= v_today),
    (SELECT coalesce(sum(total_amount), 0) FROM purchase_orders
      WHERE status NOT IN ('draft', 'cancelled')
        AND order_date >= v_prev_month_start
        AND order_date <= v_prev_month_start + v_days_into_month
        AND order_date < v_month_start);
END;
$$;


ALTER FUNCTION "public"."get_dashboard_metrics"("p_timezone" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_recent_receiving_activity"("p_limit" integer DEFAULT 5) RETURNS TABLE("line_item_id" "uuid", "receiving_id" "uuid", "receipt_datetime" timestamp with time zone, "receipt_status" "text", "po_number" "text", "supplier_name" "text", "sku_code" "text", "sku_name" "text", "unit" "text", "qty_received" numeric, "qty_rejected" numeric)
    LANGUAGE "sql" STABLE
    SET "search_path" TO 'public'
    AS $$
  SELECT
    li.id,
    sr.id,
    sr.receipt_datetime,
    sr.status::text,
    po.po_number,
    s.name,
    sk.sku_code,
    sk.name,
    sk.unit,
    li.qty_received,
    li.qty_rejected
  FROM sku_receivings sr
  JOIN sku_receiving_line_items li ON li.sku_receiving_id = sr.id
  JOIN purchase_orders po ON po.id = sr.purchase_order_id
  JOIN skus sk ON sk.id = li.sku_id
  LEFT JOIN suppliers s ON s.id = po.supplier_id
  ORDER BY sr.receipt_datetime DESC, sr.id DESC, sk.sku_code
  LIMIT least(greatest(coalesce(p_limit, 5), 1), 50);
$$;


ALTER FUNCTION "public"."get_recent_receiving_activity"("p_limit" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_sku_receiving_metrics"("p_day_start" timestamp with time zone, "p_month_start" timestamp with time zone) RETURNS TABLE("awaiting_receipt_count" integer, "received_today_qty" numeric, "variance_cases_mtd" integer, "received_value_mtd" numeric)
    LANGUAGE "sql" STABLE
    SET "search_path" TO 'public'
    AS $$
  SELECT
    -- POs still expecting goods (same statuses as the receiving PO lookup).
    (
      SELECT count(*)::int
      FROM purchase_orders
      WHERE status IN ('pending', 'partially_received', 'overdue')
    ),
    -- Accepted units received since the start of the user's day.
    (
      SELECT coalesce(sum(li.qty_received), 0)
      FROM sku_receiving_line_items li
      JOIN sku_receivings sr ON sr.id = li.sku_receiving_id
      WHERE sr.receipt_datetime >= p_day_start
    ),
    -- Receipts flagged for variance (rejects) this month.
    (
      SELECT count(*)::int
      FROM sku_receivings
      WHERE status = 'variance_flagged'
        AND receipt_datetime >= p_month_start
    ),
    -- Value of accepted goods this month at PO unit price (pre-tax).
    (
      SELECT coalesce(sum(li.qty_received * poi.unit_price), 0)
      FROM sku_receiving_line_items li
      JOIN sku_receivings sr ON sr.id = li.sku_receiving_id
      JOIN purchase_order_items poi ON poi.id = li.purchase_order_item_id
      WHERE sr.receipt_datetime >= p_month_start
    );
$$;


ALTER FUNCTION "public"."get_sku_receiving_metrics"("p_day_start" timestamp with time zone, "p_month_start" timestamp with time zone) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_supplier_performance_trends"("p_timezone" "text" DEFAULT 'UTC'::"text", "p_weeks" integer DEFAULT 8, "p_suppliers" integer DEFAULT 3) RETURNS TABLE("supplier_id" "uuid", "supplier_name" "text", "week_start" "date", "deliveries" integer, "on_time_deliveries" integer)
    LANGUAGE "plpgsql" STABLE
    SET "search_path" TO 'public'
    AS $$
#variable_conflict use_column
DECLARE
  v_timezone text := coalesce(p_timezone, 'UTC');
  v_weeks int := least(greatest(coalesce(p_weeks, 8), 1), 26);
  v_suppliers int := least(greatest(coalesce(p_suppliers, 3), 1), 5);
  v_today date;
  v_current_week date;
  v_window_start date;
BEGIN
  BEGIN
    v_today := (now() AT TIME ZONE v_timezone)::date;
  EXCEPTION WHEN invalid_parameter_value THEN
    v_timezone := 'UTC';
    v_today := (now() AT TIME ZONE 'UTC')::date;
  END;

  v_current_week := date_trunc('week', v_today)::date;
  v_window_start := v_current_week - (v_weeks - 1) * 7;

  RETURN QUERY
  WITH receipts AS (
    SELECT
      po.supplier_id,
      (sr.receipt_datetime AT TIME ZONE v_timezone)::date AS receipt_date,
      po.expected_delivery_date
    FROM sku_receivings sr
    JOIN purchase_orders po ON po.id = sr.purchase_order_id
    WHERE sr.receipt_datetime >= (v_window_start::timestamp AT TIME ZONE v_timezone)
      AND po.expected_delivery_date IS NOT NULL
  ),
  top_suppliers AS (
    SELECT r.supplier_id, count(*) AS receipt_count
    FROM receipts r
    GROUP BY r.supplier_id
    ORDER BY receipt_count DESC, r.supplier_id
    LIMIT v_suppliers
  ),
  weeks AS (
    SELECT generate_series(v_window_start, v_current_week, interval '7 days')::date AS week_start
  ),
  weekly AS (
    SELECT
      r.supplier_id,
      date_trunc('week', r.receipt_date)::date AS week_start,
      count(*)::int AS deliveries,
      count(*) FILTER (WHERE r.receipt_date <= r.expected_delivery_date)::int AS on_time
    FROM receipts r
    WHERE r.supplier_id IN (SELECT ts.supplier_id FROM top_suppliers ts)
    GROUP BY r.supplier_id, date_trunc('week', r.receipt_date)
  )
  SELECT
    ts.supplier_id,
    s.name,
    w.week_start,
    coalesce(wk.deliveries, 0),
    coalesce(wk.on_time, 0)
  FROM top_suppliers ts
  CROSS JOIN weeks w
  LEFT JOIN suppliers s ON s.id = ts.supplier_id
  LEFT JOIN weekly wk
    ON wk.supplier_id = ts.supplier_id AND wk.week_start = w.week_start
  ORDER BY ts.receipt_count DESC, ts.supplier_id, w.week_start;
END;
$$;


ALTER FUNCTION "public"."get_supplier_performance_trends"("p_timezone" "text", "p_weeks" integer, "p_suppliers" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_auth_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public', 'auth'
    AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    full_name,
    email,
    last_login_at,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      split_part(NEW.email, '@', 1),
      'User'
    ),
    NEW.email,
    NEW.last_sign_in_at,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE
    SET
      email = EXCLUDED.email,
      last_login_at = EXCLUDED.last_login_at,
      updated_at = NOW();

  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."handle_new_auth_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."set_inventory_stock_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."set_inventory_stock_updated_at"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."set_sku_receiving_line_item_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."set_sku_receiving_line_item_updated_at"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."set_sku_receiving_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."set_sku_receiving_updated_at"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."set_sku_suppliers_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."set_sku_suppliers_updated_at"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."sync_app_metadata_from_profile"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public', 'pg_temp'
    AS $$
BEGIN
  PERFORM public.sync_role_to_app_metadata(NEW.id);
  RETURN NULL;
END;
$$;


ALTER FUNCTION "public"."sync_app_metadata_from_profile"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."sync_app_metadata_from_user_roles"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public', 'pg_temp'
    AS $$
BEGIN
  IF TG_OP IN ('INSERT', 'UPDATE') THEN
    PERFORM public.sync_role_to_app_metadata(NEW.user_id);
  END IF;

  IF TG_OP = 'DELETE'
     OR (TG_OP = 'UPDATE' AND OLD.user_id IS DISTINCT FROM NEW.user_id) THEN
    PERFORM public.sync_role_to_app_metadata(OLD.user_id);
  END IF;

  RETURN NULL;
END;
$$;


ALTER FUNCTION "public"."sync_app_metadata_from_user_roles"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."sync_password_changed_at_from_auth"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public', 'auth'
    AS $$
BEGIN
  IF (OLD.encrypted_password IS DISTINCT FROM NEW.encrypted_password) THEN
    UPDATE public.profiles
    SET
      password_changed_at = NOW(),
      updated_at = NOW()
    WHERE id = NEW.id;
  END IF;

  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."sync_password_changed_at_from_auth"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."sync_profile_from_auth_user_update"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public', 'auth'
    AS $$
BEGIN
  UPDATE public.profiles
  SET
    email = NEW.email,
    last_login_at = NEW.last_sign_in_at,
    updated_at = NOW()
  WHERE id = NEW.id;

  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."sync_profile_from_auth_user_update"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."sync_role_to_app_metadata"("p_user_id" "uuid") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public', 'pg_temp'
    AS $$
DECLARE
  v_role text;
BEGIN
  SELECT r.name
  INTO v_role
  FROM profiles p
  JOIN roles r ON r.id = p.primary_role_id
  WHERE p.id = p_user_id;

  -- Fallback for users without a primary role: their user_roles row.
  IF v_role IS NULL THEN
    SELECT r.name
    INTO v_role
    FROM user_roles ur
    JOIN roles r ON r.id = ur.role_id
    WHERE ur.user_id = p_user_id
    ORDER BY r.id
    LIMIT 1;
  END IF;

  UPDATE auth.users
  SET raw_app_meta_data = (coalesce(raw_app_meta_data, '{}'::jsonb)
      - 'roles' - 'primary_role')
    || jsonb_build_object('role', v_role)
  WHERE id = p_user_id;
END;
$$;


ALTER FUNCTION "public"."sync_role_to_app_metadata"("p_user_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."validate_sku_receiving_line_item_consistency"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
  v_receiving_purchase_order_id uuid;
  v_po_item_purchase_order_id uuid;
  v_po_item_sku_id uuid;
BEGIN
  SELECT sr.purchase_order_id
  INTO v_receiving_purchase_order_id
  FROM public.sku_receivings sr
  WHERE sr.id = NEW.sku_receiving_id;

  IF v_receiving_purchase_order_id IS NULL THEN
    RAISE EXCEPTION 'sku_receiving_id % does not exist', NEW.sku_receiving_id;
  END IF;

  SELECT poi.purchase_order_id, poi.sku_id
  INTO v_po_item_purchase_order_id, v_po_item_sku_id
  FROM public.purchase_order_items poi
  WHERE poi.id = NEW.purchase_order_item_id;

  IF v_po_item_purchase_order_id IS NULL THEN
    RAISE EXCEPTION 'purchase_order_item_id % does not exist', NEW.purchase_order_item_id;
  END IF;

  IF v_receiving_purchase_order_id <> v_po_item_purchase_order_id THEN
    RAISE EXCEPTION 'Line item purchase_order_item_id % does not belong to receiving header purchase_order_id', NEW.purchase_order_item_id;
  END IF;

  IF NEW.sku_id <> v_po_item_sku_id THEN
    RAISE EXCEPTION 'sku_id % does not match purchase_order_item.sku_id %', NEW.sku_id, v_po_item_sku_id;
  END IF;

  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."validate_sku_receiving_line_item_consistency"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."categories" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."categories" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."inventory_stock" (
    "sku_id" "uuid" NOT NULL,
    "on_hand_qty" numeric(12,2) DEFAULT 0 NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "stock_status" "text" GENERATED ALWAYS AS (
CASE
    WHEN ("on_hand_qty" <= (20)::numeric) THEN 'critical'::"text"
    WHEN ("on_hand_qty" <= (50)::numeric) THEN 'low'::"text"
    ELSE 'good'::"text"
END) STORED,
    CONSTRAINT "inventory_stock_on_hand_qty_check" CHECK (("on_hand_qty" >= (0)::numeric)),
    CONSTRAINT "inventory_stock_status_check" CHECK (("stock_status" = ANY (ARRAY['good'::"text", 'low'::"text", 'critical'::"text"])))
);


ALTER TABLE "public"."inventory_stock" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."invitations" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "email" "text" NOT NULL,
    "role_id" integer NOT NULL,
    "invited_by" "uuid",
    "sent_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "expires_at" timestamp with time zone,
    "status" "text" DEFAULT 'pending'::"text" NOT NULL,
    "accepted_by" "uuid",
    "accepted_at" timestamp with time zone
);


ALTER TABLE "public"."invitations" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL,
    "full_name" "text" NOT NULL,
    "avatar_url" "text",
    "is_active" boolean DEFAULT true,
    "password_changed_at" timestamp with time zone,
    "last_login_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "email" "text" NOT NULL,
    "primary_role_id" integer
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."purchase_order_items" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "purchase_order_id" "uuid" NOT NULL,
    "sku_id" "uuid" NOT NULL,
    "ordered_qty" numeric(12,2) NOT NULL,
    "received_qty" numeric(12,2) DEFAULT 0 NOT NULL,
    "unit_price" numeric(14,2) NOT NULL,
    "line_total" numeric(14,2) GENERATED ALWAYS AS (("ordered_qty" * "unit_price")) STORED,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "purchase_order_items_ordered_qty_check" CHECK (("ordered_qty" > (0)::numeric)),
    CONSTRAINT "purchase_order_items_received_qty_check" CHECK (("received_qty" >= (0)::numeric)),
    CONSTRAINT "purchase_order_items_unit_price_check" CHECK (("unit_price" >= (0)::numeric))
);


ALTER TABLE "public"."purchase_order_items" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."purchase_orders" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "po_number" "text" NOT NULL,
    "supplier_id" "uuid" NOT NULL,
    "created_by" "uuid" NOT NULL,
    "approved_by" "uuid",
    "status" "public"."purchase_order_status" DEFAULT 'draft'::"public"."purchase_order_status" NOT NULL,
    "order_date" "date" DEFAULT CURRENT_DATE NOT NULL,
    "expected_delivery_date" "date",
    "sent_at" timestamp with time zone,
    "currency" "text" DEFAULT 'USD'::"text" NOT NULL,
    "subtotal" numeric(14,2) DEFAULT 0 NOT NULL,
    "tax_amount" numeric(14,2) DEFAULT 0 NOT NULL,
    "total_amount" numeric(14,2) DEFAULT 0 NOT NULL,
    "notes" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "payment_method" "public"."purchase_order_payment_method" DEFAULT 'cod'::"public"."purchase_order_payment_method" NOT NULL
);


ALTER TABLE "public"."purchase_orders" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."roles" (
    "id" integer NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."roles" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."roles_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."roles_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."roles_id_seq" OWNED BY "public"."roles"."id";



CREATE TABLE IF NOT EXISTS "public"."sku_receiving_line_items" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "sku_receiving_id" "uuid" NOT NULL,
    "purchase_order_item_id" "uuid" NOT NULL,
    "sku_id" "uuid" NOT NULL,
    "qty_received" numeric(12,2) DEFAULT 0 NOT NULL,
    "qty_rejected" numeric(12,2) DEFAULT 0 NOT NULL,
    "variance_reason" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "qty_expected" numeric(12,2) NOT NULL,
    CONSTRAINT "sku_receiving_line_items_qty_expected_check" CHECK (("qty_expected" >= (0)::numeric)),
    CONSTRAINT "sku_receiving_line_items_qty_received_check" CHECK (("qty_received" >= (0)::numeric)),
    CONSTRAINT "sku_receiving_line_items_qty_rejected_check" CHECK (("qty_rejected" >= (0)::numeric))
);


ALTER TABLE "public"."sku_receiving_line_items" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."sku_receivings" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "purchase_order_id" "uuid" NOT NULL,
    "receipt_datetime" timestamp with time zone DEFAULT "now"() NOT NULL,
    "delivery_note_number" "text",
    "received_by" "uuid" NOT NULL,
    "receiving_location" "text" NOT NULL,
    "vehicle_ref" "text",
    "status" "public"."sku_receiving_status" DEFAULT 'pending'::"public"."sku_receiving_status" NOT NULL,
    "notes" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."sku_receivings" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."sku_receivings_list" AS
SELECT
    NULL::"uuid" AS "id",
    NULL::"uuid" AS "purchase_order_id",
    NULL::"text" AS "po_number",
    NULL::"uuid" AS "supplier_id",
    NULL::"text" AS "supplier_name",
    NULL::timestamp with time zone AS "receipt_datetime",
    NULL::"text" AS "receiving_location",
    NULL::"public"."sku_receiving_status" AS "status",
    NULL::timestamp with time zone AS "created_at",
    NULL::integer AS "sku_count",
    NULL::numeric AS "qty_ordered",
    NULL::numeric AS "qty_received",
    NULL::numeric AS "qty_rejected",
    NULL::numeric AS "qty_expected";


ALTER VIEW "public"."sku_receivings_list" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."sku_suppliers" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "sku_id" "uuid" NOT NULL,
    "supplier_id" "uuid" NOT NULL,
    "is_primary" boolean DEFAULT false NOT NULL,
    "supplier_sku_code" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "created_by" "uuid"
);


ALTER TABLE "public"."sku_suppliers" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."skus" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "sku_code" "text" NOT NULL,
    "name" "text" NOT NULL,
    "unit" "text",
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "standard_unit_price" numeric(14,2) DEFAULT 0 NOT NULL,
    "category_id" "uuid",
    CONSTRAINT "skus_standard_unit_price_non_negative" CHECK (("standard_unit_price" >= (0)::numeric))
);


ALTER TABLE "public"."skus" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."suppliers" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "category" "text",
    "status" "text" DEFAULT 'active'::"text",
    "primary_contact_name" "text",
    "primary_contact_email" "text",
    "primary_contact_phone" "text",
    "payment_terms" "text",
    "min_order_qty" integer,
    "lead_time_days" integer,
    "notes" "text",
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."suppliers" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_roles" (
    "user_id" "uuid" NOT NULL,
    "role_id" integer NOT NULL,
    "assigned_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."user_roles" OWNER TO "postgres";


ALTER TABLE ONLY "public"."roles" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."roles_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."categories"
    ADD CONSTRAINT "categories_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."categories"
    ADD CONSTRAINT "categories_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."inventory_stock"
    ADD CONSTRAINT "inventory_stock_pkey" PRIMARY KEY ("sku_id");



ALTER TABLE ONLY "public"."invitations"
    ADD CONSTRAINT "invitations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_email_key" UNIQUE ("email");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."purchase_order_items"
    ADD CONSTRAINT "purchase_order_items_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."purchase_order_items"
    ADD CONSTRAINT "purchase_order_items_unique_po_sku" UNIQUE ("purchase_order_id", "sku_id");



ALTER TABLE ONLY "public"."purchase_orders"
    ADD CONSTRAINT "purchase_orders_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."purchase_orders"
    ADD CONSTRAINT "purchase_orders_po_number_key" UNIQUE ("po_number");



ALTER TABLE ONLY "public"."roles"
    ADD CONSTRAINT "roles_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."roles"
    ADD CONSTRAINT "roles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."sku_receiving_line_items"
    ADD CONSTRAINT "sku_receiving_line_items_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."sku_receiving_line_items"
    ADD CONSTRAINT "sku_receiving_line_items_unique_receiving_po_item" UNIQUE ("sku_receiving_id", "purchase_order_item_id");



ALTER TABLE ONLY "public"."sku_receivings"
    ADD CONSTRAINT "sku_receivings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."sku_suppliers"
    ADD CONSTRAINT "sku_suppliers_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."sku_suppliers"
    ADD CONSTRAINT "sku_suppliers_unique_sku_supplier" UNIQUE ("sku_id", "supplier_id");



ALTER TABLE ONLY "public"."skus"
    ADD CONSTRAINT "skus_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."skus"
    ADD CONSTRAINT "skus_sku_code_key" UNIQUE ("sku_code");



ALTER TABLE ONLY "public"."suppliers"
    ADD CONSTRAINT "suppliers_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_roles"
    ADD CONSTRAINT "user_roles_pk" PRIMARY KEY ("user_id", "role_id");



CREATE UNIQUE INDEX "categories_name_normalized_unique" ON "public"."categories" USING "btree" ("lower"(TRIM(BOTH FROM "name")));



CREATE INDEX "idx_inventory_stock_stock_status" ON "public"."inventory_stock" USING "btree" ("stock_status");



CREATE INDEX "inventory_stock_updated_at_idx" ON "public"."inventory_stock" USING "btree" ("updated_at" DESC);



CREATE INDEX "profiles_primary_role_id_idx" ON "public"."profiles" USING "btree" ("primary_role_id");



CREATE INDEX "purchase_order_items_po_id_idx" ON "public"."purchase_order_items" USING "btree" ("purchase_order_id");



CREATE INDEX "purchase_order_items_sku_id_idx" ON "public"."purchase_order_items" USING "btree" ("sku_id");



CREATE INDEX "purchase_orders_created_by_idx" ON "public"."purchase_orders" USING "btree" ("created_by");



CREATE INDEX "purchase_orders_order_date_idx" ON "public"."purchase_orders" USING "btree" ("order_date" DESC);



CREATE INDEX "purchase_orders_status_idx" ON "public"."purchase_orders" USING "btree" ("status");



CREATE INDEX "purchase_orders_supplier_id_idx" ON "public"."purchase_orders" USING "btree" ("supplier_id");



CREATE INDEX "sku_receiving_line_items_po_item_id_idx" ON "public"."sku_receiving_line_items" USING "btree" ("purchase_order_item_id");



CREATE INDEX "sku_receiving_line_items_receiving_id_idx" ON "public"."sku_receiving_line_items" USING "btree" ("sku_receiving_id");



CREATE INDEX "sku_receiving_line_items_sku_id_idx" ON "public"."sku_receiving_line_items" USING "btree" ("sku_id");



CREATE INDEX "sku_receivings_purchase_order_id_idx" ON "public"."sku_receivings" USING "btree" ("purchase_order_id");



CREATE INDEX "sku_receivings_receipt_datetime_idx" ON "public"."sku_receivings" USING "btree" ("receipt_datetime" DESC);



CREATE INDEX "sku_receivings_received_by_idx" ON "public"."sku_receivings" USING "btree" ("received_by");



CREATE INDEX "sku_receivings_status_idx" ON "public"."sku_receivings" USING "btree" ("status");



CREATE UNIQUE INDEX "sku_suppliers_one_primary_per_sku_idx" ON "public"."sku_suppliers" USING "btree" ("sku_id") WHERE ("is_primary" = true);



CREATE INDEX "sku_suppliers_sku_id_idx" ON "public"."sku_suppliers" USING "btree" ("sku_id");



CREATE INDEX "sku_suppliers_supplier_id_idx" ON "public"."sku_suppliers" USING "btree" ("supplier_id");



CREATE INDEX "skus_created_by_idx" ON "public"."skus" USING "btree" ("created_by");



CREATE INDEX "skus_name_idx" ON "public"."skus" USING "btree" ("name");



CREATE INDEX "suppliers_created_by_idx" ON "public"."suppliers" USING "btree" ("created_by");



CREATE INDEX "suppliers_name_idx" ON "public"."suppliers" USING "btree" ("name");



CREATE OR REPLACE VIEW "public"."sku_receivings_list" WITH ("security_invoker"='true') AS
 SELECT "sr"."id",
    "sr"."purchase_order_id",
    "po"."po_number",
    "po"."supplier_id",
    "s"."name" AS "supplier_name",
    "sr"."receipt_datetime",
    "sr"."receiving_location",
    "sr"."status",
    "sr"."created_at",
    ("count"("li"."id"))::integer AS "sku_count",
    COALESCE("sum"("poi"."ordered_qty"), (0)::numeric) AS "qty_ordered",
    COALESCE("sum"("li"."qty_received"), (0)::numeric) AS "qty_received",
    COALESCE("sum"("li"."qty_rejected"), (0)::numeric) AS "qty_rejected",
    COALESCE("sum"("li"."qty_expected"), (0)::numeric) AS "qty_expected"
   FROM (((("public"."sku_receivings" "sr"
     JOIN "public"."purchase_orders" "po" ON (("po"."id" = "sr"."purchase_order_id")))
     LEFT JOIN "public"."suppliers" "s" ON (("s"."id" = "po"."supplier_id")))
     LEFT JOIN "public"."sku_receiving_line_items" "li" ON (("li"."sku_receiving_id" = "sr"."id")))
     LEFT JOIN "public"."purchase_order_items" "poi" ON (("poi"."id" = "li"."purchase_order_item_id")))
  GROUP BY "sr"."id", "po"."id", "s"."id";



CREATE OR REPLACE TRIGGER "inventory_stock_set_updated_at" BEFORE UPDATE ON "public"."inventory_stock" FOR EACH ROW EXECUTE FUNCTION "public"."set_inventory_stock_updated_at"();



CREATE OR REPLACE TRIGGER "profiles_sync_app_metadata" AFTER INSERT OR UPDATE OF "primary_role_id" ON "public"."profiles" FOR EACH ROW EXECUTE FUNCTION "public"."sync_app_metadata_from_profile"();



CREATE OR REPLACE TRIGGER "sku_receiving_line_items_set_updated_at" BEFORE UPDATE ON "public"."sku_receiving_line_items" FOR EACH ROW EXECUTE FUNCTION "public"."set_sku_receiving_line_item_updated_at"();



CREATE OR REPLACE TRIGGER "sku_receiving_line_items_validate_consistency" BEFORE INSERT OR UPDATE ON "public"."sku_receiving_line_items" FOR EACH ROW EXECUTE FUNCTION "public"."validate_sku_receiving_line_item_consistency"();



CREATE OR REPLACE TRIGGER "sku_receivings_set_updated_at" BEFORE UPDATE ON "public"."sku_receivings" FOR EACH ROW EXECUTE FUNCTION "public"."set_sku_receiving_updated_at"();



CREATE OR REPLACE TRIGGER "sku_suppliers_set_updated_at" BEFORE UPDATE ON "public"."sku_suppliers" FOR EACH ROW EXECUTE FUNCTION "public"."set_sku_suppliers_updated_at"();



CREATE OR REPLACE TRIGGER "skus_create_inventory_stock" AFTER INSERT ON "public"."skus" FOR EACH ROW EXECUTE FUNCTION "public"."create_inventory_stock_for_new_sku"();



CREATE OR REPLACE TRIGGER "user_roles_sync_app_metadata" AFTER INSERT OR DELETE OR UPDATE ON "public"."user_roles" FOR EACH ROW EXECUTE FUNCTION "public"."sync_app_metadata_from_user_roles"();



ALTER TABLE ONLY "public"."categories"
    ADD CONSTRAINT "categories_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."profiles"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."user_roles"
    ADD CONSTRAINT "fk_role" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_roles"
    ADD CONSTRAINT "fk_user" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."inventory_stock"
    ADD CONSTRAINT "inventory_stock_sku_id_fkey" FOREIGN KEY ("sku_id") REFERENCES "public"."skus"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."invitations"
    ADD CONSTRAINT "invitations_accepted_by_fkey" FOREIGN KEY ("accepted_by") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."invitations"
    ADD CONSTRAINT "invitations_invited_by_fkey" FOREIGN KEY ("invited_by") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."invitations"
    ADD CONSTRAINT "invitations_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_primary_role_id_fkey" FOREIGN KEY ("primary_role_id") REFERENCES "public"."roles"("id");



ALTER TABLE ONLY "public"."purchase_order_items"
    ADD CONSTRAINT "purchase_order_items_purchase_order_id_fkey" FOREIGN KEY ("purchase_order_id") REFERENCES "public"."purchase_orders"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."purchase_order_items"
    ADD CONSTRAINT "purchase_order_items_sku_id_fkey" FOREIGN KEY ("sku_id") REFERENCES "public"."skus"("id") ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."purchase_orders"
    ADD CONSTRAINT "purchase_orders_approved_by_fkey" FOREIGN KEY ("approved_by") REFERENCES "public"."profiles"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."purchase_orders"
    ADD CONSTRAINT "purchase_orders_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."profiles"("id") ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."purchase_orders"
    ADD CONSTRAINT "purchase_orders_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "public"."suppliers"("id") ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."sku_receiving_line_items"
    ADD CONSTRAINT "sku_receiving_line_items_purchase_order_item_id_fkey" FOREIGN KEY ("purchase_order_item_id") REFERENCES "public"."purchase_order_items"("id") ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."sku_receiving_line_items"
    ADD CONSTRAINT "sku_receiving_line_items_sku_id_fkey" FOREIGN KEY ("sku_id") REFERENCES "public"."skus"("id") ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."sku_receiving_line_items"
    ADD CONSTRAINT "sku_receiving_line_items_sku_receiving_id_fkey" FOREIGN KEY ("sku_receiving_id") REFERENCES "public"."sku_receivings"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."sku_receivings"
    ADD CONSTRAINT "sku_receivings_purchase_order_id_fkey" FOREIGN KEY ("purchase_order_id") REFERENCES "public"."purchase_orders"("id") ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."sku_receivings"
    ADD CONSTRAINT "sku_receivings_received_by_fkey" FOREIGN KEY ("received_by") REFERENCES "public"."profiles"("id") ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."sku_suppliers"
    ADD CONSTRAINT "sku_suppliers_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."sku_suppliers"
    ADD CONSTRAINT "sku_suppliers_sku_id_fkey" FOREIGN KEY ("sku_id") REFERENCES "public"."skus"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."sku_suppliers"
    ADD CONSTRAINT "sku_suppliers_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "public"."suppliers"("id") ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."skus"
    ADD CONSTRAINT "skus_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."skus"
    ADD CONSTRAINT "skus_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."profiles"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."suppliers"
    ADD CONSTRAINT "suppliers_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."profiles"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."user_roles"
    ADD CONSTRAINT "user_roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_roles"
    ADD CONSTRAINT "user_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



CREATE POLICY "All users can read roles" ON "public"."roles" FOR SELECT USING (true);



CREATE POLICY "Allow all select" ON "public"."categories" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Allow super_admin delete" ON "public"."categories" FOR DELETE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."profiles" "p"
  WHERE (("p"."id" = "auth"."uid"()) AND ("p"."primary_role_id" = 1)))));



CREATE POLICY "Allow super_admin insert" ON "public"."categories" FOR INSERT TO "authenticated" WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."profiles" "p"
  WHERE (("p"."id" = "auth"."uid"()) AND ("p"."primary_role_id" = 1)))));



CREATE POLICY "Allow super_admin update" ON "public"."categories" FOR UPDATE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."profiles" "p"
  WHERE (("p"."id" = "auth"."uid"()) AND ("p"."primary_role_id" = 1)))));



CREATE POLICY "Service role can insert profiles" ON "public"."profiles" FOR INSERT TO "service_role" WITH CHECK (true);



CREATE POLICY "Service role can insert user_roles" ON "public"."user_roles" FOR INSERT TO "service_role" WITH CHECK (true);



CREATE POLICY "Users can read own profile" ON "public"."profiles" FOR SELECT USING (("id" = "auth"."uid"()));



CREATE POLICY "Users can read own roles" ON "public"."user_roles" FOR SELECT USING (("user_id" = "auth"."uid"()));



ALTER TABLE "public"."categories" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."inventory_stock" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "inventory_stock_delete_super_admin" ON "public"."inventory_stock" FOR DELETE TO "authenticated" USING ("public"."current_user_has_any_role"(ARRAY['super_admin'::"text"]));



CREATE POLICY "inventory_stock_insert_ops_roles" ON "public"."inventory_stock" FOR INSERT TO "authenticated" WITH CHECK ("public"."current_user_has_any_role"(ARRAY['super_admin'::"text", 'operations_manager'::"text"]));



CREATE POLICY "inventory_stock_select_ops_roles" ON "public"."inventory_stock" FOR SELECT TO "authenticated" USING ("public"."current_user_has_any_role"(ARRAY['super_admin'::"text", 'operations_manager'::"text"]));



CREATE POLICY "inventory_stock_update_ops_roles" ON "public"."inventory_stock" FOR UPDATE TO "authenticated" USING ("public"."current_user_has_any_role"(ARRAY['super_admin'::"text", 'operations_manager'::"text"])) WITH CHECK ("public"."current_user_has_any_role"(ARRAY['super_admin'::"text", 'operations_manager'::"text"]));



ALTER TABLE "public"."invitations" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."purchase_order_items" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "purchase_order_items_delete_ops_admin" ON "public"."purchase_order_items" FOR DELETE TO "authenticated" USING (((EXISTS ( SELECT 1
   FROM "public"."purchase_orders" "po"
  WHERE (("po"."id" = "purchase_order_items"."purchase_order_id") AND ("po"."created_by" = "auth"."uid"())))) AND "public"."current_user_has_any_role"(ARRAY['super_admin'::"text", 'operations_manager'::"text"])));



CREATE POLICY "purchase_order_items_insert_ops_admin" ON "public"."purchase_order_items" FOR INSERT TO "authenticated" WITH CHECK (((EXISTS ( SELECT 1
   FROM "public"."purchase_orders" "po"
  WHERE (("po"."id" = "purchase_order_items"."purchase_order_id") AND ("po"."created_by" = "auth"."uid"())))) AND "public"."current_user_has_any_role"(ARRAY['super_admin'::"text", 'operations_manager'::"text"])));



CREATE POLICY "purchase_order_items_select_by_role" ON "public"."purchase_order_items" FOR SELECT TO "authenticated" USING ("public"."current_user_has_any_role"(ARRAY['super_admin'::"text", 'operations_manager'::"text", 'store_keeper'::"text"]));



CREATE POLICY "purchase_order_items_update_ops_admin" ON "public"."purchase_order_items" FOR UPDATE TO "authenticated" USING (((EXISTS ( SELECT 1
   FROM "public"."purchase_orders" "po"
  WHERE (("po"."id" = "purchase_order_items"."purchase_order_id") AND ("po"."created_by" = "auth"."uid"())))) AND "public"."current_user_has_any_role"(ARRAY['super_admin'::"text", 'operations_manager'::"text"]))) WITH CHECK (((EXISTS ( SELECT 1
   FROM "public"."purchase_orders" "po"
  WHERE (("po"."id" = "purchase_order_items"."purchase_order_id") AND ("po"."created_by" = "auth"."uid"())))) AND "public"."current_user_has_any_role"(ARRAY['super_admin'::"text", 'operations_manager'::"text"])));



ALTER TABLE "public"."purchase_orders" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "purchase_orders_insert_ops_admin" ON "public"."purchase_orders" FOR INSERT TO "authenticated" WITH CHECK ((("created_by" = "auth"."uid"()) AND "public"."current_user_has_any_role"(ARRAY['super_admin'::"text", 'operations_manager'::"text"])));



CREATE POLICY "purchase_orders_select_by_role" ON "public"."purchase_orders" FOR SELECT TO "authenticated" USING ("public"."current_user_has_any_role"(ARRAY['super_admin'::"text", 'operations_manager'::"text", 'store_keeper'::"text"]));



CREATE POLICY "purchase_orders_update_ops_admin" ON "public"."purchase_orders" FOR UPDATE TO "authenticated" USING (((("created_by" = "auth"."uid"()) AND "public"."current_user_has_any_role"(ARRAY['operations_manager'::"text", 'super_admin'::"text"])) OR "public"."current_user_has_any_role"(ARRAY['super_admin'::"text"]))) WITH CHECK (((("created_by" = "auth"."uid"()) AND "public"."current_user_has_any_role"(ARRAY['operations_manager'::"text", 'super_admin'::"text"])) OR "public"."current_user_has_any_role"(ARRAY['super_admin'::"text"])));



ALTER TABLE "public"."roles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."sku_receiving_line_items" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "sku_receiving_line_items_delete_super_admin" ON "public"."sku_receiving_line_items" FOR DELETE TO "authenticated" USING ("public"."current_user_has_any_role"(ARRAY['super_admin'::"text"]));



CREATE POLICY "sku_receiving_line_items_insert_ops_roles" ON "public"."sku_receiving_line_items" FOR INSERT TO "authenticated" WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."sku_receivings" "sr"
  WHERE (("sr"."id" = "sku_receiving_line_items"."sku_receiving_id") AND ("public"."current_user_has_any_role"(ARRAY['super_admin'::"text", 'operations_manager'::"text"]) OR ("public"."current_user_has_any_role"(ARRAY['store_keeper'::"text"]) AND ("sr"."received_by" = "auth"."uid"()) AND ("sr"."status" = ANY (ARRAY['pending'::"public"."sku_receiving_status", 'in_progress'::"public"."sku_receiving_status", 'partially_received'::"public"."sku_receiving_status"]))))))));



CREATE POLICY "sku_receiving_line_items_select_ops_roles" ON "public"."sku_receiving_line_items" FOR SELECT TO "authenticated" USING ("public"."current_user_has_any_role"(ARRAY['super_admin'::"text", 'operations_manager'::"text", 'store_keeper'::"text"]));



CREATE POLICY "sku_receiving_line_items_update_ops_roles" ON "public"."sku_receiving_line_items" FOR UPDATE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."sku_receivings" "sr"
  WHERE (("sr"."id" = "sku_receiving_line_items"."sku_receiving_id") AND ("public"."current_user_has_any_role"(ARRAY['super_admin'::"text", 'operations_manager'::"text"]) OR ("public"."current_user_has_any_role"(ARRAY['store_keeper'::"text"]) AND ("sr"."received_by" = "auth"."uid"()) AND ("sr"."status" = ANY (ARRAY['pending'::"public"."sku_receiving_status", 'in_progress'::"public"."sku_receiving_status", 'partially_received'::"public"."sku_receiving_status"])))))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."sku_receivings" "sr"
  WHERE (("sr"."id" = "sku_receiving_line_items"."sku_receiving_id") AND ("public"."current_user_has_any_role"(ARRAY['super_admin'::"text", 'operations_manager'::"text"]) OR ("public"."current_user_has_any_role"(ARRAY['store_keeper'::"text"]) AND ("sr"."received_by" = "auth"."uid"()) AND ("sr"."status" = ANY (ARRAY['pending'::"public"."sku_receiving_status", 'in_progress'::"public"."sku_receiving_status", 'partially_received'::"public"."sku_receiving_status"]))))))));



ALTER TABLE "public"."sku_receivings" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "sku_receivings_delete_super_admin" ON "public"."sku_receivings" FOR DELETE TO "authenticated" USING ("public"."current_user_has_any_role"(ARRAY['super_admin'::"text"]));



CREATE POLICY "sku_receivings_insert_ops_roles" ON "public"."sku_receivings" FOR INSERT TO "authenticated" WITH CHECK ((("received_by" = "auth"."uid"()) AND "public"."current_user_has_any_role"(ARRAY['super_admin'::"text", 'operations_manager'::"text", 'store_keeper'::"text"])));



CREATE POLICY "sku_receivings_select_ops_roles" ON "public"."sku_receivings" FOR SELECT TO "authenticated" USING ("public"."current_user_has_any_role"(ARRAY['super_admin'::"text", 'operations_manager'::"text", 'store_keeper'::"text"]));



CREATE POLICY "sku_receivings_update_ops_roles" ON "public"."sku_receivings" FOR UPDATE TO "authenticated" USING (("public"."current_user_has_any_role"(ARRAY['super_admin'::"text", 'operations_manager'::"text"]) OR ("public"."current_user_has_any_role"(ARRAY['store_keeper'::"text"]) AND ("received_by" = "auth"."uid"()) AND ("status" = ANY (ARRAY['pending'::"public"."sku_receiving_status", 'in_progress'::"public"."sku_receiving_status", 'partially_received'::"public"."sku_receiving_status"]))))) WITH CHECK (("public"."current_user_has_any_role"(ARRAY['super_admin'::"text", 'operations_manager'::"text"]) OR ("public"."current_user_has_any_role"(ARRAY['store_keeper'::"text"]) AND ("received_by" = "auth"."uid"()) AND ("status" = ANY (ARRAY['pending'::"public"."sku_receiving_status", 'in_progress'::"public"."sku_receiving_status", 'partially_received'::"public"."sku_receiving_status"])))));



ALTER TABLE "public"."sku_suppliers" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "sku_suppliers_delete_super_admin" ON "public"."sku_suppliers" FOR DELETE TO "authenticated" USING ("public"."current_user_has_any_role"(ARRAY['super_admin'::"text"]));



CREATE POLICY "sku_suppliers_insert_ops_admin" ON "public"."sku_suppliers" FOR INSERT TO "authenticated" WITH CHECK ("public"."current_user_has_any_role"(ARRAY['super_admin'::"text", 'operations_manager'::"text"]));



CREATE POLICY "sku_suppliers_select_ops_roles" ON "public"."sku_suppliers" FOR SELECT TO "authenticated" USING ("public"."current_user_has_any_role"(ARRAY['super_admin'::"text", 'operations_manager'::"text", 'store_keeper'::"text"]));



CREATE POLICY "sku_suppliers_update_ops_admin" ON "public"."sku_suppliers" FOR UPDATE TO "authenticated" USING ("public"."current_user_has_any_role"(ARRAY['super_admin'::"text", 'operations_manager'::"text"])) WITH CHECK ("public"."current_user_has_any_role"(ARRAY['super_admin'::"text", 'operations_manager'::"text"]));



ALTER TABLE "public"."skus" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "skus_delete_super_admin" ON "public"."skus" FOR DELETE TO "authenticated" USING ("public"."current_user_has_any_role"(ARRAY['super_admin'::"text"]));



CREATE POLICY "skus_insert_ops_admin" ON "public"."skus" FOR INSERT TO "authenticated" WITH CHECK ("public"."current_user_has_any_role"(ARRAY['super_admin'::"text", 'operations_manager'::"text"]));



CREATE POLICY "skus_select_authenticated" ON "public"."skus" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "skus_update_ops_admin" ON "public"."skus" FOR UPDATE TO "authenticated" USING ("public"."current_user_has_any_role"(ARRAY['super_admin'::"text", 'operations_manager'::"text"])) WITH CHECK ("public"."current_user_has_any_role"(ARRAY['super_admin'::"text", 'operations_manager'::"text"]));



ALTER TABLE "public"."suppliers" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "suppliers_insert" ON "public"."suppliers" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "created_by"));



CREATE POLICY "suppliers_select" ON "public"."suppliers" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "suppliers_update" ON "public"."suppliers" FOR UPDATE TO "authenticated" USING ((("auth"."uid"() = "created_by") OR (EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."primary_role_id" = ANY (ARRAY[1, 2]))))))) WITH CHECK ((("auth"."uid"() = "created_by") OR (EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."primary_role_id" = ANY (ARRAY[1, 2])))))));



ALTER TABLE "public"."user_roles" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";






GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

























































































































































GRANT ALL ON FUNCTION "public"."add_inventory_item_transaction"("p_sku_code" "text", "p_name" "text", "p_unit" "text", "p_category_id" "uuid", "p_unit_price" numeric, "p_supplier_id" "uuid", "p_initial_stock" numeric, "p_user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."add_inventory_item_transaction"("p_sku_code" "text", "p_name" "text", "p_unit" "text", "p_category_id" "uuid", "p_unit_price" numeric, "p_supplier_id" "uuid", "p_initial_stock" numeric, "p_user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."add_inventory_item_transaction"("p_sku_code" "text", "p_name" "text", "p_unit" "text", "p_category_id" "uuid", "p_unit_price" numeric, "p_supplier_id" "uuid", "p_initial_stock" numeric, "p_user_id" "uuid") TO "service_role";



REVOKE ALL ON FUNCTION "public"."confirm_sku_receiving"("p_purchase_order_id" "uuid", "p_receipt_datetime" timestamp with time zone, "p_receiving_location" "text", "p_line_items" "jsonb", "p_delivery_note_number" "text", "p_vehicle_ref" "text", "p_notes" "text") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."confirm_sku_receiving"("p_purchase_order_id" "uuid", "p_receipt_datetime" timestamp with time zone, "p_receiving_location" "text", "p_line_items" "jsonb", "p_delivery_note_number" "text", "p_vehicle_ref" "text", "p_notes" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."confirm_sku_receiving"("p_purchase_order_id" "uuid", "p_receipt_datetime" timestamp with time zone, "p_receiving_location" "text", "p_line_items" "jsonb", "p_delivery_note_number" "text", "p_vehicle_ref" "text", "p_notes" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."create_inventory_stock_for_new_sku"() TO "anon";
GRANT ALL ON FUNCTION "public"."create_inventory_stock_for_new_sku"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_inventory_stock_for_new_sku"() TO "service_role";



REVOKE ALL ON FUNCTION "public"."current_user_has_any_role"("role_names" "text"[]) FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."current_user_has_any_role"("role_names" "text"[]) TO "anon";
GRANT ALL ON FUNCTION "public"."current_user_has_any_role"("role_names" "text"[]) TO "authenticated";
GRANT ALL ON FUNCTION "public"."current_user_has_any_role"("role_names" "text"[]) TO "service_role";



REVOKE ALL ON FUNCTION "public"."get_dashboard_metrics"("p_timezone" "text") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."get_dashboard_metrics"("p_timezone" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_dashboard_metrics"("p_timezone" "text") TO "service_role";



REVOKE ALL ON FUNCTION "public"."get_recent_receiving_activity"("p_limit" integer) FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."get_recent_receiving_activity"("p_limit" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_recent_receiving_activity"("p_limit" integer) TO "service_role";



REVOKE ALL ON FUNCTION "public"."get_sku_receiving_metrics"("p_day_start" timestamp with time zone, "p_month_start" timestamp with time zone) FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."get_sku_receiving_metrics"("p_day_start" timestamp with time zone, "p_month_start" timestamp with time zone) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_sku_receiving_metrics"("p_day_start" timestamp with time zone, "p_month_start" timestamp with time zone) TO "service_role";



REVOKE ALL ON FUNCTION "public"."get_supplier_performance_trends"("p_timezone" "text", "p_weeks" integer, "p_suppliers" integer) FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."get_supplier_performance_trends"("p_timezone" "text", "p_weeks" integer, "p_suppliers" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_supplier_performance_trends"("p_timezone" "text", "p_weeks" integer, "p_suppliers" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_auth_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_auth_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_auth_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."set_inventory_stock_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_inventory_stock_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_inventory_stock_updated_at"() TO "service_role";



GRANT ALL ON FUNCTION "public"."set_sku_receiving_line_item_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_sku_receiving_line_item_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_sku_receiving_line_item_updated_at"() TO "service_role";



GRANT ALL ON FUNCTION "public"."set_sku_receiving_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_sku_receiving_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_sku_receiving_updated_at"() TO "service_role";



GRANT ALL ON FUNCTION "public"."set_sku_suppliers_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_sku_suppliers_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_sku_suppliers_updated_at"() TO "service_role";



REVOKE ALL ON FUNCTION "public"."sync_app_metadata_from_profile"() FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."sync_app_metadata_from_profile"() TO "service_role";



REVOKE ALL ON FUNCTION "public"."sync_app_metadata_from_user_roles"() FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."sync_app_metadata_from_user_roles"() TO "service_role";



GRANT ALL ON FUNCTION "public"."sync_password_changed_at_from_auth"() TO "anon";
GRANT ALL ON FUNCTION "public"."sync_password_changed_at_from_auth"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."sync_password_changed_at_from_auth"() TO "service_role";



GRANT ALL ON FUNCTION "public"."sync_profile_from_auth_user_update"() TO "anon";
GRANT ALL ON FUNCTION "public"."sync_profile_from_auth_user_update"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."sync_profile_from_auth_user_update"() TO "service_role";



REVOKE ALL ON FUNCTION "public"."sync_role_to_app_metadata"("p_user_id" "uuid") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."sync_role_to_app_metadata"("p_user_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."validate_sku_receiving_line_item_consistency"() TO "anon";
GRANT ALL ON FUNCTION "public"."validate_sku_receiving_line_item_consistency"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."validate_sku_receiving_line_item_consistency"() TO "service_role";


















GRANT ALL ON TABLE "public"."categories" TO "anon";
GRANT ALL ON TABLE "public"."categories" TO "authenticated";
GRANT ALL ON TABLE "public"."categories" TO "service_role";



GRANT ALL ON TABLE "public"."inventory_stock" TO "anon";
GRANT ALL ON TABLE "public"."inventory_stock" TO "authenticated";
GRANT ALL ON TABLE "public"."inventory_stock" TO "service_role";



GRANT ALL ON TABLE "public"."invitations" TO "anon";
GRANT ALL ON TABLE "public"."invitations" TO "authenticated";
GRANT ALL ON TABLE "public"."invitations" TO "service_role";



GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";



GRANT ALL ON TABLE "public"."purchase_order_items" TO "anon";
GRANT ALL ON TABLE "public"."purchase_order_items" TO "authenticated";
GRANT ALL ON TABLE "public"."purchase_order_items" TO "service_role";



GRANT ALL ON TABLE "public"."purchase_orders" TO "anon";
GRANT ALL ON TABLE "public"."purchase_orders" TO "authenticated";
GRANT ALL ON TABLE "public"."purchase_orders" TO "service_role";



GRANT ALL ON TABLE "public"."roles" TO "anon";
GRANT ALL ON TABLE "public"."roles" TO "authenticated";
GRANT ALL ON TABLE "public"."roles" TO "service_role";



GRANT ALL ON SEQUENCE "public"."roles_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."roles_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."roles_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."sku_receiving_line_items" TO "anon";
GRANT ALL ON TABLE "public"."sku_receiving_line_items" TO "authenticated";
GRANT ALL ON TABLE "public"."sku_receiving_line_items" TO "service_role";



GRANT ALL ON TABLE "public"."sku_receivings" TO "anon";
GRANT ALL ON TABLE "public"."sku_receivings" TO "authenticated";
GRANT ALL ON TABLE "public"."sku_receivings" TO "service_role";



GRANT ALL ON TABLE "public"."sku_receivings_list" TO "authenticated";
GRANT ALL ON TABLE "public"."sku_receivings_list" TO "service_role";



GRANT ALL ON TABLE "public"."sku_suppliers" TO "anon";
GRANT ALL ON TABLE "public"."sku_suppliers" TO "authenticated";
GRANT ALL ON TABLE "public"."sku_suppliers" TO "service_role";



GRANT ALL ON TABLE "public"."skus" TO "anon";
GRANT ALL ON TABLE "public"."skus" TO "authenticated";
GRANT ALL ON TABLE "public"."skus" TO "service_role";



GRANT ALL ON TABLE "public"."suppliers" TO "anon";
GRANT ALL ON TABLE "public"."suppliers" TO "authenticated";
GRANT ALL ON TABLE "public"."suppliers" TO "service_role";



GRANT ALL ON TABLE "public"."user_roles" TO "anon";
GRANT ALL ON TABLE "public"."user_roles" TO "authenticated";
GRANT ALL ON TABLE "public"."user_roles" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";































