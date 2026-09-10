import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function CompaniesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900 selection:bg-indigo-500 selection:text-white">
      <Navbar />

      <main className="flex-1 overflow-hidden">
        {/* =========================================================================
            ENTERPRISE 3D HERO SECTION
        ========================================================================== */}
        <section className="relative pt-12 pb-24 lg:pt-20 lg:pb-32 overflow-hidden">
          {/* Ambient Aurora Meshes */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/4 w-[60rem] h-[35rem] bg-gradient-to-tr from-indigo-300/40 via-purple-300/35 to-rose-300/30 rounded-full blur-[120px] pointer-events-none animate-aurora" />
          <div className="absolute top-1/3 -left-20 w-[30rem] h-[30rem] bg-blue-300/25 rounded-full blur-[110px] pointer-events-none" />

          {/* Perspective Grid Background */}
          <div 
            className="absolute inset-0 opacity-[0.35] pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(#cbd5e1 1px, transparent 1px)`,
              backgroundSize: '24px 24px'
            }}
          />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              
              {/* Left Column: B2B Value Proposition */}
              <div className="lg:col-span-7 space-y-7 text-center lg:text-left">
                
                {/* Enterprise Pill */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 border border-indigo-100 shadow-xs backdrop-blur-md">
                  <span className="flex h-2.5 w-2.5 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-600"></span>
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-900">
                    Crewly for Event Producers & Agencies
                  </span>
                </div>

                <h1 className="text-4xl sm:text-6xl xl:text-7xl font-black tracking-tight leading-[1.08] text-slate-900">
                  Staff your next event with{' '}
                  <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    zero no-shows.
                  </span>
                </h1>

                <p className="text-lg sm:text-xl text-slate-600 max-w-2xl leading-relaxed mx-auto lg:mx-0 font-normal">
                  Stop chasing unverified agency staff and messy WhatsApp groups. Get pre-vetted stage crews, crowd controllers, VIP liaisons, and registration managers with guaranteed on-ground reliability.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
                  <Link
                    href="/request"
                    className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl text-base font-bold text-white btn-premium-gradient shadow-xl"
                  >
                    <span>Post Event Crew Requirement</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>

                  <Link
                    href="/volunteers"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-base font-bold text-slate-800 btn-premium-light border border-slate-300"
                  >
                    <span>Browse Volunteer Directory</span>
                  </Link>
                </div>

                {/* Enterprise Proof Tickers */}
                <div className="pt-6 border-t border-slate-200/80 flex flex-wrap items-center justify-center lg:justify-start gap-8 text-xs font-semibold text-slate-500">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span>100% ID & Phone Verified</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                      <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                        <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </span>
                    <span>2-Hour Rapid Matching</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center font-bold">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </span>
                    <span>Backup Replacement Guarantee</span>
                  </div>
                </div>

              </div>

              {/* Right Column: 3D Organizer Command Center Mockup */}
              <div className="lg:col-span-5 relative flex justify-center py-6">
                
                {/* Main 3D Card: Live Production Dispatcher */}
                <div className="w-full max-w-md glass-card rounded-[2rem] p-6 shadow-3d-floating relative animate-float-gentle">
                  
                  {/* Card Header */}
                  <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-600 block">
                        Live Event Crew Dispatch
                      </span>
                      <h3 className="text-base font-black text-slate-900">
                        Tech Summit India 2024
                      </h3>
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      Fully Staffed (18/18)
                    </span>
                  </div>

                  {/* Roster Pipeline */}
                  <div className="space-y-3 mb-5">
                    
                    {/* Member 1 */}
                    <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200/70">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                          AK
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-xs text-slate-900">Aarav K.</span>
                            <span className="text-[10px] text-emerald-600 font-bold">✓ Verified</span>
                          </div>
                          <span className="text-[11px] text-slate-500">Stage Operations Lead</span>
                        </div>
                      </div>
                      <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">
                        Checked In
                      </span>
                    </div>

                    {/* Member 2 */}
                    <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200/70">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                          PM
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-xs text-slate-900">Pooja M.</span>
                            <span className="text-[10px] text-emerald-600 font-bold">✓ Verified</span>
                          </div>
                          <span className="text-[11px] text-slate-500">VIP Protocol Officer</span>
                        </div>
                      </div>
                      <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">
                        Checked In
                      </span>
                    </div>

                    {/* Member 3 */}
                    <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200/70">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-pink-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                          RS
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-xs text-slate-900">Rohan S.</span>
                            <span className="text-[10px] text-emerald-600 font-bold">✓ Verified</span>
                          </div>
                          <span className="text-[11px] text-slate-500">Attendee Registration</span>
                        </div>
                      </div>
                      <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                        On Standby
                      </span>
                    </div>

                  </div>

                  {/* Summary Metric */}
                  <div className="p-3 rounded-xl bg-gradient-to-r from-indigo-50 to-pink-50 border border-indigo-100 flex items-center justify-between text-xs">
                    <span className="text-slate-600 font-medium">Turnout Reliability Score</span>
                    <span className="font-black text-indigo-700 text-sm">99.8%</span>
                  </div>

                </div>

                {/* Floating Satellite 3D Card 1 */}
                <div className="absolute -top-4 -left-6 bg-white/95 backdrop-blur-md rounded-2xl p-3.5 shadow-xl border border-slate-200/80 animate-float-reverse hidden sm:flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">Identity Authenticated</span>
                    <span className="text-[10px] text-emerald-600 font-semibold">Aadhaar & Police Verified</span>
                  </div>
                </div>

                {/* Floating Satellite 3D Card 2 */}
                <div className="absolute -bottom-6 -right-4 bg-white/95 backdrop-blur-md rounded-2xl p-3.5 shadow-xl border border-slate-200/80 animate-float-gentle hidden sm:flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-pink-500 text-white flex items-center justify-center shadow-md shadow-pink-500/20">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">Dispatched in 2 Hours</span>
                    <span className="text-[10px] text-indigo-600 font-semibold">Direct Organizer Connect</span>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </section>

        {/* =========================================================================
            EXECUTIVE METRICS STRIP
        ========================================================================== */}
        <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 mb-24">
          <div className="glass-card rounded-[2.5rem] p-8 sm:p-12 shadow-3d-xl border border-white/80">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center divide-y sm:divide-y-0 sm:divide-x divide-slate-200/80">
              
              <div className="pt-4 sm:pt-0">
                <div className="text-3xl sm:text-5xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  75%
                </div>
                <div className="text-xs sm:text-sm font-bold text-slate-700 mt-2">Hiring Time Saved</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Zero endless candidate screening</div>
              </div>

              <div className="pt-4 sm:pt-0">
                <div className="text-3xl sm:text-5xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  99.4%
                </div>
                <div className="text-xs sm:text-sm font-bold text-slate-700 mt-2">Guaranteed Turnout</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Backed by reserve standby pool</div>
              </div>

              <div className="pt-4 sm:pt-0">
                <div className="text-3xl sm:text-5xl font-black bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                  1,200+
                </div>
                <div className="text-xs sm:text-sm font-bold text-slate-700 mt-2">Experienced Crew</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Trained for high-stakes events</div>
              </div>

              <div className="pt-4 sm:pt-0">
                <div className="text-3xl sm:text-5xl font-black bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">
                  25+
                </div>
                <div className="text-xs sm:text-sm font-bold text-slate-700 mt-2">Cities Covered</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Multi-city tour support</div>
              </div>

            </div>
          </div>
        </section>

        {/* =========================================================================
            3D BENTO GRID: WHY ORGANIZERS RELY ON CREWLY
        ========================================================================== */}
        <section className="py-16 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
              <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                Enterprise Reliability
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
                Built For Seamless Event Execution
              </h2>
              <p className="text-slate-600 text-base sm:text-lg">
                Whether you need 5 specialist stage managers or 150 crowd volunteers for an arena show, Crewly scales effortlessly.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Card 1 */}
              <div className="glass-card p-8 rounded-[2rem] glass-card-hover group">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/30 group-hover:scale-110 transition-transform">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Verified Profiles</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Every volunteer’s identity, past event photos, and organizer references are verified before dispatch.
                </p>
              </div>

              {/* Card 2 */}
              <div className="glass-card p-8 rounded-[2rem] glass-card-hover group">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-500 to-pink-500 text-white flex items-center justify-center mb-6 shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Instant Bulk Staffing</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Fill multi-department crew lists in hours: Ticket Gates, VIP Lounges, Stage Setup, and Crowd Queues.
                </p>
              </div>

              {/* Card 3 */}
              <div className="glass-card p-8 rounded-[2rem] glass-card-hover group">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-500 text-white flex items-center justify-center mb-6 shadow-lg shadow-pink-500/30 group-hover:scale-110 transition-transform">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Standby Guarantee</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Never worry about last-minute dropouts. Crewly maintains active standby reserves for peak production hours.
                </p>
              </div>

              {/* Card 4 */}
              <div className="glass-card p-8 rounded-[2rem] glass-card-hover group">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white flex items-center justify-center mb-6 shadow-lg shadow-indigo-600/30 group-hover:scale-110 transition-transform">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Direct Coordination</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Communicate directly with your confirmed team. Zero agency bureaucracy, zero commission overhead.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* =========================================================================
            HOW IT WORKS: 4-STEP STREAMLINED PIPELINE
        ========================================================================== */}
        <section className="py-20 relative bg-white/75 border-y border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
              <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-600">
                Simple & Transparent
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900">
                How It Works For Event Organizers
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
              
              {/* Step 1 */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs relative group hover:border-indigo-300 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-600 font-black flex items-center justify-center text-lg mb-5 shadow-inner">
                  01
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Browse or Post Needs</h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  Search the live volunteer directory or submit an event requisition with roles, team size, and location.
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs relative group hover:border-purple-300 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-200 text-purple-600 font-black flex items-center justify-center text-lg mb-5 shadow-inner">
                  02
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Match & Verify</h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  Review applicant profiles, previous event photos, verified credentials, and availability confirmation.
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs relative group hover:border-pink-300 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-pink-50 border border-pink-200 text-pink-600 font-black flex items-center justify-center text-lg mb-5 shadow-inner">
                  03
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Pre-Event Briefing</h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  Send call sheets, dress codes, and role responsibilities directly to your confirmed team via WhatsApp.
                </p>
              </div>

              {/* Step 4 */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs relative group hover:border-emerald-300 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 font-black flex items-center justify-center text-lg mb-5 shadow-inner">
                  04
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Flawless Execution</h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  Crew arrives on time, fully briefed, and ready to make your event an extraordinary success.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* =========================================================================
            HIGH-CONVERTING CTA BANNER
        ========================================================================== */}
        <section className="py-24 relative overflow-hidden">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="relative rounded-[3rem] p-10 sm:p-16 text-center overflow-hidden bg-gradient-to-tr from-indigo-900 via-slate-900 to-purple-950 text-white shadow-2xl">
              
              {/* Internal glow blobs */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-pink-500/20 rounded-full blur-[90px] pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/30 rounded-full blur-[90px] pointer-events-none" />

              <div className="relative z-10 max-w-2xl mx-auto space-y-6">
                <span className="text-xs font-extrabold uppercase tracking-widest text-pink-400 bg-pink-500/10 border border-pink-500/20 px-3.5 py-1.5 rounded-full inline-block">
                  Dedicated Enterprise Support
                </span>
                
                <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                  Have an upcoming festival, concert, or summit?
                </h2>

                <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
                  Post your crew requirements in 2 minutes. Our team will review your needs and dispatch matched volunteers immediately.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <Link
                    href="/request"
                    className="px-8 py-4 rounded-2xl text-base font-bold text-white btn-premium-gradient shadow-xl"
                  >
                    Submit Crew Requirement Form →
                  </Link>
                  <Link
                    href="/volunteers"
                    className="px-8 py-4 rounded-2xl text-base font-bold text-white bg-white/10 hover:bg-white/15 border border-white/20 backdrop-blur-md transition-all"
                  >
                    Explore Volunteer Directory
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
