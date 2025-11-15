"use client";

import {PartnerMyAppointments} from "@/utils/commonTypes";
import {useState} from "react";
import PartnerAppointmentCard from "../../../../../components/partner/PartnerAppointmentCard";

const appointmentsData: PartnerMyAppointments = {
    upcoming: [
        {
            appointment_id: 200,
            date: '2025-11-20',
            time: '11:00 AM',
            status: 'scheduled',
            reason: 'General Visit',
            visit_type: 'In-clinic',
            pet: {
                id: 36,
                name: 'Rocky',
                species: 'Dog',
                breed: 'German Shepherd',
                profile_picture: 'https://images.unsplash.com/photo-1633722715463-d30628519f5d?w=200&h=200&fit=crop',
            },
        },
        {
            appointment_id: 201,
            date: '2025-11-22',
            time: '2:30 PM',
            status: 'scheduled',
            reason: 'Vaccination',
            visit_type: 'In-clinic',
            pet: {
                id: 37,
                name: 'Luna',
                species: 'Dog',
                breed: 'Golden Retriever',
                profile_picture: 'https://images.unsplash.com/photo-1587300411515-150663888a0f?w=200&h=200&fit=crop',
            },
        },
        {
            appointment_id: 202,
            date: '2025-11-25',
            time: '10:00 AM',
            status: 'scheduled',
            reason: 'General Visit',
            visit_type: 'Home-visit',
            pet: {
                id: 38,
                name: 'Mittens',
                species: 'Cat',
                breed: 'Persian',
                profile_picture: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=200&h=200&fit=crop',
            },
        },
    ],
    ongoing: [
        {
            appointment_id: 195,
            date: '2025-11-15',
            time: '9:00 AM',
            status: 'in-progress',
            reason: 'Check-up',
            visit_type: 'In-clinic',
            pet: {
                id: 35,
                name: 'Charlie',
                species: 'Dog',
                breed: 'Labrador',
                profile_picture: 'https://images.unsplash.com/photo-1633722715463-d30628519f5d?w=200&h=200&fit=crop',
            },
        },
    ],
    completed: [
        {
            appointment_id: 168,
            date: '2025-10-23',
            time: '11:30 AM',
            status: 'completed',
            reason: 'General Visit',
            visit_type: 'In-clinic',
            pet: {
                id: 21,
                name: 'Rocky',
                species: 'Dog',
                breed: 'German Shepherd',
                profile_picture: 'https://images.unsplash.com/photo-1633722715463-d30628519f5d?w=200&h=200&fit=crop',
            },
        },
        {
            appointment_id: 151,
            date: '2025-10-15',
            time: '10:30 AM',
            status: 'completed',
            reason: 'Vaccination',
            visit_type: 'Home-visit',
            pet: {
                id: 36,
                name: 'Buddy',
                species: 'Dog',
                breed: 'Golden Retriever',
                profile_picture: 'https://images.unsplash.com/photo-1587300411515-150663888a0f?w=200&h=200&fit=crop',
            },
        },
        {
            appointment_id: 154,
            date: '2025-10-14',
            time: '9:30 AM',
            status: 'completed',
            reason: 'General Visit',
            visit_type: 'In-clinic',
            pet: {
                id: 19,
                name: 'Bella',
                species: 'Cat',
                breed: 'Persian',
                profile_picture: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=200&h=200&fit=crop',
            },
        },
    ],
    no_show: [
        {
            appointment_id: 185,
            date: '2025-11-10',
            time: '2:00 PM',
            status: 'no-show',
            reason: 'General Visit',
            visit_type: 'In-clinic',
            pet: {
                id: 42,
                name: 'Max',
                species: 'Dog',
                breed: 'Beagle',
                profile_picture: 'https://images.unsplash.com/photo-1633722715463-d30628519f5d?w=200&h=200&fit=crop',
            },
        },
    ]
};

const TABS = ['Upcoming', 'Completed', 'Ongoing', 'No Show'] as const;
type TabType = (typeof TABS)[number];

export default function PartnerMyAppointmentsPage()  {

    const [currentTab, setCurrentTab] = useState<TabType>('Upcoming');

    const getTabKey = (tab: TabType): keyof PartnerMyAppointments => {
        const keyMap: Record<TabType, keyof PartnerMyAppointments> = {
            Upcoming: 'upcoming',
            Completed: 'completed',
            Ongoing: 'ongoing',
            'No Show': 'no_show',
        };
        return keyMap[tab];
    };

    const appointments = appointmentsData[getTabKey(currentTab)] || [];
    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">My Appointments</h1>
                        <p className="text-gray-600">Manage and track your pet's appointments</p>
                    </div>

                    {/* Tabs */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-8">
                        <div className="flex gap-8 border-b border-gray-200">
                            {TABS.map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setCurrentTab(tab)}
                                    className={`pb-3 px-2 font-medium transition-colors whitespace-nowrap ${
                                        currentTab === tab
                                            ? 'text-pink-600 border-b-2 border-pink-600'
                                            : 'text-gray-600 border-b-2 border-transparent hover:text-gray-900'
                                    }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Appointments Grid */}
                    {appointments.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500">No appointments found</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {appointments.map((appointment) => (
                                <PartnerAppointmentCard
                                    key={appointment.appointment_id}
                                    appointment={appointment}
                                    isCountdownNeeded={false}
                                    isViewDetailsNeeded={true}
                                    isRescheduleNeeded={currentTab === 'Upcoming'}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}