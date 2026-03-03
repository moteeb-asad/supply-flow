"use server";

import { createClient } from "@/src/db/supabaseClient";
import { supplierFormSchema } from "@/src/features/suppliers/validators/suppliers.schema";
import { randomUUID } from "crypto";

type ActionState =
  | { error?: string; success?: string; resetKey?: string }
  | undefined;

export async function createSupplierAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parseNumber = (value: FormDataEntryValue | null) => {
    if (value === null) {
      return undefined;
    }
    const parsed = Number(value);
    return Number.isNaN(parsed) ? undefined : parsed;
  };

  const raw = {
    name: formData.get("name"),
    category: formData.get("category"),
    status: formData.get("status"),
    contactName: formData.get("contactName"),
    email: formData.get("email"),
    contactPhone: formData.get("contactPhone"),
    notes: formData.get("notes"),
    paymentTerms: formData.get("paymentTerms"),
    minOrderQty: parseNumber(formData.get("minOrderQty")),
    leadTimeDays: parseNumber(formData.get("leadTimeDays")),
  };

  const validation = supplierFormSchema.safeParse(raw);
  validation.error?.format();
  if (!validation.success) {
    const firstError = validation.error.issues[0];
    return { error: firstError?.message ?? "Invalid supplier data" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to create suppliers." };
  }

  const values = validation.data;
  const normalizeOptional = (value?: string) => {
    if (value === undefined) {
      return null;
    }
    const trimmed = value.trim();
    return trimmed === "" ? null : trimmed;
  };

  const { error } = await supabase.from("suppliers").insert({
    name: values.name,
    category: values.category,
    status: values.status,
    primary_contact_name: normalizeOptional(values.contactName),
    primary_contact_email: normalizeOptional(values.email),
    primary_contact_phone: normalizeOptional(values.contactPhone),
    notes: normalizeOptional(values.notes),
    payment_terms: values.paymentTerms,
    min_order_qty: values.minOrderQty,
    lead_time_days: values.leadTimeDays,
    created_by: user.id,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: "Supplier created successfully", resetKey: randomUUID() };
}
