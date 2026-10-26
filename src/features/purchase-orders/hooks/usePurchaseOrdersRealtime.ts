import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { createBrowserSupabaseClient } from "@/src/db/supabaseBrowser";

// Refetches the purchase orders table when any purchase order changes.
export function usePurchaseOrdersRealtime() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const supabase = createBrowserSupabaseClient();
    const channel = supabase
      .channel("purchase-orders-live")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "purchase_orders",
        },
        () => {
          void queryClient.invalidateQueries({
            queryKey: ["purchase-orders-table"],
          });
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [queryClient]);
}
