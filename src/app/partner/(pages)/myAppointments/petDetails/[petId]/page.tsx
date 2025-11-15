'use client';

import { useParams } from 'next/navigation';
import React, {useState} from "react";
import {FaMapLocationDot, FaWeightScale} from "react-icons/fa6";
import {MdCheckCircle, MdDateRange, MdMale} from "react-icons/md";
import {FaCalendarAlt, FaClock, FaFileContract, FaPhone, FaPlus, FaSyringe} from "react-icons/fa";
import Image from "next/image";
import {LuBone, LuDog} from "react-icons/lu";

// Sample Data
const SAMPLE_PET_DATA = {
    visit_history: [
        {
            appointment_id: 174,
            date: '2025-11-13',
            start_time: '10:00 AM',
            end_time: '10:30 AM',
            reason: null,
            status: 'booked' as const,
            visit_type: 'in-clinic' as const,
        },
        {
            appointment_id: 173,
            date: '2025-11-10',
            start_time: '02:00 PM',
            end_time: '02:30 PM',
            reason: 'Regular check-up',
            status: 'completed' as const,
            visit_type: 'in-clinic' as const,
        },
    ],
    pet: {
        id: 19,
        name: 'Rocky',
        species: 'Dog',
        gender: 'Male',
        breeding: 'German Shepard',
        age: '12 months',
        weight: 5,
        licence: '1235454',
        profile_picture:
            'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=400&h=400&fit=crop',
    },
    Owner: {
        name: 'Mohan',
        address: 'Hyd',
        contact_number: '5456791234',
    },
    vaccinations: [
        {
            id: 17,
            vaccination_name: 'Parvovirus',
            date_vaccinated: '2025-05-12',
            dose_type: 'Booster dose',
        },
        {
            id: 18,
            vaccination_name: 'Rabies',
            date_vaccinated: '2025-05-12',
            dose_type: 'Booster dose',
        },
        {
            id: 19,
            vaccination_name: 'Lyme',
            date_vaccinated: '2025-05-12',
            dose_type: 'Booster dose',
        },
        {
            id: 20,
            vaccination_name: 'Tetanus',
            date_vaccinated: '2025-09-03',
            dose_type: 'When Needed',
        },
    ],
    prescriptions: [
        {
            id: 8,
            appointment_id: 50,
            prescription_file_url:
                'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=200&h=200&fit=crop',
        },
        {
            id: 7,
            appointment_id: 142,
            prescription_file_url:
                'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=200&h=200&fit=crop',
        },
    ],
};

export default function PetDetailsPage() {
    const params = useParams();
    const petId = params.petId as string;

    const [activeTab, setActiveTab] = useState<'visit-details' | 'pet-info' | 'medical-history'>(
        'visit-details'
    );
    const { pet, Owner, visit_history, vaccinations, prescriptions } = SAMPLE_PET_DATA;

    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    const infoFields = [
        { icon: LuBone, label: 'Species', value: pet.species },
        { icon: LuDog, label: 'Breeding', value: pet.breeding },
        { icon: MdMale, label: 'Gender', value: pet.gender },
        { icon: MdDateRange, label: 'Age', value: pet.age },
        { icon: FaWeightScale, label: 'Weight', value: `${pet.weight} Kgs` },
        { icon: FaFileContract, label: 'Licence', value: pet.licence },
    ];

    const ownerInfoFields = [
        { icon: FaPhone, label: 'Contact', value: Owner.contact_number },
        { icon: FaMapLocationDot, label: 'Address', value: Owner.address }
    ];

    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
                <div className="max-w-2xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex flex-nowrap items-center">
                            <div className="relative w-25 h-25 mx-6">
                                <Image
                                    src={pet.profile_picture}
                                    alt={pet.name}
                                    fill
                                    className="rounded-full border-4 border-white shadow-lg object-cover"
                                    priority
                                />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900 mb-2">{pet.name}</h1>
                                <p className="text-gray-600 text-xs">
                                    {pet.species} | {pet.age}
                                </p>
                            </div>
                        </div>

                    </div>

                    {/* Tab Navigation */}
                    <div className="flex gap-2 mb-8 justify-center flex-wrap">
                        {[
                            { id: 'visit-details', label: 'Visit Details' },
                            { id: 'pet-info', label: 'Pet Info' },
                            { id: 'medical-history', label: 'Medical History' },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`px-6 py-2 rounded-full cursor-pointer font-semibold text-sm transition-all duration-300 hover:translate-y-[-2px] ${
                                    activeTab === tab.id
                                        ? 'bg-pink-600 text-white'
                                        : 'bg-pink-200 text-pink-600'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <div className="transition-opacity duration-300">
                        {/* visit Details Tab */}
                        {activeTab === 'visit-details' && (
                            <div>
                                {visit_history.map((appointment) => (
                                    <div
                                        key={appointment.appointment_id}
                                        className="bg-white border-2 border-purple-200 rounded-xl p-5 mb-5 flex justify-between items-center gap-4"
                                    >
                                        <div className="flex items-center flex-1">
                                            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-xl mr-4 flex-shrink-0 text-purple-600">
                                                <FaClock />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-900 uppercase font-bold mb-1">
                                                    {appointment.date}
                                                </p>
                                                <p className="text-sm font-bold text-gray-900 mb-1">
                                                    {appointment.start_time} - {appointment.end_time}
                                                </p>
                                                <p className="text-xs text-gray-600">
                                                    {appointment.visit_type === 'in-clinic'
                                                        ? 'Consultation'
                                                        : appointment.visit_type === 'tele'
                                                            ? 'Online'
                                                            : 'Home Visit'
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                        <div className="bg-cyan-300 text-cyan-900 uppercase px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap flex-shrink-0">
                                            {appointment.status}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Pet Info Tab */}
                        {activeTab === 'pet-info' && (
                            <div>
                                <div className="w-full bg-blue-100 border-2 border-blue-400 rounded-lg p-4 my-8">
                                    <span className="text-base font-medium text-gray-700">Pet Name:</span>
                                    <span className="ml-2 text-gray-900 font-semibold text-base">{pet.name}</span>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    {infoFields.map((field, index) => {
                                        const IconComponent = field.icon;
                                        return (
                                            <div
                                                key={index}
                                                className="bg-purple-100 p-4 rounded-xl border border-purple-300 shadow-lg"
                                            >
                                                <p className="text-sm text-gray-600 mb-2 capitalize flex items-center gap-1.5">
                                                    <IconComponent className="text-lg text-purple-600" />
                                                    {field.label}
                                                </p>
                                                <p className="text-base font-bold text-gray-900">{field.value}</p>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="w-full bg-blue-100 border-2 border-blue-400 rounded-lg p-4 my-8">
                                    <span className="text-base font-medium text-gray-700">Owner Name:</span>
                                    <span className="ml-2 text-gray-900 font-semibold text-base">{Owner.name}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    {ownerInfoFields.map((field, index) => {
                                        const IconComponent = field.icon;
                                        return (
                                            <div
                                                key={index}
                                                className="bg-purple-100 p-4 rounded-xl border border-purple-300 shadow-lg"
                                            >
                                                <p className="text-sm text-gray-600 mb-2 capitalize flex items-center gap-1.5">
                                                    <IconComponent className="text-lg text-purple-600" />
                                                    {field.label}
                                                </p>
                                                <p className="text-base font-bold text-gray-900">{field.value}</p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Medical History Tab */}
                        {activeTab === 'medical-history' && (
                            <div>
                                <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    Vaccinations
                                </h2>
                                <div className="mb-4">
                                    {vaccinations.map((vaccination) => (
                                        <div
                                            key={vaccination.id}
                                            className="bg-purple-50 border-l-4 text-purple-600 p-4 mb-5 rounded-lg flex justify-between items-center"
                                        >
                                            <div className="flex-1">
                                                <p className="text-base font-bold text-gray-900 mb-1">
                                                    {vaccination.vaccination_name}
                                                </p>
                                                <div className="flex flex-col text-sm text-gray-600">
                                                    <div className="flex flex-nowrap mb-1">
                                                        <FaSyringe size={15} className="mr-2 text-purple-600" />
                                                        <span>{vaccination.dose_type}</span>
                                                    </div>
                                                    <div className="flex flex-nowrap">
                                                        <FaCalendarAlt size={15} className="mr-2 text-purple-600" />
                                                        <span>{formatDate(vaccination.date_vaccinated)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <MdCheckCircle className="text-2xl text-cyan-500 flex-shrink-0" />
                                        </div>
                                    ))}
                                </div>
                                <button className="w-full bg-purple-200 text-purple-600 cursor-pointer py-3 rounded-xl font-semibold mb-8 hover:bg-purple-300 transition-colors flex items-center justify-center gap-2">
                                    <FaPlus /> Add New
                                </button>

                                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    Prescriptions
                                </h2>
                                <div className="grid grid-cols-6 gap-3">
                                    {prescriptions.map((prescription) => (
                                        <div
                                            key={prescription.id}
                                            className="aspect-square bg-gradient-to-br from-cyan-100 to-cyan-50 rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition-transform flex items-center justify-center relative"
                                        >
                                            <Image
                                                src={prescription.prescription_file_url}
                                                alt={`Prescription ${prescription.id}`}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    ))}
                                    <div className="aspect-square bg-purple-200 rounded-xl flex items-center justify-center cursor-pointer hover:scale-105 transition-transform text-3xl">
                                        <FaPlus className="text-purple-600" />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}