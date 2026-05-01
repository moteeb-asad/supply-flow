


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


CREATE OR REPLACE FUNCTION "public"."set_sku_suppliers_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."set_sku_suppliers_updated_at"() OWNER TO "postgres";


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

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."inventory_stock" (
    "sku_id" "uuid" NOT NULL,
    "on_hand_qty" numeric(12,2) DEFAULT 0 NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "inventory_stock_on_hand_qty_check" CHECK (("on_hand_qty" >= (0)::numeric))
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



CREATE TABLE IF NOT EXISTS "public"."sku_suppliers" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "sku_id" "uuid" NOT NULL,
    "supplier_id" "uuid" NOT NULL,
    "is_primary" boolean DEFAULT false NOT NULL,
    "supplier_sku_code" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
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
    "category" "text",
    "standard_unit_price" numeric(14,2) DEFAULT 0 NOT NULL,
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



CREATE INDEX "inventory_stock_updated_at_idx" ON "public"."inventory_stock" USING "btree" ("updated_at" DESC);



CREATE INDEX "profiles_primary_role_id_idx" ON "public"."profiles" USING "btree" ("primary_role_id");



CREATE INDEX "purchase_order_items_po_id_idx" ON "public"."purchase_order_items" USING "btree" ("purchase_order_id");



CREATE INDEX "purchase_order_items_sku_id_idx" ON "public"."purchase_order_items" USING "btree" ("sku_id");



CREATE INDEX "purchase_orders_created_by_idx" ON "public"."purchase_orders" USING "btree" ("created_by");



CREATE INDEX "purchase_orders_order_date_idx" ON "public"."purchase_orders" USING "btree" ("order_date" DESC);



CREATE INDEX "purchase_orders_status_idx" ON "public"."purchase_orders" USING "btree" ("status");



CREATE INDEX "purchase_orders_supplier_id_idx" ON "public"."purchase_orders" USING "btree" ("supplier_id");



CREATE UNIQUE INDEX "sku_suppliers_one_primary_per_sku_idx" ON "public"."sku_suppliers" USING "btree" ("sku_id") WHERE ("is_primary" = true);



CREATE INDEX "sku_suppliers_sku_id_idx" ON "public"."sku_suppliers" USING "btree" ("sku_id");



CREATE INDEX "sku_suppliers_supplier_id_idx" ON "public"."sku_suppliers" USING "btree" ("supplier_id");



CREATE INDEX "skus_category_idx" ON "public"."skus" USING "btree" ("category");



CREATE INDEX "skus_created_by_idx" ON "public"."skus" USING "btree" ("created_by");



CREATE INDEX "skus_name_idx" ON "public"."skus" USING "btree" ("name");



CREATE INDEX "suppliers_created_by_idx" ON "public"."suppliers" USING "btree" ("created_by");



CREATE INDEX "suppliers_name_idx" ON "public"."suppliers" USING "btree" ("name");



CREATE OR REPLACE TRIGGER "inventory_stock_set_updated_at" BEFORE UPDATE ON "public"."inventory_stock" FOR EACH ROW EXECUTE FUNCTION "public"."set_inventory_stock_updated_at"();



CREATE OR REPLACE TRIGGER "sku_suppliers_set_updated_at" BEFORE UPDATE ON "public"."sku_suppliers" FOR EACH ROW EXECUTE FUNCTION "public"."set_sku_suppliers_updated_at"();



CREATE OR REPLACE TRIGGER "skus_create_inventory_stock" AFTER INSERT ON "public"."skus" FOR EACH ROW EXECUTE FUNCTION "public"."create_inventory_stock_for_new_sku"();



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



ALTER TABLE ONLY "public"."sku_suppliers"
    ADD CONSTRAINT "sku_suppliers_sku_id_fkey" FOREIGN KEY ("sku_id") REFERENCES "public"."skus"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."sku_suppliers"
    ADD CONSTRAINT "sku_suppliers_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "public"."suppliers"("id") ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."skus"
    ADD CONSTRAINT "skus_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."profiles"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."suppliers"
    ADD CONSTRAINT "suppliers_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."profiles"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."user_roles"
    ADD CONSTRAINT "user_roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_roles"
    ADD CONSTRAINT "user_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



CREATE POLICY "All users can read roles" ON "public"."roles" FOR SELECT USING (true);



CREATE POLICY "Service role can insert profiles" ON "public"."profiles" FOR INSERT TO "service_role" WITH CHECK (true);



CREATE POLICY "Service role can insert user_roles" ON "public"."user_roles" FOR INSERT TO "service_role" WITH CHECK (true);



CREATE POLICY "Super admins can read all roles" ON "public"."roles" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM ("public"."user_roles" "ur"
     JOIN "public"."roles" "r" ON (("ur"."role_id" = "r"."id")))
  WHERE (("ur"."user_id" = "auth"."uid"()) AND ("r"."name" = 'super_admin'::"text")))));



CREATE POLICY "Users can read own profile" ON "public"."profiles" FOR SELECT USING (("id" = "auth"."uid"()));



CREATE POLICY "Users can read own roles" ON "public"."user_roles" FOR SELECT USING (("user_id" = "auth"."uid"()));



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


ALTER TABLE "public"."sku_suppliers" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "sku_suppliers_delete_super_admin" ON "public"."sku_suppliers" FOR DELETE TO "authenticated" USING ("public"."current_user_has_any_role"(ARRAY['super_admin'::"text"]));



CREATE POLICY "sku_suppliers_insert_ops_admin" ON "public"."sku_suppliers" FOR INSERT TO "authenticated" WITH CHECK ("public"."current_user_has_any_role"(ARRAY['super_admin'::"text", 'operations_manager'::"text"]));



CREATE POLICY "sku_suppliers_select_ops_roles" ON "public"."sku_suppliers" FOR SELECT TO "authenticated" USING ("public"."current_user_has_any_role"(ARRAY['super_admin'::"text", 'operations_manager'::"text", 'store_keeper'::"text"]));



CREATE POLICY "sku_suppliers_update_ops_admin" ON "public"."sku_suppliers" FOR UPDATE TO "authenticated" USING ("public"."current_user_has_any_role"(ARRAY['super_admin'::"text", 'operations_manager'::"text"])) WITH CHECK ("public"."current_user_has_any_role"(ARRAY['super_admin'::"text", 'operations_manager'::"text"]));



ALTER TABLE "public"."skus" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "skus_select_authenticated" ON "public"."skus" FOR SELECT TO "authenticated" USING (true);



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

























































































































































GRANT ALL ON FUNCTION "public"."create_inventory_stock_for_new_sku"() TO "anon";
GRANT ALL ON FUNCTION "public"."create_inventory_stock_for_new_sku"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_inventory_stock_for_new_sku"() TO "service_role";



REVOKE ALL ON FUNCTION "public"."current_user_has_any_role"("role_names" "text"[]) FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."current_user_has_any_role"("role_names" "text"[]) TO "anon";
GRANT ALL ON FUNCTION "public"."current_user_has_any_role"("role_names" "text"[]) TO "authenticated";
GRANT ALL ON FUNCTION "public"."current_user_has_any_role"("role_names" "text"[]) TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_auth_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_auth_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_auth_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."set_inventory_stock_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_inventory_stock_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_inventory_stock_updated_at"() TO "service_role";



GRANT ALL ON FUNCTION "public"."set_sku_suppliers_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_sku_suppliers_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_sku_suppliers_updated_at"() TO "service_role";



GRANT ALL ON FUNCTION "public"."sync_password_changed_at_from_auth"() TO "anon";
GRANT ALL ON FUNCTION "public"."sync_password_changed_at_from_auth"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."sync_password_changed_at_from_auth"() TO "service_role";



GRANT ALL ON FUNCTION "public"."sync_profile_from_auth_user_update"() TO "anon";
GRANT ALL ON FUNCTION "public"."sync_profile_from_auth_user_update"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."sync_profile_from_auth_user_update"() TO "service_role";


















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































