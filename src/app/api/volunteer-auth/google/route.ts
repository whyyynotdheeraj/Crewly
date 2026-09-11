import { NextRequest, NextResponse } from 'next/server';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const APP_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000';

// Step 1: Redirect to Google OAuth
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const callbackUrl = searchParams.get('callbackUrl') || '/join';

  if (!GOOGLE_CLIENT_ID) {
    // Google not configured — redirect to sign in page with error
    return NextResponse.redirect(`${APP_URL}/auth/signin?error=google_not_configured`);
  }

  const redirectUri = `${APP_URL}/api/volunteer-auth/google/callback`;
  const state = Buffer.from(JSON.stringify({ callbackUrl })).toString('base64');

  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    state,
    prompt: 'select_account',
  });

  return NextResponse.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
}
