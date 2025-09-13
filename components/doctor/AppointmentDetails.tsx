"use client";

import { useState } from "react";
import {
  FaDog,
  FaVenusMars,
  FaWeightHanging,
  FaIdBadge,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaSyringe,
  FaPlus,
} from "react-icons/fa";
import { CheckCircle } from "lucide-react";

interface AppointmentDetail {
  id: number;
  petName: string;
  breed: string;
  age: string;
  weight: string;
  visit: string;
  gender?: string;
  licence?: string;
  owner?: string;
  contact?: string;
  address?: string;
}

type TabType = "details" | "info" | "history";

export default function AppointmentDetails({
  detail,
}: {
  detail: AppointmentDetail;
}) {
  const [activeTab, setActiveTab] = useState<TabType>("details");

  const tabs: TabType[] = ["details", "info", "history"];

  return (
    <div className="bg-[#f8f9fb] min-h-screen py-10">
      <div className="max-w-3xl mx-auto px-4">
        {/* Pet Info Header */}
        <div className="flex flex-col items-center text-center">
          <img
            src="/dog.jpg"
            alt="pet"
            className="w-28 h-28 rounded-full object-cover border-4 border-pink-400 shadow-md"
          />
          <h2 className="mt-4 text-3xl font-bold text-black">
            {detail.petName}
          </h2>
          <p className="text-lg text-black/70 font-medium">
            {detail.breed} | {detail.age}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-3 mt-8 bg-pink-100 rounded-full p-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 px-5 py-3 rounded-full text-base font-semibold transition ${
                activeTab === tab
                  ? "bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-md"
                  : "text-black/70"
              }`}
            >
              {tab === "details" && "View Details"}
              {tab === "info" && "Pet Info"}
              {tab === "history" && "Medical History"}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="mt-8">
          {/* View Details */}
          {activeTab === "details" && (
            <div className="p-6 bg-pink-200 text-black rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold">Today</h3>
              <p className="text-lg font-semibold">12:00 pm - 1:00 pm</p>
              <p className="text-base mt-2 font-semibold">Regular Check-up</p>
              <button className="mt-4 px-4 py-2 bg-white text-pink-600 font-semibold text-sm rounded-full">
                Consultation
              </button>
            </div>
          )}

          {/* Pet Info */}
          {activeTab === "info" && (
            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  icon: <FaDog className="text-pink-500" />,
                  label: "Species: Dog",
                },
                {
                  icon: <FaDog className="text-pink-500" />,
                  label: `Breed: ${detail.breed}`,
                },
                {
                  icon: <FaVenusMars className="text-pink-500" />,
                  label: `Gender: ${detail.gender || "Male"}`,
                },
                {
                  icon: <FaIdBadge className="text-pink-500" />,
                  label: `Age: ${detail.age}`,
                },
                {
                  icon: <FaWeightHanging className="text-pink-500" />,
                  label: `Weight: ${detail.weight}`,
                },
                {
                  icon: <FaIdBadge className="text-pink-500" />,
                  label: `Licence: ${detail.licence || "12345"}`,
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="p-4 bg-white shadow-md rounded-lg flex items-center gap-3 text-black text-lg font-medium"
                >
                  {item.icon} <span>{item.label}</span>
                </div>
              ))}

              <div className="col-span-2 p-4 bg-white shadow-md rounded-lg text-lg text-black">
                <span className="font-semibold">Owner:</span>{" "}
                {detail.owner || "Mohan"}
              </div>
              <div className="p-4 bg-white shadow-md rounded-lg flex items-center gap-3 text-lg text-black">
                <FaPhone className="text-pink-500" />{" "}
                <span>{detail.contact || "545679123"}</span>
              </div>
              <div className="p-4 bg-white shadow-md rounded-lg flex items-center gap-3 text-lg text-black">
                <FaMapMarkerAlt className="text-pink-500" />{" "}
                <span>{detail.address || "Hyd"}</span>
              </div>
            </div>
          )}

          {/* Medical History */}
          {activeTab === "history" && (
            <div className="space-y-6">
              {/* Vaccine Cards */}
              {[
                {
                  name: "Parvovirus",
                  dose: "Booster dose",
                  date: "12th May 2024",
                },
                {
                  name: "Rabies",
                  dose: "Booster dose",
                  date: "12th May 2024",
                },
                {
                  name: "Lyme",
                  dose: "Booster dose",
                  date: "12th May 2024",
                },
              ].map((vaccine, i) => (
                <div
                  key={i}
                  className="bg-white p-5 rounded-xl shadow-md flex justify-between items-center"
                >
                  <div>
                    <h4 className="text-xl font-semibold text-black">
                      {vaccine.name}
                    </h4>
                    <p className="text-base text-black/80 flex items-center gap-2 mt-2">
                      <FaSyringe className="text-pink-500" /> {vaccine.dose}
                    </p>
                    <p className="text-base text-black/80 flex items-center gap-2 mt-1">
                      <FaCalendarAlt className="text-pink-500" /> {vaccine.date}
                    </p>
                  </div>
                  <CheckCircle className="text-pink-500 w-7 h-7" />
                </div>
              ))}

              {/* Add New */}
              <button className="w-full flex items-center justify-center gap-2 bg-pink-100 text-pink-600 rounded-lg py-4 hover:bg-pink-200 transition text-lg font-semibold">
                <FaPlus /> Add New
              </button>

              {/* Prescriptions */}
              <div>
                <h4 className="text-xl font-semibold mb-3 text-black">
                  Prescriptions
                </h4>
                <div className="flex gap-3 bg-white p-4 rounded-lg shadow-md overflow-x-auto">
                  <img
                    src="/prescription1.png"
                    alt="presc"
                    className="w-28 h-28 rounded-lg border object-cover"
                  />
                  <img
                    src="/prescription2.png"
                    alt="presc"
                    className="w-28 h-28 rounded-lg border object-cover"
                  />
                  <button className="w-28 h-28 flex items-center justify-center border-2 border-dashed border-pink-400 rounded-lg text-pink-500 hover:bg-pink-50">
                    <FaPlus size={22} />
                  </button>
                </div>
              </div>

              {/* Save Button */}
              <button className="w-full py-4 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-xl shadow-lg hover:opacity-90 transition text-lg font-semibold">
                Save
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
