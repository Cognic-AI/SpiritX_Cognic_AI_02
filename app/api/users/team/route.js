// src/app/api/users/team/route.js
import { NextResponse } from "next/server";
import { executeStoredProcedure } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// GET user's team
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  console.log(session.user.email);

  try {
    const results = await executeStoredProcedure('get_user_team_details', [session.user.email]);

    // console.log(results);

    // MySQL stored procedure returns multiple result sets
    // First result set: team info, Second result set: team players
    const teamInfo = results[0][0] || { team_id: null, team_name: null, player_count: 0, is_complete: false, total_points: null, total_value: 0, budget: session.user.budget };
    const teamPlayers = results[1] || [];

    return NextResponse.json({ teamInfo, players: teamPlayers });
  } catch (error) {
    console.error("Error fetching team:", error);
    return NextResponse.json({ error: "Error fetching team" }, { status: 500 });
  }
}