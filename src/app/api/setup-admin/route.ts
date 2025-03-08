import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { PrismaClient } from "@prisma/client";

// Create a direct connection to the database to avoid model issues
const directPrisma = new PrismaClient();

export async function GET() {
  try {
    // First ensure the user_roles table has the admin role
    const adminRoles = await directPrisma.$queryRaw`
      SELECT * FROM user_roles WHERE role_id = 1
    `;

    if (!Array.isArray(adminRoles) || adminRoles.length === 0) {
      try {
        await directPrisma.$executeRaw`
          INSERT INTO user_roles (role_id, role_name) 
          VALUES (1, 'admin')
        `;
      } catch (roleError) {
        console.error("Error creating admin role:", roleError);
        // Continue anyway, the role might already exist
      }
    }

    // Now check if user role 2 (regular user) exists
    const userRoles = await directPrisma.$queryRaw`
      SELECT * FROM user_roles WHERE role_id = 2
    `;

    if (!Array.isArray(userRoles) || userRoles.length === 0) {
      try {
        await directPrisma.$executeRaw`
          INSERT INTO user_roles (role_id, role_name) 
          VALUES (2, 'user')
        `;
      } catch (roleError) {
        console.error("Error creating user role:", roleError);
        // Continue anyway
      }
    }

    // Check if admin user exists
    const adminUsers = await directPrisma.$queryRaw`
      SELECT * FROM users WHERE username = 'admin'
    `;

    if (Array.isArray(adminUsers) && adminUsers.length > 0) {
      // If admin exists, ensure password and role_id are correct
      await directPrisma.$executeRaw`
        UPDATE users 
        SET password = 'Admin@2025', role_id = 1
        WHERE username = 'admin'
      `;
      
      return NextResponse.json({ 
        message: "Admin user already exists and password updated",
        admin: { username: 'admin' }
      });
    } else {
      // Create admin user if not exists
      await directPrisma.$executeRaw`
        INSERT INTO users (username, password, display_name, budget, role_id)
        VALUES ('admin', 'Admin@2025', 'Administrator', 9000000.00, 1)
      `;
      
      // Create admin team
      try {
        await directPrisma.$executeRaw`
          INSERT INTO teams (username, team_name)
          VALUES ('admin', 'Admin Team')
        `;
      } catch (teamError) {
        console.error("Error creating admin team:", teamError);
        // Continue anyway, team might already exist
      }
      
      return NextResponse.json({ 
        message: "Admin user created successfully",
        admin: { username: 'admin' }
      });
    }
  } catch (error) {
    console.error("Error setting up admin:", error);
    return NextResponse.json({ 
      error: "Failed to set up admin user",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  } finally {
    // Close the direct connection
    await directPrisma.$disconnect();
  }
} 