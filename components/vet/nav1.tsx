"use client";

import React, { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

type VetProfile = {
  first_name?: string;
  last_name?: string;
  profile_picture?: string | null;
  avatar?: string | null;
  emergency?: boolean | number;
  [k: string]: any;
};

type DropdownItem = {
  label: string;
  icon: string;
  href?: string;
};

export default function Nav1(): React.JSX.Element {
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);
  const [vet, setVet] = useState<VetProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [todayCount, setTodayCount] = useState<number | null>(null);
  const [updatingEmergency, setUpdatingEmergency] = useState(false);
  const [menuAnimating, setMenuAnimating] = useState(false);

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "";

  // Get token from localStorage
  const getToken = (): string | null => {
    if (typeof window === "undefined") return null;
    return (
      localStorage.getItem("petneo_token") ||
      localStorage.getItem("accessToken") ||
      localStorage.getItem("access_token") ||
      localStorage.getItem("token") ||
      localStorage.getItem("auth_token") ||
      localStorage.getItem("vetToken") ||
      null
    );
  };

  // Clear all auth
  const clearAuth = () => {
    [
      "petneo_token",
      "accessToken",
      "access_token",
      "token",
      "auth_token",
      "vetToken",
      "refreshToken",
      "refresh_token",
      "vet_id",
    ].forEach((k) => localStorage.removeItem(k));
  };

  // Safe fetch with token and JSON parsing
  const safeFetch = async (url: string, opts: RequestInit = {}) => {
    const token = getToken();
    if (!token) throw new Error("No auth token found");

    const headers = new Headers(opts.headers ?? {});
    headers.set("Authorization", `Bearer ${token}`);
    if (!headers.has("Content-Type") && !(opts.body instanceof FormData)) {
      headers.set("Content-Type", "application/json");
    }

    const res = await fetch(url, { ...opts, headers });

    if (res.status === 401) {
      clearAuth();
      throw new Error("Unauthorized (401) - session expired");
    }

    const text = await res.text();
    if (!text) return { ok: res.ok, status: res.status, data: null, raw: "" };

    if (text.trim().startsWith("<")) return { ok: res.ok, status: res.status, data: null, raw: text };

    try {
      const data = JSON.parse(text);
      return { ok: res.ok, status: res.status, data, raw: text };
    } catch {
      return { ok: res.ok, status: res.status, data: text, raw: text };
    }
  };

  // Fetch vet profile and today's appointments
  useEffect(() => {
    let mounted = true;

    const fetchAll = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!API_BASE) throw new Error("API_BASE not configured.");

        // Fetch profile
        const profileUrl = `${API_BASE}/vet/myBio`;
        const profileRes = await safeFetch(profileUrl, { method: "GET" });
        if (!mounted) return;
        if (!profileRes.ok) throw new Error("Failed to load profile");

        let profileData: any = profileRes.data;
        if (profileData && profileData.data && typeof profileData.data === "object") profileData = profileData.data;

        const normalized: VetProfile = {
          first_name: profileData?.first_name ?? profileData?.name ?? profileData?.vet_name,
          last_name: profileData?.last_name ?? profileData?.surname,
          profile_picture: profileData?.profile_picture ?? profileData?.avatar ?? null,
          avatar: profileData?.profile_picture ?? profileData?.avatar ?? null,
          emergency: profileData?.emergency ?? profileData?.is_emergency ?? profileData?.emergency_mode ?? false,
          ...profileData,
        };
        setVet(normalized);

        // Fetch today's appointment summary
        try {
          const summaryUrl = `${API_BASE}/appointments/vetTodaySummary`;
          const summaryRes = await safeFetch(summaryUrl, { method: "GET" });
          if (!summaryRes.ok) {
            setTodayCount(null);
          } else {
            let s = summaryRes.data;
            const possible = s?.total ?? s?.count ?? s?.appointments_count ?? s?.total_requests ?? s?.data?.total ?? null;
            setTodayCount(typeof possible === "number" ? possible : null);
          }
        } catch {
          setTodayCount(null);
        }
      } catch (err: any) {
        setError(err.message || "Failed to load profile");
        setVet(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchAll();
    return () => {
      mounted = false;
    };
  }, [API_BASE]);

  // Toggle emergency status
  const toggleEmergency = async () => {
    if (!vet) return;
    setUpdatingEmergency(true);
    setError(null);
    try {
      const next = !Boolean(vet.emergency);
      const url = `${API_BASE}/vet/updateEmergency`;
      const res = await safeFetch(url, { method: "PUT", body: JSON.stringify({ emergency: next }) });
      if (!res.ok) throw new Error("Failed to update emergency status");

      const data = res.data && typeof res.data === "object" ? res.data : null;
      setVet((prev) => ({ ...(prev ?? {}), emergency: data?.emergency ?? next }));
    } catch (err: any) {
      setError(err.message || "Failed to update emergency status");
    } finally {
      setUpdatingEmergency(false);
    }
  };

  // Logout handler
  const handleLogout = () => {
    clearAuth();
    if (typeof window !== "undefined") window.location.href = "/vet/login";
    else router.push("/vet/login");
  };

  const getVetName = () => {
    if (loading) return "Loading...";
    if (!vet) return "Veterinarian";
    const f = vet.first_name?.trim();
    const l = vet.last_name?.trim();
    if (f && l) return `Dr. ${f} ${l}`;
    if (f) return `Dr. ${f}`;
    return "Veterinarian";
  };

  const getProfileImageSrc = () => {
    const p = vet?.profile_picture ?? vet?.avatar ?? null;
    if (p) {
      if (p.startsWith("http")) return p;
      if (API_BASE) return `${API_BASE.replace(/\/$/, "")}/${p.replace(/^\//, "")}`;
      return p;
    }
    return "/images/d.png"; // Consistent path
  };

  // Menu items array
  const dropdownItems: DropdownItem[] = [
    { label: "Work Status", icon: "🔔" },
    { label: "Manage Time Slots", icon: "⏱", href: "/vet/managetimeslots" },
    { label: "My Bio", icon: "💳", href: "/vet/mybio" },
    { label: "Privacy", icon: "🔒" },
    { label: "Help", icon: "❓" },
    { label: "About", icon: "ℹ️" },
  ];

  return (
    <nav className="flex justify-between items-center bg-white px-6 py-4 shadow-md relative z-40">
      {/* Left - Logo */}
      <div className="flex items-center gap-1">
        <Link href="/vet/dashboard" className="inline-flex items-center">
          <Image src="/images/logo.svg" alt="Petneo Logo" width={140} height={40} priority />
        </Link>
      </div>

      {/* Right - actions */}
      <div className="flex items-center gap-6">
        <div className="hidden md:flex items-center gap-3 bg-white rounded-xl shadow px-4 py-2">
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-800">Emergency Requests</span>
            <span className="text-xs text-gray-500">{todayCount !== null ? `${todayCount} today` : "—"}</span>
          </div>
          <button
            onClick={toggleEmergency}
            disabled={updatingEmergency || loading}
            title="Toggle emergency availability"
            className={`ml-3 inline-flex items-center px-3 py-1 rounded-full font-medium text-sm transition ${
              vet?.emergency ? "bg-pink-500 text-white" : "bg-gray-200 text-gray-700"
            } ${updatingEmergency ? "opacity-70 cursor-wait" : ""}`}
          >
            {updatingEmergency ? "Updating..." : vet?.emergency ? "On" : "Off"}
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-700 hidden sm:block">{getVetName()}</span>
          <div className="w-9 h-9 relative">
            <Image
              src={getProfileImageSrc()}
              alt="profile"
              width={36}
              height={36}
              className="rounded-full object-cover border border-gray-200"
              onError={(e) => {
                // Use the same path as getProfileImageSrc for consistency
                const target = e.target as HTMLImageElement;
                target.src = "/images/d.png";
              }}
            />
          </div>
        </div>

        <button
          onClick={() => {
            setMenuOpen((s) => !s);
            setMenuAnimating(true);
            setTimeout(() => setMenuAnimating(false), 350);
          }}
          className="text-gray-700 focus:outline-none"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Dropdown Menu */}
      {menuOpen && (
        <div
          className={`absolute right-6 top-20 bg-white rounded-2xl shadow-lg w-72 p-4 z-50 ${
            menuAnimating ? "animate-fadeIn" : ""
          }`}
        >
          <ul className="space-y-3">
            {dropdownItems.map((item, idx) => (
              <li
                key={idx}
                className={`flex items-center gap-3 text-gray-800 hover:bg-pink-50 px-3 py-2 rounded-lg ${
                  item.href ? "" : "cursor-pointer"
                }`}
              >
                <span>{item.icon}</span>
                {item.href ? (
                  <Link 
                    href={item.href} 
                    className="flex-1"
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="flex-1">{item.label}</span>
                )}
              </li>
            ))}
          </ul>

          <button
            onClick={handleLogout}
            className="mt-4 w-full bg-pink-500 text-white py-2 rounded-lg font-semibold hover:bg-pink-600 transition-colors"
          >
            Logout
          </button>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-md text-sm">
          {error}
        </div>
      )}
    </nav>
  );
}