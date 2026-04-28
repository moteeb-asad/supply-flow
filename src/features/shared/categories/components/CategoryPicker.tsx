"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { getCategoriesAction } from "../actions/get-categories.action";
import type { CategoryPickerProps, SharedCategoryOption } from "../types";

const PAGE_SIZE = 8;

export default function CategoryPicker({
  initialCategoryId,
  initialCategoryName,
  error,
  label = "Category",
  placeholder = "Search and select category...",
  categoryIdFieldName = "categoryId",
  categoryNameFieldName = "categoryName",
  onCategoryChange,
}: CategoryPickerProps) {
  const [query, setQuery] = useState(initialCategoryName ?? "");
  const [debouncedQuery, setDebouncedQuery] = useState(
    initialCategoryName ?? "",
  );
  const [selectedCategory, setSelectedCategory] =
    useState<SharedCategoryOption | null>(
      initialCategoryId && initialCategoryName
        ? {
            id: initialCategoryId,
            name: initialCategoryName,
            description: null,
          }
        : null,
    );
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handle = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 280);
    return () => clearTimeout(handle);
  }, [query]);

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useInfiniteQuery({
      queryKey: ["category-picker", debouncedQuery],
      initialPageParam: 0,
      queryFn: ({ pageParam }) =>
        getCategoriesAction({
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

  const handleSelectCategory = (category: SharedCategoryOption) => {
    setSelectedCategory(category);
    setQuery(category.name);
    setOpen(false);
    onCategoryChange?.(category);
  };

  const handleOptionPointerDown = (
    event: React.PointerEvent<HTMLButtonElement>,
    category: SharedCategoryOption,
  ) => {
    event.preventDefault();
    handleSelectCategory(category);
  };

  const handleOptionMouseDown = (
    event: React.MouseEvent<HTMLButtonElement>,
    category: SharedCategoryOption,
  ) => {
    event.preventDefault();
    handleSelectCategory(category);
  };

  const handleClearSelection = () => {
    setSelectedCategory(null);
    setQuery("");
    setOpen(false);
    onCategoryChange?.(null);
  };

  const handleDropdownScroll = (event: React.UIEvent<HTMLDivElement>) => {
    if (!hasNextPage || isFetchingNextPage) return;
    const container = event.currentTarget;
    const remaining =
      container.scrollHeight - container.scrollTop - container.clientHeight;
    if (remaining < 48) void fetchNextPage();
  };

  const canClear = Boolean(selectedCategory || query);

  return (
    <div className="space-y-1.5">
      <label className="text-sm font-semibold text-[#0e121b]">{label}</label>
      <div className="relative">
        <span className="pointer-events-none absolute inset-y-0 left-3 z-10 flex items-center text-[#4e6797]">
          <span className="material-symbols-outlined text-[18px] leading-none">
            search
          </span>
        </span>
        <input
          className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-10 text-sm text-[#0e121b] outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-primary"
          onChange={(event) => {
            setQuery(event.target.value);
            setSelectedCategory(null);
            setOpen(true);
            onCategoryChange?.(null);
          }}
          onBlur={() => {
            setTimeout(() => setOpen(false), 120);
          }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          type="text"
          value={query}
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
        <input
          name={categoryIdFieldName}
          type="hidden"
          value={selectedCategory?.id ?? ""}
        />
        <input
          name={categoryNameFieldName}
          type="hidden"
          value={selectedCategory?.name ?? query}
        />
        {open ? (
          <div
            className="absolute left-0 right-0 top-full z-20 mt-1 max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg"
            onScroll={handleDropdownScroll}
          >
            {isLoading ? (
              <p className="px-4 py-3 text-sm text-[#4e6797]">
                Loading categories...
              </p>
            ) : options.length === 0 ? (
              <p className="px-4 py-3 text-sm text-[#4e6797]">
                No categories found.
              </p>
            ) : (
              options.map((category) => (
                <button
                  className="w-full border-b border-gray-100 px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-gray-50 cursor-pointer"
                  key={category.id}
                  onMouseDown={(event) =>
                    handleOptionMouseDown(event, category)
                  }
                  onPointerDown={(event) =>
                    handleOptionPointerDown(event, category)
                  }
                  type="button"
                >
                  <p className="text-sm font-semibold text-[#0e121b]">
                    {category.name}
                  </p>
                  {category.description ? (
                    <p className="text-xs text-[#4e6797]">
                      {category.description}
                    </p>
                  ) : null}
                </button>
              ))
            )}
            {isFetchingNextPage ? (
              <p className="px-4 py-3 text-sm text-[#4e6797]">
                Loading more categories...
              </p>
            ) : null}
            {!hasNextPage && options.length > 0 ? (
              <p className="px-4 py-2 text-center text-xs text-[#4e6797]">
                End of category list
              </p>
            ) : null}
          </div>
        ) : null}
      </div>
      {error ? (
        <p className="text-xs text-red-600">{error}</p>
      ) : selectedCategory ? (
        <p className="text-xs text-[#4e6797]">
          Selected: {selectedCategory.name}
        </p>
      ) : (
        <p className="text-xs text-[#4e6797]">
          Select a category from results.
        </p>
      )}
    </div>
  );
}
