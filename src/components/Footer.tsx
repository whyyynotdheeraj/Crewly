import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="relative bg-[#070a11] text-gray-400 pt-20 pb-12 border-t border-white/10 overflow-hidden">
      {/* Background glow orb */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-blue-600/10 blur-[90px] pointer-events-none rounded-full" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-400 p-[2px]">
                <div className="w-full h-full bg-[#0b0f19] rounded-[6px] flex items-center justify-center">
                  <span className="text-sm font-black text-cyan-300">C</span>
                </div>
              </div>
              <span className="text-2xl font-black text-white tracking-tight">Crewly</span>
            </div>
            <p className="text-gray-400 text-sm max-w-sm leading-relaxed mb-6">
              India's premier verified event crew network. Connect top-tier event talent with leading corporate summits, music festivals, expos, and private celebrations.
            </p>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                Live Event Crew Available
              </span>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">For Event Companies</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/volunteers" className="hover:text-cyan-400 transition-colors">
                  Search Volunteer Directory
                </Link>
              </li>
              <li>
                <Link href="/request" className="hover:text-cyan-400 transition-colors">
                  Post Crew Request
                </Link>
              </li>
              <li>
                <Link href="/companies" className="hover:text-cyan-400 transition-colors">
                  Enterprise Solutions
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">For Event Crew</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/join" className="hover:text-cyan-400 transition-colors">
                  Register as Volunteer
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="hover:text-cyan-400 transition-colors text-xs text-gray-500">
                  Staff Portal
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-16 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Crewly Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <span>Mumbai • Delhi NCR • Bengaluru • Goa</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
