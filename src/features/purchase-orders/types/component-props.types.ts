import type {
  CreatePurchaseOrderStatus,
  PaymentMethod,
  PurchaseOrder,
  PurchaseOrderDetailLineItem,
  PurchaseOrderLineItemFormValue,
  ShippingMethod,
} from "./domain.types";

export type CreatePurchaseOrderDrawerProps = {
  onClose?: () => void;
  onAddItemClick?: () => void;
  onSuccess?: () => void;
};

export type EditPurchaseOrderDrawerProps = {
  purchaseOrder: PurchaseOrder;
  onClose?: () => void;
  onAddItemClick?: () => void;
  onSuccess?: () => void;
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

export type TotalAmountSectionProps = {
  subtotal: number;
  taxAmount: number;
  taxLabel: string;
  totalAmount: number;
  submitLabel: string;
  onCancel?: () => void;
  isSubmitting?: boolean;
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
