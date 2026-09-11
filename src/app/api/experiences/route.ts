import { NextRequest, NextResponse } from "next/server";
import { createExperience } from "@/db";
import { isAuthenticated } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    if (!data.volunteerId || !data.eventName) {
      return NextResponse.json(
        { error: "volunteerId and eventName are required" },
        { status: 400 }
      );
    }

    const experience = await createExperience({
      volunteerId: data.volunteerId,
      eventName: data.eventName,
      eventType: data.eventType || "",
      role: data.role || "",
      year: data.year || new Date().getFullYear(),
      description: data.description || "",
      images: data.images || [],
    });

    return NextResponse.json(experience, { status: 201 });
  } catch (error) {
    console.error("Error creating experience:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
