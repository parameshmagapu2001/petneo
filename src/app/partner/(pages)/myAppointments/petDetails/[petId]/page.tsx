'use client';

import { useParams } from 'next/navigation';
import {useState} from "react";
import {FaMapLocationDot, FaWeightScale} from "react-icons/fa6";
import {MdCheckCircle, MdDateRange, MdMale} from "react-icons/md";
import {FaClock, FaFileContract, FaPhone, FaPlus} from "react-icons/fa";
import { GiPawFront } from 'react-icons/gi';
import {BiSolidInjection} from "react-icons/bi";
import Image from "next/image";

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

    const [activeTab, setActiveTab] = useState<'view-details' | 'pet-info' | 'medical-history'>(
        'view-details'
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
        { icon: GiPawFront, label: 'Species', value: pet.species },
        { icon: GiPawFront, label: 'Breeding', value: pet.breeding },
        { icon: MdMale, label: 'Gender', value: pet.gender },
        { icon: MdDateRange, label: 'Age', value: pet.age },
        { icon: FaWeightScale, label: 'Weight', value: `${pet.weight} Kgs` },
        { icon: FaFileContract, label: 'Licence', value: pet.licence },
    ];

    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
                <div className="max-w-2xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="relative w-32 h-32 mx-auto mb-4">
                            <Image
                                src={pet.profile_picture}
                                alt={pet.name}
                                fill
                                className="rounded-full border-4 border-white shadow-lg object-cover"
                                priority
                            />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{pet.name}</h1>
                        <p className="text-gray-600 text-sm">
                            {pet.species} | {pet.age}
                        </p>
                    </div>

                    {/* Tab Navigation */}
                    <div className="flex gap-2 mb-8 justify-center flex-wrap">
                        {[
                            { id: 'view-details', label: 'View Details' },
                            { id: 'pet-info', label: 'Pet Info' },
                            { id: 'medical-history', label: 'Medical History' },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`px-6 py-2 rounded-full font-semibold text-sm transition-all duration-300 hover:translate-y-[-2px] ${
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
                        {/* View Details Tab */}
                        {activeTab === 'view-details' && (
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
                                                <p className="text-xs text-gray-500 uppercase font-semibold mb-1">
                                                    {appointment.status === 'completed' ? 'Completed' : 'Today'}
                                                </p>
                                                <p className="text-base font-bold text-gray-900 mb-1">
                                                    {appointment.start_time} - {appointment.end_time}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    {appointment.reason || 'Regular check up'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="bg-cyan-300 text-cyan-900 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap flex-shrink-0">
                                            {appointment.visit_type === 'in-clinic'
                                                ? 'Consultation'
                                                : 'Online'}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Pet Info Tab */}
                        {activeTab === 'pet-info' && (
                            <div>
                                <input
                                    type="text"
                                    value={`Pet Name: ${pet.name}`}
                                    readOnly
                                    className="w-full bg-blue-100 px-4 py-3 rounded-xl border border-blue-200 text-gray-900 mb-4 font-medium"
                                />

                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    {infoFields.map((field, index) => {
                                        const IconComponent = field.icon;
                                        return (
                                            <div
                                                key={index}
                                                className="bg-purple-50 p-4 rounded-xl border border-purple-100"
                                            >
                                                <p className="text-xs text-gray-600 mb-2 capitalize flex items-center gap-1.5">
                                                    <IconComponent className="text-base text-purple-600" />
                                                    {field.label}
                                                </p>
                                                <p className="text-base font-bold text-gray-900">{field.value}</p>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="bg-blue-100 p-4 rounded-xl">
                                    <div className="mb-4">
                                        <p className="text-xs text-blue-900 uppercase font-semibold mb-2 flex items-center gap-2">
                                            <GiPawFront className="text-base" />
                                            Owner Name
                                        </p>
                                        <p className="text-base font-semibold text-gray-900">
                                            {Owner.name}
                                        </p>
                                    </div>
                                    <div className="mb-4">
                                        <p className="text-xs text-blue-900 uppercase font-semibold mb-2 flex items-center gap-2">
                                            <FaPhone className="text-base" />
                                            Contact
                                        </p>
                                        <p className="text-base font-semibold text-gray-900">
                                            {Owner.contact_number}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-blue-900 uppercase font-semibold mb-2 flex items-center gap-2">
                                            <FaMapLocationDot className="text-base" />
                                            Address
                                        </p>
                                        <p className="text-base font-semibold text-gray-900">
                                            {Owner.address}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Medical History Tab */}
                        {activeTab === 'medical-history' && (
                            <div>
                                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <BiSolidInjection className="text-pink-600" />
                                    Vaccinations
                                </h2>
                                <div className="mb-4">
                                    {vaccinations.map((vaccination) => (
                                        <div
                                            key={vaccination.id}
                                            className="bg-purple-50 border-l-4 border-pink-600 p-4 mb-3 rounded-lg flex justify-between items-center"
                                        >
                                            <div className="flex-1">
                                                <p className="text-base font-bold text-gray-900 mb-1">
                                                    {vaccination.vaccination_name}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    <span>{vaccination.dose_type}</span> •{' '}
                                                    <span>{formatDate(vaccination.date_vaccinated)}</span>
                                                </p>
                                            </div>
                                            <MdCheckCircle className="text-2xl text-cyan-500 flex-shrink-0" />
                                        </div>
                                    ))}
                                </div>
                                <button className="w-full bg-pink-200 text-pink-600 py-3 rounded-xl font-semibold mb-8 hover:bg-pink-300 transition-colors flex items-center justify-center gap-2">
                                    <FaPlus /> Add New
                                </button>

                                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <FaFileContract className="text-pink-600" />
                                    Prescriptions
                                </h2>
                                <div className="grid grid-cols-3 gap-3 sm:grid-cols-2">
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
                                    <div className="aspect-square bg-pink-200 rounded-xl flex items-center justify-center cursor-pointer hover:scale-105 transition-transform text-3xl">
                                        <FaPlus className="text-pink-600" />
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