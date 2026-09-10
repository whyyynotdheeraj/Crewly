import React from 'react';

export interface Experience {
  eventName: string;
  eventType?: string;
  role: string;
  year: number | string;
  description: string;
}

export default function ExperienceCard({ experience }: { experience: Experience }) {
  return (
    <div className="bg-white p-5 rounded-lg border border-gray-100 border-l-4 border-l-blue-600 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
        <div>
          <h4 className="text-lg font-semibold text-gray-900">{experience.eventName}</h4>
          <div className="flex items-center gap-2 mt-1">
            <span className="bg-gray-100 text-gray-700 px-2.5 py-0.5 rounded-full text-sm font-medium">
              {experience.role}
            </span>
            {experience.eventType && (
              <span className="text-sm text-gray-500 border-l pl-2 border-gray-300">
                {experience.eventType}
              </span>
            )}
          </div>
        </div>
        <div className="text-gray-500 font-medium text-sm sm:text-base whitespace-nowrap">
          {experience.year}
        </div>
      </div>
      <p className="text-gray-600 text-sm md:text-base leading-relaxed">
        {experience.description}
      </p>
    </div>
  );
}
