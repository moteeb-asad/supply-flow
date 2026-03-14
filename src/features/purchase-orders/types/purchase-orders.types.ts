import type { ReactNode } from "react";

export type PurchaseOrderStatus =
  | "draft"
  | "pending"
  | "partially_received"
  | "closed"
  | "cancelled"
  | "overdue";

export type ShippingMethod = "standard" | "express" | "economy";

export type CreatePurchaseOrderStatus = "draft" | "pending";

export type PurchaseOrdersDateRangeFilter =
  | "last_7_days"
  | "last_30_days"
  | "this_month"
  | "this_quarter";

export type PurchaseOrderSupplierRelation =
  | {
      name: string | null;
      primary_contact_name?: string | null;
      primary_contact_email?: string | null;
      primary_contact_phone?: string | null;
    }
  | {
      name: string | null;
      primary_contact_name?: string | null;
      primary_contact_email?: string | null;
      primary_contact_phone?: string | null;
    }[]
  | null;

export type PurchaseOrder = {
  id: string;
  po_number: string;
  supplier_id: string;
  supplier_name: string;
  supplier_contact_name?: string | null;
  supplier_contact_email?: string | null;
  supplier_contact_phone?: string | null;
  order_date: string | null;
  expected_delivery_date: string | null;
  total_amount: number;
  status: PurchaseOrderStatus;
  notes?: string | null;
  lineItems?: PurchaseOrderDetailLineItem[];
};

export type PurchaseOrderItemSkuRelation =
  | { sku_code: string | null; name: string | null }
  | { sku_code: string | null; name: string | null }[]
  | null;

export type PurchaseOrderDetailLineItem = {
  id: string;
  ordered_qty: number;
  received_qty: number;
  unit_price: number;
  line_total: number;
  sku_code: string;
  sku_name: string;
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
  status: CreatePurchaseOrderStatus;
  notes?: string;
  lineItems: PurchaseOrderLineItemFormValue[];
};

export type CreatePurchaseOrderActionResult = {
  success: boolean;
  error?: string;
  validationErrors?: string[];
  purchaseOrderId?: string;
};

export type UpdatePurchaseOrderInput = {
  purchaseOrderId: string;
  values: CreatePurchaseOrderInput;
};

export type UpdatePurchaseOrderActionResult = {
  success: boolean;
  error?: string;
  validationErrors?: string[];
};

export type PurchaseOrderFormValues = {
  supplierId: string;
  supplierName: string;
  orderDate: string;
  expectedDeliveryDate: string;
  shippingMethod: ShippingMethod;
  status: CreatePurchaseOrderStatus;
  notes: string;
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
  error?: string;
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
  error?: string;
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
  status?: CreatePurchaseOrderStatus;
  errors?: {
    orderDate?: string;
    expectedDeliveryDate?: string;
    shippingMethod?: string;
    status?: string;
  };
};

export type TotalAmountSectionProps = {
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  submitLabel: string;
  onCancel?: () => void;
  isSubmitting?: boolean;
};

export type AdditionalNotesSectionProps = {
  notes?: string;
  error?: string;
};

export type PurchaseOrderDetailScreenProps = {
  purchaseOrder: PurchaseOrder;
};

export type PurchaseOrderHeaderProps = {
  purchaseOrder: PurchaseOrder;
  onEditClick?: () => void;
};

export type LineItemsTableProps = {
  lineItems: PurchaseOrderDetailLineItem[];
};
