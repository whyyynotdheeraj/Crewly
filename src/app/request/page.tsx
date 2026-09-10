'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SkillInput from '@/components/SkillInput';

export default function RequestPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    phone: '',
    email: '',
    eventName: '',
    eventType: 'Conference',
    eventDate: '',
    location: '',
    volunteersNeeded: 1,
    requirements: ''
  });
  
  const [skills, setSkills] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          contactPerson: formData.contactName,
          requiredSkills: skills,
          volunteersRequired: Number(formData.volunteersNeeded) || 1,
          additionalRequirements: formData.requirements,
        })
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to submit request. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-1 flex items-center justify-center py-12 px-4">
          <div className="max-w-md w-full bg-white rounded-xl shadow-sm p-8 text-center border border-gray-100">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Request received!</h2>
            <p className="text-slate-600 mb-8 text-sm">
              We'll review your requirement and connect you with matching volunteers shortly.
            </p>
            <Link href="/" className="inline-block btn-premium-gradient px-8 py-3 rounded-xl font-bold shadow-lg">
              Return Home
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Tell us what your event needs.</h1>
          <p className="text-lg text-gray-600">Fill in the details below and we'll help you find the right volunteers.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-10">
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name *</label>
                <input 
                  type="text" 
                  name="companyName" 
                  required 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                  value={formData.companyName}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person *</label>
                <input 
                  type="text" 
                  name="contactName" 
                  required 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                  value={formData.contactName}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input 
                  type="email" 
                  name="email" 
                  required 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                <input 
                  type="tel" 
                  name="phone" 
                  required 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Event Name *</label>
                  <input 
                    type="text" 
                    name="eventName" 
                    required 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                    value={formData.eventName}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Event Type</label>
                  <select 
                    name="eventType" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
                    value={formData.eventType}
                    onChange={handleChange}
                  >
                    <option value="Conference">Conference</option>
                    <option value="Wedding">Wedding</option>
                    <option value="Exhibition">Exhibition</option>
                    <option value="Festival">Festival</option>
                    <option value="Corporate Event">Corporate Event</option>
                    <option value="Sports Event">Sports Event</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Event Date</label>
                  <input 
                    type="date" 
                    name="eventDate" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none text-gray-700"
                    value={formData.eventDate}
                    onChange={handleChange}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Event Location</label>
                  <input 
                    type="text" 
                    name="location" 
                    placeholder="City, Venue, etc."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
                    value={formData.location}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Crew Requirements</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Number of Volunteers Required</label>
                  <input 
                    type="number" 
                    name="volunteersNeeded" 
                    min="1"
                    className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
                    value={formData.volunteersNeeded}
                    onChange={handleChange}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Required Skills</label>
                  <SkillInput skills={skills} onChange={setSkills} />
                  <p className="text-xs text-gray-500 mt-1">Press Enter to add a skill.</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Additional Requirements</label>
                  <textarea 
                    name="requirements" 
                    rows={4}
                    placeholder="Any specific duties, uniform requirements, or details the volunteers should know?"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none resize-y"
                    value={formData.requirements}
                    onChange={handleChange}
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
