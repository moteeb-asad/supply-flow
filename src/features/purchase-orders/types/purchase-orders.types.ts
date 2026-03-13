import type { ReactNode } from "react";

export type PurchaseOrderStatus =
  | "draft"
  | "pending"
  | "partially_received"
  | "closed"
  | "cancelled"
  | "overdue";

export type ShippingMethod = "standard" | "express" | "economy";

export type PurchaseOrdersDateRangeFilter =
  | "last_7_days"
  | "last_30_days"
  | "this_month"
  | "this_quarter";

export type PurchaseOrderSupplierRelation =
  | { name: string | null }
  | { name: string | null }[]
  | null;

export type PurchaseOrder = {
  id: string;
  po_number: string;
  supplier_id: string;
  supplier_name: string;
  order_date: string | null;
  expected_delivery_date: string | null;
  total_amount: number;
  status: PurchaseOrderStatus;
};

export type PurchaseOrdersQueryParams = {
  page: number;
  pageSize: number;
  search?: string;
  filters?: Record<string, unknown>;
};

export type PurchaseOrdersFiltersValue = {
  status?: PurchaseOrderStatus;
  dateRange?: PurchaseOrdersDateRangeFilter;
};

export type PurchaseOrdersFiltersProps = {
  value: Record<string, unknown>;
  onChange: (filters: Record<string, unknown>) => void;
};

export type PurchaseOrderLineItemFormValue = {
  skuName: string;
  quantity: number;
  unitPrice: number;
};

export type CreatePurchaseOrderInput = {
  supplierId: string;
  supplierName: string;
  orderDate: string;
  expectedDeliveryDate?: string;
  shippingMethod: ShippingMethod;
  lineItems: PurchaseOrderLineItemFormValue[];
};

export type CreatePurchaseOrderActionResult = {
  success: boolean;
  error?: string;
  purchaseOrderId?: string;
};

export type PurchaseOrderFormValues = {
  supplierId: string;
  supplierName: string;
  orderDate: string;
  expectedDeliveryDate: string;
  shippingMethod: ShippingMethod;
  lineItems: PurchaseOrderLineItemFormValue[];
};

export type PurchaseOrderSidebarMode = "create" | "edit";

export type PurchaseOrderRow = {
  id: string;
  po_number: string;
  supplier_id: string;
  order_date: string | null;
  expected_delivery_date: string | null;
  total_amount: number | string | null;
  status: PurchaseOrderStatus;
  suppliers: PurchaseOrderSupplierRelation;
};

export type PurchaseOrderSidebarShellProps = {
  title: string;
  description: string;
  onClose?: () => void;
  children: ReactNode;
};

export type PurchaseOrderFormProps = {
  mode: PurchaseOrderSidebarMode;
  initialValues?: Partial<PurchaseOrderFormValues>;
  onSubmit?: (values: PurchaseOrderFormValues) => void;
  onCancel?: () => void;
  onAddItemClick?: () => void;
  isSubmitting?: boolean;
};

export type CreatePurchaseOrderSidebarProps = {
  onClose?: () => void;
  onAddItemClick?: () => void;
  onSuccess?: () => void;
};

export type EditPurchaseOrderSidebarProps = {
  purchaseOrder: PurchaseOrder;
  onClose?: () => void;
  onAddItemClick?: () => void;
  onSuccess?: () => void;
};

export type SupplierSelectionSectionProps = {
  supplierId?: string;
  supplierName?: string;
};

export type PurchaseOrderSupplierOption = {
  id: string;
  name: string;
  category: string | null;
  status: "active" | "inactive" | string | null;
};

export type GetPurchaseOrderSuppliersInput = {
  search?: string;
  limit?: number;
};

export type PurchaseOrderSkuOption = {
  id: string;
  sku_code: string;
  name: string;
  unit: string | null;
};

export type GetPurchaseOrderSkusInput = {
  search?: string;
  limit?: number;
};

export type LineItemsSectionProps = {
  onAddItemClick?: () => void;
  initialItems?: PurchaseOrderLineItemFormValue[];
};

export type AddItemFormValues = PurchaseOrderLineItemFormValue;

export type AddItemFormProps = {
  onSubmit: (values: AddItemFormValues) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
};

export type AddItemModalProps = {
  open: boolean;
  onClose: () => void;
  onAddItem: (item: AddItemFormValues) => void;
  isSubmitting?: boolean;
};

export type OrderDetailsSectionProps = {
  orderDate?: string;
  expectedDeliveryDate?: string;
  shippingMethod?: ShippingMethod;
};

export type TotalAmountSectionProps = {
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  submitLabel: string;
  onCancel?: () => void;
  isSubmitting?: boolean;
};
