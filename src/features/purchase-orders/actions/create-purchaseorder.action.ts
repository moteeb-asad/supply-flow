"use server";

import { createClient } from "@/src/db/supabaseClient";
import { randomBytes } from "crypto";
import type {
  CreatePurchaseOrderActionResult,
  CreatePurchaseOrderInput,
  PurchaseOrderLineItemFormValue,
} from "../types";
import { createPurchaseOrderSchema } from "../validators/purchase-order.schema";

function buildPurchaseOrderNumber(): string {
  const timestamp = new Date()
    .toISOString()
    .replace(/[-:.TZ]/g, "")
    .slice(0, 14);
  const entropy = randomBytes(3).toString("hex").toUpperCase();
  return `PO-${timestamp}-${entropy}`;
}

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

export async function createPurchaseOrderAction(
  input: CreatePurchaseOrderInput,
): Promise<CreatePurchaseOrderActionResult> {
  const schemaResult = createPurchaseOrderSchema.safeParse(input);

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

  const validatedInput = schemaResult.data;
  const supplierId = validatedInput.supplierId.trim();
  const lineItems = normalizeLineItems(validatedInput.lineItems);

  if (!supplierId) {
    return { success: false, error: "Supplier is required." };
  }

  if (!validatedInput.orderDate) {
    return { success: false, error: "Order date is required." };
  }

  if (lineItems.length === 0) {
    return { success: false, error: "Add at least one valid line item." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "You must be logged in to create a PO." };
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
  const taxRate = validatedInput.paymentMethod === "card" ? 0.05 : 0.16;
  const taxAmount = Number((subtotal * taxRate).toFixed(2));
  const totalAmount = Number((subtotal + taxAmount).toFixed(2));

  const maxAttempts = 3;
  let purchaseOrderId: string | null = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const { data: purchaseOrder, error: insertPoError } = await supabase
      .from("purchase_orders")
      .insert({
        po_number: buildPurchaseOrderNumber(),
        supplier_id: supplier.id,
        created_by: user.id,
        status: validatedInput.status,
        order_date: validatedInput.orderDate,
        expected_delivery_date: validatedInput.expectedDeliveryDate || null,
        payment_method: validatedInput.paymentMethod,
        notes: validatedInput.notes || null,
        currency: "USD",
        subtotal,
        tax_amount: taxAmount,
        total_amount: totalAmount,
      })
      .select("id")
      .single();

    if (!insertPoError && purchaseOrder?.id) {
      purchaseOrderId = purchaseOrder.id;
      break;
    }

    const isUniquePoNumberCollision =
      insertPoError?.code === "23505" &&
      (`${insertPoError.message} ${insertPoError.details ?? ""}`.includes(
        "po_number",
      ) ||
        `${insertPoError.message} ${insertPoError.details ?? ""}`.includes(
          "purchase_orders_po_number_key",
        ));

    if (!isUniquePoNumberCollision || attempt === maxAttempts) {
      return {
        success: false,
        error: insertPoError?.message ?? "Failed to create purchase order.",
      };
    }
  }

  if (!purchaseOrderId) {
    return {
      success: false,
      error:
        "Failed to create purchase order after retrying PO number generation.",
    };
  }

  const itemRows = lineItems.map((item) => ({
    purchase_order_id: purchaseOrderId,
    sku_id: skuIdByName.get(item.skuName),
    ordered_qty: item.quantity,
    received_qty: 0,
    unit_price: item.unitPrice,
  }));

  const { error: insertItemsError } = await supabase
    .from("purchase_order_items")
    .insert(itemRows);

  if (insertItemsError) {
    await supabase.from("purchase_orders").delete().eq("id", purchaseOrderId);
    return { success: false, error: insertItemsError.message };
  }

  return { success: true, purchaseOrderId };
}
