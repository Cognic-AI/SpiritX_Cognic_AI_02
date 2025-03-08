// Player type
export interface Player {
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
  bowlingBalls?: number;
  bowlingStrikeRate?: number;
  economyRate?: number;
  playerPoints?: number;
  playerValue?: number;
}

// Team player relationship
export interface TeamPlayer {
  teamId: number;
  playerId: number;
  addedAt: string;
  player: Player;
}

// Team type
export interface Team {
  id: number;
  username: string;
  teamName?: string;
  playerCount: number;
  totalPoints: number;
  totalValue: number;
  isComplete?: boolean;
  createdAt: string;
  updatedAt: string;
  teamPlayers: TeamPlayer[];
}

// User type
export interface User {
  username: string;
  displayName?: string;
  budget: number;
  createdAt: string;
}

// Tournament summary type
export interface TournamentSummary {
  overallRuns: number;
  overallWickets: number;
  highestRunScorer: {
    id: number;
    name: string;
    university: string;
    totalRuns: number;
  };
  highestWicketTaker: {
    id: number;
    name: string;
    university: string;
    wickets: number;
  };
}

// Leaderboard entry type
export interface LeaderboardEntry {
  id: number;
  username: string;
  teamName?: string;
  totalPoints: number;
  user: {
    username: string;
    displayName?: string;
  };
} 