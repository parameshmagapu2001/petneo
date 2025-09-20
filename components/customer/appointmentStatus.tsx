import React from 'react';
import { FaCheckCircle, FaTimesCircle, FaCalendarAlt, FaMapMarkerAlt, FaDog, FaCut } from 'react-icons/fa';

export type AppointmentStatusType = 'BOOKED' | 'CANCELLED';
export interface AppointmentDetails {
    status: AppointmentStatusType;
    doctorName: string | undefined;
    visitType: string | undefined;
    service: string | undefined;
    date: string | undefined;
    time: string | undefined;
    location: string | undefined;
    cancellationReason?: string | undefined;
}

interface AppointmentStatusProps {
  appointmentDetails: AppointmentDetails;
}

export default function AppointmentStatus({appointmentDetails} : AppointmentStatusProps) {

  return (
    <div className="flex flex-col items-center min-h-screen justify-center bg-purple-50">
      <div className="w-full max-w-md rounded-xl bg-white shadow-lg py-8 px-4 flex flex-col items-center">
        {appointmentDetails.status === 'BOOKED' ? (
          <>
            <FaCheckCircle className="text-pink-400 text-6xl mb-4" />
            <h2 className="font-semibold text-lg mb-2">Appointment Booked.</h2>
            <span className="font-medium mb-4">{appointmentDetails.doctorName}</span>
          </>
        ) : (
          <>
            <FaTimesCircle className="text-pink-400 text-6xl mb-4" />
            <h2 className="font-semibold text-lg mb-2">Appointment Cancelled</h2>
            <span className="mb-4 text-sm text-gray-700">Reason: {appointmentDetails.cancellationReason}</span>
          </>
        )}

        <div className="bg-gray-100 rounded-lg p-4 w-full mb-6">
          <div className="flex items-center mb-2">
            <FaDog className="mr-2 text-gray-500" />
            <span className="font-medium">{appointmentDetails.visitType}</span>
          </div>
          <div className="flex items-center mb-2">
            <FaCut className="mr-2 text-gray-500" />
            <span>{appointmentDetails.service}</span>
          </div>
          <div className="flex items-center mb-2">
            <FaCalendarAlt className="mr-2 text-gray-500" />
            <span>{appointmentDetails.date} and {appointmentDetails.time}</span>
          </div>
          <div className="flex items-center">
            <FaMapMarkerAlt className="mr-2 text-gray-500" />
            <span>{appointmentDetails.location}</span>
          </div>
        </div>

        {appointmentDetails.status === 'BOOKED' ? (
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
            <button className="w-full text-white bg-pink-400 rounded-lg py-3 font-semibold transition hover:bg-pink-500">
              View My Appointments
            </button>
          </>
        ) : (
          <button className="w-full text-white bg-pink-400 rounded-lg py-3 font-semibold transition hover:bg-pink-500">
            Book New Appointment
          </button>
        )}
      </div>
    </div>
  );
};
