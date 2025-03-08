import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

// GET tournament summary
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

    // Calculate overall runs
    const overallRunsData = await prisma.player.aggregate({
      _sum: {
        totalRuns: true,
      },
    });
    const overallRuns = overallRunsData._sum.totalRuns || 0;

    // Calculate overall wickets
    const overallWicketsData = await prisma.player.aggregate({
      _sum: {
        wickets: true,
      },
    });
    const overallWickets = overallWicketsData._sum.wickets || 0;

    // Find highest run scorer
    const highestRunScorer = await prisma.player.findFirst({
      orderBy: {
        totalRuns: "desc",
      },
      select: {
        id: true,
        name: true,
        university: true,
        totalRuns: true,
      },
    });

    // Find highest wicket taker
    const highestWicketTaker = await prisma.player.findFirst({
      orderBy: {
        wickets: "desc",
      },
      select: {
        id: true,
        name: true,
        university: true,
        wickets: true,
      },
    });

    return NextResponse.json({
      overallRuns,
      overallWickets,
      highestRunScorer,
      highestWicketTaker,
    });
  } catch (error) {
    console.error("Error fetching tournament summary:", error);
    return NextResponse.json(
      { error: "Failed to fetch tournament summary" },
      { status: 500 }
    );
  }
} 