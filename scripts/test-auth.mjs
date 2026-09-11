// Quick test script to verify volunteer auth tables and OTP flow in Neon DB
import { neon } from '@neondatabase/serverless';
import * as fs from 'fs';
import * as path from 'path';

const envPath = path.join(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
let DATABASE_URL = '';

for (const line of envContent.split('\n')) {
  if (line.startsWith('DATABASE_URL=')) {
    DATABASE_URL = line.slice('DATABASE_URL='.length).trim().replace(/^["']|["']$/g, '');
  }
}

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL not found');
  process.exit(1);
}

const sql = neon(DATABASE_URL);

async function testAuth() {
  console.log('🧪 Testing Volunteer Authentication Flow in Neon DB...\n');

  const testEmail = 'volunteer_test@crewly.in';
  const testOtp = '789123';
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  // 1. Simulate sending OTP
  console.log(`1️⃣ Creating OTP session for ${testEmail}...`);
  await sql`DELETE FROM volunteer_sessions WHERE email = ${testEmail}`;
  await sql`
    INSERT INTO volunteer_sessions (email, otp_code, otp_expires_at, is_verified, created_at)
    VALUES (${testEmail}, ${testOtp}, ${expiresAt.toISOString()}, false, NOW())
  `;

  const session = await sql`
    SELECT * FROM volunteer_sessions WHERE email = ${testEmail} AND otp_code = ${testOtp}
  `;
  console.log(`   ✅ Session recorded: email = ${session[0].email}, code = ${session[0].otp_code}`);

  // 2. Simulate OTP verification & session token creation
  console.log('\n2️⃣ Verifying OTP and generating auth token...');
  const testToken = 'crewly_test_vol_token_' + Date.now();
  const tokenExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  await sql`
    INSERT INTO volunteer_auth_tokens (email, token, expires_at, created_at, updated_at)
    VALUES (${testEmail}, ${testToken}, ${tokenExpiresAt.toISOString()}, NOW(), NOW())
    ON CONFLICT (email) DO UPDATE SET token = ${testToken}, expires_at = ${tokenExpiresAt.toISOString()}
  `;

  const authToken = await sql`
    SELECT email, token, expires_at FROM volunteer_auth_tokens WHERE email = ${testEmail}
  `;
  console.log(`   ✅ Auth token saved: email = ${authToken[0].email}, token = ${authToken[0].token.slice(0, 20)}...`);

  // 3. Clean up test data
  console.log('\n3️⃣ Cleaning up test records...');
  await sql`DELETE FROM volunteer_sessions WHERE email = ${testEmail}`;
  await sql`DELETE FROM volunteer_auth_tokens WHERE email = ${testEmail}`;
  console.log('   ✅ Cleanup complete.');

  console.log('\n🎉 ALL AUTH DATABASE OPERATIONS PASSED!\n');
}

testAuth().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
