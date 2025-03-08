import AdminRoute from "@/components/auth/AdminRoute";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminRoute>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
      </div>
      {children}
    </AdminRoute>
  );
} 