"use server";

import { createClient } from "@/src/db/supabaseClient";
import { randomBytes } from "crypto";
import { createPurchaseOrderSchema } from "../validators/purchase-order.schema";

type CreatePurchaseOrderActionResult =
  | { error?: string; success?: string; purchaseOrderId?: string }
  | undefined;

function buildPurchaseOrderNumber(): string {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const entropy = randomBytes(2).toString("hex").toUpperCase();
  return `PO-${year}${month}${day}-${entropy}`;
}

export async function createPurchaseOrderAction(
  _prevState: CreatePurchaseOrderActionResult,
  formData: FormData,
): Promise<CreatePurchaseOrderActionResult> {
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
      purchaseOrderId: undefined,
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to create a PO." };
  }

  const validated = validation.data;

  const { data: supplier, error: supplierError } = await supabase
    .from("suppliers")
    .select("id, status")
    .eq("id", validated.supplierId)
    .maybeSingle();

  if (supplierError || !supplier?.id) {
    return { error: "Selected supplier not found." };
  }

  if (supplier.status !== "active") {
    return { error: "Selected supplier is inactive." };
  }

  const skuNames = [
    ...new Set(validated.lineItems.map((item) => item.skuName)),
  ];
  const { data: skus, error: skusError } = await supabase
    .from("skus")
    .select("id, name")
    .in("name", skuNames);

  if (skusError) {
    return { error: skusError.message };
  }

  const skuIdByName = new Map((skus ?? []).map((sku) => [sku.name, sku.id]));
  const missingSku = validated.lineItems.find(
    (item) => !skuIdByName.has(item.skuName),
  );

  if (missingSku) {
    return { error: `SKU not found: ${missingSku.skuName}` };
  }

  const subtotal = validated.lineItems.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0,
  );
  const taxRate = validated.paymentMethod === "card" ? 0.05 : 0.16;
  const taxAmount = Number((subtotal * taxRate).toFixed(2));
  const totalAmount = Number((subtotal + taxAmount).toFixed(2));

  let purchaseOrderId: string | null = null;

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    const { data: purchaseOrder, error: insertPoError } = await supabase
      .from("purchase_orders")
      .insert({
        po_number: buildPurchaseOrderNumber(),
        supplier_id: supplier.id,
        created_by: user.id,
        status: validated.status,
        order_date: validated.orderDate,
        expected_delivery_date: validated.expectedDeliveryDate || null,
        payment_method: validated.paymentMethod,
        notes: validated.notes || null,
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

    const isPoNumberCollision =
      insertPoError?.code === "23505" &&
      `${insertPoError.message} ${insertPoError.details ?? ""}`.includes(
        "po_number",
      );

    if (!isPoNumberCollision || attempt === 3) {
      return {
        error: insertPoError?.message ?? "Failed to create purchase order.",
      };
    }
  }

  if (!purchaseOrderId) {
    return { error: "Failed to create purchase order after retrying." };
  }

  const itemRows = validated.lineItems.map((item) => ({
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
    return { error: insertItemsError.message };
  }

  return {
    success: "Purchase order created successfully.",
    purchaseOrderId,
  };
}

// export async function createPurchaseOrderAction(
//   input: CreatePurchaseOrderInput,
//   _prevState: CreatePurchaseOrderActionResult,
//   formData: FormData,
// ): Promise<CreatePurchaseOrderActionResult> {
//   const schemaResult = createPurchaseOrderSchema.safeParse(input);

//   if (!schemaResult.success) {
//     const validationErrors = Object.values(
//       schemaResult.error.flatten().fieldErrors,
//     )
//       .flat()
//       .filter((message): message is string => Boolean(message));

//     return {
//       success: false,
//       error: validationErrors[0] ?? "Invalid purchase order payload.",
//       validationErrors,
//     };
//   }

//   const validatedInput = schemaResult.data;
//   const supplierId = validatedInput.supplierId.trim();
//   const lineItems = normalizeLineItems(validatedInput.lineItems);

//   if (!supplierId) {
//     return { success: false, error: "Supplier is required." };
//   }

//   if (!validatedInput.orderDate) {
//     return { success: false, error: "Order date is required." };
//   }

//   if (lineItems.length === 0) {
//     return { success: false, error: "Add at least one valid line item." };
//   }

//   const supabase = await createClient();
//   const {
//     data: { user },
//   } = await supabase.auth.getUser();

//   if (!user) {
//     return { success: false, error: "You must be logged in to create a PO." };
//   }

//   const { data: supplier, error: supplierError } = await supabase
//     .from("suppliers")
//     .select("id, status")
//     .eq("id", supplierId)
//     .maybeSingle();

//   if (supplierError) {
//     return { success: false, error: supplierError.message };
//   }

//   if (!supplier?.id) {
//     return {
//       success: false,
//       error: "Selected supplier was not found. Please select a valid supplier.",
//     };
//   }

//   if (supplier.status !== "active") {
//     return {
//       success: false,
//       error: "Selected supplier is inactive. Please choose an active supplier.",
//     };
//   }

//   const skuNames = [...new Set(lineItems.map((item) => item.skuName))];
//   const { data: skus, error: skusError } = await supabase
//     .from("skus")
//     .select("id, name")
//     .in("name", skuNames);

//   if (skusError) {
//     return { success: false, error: skusError.message };
//   }

//   const skuIdByName = new Map((skus ?? []).map((sku) => [sku.name, sku.id]));

//   const missingSku = lineItems.find((item) => !skuIdByName.has(item.skuName));
//   if (missingSku) {
//     return {
//       success: false,
//       error: `SKU not found: ${missingSku.skuName}`,
//     };
//   }

//   const subtotal = lineItems.reduce(
//     (sum, item) => sum + item.quantity * item.unitPrice,
//     0,
//   );
//   const taxRate = validatedInput.paymentMethod === "card" ? 0.05 : 0.16;
//   const taxAmount = Number((subtotal * taxRate).toFixed(2));
//   const totalAmount = Number((subtotal + taxAmount).toFixed(2));

//   const maxAttempts = 3;
//   let purchaseOrderId: string | null = null;

//   for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
//     const { data: purchaseOrder, error: insertPoError } = await supabase
//       .from("purchase_orders")
//       .insert({
//         po_number: buildPurchaseOrderNumber(),
//         supplier_id: supplier.id,
//         created_by: user.id,
//         status: validatedInput.status,
//         order_date: validatedInput.orderDate,
//         expected_delivery_date: validatedInput.expectedDeliveryDate || null,
//         payment_method: validatedInput.paymentMethod,
//         notes: validatedInput.notes || null,
//         currency: "USD",
//         subtotal,
//         tax_amount: taxAmount,
//         total_amount: totalAmount,
//       })
//       .select("id")
//       .single();

//     if (!insertPoError && purchaseOrder?.id) {
//       purchaseOrderId = purchaseOrder.id;
//       break;
//     }

//     const isUniquePoNumberCollision =
//       insertPoError?.code === "23505" &&
//       (`${insertPoError.message} ${insertPoError.details ?? ""}`.includes(
//         "po_number",
//       ) ||
//         `${insertPoError.message} ${insertPoError.details ?? ""}`.includes(
//           "purchase_orders_po_number_key",
//         ));

//     if (!isUniquePoNumberCollision || attempt === maxAttempts) {
//       return {
//         success: false,
//         error: insertPoError?.message ?? "Failed to create purchase order.",
//       };
//     }
//   }

//   if (!purchaseOrderId) {
//     return {
//       success: false,
//       error:
//         "Failed to create purchase order after retrying PO number generation.",
//     };
//   }

//   const itemRows = lineItems.map((item) => ({
//     purchase_order_id: purchaseOrderId,
//     sku_id: skuIdByName.get(item.skuName),
//     ordered_qty: item.quantity,
//     received_qty: 0,
//     unit_price: item.unitPrice,
//   }));

//   const { error: insertItemsError } = await supabase
//     .from("purchase_order_items")
//     .insert(itemRows);

//   if (insertItemsError) {
//     await supabase.from("purchase_orders").delete().eq("id", purchaseOrderId);
//     return { success: false, error: insertItemsError.message };
//   }

//   return { success: true, purchaseOrderId };
// }
