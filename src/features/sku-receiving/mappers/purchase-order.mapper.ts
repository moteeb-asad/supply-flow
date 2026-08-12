import type { PurchaseOrderOption } from "../types";

type PurchaseOrderSupplierRow = {
  name: string | null;
};

export type PurchaseOrderRow = {
  id: string;
  po_number: string;
  supplier_id: string;
  expected_delivery_date: string | null;
  status: string;
  suppliers: PurchaseOrderSupplierRow | PurchaseOrderSupplierRow[] | null;
};

export function mapPurchaseOrderRowToOption(
  purchaseOrder: PurchaseOrderRow,
): PurchaseOrderOption {
  const supplierName = Array.isArray(purchaseOrder.suppliers)
    ? (purchaseOrder.suppliers[0]?.name ?? null)
    : (purchaseOrder.suppliers?.name ?? null);

  return {
    id: purchaseOrder.id,
    po_number: purchaseOrder.po_number,
    supplier_id: purchaseOrder.supplier_id,
    supplier_name: supplierName,
    expected_delivery_date: purchaseOrder.expected_delivery_date,
    status: purchaseOrder.status,
  };
}

export function mapPurchaseOrderRowsToOptions(
  rows: PurchaseOrderRow[],
): PurchaseOrderOption[] {
  return rows.map(mapPurchaseOrderRowToOption);
}
