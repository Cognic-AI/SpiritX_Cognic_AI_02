"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Player, Team } from "@/types";
import PlayerCard from "@/components/players/PlayerCard";
import Link from "next/link";

export default function SelectTeamPage() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "Batsman";

  const [players, setPlayers] = useState<Player[]>([]);
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [addingPlayer, setAddingPlayer] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch all players
        const playersResponse = await fetch("/api/players");
        
        if (!playersResponse.ok) {
          throw new Error("Failed to fetch players");
        }
        
        const playersData = await playersResponse.json();
        setPlayers(playersData);

        // Fetch user's team
        const teamResponse = await fetch("/api/teams");
        
        if (!teamResponse.ok) {
          throw new Error("Failed to fetch team");
        }
        
        const teamData = await teamResponse.json();
        setTeam(teamData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const categories = Array.from(new Set(players.map(player => player.category)));
  
  const filteredPlayers = players.filter(player => player.category === selectedCategory);

  const isPlayerInTeam = (playerId: number) => {
    if (!team) return false;
    return team.teamPlayers.some(tp => tp.playerId === playerId);
  };

  const handleAddToTeam = async (playerId: number) => {
    try {
      setAddingPlayer(true);
      const response = await fetch("/api/teams/players", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ playerId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add player to team");
      }

      // Refresh team data
      const teamResponse = await fetch("/api/teams");
      if (teamResponse.ok) {
        const teamData = await teamResponse.json();
        setTeam(teamData);
      }
    } catch (error: any) {
      alert(error.message || "Failed to add player to team");
    } finally {
      setAddingPlayer(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Select Your Team</h1>
      
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <p className="text-gray-600">
          Select players to build your dream team. You have selected {team?.playerCount || 0}/11 players.
        </p>
        {team && team.playerCount > 0 && (
          <Link 
            href="/team" 
            className="text-indigo-600 font-medium hover:text-indigo-800"
          >
            View Your Team →
          </Link>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Budget Status</h2>
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div>
            <p className="text-sm text-gray-500">Available Budget</p>
            <p className="text-2xl font-bold text-indigo-600">
              ₹{team ? team.user?.budget.toLocaleString() : "9,000,000"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Used Budget</p>
            <p className="text-2xl font-bold text-gray-700">
              ₹{team ? team.totalValue.toLocaleString() : "0"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Players Selected</p>
            <p className="text-2xl font-bold text-gray-700">
              {team?.playerCount || 0}/11
            </p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Player Categories</h2>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded text-sm font-medium ${
                selectedCategory === category
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : error ? (
        <div className="text-center py-10">
          <p className="text-red-500">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Try Again
          </button>
        </div>
      ) : filteredPlayers.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">No players found in this category.</p>
        </div>
      ) : (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">{selectedCategory}s</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredPlayers.map((player) => (
              <PlayerCard
                key={player.id}
                player={player}
                showAddButton={true}
                showStats={false}
                showPoints={true}
                isInTeam={isPlayerInTeam(player.id)}
                onAddToTeam={handleAddToTeam}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 