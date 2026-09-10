'use client';

import React, { useState, useEffect } from 'react';

type Request = {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  eventName: string;
  eventDate: string;
  location: string;
  volunteersNeeded: number;
  requirements: string;
  skills: string[];
  status: 'pending' | 'reviewed' | 'completed';
  createdAt: string;
};

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'reviewed' | 'completed'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/requests');
      if (res.ok) {
        const data = await res.json();
        setRequests(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
      showMessage('error', 'Failed to load requests');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/requests/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        showMessage('success', 'Status updated successfully');
        setRequests(requests.map(r => r.id === id ? { ...r, status: newStatus as any } : r));
      } else {
        showMessage('error', 'Failed to update status');
      }
    } catch (error) {
      showMessage('error', 'An error occurred');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this request?')) return;

    try {
      const res = await fetch(`/api/requests/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        showMessage('success', 'Request deleted successfully');
        setRequests(requests.filter(r => r.id !== id));
      } else {
        showMessage('error', 'Failed to delete request');
      }
    } catch (error) {
      showMessage('error', 'An error occurred');
    }
  };

  const filteredRequests = filter === 'all' 
    ? requests 
    : requests.filter(r => r.status === filter);

  return (
    <div className="max-w-6xl mx-auto pb-12">
      {message.text && (
        <div className={`mb-4 p-4 rounded-lg text-sm font-medium ${
          message.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      <h1 className="text-3xl font-bold text-gray-900 mb-8">Company Requests</h1>

      <div className="flex space-x-2 mb-6">
        {(['all', 'pending', 'reviewed', 'completed'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
              filter === f
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            No requests found in this category.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="py-4 px-6 text-sm font-medium text-gray-500">Company</th>
                  <th className="py-4 px-6 text-sm font-medium text-gray-500">Contact</th>
                  <th className="py-4 px-6 text-sm font-medium text-gray-500">Event</th>
                  <th className="py-4 px-6 text-sm font-medium text-gray-500">Volunteers</th>
                  <th className="py-4 px-6 text-sm font-medium text-gray-500">Status</th>
                  <th className="py-4 px-6 text-sm font-medium text-gray-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredRequests.map((req) => (
                  <React.Fragment key={req.id}>
                    <tr 
                      className={`hover:bg-gray-50 transition-colors cursor-pointer ${expandedId === req.id ? 'bg-blue-50/30' : ''}`}
                      onClick={() => setExpandedId(expandedId === req.id ? null : req.id)}
                    >
                      <td className="py-4 px-6 text-sm font-medium text-gray-900">{req.companyName}</td>
                      <td className="py-4 px-6 text-sm text-gray-600">{req.contactName}</td>
                      <td className="py-4 px-6">
                        <div className="text-sm font-medium text-gray-900">{req.eventName}</div>
                        <div className="text-xs text-gray-500">{new Date(req.eventDate).toLocaleDateString()}</div>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600">{req.volunteersNeeded}</td>
                      <td className="py-4 px-6">
                        <select
                          value={req.status}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleStatusUpdate(req.id, e.target.value);
                          }}
                          className={`text-xs font-medium rounded-full px-2.5 py-1 outline-none cursor-pointer border-r-8 border-transparent ${
                            req.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                            req.status === 'reviewed' ? 'bg-blue-100 text-blue-800' :
                            'bg-amber-100 text-amber-800'
                          }`}
                        >
                          <option value="pending">Pending</option>
                          <option value="reviewed">Reviewed</option>
                          <option value="completed">Completed</option>
                        </select>
                      </td>
                      <td className="py-4 px-6 text-right space-x-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedId(expandedId === req.id ? null : req.id);
                          }}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          {expandedId === req.id ? 'Hide' : 'View'}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(req.id);
                          }}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                    {expandedId === req.id && (
                      <tr>
                        <td colSpan={6} className="px-6 py-4 bg-gray-50 border-b border-gray-100">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h4 className="text-sm font-bold text-gray-900 mb-2">Contact Information</h4>
                              <p className="text-sm text-gray-600"><strong>Email:</strong> {req.email}</p>
                              <p className="text-sm text-gray-600"><strong>Phone:</strong> {req.phone}</p>
                              <p className="text-sm text-gray-600"><strong>Location:</strong> {req.location}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-gray-900 mb-2">Requirements</h4>
                              <p className="text-sm text-gray-600 mb-2">{req.requirements}</p>
                              <div className="flex flex-wrap gap-1">
                                {req.skills.map((skill, i) => (
                                  <span key={i} className="inline-block px-2 py-0.5 bg-white border border-gray-200 text-gray-600 text-xs rounded-full">
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
