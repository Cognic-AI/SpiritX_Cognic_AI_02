"use client";

import { useState, useEffect } from "react";
import { Team, Player } from "@/types";
import PlayerCard from "@/components/players/PlayerCard";
import Link from "next/link";

export default function TeamPage() {
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [removingPlayer, setRemovingPlayer] = useState<boolean>(false);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/teams");
        
        if (!response.ok) {
          throw new Error("Failed to fetch team");
        }
        
        const data = await response.json();
        setTeam(data);
      } catch (error) {
        console.error("Error fetching team:", error);
        setError("Failed to load team. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, []);

  const handleRemoveFromTeam = async (playerId: number) => {
    try {
      setRemovingPlayer(true);
      const response = await fetch(`/api/teams/players?playerId=${playerId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to remove player from team");
      }

      // Refresh team data
      const teamResponse = await fetch("/api/teams");
      if (teamResponse.ok) {
        const teamData = await teamResponse.json();
        setTeam(teamData);
      }
    } catch (error) {
      console.error("Error removing player:", error);
      alert("Failed to remove player from team");
    } finally {
      setRemovingPlayer(false);
    }
  };

  const categoryOrder = ["Batsman", "All-Rounder", "Bowler"];

  const getCategoryPlayers = (category: string) => {
    if (!team) return [];
    return team.teamPlayers
      .filter(tp => tp.player.category === category)
      .map(tp => tp.player);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Team</h1>

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
      ) : team ? (
        <div>
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{team.teamName}</h2>
                <p className="text-gray-600">Players: {team.playerCount}/11</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Team Value</p>
                <p className="text-2xl font-bold text-indigo-600">
                  ₹{team.totalValue.toLocaleString()}
                </p>
              </div>
            </div>
            {team.isComplete && (
              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between items-center">
                  <p className="text-gray-600">Total Points</p>
                  <p className="text-2xl font-bold text-green-600">
                    {team.totalPoints.toFixed(2)}
                  </p>
                </div>
              </div>
            )}
          </div>

          {team.playerCount === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Your team is empty</h3>
              <p className="text-gray-600 mb-6">
                Start building your dream team by selecting players!
              </p>
              <Link
                href="/select-team"
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Select Players
              </Link>
            </div>
          ) : (
            <div className="space-y-8">
              {categoryOrder.map((category) => {
                const categoryPlayers = getCategoryPlayers(category);
                if (categoryPlayers.length === 0) return null;
                
                return (
                  <div key={category}>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">{category}s</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {categoryPlayers.map((player) => (
                        <PlayerCard
                          key={player.id}
                          player={player}
                          showStats={true}
                          showPoints={true}
                          showRemoveButton={true}
                          onRemoveFromTeam={handleRemoveFromTeam}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-8 flex justify-between items-center">
            <div>
              <p className="text-gray-600">Available Budget</p>
              <p className="text-xl font-bold text-indigo-600">
                ₹{(9000000 - team.totalValue).toLocaleString()}
              </p>
            </div>
            <Link
              href="/select-team"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              {team.playerCount < 11 ? "Complete Your Team" : "Manage Team"}
            </Link>
          </div>
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-500">No team found. Let's create one!</p>
          <Link
            href="/select-team"
            className="mt-4 inline-block px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Create Team
          </Link>
        </div>
      )}
    </div>
  );
} 