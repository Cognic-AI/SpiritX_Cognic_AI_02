'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function PlayersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [players, setPlayers] = useState([]);
  const [recommendedPlayers, setRecommendedPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/players');
    }
  }, [status, router]);

  // Fetch players data
  useEffect(() => {
    if (status === 'authenticated') {
      const fetchPlayers = async () => {
        try {
          const res = await fetch('/api/players');
          if (!res.ok) throw new Error('Failed to fetch players');
          const data = await res.json();
          setPlayers(data);

          // Get recommended players (top players from each category)
          const batsmen = data.filter(player => player.category === 'Batsman')
            .sort((a, b) => b.total_runs - a.total_runs).slice(0, 2);

          const bowlers = data.filter(player => player.category === 'Bowler')
            .sort((a, b) => b.wickets - a.wickets).slice(0, 2);

          const allRounders = data.filter(player => player.category === 'All-Rounder')
            .sort((a, b) => (b.total_runs + b.wickets * 20) - (a.total_runs + a.wickets * 20)).slice(0, 2);

          setRecommendedPlayers([...batsmen, ...bowlers, ...allRounders]);
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
    }
  }, [status]);

  // Filter players based on search term and category filter
  const filteredPlayers = players.filter(player => {
    const nameMatch = player.name.toLowerCase().includes(searchTerm.toLowerCase());
    const categoryMatch = categoryFilter === '' || player.category === categoryFilter;
    return nameMatch && categoryMatch;
  });

  // Show loading if player data is being fetched
  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Players</h1>
        <div className="flex justify-center items-center h-96">
          <p className="text-gray-600">Loading players...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Players</h1>

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

      {/* Recommended Players Section */}
      {searchTerm === '' && categoryFilter === '' && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Recommended Players</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {recommendedPlayers.map(player => (
              <Link
                key={player.player_id}
                href={`/players/${player.player_id}`}
                className="bg-white rounded-md shadow-md overflow-hidden hover:shadow-lg transition-shadow border-2 border-blue-200"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-semibold">{player.name}</h2>
                    <span className="px-2 py-1 bg-blue-100 text-xs rounded-full">{player.category}</span>
                  </div>

                  <p className="text-gray-600 mb-4">{player.university}</p>

                  <div className="mb-2">
                    <p className="text-sm font-medium text-blue-600">⭐ Recommended Player</p>
                  </div>

                  {player.category === 'Batsman' || player.category === 'All-Rounder' ? (
                    <div className="mb-2">
                      <div className="grid grid-cols-2 gap-2 mt-1">
                        <div>
                          <p className="text-xs text-gray-500">Runs</p>
                          <p className="font-semibold">{player.total_runs}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Strike Rate</p>
                          <p className="font-semibold">
                            {typeof player.batting_strike_rate === 'number'
                              ? player.batting_strike_rate.toFixed(2)
                              : player.batting_strike_rate}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : null}

                  {player.category === 'Bowler' || player.category === 'All-Rounder' ? (
                    <div>
                      <div className="grid grid-cols-2 gap-2 mt-1">
                        <div>
                          <p className="text-xs text-gray-500">Wickets</p>
                          <p className="font-semibold">{player.wickets}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Economy</p>
                          <p className="font-semibold">
                            {typeof player.economy_rate === 'number'
                              ? player.economy_rate.toFixed(2)
                              : player.economy_rate || 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* All Players Section */}
      <h2 className="text-xl font-semibold mb-4">
        {searchTerm || categoryFilter ? 'Search Results' : 'All Players'}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredPlayers.map(player => (
          <Link
            key={player.player_id}
            href={`/players/${player.player_id}`}
            className="bg-white rounded-md shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold">{player.name}</h2>
                <span className="px-2 py-1 bg-gray-100 text-xs rounded-full">{player.category}</span>
              </div>

              <p className="text-gray-600 mb-4">{player.university}</p>

              {player.category === 'Batsman' || player.category === 'All-Rounder' ? (
                <div className="mb-2">
                  <p className="text-sm font-medium">Batting Stats</p>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <div>
                      <p className="text-xs text-gray-500">Runs</p>
                      <p className="font-semibold">{player.total_runs}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Batting Strike Rate</p>
                      <p className="font-semibold">
                        {typeof player.batting_strike_rate === 'number'
                          ? player.batting_strike_rate.toFixed(2)
                          : player.batting_strike_rate}
                      </p>
                    </div>
                  </div>
                </div>
              ) : null}

              {player.category === 'Bowler' || player.category === 'All-Rounder' ? (
                <div>
                  <p className="text-sm font-medium">Bowling Stats</p>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <div>
                      <p className="text-xs text-gray-500">Wickets</p>
                      <p className="font-semibold">{player.wickets}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Economy Rate</p>
                      <p className="font-semibold">
                        {typeof player.economy_rate === 'number'
                          ? player.economy_rate.toFixed(2)
                          : player.economy_rate || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </Link>
        ))}
      </div>

      {filteredPlayers.length === 0 && (
        <div className="text-center py-10">
          <p className="text-gray-600">No players found matching your criteria.</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setCategoryFilter('');
            }}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
} 