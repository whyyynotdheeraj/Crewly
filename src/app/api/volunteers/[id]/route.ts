import { NextRequest, NextResponse } from "next/server";
import {
  getVolunteerById,
  updateVolunteer,
  deleteVolunteer,
  getExperiencesByVolunteerId,
} from "@/db";
import { isAuthenticated } from "@/lib/auth";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const volunteerId = parseInt(id, 10);
    const volunteer = await getVolunteerById(volunteerId);

    if (!volunteer) {
      return NextResponse.json(
        { error: "Volunteer not found" },
        { status: 404 }
      );
    }

    const experiences = await getExperiencesByVolunteerId(volunteer.id);
    const authenticated = await isAuthenticated();

    // Check if volunteer is viewing their own profile via session token
    let isOwner = false;
    const volToken = request.cookies.get('vol_token')?.value;
    if (volToken && process.env.DATABASE_URL) {
      try {
        const { neon } = await import('@neondatabase/serverless');
        const sql = neon(process.env.DATABASE_URL);
        const authRows = await sql`
          SELECT email, linked_volunteer_id FROM volunteer_auth_tokens
          WHERE token = ${volToken} AND expires_at > NOW()
          LIMIT 1
        `;
        if (authRows && authRows.length > 0) {
          const authRow = authRows[0];
          if (
            Number(authRow.linked_volunteer_id) === volunteerId ||
            (authRow.email && volunteer.email && authRow.email.toLowerCase() === volunteer.email.toLowerCase())
          ) {
            isOwner = true;
          }
        }
      } catch {
        // Safe to ignore
      }
    }

    // Include phone and email for admin or profile owner
    if (!authenticated && !isOwner) {
      const { phone, ...publicData } = volunteer;
      return NextResponse.json(
        { ...publicData, experiences },
        {
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate',
          },
        }
      );
    }

    return NextResponse.json(
      { ...volunteer, experiences },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      }
    );
  } catch (error) {
    console.error("Error fetching volunteer:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const volunteerId = parseInt(id, 10);
    const volunteer = await getVolunteerById(volunteerId);

    if (!volunteer) {
      return NextResponse.json(
        { error: "Volunteer not found" },
        { status: 404 }
      );
    }

    // Authorized if Admin OR if volunteer owns this profile
    const isAdmin = await isAuthenticated();
    let isOwner = false;
    const volToken = request.cookies.get('vol_token')?.value;

    if (volToken && process.env.DATABASE_URL) {
      try {
        const { neon } = await import('@neondatabase/serverless');
        const sql = neon(process.env.DATABASE_URL);
        const authRows = await sql`
          SELECT email, linked_volunteer_id FROM volunteer_auth_tokens
          WHERE token = ${volToken} AND expires_at > NOW()
          LIMIT 1
        `;
        if (authRows && authRows.length > 0) {
          const authRow = authRows[0];
          if (
            Number(authRow.linked_volunteer_id) === volunteerId ||
            (authRow.email && volunteer.email && authRow.email.toLowerCase() === volunteer.email.toLowerCase())
          ) {
            isOwner = true;
            // Ensure token is linked
            if (!authRow.linked_volunteer_id) {
              await sql`UPDATE volunteer_auth_tokens SET linked_volunteer_id = ${volunteerId} WHERE token = ${volToken}`;
            }
          }
        }
      } catch (err) {
        console.error('Owner verification error:', err);
      }
    }

    if (!isAdmin && !isOwner) {
      return NextResponse.json({ error: "Unauthorized. Please sign in to edit your profile." }, { status: 401 });
    }

    const data = await request.json();
    const { experiences, ...profileData } = data;

    // Clean numeric values
    if (profileData.yearsExperience !== undefined) {
      profileData.yearsExperience = Number(profileData.yearsExperience) || 0;
    }
    if (profileData.eventsCompleted !== undefined) {
      profileData.eventsCompleted = Number(profileData.eventsCompleted) || 0;
    }
    if (profileData.age !== undefined && profileData.age !== null) {
      profileData.age = Number(profileData.age) || undefined;
    }

    const updated = await updateVolunteer(volunteerId, profileData);

    if (!updated) {
      return NextResponse.json(
        { error: "Volunteer update failed" },
        { status: 404 }
      );
    }

    // Sync experiences if provided in payload
    if (Array.isArray(experiences) && process.env.DATABASE_URL) {
      try {
        const { neon } = await import('@neondatabase/serverless');
        const sql = neon(process.env.DATABASE_URL);
        await sql`DELETE FROM experiences WHERE volunteer_id = ${volunteerId}`;

        for (const exp of experiences) {
          if (exp.eventName && exp.eventName.trim()) {
            const expPhotos = Array.isArray(exp.images)
              ? exp.images
              : exp.imageUrl
              ? [exp.imageUrl]
              : [];
            await sql`
              INSERT INTO experiences (volunteer_id, event_name, role, year, description, event_type, photos)
              VALUES (
                ${volunteerId},
                ${exp.eventName.trim()},
                ${exp.role || 'Event Volunteer'},
                ${String(exp.year || new Date().getFullYear())},
                ${exp.description || ''},
                ${exp.eventType || 'Event'},
                ${JSON.stringify(expPhotos)}
              )
            `;
          }
        }
      } catch (expErr) {
        console.error('Error syncing experiences in database:', expErr);
      }
    }

    const latestExperiences = await getExperiencesByVolunteerId(volunteerId);

    return NextResponse.json({ ...updated, experiences: latestExperiences }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });
  } catch (error) {
    console.error("Error updating volunteer:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const deleted = await deleteVolunteer(parseInt(id, 10));

    if (!deleted) {
      return NextResponse.json(
        { error: "Volunteer not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting volunteer:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
