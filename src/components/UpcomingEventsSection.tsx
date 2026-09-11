'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { UpcomingEvent } from '@/db';
import UpcomingEventCard from './UpcomingEventCard';

export default function UpcomingEventsSection({ initialEvents }: { initialEvents: UpcomingEvent[] }) {
  const [events, setEvents] = useState<UpcomingEvent[]>(initialEvents);

  // Sync with API on mount and window focus to guarantee admin changes are immediately visible
  useEffect(() => {
    const syncEvents = async () => {
      try {
        const res = await fetch(`/api/events?t=${Date.now()}`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
          },
        });
        if (res.ok) {
          const freshData = await res.json();
          if (Array.isArray(freshData) && freshData.length > 0) {
            setEvents(freshData);
          }
        }
      } catch (err) {
        console.error('Live event sync error:', err);
      }
    };

    syncEvents();

    const handleFocus = () => {
      syncEvents();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  return (
    <section id="upcoming-events" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 mb-20">
      <div className="bg-white/90 backdrop-blur-xl rounded-[2.5rem] p-8 sm:p-12 shadow-3d-xl border border-slate-200/80">
        {/* Header with Live Pulse */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-50 border border-red-100 text-red-700 text-xs font-bold uppercase tracking-wider mb-3">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
              <span>Live BookMyShow Jaipur Events & Gigs</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Upcoming Jaipur Events Hiring Crew
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-1.5 max-w-xl">
              Real upcoming festivals, comedy specials, and summits at Birla Auditorium, JECC Sitapura, RIC, and Clarks Amer. Apply for volunteer passes & daily payouts.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <Link
              href="/join"
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white btn-premium-gradient shadow-md flex items-center gap-1.5"
            >
              <span>Register as Volunteer</span>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Event Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((evt) => (
            <UpcomingEventCard key={evt.id} event={evt} />
          ))}
        </div>

        {/* Bottom Organizer Banner Note */}
        <div className="mt-10 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-indigo-50/80 via-purple-50/80 to-pink-50/80 border border-indigo-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3 text-slate-700">
            <span className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-sm flex-shrink-0">
              +
            </span>
            <span className="font-semibold">
              Organizing an event or festival? List your volunteer requirements and receive verified applicants instantly.
            </span>
          </div>
          <Link
            href="/request"
            className="px-4 py-2 rounded-xl bg-white border border-indigo-200 text-indigo-700 hover:bg-indigo-50 font-bold whitespace-nowrap shadow-xs"
          >
            Post Your Event →
          </Link>
        </div>
      </div>
    </section>
  );
}
