import { useQuery } from "@tanstack/react-query";
import { PurchaseOrder } from "../types/purchase-orders.types";
import { getPurchaseOrderAction } from "../actions/get-purchaseorder.action";

export function usePurchaseOrder(purchaseOrderId: string) {
  return useQuery<PurchaseOrder | null>({
    queryKey: ["purchaseOrder", purchaseOrderId],
    queryFn: () => getPurchaseOrderAction(purchaseOrderId),
    enabled: !!purchaseOrderId,
  });
}
