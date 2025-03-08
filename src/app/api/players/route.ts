import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

// GET all players
export async function GET() {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const players = await prisma.player.findMany({
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
    
    return NextResponse.json(players);
  } catch (error) {
    console.error("Error fetching players:", error);
    return NextResponse.json(
      { error: "Failed to fetch players" },
      { status: 500 }
    );
  }
}

// POST a new player (admin only)
export async function POST(request: Request) {
  try {
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

    // Create player
    const player = await prisma.player.create({
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

    return NextResponse.json(player, { status: 201 });
  } catch (error) {
    console.error("Error creating player:", error);
    return NextResponse.json(
      { error: "Failed to create player" },
      { status: 500 }
    );
  }
} 