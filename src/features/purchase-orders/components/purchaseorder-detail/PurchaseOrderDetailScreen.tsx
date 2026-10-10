"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { PurchaseOrderDetailScreenProps } from "../../types";
import EditPurchaseOrderDrawer from "../edit-po/EditPurchaseOrderDrawer";
import PurchaseOrderHeader from "./header/PurchaseOrderHeader";
import LineItemsTable from "./sections/LineItemsTable";
import OrderActivityTimeline from "./sections/OrderActivityTimeline";
import PurchaseOrderNotesCard from "./sections/PurchaseOrderNotesCard";
import QuickStatsCards from "./sections/QuickStatsCards";
import SupplierInformationCard from "./sections/SupplierInformationCard";

export default function PurchaseOrderDetailScreen({
  purchaseOrder,
}: PurchaseOrderDetailScreenProps) {
  const router = useRouter();
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);

  return (
    <>
      <PurchaseOrderHeader
        onEditClick={() => setIsEditDrawerOpen(true)}
        purchaseOrder={purchaseOrder}
      />
      <div className="flex-1 px-6 pb-6">
        <div className="mx-auto max-w-7xl space-y-5">
          <QuickStatsCards purchaseOrder={purchaseOrder} />

          <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
            <LineItemsTable lineItems={purchaseOrder.lineItems ?? []} />
            <div className="grid content-start gap-5 md:grid-cols-2 xl:grid-cols-1">
              <OrderActivityTimeline purchaseOrder={purchaseOrder} />
              <SupplierInformationCard purchaseOrder={purchaseOrder} />
              <PurchaseOrderNotesCard notes={purchaseOrder.notes} />
            </div>
          </div>
        </div>
      </div>

      {isEditDrawerOpen ? (
        <EditPurchaseOrderDrawer
          onClose={() => setIsEditDrawerOpen(false)}
          onSuccess={() => {
            setIsEditDrawerOpen(false);
            router.refresh();
          }}
          purchaseOrder={purchaseOrder}
        />
      ) : null}
    </>
  );
}
