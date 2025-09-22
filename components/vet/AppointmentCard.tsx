"use client";

import Link from "next/link";
import Image from "next/image";

export interface AppointmentProps {
  id: number;
  petName: string;
  owner: string;
  date: string;
  status: string;
  image?: string;
  // Additional API fields that might be available
  pet_image?: string;
  owner_name?: string;
  appointment_date?: string;
  appointment_status?: string;
  [key: string]: any; // Allow any additional API fields
}

export default function AppointmentCard(props: AppointmentProps) {
  // Use API data with fallbacks to empty strings if not provided
  const {
    id,
    petName = "",
    owner = "",
    date = "",
    status = "",
    image = "",
    pet_image = "",
    owner_name = "",
    appointment_date = "",
    appointment_status = "",
    ...restProps
  } = props;

  // Prioritize API field names, fall back to component props
  const actualPetName = petName || "Pet";
  const actualOwner = owner || owner_name || "Owner";
  const actualDate = date || appointment_date || "Date not set";
  const actualStatus = status || appointment_status || "Unknown";
  const actualImage = image || pet_image || "/images/pet-placeholder.jpg";

  // Format date if it's in ISO format
  const formatDate = (dateString: string) => {
    if (!dateString) return "Date not set";
    
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) 
        ? dateString 
        : date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });
    } catch {
      return dateString;
    }
  };

  // Get status styling based on API status values
  const getStatusStyle = (status: string) => {
    const statusLower = status.toLowerCase();
    
    if (statusLower.includes('upcoming') || statusLower.includes('pending') || statusLower.includes('scheduled')) {
      return "bg-blue-100 text-blue-700";
    } else if (statusLower.includes('completed') || statusLower.includes('finished') || statusLower.includes('done')) {
      return "bg-green-100 text-green-700";
    } else if (statusLower.includes('ongoing') || statusLower.includes('in progress') || statusLower.includes('active')) {
      return "bg-yellow-100 text-yellow-700";
    } else if (statusLower.includes('reschedule') || statusLower.includes('cancelled') || statusLower.includes('rejected')) {
      return "bg-red-100 text-red-700";
    } else {
      return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-5 flex flex-col transition-all hover:shadow-xl hover:-translate-y-1">
      {/* Top section with image + info */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 relative rounded-full overflow-hidden border border-gray-200">
          <Image
            src={actualImage}
            alt={actualPetName}
            fill
            className="object-cover"
            sizes="64px"
            onError={(e) => {
              // Fallback to placeholder if image fails to load
              e.currentTarget.src = "/images/pet-placeholder.jpg";
            }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-gray-800 truncate">
            {actualPetName}
          </h3>
          <p className="text-sm text-gray-600 truncate">Owner: {actualOwner}</p>
          <p className="text-sm text-gray-500">{formatDate(actualDate)}</p>
        </div>
      </div>

      {/* Status */}
      <div className="mt-3">
        <span
          className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${getStatusStyle(actualStatus)}`}
        >
          {actualStatus}
        </span>
      </div>

      {/* Actions */}
      <div className="mt-4 flex justify-between gap-2">
        <button 
          className="flex-1 px-3 py-2 border border-pink-500 text-pink-500 rounded-lg text-sm font-medium hover:bg-pink-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={actualStatus.toLowerCase().includes('completed') || actualStatus.toLowerCase().includes('cancelled')}
          title={
            actualStatus.toLowerCase().includes('completed') || actualStatus.toLowerCase().includes('cancelled') 
              ? "Cannot reschedule completed or cancelled appointments" 
              : "Reschedule appointment"
          }
        >
          Reschedule
        </button>
        <Link href={`/vet/appointments/${id}`} className="flex-1">
          <button className="w-full px-3 py-2 bg-pink-500 text-white rounded-lg text-sm font-medium hover:bg-pink-600 transition">
            View Details
          </button>
        </Link>
      </div>

      {/* Debug info (remove in production) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-2 pt-2 border-t border-gray-100">
          <p className="text-xs text-gray-400 truncate">
            ID: {id} | API Fields: {Object.keys(restProps).join(', ')}
          </p>
        </div>
      )}
    </div>
  );
}