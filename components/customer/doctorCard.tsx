"use client";

import { AppointmentDetails, AppointmentStatusType } from "./appointmentStatus";

interface DoctorCardProps {
  appointmentDetails: AppointmentDetails;
  onViewDetailsClick?: () => void;
}

export default function DoctorCard({ appointmentDetails, onViewDetailsClick }: DoctorCardProps) {
  const visitLabel =
    appointmentDetails.visit_purpose === "General Visit"
      ? <span className="bg-green-100 text-green-700 rounded px-2 py-0.5 text-xs font-medium ml-2">General Visit</span>
      : appointmentDetails.visit_purpose === "Emergency"
      ? <span className="bg-red-100 text-red-700 rounded px-2 py-0.5 text-xs font-medium ml-2">Emergency Visit</span>
      : null;

  return (
    <div className="bg-white rounded-2xl shadow flex flex-col items-center p-4 min-w-[340px] max-w-md border border-gray-200 text-sm">
        <div className="flex flex-row w-full">
            <img src={appointmentDetails.vetProfileUrl} alt={appointmentDetails.vetName} className="h-20 w-20 rounded-full object-cover mr-4 border"/>
            <div className="flex-1 flex flex-col">
                <div className="font-semibold">{appointmentDetails.vetName ? "Dr. " + appointmentDetails.vetName : ""}</div>
                <div className="text-gray-500 text-xs">{appointmentDetails.vetSpecialization}</div>
            </div>
            <div className="mt-2 self-center">
                <span className="bg-green-100 text-green-700 rounded px-3 py-1 font-medium">
                {appointmentDetails.visit_purpose}
                </span>
            </div>
        </div>
        {onViewDetailsClick && 
            <button className="block mx-auto mt-4 bg-pink-400 hover:bg-pink-500 text-white rounded-lg px-8 py-2 font-medium text-sm transition cursor-pointer"
            onClick={onViewDetailsClick}>
                View Details
            </button>
        }
  </div>
  );
};
