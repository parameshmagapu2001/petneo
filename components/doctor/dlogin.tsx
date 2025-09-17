"use client";

import { useState } from "react";
import { FaGoogle, FaFacebookF, FaEyeSlash } from "react-icons/fa";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [agentTab, setAgentTab] = useState(true);
  const [email, setEmail] = useState("test@example.com"); // ✅ default value
  const [password, setPassword] = useState("123"); // ✅ default value
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ Always login successfully, no validation
    setMessage("✅ Login successful! Redirecting...");
    setTimeout(() => {
      if (agentTab) {
        router.push("/doctor/dashboard"); // doctor/agent dashboard
      } else {
        router.push("/customer/dashboard"); // user dashboard
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-6xl bg-white shadow-md rounded-md flex overflow-hidden">
        {/* Left Side - Login Form */}
        <div className="w-full md:w-1/2 px-8 md:px-12 lg:px-16 py-12 text-black">
          {/* Logo */}
          <div className="mb-8">
            <Image src="/images/logo.svg" alt="PetNeo Logo" width={140} height={50} />
          </div>

          {/* Tabs */}
          <div className="flex mb-8">
            <button
              className={`flex-1 py-2 rounded-full text-sm font-medium ${
                agentTab
                  ? "bg-pink-500 text-white"
                  : "bg-pink-200 text-gray-600"
              }`}
              onClick={() => setAgentTab(true)}
            >
              Agent
            </button>
            <button
              className={`flex-1 py-2 rounded-full text-sm font-medium ${
                !agentTab
                  ? "bg-pink-500 text-white"
                  : "bg-pink-200 text-gray-600"
              }`}
              onClick={() => setAgentTab(false)}
            >
              User
            </button>
          </div>

          {/* Form Header */}
          <div className="mb-6 flex justify-between items-center">
            <h2 className="font-bold text-lg">Log In</h2>
            <button
              onClick={() => router.push("signup")}
              className="px-3 py-1 rounded-full text-l bg-pink-100 text-blue border border-black-400 hover:bg-pink-200 transition"
            >
              Signup
            </button>
          </div>

          {/* Form */}
          <form className="space-y-5" onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded px-3 py-3 text-sm placeholder-gray-400 focus:outline-pink-400"
              required
            />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border rounded px-3 py-3 text-sm placeholder-gray-400 focus:outline-pink-400"
                required
              />
              <FaEyeSlash
                className="absolute right-3 top-4 text-gray-400 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              />
            </div>

            <div className="flex justify-end">
              <a href="#" className="text-xs text-gray-500">
                Forgot Password?
              </a>
            </div>

            <button
              type="submit"
              className={`w-full py-3 rounded text-white font-medium transition ${
                email && password
                  ? "bg-pink-500 hover:bg-pink-600"
                  : "bg-blue-300 cursor-not-allowed"
              }`}
              disabled={!email || !password}
            >
              Login
            </button>
          </form>

          {/* Message */}
          {message && (
            <p
              className={`mt-4 text-sm font-medium ${
                message.includes("✅") ? "text-green-600" : "text-red-500"
              }`}
            >
              {message}
            </p>
          )}

          {/* Divider */}
          <div className="flex items-center gap-3 my-8">
            <hr className="flex-1 border-gray-300" />
            <span className="text-gray-500 text-sm">Or</span>
            <hr className="flex-1 border-gray-300" />
          </div>

          {/* Social Login */}
          <div className="flex gap-3 justify-center">
            <button className="flex items-center justify-center border border-gray-400 rounded px-4 py-2 gap-2 hover:bg-gray-100 text-sm">
              <FaGoogle className="text-red-500" /> Google
            </button>
            <button className="flex items-center justify-center border border-gray-400 rounded px-4 py-2 gap-2 hover:bg-gray-100 text-sm">
              <FaFacebookF className="text-blue-600" /> Facebook
            </button>
          </div>

          {/* Footer */}
          <p className="mt-16 text-xs text-gray-500">
            © 2025 PetNeo. All Rights Reserved
          </p>
        </div>

        {/* Right Side - Image */}
        <div className="hidden md:flex w-1/2 bg-blue-400 items-center justify-center px-8 md:px-12 lg:px-16 py-12 relative">
          <div className="bg-blue-300 bg-opacity-30 p-10 rounded-lg text-white text-center relative max-w-md w-full">
            <h2 className="text-2xl font-semibold mb-8">
              Welcome to PetNeo - <br /> Connecting Pets & Vets
            </h2>
            <Image
              src="/images/dog.svg"
              alt="Dog"
              width={380}
              height={380}
              className="mx-auto relative z-10"
            />
            {/* Carousel dots */}
            <div className="flex justify-center gap-2 mt-6">
              <span className="w-3 h-3 rounded-full bg-white"></span>
              <span className="w-3 h-3 rounded-full bg-white opacity-50"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
