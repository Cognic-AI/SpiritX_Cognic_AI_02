"use client";

import { useState, useEffect } from "react";
import { Player } from "@/types";
import PlayerCard from "@/components/players/PlayerCard";

export default function PlayersPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/players");
        
        if (!response.ok) {
          throw new Error("Failed to fetch players");
        }
        
        const data = await response.json();
        setPlayers(data);
        
        // Set first player as selected by default
        if (data.length > 0 && !selectedPlayer) {
          setSelectedPlayer(data[0]);
        }
      } catch (error) {
        console.error("Error fetching players:", error);
        setError("Failed to load players. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, []);

  const categories = ["all", ...Array.from(new Set(players.map(player => player.category)))];
  
  const filteredPlayers = selectedCategory === "all" 
    ? players 
    : players.filter(player => player.category === selectedCategory);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Players</h1>

      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                selectedCategory === category
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
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
          <p className="text-gray-500">No players found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 overflow-y-auto max-h-[70vh] pr-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
              {filteredPlayers.map((player) => (
                <div 
                  key={player.id} 
                  onClick={() => setSelectedPlayer(player)}
                  className={`bg-white rounded-lg shadow-sm p-4 cursor-pointer transition-colors ${
                    selectedPlayer?.id === player.id 
                      ? "border-2 border-indigo-500" 
                      : "border border-gray-200 hover:border-indigo-300"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900">{player.name}</h3>
                      <p className="text-sm text-gray-600">{player.university}</p>
                    </div>
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-800">
                      {player.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="lg:col-span-2">
            {selectedPlayer && (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{selectedPlayer.name}</h2>
                      <p className="text-gray-600">{selectedPlayer.university}</p>
                    </div>
                    <span className="px-3 py-1 text-sm font-semibold rounded-full bg-indigo-100 text-indigo-800">
                      {selectedPlayer.category}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Batting</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Runs</span>
                          <span className="font-semibold">{selectedPlayer.totalRuns}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Balls Faced</span>
                          <span className="font-semibold">{selectedPlayer.ballsFaced}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Innings Played</span>
                          <span className="font-semibold">{selectedPlayer.inningsPlayed}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Strike Rate</span>
                          <span className="font-semibold">
                            {selectedPlayer.battingStrikeRate?.toFixed(2) || "N/A"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Average</span>
                          <span className="font-semibold">
                            {selectedPlayer.battingAverage?.toFixed(2) || "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Bowling</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Wickets</span>
                          <span className="font-semibold">{selectedPlayer.wickets}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Overs Bowled</span>
                          <span className="font-semibold">{selectedPlayer.oversBowled.toFixed(1)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Runs Conceded</span>
                          <span className="font-semibold">{selectedPlayer.runsConceded}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Strike Rate</span>
                          <span className="font-semibold">
                            {selectedPlayer.bowlingStrikeRate && selectedPlayer.bowlingStrikeRate < 999
                              ? selectedPlayer.bowlingStrikeRate.toFixed(2)
                              : "N/A"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Economy Rate</span>
                          <span className="font-semibold">
                            {selectedPlayer.economyRate && selectedPlayer.economyRate < 999
                              ? selectedPlayer.economyRate.toFixed(2)
                              : "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-gray-500 text-sm">Player Value</p>
                        <p className="text-2xl font-bold text-indigo-600">
                          ₹{selectedPlayer.playerValue?.toLocaleString() || "N/A"}
                        </p>
                      </div>
                      
                      <a 
                        href={`/select-team?category=${selectedPlayer.category}`}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Select Team
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 