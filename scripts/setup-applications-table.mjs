// Script to create event_applications table in Neon DB
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
  console.error('❌ DATABASE_URL not found in .env.local');
  process.exit(1);
}

const sql = neon(DATABASE_URL);

async function setupApplicationsTable() {
  console.log('🔧 Setting up event_applications table in Neon DB...\n');

  await sql`
    CREATE TABLE IF NOT EXISTS event_applications (
      id SERIAL PRIMARY KEY,
      event_id INTEGER,
      event_title TEXT NOT NULL,
      volunteer_id INTEGER,
      volunteer_name TEXT NOT NULL,
      volunteer_email TEXT NOT NULL,
      volunteer_phone TEXT,
      role_applied TEXT,
      status TEXT DEFAULT 'applied',
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  console.log('✅ Table created: event_applications');

  await sql`CREATE INDEX IF NOT EXISTS idx_event_applications_event_title ON event_applications(event_title)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_event_applications_volunteer_email ON event_applications(volunteer_email)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_event_applications_volunteer_id ON event_applications(volunteer_id)`;

  console.log('✅ Indexes created!');
}

setupApplicationsTable().catch((err) => {
  console.error('❌ Error creating event_applications table:', err.message);
  process.exit(1);
});
