import { NextRequest, NextResponse } from "next/server";
import { searchVolunteers, createVolunteer, createExperience } from "@/db";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || searchParams.get("q") || undefined;
    const location = searchParams.get("location") || undefined;
    const skill = searchParams.get("skill") || undefined;
    const minExperienceStr = searchParams.get("minExperience") || searchParams.get("experience");
    const verifiedStr = searchParams.get("verified");
    const availability = searchParams.get("availability") || undefined;
    const isAdmin = searchParams.get("admin") === "true";

    const minExperience = minExperienceStr
      ? parseInt(minExperienceStr, 10)
      : undefined;
    const verified =
      verifiedStr === "true" ? true : verifiedStr === "false" ? false : undefined;

    const volunteers = await searchVolunteers({
      search,
      location,
      skill,
      minExperience,
      verified,
      availability,
    });

    // If admin is requesting, return full details (including phone, email)
    const result = isAdmin ? volunteers : volunteers.map(({ phone, ...rest }) => rest);

    return NextResponse.json(result, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      },
    });
  } catch (error) {
    console.error("Error fetching volunteers:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    if (!data.name || !data.name.trim()) {
      return NextResponse.json(
        { error: "Full Name is required" },
        { status: 400 }
      );
    }

    // Default to verified=false so newly registered volunteers are unverified by default until admin manually approves
    const isVerified = data.verified !== undefined ? Boolean(data.verified) : false;

    const volunteer = await createVolunteer({
      name: data.name.trim(),
      phone: data.phone || "",
      email: data.email || "",
      age: data.age ? Number(data.age) : undefined,
      location: data.location || "",
      bio: data.bio || "",
      yearsExperience: Number(data.yearsExperience) || 0,
      eventsCompleted: Number(data.eventsCompleted) || 0,
      skills: Array.isArray(data.skills) ? data.skills : [],
      availability: data.availability === "unavailable" ? "unavailable" : "available",
      verified: isVerified,
      profileImage: data.profileImage || null,
    });

    // If experiences are provided in the payload, create them for this volunteer
    let createdExperiences: any[] = [];
    if (Array.isArray(data.experiences) && data.experiences.length > 0) {
      for (const exp of data.experiences) {
        if (exp.eventName && exp.eventName.trim()) {
          const newExp = await createExperience({
            volunteerId: volunteer.id,
            eventName: exp.eventName.trim(),
            eventType: exp.eventType || "Event",
            role: exp.role || "Volunteer",
            year: Number(exp.year) || new Date().getFullYear(),
            description: exp.description || "",
            images: Array.isArray(exp.images)
              ? exp.images
              : exp.imageUrl
              ? [exp.imageUrl]
              : [],
          });
          createdExperiences.push(newExp);
        }
      }
    }

    // Link with volunteer_auth_tokens if email matches a registered session
    if (data.email && process.env.DATABASE_URL) {
      try {
        const { neon } = await import('@neondatabase/serverless');
        const sql = neon(process.env.DATABASE_URL);
        await sql`
          UPDATE volunteer_auth_tokens
          SET linked_volunteer_id = ${volunteer.id.toString()}, updated_at = NOW()
          WHERE email = ${data.email.toLowerCase().trim()}
        `;
      } catch {
        // Non-critical — profile still created successfully
      }
    }

    return NextResponse.json(
      { ...volunteer, experiences: createdExperiences },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
