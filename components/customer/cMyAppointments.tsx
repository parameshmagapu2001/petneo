"use client";

interface C_MyAppointmentsProps {
    onPageTypeChange: (pageType: string) => void;
}


export default function C_MyAppointments({ onPageTypeChange }: C_MyAppointmentsProps) {
    return (
        <div>
           My Appointments
        </div>
    );
}