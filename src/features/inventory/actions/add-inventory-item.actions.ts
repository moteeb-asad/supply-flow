"use server";

import { createClient } from "@/src/db/supabaseClient";
import { randomUUID } from "crypto";
import { AddInventoryItemSchema } from "../validators/inventory-item.schema";

type AddInventoryItemResult =
  | { error?: string; success?: string; resetKey: string }
  | undefined;

export default async function addInventoryItemAction(
  _prevState: AddInventoryItemResult,
  formData: FormData,
): Promise<AddInventoryItemResult> {
  const raw = {
    itemName: formData.get("itemName"),
    skuCode: formData.get("skuCode"),
    unit: formData.get("unit"),
    category: formData.get("category"),
    initialStock: Number(formData.get("initialStock")),
    unitPrice: Number(formData.get("unitPrice")),
    primarySupplier: formData.get("primarySupplier"),
  };

  const validation = AddInventoryItemSchema.safeParse(raw);
  if (!validation.success) {
    const firstError = validation.error.issues[0];
    return {
      error: firstError?.message ?? "Invalid inventory item data",
      resetKey: randomUUID(),
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      error: "You must be logged in to create inventory items.",
      resetKey: randomUUID(),
    };
  }

  // Single atomic transaction via RPC
  const { data, error } = await supabase.rpc("add_inventory_item_transaction", {
    p_sku_code: validation.data.skuCode,
    p_name: validation.data.itemName,
    p_unit: validation.data.unit,
    p_category_id: validation.data.category,
    p_unit_price: validation.data.unitPrice,
    p_supplier_id: validation.data.primarySupplier,
    p_initial_stock: validation.data.initialStock,
    p_user_id: user.id,
  });

  if (error) {
    console.error("Transaction failed:", error);
    return {
      error: `Failed: ${error.message} | Code: ${error.code} | Details: ${JSON.stringify(error.details || {})}`,
      resetKey: randomUUID(),
    };
  }

  return {
    success: "Inventory item successfully created",
    resetKey: randomUUID(),
  };
}
