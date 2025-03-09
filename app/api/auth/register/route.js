import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import bcrypt from 'bcrypt';

export async function POST(request) {
  try {
    const { username, password, displayName } = await request.json();

    // Basic validation
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUsers = await executeQuery(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );

    if (existingUsers.length > 0) {
      return NextResponse.json(
        { error: 'Username already exists' },
        { status: 409 }
      );
    }

    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Get the user role ID (2 for regular users)
    const roleId = 2; // Regular user role ID

    // Insert the new user
    await executeQuery(
      'INSERT INTO users (username, password, display_name, role_id, budget) VALUES (?, ?, ?, ?, ?)',
      [username, hashedPassword, displayName || username, roleId, 9000000]
    );
    await executeQuery(
      'INSERT INTO teams (username, team_name, player_count, total_points,total_value) VALUES ( ?, ?,? ,?,?)',
      [username, `${username}_team`, 0, 0, 0]
    );

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Failed to register user' },
      { status: 500 }
    );
  }
}