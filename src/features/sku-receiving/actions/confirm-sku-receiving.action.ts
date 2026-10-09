"use server";

import { createClient } from "@/src/db/supabaseClient";
import { NO_VARIANCE_REASON } from "../constants/form-options";
import { startReceivingSchema } from "../validators/sku-receiving.schema";
import type {
  ConfirmSkuReceivingResult,
  StartReceivingFormValues,
} from "../types";

// Raised by confirm_sku_receiving() with a user-facing message.
const RAISE_EXCEPTION_CODE = "P0001";

export async function confirmSkuReceivingAction(
  input: StartReceivingFormValues,
): Promise<ConfirmSkuReceivingResult> {
  const validation = startReceivingSchema.safeParse(input);
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0]?.message ?? "Invalid receiving data.",
    };
  }

  const values = validation.data;
  const supabase = await createClient();

  // Only ids and quantities are sent; the DB derives sku_id and remaining qty.
  const lineItems = values.line_items
    .filter((item) => item.qty_received + item.qty_rejected > 0)
    .map((item) => ({
      purchase_order_item_id: item.purchase_order_item_id,
      qty_received: item.qty_received,
      qty_rejected: item.qty_rejected,
      variance_reason:
        item.variance_reason === NO_VARIANCE_REASON
          ? null
          : item.variance_reason,
    }));

  const { data, error } = await supabase.rpc("confirm_sku_receiving", {
    p_purchase_order_id: values.purchase_order_id,
    p_receipt_datetime: values.receipt_datetime,
    p_receiving_location: values.receiving_location,
    p_line_items: lineItems,
    p_delivery_note_number: values.delivery_note_number,
    p_vehicle_ref: values.vehicle_ref,
    p_notes: values.notes,
  });

  if (error) {
    console.error("confirmSkuReceivingAction error:", error.message);
    return {
      success: false,
      error:
        error.code === RAISE_EXCEPTION_CODE
          ? error.message
          : "Failed to save receiving. Please try again.",
    };
  }

  return { success: true, receivingId: data as string };
}
