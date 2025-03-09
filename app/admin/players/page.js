'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function PlayersPage() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    university: '',
    category: 'Batsman',
    total_runs: 0,
    balls_faced: 0,
    innings_played: 0,
    wickets: 0,
    overs_bowled: 0,
    runs_conceded: 0
  });
  const [editingId, setEditingId] = useState(null);
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
        // Refresh player data on update
        fetchPlayers();
      }
    };

    return () => {
      socket.close();
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Only convert to numbers for numeric fields, keep strings for text fields
    const numericFields = ['total_runs', 'balls_faced', 'innings_played', 'wickets', 'overs_bowled', 'runs_conceded'];
    
    setFormData({
      ...formData,
      [name]: numericFields.includes(name) ? Number(value) : value
    });
  };

  const handleAddPlayer = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError('');
    
    try {
      // Validate the form data
      const validatedFormData = { ...formData };
      
      // Ensure all numeric fields are numbers
      ['total_runs', 'balls_faced', 'innings_played', 'wickets', 'overs_bowled', 'runs_conceded'].forEach(field => {
        validatedFormData[field] = Number(validatedFormData[field]) || 0;
      });
      
      // Ensure all string fields are strings
      ['name', 'university', 'category'].forEach(field => {
        validatedFormData[field] = String(validatedFormData[field] || '');
      });
      
      const res = await fetch('/api/admin/players', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validatedFormData),
      });

      const responseData = await res.json();
      
      if (!res.ok) {
        throw new Error(responseData.error || 'Failed to add player');
      }
      
      setPlayers([...players, responseData]);
      setShowAddForm(false);
      setFormData({
        name: '',
        university: '',
        category: 'Batsman',
        total_runs: 0,
        balls_faced: 0,
        innings_played: 0,
        wickets: 0,
        overs_bowled: 0,
        runs_conceded: 0
      });
    } catch (error) {
      console.error('Error adding player:', error);
      setFormError(error.message || 'Failed to add player. Please try again.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditPlayer = (player) => {
    setEditingId(player.player_id);
    setFormData({
      name: player.name,
      university: player.university,
      category: player.category,
      total_runs: player.total_runs,
      balls_faced: player.balls_faced,
      innings_played: player.innings_played,
      wickets: player.wickets,
      overs_bowled: player.overs_bowled,
      runs_conceded: player.runs_conceded
    });
    setShowAddForm(true);
  };

  const handleUpdatePlayer = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError('');
    
    try {
      // Validate the form data
      const validatedFormData = { ...formData };
      
      // Ensure all numeric fields are numbers
      ['total_runs', 'balls_faced', 'innings_played', 'wickets', 'overs_bowled', 'runs_conceded'].forEach(field => {
        validatedFormData[field] = Number(validatedFormData[field]) || 0;
      });
      
      // Ensure all string fields are strings
      ['name', 'university', 'category'].forEach(field => {
        validatedFormData[field] = String(validatedFormData[field] || '');
      });
      
      const res = await fetch(`/api/admin/players/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validatedFormData),
      });

      const responseData = await res.json();
      
      if (!res.ok) {
        throw new Error(responseData.error || 'Failed to update player');
      }
      
      const updatedPlayers = players.map(player => 
        player.player_id === editingId ? responseData : player
      );
      setPlayers(updatedPlayers);
      setShowAddForm(false);
      setEditingId(null);
      setFormData({
        name: '',
        university: '',
        category: 'Batsman',
        total_runs: 0,
        balls_faced: 0,
        innings_played: 0,
        wickets: 0,
        overs_bowled: 0,
        runs_conceded: 0
      });
    } catch (error) {
      console.error('Error updating player:', error);
      setFormError(error.message || 'Failed to update player. Please try again.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeletePlayer = async (playerId) => {
    if (!confirm('Are you sure you want to delete this player?')) return;
    
    try {
      const res = await fetch(`/api/admin/players/${playerId}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete player');
      
      setPlayers(players.filter(player => player.player_id !== playerId));
    } catch (error) {
      console.error('Error deleting player:', error);
    }
  };

  // Add a filtered players getter
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Players Management</h1>
        <button 
          onClick={() => setShowAddForm(!showAddForm)} 
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          {showAddForm ? 'Cancel' : 'Add New Player'}
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white p-4 rounded-md shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">{editingId ? 'Edit Player' : 'Add New Player'}</h2>
          
          {formError && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {formError}
            </div>
          )}
          
          <form onSubmit={editingId ? handleUpdatePlayer : handleAddPlayer} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block mb-1">University</label>
              <input
                type="text"
                name="university"
                value={formData.university}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              >
                <option value="Batsman">Batsman</option>
                <option value="Bowler">Bowler</option>
                <option value="All-Rounder">All-Rounder</option>
              </select>
            </div>
            <div>
              <label className="block mb-1">Total Runs</label>
              <input
                type="number"
                name="total_runs"
                value={formData.total_runs}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Balls Faced</label>
              <input
                type="number"
                name="balls_faced"
                value={formData.balls_faced}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Innings Played</label>
              <input
                type="number"
                name="innings_played"
                value={formData.innings_played}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Wickets</label>
              <input
                type="number"
                name="wickets"
                value={formData.wickets}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Overs Bowled</label>
              <input
                type="number"
                name="overs_bowled"
                value={formData.overs_bowled}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Runs Conceded</label>
              <input
                type="number"
                name="runs_conceded"
                value={formData.runs_conceded}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={formLoading}
                className={`px-4 py-2 bg-green-500 text-white rounded-md ${formLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-600'}`}
              >
                {formLoading 
                  ? (editingId ? 'Updating...' : 'Adding...') 
                  : (editingId ? 'Update Player' : 'Add Player')}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search and Filter Bar */}
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

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-md overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 text-left">ID</th>
              <th className="py-2 px-4 text-left">Name</th>
              <th className="py-2 px-4 text-left">University</th>
              <th className="py-2 px-4 text-left">Category</th>
              <th className="py-2 px-4 text-left">Value</th>
              <th className="py-2 px-4 text-left">Points</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPlayers.map(player => (
              <tr key={player.player_id} className="border-t hover:bg-gray-50">
                <td className="py-2 px-4">{player.player_id}</td>
                <td className="py-2 px-4">{player.name}</td>
                <td className="py-2 px-4">{player.university}</td>
                <td className="py-2 px-4">{player.category}</td>
                <td className="py-2 px-4">Rs. {player.player_value?.toLocaleString()}</td>
                <td className="py-2 px-4">{player.player_points}</td>
                <td className="py-2 px-4 flex space-x-2">
                  <Link 
                    href={`/admin/player-stats/${player.player_id}`}
                    className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm"
                  >
                    View Stats
                  </Link>
                  <button
                    onClick={() => handleEditPlayer(player)}
                    className="px-3 py-1 bg-yellow-500 text-white rounded-md text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeletePlayer(player.player_id)}
                    className="px-3 py-1 bg-red-500 text-white rounded-md text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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