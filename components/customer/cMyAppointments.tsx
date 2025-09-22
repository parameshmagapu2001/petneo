"use client";

import { PageType } from "@/app/customer/dashboard/page";
import { api } from "@/utils/api";
import { useEffect, useRef, useState } from "react";
import DoctorCard, { AppointmentBasicDetails } from "./doctorCard";
import { FaFilter } from "react-icons/fa";
import { AppointmentStatusType } from "./appointmentStatus";

interface C_MyAppointmentsProps {
    onPageTypeChange: (pageType: PageType) => void;
}


export default function C_MyAppointments({ onPageTypeChange }: C_MyAppointmentsProps) {
    const [selectedTab, setSelectedTab] = useState<"active" | "cancelled" | "completed">("active");

    const [activeAppointments, setActiveAppointments] = useState<AppointmentBasicDetails[]>([]);
    const [completedAppointment, setCompletedAppointments] = useState<AppointmentBasicDetails[]>([]);
    const [cancelledAppointments, setCancelledAppointments] = useState<AppointmentBasicDetails[]>([]);

    const appointmentsToShow = selectedTab === "active" ? activeAppointments : selectedTab === 'completed' ? completedAppointment : cancelledAppointments;

    const hasFetched = useRef(false);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
            if (!hasFetched.current) {
            hasFetched.current = true;
            const userAppointmentDataFetch = api.get("api/v1/user/appointment/myAppointments");
            Promise.all([userAppointmentDataFetch]).then(([res1]) => {
                if (Array.isArray(res1?.appointments)) {
                    //transforming the api response into UI usable data
                    const transformedAppointments = res1.appointments.map((item: any) => {
                        return {
                            id: item?.id as string,
                            vetName: item?.vet?.name as string,
                            specialization: item?.vet?.specialization as string,
                            profile_url: item?.vet?.profile as string,
                            vetId: item?.vet?.id as number,
                            visit_purpose: item?.visit_purpose === "General visit" ? "General Visit" : "Emergency",
                            status: item?.status as AppointmentStatusType
                        } as AppointmentBasicDetails;
                    })

                    setActiveAppointments(transformedAppointments.filter((item: AppointmentBasicDetails) => item.status === 'booked'));
                    setCompletedAppointments(transformedAppointments.filter((item: AppointmentBasicDetails) => item.status === 'completed'));
                    setCancelledAppointments(transformedAppointments.filter((item: AppointmentBasicDetails) => item.status === 'cancelled'));
                    setLoading(false);
                }
            }).catch((error) => {
                //TODO handle error cases
            });
        }
    }, []);

    return (
        <div className="min-h-screen bg-purple-50 px-10 py-6">
            {/* Tabs and search section */}
            <div className="flex gap-4 items-center mb-7">
                <div className="flex bg-pink-200 rounded-full">
                <button
                    onClick={() => setSelectedTab("active")}
                    className={`font-semibold px-6 py-2 rounded-full transition cursor-pointer ${
                    selectedTab === "active"
                        ? "bg-pink-400 text-white"
                        : "bg-transparent text-pink-400"
                    }`}
                >
                    My Appointments
                </button>
                <button
                    onClick={() => setSelectedTab("cancelled")}
                    className={`font-semibold px-6 py-2 rounded-full transition cursor-pointer ${
                    selectedTab === "cancelled"
                        ? "bg-pink-400 text-white"
                        : "bg-transparent text-pink-400"
                    }`}
                >
                    Cancelled Appointments
                </button>
                <button
                    onClick={() => setSelectedTab("completed")}
                    className={`font-semibold px-6 py-2 rounded-full transition cursor-pointer ${
                    selectedTab === "completed"
                        ? "bg-pink-400 text-white"
                        : "bg-transparent text-pink-400"
                    }`}
                >
                    Completed Appointments
                </button>
                </div>
                <div className="flex flex-1 items-center ml-5 bg-white rounded-full px-4 py-2 shadow max-w-lg">
                <input
                    type="text"
                    placeholder="Search for Appointments"
                    className="flex-1 border-none focus:ring-0 outline-none bg-transparent"
                />
                <FaFilter className="text-pink-500 text-xl" />
                </div>
            </div>
            {/* Grid of cards */}
            <div className="grid grid-cols-3 gap-x-6 gap-y-8">
                {appointmentsToShow.map(app => (
                <DoctorCard key={app.id} appointmentDetails={app} />
                ))}
            </div>
        </div>
    );
}