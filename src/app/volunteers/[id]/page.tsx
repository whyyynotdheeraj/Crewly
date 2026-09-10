'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import VerifiedBadge from '@/components/VerifiedBadge';
import SkillTag from '@/components/SkillTag';
import ExperienceCard from '@/components/ExperienceCard';
import ImageGallery from '@/components/ImageGallery';
import { getInitials, generateAvatarColor } from '@/lib/utils';

export default function VolunteerProfilePage() {
  const params = useParams();
  const id = params.id as string;
  
  const [volunteer, setVolunteer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchVolunteer = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/volunteers/${id}`);
        if (res.ok) {
          const data = await res.json();
          setVolunteer(data);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchVolunteer();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f8fafc]">
        <Navbar />
        <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="animate-pulse space-y-8">
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
              <div className="w-48 h-48 bg-slate-200 rounded-3xl"></div>
              <div className="flex-1 space-y-4 w-full">
                <div className="h-10 bg-slate-200 rounded-xl w-1/2"></div>
                <div className="h-6 bg-slate-200 rounded-lg w-1/3"></div>
                <div className="flex gap-4 pt-4">
                  <div className="h-10 bg-slate-200 rounded-xl w-28"></div>
                  <div className="h-10 bg-slate-200 rounded-xl w-28"></div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !volunteer) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f8fafc]">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center py-20 px-4">
          <h1 className="text-3xl font-black text-slate-900 mb-3">Volunteer Not Found</h1>
          <p className="text-slate-500 mb-8">The profile you are looking for doesn't exist or has been removed.</p>
          <Link href="/volunteers" className="btn-premium-gradient px-8 py-3.5 rounded-2xl font-bold shadow-xl">
            ← Back to Directory
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  // Format images
  const allImages: { url: string; caption?: string }[] = [];
  if (volunteer.experiences && Array.isArray(volunteer.experiences)) {
    for (const exp of volunteer.experiences) {
      if (Array.isArray(exp.images)) {
        for (const img of exp.images) {
          if (typeof img === 'string' && img) {
            allImages.push({
              url: img,
              caption: `${exp.eventName} — ${exp.role || 'Volunteer'} (${exp.year || ''})`,
            });
          } else if (img && typeof img.url === 'string') {
            allImages.push(img);
          }
        }
      }
    }
  }

  const isAvailable =
    volunteer.availability !== undefined
      ? volunteer.availability === 'available'
      : volunteer.available !== false;

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900">
      <Navbar />

      {/* Ambient background glow */}
      <div className="fixed top-12 left-1/3 w-[35rem] h-[25rem] bg-indigo-200/35 rounded-full blur-[130px] pointer-events-none" />
      <div className="fixed top-1/2 right-12 w-[30rem] h-[25rem] bg-pink-200/25 rounded-full blur-[130px] pointer-events-none" />

      <main className="flex-1 relative z-10">
        {/* Top Profile Header Section */}
        <section className="bg-white/80 backdrop-blur-xl py-14 border-b border-slate-200/80 shadow-sm">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
              
              {/* Photo with 3D shadow */}
              <div className="flex-shrink-0 relative">
                {volunteer.profileImage ? (
                  <img
                    src={volunteer.profileImage}
                    alt={volunteer.name}
                    className="w-44 h-44 rounded-3xl object-cover shadow-3d-xl border-2 border-white"
                  />
                ) : (
                  <div
                    className="w-44 h-44 rounded-3xl flex items-center justify-center text-5xl font-black text-white shadow-3d-xl"
                    style={{ backgroundColor: generateAvatarColor(volunteer.name) }}
                  >
                    {getInitials(volunteer.name)}
                  </div>
                )}
                {volunteer.verified && (
                  <span className="absolute -bottom-2 -right-2 bg-indigo-600 text-white rounded-full p-1.5 shadow-md">
                    <VerifiedBadge size="sm" />
                  </span>
                )}
              </div>

              {/* Volunteer Details */}
              <div className="flex-1 text-center md:text-left pt-1 space-y-3">
                <div className="flex flex-col md:flex-row md:items-center gap-3 justify-center md:justify-start">
                  <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">{volunteer.name}</h1>
                </div>

                <p className="text-base font-semibold text-slate-500 flex items-center justify-center md:justify-start gap-1.5">
                  <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{volunteer.location || 'Location not specified'}</span>
                </p>
                
                {/* 3D Stat Badges */}
                <div className="flex flex-wrap gap-2.5 justify-center md:justify-start pt-2">
                  <div className="bg-slate-50 border border-slate-200 px-4 py-2 rounded-2xl shadow-xs flex flex-col">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Experience</span>
                    <span className="font-black text-slate-900">{volunteer.yearsExperience || 0}+ Years</span>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 px-4 py-2 rounded-2xl shadow-xs flex flex-col">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Events Completed</span>
                    <span className="font-black text-indigo-600">{volunteer.eventsCompleted || 0} Events</span>
                  </div>

                  {volunteer.age && (
                    <div className="bg-slate-50 border border-slate-200 px-4 py-2 rounded-2xl shadow-xs flex flex-col">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Age</span>
                      <span className="font-black text-slate-900">{volunteer.age} Yrs</span>
                    </div>
                  )}

                  <div className="bg-slate-50 border border-slate-200 px-4 py-2 rounded-2xl shadow-xs flex flex-col">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Status</span>
                    <span className={`font-black text-xs mt-0.5 flex items-center gap-1.5 ${isAvailable ? 'text-emerald-600' : 'text-slate-500'}`}>
                      <span className={`w-2 h-2 rounded-full ${isAvailable ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
                      {isAvailable ? 'Available Now' : 'Busy'}
                    </span>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* Profile Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
          
          {/* About */}
          <section className="bg-white rounded-[2rem] p-8 border border-slate-200/80 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-3">About {volunteer.name}</h2>
            <div className="text-slate-600 leading-relaxed text-sm sm:text-base">
              {volunteer.bio ? (
                <p className="whitespace-pre-wrap">{volunteer.bio}</p>
              ) : (
                <p className="text-slate-400 italic">No biography provided yet.</p>
              )}
            </div>

            {/* Skills */}
            <div className="mt-6 pt-6 border-t border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Core Skills</h3>
              <div className="flex flex-wrap gap-2">
                {volunteer.skills && volunteer.skills.length > 0 ? (
                  volunteer.skills.map((skill: string, index: number) => (
                    <SkillTag key={index} skill={skill} />
                  ))
                ) : (
                  <span className="text-slate-400 text-sm">No skills listed.</span>
                )}
              </div>
            </div>
          </section>

          {/* Event Experience Cards */}
          <section className="bg-white rounded-[2rem] p-8 border border-slate-200/80 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Verified Past Events Experience</h2>
            {volunteer.experiences && volunteer.experiences.length > 0 ? (
              <div className="space-y-6">
                {volunteer.experiences.map((exp: any) => (
                  <ExperienceCard key={exp.id || Math.random()} experience={exp} />
                ))}
              </div>
            ) : (
              <div className="bg-slate-50 rounded-2xl p-8 text-center border border-slate-200">
                <p className="text-slate-500 text-sm">No specific event records logged yet.</p>
              </div>
            )}
          </section>

          {/* Photos Gallery */}
          {allImages.length > 0 && (
            <section className="bg-white rounded-[2rem] p-8 border border-slate-200/80 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-6">On-Ground Event Photos</h2>
              <ImageGallery images={allImages} />
            </section>
          )}

          {/* Request / Hire CTA */}
          <section className="pb-12">
            <div className="bg-gradient-to-tr from-indigo-900 via-slate-900 to-purple-950 rounded-[2rem] p-8 sm:p-10 text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h2 className="text-2xl font-black mb-2">Want to book {volunteer.name} for your event?</h2>
                <p className="text-slate-300 text-sm max-w-md">
                  Submit your event details and get connected with {volunteer.name} directly.
                </p>
              </div>
              <Link 
                href={`/request?volunteer=${id}&name=${encodeURIComponent(volunteer.name)}`} 
                className="btn-premium-gradient font-bold px-8 py-4 rounded-2xl text-sm shadow-xl flex-shrink-0"
              >
                Request this Volunteer →
              </Link>
            </div>
          </section>

        </div>
      </main>
      <Footer />
    </div>
  );
}
