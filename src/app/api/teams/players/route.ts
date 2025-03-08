import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

// Add a player to the user's team
export async function POST(request: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const username = session.user?.id;
    if (!username) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get player ID from request
    const { playerId } = await request.json();
    if (!playerId) {
      return NextResponse.json(
        { error: "Player ID is required" },
        { status: 400 }
      );
    }

    // Get user's team
    const team = await prisma.team.findFirst({
      where: { username: username as string },
      include: {
        teamPlayers: true,
      },
    });

    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    // Check if team already has 11 players
    if (team.playerCount >= 11) {
      return NextResponse.json(
        { error: "Team already has maximum number of players (11)" },
        { status: 400 }
      );
    }

    // Check if player already exists in team
    const playerExists = team.teamPlayers.some(
      (tp) => tp.playerId === playerId
    );
    if (playerExists) {
      return NextResponse.json(
        { error: "Player already in team" },
        { status: 400 }
      );
    }

    // Get player
    const player = await prisma.player.findUnique({
      where: { id: playerId },
    });

    if (!player) {
      return NextResponse.json({ error: "Player not found" }, { status: 404 });
    }

    // Check if user has enough budget
    const user = await prisma.user.findUnique({
      where: { username: username as string },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.budget < player.playerValue!) {
      return NextResponse.json(
        { error: "Insufficient budget" },
        { status: 400 }
      );
    }

    // Add player to team and update budget
    const teamPlayer = await prisma.teamPlayer.create({
      data: {
        teamId: team.id,
        playerId: player.id,
      },
    });

    // Update team statistics
    await prisma.team.update({
      where: { id: team.id },
      data: {
        playerCount: team.playerCount + 1,
        totalPoints: team.totalPoints + (player.playerPoints || 0),
        totalValue: team.totalValue + (player.playerValue || 0),
      },
    });

    // Update user budget
    await prisma.user.update({
      where: { username: username as string },
      data: {
        budget: user.budget - (player.playerValue || 0),
      },
    });

    return NextResponse.json({
      message: "Player added to team successfully",
      teamPlayer,
    });
  } catch (error) {
    console.error("Error adding player to team:", error);
    return NextResponse.json(
      { error: "Failed to add player to team" },
      { status: 500 }
    );
  }
}

// DELETE a player from the user's team
export async function DELETE(request: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const username = session.user?.id;
    if (!username) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get playerId from URL
    const url = new URL(request.url);
    const playerId = parseInt(url.searchParams.get("playerId") || "0");
    if (!playerId) {
      return NextResponse.json(
        { error: "Player ID is required" },
        { status: 400 }
      );
    }

    // Get user's team
    const team = await prisma.team.findFirst({
      where: { username: username as string },
      include: {
        teamPlayers: {
          where: { playerId },
          include: { player: true },
        },
      },
    });

    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    // Check if player exists in team
    if (team.teamPlayers.length === 0) {
      return NextResponse.json(
        { error: "Player not in team" },
        { status: 404 }
      );
    }

    const teamPlayer = team.teamPlayers[0];
    const player = teamPlayer.player;

    // Remove player from team
    await prisma.teamPlayer.delete({
      where: {
        teamId_playerId: {
          teamId: team.id,
          playerId: player.id,
        },
      },
    });

    // Update team statistics
    await prisma.team.update({
      where: { id: team.id },
      data: {
        playerCount: team.playerCount - 1,
        totalPoints: team.totalPoints - (player.playerPoints || 0),
        totalValue: team.totalValue - (player.playerValue || 0),
      },
    });

    // Update user budget
    await prisma.user.update({
      where: { username: username as string },
      data: {
        budget: { increment: player.playerValue || 0 },
      },
    });

    return NextResponse.json({
      message: "Player removed from team successfully",
    });
  } catch (error) {
    console.error("Error removing player from team:", error);
    return NextResponse.json(
      { error: "Failed to remove player from team" },
      { status: 500 }
    );
  }
} 