import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const DATABASE_URL = process.env.DATABASE_URL!;

function getSql() {
  return neon(DATABASE_URL);
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { eventTitle, eventId, roleApplied } = data;

    if (!eventTitle) {
      return NextResponse.json({ error: 'Event Title is required' }, { status: 400 });
    }

    const sql = getSql();

    // Check volunteer session
    const token = request.cookies.get('vol_token')?.value;
    let volunteerEmail = data.volunteerEmail || null;
    let volunteerName = data.volunteerName || null;
    let volunteerPhone = data.volunteerPhone || null;
    let volunteerId = data.volunteerId ? Number(data.volunteerId) : null;

    if (token) {
      const authRows = await sql`
        SELECT email, name, linked_volunteer_id FROM volunteer_auth_tokens 
        WHERE token = ${token} AND expires_at > NOW() LIMIT 1
      `;
      if (authRows && authRows.length > 0) {
        volunteerEmail = volunteerEmail || authRows[0].email;
        volunteerName = volunteerName || authRows[0].name;
        if (!volunteerId && authRows[0].linked_volunteer_id) {
          volunteerId = Number(authRows[0].linked_volunteer_id);
        }
      }
    }

    // If volunteerId is still null, look up in volunteers by email
    if (volunteerEmail) {
      const volRows = await sql`
        SELECT id, name, phone FROM volunteers WHERE LOWER(email) = LOWER(${volunteerEmail}) LIMIT 1
      `;
      if (volRows && volRows.length > 0) {
        volunteerId = volunteerId || volRows[0].id;
        volunteerName = volunteerName || volRows[0].name;
        volunteerPhone = volunteerPhone || volRows[0].phone;
      }
    }

    if (!volunteerEmail) {
      return NextResponse.json(
        { error: 'Please sign in or provide your email to apply.' },
        { status: 401 }
      );
    }

    // Insert into event_applications
    await sql`
      INSERT INTO event_applications (
        event_id, event_title, volunteer_id, volunteer_name, volunteer_email, volunteer_phone, role_applied, status, created_at
      )
      VALUES (
        ${eventId ? Number(eventId) : null},
        ${eventTitle},
        ${volunteerId},
        ${volunteerName || 'Volunteer'},
        ${volunteerEmail.toLowerCase().trim()},
        ${volunteerPhone || ''},
        ${roleApplied || 'Event Volunteer'},
        'applied',
        NOW()
      )
    `;

    // Increment applied_count in upcoming_events
    try {
      if (eventId) {
        await sql`UPDATE upcoming_events SET applied_count = COALESCE(applied_count, 0) + 1 WHERE id = ${Number(eventId)}`;
      } else {
        await sql`UPDATE upcoming_events SET applied_count = COALESCE(applied_count, 0) + 1 WHERE LOWER(title) = LOWER(${eventTitle})`;
      }
    } catch (e) {
      console.error('Error updating applied_count:', e);
    }

    return NextResponse.json({
      success: true,
      message: `Successfully applied for ${eventTitle}!`,
    });

  } catch (error: any) {
    console.error('Error applying for event:', error);
    return NextResponse.json(
      { error: 'Failed to submit application. Please try again.' },
      { status: 500 }
    );
  }
}
