'use client';

import React from 'react';
import Image from 'next/image';
import { FaCalendarAlt } from 'react-icons/fa';
import {PartnerAppointment} from "@/utils/commonTypes";
import {formatDate1, getRemainingTime} from "@/utils/common";

interface PartnerAppointmentCardProps {
    isCountdownNeeded: boolean;
    isViewDetailsNeeded: boolean;
    isRescheduleNeeded: boolean;
    appointment: PartnerAppointment;
}

export default function PartnerAppointmentCard ({ appointment, isCountdownNeeded= true, isViewDetailsNeeded=false, isRescheduleNeeded=false }: PartnerAppointmentCardProps) {
    return (
        <div className="bg-white rounded-xl shadow-lg p-4 flex flex-col gap-4 w-full max-w-sm border border-gray-100">
            {/* Header with Calendar Icon and Time */}
            {isCountdownNeeded &&
                <div className="flex items-center gap-2 bg-blue-100 rounded-lg p-3">
                    <FaCalendarAlt className="text-blue-600 text-sm"/>
                    <span className="text-blue-600 text-sm font-semibold">
                    Your next Appointment in{' '}
                        <span className="text-blue-700 underline font-bold">{getRemainingTime(appointment.date, appointment.time)}</span>
                </span>
                </div>}
            {/* Main Content */}
            <div className="flex gap-4 items-center">
                {/* Pet Image */}
                <div className="relative w-20 h-20 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                        src={appointment.pet.profile_picture}
                        alt={appointment.pet.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                    />
                </div>

                {/* Pet Info */}
                <div className="flex-1 flex flex-col gap-1">
                    <h3 className="font-semibold text-sm text-gray-800">{appointment.pet.name}</h3>
                    <p className="text-xs text-gray-600">{appointment.pet.breed}</p>
                    <p className="text-[10px] text-gray-500">{formatDate1(appointment.date)}</p>
                </div>

            {/*    /!* Visit Type Badge *!/*/}
            {/*    <div className="flex-shrink-0">*/}
            {/*<span className="bg-green-100 text-green-700 rounded-full px-3 py-1 font-medium text-xs whitespace-nowrap">*/}
            {/*  {appointment.visitType}*/}
            {/*</span>*/}
            {/*    </div>*/}
            </div>

            {/*Action buttons*/}
            <div className="flex justify-center">
                {isRescheduleNeeded &&
                    <button className="flex-1 px-4 py-2 border-2 border-pink-600 text-pink-600 rounded-lg font-medium hover:bg-pink-50 transition">
                        Reschedule
                    </button>
                }
                { isViewDetailsNeeded &&
                    <button className="flex-1 px-4 py-2 bg-pink-600 text-white rounded-lg font-medium hover:bg-pink-700 transition">
                        View Details
                    </button>
                }

            </div>
        </div>
    );
}