import { neon } from '@neondatabase/serverless';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, '../.env.local');
const envContent = readFileSync(envPath, 'utf-8');
let dbUrl = '';
for (const line of envContent.split('\n')) {
  const [k, ...v] = line.split('=');
  if (k.trim() === 'DATABASE_URL') {
    dbUrl = v.join('=').trim().replace(/^["']|["']$/g, '');
  }
}

const sql = neon(dbUrl);

console.log('Fetching volunteers from Neon...');
const neonVolunteers = await sql`SELECT id, name, location, verified, years_experience, events_completed FROM volunteers ORDER BY id`;
console.log(`\n✅ NEON DATABASE VOLUNTEERS (${neonVolunteers.length}):`);
neonVolunteers.forEach(v => {
  console.log(`  [${v.id}] ${v.name} | ${v.location} | Verified: ${v.verified} | Exp: ${v.years_experience} yrs`);
});

const neonExp = await sql`SELECT COUNT(*) as count FROM experiences`;
console.log(`\n✅ NEON EXPERIENCES COUNT: ${neonExp[0].count}`);

const dbJson = JSON.parse(readFileSync(resolve(__dirname, '../data/db.json'), 'utf-8'));
console.log(`\nLOCAL db.json VOLUNTEERS (${dbJson.volunteers.length}):`);
dbJson.volunteers.forEach(v => {
  console.log(`  [${v.id}] ${v.name} | ${v.location} | Verified: ${v.verified}`);
});
