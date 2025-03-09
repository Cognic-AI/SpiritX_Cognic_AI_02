import { redirect } from 'next/navigation';

export default function AdminDashboardPage() {
  // Redirect to dashboard page by default
  redirect('/admin/dashboard');
} 