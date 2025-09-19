"use client";

import React from "react";
import { FiSearch, FiMapPin, FiFilter } from "react-icons/fi";
import { AiFillStar } from "react-icons/ai";


interface C_VetDetailsProps {
    onPageTypeChange: (pageType: string) => void;
}

export interface VetInterface {
    id: number;
    name: string;
    experience: number;
    rating: number;
    ratingCount: number;
    availableToday: boolean;
    address: string;
    tags: string[];
    image: string;
}

interface C_VetCardProp {
    vet : VetInterface;
}

const vetsData = [
  {
    id: 1,
    name: "Dr. Charan",
    experience: 17,
    rating: 5.0,
    ratingCount: 150,
    availableToday: true,
    address: "Kphb Colony, Hyderabad, 500055",
    tags: ["Grooming", "X ray", "Home Visit", "Online"],
    image:"../images/customer/defaultUserImage.png",
  },
  {
    id: 2,
    name: "Dr. Vijay",
    experience: 15,
    rating: 5.0,
    ratingCount: 400,
    availableToday: true,
    address: "Kphb Colony, Hyderabad, 500055",
    tags: ["Grooming", "X ray", "Home Visit", "Online"],
    image: "../images/customer/defaultUserImage.png",
  },
  {
    id: 3,
    name: "Dr. Mohan",
    experience: 6,
    rating: 4.0,
    ratingCount: 70,
    availableToday: true,
    address: "Kphb Colony, Hyderabad, 500055",
    tags: ["Grooming", "X ray", "Home Visit", "Online"],
    image: "../images/customer/defaultUserImage.png",
  },
  {
    id: 4,
    name: "Dr. Ravi",
    experience: 15,
    rating: 5.0,
    ratingCount: 170,
    availableToday: true,
    address: "Kphb Colony, Hyderabad, 500055",
    tags: ["Grooming", "X ray", "Home Visit", "Online"],
    image: "../images/customer/defaultUserImage.png",
  },
  {
    id: 5,
    name: "Dr. Sai",
    experience: 4,
    rating: 5.0,
    ratingCount: 120,
    availableToday: true,
    address: "Kphb Colony, Hyderabad, 500055",
    tags: ["Grooming", "X ray", "Home Visit", "Online"],
    image: "../images/customer/defaultUserImage.png",
  },
  {
    id: 6,
    name: "Dr. Indu",
    experience: 20,
    rating: 5.0,
    ratingCount: 300,
    availableToday: true,
    address: "Kphb Colony, Hyderabad, 500055",
    tags: ["Grooming", "X ray", "Home Visit", "Online"],
    image: "../images/customer/defaultUserImage.png",
  },
];

function C_VetCard({vet}: C_VetCardProp) {
    return (
        <>
            <div
                key={vet.id}
                className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 flex flex-col"
            >
                <div className="flex items-center gap-4 mb-4">
                <img
                    src={vet.image}
                    alt={vet.name}
                    className="w-16 h-16 rounded-full object-cover border border-gray-300"
                />
                <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-lg">{vet.name}</h3>
                    <p className="text-gray-500 text-sm">{vet.experience} years Exp</p>
                    <div className="flex items-center text-yellow-500 text-sm mt-1">
                    <AiFillStar className="mr-1" />
                    <span className="font-semibold">{vet.rating.toFixed(1)}</span>
                    <span className="text-gray-400 ml-2">({vet.ratingCount} Ratings)</span>
                    </div>
                    {vet.availableToday && (
                    <span className="inline-block mt-2 text-pink-600 text-xs font-semibold bg-pink-100 rounded px-2 py-0.5">
                        Available Today
                    </span>
                    )}
                </div>
                </div>

                <div className="flex items-center text-gray-400 text-sm mb-4">
                <FiMapPin className="mr-1" />
                <span>{vet.address}</span>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                {vet.tags.map((tag, i) => (
                    <span
                    key={i}
                    className="text-pink-600 text-xs font-semibold bg-pink-100 rounded px-3 py-1"
                    >
                    {tag}
                    </span>
                ))}
                </div>

                <button
                type="button"
                className="mt-auto bg-pink-600 hover:bg-pink-700 focus:ring-4 focus:ring-pink-300 text-white font-semibold text-sm rounded-md py-3 transition"
                >
                Book Appointment
                </button>
            </div>
        </>
    );
}


export default function C_VetDetails({ onPageTypeChange }: C_VetDetailsProps) {
    return (
        <>
            <div className="bg-gray-50 min-h-screen p-6">
                {/* Header with count, search, and filter */}
                <div className="flex flex-wrap items-center mb-8 gap-4">
                    <div className="text-gray-600 font-semibold text-sm">
                    Showing <span className="font-bold text-gray-900">{vetsData.length}</span> Vets
                    </div>
                    <div className="flex items-center w-full max-w-md relative">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search for Appointments"
                        className="pl-10 pr-8 py-2 w-[85%] left-3 rounded-md border border-gray-300 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 text-gray-700 text-sm"
                    />
                    <button
                        type="button"
                        aria-label="Filter"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-pink-500 hover:bg-pink-600 text-white p-2 rounded-md transition"
                    >
                        <FiFilter size={18} />
                    </button>
                    </div>
                </div>

                {/* Vet cards grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-20 gap-y-10 px-10">
                    {vetsData.map((vet) => (
                    <C_VetCard key={vet.id} vet={vet}/>
                    ))}
                </div>
            </div>
        </>
    );
}
