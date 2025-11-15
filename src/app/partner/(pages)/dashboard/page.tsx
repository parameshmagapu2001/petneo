"use client";
import {FaCirclePlus} from "react-icons/fa6";
import React, {useEffect, useRef, useState} from "react";
import {api} from "@/utils/api";
import {PartnerDetails} from "@/app/partner/(pages)/layout";
import FullScreenLoader from "../../../../../components/customer/fullScreenLoader";
import {useRouter} from "next/navigation";
import PartnerAppointmentCard from "../../../../../components/partner/PartnerAppointmentCard";

interface ProgressBarProps {
    percentage: number;
}

function ProgressBar ({ percentage }: ProgressBarProps) {
    // Clamp value between 0 and 100 for safety
    const safePercentage = Math.max(0, Math.min(percentage, 100));
    return (
        <div className="flex items-center w-full">
            <div className="w-full bg-pink-100 rounded-full h-3 relative">
                <div
                    className="bg-pink-500 h-3 rounded-full"
                    style={{ width: `${safePercentage}%` }}
                />
            </div>
            <span className="ml-3 text-black text-base font-medium">
        {safePercentage}%
      </span>
        </div>
    );
};

export default function PartnerDashboard()  {
    const router = useRouter();

    const [partnerDetails, setPartnerDetails] = useState<PartnerDetails>({});
    const hasFetched = useRef(false);
    const [loading, setLoading] = useState<boolean>(true);
    useEffect(() => {
        if (!hasFetched.current) {
            hasFetched.current = true;
            const vetTodaySummary = api.get("/appointments/vetTodaySummary", undefined, "partner");
            Promise.all([vetTodaySummary]).then(([vetTodaySummaryRes]) => {
                //setting the partner data
                setPartnerDetails(vetTodaySummaryRes)

                hasFetched.current = false;
                setLoading(false);
            }).catch((error) => {
                setLoading(false);
                //TODO handle error cases
            })
        }
    }, []);

    return (
        <>
            <div className="px-6 py-6 max-w-7xl mx-auto space-y-10">
                {/* Greeting & My Pets */}
                <section className="bg-white rounded-lg shadow-md p-6 flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <img
                            src="/images/customer/paws.png"
                            alt="paws"
                        />
                        <div>
                            <h2 className="text-lg font-semibold">Hello, Dr. {partnerDetails?.vet_name}</h2>
                            <p className="text-gray-500 text-sm">
                                Let's get started from where we left.
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col w-[40%]">
                        <h3 className="text-pink-600 font-semibold mb-1 select-none">My Appointments</h3>
                        <span className="text-sm font-medium mb-1 select-none">{`${partnerDetails?.completed}/${partnerDetails?.total_appointments} Appointments Completed`}</span>
                        <div className="flex items-center gap-1 cursor-pointer group mb-4"
                        onClick={() => {router.push(`/partner/myAppointments`);}}>
                            <span className="text-gray-500 text-xs font-medium group-hover:text-gray-700 transition-colors">
                                See All
                            </span>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-3 w-3 text-gray-500 group-hover:text-gray-700 transition-colors"
                                fill="none"
                                viewBox="0 0 24 20"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                        {partnerDetails?.completed && partnerDetails.completed > 0  &&
                            partnerDetails?.total_appointments && partnerDetails.total_appointments > 0 ?
                            <ProgressBar percentage={Math.round(partnerDetails.completed/partnerDetails.total_appointments * 100)} /> : ""}
                    </div>

                    {/* Illustration */}
                    <div className="hidden md:block self-start">
                        <img
                            src="/images/customer/calender.png"
                            alt="Pet management illustration"
                            className="w-28 h-auto select-none pointer-events-none"
                            draggable={false}
                        />
                    </div>
                </section>
                <div className="bg-blue-50 p-6 md:p-10 flex flex-col">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-lg font-bold text-gray-800">Upcoming Appointments</h1>
                        {(partnerDetails.upcoming && partnerDetails.upcoming.length !== 0) &&
                            <span className="text-gray-600 cursor-pointer text-sm font-medium hover:text-gray-800"
                                  onClick={() => {router.push(`/partner/myAppointments`);}}>
                                See All &gt;
                            </span>
                        }
                    </div>

                    {/* Cards Grid */}
                    {!(partnerDetails.upcoming && partnerDetails.upcoming.length !== 0) &&
                        <div className="self-center text-md font-light text-gray-500 mt-8">
                            <span>No upcoming appointments today</span>
                        </div>
                    }
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {partnerDetails.upcoming && partnerDetails.upcoming.map((appointment) => (
                            <PartnerAppointmentCard key={appointment.appointment_id} appointment={appointment} />
                        ))}
                    </div>
                </div>
            </div>
            <FullScreenLoader loading={loading}/>
        </>
    );
}