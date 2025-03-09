'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function TeamPage() {
  const { data: session, status } = useSession();
  const [team, setTeam] = useState([]);
  const [teamStats, setTeamStats] = useState({
    totalPlayers: 0,
    totalValue: 0,
    totalPoints: 0,
    isComplete: false
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Reset team stats and loading state
    setTeam([]);
    setTeamStats({
      totalPlayers: 0,
      totalValue: 0,
      totalPoints: 0,
      isComplete: false
    });
    if (status === 'authenticated') {
      const fetchTeam = async () => {
        try {
          const res = await fetch('/api/users/team', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          console.log(res);
          if (!res.ok) throw new Error('Failed to fetch players');

          const data = await res.json();

          const teamData = data.teamInfo || {
            totalPlayers: 0,
            totalValue: 0,
            totalPoints: 0,
            isComplete: false,
          };
          // Extract and set team information
          setTeamStats({
            totalPlayers: teamData.player_count || 0,
            totalValue: parseFloat(teamData.total_value) || 0,
            totalPoints: parseFloat(teamData.total_points) || 0,
            isComplete: teamData.is_complete === 1,
          });

          // Set players data
          const players = data.players || [];
          setTeam(players);

          setLoading(false);
        } catch (error) {
          console.error('Error fetching players:', error);
          setLoading(false);
        }
      };

      fetchTeam();
      setLoading(false);
    }
  }, [status, session]); // Ensure that useEffect re-runs when session changes

  const handleRemovePlayer = (playerId) => {
    // Here we would call an API to remove the player from the team
    console.log(`Removing player ${playerId}`);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">My Team</h1>
        <div className="flex justify-center items-center h-96">
          <p className="text-gray-600">Loading your team...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">My Team</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-4 rounded-md shadow-md">
          <h2 className="text-lg font-semibold mb-2">Team Status</h2>
          <div className="text-center py-4">
            <p className="text-3xl font-bold text-blue-600">{teamStats.totalPlayers}/11</p>
            <p className="text-gray-600">Players Selected</p>
          </div>
          <div className="mt-4">
            <Link
              href="/select-team"
              className="block w-full py-2 bg-blue-500 text-white text-center rounded-md hover:bg-blue-600"
            >
              {teamStats.isComplete ? 'Edit Team' : 'Complete Your Team'}
            </Link>
          </div>
        </div>

        <div className="bg-white p-4 rounded-md shadow-md">
          <h2 className="text-lg font-semibold mb-2">Team Value</h2>
          <div className="text-center py-4">
            <p className="text-3xl font-bold text-green-600">Rs. {teamStats.totalValue.toLocaleString()}</p>
            <p className="text-gray-600">Total Value</p>
          </div>
          <div className="mt-4">
            <Link
              href="/budget"
              className="block w-full py-2 bg-green-500 text-white text-center rounded-md hover:bg-green-600"
            >
              View Budget Details
            </Link>
          </div>
        </div>

        <div className="bg-white p-4 rounded-md shadow-md">
          <h2 className="text-lg font-semibold mb-2">Team Points</h2>
          <div className="text-center py-4">
            <p className="text-3xl font-bold text-purple-600">
              {teamStats.isComplete ? teamStats.totalPoints : 'N/A'}
            </p>
            <p className="text-gray-600">
              {teamStats.isComplete ? 'Total Points' : 'Complete team to see points'}
            </p>
          </div>
          <div className="mt-4">
            <Link
              href="/leaderboard"
              className="block w-full py-2 bg-purple-500 text-white text-center rounded-md hover:bg-purple-600"
            >
              View Leaderboard
            </Link>
          </div>
        </div>
      </div>

      {team.length > 0 ? (
        <div className="bg-white p-4 rounded-md shadow-md">
          <h2 className="text-lg font-semibold mb-4">Your Selected Players</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">University</th>
                  <th className="px-4 py-2 text-left">Category</th>
                  <th className="px-4 py-2 text-right">Value</th>
                  <th className="px-4 py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {team.map(player => (
                  <tr key={player.player_id}>
                    <td className="px-4 py-2">
                      <Link href={`/players/${player.player_id}`} className="text-blue-500 hover:underline">
                        {player.name}
                      </Link>
                    </td>
                    <td className="px-4 py-2">{player.university}</td>
                    <td className="px-4 py-2">{player.category}</td>
                    <td className="px-4 py-2 text-right">Rs. {player.player_value.toLocaleString()}</td>
                    <td className="px-4 py-2 text-center">
                      <button
                        onClick={() => handleRemovePlayer(player.player_id)}
                        className="px-3 py-1 bg-red-500 text-white rounded-md text-sm hover:bg-red-600"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-md shadow-md text-center">
          <h2 className="text-lg font-semibold mb-4">Your Team is Empty</h2>
          <p className="text-gray-600 mb-6">
            You haven't selected any players yet. Start building your team now!
          </p>
          <Link
            href="/select-team"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Select Players
          </Link>
        </div>
      )}
    </div>
  );
} 