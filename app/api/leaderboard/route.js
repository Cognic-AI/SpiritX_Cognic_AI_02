// src/app/api/leaderboard/route.js
import { NextResponse } from "next/server";
import { executeQuery } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// GET leaderboard
// export async function GET() {
//   const session = await getServerSession(authOptions);

//   if (!session) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   try {
//     const leaderboard = await executeQuery({
//       query: "SELECT * FROM leaderboard LIMIT 10",
//     });
//     console.log(leaderboard);
//     return NextResponse.json({ leaderboard: leaderboard[0] });
//   } catch (error) {
//     console.error("Error fetching leaderboard:", error);
//     return NextResponse.json({ error: "Error fetching leaderboard" }, { status: 500 });
//   }
// }

export async function GET() {
  try {
    const rows = await executeQuery('SELECT * FROM leaderboard LIMIT 10');
    console.log(rows);
    return NextResponse.json({ leaderboard: rows });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}