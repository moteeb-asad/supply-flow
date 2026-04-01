import type {
  CreatePurchaseOrderStatus,
  PaymentMethod,
  PurchaseOrderLineItemFormValue,
  ShippingMethod,
} from "./domain.types";

export type CreatePurchaseOrderInput = {
  supplierId: string;
  supplierName: string;
  orderDate: string;
  expectedDeliveryDate?: string;
  shippingMethod: ShippingMethod;
  paymentMethod: PaymentMethod;
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
  paymentMethod: PaymentMethod;
  status: CreatePurchaseOrderStatus;
  notes: string;
  lineItems: PurchaseOrderLineItemFormValue[];
};

export type PurchaseOrderSidebarMode = "create" | "edit";

export type AddItemFormValues = PurchaseOrderLineItemFormValue;
