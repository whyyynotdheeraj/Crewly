import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { generateToken } from '@/lib/volunteer-auth';

const DATABASE_URL = process.env.DATABASE_URL!;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
const APP_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000';

function getSql() {
  return neon(DATABASE_URL);
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const stateParam = searchParams.get('state');
    const error = searchParams.get('error');

    if (error || !code) {
      return NextResponse.redirect(`${APP_URL}/auth/signin?error=google_denied`);
    }

    let callbackUrl = '/join';
    if (stateParam) {
      try {
        const state = JSON.parse(Buffer.from(stateParam, 'base64').toString());
        callbackUrl = state.callbackUrl || '/join';
      } catch {}
    }

    const redirectUri = `${APP_URL}/api/volunteer-auth/google/callback`;

    // Exchange code for tokens
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }).toString(),
    });

    if (!tokenRes.ok) {
      console.error('Google token exchange failed:', await tokenRes.text());
      return NextResponse.redirect(`${APP_URL}/auth/signin?error=google_token_failed`);
    }

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    // Get user info from Google
    const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!userRes.ok) {
      return NextResponse.redirect(`${APP_URL}/auth/signin?error=google_userinfo_failed`);
    }

    const googleUser = await userRes.json();
    const { id: googleId, email, name, picture } = googleUser;

    if (!email) {
      return NextResponse.redirect(`${APP_URL}/auth/signin?error=no_email`);
    }

    const normalizedEmail = email.toLowerCase().trim();
    const sql = getSql();

    // Create or update auth token for this Google user
    const token = generateToken();
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    await sql`
      INSERT INTO volunteer_auth_tokens (email, token, name, picture, google_id, expires_at, created_at, updated_at)
      VALUES (${normalizedEmail}, ${token}, ${name}, ${picture}, ${googleId}, ${expiresAt.toISOString()}, NOW(), NOW())
      ON CONFLICT (email) DO UPDATE SET
        token = ${token},
        name = ${name},
        picture = ${picture},
        google_id = ${googleId},
        expires_at = ${expiresAt.toISOString()},
        updated_at = NOW()
    `;

    const response = NextResponse.redirect(`${APP_URL}${callbackUrl}`);
    response.cookies.set('vol_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60,
      path: '/',
    });

    return response;

  } catch {
    return NextResponse.redirect(`${APP_URL}/auth/signin?error=server_error`);
  }
}

