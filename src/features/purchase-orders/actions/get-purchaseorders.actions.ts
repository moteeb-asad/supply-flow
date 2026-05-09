"use server";

import { createClient } from "@/src/db/supabaseClient";
import type {
  PurchaseOrder,
  PurchaseOrdersFiltersValue,
  PurchaseOrderRow,
  PurchaseOrderSupplierRelation,
  PurchaseOrdersQueryParams,
} from "../types";
import { getFilterDate } from "@/src/lib/date-range-utils";

function mapSupplierName(
  supplierRelation: PurchaseOrderSupplierRelation,
): string {
  if (!supplierRelation) return "Unknown Supplier";
  if (Array.isArray(supplierRelation)) {
    return supplierRelation[0]?.name ?? "Unknown Supplier";
  }
  return supplierRelation.name ?? "Unknown Supplier";
}

function mapPurchaseOrderDTO(row: PurchaseOrderRow): PurchaseOrder {
  return {
    id: row.id,
    po_number: row.po_number,
    supplier_id: row.supplier_id,
    payment_method: row.payment_method,
    supplier_name: mapSupplierName(row.suppliers),
    order_date: row.order_date,
    expected_delivery_date: row.expected_delivery_date,
    total_amount: Number(row.total_amount ?? 0),
    status: row.status,
  };
}

export async function getPurchaseOrdersAction(
  params: PurchaseOrdersQueryParams,
) {
  const supabase = await createClient();
  const { page, pageSize, search, filters } = params;
  const searchTerm = search?.trim();

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const typedFilters = (filters ?? {}) as PurchaseOrdersFiltersValue;

  let query = supabase
    .from("purchase_orders")
    .select(
      `
      id,
      po_number,
      supplier_id,
      payment_method,
      order_date,
      expected_delivery_date,
      total_amount,
      status,
      suppliers:supplier_id (name)
    `,
      { count: "exact" },
    )
    .order("created_at", { ascending: false });

  if (searchTerm) {
    const { data: matchedSuppliers, error: supplierSearchError } =
      await supabase
        .from("suppliers")
        .select("id")
        .ilike("name", `%${searchTerm}%`)
        .limit(50);

    if (supplierSearchError) {
      console.error(
        "Failed to search suppliers for purchase order search:",
        supplierSearchError,
      );
    }

    const supplierIds = (matchedSuppliers ?? []).map((supplier) => supplier.id);

    if (supplierIds.length > 0) {
      query = query.or(
        `po_number.ilike.%${searchTerm}%,supplier_id.in.(${supplierIds.join(",")})`,
      );
    } else {
      query = query.ilike("po_number", `%${searchTerm}%`);
    }
  }

  if (typedFilters.status) {
    query = query.eq("status", typedFilters.status);
  }

  const dateRange = getFilterDate(typedFilters.dateRange);
  if (dateRange) {
    query = query.gte("order_date", dateRange);
  }

  const { data, count, error } = await query.range(from, to);

  if (error) {
    console.error("Failed to fetch purchase orders:", error);
    return { success: false, data: [], total: 0 };
  }

  const mapped = ((data ?? []) as PurchaseOrderRow[]).map(mapPurchaseOrderDTO);

  return {
    success: true,
    data: mapped,
    total: count ?? mapped.length,
  };
}
