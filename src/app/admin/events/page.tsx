'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface UpcomingEvent {
  id: number;
  title: string;
  category: string;
  date: string;
  city: string;
  posterUrl: string;
  stipend: string;
  rolesNeeded: string[];
  vacancies: number;
  appliedCount: number;
  organizer: string;
  description: string;
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<UpcomingEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Editing state
  const [editingEvent, setEditingEvent] = useState<UpcomingEvent | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Form inputs
  const [formData, setFormData] = useState({
    title: '',
    category: 'Comedy & Music Fest',
    date: '',
    city: '',
    posterUrl: '',
    stipend: '',
    rolesNeeded: '',
    vacancies: 20,
    appliedCount: 0,
    organizer: '',
    description: '',
  });

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/events');
      if (res.ok) {
        const data = await res.json();
        setEvents(data);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleOpenEdit = (event: UpcomingEvent) => {
    setEditingEvent(event);
    setIsCreating(false);
    setFormData({
      title: event.title,
      category: event.category,
      date: event.date,
      city: event.city,
      posterUrl: event.posterUrl,
      stipend: event.stipend,
      rolesNeeded: event.rolesNeeded.join(', '),
      vacancies: event.vacancies,
      appliedCount: event.appliedCount,
      organizer: event.organizer,
      description: event.description,
    });
  };

  const handleOpenCreate = () => {
    setEditingEvent(null);
    setIsCreating(true);
    setFormData({
      title: '',
      category: 'Concert & Music Fest',
      date: '',
      city: 'Jaipur, Birla Auditorium',
      posterUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
      stipend: '₹2,500 / Day + Meals & Pass',
      rolesNeeded: 'Auditorium Ushers, Backstage Escort, VIP Protocol',
      vacancies: 25,
      appliedCount: 0,
      organizer: 'BookMyShow Live Events',
      description: '',
    });
  };

  const handleCloseModal = () => {
    setEditingEvent(null);
    setIsCreating(false);
    setError('');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (editingEvent) {
        // Update
        const res = await fetch(`/api/events/${editingEvent.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        if (res.ok) {
          setSuccess('Event updated successfully!');
          handleCloseModal();
          fetchEvents();
        } else {
          setError('Failed to update event');
        }
      } else if (isCreating) {
        // Create
        const res = await fetch('/api/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        if (res.ok) {
          setSuccess('New event created successfully!');
          handleCloseModal();
          fetchEvents();
        } else {
          setError('Failed to create event');
        }
      }
    } catch (err) {
      console.error(err);
      setError('An unexpected error occurred');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this event? It will be removed from the homepage.')) {
      return;
    }

    try {
      const res = await fetch(`/api/events/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setSuccess('Event deleted successfully!');
        fetchEvents();
      } else {
        alert('Failed to delete event');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting event');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Upcoming Events & Gigs Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            Edit posters, dates, venues, stipends, and crew vacancies shown on the homepage.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
          </svg>
          <span>Add New Event</span>
        </button>
      </div>

      {/* Status Notifications */}
      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm flex items-center justify-between">
          <span>✓ {success}</span>
          <button onClick={() => setSuccess('')} className="text-emerald-600 font-bold">✕</button>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl text-sm flex items-center justify-between">
          <span>⚠️ {error}</span>
          <button onClick={() => setError('')} className="text-red-600 font-bold">✕</button>
        </div>
      )}

      {/* Events Table / Cards */}
      {loading ? (
        <div className="p-12 text-center text-gray-400">Loading events...</div>
      ) : events.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-gray-200">
          <p className="text-gray-500">No events found. Click "Add New Event" to create one.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Event Poster & Title</th>
                  <th className="px-6 py-4">Venue & City</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Stipend</th>
                  <th className="px-6 py-4">Vacancies</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {events.map((evt) => (
                  <tr key={evt.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={evt.posterUrl}
                          alt={evt.title}
                          className="w-14 h-14 rounded-xl object-cover flex-shrink-0 border border-gray-200"
                        />
                        <div>
                          <span className="font-bold text-gray-900 block line-clamp-1">{evt.title}</span>
                          <span className="text-xs text-indigo-600 font-semibold">{evt.category}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-800">{evt.city}</td>
                    <td className="px-6 py-4 font-medium text-gray-700 whitespace-nowrap">{evt.date}</td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-200">
                        {evt.stipend}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-gray-900">{evt.vacancies}</span> spots
                      <span className="text-xs text-gray-400 block">{evt.appliedCount} applied</span>
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(evt)}
                          className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs rounded-lg transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(evt.id)}
                          className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 font-semibold text-xs rounded-lg transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit / Create Modal */}
      {(editingEvent || isCreating) && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-gray-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {editingEvent ? 'Edit Upcoming Event' : 'Add New Upcoming Event'}
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                  Event Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. SHIFT Festival 2025"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-indigo-600"
                />
              </div>

              {/* Category & Organizer */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                    Category *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g. Comedy & Music Fest"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-indigo-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                    Organizer Name
                  </label>
                  <input
                    type="text"
                    value={formData.organizer}
                    onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
                    placeholder="e.g. BookMyShow Live"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              {/* Date & City / Venue */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                    Date & Duration *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    placeholder="e.g. Dec 19 - 21, 2025"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-indigo-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                    City & Venue *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="e.g. Jaipur, Birla Auditorium"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              {/* Poster Image URL */}
              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                  Poster Image URL *
                </label>
                <input
                  type="url"
                  required
                  value={formData.posterUrl}
                  onChange={(e) => setFormData({ ...formData, posterUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-indigo-600"
                />
                {formData.posterUrl && (
                  <div className="mt-2 flex items-center gap-3">
                    <img
                      src={formData.posterUrl}
                      alt="Preview"
                      className="h-16 w-24 object-cover rounded-lg border border-gray-200"
                    />
                    <span className="text-xs text-gray-500">Live Poster Preview</span>
                  </div>
                )}
              </div>

              {/* Stipend & Vacancies */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                    Stipend & Perks *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.stipend}
                    onChange={(e) => setFormData({ ...formData, stipend: e.target.value })}
                    placeholder="e.g. ₹2,500 / Day + Artist Pass & Meals"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-indigo-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                    Vacancies (Crew Needed) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formData.vacancies}
                    onChange={(e) => setFormData({ ...formData, vacancies: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              {/* Roles Needed */}
              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                  Roles Needed (Comma separated) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.rolesNeeded}
                  onChange={(e) => setFormData({ ...formData, rolesNeeded: e.target.value })}
                  placeholder="e.g. Auditorium Ushers, Artist Backstage Escort, Ticketing Desk"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-indigo-600"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                  Event Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief overview of event and volunteer roles..."
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-indigo-600"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-semibold text-sm hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md"
                >
                  {editingEvent ? 'Save Changes' : 'Create Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
