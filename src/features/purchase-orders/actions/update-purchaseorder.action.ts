"use server";

import { createClient } from "@/src/db/supabaseClient";
import { createPurchaseOrderSchema } from "../validators/purchase-order.schema";

type UpdatePurchaseOrderActionResult =
  | { error?: string; success?: string; purchaseOrderId?: string }
  | undefined;

const isUuid = (value: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );

export async function updatePurchaseOrderAction(
  _prevState: UpdatePurchaseOrderActionResult,
  formData: FormData,
): Promise<UpdatePurchaseOrderActionResult> {
  const purchaseOrderId = formData.get("purchaseOrderId") as string;

  if (!purchaseOrderId || !isUuid(purchaseOrderId)) {
    return { error: "Invalid purchase order id." };
  }

  const lineItemsRaw = formData.get("lineItems");
  const lineItems = lineItemsRaw ? JSON.parse(lineItemsRaw as string) : [];

  const raw = {
    supplierId: formData.get("supplierId"),
    supplierName: formData.get("supplierName"),
    orderDate: formData.get("orderDate"),
    expectedDeliveryDate: formData.get("expectedDeliveryDate"),
    shippingMethod: formData.get("shippingMethod"),
    paymentMethod: formData.get("paymentMethod"),
    status: formData.get("status"),
    notes: formData.get("notes"),
    lineItems,
  };

  const validation = createPurchaseOrderSchema.safeParse(raw);
  if (!validation.success) {
    const firstError = validation.error.issues[0];
    return {
      error: firstError?.message ?? "Invalid purchase order data",
    };
  }

  const values = validation.data;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to edit a PO." };
  }

  const { data: supplier, error: supplierError } = await supabase
    .from("suppliers")
    .select("id, status")
    .eq("id", values.supplierId)
    .maybeSingle();

  if (supplierError || !supplier?.id) {
    return { error: "Selected supplier not found." };
  }

  if (supplier.status !== "active") {
    return { error: "Selected supplier is inactive." };
  }

  const skuNames = [...new Set(values.lineItems.map((item) => item.skuName))];
  const { data: skus, error: skusError } = await supabase
    .from("skus")
    .select("id, name")
    .in("name", skuNames);

  if (skusError) {
    return { error: skusError.message };
  }

  const skuIdByName = new Map((skus ?? []).map((sku) => [sku.name, sku.id]));
  const missingSku = values.lineItems.find(
    (item) => !skuIdByName.has(item.skuName),
  );

  if (missingSku) {
    return { error: `SKU not found: ${missingSku.skuName}` };
  }

  const subtotal = values.lineItems.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0,
  );
  const taxRate = values.paymentMethod === "card" ? 0.05 : 0.16;
  const taxAmount = Number((subtotal * taxRate).toFixed(2));
  const totalAmount = Number((subtotal + taxAmount).toFixed(2));

  const { error: updateError } = await supabase
    .from("purchase_orders")
    .update({
      supplier_id: supplier.id,
      status: values.status,
      order_date: values.orderDate,
      expected_delivery_date: values.expectedDeliveryDate || null,
      payment_method: values.paymentMethod,
      notes: values.notes || null,
      subtotal,
      tax_amount: taxAmount,
      total_amount: totalAmount,
      updated_at: new Date().toISOString(),
    })
    .eq("id", purchaseOrderId);

  if (updateError) {
    return { error: updateError.message };
  }

  const { data: existingItems, error: existingItemsError } = await supabase
    .from("purchase_order_items")
    .select("sku_id, received_qty")
    .eq("purchase_order_id", purchaseOrderId);

  if (existingItemsError) {
    return { error: existingItemsError.message };
  }

  const receivedQtyBySkuId = new Map(
    (existingItems ?? []).map((item) => [
      item.sku_id,
      Number(item.received_qty),
    ]),
  );

  const skuIdsInPayload = values.lineItems.map(
    (item) => skuIdByName.get(item.skuName) as string,
  );

  const staleSkuIds = (existingItems ?? [])
    .map((item) => item.sku_id)
    .filter((skuId) => !skuIdsInPayload.includes(skuId));

  if (staleSkuIds.length > 0) {
    const { error: deleteStaleItemsError } = await supabase
      .from("purchase_order_items")
      .delete()
      .eq("purchase_order_id", purchaseOrderId)
      .in("sku_id", staleSkuIds);

    if (deleteStaleItemsError) {
      return { error: deleteStaleItemsError.message };
    }
  }

  const upsertRows = values.lineItems.map((item) => {
    const skuId = skuIdByName.get(item.skuName) as string;
    return {
      purchase_order_id: purchaseOrderId,
      sku_id: skuId,
      ordered_qty: item.quantity,
      received_qty: receivedQtyBySkuId.get(skuId) ?? 0,
      unit_price: item.unitPrice,
    };
  });

  const { error: upsertItemsError } = await supabase
    .from("purchase_order_items")
    .upsert(upsertRows, { onConflict: "purchase_order_id,sku_id" });

  if (upsertItemsError) {
    return { error: upsertItemsError.message };
  }

  return {
    success: "Purchase order updated successfully.",
    purchaseOrderId,
  };
}
