'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SkillInput from '@/components/SkillInput';
import ImageUpload from '@/components/ImageUpload';

type EventExperience = {
  id: string;
  eventName: string;
  eventType: string;
  year: number;
  role: string;
  description: string;
  imageUrl: string;
};

const SUGGESTED_SKILLS = [
  'Event Management',
  'Crowd Handling',
  'Registration',
  'Hospitality',
  'Guest Management',
  'Stage Coordination',
  'Photography',
  'Social Media',
  'Sales',
  'VIP Liaison',
  'Logistics',
  'Sound & Light Assist',
];

const EVENT_TYPES = [
  'Festival',
  'Conference',
  'Exhibition',
  'Concert / Live Show',
  'Wedding',
  'Corporate Event',
  'Sports Event',
  'Cultural Fest',
  'Other',
];

export default function JoinVolunteerPage() {
  // Personal Info
  const [name, setName] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');
  const [age, setAge] = useState<number | ''>('');

  // Skills & Overview
  const [skills, setSkills] = useState<string[]>(['Event Management', 'Registration']);
  const [yearsExperience, setYearsExperience] = useState<number>(1);
  const [eventsCompleted, setEventsCompleted] = useState<number>(3);
  const [bio, setBio] = useState('');

  // Previous Events
  const [experiences, setExperiences] = useState<EventExperience[]>([
    {
      id: 'exp-1',
      eventName: '',
      eventType: 'Festival',
      year: new Date().getFullYear(),
      role: '',
      description: '',
      imageUrl: '',
    },
  ]);

  // Availability & Notes
  const [availability, setAvailability] = useState<'available' | 'unavailable'>('available');
  const [additionalNotes, setAdditionalNotes] = useState('');

  // Status
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdVolunteer, setCreatedVolunteer] = useState<any | null>(null);
  const [targetEvent, setTargetEvent] = useState<string | null>(null);

  // Volunteer Auth State
  const [authUser, setAuthUser] = useState<{ email: string; name?: string; picture?: string; volunteerId?: string } | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Inline OTP state
  const [authEmail, setAuthEmail] = useState('');
  const [authOtp, setAuthOtp] = useState('');
  const [otpStep, setOtpStep] = useState<'email' | 'otp'>('email');
  const [otpSending, setOtpSending] = useState(false);
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [devOtpHint, setDevOtpHint] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Gig Application State
  const [eventRoles, setEventRoles] = useState<string[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [applyingGig, setApplyingGig] = useState(false);
  const [gigAppliedSuccess, setGigAppliedSuccess] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);

  const checkSession = async () => {
    try {
      setAuthLoading(true);
      const res = await fetch('/api/volunteer-auth/session');
      const data = await res.json();
      if (data.authenticated && data.user) {
        setAuthUser(data.user);
        setEmail(data.user.email);
        if (data.user.name) setName((prev) => prev || data.user.name);
        if (data.user.picture) setProfileImage((prev) => prev || data.user.picture);

        // If user already has a volunteer profile, load existing details
        if (data.user.volunteerId) {
          try {
            const vRes = await fetch(`/api/volunteers/${data.user.volunteerId}`);
            if (vRes.ok) {
              const vData = await vRes.json();
              if (vData.name) setName(vData.name);
              if (vData.phone) setPhone(vData.phone);
              if (vData.location) setLocation(vData.location);
              if (vData.skills && vData.skills.length > 0) setSkills(vData.skills);
              if (vData.bio) setBio(vData.bio);
              if (vData.profileImage) setProfileImage(vData.profileImage);
            }
          } catch {}
        }
      } else {
        setAuthUser(null);
      }
    } catch (e) {
      console.error('Session check failed', e);
    } finally {
      setAuthLoading(false);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  useEffect(() => {
    let timer: any;
    if (resendCooldown > 0) {
      timer = setInterval(() => setResendCooldown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setOtpError(null);
    setDevOtpHint(null);
    const cleanEmail = authEmail.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setOtpError('Please enter a valid email address.');
      return;
    }
    setOtpSending(true);
    try {
      const res = await fetch('/api/volunteer-auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send login code.');
      setOtpStep('otp');
      setResendCooldown(45);
      if (data.devOtp) setDevOtpHint(data.devOtp);
    } catch (err: any) {
      setOtpError(err.message || 'Error sending login code.');
    } finally {
      setOtpSending(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError(null);
    const cleanOtp = authOtp.trim().replace(/\D/g, '');
    if (cleanOtp.length !== 6) {
      setOtpError('Please enter the 6-digit code.');
      return;
    }
    setOtpVerifying(true);
    try {
      const res = await fetch('/api/volunteer-auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: authEmail.trim().toLowerCase(), otp: cleanOtp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Invalid or expired OTP.');
      await checkSession();
    } catch (err: any) {
      setOtpError(err.message || 'Verification failed.');
    } finally {
      setOtpVerifying(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/volunteer-auth/session', { method: 'DELETE' });
    setAuthUser(null);
    setOtpStep('email');
    setAuthOtp('');
  };

  const handleGoogleLogin = () => {
    window.location.href = `/api/volunteer-auth/google?callbackUrl=${encodeURIComponent('/join')}`;
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const evt = params.get('event');
      const rls = params.get('roles');
      if (evt) setTargetEvent(evt);
      if (rls) {
        const parsed = rls.split(',').map((r) => r.trim()).filter(Boolean);
        setEventRoles(parsed);
        if (parsed.length > 0) setSelectedRole(parsed[0]);
      }
    }
  }, []);

  const handleApplyGig = async (eventTitleToApply?: string, roleToApply?: string) => {
    const eventName = eventTitleToApply || targetEvent;
    if (!eventName) return;

    setApplyingGig(true);
    try {
      const res = await fetch('/api/events/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventTitle: eventName,
          roleApplied: roleToApply || selectedRole || 'Event Volunteer',
          volunteerId: authUser?.volunteerId || createdVolunteer?.id,
          volunteerName: name || authUser?.name,
          volunteerEmail: email || authUser?.email,
          volunteerPhone: phone,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit application.');
      }

      setGigAppliedSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      alert(err.message || 'Error submitting application.');
    } finally {
      setApplyingGig(false);
    }
  };

  const addExperience = () => {
    setExperiences([
      ...experiences,
      {
        id: `exp-${Date.now()}`,
        eventName: '',
        eventType: 'Festival',
        year: new Date().getFullYear(),
        role: '',
        description: '',
        imageUrl: '',
      },
    ]);
  };

  const removeExperience = (id: string) => {
    if (experiences.length > 1) {
      setExperiences(experiences.filter((exp) => exp.id !== id));
    }
  };

  const updateExperience = (id: string, field: keyof EventExperience, value: any) => {
    setExperiences(
      experiences.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp))
    );
  };

  const toggleSuggestedSkill = (skill: string) => {
    if (skills.includes(skill)) {
      setSkills(skills.filter((s) => s !== skill));
    } else {
      setSkills([...skills, skill]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!phone.trim()) {
      setError('Please enter your phone number.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!location.trim()) {
      setError('Please enter your city / location.');
      return;
    }
    if (skills.length === 0) {
      setError('Please add at least one skill.');
      return;
    }

    setLoading(true);

    try {
      // Format experiences
      const validExperiences = experiences
        .filter((exp) => exp.eventName.trim().length > 0)
        .map((exp) => ({
          eventName: exp.eventName.trim(),
          eventType: exp.eventType,
          role: exp.role.trim() || 'Volunteer',
          year: Number(exp.year) || new Date().getFullYear(),
          description: exp.description.trim(),
          images: exp.imageUrl ? [exp.imageUrl] : [],
        }));

      // Append additional notes to bio if provided
      let fullBio = bio.trim();
      if (additionalNotes.trim()) {
        fullBio = fullBio
          ? `${fullBio}\n\nAdditional Info:\n${additionalNotes.trim()}`
          : additionalNotes.trim();
      }

      const payload = {
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        location: location.trim(),
        age: age ? Number(age) : undefined,
        bio: fullBio,
        yearsExperience: Number(yearsExperience) || 0,
        eventsCompleted: Number(eventsCompleted) || 0,
        skills,
        availability,
        verified: true, // Registered profiles receive verified badge so companies can evaluate them
        profileImage: profileImage || null,
        experiences: validExperiences,
      };

      const res = await fetch('/api/volunteers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to create volunteer profile');
      }

      const created = await res.json();
      setCreatedVolunteer(created);

      // If user came to apply for an event gig, automatically submit gig application!
      if (targetEvent) {
        try {
          await fetch('/api/events/apply', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              eventTitle: targetEvent,
              roleApplied: selectedRole || 'Event Volunteer',
              volunteerId: created.id,
              volunteerName: created.name,
              volunteerEmail: created.email,
              volunteerPhone: created.phone,
            }),
          });
          setGigAppliedSuccess(true);
        } catch (e) {
          console.error('Error auto-applying for event:', e);
        }
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // GIG APPLICATION SUCCESS SCREEN
  if (gigAppliedSuccess) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-16 text-center">
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-indigo-100">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-xs font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Gig Application Confirmed
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-4 mb-2">
              You Have Applied for {targetEvent || 'Event Gig'}!
            </h1>
            <p className="text-sm sm:text-base text-slate-600 max-w-md mx-auto mb-6">
              Your verified volunteer profile has been submitted directly to the event producers. You will be contacted via WhatsApp/Email for the briefing and crew pass.
            </p>

            {selectedRole && (
              <div className="inline-block bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-bold px-4 py-2 rounded-xl mb-6">
                Role Applied: {selectedRole}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/#upcoming-events"
                className="btn-premium-gradient font-bold px-6 py-3.5 rounded-xl shadow-md text-sm text-center"
              >
                Explore More Gigs →
              </Link>
              <Link
                href="/profile"
                className="border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold px-6 py-3.5 rounded-xl text-sm text-center"
              >
                View My Profile
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // REGISTRATION SUCCESS SCREEN
  if (createdVolunteer) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12 text-center">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              Registration Successful!
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Welcome aboard, <span className="font-semibold text-gray-900">{createdVolunteer.name}</span>! Your professional volunteer profile has been created and is now live in the Crewly directory.
            </p>

            <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left border border-gray-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-sm">Profile Status:</span>
                <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold border border-emerald-200">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Verified Profile</span>
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-sm">Location:</span>
                <span className="text-gray-900 font-medium text-sm">{createdVolunteer.location}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-sm">Skills Listed:</span>
                <span className="text-gray-900 font-medium text-sm">{createdVolunteer.skills?.join(', ') || 'None'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-sm">Availability:</span>
                <span className="text-emerald-600 font-medium text-sm capitalize">{createdVolunteer.availability}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={`/volunteers/${createdVolunteer.id}`}
                className="btn-premium-gradient font-bold px-8 py-3.5 rounded-2xl shadow-xl text-center"
              >
                View My Live Profile →
              </Link>
              <Link
                href="/volunteers"
                className="border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold px-8 py-3.5 rounded-2xl transition-colors text-center"
              >
                Explore Volunteer Directory
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900">
      <Navbar />

      {/* Background Aurora Orbs */}
      <div className="fixed top-10 left-1/3 w-[35rem] h-[25rem] bg-indigo-200/35 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed top-1/2 right-10 w-[30rem] h-[25rem] bg-pink-200/25 rounded-full blur-[130px] pointer-events-none" />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        {/* Navigation Actions (Back & Home) */}
        <div className="flex items-center justify-between mb-8">
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

        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-block bg-indigo-50 text-indigo-700 text-xs font-extrabold px-3.5 py-1.5 rounded-full uppercase tracking-wider mb-3 border border-indigo-100">
            Volunteer Registration
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight mb-3">
            Join Crewly as an Event Volunteer
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
            Create your verified profile, showcase your past event photos, and get discovered by top event companies nationwide.
          </p>
        </div>

        {targetEvent && (
          <div className="mb-8 p-5 rounded-2xl bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 border border-indigo-200/80 text-indigo-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-600 block">
                Applying For Official Event Gig
              </span>
              <span className="text-lg font-black text-slate-900">{targetEvent}</span>
              <p className="text-xs text-slate-600 mt-0.5">
                Your profile will be directly prioritized and submitted to the event producers.
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white rounded-full text-xs font-bold text-indigo-700 border border-indigo-200 shadow-xs flex-shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Fast-Track Review
            </span>
          </div>
        )}

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl flex items-center gap-3">
            <svg className="w-5 h-5 flex-shrink-0 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        {/* AUTH CHECKING SKELETON */}
        {authLoading ? (
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 text-center py-12">
            <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-sm font-medium text-slate-500">Checking volunteer authentication...</p>
          </div>
        ) : !authUser ? (
          /* STEP 1: AUTHENTICATION GATE */
          <div className="bg-white/95 backdrop-blur-xl p-8 md:p-10 rounded-3xl shadow-xl border border-indigo-100 mb-12 max-w-xl mx-auto text-left">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-full text-xs font-black uppercase tracking-wider mb-3">
                <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping"></span>
                Step 1 of 2: Volunteer Verification
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Login to Continue Registration</h2>
              <p className="text-sm text-slate-500 mt-1.5">
                Sign in with Google or your Email OTP to protect your profile & link your gigs.
              </p>
            </div>

            {otpError && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2.5">
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{otpError}</span>
              </div>
            )}

            {devOtpHint && (
              <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-800 text-sm flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                </div>
                <div>
                  <p className="font-bold">Test OTP (Dev Mode):</p>
                  <p className="font-mono text-base tracking-widest font-black text-amber-900 mt-0.5">{devOtpHint}</p>
                  <p className="text-xs text-amber-700 mt-0.5">Use this code below to verify immediately.</p>
                </div>
              </div>
            )}

            {/* Google Login Button */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-700 font-bold text-sm transition-all shadow-xs active:scale-[0.99]"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* Divider */}
            <div className="relative my-6 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <span className="relative bg-white px-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                OR WITH EMAIL OTP
              </span>
            </div>

            {/* OTP Step 1: Email */}
            {otpStep === 'email' ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label htmlFor="authEmail" className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                    Enter Your Email
                  </label>
                  <input
                    id="authEmail"
                    type="email"
                    required
                    placeholder="volunteer@example.com"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder:text-slate-400 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all font-medium"
                  />
                </div>
                <button
                  type="submit"
                  disabled={otpSending}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-sm shadow-md hover:shadow-indigo-500/25 hover:from-indigo-500 hover:to-purple-500 transition-all active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {otpSending ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                      <span>Sending code...</span>
                    </>
                  ) : (
                    <>
                      <span>Send 6-Digit OTP Code</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* OTP Step 2: Code Verification */
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200 flex items-center justify-between">
                  <div className="text-xs">
                    <span className="text-slate-400 block font-medium">Code sent to:</span>
                    <span className="font-bold text-slate-800 break-all">{authEmail}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setOtpStep('email'); setAuthOtp(''); setOtpError(null); }}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 shadow-xs"
                  >
                    Change
                  </button>
                </div>

                <div>
                  <label htmlFor="authOtp" className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2 text-center">
                    Enter 6-Digit OTP Code
                  </label>
                  <input
                    id="authOtp"
                    type="text"
                    maxLength={6}
                    autoFocus
                    placeholder="123456"
                    value={authOtp}
                    onChange={(e) => setAuthOtp(e.target.value.replace(/\D/g, ''))}
                    className="w-full text-center tracking-[1em] text-2xl font-black py-3 bg-slate-50 border-2 border-indigo-200 focus:border-indigo-600 focus:bg-white rounded-2xl text-slate-900 focus:outline-none transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={otpVerifying || authOtp.length !== 6}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-sm shadow-md hover:shadow-indigo-500/25 hover:from-indigo-500 hover:to-purple-500 transition-all active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {otpVerifying ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                      <span>Verifying & Unlocking...</span>
                    </>
                  ) : (
                    <span>Verify & Continue Registration →</span>
                  )}
                </button>

                <div className="text-center pt-2">
                  {resendCooldown > 0 ? (
                    <p className="text-xs text-slate-400 font-medium">
                      Resend code in <span className="font-bold text-slate-600">{resendCooldown}s</span>
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSendOtp()}
                      disabled={otpSending}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-700 underline"
                    >
                      Didn't receive code? Resend OTP
                    </button>
                  )}
                </div>
              </form>
            )}
          </div>
        ) : (
          /* STEP 2: LOGGED IN USER STATUS & FULL REGISTRATION FORM */
          <>
            {/* Authenticated user status bar */}
            <div className="mb-8 p-4 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-emerald-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-3">
                {authUser.picture ? (
                  <img src={authUser.picture} alt="Profile" className="w-10 h-10 rounded-full border border-emerald-300 object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-black flex items-center justify-center text-sm shadow-xs">
                    {(authUser.name || authUser.email)[0].toUpperCase()}
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">
                      {authUser.name || 'Verified Volunteer'}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-600 text-white rounded-md text-[10px] font-black uppercase tracking-wider">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/></svg>
                      Verified Email
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">{authUser.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-center">
                {authUser.volunteerId && (
                  <Link
                    href={`/volunteers/${authUser.volunteerId}`}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-white px-3 py-1.5 rounded-xl border border-indigo-200 shadow-xs"
                  >
                    View My Profile →
                  </Link>
                )}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-xs font-semibold text-slate-500 hover:text-red-600 px-2 py-1 transition-colors"
                >
                  Log out
                </button>
              </div>
            </div>

            {authUser.volunteerId && !showEditProfile ? (
              targetEvent ? (
                /* DIRECT 1-CLICK GIG APPLICATION CARD */
                <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 md:p-10 shadow-xl border border-indigo-100 max-w-xl mx-auto text-left mb-8 animate-in fade-in">
                  <div className="text-center mb-6">
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-xs mb-3">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      Direct 1-Click Gig Application
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                      {targetEvent}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                      Your volunteer profile is already verified! Apply directly below without filling any forms again.
                    </p>
                  </div>

                  {/* Profile Summary Pill */}
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {authUser.picture ? (
                        <img src={authUser.picture} alt="Profile" className="w-12 h-12 rounded-full object-cover border border-emerald-300 shadow-xs" />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-indigo-600 text-white font-black flex items-center justify-center text-lg shadow-xs">
                          {(authUser.name || authUser.email)[0].toUpperCase()}
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-slate-900">{authUser.name || 'Verified Volunteer'}</p>
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">✓ Ready</span>
                        </div>
                        <p className="text-xs text-slate-500">{authUser.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Preferred Role Selection Chips */}
                  {eventRoles.length > 0 && (
                    <div className="mb-6">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                        Select Preferred Ground Role:
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {eventRoles.map((role) => (
                          <button
                            key={role}
                            type="button"
                            onClick={() => setSelectedRole(role)}
                            className={`text-xs px-3.5 py-2 rounded-xl font-bold transition-all ${
                              selectedRole === role
                                ? 'bg-indigo-600 text-white shadow-md'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                            }`}
                          >
                            {role}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Direct 1-Click Apply Button */}
                  <button
                    type="button"
                    onClick={() => handleApplyGig()}
                    disabled={applyingGig}
                    className="w-full py-4 px-6 rounded-2xl btn-premium-gradient font-black text-sm text-white shadow-xl flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-50 cursor-pointer"
                  >
                    {applyingGig ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                        <span>Applying for Gig...</span>
                      </>
                    ) : (
                      <>
                        <span>Apply for this Gig Now (1-Click)</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </>
                    )}
                  </button>

                  <div className="mt-6 pt-4 border-t border-slate-100 text-center">
                    <button
                      type="button"
                      onClick={() => setShowEditProfile(true)}
                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 underline transition-colors"
                    >
                      Want to update your volunteer details or experiences? Click here
                    </button>
                  </div>
                </div>
              ) : (
                /* PROFILE READY DASHBOARD (NO TARGET EVENT) */
                <div className="bg-white rounded-3xl p-8 md:p-10 shadow-xl border border-indigo-100 max-w-xl mx-auto text-center mb-8 animate-in fade-in">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">Your Volunteer Profile is Active!</h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1 mb-6">
                    You are already registered in the Crewly network. You can directly apply to any gig with 1-click.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
                    <Link
                      href="/#upcoming-events"
                      className="btn-premium-gradient font-bold px-6 py-3.5 rounded-xl text-xs sm:text-sm shadow-md"
                    >
                      Browse Upcoming Gigs to Apply →
                    </Link>
                    <Link
                      href={`/volunteers/${authUser.volunteerId}`}
                      className="border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold px-6 py-3.5 rounded-xl text-xs sm:text-sm"
                    >
                      View My Profile
                    </Link>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowEditProfile(true)}
                    className="text-xs font-semibold text-slate-400 hover:text-indigo-600 underline"
                  >
                    Need to edit your volunteer details? Click here
                  </button>
                </div>
              )
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* 1. PERSONAL INFORMATION */}
                <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">1</span>
                    Personal Information
                  </h2>

            {/* Profile Photo */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Profile Photo
              </label>
              <p className="text-xs text-gray-500 mb-3">
                Upload a clear headshot or professional photo so event organizers can recognize you.
              </p>
              <ImageUpload
                type="profile"
                value={profileImage}
                onChange={setProfileImage}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +91 98765 43210"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span>Kept private. Never exposed publicly to the general public.</span>
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  {authUser && (
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      ✓ Verified Account
                    </span>
                  )}
                </div>
                <input
                  type="email"
                  required
                  readOnly={Boolean(authUser)}
                  placeholder="e.g. rahul@example.com"
                  className={`w-full px-4 py-2.5 border rounded-lg outline-none ${
                    authUser
                      ? 'bg-slate-50 border-slate-200 text-slate-700 font-medium cursor-not-allowed'
                      : 'border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent'
                  }`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Location / City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jaipur, Rajasthan"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Age (Optional)
                </label>
                <input
                  type="number"
                  min="16"
                  max="80"
                  placeholder="e.g. 22"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                  value={age}
                  onChange={(e) => setAge(e.target.value ? parseInt(e.target.value, 10) : '')}
                />
              </div>
            </div>
          </div>

          {/* 2. SKILLS & EXPERTISE */}
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">2</span>
              Skills & Expertise
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Companies search volunteers by specific skills. Add skills you are confident in.
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Skills <span className="text-red-500">*</span>
              </label>
              <SkillInput skills={skills} onChange={setSkills} />
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Quick Add Popular Event Skills:
              </p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_SKILLS.map((skill) => {
                  const isSelected = skills.includes(skill);
                  return (
                    <button
                      type="button"
                      key={skill}
                      onClick={() => toggleSuggestedSkill(skill)}
                      className={`text-xs px-3 py-1.5 rounded-full transition-colors border ${
                        isSelected
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {isSelected ? '✓ ' : '+ '}
                      {skill}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 3. EXPERIENCE OVERVIEW & BIO */}
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">3</span>
              Experience Overview
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Years of Event Experience
                </label>
                <input
                  type="number"
                  min="0"
                  max="30"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
                  value={yearsExperience}
                  onChange={(e) => setYearsExperience(parseInt(e.target.value, 10) || 0)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Events Worked At
                </label>
                <input
                  type="number"
                  min="0"
                  max="500"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
                  value={eventsCompleted}
                  onChange={(e) => setEventsCompleted(parseInt(e.target.value, 10) || 0)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bio / About Yourself
              </label>
              <textarea
                rows={4}
                placeholder="Briefly introduce yourself. Mention what types of events you enjoy working at, your strengths (e.g. calm under pressure, friendly with attendees), and your dedication."
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none text-sm"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>
          </div>

          {/* 4. PREVIOUS EVENTS WORKED AT */}
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">4</span>
                  Previous Events Worked At
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Add details of actual events you have worked at, your roles, responsibilities, and event photos.
                </p>
              </div>
              <button
                type="button"
                onClick={addExperience}
                className="self-start sm:self-auto bg-blue-50 text-blue-600 hover:bg-blue-100 px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1"
              >
                <span>+ Add Another Event</span>
              </button>
            </div>

            <div className="space-y-6">
              {experiences.map((exp, idx) => (
                <div
                  key={exp.id}
                  className="p-5 border border-gray-200 rounded-xl bg-gray-50/50 relative space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                    <span className="text-sm font-bold text-gray-700">
                      Event #{idx + 1}
                    </span>
                    {experiences.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeExperience(exp.id)}
                        className="text-red-500 hover:text-red-700 text-xs font-semibold px-2 py-1 rounded"
                      >
                        Remove Event
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Event Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Jaipur Literature Festival"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-600 outline-none"
                        value={exp.eventName}
                        onChange={(e) => updateExperience(exp.id, 'eventName', e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Event Type
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-600 outline-none"
                        value={exp.eventType}
                        onChange={(e) => updateExperience(exp.id, 'eventType', e.target.value)}
                      >
                        {EVENT_TYPES.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Year
                      </label>
                      <input
                        type="number"
                        min="2015"
                        max={new Date().getFullYear() + 1}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-600 outline-none"
                        value={exp.year}
                        onChange={(e) =>
                          updateExperience(exp.id, 'year', parseInt(e.target.value, 10) || new Date().getFullYear())
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Your Role / Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Crowd Handling Lead / Registration Desk Coordinator"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-600 outline-none"
                      value={exp.role}
                      onChange={(e) => updateExperience(exp.id, 'role', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Responsibilities & What You Did
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Describe your responsibilities: e.g. Managed attendee check-ins, handled VIP movement, escorted artists, resolved ticketing queries..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-600 outline-none"
                      value={exp.description}
                      onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Event Photograph (Photos from previous events you worked at)
                    </label>
                    <p className="text-xs text-gray-500 mb-2">
                      Upload a photo of you on-site, stage setup, or the event floor.
                    </p>
                    <ImageUpload
                      type="experience"
                      value={exp.imageUrl}
                      onChange={(url: string) => updateExperience(exp.id, 'imageUrl', url)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 5. AVAILABILITY & ADDITIONAL INFORMATION */}
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">5</span>
              Availability & Additional Information
            </h2>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Current Availability Status
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label
                  className={`border rounded-xl p-4 flex items-center gap-3 cursor-pointer transition-all ${
                    availability === 'available'
                      ? 'border-emerald-500 bg-emerald-50/40 ring-2 ring-emerald-500/20'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="availability"
                    value="available"
                    checked={availability === 'available'}
                    onChange={() => setAvailability('available')}
                    className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                  />
                  <div>
                    <div className="font-semibold text-gray-900 text-sm flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      Available
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      Ready to work at upcoming events
                    </div>
                  </div>
                </label>

                <label
                  className={`border rounded-xl p-4 flex items-center gap-3 cursor-pointer transition-all ${
                    availability === 'unavailable'
                      ? 'border-gray-500 bg-gray-50 ring-2 ring-gray-500/20'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="availability"
                    value="unavailable"
                    checked={availability === 'unavailable'}
                    onChange={() => setAvailability('unavailable')}
                    className="w-4 h-4 text-gray-600 focus:ring-gray-500"
                  />
                  <div>
                    <div className="font-semibold text-gray-900 text-sm flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                      Currently Unavailable
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      Temporarily not taking event bookings
                    </div>
                  </div>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Any Other Relevant Information
              </label>
              <textarea
                rows={3}
                placeholder="Mention any specific details like days of the week you're free, languages you speak, driving license, or specific equipment you own."
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none text-sm"
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
              />
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-premium-gradient font-bold py-4 px-8 rounded-2xl shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-base flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>Creating Your Profile...</span>
                </>
              ) : (
                <span>
                  {targetEvent
                    ? `Register Profile & Apply for "${targetEvent}" →`
                    : 'Register & Create Volunteer Profile'}
                </span>
              )}
            </button>
            <p className="text-center text-xs text-gray-500 mt-3">
              By registering, you agree to be listed in the Crewly verified event volunteer network.
            </p>
          </div>
        </form>
      )}
    </>
  )}
</main>

      <Footer />
    </div>
  );
}
