import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { PrismaClient } from "@prisma/client";

// Create a direct connection to the database to avoid model issues
const directPrisma = new PrismaClient();

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

    // Check if user already exists - using direct SQL for now
    const existingUser = await directPrisma.$queryRaw`
      SELECT * FROM users WHERE username = ${username}
    `;

    if (Array.isArray(existingUser) && existingUser.length > 0) {
      return NextResponse.json(
        { error: "Username already exists" },
        { status: 409 }
      );
    }

    // First, ensure the user role exists
    const userRoles = await directPrisma.$queryRaw`
      SELECT * FROM user_roles WHERE role_id = 2
    `;

    if (!Array.isArray(userRoles) || userRoles.length === 0) {
      // Create user role if it doesn't exist
      await directPrisma.$executeRaw`
        INSERT INTO user_roles (role_id, role_name) 
        VALUES (2, 'user')
      `;
    }

    // Insert user directly using SQL
    await directPrisma.$executeRaw`
      INSERT INTO users (username, password, display_name, budget, role_id) 
      VALUES (${username}, ${password}, ${displayName || username}, 9000000.00, 2)
    `;

    // Create team
    await directPrisma.$executeRaw`
      INSERT INTO teams (username, team_name) 
      VALUES (${username}, ${`${displayName || username}'s Team`})
    `;

    return NextResponse.json(
      { message: "User registered successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Failed to register user", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  } finally {
    // Close the direct connection
    await directPrisma.$disconnect();
  }
} 