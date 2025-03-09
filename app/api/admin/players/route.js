import { NextResponse } from 'next/server';
import { executeQuery, executeStoredProcedure, notifyClients } from '@/lib/db';

// GET /api/admin/players - Get all players
export async function GET() {
  try {
    const rows = await executeQuery('SELECT * FROM admin_player_stats ORDER BY player_id ASC');
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

// POST /api/admin/players - Add a new player
export async function POST(request) {
  try {
    const data = await request.json();
    
    // Validate required fields
    const requiredFields = [
      'name', 'university', 'category', 'total_runs', 
      'balls_faced', 'innings_played', 'wickets', 
      'overs_bowled', 'runs_conceded'
    ];
    
    for (const field of requiredFields) {
      if (data[field] === undefined) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
      }
    }
    
    // Ensure all numeric fields are actually numbers
    const numericFields = ['total_runs', 'balls_faced', 'innings_played', 'wickets', 'overs_bowled', 'runs_conceded'];
    for (const field of numericFields) {
      if (typeof data[field] !== 'number') {
        // Convert to number or set to 0 if invalid
        data[field] = Number(data[field]) || 0;
      }
    }
    
    // Ensure string fields are actually strings
    const stringFields = ['name', 'university', 'category'];
    for (const field of stringFields) {
      if (typeof data[field] !== 'string') {
        // Convert to string or set to empty string if invalid
        data[field] = String(data[field] || '');
      }
    }
    
    // Call the stored procedure to create a player with sanitized data
    const result = await executeStoredProcedure('admin_create_player', [
      data.name,
      data.university,
      data.category,
      data.total_runs,
      data.balls_faced,
      data.innings_played,
      data.wickets,
      data.overs_bowled,
      data.runs_conceded
    ]);
    
    // Check if the result is valid
    if (!result || !result[0] || !result[0][0]) {
      return NextResponse.json({ error: 'Failed to create player' }, { status: 500 });
    }
    
    // Get the newly created player ID from the first row of the first result set
    const playerId = result[0][0].player_id;
    
    // Get the newly created player
    const playerRows = await executeQuery('SELECT * FROM admin_player_stats WHERE player_id = ?', [playerId]);
    
    // Send WebSocket message for real-time updates
    notifyClients('player_update');
    
    return NextResponse.json(playerRows[0], { status: 201 });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Database error: ' + error.message }, { status: 500 });
  }
} 