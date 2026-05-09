import { Suspense } from "react";
import InventoryManagementScreen from "@/src/features/inventory/components/screen/InventoryManagementScreen";

export default function InventoryPage() {
  return (
    <Suspense
      fallback={
        <div className="px-8 py-6 text-sm text-[#4e6797]">
          Loading inventory...
        </div>
      }
    >
      <InventoryManagementScreen />
    </Suspense>
  );
}
