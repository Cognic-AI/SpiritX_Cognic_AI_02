"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AddPlayerPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    university: "",
    category: "Batsman", // Default category
    totalRuns: 0,
    ballsFaced: 0,
    inningsPlayed: 0,
    wickets: 0,
    oversBowled: 0,
    runsConceded: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Handle different types of fields appropriately
    if (name === "name" || name === "university" || name === "category") {
      // Text fields
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    } else if (name === "oversBowled") {
      // Decimal field (overs can be partial like 4.5)
      // Only allow valid numbers or empty string
      if (value === "" || !isNaN(parseFloat(value))) {
        setFormData(prev => ({
          ...prev,
          [name]: value === "" ? 0 : parseFloat(value)
        }));
      }
    } else {
      // Integer fields (runs, wickets, etc.)
      // Only allow valid integers or empty string
      if (value === "" || !isNaN(parseInt(value, 10))) {
        setFormData(prev => ({
          ...prev,
          [name]: value === "" ? 0 : parseInt(value, 10)
        }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.university) {
      setError("Name and university are required");
      return;
    }

    try {
      setLoading(true);
      setError("");
      
      const response = await fetch("/api/players", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to add player");
      }

      // Redirect to players page
      router.push("/admin/players");
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
      console.error("Add player error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Add New Player</h1>
        <Link
          href="/admin/players"
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
        >
          Back to Players
        </Link>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-500 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="name">
              Player Name*
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="university">
              University*
            </label>
            <input
              type="text"
              id="university"
              name="university"
              value={formData.university}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="category">
              Category*
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
              required
            >
              <option value="Batsman">Batsman</option>
              <option value="Bowler">Bowler</option>
              <option value="All-Rounder">All-Rounder</option>
            </select>
          </div>
        </div>

        <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-4">Batting Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="totalRuns">
              Total Runs
            </label>
            <input
              type="text"
              inputMode="numeric"
              id="totalRuns"
              name="totalRuns"
              value={formData.totalRuns}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="ballsFaced">
              Balls Faced
            </label>
            <input
              type="text"
              inputMode="numeric"
              id="ballsFaced"
              name="ballsFaced"
              value={formData.ballsFaced}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="inningsPlayed">
              Innings Played
            </label>
            <input
              type="text"
              inputMode="numeric"
              id="inningsPlayed"
              name="inningsPlayed"
              value={formData.inningsPlayed}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
              placeholder="0"
            />
          </div>
        </div>

        <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-4">Bowling Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="wickets">
              Wickets
            </label>
            <input
              type="text"
              inputMode="numeric"
              id="wickets"
              name="wickets"
              value={formData.wickets}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="oversBowled">
              Overs Bowled
            </label>
            <input
              type="text"
              inputMode="decimal"
              id="oversBowled"
              name="oversBowled"
              value={formData.oversBowled}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
              placeholder="0"
            />
            <p className="text-xs text-gray-500 mt-1">Decimal values allowed (e.g., 4.5)</p>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="runsConceded">
              Runs Conceded
            </label>
            <input
              type="text"
              inputMode="numeric"
              id="runsConceded"
              name="runsConceded"
              value={formData.runsConceded}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
              placeholder="0"
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="button"
            onClick={() => router.push("/admin/players")}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 mr-4"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Player"}
          </button>
        </div>
      </form>
    </div>
  );
} 