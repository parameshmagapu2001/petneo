'use client';

import { useParams } from 'next/navigation';

export default function PetDetailsPage() {
    const params = useParams();
    const petId = params.petId as string;
    return (
        <>
            <div>
                Pet details page with id {petId}
            </div>
        </>
    );
}