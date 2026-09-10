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
              <div className="text-center p-6">
                <div className="text-4xl mb-4">🛡️</div>
                <h3 className="text-xl font-bold mb-2">Verified Profiles</h3>
                <p className="text-gray-600">Every volunteer goes through a verification process to ensure quality.</p>
              </div>
              <div className="text-center p-6">
                <div className="text-4xl mb-4">🏆</div>
                <h3 className="text-xl font-bold mb-2">Real Experience</h3>
                <p className="text-gray-600">See genuine feedback and photos from actual past events.</p>
              </div>
              <div className="text-center p-6">
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="text-xl font-bold mb-2">Fast Matching</h3>
                <p className="text-gray-600">Find the right skills quickly and fill your crew gaps in hours.</p>
              </div>
              <div className="text-center p-6">
                <div className="text-4xl mb-4">🤝</div>
                <h3 className="text-xl font-bold mb-2">Reliable Crew</h3>
                <p className="text-gray-600">Our volunteers are committed and passionate about events.</p>
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
