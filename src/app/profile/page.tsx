'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ProfileRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    async function checkAndRedirect() {
      try {
        const res = await fetch('/api/volunteer-auth/session');
        const data = await res.json();

        if (data.authenticated && data.user) {
          if (data.user.volunteerId) {
            router.replace(`/volunteers/${data.user.volunteerId}`);
          } else {
            router.replace('/join');
          }
        } else {
          router.replace('/auth/signin?callbackUrl=/profile');
        }
      } catch {
        router.replace('/join');
      }
    }

    checkAndRedirect();
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center py-20 px-4">
        <div className="w-10 h-10 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-600 font-medium">Opening your volunteer profile...</p>
      </main>
      <Footer />
    </div>
  );
}
