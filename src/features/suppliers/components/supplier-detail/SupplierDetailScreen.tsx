import SupplierHeader from "./header/SupplierHeader";
import type { SupplierDetailScreenProps } from "@/src/features/suppliers/types/suppliers.types";

export default function SupplierDetailScreen({
  supplier,
}: SupplierDetailScreenProps) {
  return (
    <>
      <SupplierHeader supplier={supplier} />
    </>
  );
}
