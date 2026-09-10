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
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Event Volunteers</h1>
            <p className="text-gray-600">Browse verified, experienced event staff ready for your next event.</p>
          </div>
          <a
            href="/join"
            className="self-start md:self-auto bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 font-medium px-4 py-2 rounded-lg text-sm transition-colors"
          >
            + Register as Volunteer
          </a>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-xl shadow-sm mb-8 space-y-4 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Search */}
            <div className="md:col-span-12 lg:col-span-3">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Search
              </label>
              <input
                type="text"
                placeholder="Search name, skill, or city..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none text-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Location */}
            <div className="md:col-span-6 lg:col-span-2">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Location
              </label>
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none text-sm bg-white"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              >
                <option value="">All Locations</option>
                {locations.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>

            {/* Skill */}
            <div className="md:col-span-6 lg:col-span-2">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Skill
              </label>
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none text-sm bg-white"
                value={skill}
                onChange={(e) => setSkill(e.target.value)}
              >
                <option value="">All Skills</option>
                {skills.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* Experience */}
            <div className="md:col-span-6 lg:col-span-2">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Experience
              </label>
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none text-sm bg-white"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
              >
                <option value="">Any Experience</option>
                <option value="1">1+ Years</option>
                <option value="2">2+ Years</option>
                <option value="3">3+ Years</option>
                <option value="5">5+ Years</option>
              </select>
            </div>

            {/* Availability */}
            <div className="md:col-span-6 lg:col-span-2">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Availability
              </label>
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none text-sm bg-white"
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
              >
                <option value="">All Availability</option>
                <option value="available">Available Only</option>
                <option value="unavailable">Unavailable Only</option>
              </select>
            </div>

            {/* Verified toggle */}
            <div className="md:col-span-12 lg:col-span-1 flex items-end pb-2">
              <label className="flex items-center space-x-2 cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                  checked={verified}
                  onChange={(e) => setVerified(e.target.checked)}
                />
                <span className="text-gray-700 font-medium text-xs whitespace-nowrap">Verified</span>
              </label>
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="mb-4 text-gray-600 text-sm font-medium">
          {!loading && `Showing ${volunteers.length} volunteer${volunteers.length !== 1 ? 's' : ''}`}
        </div>

        {/* Volunteers Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white rounded-xl shadow-sm h-[320px] animate-pulse p-6 flex flex-col border border-gray-100">
                <div className="w-full h-40 bg-gray-200 rounded-lg mb-4"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-5 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-full pt-2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : volunteers.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">No volunteers found</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              We couldn't find any volunteers matching your search criteria. Try adjusting or clearing your filters.
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
              className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg font-medium text-sm hover:bg-blue-100 transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {volunteers.map(volunteer => (
              <VolunteerCard key={volunteer.id} volunteer={volunteer} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
