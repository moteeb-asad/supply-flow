import { z } from "zod";

export const AddInventoryItemSchema = z.object({
  itemName: z.string().trim().min(1, "Item name is required"),
  skuCode: z.string().trim().min(1, "SKU code is required"),
  category: z.string().trim().min(1, "Category is required"),
  initialStock: z.number().min(0, "Initial stock must be at least 0"),
  unitPrice: z.number().min(0, "Unit price must be at least 0"),
  primarySupplier: z.string().trim().min(1, "Primary supplier is required"),
});
