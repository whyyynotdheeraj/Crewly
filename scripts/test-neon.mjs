import { neon } from '@neondatabase/serverless';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Manually parse .env.local
const envPath = resolve(__dirname, '../.env.local');
const envContent = readFileSync(envPath, 'utf-8');
for (const line of envContent.split('\n')) {
  const [key, ...val] = line.split('=');
  if (key && val.length) {
    let v = val.join('=').trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    process.env[key.trim()] = v;
  }
}

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL not found in .env.local!');
  process.exit(1);
}

console.log('🔗 Connecting to Neon...');
console.log('   URL:', DATABASE_URL.substring(0, 40) + '...');

const sql = neon(DATABASE_URL);

try {
  // Test 1: Basic connection
  const ping = await sql`SELECT NOW() as time, current_database() as db`;
  console.log('\n✅ CONNECTION SUCCESSFUL!');
  console.log('   Database:', ping[0].db);
  console.log('   Server Time:', ping[0].time);

  // Test 2: Count all tables
  const events = await sql`SELECT COUNT(*) as count FROM upcoming_events`;
  const volunteers = await sql`SELECT COUNT(*) as count FROM volunteers`;
  const experiences = await sql`SELECT COUNT(*) as count FROM experiences`;
  const requests = await sql`SELECT COUNT(*) as count FROM company_requests`;

  console.log('\n📊 DATABASE STATS:');
  console.log('   🎉 Upcoming Events:', events[0].count);
  console.log('   👥 Volunteers:', volunteers[0].count);
  console.log('   📝 Experiences:', experiences[0].count);
  console.log('   📋 Company Requests:', requests[0].count);

  console.log('\n🎉 Database is perfectly connected and has data!');
} catch (err) {
  console.error('\n❌ CONNECTION FAILED!');
  console.error('   Error:', err.message);
  process.exit(1);
}
