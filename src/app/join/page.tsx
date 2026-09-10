'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SkillInput from '@/components/SkillInput';
import ImageUpload from '@/components/ImageUpload';

type EventExperience = {
  id: string;
  eventName: string;
  eventType: string;
  year: number;
  role: string;
  description: string;
  imageUrl: string;
};

const SUGGESTED_SKILLS = [
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
  'Logistics',
  'Sound & Light Assist',
];

const EVENT_TYPES = [
  'Festival',
  'Conference',
  'Exhibition',
  'Concert / Live Show',
  'Wedding',
  'Corporate Event',
  'Sports Event',
  'Cultural Fest',
  'Other',
];

export default function JoinVolunteerPage() {
  // Personal Info
  const [name, setName] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');
  const [age, setAge] = useState<number | ''>('');

  // Skills & Overview
  const [skills, setSkills] = useState<string[]>(['Event Management', 'Registration']);
  const [yearsExperience, setYearsExperience] = useState<number>(1);
  const [eventsCompleted, setEventsCompleted] = useState<number>(3);
  const [bio, setBio] = useState('');

  // Previous Events
  const [experiences, setExperiences] = useState<EventExperience[]>([
    {
      id: 'exp-1',
      eventName: '',
      eventType: 'Festival',
      year: new Date().getFullYear(),
      role: '',
      description: '',
      imageUrl: '',
    },
  ]);

  // Availability & Notes
  const [availability, setAvailability] = useState<'available' | 'unavailable'>('available');
  const [additionalNotes, setAdditionalNotes] = useState('');

  // Status
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdVolunteer, setCreatedVolunteer] = useState<any | null>(null);

  const addExperience = () => {
    setExperiences([
      ...experiences,
      {
        id: `exp-${Date.now()}`,
        eventName: '',
        eventType: 'Festival',
        year: new Date().getFullYear(),
        role: '',
        description: '',
        imageUrl: '',
      },
    ]);
  };

  const removeExperience = (id: string) => {
    if (experiences.length > 1) {
      setExperiences(experiences.filter((exp) => exp.id !== id));
    }
  };

  const updateExperience = (id: string, field: keyof EventExperience, value: any) => {
    setExperiences(
      experiences.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp))
    );
  };

  const toggleSuggestedSkill = (skill: string) => {
    if (skills.includes(skill)) {
      setSkills(skills.filter((s) => s !== skill));
    } else {
      setSkills([...skills, skill]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!phone.trim()) {
      setError('Please enter your phone number.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!location.trim()) {
      setError('Please enter your city / location.');
      return;
    }
    if (skills.length === 0) {
      setError('Please add at least one skill.');
      return;
    }

    setLoading(true);

    try {
      // Format experiences
      const validExperiences = experiences
        .filter((exp) => exp.eventName.trim().length > 0)
        .map((exp) => ({
          eventName: exp.eventName.trim(),
          eventType: exp.eventType,
          role: exp.role.trim() || 'Volunteer',
          year: Number(exp.year) || new Date().getFullYear(),
          description: exp.description.trim(),
          images: exp.imageUrl ? [exp.imageUrl] : [],
        }));

      // Append additional notes to bio if provided
      let fullBio = bio.trim();
      if (additionalNotes.trim()) {
        fullBio = fullBio
          ? `${fullBio}\n\nAdditional Info:\n${additionalNotes.trim()}`
          : additionalNotes.trim();
      }

      const payload = {
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        location: location.trim(),
        age: age ? Number(age) : undefined,
        bio: fullBio,
        yearsExperience: Number(yearsExperience) || 0,
        eventsCompleted: Number(eventsCompleted) || 0,
        skills,
        availability,
        verified: true, // Registered profiles receive verified badge so companies can evaluate them
        profileImage: profileImage || null,
        experiences: validExperiences,
      };

      const res = await fetch('/api/volunteers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to create volunteer profile');
      }

      const created = await res.json();
      setCreatedVolunteer(created);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // SUCCESS SCREEN
  if (createdVolunteer) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12 text-center">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
              ✓
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              Registration Successful!
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Welcome aboard, <span className="font-semibold text-gray-900">{createdVolunteer.name}</span>! Your professional volunteer profile has been created and is now live in the Crewly directory.
            </p>

            <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left border border-gray-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-sm">Profile Status:</span>
                <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold border border-emerald-200">
                  <span>✓</span> Verified Profile
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-sm">Location:</span>
                <span className="text-gray-900 font-medium text-sm">{createdVolunteer.location}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-sm">Skills Listed:</span>
                <span className="text-gray-900 font-medium text-sm">{createdVolunteer.skills?.join(', ') || 'None'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-sm">Availability:</span>
                <span className="text-emerald-600 font-medium text-sm capitalize">{createdVolunteer.availability}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={`/volunteers/${createdVolunteer.id}`}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-3 rounded-lg transition-colors text-center shadow-sm"
              >
                View My Live Profile →
              </Link>
              <Link
                href="/volunteers"
                className="border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium px-8 py-3 rounded-lg transition-colors text-center"
              >
                Explore Volunteer Directory
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="inline-block bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
            Volunteer Registration
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Join Crewly as an Event Volunteer
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Create your verified profile, showcase your past event experience and photos, and get discovered by top event companies.
          </p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-3">
            <span className="text-xl">⚠️</span>
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 1. PERSONAL INFORMATION */}
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">1</span>
              Personal Information
            </h2>

            {/* Profile Photo */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Profile Photo
              </label>
              <p className="text-xs text-gray-500 mb-3">
                Upload a clear headshot or professional photo so event organizers can recognize you.
              </p>
              <ImageUpload
                type="profile"
                value={profileImage}
                onChange={setProfileImage}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +91 98765 43210"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <p className="text-xs text-gray-400 mt-1">
                  🔒 Kept private. Never exposed publicly to the general public.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. rahul@example.com"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Location / City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jaipur, Rajasthan"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Age (Optional)
                </label>
                <input
                  type="number"
                  min="16"
                  max="80"
                  placeholder="e.g. 22"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                  value={age}
                  onChange={(e) => setAge(e.target.value ? parseInt(e.target.value, 10) : '')}
                />
              </div>
            </div>
          </div>

          {/* 2. SKILLS & EXPERTISE */}
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">2</span>
              Skills & Expertise
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Companies search volunteers by specific skills. Add skills you are confident in.
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Skills <span className="text-red-500">*</span>
              </label>
              <SkillInput skills={skills} onChange={setSkills} />
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Quick Add Popular Event Skills:
              </p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_SKILLS.map((skill) => {
                  const isSelected = skills.includes(skill);
                  return (
                    <button
                      type="button"
                      key={skill}
                      onClick={() => toggleSuggestedSkill(skill)}
                      className={`text-xs px-3 py-1.5 rounded-full transition-colors border ${
                        isSelected
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {isSelected ? '✓ ' : '+ '}
                      {skill}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 3. EXPERIENCE OVERVIEW & BIO */}
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">3</span>
              Experience Overview
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Years of Event Experience
                </label>
                <input
                  type="number"
                  min="0"
                  max="30"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
                  value={yearsExperience}
                  onChange={(e) => setYearsExperience(parseInt(e.target.value, 10) || 0)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Events Worked At
                </label>
                <input
                  type="number"
                  min="0"
                  max="500"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
                  value={eventsCompleted}
                  onChange={(e) => setEventsCompleted(parseInt(e.target.value, 10) || 0)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bio / About Yourself
              </label>
              <textarea
                rows={4}
                placeholder="Briefly introduce yourself. Mention what types of events you enjoy working at, your strengths (e.g. calm under pressure, friendly with attendees), and your dedication."
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none text-sm"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>
          </div>

          {/* 4. PREVIOUS EVENTS WORKED AT */}
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">4</span>
                  Previous Events Worked At
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Add details of actual events you have worked at, your roles, responsibilities, and event photos.
                </p>
              </div>
              <button
                type="button"
                onClick={addExperience}
                className="self-start sm:self-auto bg-blue-50 text-blue-600 hover:bg-blue-100 px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1"
              >
                <span>+ Add Another Event</span>
              </button>
            </div>

            <div className="space-y-6">
              {experiences.map((exp, idx) => (
                <div
                  key={exp.id}
                  className="p-5 border border-gray-200 rounded-xl bg-gray-50/50 relative space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                    <span className="text-sm font-bold text-gray-700">
                      Event #{idx + 1}
                    </span>
                    {experiences.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeExperience(exp.id)}
                        className="text-red-500 hover:text-red-700 text-xs font-semibold px-2 py-1 rounded"
                      >
                        Remove Event
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Event Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Jaipur Literature Festival"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-600 outline-none"
                        value={exp.eventName}
                        onChange={(e) => updateExperience(exp.id, 'eventName', e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Event Type
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-600 outline-none"
                        value={exp.eventType}
                        onChange={(e) => updateExperience(exp.id, 'eventType', e.target.value)}
                      >
                        {EVENT_TYPES.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Year
                      </label>
                      <input
                        type="number"
                        min="2015"
                        max={new Date().getFullYear() + 1}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-600 outline-none"
                        value={exp.year}
                        onChange={(e) =>
                          updateExperience(exp.id, 'year', parseInt(e.target.value, 10) || new Date().getFullYear())
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Your Role / Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Crowd Handling Lead / Registration Desk Coordinator"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-600 outline-none"
                      value={exp.role}
                      onChange={(e) => updateExperience(exp.id, 'role', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Responsibilities & What You Did
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Describe your responsibilities: e.g. Managed attendee check-ins, handled VIP movement, escorted artists, resolved ticketing queries..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-600 outline-none"
                      value={exp.description}
                      onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Event Photograph (Photos from previous events you worked at)
                    </label>
                    <p className="text-xs text-gray-500 mb-2">
                      Upload a photo of you on-site, stage setup, or the event floor.
                    </p>
                    <ImageUpload
                      type="experience"
                      value={exp.imageUrl}
                      onChange={(url: string) => updateExperience(exp.id, 'imageUrl', url)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 5. AVAILABILITY & ADDITIONAL INFORMATION */}
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">5</span>
              Availability & Additional Information
            </h2>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Current Availability Status
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label
                  className={`border rounded-xl p-4 flex items-center gap-3 cursor-pointer transition-all ${
                    availability === 'available'
                      ? 'border-emerald-500 bg-emerald-50/40 ring-2 ring-emerald-500/20'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="availability"
                    value="available"
                    checked={availability === 'available'}
                    onChange={() => setAvailability('available')}
                    className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                  />
                  <div>
                    <div className="font-semibold text-gray-900 text-sm flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      Available
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      Ready to work at upcoming events
                    </div>
                  </div>
                </label>

                <label
                  className={`border rounded-xl p-4 flex items-center gap-3 cursor-pointer transition-all ${
                    availability === 'unavailable'
                      ? 'border-gray-500 bg-gray-50 ring-2 ring-gray-500/20'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="availability"
                    value="unavailable"
                    checked={availability === 'unavailable'}
                    onChange={() => setAvailability('unavailable')}
                    className="w-4 h-4 text-gray-600 focus:ring-gray-500"
                  />
                  <div>
                    <div className="font-semibold text-gray-900 text-sm flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                      Currently Unavailable
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      Temporarily not taking event bookings
                    </div>
                  </div>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Any Other Relevant Information
              </label>
              <textarea
                rows={3}
                placeholder="Mention any specific details like days of the week you're free, languages you speak, driving license, or specific equipment you own."
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none text-sm"
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
              />
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-xl transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed text-base flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>Creating Your Profile...</span>
                </>
              ) : (
                <span>Register & Create Volunteer Profile</span>
              )}
            </button>
            <p className="text-center text-xs text-gray-500 mt-3">
              By registering, you agree to be listed in the Crewly verified event volunteer network.
            </p>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
