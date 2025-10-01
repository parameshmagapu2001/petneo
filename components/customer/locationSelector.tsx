import { api } from "@/utils/api";
import React, { useEffect, useRef, useState } from "react";
import { FaHome, FaPlus } from "react-icons/fa";
import { FaCheckSquare, FaRegSquare } from "react-icons/fa";
import FullScreenLoader from "./fullScreenLoader";
import PopupModel from "./popupModel";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

const mapContainerStyle = { width: "100%", height: "300px" };
const center = { lat: 17.385, lng: 78.4867 }; // Default: Hyderabad


const MapSelector = ({ onChange }: { onChange: (lat: number, lng: number) => void }) => {
  const google_api_key = process.env.NEXT_PUBLIC_GOOGLE_API_KEY || ""
  const [marker, setMarker] = useState(center);
  const { isLoaded } = useLoadScript({ googleMapsApiKey: google_api_key });

  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={marker}
      zoom={13}
      onClick={e => {
        const lat = e.latLng?.lat() ?? center.lat;
        const lng = e.latLng?.lng() ?? center.lng;
        setMarker({ lat, lng });
        onChange(lat, lng);
      }}
    >
      <Marker position={marker} />
    </GoogleMap>
  );
};

interface Address {
  address?: string;
  address_details?: string;
  contact_name?: string;
  contact_number?: string;
  location_name?: string;
  latitude?: number;
  longitude?: number,
  id?: number
}

interface LocationSelectorProps {
  onSelectedAddressChange: (selectedAddressId: number) => void;
}

export default function LocationSelector({onSelectedAddressChange} : LocationSelectorProps) {
  const [selectedId, setSelectedId] = useState<number | undefined >();

  // Add new location on click
  const handleAdd = () => {
    setIsPopupOpen(true);
  };

  const [addresses, setAddresses] = useState<Address[]>([]);


  const hasFetched = useRef(false);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchAndSetAddresses = () => {
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
  };

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchAndSetAddresses();
    }
  }, []);

  useEffect(() => {
    if (selectedId) {
      onSelectedAddressChange(selectedId);
    }
  }, [selectedId]);

  const handleAddressSelection = (address: Address) => {
    return () => {
      setSelectedId(address.id);
    };

  };

  const [isPopupOpen,setIsPopupOpen] = useState<boolean>(false);
  const handlePopupCancel = () => {
    //resetting the address form details
    setAddressFormDetails({});
    setIsPopupOpen(false);
  };
  const handlePrimaryAction = async () => {
    if (addressFormDetails?.contact_name && addressFormDetails?.contact_number &&
        addressFormDetails?.address && addressFormDetails?.location_name &&
        addressFormDetails?.latitude && addressFormDetails?.longitude
    ) {
      try{
        setLoading(true);
        const createAddress = await api.post("/user/address/add", addressFormDetails);
        //closing the popup
        setIsPopupOpen(false);
        setLoading(false);

        //TODO set the created address id as selected Id
        //fetching and assiging the addresses again
        fetchAndSetAddresses();
      } catch(error) {
        setLoading(false);
        //TODO error handling
      }
    } else {
      alert("Please provide all the required details");
    }
  };

  const [addressFormDetails, setAddressFormDetails] = useState<Address>();

  const handleAddressDetailsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAddressFormDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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
       <PopupModel open={isPopupOpen} onCancel={handlePopupCancel} onPrimary={handlePrimaryAction} primaryLabel="Add">
        <form className="w-full max-w-lg bg-white rounded-xl px-8 py-10 shadow-lg">
          <h2 className="text-base font-bold mb-8 text-center">Enter Address Details</h2>
          <div className="mb-3 text-sm">
            <label htmlFor="contact_name" className="block font-semibold mb-1">Contact Name *</label>
            <input
              type="text"
              id="contact_name"
              name="contact_name"
              value={addressFormDetails?.contact_name || ""}
              onChange={handleAddressDetailsChange}
              required
              className="w-full px-3 py-2 rounded-md border border-gray-300 bg-gray-50 focus:outline-none"
            />
          </div>
          <div className="mb-3 text-sm">
            <label htmlFor="contact_number" className="block font-semibold mb-1">Contact Number *</label>
            <input
              type="tel"
              id="contact_number"
              name="contact_number"
              value={addressFormDetails?.contact_number || ""}
              onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      e.target.value = value;
                      if (value.length <= 10) handleAddressDetailsChange(e);
                    }}
              required
              className="w-full px-3 py-2 rounded-md border border-gray-300 bg-gray-50 focus:outline-none"
            />
          </div>
          <div className="mb-3 text-sm">
            <label htmlFor="address" className="block font-semibold mb-1">Address *</label>
            <textarea
              id="address"
              name="address"
              value={addressFormDetails?.address || ""}
              onChange={handleAddressDetailsChange}
              required
              className="w-full px-3 py-2 rounded-md border border-gray-300 bg-gray-50 focus:outline-none"
              rows={2}
            />
          </div>
          {/* <div className="mb-5">
            <label htmlFor="address_details" className="block font-semibold mb-1">Address Details</label>
            <input
              type="text"
              id="address_details"
              name="address_details"
              value={addressFormDetails?.address_details}
              onChange={handleAddressDetailsChange}
              className="w-full px-3 py-2 rounded-md border border-gray-300 bg-gray-50 focus:outline-none"
              placeholder="Flat, Landmark, etc."
            />
          </div> */}
          <div className="mb-3 text-sm">
            <label htmlFor="location_name" className="block font-semibold mb-1">Location Name *</label>
            <input
              type="text"
              id="location_name"
              name="location_name"
              value={addressFormDetails?.location_name || ""}
              onChange={handleAddressDetailsChange}
              required
              className="w-full px-3 py-2 rounded-md border border-gray-300 bg-gray-50 focus:outline-none"
            />
          </div>
          <div className="mb-3 text-sm">
            <MapSelector onChange={(lat, lng) => setAddressFormDetails(prev => ({
              ...prev,
              latitude: lat,
              longitude: lng
            }))} />
          </div>
      </form>
       </PopupModel>
    </div>
  );
}
