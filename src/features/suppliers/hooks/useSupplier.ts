import { useQuery } from "@tanstack/react-query";
import { getSupplierAction } from "@/src/features/suppliers/actions/get-supplier.action";
import type { Supplier } from "@/src/features/suppliers/types/suppliers.types";

export function useSupplier(supplierId: string) {
  return useQuery<Supplier | null>({
    queryKey: ["supplier", supplierId],
    queryFn: () => getSupplierAction(supplierId),
    enabled: !!supplierId,
  });
}
