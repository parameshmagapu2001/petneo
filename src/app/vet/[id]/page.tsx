"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "../../../../components/vet/nav1";
import AppointmentDetails from "../../../../components/vet/AppointmentDetails";

interface AppointmentData {
  id: number;
  pet_name?: string;
  petName?: string;
  breed?: string;
  age?: string;
  weight?: string;
  visit_type?: string;
  gender?: string;
  license_number?: string;
  owner_name?: string;
  owner?: string;
  contact_number?: string;
  contact?: string;
  address?: string;
  appointment_date?: string;
  appointment_time?: string;
  status?: string;
  pet_image?: string;
  [key: string]: any;
}

export default function AppointmentDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [appointment, setAppointment] = useState<AppointmentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const id = Number(params.id);
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

  // Fetch appointment details from API
  const fetchAppointmentDetails = async () => {
    if (!id || isNaN(id)) {
      setError("Invalid appointment ID");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const token = getToken();
      if (!token) {
        throw new Error("No authentication token found");
      }

      if (!API_BASE) {
        throw new Error("API base URL not configured");
      }

      // Try multiple possible endpoints
      const endpoints = [
        `/appointments/${id}`,
        `/appointments/${id}`,
        `/appointments/details/${id}`
      ];

      let response = null;
      let lastError = null;

      for (const endpoint of endpoints) {
        try {
          response = await fetch(`${API_BASE}${endpoint}`, {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });

          if (response.ok) {
            const data = await response.json();
            setAppointment(data);
            return; // Success, exit the function
          }
        } catch (err) {
          lastError = err;
          continue; // Try next endpoint
        }
      }

      // If all endpoints failed
      if (response && !response.ok) {
        throw new Error(`Failed to fetch appointment: ${response.status}`);
      }
      throw new Error("No valid endpoint found for appointment details");

    } catch (err: any) {
      console.error("Fetch error:", err);
      setError(err.message || "Failed to load appointment details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchAppointmentDetails();
    }
  }, [id]);

  // Handle back to appointments list
  const handleBack = () => {
    router.push("/vet/dashboard");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
            <p className="text-gray-500 mt-2">Loading appointment details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg max-w-md">
              <h3 className="font-semibold text-lg mb-2">Error Loading Appointment</h3>
              <p className="mb-4">{error}</p>
              <div className="space-x-3">
                <button 
                  onClick={fetchAppointmentDetails}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Try Again
                </button>
                <button 
                  onClick={handleBack}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                >
                  Back to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-6 py-4 rounded-lg max-w-md">
              <h3 className="font-semibold text-lg mb-2">Appointment Not Found</h3>
              <p className="mb-4">The appointment with ID {id} was not found.</p>
              <button 
                onClick={handleBack}
                className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar />

      {/* Back Button */}
      <div className="max-w-4xl mx-auto px-4 pt-6">
        <button 
          onClick={handleBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Appointments
        </button>
      </div>

      {/* Main Content */}
      <main className="py-6">
        <div className="max-w-4xl mx-auto px-4">
          {/* Pass the appointment ID to the details component */}
          <AppointmentDetails appointmentId={id} />
        </div>
      </main>
    </div>
  );
}