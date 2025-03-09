// src/app/api/users/team/players/route.js
import { NextResponse } from "next/server";
import { executeQuery } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Add player to team
export async function POST(request) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  try {
    const { player_id } = await request.json();
    
    if (!player_id) {
      return NextResponse.json({ error: "Player ID is required" }, { status: 400 });
    }
    
    const result = await executeQuery({
      query: `CALL user_add_player_to_team(?, ?, @result);
              SELECT @result AS result;`,
      values: [session.user.id, player_id],
    });
    
    const resultMessage = result[1][0].result;
    
    if (resultMessage.startsWith("Error")) {
      return NextResponse.json({ error: resultMessage }, { status: 400 });
    }
    
    // Update session budget after player is added
    const updatedUser = await executeQuery({
      query: "SELECT budget FROM users WHERE username = ?",
      values: [session.user.id],
    });
    
    return NextResponse.json({ 
      message: "Player added to team successfully", 
      result: resultMessage,
      budget: updatedUser[0].budget
    });
  } catch (error) {
    console.error("Error adding player to team:", error);
    return NextResponse.json({ error: "Error adding player to team" }, { status: 500 });
  }
}