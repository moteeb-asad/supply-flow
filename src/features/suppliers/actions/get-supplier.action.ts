"use server";

import { createClient } from "@/src/db/supabaseClient";
import type { Supplier } from "@/src/features/suppliers/types/suppliers.types";

const isUuid = (value: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );

export async function getSupplierAction(
  supplierId: string,
): Promise<Supplier | null> {
  if (!supplierId || !isUuid(supplierId)) {
    return null;
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("suppliers")
    .select(
      [
        "id",
        "name",
        "category",
        "status",
        "primary_contact_name",
        "primary_contact_email",
        "primary_contact_phone",
        "payment_terms",
        "min_order_qty",
        "lead_time_days",
        "notes",
        "created_at",
      ].join(","),
    )
    .eq("id", supplierId)
    .single();

  if (error) {
    console.error("getSupplierAction error:", error.message);
    return null;
  }

  return (data ?? null) as unknown as Supplier | null;
}
