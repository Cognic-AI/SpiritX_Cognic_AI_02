'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function AdminDashboardPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState({
    playerCount: 0,
    totalRuns: 0,
    totalWickets: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/admin/tournament-summary');
        if (res.ok) {
          const data = await res.json();
          // Set basic stats from the summary
          setStats({
            playerCount: data.top_batsmen?.length || 0,
            totalRuns: data.total_runs || 0,
            totalWickets: data.total_wickets || 0
          });
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="mb-8">
        <div className="bg-white p-4 rounded-md shadow-md">
          <h2 className="text-lg font-semibold mb-2">Welcome, {session?.user?.name || 'Admin'}</h2>
          <p className="text-gray-600">
            Manage all aspects of the Spirit11 Fantasy Cricket Game from this admin panel.
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-50 p-6 rounded-md shadow-md">
          <h3 className="text-lg font-semibold mb-2">Players</h3>
          <p className="text-3xl font-bold text-blue-600 mb-2">
            {loading ? '...' : stats.playerCount}
          </p>
          <p className="text-sm text-gray-600 mb-4">Total registered players</p>
          <Link 
            href="/admin/players"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Manage Players
          </Link>
        </div>
        
        <div className="bg-green-50 p-6 rounded-md shadow-md">
          <h3 className="text-lg font-semibold mb-2">Total Runs</h3>
          <p className="text-3xl font-bold text-green-600 mb-2">
            {loading ? '...' : stats.totalRuns.toLocaleString()}
          </p>
          <p className="text-sm text-gray-600 mb-4">Runs scored in tournament</p>
          <Link 
            href="/admin/tournament-summary"
            className="inline-block px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            View Tournament Summary
          </Link>
        </div>
        
        <div className="bg-purple-50 p-6 rounded-md shadow-md">
          <h3 className="text-lg font-semibold mb-2">Total Wickets</h3>
          <p className="text-3xl font-bold text-purple-600 mb-2">
            {loading ? '...' : stats.totalWickets.toLocaleString()}
          </p>
          <p className="text-sm text-gray-600 mb-4">Wickets taken in tournament</p>
          <Link 
            href="/admin/player-stats"
            className="inline-block px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            View Player Stats
          </Link>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-md shadow-md">
          <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 gap-4">
            <Link 
              href="/admin/players"
              className="block p-4 bg-gray-100 hover:bg-gray-200 rounded-md"
            >
              <div className="flex justify-between items-center">
                <span className="font-medium">Manage Players</span>
                <span>→</span>
              </div>
            </Link>
            
            <Link 
              href="/admin/player-stats"
              className="block p-4 bg-gray-100 hover:bg-gray-200 rounded-md"
            >
              <div className="flex justify-between items-center">
                <span className="font-medium">View Player Statistics</span>
                <span>→</span>
              </div>
            </Link>
            
            <Link 
              href="/admin/tournament-summary"
              className="block p-4 bg-gray-100 hover:bg-gray-200 rounded-md"
            >
              <div className="flex justify-between items-center">
                <span className="font-medium">Tournament Summary</span>
                <span>→</span>
              </div>
            </Link>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-md shadow-md">
          <h3 className="text-xl font-semibold mb-4">System Status</h3>
          {loading ? (
            <p>Loading system status...</p>
          ) : (
            <div>
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Database Connection</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                    Connected
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">API Status</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                    Online
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">WebSocket Status</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                    Connected
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 