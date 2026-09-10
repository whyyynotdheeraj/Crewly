import React from 'react';
import Link from 'next/link';

interface LogoProps {
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
}

export default function Logo({ variant = 'dark', size = 'md' }: LogoProps) {
  const isDarkBg = variant === 'light'; // when placed on dark backgrounds

  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const textSizes = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  return (
    <Link href="/" className="group inline-flex items-center gap-3 select-none">
      {/* Premium Geometric 3D SVG Monogram */}
      <div className={`relative ${iconSizes[size]} transition-transform duration-300 group-hover:scale-105`}>
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-md"
        >
          <defs>
            <linearGradient id="crewlyGrad1" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#4F46E5" />
              <stop offset="50%" stopColor="#7C3AED" />
              <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>
            <linearGradient id="crewlyGrad2" x1="40" y1="8" x2="8" y2="40" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#06B6D4" />
              <stop offset="100%" stopColor="#6366F1" />
            </linearGradient>
            <filter id="logoGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#6366F1" floodOpacity="0.35" />
            </filter>
          </defs>

          {/* Background Rounded Shield / Tile */}
          <rect x="2" y="2" width="44" height="44" rx="14" fill="url(#crewlyGrad1)" />
          
          {/* Subtle Inner Glass Bevel */}
          <rect x="3" y="3" width="42" height="42" rx="13" stroke="white" strokeOpacity="0.25" strokeWidth="1.5" />

          {/* Modern Stylized Dynamic 'C' + Network Interlock */}
          <path
            d="M29 16C26.5 14 23 14 20 15.5C16.5 17.3 14 21 14 24.5C14 28 16.5 31.7 20 33.5C23.5 35.3 27.5 34.8 30 32.5"
            stroke="white"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Dynamic Connected Node / Crew Beacon */}
          <circle cx="31" cy="16" r="3.5" fill="#38BDF8" />
          <circle cx="31" cy="32" r="3.5" fill="#F43F5E" />
          <circle cx="21" cy="24" r="2.5" fill="white" />
        </svg>
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1">
          <span className={`font-black tracking-tight ${textSizes[size]} ${isDarkBg ? 'text-white' : 'text-slate-900'}`}>
            Crewly
          </span>
          <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
        </div>
        <span className="text-[9px] font-extrabold uppercase tracking-[0.2em] text-indigo-600 -mt-1">
          Event Talent
        </span>
      </div>
    </Link>
  );
}
