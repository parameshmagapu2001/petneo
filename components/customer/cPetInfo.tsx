"use client";

import { PageType } from "@/app/customer/dashboard/constants";
import { api } from "@/utils/api";
import { form } from "framer-motion/client";
import { useEffect, useRef, useState } from "react";

interface C_PetInfoProps {
    petId: number | undefined;
    onPageTypeChange: (pageType: PageType) => void;
}
interface PetCompleteDetails {
    petId?: number;
    name?: string;
    species?: string;
    breeding?: string;
    gender?: string;
    age?: string;
    weight?: number;
    licence?: string;
    profile_picture?: string;
}

interface Breed {
    id: number;
    name: string;
}

interface Species {
    type: string;
    breeds: Breed[];
}


export default function C_PetInfo({ petId, onPageTypeChange }: C_PetInfoProps) {
    const GENDERS = ["Male", "Female"];

    const [speciesList, setSpeciesList] = useState<Species[]>([]);
    const [petTypes, setPetTypes] = useState<string[]>([]);
    const [breeds, setBreeds] = useState<Breed[]>([]);
    const [petCompleteDetails, setPetCompleteDetails] = useState<PetCompleteDetails>({});

    const hasFetched = useRef(false);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if (!hasFetched.current) {
             hasFetched.current = true;
            //fetching the species
            const speciesResponse = api.get("/user/species");
            let petDetailsResponse;
            if (petId) {
                //fetching the pet info
                petDetailsResponse = api.get(`/pets/user/${petId}`);
            }

            Promise.all([speciesResponse, petDetailsResponse]).then(([res1, res2]) => {
                if (res2?.pet) {
                    //setting the pet details object
                    setPetCompleteDetails({
                        petId: res2.pet.id,
                        name: res2.pet.name,
                        species: res2.pet.species,
                        breeding: res2.pet.breeding,
                        gender: res2.pet.gender,
                        age: res2.pet.age,
                        weight: res2.pet.weight,
                        licence: res2.pet.licence,
                        profile_picture: res2.pet.profile_picture
                    });
                }

                const speciesListlocal: Species[] = [];
                const petTypesLocal: string[] = [];
                if (Array.isArray(res1)) {
                    res1.forEach((item) => {
                        speciesListlocal.push({type: item.Type, breeds: item.breeds});
                        petTypesLocal.push(item.Type);
                    });
                    setSpeciesList(speciesListlocal);
                    setPetTypes(petTypesLocal);

                    if (res2?.pet) {
                        setBreeds(speciesListlocal.find((item) => item.type === res2.pet.species)?.breeds || []);
                    }
                }
                setLoading(false);
            });
        }
        
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setPetCompleteDetails({
             ...petCompleteDetails,
            [e.target.name]: e.target.value
           });
    };

    return (
        <div className="bg-[#eaeaff] min-h-screen flex flex-col items-center pt-8">
            <form className="w-full max-w-sm bg-transparent rounded-lg p-4">
                {/* Pet Name */}
                <div className="mb-4 relative">
                    <label className="block font-semibold mb-1" htmlFor="petName">Pet Name</label>
                    <input
                        type="text"
                        id="petName"
                        name="name"
                        value={petCompleteDetails?.name || ""}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded-md bg-white focus:outline-none"
                    />
                </div>
                {/* Type */}
                <div className="mb-4 relative">
                    <label className="block font-semibold mb-1" htmlFor="type">Type</label>
                    <select
                        id="type"
                        name="species"
                        value={petCompleteDetails?.species || ""}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded-md bg-white focus:outline-none"
                        disabled={!(petTypes?.length > 0)}
                    >
                        <option value="">Select</option>
                        {petTypes.map(type => <option key={type} value={type}>{type}</option>)}
                    </select>
                </div>
                {/* Breed */}
                <div className="mb-4 relative">
                    <label className="block font-semibold mb-1" htmlFor="breed">Breed</label>
                    <select
                        id="breed"
                        name="breeding"
                        value={petCompleteDetails?.breeding || ""}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded-md bg-white focus:outline-none"
                        disabled={!(petCompleteDetails?.species) || !(breeds?.length > 0)}
                    >
                        <option value="">Select Breed</option>
                        {breeds.map((item) => <option key={item.name} value={item.name}>{item.name}</option>)}
                    </select>
                </div>
                {/* Date Of Birth */}
                <div className="mb-4 relative">
                    <label className="block font-semibold mb-1" htmlFor="dob">Date Of Birth</label>
                    <input
                        type="text"
                        id="dob"
                        name="age"
                        value={petCompleteDetails?.age || ""}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded-md bg-white focus:outline-none"
                    />
                </div>
                {/* Gender */}
                <div className="mb-4 relative">
                    <label className="block font-semibold mb-1" htmlFor="gender">Gender</label>
                    <select
                        id="gender"
                        name="gender"
                        value={petCompleteDetails?.gender || ""}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded-md bg-white focus:outline-none"
                    >
                        <option value="">Select</option>
                        {GENDERS.map(gender => <option key={gender} value={gender}>{gender}</option>)}
                    </select>
                </div>
                {/* Weight */}
                <div className="mb-4 relative">
                    <label className="block font-semibold mb-1" htmlFor="weight">Pet Weight</label>
                    <input
                        type="text"
                        id="weight"
                        name="weight"
                        value={petCompleteDetails?.weight || ""}
                        placeholder="Enter Pet Weight"
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded-md bg-white focus:outline-none"
                    />
                </div>
                {/* Pet Photo */}
                <div className="mb-4 relative">
                    <label className="block font-semibold mb-1" htmlFor="photo">Pet Photo</label>
                    <img
                        src={petCompleteDetails?.profile_picture}
                        alt="pet"
                        className="w-full h-32 object-cover rounded-md bg-white"
                    />
                </div>
                <button type="submit" className="w-full bg-[#d14d91] hover:bg-[#bc3575] text-white font-bold py-3 rounded-full mt-6 transition-colors duration-300">
                Save
                </button>
            </form>
        </div>
    );
}