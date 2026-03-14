"use server";

import { createClient } from "@/src/db/supabaseClient";
import type {
  PurchaseOrder,
  PurchaseOrderDetailLineItem,
  PurchaseOrderItemSkuRelation,
  PurchaseOrderSupplierRelation,
} from "../types/purchase-orders.types";

const isUuid = (value: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );

const mapSupplierName = (supplierRelation: PurchaseOrderSupplierRelation) => {
  if (!supplierRelation) return "Unknown Supplier";
  if (Array.isArray(supplierRelation)) {
    return supplierRelation[0]?.name ?? "Unknown Supplier";
  }
  return supplierRelation.name ?? "Unknown Supplier";
};

const mapSupplierContact = (
  supplierRelation: PurchaseOrderSupplierRelation,
) => {
  if (!supplierRelation) {
    return {
      contactName: null,
      contactEmail: null,
      contactPhone: null,
    };
  }

  const relation = Array.isArray(supplierRelation)
    ? (supplierRelation[0] ?? null)
    : supplierRelation;

  return {
    contactName: relation?.primary_contact_name ?? null,
    contactEmail: relation?.primary_contact_email ?? null,
    contactPhone: relation?.primary_contact_phone ?? null,
  };
};

const mapSkuInfo = (skuRelation: PurchaseOrderItemSkuRelation) => {
  if (!skuRelation) {
    return {
      skuCode: "-",
      skuName: "Unknown Item",
    };
  }

  const relation = Array.isArray(skuRelation)
    ? (skuRelation[0] ?? null)
    : skuRelation;

  return {
    skuCode: relation?.sku_code ?? "-",
    skuName: relation?.name ?? "Unknown Item",
  };
};

type PurchaseOrderDetailItemRow = {
  id: string;
  ordered_qty: number | string;
  received_qty: number | string;
  unit_price: number | string;
  line_total: number | string;
  skus: PurchaseOrderItemSkuRelation;
};

const mapLineItems = (
  rows: PurchaseOrderDetailItemRow[] | null | undefined,
): PurchaseOrderDetailLineItem[] => {
  return (rows ?? []).map((row) => {
    const skuInfo = mapSkuInfo(row.skus);
    return {
      id: row.id,
      ordered_qty: Number(row.ordered_qty ?? 0),
      received_qty: Number(row.received_qty ?? 0),
      unit_price: Number(row.unit_price ?? 0),
      line_total: Number(row.line_total ?? 0),
      sku_code: skuInfo.skuCode,
      sku_name: skuInfo.skuName,
    };
  });
};

type PurchaseOrderDetailRow = {
  id: string;
  po_number: string;
  supplier_id: string;
  order_date: string | null;
  expected_delivery_date: string | null;
  total_amount: number | string | null;
  status: PurchaseOrder["status"];
  notes: string | null;
  suppliers: PurchaseOrderSupplierRelation;
  purchase_order_items: PurchaseOrderDetailItemRow[] | null;
};

export async function getPurchaseOrderAction(
  purchaseOrderId: string,
): Promise<PurchaseOrder | null> {
  if (!purchaseOrderId || !isUuid(purchaseOrderId)) {
    return null;
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("purchase_orders")
    .select(
      [
        "id",
        "po_number",
        "supplier_id",
        "order_date",
        "expected_delivery_date",
        "total_amount",
        "status",
        "notes",
        "suppliers:supplier_id(name,primary_contact_name,primary_contact_email,primary_contact_phone)",
        "purchase_order_items(id,ordered_qty,received_qty,unit_price,line_total,skus:sku_id(sku_code,name))",
      ].join(","),
    )
    .eq("id", purchaseOrderId)
    .single();

  if (error) {
    console.error("getPurchaseOrderAction error:", error.message);
    return null;
  }

  if (!data) {
    return null;
  }

  const row = data as unknown as PurchaseOrderDetailRow;
  const supplierContact = mapSupplierContact(row.suppliers);

  return {
    id: row.id,
    po_number: row.po_number,
    supplier_id: row.supplier_id,
    supplier_name: mapSupplierName(row.suppliers),
    supplier_contact_name: supplierContact.contactName,
    supplier_contact_email: supplierContact.contactEmail,
    supplier_contact_phone: supplierContact.contactPhone,
    order_date: row.order_date,
    expected_delivery_date: row.expected_delivery_date,
    total_amount: Number(row.total_amount ?? 0),
    status: row.status,
    notes: row.notes,
    lineItems: mapLineItems(row.purchase_order_items),
  };
}
