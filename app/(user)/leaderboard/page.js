'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function LeaderboardPage() {
  const { data: session, status } = useSession();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserRank, setCurrentUserRank] = useState(null);

  useEffect(() => {
    if (status === 'authenticated') {
      // Here we would fetch the leaderboard data
      // For now, just mock the data
      const mockLeaderboard = [
        { username: 'player1', display_name: 'Cricket Master', points: 1250, team_value: 8500000 },
        { username: 'player2', display_name: 'Fantasy King', points: 1100, team_value: 8900000 },
        { username: 'player3', display_name: 'Cricket Guru', points: 950, team_value: 8700000 },
        { username: 'player4', display_name: 'Fantasy Pro', points: 900, team_value: 8200000 },
        { username: 'player5', display_name: 'Cricket Wizard', points: 850, team_value: 8600000 },
      ];
      
      setLeaderboard(mockLeaderboard);
      
      // Find current user's rank
      const userIndex = mockLeaderboard.findIndex(user => user.username === session.user.name);
      if (userIndex !== -1) {
        setCurrentUserRank(userIndex + 1);
      }
      
      setLoading(false);
    }
  }, [status, session]);

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Leaderboard</h1>
        <div className="flex justify-center items-center h-96">
          <p className="text-gray-600">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Leaderboard</h1>
      
      <div className="bg-white p-6 rounded-md shadow-md mb-6">
        <h2 className="text-lg font-semibold mb-4">Your Ranking</h2>
        
        {currentUserRank ? (
          <div className="bg-blue-50 p-4 rounded-md">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-600">Your Rank</p>
                <p className="text-2xl font-bold text-blue-600">#{currentUserRank}</p>
              </div>
              <div>
                <p className="text-gray-600">Your Points</p>
                <p className="text-2xl font-bold text-green-600">
                  {leaderboard[currentUserRank - 1].points}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-yellow-50 p-4 rounded-md">
            <p className="text-center text-yellow-700">
              You're not on the leaderboard yet. Complete your team to start earning points!
            </p>
            <div className="mt-4 text-center">
              <Link
                href="/team"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                View Your Team
              </Link>
            </div>
          </div>
        )}
      </div>
      
      <div className="bg-white p-6 rounded-md shadow-md">
        <h2 className="text-lg font-semibold mb-4">Top Players</h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">Rank</th>
                <th className="px-4 py-2 text-left">Player</th>
                <th className="px-4 py-2 text-right">Points</th>
                <th className="px-4 py-2 text-right">Team Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {leaderboard.map((user, index) => (
                <tr 
                  key={user.username}
                  className={user.username === session?.user?.name ? 'bg-blue-50' : ''}
                >
                  <td className="px-4 py-2">
                    <span className="font-medium">#{index + 1}</span>
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex items-center">
                      <span className="font-medium">
                        {user.display_name}
                        {user.username === session?.user?.name && (
                          <span className="ml-2 text-blue-600">(You)</span>
                        )}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-2 text-right font-medium">
                    {user.points}
                  </td>
                  <td className="px-4 py-2 text-right">
                    Rs. {user.team_value.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {leaderboard.length === 0 && (
          <div className="text-center py-6">
            <p className="text-gray-600">No players on the leaderboard yet.</p>
          </div>
        )}
      </div>
    </div>
  );
} 