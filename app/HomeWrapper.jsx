'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function HomeWrapper({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [topPlayers, setTopPlayers] = useState([]);
  const [teamInfo, setTeamInfo] = useState({ playerCount: 0, totalValue: 0 });
  const [loading, setLoading] = useState(true);

  // Redirect based on role after authentication
  useEffect(() => {
    if (status === 'authenticated') {
      if (session.user.role === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/home');
      }
    }
  }, [status, session, router]);

  const fetchTopPlayers = async () => {
    try {
      const res = await fetch('/api/players/top');
      if (res.ok) {
        const data = await res.json();
        setTopPlayers(data);
      }
    } catch (error) {
      console.error('Error fetching top players:', error);
    } finally {
      setLoading(false);
    }
  };

  // If loading, show loading indicator
  if (status === 'loading') {
    return (
      <div className="flex h-screen justify-center items-center">
        <div className="text-center">
          <h2 className="text-xl">Loading...</h2>
        </div>
      </div>
    );
  }

  // If not authenticated, show login options
  if (status === 'unauthenticated') {
    return children; // Show the regular home page with login options
  }

  // If authenticated as a user (not admin), show user dashboard
  if (session?.user?.role === 'user') {
    return (
      <div className="flex min-h-screen flex-col">
        <header className="bg-blue-600 text-white p-4 shadow-md">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold">Spirit11</h1>
            <div className="flex items-center space-x-4">
              <span>Welcome, {session.user.name}</span>
              <Link
                href="/api/auth/signout"
                className="px-4 py-2 bg-blue-700 rounded-md hover:bg-blue-800"
              >
                Sign Out
              </Link>
            </div>
          </div>
        </header>

        <nav className="bg-white shadow-md">
          <div className="container mx-auto">
            <ul className="flex overflow-x-auto">
              <li>
                <Link
                  href="/"
                  className="block px-6 py-4 hover:bg-gray-100 bg-gray-100 font-medium"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/select-team"
                  className="block px-6 py-4 hover:bg-gray-100"
                >
                  Select Your Team
                </Link>
              </li>
              <li>
                <Link
                  href="/team"
                  className="block px-6 py-4 hover:bg-gray-100"
                >
                  My Team <span className="text-sm text-blue-600">({teamInfo.playerCount}/11)</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/budget"
                  className="block px-6 py-4 hover:bg-gray-100"
                >
                  Budget <span className="text-sm text-green-600">Rs. {session.user.budget?.toLocaleString() || '9,000,000'}</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/leaderboard"
                  className="block px-6 py-4 hover:bg-gray-100"
                >
                  Leaderboard
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        <main className="flex-grow container mx-auto p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4">Your Team Status</h2>
              <div className="bg-blue-50 p-4 rounded-md text-center mb-4">
                <p className="text-lg">Team Completion</p>
                <p className="text-3xl font-bold text-blue-600">{teamInfo.playerCount}/11</p>
                <p className="text-sm text-gray-600">players selected</p>
              </div>
              <Link
                href="/select-team"
                className="block w-full text-center py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                {teamInfo.playerCount === 0 ? 'Start Building Your Team' : 
                 teamInfo.playerCount < 11 ? 'Complete Your Team' : 'Manage Your Team'}
              </Link>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4">Your Budget</h2>
              <div className="bg-green-50 p-4 rounded-md text-center mb-4">
                <p className="text-lg">Available Budget</p>
                <p className="text-3xl font-bold text-green-600">
                  Rs. {session.user.budget?.toLocaleString() || '9,000,000'}
                </p>
                <p className="text-sm text-gray-600">
                  {teamInfo.totalValue > 0 ? 
                    `Spent: Rs. ${teamInfo.totalValue.toLocaleString()}` : 
                    "You haven't spent any budget yet"}
                </p>
              </div>
              <Link
                href="/budget"
                className="block w-full text-center py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                View Budget Details
              </Link>
            </div>
          </div>

          <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Top Players</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">University</th>
                    <th className="px-4 py-2 text-left">Category</th>
                    <th className="px-4 py-2 text-right">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr className="border-t">
                      <td className="px-4 py-2" colSpan="4">Loading top players...</td>
                    </tr>
                  ) : topPlayers.length > 0 ? (
                    topPlayers.map(player => (
                      <tr key={player.player_id} className="border-t hover:bg-gray-50">
                        <td className="px-4 py-2">
                          <Link href={`/players/${player.player_id}`} className="text-blue-500 hover:underline">
                            {player.name}
                          </Link>
                        </td>
                        <td className="px-4 py-2">{player.university}</td>
                        <td className="px-4 py-2">{player.category}</td>
                        <td className="px-4 py-2 text-right">Rs. {player.player_value?.toLocaleString()}</td>
                      </tr>
                    ))
                  ) : (
                    <tr className="border-t">
                      <td className="px-4 py-2 text-center" colSpan="4">No players found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="mt-4">
              <Link
                href="/players"
                className="text-blue-600 hover:underline"
              >
                View all players →
              </Link>
            </div>
          </div>
        </main>

        <footer className="bg-gray-800 text-white p-4 mt-auto">
          <div className="container mx-auto text-center">
            <p>&copy; {new Date().getFullYear()} Spirit11 Fantasy Cricket Game</p>
          </div>
        </footer>
      </div>
    );
  }

  // This should not happen but just in case
  return (
    <div className="flex h-screen justify-center items-center">
      <div className="text-center">
        <h2 className="text-xl">Redirecting...</h2>
      </div>
    </div>
  );
} 