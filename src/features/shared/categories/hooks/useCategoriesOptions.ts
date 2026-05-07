import { useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getCategoriesAction } from "../actions/get-categories.action";

type UseCategoriesOptionsArgs = {
  search?: string;
  pageSize?: number;
};

const DEFAULT_PAGE_SIZE = 8;

export default function useCategoriesOptions({
  search = "",
  pageSize = DEFAULT_PAGE_SIZE,
}: UseCategoriesOptionsArgs) {
  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useInfiniteQuery({
      queryKey: ["category-picker", search, pageSize],
      initialPageParam: 0,
      queryFn: ({ pageParam }) =>
        getCategoriesAction({
          search,
          limit: pageSize,
          offset: pageParam,
        }),
      getNextPageParam: (lastPage) => lastPage.nextOffset ?? undefined,
      staleTime: 60_000,
    });

  const options = useMemo(
    () => data?.pages.flatMap((page) => page.items) ?? [],
    [data],
  );

  return {
    options,
    isLoading,
    isFetchingNextPage,
    hasNextPage: Boolean(hasNextPage),
    fetchNextPage,
  };
}
