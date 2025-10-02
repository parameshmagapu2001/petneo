"use client";

import {Pet} from "@/app/customer/dashboard/page";
import {api} from "@/utils/api";
import {useEffect, useRef, useState} from "react";
import {FaPlus} from "react-icons/fa";
import FullScreenLoader from "./fullScreenLoader";

interface C_MyPetsProps {
    onViewPetDetails: (petId: number) => void;
    onViewPetHistory: (petId: number) => void;
}


export default function C_MyPets({ onViewPetDetails, onViewPetHistory }: C_MyPetsProps) {
    const [myPets, setMyPets] = useState<Pet[]>([]);
    const hasFetched = useRef(false);
    const [loading, setLoading] = useState<boolean>(false);
    useEffect(() => {
        if (!hasFetched.current) {
            hasFetched.current = true;
            setLoading(true);
            //fetching my pets
            const fetchMyPets = api.get("/pets/myPets");
            Promise.all([fetchMyPets]).then(([res1]) => {
                setMyPets(Array.isArray(res1) ? res1 : []);
                setLoading(false);
            }).catch((error) => {
                //TODO handle error scenarios
            })
        }
        
    }, []);

    const handleAddButtonClick = () => {
        onViewPetDetails(-1);
    }

    return (
        <div className="min-h-screen bg-purple-50 flex flex-col items-center py-6">
            <h2 className="font-medium text-center mb-6 text-grey-100">My Pets</h2>
            <div className="flex flex-col gap-6 w-full max-w-xs">
                {myPets.map((pet) => (
                <div key={pet.id} className="bg-white rounded-xl shadow flex flex-col items-center">
                    <img
                    src={pet.pet_profile_picture}
                    alt={pet.name}
                    className="w-full h-48 object-cover rounded-t-xl"
                    />
                    <div className="w-full flex justify-center gap-3 py-3">
                    <button className="bg-pink-500 text-white rounded px-4 py-1 transition hover:bg-pink-600 text-sm font-semibold"
                    onClick={() => onViewPetDetails(pet.id)}>
                        View Details
                    </button>
                    <button className="bg-pink-500 text-white rounded px-4 py-1 transition hover:bg-pink-600 text-sm font-semibold"
                            onClick={() => onViewPetHistory(pet.id)}>
                        Pet History
                    </button>
                    </div>
                </div>
                ))}
            </div>
            <button className="bg-pink-500 hover:bg-pink-600 text-white font-semibold w-full max-w-xs py-3 mt-8 rounded-lg flex items-center justify-center gap-3 text-base transition"
            onClick={handleAddButtonClick}>
                <FaPlus />
                Add Pets
            </button>
            <FullScreenLoader loading={loading}/>
        </div>
    );
}