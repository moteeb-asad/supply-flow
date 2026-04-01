import PurchaseOrderDetailScreen from "@/src/features/purchase-orders/components/purchaseorder-detail/PurchaseOrderDetailScreen";
import { getPurchaseOrderAction } from "@/src/features/purchase-orders/actions/get-purchaseorder.action";
import { notFound } from "next/navigation";

type PurchaseOrderDetailPageProps = {
  params: Promise<{ poId: string }>;
};

export default async function PurchaseOrderDetailPage({
  params,
}: PurchaseOrderDetailPageProps) {
  const { poId } = await params;

  if (!poId || poId === "undefined") {
    notFound();
  }

  const purchaseOrder = await getPurchaseOrderAction(poId);

  if (!purchaseOrder) {
    notFound();
  }

  return <PurchaseOrderDetailScreen purchaseOrder={purchaseOrder} />;
}
