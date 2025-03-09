import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

// GET /api/players/[id] - Get a specific player's details for users (without points)
export async function GET(request, { params }) {
  try {
    const playerId = params.id;

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
        bowling_strike_rate,
        batting_average,
        economy_rate,
        last_updated
      FROM 
        players
      WHERE
        player_id = ?
    `, [playerId]);

    if (players.length === 0) {
      return NextResponse.json({ error: 'Player not found' }, { status: 404 });
    }

    return NextResponse.json(players[0]);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
} 