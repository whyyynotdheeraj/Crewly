import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const DATABASE_URL = process.env.DATABASE_URL!;

function getSql() {
  return neon(DATABASE_URL);
}

// GET — check current volunteer session
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('vol_token')?.value;

    if (!token) {
      return NextResponse.json({ authenticated: false, user: null });
    }

    const sql = getSql();
    const rows = await sql`
      SELECT email, name, picture, google_id, linked_volunteer_id, expires_at
      FROM volunteer_auth_tokens
      WHERE token = ${token} AND expires_at > NOW()
      LIMIT 1
    `;

    if (!rows || rows.length === 0) {
      const res = NextResponse.json({ authenticated: false, user: null });
      res.cookies.delete('vol_token');
      return res;
    }

    const row = rows[0];
    let volunteerId = row.linked_volunteer_id || null;

    if (!volunteerId && row.email) {
      try {
        const volMatch = await sql`SELECT id FROM volunteers WHERE LOWER(email) = LOWER(${row.email}) LIMIT 1`;
        if (volMatch && volMatch.length > 0) {
          volunteerId = String(volMatch[0].id);
          await sql`UPDATE volunteer_auth_tokens SET linked_volunteer_id = ${volunteerId} WHERE token = ${token}`;
        }
      } catch (err) {
        console.error('Error auto-linking volunteer profile:', err);
      }
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        email: row.email,
        name: row.name || null,
        picture: row.picture || null,
        volunteerId: volunteerId,
      }
    });

  } catch (error: any) {
    console.error('Auth check error:', error);
    return NextResponse.json({ authenticated: false, user: null });
  }
}

// DELETE — logout
export async function DELETE(request: NextRequest) {
  try {
    const token = request.cookies.get('vol_token')?.value;

    if (token) {
      const sql = getSql();
      await sql`DELETE FROM volunteer_auth_tokens WHERE token = ${token}`;
    }

    const response = NextResponse.json({ success: true, message: 'Logged out' });
    response.cookies.delete('vol_token');
    return response;

  } catch (error: any) {
    console.error('Logout error:', error);
    return NextResponse.json({ error: 'Logout failed' }, { status: 500 });
  }
}
