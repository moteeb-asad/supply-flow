"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { getSuppliersAction } from "@/src/features/suppliers/actions/get-suppliers.action";
import type {
  UseSuppliersParams,
  Supplier,
  SupplierCursor,
  SuppliersPage,
} from "@/src/features/suppliers/types/suppliers.types";
import { SUPPLIERS_PAGE_SIZE } from "@/src/features/suppliers/constants/pagination";

export function useSuppliers({ category, search }: UseSuppliersParams) {
  const query = useInfiniteQuery({
    queryKey: ["suppliers", { category, search }],
    queryFn: ({ pageParam }) =>
      getSuppliersAction({
        category,
        search,
        cursor: (pageParam as SupplierCursor | null) ?? null,
        limit: SUPPLIERS_PAGE_SIZE,
      }),
    initialPageParam: null as SupplierCursor | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    staleTime: 5 * 60_000, // 5 minutes
    gcTime: 30 * 60_000, // 30 minutes
    refetchOnWindowFocus: false,
  });

  const suppliers = useMemo<Supplier[]>(() => {
    const pages = query.data?.pages ?? [];
    return pages.flatMap((page: SuppliersPage) => page.suppliers);
  }, [query.data?.pages]);

  return {
    suppliers,
    fetchNextPage: query.fetchNextPage,
    hasNextPage: query.hasNextPage,
    isFetching: query.isFetching,
    isLoading: query.isLoading,
  };
}
