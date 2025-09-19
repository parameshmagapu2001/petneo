"use client";

import { VetInterface } from "@/app/customer/dashboard/page";

interface C_VetProfileProps {
    selectedVet: VetInterface | null;
}


export default function C_VetProfile({ selectedVet }: C_VetProfileProps) {
    return (
        <div>
            {selectedVet && selectedVet.name}
        </div>
    );
}