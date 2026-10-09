import { NO_VARIANCE_REASON } from "../constants/form-options";
import type {
  PurchaseOrderItemRow,
  PurchaseOrderOption,
  PurchaseOrderRow,
  PurchaseOrderWithItemsRow,
  StartReceivingLineItemValue,
  StartReceivingLoadedPoPayload,
} from "../types";

// Supabase returns a to-one join as an object or a single-item array.
function unwrapOne<T>(value: T | T[] | null): T | null {
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

export function mapPurchaseOrderRowToOption(
  purchaseOrder: PurchaseOrderRow,
): PurchaseOrderOption {
  return {
    id: purchaseOrder.id,
    po_number: purchaseOrder.po_number,
    supplier_id: purchaseOrder.supplier_id,
    supplier_name: unwrapOne(purchaseOrder.suppliers)?.name ?? null,
    expected_delivery_date: purchaseOrder.expected_delivery_date,
    status: purchaseOrder.status,
  };
}

export function mapPurchaseOrderRowsToOptions(
  rows: PurchaseOrderRow[],
): PurchaseOrderOption[] {
  return rows.map(mapPurchaseOrderRowToOption);
}

// PO line -> empty receiving grid row, with what is still outstanding.
function mapPurchaseOrderItemToLineItem(
  item: PurchaseOrderItemRow,
): StartReceivingLineItemValue {
  const sku = unwrapOne(item.skus);
  const orderedQty = Number(item.ordered_qty ?? 0);
  const receivedQty = Number(item.received_qty ?? 0);

  return {
    purchase_order_item_id: item.id,
    sku_id: item.sku_id,
    sku_code: sku?.sku_code ?? "",
    item_name: sku?.name ?? "Unknown Item",
    ordered_qty: orderedQty,
    received_qty_so_far: receivedQty,
    remaining_qty: Math.max(orderedQty - receivedQty, 0),
    qty_received: 0,
    qty_rejected: 0,
    variance_reason: NO_VARIANCE_REASON,
  };
}

export function mapPurchaseOrderToLoadedPayload(
  purchaseOrder: PurchaseOrderWithItemsRow,
): StartReceivingLoadedPoPayload {
  return {
    purchase_order_id: purchaseOrder.id,
    po_number: purchaseOrder.po_number,
    supplier_name: unwrapOne(purchaseOrder.suppliers)?.name ?? null,
    expected_delivery_date: purchaseOrder.expected_delivery_date,
    status: purchaseOrder.status,
    line_items: (purchaseOrder.purchase_order_items ?? []).map(
      mapPurchaseOrderItemToLineItem,
    ),
  };
}
