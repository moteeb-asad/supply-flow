"use server";

import { createClient } from "@/src/db/supabaseClient";
import type {
  PurchaseOrder,
  PurchaseOrdersFiltersValue,
  PurchaseOrderRow,
  PurchaseOrderSupplierRelation,
  PurchaseOrdersQueryParams,
} from "../types/purchase-orders.types";

function getDateRangeStart(dateRange?: string): string | null {
  const now = new Date();

  if (!dateRange) return null;

  if (dateRange === "last_7_days") {
    const d = new Date(now);
    d.setDate(now.getDate() - 7);
    return d.toISOString().slice(0, 10);
  }

  if (dateRange === "last_30_days") {
    const d = new Date(now);
    d.setDate(now.getDate() - 30);
    return d.toISOString().slice(0, 10);
  }

  if (dateRange === "this_month") {
    const d = new Date(now.getFullYear(), now.getMonth(), 1);
    return d.toISOString().slice(0, 10);
  }

  if (dateRange === "this_quarter") {
    const quarterStartMonth = Math.floor(now.getMonth() / 3) * 3;
    const d = new Date(now.getFullYear(), quarterStartMonth, 1);
    return d.toISOString().slice(0, 10);
  }

  return null;
}

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
      order_date,
      expected_delivery_date,
      total_amount,
      status,
      suppliers:supplier_id (name)
    `,
      { count: "exact" },
    )
    .order("created_at", { ascending: false });

  if (search) {
    query = query.ilike("po_number", `%${search}%`);
  }

  if (typedFilters.status) {
    query = query.eq("status", typedFilters.status);
  }

  const dateStart = getDateRangeStart(typedFilters.dateRange);
  if (dateStart) {
    query = query.gte("order_date", dateStart);
  }

  const { data, count, error } = await query.range(from, to);

  if (error) {
    console.error("Failed to fetch purchase orders:", error);
    return { success: false, data: [] as PurchaseOrder[], total: 0 };
  }

  const mapped = ((data ?? []) as PurchaseOrderRow[]).map(mapPurchaseOrderDTO);

  return {
    success: true,
    data: mapped,
    total: count ?? mapped.length,
  };
}
