import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

// GET /api/players - Get all players for user view (no points)
export async function GET() {
  try {
    // Execute query to get player data without showing points
    const players = await executeQuery(`
      SELECT 
        player_id,
        name,
        university,
        category,
        total_runs,
        balls_faced,
        innings_played,
        wickets,
        overs_bowled,
        runs_conceded,
        player_value,
        batting_strike_rate,
        batting_average,
        bowling_economy,
        bowling_average,
        last_updated
      FROM 
        players
      ORDER BY 
        player_id ASC
    `);
    
    return NextResponse.json(players);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
} 