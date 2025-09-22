"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Poppins } from "next/font/google";

// IMPORT NAVBAR: adjust path if your Navbar lives elsewhere.
// e.g. "@/components/Navbar" or "../components/Navbar"
import Navbar from "../../../../components/vet/nav1";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// ✅ Types
interface VetProfile {
  first_name: string;
  last_name: string;
  email: string;
  mobile_number: string;
  qualification: string;
  specialization: string;
  license_number: string;
  license_issuing_authority: string;
  years_of_experience: string;
  clinic_name: string;
  location: string;
  address: string;
  landmark: string;
  service_ids: string;
  profile_picture?: string;
  certification_document?: string;
}

export default function MyBioPage() {
  const [profile, setProfile] = useState<VetProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<VetProfile | null>(null);
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [certificate, setCertificate] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const apiBase = process.env.NEXT_PUBLIC_API_BASE || "";

  // ✅ Fetch vet data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`${apiBase}/vet/myBio`, {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) {
          // Read message from API (if any) and show friendly text
          let msg = `Failed to fetch profile (${res.status})`;
          try {
            const js = await res.json();
            if (js?.message) msg = js.message;
          } catch {}
          throw new Error(msg);
        }

        const data = await res.json();
        setProfile(data);
        setForm(data);
      } catch (err: any) {
        console.error("fetchProfile error:", err);
        setError("Failed to load profile. You can still view and edit the form below.");
        // leave profile/form null so inputs show N/A or empty
        setProfile(null);
        setForm({
          first_name: "",
          last_name: "",
          email: "",
          mobile_number: "",
          qualification: "",
          specialization: "",
          license_number: "",
          license_issuing_authority: "",
          years_of_experience: "",
          clinic_name: "",
          location: "",
          address: "",
          landmark: "",
          service_ids: "",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiBase]);

  // ✅ Handle update
  const handleSave = async () => {
    if (!form) return;
    try {
      setSaving(true);
      const formData = new FormData();

      // Append all form fields
      Object.entries(form).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, String(value));
        }
      });

      // Append files if selected
      if (profilePic) {
        formData.append("profile_picture", profilePic);
      }
      if (certificate) {
        formData.append("certification_document", certificate);
      }

      const res = await fetch(`${apiBase}/vet/updateBio`, {
        method: "PUT",
        body: formData,
        credentials: "include",
      });

      if (!res.ok) {
        let msg = `Update failed (${res.status})`;
        try {
          const js = await res.json();
          if (js?.message) msg = js.message;
        } catch {}
        throw new Error(msg);
      }

      const updated = await res.json();
      setProfile(updated);
      setForm(updated);
      setEditing(false);
      setProfilePic(null);
      setCertificate(null);
      alert("Profile updated ✅");
    } catch (err: any) {
      console.error("update error:", err);
      alert(`Failed to update profile ❌ — ${err?.message || ""}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center h-screen text-gray-600">
          Loading profile...
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className={`min-h-screen bg-gray-50 p-6 ${poppins.className}`}>
        {/* Breadcrumb */}
        <div className="mb-6 text-sm text-gray-600">
          <Link href="/vet/dashboard" className="hover:underline text-pink-500">
            Home
          </Link>{" "}
          › <span className="text-gray-800">My Bio</span>
        </div>

        {/* Card */}
        <div className="max-w-4xl mx-auto bg-white shadow rounded-xl p-6">
          {error && <p className="mb-4 text-red-500 text-sm">{error}</p>}

          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
              {/* Note: if profile_picture is external, ensure next.config.js allows that domain */}
              <Image
                src={profile?.profile_picture || "/avatar.png"}
                alt="Profile"
                width={80}
                height={80}
                className="rounded-full object-cover"
              />
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-800">
                {(form?.first_name || "N/A") + (form?.last_name ? " " + form.last_name : "")}
              </h2>
              <p className="text-gray-600">{form?.specialization || "N/A"}</p>
              <p className="text-sm text-gray-500">{form?.email || "N/A"}</p>
            </div>
          </div>

          {/* Editable Form */}
          <div className="grid md:grid-cols-2 gap-6">
            {Object.entries({
              first_name: "First Name",
              last_name: "Last Name",
              email: "Email",
              mobile_number: "Mobile",
              qualification: "Qualification",
              specialization: "Specialization",
              years_of_experience: "Experience (Years)",
              license_number: "License No",
              license_issuing_authority: "Issued By",
              clinic_name: "Clinic Name",
              location: "Location",
              address: "Address",
              landmark: "Landmark",
              service_ids: "Service IDs",
            }).map(([key, label]) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {label}
                </label>
                <input
                  type="text"
                  disabled={!editing}
                  value={(form as any)?.[key] ?? ""}
                  onChange={(e) => setForm({ ...form!, [key]: e.target.value })}
                  className={`w-full border rounded-md px-3 py-2 ${
                    editing ? "bg-white" : "bg-gray-100"
                  }`}
                />
              </div>
            ))}
          </div>

          {/* File Uploads */}
          {editing && (
            <div className="mt-6 grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Profile Picture
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setProfilePic(e.target.files ? e.target.files[0] : null)}
                  className="w-full border rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Certification Document
                </label>
                <input
                  type="file"
                  onChange={(e) => setCertificate(e.target.files ? e.target.files[0] : null)}
                  className="w-full border rounded-md px-3 py-2"
                />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="mt-6 flex justify-end gap-3">
            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded-md"
              >
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  onClick={() => {
                    setForm(profile ?? {
                      first_name: "",
                      last_name: "",
                      email: "",
                      mobile_number: "",
                      qualification: "",
                      specialization: "",
                      license_number: "",
                      license_issuing_authority: "",
                      years_of_experience: "",
                      clinic_name: "",
                      location: "",
                      address: "",
                      landmark: "",
                      service_ids: "",
                    });
                    setEditing(false);
                  }}
                  className="px-4 py-2 border rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className={`px-4 py-2 bg-pink-500 text-white rounded-md ${saving ? "opacity-70 cursor-wait" : ""}`}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
