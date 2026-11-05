import { useState, useMemo, useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getReceivablePurchaseOrdersAction } from "../../actions/get-receivable-purchase-orders.action";
import { getPurchaseOrderWithItemsAction } from "../../actions/get-purchase-order-with-items.action";
import { purchaseOrderKeys } from "@/src/features/purchase-orders/constants/query-keys";
import { mapPurchaseOrderToLoadedPayload } from "../../mappers/purchase-order.mapper";
import { formatDate } from "@/src/lib/dates";
import { Button } from "@/src/components/ui/Button";
import { StatusPill } from "@/src/components/ui/StatusPill";
import type { PoLookupSectionProps, PurchaseOrderOption } from "../../types";

const PAGE_SIZE = 5;

export default function PoLookupSection({ onPoLoaded }: PoLookupSectionProps) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [selectedPO, setSelectedPO] = useState<PurchaseOrderOption | null>(
    null,
  );
  const [loadedPO, setLoadedPO] = useState<PurchaseOrderOption | null>(null);

  useEffect(() => {
    const handle = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 280);
    return () => clearTimeout(handle);
  }, [query]);

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useInfiniteQuery({
      queryKey: purchaseOrderKeys.receivable(debouncedQuery),
      initialPageParam: 0,
      queryFn: ({ pageParam }) =>
        getReceivablePurchaseOrdersAction({
          search: debouncedQuery,
          limit: PAGE_SIZE,
          offset: pageParam,
        }),
      getNextPageParam: (lastPage) => lastPage.nextOffset ?? undefined,
      staleTime: 60_000,
    });

  const options = useMemo(
    () => data?.pages.flatMap((page) => page.items) ?? [],
    [data],
  );

  // Load the next page of POs when the dropdown is scrolled near its bottom.
  const handleDropdownScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = event.currentTarget;
    const isNearBottom = scrollTop + clientHeight >= scrollHeight - 24;
    if (isNearBottom && hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  };

  const clearLoadedPo = () => {
    onPoLoaded({
      purchase_order_id: "",
      po_number: "",
      supplier_name: null,
      expected_delivery_date: null,
      status: "",
      line_items: [],
    });
  };

  const handleClearSelection = () => {
    setSelectedPO(null);
    setLoadedPO(null);
    setQuery("");
    clearLoadedPo();
    setOpen(false);
  };

  const handleSelectPO = (purchaseOrder: PurchaseOrderOption) => {
    setSelectedPO(purchaseOrder);
    setQuery(purchaseOrder.po_number);
    setOpen(false);
  };

  const handleOptionPointerDown = (
    event: React.PointerEvent<HTMLButtonElement>,
    purchaseOrder: PurchaseOrderOption,
  ) => {
    event.preventDefault();
    handleSelectPO(purchaseOrder);
  };

  const handleOptionMouseDown = (
    event: React.MouseEvent<HTMLButtonElement>,
    purchaseOrder: PurchaseOrderOption,
  ) => {
    event.preventDefault();
    handleSelectPO(purchaseOrder);
  };

  const handleSearchButtonClick = async () => {
    if (!selectedPO) return;
    setLoadedPO(selectedPO);
    setIsLoadingDetails(true);

    const data = await getPurchaseOrderWithItemsAction(selectedPO.id);
    if (data) {
      const payload = mapPurchaseOrderToLoadedPayload(data);

      setLoadedPO({
        ...selectedPO,
        supplier_name: payload.supplier_name ?? "Unknown Supplier",
        expected_delivery_date: payload.expected_delivery_date,
        status: payload.status,
      });

      onPoLoaded(payload);
    }

    setIsLoadingDetails(false);
    setOpen(false);
  };

  const canClear = Boolean(selectedPO || query);

  return (
    <section aria-labelledby="receiving-po" className="space-y-3">
      <h3 id="receiving-po" className="text-[13px] font-semibold">
        Purchase order
      </h3>
      <div className="flex gap-2">
        <div className="relative min-w-0 flex-1">
          <label htmlFor="receiving-po-number" className="sr-only">
            PO number
          </label>
          <input
            id="receiving-po-number"
            className="h-9 w-full rounded-control border border-line bg-surface px-3 pr-9 font-mono text-[13px] uppercase text-ink placeholder:font-sans placeholder:normal-case placeholder:text-subtle focus:border-primary focus:outline-none focus:ring-3 focus:ring-primary/15"
            placeholder="Enter PO number"
            type="text"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setSelectedPO(null);
              setLoadedPO(null);
              clearLoadedPo();
              setOpen(true);
            }}
            onBlur={() => {
              setTimeout(() => setOpen(false), 120);
            }}
            onFocus={() => setOpen(true)}
          />
          {canClear ? (
            <button
              aria-label="Clear PO selection"
              className="absolute inset-y-0 right-2.5 flex cursor-pointer items-center text-subtle hover:text-ink"
              onClick={handleClearSelection}
              type="button"
            >
              <span className="material-symbols-outlined !text-[15px] leading-none">
                close
              </span>
            </button>
          ) : null}
          {open ? (
            <div
              className="absolute left-0 right-0 top-full z-20 mt-1 max-h-60 overflow-y-auto rounded-card border border-line bg-surface p-1 shadow-overlay"
              onScroll={handleDropdownScroll}
            >
              {isLoading ? (
                <p className="px-2.5 py-2 text-[13px] text-muted">
                  Loading purchase orders...
                </p>
              ) : options.length === 0 ? (
                <p className="px-2.5 py-2 text-[13px] text-muted">
                  No purchase orders found.
                </p>
              ) : (
                options.map((purchaseOrder) => (
                  <button
                    className="w-full cursor-pointer rounded-[6px] px-2.5 py-2 text-left hover:bg-background-light"
                    key={purchaseOrder.id}
                    type="button"
                    onMouseDown={(event) =>
                      handleOptionMouseDown(event, purchaseOrder)
                    }
                    onPointerDown={(event) =>
                      handleOptionPointerDown(event, purchaseOrder)
                    }
                  >
                    <p className="font-mono text-[13px] font-medium text-ink">
                      {purchaseOrder.po_number}
                    </p>
                    {purchaseOrder.status ? (
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-subtle">
                          {purchaseOrder.expected_delivery_date}
                        </p>
                        <p className="text-xs capitalize text-subtle">
                          {purchaseOrder.status}
                        </p>
                      </div>
                    ) : null}
                  </button>
                ))
              )}
              {isFetchingNextPage ? (
                <p className="px-2.5 py-2 text-[13px] text-muted">
                  Loading more purchase orders...
                </p>
              ) : null}
              {!hasNextPage && options.length > 0 ? (
                <p className="px-2.5 py-1.5 text-center text-xs text-subtle">
                  End of purchase order list
                </p>
              ) : null}
            </div>
          ) : null}
        </div>
        <Button
          variant="secondary"
          size="md"
          onClick={handleSearchButtonClick}
          type="button"
          disabled={!selectedPO || isLoading || isLoadingDetails}
        >
          Load
        </Button>
      </div>
      {loadedPO ? (
        <div className="flex items-center justify-between gap-4 rounded-card bg-background-light px-4 py-3">
          <div className="min-w-0">
            <p className="text-sm font-medium">
              {loadedPO.supplier_name ?? "Unknown Supplier"}
            </p>
            <p className="mt-0.5 text-xs text-muted">
              Expected {formatDate(loadedPO.expected_delivery_date)}.
            </p>
          </div>
          <StatusPill
            status={loadedPO.status ?? "unknown"}
            className="shrink-0"
          />
        </div>
      ) : null}
    </section>
  );
}
