import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight mb-2">Crewly</h2>
            <p className="text-gray-400 text-sm">Verified people. Better events.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">For Companies</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/volunteers" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Find Volunteers
                </Link>
              </li>
              <li>
                <Link href="/request" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Request Volunteers
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">For Volunteers</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/join" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Join Crewly
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 text-center md:text-left">
          <p className="text-gray-400 text-sm">
            © 2024 Crewly. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
