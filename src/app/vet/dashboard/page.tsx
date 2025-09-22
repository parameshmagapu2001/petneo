"use client";

import { useState, useEffect } from "react";
import Navbar from "../../../../components/vet/nav1";
import Tabs from "../../../../components/vet/tabs";
import AppointmentCard, { AppointmentProps } from "../../../../components/vet/AppointmentCard";

type ApiAppointment = {
  id: number;
  pet_name?: string;
  petName?: string;
  owner_name?: string;
  owner?: string;
  date?: string;
  appointment_date?: string;
  status?: string;
  appointment_status?: string;
  [key: string]: any;
};

export default function VetDashboard() {
  const [appointments, setAppointments] = useState<AppointmentProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [activeTab, setActiveTab] = useState("Appointments");
  const [activeSubTab, setActiveSubTab] = useState("Upcoming");

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

  // Safe fetch with better error handling
  const safeFetch = async (url: string) => {
    const token = getToken();
    if (!token) throw new Error("No authentication token found");

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    // Check if response is HTML (error page)
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('text/html')) {
      const text = await response.text();
      throw new Error(`Server returned HTML. Endpoint may not exist. Status: ${response.status}`);
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  };

  // Fetch appointments from API - USING CORRECT ENDPOINTS FROM YOUR DOCS
  const fetchAppointments = async () => {
    setLoading(true);
    setError(null);
    
    try {
      if (!API_BASE) {
        throw new Error("API base URL not configured");
      }

      // Use the correct endpoint from your API documentation
      const endpoint = "/appointments/myAppointments"; // This is the correct endpoint

      console.log("Fetching from:", `${API_BASE}${endpoint}`);

      const data = await safeFetch(`${API_BASE}${endpoint}`);
      
      // Handle different response structures
      let appointmentsData = [];
      if (Array.isArray(data)) {
        appointmentsData = data;
      } else if (data && Array.isArray(data.data)) {
        appointmentsData = data.data;
      } else if (data && Array.isArray(data.appointments)) {
        appointmentsData = data.appointments;
      } else {
        // If no array found, try to use the root object as array
        appointmentsData = data ? [data] : [];
      }

      // Transform API data to match AppointmentProps
      const transformedAppointments: AppointmentProps[] = appointmentsData.map((appt: ApiAppointment, index: number) => ({
        id: appt.id || index,
        petName: appt.pet_name || appt.petName || "Unknown Pet",
        owner: appt.owner_name || appt.owner || "Unknown Owner",
        date: appt.appointment_date || appt.date || "Unknown Date",
        status: appt.appointment_status || appt.status || "Unknown",
      }));

      setAppointments(transformedAppointments);
    } catch (err: any) {
      console.error("Fetch error:", err);
      setError(err.message || "Failed to load appointments");
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch appointments when component mounts
  useEffect(() => {
    fetchAppointments();
  }, []);

  // Filter appointments based on active subtab
  const filteredAppointments = appointments.filter(appt => {
    if (activeTab === "Appointments") {
      return appt.status?.toLowerCase().includes(activeSubTab.toLowerCase());
    }
    return true;
  });

  // Handle tab changes - no API call, just local filtering
  const handleTabChange = (mainTab: string, subTab: string) => {
    setActiveTab(mainTab);
    setActiveSubTab(subTab);
  };

  // Refresh data
  const handleRefresh = () => {
    fetchAppointments();
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      <section className="p-6">
        {/* Tabs with refresh capability */}
        <div className="flex justify-between items-center mb-4">
          <Tabs onChange={handleTabChange} />
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {/* Debug Info */}
        <div className="mb-4 p-3 bg-yellow-100 rounded text-sm">
          <strong>API Status:</strong> {API_BASE ? "✅ Configured" : "❌ Not configured"} | 
          <strong> Endpoint:</strong> /appointments/myAppointments | 
          <strong> Results:</strong> {appointments.length} appointments
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-gray-500 mt-2">Loading appointments...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p className="font-semibold">Error Loading Appointments</p>
            <p className="text-sm mt-1">{error}</p>
            <p className="text-xs mt-2">
              <strong>Expected endpoint:</strong> GET /appointments/myAppointments
            </p>
            <div className="mt-3 space-x-2">
              <button 
                onClick={handleRefresh}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Try Again
              </button>
              <button 
                onClick={() => setError(null)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Appointment Cards */}
        {!loading && !error && (
          <>
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                Showing {filteredAppointments.length} of {appointments.length} appointments 
                ({activeTab} › {activeSubTab})
              </p>
            </div>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map((appt) => (
                  <AppointmentCard key={appt.id} {...appt} />
                ))
              ) : (
                <div className="col-span-full text-center py-10">
                  <p className="text-gray-500 text-lg">
                    No {activeSubTab.toLowerCase()} appointments found.
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    Try changing tabs or check if appointments exist.
                  </p>
                  <button 
                    onClick={handleRefresh}
                    className="mt-3 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                  >
                    Check Again
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </section>
    </main>
  );
}