import { NextRequest, NextResponse } from 'next/server';
import { getUpcomingEventById, updateUpcomingEvent, deleteUpcomingEvent } from '@/db';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const event = getUpcomingEventById(Number(id));
    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }
    return NextResponse.json(event);
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    if (body.rolesNeeded && typeof body.rolesNeeded === 'string') {
      body.rolesNeeded = body.rolesNeeded.split(',').map((s: string) => s.trim());
    }
    if (body.vacancies) {
      body.vacancies = Number(body.vacancies);
    }
    if (body.appliedCount) {
      body.appliedCount = Number(body.appliedCount);
    }

    const updated = updateUpcomingEvent(Number(id), body);
    if (!updated) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update event' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const success = deleteUpcomingEvent(Number(id));
    if (!success) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 });
  }
}
