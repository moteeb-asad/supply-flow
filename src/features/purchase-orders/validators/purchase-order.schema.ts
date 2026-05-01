import { z } from "zod";

const purchaseOrderLineItemSchema = z.object({
  skuName: z.string().trim().min(1, "SKU is required"),
  quantity: z
    .number({ message: "Quantity must be a number" })
    .positive("Quantity must be greater than 0"),
  unitPrice: z
    .number({ message: "Unit price must be a number" })
    .positive("Unit price must be greater than 0"),
});

export const createPurchaseOrderSchema = z.object({
  supplierId: z.string().trim().min(1, "Supplier is required"),
  supplierName: z.string().trim().min(1, "Supplier is required"),
  orderDate: z.string().trim().min(1, "Order date is required"),
  expectedDeliveryDate: z.string().trim().optional().default(""),
  shippingMethod: z.enum(["standard", "express", "economy"]),
  paymentMethod: z.enum(["cod", "card"]),
  status: z.enum([
    "draft",
    "pending",
    "partially_received",
    "closed",
    "cancelled",
    "overdue",
  ]),
  notes: z
    .string()
    .trim()
    .max(1000, "Notes cannot exceed 1000 characters")
    .optional()
    .default(""),
  lineItems: z
    .array(purchaseOrderLineItemSchema)
    .min(1, "Add at least one valid line item"),
});
