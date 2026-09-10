'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-[#0b0f19]/80 backdrop-blur-xl border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo with 3D glowing badge */}
          <div className="flex items-center">
            <Link href="/" className="group flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-400 p-[2px] shadow-[0_0_20px_rgba(59,130,246,0.6)] group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-[#0b0f19] rounded-[10px] flex items-center justify-center">
                  <span className="text-xl font-black bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                    C
                  </span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tight text-white flex items-center gap-1">
                  Crewly<span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                </span>
                <span className="text-[10px] font-medium tracking-widest uppercase text-blue-400 -mt-1">
                  Event Crew Network
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex md:items-center md:space-x-1 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 backdrop-blur-md shadow-inner">
            <Link 
              href="/volunteers" 
              className="text-gray-300 hover:text-white px-4 py-2 rounded-full text-sm font-medium transition-all hover:bg-white/10"
            >
              Explore Crew
            </Link>
            <Link 
              href="/companies" 
              className="text-gray-300 hover:text-white px-4 py-2 rounded-full text-sm font-medium transition-all hover:bg-white/10"
            >
              For Companies
            </Link>
          </div>

          {/* 3D Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              href="/join" 
              className="text-sm font-semibold text-gray-300 hover:text-white px-5 py-2.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 transition-all hover:border-cyan-500/50 shadow-sm"
            >
              Join as Volunteer
            </Link>
            <Link 
              href="/volunteers" 
              className="text-sm font-semibold text-white px-5 py-2.5 rounded-xl btn-3d-primary"
            >
              Find Volunteers ✨
            </Link>
          </div>

          {/* Mobile hamburger */}
          <div className="-mr-2 flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="bg-white/5 border border-white/10 rounded-xl p-2.5 text-gray-300 hover:text-white hover:bg-white/10 focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#0b0f19]/95 backdrop-blur-2xl px-4 pt-4 pb-6 space-y-3">
          <Link 
            href="/volunteers" 
            onClick={() => setIsOpen(false)}
            className="text-gray-300 hover:text-white block px-3 py-2.5 rounded-lg text-base font-medium hover:bg-white/5"
          >
            Explore Crew
          </Link>
          <Link 
            href="/companies" 
            onClick={() => setIsOpen(false)}
            className="text-gray-300 hover:text-white block px-3 py-2.5 rounded-lg text-base font-medium hover:bg-white/5"
          >
            For Companies
          </Link>
          <div className="pt-2 flex flex-col gap-3">
            <Link 
              href="/join" 
              onClick={() => setIsOpen(false)}
              className="text-center text-sm font-semibold text-gray-200 py-3 rounded-xl border border-white/15 bg-white/5"
            >
              Join as Volunteer
            </Link>
            <Link 
              href="/volunteers" 
              onClick={() => setIsOpen(false)}
              className="text-center text-sm font-semibold text-white py-3 rounded-xl btn-3d-primary"
            >
              Find Volunteers ✨
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
