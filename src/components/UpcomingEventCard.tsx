'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { UpcomingEvent } from '@/db';

const CATEGORY_FALLBACKS: Record<string, string> = {
  'Comedy & Music Fest': 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
  'Live Concert & Fusion Fest': 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80',
  'Cultural & Arts Summit': 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80',
  'Trade Fair & Expo': 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
  'Live Comedy Showcase': 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?auto=format&fit=crop&w=1200&q=80',
};

const DEFAULT_POSTER = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80';

export default function UpcomingEventCard({ event }: { event: UpcomingEvent }) {
  const [imgSrc, setImgSrc] = useState(event.posterUrl || CATEGORY_FALLBACKS[event.category] || DEFAULT_POSTER);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(CATEGORY_FALLBACKS[event.category] || DEFAULT_POSTER);
    }
  };

  return (
    <div className="bg-white rounded-[2rem] overflow-hidden flex flex-col h-full border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.06)] hover:shadow-[0_20px_35px_-10px_rgba(99,102,241,0.18)] hover:-translate-y-2 transition-all duration-300 group">
      
      {/* Event Poster Image Banner */}
      <div className="relative h-60 w-full overflow-hidden bg-gradient-to-br from-indigo-900 via-slate-800 to-purple-900">
        <img
          src={imgSrc}
          alt={event.title}
          onError={handleError}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

        {/* BookMyShow Live Tag */}
        <div className="absolute top-3.5 left-3.5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-[#E63946] text-white shadow-md">
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M4 6h16v12H4zM2 4v16h20V4H2zm4 4h4v2H6V8zm0 4h8v2H6v-2zm10-4h2v2h-2V8z" />
            </svg>
            <span>BookMyShow Gig</span>
          </span>
        </div>

        {/* Category Pill Tag */}
        <div className="absolute top-3.5 right-3.5">
          <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-slate-900/85 backdrop-blur-md text-emerald-400 border border-emerald-500/30">
            {event.vacancies} Openings
          </span>
        </div>

        {/* Date & Jaipur Venue Banner Overlay */}
        <div className="absolute bottom-3 left-3.5 right-3.5 space-y-1.5 text-white">
          <div className="flex items-center justify-between text-xs font-semibold">
            <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10">
              <svg className="w-3.5 h-3.5 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{event.date}</span>
            </div>

            <span className="text-[10px] uppercase font-bold text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-300/30">
              {event.category.split('&')[0]}
            </span>
          </div>

          <div className="flex items-center gap-1.5 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 text-xs">
            <svg className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="truncate font-semibold text-slate-200">{event.city}</span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 flex flex-col flex-grow bg-white space-y-4">
        <div>
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
            Organized by {event.organizer}
          </span>
          <h3 className="text-xl font-black text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors mt-0.5 line-clamp-2">
            {event.title}
          </h3>
          <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
            {event.description}
          </p>
        </div>

        {/* Perks & Stipend Bar */}
        <div className="p-3 rounded-2xl bg-gradient-to-r from-indigo-50/90 via-purple-50/90 to-pink-50/90 border border-indigo-100 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-bold">Stipend & Perks</span>
          <span className="font-black text-indigo-700 text-xs sm:text-sm">{event.stipend}</span>
        </div>

        {/* Roles Needed Chips */}
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2">
            Roles Needed on Ground
          </span>
          <div className="flex flex-wrap gap-1.5">
            {event.rolesNeeded.map((role, idx) => (
              <span
                key={idx}
                className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-semibold"
              >
                {role}
              </span>
            ))}
          </div>
        </div>

        {/* Apply CTA Button */}
        <div className="pt-2 mt-auto">
          <Link
            href={`/join?event=${encodeURIComponent(event.title)}&roles=${encodeURIComponent(event.rolesNeeded.join(','))}`}
            className="w-full py-3.5 px-4 rounded-xl text-center text-xs font-bold text-white btn-premium-gradient flex items-center justify-center gap-2 shadow-md"
          >
            <span>Apply for this Gig</span>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
          <span className="text-[10px] text-slate-400 text-center block mt-2 font-medium">
            ⚡ {event.appliedCount} Jaipur volunteers applied
          </span>
        </div>
      </div>
    </div>
  );
}
