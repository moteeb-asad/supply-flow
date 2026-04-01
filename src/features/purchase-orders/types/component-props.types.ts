import type { ReactNode } from "react";
import type {
  CreatePurchaseOrderStatus,
  PaymentMethod,
  PurchaseOrder,
  PurchaseOrderDetailLineItem,
  PurchaseOrderLineItemFormValue,
  ShippingMethod,
} from "./domain.types";
import type {
  PurchaseOrderFormValues,
  PurchaseOrderSidebarMode,
} from "./form.types";

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
  onLineItemsChange?: (items: PurchaseOrderLineItemFormValue[]) => void;
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

export type LineItemsSectionProps = {
  onAddItemClick?: () => void;
  initialItems?: PurchaseOrderLineItemFormValue[];
  onLineItemsChange?: (items: PurchaseOrderLineItemFormValue[]) => void;
  error?: string;
};

export type AddItemFormProps = {
  onSubmit: (values: PurchaseOrderLineItemFormValue) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  submitError?: string | null;
};

export type AddItemModalProps = {
  open: boolean;
  onClose: () => void;
  onAddItem: (item: PurchaseOrderLineItemFormValue) => void;
  isSubmitting?: boolean;
  submitError?: string | null;
};

export type OrderDetailsSectionProps = {
  orderDate?: string;
  expectedDeliveryDate?: string;
  shippingMethod?: ShippingMethod;
  paymentMethod?: PaymentMethod;
  onPaymentMethodChange?: (value: PaymentMethod) => void;
  status?: CreatePurchaseOrderStatus;
  errors?: {
    orderDate?: string;
    expectedDeliveryDate?: string;
    shippingMethod?: string;
    paymentMethod?: string;
    status?: string;
  };
};

export type TotalAmountSectionProps = {
  subtotal: number;
  taxAmount: number;
  taxLabel: string;
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

export type TimelineEvent = {
  id: string;
  label: string;
  timestamp: string;
  details?: string;
  isPending?: boolean;
};
