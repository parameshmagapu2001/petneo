"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react"; // for hamburger icons
import Image from "next/image";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="flex justify-between items-center bg-white px-6 py-4 shadow-md relative">
      {/* Logo */}
<div className="flex items-center gap-1">
  <Image
    src="/images/logo.svg" // your SVG file in public/images
    alt="Petneo Logo"
    width={140} // adjust size
    height={40}
    priority
  />
</div>

      {/* Right side */}
      <div className="flex items-center gap-6">
        {/* Emergency Requests */}
        <div className="flex items-center gap-3 bg-white rounded-xl shadow px-4 py-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-800">
              Emergency Requests
            </span>
          </div>
          {/* Toggle */}
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" />
            <div className="w-10 h-5 bg-gray-300 rounded-full peer peer-checked:bg-pink-500"></div>
            <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition peer-checked:translate-x-5"></div>
          </label>
        </div>

        {/* Hello + Avatar */}
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-700">Hello, Dr. Mohan</span>
          <Image
            src="/avatar.png" // replace with your avatar image
            alt="profile"
            width={36}
            height={36}
            className="rounded-full object-cover"
          />
        </div>

        {/* Hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-gray-700 focus:outline-none"
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Dropdown Menu */}
      {menuOpen && (
        <div className="absolute right-6 top-20 bg-white rounded-2xl shadow-lg w-72 p-4 animate-fadeIn">
          <ul className="space-y-3">
            <li className="flex items-center gap-3 text-gray-800 hover:bg-pink-50 px-3 py-2 rounded-lg cursor-pointer">
              <span>🔔</span> Work Status <span className="text-xs text-gray-500">(Set Status)</span>
            </li>
            <li className="flex items-center gap-3 text-gray-800 hover:bg-pink-50 px-3 py-2 rounded-lg cursor-pointer">
              <span>⏱</span> Manage Time Slots
            </li>
            <li className="flex items-center gap-3 text-gray-800 hover:bg-pink-50 px-3 py-2 rounded-lg cursor-pointer">
              <span>💳</span> My Bio
            </li>
            <li className="flex items-center gap-3 text-gray-800 hover:bg-pink-50 px-3 py-2 rounded-lg cursor-pointer">
              <span>🔒</span> Privacy
            </li>
            <li className="flex items-center gap-3 text-gray-800 hover:bg-pink-50 px-3 py-2 rounded-lg cursor-pointer">
              <span>❓</span> Help
            </li>
            <li className="flex items-center gap-3 text-gray-800 hover:bg-pink-50 px-3 py-2 rounded-lg cursor-pointer">
              <span>ℹ️</span> About
            </li>
          </ul>
          <button className="mt-4 w-full bg-pink-500 text-white py-2 rounded-lg font-semibold hover:bg-pink-600">
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
