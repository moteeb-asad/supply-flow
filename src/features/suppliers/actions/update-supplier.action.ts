import { createBrowserSupabaseClient } from "@/src/db/supabaseBrowserClient";
import type { SupplierFormValues } from "@/src/features/suppliers/types/suppliers.types";

export async function updateSupplierAction(
  supplierId: string,
  values: SupplierFormValues,
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createBrowserSupabaseClient();
    const { data, error } = await supabase
      .from("suppliers")
      .update({
        name: values.name,
        category: values.category,
        status: values.status,
        primary_contact_name: values.contactName ?? "",
        primary_contact_email: values.email ?? "",
        primary_contact_phone: values.contactPhone ?? "",
        notes: values.notes ?? "",
        payment_terms: values.paymentTerms,
        min_order_qty: values.minOrderQty,
        lead_time_days: values.leadTimeDays,
      })
      .eq("id", supplierId);
    if (error) {
      return { success: false, error: error.message };
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
