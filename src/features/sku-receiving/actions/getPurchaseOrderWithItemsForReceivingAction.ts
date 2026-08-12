"use server";

import { createClient } from "@/src/db/supabaseClient";

export async function getPurchaseOrderWithItemsForReceivingAction(
  purchaseOrderId: string,
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("purchase_orders")
    .select(
      "id, po_number, supplier_id, expected_delivery_date, status, suppliers:supplier_id(name), purchase_order_items(id,purchase_order_id,sku_id,ordered_qty,received_qty,unit_price,line_total,skus:sku_id(sku_code,name))",
    )
    .eq("id", purchaseOrderId)
    .single();

  if (error) {
    console.error(
      "getPurchaseOrderWithItemsForReceivingAction error:",
      error.message,
    );
    return null;
  }

  console.log(JSON.stringify(data, null, 2));

  return data;
}
