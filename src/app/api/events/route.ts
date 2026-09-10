import { NextRequest, NextResponse } from 'next/server';
import { getAllUpcomingEvents, createUpcomingEvent } from '@/db';

export async function GET() {
  try {
    const events = getAllUpcomingEvents();
    return NextResponse.json(events);
  } catch (err: any) {
    console.error('Failed to get upcoming events:', err);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, category, date, city, posterUrl, stipend, rolesNeeded, vacancies, organizer, description } = body;

    if (!title || !category || !date || !city) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const event = createUpcomingEvent({
      title,
      category,
      date,
      city,
      posterUrl: posterUrl || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
      stipend: stipend || '₹2,000 / Day + Meals',
      rolesNeeded: Array.isArray(rolesNeeded) ? rolesNeeded : rolesNeeded ? rolesNeeded.split(',').map((s: string) => s.trim()) : ['Event Support'],
      vacancies: Number(vacancies) || 20,
      appliedCount: 0,
      organizer: organizer || 'Event Production Team',
      description: description || '',
    });

    return NextResponse.json(event, { status: 201 });
  } catch (err: any) {
    console.error('Failed to create event:', err);
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
  }
}
