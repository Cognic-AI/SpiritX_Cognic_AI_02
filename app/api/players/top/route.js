import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

// GET /api/players/top - Get top players
export async function GET() {
  try {
    // Get top batsmen
    const topBatsmen = await executeQuery(
      `SELECT * FROM players WHERE category = 'Batsman' ORDER BY total_runs DESC LIMIT 2`
    );
    
    // Get top bowlers
    const topBowlers = await executeQuery(
      `SELECT * FROM players WHERE category = 'Bowler' ORDER BY wickets DESC LIMIT 2`
    );
    
    // Get top all-rounders
    const topAllRounders = await executeQuery(
      `SELECT * FROM players WHERE category = 'All-Rounder' 
       ORDER BY (total_runs + wickets * 20) DESC LIMIT 2`
    );
    
    // Combine all top players
    const topPlayers = [...topBatsmen, ...topBowlers, ...topAllRounders];
    
    return NextResponse.json(topPlayers);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
} 