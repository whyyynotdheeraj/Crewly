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
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start mb-12">
              <div className="w-48 h-48 bg-gray-200 rounded-2xl"></div>
              <div className="flex-1 space-y-4 w-full">
                <div className="h-10 bg-gray-200 rounded w-1/2 mx-auto md:mx-0"></div>
                <div className="h-6 bg-gray-200 rounded w-1/3 mx-auto md:mx-0"></div>
                <div className="flex justify-center md:justify-start gap-4 pt-4">
                  <div className="h-8 bg-gray-200 rounded-full w-24"></div>
                  <div className="h-8 bg-gray-200 rounded-full w-24"></div>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              <div className="h-24 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !volunteer) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center py-20 px-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Volunteer Not Found</h1>
          <p className="text-gray-600 mb-8">The profile you are looking for doesn't exist or has been removed.</p>
          <Link href="/volunteers" className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors">
            Back to Volunteer Directory
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  // Format all images from experiences for ImageGallery
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
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        {/* Top Section */}
        <section className="bg-gray-50 py-12 border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
              <div className="flex-shrink-0">
                {volunteer.profileImage ? (
                  <img
                    src={volunteer.profileImage}
                    alt={volunteer.name}
                    className="w-48 h-48 rounded-2xl object-cover shadow-sm border border-gray-200"
                  />
                ) : (
                  <div
                    className="w-48 h-48 rounded-2xl flex items-center justify-center text-5xl font-bold text-white shadow-sm"
                    style={{ backgroundColor: generateAvatarColor(volunteer.name) }}
                  >
                    {getInitials(volunteer.name)}
                  </div>
                )}
              </div>
              <div className="flex-1 text-center md:text-left pt-2">
                <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2 justify-center md:justify-start">
                  <h1 className="text-4xl font-bold text-gray-900">{volunteer.name}</h1>
                  {volunteer.verified && <VerifiedBadge size="md" />}
                </div>
                <p className="text-xl text-gray-600 mb-6 flex items-center justify-center md:justify-start gap-2">
                  <span className="text-gray-400">📍</span> {volunteer.location || 'Location not specified'}
                </p>
                
                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                  <div className="bg-white border border-gray-200 px-4 py-2 rounded-lg shadow-sm flex flex-col">
                    <span className="text-xs text-gray-500 font-medium">Experience</span>
                    <span className="font-semibold text-gray-900">{volunteer.yearsExperience || 0}+ Years</span>
                  </div>
                  <div className="bg-white border border-gray-200 px-4 py-2 rounded-lg shadow-sm flex flex-col">
                    <span className="text-xs text-gray-500 font-medium">Events</span>
                    <span className="font-semibold text-gray-900">{volunteer.eventsCompleted || 0} Completed</span>
                  </div>
                  {volunteer.age && (
                    <div className="bg-white border border-gray-200 px-4 py-2 rounded-lg shadow-sm flex flex-col">
                      <span className="text-xs text-gray-500 font-medium">Age</span>
                      <span className="font-semibold text-gray-900">{volunteer.age} Yrs</span>
                    </div>
                  )}
                  <div className="bg-white border border-gray-200 px-4 py-2 rounded-lg shadow-sm flex flex-col">
                    <span className="text-xs text-gray-500 font-medium">Status</span>
                    <span className={`font-semibold text-xs mt-1 ${isAvailable ? 'text-emerald-600' : 'text-gray-500'}`}>
                      {isAvailable ? '● Available' : '○ Unavailable'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
          {/* About */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">About</h2>
            <div className="prose text-gray-600 max-w-none">
              {volunteer.bio ? (
                <p className="whitespace-pre-wrap leading-relaxed">{volunteer.bio}</p>
              ) : (
                <p className="italic text-gray-400">No bio provided.</p>
              )}
            </div>
          </section>

          {/* Skills */}
          <section className="border-t border-gray-100 pt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Skills</h2>
            {volunteer.skills && volunteer.skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {volunteer.skills.map((skill: string) => (
                  <SkillTag key={skill} skill={skill} />
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No skills listed.</p>
            )}
          </section>

          {/* Experience */}
          <section className="border-t border-gray-100 pt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Event Experience</h2>
            {volunteer.experiences && volunteer.experiences.length > 0 ? (
              <div className="space-y-6">
                {volunteer.experiences.map((exp: any) => (
                  <ExperienceCard key={exp.id || Math.random()} experience={exp} />
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 rounded-xl p-8 text-center border border-gray-200">
                <p className="text-gray-500">No experience records yet.</p>
              </div>
            )}
          </section>

          {/* Experience Gallery */}
          {allImages.length > 0 && (
            <section className="border-t border-gray-100 pt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Experience Gallery</h2>
              <ImageGallery images={allImages} />
            </section>
          )}

          {/* Availability & Request CTA */}
          <section className="border-t border-gray-100 pt-8 pb-12">
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Interested in hiring this volunteer?</h2>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600 text-sm">Status:</span>
                  {isAvailable ? (
                    <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-semibold">
                      ✓ Available for Events
                    </span>
                  ) : (
                    <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold">
                      Currently Unavailable
                    </span>
                  )}
                </div>
              </div>
              <Link 
                href={`/request?volunteer=${id}&name=${encodeURIComponent(volunteer.name)}`} 
                className={`px-8 py-3 rounded-lg font-medium text-center transition-colors ${
                  isAvailable 
                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed pointer-events-none'
                }`}
              >
                Request this Volunteer
              </Link>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
