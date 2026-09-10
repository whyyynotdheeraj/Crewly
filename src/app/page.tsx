import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0b0f19] text-gray-100 selection:bg-blue-500 selection:text-white">
      <Navbar />

      <main className="flex-1 overflow-hidden">
        {/* =========================================================================
            3D HERO SECTION 
        ========================================================================== */}
        <section className="relative pt-12 pb-24 lg:pt-20 lg:pb-32 overflow-hidden">
          {/* Animated 3D Glowing Ambient Orbs */}
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/30 rounded-full blur-[128px] pointer-events-none animate-pulse-glow" />
          <div className="absolute top-1/4 -right-40 w-[30rem] h-[30rem] bg-indigo-600/25 rounded-full blur-[140px] pointer-events-none animate-pulse-glow" />
          <div className="absolute -bottom-20 left-1/3 w-80 h-80 bg-cyan-500/20 rounded-full blur-[120px] pointer-events-none" />

          {/* Perspective Grid Background */}
          <div 
            className="absolute inset-0 opacity-[0.12] pointer-events-none"
            style={{
              backgroundImage: `linear-gradient(to right, #4f46e5 1px, transparent 1px), linear-gradient(to bottom, #4f46e5 1px, transparent 1px)`,
              backgroundSize: '48px 48px',
              transform: 'perspective(500px) rotateX(45deg)',
              transformOrigin: 'top center'
            }}
          />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              
              {/* Left Column: Hero Content */}
              <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
                {/* 3D Pill Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.3)] backdrop-blur-md">
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-wider text-cyan-300">
                    Next-Gen Event Talent Platform
                  </span>
                </div>

                <h1 className="text-4xl sm:text-6xl xl:text-7xl font-black tracking-tight leading-[1.1] text-white">
                  Find <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent drop-shadow-sm">Verified 3D</span> Crew For Epic Events.
                </h1>

                <p className="text-lg sm:text-xl text-gray-400 max-w-2xl leading-relaxed mx-auto lg:mx-0">
                  Instantly discover & deploy pre-vetted volunteers, crowd managers, stage crew, and hospitality professionals across top Indian cities.
                </p>

                {/* 3D Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
                  <Link
                    href="/volunteers"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-bold text-white btn-3d-primary"
                  >
                    <span>Explore Verified Crew</span>
                    <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>

                  <Link
                    href="/join"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-bold text-gray-200 btn-3d-glass"
                  >
                    <span>Join as Volunteer</span>
                    <span className="px-2 py-0.5 text-xs bg-cyan-500/20 text-cyan-300 rounded-md border border-cyan-500/30">Free</span>
                  </Link>
                </div>

                {/* Micro Trust Indicators */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-4 text-xs font-medium text-gray-400">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400 font-bold">✓</span> 100% Background Screened
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-blue-400 font-bold">★</span> 4.9/5 Rating from Organizers
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-cyan-400 font-bold">⚡</span> Instant Crew Deployment
                  </div>
                </div>
              </div>

              {/* Right Column: 3D Floating Showcase Widget */}
              <div className="lg:col-span-5 relative perspective-1000 flex justify-center">
                
                {/* 3D Main Floating Card */}
                <div className="w-full max-w-md glass-panel-glow rounded-3xl p-6 sm:p-7 relative preserve-3d animate-float">
                  
                  {/* Card Header */}
                  <div className="flex items-start justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-600 p-[2px] shadow-lg">
                          <div className="w-full h-full bg-[#111827] rounded-[14px] flex items-center justify-center text-xl font-bold text-cyan-300">
                            AK
                          </div>
                        </div>
                        <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-[#111827] flex items-center justify-center text-[10px] text-white">
                          ✓
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-bold text-white">Aarav Kapoor</h3>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                            PRO CREW
                          </span>
                        </div>
                        <p className="text-xs text-gray-400">Mumbai • Lead Stage Coordinator</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="flex text-amber-400 text-xs">★★★★★</div>
                      <span className="text-[10px] text-gray-400">18 Events Done</span>
                    </div>
                  </div>

                  {/* Skills Cloud */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {['VIP Escort', 'Crowd Safety', 'Stage Ops', 'Walkie Protocol'].map((sk) => (
                      <span key={sk} className="text-xs px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-gray-300">
                        {sk}
                      </span>
                    ))}
                  </div>

                  {/* Highlights Grid */}
                  <div className="grid grid-cols-2 gap-2.5 p-3 rounded-2xl bg-black/30 border border-white/5 mb-5 text-xs">
                    <div>
                      <span className="text-gray-500 block text-[10px]">Experience</span>
                      <span className="font-semibold text-gray-200">3+ Years Active</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block text-[10px]">Current Status</span>
                      <span className="font-semibold text-emerald-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Available Now
                      </span>
                    </div>
                  </div>

                  {/* Micro action button */}
                  <Link 
                    href="/volunteers"
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold text-center block shadow-md transition-all"
                  >
                    View Full 3D Portfolio →
                  </Link>
                </div>

                {/* Floating 3D Satellite Card 1: Verified Metric */}
                <div className="absolute -top-6 -left-6 sm:-left-10 glass-panel rounded-2xl p-3.5 shadow-2xl border border-emerald-500/30 animate-float-delayed preserve-3d hidden sm:flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xl font-bold">
                    🛡️
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">Identity Verified</span>
                    <span className="text-[10px] text-emerald-400">Govt ID & Background Checked</span>
                  </div>
                </div>

                {/* Floating 3D Satellite Card 2: Live Organizers Booking */}
                <div className="absolute -bottom-6 -right-4 sm:-right-8 glass-panel rounded-2xl p-3.5 shadow-2xl border border-cyan-500/30 animate-float preserve-3d hidden sm:flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-xl">
                    ⚡
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">Instant Matching</span>
                    <span className="text-[10px] text-cyan-300">Book in under 2 minutes</span>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            3D STATS BANNER
        ========================================================================== */}
        <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-10 mb-20">
          <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-white/10">
              <div className="pt-4 md:pt-0">
                <div className="text-3xl sm:text-5xl font-black bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                  1,200+
                </div>
                <div className="text-xs sm:text-sm text-gray-400 mt-2 font-medium">Verified Event Crew</div>
              </div>
              <div className="pt-4 md:pt-0">
                <div className="text-3xl sm:text-5xl font-black bg-gradient-to-r from-indigo-400 to-purple-300 bg-clip-text text-transparent">
                  350+
                </div>
                <div className="text-xs sm:text-sm text-gray-400 mt-2 font-medium">Concerts & Summits</div>
              </div>
              <div className="pt-4 md:pt-0">
                <div className="text-3xl sm:text-5xl font-black bg-gradient-to-r from-cyan-400 to-emerald-300 bg-clip-text text-transparent">
                  99.4%
                </div>
                <div className="text-xs sm:text-sm text-gray-400 mt-2 font-medium">Organizer Satisfaction</div>
              </div>
              <div className="pt-4 md:pt-0">
                <div className="text-3xl sm:text-5xl font-black bg-gradient-to-r from-pink-400 to-rose-300 bg-clip-text text-transparent">
                  25+
                </div>
                <div className="text-xs sm:text-sm text-gray-400 mt-2 font-medium">Cities Across India</div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            3D WHY CREWLY (FEATURE CARDS)
        ========================================================================== */}
        <section className="py-20 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-400">
                Built For Event Producers & Volunteers
              </h2>
              <p className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                Why Event Giants Rely On Crewly
              </p>
              <p className="text-gray-400 text-base sm:text-lg">
                Eliminate last-minute dropouts and unverified crew. Our 3D platform connects you with dependable, passionate personnel.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 perspective-1000">
              
              {/* Card 1 */}
              <div className="glass-panel p-8 rounded-3xl transform-card-3d border border-white/10 hover:border-blue-500/50 group">
                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">
                  🛡️
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Verified Badges</h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Every profile is rigorously screened with identity verification, previous event photos, and organizer endorsements.
                </p>
              </div>

              {/* Card 2 */}
              <div className="glass-panel p-8 rounded-3xl transform-card-3d border border-white/10 hover:border-indigo-500/50 group">
                <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">
                  ⭐
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Real Track Record</h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Inspect actual event photos, responsibilities, and years of experience before confirming any crew member.
                </p>
              </div>

              {/* Card 3 */}
              <div className="glass-panel p-8 rounded-3xl transform-card-3d border border-white/10 hover:border-cyan-500/50 group">
                <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">
                  🎯
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Skill Filtering</h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Target exact roles: Stage Managers, Hospitality, Audio-Visual, VIP Protocol, Ticketing, and Medical Support.
                </p>
              </div>

              {/* Card 4 */}
              <div className="glass-panel p-8 rounded-3xl transform-card-3d border border-white/10 hover:border-emerald-500/50 group">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">
                  ⚡
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Instant Booking</h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Direct connection with volunteers. Zero middleman chaos, seamless WhatsApp & direct phone coordination.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* =========================================================================
            3D HOW IT WORKS (STEP BY STEP)
        ========================================================================== */}
        <section className="py-20 relative bg-[#090d16]/60 border-y border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-400">Streamlined Process</span>
              <h2 className="text-3xl sm:text-5xl font-black text-white">How Crewly Works</h2>
              <p className="text-gray-400 text-sm sm:text-base">Go from requirements to a full event crew in 3 simple steps</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              
              {/* Step 1 */}
              <div className="glass-panel p-8 rounded-3xl relative border border-white/10 group hover:border-cyan-500/40 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white font-black flex items-center justify-center text-lg mb-6 shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                  01
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Browse or Search</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Filter verified crew members by city, specialty skills, event count, and real-time availability.
                </p>
              </div>

              {/* Step 2 */}
              <div className="glass-panel p-8 rounded-3xl relative border border-white/10 group hover:border-indigo-500/40 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-500 text-white font-black flex items-center justify-center text-lg mb-6 shadow-[0_0_20px_rgba(99,102,241,0.4)]">
                  02
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Post Your Event Needs</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Tell us your dates, venue, and required team size. Get tailored volunteer matches within hours.
                </p>
              </div>

              {/* Step 3 */}
              <div className="glass-panel p-8 rounded-3xl relative border border-white/10 group hover:border-emerald-500/40 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-black flex items-center justify-center text-lg mb-6 shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                  03
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Deploy Your Crew</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Brief your crew and execute flawless events with confident, experienced on-ground support.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* =========================================================================
            3D CTA CALLOUT
        ========================================================================== */}
        <section className="py-24 relative overflow-hidden">
          {/* Glowing Orb Behind CTA */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[20rem] bg-gradient-to-r from-blue-600/30 to-indigo-600/30 rounded-full blur-[130px] pointer-events-none" />

          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="glass-panel-glow rounded-3xl p-10 sm:p-16 text-center border border-blue-500/30 shadow-[0_25px_60px_rgba(0,0,0,0.6)]">
              <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 mb-4 inline-block">
                Start Today • No Upfront Fee
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-6 max-w-2xl mx-auto">
                Ready to take your events to the next level?
              </h2>
              <p className="text-gray-300 text-base sm:text-lg max-w-xl mx-auto mb-10">
                Join hundreds of event directors, festival organizers, and thousands of skilled volunteers across India.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/volunteers"
                  className="px-8 py-4 rounded-xl text-base font-bold text-white btn-3d-primary"
                >
                  Find Volunteers Now
                </Link>
                <Link
                  href="/join"
                  className="px-8 py-4 rounded-xl text-base font-bold text-gray-200 btn-3d-glass"
                >
                  Join as Volunteer
                </Link>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
