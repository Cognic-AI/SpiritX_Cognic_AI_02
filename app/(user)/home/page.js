'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function UserHomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [topPlayers, setTopPlayers] = useState([]);
  const [teamInfo, setTeamInfo] = useState({ playerCount: 0, totalValue: 0 });
  const [loading, setLoading] = useState(true);
  
  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/home');
    }
  }, [status, router]);
  
  // Fetch top players and team info when authenticated
  useEffect(() => {
    if (status === 'authenticated') {
      const fetchData = async () => {
        try {
          // Fetch top players
          const playersRes = await fetch('/api/players/top');
          if (playersRes.ok) {
            const playersData = await playersRes.json();
            setTopPlayers(playersData);
          }
          
          // Fetch user team info (in a real app)
          // const teamRes = await fetch('/api/users/team');
          // if (teamRes.ok) {
          //   const teamData = await teamRes.json();
          //   setTeamInfo({
          //     playerCount: teamData.players.length,
          //     totalValue: teamData.totalValue
          //   });
          // }
          
          // Mock data for now
          setTeamInfo({ playerCount: 0, totalValue: 0 });
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setLoading(false);
        }
      };
      
      fetchData();
    }
  }, [status]);
  
  if (status === 'loading' || status === 'unauthenticated') {
    return (
      <div className="flex justify-center items-center h-96">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
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
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md lg:col-span-2">
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
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link href="/select-team" className="block p-3 bg-blue-50 rounded-md hover:bg-blue-100">
              <div className="flex justify-between items-center">
                <span className="font-medium">Select Players</span>
                <span>→</span>
              </div>
            </Link>
            <Link href="/team" className="block p-3 bg-green-50 rounded-md hover:bg-green-100">
              <div className="flex justify-between items-center">
                <span className="font-medium">View My Team</span>
                <span>→</span>
              </div>
            </Link>
            <Link href="/leaderboard" className="block p-3 bg-purple-50 rounded-md hover:bg-purple-100">
              <div className="flex justify-between items-center">
                <span className="font-medium">Check Leaderboard</span>
                <span>→</span>
              </div>
            </Link>
            <Link href="/players" className="block p-3 bg-yellow-50 rounded-md hover:bg-yellow-100">
              <div className="flex justify-between items-center">
                <span className="font-medium">Browse All Players</span>
                <span>→</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Getting Started</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">How to Play</h3>
            <ol className="list-decimal list-inside space-y-2 pl-4">
              <li>Browse through players in the Players section</li>
              <li>Select players based on categories to build a team of 11 players</li>
              <li>Manage your budget of Rs. 9,000,000 wisely</li>
              <li>Earn points based on your team's performance</li>
              <li>Compete with other users on the leaderboard</li>
            </ol>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Tips for Success</h3>
            <ul className="list-disc list-inside space-y-2 pl-4">
              <li>Choose players with consistent performance stats</li>
              <li>Balance your team with the right mix of batsmen, bowlers, and all-rounders</li>
              <li>Monitor player stats regularly to optimize your team</li>
              <li>Stay within budget while maximizing team value</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 