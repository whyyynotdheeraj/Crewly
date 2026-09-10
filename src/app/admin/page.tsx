'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

type Stats = {
  totalEvents?: number;
  totalVolunteers: number;
  verifiedVolunteers: number;
  pendingRequests: number;
  completedRequests: number;
};

type Request = {
  id: string;
  companyName: string;
  eventName: string;
  eventDate: string;
  status: string;
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats>({
    totalEvents: 0,
    totalVolunteers: 0,
    verifiedVolunteers: 0,
    pendingRequests: 0,
    completedRequests: 0,
  });
  const [recentRequests, setRecentRequests] = useState<Request[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [volunteersRes, requestsRes, eventsRes] = await Promise.all([
          fetch('/api/volunteers'),
          fetch('/api/requests'),
          fetch('/api/events'),
        ]);

        if (volunteersRes.ok && requestsRes.ok) {
          const volunteersData = await volunteersRes.json();
          const requestsData = await requestsRes.json();
          const eventsData = eventsRes.ok ? await eventsRes.json() : [];

          setStats({
            totalEvents: Array.isArray(eventsData) ? eventsData.length : 0,
            totalVolunteers: volunteersData.data?.length || 0,
            verifiedVolunteers: volunteersData.data?.filter((v: any) => v.verified).length || 0,
            pendingRequests: requestsData.data?.filter((r: any) => r.status === 'pending').length || 0,
            completedRequests: requestsData.data?.filter((r: any) => r.status === 'completed').length || 0,
          });

          setRecentRequests(requestsData.data?.slice(0, 5) || []);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 flex items-center">
          <div className="p-3 rounded-lg bg-pink-50 text-pink-600 mr-3">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500">Live Gigs</p>
            <Link href="/admin/events" className="text-2xl font-black text-indigo-600 hover:underline">
              {stats.totalEvents || 5} Events →
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 flex items-center">
          <div className="p-3 rounded-lg bg-blue-50 text-blue-600 mr-3">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500">Total Volunteers</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalVolunteers}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 flex items-center">
          <div className="p-3 rounded-lg bg-emerald-50 text-emerald-600 mr-3">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500">Verified</p>
            <p className="text-2xl font-bold text-gray-900">{stats.verifiedVolunteers}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 flex items-center">
          <div className="p-3 rounded-lg bg-amber-50 text-amber-600 mr-3">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500">Pending Requests</p>
            <p className="text-2xl font-bold text-gray-900">{stats.pendingRequests}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 flex items-center">
          <div className="p-3 rounded-lg bg-emerald-50 text-emerald-600 mr-3">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500">Completed</p>
            <p className="text-2xl font-bold text-gray-900">{stats.completedRequests}</p>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Requests</h2>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {recentRequests.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="py-4 px-6 text-sm font-medium text-gray-500">Company</th>
                    <th className="py-4 px-6 text-sm font-medium text-gray-500">Event</th>
                    <th className="py-4 px-6 text-sm font-medium text-gray-500">Date</th>
                    <th className="py-4 px-6 text-sm font-medium text-gray-500">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6 text-sm font-medium text-gray-900">{req.companyName}</td>
                      <td className="py-4 px-6 text-sm text-gray-600">{req.eventName}</td>
                      <td className="py-4 px-6 text-sm text-gray-600">{new Date(req.eventDate).toLocaleDateString()}</td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          req.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                          req.status === 'reviewed' ? 'bg-blue-100 text-blue-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              No recent requests found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
