"use client";

import { useEffect, useState } from "react";
import type { CategoryPickerProps, SharedCategoryOption } from "../types";
import useCategoriesOptions from "../hooks/useCategoriesOptions";

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

  const { options, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useCategoriesOptions({ search: debouncedQuery, pageSize: PAGE_SIZE });

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
      {label ? (
        <label className="text-[13px] font-medium text-muted">{label}</label>
      ) : null}
      <div className="relative">
        <span className="pointer-events-none absolute inset-y-0 left-2.5 z-10 flex items-center text-subtle">
          <span className="material-symbols-outlined !text-[16px] leading-none">
            search
          </span>
        </span>
        <input
          className="h-9 w-full rounded-control border border-line bg-surface pl-8 pr-9 text-sm text-ink placeholder:text-subtle focus:border-primary focus:outline-none focus:ring-3 focus:ring-primary/15"
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
            className="absolute inset-y-0 right-2.5 flex cursor-pointer items-center text-subtle hover:text-ink"
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
            className="absolute left-0 right-0 top-full z-20 mt-1 max-h-60 overflow-y-auto rounded-card border border-line bg-surface p-1 shadow-overlay"
            onScroll={handleDropdownScroll}
          >
            {isLoading ? (
              <p className="px-2.5 py-2 text-[13px] text-muted">
                Loading categories...
              </p>
            ) : options.length === 0 ? (
              <p className="px-2.5 py-2 text-[13px] text-muted">
                No categories found.
              </p>
            ) : (
              options.map((category) => (
                <button
                  className="w-full cursor-pointer rounded-[6px] px-2.5 py-2 text-left hover:bg-background-light"
                  key={category.id}
                  onMouseDown={(event) =>
                    handleOptionMouseDown(event, category)
                  }
                  onPointerDown={(event) =>
                    handleOptionPointerDown(event, category)
                  }
                  type="button"
                >
                  <p className="text-[13px] font-medium text-ink">
                    {category.name}
                  </p>
                  {category.description ? (
                    <p className="text-xs text-subtle">
                      {category.description}
                    </p>
                  ) : null}
                </button>
              ))
            )}
            {isFetchingNextPage ? (
              <p className="px-2.5 py-2 text-[13px] text-muted">
                Loading more categories...
              </p>
            ) : null}
            {!hasNextPage && options.length > 0 ? (
              <p className="px-2.5 py-1.5 text-center text-xs text-subtle">
                End of category list
              </p>
            ) : null}
          </div>
        ) : null}
      </div>
      {error ? (
        <p className="text-xs text-danger">{error}</p>
      ) : selectedCategory ? (
        <p className="text-xs text-subtle">Selected: {selectedCategory.name}</p>
      ) : (
        <p className="text-xs text-subtle">Select a category from results.</p>
      )}
    </div>
  );
}
