import SuppliersScreen from "@/src/features/suppliers/components/suppliers-screen";
import { getSuppliersAction } from "@/src/features/suppliers/actions/get-suppliers.action";

export default async function SuppliersPage() {
  const suppliers = await getSuppliersAction();

  return <SuppliersScreen suppliers={suppliers} />;
}
