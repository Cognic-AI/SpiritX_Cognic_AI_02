import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

// GET leaderboard
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

    // Get teams with complete squads (11 players), sorted by total points
    const leaderboard = await prisma.team.findMany({
      where: {
        playerCount: 11,
      },
      include: {
        user: {
          select: {
            displayName: true,
            username: true,
          },
        },
      },
      orderBy: {
        totalPoints: "desc",
      },
    });

    return NextResponse.json(leaderboard);
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return NextResponse.json(
      { error: "Failed to fetch leaderboard" },
      { status: 500 }
    );
  }
} 