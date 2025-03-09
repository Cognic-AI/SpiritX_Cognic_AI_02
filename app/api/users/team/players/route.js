// src/app/api/users/team/players/route.js
import { NextResponse } from "next/server";
import { executeStoredProcedure } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Add player to team
export async function GET(request, { params }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { playerId } = params.id;

  if (!playerId) {
    return NextResponse.json({ error: "Player ID is required" }, { status: 400 });
  }

  console.log(playerId);

  try {
    const results = await executeStoredProcedure('user_add_player_to_team', [session.user.email, playerId]);

    console.log(results);
    // return NextResponse.json({ teamInfo, players: teamPlayers });
    if (resultMessage.startsWith("Error")) {
      return NextResponse.json({ error: resultMessage }, { status: 400 });
    }

    // Update session budget after player is added
    const updatedUser = await executeQuery({
      query: "SELECT budget FROM users WHERE username = ?",
      values: [session.user.email],
    });

    console.log(updatedUser);

    session.user.budget = updatedUser[0][0].budget;

    return NextResponse.json({
      message: "Player added to team successfully",
      result: resultMessage,
      budget: updatedUser[0].budget
    });
  } catch (error) {
    console.error("Error fetching team:", error);
    return NextResponse.json({ error: "Error fetching team" }, { status: 500 });
  }
}
