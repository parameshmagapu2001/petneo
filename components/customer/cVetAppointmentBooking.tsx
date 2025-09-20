"use client";

import React, { useState } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { IoChevronDown } from "react-icons/io5";
import { PageType, Pet, User, VetInterface } from "@/app/customer/dashboard/page";
import LocationSelector from "./locationSelector";
import SlotPicker from "./slotPicker";
import AppointmentStatus from "./appointmentStatus";

interface C_VetAppointmentBookingProps {
    user: User | null;
    vet: VetInterface | null;
    userPets: Pet[];
    onPageTypeChange: (pageType: PageType) => void;
}

interface DateTimeSlot {
    date: string;
    time: string;
}

enum VISIT_TYPE {
    CLINIC_VISIT = "Clinic Visit",
    HOME_VISIT = "Home Visit",
    ONLINE = "Online"
}

enum SCREEN_TYPE {
    BOOKING = "booking",
    CONFIRMATION = "confirmation"
}

// ------------------ Dummy Data ------------------
const VISIT_TYPES = [VISIT_TYPE.CLINIC_VISIT, VISIT_TYPE.HOME_VISIT, VISIT_TYPE.ONLINE];

export default function C_VetAppointmentBooking({ user, vet, userPets, onPageTypeChange }: C_VetAppointmentBookingProps) {
    const [selectedVisitType, setSelectedVisitType] = useState<VISIT_TYPE | string>("");
    const [selectedDateTimeSlot, setSelectedDateTimeSlot] = useState<DateTimeSlot>();
    const [selectedService, setSelectedService] = useState<string>("");
    const [selectedPet, setSelectedPet] = useState<string>("");

    function handleSlotPickerValueChange(selected: { date: string; time: string; }): void {
        console.log("vijay log, selected slot data ", selected);
        setSelectedDateTimeSlot(selected);
    }

    const [screenType, setScreenType] = useState<SCREEN_TYPE>(SCREEN_TYPE.BOOKING);

    function handleConfirmBtnClick(): void {
        if (selectedVisitType && selectedDateTimeSlot && selectedDateTimeSlot.date && 
            selectedDateTimeSlot.time && selectedService && selectedPet
        ) {
            setScreenType(SCREEN_TYPE.CONFIRMATION);
        } else {
            alert("Please provide the information");
        }
        
    }

    function renderBookingScreen() {
        return (
            <div className="min-h-screen bg-[#e3e8f9] flex flex-col items-center py-10 px-6">
                <div className="w-full max-w-7xl flex flex-col md:flex-row gap-10">
                    {/* Left Profile */}
                    <div className="flex flex-row items-center md:items-start md:w-1/4 space-y-4">
                        <img
                        src={user?.profile_url}
                        alt="User"
                        className="w-16 h-16 rounded-full object-cover mb-3"
                        />
                        <div className="text-left pl-5 pt-2">
                            <h2 className="font-semibold text-lg">Me <span className="text-gray-500 text-sm">({user?.name})</span></h2>
                            <p className="flex items-center text-red-500 mt-1 text-sm">
                            <FaMapMarkerAlt className="mr-1" /> {user?.location}
                            </p>
                        </div>
                        
                    </div>

                    {/* Right Content */}
                    <div className="md:w-8/20 flex flex-col p-6">
                        {/* Visit Type */}
                        <div className="mb-4">
                        <label className="block text-sm font-semibold mb-1">Visit Type</label>
                        <div className="relative">
                            <select className= "font-semibold w-full bg-white border rounded px-3 py-2 appearance-none"
                            value={selectedVisitType}
                            onChange={(event) => setSelectedVisitType(event.target.value)}>
                            <option value="" disabled hidden>Select Visit Type</option>
                            {VISIT_TYPES.map((v, i) => (
                                <option key={i}>{v}</option>
                            ))}
                            </select>
                            <IoChevronDown className="absolute right-3 top-3 text-gray-500" />
                        </div>
                        </div>

                        {/* Pick Location */}
                        {selectedVisitType === VISIT_TYPE.HOME_VISIT && 
                            <div className="mb-4">
                            <label className="block text-sm font-semibold mb-2">Pick Location</label>
                            <LocationSelector/>
                            </div>
                        }

                        {/* Slot Picker components */}
                        <div className="mb-4">
                            <SlotPicker onChange={handleSlotPickerValueChange}/>
                        </div>

                        {/* Service */}
                        <div className="mb-4">
                        <label className="block text-sm font-semibold mb-1">Service</label>
                        <div className="relative">
                            <select className="font-semibold bg-white w-full border rounded px-3 py-2 appearance-none"
                            value={selectedService}
                            onChange={(event) => setSelectedService(event.target.value)}>
                            <option value="" disabled hidden>Select Service</option>
                            {vet?.tags.map((s, i) => (
                                <option key={i}>{s}</option>
                            ))}
                            </select>
                            <IoChevronDown className="absolute right-3 top-3 text-gray-500" />
                        </div>
                        </div>

                        {/* Select Pet */}
                        <div className="mb-6">
                        <label className="block text-sm font-semibold mb-1">Select Pet</label>
                        <div className="relative">
                            <select className="font-semibold bg-white w-full border rounded px-3 py-2 appearance-none"
                            value={selectedPet}
                            onChange={(event) => setSelectedPet(event.target.value)}>
                            <option value="" disabled hidden>Select Pet</option>
                            {userPets.map((p, i) => (
                                <option key={i}>{p.name}</option>
                            ))}
                            </select>
                            <IoChevronDown className="absolute right-3 top-3 text-gray-500" />
                        </div>
                        </div>

                        {/* Confirm Button */}
                        <button className="w-full py-3 rounded-md bg-pink-500 text-white font-semibold"
                        onClick={handleConfirmBtnClick}>
                        Confirm
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    function renderConfirmationScreen() {
        return (
            <AppointmentStatus appointmentDetails ={
                {
                    status: "BOOKED",
                    doctorName: vet?.name,
                    visitType: selectedVisitType,
                    service: selectedService,
                    date: selectedDateTimeSlot?.date,
                    time: selectedDateTimeSlot?.time,
                    location: selectedVisitType === VISIT_TYPE.ONLINE ? user?.location : vet?.address
                }
            }/>
        );
    }

    return (
        <>
            {screenType === SCREEN_TYPE.BOOKING && renderBookingScreen()}
            {screenType === SCREEN_TYPE.CONFIRMATION && renderConfirmationScreen()}
        </>
    );
}