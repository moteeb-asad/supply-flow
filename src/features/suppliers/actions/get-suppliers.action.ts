"use server";

import { createClient } from "@/src/db/supabaseClient";
import type { Supplier } from "@/src/features/suppliers/types/suppliers.types";

export async function getSuppliersAction(): Promise<Supplier[]> {
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
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getSuppliersAction error:", error.message);
    return [];
  }

  return (data ?? []) as unknown as Supplier[];
}
