'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 bg-white shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center text-blue-600 font-bold text-xl">
              Crewly
            </Link>
          </div>
          <div className="hidden md:flex md:items-center md:space-x-8">
            <Link href="/volunteers" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
              Volunteers
            </Link>
            <Link href="/companies" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
              For Companies
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/volunteers" className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium transition-colors">
              Find Volunteers
            </Link>
            <Link href="/join" className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-md text-sm font-medium transition-colors">
              Join as Volunteer
            </Link>
          </div>
          <div className="-mr-2 flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/volunteers" className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium">
              Volunteers
            </Link>
            <Link href="/companies" className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium">
              For Companies
            </Link>
            <Link href="/volunteers" className="bg-blue-600 text-white block px-3 py-2 rounded-md text-base font-medium text-center mt-4">
              Find Volunteers
            </Link>
            <Link href="/join" className="border border-blue-600 text-blue-600 block px-3 py-2 rounded-md text-base font-medium text-center mt-2">
              Join as Volunteer
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
