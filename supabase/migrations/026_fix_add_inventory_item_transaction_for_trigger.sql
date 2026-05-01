-- Migration: 026_fix_add_inventory_item_transaction_for_trigger.sql
-- Description: Fix function to work with skus_create_inventory_stock trigger
-- The trigger auto-creates inventory_stock records when SKUs are inserted,
-- so we UPDATE the quantity instead of trying to INSERT (which causes duplicate key error)

DROP FUNCTION IF EXISTS add_inventory_item_transaction(
  p_sku_code TEXT,
  p_name TEXT,
  p_unit TEXT,
  p_category_id UUID,
  p_unit_price NUMERIC,
  p_supplier_id UUID,
  p_initial_stock NUMERIC,
  p_user_id UUID
);

CREATE OR REPLACE FUNCTION add_inventory_item_transaction(
  p_sku_code TEXT,
  p_name TEXT,
  p_unit TEXT,
  p_category_id UUID,
  p_unit_price NUMERIC,
  p_supplier_id UUID,
  p_initial_stock NUMERIC,
  p_user_id UUID
)
RETURNS JSON
LANGUAGE plpgsql
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