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
    <div className="glass-panel rounded-3xl overflow-hidden flex flex-col h-full border border-white/10 hover:border-blue-500/50 transform-card-3d group">
      
      {/* Card Visual Header / Photo */}
      <div className="h-48 w-full bg-gradient-to-t from-[#0b0f19] to-gray-800 relative overflow-hidden">
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

        {/* Gradient shadow overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d1322] via-transparent to-black/20" />

        {/* Floating status tag */}
        <div className="absolute top-3 left-3">
          {volunteer.verified ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#0b0f19]/80 backdrop-blur-md text-emerald-400 border border-emerald-500/30 shadow-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Verified Crew
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#0b0f19]/80 backdrop-blur-md text-cyan-400 border border-cyan-500/30">
              New Volunteer
            </span>
          )}
        </div>

        {/* Floating Location Pill */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-gray-300 text-xs font-medium border border-white/10">
          <svg className="w-3.5 h-3.5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
          {volunteer.location}
        </div>
      </div>
      
      {/* Content Section */}
      <div className="p-5 flex flex-col flex-grow bg-[#0d1322]/80">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-bold text-white flex items-center gap-2 group-hover:text-cyan-300 transition-colors">
            {volunteer.name}
            {volunteer.verified && <VerifiedBadge size="sm" />}
          </h3>
        </div>
        
        {/* Metric Badges */}
        <div className="grid grid-cols-2 gap-2 text-xs mb-4 p-2.5 rounded-2xl bg-white/5 border border-white/5 text-gray-300">
          <div>
            <span className="text-gray-500 text-[10px] uppercase font-bold block">Experience</span>
            <span className="font-bold text-white">{volunteer.yearsExperience}+ Years</span>
          </div>
          <div className="border-l border-white/10 pl-3">
            <span className="text-gray-500 text-[10px] uppercase font-bold block">Events</span>
            <span className="font-bold text-cyan-400">{volunteer.eventsCompleted} Done</span>
          </div>
        </div>
        
        {/* Skills Chips */}
        <div className="flex flex-wrap gap-1.5 mb-6 flex-grow">
          {visibleSkills.map((skill, index) => (
            <span 
              key={index} 
              className="text-xs px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-gray-300 font-medium"
            >
              {skill}
            </span>
          ))}
          {remainingSkills > 0 && (
            <span className="text-xs px-2 py-1 rounded-lg bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-semibold">
              +{remainingSkills}
            </span>
          )}
        </div>
        
        {/* 3D Profile Button */}
        <Link 
          href={`/volunteers/${volunteer.id}`}
          className="w-full py-3 px-4 rounded-xl text-center text-sm font-bold text-white btn-3d-primary mt-auto flex items-center justify-center gap-2"
        >
          <span>View 3D Profile</span>
          <span className="text-cyan-200">→</span>
        </Link>
      </div>
    </div>
  );
}
