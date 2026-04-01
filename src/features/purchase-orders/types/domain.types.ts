export type PurchaseOrderStatus =
  | "draft"
  | "pending"
  | "partially_received"
  | "closed"
  | "cancelled"
  | "overdue";

export type ShippingMethod = "standard" | "express" | "economy";
export type PaymentMethod = "cod" | "card";

export type CreatePurchaseOrderStatus =
  | "draft"
  | "pending"
  | "partially_received"
  | "closed"
  | "cancelled"
  | "overdue";

export type PurchaseOrdersDateRangeFilter =
  | "last_24_hours"
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
  payment_method: PaymentMethod;
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

export type PurchaseOrderLineItemFormValue = {
  skuName: string;
  quantity: number;
  unitPrice: number;
};

export type PurchaseOrderSupplierOption = {
  id: string;
  name: string;
  category: string | null;
  status: "active" | "inactive" | string | null;
};

export type PurchaseOrderSkuOption = {
  id: string;
  sku_code: string;
  name: string;
  unit: string | null;
};
