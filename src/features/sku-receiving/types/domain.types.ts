import type { SKU_RECEIVING_STATUSES } from "../constants/statuses";

export type SKUReceivingStatus = (typeof SKU_RECEIVING_STATUSES)[number];

// Row of the public.sku_receivings_list view.
export type SkuReceivingItem = {
  id: string;
  purchase_order_id: string;
  po_number: string;
  supplier_id: string;
  supplier_name: string | null;
  receipt_datetime: string;
  receiving_location: string;
  status: SKUReceivingStatus;
  sku_count: number;
  qty_ordered: number;
  qty_received: number;
  qty_rejected: number;
  qty_expected: number;
};
