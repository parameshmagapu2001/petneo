"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "../../../../components/doctor/nav1";
import { FaDog, FaVenusMars, FaWeightHanging, FaIdBadge, FaPhone, FaMapMarkerAlt, FaCalendarAlt, FaSyringe, FaPlus } from "react-icons/fa";
import { CheckCircle } from "lucide-react";
import { appointments } from "../../../../data/appointments";
import AppointmentDetails from "../../../../components/doctor/AppointmentDetails";

export default function AppointmentDetailsPage() {
  const params = useParams();
  const id = Number(params.id);

  const detail = appointments.find((appt) => appt.id === id);

  if (!detail) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center text-gray-600">
          Appointment not found.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="py-10">
        <div className="max-w-4xl mx-auto">
          {/* Appointment Details Component */}
          <AppointmentDetails detail={detail} />
        </div>
      </main>
    </div>
  );
}
