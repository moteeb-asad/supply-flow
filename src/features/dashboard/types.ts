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
