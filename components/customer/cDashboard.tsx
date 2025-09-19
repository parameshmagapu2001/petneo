"use client";

import { FaCirclePlus } from "react-icons/fa6";
import { RxDividerVertical } from "react-icons/rx";
import React, { useState } from "react";
import {
  FaVideo,
  FaStar
} from "react-icons/fa";
import { PageType } from "@/app/customer/dashboard/page";

interface C_DashboardMainProps {
    onPageTypeChange: (pageType: PageType) => void;
}


export default function C_DashboardMain({ onPageTypeChange }: C_DashboardMainProps) {
    type Service = {
    id: string;
    label: string;
    icon: string; // icon url or base64
    };

    const services: Service[] = [
    {
        id: "clinicVisit",
        label: "Clinic Visit",
        icon: "../images/customer/clinic_icon.png",
    },
    {
        id: "homeVisit",
        label: "Home Visit",
        icon: "../images/customer/homeVisit_icon.png",
    },
    {
        id: "online",
        label: "Online",
        icon: "../images/customer/online_icon.png",
    },
    {
        id: 'boarding',
        label: "Boarding",
        icon: "../images/customer/boarding_icon.png",
    },
    {
        id: "grooming",
        label: "Grooming",
        icon: "../images/customer/grooming_icon.png",
    },
    {
        id: "vaccination",
        label: "Vaccination",
        icon: "../images/customer/vaccination_icon.png",
    },
    ];

    const appointments = [
    {
        name: "Dr. Charan",
        title: "General Veterinarian",
        exp: "15 years Exp",
        distance: "350m away",
        rating: 5.0,
        ratingCount: 150,
        video: true,
        imgUrl:"../images/customer/defaultUserImage.png",
    },
    {
        name: "Dr. Vijay",
        title: "General Veterinarian",
        exp: "4 years Exp",
        distance: "500m away",
        rating: 5.0,
        ratingCount: 150,
        video: true,
        imgUrl: "../images/customer/defaultUserImage.png"
    },
    {
        name: "Dr. Mohan",
        title: "General Veterinarian",
        exp: "7 years Exp",
        distance: "700m away",
        rating: 5.0,
        ratingCount: 150,
        video: true,
        imgUrl: "../images/customer/defaultUserImage.png"
    },
    ];

    const pets = [
        {
            name: "sam",
            profilePhoto: "../images/customer/petCardDefaultImage.png"

        },{
            name: "sam2",
            profilePhoto: "../images/customer/petCardDefaultImage.png"

        }
    ];

    // Handler for clicking on a pet image
      const handlePetClick = (petName: string) => {
        onPageTypeChange(PageType.PET_INFO);
      };
    
      // Handler for clicking the add button
      const handleAddPet = () => {
        alert("Add new pet clicked");
        // You can open a modal or navigate to add pet form
      };
    
        // Handler for clicking on services
      const HandleClickOnServices = (id: string) => {
        if (id === "clinicVisit") {
            onPageTypeChange(PageType.VET_DETAILS);
        }
      };
    
      // Handler for clicking on view all appointments
      const HandleViewAllAppointments = () => {
        onPageTypeChange(PageType.MY_APPOINTMENTS);
      };

    return (
        <div>
           
            {/* Main Content */}
            <div className="px-6 py-6 max-w-7xl mx-auto space-y-10">
                {/* Greeting & My Pets */}
                <section className="bg-white rounded-lg shadow-md p-6 flex justify-between items-center">
                <div className="flex items-center space-x-4">
                    <img
                    src="../images/customer/paws.png"
                    />            
                    <div>
                    <h2 className="text-lg font-semibold">Hello, Ram</h2>
                    <p className="text-gray-500 text-sm">
                        Let's get started from where we left.
                    </p>
                    </div>
                </div>
                <div>
                    <h3 className="text-pink-600 font-semibold mb-2 select-none">My Pets</h3>
                    <div className="flex items-center space-x-4">
                        {pets.map((item)=> (
                            <div key={item.name} className="flex-col items-center">
                                {/* Pet Image card */}
                                <button
                                    onClick={() => handlePetClick(item.name)}
                                    className="w-16 h-16 rounded-full overflow-hidden cursor-pointer focus:outline-none focus:ring-2 focus:ring-pink-400"
                                    aria-label= {item.name}
                                    type="button"
                                >
                                    <img
                                    src={item.profilePhoto}
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
                        <FaCirclePlus color="#D64AA0" className="w-16 h-16" onClick={handleAddPet}/>
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
                        {services.map(({ id, icon, label }) => (
                            <div  key={id} className="flex flex-col items-center">
                        <div className="w-36 h-36 bg-white rounded-xl shadow-sm cursor-pointer hover:shadow-lg transition-shadow"> 
                            <img src={icon} alt={label} className="w-14 h-14 m-11 object-contain"  onClick={() => HandleClickOnServices(id)}/>  
                        </div>
                        <span className="text-black text-sm font-semibold pt-4">{label}</span>
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
                    <div className="flex flex-wrap gap-6 mt-6 justify-self-center">
                        {appointments.map(
                        ({
                            name,
                            title,
                            exp,
                            distance,
                            rating,
                            ratingCount,
                            video,
                            imgUrl,
                        }) => (
                            <div
                            key={`${name}-${exp}-${distance}`}
                            className="flex items-center bg-white rounded-lg shadow px-4 py-3 w-full sm:w-[370px]"
                            >
                            <img
                                src={imgUrl}
                                alt={name}
                                className="w-14 h-14 rounded-full object-cover border border-gray-300"
                            />
                            <div className="flex-1 ml-4">
                                <div className="font-semibold text-gray-900">{name}</div>
                                <div className="text-xs text-gray-600">{title}</div>
                                <div className="text-xs text-gray-600">{exp}</div>
                                <div className="flex items-center text-xs text-gray-600 gap-2 mt-1">
                                <span>{distance}</span>
                                <RxDividerVertical color="#898989" />
                                <span className="flex items-center gap-1 text-yellow-400">
                                    <FaStar />
                                    <span>{rating}</span>
                                </span>
                                <span className="text-gray-400">
                                    ({ratingCount} Ratings)
                                </span>
                                </div>
                            </div>
                            {video && (
                                <button
                                aria-label="Video Call"
                                className="ml-4 p-2 bg-pink-500 rounded-lg text-white hover:bg-pink-600 transition"
                                type="button"
                                >
                                <FaVideo className="w-6 h-6" />
                                </button>
                            )}
                            </div>
                        )
                        )}
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
                </div>
                </section>
            </div>
      </div>
    );
}