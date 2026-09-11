import { NextRequest, NextResponse } from "next/server";
import { updateVolunteer, getVolunteerById } from "@/db";
import { isAuthenticated } from "@/lib/auth";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { verified } = await request.json();

    const volunteer = await getVolunteerById(parseInt(id, 10));
    if (!volunteer) {
      return NextResponse.json(
        { error: "Volunteer not found" },
        { status: 404 }
      );
    }

    const updated = await updateVolunteer(parseInt(id, 10), {
      verified: Boolean(verified),
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating verification:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
