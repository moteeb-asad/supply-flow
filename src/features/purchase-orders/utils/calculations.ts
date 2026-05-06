import type {
  PaymentMethod,
  PurchaseOrderLineItemFormValue,
} from "../types/domain.types";

export type PurchaseOrderTotals = {
  subtotal: number;
  taxRate: number;
  taxLabel: string;
  taxAmount: number;
  totalAmount: number;
};

export function calculatePurchaseOrderTotals(
  lineItems: PurchaseOrderLineItemFormValue[],
  paymentMethod: PaymentMethod,
): PurchaseOrderTotals {
  const subtotal = lineItems.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0,
  );
  const taxRate = paymentMethod === "card" ? 0.05 : 0.16;
  const taxLabel = paymentMethod === "card" ? "GST (5%)" : "GST (16%)";
  const taxAmount = Number((subtotal * taxRate).toFixed(2));
  const totalAmount = Number((subtotal + taxAmount).toFixed(2));

  return {
    subtotal,
    taxRate,
    taxLabel,
    taxAmount,
    totalAmount,
  };
}
