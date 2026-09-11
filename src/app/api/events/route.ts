import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getAllUpcomingEvents, createUpcomingEvent } from '@/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const events = await getAllUpcomingEvents();
    return NextResponse.json(events, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'CDN-Cache-Control': 'no-store',
        'Vercel-CDN-Cache-Control': 'no-store',
      },
    });
  } catch (err: any) {
    console.error('Failed to get upcoming events:', err);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, category, date, city, posterUrl, payout, rolesNeeded, vacancies, organizer, description } = body;

    if (!title || !category || !date || !city) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const event = await createUpcomingEvent({
      title,
      category,
      date,
      city,
      posterUrl: posterUrl || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
      payout: payout || '₹2,000 / Day + Meals',
      rolesNeeded: Array.isArray(rolesNeeded) ? rolesNeeded : rolesNeeded ? rolesNeeded.split(',').map((s: string) => s.trim()) : ['Event Support'],
      vacancies: Number(vacancies) || 20,
      appliedCount: 0,
      organizer: organizer || 'Event Production Team',
      description: description || '',
    });

    revalidatePath('/');
    revalidatePath('/admin/events');

    return NextResponse.json(event, { status: 201 });
  } catch (err: any) {
    console.error('Failed to create event:', err);
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
  }
}
