"use server";

import { createClient } from "@/src/db/supabaseClient";
import type {
  UpdatePurchaseOrderActionResult,
  UpdatePurchaseOrderInput,
} from "../types/purchase-orders.types";
import { createPurchaseOrderSchema } from "../validators/purchase-order.schema";

const isUuid = (value: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );

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

  const subtotal = values.lineItems.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0,
  );
  const taxAmount = Number((subtotal * 0.08).toFixed(2));
  const totalAmount = Number((subtotal + taxAmount).toFixed(2));

  const { error: updateError } = await supabase
    .from("purchase_orders")
    .update({
      supplier_id: supplier.id,
      status: values.status,
      order_date: values.orderDate,
      expected_delivery_date: values.expectedDeliveryDate || null,
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

  return { success: true };
}
