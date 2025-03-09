'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function BudgetPage() {
  const { data: session, status } = useSession();
  const [budget, setBudget] = useState({
    total: 9000000,
    used: 0,
    remaining: 9000000,
    players: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'authenticated') {
      // Here we would fetch the user's budget details
      // For now, just mock the data
      setBudget({
        total: 9000000,
        used: 0,
        remaining: 9000000,
        players: []
      });
      setLoading(false);
    }
  }, [status]);

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Budget</h1>
        <div className="flex justify-center items-center h-96">
          <p className="text-gray-600">Loading budget details...</p>
        </div>
      </div>
    );
  }

  const percentUsed = (budget.used / budget.total) * 100;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Budget</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-md shadow-md">
          <h2 className="text-lg font-semibold mb-4">Budget Overview</h2>
          
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Total Budget</span>
              <span className="font-medium">Rs. {budget.total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Used Budget</span>
              <span className="font-medium">Rs. {budget.used.toLocaleString()}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Remaining Budget</span>
              <span className="font-medium text-green-600">Rs. {budget.remaining.toLocaleString()}</span>
            </div>
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Budget Utilization</span>
              <span className="font-medium">{percentUsed.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full" 
                style={{ width: `${percentUsed}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-md shadow-md">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          
          <div className="grid grid-cols-1 gap-4">
            <Link
              href="/select-team"
              className="block p-4 bg-blue-50 hover:bg-blue-100 rounded-md"
            >
              <div className="flex justify-between items-center">
                <span className="font-medium">Select Players</span>
                <span>→</span>
              </div>
            </Link>
            
            <Link
              href="/team"
              className="block p-4 bg-green-50 hover:bg-green-100 rounded-md"
            >
              <div className="flex justify-between items-center">
                <span className="font-medium">View Your Team</span>
                <span>→</span>
              </div>
            </Link>
            
            <Link
              href="/leaderboard"
              className="block p-4 bg-purple-50 hover:bg-purple-100 rounded-md"
            >
              <div className="flex justify-between items-center">
                <span className="font-medium">Check Leaderboard</span>
                <span>→</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
      
      {budget.players.length > 0 ? (
        <div className="bg-white p-6 rounded-md shadow-md">
          <h2 className="text-lg font-semibold mb-4">Budget Allocation</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left">Player</th>
                  <th className="px-4 py-2 text-left">Category</th>
                  <th className="px-4 py-2 text-right">Value</th>
                  <th className="px-4 py-2 text-right">% of Budget</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {budget.players.map(player => (
                  <tr key={player.player_id}>
                    <td className="px-4 py-2">
                      <Link href={`/players/${player.player_id}`} className="text-blue-500 hover:underline">
                        {player.name}
                      </Link>
                    </td>
                    <td className="px-4 py-2">{player.category}</td>
                    <td className="px-4 py-2 text-right">Rs. {player.value.toLocaleString()}</td>
                    <td className="px-4 py-2 text-right">
                      {((player.value / budget.total) * 100).toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td className="px-4 py-2 font-medium" colSpan="2">Total</td>
                  <td className="px-4 py-2 text-right font-medium">Rs. {budget.used.toLocaleString()}</td>
                  <td className="px-4 py-2 text-right font-medium">{percentUsed.toFixed(1)}%</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-md shadow-md text-center">
          <h2 className="text-lg font-semibold mb-4">No Budget Allocation Yet</h2>
          <p className="text-gray-600 mb-6">
            You haven't selected any players yet. Your entire budget is still available.
          </p>
          <Link
            href="/select-team"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Start Building Your Team
          </Link>
        </div>
      )}
    </div>
  );
} 