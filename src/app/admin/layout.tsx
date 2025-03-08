import Navbar from "@/components/navigation/Navbar";
import AdminRoute from "@/components/auth/AdminRoute";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminRoute>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="py-6 sm:py-8 lg:py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>
            {children}
          </div>
        </main>
      </div>
    </AdminRoute>
  );
} 