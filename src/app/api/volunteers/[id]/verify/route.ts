import { NextRequest, NextResponse } from "next/server";
import { updateVolunteer, getVolunteerById } from "@/db";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { verified } = await request.json();
    const volunteerId = parseInt(id, 10);

    if (isNaN(volunteerId)) {
      return NextResponse.json({ error: "Invalid volunteer ID" }, { status: 400 });
    }

    if (process.env.DATABASE_URL) {
      const { neon } = await import('@neondatabase/serverless');
      const sql = neon(process.env.DATABASE_URL);
      const rows = await sql`
        UPDATE volunteers
        SET verified = ${Boolean(verified)}, updated_at = NOW()
        WHERE id = ${volunteerId}
        RETURNING *;
      `;

      if (rows.length === 0) {
        return NextResponse.json({ error: "Volunteer not found" }, { status: 404 });
      }

      return NextResponse.json({ success: true, volunteer: rows[0] });
    }

    const volunteer = await getVolunteerById(volunteerId);
    if (!volunteer) {
      return NextResponse.json({ error: "Volunteer not found" }, { status: 404 });
    }

    const updated = await updateVolunteer(volunteerId, {
      verified: Boolean(verified),
    });

    return NextResponse.json({ success: true, volunteer: updated });
  } catch (error) {
    console.error("Error updating verification:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
