"use server";

import { createClient } from "@/src/db/supabaseClient";
import { RECEIVABLE_PO_STATUSES } from "../constants/statuses";
import type { PurchaseOrderWithItemsRow } from "../types";

export async function getPurchaseOrderWithItemsAction(
  purchaseOrderId: string,
): Promise<PurchaseOrderWithItemsRow | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("purchase_orders")
    .select(
      "id, po_number, supplier_id, expected_delivery_date, status, suppliers:supplier_id(name), purchase_order_items(id,sku_id,ordered_qty,received_qty,skus:sku_id(sku_code,name))",
    )
    .eq("id", purchaseOrderId)
    .in("status", RECEIVABLE_PO_STATUSES)
    .single();

  if (error) {
    console.error("getPurchaseOrderWithItemsAction error:", error.message);
    return null;
  }

  return data as PurchaseOrderWithItemsRow;
}
