import React from 'react';
import Link from 'next/link';

interface LogoProps {
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
}

export default function Logo({ variant = 'dark', size = 'md' }: LogoProps) {
  const isLight = variant === 'light'; // on dark backgrounds

  // Scaled dimensions
  const dimensions = {
    sm: { width: 140, height: 38 },
    md: { width: 170, height: 46 },
    lg: { width: 210, height: 56 },
  };

  const dim = dimensions[size];

  return (
    <Link href="/" className="group inline-flex items-center select-none" aria-label="Crewly Home">
      {/* 
        Amazon-Style Typographic Vector Logo:
        Clean custom wordmark with an iconic upward curved "stage swoop" arrow 
        connecting the 'C' across to the 'y' (symbolizing "Crew to You" with an energetic smile).
      */}
      <svg
        width={dim.width}
        height={dim.height}
        viewBox="0 0 180 50"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transition-transform duration-300 group-hover:scale-105 overflow-visible"
      >
        <defs>
          {/* Vibrant Gradient for the Swoop Smile Arrow */}
          <linearGradient id="crewlySwoopGrad" x1="18" y1="36" x2="162" y2="44" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#4F46E5" />
            <stop offset="45%" stopColor="#7C3AED" />
            <stop offset="85%" stopColor="#EC4899" />
            <stop offset="100%" stopColor="#F43F5E" />
          </linearGradient>

          {/* Glow filter for hover / accent */}
          <filter id="swoopGlow" x="-10%" y="-10%" width="120%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#EC4899" floodOpacity="0.4" />
          </filter>
        </defs>

        {/* Wordmark Text */}
        <text
          x="4"
          y="31"
          fontFamily="'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          fontWeight="900"
          fontSize="34"
          letterSpacing="-0.04em"
          fill={isLight ? '#FFFFFF' : '#0F172A'}
        >
          crewl<tspan fill={isLight ? '#E0E7FF' : '#4F46E5'}>y</tspan>
        </text>

        {/* Live Stage Node over the 'l' & 'w' */}
        <circle cx="102" cy="11" r="3" fill="#EC4899" />

        {/* 
          The Amazon-Style Swoop:
          Curves gracefully under the wordmark from beneath the 'C' to the bottom curve of 'y',
          ending with an arrow head that curves upward into a smile.
        */}
        <path
          d="M16 38.5 C 50 49, 115 48, 154 36.5"
          stroke="url(#crewlySwoopGrad)"
          strokeWidth="3.8"
          strokeLinecap="round"
          filter="url(#swoopGlow)"
        />

        {/* Dynamic Arrowhead pointing up at the tail of 'y' */}
        <path
          d="M147 38.5 L 157 35.8 L 155 45 Z"
          fill="#F43F5E"
          strokeLinejoin="round"
        />

        {/* Tagline pill text */}
        <text
          x="108"
          y="8"
          fontFamily="'Inter', sans-serif"
          fontWeight="800"
          fontSize="7"
          letterSpacing="0.18em"
          fill={isLight ? '#38BDF8' : '#6366F1'}
        >
          EVENT CREW
        </text>
      </svg>
    </Link>
  );
}
