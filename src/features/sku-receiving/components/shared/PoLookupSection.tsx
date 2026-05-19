import { useState, useMemo, useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getPurchaseOrderForReceivingAction } from "@/src/features/sku-receiving/actions/getPurchaseOrderForReceivingAction";
import type { PurchaseOrderOption } from "@/src/features/sku-receiving/types";
import { formatDate } from "@/src/lib/utils";
const PAGE_SIZE = 5;

export default function PoLookupSection() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [open, setOpen] = useState(false);
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
      queryKey: ["po-lookup-suggestions", debouncedQuery],
      initialPageParam: 0,
      queryFn: ({ pageParam }) =>
        getPurchaseOrderForReceivingAction({
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

  const handleClearSelection = () => {
    setSelectedPO(null);
    setLoadedPO(null);
    setQuery("");
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

  const handleSearchButtonClick = () => {
    if (!selectedPO) return;
    setLoadedPO(selectedPO);
    setOpen(false);
  };

  const canClear = Boolean(selectedPO || query);

  return (
    <>
      <section className="space-y-5">
        <div className="mb-1 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-lg">
            search
          </span>
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#4e6797]">
            PO LOOKUP
          </h3>
        </div>
        <div className="grid grid-cols-12 gap-3 items-end">
          <div className="col-span-8 space-y-1.5">
            <label className="text-sm font-semibold text-[#0e121b]">
              PO Number <span className="text-red-600">*</span>
            </label>
            <div className="relative">
              <input
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-[#0e121b] outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-primary uppercase placeholder:capitalize"
                placeholder="Enter PO reference..."
                type="text"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setSelectedPO(null);
                  setLoadedPO(null);
                  setOpen(true);
                }}
                onBlur={() => {
                  setTimeout(() => setOpen(false), 120);
                }}
                onFocus={() => setOpen(true)}
              />
              {canClear ? (
                <button
                  aria-label="Clear selected category"
                  className="absolute inset-y-0 right-3 flex items-center text-[#4e6797] transition-colors hover:text-[#0e121b] cursor-pointer"
                  onClick={handleClearSelection}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[15px] leading-none">
                    close
                  </span>
                </button>
              ) : null}
              {open ? (
                <div className="absolute left-0 right-0 top-full z-20 mt-1 max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
                  {isLoading ? (
                    <p className="px-4 py-3 text-sm text-[#4e6797]">
                      Loading purchase orders...
                    </p>
                  ) : options.length === 0 ? (
                    <p className="px-4 py-3 text-sm text-[#4e6797]">
                      No purchase orders found.
                    </p>
                  ) : (
                    options.map((purchaseOrder) => (
                      <button
                        className="w-full border-b border-gray-100 px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-gray-50 cursor-pointer"
                        key={purchaseOrder.id}
                        type="button"
                        onMouseDown={(event) =>
                          handleOptionMouseDown(event, purchaseOrder)
                        }
                        onPointerDown={(event) =>
                          handleOptionPointerDown(event, purchaseOrder)
                        }
                      >
                        <p className="text-sm font-semibold text-[#0e121b]">
                          {purchaseOrder.po_number}
                        </p>
                        {purchaseOrder.status ? (
                          <div className="flex justify-between items-center">
                            <p className="text-xs text-[#4e6797]">
                              {purchaseOrder.expected_delivery_date}
                            </p>
                            <p className="text-xs text-[#4e6797] capitalize">
                              {purchaseOrder.status}
                            </p>
                          </div>
                        ) : null}
                      </button>
                    ))
                  )}
                  {isFetchingNextPage ? (
                    <p className="px-4 py-3 text-sm text-[#4e6797]">
                      Loading more purchase orders...
                    </p>
                  ) : null}
                  {!hasNextPage && options.length > 0 ? (
                    <p className="px-4 py-2 text-center text-xs text-[#4e6797]">
                      End of purchase order list
                    </p>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>
          <div className="col-span-4">
            <button
              className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-bold flex items-center justify-center gap-2 text-white shadow-md transition-colors hover:bg-blue-700 active:scale-[0.98] cursor-pointer disabled:bg-gray-500 disabled:opacity-50 disabled:text-gray-100 disabled:cursor-not-allowed"
              onClick={handleSearchButtonClick}
              type="button"
              disabled={!selectedPO || isLoading}
            >
              <span className="material-symbols-outlined text-sm">sync</span>
              Search/Load
            </button>
          </div>
        </div>
        {loadedPO ? (
          <div className="grid grid-cols-3 gap-4 rounded-lg border border-gray-200 bg-slate-50 p-4">
            <div>
              <p className="mb-1 text-[10px] font-bold uppercase text-[#4e6797]">
                Supplier
              </p>
              <p className="text-sm font-semibold text-[#0e121b]">
                {loadedPO.supplier_name ?? "Unknown Supplier"}
              </p>
            </div>
            <div>
              <p className="mb-1 text-[10px] font-bold uppercase text-[#4e6797]">
                Exp. Delivery
              </p>
              <p className="text-sm font-semibold text-[#0e121b]">
                {formatDate(loadedPO.expected_delivery_date)}
              </p>
            </div>
            <div>
              <p className="mb-1 text-[10px] font-bold uppercase text-[#4e6797]">
                PO Status
              </p>
              <span className="inline-flex items-center rounded bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700 capitalize">
                {loadedPO.status ?? "unknown"}
              </span>
            </div>
          </div>
        ) : null}
      </section>
    </>
  );
}
