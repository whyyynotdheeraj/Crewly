import { NextRequest, NextResponse } from "next/server";
import { searchVolunteers, createVolunteer, createExperience } from "@/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || searchParams.get("q") || undefined;
    const location = searchParams.get("location") || undefined;
    const skill = searchParams.get("skill") || undefined;
    const minExperienceStr = searchParams.get("minExperience") || searchParams.get("experience");
    const verifiedStr = searchParams.get("verified");
    const availability = searchParams.get("availability") || undefined;

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

    // Remove phone numbers from public response
    const publicVolunteers = volunteers.map(({ phone, ...rest }) => rest);

    return NextResponse.json(publicVolunteers);
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

    // Default to verified=true if not explicitly false (allowing registered volunteers to show their verified badge)
    const isVerified = data.verified !== undefined ? Boolean(data.verified) : true;

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

    return NextResponse.json(
      { ...volunteer, experiences: createdExperiences },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating volunteer:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
