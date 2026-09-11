'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import SkillInput from '@/components/SkillInput';
import ImageUpload from '@/components/ImageUpload';

type ExperienceInput = {
  id: string; // temp id for UI
  eventName: string;
  eventType: string;
  role: string;
  year: number;
  description: string;
  imageUrl: string;
};

const SUGGESTED_SKILLS = [
  'Event Management', 'Crowd Management', 'Registration', 'Hospitality',
  'Guest Management', 'Promotion', 'Stage Coordination', 'Photography',
  'Social Media', 'Sales'
];

export default function AdminNewVolunteerPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [bio, setBio] = useState('');
  const [yearsOfExperience, setYearsOfExperience] = useState(0);
  const [eventsCompleted, setEventsCompleted] = useState(0);
  const [skills, setSkills] = useState<string[]>([]);
  const [profileImage, setProfileImage] = useState('');
  const [available, setAvailable] = useState(true);
  const [verified, setVerified] = useState(false);
  const [experiences, setExperiences] = useState<ExperienceInput[]>([]);

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const addExperience = () => {
    setExperiences([
      ...experiences,
      {
        id: Math.random().toString(36).substr(2, 9),
        eventName: '',
        eventType: '',
        role: '',
        year: new Date().getFullYear(),
        description: '',
        imageUrl: '',
      }
    ]);
  };

  const updateExperience = (id: string, field: keyof ExperienceInput, value: any) => {
    setExperiences(experiences.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    ));
  };

  const removeExperience = (id: string) => {
    setExperiences(experiences.filter(exp => exp.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 1. Create Volunteer
      const volRes = await fetch('/api/volunteers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phone,
          location,
          bio,
          yearsOfExperience,
          eventsCompleted,
          skills,
          profileImage,
          available,
          verified,
          experienceLevel: yearsOfExperience > 3 ? 'expert' : yearsOfExperience > 1 ? 'intermediate' : 'beginner',
        }),
      });

      if (!volRes.ok) throw new Error('Failed to create volunteer');
      const volData = await volRes.json();
      const newVolId = volData.data?.id || volData.id;

      // 2. Create Experiences
      if (experiences.length > 0) {
        for (const exp of experiences) {
          await fetch('/api/experiences', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              volunteerId: newVolId,
              eventName: exp.eventName,
              eventType: exp.eventType,
              role: exp.role,
              year: exp.year,
              description: exp.description,
              imageUrl: exp.imageUrl,
            }),
          });
        }
      }

      router.push('/admin/volunteers');
      router.refresh();
    } catch (error) {
      console.error(error);
      showMessage('error', 'Failed to save volunteer. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      {message.text && (
        <div className={`mb-6 p-4 rounded-lg text-sm font-medium ${
          message.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      <div className="mb-8">
        <div className="text-sm text-gray-500 mb-2">
          <Link href="/admin/volunteers" className="hover:text-blue-600">Volunteers</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">Add New</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Add New Volunteer</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <input type="text" required value={name} onChange={e => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input type="text" value={location} onChange={e => setLocation(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none" />
            </div>
          </div>
        </div>

        {/* Profile */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Profile</h2>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Profile Photo</label>
            <ImageUpload 
              value={profileImage} 
              onChange={setProfileImage} 
              type="profile" 
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea rows={4} value={bio} onChange={e => setBio(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
              <input type="number" min="0" value={yearsOfExperience} onChange={e => setYearsOfExperience(parseInt(e.target.value) || 0)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Events Completed</label>
              <input type="number" min="0" value={eventsCompleted} onChange={e => setEventsCompleted(parseInt(e.target.value) || 0)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none" />
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Skills</h2>
          <SkillInput skills={skills} onChange={setSkills} />
          <div className="mt-4">
            <p className="text-sm text-gray-500 mb-2">Suggestions:</p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED_SKILLS.filter(s => !skills.includes(s)).map(skill => (
                <button
                  type="button"
                  key={skill}
                  onClick={() => setSkills([...skills, skill])}
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-full transition-colors"
                >
                  + {skill}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Experiences */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Experience Records</h2>
            <button
              type="button"
              onClick={addExperience}
              className="text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1.5 rounded-lg font-medium transition-colors"
            >
              + Add Experience
            </button>
          </div>

          {experiences.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No experiences added yet.</p>
          ) : (
            <div className="space-y-6">
              {experiences.map((exp, index) => (
                <div key={exp.id} className="p-4 border border-gray-200 rounded-lg relative">
                  <button
                    type="button"
                    onClick={() => removeExperience(exp.id)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <h3 className="font-bold text-gray-900 mb-4">Experience #{index + 1}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Event Name *</label>
                      <input type="text" required value={exp.eventName} onChange={e => updateExperience(exp.id, 'eventName', e.target.value)}
                        className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Role *</label>
                      <input type="text" required value={exp.role} onChange={e => updateExperience(exp.id, 'role', e.target.value)}
                        className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Event Type</label>
                      <input type="text" value={exp.eventType} onChange={e => updateExperience(exp.id, 'eventType', e.target.value)}
                        className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Year</label>
                      <input type="number" required value={exp.year} onChange={e => updateExperience(exp.id, 'year', parseInt(e.target.value))}
                        className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 outline-none" />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                    <textarea rows={2} value={exp.description} onChange={e => updateExperience(exp.id, 'description', e.target.value)}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">Event Image</label>
                    <ImageUpload value={exp.imageUrl} onChange={(url: string) => updateExperience(exp.id, 'imageUrl', url)} type="experience" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Settings */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Settings</h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <input type="checkbox" id="available" checked={available} onChange={e => setAvailable(e.target.checked)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
              <label htmlFor="available" className="ml-2 block text-sm text-gray-900">
                Available for new events
              </label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="verified" checked={verified} onChange={e => setVerified(e.target.checked)}
                className="h-4 w-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500" />
              <label htmlFor="verified" className="ml-2 block text-sm text-gray-900">
                Verified Volunteer
              </label>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end space-x-4">
          <Link href="/admin/volunteers" className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center"
          >
            {isLoading && (
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            Save Volunteer
          </button>
        </div>
      </form>
    </div>
  );
}
