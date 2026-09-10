import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function CompaniesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-blue-600 text-white py-24 text-center px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Build your event crew with confidence.</h1>
            <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
              Access a directory of verified, experienced event professionals ready to make your next event a success.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/volunteers" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-medium text-center hover:bg-gray-50 transition-colors">
                Browse Volunteers
              </Link>
              <Link href="/request" className="border-2 border-white text-white px-8 py-3 rounded-lg font-medium text-center hover:bg-blue-700 transition-colors">
                Submit a Request
              </Link>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Why use Crewly?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center p-6 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2 text-slate-900">Verified Profiles</h3>
                <p className="text-slate-600 text-sm">Every volunteer goes through an authentication process to ensure quality.</p>
              </div>

              <div className="text-center p-6 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2 text-slate-900">Real Experience</h3>
                <p className="text-slate-600 text-sm">Inspect genuine photos and responsibilities from actual past events.</p>
              </div>

              <div className="text-center p-6 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="w-12 h-12 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2 text-slate-900">Fast Matching</h3>
                <p className="text-slate-600 text-sm">Find the right skills quickly and fill your crew gaps in hours.</p>
              </div>

              <div className="text-center p-6 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2 text-slate-900">Reliable Crew</h3>
                <p className="text-slate-600 text-sm">Our volunteers are committed and passionate about high-standard execution.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">How it works</h2>
            <div className="space-y-12">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="md:w-1/2 flex justify-end">
                  <div className="bg-white p-6 rounded-xl shadow-sm text-right">
                    <h3 className="text-xl font-bold mb-2 text-blue-600">Step 1</h3>
                    <h4 className="text-2xl font-bold mb-2">Browse & Search</h4>
                    <p className="text-gray-600">Use our powerful directory to find volunteers with the exact skills and experience your event requires.</p>
                  </div>
                </div>
                <div className="hidden md:block w-4 h-4 bg-blue-600 rounded-full border-4 border-blue-200"></div>
                <div className="md:w-1/2"></div>
              </div>
              
              <div className="flex flex-col md:flex-row items-center gap-8 md:flex-row-reverse">
                <div className="md:w-1/2 flex justify-start">
                  <div className="bg-white p-6 rounded-xl shadow-sm text-left">
                    <h3 className="text-xl font-bold mb-2 text-blue-600">Step 2</h3>
                    <h4 className="text-2xl font-bold mb-2">Submit Request</h4>
                    <p className="text-gray-600">Fill out a simple form detailing your event, the roles you need filled, and any specific requirements.</p>
                  </div>
                </div>
                <div className="hidden md:block w-4 h-4 bg-blue-600 rounded-full border-4 border-blue-200"></div>
                <div className="md:w-1/2"></div>
              </div>

              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="md:w-1/2 flex justify-end">
                  <div className="bg-white p-6 rounded-xl shadow-sm text-right">
                    <h3 className="text-xl font-bold mb-2 text-blue-600">Step 3</h3>
                    <h4 className="text-2xl font-bold mb-2">Get Matched</h4>
                    <p className="text-gray-600">We'll notify suitable volunteers and connect you with the ones who accept the opportunity.</p>
                  </div>
                </div>
                <div className="hidden md:block w-4 h-4 bg-blue-600 rounded-full border-4 border-blue-200"></div>
                <div className="md:w-1/2"></div>
              </div>

              <div className="flex flex-col md:flex-row items-center gap-8 md:flex-row-reverse">
                <div className="md:w-1/2 flex justify-start">
                  <div className="bg-white p-6 rounded-xl shadow-sm text-left">
                    <h3 className="text-xl font-bold mb-2 text-blue-600">Step 4</h3>
                    <h4 className="text-2xl font-bold mb-2">Event Day</h4>
                    <p className="text-gray-600">Your skilled crew arrives ready to work, ensuring your event runs smoothly from start to finish.</p>
                  </div>
                </div>
                <div className="hidden md:block w-4 h-4 bg-blue-600 rounded-full border-4 border-blue-200"></div>
                <div className="md:w-1/2"></div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-white py-20 text-center px-4 border-t border-gray-200">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Ready to get started?
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/volunteers" className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Find Volunteers
              </Link>
              <Link href="/request" className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                Submit a Request
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
