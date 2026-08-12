import { Suspense } from "react";
import SkuReceivingScreen from "@/src/features/sku-receiving/components/screen/SkuReceivingScreen";

export default function SkuReceivingPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SkuReceivingScreen />
    </Suspense>
  );
}
