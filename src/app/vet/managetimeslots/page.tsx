"use client";

import { useState, useEffect } from "react";
import Nav1 from "../../../../components/vet/nav1";

type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

interface Availability {
  id?: number;
  day_of_week: DayOfWeek;
  start_time: string;
  end_time: string;
  slot_duration: number;
  visit_types: string[];
  is_closed: boolean;
  vet_id?: number;
}

interface Break {
  id?: number;
  availability_id: number;
  start_time: string;
  end_time: string;
}

interface Override {
  id?: number;
  date: string;
  start_time: string;
  end_time: string;
  is_closed: boolean;
  slot_duration: number;
  visit_types: string[];
  vet_id?: number;
}

interface VetProfile {
  id?: number;
  first_name?: string;
  last_name?: string;
  profile_picture?: string;
  clinic_name?: string;
  location?: string;
}

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function ManageTimeSlotsPage() {
  const [vetId, setVetId] = useState<number | null>(null);
  const [vetProfile, setVetProfile] = useState<VetProfile | null>(null);
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [visitTypes, setVisitTypes] = useState<string[]>(["Consultation", "Emergency", "Vaccination"]);
  const [selectedVisitType, setSelectedVisitType] = useState<string>("Consultation");
  const [breaks, setBreaks] = useState<Break[]>([]);
  const [overrides, setOverrides] = useState<Override[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "";

  // Get auth token
  const getToken = (): string | null => {
    if (typeof window === "undefined") return null;
    return (
      localStorage.getItem("petneo_token") ||
      localStorage.getItem("accessToken") ||
      localStorage.getItem("token") ||
      null
    );
  };

  // Safe fetch with authentication
  const safeFetch = async (url: string, options: RequestInit = {}) => {
    const token = getToken();
    if (!token) throw new Error("No authentication token found");

    const headers = new Headers(options.headers || {});
    headers.set("Authorization", `Bearer ${token}`);
    if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
      headers.set("Content-Type", "application/json");
    }

    const response = await fetch(url, { ...options, headers });
    
    if (response.status === 401) {
      throw new Error("Unauthorized - please login again");
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  };

  // Fetch vet profile to get vet_id
  const fetchVetProfile = async () => {
    try {
      const token = getToken();
      if (!token) throw new Error("No authentication token found");

      const response = await safeFetch(`${API_BASE}/vet/myBio`);
      
      // Handle different response structures
      let profileData = response;
      if (response && response.data) {
        profileData = response.data;
      }

      setVetProfile(profileData);
      setVetId(profileData.id || null);
      
      return profileData.id;
    } catch (error) {
      console.error("Error fetching vet profile:", error);
      setMessage("⚠️ Failed to load vet profile");
      return null;
    }
  };

  // Fetch all data
  const fetchAllData = async () => {
    setLoading(true);
    setMessage("");

    try {
      // First get vet ID from profile
      const id = await fetchVetProfile();
      if (!id) {
        throw new Error("Could not get vet ID");
      }

      // Fetch availability, breaks, and overrides in parallel
      const [availabilityRes, breaksRes, overridesRes] = await Promise.all([
        safeFetch(`${API_BASE}/availability/${id}`).catch(() => []),
        safeFetch(`${API_BASE}/availability/${id}/breaks`).catch(() => []),
        safeFetch(`${API_BASE}/availability/${id}/overrides`).catch(() => [])
      ]);

      // Initialize default availability if none exists
      if (!availabilityRes || availabilityRes.length === 0) {
        const defaultAvailability: Availability[] = daysOfWeek.map((_, index) => ({
          day_of_week: index as DayOfWeek,
          start_time: "09:00:00",
          end_time: "17:00:00",
          slot_duration: 30,
          visit_types: [selectedVisitType],
          is_closed: index === 0 || index === 6, // Closed on weekends by default
          vet_id: id
        }));
        setAvailability(defaultAvailability);
      } else {
        setAvailability(availabilityRes);
      }

      setBreaks(breaksRes || []);
      setOverrides(overridesRes || []);

    } catch (error: any) {
      console.error("Error fetching data:", error);
      setMessage(`⚠️ ${error.message || "Failed to load data"}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Toggle open/closed for a day
  const handleDayToggle = (dayIndex: DayOfWeek) => {
    const updated = availability.map((day) =>
      day.day_of_week === dayIndex
        ? { ...day, is_closed: !day.is_closed }
        : day
    );
    setAvailability(updated);
  };

  // Update time for a day
  const handleTimeChange = (
    dayIndex: DayOfWeek,
    field: "start_time" | "end_time",
    value: string
  ) => {
    const updated = availability.map((day) =>
      day.day_of_week === dayIndex ? { ...day, [field]: value + ":00" } : day
    );
    setAvailability(updated);
  };

  // Save default availability
  const saveDefaultAvailability = async () => {
    if (!vetId) {
      setMessage("❌ Vet ID not available");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      // Update visit types for all days with current selection
      const availabilityWithVisitTypes = availability.map(day => ({
        ...day,
        visit_types: [selectedVisitType]
      }));

      const data = await safeFetch(
        `${API_BASE}//availability/${vetId}/defaultAvailability`,
        {
          method: "POST",
          body: JSON.stringify(availabilityWithVisitTypes),
        }
      );

      setMessage("✅ Availability saved successfully!");
      // Refresh data to get updated IDs
      fetchAllData();
    } catch (error: any) {
      setMessage(`❌ ${error.message || "Failed to save availability"}`);
    } finally {
      setSaving(false);
    }
  };

  // Add a break
  const addBreak = async (availabilityId: number) => {
    if (!vetId) return;

    try {
      const newBreak = {
        availability_id: availabilityId,
        start_time: "12:00:00",
        end_time: "13:00:00",
      };

      const data = await safeFetch(`${API_BASE}/availability/break`, {
        method: "POST",
        body: JSON.stringify(newBreak),
      });

      setBreaks([...breaks, data]);
      setMessage("✅ Break added successfully!");
    } catch (error: any) {
      setMessage(`❌ ${error.message || "Failed to add break"}`);
    }
  };

  // Add override
  const addOverride = async () => {
    if (!vetId) return;

    try {
      const newOverride = {
        date: selectedDate,
        is_closed: false,
        start_time: "10:00:00",
        end_time: "16:00:00",
        slot_duration: 30,
        visit_types: [selectedVisitType],
      };

      const data = await safeFetch(
        `${API_BASE}/availability/${vetId}/override`,
        {
          method: "POST",
          body: JSON.stringify(newOverride),
        }
      );

      setOverrides([...overrides, data]);
      setMessage("✅ Override added successfully!");
    } catch (error: any) {
      setMessage(`❌ ${error.message || "Failed to add override"}`);
    }
  };

  const formatDisplayDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();
    const suffix =
      day === 1 || day === 21 || day === 31
        ? "st"
        : day === 2 || day === 22
        ? "nd"
        : day === 3 || day === 23
        ? "rd"
        : "th";
    return `${day}${suffix} ${month}, ${year}`;
  };

  const getVetName = () => {
    if (!vetProfile) return "Dr. Veterinarian";
    const firstName = vetProfile.first_name || "";
    const lastName = vetProfile.last_name || "";
    return `Dr. ${firstName} ${lastName}`.trim() || "Dr. Veterinarian";
  };

  const getClinicInfo = () => {
    if (!vetProfile) return "Clinic information not available";
    return [vetProfile.clinic_name, vetProfile.location].filter(Boolean).join(", ") || "Clinic information not available";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav1 />

      <div className="max-w-6xl mx-auto p-4">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-600 mb-6">
          <span className="text-pink-500">Home</span> <span className="mx-2">›</span> Manage Time Slots
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* LEFT PROFILE */}
          <div className="flex flex-col items-center md:w-1/4 bg-white p-6 rounded-xl shadow-md">
            <img
              src={vetProfile?.profile_picture || "/images/d.png"}
              alt="Vet Profile"
              className="w-24 h-24 rounded-full object-cover mb-3 shadow"
              onError={(e) => {
                e.currentTarget.src = "/images/d.png";
              }}
            />
            <div className="text-lg font-semibold text-gray-900">{getVetName()}</div>
            <div className="flex items-center text-gray-600 mt-1 text-sm">
              📍 {getClinicInfo()}
            </div>
          </div>

          {/* RIGHT FORM */}
          <div className="flex-1">
            {loading ? (
              <div className="flex justify-center items-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
                <span className="ml-2 text-gray-600">Loading time slots...</span>
              </div>
            ) : (
              <>
                {/* Pick Services */}
                <div className="mb-6">
                  <div className="font-semibold mb-2 text-gray-900">
                    Pick Services
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {visitTypes.map((service) => (
                      <button
                        key={service}
                        onClick={() => setSelectedVisitType(service)}
                        className={`px-4 py-2 rounded-lg border transition-all shadow-sm ${
                          selectedVisitType === service
                            ? "bg-pink-500 text-white border-pink-500"
                            : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
                        }`}
                      >
                        {service}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Date Picker */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Select Date for Override:
                  </label>
                  <div className="flex items-center flex-wrap gap-2">
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="border rounded px-3 py-2 text-gray-800"
                    />
                    <span className="text-gray-600">
                      {formatDisplayDate(selectedDate)}
                    </span>
                  </div>
                </div>

                {/* Availability Days */}
                <div className="space-y-3 mb-6">
                  {availability.map((day) => {
                    const dayName = daysOfWeek[day.day_of_week];
                    return (
                      <div
                        key={day.day_of_week}
                        className="flex items-center justify-between bg-white p-4 rounded-lg shadow-md"
                      >
                        <div className="flex items-center gap-3">
                          {/* Toggle */}
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={!day.is_closed}
                              onChange={() => handleDayToggle(day.day_of_week)}
                              className="sr-only"
                            />
                            <div className="w-10 h-5 bg-gray-300 rounded-full relative">
                              <div
                                className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition ${
                                  !day.is_closed
                                    ? "translate-x-5 bg-pink-500"
                                    : "translate-x-0"
                                }`}
                              />
                            </div>
                          </label>
                          <span className="font-medium text-gray-900 w-12">
                            {dayName}:
                          </span>
                          <span
                            className={`text-sm ${
                              day.is_closed
                                ? "text-gray-500"
                                : "text-green-600 font-medium"
                            }`}
                          >
                            {day.is_closed ? "Closed" : "Open"}
                          </span>
                        </div>
                        {!day.is_closed && (
                          <div className="flex items-center gap-2">
                            <input
                              type="time"
                              value={day.start_time.substring(0, 5)}
                              onChange={(e) =>
                                handleTimeChange(
                                  day.day_of_week,
                                  "start_time",
                                  e.target.value
                                )
                              }
                              className="border rounded px-2 py-1 text-gray-800"
                            />
                            <span className="text-gray-700">to</span>
                            <input
                              type="time"
                              value={day.end_time.substring(0, 5)}
                              onChange={(e) =>
                                handleTimeChange(
                                  day.day_of_week,
                                  "end_time",
                                  e.target.value
                                )
                              }
                              className="border rounded px-2 py-1 text-gray-800"
                            />
                          </div>
                        )}
                        {!day.is_closed && day.id && (
                          <button
                            onClick={() => addBreak(day.id!)}
                            className="ml-3 px-3 py-1 text-xs bg-yellow-500 text-white rounded shadow hover:bg-yellow-600"
                          >
                            + Break
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Confirm Button */}
                <button
                  onClick={saveDefaultAvailability}
                  disabled={saving || !vetId}
                  className="bg-pink-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-pink-600 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-md w-full transition"
                >
                  {saving ? "Saving..." : "Confirm Availability"}
                </button>

                {message && (
                  <div
                    className={`p-3 rounded mt-4 ${
                      message.includes("❌")
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {message}
                  </div>
                )}

                {/* Overrides Section */}
                <div className="mt-8">
                  <h3 className="font-semibold text-gray-800 mb-2">
                    Date Overrides
                  </h3>
                  <button
                    onClick={addOverride}
                    disabled={!vetId}
                    className="px-3 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 disabled:bg-gray-400"
                  >
                    + Add Override
                  </button>
                  <div className="mt-3 space-y-2">
                    {overrides.map((override) => (
                      <div key={override.id} className="bg-white p-3 rounded shadow">
                        <div className="font-medium">{override.date}</div>
                        <div className="text-sm text-gray-600">
                          {override.start_time.substring(0, 5)} - {override.end_time.substring(0, 5)}
                          {override.is_closed && " (Closed)"}
                        </div>
                      </div>
                    ))}
                    {overrides.length === 0 && (
                      <p className="text-gray-500 text-sm">No overrides set</p>
                    )}
                  </div>
                </div>

                {/* Breaks Section */}
                <div className="mt-8">
                  <h3 className="font-semibold text-gray-800 mb-2">Breaks</h3>
                  <div className="space-y-2">
                    {breaks.map((breakItem) => (
                      <div key={breakItem.id} className="bg-white p-3 rounded shadow">
                        <div className="text-sm text-gray-600">
                          {breakItem.start_time.substring(0, 5)} - {breakItem.end_time.substring(0, 5)}
                        </div>
                      </div>
                    ))}
                    {breaks.length === 0 && (
                      <p className="text-gray-500 text-sm">No breaks set</p>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}