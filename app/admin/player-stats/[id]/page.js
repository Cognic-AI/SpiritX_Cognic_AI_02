'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function PlayerDetailPage({ params }) {
  const playerId = params.id;
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlayer = async () => {
      try {
        const res = await fetch(`/api/admin/players/${playerId}`);
        if (!res.ok) throw new Error('Failed to fetch player');
        const data = await res.json();
        setPlayer(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching player:', error);
        setLoading(false);
      }
    };

    fetchPlayer();

    // Setup WebSocket connection for real-time updates
    const socket = new WebSocket(`${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/api/websocket`);

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'player_update') {
        fetchPlayer();
      }
    };

    return () => {
      socket.close();
    };
  }, [playerId]);

  if (loading) {
    return <div className="flex justify-center items-center h-96">Loading...</div>;
  }

  if (!player) {
    return (
      <div className="container mx-auto text-center py-10">
        <h1 className="text-2xl font-bold mb-4">Player Not Found</h1>
        <p className="mb-6">The player you're looking for doesn't exist or has been removed.</p>
        <Link href="/admin/player-stats" className="px-4 py-2 bg-blue-500 text-white rounded-md">
          Back to Player Stats
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <div className="mb-6">
        <Link href="/admin/player-stats" className="text-blue-500 hover:underline">
          &larr; Back to Player Stats
        </Link>
      </div>

      <div className="bg-white rounded-md shadow-md overflow-hidden mb-6">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{player.name}</h1>
              <p className="text-gray-600">{player.university}</p>
            </div>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
              {player.category}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-blue-50 p-4 rounded-md">
              <h2 className="text-xl font-semibold mb-4">Player Value</h2>
              <div>
                <p className="text-sm text-gray-500">Player Value</p>
                <p className="text-2xl font-bold">Rs. {player.player_value?.toLocaleString()}</p>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-md">
              <h2 className="text-xl font-semibold mb-4">Match Participation</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Innings Played</p>
                  <p className="text-2xl font-bold">{player.innings_played}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Last Updated</p>
                  <p className="text-sm font-semibold">
                    {new Date(player.last_updated).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Batting Stats */}
          {(player.category === 'Batsman' || player.category === 'All-Rounder') && (
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Batting Statistics</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-sm text-gray-500">Total Runs</p>
                  <p className="text-2xl font-bold">{player.total_runs}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-sm text-gray-500">Balls Faced</p>
                  <p className="text-2xl font-bold">{player.balls_faced}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-sm text-gray-500">Strike Rate</p>
                  <p className="text-2xl font-bold">
                    {typeof player.batting_strike_rate === 'number'
                      ? player.batting_strike_rate.toFixed(2)
                      : player.batting_strike_rate}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-sm text-gray-500">Average</p>
                  <p className="text-2xl font-bold">
                    {typeof player.batting_average === 'number'
                      ? player.batting_average.toFixed(2)
                      : player.batting_average}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-sm text-gray-500">Runs per Inning</p>
                  <p className="text-2xl font-bold">
                    {typeof player.total_runs === 'number' && typeof player.innings_played === 'number' && player.innings_played > 0
                      ? (player.total_runs / player.innings_played).toFixed(2)
                      : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Bowling Stats */}
          {(player.category === 'Bowler' || player.category === 'All-Rounder') && (
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Bowling Statistics</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-sm text-gray-500">Wickets</p>
                  <p className="text-2xl font-bold">{player.wickets}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-sm text-gray-500">Overs Bowled</p>
                  <p className="text-2xl font-bold">{player.overs_bowled}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-sm text-gray-500">Runs Conceded</p>
                  <p className="text-2xl font-bold">{player.runs_conceded}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-sm text-gray-500">Economy Rate</p>
                  <p className="text-2xl font-bold">
                    {typeof player.economy_rate === 'number'
                      ? player.economy_rate.toFixed(2)
                      : player.economy_rate || 0}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-sm text-gray-500">Bowling Average</p>
                  <p className="text-2xl font-bold">
                    {typeof player.bowling_strike_rate === 'number'
                      ? player.bowling_strike_rate.toFixed(2)
                      : player.bowling_strike_rate}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-sm text-gray-500">Wickets per Match</p>
                  <p className="text-2xl font-bold">
                    {typeof player.wickets === 'number' && typeof player.innings_played === 'number' && player.innings_played > 0
                      ? (player.wickets / player.innings_played).toFixed(2)
                      : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex space-x-4">
            <Link
              href={`/admin/players`}
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              Edit Player
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}