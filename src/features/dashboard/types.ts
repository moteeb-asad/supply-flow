// Row returned by public.get_dashboard_metrics().
export type DashboardMetrics = {
  open_po_count: number;
  draft_po_count: number;
  pending_delivery_count: number;
  urgent_delivery_count: number;
  low_stock_count: number;
  critical_stock_count: number;
  spend_mtd: number;
  spend_prev_period: number;
};

// Row returned by public.get_recent_receiving_activity().
export type RecentReceivingActivityItem = {
  line_item_id: string;
  receiving_id: string;
  receipt_datetime: string;
  receipt_status: string;
  po_number: string;
  supplier_name: string | null;
  sku_code: string;
  sku_name: string;
  unit: string | null;
  qty_received: number;
  qty_rejected: number;
};
