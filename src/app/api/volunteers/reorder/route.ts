import { NextRequest, NextResponse } from "next/server";
import { isNeonConfigured } from "@/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { volunteerIds } = body;

    if (!Array.isArray(volunteerIds) || volunteerIds.length === 0) {
      return NextResponse.json(
        { error: "volunteerIds array is required" },
        { status: 400 }
      );
    }

    if (isNeonConfigured() && process.env.DATABASE_URL) {
      const { neon } = await import('@neondatabase/serverless');
      const sql = neon(process.env.DATABASE_URL);

      // Update display_order for each volunteer based on index + 1
      for (let i = 0; i < volunteerIds.length; i++) {
        const volId = Number(volunteerIds[i]);
        if (volId) {
          await sql`UPDATE volunteers SET display_order = ${i + 1} WHERE id = ${volId};`;
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "Volunteers reordered successfully",
    });
  } catch (error) {
    console.error("Error reordering volunteers:", error);
    return NextResponse.json(
      { error: "Failed to reorder volunteers" },
      { status: 500 }
    );
  }
}
