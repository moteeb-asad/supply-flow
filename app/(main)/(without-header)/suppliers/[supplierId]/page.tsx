type SupplierDetailPageProps = {
  params: { supplierId: string };
};

export default function SupplierDetailPage({
  params,
}: SupplierDetailPageProps) {
  return (
    <div className="px-8 py-8">
      <div className="mb-6">
        <p className="text-xs font-semibold text-[#4e6797] uppercase tracking-widest">
          Supplier Detail
        </p>
        <h1 className="text-3xl font-black text-[#0e121b]">
          Supplier {params.supplierId}
        </h1>
        <p className="text-sm text-[#4e6797] mt-1">
          View performance, delivery history, and pricing insights.
        </p>
      </div>

      <div className="rounded-xl border border-[#d0d7e7] bg-white p-6 shadow-sm">
        <p className="text-sm text-[#4e6797]">
          Wire this page to load supplier data by ID.
        </p>
      </div>
    </div>
  );
}
