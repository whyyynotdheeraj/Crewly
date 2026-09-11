'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import VolunteerCard from '@/components/VolunteerCard';
import { VOLUNTEERS_UNLOCK_THRESHOLD } from '@/lib/config';

export default function VolunteersPage() {
  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [location, setLocation] = useState('');
  const [skill, setSkill] = useState('');
  const [experience, setExperience] = useState('');
  const [availability, setAvailability] = useState('');
  const [verified, setVerified] = useState(false);

  const locations = [
    'Jaipur',
    'Mumbai',
    'Delhi',
    'Hyderabad',
    'Chandigarh',
    'Chennai',
    'Lucknow',
    'Kochi',
    'Pune',
    'Bangalore',
  ];

  const skills = [
    'Event Management',
    'Crowd Handling',
    'Registration',
    'Hospitality',
    'Guest Management',
    'Stage Coordination',
    'Photography',
    'Social Media',
    'Sales',
    'VIP Liaison',
  ];

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    const fetchVolunteers = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (debouncedSearch) params.append('search', debouncedSearch);
        if (location) params.append('location', location);
        if (skill) params.append('skill', skill);
        if (experience) params.append('minExperience', experience);
        if (availability) params.append('availability', availability);
        if (verified) params.append('verified', 'true');

        const res = await fetch(`/api/volunteers?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          const list = Array.isArray(data) ? data : (data.data || []);
          setVolunteers(list);
          // When no filters applied, list.length is total count
          if (!debouncedSearch && !location && !skill && !experience && !availability && !verified) {
            setTotalCount(list.length);
          }
        } else {
          setVolunteers([]);
        }
      } catch (err) {
        console.error(err);
        setVolunteers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVolunteers();
  }, [debouncedSearch, location, skill, experience, availability, verified]);

  const isLocked = totalCount < VOLUNTEERS_UNLOCK_THRESHOLD;
  const progressPercent = Math.min(100, Math.max(8, Math.round((totalCount / VOLUNTEERS_UNLOCK_THRESHOLD) * 100)));

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900">
      <Navbar />

      {/* Ambient background aura */}
      <div className="fixed top-12 left-1/4 w-[35rem] h-[25rem] bg-indigo-200/40 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed top-1/2 right-10 w-[28rem] h-[25rem] bg-pink-200/30 rounded-full blur-[130px] pointer-events-none" />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        {/* Navigation Actions (Back & Home) */}
        <div className="flex items-center justify-between mb-8">
          <button
            type="button"
            onClick={() => window.history.length > 1 ? window.history.back() : window.location.href = '/'}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-indigo-600 bg-white hover:bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200 shadow-xs transition-all active:scale-[0.98] cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back</span>
          </button>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-indigo-600 bg-white hover:bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200 shadow-xs transition-all"
          >
            <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span>Home</span>
          </Link>
        </div>

        {/* If under 100 volunteers, display high-converting Milestone Lock Screen */}
        {!loading && isLocked ? (
          <div className="max-w-2xl mx-auto py-8">
            <div className="bg-white rounded-[2.5rem] p-8 sm:p-12 border border-indigo-100 shadow-3d-xl text-center space-y-6 relative overflow-hidden">
              
              {/* Background gradient orb */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
              
              {/* Lock badge icon */}
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center mx-auto shadow-sm">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3.5 py-1 rounded-full border border-indigo-100">
                  Phase 1 Onboarding
                </span>
                <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
                  Volunteer Profiles Unlocking Soon
                </h1>
                <p className="text-slate-600 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
                  We are currently onboarding & verifying the founding batch of event volunteers across India. Profiles will be revealed to event companies as soon as we reach <strong className="text-indigo-600">100 registered volunteers</strong>!
                </p>
              </div>

              {/* Progress Container */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 text-left">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-slate-700">Founding Volunteers Registered</span>
                  <span className="text-indigo-600 font-black text-sm">{totalCount} / {VOLUNTEERS_UNLOCK_THRESHOLD}</span>
                </div>
                
                {/* Progress bar */}
                <div className="w-full bg-slate-200 rounded-full h-3.5 p-0.5 overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 transition-all duration-700 shadow-xs"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                <div className="flex justify-between items-center text-[11px] font-semibold text-slate-400">
                  <span>{progressPercent}% towards launch</span>
                  <span className="flex items-center"><svg className="w-4 h-4 text-emerald-600 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/></svg>Early Batch Verified Badges Included</span>
                </div>
              </div>

              {/* Exactly the 2 requested action buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/join"
                  className="px-8 py-3.5 rounded-xl btn-premium-gradient text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 hover:shadow-lg transition-all"
                >
                  <span>Join as a Volunteer</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>

                <Link
                  href="/request"
                  className="px-8 py-3.5 rounded-xl border border-slate-300 hover:border-indigo-400 bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm shadow-xs transition-colors flex items-center justify-center"
                >
                  Request for an Event
                </Link>
              </div>

            </div>
          </div>
        ) : (
          <>
            {/* Header Banner (Unlocked State) */}
            <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-3">
                  <svg className="w-3.5 h-3.5 fill-current text-indigo-600" viewBox="0 0 24 24">
                    <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>Verified Talent Network</span>
                </div>
                <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
                  Event Volunteers Directory
                </h1>
                <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-xl">
                  Discover reliable crew members with verified past event experience, ratings, and instant availability.
                </p>
              </div>
              
              <Link
                href="/join"
                className="self-start md:self-auto px-5 py-3 rounded-xl text-sm font-bold text-slate-800 bg-white border border-slate-200 shadow-xs hover:border-indigo-400 hover:text-indigo-600 transition-all flex items-center gap-2"
              >
                <span>+ Join as Volunteer</span>
              </Link>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-6 rounded-[2rem] border border-slate-200/80 shadow-3d-xl mb-10 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                
                {/* Search */}
                <div className="md:col-span-4 relative">
                  <input
                    type="text"
                    placeholder="Search by name, skill or role..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
                  />
                </div>

                {/* Location selector */}
                <div className="md:col-span-2">
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-sm text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white"
                  >
                    <option value="">All Locations</option>
                    {locations.map((loc) => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>

                {/* Skill selector */}
                <div className="md:col-span-3">
                  <select
                    value={skill}
                    onChange={(e) => setSkill(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-sm text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white"
                  >
                    <option value="">All Core Skills</option>
                    {skills.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                {/* Availability */}
                <div className="md:col-span-3">
                  <select
                    value={availability}
                    onChange={(e) => setAvailability(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-sm text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white"
                  >
                    <option value="">Any Availability</option>
                    <option value="Available">Available Now</option>
                    <option value="Weekends">Weekends Only</option>
                    <option value="Full-time">Full-time Available</option>
                  </select>
                </div>

              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-100 text-xs text-slate-500">
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={verified}
                      onChange={(e) => setVerified(e.target.checked)}
                      className="rounded border-slate-300 text-indigo-600 focus:ring-0 w-4 h-4"
                    />
                    <span className="text-slate-700 font-semibold">Verified Profiles Only</span>
                  </label>
                </div>

                <div>
                  <span>Showing <strong className="text-indigo-600 font-bold">{volunteers.length}</strong> active crew members</span>
                </div>
              </div>
            </div>

            {/* Volunteers Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                  <div key={n} className="bg-white rounded-[1.75rem] h-96 animate-pulse border border-slate-200" />
                ))}
              </div>
            ) : volunteers.length === 0 ? (
              <div className="bg-white rounded-[2rem] p-16 text-center border border-slate-200 shadow-xs">
                <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">No volunteers found</h3>
                <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">
                  Try adjusting your search criteria or resetting filters to see available volunteers.
                </p>
                <button
                  onClick={() => {
                    setSearch('');
                    setLocation('');
                    setSkill('');
                    setExperience('');
                    setAvailability('');
                    setVerified(false);
                  }}
                  className="px-6 py-2.5 rounded-xl btn-premium-gradient text-xs font-bold text-white shadow-md"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {volunteers.map((volunteer) => (
                  <VolunteerCard key={volunteer.id} volunteer={volunteer} />
                ))}
              </div>
            )}
          </>
        )}

      </main>

      <Footer />
    </div>
  );
}
