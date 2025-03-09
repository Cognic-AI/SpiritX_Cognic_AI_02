'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminLayout({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  // Redirect if not authenticated or not an admin
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/admin');
    } else if (status === 'authenticated' && session?.user?.role !== 'admin') {
      router.push('/');
    }
  }, [status, session, router]);
  
  // Show loading while checking session
  if (status === 'loading' || status === 'unauthenticated' || session?.user?.role !== 'admin') {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-6">
          <h1 className="text-2xl font-bold">Spirit11 Admin</h1>
        </div>
        <nav className="mt-6">
          <ul>
            <li>
              <Link 
                href="/admin/dashboard" 
                className="flex items-center px-6 py-3 hover:bg-gray-100"
              >
                <span className="ml-2">Dashboard</span>
              </Link>
            </li>
            <li>
              <Link 
                href="/admin/players" 
                className="flex items-center px-6 py-3 hover:bg-gray-100"
              >
                <span className="ml-2">Players</span>
              </Link>
            </li>
            <li>
              <Link 
                href="/admin/player-stats" 
                className="flex items-center px-6 py-3 hover:bg-gray-100"
              >
                <span className="ml-2">Player Stats</span>
              </Link>
            </li>
            <li>
              <Link 
                href="/admin/tournament-summary" 
                className="flex items-center px-6 py-3 hover:bg-gray-100"
              >
                <span className="ml-2">Tournament Summary</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      
      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm p-4">
          <div className="flex justify-end">
            <button 
              onClick={handleSignOut}
              className="px-4 py-2 bg-red-500 text-white rounded-md"
            >
              Sign Out
            </button>
          </div>
        </header>
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
} 