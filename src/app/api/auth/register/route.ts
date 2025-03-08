import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { username, password, displayName } = await request.json();

    // Basic validation
    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Username already exists" },
        { status: 409 }
      );
    }

    // Create user (in production, hash the password)
    // For demo, we're storing plain password
    const user = await prisma.user.create({
      data: {
        username,
        password, // In production: await hash(password, 10)
        displayName: displayName || username,
        budget: 9000000.00, // Initial budget
      },
    });

    // Create an empty team for the user
    await prisma.team.create({
      data: {
        username: user.username,
        teamName: `${displayName || username}'s Team`,
      },
    });

    return NextResponse.json(
      { message: "User registered successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Failed to register user" },
      { status: 500 }
    );
  }
} 