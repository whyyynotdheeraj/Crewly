'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

type Volunteer = {
  id: string;
  name: string;
  location: string;
  experienceLevel: string;
  skills: string[];
  verified: boolean;
  profileImage: string | null;
  phone?: string;
};

export default function AdminVolunteersPage() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  const fetchVolunteers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/volunteers?admin=true');
      if (res.ok) {
        const data = await res.json();
        setVolunteers(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching volunteers:', error);
      showMessage('error', 'Failed to load volunteers');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this volunteer?')) return;

    try {
      const res = await fetch(`/api/volunteers/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        showMessage('success', 'Volunteer deleted successfully');
        fetchVolunteers();
      } else {
        showMessage('error', 'Failed to delete volunteer');
      }
    } catch (error) {
      showMessage('error', 'An error occurred');
    }
  };

  const handleToggleVerify = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/volunteers/${id}/verify`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verified: !currentStatus }),
      });

      if (res.ok) {
        showMessage('success', `Volunteer ${!currentStatus ? 'verified' : 'unverified'}`);
        fetchVolunteers();
      } else {
        showMessage('error', 'Failed to update status');
      }
    } catch (error) {
      showMessage('error', 'An error occurred');
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {message.text && (
        <div className={`mb-4 p-4 rounded-lg text-sm font-medium ${
          message.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Volunteers</h1>
        <Link
          href="/admin/volunteers/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center w-fit"
        >
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Volunteer
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : volunteers.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-500 mb-4">No volunteers yet. Add your first volunteer.</p>
            <Link
              href="/admin/volunteers/new"
              className="text-blue-600 font-medium hover:underline"
            >
              + Add Volunteer
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="py-4 px-6 text-sm font-medium text-gray-500">Photo</th>
                  <th className="py-4 px-6 text-sm font-medium text-gray-500">Name</th>
                  <th className="py-4 px-6 text-sm font-medium text-gray-500">Location</th>
                  <th className="py-4 px-6 text-sm font-medium text-gray-500">Experience</th>
                  <th className="py-4 px-6 text-sm font-medium text-gray-500">Skills</th>
                  <th className="py-4 px-6 text-sm font-medium text-gray-500">Verified</th>
                  <th className="py-4 px-6 text-sm font-medium text-gray-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {volunteers.map((v) => (
                  <tr key={v.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      {v.profileImage ? (
                        <img src={v.profileImage} alt={v.name} className="w-10 h-10 rounded-full object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                          {v.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-6 text-sm font-medium text-gray-900">{v.name}</td>
                    <td className="py-4 px-6 text-sm text-gray-600">{v.location}</td>
                    <td className="py-4 px-6 text-sm text-gray-600 capitalize">{v.experienceLevel}</td>
                    <td className="py-4 px-6">
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {v.skills.slice(0, 2).map((skill, i) => (
                          <span key={i} className="inline-block px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full truncate max-w-[80px]">
                            {skill}
                          </span>
                        ))}
                        {v.skills.length > 2 && (
                          <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                            +{v.skills.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => handleToggleVerify(v.id, v.verified)}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                          v.verified ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                      >
                        {v.verified ? 'Verified' : 'Unverified'}
                      </button>
                    </td>
                    <td className="py-4 px-6 text-right space-x-3">
                      <Link
                        href={`/admin/volunteers/${v.id}/edit`}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(v.id)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
