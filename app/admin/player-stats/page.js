'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function PlayerStatsPage() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Fetch players data
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const res = await fetch('/api/admin/players');
        if (!res.ok) throw new Error('Failed to fetch players');
        const data = await res.json();
        setPlayers(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching players:', error);
        setLoading(false);
      }
    };

    fetchPlayers();

    // Setup WebSocket connection for real-time updates
    const socket = new WebSocket(`${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/api/websocket`);

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'player_update') {
        fetchPlayers();
      }
    };

    return () => {
      socket.close();
    };
  }, []);

  // Filter players based on search term and category filter
  const filteredPlayers = players.filter(player => {
    const nameMatch = player.name.toLowerCase().includes(searchTerm.toLowerCase());
    const categoryMatch = categoryFilter === '' || player.category === categoryFilter;
    return nameMatch && categoryMatch;
  });

  if (loading) {
    return <div className="flex justify-center items-center h-96">Loading...</div>;
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-6">Player Statistics</h1>

      <div className="bg-white p-4 rounded-md shadow-md mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block mb-1">Search by Name</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search players..."
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div className="w-full md:w-64">
            <label className="block mb-1">Filter by Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="">All Categories</option>
              <option value="Batsman">Batsman</option>
              <option value="Bowler">Bowler</option>
              <option value="All-Rounder">All-Rounder</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlayers.map(player => (
          <Link
            key={player.player_id}
            href={`/admin/player-stats/${player.player_id}`}
            className="bg-white rounded-md shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold">{player.name}</h2>
                <span className="px-2 py-1 bg-gray-100 text-xs rounded-full">{player.category}</span>
              </div>

              <p className="text-gray-600 mb-4">{player.university}</p>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Value</p>
                  <p className="font-semibold">Rs. {player.player_value?.toLocaleString()}</p>
                </div>
                {player.category === 'Batsman' || player.category === 'All-Rounder' ? (
                  <>
                    <div>
                      <p className="text-sm text-gray-500">Runs</p>
                      <p className="font-semibold">{player.total_runs}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Batting Strike Rate</p>
                      <p className="font-semibold">
                        {typeof player.batting_strike_rate === 'number'
                          ? player.batting_strike_rate.toFixed(2)
                          : player.batting_strike_rate}
                      </p>
                    </div>
                  </>
                ) : null}
                {player.category === 'Bowler' || player.category === 'All-Rounder' ? (
                  <>
                    <div>
                      <p className="text-sm text-gray-500">Bowling Strike Rate</p>
                      <p className="font-semibold">
                        {typeof player.bowling_strike_rate === 'number'
                          ? player.bowling_strike_rate.toFixed(2)
                          : player.bowling_strike_rate || 0}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Wickets</p>
                      <p className="font-semibold">{player.wickets}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Economy Rate</p>
                      <p className="font-semibold">
                        {typeof player.economy_rate === 'number'
                          ? player.economy_rate.toFixed(2)
                          : player.economy_rate || 0}
                      </p>
                    </div>
                  </>
                ) : null}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}