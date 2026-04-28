-- Migration: Create add_inventory_item_transaction function
-- Description: Adds a transactional function to insert a SKU, link to supplier, and initialize inventory stock atomically.

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

  -- Insert inventory stock
  INSERT INTO inventory_stock (
    sku_id,
    on_hand_qty
  ) VALUES (
    v_sku_id,
    p_initial_stock
  );

  -- Return success with SKU ID
  v_result := json_build_object(
    'success', TRUE,
    'sku_id', v_sku_id
  );

  RETURN v_result;

EXCEPTION
  WHEN OTHERS THEN
    -- Automatic rollback happens here
    RAISE;
END;
$$;
