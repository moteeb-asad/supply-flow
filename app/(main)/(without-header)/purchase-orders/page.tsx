import { Suspense } from "react";
import PurchaseOrdersScreen from "@/src/features/purchase-orders/components/screen/PurchaseOrdersScreen";

export default function PurchaseOrdersPage() {
  return (
    <Suspense
      fallback={
        <div className="px-8 py-6 text-sm text-[#4e6797]">
          Loading purchase orders...
        </div>
      }
    >
      <PurchaseOrdersScreen />
    </Suspense>
  );
}
