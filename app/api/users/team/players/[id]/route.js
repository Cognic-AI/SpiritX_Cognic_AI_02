// src/app/api/users/team/players/[id]/route.js
import { NextResponse } from "next/server";
import { executeQuery, executeStoredProcedure } from "@/lib/db";
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

// Add player to team
export async function GET(request, { params }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!params.id) {
    return NextResponse.json({ error: "Player ID is required" }, { status: 400 });
  }
  try {
    // Call the stored procedure
    await executeQuery("CALL user_add_player_to_team(?, ?, @result);", [
      session.user.email,
      params.id,
    ]);

    // Retrieve the output parameter from the stored procedure
    const [resultRows] = await executeQuery("SELECT @result AS result;");
    const resultMessage = resultRows[0]?.result;

    // Retrieve the output parameter
    const [countRows] = await executeQuery(
      "SELECT COUNT(player_id) as is_added FROM team_players WHERE player_id = ? AND team_id IN (SELECT team_id FROM teams WHERE username = ?)",
      [params.id, session.user.email]
    );
    const isAdded = countRows[0]?.is_added;

    if (parseInt(isAdded) === 0) {
      return NextResponse.json({ error: "Player not added to the team" }, { status: 400 });
    }

    // await executeQuery("COMMIT");


    // Fetch updated budget
    const updatedUser = await executeQuery("SELECT budget FROM users WHERE username = ?", [session.user.email]);

    if (!updatedUser.length) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    session.user.budget = updatedUser[0].budget;

    return NextResponse.json({
      message: "Player added to team successfully",
      result: resultMessage,
      budget: updatedUser[0].budget,
    });

  } catch (error) {
    console.error("Error adding player to team:", error);
    return NextResponse.json({ error: "Error adding player to team" }, { status: 500 });
  }
}
