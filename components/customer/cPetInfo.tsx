"use client";

interface C_PetInfoProps {
    onPageTypeChange: (pageType: string) => void;
}


export default function C_PetInfo({ onPageTypeChange }: C_PetInfoProps) {
    return (
        <div>
            Pet Details
        </div>
    );
}