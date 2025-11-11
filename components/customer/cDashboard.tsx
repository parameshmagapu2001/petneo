"use client";

import { FaCirclePlus } from "react-icons/fa6";
import React, { useEffect, useRef, useState } from "react";
import { Pet, User } from "@/app/customer/dashboard/page";
import { PageType } from "@/app/customer/dashboard/constants";
import { api, clearAuth } from "@/utils/api";
import { transformAppointments } from "./cMyAppointments";
import { AppointmentDetails } from "./appointmentStatus";
import FullScreenLoader from "./fullScreenLoader";
import DoctorCard from "./doctorCard";
import router from "next/router";
import {VISIT_ID} from "./cVetAppointmentBooking";


export enum ServiceName {
    VET = "Vet",
    GROOMING = "Grooming",
    BOARDING = "Boarding"
}

export type Service = {
    id: string;
    label: string;
    icon: string; // icon url or base64
    visit_type?: VISIT_ID;
    serviceName?: ServiceName;
};

interface C_DashboardMainProps {
    user: User | null;
    pets: Pet[];
    onViewPetDetails: (petId: number) => void;
    onPageTypeChange: (pageType: PageType) => void;
    onServiceSelection: (service: Service) => void;
}


export default function C_DashboardMain({ user, pets, onViewPetDetails, onPageTypeChange, onServiceSelection }: C_DashboardMainProps) {

    const services: Service[] = [
    {
        id: "clinicVisit",
        label: "Clinic Visit",
        icon: "../images/customer/clinic_icon.png",
        visit_type: VISIT_ID.CLINIC_VISIT
    },
    {
        id: "homeVisit",
        label: "Home Visit",
        icon: "../images/customer/homeVisit_icon.png",
        visit_type: VISIT_ID.HOME_VISIT
    },
    {
        id: "online",
        label: "Online",
        icon: "../images/customer/online_icon.png",
        visit_type: VISIT_ID.ONLINE
    },
    {
        id: 'boarding',
        label: "Boarding",
        icon: "../images/customer/boarding_icon.png",
        serviceName:ServiceName.BOARDING
    },
    {
        id: "grooming",
        label: "Grooming",
        icon: "../images/customer/grooming_icon.png",
        serviceName:ServiceName.GROOMING
    },
    {
        id: "vaccination",
        label: "Vaccination",
        icon: "../images/customer/vaccination_icon.png",
    },
    ];

    // Handler for clicking on a pet image
    const handlePetClick = (petId: number) => {
    onViewPetDetails(petId);
    };

    // Handler for clicking the add button
    const handleAddPet = () => {
    onViewPetDetails(-1);
    };

    // Handler for clicking on services
    const HandleClickOnServices = (service: Service) => {
        onServiceSelection(service);
        if (service.id === "clinicVisit" || service.id === "homeVisit" || service.id === "online"
            || service.id === "grooming" || service.id === "boarding") {
            onPageTypeChange(PageType.VET_DETAILS);
        }
    };

    // Handler for clicking on view all appointments
    const HandleViewAllAppointments = () => {
    onPageTypeChange(PageType.MY_APPOINTMENTS);
    };

    const [myAppointments, setMyAppointments] = useState<AppointmentDetails[]>([]);
    const hasFetched = useRef(false);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if (!hasFetched.current) {
            hasFetched.current = true;
            const userAppointmentDataFetch = api.get("/user/appointment/myAppointments");
            Promise.all([userAppointmentDataFetch]).then(([res1]) => {
                if (Array.isArray(res1?.appointments)) {
                    //transforming the api response into UI usable data
                    const transformedAppointments = transformAppointments(res1.appointments.slice(0,3));
                    setMyAppointments(transformedAppointments);
                    setLoading(false);
                }
            }).catch((error) => {
                setLoading(false);
                //TODO handle error cases
                if (error?.message.includes("403")) {
                    clearAuth();
                    if (typeof window !== "undefined") window.location.href = "/customer/login";
                    else router.push("/customer/login")
                 }
            });
        }
    }, []);

    return (
        <div>
           
            {/* Main Content */}
            <div className="px-6 py-6 max-w-7xl mx-auto space-y-10">
                {/* Greeting & My Pets */}
                <section className="bg-white rounded-lg shadow-md p-6 flex justify-between items-center">
                <div className="flex items-center space-x-4">
                    <img
                    src="../images/customer/paws.png"
                    alt="paws"
                    />            
                    <div>
                    <h2 className="text-lg font-semibold">Hello, {user?.name}</h2>
                    <p className="text-gray-500 text-sm">
                        Let's get started from where we left.
                    </p>
                    </div>
                </div>
                <div>
                    <h3 className="text-pink-600 font-semibold mb-2 select-none">My Pets</h3>
                    <div className="flex items-center space-x-4">
                        {pets.map((item)=> (
                            <div key={item.id} className="flex-col items-center">
                                {/* Pet Image card */}
                                <button
                                    onClick={() => handlePetClick(item.id)}
                                    className="w-16 h-16 rounded-full overflow-hidden cursor-pointer focus:outline-none focus:ring-2 focus:ring-pink-400"
                                    aria-label= {item.name}
                                    type="button"
                                >
                                    <img
                                    src={item.profile_url}
                                    alt={item.name}
                                    className="object-cover w-full h-full"
                                    draggable={false}
                                    />
                                </button>
                                <div className="text-center">
                                    {item.name}
                                </div>
                            </div>
                        )) 
                        }
                        
                    {/* Add ICON */}
                    <div className="pb-7">
                        <FaCirclePlus color="#D64AA0" className="w-16 h-16 cursor-pointer" onClick={handleAddPet}/>
                    </div>
                    
                    </div>
                </div>

                    {/* Illustration */}
                    <div className="hidden md:block self-start">
                        <img
                        src="../images/customer/calender.png"
                        alt="Pet management illustration"
                        className="w-28 h-auto select-none pointer-events-none"
                        draggable={false}
                        />
                    </div>
                </section>

                {/* Quick Services */}
                <section className="bg-[#d6dafc] rounded-lg p-6 shadow border border-gray-300 flex flex-col md:flex-row md:items-center md:justify-between space-y-6 md:space-y-0">
                    <div className="flex-1 grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 gap-6 max-w-md">
                        <h2 className="col-span-3 font-semibold mb-2 text-gray-800">Quick Services for Your Pet</h2>
                        {services.map((service) => (
                            <div  key={service.id} className="flex flex-col items-center">
                        <div className="w-36 h-36 bg-white rounded-xl shadow-sm cursor-pointer hover:shadow-lg transition-shadow"> 
                            <img src={service.icon} alt={service.label} className="w-14 h-14 m-11 object-contain"  onClick={() => HandleClickOnServices(service)}/>
                        </div>
                        <span className="text-black text-sm font-semibold pt-4">{service.label}</span>
                        </div>
                        ))}
                    </div>

                    <div className="flex-1 flex justify-end mr-10">
                        <img
                        src="../images/customer/cuteDog.png"
                        alt="Cute Dog"
                        className="w-70 h-70 object-contain"
                        />
                    </div>
                </section>

                {/* My Appointments */}
                <section className="space-y-4 w-full">
                <h3 className="font-semibold text-gray-700">My Appointments</h3>
                <div className="rounded-lg shadow border border-gray-300">
                    {myAppointments?.length > 0 ? 
                    <>
                        <div className="grid grid-cols-3 gap-x-6 gap-y-8 mt-6 mx-3">
                            {myAppointments.map(app => (
                            <DoctorCard key={app.id} appointmentDetails={app} />
                            ))}
                        </div>
                        <div className="flex justify-center mt-6 mb-3">
                            <button
                            type="button"
                            className="sm:w-[370px] bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-lg px-8 py-2 transition"
                            onClick={() => HandleViewAllAppointments()}
                            >
                            View all
                            </button>
                        </div>
                    </> : 
                    <div className="flex items-center justify-items-center grid grid-cols-1 min-h-30">
                        <span>No Appointments to show</span>
                    </div>}
                </div>
                </section>
            </div>

            <FullScreenLoader loading={loading}/>
      </div>
    );
}