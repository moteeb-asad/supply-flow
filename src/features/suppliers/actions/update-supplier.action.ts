"use server";

import { createClient } from "@/src/db/supabaseClient";
import type { SupplierFormValues } from "@/src/features/suppliers/types/suppliers.types";
import { supplierFormSchema } from "@/src/features/suppliers/validators/suppliers.schema";

export async function updateSupplierAction(
  supplierId: string,
  values: SupplierFormValues,
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!supplierId) {
      return { success: false, error: "Supplier ID is required" };
    }

    const validation = supplierFormSchema.safeParse(values);
    if (!validation.success) {
      const firstError = validation.error.issues[0];
      return { success: false, error: firstError?.message ?? "Invalid data" };
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    const normalizeOptional = (value?: string) => {
      if (value === undefined) {
        return null;
      }
      const trimmed = value.trim();
      return trimmed === "" ? null : trimmed;
    };

    const sanitizedValues = validation.data;

    const { data: updatedRow, error } = await supabase
      .from("suppliers")
      .update({
        name: sanitizedValues.name,
        category: sanitizedValues.category,
        status: sanitizedValues.status,
        primary_contact_name: normalizeOptional(sanitizedValues.contactName),
        primary_contact_email: normalizeOptional(sanitizedValues.email),
        primary_contact_phone: normalizeOptional(sanitizedValues.contactPhone),
        notes: normalizeOptional(sanitizedValues.notes),
        payment_terms: sanitizedValues.paymentTerms,
        min_order_qty: sanitizedValues.minOrderQty,
        lead_time_days: sanitizedValues.leadTimeDays,
      })
      .eq("id", supplierId)
      .select("id")
      .maybeSingle();

    if (error) {
      return { success: false, error: error.message };
    }

    if (!updatedRow) {
      return {
        success: false,
        error: "Supplier not found or you do not have permission to update it",
      };
    }

    return { success: true };
  } catch (err: unknown) {
    let errorMsg = "Unknown error";
    if (err instanceof Error) {
      errorMsg = err.message;
    }
    return { success: false, error: errorMsg };
  }
}
