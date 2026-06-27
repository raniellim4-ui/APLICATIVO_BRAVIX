import Head from 'next/head';

export default function Dashboard() {
  return (
    <>
      <Head>
        <title>Dashboard - Vehicle Inspection</title>
        <meta name="description" content="Fleet management dashboard" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="container mx-auto py-8">
          <h1 className="text-4xl font-bold mb-8">Vehicle Inspection Dashboard</h1>

          {/* Dashboard Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* Fleet Status Card */}
            <div className="bg-white dark:bg-slate-900 rounded-lg shadow p-6">
              <div className="text-gray-500 text-sm font-medium">Total Vehicles</div>
              <div className="mt-2 text-3xl font-bold">10</div>
              <div className="text-green-600 text-sm mt-2">✅ All active</div>
            </div>

            {/* Inspections Card */}
            <div className="bg-white dark:bg-slate-900 rounded-lg shadow p-6">
              <div className="text-gray-500 text-sm font-medium">Inspections (Month)</div>
              <div className="mt-2 text-3xl font-bold">156</div>
              <div className="text-blue-600 text-sm mt-2">📊 Avg 15.6/day</div>
            </div>

            {/* Drivers Card */}
            <div className="bg-white dark:bg-slate-900 rounded-lg shadow p-6">
              <div className="text-gray-500 text-sm font-medium">Active Drivers</div>
              <div className="mt-2 text-3xl font-bold">8</div>
              <div className="text-purple-600 text-sm mt-2">👥 On duty</div>
            </div>

            {/* Maintenance Card */}
            <div className="bg-white dark:bg-slate-900 rounded-lg shadow p-6">
              <div className="text-gray-500 text-sm font-medium">Maintenance Due</div>
              <div className="mt-2 text-3xl font-bold">3</div>
              <div className="text-orange-600 text-sm mt-2">⚠️ This week</div>
            </div>
          </div>

          {/* Feature Overview */}
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow p-8">
            <h2 className="text-2xl font-bold mb-6">Dashboard Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold mb-2">🚗 Fleet Management</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Track all vehicles, health scores, and maintenance schedules
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">👥 Driver Analytics</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Monitor driver performance, quality scores, and inspection metrics
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">📋 Inspection Records</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Complete inspection history with photos and damage reports
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">📊 Advanced Analytics</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Fleet trends, cost analysis, and KPI dashboards
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">⚙️ Admin Settings</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  User management, permissions, and system configuration
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">🔐 Role-Based Access</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Secure authentication with granular permission control
                </p>
              </div>
            </div>
          </div>

          {/* Getting Started */}
          <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-8 mt-8">
            <h2 className="text-2xl font-bold mb-4">🚀 Getting Started</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              This is your professional admin dashboard for vehicle fleet management.
            </p>
            <div className="flex gap-4">
              <a
                href="/vehicles"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                View Vehicles
              </a>
              <a
                href="/drivers"
                className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition"
              >
                Manage Drivers
              </a>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
