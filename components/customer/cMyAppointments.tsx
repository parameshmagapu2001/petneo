"use client";

import { Pet } from "@/app/customer/dashboard/page";
import { PageType } from "@/app/customer/dashboard/constants";
import { api } from "@/utils/api";
import { useEffect, useRef, useState } from "react";
import { FaFilter } from "react-icons/fa";
import AppointmentStatus, { AppointmentDetails, AppointmentStatusType } from "./appointmentStatus";
import { VISIT_TYPES } from "./cVetAppointmentBooking";
import DoctorCard from "./doctorCard";
import FullScreenLoader from "./fullScreenLoader";

interface C_MyAppointmentsProps {
    onPageTypeChange: (pageType: PageType) => void;
}

export function transformAppointments(responseArray: []): AppointmentDetails[] {
    return responseArray.map((item: any) => {
                        return {
                            id: item?.appointment_id as number,
                            status: item?.status as AppointmentStatusType,
                            pet: {
                                    id: item?.pet?.id,
                                    name: item?.pet?.name,
                                    profile_url: item?.pet?.profile_picture
                                } as Pet,
                            vetName: item?.vet?.name as string,
                            vetSpecialization: item?.vet?.specialization as string,
                            vetProfileUrl: item?.vet?.profile as string,
                            vetId: item?.vet?.id as number,
                            visit_purpose: item?.visit_purpose === "General visit" ? "General Visit" : "Emergency",
                            visitType: VISIT_TYPES.find((x) => x.id === item?.visit_type)?.displayName,
                            date: item?.date,
                            time: item?.time,
                            cancellationReason: item?.reason
                        } as AppointmentDetails;
                    });
}


export default function C_MyAppointments({ onPageTypeChange }: C_MyAppointmentsProps) {
    const [selectedTab, setSelectedTab] = useState<"active" | "cancelled" | "completed">("active");

    const [activeAppointments, setActiveAppointments] = useState<AppointmentDetails[]>([]);
    const [completedAppointment, setCompletedAppointments] = useState<AppointmentDetails[]>([]);
    const [cancelledAppointments, setCancelledAppointments] = useState<AppointmentDetails[]>([]);

    const appointmentsToShow = selectedTab === "active" ? activeAppointments : selectedTab === 'completed' ? completedAppointment : cancelledAppointments;

    const hasFetched = useRef(false);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
            if (!hasFetched.current) {
            hasFetched.current = true;
            const userAppointmentDataFetch = api.get("/user/appointment/myAppointments");
            Promise.all([userAppointmentDataFetch]).then(([res1]) => {
                if (Array.isArray(res1?.appointments)) {
                    //transforming the api response into UI usable data
                    const transformedAppointments = transformAppointments(res1.appointments);

                    setActiveAppointments(transformedAppointments.filter((item: AppointmentDetails) => item.status === 'booked'));
                    setCompletedAppointments(transformedAppointments.filter((item: AppointmentDetails) => item.status === 'completed'));
                    setCancelledAppointments(transformedAppointments.filter((item: AppointmentDetails) => item.status === 'cancelled'));
                    setLoading(false);
                }
            }).catch((error) => {
                //TODO handle error cases
            });
        }
    }, []);

    const [selectedAppointment, setSelectedAppointment] = useState<AppointmentDetails | null>(null);

    async function fetchAndSetSelectedAppointmentDetails(app: AppointmentDetails): Promise<void> {
        setLoading(true);
        //fetching appointment details
        // fetching this only for service and clinic details
        const userAppointmentRes = await api.get(`/user/appointment/${app.id}`);
        app.service = userAppointmentRes?.service;
        app.location = userAppointmentRes?.clinic_location;
        setSelectedAppointment(app);
        setLoading(false);
    }

    return (
        <>
            {!selectedAppointment && 
            <div className="min-h-screen bg-purple-50 px-10 py-6">
                {/* Tabs and search section */}
                <div className="flex gap-4 items-center mb-7 text-sm">
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
                    <DoctorCard key={app.id} appointmentDetails={app} onViewDetailsClick={() => fetchAndSetSelectedAppointmentDetails(app)}  />
                    ))}
                </div>
            </div>
            }
            {selectedAppointment && <AppointmentStatus appointmentDetails={selectedAppointment} onPageTypeChange={onPageTypeChange} makeSelectedAppointmentEmpty={() => setSelectedAppointment(null)}/>}
            <FullScreenLoader loading={loading}/>
        </>
        
    );
}