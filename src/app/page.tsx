import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-white py-20 min-h-[600px] flex items-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-30"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
            <div className="max-w-3xl">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Find verified people for your next event.
              </h1>
              <p className="text-xl text-gray-600 mb-10 max-w-2xl">
                Crewly connects event companies with verified, experienced volunteers ready to work.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/volunteers" className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium text-center hover:bg-blue-700 transition-colors">
                  Find Volunteers
                </Link>
                <Link href="/join" className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-medium text-center hover:bg-blue-50 transition-colors">
                  Join as a Volunteer
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Section */}
        <section className="bg-gray-50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Why event companies choose Crewly
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-blue-600 text-3xl mb-4">✓</div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">Verified Profiles</h3>
                <p className="text-gray-600">Every volunteer profile is reviewed and verified by our team.</p>
              </div>
              <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-blue-600 text-3xl mb-4">⭐</div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">Real Event Experience</h3>
                <p className="text-gray-600">Browse actual event history and verified work experience.</p>
              </div>
              <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-blue-600 text-3xl mb-4">🎯</div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">Skill-Based Selection</h3>
                <p className="text-gray-600">Find volunteers with the exact skills your event needs.</p>
              </div>
              <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-blue-600 text-3xl mb-4">🤝</div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">Reliable Event Crew</h3>
                <p className="text-gray-600">Build a dependable crew for events of any size.</p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="bg-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              How Crewly works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="text-center">
                <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-6">1</div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">Browse Volunteers</h3>
                <p className="text-gray-600">Search our directory of verified event volunteers.</p>
              </div>
              <div className="text-center">
                <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-6">2</div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">Submit a Request</h3>
                <p className="text-gray-600">Tell us about your event and crew requirements.</p>
              </div>
              <div className="text-center">
                <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-6">3</div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">Build Your Crew</h3>
                <p className="text-gray-600">We connect you with the right volunteers for your event.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="bg-blue-600 py-16 text-center px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-8">
              Ready to build your event crew?
            </h2>
            <Link href="/volunteers" className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors">
              Find Volunteers
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
