import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import UpcomingEventsSection from '@/components/UpcomingEventsSection';
import { getAllUpcomingEvents, getAllVolunteers } from '@/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
  const [events, volunteers] = await Promise.all([
    getAllUpcomingEvents(),
    getAllVolunteers(),
  ]);

  const volunteerCount = volunteers.length;
  const targetCount = 100;
  const progressPercent = Math.min(100, Math.max(5, Math.round((volunteerCount / targetCount) * 100)));

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900 selection:bg-indigo-500 selection:text-white">
      <Navbar />

      <main className="flex-1 overflow-hidden">
        {/* =========================================================================
            HERO SECTION WITH 3D AURORA & FLOATING CARDS
        ========================================================================== */}
        <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-32 overflow-hidden">
          {/* Ambient Aurora Gradient Meshes */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/4 w-[55rem] h-[35rem] bg-gradient-to-tr from-indigo-300/40 via-purple-300/35 to-rose-300/30 rounded-full blur-[110px] pointer-events-none animate-aurora" />
          <div className="absolute top-1/3 -left-20 w-[30rem] h-[30rem] bg-blue-300/30 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute top-1/2 -right-20 w-[32rem] h-[32rem] bg-pink-300/25 rounded-full blur-[110px] pointer-events-none" />

          {/* Perspective Subtle Grid Pattern */}
          <div 
            className="absolute inset-0 opacity-[0.35] pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(#cbd5e1 1px, transparent 1px)`,
              backgroundSize: '24px 24px'
            }}
          />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              
              {/* Left Column: Hero Text */}
              <div className="lg:col-span-7 space-y-7 text-center lg:text-left">
                
                {/* 3D Glass Pill */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 border border-indigo-100 shadow-xs backdrop-blur-md">
                  <span className="flex h-2.5 w-2.5 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-600"></span>
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-900">
                    Trusted by 150+ Event Organizers
                  </span>
                </div>

                {/* Main Headline */}
                <h1 className="text-4xl sm:text-6xl xl:text-7xl font-black tracking-tight leading-[1.08] text-slate-900">
                  Hire verified crew for{' '}
                  <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    unforgettable events.
                  </span>
                </h1>

                <p className="text-lg sm:text-xl text-slate-600 max-w-2xl leading-relaxed mx-auto lg:mx-0 font-normal">
                  Stop stressing about unverified volunteers. Crewly connects event companies with pre-vetted stage managers, crowd coordinators, VIP liaisons, and registration staff ready to execute.
                </p>

                {/* 3D Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3.5 justify-center lg:justify-start pt-2">
                  <Link
                    href="/join"
                    className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-2xl text-sm sm:text-base font-bold text-white btn-premium-gradient shadow-xl hover:shadow-2xl transition-all group"
                  >
                    <span>Join as a Volunteer</span>
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>

                  <Link
                    href="/request"
                    className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl text-sm sm:text-base font-bold text-slate-800 btn-premium-light border border-slate-300 hover:border-indigo-400 shadow-sm transition-all"
                  >
                    <span>Request for an Event</span>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-pink-50 text-pink-600 border border-pink-100">
                      Hire Crew
                    </span>
                  </Link>

                  <Link
                    href="#upcoming-events"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl text-sm sm:text-base font-bold text-slate-800 bg-white hover:bg-slate-50 border border-slate-300 hover:border-pink-300 shadow-xs transition-all"
                  >
                    <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse"></span>
                    <span>Upcoming Events</span>
                  </Link>
                </div>

                {/* Social Proof Tags with Clean Vector Icons */}
                <div className="pt-6 border-t border-slate-200/80 flex flex-wrap items-center justify-center lg:justify-start gap-8 text-xs font-semibold text-slate-500">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span>100% ID Verified</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                      <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    </span>
                    <span>4.9/5 Event Rating</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center font-bold">
                      <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                      </svg>
                    </span>
                    <span>Zero Middleman Fees</span>
                  </div>
                </div>

              </div>

              {/* Right Column: Multi-Layered 3D Floating Mockup */}
              <div className="lg:col-span-5 relative flex justify-center py-6">
                
                {/* Main 3D Floating Glass Milestone Card (Hides profiles until 100 volunteers) */}
                <div className="w-full max-w-sm glass-card rounded-[2rem] p-6 shadow-3d-floating relative animate-float-gentle border border-indigo-100/80">
                  
                  {/* Card Header with Milestone Badge */}
                  <div className="flex items-center justify-between mb-5">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-xs">
                      <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
                      Founding Crew Batch
                    </span>
                    <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                      Phase 1
                    </span>
                  </div>

                  {/* Milestone Heading */}
                  <div className="space-y-1 mb-5">
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">
                      100 Volunteers Milestone
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      All volunteer profiles & portfolios will unlock for public discovery once we hit 100 registered crew.
                    </p>
                  </div>

                  {/* Dynamic Progress Bar */}
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-indigo-50/40 border border-indigo-100/60 mb-5 space-y-2.5">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-slate-600">Registered Volunteers</span>
                      <span className="text-indigo-600 font-black">{volunteerCount} / {targetCount}</span>
                    </div>
                    
                    {/* Progress Bar Container */}
                    <div className="w-full bg-slate-200/80 rounded-full h-3 overflow-hidden p-0.5 border border-slate-200">
                      <div 
                        className="h-full rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 transition-all duration-1000 shadow-xs"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>

                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 pt-0.5">
                      <span>{progressPercent}% Completed</span>
                      <span className="text-pink-600 flex items-center gap-1">
                        <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                        Profiles Hidden Until 100
                      </span>
                    </div>
                  </div>

                  {/* 2 Quick Action Buttons */}
                  <div className="space-y-2">
                    <Link 
                      href="/join" 
                      className="w-full py-3 rounded-xl btn-premium-gradient font-bold text-xs text-center block shadow-lg flex items-center justify-center gap-1.5"
                    >
                      <span>Join as a Volunteer</span>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Link>

                    <Link 
                      href="/request" 
                      className="w-full py-2.5 rounded-xl border border-slate-200 hover:border-indigo-300 bg-white hover:bg-slate-50 font-bold text-xs text-slate-700 text-center block shadow-xs transition-colors"
                    >
                      Request for an Event
                    </Link>
                  </div>

                </div>

                {/* Floating Satellite 3D Card 1: Event Ticket Pass (Clean Vector SVG) */}
                <div className="absolute -top-4 -left-6 sm:-left-10 bg-white/95 backdrop-blur-md rounded-2xl p-3.5 shadow-xl border border-slate-200/80 animate-float-reverse hidden sm:flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-pink-500 text-white flex items-center justify-center shadow-md shadow-pink-500/20">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">Sunburn Arena '24</span>
                    <span className="text-[10px] font-semibold text-pink-600">Stage Crew Pass</span>
                  </div>
                </div>

                {/* Floating Satellite 3D Card 2: Quick Hire (Clean Vector SVG) */}
                <div className="absolute -bottom-6 -right-4 sm:-right-8 bg-white/95 backdrop-blur-md rounded-2xl p-3.5 shadow-xl border border-slate-200/80 animate-float-gentle hidden sm:flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-500 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">Direct Connection</span>
                    <span className="text-[10px] font-semibold text-indigo-600">Instant Coordinator Chat</span>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </section>

        {/* =========================================================================
            PROMINENT UPCOMING EVENTS & FESTIVALS SHOWCASE (SHOWN ON PAGE LOAD)
        ========================================================================== */}
        <UpcomingEventsSection initialEvents={events} />

        {/* =========================================================================
            3D STATS BANNER
        ========================================================================== */}
        <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 mb-24">
          <div className="glass-card rounded-[2.5rem] p-8 sm:p-12 shadow-3d-xl border border-white/80">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center divide-y sm:divide-y-0 sm:divide-x divide-slate-200/80">
              <div className="pt-4 sm:pt-0">
                <div className="text-3xl sm:text-5xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  1,200+
                </div>
                <div className="text-xs sm:text-sm font-bold text-slate-600 mt-2">Vetted Volunteers</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Ready across India</div>
              </div>

              <div className="pt-4 sm:pt-0">
                <div className="text-3xl sm:text-5xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  450+
                </div>
                <div className="text-xs sm:text-sm font-bold text-slate-600 mt-2">Major Events Powered</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Concerts, expos & summits</div>
              </div>

              <div className="pt-4 sm:pt-0">
                <div className="text-3xl sm:text-5xl font-black bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                  99.2%
                </div>
                <div className="text-xs sm:text-sm font-bold text-slate-600 mt-2">Turnout Reliability</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Zero last-minute no-shows</div>
              </div>

              <div className="pt-4 sm:pt-0">
                <div className="text-3xl sm:text-5xl font-black bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">
                  25+
                </div>
                <div className="text-xs sm:text-sm font-bold text-slate-600 mt-2">Cities Covered</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Metro & Tier-1 destinations</div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            BENTO 3D FEATURE GRID (WHY CREWLY) - VECTOR SVGs
        ========================================================================== */}
        <section className="py-16 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
              <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                Built For Seamless Production
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
                Why Event Organizers Choose Crewly
              </h2>
              <p className="text-slate-600 text-base sm:text-lg">
                The modern standard for discovering, screening, and coordinating event crews without agencies or chaotic WhatsApp groups.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Feature 1 - Shield SVG */}
              <div className="glass-card p-8 rounded-[2rem] glass-card-hover group">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/30 group-hover:scale-110 transition-transform">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Verified Profiles</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Every volunteer’s identity, phone, past event proof, and responsibilities are authenticated before they appear in directory searches.
                </p>
              </div>

              {/* Feature 2 - Camera / Media SVG */}
              <div className="glass-card p-8 rounded-[2rem] glass-card-hover group">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-500 to-pink-500 text-white flex items-center justify-center mb-6 shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Real Event Portfolios</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Inspect genuine on-ground photos, exact previous roles, and verified event history before extending an offer.
                </p>
              </div>

              {/* Feature 3 - Crosshair / Target SVG */}
              <div className="glass-card p-8 rounded-[2rem] glass-card-hover group">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-500 text-white flex items-center justify-center mb-6 shadow-lg shadow-pink-500/30 group-hover:scale-110 transition-transform">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Laser-Targeted Skills</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Filter by Stage Managers, Audio/Visual Assist, Crowd Control, Registration Desks, Sales, and VIP Protocol.
                </p>
              </div>

              {/* Feature 4 - Lightning SVG */}
              <div className="glass-card p-8 rounded-[2rem] glass-card-hover group">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white flex items-center justify-center mb-6 shadow-lg shadow-indigo-600/30 group-hover:scale-110 transition-transform">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Direct & Instant</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  No middleman markups. Request crew requirements directly and connect seamlessly with motivated, verified candidates.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* =========================================================================
            HOW IT WORKS (3 SIMPLE STEPS)
        ========================================================================== */}
        <section className="py-20 relative bg-white/70 border-y border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
              <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-600">
                Simple & Streamlined
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900">
                How Crewly Works in 3 Steps
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              
              {/* Step 1 */}
              <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs relative group hover:border-indigo-300 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-600 font-black flex items-center justify-center text-lg mb-6 shadow-inner">
                  01
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Search or Request</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Browse through verified volunteers filtered by location and experience, or submit an event request form.
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs relative group hover:border-purple-300 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-200 text-purple-600 font-black flex items-center justify-center text-lg mb-6 shadow-inner">
                  02
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Shortlist & Match</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Review profiles, previous festival photos, verified badges, and check mutual availability for your dates.
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs relative group hover:border-pink-300 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-pink-50 border border-pink-200 text-pink-600 font-black flex items-center justify-center text-lg mb-6 shadow-inner">
                  03
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Deploy with Confidence</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Coordinate effortlessly with reliable on-ground crew and run an outstanding, glitch-free event.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* =========================================================================
            FINAL CALL TO ACTION
        ========================================================================== */}
        <section className="py-24 relative overflow-hidden">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="relative rounded-[3rem] p-10 sm:p-16 text-center overflow-hidden bg-gradient-to-tr from-indigo-900 via-slate-900 to-purple-950 text-white shadow-2xl">
              
              {/* Internal glow blobs */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-pink-500/20 rounded-full blur-[90px] pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/30 rounded-full blur-[90px] pointer-events-none" />

              <div className="relative z-10 max-w-2xl mx-auto space-y-6">
                <span className="text-xs font-extrabold uppercase tracking-widest text-pink-400 bg-pink-500/10 border border-pink-500/20 px-3.5 py-1.5 rounded-full inline-block">
                  Ready to Level Up Your Event?
                </span>
                
                <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                  Build your dream event crew with Crewly today.
                </h2>

                <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
                  Join hundreds of organizers and thousands of verified volunteers across India's top cities.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <Link
                    href="/join"
                    className="px-8 py-4 rounded-2xl text-base font-bold text-white btn-premium-gradient shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2"
                  >
                    <span>Join as a Volunteer</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                  <Link
                    href="/request"
                    className="px-8 py-4 rounded-2xl text-base font-bold text-white bg-white/10 hover:bg-white/15 border border-white/20 backdrop-blur-md transition-all flex items-center justify-center gap-2"
                  >
                    <span>Request for an Event</span>
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
