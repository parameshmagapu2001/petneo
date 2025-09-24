"use client";

import { PageType } from "@/app/customer/dashboard/constants";

interface C_PetInfoProps {
    onPageTypeChange: (pageType: PageType) => void;
}


export default function C_PetInfo({ onPageTypeChange }: C_PetInfoProps) {
    return (
        <div>
            Pet Details
        </div>
    );
}