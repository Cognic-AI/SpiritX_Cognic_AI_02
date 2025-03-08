"use client";

import { useState, useEffect } from "react";
import { TournamentSummary } from "@/types";
import Link from "next/link";

export default function TournamentSummaryPage() {
  const [summary, setSummary] = useState<TournamentSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/tournament-summary");
        
        if (!response.ok) {
          throw new Error("Failed to fetch tournament summary");
        }
        
        const data = await response.json();
        setSummary(data);
      } catch (error) {
        console.error("Error fetching tournament summary:", error);
        setError("Failed to load tournament summary. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Tournament Summary</h1>

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
      ) : summary ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Overall Statistics</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-indigo-50 p-4 rounded-lg">
                <p className="text-sm text-indigo-700 font-medium">Total Runs</p>
                <p className="text-3xl font-bold text-indigo-900">{summary.overallRuns}</p>
              </div>
              <div className="bg-indigo-50 p-4 rounded-lg">
                <p className="text-sm text-indigo-700 font-medium">Total Wickets</p>
                <p className="text-3xl font-bold text-indigo-900">{summary.overallWickets}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Top Performers</h2>
            <div className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-700 font-medium">Highest Run Scorer</p>
                <p className="text-xl font-bold text-gray-900">{summary.highestRunScorer.name}</p>
                <div className="flex justify-between text-sm mt-1">
                  <p className="text-gray-600">{summary.highestRunScorer.university}</p>
                  <p className="font-medium">{summary.highestRunScorer.totalRuns} runs</p>
                </div>
                <div className="mt-2">
                  <Link 
                    href={`/admin/players/${summary.highestRunScorer.id}`}
                    className="text-indigo-600 text-sm hover:underline"
                  >
                    View Player
                  </Link>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-700 font-medium">Highest Wicket Taker</p>
                <p className="text-xl font-bold text-gray-900">{summary.highestWicketTaker.name}</p>
                <div className="flex justify-between text-sm mt-1">
                  <p className="text-gray-600">{summary.highestWicketTaker.university}</p>
                  <p className="font-medium">{summary.highestWicketTaker.wickets} wickets</p>
                </div>
                <div className="mt-2">
                  <Link 
                    href={`/admin/players/${summary.highestWicketTaker.id}`}
                    className="text-indigo-600 text-sm hover:underline"
                  >
                    View Player
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Tournament Insights</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-purple-700 font-medium">Average Runs per Player</p>
                  <p className="text-3xl font-bold text-purple-900">
                    {summary.overallRuns > 0 ? (summary.overallRuns / (summary.highestRunScorer.id || 1)).toFixed(2) : "N/A"}
                  </p>
                </div>
                <div className="bg-pink-50 p-4 rounded-lg">
                  <p className="text-sm text-pink-700 font-medium">Average Wickets per Player</p>
                  <p className="text-3xl font-bold text-pink-900">
                    {summary.overallWickets > 0 ? (summary.overallWickets / (summary.highestWicketTaker.id || 1)).toFixed(2) : "N/A"}
                  </p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-sm text-yellow-700 font-medium">Tournament Status</p>
                  <p className="text-xl font-bold text-yellow-900">Active</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-500">No tournament data available.</p>
        </div>
      )}
    </div>
  );
} 