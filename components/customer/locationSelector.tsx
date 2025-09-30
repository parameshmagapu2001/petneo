import { api } from "@/utils/api";
import React, { useEffect, useRef, useState } from "react";
import { FaHome, FaPlus } from "react-icons/fa";
import { FaCheckSquare, FaRegSquare } from "react-icons/fa";
import FullScreenLoader from "./fullScreenLoader";

interface Location {
  id: number;
  title: string;
  subtitle?: string;
  location?: string;
  details?: string;
}

interface Address {
  address: string;
  address_details?: string;
  contact_name: string;
  contact_number: string;
  location_name: string;
  latitude: number;
  longitude: number,
  id?: number
}

interface LocationSelectorProps {
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

export default function LocationSelector({} : LocationSelectorProps) {
  const [selectedId, setSelectedId] = useState<number | undefined >();

  // Add new location on click
  const handleAdd = () => {
    alert("clicked on add location button");
  };

  const [addresses, setAddresses] = useState<Address[]>([]);


  const hasFetched = useRef(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      setLoading(true);
      const fetchUserAddresses = api.get("/user/address/myAddresses");
      Promise.all([fetchUserAddresses]).then(([res1]) => {
         setLoading(false);
          if (Array.isArray(res1)) {
            //setting the address
            const localAddresses: Address[] = [];
            res1.forEach((item) => {
              localAddresses.push({
                address: item.address,
                address_details: item.address_details,
                contact_name: item.contact_name,
                contact_number: item.contact_number,
                location_name: item.location_name,
                latitude: item.latitude,
                longitude: item.longitude,
                id: item.id,
              });
            });
              setAddresses(localAddresses);
          }
      }).catch((error) => {
          //TODO handle error cases
      });
    }
  }, []);

  const handleAddressSelection = (address: Address) => {
    return () => {
      setSelectedId(address.id);
    };

  }

  return (
    <div className="flex items-center grid grid-cols-3 gap-4">
      {addresses.map((loc) => {
        const isSelected = selectedId === loc.id;
        return (
          <div
            key={loc.id}
            className={`rounded-2xl p-4 w-34 relative shadow-md cursor-pointer transition 
            ${isSelected ? "bg-pink-500 text-white" : "bg-white text-black"}`}
            onClick={handleAddressSelection(loc)}
          >
            {/* Top Row */}
            <div className="flex justify-between items-start">
              <span
                className={`text-xs font-semibold ${
                  isSelected ? "text-white" : "text-black"
                }`}
              >
                {loc.contact_name}{" "}
                {/* {loc.subtitle && (
                  <span
                    className={`${
                      isSelected ? "text-pink-100" : "text-gray-500"
                    } font-normal`}
                  >
                    {loc.subtitle}
                  </span>
                )} */}
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
            {loc.location_name && (
              <p
                className={`mt-2 text-xs font-semibold ${
                  isSelected ? "text-white" : "text-black"
                }`}
              >
                {loc.location_name}
                {/* {loc.details && (
                  <span
                    className={`ml-1 ${
                      isSelected ? "text-pink-100" : "text-gray-500"
                    } font-normal`}
                  >
                    {loc.details}
                  </span>
                )} */}
              </p>
            )}
          </div>
        );
      })}

      {/* Add Button */}
      <button
        className="bg-pink-500 rounded-full p-3 w-10 shadow-md hover:bg-pink-600 transition cursor-pointer"
        onClick={handleAdd}
      >
        <FaPlus className="text-white text-lg" />
      </button>
       <FullScreenLoader loading={loading}/>
    </div>
  );
}
