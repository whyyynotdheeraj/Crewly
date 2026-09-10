import React from 'react';
import Link from 'next/link';
import { getInitials, generateAvatarColor } from '@/lib/utils';
import VerifiedBadge from './VerifiedBadge';
import SkillTag from './SkillTag';

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
  const visibleSkills = volunteer.skills.slice(0, 4);
  const remainingSkills = volunteer.skills.length - 4;

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition duration-300 overflow-hidden flex flex-col h-full border border-gray-100">
      <div className="h-48 w-full bg-gray-100 relative">
        {volunteer.profileImage ? (
          <img 
            src={volunteer.profileImage} 
            alt={volunteer.name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div 
            className="w-full h-full flex items-center justify-center text-4xl font-semibold text-white"
            style={{ backgroundColor: generateAvatarColor(volunteer.name) }}
          >
            {getInitials(volunteer.name)}
          </div>
        )}
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            {volunteer.name}
            {volunteer.verified && <VerifiedBadge size="sm" />}
          </h3>
        </div>
        
        <div className="flex items-center text-gray-500 text-sm mb-4">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
          {volunteer.location}
        </div>
        
        <div className="flex items-center gap-4 text-sm mb-4 border-y border-gray-100 py-3">
          <div className="text-gray-700">
            <span className="font-semibold">{volunteer.yearsExperience}+</span> Years Experience
          </div>
          <div className="text-gray-700 border-l border-gray-200 pl-4">
            <span className="font-semibold">{volunteer.eventsCompleted}</span> Events Completed
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-6 flex-grow">
          {visibleSkills.map((skill, index) => (
            <SkillTag key={index} skill={skill} variant="small" />
          ))}
          {remainingSkills > 0 && (
            <span className="px-2 py-1 rounded-full bg-gray-50 text-gray-600 text-xs border border-gray-200">
              +{remainingSkills} more
            </span>
          )}
        </div>
        
        <Link 
          href={`/volunteers/${volunteer.id}`}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg w-full text-center transition-colors mt-auto"
        >
          View Profile
        </Link>
      </div>
    </div>
  );
}
