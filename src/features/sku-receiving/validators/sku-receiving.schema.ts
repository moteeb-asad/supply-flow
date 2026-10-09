import { z } from "zod";
import { NO_VARIANCE_REASON } from "../constants/form-options";

const quantitySchema = z
  .number({ message: "Enter a quantity" })
  .min(0, "Cannot be negative");

const receivingLineItemSchema = z
  .object({
    purchase_order_item_id: z.string().min(1),
    sku_id: z.string().min(1),
    sku_code: z.string(),
    item_name: z.string(),
    ordered_qty: z.number(),
    received_qty_so_far: z.number(),
    remaining_qty: z.number(),
    qty_received: quantitySchema,
    qty_rejected: quantitySchema,
    variance_reason: z.string(),
  })
  .superRefine((item, ctx) => {
    if (item.qty_received + item.qty_rejected > item.remaining_qty) {
      ctx.addIssue({
        code: "custom",
        path: ["qty_received"],
        message: `Exceeds remaining (${item.remaining_qty})`,
      });
    }
    if (item.qty_rejected > 0 && item.variance_reason === NO_VARIANCE_REASON) {
      ctx.addIssue({
        code: "custom",
        path: ["variance_reason"],
        message: "Reason required for rejects",
      });
    }
  });

export const startReceivingSchema = z.object({
  purchase_order_id: z.string().min(1, "Load a purchase order first"),
  receipt_datetime: z.string().min(1, "Receipt date and time is required"),
  delivery_note_number: z
    .string()
    .trim()
    .max(100, "Delivery note number is too long"),
  received_by_name: z.string(),
  received_by_role: z.string(),
  receiving_location: z.string().min(1, "Receiving location is required"),
  vehicle_ref: z.string().trim().max(100, "Vehicle/driver ref is too long"),
  notes: z.string().trim().max(1000, "Notes cannot exceed 1000 characters"),
  line_items: z
    .array(receivingLineItemSchema)
    .refine(
      (items) =>
        items.length === 0 ||
        items.some((item) => item.qty_received + item.qty_rejected > 0),
      "Enter a received or rejected quantity for at least one line",
    ),
});

export type StartReceivingFormValues = z.input<typeof startReceivingSchema>;
export type StartReceivingFormOutput = z.output<typeof startReceivingSchema>;
export type StartReceivingLineItemValue =
  StartReceivingFormValues["line_items"][number];
