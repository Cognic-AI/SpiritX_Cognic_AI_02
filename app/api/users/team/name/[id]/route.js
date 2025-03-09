import { NextResponse } from "next/server";
import { executeQuery } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function PUT(request, { params }) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!params.id) {
        return NextResponse.json({ error: "Team name is required" }, { status: 400 });
    }

    try {
        const result = await executeQuery({
            query: "UPDATE team SET team_name = ? WHERE username = ?",
            values: [params.id, session.user.email],
        });

        if (result.affectedRows === 0) {
            return NextResponse.json({ error: "No matching record found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Team name updated successfully" }, { status: 200 });

    } catch (error) {
        console.error("Error updating team name:", error);
        return NextResponse.json({ error: "Database error" }, { status: 500 });
    }
}
