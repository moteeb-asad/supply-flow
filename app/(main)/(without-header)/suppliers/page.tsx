import SuppliersScreen from "@/src/features/suppliers/components/suppliers-screen";
import { getSuppliersAction } from "@/src/features/suppliers/actions/get-suppliers.action";
import { SUPPLIERS_PAGE_SIZE } from "@/src/features/suppliers/constants/pagination";

export default async function SuppliersPage() {
  const page = await getSuppliersAction({ limit: SUPPLIERS_PAGE_SIZE });

  return (
    <SuppliersScreen
      initialSuppliers={page.suppliers}
      initialCursor={page.nextCursor}
      initialHasMore={page.hasMore}
    />
  );
}
