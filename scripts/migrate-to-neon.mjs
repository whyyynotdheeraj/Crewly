import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';

const DATABASE_URL = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_FI4r7iKLQAfN@ep-empty-bread-axnhic1m-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

const sql = neon(DATABASE_URL);

async function run() {
  console.log('Connecting to Neon Database...');

  // 1. Create Tables
  await sql`
    CREATE TABLE IF NOT EXISTS upcoming_events (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      date TEXT NOT NULL,
      city TEXT NOT NULL,
      poster_url TEXT NOT NULL,
      stipend TEXT NOT NULL,
      roles_needed JSONB NOT NULL DEFAULT '[]',
      vacancies INTEGER NOT NULL DEFAULT 20,
      applied_count INTEGER NOT NULL DEFAULT 0,
      organizer TEXT NOT NULL,
      description TEXT DEFAULT '',
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS volunteers (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT,
      age INTEGER,
      location TEXT NOT NULL,
      bio TEXT DEFAULT '',
      years_experience INTEGER NOT NULL DEFAULT 0,
      events_completed INTEGER NOT NULL DEFAULT 0,
      skills JSONB NOT NULL DEFAULT '[]',
      availability TEXT NOT NULL DEFAULT 'available',
      verified BOOLEAN NOT NULL DEFAULT false,
      profile_image TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS experiences (
      id SERIAL PRIMARY KEY,
      volunteer_id INTEGER NOT NULL,
      event_name TEXT NOT NULL,
      role TEXT NOT NULL,
      year TEXT NOT NULL,
      description TEXT DEFAULT '',
      event_type TEXT,
      photos JSONB NOT NULL DEFAULT '[]',
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS company_requests (
      id SERIAL PRIMARY KEY,
      company_name TEXT NOT NULL,
      contact_person TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT NOT NULL,
      event_name TEXT NOT NULL,
      event_type TEXT NOT NULL,
      event_date TEXT NOT NULL,
      location TEXT NOT NULL,
      volunteers_required INTEGER NOT NULL DEFAULT 1,
      required_skills JSONB NOT NULL DEFAULT '[]',
      additional_requirements TEXT DEFAULT '',
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;

  console.log('Tables created or verified successfully.');

  // 2. Read existing db.json
  const dbPath = path.join(process.cwd(), 'data', 'db.json');
  if (!fs.existsSync(dbPath)) {
    console.log('No db.json found. Done.');
    return;
  }

  const raw = fs.readFileSync(dbPath, 'utf-8');
  const data = JSON.parse(raw);

  // 3. Migrate Upcoming Events
  if (data.upcomingEvents && data.upcomingEvents.length > 0) {
    const existingCount = await sql`SELECT count(*)::int FROM upcoming_events;`;
    if (existingCount[0].count === 0) {
      console.log(`Migrating ${data.upcomingEvents.length} upcoming events...`);
      for (const ev of data.upcomingEvents) {
        await sql`
          INSERT INTO upcoming_events (id, title, category, date, city, poster_url, stipend, roles_needed, vacancies, applied_count, organizer, description)
          VALUES (
            ${ev.id},
            ${ev.title},
            ${ev.category},
            ${ev.date},
            ${ev.city},
            ${ev.posterUrl},
            ${ev.stipend},
            ${JSON.stringify(ev.rolesNeeded || [])},
            ${ev.vacancies || 20},
            ${ev.appliedCount || 0},
            ${ev.organizer || 'Event Organizer'},
            ${ev.description || ''}
          )
          ON CONFLICT (id) DO NOTHING;
        `;
      }
      await sql`SELECT setval(pg_get_serial_sequence('upcoming_events', 'id'), COALESCE(MAX(id), 1)) FROM upcoming_events;`;
      console.log('Upcoming events migrated!');
    } else {
      console.log(`upcoming_events already has ${existingCount[0].count} rows.`);
    }
  }

  // 4. Migrate Volunteers
  if (data.volunteers && data.volunteers.length > 0) {
    const existingCount = await sql`SELECT count(*)::int FROM volunteers;`;
    if (existingCount[0].count === 0) {
      console.log(`Migrating ${data.volunteers.length} volunteers...`);
      for (const vol of data.volunteers) {
        await sql`
          INSERT INTO volunteers (id, name, phone, email, age, location, bio, years_experience, events_completed, skills, availability, verified, profile_image, created_at, updated_at)
          VALUES (
            ${vol.id},
            ${vol.name},
            ${vol.phone},
            ${vol.email || null},
            ${vol.age || null},
            ${vol.location},
            ${vol.bio || ''},
            ${vol.yearsExperience || 0},
            ${vol.eventsCompleted || 0},
            ${JSON.stringify(vol.skills || [])},
            ${vol.availability || 'available'},
            ${vol.verified || false},
            ${vol.profileImage || null},
            ${vol.createdAt ? new Date(vol.createdAt) : new Date()},
            ${vol.updatedAt ? new Date(vol.updatedAt) : new Date()}
          )
          ON CONFLICT (id) DO NOTHING;
        `;
      }
      await sql`SELECT setval(pg_get_serial_sequence('volunteers', 'id'), COALESCE(MAX(id), 1)) FROM volunteers;`;
      console.log('Volunteers migrated!');
    } else {
      console.log(`volunteers already has ${existingCount[0].count} rows.`);
    }
  }

  // 5. Migrate Experiences
  if (data.experiences && data.experiences.length > 0) {
    const existingCount = await sql`SELECT count(*)::int FROM experiences;`;
    if (existingCount[0].count === 0) {
      console.log(`Migrating ${data.experiences.length} experiences...`);
      for (const exp of data.experiences) {
        await sql`
          INSERT INTO experiences (id, volunteer_id, event_name, role, year, description, event_type, photos)
          VALUES (
            ${exp.id},
            ${exp.volunteerId},
            ${exp.eventName},
            ${exp.role},
            ${exp.year},
            ${exp.description || ''},
            ${exp.eventType || ''},
            ${JSON.stringify(exp.photos || [])}
          )
          ON CONFLICT (id) DO NOTHING;
        `;
      }
      await sql`SELECT setval(pg_get_serial_sequence('experiences', 'id'), COALESCE(MAX(id), 1)) FROM experiences;`;
      console.log('Experiences migrated!');
    } else {
      console.log(`experiences already has ${existingCount[0].count} rows.`);
    }
  }

  // 6. Migrate Company Requests
  if (data.companyRequests && data.companyRequests.length > 0) {
    const existingCount = await sql`SELECT count(*)::int FROM company_requests;`;
    if (existingCount[0].count === 0) {
      console.log(`Migrating ${data.companyRequests.length} company requests...`);
      for (const req of data.companyRequests) {
        await sql`
          INSERT INTO company_requests (id, company_name, contact_person, phone, email, event_name, event_type, event_date, location, volunteers_required, required_skills, additional_requirements, status, created_at)
          VALUES (
            ${req.id},
            ${req.companyName},
            ${req.contactPerson},
            ${req.phone},
            ${req.email},
            ${req.eventName},
            ${req.eventType},
            ${req.eventDate},
            ${req.location},
            ${req.volunteersRequired || 1},
            ${JSON.stringify(req.requiredSkills || [])},
            ${req.additionalRequirements || ''},
            ${req.status || 'pending'},
            ${req.createdAt ? new Date(req.createdAt) : new Date()}
          )
          ON CONFLICT (id) DO NOTHING;
        `;
      }
      await sql`SELECT setval(pg_get_serial_sequence('company_requests', 'id'), COALESCE(MAX(id), 1)) FROM company_requests;`;
      console.log('Company requests migrated!');
    } else {
      console.log(`company_requests already has ${existingCount[0].count} rows.`);
    }
  }

  console.log('🎉 Neon Migration completed successfully!');
}

run().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
