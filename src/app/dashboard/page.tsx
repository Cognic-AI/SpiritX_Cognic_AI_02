"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Team, Player } from "@/types";

export default function Dashboard() {
  const { data: session } = useSession();
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
        setError("Failed to load team data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Welcome to Spirit11!</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Team Status</h2>
          {team ? (
            <div>
              <p className="text-gray-600 mb-2">
                {team.playerCount < 11 
                  ? `You have selected ${team.playerCount}/11 players.` 
                  : "Your team is complete!"}
              </p>
              <p className="text-gray-600 mb-4">
                Available Budget: <span className="font-semibold text-indigo-600">₹{(9000000 - (team.totalValue || 0)).toLocaleString()}</span>
              </p>
              <Link
                href="/team"
                className="text-indigo-600 font-medium hover:text-indigo-800"
              >
                View Your Team →
              </Link>
            </div>
          ) : (
            <div>
              <p className="text-gray-600 mb-4">You haven't created a team yet.</p>
              <Link
                href="/select-team"
                className="text-indigo-600 font-medium hover:text-indigo-800"
              >
                Create Your Team →
              </Link>
            </div>
          )}
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link href="/players" className="block px-4 py-2 bg-indigo-50 text-indigo-700 rounded hover:bg-indigo-100">
              Browse Players
            </Link>
            <Link href="/select-team" className="block px-4 py-2 bg-indigo-50 text-indigo-700 rounded hover:bg-indigo-100">
              Select Team
            </Link>
            <Link href="/leaderboard" className="block px-4 py-2 bg-indigo-50 text-indigo-700 rounded hover:bg-indigo-100">
              View Leaderboard
            </Link>
            <Link href="/spiriter" className="block px-4 py-2 bg-indigo-50 text-indigo-700 rounded hover:bg-indigo-100">
              Ask Spiriter
            </Link>
          </div>
        </div>
      </div>
      
      <div className="bg-indigo-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-indigo-900 mb-4">How to Play</h2>
        <ol className="list-decimal pl-5 space-y-2 text-indigo-800">
          <li>Browse players and analyze their statistics</li>
          <li>Select 11 players for your team within your budget of ₹9,000,000</li>
          <li>Balance your team with batsmen, bowlers, and all-rounders</li>
          <li>Points are calculated based on player performance</li>
          <li>Compete with other users on the leaderboard</li>
        </ol>
      </div>
    </div>
  );
} 