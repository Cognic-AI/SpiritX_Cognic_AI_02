import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

// GET a single player
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const player = await prisma.player.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        university: true,
        category: true,
        totalRuns: true,
        ballsFaced: true,
        inningsPlayed: true,
        wickets: true,
        oversBowled: true,
        runsConceded: true,
        battingStrikeRate: true,
        battingAverage: true,
        bowlingBalls: true,
        bowlingStrikeRate: true,
        economyRate: true,
        playerPoints: true,
        playerValue: true
      }
    });

    if (!player) {
      return NextResponse.json({ error: "Player not found" }, { status: 404 });
    }

    return NextResponse.json(player);
  } catch (error) {
    console.error("Error fetching player:", error);
    return NextResponse.json(
      { error: "Failed to fetch player" },
      { status: 500 }
    );
  }
}

// PUT (update) a player (admin only)
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    // Check authentication (in a real app, add admin check)
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const {
      name,
      university,
      category,
      totalRuns,
      ballsFaced,
      inningsPlayed,
      wickets,
      oversBowled,
      runsConceded,
    } = await request.json();

    // Calculate derived fields
    const battingStrikeRate = ballsFaced > 0 ? (totalRuns / ballsFaced) * 100 : 0;
    const battingAverage = inningsPlayed > 0 ? totalRuns / inningsPlayed : 0;
    const bowlingBalls = oversBowled * 6;
    const bowlingStrikeRate = wickets > 0 ? bowlingBalls / wickets : 999;
    const economyRate = oversBowled > 0 ? runsConceded / oversBowled : 999;
    
    // Calculate player points using the formula
    const battingComponent = battingStrikeRate / 5 + battingAverage * 0.8;
    
    let bowlingComponent = 0;
    if (wickets > 0) {
      bowlingComponent += 500 / bowlingStrikeRate;
    }
    if (oversBowled > 0) {
      bowlingComponent += 140 / economyRate;
    }
    
    const playerPoints = battingComponent + bowlingComponent;
    
    // Calculate player value
    const exactValue = (9 * playerPoints + 100) * 1000;
    const playerValue = Math.round(exactValue / 50000) * 50000;

    // Update player
    const player = await prisma.player.update({
      where: { id },
      data: {
        name,
        university,
        category,
        totalRuns,
        ballsFaced,
        inningsPlayed,
        wickets,
        oversBowled,
        runsConceded,
        battingStrikeRate,
        battingAverage,
        bowlingBalls,
        bowlingStrikeRate,
        economyRate,
        playerPoints,
        playerValue,
      },
    });

    return NextResponse.json(player);
  } catch (error) {
    console.error("Error updating player:", error);
    return NextResponse.json(
      { error: "Failed to update player" },
      { status: 500 }
    );
  }
}

// DELETE a player (admin only)
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    // Check authentication (in a real app, add admin check)
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    await prisma.player.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Player deleted successfully" });
  } catch (error) {
    console.error("Error deleting player:", error);
    return NextResponse.json(
      { error: "Failed to delete player" },
      { status: 500 }
    );
  }
} 