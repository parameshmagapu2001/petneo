"use client";

import Link from "next/link";
import Image from "next/image";

export interface AppointmentProps {
  id: number;
  petName: string;
  owner: string;
  date: string;
  status: string;
  image?: string; // optional pet image
}

export default function AppointmentCard({
  id,
  petName,
  owner,
  date,
  status,
  image = "/images/pet-placeholder.jpg", // fallback placeholder
}: AppointmentProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-5 flex flex-col transition-all hover:shadow-xl hover:-translate-y-1">
      {/* Top section with image + info */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 relative rounded-full overflow-hidden border">
          <Image
            src={image}
            alt={petName}
            fill
            className="object-cover"
            sizes="64px"
          />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-800">{petName}</h3>
          <p className="text-sm text-gray-600">Owner: {owner}</p>
          <p className="text-sm text-gray-500">{date}</p>
        </div>
      </div>

      {/* Status */}
      <div className="mt-3">
        <span
          className={`inline-block px-3 py-1 text-xs font-medium rounded-full 
          ${
            status === "Upcoming"
              ? "bg-blue-100 text-blue-700"
              : status === "Completed"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {status}
        </span>
      </div>

      {/* Actions */}
      <div className="mt-4 flex justify-between">
        <button className="px-4 py-2 border border-pink-500 text-pink-500 rounded-lg text-sm font-medium hover:bg-pink-50 transition">
          Reschedule
        </button>
        <Link href={`/doctor/${id}`}>
          <button className="px-4 py-2 bg-pink-500 text-white rounded-lg text-sm font-medium hover:bg-pink-600 transition">
            View Details
          </button>
        </Link>
      </div>
    </div>
  );
}
