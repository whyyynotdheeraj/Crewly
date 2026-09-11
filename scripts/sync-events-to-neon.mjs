import { neon } from '@neondatabase/serverless';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Parse .env.local
const envPath = resolve(__dirname, '../.env.local');
const envContent = readFileSync(envPath, 'utf-8');
for (const line of envContent.split('\n')) {
  const [key, ...val] = line.split('=');
  if (key && val.length) {
    let v = val.join('=').trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    process.env[key.trim()] = v;
  }
}

const sql = neon(process.env.DATABASE_URL);

// Read db.json
const dbPath = resolve(__dirname, '../data/db.json');
const db = JSON.parse(readFileSync(dbPath, 'utf-8'));
const events = db.upcomingEvents;

console.log(`📋 db.json me ${events.length} events hain:\n`);
events.forEach(e => console.log(`  - [${e.id}] ${e.title}`));

console.log('\n🔄 Neon me current events:');
const neonEvents = await sql`SELECT id, title FROM upcoming_events ORDER BY id`;
neonEvents.forEach(e => console.log(`  - [${e.id}] ${e.title}`));

console.log('\n⬆️  Sync kar raha hoon...\n');

// Delete all and re-insert
await sql`DELETE FROM upcoming_events`;
console.log('  ✓ Purane events delete kiye');

for (const event of events) {
  await sql`
    INSERT INTO upcoming_events (
      id, title, date, city, category,
      roles_needed, applied_count, poster_url, description,
      stipend, vacancies, organizer
    ) VALUES (
      ${event.id},
      ${event.title || ''},
      ${event.date || ''},
      ${event.location || event.city || ''},
      ${event.category || ''},
      ${JSON.stringify(event.rolesNeeded || [])},
      ${event.appliedCount || 0},
      ${event.posterUrl || ''},
      ${event.description || ''},
      ${event.stipend || ''},
      ${event.vacancies || 0},
      ${event.organizer || ''}
    )
  `;
  console.log(`  ✓ Saved: [${event.id}] ${event.title}`);
}

// Reset ID sequence
await sql`SELECT setval('upcoming_events_id_seq', (SELECT MAX(id) FROM upcoming_events))`;

console.log('\n✅ Sabhi events Neon me save ho gaye!');
console.log('\n📊 Final Neon events:');
const finalEvents = await sql`SELECT id, title, date, city FROM upcoming_events ORDER BY id`;
finalEvents.forEach(e => console.log(`  - [${e.id}] ${e.title} | ${e.date} | ${e.city}`));
