import { z } from "zod";

const optionalText = z.string().trim().optional();
const optionalEmail = z
  .string()
  .trim()
  .email("Invalid email address")
  .or(z.literal(""));

export const supplierFormSchema = z.object({
  name: z.string().trim().min(1, "Supplier name is required"),
  category: z.enum(["dry", "liquid", "mixed"], {
    message: "Category is required",
  }),
  status: z.enum(["active", "inactive"], {
    message: "Status is required",
  }),
  contactName: optionalText,
  email: optionalEmail.optional(),
  contactPhone: optionalText,
  notes: optionalText,
  paymentTerms: z.string().trim().min(1, "Payment terms are required"),
  minOrderQty: z.number().int().min(1, "Minimum order is required"),
  leadTimeDays: z
    .number()
    .int()
    .min(1, "Lead time is required")
    .max(30, "Lead time must be 30 days or less"),
});

export type SupplierFormInput = z.infer<typeof supplierFormSchema>;
