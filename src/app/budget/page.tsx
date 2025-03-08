"use client";

import { useState, useEffect } from "react";
import { Team } from "@/types";
import Link from "next/link";

export default function BudgetPage() {
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
        setError("Failed to load team. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, []);

  // Calculate some additional metrics
  const totalBudget = 9000000;
  const usedBudget = team?.totalValue || 0;
  const remainingBudget = totalBudget - usedBudget;
  const budgetUsedPercentage = (usedBudget / totalBudget) * 100;
  
  // Calculate average player value
  const averagePlayerValue = team && team.playerCount > 0 
    ? usedBudget / team.playerCount 
    : 0;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Budget Tracker</h1>

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
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Budget Overview</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-indigo-50 p-4 rounded-lg">
                <p className="text-sm text-indigo-700 font-medium">Total Budget</p>
                <p className="text-3xl font-bold text-indigo-900">₹{totalBudget.toLocaleString()}</p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-700 font-medium">Remaining Budget</p>
                <p className="text-3xl font-bold text-green-900">₹{remainingBudget.toLocaleString()}</p>
              </div>
              
              <div className="bg-amber-50 p-4 rounded-lg">
                <p className="text-sm text-amber-700 font-medium">Used Budget</p>
                <p className="text-3xl font-bold text-amber-900">₹{usedBudget.toLocaleString()}</p>
              </div>
            </div>
            
            <div className="mt-6">
              <p className="text-sm text-gray-600 mb-2">Budget Utilization ({budgetUsedPercentage.toFixed(1)}%)</p>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className="bg-indigo-600 h-4 rounded-full" 
                  style={{ width: `${budgetUsedPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Team Investment</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-700 font-medium">Players Selected</p>
                <p className="text-3xl font-bold text-blue-900">{team.playerCount}/11</p>
                <p className="text-sm text-blue-600 mt-2">
                  {team.playerCount < 11 
                    ? `${11 - team.playerCount} more players needed to complete your team` 
                    : "Your team is complete!"}
                </p>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm text-purple-700 font-medium">Average Player Value</p>
                <p className="text-3xl font-bold text-purple-900">
                  ₹{averagePlayerValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </p>
                <p className="text-sm text-purple-600 mt-2">
                  {team.playerCount > 0 
                    ? `Budget divided across ${team.playerCount} players` 
                    : "Add players to see average value"}
                </p>
              </div>
            </div>
          </div>

          {team.playerCount > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Budget Allocation by Player Category</h2>
              
              <div className="space-y-4">
                {["Batsman", "Bowler", "All-Rounder"].map(category => {
                  const categoryPlayers = team.teamPlayers.filter(tp => tp.player.category === category);
                  const categoryValue = categoryPlayers.reduce((sum, tp) => sum + (tp.player.playerValue || 0), 0);
                  const categoryPercentage = (categoryValue / usedBudget) * 100 || 0;
                  
                  if (categoryPlayers.length === 0) return null;
                  
                  return (
                    <div key={category}>
                      <div className="flex justify-between mb-1">
                        <p className="text-gray-700">{category}s ({categoryPlayers.length})</p>
                        <p className="text-gray-700">₹{categoryValue.toLocaleString()} ({categoryPercentage.toFixed(1)}%)</p>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            category === "Batsman" 
                              ? "bg-green-500" 
                              : category === "Bowler" 
                                ? "bg-red-500" 
                                : "bg-yellow-500"
                          }`} 
                          style={{ width: `${categoryPercentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex justify-end">
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