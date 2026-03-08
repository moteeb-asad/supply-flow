import SupplierDetailScreen from "@/src/features/suppliers/components/supplier-detail/SupplierDetailScreen";
import { getSupplierAction } from "@/src/features/suppliers/actions/get-supplier.action";
import { notFound } from "next/navigation";

type SupplierDetailPageProps = {
  params: Promise<{ supplierId: string }>;
};

export default async function SupplierDetailPage({
  params,
}: SupplierDetailPageProps) {
  const { supplierId } = await params;

  if (!supplierId || supplierId === "undefined") {
    notFound();
  }

  const supplier = await getSupplierAction(supplierId);

  if (!supplier) {
    notFound();
  }

  return <SupplierDetailScreen supplier={supplier} />;
}
