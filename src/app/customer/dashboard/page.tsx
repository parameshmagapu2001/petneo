"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  FaExclamationTriangle,
  FaBars,
  FaMapMarkerAlt
} from "react-icons/fa";
import {
  FaUserFriends,
  FaUserCircle,
  FaLock,
  FaQuestionCircle,
  FaInfoCircle,
  FaChevronRight,
} from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import C_DashboardMain from "../../../../components/customer/cDashboard";
import C_VetDetails from "../../../../components/customer/cVetDetails";
import C_PetInfo from "../../../../components/customer/cPetInfo";
import C_MyAppointments from "../../../../components/customer/cMyAppointments";
import SimpleOverlay from "../../../../components/customer/simpleOverlay";
import C_VetProfile from "../../../../components/customer/cVetProfile";
import C_VetAppointmentBooking from "../../../../components/customer/cVetAppointmentBooking";

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

export interface User {
    id: number;
    name: string;
    profile_url: string;
    location?: string;
}

export interface Pet {
    id: number;
    name: string;
    profile_url: string;
}

export enum PageType {
    DASHBOARD = "dashboard",
    VET_DETAILS = "vetDetails",
    VET_PROFILE = "vetProfile",
    VET_APPOINTMENT_BOOKING = "vet_appointment_booking",
    PET_INFO = "petInfo",
    MY_APPOINTMENTS = "myAppointments"
}

export default function CustomerDashboard()  {

    type BreadCrumb = {
        id: PageType;
        label: string;
    };

    const BreadCrumbsData = [
        { id: PageType.DASHBOARD, label: "Home"},
        {id: PageType.VET_DETAILS, label: "Vet Details"},
        {id: PageType.VET_PROFILE, label: "Vet Profile"},
        {id: PageType.VET_APPOINTMENT_BOOKING, label: "Appointments"},
        {id: PageType.PET_INFO, label: "Pet Details"},
        {id: PageType.MY_APPOINTMENTS, label: "My Appointments"}
    ];

    const [breadCrumbs, setBreadCrumbs] = useState<BreadCrumb[]>([BreadCrumbsData[0]]);

    const handlePageTypeChange = (pageType: PageType) => {
        const bcIndex = breadCrumbs.findIndex((item) => item.id === pageType);
        let breadCrumbsLocal: BreadCrumb[] = [];
            if (bcIndex >= 0) {
                breadCrumbsLocal = breadCrumbs.slice(0, bcIndex + 1);
            } else {
                const breadCrumb = BreadCrumbsData.find((item) => item.id === pageType);
                if (breadCrumb) {
                    breadCrumbs.push(breadCrumb);
                    breadCrumbsLocal = breadCrumbs;
                }
            }
            setBreadCrumbs(breadCrumbsLocal);
        setPageType(pageType);  
    };

    const [pageType, setPageType] = useState(PageType.DASHBOARD);

    const [user, setUser] = useState<User | null>(null);
    const [userPets, setUserPets] = useState<Pet[]>([]);
    useEffect(() => {
        if (pageType === PageType.DASHBOARD) {
            //TODO fetch data and assign it.
            setUser({
                id: 123,
                name: "Charan",
                profile_url: "/images/customer/defaultUserImage.png",
                location: "Hyderabad, TN"
            })
            setUserPets([
                {
                    id: 1234,
                    name: "sam",
                    profile_url: "/images/customer/petCardDefaultImage.png"

                },{
                    id: 1235,
                    name: "sam2",
                    profile_url: "/images/customer/petCardDefaultImage.png"

                }
            ])
        } 
    }, [pageType]);


    const [isOpen, setIsOpen] = useState(false);
    const menuButtonRef = useRef(null);

    const menuItems = [
        { icon: <FaUserFriends />, label: "My Pets" },
        { icon: <FaUserCircle />, label: "My Bio" },
        { icon: <FaLock />, label: "Privacy" },
        { icon: <FaQuestionCircle />, label: "Help" },
        { icon: <FaInfoCircle />, label: "About" },
    ];

    const [selectedVet, setSelectedVet] = useState<VetInterface | null>(null);

    const handleVetSelection = (vet: VetInterface) => {
        setSelectedVet(vet);
        handlePageTypeChange(PageType.VET_PROFILE);
    }


    const handleBreadCrumbsClick = (item: BreadCrumb) => {
        return () => {
            handlePageTypeChange(item.id);
        };
    };

  return (
     <div className="min-h-screen bg-[#e1e5f8] text-gray-900 font-sans">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-3 bg-white shadow">
        {/* Left: Logo only */}
        <div>
            <img src="../images/logo.svg" alt="PetNeo" className="h-10" />
        </div>

        <nav className="flex items-center space-x-4 text-sm font-semibold">
          <button
            type="button"
            className="flex items-center gap-2 bg-yellow-400 rounded-md px-4 py-2 font-semibold shadow hover:bg-yellow-500 transition"
          >
            <FaExclamationTriangle className="w-6 h-6" />
            Emergency
          </button>
          <div className="flex items-center space-x-2">
            <span>Hello,</span>
            <span className="font-semibold text-pink-600">{user?.name}</span>
            <img
              src={user?.profile_url}
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover"
            />
          </div>
          <button
            aria-label="Menu"
            className="text-2xl font-bold focus:outline-none"
            type="button"
            ref={menuButtonRef}
            onClick={() => setIsOpen(true)}
         >
            <FaBars className="w-6 h-6" />
          </button>
        </nav>
        {/* user menu popup */}
        {isOpen && <SimpleOverlay
                        targetRef={menuButtonRef}
                        placement="bottom"
                        show={isOpen}
                        offset={40}
                        offSetY={350}
                        onHide={() => {setIsOpen(false)}}
                        >
                            <div className="w-90 max-w-xs rounded-xl shadow-md p-4 bg-white">
                                <div className="mb-4">
                                    {menuItems.map(({ icon, label }) => (
                                    <div
                                        key={label}
                                        className="cursor-pointer border-0 px-0 py-2"
                                    >
                                        <div className="flex flex-row flex-nowrap items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center text-white text-lg">
                                                {icon}
                                            </div>
                                            <span className="font-semibold text-black">{label}</span>
                                            </div>
                                            <FaChevronRight className="text-gray-400" />
                                        </div> 
                                    </div>
                                    ))}
                                </div>
                                <button
                                    className="w-full h-10 bg-pink-500 hover:bg-pink-600 text-white font-medium rounded-lg"
                                    onClick={() => setIsOpen(false)}>
                                    Logout
                                </button>
                            </div>
                    </SimpleOverlay>}
        
      </header>
       {/* Location Bar */}
        <div className={`${isOpen ? "blur-sm pointer-events-none" : ""} flex items-center justify-between bg-[#d6dafc] px-6 py-2 text-sm text-gray-700 font-semibold select-none`}>
            <div className="flex items-center gap-1">
                {breadCrumbs.map((item, index) => {
                    const isLast = index === breadCrumbs.length - 1;
                    return (
                        <div key={item.id} className="flex flex-nowrap items-center">
                        {index === 0 && <span className={`${!isLast && "cursor-pointer"}`} onClick={handleBreadCrumbsClick(item)}>{item.label}</span>}
                        {index > 0 && <IoIosArrowForward />}
                        {index > 0 && <span className={`${!isLast && "cursor-pointer"}`} onClick={handleBreadCrumbsClick(item)}>{item.label}</span>}
                        </div>
                    );
                    })}
            </div>
            <div className="flex items-center gap-1 text-red-600">
            <FaMapMarkerAlt className="w-5 h-5" />
            {user?.location}
            </div>
        </div>

      <main className={`${isOpen ? "blur-sm pointer-events-none" : ""}`}>
        {pageType === PageType.DASHBOARD && <C_DashboardMain user={user} pets={userPets} onPageTypeChange = {handlePageTypeChange}/>}
        {pageType === PageType.VET_DETAILS && <C_VetDetails onVetSelection={handleVetSelection}/>}
        {pageType === PageType.VET_PROFILE && <C_VetProfile selectedVet={selectedVet} onPageTypeChange = {handlePageTypeChange}/>}
        {pageType === PageType.VET_APPOINTMENT_BOOKING && <C_VetAppointmentBooking user={user} vet={selectedVet} onPageTypeChange = {handlePageTypeChange}/>}
        {pageType === PageType.PET_INFO && <C_PetInfo onPageTypeChange={handlePageTypeChange}/>}
        {pageType === PageType.MY_APPOINTMENTS && <C_MyAppointments onPageTypeChange={handlePageTypeChange}/>}
      </main>
    </div>
  );
};

