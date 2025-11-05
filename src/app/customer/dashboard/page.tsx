"use client";

import React, {useEffect, useRef, useState} from "react";
import {
    FaChevronRight,
    FaExclamationTriangle,
    FaInfoCircle,
    FaLock,
    FaMapMarkerAlt,
    FaQuestionCircle,
    FaUserCircle,
    FaUserFriends
} from "react-icons/fa";
import {IoIosArrowForward} from "react-icons/io";
import C_DashboardMain, {Service} from "../../../../components/customer/cDashboard";
import C_VetDetails from "../../../../components/customer/cVetDetails";
import C_PetInfo from "../../../../components/customer/cPetInfo";
import C_MyAppointments from "../../../../components/customer/cMyAppointments";
import SimpleOverlay from "../../../../components/customer/simpleOverlay";
import C_VetProfile from "../../../../components/customer/cVetProfile";
import C_VetAppointmentBooking, {VISIT_ID} from "../../../../components/customer/cVetAppointmentBooking";
import {api, clearAuth} from "@/utils/api";
import FullScreenLoader from "../../../../components/customer/fullScreenLoader";
import C_MyPets from "../../../../components/customer/cMyPets";
import {Menu, X} from "lucide-react";
import router from "next/router";
import {PageType} from "./constants";
import C_PetHistory from "../../../../components/customer/cPetHistory";

export interface DayStatus {
    day: string;
    status: string;
}

export interface Clinic {
    address: string,
    name: string,
    latitude: number,
    longitude:  number
}

export interface VetTag {
    id: number;
   name: string;
}

export interface Vet {
    id: number;
    name: string;
    experience: string;
    rating: number;
    ratingCount: number;
    availableToday: boolean;
    tags: VetTag[];
    image: string;
    weekly_schedule: DayStatus[];
    clinic: Clinic;
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
    pet_profile_picture?: string; // for some reason back is send like this in seperate call
    age?: string
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
        {id: PageType.MY_PETS, label: "My Pets"},
        {id: PageType.PET_INFO, label: "Pet Details"},
        {id: PageType.PET_HISTORY, label: "Pet History"},
        {id: PageType.MY_BIO, label: "My Bio"},
        {id: PageType.PRIVACY, label: "Privacy"},
        {id: PageType.HELP, label: "Help"},
        {id: PageType.ABOUT, label: "About"},
        {id: PageType.MY_APPOINTMENTS, label: "My Appointments"}
    ];

    const [breadCrumbs, setBreadCrumbs] = useState<BreadCrumb[]>([BreadCrumbsData[0]]);

    const handlePageTypeChange = (pageType: PageType) => {
        let breadCrumbsLocal: BreadCrumb[] = [];
        let disabled = false;
        if (pageType === PageType.MY_APPOINTMENTS) {
             breadCrumbsLocal = [{ id: PageType.DASHBOARD, label: "Home"}, {id: PageType.MY_APPOINTMENTS, label: "My Appointments"}];
        } else if (pageType === PageType.MY_PETS) {
            breadCrumbsLocal = [{ id: PageType.DASHBOARD, label: "Home"}, {id: PageType.MY_PETS, label: "My Pets"}];
        } else if (pageType === PageType.MY_BIO) {
            breadCrumbsLocal = [{ id: PageType.DASHBOARD, label: "Home"}, {id: PageType.MY_BIO, label: "My Bio"}];
            disabled = true;
        } else if (pageType === PageType.PRIVACY) {
            breadCrumbsLocal = [{ id: PageType.DASHBOARD, label: "Home"}, {id: PageType.PRIVACY, label: "Privacy"}];
            disabled = true;
        } else if (pageType === PageType.HELP) {
            breadCrumbsLocal = [{ id: PageType.DASHBOARD, label: "Home"}, {id: PageType.HELP, label: "Help"}];
            disabled = true;
        } else if (pageType === PageType.ABOUT) {
            breadCrumbsLocal = [{ id: PageType.DASHBOARD, label: "Home"}, {id: PageType.ABOUT, label: "About"}];
            disabled = true;
        } else {
            const bcIndex = breadCrumbs.findIndex((item) => item.id === pageType);
            if (bcIndex >= 0) {
                breadCrumbsLocal = breadCrumbs.slice(0, bcIndex + 1);
            } else {
                const breadCrumb = BreadCrumbsData.find((item) => item.id === pageType);
                if (breadCrumb) {
                    breadCrumbs.push(breadCrumb);
                    breadCrumbsLocal = breadCrumbs;
                }
            }
        }
        
        if (!disabled){
            setBreadCrumbs(breadCrumbsLocal);
            setPageType(pageType);  
        }  
    };

    const [pageType, setPageType] = useState(PageType.DASHBOARD);

    const [user, setUser] = useState<User | null>(null);
    const [userPets, setUserPets] = useState<Pet[]>([]);


    const [isOpen, setIsOpen] = useState<boolean>(false);
    const menuButtonRef = useRef(null);

    const menuItems = [
        { icon: <FaUserFriends />, label: "My Pets", id: PageType.MY_PETS },
        { icon: <FaUserCircle />, label: "My Bio", id: PageType.MY_BIO },
        { icon: <FaLock />, label: "Privacy", id: PageType.PRIVACY },
        { icon: <FaQuestionCircle />, label: "Help", id: PageType.HELP },
        { icon: <FaInfoCircle />, label: "About", id: PageType.ABOUT },
    ];

    const [selectedVet, setSelectedVet] = useState<Vet | null>(null);

    const handleVetSelection = (vet: Vet) => {
        setSelectedVet(vet);
        handlePageTypeChange(PageType.VET_PROFILE);
    }


    const handleBreadCrumbsClick = (item: BreadCrumb) => {
        return () => {
            handlePageTypeChange(item.id);
        };
    };
    const [serviceBackendData, SetServiceBackendData] = useState<any[]>([]);

    const hasFetched = useRef(false);
    const [loading, setLoading] = useState<boolean>(true);
     useEffect(() => {
        if (pageType === PageType.DASHBOARD) {
            if (!hasFetched.current) {
                hasFetched.current = true;
                const userHomeFetch = api.get("/user/home");
                const servicesDataFetch = api.get("/services");
                Promise.all([userHomeFetch, servicesDataFetch]).then(([res1, res2]) => {
                    if (Array.isArray(res2)) {
                        SetServiceBackendData(res2);
                    }
                    //setting the user data
                    setUser({
                        id: res1?.user?.id,
                        name: res1?.user.name,
                        profile_url: res1?.user?.profile_url,
                        location: res1?.user?.location ? res1.user.location : "Hyderabad, TN"
                    })
                    const pets: Pet[] = [];
                    res1?.pets?.forEach((pet: Pet) => {
                        pets.push(pet)
                    })
                    setUserPets(pets);
                    hasFetched.current = false;
                    setLoading(false);
                }).catch((error) => {
                    setLoading(false);
                    //TODO handle error cases
                    if (error?.message.includes("403")) {
                        handleLogOut();
                    }
                })
            }         
        }
         
    }, [pageType]);

    function handleMenuClick(menuItem: { icon: React.JSX.Element; label: string; id: PageType; }): void {
        setIsOpen(false);
        handlePageTypeChange(menuItem.id);
    }

    function handleLogOut(): void {
        setIsOpen(false);
        clearAuth();
        if (typeof window !== "undefined") window.location.href = "/customer/login";
        else router.push("/customer/login")
    }

    const [selectedPetId, setSelectedPetId] = useState<number>(-1);

    function viewPetDetails(petId: number): void {
        setSelectedPetId(petId);
        handlePageTypeChange(PageType.PET_INFO);
    }
    const viewPetHistory = (petId: number): void => {
        setSelectedPetId(petId);
        handlePageTypeChange(PageType.PET_HISTORY);
    };

    const [selectedServiceVisitType, setSelectedServiceVisitType] = useState<VISIT_ID | null>(null);
    const [selectedServiceId, SetSelectedServiceId] = useState<string | null>(null);
    const handleServiceSelection = (service: Service): void => {
        setSelectedServiceVisitType(service.visit_type || null);
        SetSelectedServiceId(serviceBackendData?.find((item) => item.name === service.serviceName)?.id);
    }

  return (
     <div className="min-h-screen bg-[#e1e5f8] text-gray-900 font-sans">
         <div className="sticky top-0 z-50">
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
                         className="text-2xl transition font-bold focus:outline-none"
                         type="button"
                         ref={menuButtonRef}
                         onClick={() => setIsOpen(!isOpen)}
                     >
                         {isOpen ? <X size={28} /> : <Menu size={28} />}
                     </button>
                 </nav>
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
         </div>
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
                     {menuItems.map((menuItem) => (
                         <div
                             key={menuItem.id}
                             className="cursor-pointer border-0 px-0 py-2"
                             onClick={() => handleMenuClick(menuItem)}
                         >
                             <div className="flex flex-row flex-nowrap items-center justify-between">
                                 <div className="flex items-center space-x-3">
                                     <div className="w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center text-white text-lg">
                                         {menuItem.icon}
                                     </div>
                                     <span className="font-semibold text-black">{menuItem.label}</span>
                                 </div>
                                 <FaChevronRight className="text-gray-400" />
                             </div>
                         </div>
                     ))}
                 </div>
                 <button
                     className="w-full h-10 bg-pink-500 hover:bg-pink-600 text-white font-medium rounded-lg"
                     onClick={handleLogOut}>
                     Logout
                 </button>
             </div>
         </SimpleOverlay>}


      <main className={`${isOpen ? "blur-sm pointer-events-none" : ""} overflow-auto`}>
        {pageType === PageType.DASHBOARD && <C_DashboardMain user={user} pets={userPets} onViewPetDetails={viewPetDetails} onPageTypeChange = {handlePageTypeChange} onServiceSelection={handleServiceSelection}/>}
        {pageType === PageType.VET_DETAILS && <C_VetDetails onVetSelection={handleVetSelection}
                                                            selectedServiceVisitType={selectedServiceVisitType}
                                                            selectedServiceId={selectedServiceId}/>}
        {pageType === PageType.VET_PROFILE && <C_VetProfile selectedVet={selectedVet} onPageTypeChange = {handlePageTypeChange}/>}
        {pageType === PageType.VET_APPOINTMENT_BOOKING && <C_VetAppointmentBooking user={user} vet={selectedVet}
                                                                                   userPets={userPets}
                                                                                   onPageTypeChange={handlePageTypeChange}
                                                                                   selectedServiceVisitType={selectedServiceVisitType}
                                                                                   selectedServiceId={selectedServiceId}/>}
        {pageType === PageType.MY_PETS && <C_MyPets onViewPetDetails={viewPetDetails} onViewPetHistory={viewPetHistory}/>}
        {pageType === PageType.PET_INFO && <C_PetInfo petId={selectedPetId}/>}
        {pageType === PageType.PET_HISTORY && <C_PetHistory petId={selectedPetId}/>}
        {pageType === PageType.MY_APPOINTMENTS && <C_MyAppointments onPageTypeChange={handlePageTypeChange}/>}
      </main>

      <FullScreenLoader loading={loading}/>
    </div>
  );
};

