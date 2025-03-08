"use client";

import { useState } from "react";
import Image from "next/image";

type Player = {
  id: number;
  name: string;
  university: string;
  category: string;
  totalRuns: number;
  ballsFaced: number;
  inningsPlayed: number;
  wickets: number;
  oversBowled: number;
  runsConceded: number;
  battingStrikeRate?: number;
  battingAverage?: number;
  bowlingStrikeRate?: number;
  economyRate?: number;
  playerValue?: number;
};

interface PlayerCardProps {
  player: Player;
  showStats?: boolean;
  showPoints?: boolean;
  showAddButton?: boolean;
  showRemoveButton?: boolean;
  isInTeam?: boolean;
  onAddToTeam?: (playerId: number) => void;
  onRemoveFromTeam?: (playerId: number) => void;
}

export default function PlayerCard({
  player,
  showStats = false,
  showPoints = false,
  showAddButton = false,
  showRemoveButton = false,
  isInTeam = false,
  onAddToTeam,
  onRemoveFromTeam,
}: PlayerCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleAddToTeam = async () => {
    if (onAddToTeam) {
      setIsLoading(true);
      try {
        await onAddToTeam(player.id);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleRemoveFromTeam = async () => {
    if (onRemoveFromTeam) {
      setIsLoading(true);
      try {
        await onRemoveFromTeam(player.id);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${isInTeam ? "border-2 border-indigo-500" : ""}`}>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">{player.name}</h3>
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-800">
            {player.category}
          </span>
        </div>
        <p className="text-sm text-gray-600 mt-1">{player.university}</p>

        {showStats && (
          <div className="mt-4 border-t pt-4">
            <h4 className="font-medium text-gray-900 mb-2">Batting Stats</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-gray-500">Runs</p>
                <p className="font-semibold">{player.totalRuns}</p>
              </div>
              <div>
                <p className="text-gray-500">Balls Faced</p>
                <p className="font-semibold">{player.ballsFaced}</p>
              </div>
              <div>
                <p className="text-gray-500">Innings</p>
                <p className="font-semibold">{player.inningsPlayed}</p>
              </div>
              <div>
                <p className="text-gray-500">Strike Rate</p>
                <p className="font-semibold">{player.battingStrikeRate?.toFixed(2) || "N/A"}</p>
              </div>
              <div>
                <p className="text-gray-500">Average</p>
                <p className="font-semibold">{player.battingAverage?.toFixed(2) || "N/A"}</p>
              </div>
            </div>

            <h4 className="font-medium text-gray-900 mb-2 mt-4">Bowling Stats</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-gray-500">Wickets</p>
                <p className="font-semibold">{player.wickets}</p>
              </div>
              <div>
                <p className="text-gray-500">Overs</p>
                <p className="font-semibold">{player.oversBowled.toFixed(1)}</p>
              </div>
              <div>
                <p className="text-gray-500">Runs Conceded</p>
                <p className="font-semibold">{player.runsConceded}</p>
              </div>
              <div>
                <p className="text-gray-500">Strike Rate</p>
                <p className="font-semibold">
                  {player.bowlingStrikeRate && player.bowlingStrikeRate < 999
                    ? player.bowlingStrikeRate.toFixed(2)
                    : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Economy</p>
                <p className="font-semibold">
                  {player.economyRate && player.economyRate < 999
                    ? player.economyRate.toFixed(2)
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>
        )}

        {showPoints && (
          <div className="mt-4 border-t pt-4">
            <p className="text-gray-500 text-sm">Value</p>
            <p className="text-lg font-bold text-indigo-600">
              ₹{player.playerValue?.toLocaleString() || "N/A"}
            </p>
          </div>
        )}

        {(showAddButton || showRemoveButton) && (
          <div className="mt-4 pt-2 border-t">
            {showAddButton && (
              <button
                onClick={handleAddToTeam}
                disabled={isLoading || isInTeam}
                className={`w-full py-2 px-4 rounded text-sm font-medium ${
                  isInTeam
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                }`}
              >
                {isLoading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : isInTeam ? (
                  "Already in Team"
                ) : (
                  "Add to Team"
                )}
              </button>
            )}
            {showRemoveButton && (
              <button
                onClick={handleRemoveFromTeam}
                disabled={isLoading}
                className="w-full py-2 px-4 rounded text-sm font-medium bg-red-600 text-white hover:bg-red-700"
              >
                {isLoading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  "Remove from Team"
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 