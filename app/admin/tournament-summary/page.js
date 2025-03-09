'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function TournamentSummaryPage() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await fetch('/api/admin/tournament-summary');
        if (!res.ok) throw new Error('Failed to fetch tournament summary');
        const data = await res.json();
        setSummary(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching tournament summary:', error);
        setLoading(false);
      }
    };

    fetchSummary();

    // Setup WebSocket connection for real-time updates
    const socket = new WebSocket(`${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/api/websocket`);
    
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'player_update') {
        fetchSummary();
      }
    };

    return () => {
      socket.close();
    };
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-96">Loading...</div>;
  }

  if (!summary) {
    return (
      <div className="container mx-auto text-center py-10">
        <h1 className="text-2xl font-bold mb-4">Failed to Load Summary</h1>
        <p className="mb-6">Could not load the tournament summary. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-6">Tournament Summary</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-md shadow-md">
          <h2 className="text-xl font-semibold mb-4">Overall Batting Statistics</h2>
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-blue-50 p-4 rounded-md">
              <p className="text-sm text-gray-500">Total Runs</p>
              <p className="text-3xl font-bold">{summary.total_runs}</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-md">
              <p className="text-sm text-gray-500">Average Strike Rate</p>
              <p className="text-3xl font-bold">
                {typeof summary.avg_strike_rate === 'number' 
                  ? summary.avg_strike_rate.toFixed(2) 
                  : summary.avg_strike_rate}
              </p>
            </div>
            <div className="bg-blue-50 p-4 rounded-md">
              <p className="text-sm text-gray-500">Total Balls Faced</p>
              <p className="text-3xl font-bold">{summary.total_balls_faced}</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-md">
              <p className="text-sm text-gray-500">Average Runs Per Player</p>
              <p className="text-3xl font-bold">
                {typeof summary.avg_runs_per_player === 'number' 
                  ? summary.avg_runs_per_player.toFixed(2) 
                  : summary.avg_runs_per_player}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-md shadow-md">
          <h2 className="text-xl font-semibold mb-4">Overall Bowling Statistics</h2>
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-green-50 p-4 rounded-md">
              <p className="text-sm text-gray-500">Total Wickets</p>
              <p className="text-3xl font-bold">{summary.total_wickets}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-md">
              <p className="text-sm text-gray-500">Average Economy</p>
              <p className="text-3xl font-bold">
                {typeof summary.avg_economy === 'number' 
                  ? summary.avg_economy.toFixed(2) 
                  : summary.avg_economy}
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-md">
              <p className="text-sm text-gray-500">Total Overs Bowled</p>
              <p className="text-3xl font-bold">{summary.total_overs_bowled}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-md">
              <p className="text-sm text-gray-500">Average Wickets Per Player</p>
              <p className="text-3xl font-bold">
                {typeof summary.avg_wickets_per_player === 'number' 
                  ? summary.avg_wickets_per_player.toFixed(2) 
                  : summary.avg_wickets_per_player}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-md shadow-md">
          <h2 className="text-xl font-semibold mb-4">Top Batsmen</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="py-3 px-4 text-left">Name</th>
                  <th className="py-3 px-4 text-left">University</th>
                  <th className="py-3 px-4 text-right">Runs</th>
                  <th className="py-3 px-4 text-right">Strike Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {summary.top_batsmen && summary.top_batsmen.map((player, index) => (
                  <tr key={player.player_id} className={index === 0 ? "bg-yellow-50" : ""}>
                    <td className="py-3 px-4">
                      <Link href={`/admin/player-stats/${player.player_id}`} className="text-blue-500 hover:underline">
                        {player.name} {index === 0 && "🏆"}
                      </Link>
                    </td>
                    <td className="py-3 px-4">{player.university}</td>
                    <td className="py-3 px-4 text-right">{player.total_runs}</td>
                    <td className="py-3 px-4 text-right">
                      {typeof player.batting_strike_rate === 'number' 
                        ? player.batting_strike_rate.toFixed(2) 
                        : player.batting_strike_rate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white p-6 rounded-md shadow-md">
          <h2 className="text-xl font-semibold mb-4">Top Bowlers</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="py-3 px-4 text-left">Name</th>
                  <th className="py-3 px-4 text-left">University</th>
                  <th className="py-3 px-4 text-right">Wickets</th>
                  <th className="py-3 px-4 text-right">Economy</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {summary.top_bowlers && summary.top_bowlers.map((player, index) => (
                  <tr key={player.player_id} className={index === 0 ? "bg-yellow-50" : ""}>
                    <td className="py-3 px-4">
                      <Link href={`/admin/player-stats/${player.player_id}`} className="text-blue-500 hover:underline">
                        {player.name} {index === 0 && "🏆"}
                      </Link>
                    </td>
                    <td className="py-3 px-4">{player.university}</td>
                    <td className="py-3 px-4 text-right">{player.wickets}</td>
                    <td className="py-3 px-4 text-right">
                      {typeof player.bowling_economy === 'number' 
                        ? player.bowling_economy.toFixed(2) 
                        : player.bowling_economy}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-md shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Top Performers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-purple-50 p-4 rounded-md">
            <h3 className="text-lg font-semibold mb-2">Highest Run Scorer</h3>
            {summary.highest_run_scorer && (
              <div>
                <Link href={`/admin/player-stats/${summary.highest_run_scorer.player_id}`} className="text-xl font-bold hover:underline">
                  {summary.highest_run_scorer.name} 🏆
                </Link>
                <p className="mt-1">{summary.highest_run_scorer.university}</p>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-sm text-gray-500">Runs</p>
                    <p className="font-semibold">{summary.highest_run_scorer.total_runs}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Strike Rate</p>
                    <p className="font-semibold">
                      {typeof summary.highest_run_scorer?.batting_strike_rate === 'number' 
                        ? summary.highest_run_scorer.batting_strike_rate.toFixed(2) 
                        : summary.highest_run_scorer?.batting_strike_rate}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="bg-purple-50 p-4 rounded-md">
            <h3 className="text-lg font-semibold mb-2">Highest Wicket Taker</h3>
            {summary.highest_wicket_taker && (
              <div>
                <Link href={`/admin/player-stats/${summary.highest_wicket_taker.player_id}`} className="text-xl font-bold hover:underline">
                  {summary.highest_wicket_taker.name} 🏆
                </Link>
                <p className="mt-1">{summary.highest_wicket_taker.university}</p>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-sm text-gray-500">Wickets</p>
                    <p className="font-semibold">{summary.highest_wicket_taker.wickets}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Economy</p>
                    <p className="font-semibold">
                      {typeof summary.highest_wicket_taker?.bowling_economy === 'number' 
                        ? summary.highest_wicket_taker.bowling_economy.toFixed(2) 
                        : summary.highest_wicket_taker?.bowling_economy}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-md shadow-md">
        <h2 className="text-xl font-semibold mb-4">University Performance</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="py-3 px-4 text-left">University</th>
                <th className="py-3 px-4 text-right">Players</th>
                <th className="py-3 px-4 text-right">Total Runs</th>
                <th className="py-3 px-4 text-right">Total Wickets</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {summary.university_stats && summary.university_stats.map((university) => (
                <tr key={university.university}>
                  <td className="py-3 px-4 font-medium">{university.university}</td>
                  <td className="py-3 px-4 text-right">{university.player_count}</td>
                  <td className="py-3 px-4 text-right">{university.total_runs}</td>
                  <td className="py-3 px-4 text-right">{university.total_wickets}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 