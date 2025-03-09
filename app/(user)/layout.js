'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function UserLayout({ children }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [teamStatus, setTeamStatus] = useState({ count: 0, total: 11 });
  const [budget, setBudget] = useState(9000000);


  // Load team status when session is available
  useEffect(() => {
    // Here we would fetch the user's team status
    // For now, just mock the data
    setTeamStatus({
      count: 0,
      total: 11,
    });
    if (status === 'authenticated') {
      // Here we would fetch the user's team composition
      // For now, just mock the data
      const fetchTeam = async () => {
        try {
          const res = await fetch('/api/users/team', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (!res.ok) throw new Error('Failed to fetch players');

          const data = await res.json();

          const teamData = data.teamInfo || {
            totalPlayers: 0,
            totalValue: 0,
            totalPoints: 0,
            isComplete: false,
          };

          setBudget(9000000 - teamData.total_value);

          // Extract and set team information
          setTeamStatus({
            count: teamData.player_count || 0,
            total: 11,
          });
        }
        catch (error) {
          console.error('Error fetching players:', error);
          setLoading(false);
        }
      };
      fetchTeam();
    }

  }, [status, session]);

  const handleSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: '/' });
  };

  // Check if it's an active link
  const isActive = (path) => pathname === path;

  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">Spirit11</Link>
          <div className="flex items-center space-x-4">
            {status === 'authenticated' && (
              <>
                <span>Welcome, {session.user.name}</span>
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 bg-blue-700 rounded-md hover:bg-blue-800"
                >
                  Sign Out
                </button>
              </>
            )}
            {status === 'unauthenticated' && (
              <Link
                href="/login"
                className="px-4 py-2 bg-blue-700 rounded-md hover:bg-blue-800"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </header>

      {status === 'authenticated' && (
        <nav className="bg-white shadow-md">
          <div className="container mx-auto">
            <ul className="flex overflow-x-auto">
              <li>
                <Link
                  href="/players"
                  className={`block px-6 py-4 ${isActive('/players') ? 'bg-gray-100 font-medium' : 'hover:bg-gray-100'
                    }`}
                >
                  Players
                </Link>
              </li>
              <li>
                <Link
                  href="/select-team"
                  className={`block px-6 py-4 ${isActive('/select-team') ? 'bg-gray-100 font-medium' : 'hover:bg-gray-100'
                    }`}
                >
                  Select Your Team
                </Link>
              </li>
              <li>
                <Link
                  href="/team"
                  className={`block px-6 py-4 ${isActive('/team') ? 'bg-gray-100 font-medium' : 'hover:bg-gray-100'
                    }`}
                >
                  My Team <span className="text-sm text-blue-600">({teamStatus.count}/{teamStatus.total})</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/budget"
                  className={`block px-6 py-4 ${isActive('/budget') ? 'bg-gray-100 font-medium' : 'hover:bg-gray-100'
                    }`}
                >
                  Budget <span className="text-sm text-green-600">Rs. {budget || '9,000,000'}</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/leaderboard"
                  className={`block px-6 py-4 ${isActive('/leaderboard') ? 'bg-gray-100 font-medium' : 'hover:bg-gray-100'
                    }`}
                >
                  Leaderboard
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      )}

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-gray-800 text-white p-4 mt-auto">
        <div className="container mx-auto text-center">
          <p>&copy; 2025 Spirit11 Fantasy Cricket Game</p>
        </div>
      </footer>
    </div>
  );
} 