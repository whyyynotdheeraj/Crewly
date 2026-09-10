import fs from "fs";
import path from "path";

const DB_PATH = path.join(process.cwd(), "data", "db.json");

export interface Volunteer {
  id: number;
  name: string;
  phone: string;
  email?: string;
  age?: number;
  location: string;
  bio: string;
  yearsExperience: number;
  eventsCompleted: number;
  skills: string[];
  availability: "available" | "unavailable";
  verified: boolean;
  profileImage: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Experience {
  id: number;
  volunteerId: number;
  eventName: string;
  eventType: string;
  role: string;
  year: number;
  description: string;
  images: string[];
}

export interface CompanyRequest {
  id: number;
  companyName: string;
  contactPerson: string;
  phone: string;
  email: string;
  eventName: string;
  eventType: string;
  eventDate: string;
  location: string;
  volunteersRequired: number;
  requiredSkills: string[];
  additionalRequirements: string;
  status: "pending" | "reviewed" | "completed";
  createdAt: string;
}

export interface UpcomingEvent {
  id: number;
  title: string;
  category: string;
  date: string;
  city: string;
  posterUrl: string;
  stipend: string;
  rolesNeeded: string[];
  vacancies: number;
  appliedCount: number;
  organizer: string;
  description: string;
}

interface Database {
  volunteers: Volunteer[];
  experiences: Experience[];
  companyRequests: CompanyRequest[];
  upcomingEvents?: UpcomingEvent[];
  nextIds: {
    volunteers: number;
    experiences: number;
    companyRequests: number;
    upcomingEvents?: number;
  };
}

function getDefaultDb(): Database {
  return {
    volunteers: [],
    experiences: [],
    companyRequests: [],
    upcomingEvents: [],
    nextIds: {
      volunteers: 1,
      experiences: 1,
      companyRequests: 1,
      upcomingEvents: 1,
    },
  };
}

function ensureDbFile(): void {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify(getDefaultDb(), null, 2));
  }
}

function readDb(): Database {
  ensureDbFile();
  const raw = fs.readFileSync(DB_PATH, "utf-8");
  return JSON.parse(raw);
}

function writeDb(data: Database): void {
  ensureDbFile();
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

// ============== VOLUNTEERS ==============

export function getAllVolunteers(): Volunteer[] {
  const db = readDb();
  return db.volunteers;
}

export function getVolunteerById(id: number): Volunteer | undefined {
  const db = readDb();
  return db.volunteers.find((v) => v.id === id);
}

export function createVolunteer(data: Omit<Volunteer, "id" | "createdAt" | "updatedAt">): Volunteer {
  const db = readDb();
  const volunteer: Volunteer = {
    ...data,
    id: db.nextIds.volunteers++,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  db.volunteers.push(volunteer);
  writeDb(db);
  return volunteer;
}

export function updateVolunteer(id: number, data: Partial<Volunteer>): Volunteer | null {
  const db = readDb();
  const index = db.volunteers.findIndex((v) => v.id === id);
  if (index === -1) return null;
  db.volunteers[index] = {
    ...db.volunteers[index],
    ...data,
    id, // ensure id doesn't change
    updatedAt: new Date().toISOString(),
  };
  writeDb(db);
  return db.volunteers[index];
}

export function deleteVolunteer(id: number): boolean {
  const db = readDb();
  const initialLength = db.volunteers.length;
  db.volunteers = db.volunteers.filter((v) => v.id !== id);
  // Also delete associated experiences
  db.experiences = db.experiences.filter((e) => e.volunteerId !== id);
  writeDb(db);
  return db.volunteers.length < initialLength;
}

export function searchVolunteers(params: {
  search?: string;
  location?: string;
  skill?: string;
  minExperience?: number;
  verified?: boolean;
  availability?: string;
}): Volunteer[] {
  let volunteers = getAllVolunteers();

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
      (v) => (v.availability || "available").toLowerCase() === avail
    );
  }

  return volunteers;
}

// ============== EXPERIENCES ==============

export function getExperiencesByVolunteerId(volunteerId: number): Experience[] {
  const db = readDb();
  return db.experiences.filter((e) => e.volunteerId === volunteerId);
}

export function createExperience(data: Omit<Experience, "id">): Experience {
  const db = readDb();
  const experience: Experience = {
    ...data,
    id: db.nextIds.experiences++,
  };
  db.experiences.push(experience);
  writeDb(db);
  return experience;
}

export function updateExperience(id: number, data: Partial<Experience>): Experience | null {
  const db = readDb();
  const index = db.experiences.findIndex((e) => e.id === id);
  if (index === -1) return null;
  db.experiences[index] = {
    ...db.experiences[index],
    ...data,
    id,
  };
  writeDb(db);
  return db.experiences[index];
}

export function deleteExperience(id: number): boolean {
  const db = readDb();
  const initialLength = db.experiences.length;
  db.experiences = db.experiences.filter((e) => e.id !== id);
  writeDb(db);
  return db.experiences.length < initialLength;
}

// ============== COMPANY REQUESTS ==============

export function getAllRequests(): CompanyRequest[] {
  const db = readDb();
  return db.companyRequests;
}

export function getRequestById(id: number): CompanyRequest | undefined {
  const db = readDb();
  return db.companyRequests.find((r) => r.id === id);
}

export function createRequest(data: Omit<CompanyRequest, "id" | "createdAt" | "status">): CompanyRequest {
  const db = readDb();
  const request: CompanyRequest = {
    ...data,
    id: db.nextIds.companyRequests++,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  db.companyRequests.push(request);
  writeDb(db);
  return request;
}

export function updateRequestStatus(id: number, status: CompanyRequest["status"]): CompanyRequest | null {
  const db = readDb();
  const index = db.companyRequests.findIndex((r) => r.id === id);
  if (index === -1) return null;
  db.companyRequests[index].status = status;
  writeDb(db);
  return db.companyRequests[index];
}

export function deleteRequest(id: number): boolean {
  const db = readDb();
  const initialLength = db.companyRequests.length;
  db.companyRequests = db.companyRequests.filter((r) => r.id !== id);
  writeDb(db);
  return db.companyRequests.length < initialLength;
}

// ============== STATS ==============

export function getStats() {
  const db = readDb();
  return {
    totalVolunteers: db.volunteers.length,
    verifiedVolunteers: db.volunteers.filter((v) => v.verified).length,
    pendingRequests: db.companyRequests.filter((r) => r.status === "pending").length,
    reviewedRequests: db.companyRequests.filter((r) => r.status === "reviewed").length,
    completedRequests: db.companyRequests.filter((r) => r.status === "completed").length,
  };
}

// ============== UPCOMING EVENTS ==============

export function getAllUpcomingEvents(): UpcomingEvent[] {
  const db = readDb();
  return db.upcomingEvents || [];
}

export function getUpcomingEventById(id: number): UpcomingEvent | undefined {
  const db = readDb();
  return (db.upcomingEvents || []).find((e) => e.id === id);
}

export function createUpcomingEvent(data: Omit<UpcomingEvent, "id">): UpcomingEvent {
  const db = readDb();
  if (!db.upcomingEvents) db.upcomingEvents = [];
  if (!db.nextIds.upcomingEvents) db.nextIds.upcomingEvents = 1;

  const newEvent: UpcomingEvent = {
    ...data,
    id: db.nextIds.upcomingEvents++,
  };
  db.upcomingEvents.push(newEvent);
  writeDb(db);
  return newEvent;
}

export function updateUpcomingEvent(id: number, data: Partial<Omit<UpcomingEvent, "id">>): UpcomingEvent | null {
  const db = readDb();
  if (!db.upcomingEvents) return null;
  const index = db.upcomingEvents.findIndex((e) => e.id === id);
  if (index === -1) return null;

  db.upcomingEvents[index] = {
    ...db.upcomingEvents[index],
    ...data,
  };
  writeDb(db);
  return db.upcomingEvents[index];
}

export function deleteUpcomingEvent(id: number): boolean {
  const db = readDb();
  if (!db.upcomingEvents) return false;
  const initialLength = db.upcomingEvents.length;
  db.upcomingEvents = db.upcomingEvents.filter((e) => e.id !== id);
  writeDb(db);
  return db.upcomingEvents.length < initialLength;
}


