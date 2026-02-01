export default function SuppliersPage() {
  return (
    <div>
      {/* Header Section */}
      <div className="px-8 py-8">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div>
            <h2 className="text-[#0e121b]  text-3xl font-black tracking-tight">
              Suppliers
            </h2>
            <p className="text-[#4e6797]  text-sm mt-1">
              Manage and monitor vendor performance
            </p>
          </div>
          <button className="flex items-center justify-center gap-2 rounded-lg h-11 px-6 bg-primary text-white text-sm font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-colors">
            <span className="material-symbols-outlined text-xl">add</span>
            <span>Add Supplier</span>
          </button>
        </div>
      </div>
    </div>
  );
}
