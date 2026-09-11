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

    // Check if this email has a volunteer profile linked
    const volunteers = await sql`
      SELECT id, name FROM volunteers WHERE email = ${normalizedEmail} LIMIT 1
    `;
    const linkedVolunteer = volunteers.length > 0 ? volunteers[0] : null;

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

  } catch {
    return NextResponse.json({ error: 'Verification failed. Try again.' }, { status: 500 });
  }
}
