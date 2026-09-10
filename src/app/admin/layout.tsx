'use client';

import AdminGuard from '@/components/AdminGuard';
import AdminSidebar from '@/components/AdminSidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </AdminGuard>
  );
}
