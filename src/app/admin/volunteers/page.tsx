'use client';

import { useState, useEffect } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Link from 'next/link';

type Volunteer = {
  id: number | string;
  name: string;
  location: string;
  yearsExperience?: number;
  experienceLevel?: string;
  eventsCompleted?: number;
  skills: string[];
  verified: boolean;
  profileImage: string | null;
  phone?: string;
  email?: string;
  age?: number;
  bio?: string;
  availability?: string;
  createdAt?: string;
};

export default function AdminVolunteersPage() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'verified' | 'unverified'>('all');
  const [moveSteps, setMoveSteps] = useState(1);


  // Modal states
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null);
  const [zoomImage, setZoomImage] = useState<string | null>(null);

  const fetchVolunteers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/volunteers?admin=true&t=${Date.now()}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      });
      if (res.ok) {
        const data = await res.json();
        const list = Array.isArray(data) ? data : (data.data || []);
        setVolunteers(list);
      } else {
        showMessage('error', 'Failed to load volunteers from database');
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
    setTimeout(() => setMessage({ type: '', text: '' }), 4000);
  };

  const handleDelete = async (id: number | string) => {
    if (!window.confirm('Are you sure you want to delete this volunteer?')) return;

    try {
      const res = await fetch(`/api/volunteers/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        showMessage('success', 'Volunteer deleted successfully');
        if (selectedVolunteer && selectedVolunteer.id === id) {
          setSelectedVolunteer(null);
        }
        fetchVolunteers();
      } else {
        showMessage('error', 'Failed to delete volunteer');
      }
    } catch (error) {
      showMessage('error', 'An error occurred');
    }
  };

  const handleToggleVerify = async (id: number | string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/volunteers/${id}/verify`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verified: !currentStatus }),
      });

      if (res.ok) {
        showMessage('success', `Volunteer ${!currentStatus ? 'verified' : 'unverified'}`);
        // Update local state immediately for instant feedback
        setVolunteers((prev) =>
          prev.map((v) => (v.id === id ? { ...v, verified: !currentStatus } : v))
        );
        if (selectedVolunteer && selectedVolunteer.id === id) {
          setSelectedVolunteer((prev) => prev ? { ...prev, verified: !currentStatus } : null);
        }
      } else {
        showMessage('error', 'Failed to update status');
      }
    } catch (error) {
      showMessage('error', 'An error occurred');
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const steps = moveSteps; // number of positions to move
    const newVolunteers = [...volunteers];
    // Remove the volunteer at current index
    const [moved] = newVolunteers.splice(index, 1);
    // Determine new index based on direction and steps
    const newIndex = direction === 'up' ? index - steps : index + steps;
    // Clamp newIndex within array bounds
    const clampedIndex = Math.max(0, Math.min(newVolunteers.length, newIndex));
    // Insert volunteer at new position
    newVolunteers.splice(clampedIndex, 0, moved);

    setVolunteers(newVolunteers);

    try {
      const res = await fetch('/api/volunteers/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ volunteerIds: newVolunteers.map((v) => v.id) }),
      });

      if (res.ok) {
        showMessage('success', 'Order updated & live on website!');
      } else {
        showMessage('error', 'Failed to update order');
      }
    } catch {
      showMessage('error', 'Error reordering volunteers');
    }
  };

// Drag‑and‑drop handling
  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = filteredVolunteers.findIndex(v => v.id === active.id);
    const newIndex = filteredVolunteers.findIndex(v => v.id === over.id);
    const reordered = arrayMove(filteredVolunteers, oldIndex, newIndex);
    setVolunteers(reordered);
    // Persist order
    fetch('/api/volunteers/reorder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ volunteerIds: reordered.map(v => v.id) }),
    })
      .then(res => {
        if (res.ok) showMessage('success', 'Order updated & live on website!');
        else showMessage('error', 'Failed to update order');
      })
      .catch(() => showMessage('error', 'Failed to update order'));
  };

  // Sortable row component
  const SortableItem = ({ id, children }: { id: any; children: React.ReactNode }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    } as React.CSSProperties;
    return (
      <tr ref={setNodeRef} style={style} {...attributes} {...listeners} className="hover:bg-blue-50/30 transition-colors">
        {children}
      </tr>
    );
  };

  // Filtered volunteers
  const filteredVolunteers = volunteers.filter((v) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      v.name?.toLowerCase().includes(q) ||
      v.location?.toLowerCase().includes(q) ||
      v.phone?.includes(q) ||
      v.email?.toLowerCase().includes(q) ||
      v.skills?.some((s) => s.toLowerCase().includes(q));

    if (!matchesSearch) return false;

    if (filterStatus === 'verified') return v.verified;
    if (filterStatus === 'unverified') return !v.verified;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {message.text && (
        <div
          className={`p-4 rounded-xl text-sm font-medium flex items-center justify-between shadow-sm ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          <span>{message.text}</span>
          <button onClick={() => setMessage({ type: '', text: '' })} className="font-bold opacity-60 hover:opacity-100">
            ✕
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Volunteers Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            Connected to Database • Total {volunteers.length} registered volunteers
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchVolunteers}
            className="px-4 py-2 border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-semibold rounded-xl transition-colors flex items-center gap-2"
            title="Refresh database"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
          <Link
            href="/admin/volunteers/new"
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            Add Volunteer
          </Link>
        </div>
      </div>

      {/* Filters & Search Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <input
            type="text"
            placeholder="Search by name, phone, city, or skill..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          />
          <svg className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-2.5 text-xs text-gray-400 hover:text-gray-600">
              ✕
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs font-semibold text-gray-400 uppercase mr-1">Status:</span>
          {(['all', 'verified', 'unverified'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                filterStatus === status
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {status} {status === 'all' ? `(${volunteers.length})` : status === 'verified' ? `(${volunteers.filter(v => v.verified).length})` : `(${volunteers.filter(v => !v.verified).length})`}
            </button>
          ))}
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col justify-center items-center p-16 space-y-3">
            <div className="animate-spin rounded-full h-9 w-9 border-b-2 border-blue-600"></div>
            <p className="text-sm text-gray-400 font-medium">Fetching volunteers from Neon Database...</p>
          </div>
        ) : filteredVolunteers.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
              👥
            </div>
            <p className="text-gray-700 font-semibold text-base mb-1">
              {volunteers.length === 0 ? 'No volunteers found in database.' : 'No volunteers matching your search.'}
            </p>
            <p className="text-gray-400 text-sm mb-6">
              {volunteers.length === 0 ? 'Volunteers who join from website or added by admin will appear here.' : 'Try changing your search terms or filter.'}
            </p>
            <Link
              href="/admin/volunteers/new"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm"
            >
              + Add Volunteer
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <th className="py-4 px-6">Photo</th>
                  <th className="py-4 px-6">Volunteer Name & Contact</th>
                  <th className="py-4 px-6">Location</th>
                  <th className="py-4 px-6">Experience</th>
                  <th className="py-4 px-6">Skills</th>
                  <th className="py-4 px-6">Verification</th>
                  <th className="py-4 px-4 text-center">Shuffle</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
  <SortableContext items={filteredVolunteers.map(v => v.id)} strategy={verticalListSortingStrategy}>
    <tbody className="divide-y divide-gray-100 text-sm">
                {filteredVolunteers.map((v, idx) => (
                  <SortableItem id={v.id} key={v.id}>
                    {/* Profile Photo */}
                    <td className="py-4 px-6">
                      <div className="relative group w-12 h-12">
                        {v.profileImage ? (
                          <img
                            src={v.profileImage}
                            alt={v.name}
                            onClick={() => setZoomImage(v.profileImage)}
                            onError={(e) => {
                              // If image fails, replace with initial avatar
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                            className="w-12 h-12 rounded-xl object-cover border border-gray-200 shadow-xs cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
                            title="Click to zoom image"
                          />
                        ) : (
                          <div
                            onClick={() => setSelectedVolunteer(v)}
                            className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-base shadow-xs cursor-pointer"
                            title="Click to view details"
                          >
                            {v.name ? v.name.charAt(0).toUpperCase() : 'V'}
                          </div>
                        )}
                        {v.verified && (
                          <span
                            className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 text-white rounded-full flex items-center justify-center text-[10px] shadow"
                            title="Verified"
                          >
                            ✓
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Name & Contact */}
                    <td className="py-4 px-6">
                      <button
                        onClick={() => setSelectedVolunteer(v)}
                        className="font-bold text-gray-900 hover:text-blue-600 text-left block text-sm transition-colors"
                      >
                        {v.name}
                      </button>
                      <div className="flex flex-col gap-0.5 text-xs text-gray-500 mt-1">
                        {v.phone && (
                          <span className="flex items-center gap-1 font-mono text-gray-600">
                            📞 {v.phone}
                          </span>
                        )}
                        {v.email && (
                          <span className="flex items-center gap-1 text-gray-400 truncate max-w-[180px]">
                            ✉️ {v.email}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Location */}
                    <td className="py-4 px-6 text-gray-600 font-medium">
                      <span className="inline-flex items-center gap-1">
                        📍 {v.location || 'Not specified'}
                      </span>
                      {v.age ? <span className="block text-xs text-gray-400">{v.age} yrs old</span> : null}
                    </td>

                    {/* Experience */}
                    <td className="py-4 px-6">
                      <div className="text-gray-900 font-semibold text-xs">
                        {v.yearsExperience ?? 0} {v.yearsExperience === 1 ? 'Year' : 'Years'} Exp
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        {v.eventsCompleted ?? 0} Gigs Done
                      </div>
                    </td>

                    {/* Skills */}
                    <td className="py-4 px-6">
                      <div className="flex flex-wrap gap-1 max-w-[180px]">
                        {Array.isArray(v.skills) && v.skills.length > 0 ? (
                          <>
                            {v.skills.slice(0, 2).map((skill, i) => (
                              <span
                                key={i}
                                className="inline-block px-2 py-0.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-md truncate max-w-[90px]"
                              >
                                {skill}
                              </span>
                            ))}
                            {v.skills.length > 2 && (
                              <span className="inline-block px-1.5 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-md">
                                +{v.skills.length - 2}
                              </span>
                            )}
                          </>
                        ) : (
                          <span className="text-xs text-gray-400 italic">No skills listed</span>
                        )}
                      </div>
                    </td>

                    {/* Verification Toggle */}
                    <td className="py-4 px-6">
                      <button
                        onClick={() => handleToggleVerify(v.id, v.verified)}
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold cursor-pointer transition-all shadow-xs ${
                          v.verified
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-300'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                        }`}
                        title="Click to toggle verification status"
                      >
                        {v.verified ? '✓ Verified' : '○ Unverified'}
                      </button>
                    </td>

                    {/* Shuffle / Reorder Controls */}
                    <td className="py-4 px-4 text-center whitespace-nowrap">
            <div className="cursor-grab" title="Drag to reorder">
    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16" />
    </svg>
  </div>
</td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right whitespace-nowrap space-x-2">
                      <button
                        onClick={() => setSelectedVolunteer(v)}
                        className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-lg transition-colors"
                      >
                        View Details
                      </button>
                      <Link
                        href={`/admin/volunteers/${v.id}/edit`}
                        className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-lg transition-colors"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(v.id)}
                        className="px-2.5 py-1.5 text-red-600 hover:bg-red-50 text-xs font-bold rounded-lg transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </SortableItem>
                ))}
              </tbody>
</SortableContext>
</DndContext>
            </table>
          </div>
        )}
      </div>

      {/* Volunteer Details Modal */}
      {selectedVolunteer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 p-6 sm:p-8 relative">
            {/* Close button */}
            <button
              onClick={() => setSelectedVolunteer(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 font-bold flex items-center justify-center transition-colors"
            >
              ✕
            </button>

            {/* Header info */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 pb-6 border-b border-gray-100">
              <div className="relative">
                {selectedVolunteer.profileImage ? (
                  <img
                    src={selectedVolunteer.profileImage}
                    alt={selectedVolunteer.name}
                    onClick={() => setZoomImage(selectedVolunteer.profileImage)}
                    className="w-24 h-24 rounded-2xl object-cover border-2 border-blue-500 shadow-md cursor-pointer hover:scale-105 transition-transform"
                    title="Click to view full photo"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-black text-3xl flex items-center justify-center shadow-md">
                    {selectedVolunteer.name.charAt(0).toUpperCase()}
                  </div>
                )}
                {selectedVolunteer.verified && (
                  <span className="absolute -bottom-2 -right-2 px-2 py-0.5 bg-blue-600 text-white text-[10px] font-bold rounded-full shadow">
                    VERIFIED
                  </span>
                )}
              </div>

              <div className="text-center sm:text-left flex-1">
                <h2 className="text-2xl font-bold text-gray-900">{selectedVolunteer.name}</h2>
                <p className="text-sm text-gray-500 mt-1 flex items-center justify-center sm:justify-start gap-1">
                  📍 {selectedVolunteer.location || 'Location not specified'}
                  {selectedVolunteer.age ? ` • ${selectedVolunteer.age} years old` : ''}
                </p>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-3">
                  <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg border border-blue-100">
                    {selectedVolunteer.yearsExperience ?? 0} Years Exp
                  </span>
                  <span className="px-2.5 py-1 bg-purple-50 text-purple-700 text-xs font-bold rounded-lg border border-purple-100">
                    {selectedVolunteer.eventsCompleted ?? 0} Gigs Completed
                  </span>
                  <span
                    className={`px-2.5 py-1 text-xs font-bold rounded-lg border ${
                      selectedVolunteer.availability === 'unavailable'
                        ? 'bg-red-50 text-red-700 border-red-200'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}
                  >
                    {selectedVolunteer.availability === 'unavailable' ? 'Unavailable' : 'Available for Gigs'}
                  </span>
                </div>
              </div>
            </div>

            {/* Contact details */}
            <div className="py-5 border-b border-gray-100 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Contact Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-gray-50 rounded-xl">
                  <span className="text-xs text-gray-500 block">Phone Number</span>
                  <div className="flex items-center justify-between mt-1">
                    <span className="font-mono font-bold text-gray-900 text-sm">
                      {selectedVolunteer.phone || 'N/A'}
                    </span>
                    {selectedVolunteer.phone && (
                      <div className="flex gap-2">
                        <a
                          href={`tel:${selectedVolunteer.phone}`}
                          className="text-xs font-bold text-blue-600 hover:underline"
                        >
                          Call
                        </a>
                        <a
                          href={`https://wa.me/${selectedVolunteer.phone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-bold text-emerald-600 hover:underline"
                        >
                          WhatsApp
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-3 bg-gray-50 rounded-xl">
                  <span className="text-xs text-gray-500 block">Email Address</span>
                  <div className="flex items-center justify-between mt-1">
                    <span className="font-medium text-gray-900 text-sm truncate">
                      {selectedVolunteer.email || 'N/A'}
                    </span>
                    {selectedVolunteer.email && (
                      <a
                        href={`mailto:${selectedVolunteer.email}`}
                        className="text-xs font-bold text-blue-600 hover:underline ml-2"
                      >
                        Email
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Bio */}
            {selectedVolunteer.bio && (
              <div className="py-5 border-b border-gray-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">About / Bio</h3>
                <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-xl">
                  {selectedVolunteer.bio}
                </p>
              </div>
            )}

            {/* Skills */}
            <div className="py-5 border-b border-gray-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Volunteer Skills</h3>
              <div className="flex flex-wrap gap-1.5">
                {Array.isArray(selectedVolunteer.skills) && selectedVolunteer.skills.length > 0 ? (
                  selectedVolunteer.skills.map((s, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-indigo-50 text-indigo-700 font-semibold text-xs rounded-lg border border-indigo-100"
                    >
                      {s}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-gray-400 italic">No skills listed</span>
                )}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-6 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => handleToggleVerify(selectedVolunteer.id, selectedVolunteer.verified)}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                  selectedVolunteer.verified
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm'
                }`}
              >
                {selectedVolunteer.verified ? 'Mark as Unverified' : '✓ Verify This Volunteer'}
              </button>

              <div className="flex gap-2">
                <Link
                  href={`/admin/volunteers/${selectedVolunteer.id}/edit`}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors shadow-sm"
                >
                  Edit Profile
                </Link>
                <button
                  onClick={() => setSelectedVolunteer(null)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Zoom Lightbox Modal */}
      {zoomImage && (
        <div
          onClick={() => setZoomImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm cursor-zoom-out animate-in fade-in"
        >
          <div className="relative max-w-2xl max-h-[85vh] p-2 bg-white rounded-2xl shadow-2xl">
            <img
              src={zoomImage}
              alt="Volunteer Full Photo"
              className="max-h-[80vh] w-auto rounded-xl object-contain mx-auto"
            />
            <button
              onClick={() => setZoomImage(null)}
              className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white text-gray-800 shadow-lg font-bold flex items-center justify-center"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

