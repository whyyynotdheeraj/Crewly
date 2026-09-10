import React from 'react';
import Link from 'next/link';
import { getInitials, generateAvatarColor } from '@/lib/utils';
import VerifiedBadge from './VerifiedBadge';

interface Volunteer {
  id: string;
  name: string;
  location: string;
  yearsExperience: number;
  eventsCompleted: number;
  skills: string[];
  verified: boolean;
  profileImage: string | null;
}

export default function VolunteerCard({ volunteer }: { volunteer: Volunteer }) {
  const visibleSkills = volunteer.skills.slice(0, 3);
  const remainingSkills = volunteer.skills.length - 3;

  return (
    <div className="bg-white rounded-[1.75rem] overflow-hidden flex flex-col h-full border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.06)] hover:shadow-[0_20px_35px_-10px_rgba(99,102,241,0.15)] hover:-translate-y-1.5 transition-all duration-300 group">
      
      {/* Visual Header / Avatar Photo */}
      <div className="h-48 w-full bg-slate-100 relative overflow-hidden">
        {volunteer.profileImage ? (
          <img 
            src={volunteer.profileImage} 
            alt={volunteer.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div 
            className="w-full h-full flex items-center justify-center text-4xl font-extrabold text-white"
            style={{ backgroundColor: generateAvatarColor(volunteer.name) }}
          >
            {getInitials(volunteer.name)}
          </div>
        )}

        {/* Soft bottom vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />

        {/* Verified Badge Tag */}
        <div className="absolute top-3 left-3">
          {volunteer.verified ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/95 backdrop-blur-md text-emerald-700 shadow-sm border border-emerald-100">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Verified Crew
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/95 backdrop-blur-md text-indigo-700 shadow-sm border border-indigo-100">
              New Volunteer
            </span>
          )}
        </div>

        {/* Location Pill */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/90 backdrop-blur-md text-slate-800 text-xs font-bold shadow-sm">
          <svg className="w-3.5 h-3.5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
          {volunteer.location}
        </div>
      </div>
      
      {/* Content Section */}
      <div className="p-5 flex flex-col flex-grow bg-white">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-1.5 group-hover:text-indigo-600 transition-colors">
            {volunteer.name}
            {volunteer.verified && <VerifiedBadge size="sm" />}
          </h3>
        </div>
        
        {/* Metric Badges */}
        <div className="grid grid-cols-2 gap-2 text-xs mb-4 p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-slate-700">
          <div>
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Experience</span>
            <span className="font-extrabold text-slate-900">{volunteer.yearsExperience}+ Years</span>
          </div>
          <div className="border-l border-slate-200 pl-3">
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Events</span>
            <span className="font-extrabold text-indigo-600">{volunteer.eventsCompleted} Events</span>
          </div>
        </div>
        
        {/* Skills Chips */}
        <div className="flex flex-wrap gap-1.5 mb-5 flex-grow">
          {visibleSkills.map((skill, index) => (
            <span 
              key={index} 
              className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-semibold"
            >
              {skill}
            </span>
          ))}
          {remainingSkills > 0 && (
            <span className="text-xs px-2 py-1 rounded-lg bg-indigo-50 text-indigo-600 font-bold border border-indigo-100">
              +{remainingSkills}
            </span>
          )}
        </div>
        
        {/* Action Button */}
        <Link 
          href={`/volunteers/${volunteer.id}`}
          className="w-full py-2.5 px-4 rounded-xl text-center text-xs font-bold text-slate-700 bg-slate-100 hover:bg-gradient-to-r hover:from-indigo-600 hover:to-pink-600 hover:text-white transition-all mt-auto flex items-center justify-center gap-1.5 shadow-sm"
        >
          <span>View Profile</span>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
