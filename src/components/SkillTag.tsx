import React from 'react';

interface SkillTagProps {
  skill: string;
  variant?: 'default' | 'small';
}

export default function SkillTag({ skill, variant = 'default' }: SkillTagProps) {
  const isSmall = variant === 'small';
  
  return (
    <span 
      className={`inline-flex items-center justify-center rounded-full bg-blue-50 text-blue-700 font-medium whitespace-nowrap
        ${isSmall ? 'px-2 py-1 text-xs' : 'px-3 py-1.5 text-sm'}
      `}
    >
      {skill}
    </span>
  );
}
