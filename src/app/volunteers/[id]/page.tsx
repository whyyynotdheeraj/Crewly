'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SkillTag from '@/components/SkillTag';
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

interface ExperienceTableRow {
  eventName: string;
  role: string;
  place: string;
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
  });

  // Simple Table Format for Past Events
  const [experienceRows, setExperienceRows] = useState<ExperienceTableRow[]>([
    { eventName: '', role: '', place: '' },
  ]);

  // Unified Event Photos (All experience photos in one place)
  const [eventPhotos, setEventPhotos] = useState<string[]>([]);

  const [customSkillInput, setCustomSkillInput] = useState('');
  const profileFileInputRef = useRef<HTMLInputElement>(null);
  const eventPhotosInputRef = useRef<HTMLInputElement>(null);
  const [uploadingProfilePic, setUploadingProfilePic] = useState(false);
  const [uploadingEventPhotos, setUploadingEventPhotos] = useState(false);

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
      });

      // Populate Table Rows from experiences
      const exps = Array.isArray(volunteer.experiences) ? volunteer.experiences : [];
      const rows: ExperienceTableRow[] = exps
        .filter((exp: any) => exp.eventName && exp.eventName !== 'Past Events & Experience')
        .map((exp: any) => ({
          eventName: exp.eventName || '',
          role: exp.role || '',
          place: exp.description || exp.eventType || '',
        }));

      setExperienceRows(rows.length > 0 ? rows : [{ eventName: '', role: '', place: '' }]);

      // Populate All Event Photos together
      const photos: string[] = [];
      for (const exp of exps) {
        const imgs = Array.isArray(exp.images) ? exp.images : exp.imageUrl ? [exp.imageUrl] : [];
        for (const img of imgs) {
          if (typeof img === 'string' && img && !photos.includes(img)) {
            photos.push(img);
          }
        }
      }
      setEventPhotos(photos);
    }
  }, [volunteer]);

  // Handle Profile Photo Upload from Device
  const handleProfilePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }
    setUploadingProfilePic(true);
    try {
      const dataUrl = await compressImageToBase64(file, 800, 0.82);
      setEditForm((prev) => ({ ...prev, profileImage: dataUrl }));
    } catch {
      alert('Failed to process image');
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

  // Table Row Handlers
  const handleAddRow = () => {
    setExperienceRows((prev) => [...prev, { eventName: '', role: '', place: '' }]);
  };

  const handleUpdateRow = (index: number, field: keyof ExperienceTableRow, value: string) => {
    setExperienceRows((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleRemoveRow = (index: number) => {
    setExperienceRows((prev) => {
      const filtered = prev.filter((_, i) => i !== index);
      return filtered.length > 0 ? filtered : [{ eventName: '', role: '', place: '' }];
    });
  };

  // Unified Event Photos Handlers
  const handleAddEventPhotos = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const files = Array.from(e.target.files);
    setUploadingEventPhotos(true);
    try {
      const newPhotos: string[] = [];
      for (const file of files) {
        if (file.type.startsWith('image/')) {
          const compressed = await compressImageToBase64(file, 1000, 0.82);
          newPhotos.push(compressed);
        }
      }
      if (newPhotos.length > 0) {
        setEventPhotos((prev) => [...prev, ...newPhotos]);
      }
    } catch {
      alert('Could not process some photos');
    } finally {
      setUploadingEventPhotos(false);
      if (eventPhotosInputRef.current) {
        eventPhotosInputRef.current.value = '';
      }
    }
  };

  const handleRemoveEventPhoto = (index: number) => {
    setEventPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  // Save to Database
  const handleSaveAll = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage(null);

    // Prepare experiences payload from the table rows
    const validRows = experienceRows.filter((r) => r.eventName.trim());
    let experiencesPayload: any[] = validRows.map((r, idx) => ({
      eventName: r.eventName.trim(),
      role: r.role.trim() || 'Volunteer',
      description: r.place.trim() || '',
      eventType: r.place.trim() || 'Event',
      year: new Date().getFullYear(),
      images: idx === 0 ? eventPhotos : [],
    }));

    // If no specific event was named but photos were uploaded, preserve them in a portfolio experience
    if (experiencesPayload.length === 0 && eventPhotos.length > 0) {
      experiencesPayload = [
        {
          eventName: 'Past Events & Experience',
          role: 'Volunteer',
          description: '',
          eventType: 'Event',
          year: new Date().getFullYear(),
          images: eventPhotos,
        },
      ];
    }

    const payload = {
      name: editForm.name,
      phone: editForm.phone,
      location: editForm.location,
      age: editForm.age ? Number(editForm.age) : undefined,
      bio: editForm.bio,
      yearsExperience: Number(editForm.yearsExperience) || 0,
      eventsCompleted: Number(editForm.eventsCompleted) || 0,
      availability: editForm.availability,
      skills: editForm.skills,
      profileImage: editForm.profileImage,
      experiences: experiencesPayload,
    };

    try {
      const res = await fetch(`/api/volunteers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const updatedVolunteer = await res.json();
        setVolunteer(updatedVolunteer);
        setSaveMessage({
          type: 'success',
          text: 'Profile and experiences updated successfully!',
        });
        setTimeout(() => {
          setIsEditing(false);
          setSaveMessage(null);
        }, 1200);
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

  if (error || !volunteer) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f8fafc]">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center py-20 px-4">
          <h1 className="text-3xl font-black text-slate-900 mb-3">Volunteer Not Found</h1>
          <p className="text-slate-500 mb-8">The profile you are looking for doesn&apos;t exist or has been removed.</p>
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
              caption: exp.eventName && exp.eventName !== 'Past Events & Experience' 
                ? `${exp.eventName} — ${exp.role || 'Volunteer'}` 
                : 'Event Experience Photo',
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

  const validExperiences = (volunteer.experiences || []).filter(
    (exp: any) => exp.eventName && exp.eventName !== 'Past Events & Experience'
  );

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
            {/* Navigation Actions */}
            <div className="flex items-center justify-between mb-6">
              <button
                type="button"
                onClick={() => (window.history.length > 1 ? window.history.back() : (window.location.href = '/'))}
                className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-indigo-600 bg-white hover:bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200 shadow-xs transition-all active:scale-[0.98] cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Back</span>
              </button>

              <div className="flex items-center gap-3">
                {canEdit && (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    <span>Edit Profile</span>
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
              <div className="mb-8 p-4 rounded-2xl bg-blue-50/70 border border-blue-200 text-slate-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-slate-900">
                        {isAdmin ? 'Admin View: Editing Mode' : 'Your Volunteer Profile'}
                      </p>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                        Database Connected
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">
                      You can update your personal details, past events, and photos anytime.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="text-xs font-bold px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs flex items-center gap-1.5 transition-all self-end sm:self-center cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  <span>Edit Profile Now</span>
                </button>
              </div>
            )}

            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
              {/* Photo */}
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

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm font-semibold text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{volunteer.location}</span>
                  </div>

                  {volunteer.age && (
                    <div className="flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>{volunteer.age} yrs</span>
                    </div>
                  )}

                  {/* Availability Badge */}
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2.5 h-2.5 rounded-full ${isAvailable ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                    <span className={isAvailable ? 'text-emerald-700 font-bold' : 'text-amber-700 font-bold'}>
                      {isAvailable ? 'Available for Gigs' : 'Currently Busy'}
                    </span>
                  </div>
                </div>

                {/* Experience & Gigs Counters */}
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
                  <div className="bg-slate-50 border border-slate-200/80 px-4 py-2 rounded-2xl flex items-center gap-2">
                    <span className="text-xl font-black text-blue-600">{volunteer.yearsExperience || 0}</span>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Years Exp</span>
                  </div>
                  <div className="bg-slate-50 border border-slate-200/80 px-4 py-2 rounded-2xl flex items-center gap-2">
                    <span className="text-xl font-black text-indigo-600">{volunteer.eventsCompleted || 0}</span>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Gigs Done</span>
                  </div>
                </div>

                {/* Direct Phone / Contact Badge */}
                <div className="pt-2">
                  {isLocked ? (
                    <div className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 font-bold">
                      <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <span>Phone hidden until {VOLUNTEERS_UNLOCK_THRESHOLD} volunteers join</span>
                    </div>
                  ) : (
                    <a
                      href={`tel:${volunteer.phone}`}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold text-xs shadow-md transition-all active:scale-95"
                    >
                      <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span>Call: {volunteer.phone}</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Profile Content Body */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
          {/* About / Bio */}
          {volunteer.bio && (
            <section className="bg-white rounded-[2rem] p-8 border border-slate-200/80 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-4">About</h2>
              <p className="text-slate-600 leading-relaxed font-normal text-base whitespace-pre-line">
                {volunteer.bio}
              </p>
            </section>
          )}

          {/* Skills */}
          {volunteer.skills && volunteer.skills.length > 0 && (
            <section className="bg-white rounded-[2rem] p-8 border border-slate-200/80 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Skills & Specialties</h2>
              <div className="flex flex-wrap gap-2">
                {volunteer.skills.map((skill: string, index: number) => (
                  <SkillTag key={index} skill={skill} />
                ))}
              </div>
            </section>
          )}

          {/* Past Event Experience (Clean Table Format) */}
          <section className="bg-white rounded-[2rem] p-8 border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Past Events Experience</h2>
                <p className="text-xs text-slate-500 mt-0.5">Events and gigs handled</p>
              </div>
              {canEdit && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-xs font-bold px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  <span>Edit Experience</span>
                </button>
              )}
            </div>

            {validExperiences.length > 0 ? (
              <>
                {/* Mobile View: Clean cards */}
                <div className="sm:hidden space-y-3">
                  {validExperiences.map((exp: any, idx: number) => (
                    <div key={exp.id || idx} className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-bold text-slate-900 text-sm">{exp.eventName}</h4>
                        <span className="inline-block px-2.5 py-0.5 bg-blue-100 text-blue-800 rounded-lg text-xs font-semibold whitespace-nowrap">
                          {exp.role}
                        </span>
                      </div>
                      {(exp.description || exp.eventType) && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                          <svg className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span>{exp.description || exp.eventType}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Desktop/Tablet View: Table */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500 text-xs uppercase font-bold tracking-wider">
                        <th className="py-3 px-4">Event Name</th>
                        <th className="py-3 px-4">Role</th>
                        <th className="py-3 px-4">Place / Location</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {validExperiences.map((exp: any, idx: number) => (
                        <tr key={exp.id || idx} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-3.5 px-4 font-bold text-slate-900">{exp.eventName}</td>
                          <td className="py-3.5 px-4 text-slate-700">
                            <span className="inline-block px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold">
                              {exp.role}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-slate-600 font-medium">
                            {exp.description || exp.eventType || '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <div className="bg-slate-50 rounded-2xl p-8 text-center border border-slate-200 space-y-3">
                <p className="text-slate-500 text-sm font-medium">No past event records added yet.</p>
                {canEdit && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
                  >
                    + Add your past events & experience
                  </button>
                )}
              </div>
            )}
          </section>

          {/* On-Ground Event Photos Gallery */}
          {allImages.length > 0 && (
            <section className="bg-white rounded-[2rem] p-8 border border-slate-200/80 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Event Photos</h2>
                  <p className="text-xs text-slate-500 mt-0.5">{allImages.length} photos uploaded</p>
                </div>
                {canEdit && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-xs font-bold px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Add / Manage Photos</span>
                  </button>
                )}
              </div>
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
          DIRECT EDIT PROFILE & EXPERIENCES MODAL WINDOW (SIMPLIFIED & UNIFIED)
      ========================================================================== */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-gray-100 overflow-hidden relative">
            
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-gray-200 flex items-center justify-between bg-slate-50">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                  Edit Profile & Experience
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Update your details, past events, and photos directly in the database
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="w-8 h-8 rounded-full bg-white hover:bg-slate-200 border border-slate-200 text-slate-600 font-bold flex items-center justify-center transition-colors cursor-pointer"
                title="Close"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Scrollable Single Form Body */}
            <form onSubmit={handleSaveAll} className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
              
              {/* Alert message if any */}
              {saveMessage && (
                <div
                  className={`p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                    saveMessage.type === 'success'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}
                >
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {saveMessage.type === 'success' ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    )}
                  </svg>
                  <span>{saveMessage.text}</span>
                </div>
              )}

              {/* 1. PERSONAL DETAILS */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 pb-1 border-b border-slate-100">
                  Personal Details
                </h3>

                {/* Profile Photo */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center gap-4">
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-xs flex-shrink-0">
                    {editForm.profileImage ? (
                      <img
                        src={editForm.profileImage}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-slate-400 text-xl">
                        {editForm.name ? editForm.name.charAt(0).toUpperCase() : 'V'}
                      </div>
                    )}
                    {uploadingProfilePic && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-[10px] font-bold">
                        Uploading...
                      </div>
                    )}
                  </div>

                  <div className="flex-1 text-center sm:text-left space-y-1.5">
                    <p className="text-xs font-bold text-slate-700">Profile Photo</p>
                    <div className="flex flex-wrap gap-2 justify-center sm:justify-start items-center">
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
                        className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <svg className="w-3.5 h-3.5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>Upload Photo</span>
                      </button>
                      {editForm.profileImage && (
                        <button
                          type="button"
                          onClick={() => setEditForm((p) => ({ ...p, profileImage: '' }))}
                          className="px-2.5 py-1.5 text-red-600 hover:bg-red-50 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Name & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
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
                      className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-600"
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
                      className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-600"
                    />
                  </div>
                </div>

                {/* Location, Age, Availability */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                      City / Location *
                    </label>
                    <input
                      type="text"
                      required
                      value={editForm.location}
                      onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                      placeholder="e.g. Jaipur"
                      className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-600"
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
                      className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                      Availability Status
                    </label>
                    <select
                      value={editForm.availability}
                      onChange={(e) => setEditForm({ ...editForm, availability: e.target.value })}
                      className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-600 font-medium"
                    >
                      <option value="available">Available for Gigs</option>
                      <option value="unavailable">Currently Busy</option>
                    </select>
                  </div>
                </div>

                {/* Experience (Years) & Total Events Completed */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                      Years of Experience (कितने साल का अनुभव है)
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={40}
                      value={editForm.yearsExperience}
                      onChange={(e) => setEditForm({ ...editForm, yearsExperience: Number(e.target.value) || 0 })}
                      placeholder="e.g. 2"
                      className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                      Events Completed (अब तक कितने इवेंट किए)
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={500}
                      value={editForm.eventsCompleted}
                      onChange={(e) => setEditForm({ ...editForm, eventsCompleted: Number(e.target.value) || 0 })}
                      placeholder="e.g. 15"
                      className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-600"
                    />
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Skills & Specialties
                  </label>
                  <div className="flex flex-wrap gap-1.5 mb-2 min-h-[36px] p-2 bg-slate-50 border border-slate-200 rounded-xl">
                    {editForm.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-white text-slate-800 rounded-lg text-xs font-semibold border border-slate-200 shadow-2xs"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="text-slate-400 hover:text-red-600 font-bold ml-1 cursor-pointer"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                    {editForm.skills.length === 0 && (
                      <span className="text-xs text-slate-400 py-1">No skills added yet.</span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add skill (e.g. Stage Management)..."
                      value={customSkillInput}
                      onChange={(e) => setCustomSkillInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addSkill(customSkillInput);
                        }
                      }}
                      className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600"
                    />
                    <button
                      type="button"
                      onClick={() => addSkill(customSkillInput)}
                      className="px-3.5 py-1.5 bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-slate-900 transition-colors cursor-pointer"
                    >
                      Add
                    </button>
                  </div>

                  {/* Suggestions */}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {POPULAR_SKILLS.filter((s) => !editForm.skills.includes(s)).slice(0, 5).map((s, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => addSkill(s)}
                        className="px-2 py-0.5 text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-md font-medium transition-colors cursor-pointer"
                      >
                        + {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    About / Bio
                  </label>
                  <textarea
                    rows={3}
                    value={editForm.bio}
                    onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                    placeholder="Brief intro about yourself and past experience..."
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              {/* 2. PAST EVENTS EXPERIENCE (CLEAN & MOBILE-RESPONSIVE) */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Past Event Experience
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Add your past events below (Event Name, Role, Place)
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddRow}
                    className="px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer border border-blue-200"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                    </svg>
                    <span>+ Add Event</span>
                  </button>
                </div>

                {/* Mobile View: Clean Card Layout */}
                <div className="sm:hidden space-y-3">
                  {experienceRows.map((row, idx) => (
                    <div key={idx} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">
                          Event #{idx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveRow(idx)}
                          className="text-xs font-bold text-red-600 hover:text-red-700 p-1 flex items-center gap-1"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          <span>Remove</span>
                        </button>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                          Event Name
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Jaipur Literature Festival"
                          value={row.eventName}
                          onChange={(e) => handleUpdateRow(idx, 'eventName', e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-blue-600"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                            Role
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Stage Lead"
                            value={row.role}
                            onChange={(e) => handleUpdateRow(idx, 'role', e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-600"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                            Place / City
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Jaipur"
                            value={row.place}
                            onChange={(e) => handleUpdateRow(idx, 'place', e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-600"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop/Tablet View: Table Format */}
                <div className="hidden sm:block border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-bold text-[11px]">
                        <tr>
                          <th className="p-3">Event Name</th>
                          <th className="p-3">Role</th>
                          <th className="p-3">Place / City</th>
                          <th className="p-3 w-12 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {experienceRows.map((row, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/50">
                            <td className="p-2">
                              <input
                                type="text"
                                placeholder="e.g. Jaipur Lit Fest"
                                value={row.eventName}
                                onChange={(e) => handleUpdateRow(idx, 'eventName', e.target.value)}
                                className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:border-blue-600 bg-white"
                              />
                            </td>
                            <td className="p-2">
                              <input
                                type="text"
                                placeholder="e.g. Stage Lead"
                                value={row.role}
                                onChange={(e) => handleUpdateRow(idx, 'role', e.target.value)}
                                className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:border-blue-600 bg-white"
                              />
                            </td>
                            <td className="p-2">
                              <input
                                type="text"
                                placeholder="e.g. Jaipur"
                                value={row.place}
                                onChange={(e) => handleUpdateRow(idx, 'place', e.target.value)}
                                className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:border-blue-600 bg-white"
                              />
                            </td>
                            <td className="p-2 text-center">
                              <button
                                type="button"
                                onClick={() => handleRemoveRow(idx)}
                                className="p-1.5 text-slate-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors cursor-pointer"
                                title="Remove row"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Additional Add Event Button Below */}
                <button
                  type="button"
                  onClick={handleAddRow}
                  className="w-full sm:w-auto px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-blue-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                  </svg>
                  <span>+ Add Another Event</span>
                </button>
              </div>

              {/* 3. EVENT PHOTOS (ALL PHOTOS IN ONE PLACE) */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Event Photos
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Upload all your past work and experience photos together ({eventPhotos.length} photos)
                    </p>
                  </div>

                  <div>
                    <input
                      type="file"
                      ref={eventPhotosInputRef}
                      multiple
                      accept="image/*"
                      onChange={handleAddEventPhotos}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => eventPhotosInputRef.current?.click()}
                      disabled={uploadingEventPhotos}
                      className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{uploadingEventPhotos ? 'Processing...' : 'Upload Photos'}</span>
                    </button>
                  </div>
                </div>

                {eventPhotos.length > 0 ? (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                    {eventPhotos.map((photo, pIdx) => (
                      <div key={pIdx} className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 bg-slate-100 group">
                        <img src={photo} alt="Event Photo" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveEventPhoto(pIdx)}
                          className="absolute top-1 right-1 w-5 h-5 bg-black/70 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-[10px] font-bold transition-colors cursor-pointer"
                          title="Remove Photo"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
                    <p className="text-xs text-slate-400">
                      No event photos uploaded yet. Click &quot;Upload Photos&quot; to add all your pictures together.
                    </p>
                  </div>
                )}
              </div>

              {/* Bottom Sticky Save Bar */}
              <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white">
                <p className="text-xs text-slate-400">
                  Data will be saved directly to the database.
                </p>

                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="flex-1 sm:flex-initial px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex-1 sm:flex-initial px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
                  >
                    {isSaving ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Save Changes</span>
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
