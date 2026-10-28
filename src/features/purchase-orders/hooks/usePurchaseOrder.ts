import { useQuery } from "@tanstack/react-query";
import { purchaseOrderKeys } from "@/src/features/purchase-orders/constants/query-keys";
import { PurchaseOrder } from "../types";
import { getPurchaseOrderAction } from "../actions/get-purchaseorder.action";

export function usePurchaseOrder(purchaseOrderId: string) {
  return useQuery<PurchaseOrder | null>({
    queryKey: purchaseOrderKeys.detail(purchaseOrderId),
    queryFn: () => getPurchaseOrderAction(purchaseOrderId),
    enabled: !!purchaseOrderId,
  });
}
