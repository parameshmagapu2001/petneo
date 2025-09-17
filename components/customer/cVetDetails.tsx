"use client";

interface C_VetDetailsProps {
    onPageTypeChange: (pageType: string) => void;
}


export default function C_VetDetails({ onPageTypeChange }: C_VetDetailsProps) {
    return (
        <div>
            Vet Detials
        </div>
    );
}