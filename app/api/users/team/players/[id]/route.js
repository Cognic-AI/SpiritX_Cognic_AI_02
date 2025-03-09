// src/app/api/users/team/players/[id]/route.js
import { NextResponse } from "next/server";
import { executeQuery } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Remove player from team
export async function DELETE(request, { params }) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  try {
    const playerId = parseInt(params.id);
    
    const result = await executeQuery({
      query: `CALL user_remove_player_from_team(?, ?, @result);
              SELECT @result AS result;`,
      values: [session.user.id, playerId],
    });
    
    const resultMessage = result[1][0].result;
    
    if (resultMessage.startsWith("Error")) {
      return NextResponse.json({ error: resultMessage }, { status: 400 });
    }
    
    // Update session budget after player is removed
    const updatedUser = await executeQuery({
      query: "SELECT budget FROM users WHERE username = ?",
      values: [session.user.id],
    });
    
    return NextResponse.json({ 
      message: "Player removed from team successfully", 
      result: resultMessage,
      budget: updatedUser[0].budget
    });
  } catch (error) {
    console.error("Error removing player from team:", error);
    return NextResponse.json({ error: "Error removing player from team" }, { status: 500 });
  }
}