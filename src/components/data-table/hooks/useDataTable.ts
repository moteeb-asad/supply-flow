import { useState } from "react";

export default function useDataTable<
  T extends { id: string | number },
  P extends {
    page: number;
    pageSize: number;
    search?: string;
    filters?: Record<string, unknown>;
  },
>(initialFilters: Record<string, unknown>) {
  const [search, setSearch] = useState("");
  const [draftFilters, setDraftFilters] = useState(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState(initialFilters);
  const [pagination, setPagination] = useState({ page: 1, pageSize: 10 });

  const applyFilters = () => {
    setAppliedFilters(draftFilters);
  };

  const clearFilters = () => {
    setDraftFilters({});
    setAppliedFilters({});
  };

  const params = {
    page: pagination.page,
    pageSize: pagination.pageSize,
    search,
    filters: appliedFilters,
  };

  return {
    search,
    setSearch,
    draftFilters,
    setDraftFilters,
    appliedFilters,
    applyFilters,
    clearFilters,
    pagination,
    setPagination,
    params,
  };
}
