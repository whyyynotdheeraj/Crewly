import { neon } from '@neondatabase/serverless';
import type { UpcomingEvent, Volunteer, Experience, CompanyRequest } from './index';

export function isNeonConfigured(): boolean {
  const url = process.env.DATABASE_URL;
  return Boolean(url && url.startsWith('postgresql://'));
}

function getSql() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error('DATABASE_URL is not set');
  }
  return neon(url);
}

// ----------------- MAPPERS -----------------
function mapEvent(row: any): UpcomingEvent {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    date: row.date,
    city: row.city,
    posterUrl: row.poster_url,
    payout: row.payout,
    rolesNeeded: Array.isArray(row.roles_needed) ? row.roles_needed : typeof row.roles_needed === 'string' ? JSON.parse(row.roles_needed) : [],
    vacancies: Number(row.vacancies || 20),
    appliedCount: Number(row.applied_count || 0),
    organizer: row.organizer || '',
    description: row.description || '',
  };
}

function mapVolunteer(row: any): Volunteer {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    email: row.email || undefined,
    age: row.age ? Number(row.age) : undefined,
    location: row.location,
    bio: row.bio || '',
    yearsExperience: Number(row.years_experience || 0),
    eventsCompleted: Number(row.events_completed || 0),
    skills: Array.isArray(row.skills) ? row.skills : typeof row.skills === 'string' ? JSON.parse(row.skills) : [],
    availability: row.availability || 'available',
    verified: Boolean(row.verified),
    profileImage: row.profile_image || null,
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
    updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : new Date().toISOString(),
  };
}

function mapExperience(row: any): Experience {
  return {
    id: row.id,
    volunteerId: row.volunteer_id,
    eventName: row.event_name,
    role: row.role,
    year: Number(row.year) || 2024,
    description: row.description || '',
    eventType: row.event_type || 'Festival',
    images: Array.isArray(row.photos) ? row.photos : typeof row.photos === 'string' ? JSON.parse(row.photos) : [],
  };
}

function mapRequest(row: any): CompanyRequest {
  return {
    id: row.id,
    companyName: row.company_name,
    contactPerson: row.contact_person,
    phone: row.phone,
    email: row.email,
    eventName: row.event_name,
    eventType: row.event_type,
    eventDate: row.event_date,
    location: row.location,
    volunteersRequired: Number(row.volunteers_required || 1),
    requiredSkills: Array.isArray(row.required_skills) ? row.required_skills : typeof row.required_skills === 'string' ? JSON.parse(row.required_skills) : [],
    additionalRequirements: row.additional_requirements || '',
    status: row.status || 'pending',
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
  };
}

// ----------------- UPCOMING EVENTS -----------------

export async function neonGetAllUpcomingEvents(): Promise<UpcomingEvent[]> {
  const sql = getSql();
  const rows = await sql`SELECT * FROM upcoming_events ORDER BY id ASC;`;
  return rows.map(mapEvent);
}

export async function neonGetUpcomingEventById(id: number): Promise<UpcomingEvent | undefined> {
  const sql = getSql();
  const rows = await sql`SELECT * FROM upcoming_events WHERE id = ${id} LIMIT 1;`;
  if (rows.length === 0) return undefined;
  return mapEvent(rows[0]);
}

export async function neonCreateUpcomingEvent(data: Omit<UpcomingEvent, 'id'>): Promise<UpcomingEvent> {
  const sql = getSql();
  const rows = await sql`
    INSERT INTO upcoming_events (title, category, date, city, poster_url, payout, roles_needed, vacancies, applied_count, organizer, description)
    VALUES (
      ${data.title},
      ${data.category},
      ${data.date},
      ${data.city},
      ${data.posterUrl},
      ${data.payout},
      ${JSON.stringify(data.rolesNeeded || [])},
      ${data.vacancies || 20},
      ${data.appliedCount || 0},
      ${data.organizer || 'Event Organizer'},
      ${data.description || ''}
    )
    RETURNING *;
  `;
  return mapEvent(rows[0]);
}

export async function neonUpdateUpcomingEvent(id: number, data: Partial<Omit<UpcomingEvent, 'id'>>): Promise<UpcomingEvent | null> {
  const sql = getSql();
  const existing = await neonGetUpcomingEventById(id);
  if (!existing) return null;

  const merged = { ...existing, ...data };
  const rows = await sql`
    UPDATE upcoming_events
    SET 
      title = ${merged.title},
      category = ${merged.category},
      date = ${merged.date},
      city = ${merged.city},
      poster_url = ${merged.posterUrl},
      payout = ${merged.payout},
      roles_needed = ${JSON.stringify(merged.rolesNeeded || [])},
      vacancies = ${merged.vacancies || 20},
      applied_count = ${merged.appliedCount || 0},
      organizer = ${merged.organizer || ''},
      description = ${merged.description || ''}
    WHERE id = ${id}
    RETURNING *;
  `;
  if (rows.length === 0) return null;
  return mapEvent(rows[0]);
}

export async function neonDeleteUpcomingEvent(id: number): Promise<boolean> {
  const sql = getSql();
  const rows = await sql`DELETE FROM upcoming_events WHERE id = ${id} RETURNING id;`;
  return rows.length > 0;
}

// ----------------- VOLUNTEERS -----------------

export async function neonGetAllVolunteers(): Promise<Volunteer[]> {
  const sql = getSql();
  const rows = await sql`SELECT * FROM volunteers ORDER BY id DESC;`;
  return rows.map(mapVolunteer);
}

export async function neonGetVolunteerById(id: number): Promise<Volunteer | undefined> {
  const sql = getSql();
  const rows = await sql`SELECT * FROM volunteers WHERE id = ${id} LIMIT 1;`;
  if (rows.length === 0) return undefined;
  return mapVolunteer(rows[0]);
}

export async function neonCreateVolunteer(data: Omit<Volunteer, 'id' | 'createdAt' | 'updatedAt'>): Promise<Volunteer> {
  const sql = getSql();
  const rows = await sql`
    INSERT INTO volunteers (name, phone, email, age, location, bio, years_experience, events_completed, skills, availability, verified, profile_image)
    VALUES (
      ${data.name},
      ${data.phone},
      ${data.email || null},
      ${data.age || null},
      ${data.location},
      ${data.bio || ''},
      ${data.yearsExperience || 0},
      ${data.eventsCompleted || 0},
      ${JSON.stringify(data.skills || [])},
      ${data.availability || 'available'},
      ${data.verified || false},
      ${data.profileImage || null}
    )
    RETURNING *;
  `;
  return mapVolunteer(rows[0]);
}

export async function neonUpdateVolunteer(id: number, data: Partial<Volunteer>): Promise<Volunteer | null> {
  const sql = getSql();
  const existing = await neonGetVolunteerById(id);
  if (!existing) return null;

  const merged = { ...existing, ...data };
  const rows = await sql`
    UPDATE volunteers
    SET 
      name = ${merged.name},
      phone = ${merged.phone},
      email = ${merged.email || null},
      age = ${merged.age || null},
      location = ${merged.location},
      bio = ${merged.bio || ''},
      years_experience = ${merged.yearsExperience || 0},
      events_completed = ${merged.eventsCompleted || 0},
      skills = ${JSON.stringify(merged.skills || [])},
      availability = ${merged.availability || 'available'},
      verified = ${merged.verified || false},
      profile_image = ${merged.profileImage || null},
      updated_at = NOW()
    WHERE id = ${id}
    RETURNING *;
  `;
  if (rows.length === 0) return null;
  return mapVolunteer(rows[0]);
}

export async function neonDeleteVolunteer(id: number): Promise<boolean> {
  const sql = getSql();
  await sql`DELETE FROM experiences WHERE volunteer_id = ${id};`;
  const rows = await sql`DELETE FROM volunteers WHERE id = ${id} RETURNING id;`;
  return rows.length > 0;
}

export async function neonSearchVolunteers(params: {
  search?: string;
  location?: string;
  skill?: string;
  minExperience?: number;
  verified?: boolean;
  availability?: string;
}): Promise<Volunteer[]> {
  let volunteers = await neonGetAllVolunteers();

  if (params.search) {
    const search = params.search.toLowerCase();
    volunteers = volunteers.filter(
      (v) =>
        v.name.toLowerCase().includes(search) ||
        v.location.toLowerCase().includes(search) ||
        v.skills.some((s) => s.toLowerCase().includes(search))
    );
  }

  if (params.location) {
    const loc = params.location.toLowerCase();
    volunteers = volunteers.filter((v) =>
      v.location.toLowerCase().includes(loc)
    );
  }

  if (params.skill) {
    const skill = params.skill.toLowerCase();
    volunteers = volunteers.filter((v) =>
      v.skills.some((s) => s.toLowerCase().includes(skill))
    );
  }

  if (params.minExperience !== undefined) {
    volunteers = volunteers.filter(
      (v) => v.yearsExperience >= params.minExperience!
    );
  }

  if (params.verified !== undefined) {
    volunteers = volunteers.filter((v) => v.verified === params.verified);
  }

  if (params.availability) {
    const avail = params.availability.toLowerCase();
    volunteers = volunteers.filter(
      (v) => (v.availability || 'available').toLowerCase() === avail
    );
  }

  return volunteers;
}

// ----------------- EXPERIENCES -----------------

export async function neonGetExperiencesByVolunteerId(volunteerId: number): Promise<Experience[]> {
  const sql = getSql();
  const rows = await sql`SELECT * FROM experiences WHERE volunteer_id = ${volunteerId} ORDER BY id ASC;`;
  return rows.map(mapExperience);
}

export async function neonCreateExperience(data: Omit<Experience, 'id'>): Promise<Experience> {
  const sql = getSql();
  const rows = await sql`
    INSERT INTO experiences (volunteer_id, event_name, role, year, description, event_type, photos)
    VALUES (
      ${data.volunteerId},
      ${data.eventName},
      ${data.role},
      ${String(data.year)},
      ${data.description || ''},
      ${data.eventType || ''},
      ${JSON.stringify(data.images || [])}
    )
    RETURNING *;
  `;
  return mapExperience(rows[0]);
}

export async function neonUpdateExperience(id: number, data: Partial<Experience>): Promise<Experience | null> {
  const sql = getSql();
  const rows = await sql`SELECT * FROM experiences WHERE id = ${id} LIMIT 1;`;
  if (rows.length === 0) return null;
  const existing = mapExperience(rows[0]);
  const merged = { ...existing, ...data };

  const updated = await sql`
    UPDATE experiences
    SET 
      event_name = ${merged.eventName},
      role = ${merged.role},
      year = ${String(merged.year)},
      description = ${merged.description || ''},
      event_type = ${merged.eventType || ''},
      photos = ${JSON.stringify(merged.images || [])}
    WHERE id = ${id}
    RETURNING *;
  `;
  return mapExperience(updated[0]);
}

export async function neonDeleteExperience(id: number): Promise<boolean> {
  const sql = getSql();
  const rows = await sql`DELETE FROM experiences WHERE id = ${id} RETURNING id;`;
  return rows.length > 0;
}

// ----------------- COMPANY REQUESTS -----------------

export async function neonGetAllRequests(): Promise<CompanyRequest[]> {
  const sql = getSql();
  const rows = await sql`SELECT * FROM company_requests ORDER BY id DESC;`;
  return rows.map(mapRequest);
}

export async function neonGetRequestById(id: number): Promise<CompanyRequest | undefined> {
  const sql = getSql();
  const rows = await sql`SELECT * FROM company_requests WHERE id = ${id} LIMIT 1;`;
  if (rows.length === 0) return undefined;
  return mapRequest(rows[0]);
}

export async function neonCreateRequest(data: Omit<CompanyRequest, 'id' | 'createdAt' | 'status'>): Promise<CompanyRequest> {
  const sql = getSql();
  const rows = await sql`
    INSERT INTO company_requests (company_name, contact_person, phone, email, event_name, event_type, event_date, location, volunteers_required, required_skills, additional_requirements, status)
    VALUES (
      ${data.companyName},
      ${data.contactPerson},
      ${data.phone},
      ${data.email},
      ${data.eventName},
      ${data.eventType},
      ${data.eventDate},
      ${data.location},
      ${data.volunteersRequired || 1},
      ${JSON.stringify(data.requiredSkills || [])},
      ${data.additionalRequirements || ''},
      'pending'
    )
    RETURNING *;
  `;
  return mapRequest(rows[0]);
}

export async function neonUpdateRequestStatus(id: number, status: CompanyRequest['status']): Promise<CompanyRequest | null> {
  const sql = getSql();
  const rows = await sql`
    UPDATE company_requests
    SET status = ${status}
    WHERE id = ${id}
    RETURNING *;
  `;
  if (rows.length === 0) return null;
  return mapRequest(rows[0]);
}

export async function neonDeleteRequest(id: number): Promise<boolean> {
  const sql = getSql();
  const rows = await sql`DELETE FROM company_requests WHERE id = ${id} RETURNING id;`;
  return rows.length > 0;
}

export async function neonGetStats() {
  const sql = getSql();
  const [vTotal] = await sql`SELECT count(*)::int FROM volunteers;`;
  const [vVerified] = await sql`SELECT count(*)::int FROM volunteers WHERE verified = true;`;
  const [rPending] = await sql`SELECT count(*)::int FROM company_requests WHERE status = 'pending';`;
  const [rReviewed] = await sql`SELECT count(*)::int FROM company_requests WHERE status = 'reviewed';`;
  const [rCompleted] = await sql`SELECT count(*)::int FROM company_requests WHERE status = 'completed';`;
  const [eTotal] = await sql`SELECT count(*)::int FROM upcoming_events;`;

  return {
    totalVolunteers: vTotal.count,
    verifiedVolunteers: vVerified.count,
    pendingRequests: rPending.count,
    reviewedRequests: rReviewed.count,
    completedRequests: rCompleted.count,
    totalEvents: eTotal.count,
  };
}
