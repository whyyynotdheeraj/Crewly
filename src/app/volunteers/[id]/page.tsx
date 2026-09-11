'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SkillTag from '@/components/SkillTag';
import ExperienceCard from '@/components/ExperienceCard';
import ImageGallery from '@/components/ImageGallery';
import { getInitials, generateAvatarColor } from '@/lib/utils';
import { VOLUNTEERS_UNLOCK_THRESHOLD } from '@/lib/config';

// Helper to compress images to Base64 in browser
function compressImageToBase64(file: File, maxWidth = 1000, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error('Image decode failed'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('File read failed'));
    reader.readAsDataURL(file);
  });
}

const POPULAR_SKILLS = [
  'Event Management',
  'Crowd Management',
  'Registration & Check-in',
  'VIP Protocol & Escort',
  'Stage Coordination',
  'Photography',
  'Social Media Coverage',
  'Sound & Light Support',
  'Hospitality Desk',
  'Logistics & Runner',
];

interface ExperienceItem {
  id?: string | number;
  eventName: string;
  eventType: string;
  role: string;
  year: number | string;
  description: string;
  images: string[];
}

export default function VolunteerProfilePage() {
  const params = useParams();
  const id = params.id as string;
  
  const [volunteer, setVolunteer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Edit Modal State
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'experiences'>('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form State
  const [editForm, setEditForm] = useState({
    name: '',
    phone: '',
    email: '',
    location: '',
    age: '' as number | string,
    bio: '',
    yearsExperience: 0,
    eventsCompleted: 0,
    availability: 'available',
    skills: [] as string[],
    profileImage: '',
    experiences: [] as ExperienceItem[],
  });

  const [customSkillInput, setCustomSkillInput] = useState('');
  const profileFileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingProfilePic, setUploadingProfilePic] = useState(false);

  const fetchVolunteer = async () => {
    try {
      const [authRes, volsRes, volRes, volAuthRes] = await Promise.all([
        fetch('/api/auth/check'),
        fetch('/api/volunteers'),
        fetch(`/api/volunteers/${id}?t=${Date.now()}`, { cache: 'no-store' }),
        fetch('/api/volunteer-auth/session'),
      ]);

      const authData = authRes.ok ? await authRes.json() : { authenticated: false };
      const volsData = volsRes.ok ? await volsRes.json() : [];
      const volAuthData = volAuthRes.ok ? await volAuthRes.json() : { authenticated: false, user: null };
      const totalCount = Array.isArray(volsData) ? volsData.length : (volsData.data?.length || 0);

      setIsAdmin(Boolean(authData.authenticated));

      if (volRes.ok) {
        const data = await volRes.json();
        setVolunteer(data);

        // Check if current user owns this profile
        const own = Boolean(
          volAuthData.authenticated && (
            String(volAuthData.user?.volunteerId) === String(id) ||
            (volAuthData.user?.email && data.email && volAuthData.user.email.toLowerCase() === data.email.toLowerCase())
          )
        );
        setIsOwnProfile(own);

        if (!authData.authenticated && !own && totalCount < VOLUNTEERS_UNLOCK_THRESHOLD) {
          setIsLocked(true);
        } else {
          setIsLocked(false);
        }
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

  useEffect(() => {
    if (id) {
      fetchVolunteer();
    }
  }, [id]);

  // Open edit modal directly if ?edit=true is in URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('edit') === 'true') {
        setIsEditing(true);
      }
    }
  }, []);

  // Sync edit form when volunteer data loads
  useEffect(() => {
    if (volunteer) {
      setEditForm({
        name: volunteer.name || '',
        phone: volunteer.phone || '',
        email: volunteer.email || '',
        location: volunteer.location || '',
        age: volunteer.age || '',
        bio: volunteer.bio || '',
        yearsExperience: volunteer.yearsExperience || 0,
        eventsCompleted: volunteer.eventsCompleted || 0,
        availability: volunteer.availability || (volunteer.available !== false ? 'available' : 'unavailable'),
        skills: Array.isArray(volunteer.skills) ? [...volunteer.skills] : [],
        profileImage: volunteer.profileImage || '',
        experiences: Array.isArray(volunteer.experiences)
          ? volunteer.experiences.map((exp: any) => ({
              id: exp.id || `exp-${Date.now()}-${Math.random()}`,
              eventName: exp.eventName || '',
              eventType: exp.eventType || 'Festival',
              role: exp.role || 'Volunteer',
              year: exp.year || new Date().getFullYear(),
              description: exp.description || '',
              images: Array.isArray(exp.images) ? [...exp.images] : exp.imageUrl ? [exp.imageUrl] : [],
            }))
          : [],
      });
    }
  }, [volunteer]);

  // Handle Profile Photo Upload from Device
  const handleProfilePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (JPG, PNG, WebP)');
      return;
    }
    setUploadingProfilePic(true);
    try {
      const dataUrl = await compressImageToBase64(file, 800, 0.82);
      setEditForm((prev) => ({ ...prev, profileImage: dataUrl }));
    } catch {
      alert('Failed to process image. Please try another photo.');
    } finally {
      setUploadingProfilePic(false);
    }
  };

  // Skill handlers
  const addSkill = (skillToAdd: string) => {
    const trimmed = skillToAdd.trim();
    if (!trimmed) return;
    if (!editForm.skills.includes(trimmed)) {
      setEditForm((prev) => ({ ...prev, skills: [...prev.skills, trimmed] }));
    }
    setCustomSkillInput('');
  };

  const removeSkill = (skillToRemove: string) => {
    setEditForm((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove),
    }));
  };

  // Experience handlers
  const handleAddExperience = () => {
    setEditForm((prev) => ({
      ...prev,
      experiences: [
        ...prev.experiences,
        {
          id: `new-${Date.now()}`,
          eventName: '',
          eventType: 'Festival',
          role: 'Event Volunteer',
          year: new Date().getFullYear(),
          description: '',
          images: [],
        },
      ],
    }));
  };

  const handleUpdateExperience = (index: number, field: keyof ExperienceItem, value: any) => {
    setEditForm((prev) => {
      const updated = [...prev.experiences];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, experiences: updated };
    });
  };

  const handleRemoveExperience = (index: number) => {
    setEditForm((prev) => ({
      ...prev,
      experiences: prev.experiences.filter((_, i) => i !== index),
    }));
  };

  const handleAddExperiencePhoto = async (index: number, file: File) => {
    try {
      const dataUrl = await compressImageToBase64(file, 1000, 0.82);
      setEditForm((prev) => {
        const updated = [...prev.experiences];
        const existingImages = updated[index].images || [];
        updated[index] = { ...updated[index], images: [...existingImages, dataUrl] };
        return { ...prev, experiences: updated };
      });
    } catch {
      alert('Could not process photo');
    }
  };

  const handleRemoveExperiencePhoto = (expIndex: number, photoIndex: number) => {
    setEditForm((prev) => {
      const updated = [...prev.experiences];
      updated[expIndex].images = updated[expIndex].images.filter((_, i) => i !== photoIndex);
      return { ...prev, experiences: updated };
    });
  };

  // Save to Database
  const handleSaveAll = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage(null);

    try {
      const res = await fetch(`/api/volunteers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });

      if (res.ok) {
        const updatedVolunteer = await res.json();
        setVolunteer(updatedVolunteer);
        setSaveMessage({
          type: 'success',
          text: 'Profile & experiences updated successfully in Database!',
        });
        setTimeout(() => {
          setIsEditing(false);
          setSaveMessage(null);
        }, 1500);
      } else {
        const errData = await res.json();
        setSaveMessage({
          type: 'error',
          text: errData.error || 'Failed to save changes. Please try again.',
        });
      }
    } catch {
      setSaveMessage({
        type: 'error',
        text: 'Network error occurred while saving.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const canEdit = isOwnProfile || isAdmin;

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

  if (isLocked) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900">
        <Navbar />
        <main className="flex-1 max-w-2xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center justify-between mb-6">
            <button
              type="button"
              onClick={() => window.history.length > 1 ? window.history.back() : window.location.href = '/'}
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-indigo-600 bg-white hover:bg-slate-50 px-4 py-2 rounded-xl border border-slate-200 shadow-xs transition-all active:scale-[0.98] cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back</span>
            </button>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-indigo-600 bg-white hover:bg-slate-50 px-4 py-2 rounded-xl border border-slate-200 shadow-xs transition-all"
            >
              <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span>Home</span>
            </Link>
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 sm:p-12 border border-indigo-100 shadow-3d-xl text-center space-y-6 w-full">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center mx-auto shadow-sm">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3.5 py-1 rounded-full border border-indigo-100">
                Founding Batch
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Profile Unlocking Soon
              </h1>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Individual volunteer profiles and portfolios are currently reserved and will be unlocked for public viewing once we hit 100 registered volunteers.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/join"
                className="px-8 py-3.5 rounded-xl btn-premium-gradient text-white font-bold text-sm shadow-md flex items-center justify-center gap-2"
              >
                <span>Join as a Volunteer</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
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
          <Link href="/join" className="btn-premium-gradient px-8 py-3.5 rounded-2xl font-bold shadow-xl">
            Join as a Volunteer
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  // Format images for public gallery
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
        <section className="bg-white/80 backdrop-blur-xl py-12 border-b border-slate-200/80 shadow-sm">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Navigation Actions (Back & Home) */}
            <div className="flex items-center justify-between mb-6">
              <button
                type="button"
                onClick={() => window.history.length > 1 ? window.history.back() : window.location.href = '/'}
                className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-indigo-600 bg-white hover:bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200 shadow-xs transition-all active:scale-[0.98] cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Back</span>
              </button>

              <div className="flex items-center gap-2">
                {canEdit && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    <span>Edit Profile & Experiences</span>
                  </button>
                )}

                <Link
                  href="/"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-indigo-600 bg-white hover:bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200 shadow-xs transition-all"
                >
                  <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span>Home</span>
                </Link>
              </div>
            </div>

            {/* Owner Management Notification Banner */}
            {canEdit && (
              <div className="mb-8 p-4 rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border border-blue-200 text-slate-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-slate-900">
                        {isAdmin ? 'Admin View: Editing Mode Available' : 'Your Volunteer Profile'}
                      </p>
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                        Database Connected
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">
                      You can update your personal details, phone, bio, and add photos of past events anytime.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="text-xs font-bold px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm flex items-center gap-1.5 transition-all self-end sm:self-center cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  <span>Edit Profile Now</span>
                </button>
              </div>
            )}

            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
              {/* Photo with Edit Badge */}
              <div className="flex-shrink-0 relative group">
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
                  <span
                    className="absolute -bottom-2 -right-2 bg-blue-600 text-white rounded-full p-1.5 shadow-md flex items-center justify-center"
                    title="Verified Volunteer"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                )}
                {canEdit && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="absolute inset-0 bg-black/40 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-xs font-bold gap-1 cursor-pointer"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Change Photo</span>
                  </button>
                )}
              </div>

              {/* Volunteer Details */}
              <div className="flex-1 text-center md:text-left pt-1 space-y-3">
                <div className="flex flex-col md:flex-row md:items-center gap-3 justify-center md:justify-start">
                  <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">{volunteer.name}</h1>
                  {canEdit && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-xs text-blue-600 hover:text-blue-800 font-bold flex items-center justify-center md:justify-start gap-1"
                    >
                      <span>(Edit)</span>
                    </button>
                  )}
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
          <section className="bg-white rounded-[2rem] p-8 border border-slate-200/80 shadow-sm relative">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-bold text-slate-900">About {volunteer.name}</h2>
              {canEdit && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  Edit Bio
                </button>
              )}
            </div>
            <div className="text-slate-600 leading-relaxed text-sm sm:text-base">
              {volunteer.bio ? (
                <p className="whitespace-pre-wrap">{volunteer.bio}</p>
              ) : (
                <p className="text-slate-400 italic">No biography provided yet. Click 'Edit Profile' to add your bio.</p>
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
                  <span className="text-slate-400 text-sm">No skills listed yet.</span>
                )}
              </div>
            </div>
          </section>

          {/* Event Experience Cards */}
          <section className="bg-white rounded-[2rem] p-8 border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">Verified Past Events Experience</h2>
              {canEdit && (
                <button
                  onClick={() => {
                    setActiveTab('experiences');
                    setIsEditing(true);
                  }}
                  className="text-xs font-bold px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg flex items-center gap-1 transition-colors"
                >
                  + Add / Edit Gigs
                </button>
              )}
            </div>
            {volunteer.experiences && volunteer.experiences.length > 0 ? (
              <div className="space-y-6">
                {volunteer.experiences.map((exp: any) => (
                  <ExperienceCard key={exp.id || Math.random()} experience={exp} />
                ))}
              </div>
            ) : (
              <div className="bg-slate-50 rounded-2xl p-8 text-center border border-slate-200 space-y-3">
                <p className="text-slate-500 text-sm">No specific event records logged yet.</p>
                {canEdit && (
                  <button
                    onClick={() => {
                      setActiveTab('experiences');
                      setIsEditing(true);
                    }}
                    className="text-xs font-bold text-blue-600 hover:underline"
                  >
                    + Add your first past event experience with photos
                  </button>
                )}
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

      {/* =========================================================================
          DIRECT EDIT PROFILE & EXPERIENCES MODAL WINDOW
      ========================================================================== */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-gray-100 overflow-hidden relative">
            
            {/* Modal Top Header */}
            <div className="p-5 sm:p-6 border-b border-gray-100 flex items-center justify-between bg-slate-50/70">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
                  <span>Edit Profile & Experience</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Update your volunteer details & past gigs directly in the database
                </p>
              </div>
              <button
                onClick={() => setIsEditing(false)}
                className="w-9 h-9 rounded-full bg-white hover:bg-gray-200 border border-gray-200 text-gray-500 font-bold flex items-center justify-center transition-colors shadow-xs"
              >
                ✕
              </button>
            </div>

            {/* Tab Selection Navigation */}
            <div className="flex border-b border-gray-200 bg-white px-6 pt-3">
              <button
                type="button"
                onClick={() => setActiveTab('profile')}
                className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
                  activeTab === 'profile'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                <span>👤 Profile Details</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('experiences')}
                className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
                  activeTab === 'experiences'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                <span>🎪 Past Gigs & Photos ({editForm.experiences.length})</span>
              </button>
            </div>

            {/* Form Body Scrollable Area */}
            <form onSubmit={handleSaveAll} className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
              
              {/* Alert message if any */}
              {saveMessage && (
                <div
                  className={`p-4 rounded-xl text-sm font-medium flex items-center gap-2 ${
                    saveMessage.type === 'success'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}
                >
                  <span>{saveMessage.type === 'success' ? '✓' : '⚠️'}</span>
                  <span>{saveMessage.text}</span>
                </div>
              )}

              {/* TAB 1: BASIC PROFILE DETAILS */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  
                  {/* Photo Section */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center gap-4">
                    <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-xs flex-shrink-0">
                      {editForm.profileImage ? (
                        <img
                          src={editForm.profileImage}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-bold text-slate-400 text-2xl">
                          {editForm.name ? editForm.name.charAt(0).toUpperCase() : 'V'}
                        </div>
                      )}
                      {uploadingProfilePic && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-xs font-bold">
                          Uploading...
                        </div>
                      )}
                    </div>

                    <div className="flex-1 space-y-2 text-center sm:text-left">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Profile Photo</p>
                      <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                        <input
                          type="file"
                          ref={profileFileInputRef}
                          onChange={handleProfilePhotoChange}
                          accept="image/*"
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => profileFileInputRef.current?.click()}
                          className="px-3.5 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold shadow-xs transition-colors"
                        >
                          📷 Choose from Laptop / Phone
                        </button>
                        {editForm.profileImage && (
                          <button
                            type="button"
                            onClick={() => setEditForm((p) => ({ ...p, profileImage: '' }))}
                            className="px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-xl text-xs font-bold"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <input
                        type="url"
                        placeholder="Or paste image URL (https://...)"
                        value={editForm.profileImage.startsWith('data:') ? '' : editForm.profileImage}
                        onChange={(e) => setEditForm((prev) => ({ ...prev, profileImage: e.target.value }))}
                        className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {/* Name & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={editForm.phone}
                        onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                        placeholder="e.g. 9876543210"
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                      />
                    </div>
                  </div>

                  {/* Location & Age */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                        City / Location *
                      </label>
                      <input
                        type="text"
                        required
                        value={editForm.location}
                        onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                        placeholder="e.g. Jaipur, Rajasthan"
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                        Age
                      </label>
                      <input
                        type="number"
                        min={16}
                        max={80}
                        value={editForm.age}
                        onChange={(e) => setEditForm({ ...editForm, age: e.target.value })}
                        placeholder="e.g. 21"
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                      />
                    </div>
                  </div>

                  {/* Experience Numbers & Availability */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                        Years of Experience
                      </label>
                      <input
                        type="number"
                        min={0}
                        max={30}
                        value={editForm.yearsExperience}
                        onChange={(e) => setEditForm({ ...editForm, yearsExperience: Number(e.target.value) || 0 })}
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                        Events Completed
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={editForm.eventsCompleted}
                        onChange={(e) => setEditForm({ ...editForm, eventsCompleted: Number(e.target.value) || 0 })}
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                        Availability Status
                      </label>
                      <select
                        value={editForm.availability}
                        onChange={(e) => setEditForm({ ...editForm, availability: e.target.value })}
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-600 font-semibold"
                      >
                        <option value="available">🟢 Available for Gigs</option>
                        <option value="unavailable">🔴 Currently Busy</option>
                      </select>
                    </div>
                  </div>

                  {/* Skills Section */}
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                      Skills & Specialties
                    </label>
                    <div className="flex flex-wrap gap-1.5 mb-2 min-h-[36px] p-2 bg-slate-50 border border-slate-200 rounded-xl">
                      {editForm.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-bold border border-indigo-200"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => removeSkill(skill)}
                            className="hover:text-red-600 font-bold ml-1"
                          >
                            ✕
                          </button>
                        </span>
                      ))}
                      {editForm.skills.length === 0 && (
                        <span className="text-xs text-slate-400 py-1">No skills added yet. Click suggestions below or type your own.</span>
                      )}
                    </div>

                    {/* Quick Suggestions */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      <span className="text-[10px] text-slate-400 font-bold uppercase self-center mr-1">Suggestions:</span>
                      {POPULAR_SKILLS.filter(s => !editForm.skills.includes(s)).slice(0, 6).map((s, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => addSkill(s)}
                          className="px-2.5 py-1 text-xs bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 rounded-lg font-medium transition-colors"
                        >
                          + {s}
                        </button>
                      ))}
                    </div>

                    {/* Custom Skill Input */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Add custom skill (e.g. VIP Protocol)..."
                        value={customSkillInput}
                        onChange={(e) => setCustomSkillInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addSkill(customSkillInput);
                          }
                        }}
                        className="flex-1 px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600"
                      />
                      <button
                        type="button"
                        onClick={() => addSkill(customSkillInput)}
                        className="px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-slate-900 transition-colors"
                      >
                        Add Skill
                      </button>
                    </div>
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                      About / Bio
                    </label>
                    <textarea
                      rows={4}
                      value={editForm.bio}
                      onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                      placeholder="Introduce yourself to event organizers. Mention your experience, past shows, crowd management skills, etc."
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: PAST EXPERIENCES & GIG PHOTOS */}
              {activeTab === 'experiences' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Your Past Event Experiences</h3>
                      <p className="text-xs text-slate-500">Showcase past festivals, concerts, and gigs you volunteered for</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddExperience}
                      className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1"
                    >
                      + Add New Gig
                    </button>
                  </div>

                  {editForm.experiences.length === 0 ? (
                    <div className="p-8 text-center bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                      <p className="text-slate-500 text-sm font-medium">No experiences added yet.</p>
                      <button
                        type="button"
                        onClick={handleAddExperience}
                        className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl shadow-xs"
                      >
                        + Add Your First Event
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-5">
                      {editForm.experiences.map((exp, idx) => (
                        <div
                          key={exp.id || idx}
                          className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-4 relative"
                        >
                          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <span className="text-xs font-black uppercase text-blue-600 tracking-wider">
                              Event #{idx + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemoveExperience(idx)}
                              className="text-xs font-bold text-red-500 hover:text-red-700 flex items-center gap-1"
                            >
                              🗑️ Delete
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="sm:col-span-2">
                              <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                                Event / Fest Name *
                              </label>
                              <input
                                type="text"
                                required
                                value={exp.eventName}
                                onChange={(e) => handleUpdateExperience(idx, 'eventName', e.target.value)}
                                placeholder="e.g. Jaipur Literature Festival"
                                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 font-semibold"
                              />
                            </div>

                            <div>
                              <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                                Event Type
                              </label>
                              <select
                                value={exp.eventType}
                                onChange={(e) => handleUpdateExperience(idx, 'eventType', e.target.value)}
                                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600"
                              >
                                <option value="Festival">Festival</option>
                                <option value="Music Concert">Music Concert</option>
                                <option value="Standup Comedy">Standup Comedy</option>
                                <option value="Corporate Summit">Corporate Summit</option>
                                <option value="Sports Event">Sports Event</option>
                                <option value="Exhibition">Exhibition</option>
                                <option value="College Fest">College Fest</option>
                              </select>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                                Your Role
                              </label>
                              <input
                                type="text"
                                value={exp.role}
                                onChange={(e) => handleUpdateExperience(idx, 'role', e.target.value)}
                                placeholder="e.g. Crowd Management Lead"
                                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600"
                              />
                            </div>

                            <div>
                              <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                                Year
                              </label>
                              <input
                                type="number"
                                min={2018}
                                max={2030}
                                value={exp.year}
                                onChange={(e) => handleUpdateExperience(idx, 'year', Number(e.target.value) || 2025)}
                                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                              Description of Work Done
                            </label>
                            <textarea
                              rows={2}
                              value={exp.description}
                              onChange={(e) => handleUpdateExperience(idx, 'description', e.target.value)}
                              placeholder="Managed crowd entry of 500+ people, guided attendees, assisted celebrity escorts..."
                              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600"
                            />
                          </div>

                          {/* Event Photos */}
                          <div>
                            <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1.5">
                              Event Photos (फ़ोटोज़)
                            </label>

                            {/* Existing Photos thumbnails */}
                            <div className="flex flex-wrap gap-2 mb-2">
                              {exp.images && exp.images.map((photo, pIdx) => (
                                <div key={pIdx} className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-200 group">
                                  <img src={photo} alt="Event Photo" className="w-full h-full object-cover" />
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveExperiencePhoto(idx, pIdx)}
                                    className="absolute top-1 right-1 w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center text-[10px] font-bold opacity-80 hover:opacity-100"
                                  >
                                    ✕
                                  </button>
                                </div>
                              ))}
                            </div>

                            {/* Upload photo button */}
                            <div className="flex items-center gap-2">
                              <label className="cursor-pointer px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors inline-flex items-center gap-1">
                                📷 Add Photo from Phone/Laptop
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                      handleAddExperiencePhoto(idx, e.target.files[0]);
                                    }
                                  }}
                                />
                              </label>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Bottom Sticky Save Bar */}
              <div className="pt-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white">
                <p className="text-xs text-slate-500">
                  Data will be saved directly into Neon Database.
                </p>

                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="flex-1 sm:flex-initial px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition-colors"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex-1 sm:flex-initial px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-98 flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
                  >
                    {isSaving ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Saving to Database...</span>
                      </>
                    ) : (
                      <>
                        <span>💾</span>
                        <span>Save Changes to Database</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

