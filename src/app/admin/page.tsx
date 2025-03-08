"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function AdminDashboard() {
  const { data: session } = useSession();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await fetch("/api/tournament-summary");
        if (response.ok) {
          const data = await response.json();
          setSummary(data);
        }
      } catch (error) {
        console.error("Error fetching tournament summary:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>
      
      <div className="mb-8">
        <p className="text-gray-600 mb-4">
          Welcome, {session?.user?.name || "Admin"}! From here you can manage players, view statistics, and analyze tournament data.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link 
            href="/admin/players" 
            className="bg-indigo-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <h2 className="text-xl font-semibold text-indigo-700 mb-2">Players Management</h2>
            <p className="text-gray-600">View, add, edit, and delete players</p>
          </Link>
          
          <Link 
            href="/admin/player-stats" 
            className="bg-purple-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <h2 className="text-xl font-semibold text-purple-700 mb-2">Player Statistics</h2>
            <p className="text-gray-600">Analyze detailed player statistics and performance metrics</p>
          </Link>
          
          <Link 
            href="/admin/tournament-summary" 
            className="bg-blue-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <h2 className="text-xl font-semibold text-blue-700 mb-2">Tournament Summary</h2>
            <p className="text-gray-600">View overall tournament statistics and top performers</p>
          </Link>
        </div>
      </div>
      
      {loading ? (
        <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4 w-3/4"></div>
          <div className="h-24 bg-gray-200 rounded"></div>
        </div>
      ) : summary ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Tournament Stats</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 p-4 rounded">
              <p className="text-sm text-green-600 font-medium">Highest Run Scorer</p>
              <p className="text-lg font-bold">{summary.highestRunScorer ? summary.highestRunScorer.name : "No data"}</p>
              <p className="text-sm">{summary.highestRunScorer ? `${summary.highestRunScorer.totalRuns} runs` : "0 runs"}</p>
            </div>
            <div className="bg-orange-50 p-4 rounded">
              <p className="text-sm text-orange-600 font-medium">Highest Wicket Taker</p>
              <p className="text-lg font-bold">{summary.highestWicketTaker ? summary.highestWicketTaker.name : "No data"}</p>
              <p className="text-sm">{summary.highestWicketTaker ? `${summary.highestWicketTaker.wickets} wickets` : "0 wickets"}</p>
            </div>
            <div className="bg-indigo-50 p-4 rounded">
              <p className="text-sm text-indigo-600 font-medium">Total Runs Scored</p>
              <p className="text-xl font-bold">{summary.overallRuns || 0}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded">
              <p className="text-sm text-purple-600 font-medium">Total Wickets Taken</p>
              <p className="text-xl font-bold">{summary.overallWickets || 0}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-500 text-center">No tournament data available</p>
        </div>
      )}
    </div>
  );
} 