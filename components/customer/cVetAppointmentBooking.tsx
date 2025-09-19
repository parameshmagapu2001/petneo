"use client";

import { PageType, User, VetInterface } from "@/app/customer/dashboard/page";

interface C_VetAppointmentBookingProps {
    user: User | null;
    vet: VetInterface | null;
    onPageTypeChange: (pageType: PageType) => void;
}


export default function C_VetAppointmentBooking({ user, vet, onPageTypeChange }: C_VetAppointmentBookingProps) {
    return (
        <div>
           userName: {user?.name}
           <br/>
           vetName: {vet?.name}
        </div>
    );
}