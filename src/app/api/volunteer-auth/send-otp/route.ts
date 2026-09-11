import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { Resend } from 'resend';

const DATABASE_URL = process.env.DATABASE_URL!;
const RESEND_API_KEY = process.env.RESEND_API_KEY!;
const FROM_EMAIL = process.env.FROM_EMAIL || 'onboarding@resend.dev';

function getSql() {
  return neon(DATABASE_URL);
}

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const otp = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const sql = getSql();

    // Delete any existing OTP for this email
    await sql`DELETE FROM volunteer_sessions WHERE email = ${normalizedEmail} AND google_id IS NULL`;

    // Insert new OTP session
    await sql`
      INSERT INTO volunteer_sessions (email, otp_code, otp_expires_at, is_verified, created_at)
      VALUES (${normalizedEmail}, ${otp}, ${otpExpiresAt.toISOString()}, false, NOW())
    `;

    // Send OTP email
    if (RESEND_API_KEY) {
      const resend = new Resend(RESEND_API_KEY);
      await resend.emails.send({
        from: FROM_EMAIL,
        to: normalizedEmail,
        subject: 'Your Crewly Login Code',
        html: `
          <!DOCTYPE html>
          <html>
          <body style="font-family: Arial, sans-serif; background: #f9fafb; padding: 40px 20px; margin: 0;">
            <div style="max-width: 480px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
              <div style="background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 32px; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 800;">Crewly</h1>
                <p style="color: rgba(255,255,255,0.85); margin: 8px 0 0; font-size: 14px;">Event Volunteer Platform</p>
              </div>
              <div style="padding: 40px 32px; text-align: center;">
                <p style="color: #374151; font-size: 16px; margin: 0 0 24px;">Your one-time login code is:</p>
                <div style="background: #f3f4f6; border-radius: 12px; padding: 24px; display: inline-block; margin: 0 0 24px;">
                  <span style="font-size: 42px; font-weight: 800; color: #6366f1; letter-spacing: 8px;">${otp}</span>
                </div>
                <p style="color: #6b7280; font-size: 14px; margin: 0 0 8px;">This code expires in <strong>10 minutes</strong>.</p>
                <p style="color: #6b7280; font-size: 13px; margin: 0;">If you didn't request this, ignore this email.</p>
              </div>
              <div style="background: #f9fafb; padding: 20px 32px; text-align: center; border-top: 1px solid #e5e7eb;">
                <p style="color: #9ca3af; font-size: 12px; margin: 0;">© 2024 Crewly. Made with care for volunteers.</p>
              </div>
            </div>
          </body>
          </html>
        `,
      });
    } else {
      // Dev mode: return OTP in response for testing
    }

    return NextResponse.json({
      success: true,
      message: 'OTP sent successfully',
      ...(process.env.NODE_ENV === 'development' && !RESEND_API_KEY ? { devOtp: otp } : {})
    });

  } catch {
    return NextResponse.json({ error: 'Failed to send OTP. Try again.' }, { status: 500 });
  }
}
