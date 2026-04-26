import { useState, useRef } from "react";

export default function useDataTableState<TFilters extends object>(
  initialFilters: TFilters,
) {
  const initialRef = useRef(initialFilters);

  const [draftFilters, setDraftFilters] = useState<TFilters>(initialFilters);
  const [appliedFilters, setAppliedFilters] =
    useState<TFilters>(initialFilters);

  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
  });

  const applyFilters = () => {
    setAppliedFilters(draftFilters);
    setPagination((p) => ({ ...p, page: 1 }));
  };

  const clearFilters = () => {
    setDraftFilters(initialRef.current);
    setAppliedFilters(initialRef.current);
    setPagination((p) => ({ ...p, page: 1 }));
  };

  return {
    draftFilters,
    setDraftFilters,
    appliedFilters,
    applyFilters,
    clearFilters,
    pagination,
    setPagination,
  };
}
