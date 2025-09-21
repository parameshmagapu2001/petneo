"use client";

import React, { useEffect, useRef, useState } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { IoChevronDown } from "react-icons/io5";
import { PageType, Pet, User, Vet } from "@/app/customer/dashboard/page";
import LocationSelector from "./locationSelector";
import SlotPicker, { DaySlots, TimeSlot } from "./slotPicker";
import AppointmentStatus from "./appointmentStatus";
import { api } from "@/utils/api";
import FullScreenLoader from "./fullScreenLoader";

interface C_VetAppointmentBookingProps {
    user: User | null;
    vet: Vet | null;
    userPets: Pet[];
    onPageTypeChange: (pageType: PageType) => void;
}

interface DateTimeSlot {
    date: string;
    time: string;
}

enum VISIT_ID {
    CLINIC_VISIT = "In-clinic",
    HOME_VISIT = "In-home",
    ONLINE = "Tele"
}

type VISIT_TYPE = {
    id: string;
    displayName: string;
}

enum SCREEN_TYPE {
    BOOKING = "booking",
    CONFIRMATION = "confirmation"
}

// ------------------ Dummy Data ------------------
const VISIT_TYPES:VISIT_TYPE[] = [{id: VISIT_ID.CLINIC_VISIT, displayName: "Clinic Visit"}, {id: VISIT_ID.HOME_VISIT, displayName: "Home Visit"}, {id: VISIT_ID.ONLINE, displayName: "Online"}];

const defaultNumberOfDays = 7;
const defaultTimeSlotInMin: number = 30;

function transformAvailability(data: any[]): DaySlots[] {
  // Helper: convert "HH:mm:ss" -> "hh:mm AM/PM"
  const formatTime = (time: string): string => {
    const [hourStr, minuteStr] = time.split(":");
    let hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12; // convert 0 -> 12
    return `${hour}:${minute.toString().padStart(2, "0")} ${ampm}`;
  };

  // Group by date
  const grouped: Record<string, TimeSlot[]> = {};

  data.forEach((slot) => {
    if (!grouped[slot.date]) {
      grouped[slot.date] = [];
    }
    grouped[slot.date].push({
      time: formatTime(slot.start_time),
      status: slot.status,
    });
  });

  // Convert to DaySlots[]
  return Object.keys(grouped).map((date) => ({
    date,
    slots: grouped[date],
  }));
}

function convert12hTo24hPlusMinutes(time12h: string, addMinutes?: number): string {
  const [time, meridian] = time12h.split(' ');
  let [hoursStr, minutesStr] = time.split(':');

  let hours = parseInt(hoursStr, 10);
  let minutes = parseInt(minutesStr, 10);

  if (meridian.toUpperCase() === 'PM' && hours !== 12) {
    hours += 12;
  }
  if (meridian.toUpperCase() === 'AM' && hours === 12) {
    hours = 0;
  }

  const date = new Date();
  date.setHours(hours, addMinutes ? minutes + addMinutes : minutes, 0, 0);

  const hours24 = date.getHours().toString().padStart(2, '0');
  const mins = date.getMinutes().toString().padStart(2, '0');

  return `${hours24}:${mins}:00.000`;
}


export default function C_VetAppointmentBooking({ user, vet, userPets, onPageTypeChange }: C_VetAppointmentBookingProps) {
    const [selectedVisitType, setSelectedVisitType] = useState<VISIT_TYPE>();
    const [selectedDateTimeSlot, setSelectedDateTimeSlot] = useState<DateTimeSlot>();
    const [selectedService, setSelectedService] = useState<string>("");
    const [selectedPet, setSelectedPet] = useState<Pet>();

    const [vetAvailability, setVetAvailability] = useState<DaySlots[]>([]);

    function handleSlotPickerValueChange(selected: { date: string; time: string; }): void {
        setSelectedDateTimeSlot(selected);
    }

    const [screenType, setScreenType] = useState<SCREEN_TYPE>(SCREEN_TYPE.BOOKING);

    const [appointmentId, setAppointmentId] = useState<number>();

    async function handleConfirmBtnClick (): Promise<void> {
        if (selectedVisitType && selectedDateTimeSlot && selectedDateTimeSlot.date && 
            selectedDateTimeSlot.time && selectedService && selectedPet
        ) {
            setLoading(true);
            //fetching services
            const servicesRes = await api.get("api/v1/services");
            const serviceObj = servicesRes?.find((item: any) => item.name === selectedService);
            //building the payload
            const payload = {
                    vet_id: vet?.id,
                    appointment_date: selectedDateTimeSlot.date,
                    start_time: convert12hTo24hPlusMinutes(selectedDateTimeSlot.time),
                    end_time: convert12hTo24hPlusMinutes(selectedDateTimeSlot.time, defaultTimeSlotInMin),
                    visit_type: selectedVisitType?.id,
                    service_id: serviceObj?.id,
                    pet_id: selectedPet?.id
                };

            //sending the appointment details
            const createAppointmentRes = await api.post("api/v1/user/appointment/add", payload);
            setAppointmentId(createAppointmentRes?.appointment);

            setLoading(false);
            setScreenType(SCREEN_TYPE.CONFIRMATION);
        } else {
            alert("Please provide the information");
        }
        
    }

    const hasFetched = useRef(false);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
            if (vet?.id && !hasFetched.current) {
            hasFetched.current = true;
            const fetchVetSlots = api.get(`api/v1/availability/${vet.id}/slots`, {days: defaultNumberOfDays});
            Promise.all([fetchVetSlots]).then(([res1]) => {
                if (Array.isArray(res1)) {
                    setVetAvailability(transformAvailability(res1));
                    setLoading(false);
                }
            }).catch((error) => {
                //TODO handle error cases
            });
        }
    }, [vet?.id]);

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
                            value={selectedVisitType?.id || ""}
                            onChange={(event) => setSelectedVisitType(VISIT_TYPES.find((item) => item.id === event.target.value))}>
                            <option value="" disabled hidden>Select Visit Type</option>
                            {VISIT_TYPES.map((v, i) => (
                                <option key={i} value={v.id}>{v.displayName}</option>
                            ))}
                            </select>
                            <IoChevronDown className="absolute right-3 top-3 text-gray-500" />
                        </div>
                        </div>

                        {/* Pick Location */}
                        {selectedVisitType?.id === VISIT_ID.HOME_VISIT && 
                            <div className="mb-4">
                            <label className="block text-sm font-semibold mb-2">Pick Location</label>
                            <LocationSelector/>
                            </div>
                        }

                        {/* Slot Picker components */}
                        <div className="mb-4">
                            <SlotPicker onChange={handleSlotPickerValueChange} vetAvailability={vetAvailability}/>
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
                            value={selectedPet?.id || ""}
                            onChange={(event) => (setSelectedPet(userPets.find((item) => item.id === parseInt(event.target.value))))}>
                            <option value="" disabled hidden>Select Pet</option>
                            {userPets.map((p, i) => (
                                <option key={i} value={p.id}>{p.name}</option>
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
            <AppointmentStatus appointmentDetails={{
                id: appointmentId,
                status: "booked",
                pet: selectedPet,
                doctorName: vet?.name,
                visitType: selectedVisitType?.displayName,
                service: selectedService,
                date: selectedDateTimeSlot?.date,
                time: selectedDateTimeSlot?.time,
                location: selectedVisitType?.id === VISIT_ID.ONLINE ? user?.location : vet?.clinic?.address
            }} onPageTypeChange={onPageTypeChange}/>
        );
    }

    return (
        <>
            {screenType === SCREEN_TYPE.BOOKING && renderBookingScreen()}
            {screenType === SCREEN_TYPE.CONFIRMATION && renderConfirmationScreen()}
            <FullScreenLoader loading={loading}/>
        </>
    );
}