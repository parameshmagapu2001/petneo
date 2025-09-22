import { FaVideo } from "react-icons/fa";
import { AppointmentStatusType } from "./appointmentStatus";



export interface AppointmentBasicDetails {
    id: string;
    vetName: string;
    specialization: string;
    profile_url: string;
    vetId: number;
    visit_purpose: "General Visit" | "Emergency";
    status: AppointmentStatusType;
}

interface DoctorCardProps {
  appointmentDetails: AppointmentBasicDetails;
}

export default function DoctorCard({ appointmentDetails }: DoctorCardProps) {
  const visitLabel =
    appointmentDetails.visit_purpose === "General Visit"
      ? <span className="bg-green-100 text-green-700 rounded px-2 py-0.5 text-xs font-medium ml-2">General Visit</span>
      : appointmentDetails.visit_purpose === "Emergency"
      ? <span className="bg-red-100 text-red-700 rounded px-2 py-0.5 text-xs font-medium ml-2">Emergency Visit</span>
      : null;

  return (
    <div className="bg-white rounded-2xl shadow flex flex-col items-center p-4 min-w-[340px] max-w-md border border-gray-200">
        <div className="flex flex-row w-full">
            <img src={appointmentDetails.profile_url} alt={appointmentDetails.vetName} className="h-20 w-20 rounded-full object-cover mr-4 border"/>
            <div className="flex-1 flex flex-col">
                <div className="font-semibold text-base">{appointmentDetails.vetName ? "Dr. " + appointmentDetails.vetName : ""}</div>
                <div className="text-gray-500 text-sm">{appointmentDetails.specialization}</div>
            </div>
            <div className="mt-2 self-center">
                <span className="bg-green-100 text-green-700 rounded px-3 py-1 text-xs font-medium">
                {appointmentDetails.visit_purpose}
                </span>
            </div>
        </div>
        <button className="block mx-auto mt-4 bg-pink-400 hover:bg-pink-500 text-white rounded-lg px-8 py-2 font-medium text-sm transition">
            View Details
        </button>
  </div>
  );
};
