import React, { useState } from "react";
import { FaHome, FaPlus } from "react-icons/fa";
import { FaCheckSquare, FaRegSquare } from "react-icons/fa";

interface Location {
  id: number;
  title: string;
  subtitle?: string;
  location?: string;
  details?: string;
}

const INITIAL_LOCATIONS: Location[] = [
  {
    id: 1,
    title: "Current Location",
    subtitle: "Clinic",
  },
  {
    id: 2,
    title: "Brook",
    subtitle: "(Friend)",
    location: "Kphb",
    details: "(near south-india)",
  },
];

export default function LocationSelector() {
  const [locations, setLocations] = useState(INITIAL_LOCATIONS);
  const [selectedId, setSelectedId] = useState<number>(1);

  // Add new location on click
  const handleAdd = () => {
    alert("clicked on add location button");
  };

  return (
    <div className="flex items-center gap-4">
      {locations.map((loc) => {
        const isSelected = selectedId === loc.id;
        return (
          <div
            key={loc.id}
            className={`rounded-2xl p-4 w-56 relative shadow-md cursor-pointer transition 
            ${isSelected ? "bg-pink-500 text-white" : "bg-white text-black"}`}
            onClick={() => setSelectedId(loc.id)}
          >
            {/* Top Row */}
            <div className="flex justify-between items-start">
              <span
                className={`text-xs font-semibold ${
                  isSelected ? "text-white" : "text-black"
                }`}
              >
                {loc.title}{" "}
                {loc.subtitle && (
                  <span
                    className={`${
                      isSelected ? "text-pink-100" : "text-gray-500"
                    } font-normal`}
                  >
                    {loc.subtitle}
                  </span>
                )}
              </span>
              {isSelected ? (
                <FaCheckSquare
                  className={`${
                    isSelected ? "text-white" : "text-gray-500"
                  } text-lg`}
                />
              ) : (
                <FaRegSquare className="text-gray-500 text-lg" />
              )}
            </div>

            {/* Bottom Row */}
            {loc.location ? (
              <p
                className={`mt-2 text-sm font-semibold ${
                  isSelected ? "text-white" : "text-black"
                }`}
              >
                {loc.location}
                {loc.details && (
                  <span
                    className={`ml-1 ${
                      isSelected ? "text-pink-100" : "text-gray-500"
                    } font-normal`}
                  >
                    {loc.details}
                  </span>
                )}
              </p>
            ) : (
              // Special case for Clinic (with icon)
              <div className="flex items-center gap-2 mt-3">
                <FaHome className={isSelected ? "text-white text-xl" : "text-pink-500 text-xl"} />
                <span
                  className={`text-sm font-medium ${
                    isSelected ? "text-white" : "text-black"
                  }`}
                >
                  {loc.subtitle}
                </span>
              </div>
            )}
          </div>
        );
      })}

      {/* Add Button */}
      <button
        className="bg-pink-500 rounded-full p-3 shadow-md hover:bg-pink-600 transition"
        onClick={handleAdd}
      >
        <FaPlus className="text-white text-lg" />
      </button>
    </div>
  );
}
