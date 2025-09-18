"use client";

import React, { useState, useRef } from "react";
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
import { ListGroup, Overlay, Card } from "react-bootstrap";
import { IoIosArrowForward } from "react-icons/io";
import C_DashboardMain from "../../../../components/customer/cDashboard";
import C_VetDetails from "../../../../components/customer/cVetDetails";
import C_PetInfo from "../../../../components/customer/cPetInfo";
import C_MyAppointments from "../../../../components/customer/cMyAppointments";

export default function CustomerDashboard()  {
type BreadCrumb = {
    id: string;
    label: string;
};

const BreadCrumbsData = [
    { id: "home", label: "Home"},
    {id: "vetDetails", label: "Vet Details"},
    {id: "vetProfile", label: "Vet Profile"},
    {id: "vetAppointment", label: "Appointments"},
    {id: "petInfo", label: "Pet Details"},
    {id: "myAppointments", label: "My Appointments"}
];

const [pageType, setPageType] = useState("dashboard");
const [isOpen, setIsOpen] = useState(false);
const menuButtonRef = useRef(null);

const menuItems = [
  { icon: <FaUserFriends />, label: "My Pets" },
  { icon: <FaUserCircle />, label: "My Bio" },
  { icon: <FaLock />, label: "Privacy" },
  { icon: <FaQuestionCircle />, label: "Help" },
  { icon: <FaInfoCircle />, label: "About" },
];

const [breadCrumbs, setBreadCrumbs] = useState<BreadCrumb[]>([{id: "dashboard", label:"Home"}]);

const handlePageTypeChange = (pageType: string) => {
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

const [locationText, setLocationText] = useState("Hyderabad, TN");


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
            <span className="font-semibold text-pink-600">Dr. Mohan</span>
            <img
              src="../images/customer/defaultUserImage.png"
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
        <Overlay
        target={menuButtonRef.current}
        placement="bottom"
        show={isOpen}
        onHide={() => setIsOpen(false)}
        >
            <div className="w-90 pt-10 pr-20">
            <Card className="max-w-xs rounded-xl shadow-md p-4 bg-white">
                <ListGroup variant="flush" className="mb-4">
                    {menuItems.map(({ icon, label }) => (
                    <ListGroup.Item
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
                        
                    </ListGroup.Item>
                    ))}
                </ListGroup>
                <button
                    className="w-full h-10 bg-pink-500 hover:bg-pink-600 text-white font-medium rounded-lg"
                    onClick={() => setIsOpen(false)}>
                    Logout
                </button>
            </Card>
            </div>
        </Overlay>
      </header>
       {/* Location Bar */}
        <div className="flex items-center justify-between bg-[#d6dafc] px-6 py-2 text-sm text-gray-700 font-semibold select-none">
            <div className="flex items-center gap-1">
                {breadCrumbs.map((item, index) => {
                    const isLast = index === breadCrumbs.length - 1;
                    return (
                        <div className="flex flex-nowrap items-center">
                        {index === 0 && <span className={`${!isLast && "cursor-pointer"}`} onClick={handleBreadCrumbsClick(item)}>{item.label}</span>}
                        {index > 0 && <IoIosArrowForward />}
                        {index > 0 && <span className={`${!isLast && "cursor-pointer"}`}>{item.label}</span>}
                        </div>
                    );
                    })}
            </div>
            <div className="flex items-center gap-1 text-red-600">
            <FaMapMarkerAlt className="w-5 h-5" />
            {locationText}
            </div>
        </div>

      <main className={`${isOpen ? "blur-sm" : ""}`}>
        {pageType === "dashboard" && <C_DashboardMain onPageTypeChange = {handlePageTypeChange}/>}
        {pageType === "vetDetails" && <C_VetDetails onPageTypeChange={handlePageTypeChange}/>}
        {pageType === "petInfo" && <C_PetInfo onPageTypeChange={handlePageTypeChange}/>}
        {pageType === "myAppointments" && <C_MyAppointments onPageTypeChange={handlePageTypeChange}/>}
      </main>
    </div>
  );
};

