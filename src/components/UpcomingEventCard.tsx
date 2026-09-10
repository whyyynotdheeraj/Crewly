import React from 'react';
import Link from 'next/link';
import { UpcomingEvent } from '@/db';

export default function UpcomingEventCard({ event }: { event: UpcomingEvent }) {
  return (
    <div className="bg-white rounded-[2rem] overflow-hidden flex flex-col h-full border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.06)] hover:shadow-[0_20px_35px_-10px_rgba(99,102,241,0.15)] hover:-translate-y-1.5 transition-all duration-300 group">
      {/* Event Poster Image Banner */}
      <div className="relative h-56 w-full overflow-hidden bg-slate-900">
        <img
          src={event.posterUrl}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

        {/* Category Pill Tag */}
        <div className="absolute top-4 left-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/95 backdrop-blur-md text-indigo-700 shadow-sm border border-indigo-100">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-ping"></span>
            {event.category}
          </span>
        </div>

        {/* Vacancies / Spots Left */}
        <div className="absolute top-4 right-4">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-900/80 backdrop-blur-md text-emerald-400 border border-emerald-500/30">
            {event.vacancies} Crew Needed
          </span>
        </div>

        {/* Date & Location Overlay */}
        <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white text-xs font-semibold">
          <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10">
            <svg className="w-3.5 h-3.5 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{event.date}</span>
          </div>

          <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10">
            <svg className="w-3.5 h-3.5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="truncate max-w-[120px]">{event.city.split(',')[0]}</span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 flex flex-col flex-grow bg-white space-y-4">
        <div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Organized by {event.organizer}
          </span>
          <h3 className="text-xl font-black text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors mt-0.5">
            {event.title}
          </h3>
          <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
            {event.description}
          </p>
        </div>

        {/* Perks & Stipend Bar */}
        <div className="p-3 rounded-2xl bg-gradient-to-r from-indigo-50/80 via-purple-50/80 to-pink-50/80 border border-indigo-100/80 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-bold">Stipend & Perks</span>
          <span className="font-black text-indigo-700">{event.stipend}</span>
        </div>

        {/* Roles Needed Chips */}
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2">
            Roles Open
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
            ⚡ {event.appliedCount} volunteers applied recently
          </span>
        </div>
      </div>
    </div>
  );
}
