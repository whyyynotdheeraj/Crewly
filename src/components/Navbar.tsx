'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Logo from './Logo';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [volUser, setVolUser] = useState<any>(null);

  React.useEffect(() => {
    fetch('/api/volunteer-auth/session')
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setVolUser(data.user);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-white/85 backdrop-blur-xl border-b border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.04)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Premium Logo */}
          <div className="flex items-center">
            <Logo variant="dark" size="md" />
          </div>

          {/* Nav Links */}
          <div className="hidden md:flex md:items-center md:space-x-1 bg-slate-100/90 border border-slate-200/80 rounded-full px-3 py-1.5 shadow-inner">
            <Link 
              href="/" 
              className="text-slate-600 hover:text-indigo-600 px-3 py-1.5 rounded-full text-sm font-semibold transition-all hover:bg-white hover:shadow-xs flex items-center gap-1.5"
            >
              <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span>Home</span>
            </Link>
            <Link 
              href="/#upcoming-events" 
              className="text-slate-600 hover:text-indigo-600 px-3.5 py-1.5 rounded-full text-sm font-semibold transition-all hover:bg-white hover:shadow-xs flex items-center gap-1.5"
            >
              <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse"></span>
              <span>Upcoming Gigs</span>
            </Link>
            <Link 
              href="/companies" 
              className="text-slate-600 hover:text-indigo-600 px-3.5 py-1.5 rounded-full text-sm font-semibold transition-all hover:bg-white hover:shadow-xs"
            >
              For Event Organizers
            </Link>
          </div>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {volUser ? (
              <Link 
                href="/profile" 
                className="text-sm font-bold text-slate-800 hover:text-indigo-600 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-all shadow-xs hover:border-indigo-300 flex items-center gap-2"
              >
                {volUser.picture ? (
                  <img src={volUser.picture} alt="Profile" className="w-6 h-6 rounded-full object-cover border border-slate-200" />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center font-black">
                    {(volUser.name || volUser.email)[0].toUpperCase()}
                  </div>
                )}
                <span>My Profile</span>
              </Link>
            ) : (
              <Link 
                href="/join" 
                className="text-sm font-bold text-slate-700 hover:text-indigo-600 px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-all shadow-xs hover:border-indigo-300 flex items-center gap-1.5"
              >
                <span>Join as Volunteer</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-indigo-50 text-indigo-600">
                  Free
                </span>
              </Link>
            )}
            <Link 
              href="/request" 
              className="text-sm font-bold px-6 py-2.5 rounded-xl btn-premium-gradient flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
            >
              <span>Request for an Event</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
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
            href="/" 
            onClick={() => setIsOpen(false)}
            className="text-slate-700 hover:text-indigo-600 block px-3 py-2.5 rounded-lg text-base font-semibold hover:bg-slate-50 flex items-center gap-2"
          >
            <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span>Home</span>
          </Link>
          <Link 
            href="/#upcoming-events" 
            onClick={() => setIsOpen(false)}
            className="text-slate-700 hover:text-indigo-600 block px-3 py-2.5 rounded-lg text-base font-semibold hover:bg-slate-50 flex items-center gap-2"
          >
            <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse"></span>
            <span>Upcoming Gigs & Festivals</span>
          </Link>
          <Link 
            href="/companies" 
            onClick={() => setIsOpen(false)}
            className="text-slate-700 hover:text-indigo-600 block px-3 py-2.5 rounded-lg text-base font-semibold hover:bg-slate-50"
          >
            For Event Organizers
          </Link>
          <div className="pt-2 flex flex-col gap-2.5">
            {volUser ? (
              <Link 
                href="/profile" 
                onClick={() => setIsOpen(false)}
                className="text-center text-sm font-bold text-slate-800 py-3 rounded-xl border border-indigo-200 bg-indigo-50/50 flex items-center justify-center gap-2"
              >
                <span>👤 My Profile</span>
              </Link>
            ) : (
              <Link 
                href="/join" 
                onClick={() => setIsOpen(false)}
                className="text-center text-sm font-bold text-slate-800 py-3 rounded-xl border border-slate-300 bg-slate-50"
              >
                Join as Volunteer
              </Link>
            )}
            <Link 
              href="/request" 
              onClick={() => setIsOpen(false)}
              className="text-center text-sm font-bold text-white py-3 rounded-xl btn-premium-gradient shadow-md"
            >
              Request for an Event
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
