"use client";

import { useState, useEffect } from "react";
import { LeaderboardEntry } from "@/types";
import { useSession } from "next-auth/react";

export default function LeaderboardPage() {
  const { data: session } = useSession();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/leaderboard");
        
        if (!response.ok) {
          throw new Error("Failed to fetch leaderboard");
        }
        
        const data = await response.json();
        setLeaderboard(data);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
        setError("Failed to load leaderboard. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Leaderboard</h1>

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
      ) : leaderboard.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">No teams on the leaderboard yet</h3>
          <p className="text-gray-600">
            Teams need to have 11 players to appear on the leaderboard. Be the first to complete your team!
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rank
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Team
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Points
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {leaderboard.map((entry, index) => (
                  <tr 
                    key={entry.id}
                    className={
                      session && entry.username === session.user?.id
                        ? "bg-indigo-50"
                        : index % 2 === 0 
                          ? "bg-white" 
                          : "bg-gray-50"
                    }
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`
                          flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center
                          ${index === 0 
                            ? "bg-yellow-100 text-yellow-800" 
                            : index === 1 
                              ? "bg-gray-100 text-gray-800" 
                              : index === 2 
                                ? "bg-amber-100 text-amber-800"
                                : "bg-white text-gray-500 border border-gray-200"
                          }
                        `}>
                          <span className="text-sm font-medium">{index + 1}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {entry.teamName || `Team ${entry.username}`}
                          </div>
                          <div className="text-sm text-gray-500">
                            {entry.user.displayName || entry.username}
                          </div>
                        </div>
                        {session && entry.username === session.user?.id && (
                          <span className="ml-2 px-2 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-800">
                            You
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {entry.totalPoints.toFixed(2)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="mt-6 bg-indigo-50 rounded-lg p-4">
        <h2 className="text-lg font-semibold text-indigo-900 mb-2">How Points Are Calculated</h2>
        <p className="text-sm text-indigo-700">
          Player points are calculated based on their performance metrics:
        </p>
        <div className="mt-2 text-sm text-indigo-700">
          <p className="font-medium">Player Points = (Batting Component) + (Bowling Component)</p>
          <ul className="list-disc pl-6 mt-1 space-y-1">
            <li>Batting Component = (Batting Strike Rate / 5 + Batting Average × 0.8)</li>
            <li>Bowling Component = (500 / Bowling Strike Rate + 140 / Economy Rate)</li>
          </ul>
        </div>
        <p className="mt-2 text-sm text-indigo-700">
          Your team's total points is the sum of all 11 players' points.
        </p>
      </div>
    </div>
  );
} 