'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.05)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="group flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-[2px] shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
                  <span className="text-xl font-black bg-gradient-to-r from-indigo-600 to-pink-500 bg-clip-text text-transparent">
                    C
                  </span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-1.5">
                  Crewly<span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                </span>
                <span className="text-[10px] font-bold tracking-widest uppercase text-indigo-600 -mt-1">
                  Event Crew Network
                </span>
              </div>
            </Link>
          </div>

          {/* Nav Links */}
          <div className="hidden md:flex md:items-center md:space-x-1 bg-slate-100/80 border border-slate-200/80 rounded-full px-4 py-1.5 shadow-inner">
            <Link 
              href="/volunteers" 
              className="text-slate-600 hover:text-indigo-600 px-4 py-1.5 rounded-full text-sm font-semibold transition-all hover:bg-white hover:shadow-sm"
            >
              Browse Volunteers
            </Link>
            <Link 
              href="/companies" 
              className="text-slate-600 hover:text-indigo-600 px-4 py-1.5 rounded-full text-sm font-semibold transition-all hover:bg-white hover:shadow-sm"
            >
              For Event Organizers
            </Link>
          </div>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <Link 
              href="/join" 
              className="text-sm font-bold text-slate-700 hover:text-indigo-600 px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-all shadow-sm hover:border-indigo-300"
            >
              Join as Volunteer
            </Link>
            <Link 
              href="/volunteers" 
              className="text-sm font-bold px-6 py-2.5 rounded-xl btn-premium-gradient flex items-center gap-2"
            >
              <span>Find Crew</span>
              <span>→</span>
            </Link>
          </div>

          {/* Mobile hamburger */}
          <div className="-mr-2 flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="bg-slate-100 rounded-xl p-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-200 focus:outline-none"
            >
              {!isOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white/95 backdrop-blur-2xl px-4 pt-4 pb-6 space-y-3 shadow-xl">
          <Link 
            href="/volunteers" 
            onClick={() => setIsOpen(false)}
            className="text-slate-700 hover:text-indigo-600 block px-3 py-2.5 rounded-lg text-base font-semibold hover:bg-slate-50"
          >
            Browse Volunteers
          </Link>
          <Link 
            href="/companies" 
            onClick={() => setIsOpen(false)}
            className="text-slate-700 hover:text-indigo-600 block px-3 py-2.5 rounded-lg text-base font-semibold hover:bg-slate-50"
          >
            For Event Organizers
          </Link>
          <div className="pt-2 flex flex-col gap-2.5">
            <Link 
              href="/join" 
              onClick={() => setIsOpen(false)}
              className="text-center text-sm font-bold text-slate-700 py-3 rounded-xl border border-slate-200 bg-slate-50"
            >
              Join as Volunteer
            </Link>
            <Link 
              href="/volunteers" 
              onClick={() => setIsOpen(false)}
              className="text-center text-sm font-bold text-white py-3 rounded-xl btn-premium-gradient"
            >
              Find Crew Now
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
