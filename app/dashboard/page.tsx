export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Total Suppliers</h3>
          <p className="text-3xl font-bold text-blue-600">24</p>
        </div>
        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Active Inventory</h3>
          <p className="text-3xl font-bold text-green-600">1,543</p>
        </div>
        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Pending Orders</h3>
          <p className="text-3xl font-bold text-orange-600">18</p>
        </div>
      </div>
    </div>
  );
}
