'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function SelectPlayersByCategoryPage({ params }) {
  const { category } = params;
  const { data: session, status } = useSession();
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [userTeam, setUserTeam] = useState([]);
  const [budget, setBudget] = useState(9000000);

  // Format the category for display
  const formatCategory = (cat) => {
    if (cat === 'batsman') return 'Batsman';
    if (cat === 'bowler') return 'Bowler';
    if (cat === 'all-rounder') return 'All-Rounder';
    return cat;
  };

  const displayCategory = formatCategory(category);

  useEffect(() => {
    if (status === 'authenticated') {
      const fetchPlayers = async () => {
        try {
          // Fetch players data based on category
          const res = await fetch('/api/players');
          if (!res.ok) throw new Error('Failed to fetch players');
          const data = await res.json();
          
          // Filter players by category
          const filteredPlayers = data.filter(player => 
            player.category.toLowerCase() === displayCategory.toLowerCase()
          );
          
          setPlayers(filteredPlayers);
          
          // Fetch user's team (mock data for now)
          // In a real app, you would fetch this from your API
          setUserTeam([]);
          setBudget(session.user.budget || 9000000);
          
          setLoading(false);
        } catch (error) {
          console.error('Error:', error);
          setLoading(false);
        }
      };

      fetchPlayers();
    }
  }, [status, displayCategory, session]);

  // Filter players based on search term
  const filteredPlayers = players.filter(player => 
    player.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Check if player is already in team
  const isPlayerInTeam = (playerId) => {
    return userTeam.some(player => player.player_id === playerId);
  };

  // Add player to team
  const addToTeam = (player) => {
    // Check if player is already in team
    if (isPlayerInTeam(player.player_id)) {
      alert('This player is already in your team!');
      return;
    }
    
    // Check if budget allows
    if (budget < player.player_value) {
      alert('Not enough budget to add this player!');
      return;
    }
    
    // In a real app, you would call your API to update the team
    console.log(`Adding player ${player.name} to team`);
    
    // Mock update of team and budget
    setUserTeam([...userTeam, player]);
    setBudget(budget - player.player_value);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Select {displayCategory}s</h1>
        <div className="flex justify-center items-center h-96">
          <p className="text-gray-600">Loading players...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <Link href="/select-team" className="text-blue-500 hover:underline">
          &larr; Back to Categories
        </Link>
      </div>
      
      <h1 className="text-2xl font-bold mb-6">Select {displayCategory}s</h1>
      
      <div className="bg-white p-4 rounded-md shadow-md mb-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4">
          <div className="w-full md:w-1/2 mb-4 md:mb-0">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={`Search ${displayCategory}s...`}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div>
            <p className="text-gray-700 font-medium">
              Available Budget: <span className="text-green-600">Rs. {budget.toLocaleString()}</span>
            </p>
            <p className="text-gray-700 text-sm">
              Team: <span className="text-blue-600">{userTeam.length}/11 players</span>
            </p>
          </div>
        </div>
      </div>
      
      {filteredPlayers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlayers.map(player => (
            <div 
              key={player.player_id} 
              className="bg-white rounded-md shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-semibold">{player.name}</h2>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">{player.category}</span>
                </div>
                
                <p className="text-gray-600 mb-4">{player.university}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Value</p>
                    <p className="font-semibold">Rs. {player.player_value?.toLocaleString()}</p>
                  </div>
                  
                  {player.category === 'Batsman' || player.category === 'All-Rounder' ? (
                    <div>
                      <p className="text-sm text-gray-500">Batting Average</p>
                      <p className="font-semibold">
                        {typeof player.batting_average === 'number' 
                          ? player.batting_average.toFixed(2) 
                          : player.batting_average || 'N/A'}
                      </p>
                    </div>
                  ) : null}
                  
                  {player.category === 'Bowler' || player.category === 'All-Rounder' ? (
                    <div>
                      <p className="text-sm text-gray-500">Bowling Average</p>
                      <p className="font-semibold">
                        {typeof player.bowling_average === 'number' 
                          ? player.bowling_average.toFixed(2) 
                          : player.bowling_average || 'N/A'}
                      </p>
                    </div>
                  ) : null}
                </div>
                
                <div className="flex justify-between items-center">
                  <Link 
                    href={`/players/${player.player_id}`} 
                    className="text-blue-500 hover:underline"
                  >
                    View Profile
                  </Link>
                  
                  <button
                    onClick={() => addToTeam(player)}
                    disabled={isPlayerInTeam(player.player_id) || budget < player.player_value}
                    className={`px-4 py-2 rounded-md ${
                      isPlayerInTeam(player.player_id)
                        ? 'bg-gray-300 cursor-not-allowed'
                        : budget < player.player_value
                        ? 'bg-red-300 cursor-not-allowed'
                        : 'bg-green-500 text-white hover:bg-green-600'
                    }`}
                  >
                    {isPlayerInTeam(player.player_id)
                      ? 'In Team'
                      : budget < player.player_value
                      ? 'Insufficient Budget'
                      : 'Add to Team'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-8 rounded-md shadow-md text-center">
          <p className="text-xl text-gray-600 mb-4">No {displayCategory}s found</p>
          <p className="text-gray-600 mb-6">
            Try changing your search criteria or check back later.
          </p>
          <button
            onClick={() => setSearchTerm('')}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Clear Search
          </button>
        </div>
      )}
      
      <div className="mt-8 flex justify-between">
        <Link 
          href="/select-team" 
          className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
        >
          Back to Categories
        </Link>
        
        <Link 
          href="/team" 
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          View Your Team
        </Link>
      </div>
    </div>
  );
} 