"use client";

import { PageType } from "@/app/customer/dashboard/constants";
import { api } from "@/utils/api";
import { form } from "framer-motion/client";
import { useEffect, useRef, useState } from "react";
import FullScreenLoader from "./fullScreenLoader";
import { FaCamera, FaPen } from "react-icons/fa";
import { spec } from "node:test/reporters";

interface C_PetInfoProps {
    petId: number;
}
interface PetCompleteDetails {
    petId: number;
    name?: string;
    species?: string;
    breeding?: string;
    gender?: string;
    age?: string;
    dob?: string; //Extra param for creating the pet
    weight?: number;
    licence?: string;
    profile_picture?: string;
    profile_picture_file?: File | null; //Extra param for creating the pet
}

interface Breed {
    id: number;
    name: string;
}

interface Species {
    type: string;
    breeds: Breed[];
}


export default function C_PetInfo({ petId }: C_PetInfoProps) {
    const GENDERS = ["Male", "Female"];

    const [speciesList, setSpeciesList] = useState<Species[]>([]);
    const [petTypes, setPetTypes] = useState<string[]>([]);
    const [breeds, setBreeds] = useState<Breed[]>([]);
    const [petCompleteDetails, setPetCompleteDetails] = useState<PetCompleteDetails>({petId: petId});
    const [isEditMode, setIsEditMode] = useState<boolean>(petCompleteDetails?.petId < 0);

    const hasFetched = useRef(false);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if (!hasFetched.current) {
             hasFetched.current = true;
            //fetching the species
            const speciesResponse = api.get("/user/species");
            let petDetailsResponse;
            if (petId >= 0) {
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
            }).catch(() => {
                //TODO error handling.
            });
        }
        
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setPetCompleteDetails({
             ...petCompleteDetails,
            [e.target.name]: e.target.value
           });
    };

    const today = new Date();

    const profileImageInputRef = useRef<HTMLInputElement | null>(null);
    const handleEditPhotoClick = () => {
        profileImageInputRef.current?.click();
    };
    const handleProfileImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Preview image
        const previewUrl = URL.createObjectURL(file);
        setPetCompleteDetails({...petCompleteDetails,  profile_picture: previewUrl, profile_picture_file: file});
    };

    function handleSpeciesChange(event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void {
        //setting breeds on every species change.
        setBreeds(speciesList.find((item) => item.type === event.target.value)?.breeds || []);
        setPetCompleteDetails({
             ...petCompleteDetails,
            [event.target.name]: event.target.value,
            breeding: "" // setting it to default value
           });
    };

    const onSave = async (): Promise<void> => {
        //constructing the payload
        const formData = new FormData();
        const breed_Id = breeds.find((item) => item.name === petCompleteDetails.breeding)?.id;
        if (petCompleteDetails.name &&
            petCompleteDetails.species &&
            breed_Id &&
            petCompleteDetails.gender
        ) {
            formData.append("name", petCompleteDetails.name);
            formData.append("species", petCompleteDetails.species);
            formData.append("breed_id", breed_Id.toString());
            formData.append("gender", petCompleteDetails.gender);
        } else {
            alert("Provide the necessary details");
            return;
        }

        if (petCompleteDetails.dob) {
            formData.append("date_of_birth", petCompleteDetails.dob);
        }
        if (petCompleteDetails.weight) {
            formData.append("weight", petCompleteDetails.weight.toString());
        }
        if (petCompleteDetails.profile_picture_file) {
            formData.append("profile_picture", petCompleteDetails.profile_picture_file);
        }

        setLoading(true);
        let petIdLocal;

        if (petCompleteDetails.petId < 0) {
            //creating the pet
            const createPetResponse = await api.formDatapost("/pets/addPet", formData);
            if (createPetResponse?.success) {
                setLoading(false);
                petIdLocal = createPetResponse?.pet_id;
            } else {
                //TODO handle error scenario
            }
        } else {
            //editing an existing pet
            const editPetResponse = await api.formDataPut(`/pets/updatePet/${petCompleteDetails.petId}`, formData);
            if (editPetResponse?.success) {
                setLoading(false);
                //assigning the petId
                petIdLocal = editPetResponse?.pet_id;

            } else {
                //TODO handle error scenario
            }
        }

        if (!!petIdLocal) {
            //fetch the latest data and assign the required fields
            setLoading(true);
            const petDetailsResponse = await api.get(`/pets/user/${petIdLocal}`);
            setLoading(false);
            if (petDetailsResponse?.pet) {
                //assigning the required fields
                setPetCompleteDetails({
                    ...petCompleteDetails,
                    age: petDetailsResponse.pet?.age,
                    profile_picture: petDetailsResponse.pet?.profile_picture,
                    petId: petDetailsResponse.pet?.id
                });
            } else {
                //TODO handle error scenario
            }
        }

        //setting the editmode false
        setIsEditMode(false);
    };

    const onEdit = (): void => {
        setIsEditMode(true);
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
                        disabled={!isEditMode}
                    />
                </div>
                {/* Type */}
                <div className="mb-4 relative">
                    <label className="block font-semibold mb-1" htmlFor="type">Type</label>
                    <select
                        id="type"
                        name="species"
                        value={petCompleteDetails?.species || ""}
                        onChange={handleSpeciesChange}
                        className="w-full px-3 py-2 rounded-md bg-white focus:outline-none"
                        disabled={!isEditMode || !(petTypes?.length > 0)}
                    >
                        <option value="" disabled hidden>Select</option>
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
                        disabled={!isEditMode || !(petCompleteDetails?.species) || !(breeds?.length > 0)}
                    >
                        <option value="" disabled hidden>Select Breed</option>
                        {breeds.map((item) => <option key={item.name} value={item.name}>{item.name}</option>)}
                    </select>
                </div>
                {/* Date Of Birth ? AGE */}
                {!isEditMode ?
                    <div className="mb-4 relative">
                        <label className="block font-semibold mb-1" htmlFor="dob">Age</label>
                        <input
                            type="text"
                            id="age"
                            name="age"
                            value={petCompleteDetails?.age || ""}
                            onChange={handleChange}
                            className="w-full px-3 py-2 rounded-md bg-white focus:outline-none"
                            disabled={!isEditMode}
                        />
                    </div> :  
                    <div className="mb-4 relative">
                        <label className="block font-semibold mb-1" htmlFor="dob">Age</label>
                        <input
                            type="date"
                            id="dob"
                            name="dob"
                            value={petCompleteDetails?.dob || ""}
                            onChange={handleChange}
                            max={today.toISOString().split('T')[0]}
                            className="w-full px-3 py-2 rounded-md bg-white focus:outline-none"
                        />
                    </div>}
                {/* Gender */}
                <div className="mb-4 relative">
                    <label className="block font-semibold mb-1" htmlFor="gender">Gender</label>
                    <select
                        id="gender"
                        name="gender"
                        value={petCompleteDetails?.gender || ""}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded-md bg-white focus:outline-none"
                        disabled={!isEditMode}
                    >
                        <option value="" disabled hidden>Select</option>
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
                        disabled={!isEditMode}
                    />
                </div>
                {/* Pet Photo */}
                <div className="mb-4 relative">
                    <label className="block font-semibold mb-1" htmlFor="photo">Pet Photo</label>
                    <div id="photo">
                        {petCompleteDetails?.profile_picture ? 
                            <img
                                src={petCompleteDetails.profile_picture}
                                alt="pet"
                                className="w-full h-40 object-cover rounded-md bg-white"
                            /> : 
                            <FaCamera className="text-gray-400 text-3xl w-full h-40 object-cover rounded-md bg-white" />}
                        
                        {isEditMode &&
                            <>
                                {/* Edit (pencil) icon */}
                                <button
                                    type="button"
                                    onClick={handleEditPhotoClick}
                                    className="absolute bottom-2 right-2 bg-pink-500 text-white p-2 rounded-full shadow-md hover:bg-pink-600"
                                    >
                                    <FaPen size={12} />
                                </button>

                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    ref={profileImageInputRef}
                                    onChange={handleProfileImageFileChange}
                                />
                            </>}  
                    </div> 
                </div>
                {isEditMode ?
                    <button type="button" className="w-full bg-[#d14d91] hover:bg-[#bc3575] text-white font-bold py-3 rounded-full mt-6 transition-colors duration-300" onClick={onSave}>
                        Save
                    </button> :
                    <button type="button" className="w-full bg-[#d14d91] hover:bg-[#bc3575] text-white font-bold py-3 rounded-full mt-6 transition-colors duration-300" onClick={onEdit}>
                        Edit
                    </button>}
            </form>

            <FullScreenLoader loading={loading}/>
        </div>
    );
}