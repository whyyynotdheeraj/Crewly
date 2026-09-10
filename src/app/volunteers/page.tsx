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
    <div className="min-h-screen flex flex-col bg-[#0b0f19] text-gray-100">
      <Navbar />

      {/* Ambient background glow */}
      <div className="fixed top-20 left-1/4 w-[32rem] h-[32rem] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed bottom-10 right-10 w-[24rem] h-[24rem] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        
        {/* Header Banner */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-3">
              ⚡ Real-Time Talent Network
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Verified Event Crew
            </h1>
            <p className="text-gray-400 text-sm sm:text-base mt-2 max-w-xl">
              Filter top-tier volunteers by city, experience, verified status, and real-time availability.
            </p>
          </div>
          
          <a
            href="/join"
            className="self-start md:self-auto px-5 py-3 rounded-xl text-sm font-bold text-gray-200 btn-3d-glass flex items-center gap-2"
          >
            <span>+ Register as Volunteer</span>
          </a>
        </div>

        {/* 3D Glass Filter Panel */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10 shadow-2xl mb-10 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            
            {/* Search input */}
            <div className="md:col-span-4 relative">
              <input
                type="text"
                placeholder="Search by name, skills or keywords..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#111827] border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition-colors"
              />
            </div>

            {/* Location selector */}
            <div className="md:col-span-2">
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-[#111827] border border-white/15 rounded-xl px-3 py-3 text-sm text-gray-200 focus:outline-none focus:border-cyan-400"
              >
                <option value="">All Locations</option>
                {locations.map((loc) => (
                  <option key={loc} value={loc} className="bg-[#111827] text-white">{loc}</option>
                ))}
              </select>
            </div>

            {/* Skill selector */}
            <div className="md:col-span-3">
              <select
                value={skill}
                onChange={(e) => setSkill(e.target.value)}
                className="w-full bg-[#111827] border border-white/15 rounded-xl px-3 py-3 text-sm text-gray-200 focus:outline-none focus:border-cyan-400"
              >
                <option value="">All Core Skills</option>
                {skills.map((s) => (
                  <option key={s} value={s} className="bg-[#111827] text-white">{s}</option>
                ))}
              </select>
            </div>

            {/* Availability */}
            <div className="md:col-span-3">
              <select
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                className="w-full bg-[#111827] border border-white/15 rounded-xl px-3 py-3 text-sm text-gray-200 focus:outline-none focus:border-cyan-400"
              >
                <option value="">Any Availability</option>
                <option value="Available" className="bg-[#111827] text-white">Available Now</option>
                <option value="Weekends" className="bg-[#111827] text-white">Weekends Only</option>
                <option value="Full-time" className="bg-[#111827] text-white">Full-time Available</option>
              </select>
            </div>

          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-white/10 text-xs text-gray-400">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={verified}
                  onChange={(e) => setVerified(e.target.checked)}
                  className="rounded bg-[#111827] border-white/20 text-blue-600 focus:ring-0 w-4 h-4"
                />
                <span className="text-gray-300 font-medium">Show Verified Profiles Only</span>
              </label>
            </div>

            <div>
              <span>Found <strong className="text-cyan-400">{volunteers.length}</strong> active profiles</span>
            </div>
          </div>
        </div>

        {/* Directory Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div key={n} className="glass-panel rounded-3xl h-96 animate-pulse border border-white/5" />
            ))}
          </div>
        ) : volunteers.length === 0 ? (
          <div className="glass-panel rounded-3xl p-16 text-center border border-white/10">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-white mb-2">No crew members found</h3>
            <p className="text-gray-400 text-sm max-w-md mx-auto mb-6">
              Try adjusting your search filters or clear location to discover volunteers across other regions.
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
              className="px-6 py-2.5 rounded-xl btn-3d-primary text-xs font-bold text-white"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 perspective-1000">
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
