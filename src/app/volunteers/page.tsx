'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import VolunteerCard from '@/components/VolunteerCard';

export default function VolunteersPage() {
  const [volunteers, setVolunteers] = useState<any[]>([]);
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
          setVolunteers(Array.isArray(data) ? data : (data.data || []));
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

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900">
      <Navbar />

      {/* Ambient background aura */}
      <div className="fixed top-12 left-1/4 w-[35rem] h-[25rem] bg-indigo-200/40 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed top-1/2 right-10 w-[28rem] h-[25rem] bg-pink-200/30 rounded-full blur-[130px] pointer-events-none" />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        
        {/* Header Banner */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-3">
              ⚡ Verified Talent Network
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
              Event Volunteers Directory
            </h1>
            <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-xl">
              Discover reliable crew members with verified past event experience, ratings, and instant availability.
            </p>
          </div>
          
          <a
            href="/join"
            className="self-start md:self-auto px-5 py-3 rounded-xl text-sm font-bold text-slate-800 bg-white border border-slate-200 shadow-sm hover:border-indigo-400 hover:text-indigo-600 transition-all flex items-center gap-2"
          >
            <span>+ Register as Volunteer</span>
          </a>
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
          <div className="bg-white rounded-[2rem] p-16 text-center border border-slate-200 shadow-sm">
            <div className="text-4xl mb-4">🔍</div>
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

      </main>

      <Footer />
    </div>
  );
}
