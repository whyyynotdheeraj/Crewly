// Script to create auth tables in Neon DB for volunteer authentication
import { neon } from '@neondatabase/serverless';
import * as fs from 'fs';
import * as path from 'path';

// Read .env.local and parse DATABASE_URL
const envPath = path.join(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
let DATABASE_URL = '';

for (const line of envContent.split('\n')) {
  if (line.startsWith('DATABASE_URL=')) {
    DATABASE_URL = line.slice('DATABASE_URL='.length).trim().replace(/^["']|["']$/g, '');
  }
}

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL not found in .env.local');
  process.exit(1);
}

const sql = neon(DATABASE_URL);

async function setupAuthTables() {
  console.log('🔧 Setting up volunteer auth tables in Neon...\n');

  // Table 1: volunteer_sessions - stores OTP codes and Google session tokens
  await sql`
    CREATE TABLE IF NOT EXISTS volunteer_sessions (
      id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
      email TEXT NOT NULL,
      otp_code TEXT,
      otp_expires_at TIMESTAMPTZ,
      google_id TEXT,
      name TEXT,
      picture TEXT,
      is_verified BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  console.log('✅ Table created: volunteer_sessions');

  // Table 2: volunteer_auth_tokens - stores long-lived session tokens after login
  await sql`
    CREATE TABLE IF NOT EXISTS volunteer_auth_tokens (
      id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
      email TEXT NOT NULL UNIQUE,
      token TEXT NOT NULL UNIQUE,
      name TEXT,
      picture TEXT,
      google_id TEXT,
      linked_volunteer_id TEXT,
      expires_at TIMESTAMPTZ NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  console.log('✅ Table created: volunteer_auth_tokens');

  // Index for fast lookups
  await sql`CREATE INDEX IF NOT EXISTS idx_volunteer_auth_tokens_token ON volunteer_auth_tokens(token)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_volunteer_auth_tokens_email ON volunteer_auth_tokens(email)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_volunteer_sessions_email ON volunteer_sessions(email)`;

  console.log('\n✅ All auth tables ready!\n');

  // Show counts
  const sessions = await sql`SELECT COUNT(*) as count FROM volunteer_sessions`;
  const tokens = await sql`SELECT COUNT(*) as count FROM volunteer_auth_tokens`;
  console.log(`📊 volunteer_sessions: ${sessions[0].count} rows`);
  console.log(`📊 volunteer_auth_tokens: ${tokens[0].count} rows`);
}

setupAuthTables().catch((err) => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
