"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

type LoginResponse = {
  user_type?: string;
  access_token?: string;
  accessToken?: string;
  token?: string;
  refresh_token?: string;
  refreshToken?: string;
  vet_id?: number | string;
  message?: string;
  success?: boolean;
  [k: string]: any;
};

interface LoginPageProps {
  pageType: "vet" | "customer"
}

export default function LoginPage({pageType}: LoginPageProps) {
  const router = useRouter();
  const [agentTab, setAgentTab] = useState(pageType === "vet");
  const [mobile, setMobile] = useState(""); // raw digits only
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"mobile" | "otp">("mobile");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // resend cooldown (seconds)
  const RESEND_COOLDOWN = 30;
  const [cooldown, setCooldown] = useState(0);
  const cooldownRef = useRef<number | null>(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "";

  useEffect(() => {
    return () => {
      if (cooldownRef.current) {
        window.clearInterval(cooldownRef.current);
        cooldownRef.current = null;
      }
    };
  }, []);

  const startCooldown = (seconds = RESEND_COOLDOWN) => {
    setCooldown(seconds);
    if (cooldownRef.current) window.clearInterval(cooldownRef.current);
    cooldownRef.current = window.setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          if (cooldownRef.current) {
            window.clearInterval(cooldownRef.current);
            cooldownRef.current = null;
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const isValidMobile = (number: string): boolean => {
    if (number.length !== 10) return false;
    return ["6", "7", "8", "9"].includes(number.charAt(0));
  };

  const normalizeToken = (raw?: string | null) => {
    if (!raw) return null;
    const s = raw.trim();
    return s.toLowerCase().startsWith("bearer ") ? s.slice(7) : s;
  };

  const saveTokensToLocalStorage = (resp: LoginResponse | string | null) => {
    try {
      ["petneo_token","accessToken","access_token","token","auth_token","vetToken","refreshToken","refresh_token"].forEach(k => localStorage.removeItem(k));

      let rawToken: string | null = null;
      let refresh: string | null = null;
      let vetId: string | number | null = null;

      if (!resp) {
        console.warn("saveTokensToLocalStorage called with null/undefined response");
      } else if (typeof resp === "string") {
        rawToken = resp;
      } else {
        rawToken = resp.access_token ?? resp.accessToken ?? resp.token ?? (resp as any).auth_token ?? null;
        refresh = resp.refresh_token ?? resp.refreshToken ?? null;
        vetId = resp.vet_id ?? null;
      }

      if (rawToken) {
        const token = normalizeToken(rawToken);
        if (token) {
          localStorage.setItem("petneo_token", token);
          localStorage.setItem("accessToken", token);
          localStorage.setItem("token", token);
          localStorage.setItem("auth_token", token);
        }
      }

      if (refresh) {
        localStorage.setItem("refresh_token", String(refresh));
        localStorage.setItem("refreshToken", String(refresh));
      }
      if (vetId) localStorage.setItem("vet_id", String(vetId));
    } catch (err) {
      console.error("Error saving tokens to localStorage:", err);
    }
  };

  // ---------- SEND OTP using query params ----------
  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      if (!API_BASE) throw new Error("API_BASE not configured.");
      if (!isValidMobile(mobile)) throw new Error("Please enter a valid 10-digit Indian mobile number starting with 6,7,8, or 9.");

      startCooldown();

      const url = `${API_BASE.replace(/\/$/, "")}/${agentTab ? "auth" : "user"}/login/sendOtp?mobile_number=${encodeURIComponent(mobile)}`;
      const res = await fetch(url, { method: "POST" });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || data?.detail || "Failed to send OTP");
      } else if (!data.status) {
         if (data?.message && typeof data.message === "string" && data.message.toLowerCase().includes("mobile number not registered.")) {
          throw new Error(data.message);
        }
      }
        
      setMessage("✅ OTP sent successfully. Please enter the 6-digit OTP.");
      setStep("otp");
    } catch (err: any) {
      setMessage(`❌ ${err.message || "Failed to send OTP"}`);
      if (cooldownRef.current) {
        window.clearInterval(cooldownRef.current);
        cooldownRef.current = null;
      }
      setCooldown(0);
    } finally {
      setLoading(false);
    }
  };

  // ---------- VERIFY OTP using query params ----------
  const handleVerifyOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      if (!API_BASE) throw new Error("API_BASE not configured.");
      if (!/^\d{6}$/.test(otp)) throw new Error("Please enter a valid 6-digit OTP.");

      const url = `${API_BASE.replace(/\/$/, "")}/${agentTab ? "auth" : "user"}/login/verifyOtp?mobile_number=${encodeURIComponent(mobile)}&otp=${encodeURIComponent(otp)}`;

      const res = await fetch(url, { method: "POST" });
      const json = await res.json();

      if (!res.ok) throw new Error(json?.message || json?.detail || "Invalid OTP");

      saveTokensToLocalStorage(json);

      setMessage("✅ Login successful! Redirecting...");
      setTimeout(() => {
        const userType = json?.user_type ?? agentTab ? "vet" : "user";
        if (String(userType).toLowerCase() === "vet") router.push("/vet/dashboard");
        else router.push("/customer/dashboard");
      }, 900);
    } catch (err: any) {
      setMessage(`❌ ${err.message || "Failed to verify OTP"}`);
    } finally {
      setLoading(false);
    }
  };

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 10) setMobile(value);
    if (message) setMessage("");
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 6) setOtp(value);
    if (message) setMessage("");
  };

  const handleResend = async () => {
    if (cooldown > 0) return;
    await handleSendOtp();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-6xl bg-white shadow-md rounded-md flex overflow-hidden">
        {/* Left Side - Login Form */}
        <div className="w-full md:w-1/2 px-8 md:px-12 lg:px-16 py-12 text-black">
          {/* Logo */}
          <div className="mb-8">
            <div className="relative w-[140px] h-[50px]">
              <Image src="/images/logo.svg" alt="PetNeo Logo" fill className="object-contain" />
            </div>
          </div>

          {/* Tabs */}
          <div className="flex mb-8">
            <button
              aria-pressed={agentTab}
              className={`flex-1 py-2 rounded-full text-sm font-medium ${agentTab ? "bg-pink-500 text-white" : "bg-pink-200 text-gray-600"}`}
              onClick={() => setAgentTab(true)}
              type="button"
            >
              Agent
            </button>
            <button
              aria-pressed={!agentTab}
              className={`flex-1 py-2 rounded-full text-sm font-medium ${!agentTab ? "bg-pink-500 text-white" : "bg-pink-200 text-gray-600"}`}
              onClick={() => setAgentTab(false)}
              type="button"
            >
              User
            </button>
          </div>

          {/* Form Header */}
          <div className="mb-6 flex justify-between items-center">
            <h2 className="font-bold text-lg">Log In</h2>
            <button
              onClick={() => router.push(`/${agentTab ? "vet" : "customer"}/signup`)}
              className="px-3 py-1 rounded-full text-sm bg-pink-100 text-pink-800 border border-pink-200 hover:bg-pink-200 transition"
              type="button"
            >
              Signup
            </button>
          </div>

          {/* Form */}
          {step === "mobile" ? (
            <form className="space-y-5" onSubmit={handleSendOtp}>
              <div>
                <input
                  inputMode="numeric"
                  aria-label="Mobile number"
                  placeholder="Enter your 10-digit mobile number"
                  value={mobile}
                  onChange={handleMobileChange}
                  maxLength={10}
                  className="w-full border rounded px-3 py-3 text-sm placeholder-gray-400 focus:outline-pink-400 focus:ring-2 focus:ring-pink-300"
                  required
                />
                {mobile.length === 10 && !isValidMobile(mobile) && (
                  <p className="text-red-500 text-xs mt-1">Mobile number must start with 6, 7, 8, or 9</p>
                )}
              </div>
              <button
                type="submit"
                className={`w-full py-3 rounded text-white font-medium transition ${isValidMobile(mobile) ? "bg-pink-500 hover:bg-pink-600" : "bg-gray-300 cursor-not-allowed"}`}
                disabled={!isValidMobile(mobile) || loading}
                aria-disabled={!isValidMobile(mobile) || loading}
              >
                {loading ? "Sending..." : "Send OTP"}
              </button>
            </form>
          ) : (
            <form className="space-y-5" onSubmit={handleVerifyOtp}>
              <div>
                <input
                  inputMode="numeric"
                  aria-label="OTP"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={handleOtpChange}
                  maxLength={6}
                  className="w-full border rounded px-3 py-3 text-sm placeholder-gray-400 focus:outline-pink-400 focus:ring-2 focus:ring-pink-300"
                  required
                />
                {otp.length > 0 && otp.length !== 6 && <p className="text-red-500 text-xs mt-1">OTP must be 6 digits</p>}
              </div>
              <button
                type="submit"
                className={`w-full py-3 rounded text-white font-medium transition ${otp.length === 6 ? "bg-pink-500 hover:bg-pink-600" : "bg-gray-300 cursor-not-allowed"}`}
                disabled={otp.length !== 6 || loading}
                aria-disabled={otp.length !== 6 || loading}
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={loading || cooldown > 0}
                  className={`text-pink-500 text-sm hover:text-pink-700 disabled:text-gray-400`}
                >
                  {cooldown > 0 ? `Resend OTP in ${cooldown}s` : "Resend OTP"}
                </button>
              </div>
            </form>
          )}

          {/* Message */}
          {message && (
            <div role="status" className={`mt-4 p-3 rounded text-sm ${message.includes("✅") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
              {message}
            </div>
          )}

          {/* Footer */}
          <p className="mt-16 text-xs text-gray-500">© 2025 PetNeo. All Rights Reserved</p>
        </div>

        {/* Right Side - Image */}
        <div className="hidden md:flex w-1/2 bg-blue-400 items-center justify-center px-8 md:px-12 lg:px-16 py-12 relative">
          <div className="bg-blue-300 bg-opacity-30 p-10 rounded-lg text-white text-center relative max-w-md w-full">
            <h2 className="text-2xl font-semibold mb-8">Welcome to PetNeo - <br /> Connecting Pets & Vets</h2>
            <Image src="/images/dog.svg" alt="Dog" width={380} height={380} className="mx-auto relative z-10" />
            <div className="flex justify-center gap-2 mt-6">
              <span className="w-3 h-3 rounded-full bg-white" />
              <span className="w-3 h-3 rounded-full bg-white opacity-50" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
