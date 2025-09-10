'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingCart } from "lucide-react";

const Navbar = () => {
  const router = useRouter();
  const [isLoginDropdownOpen, setIsLoginDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, []);

  const handleLoginSelect = (userType: string) => {
    setIsLoginDropdownOpen(false);

    switch (userType) {
      case 'admin':
        router.push('/admin');
        break;
      case 'customer':
        router.push('/customer');
        break;
      case 'doctor':
        router.push('/doctor');
        break;
      default:
        break;
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-8xl mx-auto flex justify-between items-center px-2 lg:px-8 py-4">
        {/* Logo */}
<div className="flex items-center space-x-2">
  <img
    src="/images/logo.svg"
    alt="Petneo Logo"
    className="w-33 h-33 sm:w-20 sm:h-20" // Increased size
  />
</div>


        {/* Desktop Links */}
        <div className="hidden lg:flex items-center space-x-8">
          {['Dogs', 'Cats', 'Pharmacy', 'Consult', 'Shop'].map((link, idx) => (
            <a
              key={idx}
              href="#"
              className="relative text-gray-700 hover:text-blue-600 font-medium py-2 group transition-colors duration-200"
            >
              {link}
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></div>
            </a>
          ))}
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* Search (hidden on small screens) */}
          <div className="hidden md:flex items-center bg-gray-50 rounded-full px-4 py-2 min-w-[200px] lg:min-w-[260px] border border-gray-200 focus-within:ring-2 focus-within:ring-blue-100">
            <svg
              className="w-4 h-4 text-gray-400 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search For Anything..."
              className="bg-transparent outline-none text-sm w-full text-gray-700 placeholder-gray-500"
            />
          </div>

          {/* Login dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsLoginDropdownOpen(!isLoginDropdownOpen)}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 sm:px-5 py-2.5 rounded-full text-sm font-medium flex items-center shadow-sm transition-all duration-200"
            >
              Login
              <svg
                className={`w-4 h-4 ml-2 transition-transform duration-200 ${isLoginDropdownOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isLoginDropdownOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                {[
                  { type: 'admin', label: 'Admin Login' },
                  { type: 'customer', label: 'Customer Login' },
                  { type: 'doctor', label: 'Doctor Login' }
                ].map(({ type, label }, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleLoginSelect(type)}
                    className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 w-full text-left transition-colors duration-150"
                  >
                    <span className="w-4 h-4 mr-3">🔹</span>
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Cart */}
          <button className="relative p-2.5 rounded-full text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200 shadow-sm">
            <ShoppingCart className="w-5 h-5" strokeWidth={2} />
          </button>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden mt-2 px-4 pb-4 border-t border-gray-100">
          {/* Mobile search */}
          <div className="flex items-center bg-gray-50 rounded-full px-4 py-2 mb-4 border border-gray-200">
            <svg
              className="w-4 h-4 text-gray-400 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search For Anything..."
              className="bg-transparent outline-none text-sm w-full text-gray-700 placeholder-gray-500"
            />
          </div>

          {/* Mobile links */}
          <div className="grid grid-cols-2 gap-3">
            {['Dogs', 'Cats', 'Pharmacy', 'Consult', 'Shop'].map((link, idx) => (
              <a
                key={idx}
                href="#"
                className="text-gray-700 hover:text-blue-600 font-medium block py-3 px-4 text-center bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors duration-200"
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
