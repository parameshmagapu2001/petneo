import {FaCalendarAlt, FaPlus, FaSyringe} from "react-icons/fa";
import {HiOutlineDocumentText} from "react-icons/hi";
import React, {useEffect, useRef, useState} from "react";
import {api} from "@/utils/api";
import FullScreenLoader from "./fullScreenLoader";

interface C_PetHistoryProps {
    petId: number;
}

interface Vaccination {
    id: number;
    vaccination_name: string;
    date_vaccinated: string;
    dose_type: string;
}

export default function C_PetHistory({petId} : C_PetHistoryProps) {

    const [vaccinations, setVaccinations] = useState<Vaccination[]>([]);

    const hasFetched = useRef(false);
    const [loading, setLoading] = useState<boolean>(false);
    useEffect(() => {
        if (!hasFetched.current) {
            hasFetched.current = true;
            if (petId > 0) {
                //fetching the pet details
                setLoading(true);
                const petDetailsResponse = api.get(`/pets/user/${petId}`);
                Promise.all([petDetailsResponse]).then(([res1]) => {
                    if (res1?.vaccinations && Array.isArray(res1.vaccinations)) {
                        const vaccinationsLocal: Vaccination[] = [];
                        res1.vaccinations.forEach((item: Vaccination) => {
                            vaccinationsLocal.push(item);
                        });

                        //setting the vaccinations
                        setVaccinations(vaccinationsLocal);

                    }
                    setLoading(false);
                }).catch((e) => {
                    setLoading(false);
                    //TODO handle error scenario
                });
            }
        }
    }, []);

    return (
        <div className="min-h-screen bg-[#eaeaff] flex flex-col items-center py-8">
            <div className="w-full max-w-md">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-md font-semibold">Vaccinations</h2>
                </div>
                <div className="bg-white rounded-2xl shadow divide-y divide-gray-200 mb-4">
                    {vaccinations.length > 0 ?
                        vaccinations.map((vaccine) => (
                                <div key={vaccine.id} className="flex items-center justify-between px-4 py-4">
                                    <div>
                                        <div className="text-sm font-bold">{vaccine.vaccination_name}</div>
                                        <div className="flex items-center text-xs text-gray-500 mt-1">
                                            <FaSyringe size={15} className="mr-2" />
                                            <span className="mt-1">{vaccine.dose_type}</span>
                                        </div>
                                        <div className="flex items-center text-xs text-gray-500">
                                            <FaCalendarAlt size={15} className="mr-2" />
                                            <span className="mt-1">{vaccine.date_vaccinated}</span>
                                        </div>
                                    </div>
                                    <HiOutlineDocumentText className="text-gray-700 mr-8" size={50} />
                                </div>
                            )) :
                        <div className="flex items-center justify-items-center grid grid-cols-1 min-h-30">
                            <span>No Vaccination Data</span>
                        </div>}
                </div>
                <button className="w-full flex items-center justify-center bg-pink-500 text-white py-4 rounded-xl text-md font-medium mt-8 hover:bg-pink-600">
                    <FaPlus />
                    Add Documents
                </button>
            </div>
            <FullScreenLoader loading={loading}/>
        </div>
    );
}