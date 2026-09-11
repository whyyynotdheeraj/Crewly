import React from 'react';
import Link from 'next/link';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="relative bg-slate-900 text-slate-400 pt-20 pb-12 overflow-hidden">
      {/* Aurora glow orb in footer */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[45rem] h-[15rem] bg-indigo-500/10 blur-[100px] pointer-events-none rounded-full" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          <div className="md:col-span-2 space-y-4">
            <Logo variant="light" size="md" />
            <p className="text-slate-400 text-sm max-w-sm leading-relaxed pt-2">
              India's premier marketplace for verified event workforce. Supporting concerts, tech conferences, trade expos, and VIP galas nationwide.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              Volunteers active across 25+ cities
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-4">Event Companies</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/request" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
                  Request Crew for Event →
                </Link>
              </li>
              <li>
                <Link href="/request" className="hover:text-white transition-colors">
                  Post Crew Requirement
                </Link>
              </li>
              <li>
                <Link href="/companies" className="hover:text-white transition-colors">
                  Enterprise Support
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-4">Crew & Volunteers</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/join" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors flex items-center gap-1">
                  <span>Create Volunteer Profile</span>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="text-slate-500 hover:text-slate-300 text-xs transition-colors">
                  Staff Admin Login
                </Link>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-slate-800 mt-16 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Crewly Inc. Built for unforgettable events.</p>
          <div className="flex gap-4 font-medium text-slate-400">
            <span>Mumbai</span>
            <span>•</span>
            <span>Delhi NCR</span>
            <span>•</span>
            <span>Bengaluru</span>
            <span>•</span>
            <span>Jaipur</span>
            <span>•</span>
            <span>Goa</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
