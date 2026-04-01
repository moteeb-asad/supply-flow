import SuppliersScreen from "@/src/features/suppliers/components/SuppliersScreen";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { getSuppliersAction } from "@/src/features/suppliers/actions/get-suppliers.action";
import type { SupplierCursor } from "@/src/features/suppliers/types/suppliers.types";
import { SUPPLIERS_PAGE_SIZE } from "@/src/features/suppliers/constants/pagination";

export default async function SuppliersPage() {
  // Temporarily disabled for testing skeleton
  // const queryClient = new QueryClient();

  // await queryClient.prefetchInfiniteQuery({
  //   queryKey: ["suppliers", { category: "all", search: "" }],
  //   queryFn: ({ pageParam }) =>
  //     getSuppliersAction({
  //       category: "all",
  //       search: "",
  //       cursor: (pageParam as SupplierCursor | null) ?? null,
  //       limit: SUPPLIERS_PAGE_SIZE,
  //     }),
  //   initialPageParam: null as SupplierCursor | null,
  //   getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  // });

  return <SuppliersScreen />;
  // return (
  //   <HydrationBoundary state={dehydrate(queryClient)}>
  //     <SuppliersScreen />
  //   </HydrationBoundary>
  // );
}
