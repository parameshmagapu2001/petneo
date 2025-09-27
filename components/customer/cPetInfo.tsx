"use client";

import { PageType } from "@/app/customer/dashboard/constants";

interface C_PetInfoProps {
    petId: number | undefined;
    onPageTypeChange: (pageType: PageType) => void;
}


export default function C_PetInfo({ petId, onPageTypeChange }: C_PetInfoProps) {
    return (
        <div>
            Pet Details {petId}
        </div>
    );
}