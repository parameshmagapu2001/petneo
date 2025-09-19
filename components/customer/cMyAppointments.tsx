"use client";

import { PageType } from "@/app/customer/dashboard/page";

interface C_MyAppointmentsProps {
    onPageTypeChange: (pageType: PageType) => void;
}


export default function C_MyAppointments({ onPageTypeChange }: C_MyAppointmentsProps) {
    return (
        <div>
           My Appointments
        </div>
    );
}