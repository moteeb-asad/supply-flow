export type SKUReceivingStatus =
  | "pending"
  | "in_progress"
  | "partially_received"
  | "received"
  | "variance_flagged"
  | "overdue";

export type SkuReceivingItem = {
  id: string;
  po_number: string;
  supplier_id: string;
};
