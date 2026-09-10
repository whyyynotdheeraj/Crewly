import React from 'react';

interface VerifiedBadgeProps {
  size?: 'sm' | 'md' | 'lg';
}

export default function VerifiedBadge({ size = 'md' }: VerifiedBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs h-3.5 w-3.5 gap-1',
    md: 'text-sm h-4 w-4 gap-1.5',
    lg: 'text-base h-5 w-5 gap-2',
  };

  const iconSizeClass = {
    sm: 'h-3.5 w-3.5',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  return (
    <div className={`inline-flex items-center text-emerald-600 font-medium ${sizeClasses[size].split(' ')[0]} ${sizeClasses[size].split(' ')[3]}`}>
      <svg 
        className={iconSizeClass[size]} 
        fill="currentColor" 
        viewBox="0 0 20 20" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
      <span>Verified</span>
    </div>
  );
}
