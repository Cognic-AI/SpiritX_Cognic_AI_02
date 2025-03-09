import { NextResponse } from 'next/server';
import { executeQuery, executeStoredProcedure, notifyClients } from '@/lib/db';

// GET /api/admin/players/[id] - Get a specific player
export async function GET(request, { params }) {
  try {
    const playerId = params.id;
    
    const rows = await executeQuery('SELECT * FROM admin_player_stats WHERE player_id = ?', [playerId]);
    
    if (rows.length === 0) {
      return NextResponse.json({ error: 'Player not found' }, { status: 404 });
    }
    
    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

// PUT /api/admin/players/[id] - Update a player
export async function PUT(request, { params }) {
  try {
    const playerId = params.id;
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
    
    // Call the stored procedure to update a player with sanitized data
    await executeStoredProcedure('admin_update_player', [
      playerId,
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
    
    // Get the updated player
    const playerRows = await executeQuery('SELECT * FROM admin_player_stats WHERE player_id = ?', [playerId]);
    
    // Send WebSocket message for real-time updates
    notifyClients('player_update');
    
    return NextResponse.json(playerRows[0]);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Database error: ' + error.message }, { status: 500 });
  }
}

// DELETE /api/admin/players/[id] - Delete a player
export async function DELETE(request, { params }) {
  try {
    const playerId = params.id;
    
    // Call the stored procedure to delete a player
    await executeStoredProcedure('admin_delete_player', [playerId]);
    
    // Send WebSocket message for real-time updates
    notifyClients('player_update');
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
} 