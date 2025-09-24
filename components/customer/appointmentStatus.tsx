import { Pet } from '@/app/customer/dashboard/page';
import { PageType } from "@/app/customer/dashboard/constants";
import { api } from '@/utils/api';
import React, { useState } from 'react';
import { FaCheckCircle, FaCalendarAlt, FaMapMarkerAlt, FaDog, FaCut } from 'react-icons/fa';
import { FcCancel } from 'react-icons/fc';
import { LiaPawSolid } from "react-icons/lia";
import FullScreenLoader from './fullScreenLoader';

export type AppointmentStatusType = 'booked' | 'cancelled' | 'completed';
export interface AppointmentDetails {
    id: number | undefined;
    status: AppointmentStatusType;
    pet: Pet | undefined;
    vetName: string | undefined;
    vetSpecialization?: string | undefined;
    vetProfileUrl?: string | undefined;
    vetId?: number;
    visit_purpose?:  "General Visit" | "Emergency";
    visitType: string | undefined;
    service?: string | undefined;
    date: string | undefined;
    time: string | undefined;
    location?: string | undefined;
    cancellationReason?: string | undefined;
}

interface AppointmentStatusProps {
  appointmentDetails: AppointmentDetails;
   onPageTypeChange: (pageType: PageType) => void;
   makeSelectedAppointmentEmpty?: () => void; // this param should be only form myAppointments( to handle one of the edge case)
}

function formatDate(inputDate: string | undefined): string {
  const date = new Date(inputDate || '');

  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    day: '2-digit',
    month: 'short',
  };

  return date.toLocaleDateString('en-US', options);
}


export default function AppointmentStatus({appointmentDetails, onPageTypeChange, makeSelectedAppointmentEmpty} : AppointmentStatusProps) {

  const [appointmentStatus, setAppointmentStatus] = useState<AppointmentStatusType>(appointmentDetails.status);

  const [loading, setLoading] = useState<boolean>(false);

  async function handleCancelAppointment(): Promise<void> {
    if (appointmentDetails.id) {
      setLoading(true);
      //making patch call to update the status of the appointment
      const res = api.patch(`/user/appointment/${appointmentDetails.id}/status`, {}, {status: "cancelled"});
      setAppointmentStatus("cancelled");
      setLoading(false);
    } 
  }

  function handleGoHome(): void {
    //navigating to the dashboard home
    onPageTypeChange(PageType.DASHBOARD);
  }

  function handleViewMyAppointments(): void {
    //navigating to the my appointments page
    onPageTypeChange(PageType.MY_APPOINTMENTS);
    makeSelectedAppointmentEmpty?.();
  }

  return (
    <div className="flex flex-col items-center min-h-screen justify-center bg-[#E8ECFC]">
      <div className="w-full max-w-md py-8 px-4 flex flex-col items-center">
        {appointmentStatus === 'booked' && (
          <>
            <FaCheckCircle className="text-pink-400 text-6xl mb-4" />
            <h2 className="font-semibold text-lg mb-2">Appointment Booked.</h2>
            <span className="font-medium mb-4">{appointmentDetails.vetName ? "Dr. " + appointmentDetails.vetName : ""}</span>
          </>
        )}
        { appointmentStatus === "cancelled" && (
          <>
            <FcCancel className="mb-4" size={100} />
            <h2 className="font-semibold text-lg mb-2">Appointment Cancelled</h2>
            {appointmentDetails.cancellationReason && <span className="mb-4 text-sm text-gray-700">Reason: {appointmentDetails.cancellationReason}</span>}
          </>
        )}
        {appointmentStatus === 'completed' && (
          <>
            <FaCheckCircle className="text-pink-400 text-6xl mb-4" />
            <h2 className="font-semibold text-lg mb-2">Appointment Completed.</h2>
            <span className="font-medium mb-4">{appointmentDetails.vetName ? "Dr. " + appointmentDetails.vetName : ""}</span>
          </>
        )}

        <div className="p-4 w-full mb-6">
          <div className="flex items-center border-2 border-[#B7B7B7] py-3 rounded-t-lg bg-white">
            <div className="px-2">
              <LiaPawSolid className="mr-2 text-gray-500" size={20} />
            </div>
            <span className="font-medium">Pet name: {appointmentDetails.pet?.name}</span>
          </div>
          <div className="flex items-center border-x-2 border-b-2 border-[#B7B7B7] py-3 bg-white">
            <div className="px-2">
              <FaDog className="mr-2 text-gray-500" size={20} />
            </div>
            <span className="font-medium">{appointmentDetails.visitType}</span>
          </div>
          <div className="flex items-center border-x-2 border-b-2 border-[#B7B7B7] py-3 bg-white">
            <div className="px-2">
              <FaCut className="mr-2 text-gray-500" size={20} />
            </div>
            <span className="font-medium">{appointmentDetails.service}</span>
          </div>
          <div className="flex items-center border-x-2 border-b-2 border-[#B7B7B7] py-3 bg-white">
            <div className="px-2">
              <FaCalendarAlt className="mr-2 text-gray-500" size={20} />
            </div>
            <span className="font-medium">{formatDate(appointmentDetails.date)} - {appointmentDetails.time}</span>
          </div>
          <div className="flex items-center border-x-2 border-b-2 border-[#B7B7B7] py-3 rounded-b-lg bg-white">
            <div className="px-2">
              <FaMapMarkerAlt className="mr-2 text-gray-500" size={20} />
            </div>
            <span>{appointmentDetails.location}</span>
          </div>
        </div>

        {appointmentStatus === 'booked' && (
          <>
            <div className="w-full mb-6">
              <h3 className="font-semibold text-sm mb-1">Cancellation Policy</h3>
              <ul className="text-xs text-gray-500 list-disc list-inside">
                <li>Users can cancel a booking/service up to 24 hours before the scheduled time with no charge.</li>
                <li>
                  Cancellations made within 24 hours of the appointment or failure to show up will result in a cancellation fee (up to 100% of service cost).
                </li>
              </ul>
            </div>
            <button className="w-full text-white bg-pink-500 rounded-lg py-3 my-3 font-semibold transition hover:bg-pink-600"
            onClick={handleCancelAppointment}>
              Cancel Appointment
            </button>
            <button className="w-full text-white bg-pink-500 rounded-lg py-3 my-3 font-semibold transition hover:bg-pink-600"
            onClick={handleViewMyAppointments}>
              View My Appointments
            </button>
          </>
        )}
        {(appointmentStatus === "cancelled" || appointmentStatus === "completed") && (
          <button className="w-full text-white bg-pink-500 rounded-lg py-3 font-semibold transition hover:bg-pink-600"
          onClick={handleGoHome}>
            Go Home
          </button>
        )}
      </div>
      <FullScreenLoader loading={loading}/>
    </div>
  );
};

