"use client";

import { PageType } from "@/app/customer/dashboard/page";

interface C_MyPetsProps {
    onPageTypeChange: (pageType: PageType) => void;
}


export default function C_MyPets({ onPageTypeChange }: C_MyPetsProps) {
    return (
        <div>
           My Pets
        </div>
    );
}