import {FaCalendarAlt, FaPlus, FaSyringe} from "react-icons/fa";
import {HiOutlineDocumentText} from "react-icons/hi";
import React, {useEffect, useRef, useState} from "react";
import {api} from "@/utils/api";
import FullScreenLoader from "./fullScreenLoader";
import PopupModel from "./popupModel";

interface C_PetHistoryProps {
    petId: number;
}

interface Vaccination {
    id: number;
    vaccination_name: string;
    date_vaccinated: string;
    dose_type: string;
}

interface NewVaccination {
    pet_id?: number;
    vaccination_name?: string;
    date_vaccinated?: string;
    dose_type?: string;
}

interface Prescription {
    id: number;
    appointment_id: number;
    text: string;
    prescription_file_url: string;
    created_at: string;
}

export default function C_PetHistory({petId} : C_PetHistoryProps) {

    const [vaccinations, setVaccinations] = useState<Vaccination[]>([]);
    const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);

    const hasFetched = useRef(false);
    const [loading, setLoading] = useState<boolean>(false);
    const fetchAndAssignVaccinationsList = () => {
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

                if (res1?.prescriptions && Array.isArray(res1.prescriptions)) {
                    const prescriptionsLocal: Prescription[] = [];
                    res1.prescriptions.forEach((item: Prescription) => {
                        prescriptionsLocal.push(item);
                    });

                    //setting the vaccinations
                    setPrescriptions(prescriptionsLocal);

                }
                setLoading(false);
            }).catch((e) => {
                setLoading(false);
                //TODO handle error scenario
            });
        }
    };
    useEffect(() => {
        if (!hasFetched.current) {
            hasFetched.current = true;
            fetchAndAssignVaccinationsList();
        }
    }, []);

    const today = new Date();

    const [newVaccinationRecord, setNewVaccinationRecord] = useState<NewVaccination>({});
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    useEffect(() => {
        if(isPopupOpen) {
            setNewVaccinationRecord({pet_id: petId});
        } else {
            setNewVaccinationRecord({});
        }
    }, [isPopupOpen]);
    const handleAddDocuments = () => {
        setIsPopupOpen(true);
    };
    const handlePopupCancel = () => {
        setIsPopupOpen(false);
    };
    const handlePrimaryAction = async () => {
        if (newVaccinationRecord?.pet_id && newVaccinationRecord?.date_vaccinated &&
            newVaccinationRecord?.vaccination_name && newVaccinationRecord?.dose_type) {
            const formData = new FormData();
            formData.append("pet_id", newVaccinationRecord.pet_id.toString());
            formData.append("date_vaccinated", newVaccinationRecord.date_vaccinated);
            formData.append("vaccination_name", newVaccinationRecord.vaccination_name);
            formData.append("dose_type", newVaccinationRecord.dose_type);
            //send the details to backend and close the popup.
            setLoading(true);
            const createVaccinationRecordResponse = await api.formDatapost("/petsuser/addVaccination", formData);
            setLoading(false);
            if (createVaccinationRecordResponse?.success) {
                //refreshing the vaccinations list
                fetchAndAssignVaccinationsList();
            } else {
                //TODO error handling
            }
            setIsPopupOpen(false);
        } else {
            alert("Please provide all the details");
        }
    };
    const handleNewVaccinationRecordChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setNewVaccinationRecord({
            ...newVaccinationRecord,
            [e.target.name]: e.target.value
        });
    };

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
                <button className="w-full flex items-center justify-center bg-pink-500 text-white py-4 rounded-xl text-md font-medium mt-8 hover:bg-pink-600"
                onClick={handleAddDocuments}>
                    <FaPlus />
                    Add Documents
                </button>
                <PopupModel open={isPopupOpen} onCancel={handlePopupCancel} onPrimary={handlePrimaryAction} primaryLabel="Save">
                    <form className="w-full max-w-lg bg-white rounded-xl px-8 py-10 shadow-lg">
                        <h2 className="text-base font-bold mb-8 text-center">Enter Vaccination Details</h2>
                        <div className="mb-3 text-sm">
                            <label htmlFor="vaccination_name" className="block font-semibold mb-1">Vaccination Name *</label>
                            <input
                                type="text"
                                id="vaccination_name"
                                name="vaccination_name"
                                value={newVaccinationRecord?.vaccination_name || ""}
                                onChange={handleNewVaccinationRecordChange}
                                required
                                className="w-full px-3 py-2 rounded-md border border-gray-300 bg-gray-50 focus:outline-none"
                            />
                        </div>
                        <div className="mb-3 text-sm">
                            <label htmlFor="date_vaccinated" className="block font-semibold mb-1">Date of vaccination *</label>
                            <input
                                type="date"
                                id="date_vaccinated"
                                name="date_vaccinated"
                                value={newVaccinationRecord?.date_vaccinated || ""}
                                onChange={handleNewVaccinationRecordChange}
                                max={today.toISOString().split('T')[0]}
                                className="w-full px-3 py-2 rounded-md border border-gray-300 bg-gray-50 focus:outline-none"
                            />
                        </div>
                        <div className="mb-3 text-sm">
                            <label htmlFor="dose_type" className="block font-semibold mb-1">Dose type *</label>
                            <input
                                type="text"
                                id="dose_type"
                                name="dose_type"
                                value={newVaccinationRecord?.dose_type || ""}
                                onChange={handleNewVaccinationRecordChange}
                                placeholder="Annual"
                                required
                                className="w-full px-3 py-2 rounded-md border border-gray-300 bg-gray-50 focus:outline-none"
                            />
                        </div>
                    </form>
                </PopupModel>
                <div className="flex items-center justify-between mt-4 mb-2">
                    <h2 className="text-md font-semibold">Prescriptions/ Medical Reports</h2>
                </div>
                <div className="bg-white rounded-2xl shadow divide-y divide-gray-200 mb-4">
                    {prescriptions.length > 0 ?
                        prescriptions.map((prescription) => (
                            <div key={prescription.id} className="flex items-center justify-between px-4 py-4">
                                <div>
                                    <div className="flex-col items-center text-xs text-gray-500 mt-1">
                                        <img alt="prescription image" src="/images/customer/prescription.png"/>
                                        <span className="mt-1">{prescription.created_at}</span>
                                    </div>
                                </div>
                                <button className="bg-pink-500 text-white py-4 rounded-xl text-md font-medium mt-8 hover:bg-pink-600">
                                    View
                                </button>
                            </div>
                        )) :
                        <div className="flex items-center justify-items-center grid grid-cols-1 min-h-30">
                            <span>No Prescription Data</span>
                        </div>}
                </div>
            </div>
            <FullScreenLoader loading={loading}/>
        </div>
    );
}