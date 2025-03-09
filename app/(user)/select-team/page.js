'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function SelectTeamPage() {
  const { data: session, status } = useSession();
  const [categories, setCategories] = useState([
    { id: 'batsman', name: 'Batsman', count: 0, recommended: 5 },
    { id: 'bowler', name: 'Bowler', count: 0, recommended: 4 },
    { id: 'all-rounder', name: 'All-Rounder', count: 0, recommended: 2 }
  ]);
  const [teamStats, setTeamStats] = useState({
    totalPlayers: 0,
    totalValue: 0,
    totalPoints: 0,
    batsman_count: 0,
    bowler_count: 0,
    all_rounder_count: 0,
    isComplete: false
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTeamStats({
      totalPlayers: 0,
      totalValue: 0,
      totalPoints: 0,
      batsman_count: 0,
      bowler_count: 0,
      all_rounder_count: 0,
      isComplete: false
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
          // Extract and set team information
          setTeamStats({
            totalPlayers: teamData.player_count || 0,
            totalValue: parseFloat(teamData.total_value) || 0,
            totalPoints: parseFloat(teamData.total_points) || 0,
            isComplete: teamData.is_complete === 1,
          });

          // Set players data
          const players = data.players || [];

          let batsman_count = 0;
          let bowler_count = 0;
          let all_rounder_count = 0;

          for (let i = 0; i < players.length; i++) {
            if (players[i].category === 'Batsman') {
              batsman_count++;
            } else if (players[i].category === 'Bowler') {
              bowler_count++;
            } else if (players[i].category === 'All-Rounder') {
              all_rounder_count++;
            }
          }

          setCategories(
            [
              { id: 'batsman', name: 'Batsman', count: batsman_count || 0, recommended: 5 },
              { id: 'bowler', name: 'Bowler', count: bowler_count || 0, recommended: 4 },
              { id: 'all-rounder', name: 'All-Rounder', count: all_rounder_count || 0, recommended: 2 }
            ]
          );

          setLoading(false);
        } catch (error) {
          console.error('Error fetching players:', error);
          setLoading(false);
        }
      };

      fetchTeam();
      setLoading(false);
    }

  }, [status, session]);

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Select Your Team</h1>
        <div className="flex justify-center items-center h-96">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Select Your Team</h1>

      <div className="bg-white p-4 rounded-md shadow-md mb-6">
        <h2 className="text-lg font-semibold mb-2">Team Composition</h2>
        <p className="text-gray-600 mb-4">
          Select players from each category to build your team. You need 11 players in total.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {categories.map(category => (
            <div key={category.id} className="bg-gray-50 p-4 rounded-md">
              <h3 className="font-medium mb-2">{category.name}s</h3>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Selected: {category.count}</span>
                <span className="text-gray-600">Recommended: {category.recommended}</span>
              </div>
              <div className="mt-4">
                <Link
                  href={`/select-team/${category.id}`}
                  className="block w-full py-2 bg-blue-500 text-white text-center rounded-md hover:bg-blue-600"
                >
                  Select {category.name}s
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-4 rounded-md shadow-md">
        <h2 className="text-lg font-semibold mb-4">Your Selection Progress</h2>

        <div className="mb-4">
          <div className="flex justify-between mb-2">
            <span>Team Completion</span>
            <span className="font-medium">${teamStats.totalPlayers}/11 Players</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${teamStats.totalPlayers / 11 * 100}%` }}></div>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex justify-between mb-2">
            <span>Budget Utilization</span>
            <span className="font-medium">Rs. ${teamStats.totalValue} / Rs. 9,000,000</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-green-600 h-2 rounded-full" style={{ width: `${teamStats.totalValue / 9000000 * 100}%` }}></div>
          </div>
        </div>

        <div className="flex justify-end">
          <Link
            href="/team"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            View Your Team
          </Link>
        </div>
      </div>
    </div>
  );
} 