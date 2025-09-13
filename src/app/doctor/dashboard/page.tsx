"use client";

import { useState } from "react";
import Navbar from "../../../../components/doctor/nav1";
import Tabs from "../../../../components/doctor/tabs";
import AppointmentCard, { AppointmentProps } from "../../../../components/doctor/AppointmentCard";

export default function DoctorDashboard() {
  // 10 sample appointments
  const appointments: AppointmentProps[] = [
    { id: 1, petName: "Bruno", owner: "John Doe", date: "2025-09-15", status: "Upcoming" },
    { id: 2, petName: "Milo", owner: "Sarah Lee", date: "2025-09-16", status: "Completed" },
    { id: 3, petName: "Lucy", owner: "Michael Chen", date: "2025-09-17", status: "Ongoing" },
    { id: 4, petName: "Rocky", owner: "Priya Sharma", date: "2025-09-18", status: "Reschedule" },
    { id: 5, petName: "Max", owner: "David Johnson", date: "2025-09-19", status: "Upcoming" },
    { id: 6, petName: "Bella", owner: "Emma Wilson", date: "2025-09-20", status: "Completed" },
    { id: 7, petName: "Coco", owner: "Ravi Patel", date: "2025-09-21", status: "Ongoing" },
    { id: 8, petName: "Daisy", owner: "Sophia Brown", date: "2025-09-22", status: "Reschedule" },
    { id: 9, petName: "Charlie", owner: "Amit Verma", date: "2025-09-23", status: "Upcoming" },
    { id: 10, petName: "Luna", owner: "Olivia White", date: "2025-09-24", status: "Completed" },
  ];

  // states for tabs
  const [activeTab, setActiveTab] = useState("Appointments");
  const [activeSubTab, setActiveSubTab] = useState("Upcoming");

  // filter logic (only works for "Appointments")
  const filteredAppointments =
    activeTab === "Appointments"
      ? appointments.filter((appt) => appt.status === activeSubTab)
      : [];

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      <section className="p-6">
        {/* Pass handlers to Tabs */}
        <Tabs
          onChange={(main, sub) => {
            setActiveTab(main);
            setActiveSubTab(sub);
          }}
        />

        {/* Appointment Cards */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAppointments.length > 0 ? (
            filteredAppointments.map((appt) => (
              <AppointmentCard key={appt.id} {...appt} />
            ))
          ) : (
            <p className="text-gray-500 col-span-full text-center py-10">
              No {activeSubTab} {activeTab.toLowerCase()} found.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
