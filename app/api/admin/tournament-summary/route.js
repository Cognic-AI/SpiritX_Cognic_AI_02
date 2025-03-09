import { NextResponse } from 'next/server';
import { executeQuery, executeStoredProcedure } from '@/lib/db';

// GET /api/admin/tournament-summary - Get tournament summary
export async function GET() {
  try {
    // Call the stored procedure to get tournament summary
    const result = await executeStoredProcedure('get_tournament_summary', []);
    
    // Check if we have valid results
    if (!result || !result[0] || !result[0][0]) {
      // If no results, create a basic summary with default values
      const summaryWithExtras = await generateDefaultSummary();
      return NextResponse.json(summaryWithExtras);
    }
    
    const summary = result[0][0]; // Get the first row from the first result set
    
    // Get top batsmen
    const topBatsmenResult = await executeQuery(
      'SELECT * FROM admin_player_stats ORDER BY total_runs DESC LIMIT 5'
    );
    
    // Get top bowlers
    const topBowlersResult = await executeQuery(
      'SELECT * FROM admin_player_stats ORDER BY wickets DESC LIMIT 5'
    );
    
    // Get university stats
    const universityStatsResult = await executeQuery(`
      SELECT 
        university, 
        COUNT(*) as player_count,
        SUM(total_runs) as total_runs,
        SUM(wickets) as total_wickets
      FROM 
        players
      GROUP BY 
        university
      ORDER BY 
        total_runs DESC
    `);
    
    // Get highest run scorer
    const highestRunScorerResult = await executeQuery(
      'SELECT * FROM admin_player_stats ORDER BY total_runs DESC LIMIT 1'
    );
    
    // Get highest wicket taker
    const highestWicketTakerResult = await executeQuery(
      'SELECT * FROM admin_player_stats ORDER BY wickets DESC LIMIT 1'
    );
    
    // Calculate some additional stats
    const playerCountResult = await executeQuery('SELECT COUNT(*) as count FROM players');
    const playerCount = playerCountResult[0]?.count || 1; // Prevent division by zero
    
    const summaryWithExtras = {
      ...summary,
      avg_runs_per_player: summary.total_runs / playerCount,
      avg_wickets_per_player: summary.total_wickets / playerCount,
      top_batsmen: topBatsmenResult || [],
      top_bowlers: topBowlersResult || [],
      university_stats: universityStatsResult || [],
      highest_run_scorer: highestRunScorerResult?.[0] || null,
      highest_wicket_taker: highestWicketTakerResult?.[0] || null
    };
    
    return NextResponse.json(summaryWithExtras);
  } catch (error) {
    console.error('Database error:', error);
    
    // In case of error, return a default summary
    const defaultSummary = await generateDefaultSummary();
    return NextResponse.json(defaultSummary);
  }
}

// Generate a default summary in case of errors
async function generateDefaultSummary() {
  try {
    // Get basic data directly with simple queries
    const totalRunsResult = await executeQuery('SELECT SUM(total_runs) as total_runs FROM players');
    const totalWicketsResult = await executeQuery('SELECT SUM(wickets) as total_wickets FROM players');
    const totalBallsFacedResult = await executeQuery('SELECT SUM(balls_faced) as total_balls_faced FROM players');
    const totalOversBowledResult = await executeQuery('SELECT SUM(overs_bowled) as total_overs_bowled FROM players');
    
    // Get top batsmen
    const topBatsmenResult = await executeQuery(
      'SELECT * FROM players ORDER BY total_runs DESC LIMIT 5'
    );
    
    // Get top bowlers
    const topBowlersResult = await executeQuery(
      'SELECT * FROM players ORDER BY wickets DESC LIMIT 5'
    );
    
    // Get highest run scorer
    const highestRunScorerResult = await executeQuery(
      'SELECT * FROM players ORDER BY total_runs DESC LIMIT 1'
    );
    
    // Get highest wicket taker
    const highestWicketTakerResult = await executeQuery(
      'SELECT * FROM players ORDER BY wickets DESC LIMIT 1'
    );
    
    // Get university stats
    const universityStatsResult = await executeQuery(`
      SELECT 
        university, 
        COUNT(*) as player_count,
        SUM(total_runs) as total_runs,
        SUM(wickets) as total_wickets
      FROM 
        players
      GROUP BY 
        university
      ORDER BY 
        total_runs DESC
    `);
    
    // Calculate some additional stats
    const playerCountResult = await executeQuery('SELECT COUNT(*) as count FROM players');
    const playerCount = playerCountResult[0]?.count || 1; // Prevent division by zero
    
    const totalRuns = totalRunsResult[0]?.total_runs || 0;
    const totalWickets = totalWicketsResult[0]?.total_wickets || 0;
    const totalBallsFaced = totalBallsFacedResult[0]?.total_balls_faced || 0;
    const totalOversBowled = totalOversBowledResult[0]?.total_overs_bowled || 0;
    
    return {
      total_runs: totalRuns,
      total_wickets: totalWickets,
      total_balls_faced: totalBallsFaced,
      total_overs_bowled: totalOversBowled,
      avg_strike_rate: totalBallsFaced > 0 ? (totalRuns / totalBallsFaced) * 100 : 0,
      avg_economy: totalOversBowled > 0 ? totalWickets / totalOversBowled : 0,
      avg_runs_per_player: totalRuns / playerCount,
      avg_wickets_per_player: totalWickets / playerCount,
      top_batsmen: topBatsmenResult || [],
      top_bowlers: topBowlersResult || [],
      university_stats: universityStatsResult || [],
      highest_run_scorer: highestRunScorerResult?.[0] || null,
      highest_wicket_taker: highestWicketTakerResult?.[0] || null
    };
  } catch (error) {
    console.error('Error generating default summary:', error);
    return {
      total_runs: 0,
      total_wickets: 0,
      total_balls_faced: 0,
      total_overs_bowled: 0,
      avg_strike_rate: 0,
      avg_economy: 0,
      avg_runs_per_player: 0,
      avg_wickets_per_player: 0,
      top_batsmen: [],
      top_bowlers: [],
      university_stats: [],
      highest_run_scorer: null,
      highest_wicket_taker: null
    };
  }
} 