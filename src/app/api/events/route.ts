import { NextResponse } from 'next/server';
import { getAllUpcomingEvents } from '@/db';

export async function GET() {
  try {
    const events = getAllUpcomingEvents();
    return NextResponse.json(events);
  } catch (err: any) {
    console.error('Failed to get upcoming events:', err);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}
