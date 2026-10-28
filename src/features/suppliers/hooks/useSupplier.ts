import { useQuery } from "@tanstack/react-query";
import { supplierKeys } from "@/src/features/suppliers/constants/query-keys";
import { getSupplierAction } from "@/src/features/suppliers/actions/get-supplier.action";
import type { Supplier } from "@/src/features/suppliers/types/suppliers.types";

export function useSupplier(supplierId: string) {
  return useQuery<Supplier | null>({
    queryKey: supplierKeys.detail(supplierId),
    queryFn: () => getSupplierAction(supplierId),
    enabled: !!supplierId,
  });
}
