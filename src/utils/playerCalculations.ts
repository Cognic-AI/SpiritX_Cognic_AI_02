// Player calculations based on the given formulas

export function calculateBattingStrikeRate(totalRuns: number, ballsFaced: number): number {
  if (ballsFaced <= 0) return 0;
  return (totalRuns / ballsFaced) * 100;
}

export function calculateBattingAverage(totalRuns: number, inningsPlayed: number): number {
  if (inningsPlayed <= 0) return 0;
  return totalRuns / inningsPlayed;
}

export function calculateBowlingBalls(oversBowled: number): number {
  return oversBowled * 6;
}

export function calculateBowlingStrikeRate(totalBalls: number, wickets: number): number {
  if (wickets <= 0) return 999; // Using 999 for no wickets
  return totalBalls / wickets;
}

export function calculateEconomyRate(runsConceded: number, oversBowled: number): number {
  if (oversBowled <= 0) return 999; // Using 999 for no overs bowled
  return runsConceded / oversBowled;
}

export function calculatePlayerPoints(
  totalRuns: number,
  ballsFaced: number,
  inningsPlayed: number,
  wickets: number,
  oversBowled: number,
  runsConceded: number
): number {
  // Batting component: (Batting Strike Rate / 5 + Batting Average × 0.8)
  const battingStrikeRate = calculateBattingStrikeRate(totalRuns, ballsFaced);
  const battingAverage = calculateBattingAverage(totalRuns, inningsPlayed);
  const battingComponent = battingStrikeRate / 5 + battingAverage * 0.8;

  // Bowling component: (500 / Bowling Strike Rate + 140 / Economy Rate)
  const bowlingBalls = calculateBowlingBalls(oversBowled);
  let bowlingStrikeRateComponent = 0;
  if (wickets > 0) {
    const bowlingStrikeRate = calculateBowlingStrikeRate(bowlingBalls, wickets);
    bowlingStrikeRateComponent = 500 / bowlingStrikeRate;
  }

  let economyRateComponent = 0;
  if (oversBowled > 0) {
    const economyRate = calculateEconomyRate(runsConceded, oversBowled);
    economyRateComponent = 140 / economyRate;
  }

  const bowlingComponent = bowlingStrikeRateComponent + economyRateComponent;

  // Total player points
  return battingComponent + bowlingComponent;
}

export function calculatePlayerValue(playerPoints: number): number {
  // Player Value (Round it to the nearest multiple of 50,000)
  // Value in Rupees = (9 × Points + 100) × 1000
  const exactValue = (9 * playerPoints + 100) * 1000;
  return Math.round(exactValue / 50000) * 50000;
} 