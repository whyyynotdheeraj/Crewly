import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { validateCredentials, createToken, COOKIE_NAME } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();
    
    // Validate against env vars using the auth helper
    const isValid = await validateCredentials(username, password);
    
    if (isValid) {
      // Create JWT token using auth helper
      const token = await createToken({ admin: true, username });

      // Set cookie
      const cookieStore = await cookies();
      cookieStore.set({
        name: COOKIE_NAME,
        value: token,
        httpOnly: true,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7 // 1 week
      });
      
      return NextResponse.json({ success: true });
    }
    
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
