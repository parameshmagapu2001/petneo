import {FaCalendarAlt, FaPlus, FaSyringe} from "react-icons/fa";
import {HiOutlineDocumentText} from "react-icons/hi";
import {useEffect, useRef, useState} from "react";
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
        <div className="min-h-screen bg-purple-50 flex flex-col items-center py-8">
            <div className="w-full max-w-md">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-lg font-semibold">Vaccinations</h2>
                </div>
                <div className="bg-white rounded-2xl shadow divide-y divide-gray-200 mb-4">
                    {vaccinations.map((vaccine) => (
                        <div key={vaccine.id} className="flex items-center justify-between px-4 py-4">
                            <div>
                                <div className="text-md font-bold">{vaccine.vaccination_name}</div>
                                <div className="flex items-center text-sm text-gray-500 mt-1">
                                    <FaSyringe className="mr-1" />
                                    <span>{vaccine.dose_type}</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-500">
                                    <FaCalendarAlt className="mr-1" />
                                    <span>{vaccine.date_vaccinated}</span>
                                </div>
                            </div>
                            <HiOutlineDocumentText className="text-2xl text-gray-700" />
                        </div>
                    ))}
                </div>
                <button className="w-full flex items-center justify-center bg-pink-500 text-white py-4 rounded-xl text-lg font-medium mt-2 hover:bg-pink-600">
                    <FaPlus />
                    Add Documents
                </button>
            </div>
            <FullScreenLoader loading={loading}/>
        </div>
    );
}