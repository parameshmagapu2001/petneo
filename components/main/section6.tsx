"use client";

import { FaFacebookF, FaInstagram } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-pink-100 text-black">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Top Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Social */}
          <div>
            <h4 className="font-semibold mb-4">Follow on social</h4>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-pink-600 text-white hover:bg-pink-700"
              >
                <FaFacebookF />
              </a>
              <a
                href="#"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-pink-600 text-white hover:bg-pink-700"
              >
                <FaInstagram />
              </a>
            </div>
          </div>

          {/* Boarding & Day care */}
          <div>
            <h4 className="font-semibold mb-2">Boarding & Day care</h4>
            <p className="text-lg font-medium">(616)-459-8622</p>
            <p className="text-sm mt-1">
              2125 Howard Street, Grand Rapids, MI Michigan
            </p>
          </div>

          {/* Health care */}
          <div>
            <h4 className="font-semibold mb-2">Health care</h4>
            <p className="text-lg font-medium">(616)-566-5896</p>
            <p className="text-sm mt-1">
              2125 Howard Street, Grand Rapids, MI Michigan
            </p>
          </div>
        </div>

        {/* Divider */}
        <hr className="border-gray-300 my-8" />

        {/* Bottom Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left text */}
          <p className="text-sm text-gray-800">
            © all rights reserved & design with love by{" "}
            <span className="font-medium">PatNeo</span>
          </p>

          {/* Links */}
          <nav className="flex gap-6 text-sm">
            <a href="#" className="hover:underline">
              our services
            </a>
            <a href="#" className="hover:underline">
              About us
            </a>
            <a href="#" className="hover:underline">
              Shipping
            </a>
            <a href="#" className="hover:underline">
              FAQ
            </a>
            <a href="#" className="hover:underline">
              Contact
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
