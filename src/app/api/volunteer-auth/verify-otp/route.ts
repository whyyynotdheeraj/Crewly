import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { generateToken } from '@/lib/volunteer-auth';

const DATABASE_URL = process.env.DATABASE_URL!;

function getSql() {
  return neon(DATABASE_URL);
}

export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json({ error: 'Email and OTP required' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const sql = getSql();

    // Find valid OTP session
    const sessions = await sql`
      SELECT * FROM volunteer_sessions 
      WHERE email = ${normalizedEmail} 
        AND otp_code = ${otp}
        AND otp_expires_at > NOW()
        AND google_id IS NULL
      ORDER BY created_at DESC
      LIMIT 1
    `;

    if (!sessions || sessions.length === 0) {
      return NextResponse.json({ error: 'Invalid or expired OTP. Please try again.' }, { status: 400 });
    }

    // OTP verified — delete session
    await sql`DELETE FROM volunteer_sessions WHERE email = ${normalizedEmail} AND google_id IS NULL`;

    // Create or update long-lived auth token
    const token = generateToken();
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    await sql`
      INSERT INTO volunteer_auth_tokens (email, token, expires_at, created_at, updated_at)
      VALUES (${normalizedEmail}, ${token}, ${expiresAt.toISOString()}, NOW(), NOW())
      ON CONFLICT (email) DO UPDATE SET
        token = ${token},
        expires_at = ${expiresAt.toISOString()},
        updated_at = NOW()
    `;

    // Check if this email already has a volunteer profile
    let existingVolunteers = await sql`
      SELECT id, name FROM volunteers WHERE LOWER(email) = ${normalizedEmail} LIMIT 1
    `;

    let linkedVolunteer = existingVolunteers.length > 0 ? existingVolunteers[0] : null;

    // If no profile exists, auto-create a basic one so they appear in the volunteers section
    if (!linkedVolunteer) {
      // Derive a display name from the email (e.g. "john.doe@gmail.com" → "John Doe")
      const emailPrefix = normalizedEmail.split('@')[0];
      const derivedName = emailPrefix
        .replace(/[._-]/g, ' ')
        .replace(/\b\w/g, (c: string) => c.toUpperCase())
        .trim() || 'Volunteer';

      try {
        const inserted = await sql`
          INSERT INTO volunteers (
            name, email, phone, location, bio,
            years_experience, events_completed, skills,
            availability, verified, display_order, created_at, updated_at
          ) VALUES (
            ${derivedName}, ${normalizedEmail}, '', '', 'Profile not filled yet.',
            0, 0, ARRAY[]::text[],
            'available', false, 0, NOW(), NOW()
          )
          RETURNING id, name
        `;

        if (inserted && inserted.length > 0) {
          linkedVolunteer = inserted[0];
        }
      } catch (insertErr) {
        // If insert fails (e.g. unique constraint), try fetching again
        console.warn('Auto-create volunteer failed, retrying fetch:', insertErr);
        const retry = await sql`
          SELECT id, name FROM volunteers WHERE LOWER(email) = ${normalizedEmail} LIMIT 1
        `;
        if (retry.length > 0) linkedVolunteer = retry[0];
      }
    }

    // Link volunteer_auth_tokens → volunteer profile
    if (linkedVolunteer?.id) {
      await sql`
        UPDATE volunteer_auth_tokens
        SET linked_volunteer_id = ${String(linkedVolunteer.id)}, updated_at = NOW()
        WHERE email = ${normalizedEmail}
      `;
    }

    const response = NextResponse.json({
      success: true,
      user: {
        email: normalizedEmail,
        name: linkedVolunteer?.name || null,
        volunteerId: linkedVolunteer?.id || null,
      }
    });

    response.cookies.set('vol_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
    });

    return response;

  } catch (err) {
    console.error('Verify OTP error:', err);
    return NextResponse.json({ error: 'Verification failed. Try again.' }, { status: 500 });
  }
}
