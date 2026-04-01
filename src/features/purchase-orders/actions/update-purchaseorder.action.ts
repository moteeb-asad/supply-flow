"use server";

import { createClient } from "@/src/db/supabaseClient";
import type {
  PurchaseOrderLineItemFormValue,
  UpdatePurchaseOrderActionResult,
  UpdatePurchaseOrderInput,
} from "../types";
import { createPurchaseOrderSchema } from "../validators/purchase-order.schema";

const isUuid = (value: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );

function normalizeLineItems(
  lineItems: PurchaseOrderLineItemFormValue[],
): PurchaseOrderLineItemFormValue[] {
  return lineItems
    .map((item) => ({
      skuName: item.skuName.trim(),
      quantity: Number(item.quantity),
      unitPrice: Number(item.unitPrice),
    }))
    .filter(
      (item) =>
        item.skuName.length > 0 &&
        Number.isFinite(item.quantity) &&
        item.quantity > 0 &&
        Number.isFinite(item.unitPrice) &&
        item.unitPrice > 0,
    );
}

export async function updatePurchaseOrderAction(
  input: UpdatePurchaseOrderInput,
): Promise<UpdatePurchaseOrderActionResult> {
  const purchaseOrderId = input.purchaseOrderId.trim();

  if (!purchaseOrderId || !isUuid(purchaseOrderId)) {
    return { success: false, error: "Invalid purchase order id." };
  }

  const schemaResult = createPurchaseOrderSchema.safeParse(input.values);

  if (!schemaResult.success) {
    const validationErrors = Object.values(
      schemaResult.error.flatten().fieldErrors,
    )
      .flat()
      .filter((message): message is string => Boolean(message));

    return {
      success: false,
      error: validationErrors[0] ?? "Invalid purchase order payload.",
      validationErrors,
    };
  }

  const values = schemaResult.data;
  const supplierId = values.supplierId.trim();
  const lineItems = normalizeLineItems(values.lineItems);

  if (lineItems.length === 0) {
    return { success: false, error: "Add at least one valid line item." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "You must be logged in to edit a PO." };
  }

  const { data: supplier, error: supplierError } = await supabase
    .from("suppliers")
    .select("id, status")
    .eq("id", supplierId)
    .maybeSingle();

  if (supplierError) {
    return { success: false, error: supplierError.message };
  }

  if (!supplier?.id) {
    return {
      success: false,
      error: "Selected supplier was not found. Please select a valid supplier.",
    };
  }

  if (supplier.status !== "active") {
    return {
      success: false,
      error: "Selected supplier is inactive. Please choose an active supplier.",
    };
  }

  const skuNames = [...new Set(lineItems.map((item) => item.skuName))];
  const { data: skus, error: skusError } = await supabase
    .from("skus")
    .select("id, name")
    .in("name", skuNames);

  if (skusError) {
    return { success: false, error: skusError.message };
  }

  const skuIdByName = new Map((skus ?? []).map((sku) => [sku.name, sku.id]));

  const missingSku = lineItems.find((item) => !skuIdByName.has(item.skuName));
  if (missingSku) {
    return {
      success: false,
      error: `SKU not found: ${missingSku.skuName}`,
    };
  }

  const subtotal = lineItems.reduce(
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
    return { success: false, error: updateError.message };
  }

  const { data: existingItems, error: existingItemsError } = await supabase
    .from("purchase_order_items")
    .select("sku_id, received_qty")
    .eq("purchase_order_id", purchaseOrderId);

  if (existingItemsError) {
    return { success: false, error: existingItemsError.message };
  }

  const receivedQtyBySkuId = new Map(
    (existingItems ?? []).map((item) => [
      item.sku_id,
      Number(item.received_qty),
    ]),
  );

  const skuIdsInPayload = lineItems.map(
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
      return { success: false, error: deleteStaleItemsError.message };
    }
  }

  const upsertRows = lineItems.map((item) => {
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
    return { success: false, error: upsertItemsError.message };
  }

  return { success: true };
}
