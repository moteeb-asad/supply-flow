"use server";

import { createClient } from "@/src/db/supabaseClient";
import type { InventoryItemFormValues } from "../types/form.types";

type AddInventoryItemResult =
  | { success: true; skuId: string }
  | { success: false; error: string; validationErrors?: string[] };

export default async function addInventoryItemAction(
  values: InventoryItemFormValues,
): Promise<AddInventoryItemResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      error: "You must be logged in to create an Inventory Item.",
    };
  }

  // Start transaction
  const { data: sku, error: skuError } = await supabase
    .from("skus")
    .insert({
      sku_code: values.skuCode,
      name: values.itemName,
      unit: values.category, // Adjust if you have a separate unit field
      created_by: user.id,
    })
    .select("id")
    .single();

  if (skuError || !sku) {
    return {
      success: false,
      error: skuError?.message ?? "Failed to create SKU.",
    };
  }

  const skuId = sku.id;

  // Insert into inventory_stock
  const { error: stockError } = await supabase.from("inventory_stock").insert({
    sku_id: skuId,
    on_hand_qty: values.initialStock,
  });

  if (stockError) {
    return { success: false, error: stockError.message };
  }

  // Insert into sku_suppliers
  const { error: supplierError } = await supabase.from("sku_suppliers").insert({
    sku_id: skuId,
    supplier_id: values.primarySupplier,
    is_primary: true,
  });

  if (supplierError) {
    return { success: false, error: supplierError.message };
  }

  return { success: true, skuId };
}
