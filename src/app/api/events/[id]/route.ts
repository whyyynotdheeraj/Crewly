import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getUpcomingEventById, updateUpcomingEvent, deleteUpcomingEvent } from '@/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const event = await getUpcomingEventById(Number(id));
    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }
    return NextResponse.json(event, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      },
    });
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

    const updated = await updateUpcomingEvent(Number(id), body);
    if (!updated) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    revalidatePath('/');
    revalidatePath('/admin/events');

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
    const success = await deleteUpcomingEvent(Number(id));
    if (!success) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    revalidatePath('/');
    revalidatePath('/admin/events');

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 });
  }
}

