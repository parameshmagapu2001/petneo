"use client";

import React, {useEffect, useRef, useState} from "react";
import {api, clearAuth} from "@/utils/api";
import {FaCamera, FaPen} from "react-icons/fa";
import FullScreenLoader from "./fullScreenLoader";
import ConfirmationPopup from "./ConfirmationPopup";
import router from "next/router";

interface UserBio {
    id?: number;
    first_name?: string;
    last_name?: string;
    email?: string;
    phone_number?: string;
    profile_picture_file?: File | null; //Extra param for creating/updating the user bio
    profile_picture_url?: string;
}

export default function C_MyBio() {

    const [userBio, setUserBio] = useState<UserBio | null>(null);

    const hasFetched = useRef(false);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if (!hasFetched.current) {
            hasFetched.current = true;

            const myBioResponse = api.get(`/user/profile`);

            Promise.all([myBioResponse]).then(([res1]) => {
                if (res1?.id) {
                    //setting the user Bio details object
                    setUserBio(res1);
                }
                setLoading(false);
            }).catch(() => {
                setLoading(false);
                //TODO error handling.
            });
        }
    }, []);

    const profileImageInputRef = useRef<HTMLInputElement | null>(null);
    const handleEditPhotoClick = () => {
        profileImageInputRef.current?.click();
    };
    const handleProfileImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Preview image
        const previewUrl = URL.createObjectURL(file);
        setUserBio({...userBio,  profile_picture_url: previewUrl, profile_picture_file: file});
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setUserBio({...userBio,  [e.target.name]: e.target.value});
    };

    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const onEdit = (): void => {
        setIsEditMode(true);
    };
    const onSave = async (): Promise<void> => {
        //constructing the payload
        const formData = new FormData();
        if (userBio?.first_name &&
            userBio?.email
        ) {
            formData.append("first_name", userBio.first_name);
            formData.append("email", userBio.email);
        } else {
            alert("Provide the necessary details");
            return;
        }

        if (userBio.last_name) {
            formData.append("last_name", userBio.last_name);
        }

        if (userBio.profile_picture_file) {
            formData.append("profile_picture", userBio.profile_picture_file);
        }

        setLoading(true);

        //editing an existing pet
        const editPetResponse = await api.formDataPut(`/user/updateProfile`, formData);
        if (editPetResponse?.success) {
            setLoading(false);
        } else {
            //TODO handle error scenario
            setLoading(false);
        }

        //setting the editmode false
        setIsEditMode(false);
    };

    const [isConfirmationPopupOpen, setIsConfirmationPopupOpen] = useState<boolean>(false);
    const onDelete = () => {
        //open the confirmation popup
        setIsConfirmationPopupOpen(true);
    };

    const handleConfirmationPopupConfirm = async () => {
        try {
            //open the loader
            setLoading(true);

            //delete api call
            await api.delete(`/user/deleteAccount`);

            //close the loader
            setLoading(false);

            //closer the confirmation popup
            setIsConfirmationPopupOpen(false);

            //need to clear the auth details and redirect back to login page.
            clearAuth();
            if (typeof window !== "undefined") window.location.href = "/customer/login";
            else router.push("/customer/login")
        } catch(e) {
            setLoading(false);
            //TODO error handling
        }
    }

    const handleConfirmationPopupCancel = () => {
        //closer the confirmation popup
        setIsConfirmationPopupOpen(false);
    }

    return (
        <>
            <div className="bg-[#eaeaff] min-h-screen flex flex-col items-center pt-8">
                <form className="w-full max-w-md bg-transparent rounded-lg p-4">
                    {/* User Photo */}
                    <div className="mb-4 relative flex items-center justify-center">
                        <div id="photo" className="relative w-25 h-25 rounded-full border bg-white border-gray-300 flex items-center justify-center overflow-hidden">
                            {userBio?.profile_picture_url ?
                                <img
                                    src={userBio.profile_picture_url}
                                    alt="user"
                                    className="w-full h-full object-cover"
                                /> :
                                <FaCamera className="text-gray-400 text-xl w-18 h-18 object-cover rounded-md bg-white" />}

                            {isEditMode &&
                                <>
                                    {/* Edit (pencil) icon */}
                                    <button
                                        type="button"
                                        onClick={handleEditPhotoClick}
                                        className="absolute bottom-2 right-2 bg-pink-500 text-white p-2 rounded-full shadow-md hover:bg-pink-600"
                                    >
                                        <FaPen size={12} />
                                    </button>

                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        ref={profileImageInputRef}
                                        onChange={handleProfileImageFileChange}
                                    />
                                </>}
                        </div>
                    </div>
                    {/* User First and Last Name */}
                    <div className="mb-4 relative flex flex-row flex-nowrap justify-between">
                        {/* User First Name */}
                        <div className="w-[48%]">
                            <label className="block font-semibold mb-1" htmlFor="userFirstName">First Name</label>
                            <input
                                type="text"
                                id="userFirstName"
                                name="first_name"
                                value={userBio?.first_name || ""}
                                onChange={handleChange}
                                className="w-full px-3 py-2 rounded-md bg-white focus:outline-none"
                                disabled={!isEditMode}
                            />
                        </div>
                        {/* User Last Name */}
                        <div className="w-[48%]">
                            <label className="block font-semibold mb-1" htmlFor="userLastName">Last Name</label>
                            <input
                                type="text"
                                id="userLastName"
                                name="last_name"
                                value={userBio?.last_name || ""}
                                onChange={handleChange}
                                className="w-full px-3 py-2 rounded-md bg-white focus:outline-none"
                                disabled={!isEditMode}
                            />
                        </div>
                    </div>
                    {/* User Email */}
                    <div className="mb-4 relative ">
                        <label className="block font-semibold mb-1" htmlFor="userEmail">Email</label>
                        <input
                            type="email"
                            id="userEmail"
                            name="email"
                            value={userBio?.email || ""}
                            onChange={handleChange}
                            className="w-full px-3 py-2 rounded-md bg-white focus:outline-none"
                            disabled={!isEditMode}
                        />
                    </div>
                    {/* Mobile Number */}
                    <div className="mb-4 relative">
                        <label className="block font-semibold mb-1" htmlFor="mobileNumber">Mobile number</label>
                        <input
                            type="text"
                            id="mobileNumber"
                            name="phone_number"
                            value={userBio?.phone_number || ""}
                            placeholder="Enter your 10-digit phone number"
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, "");
                                if (value.length <= 10) handleChange(e);
                            }}
                            className="w-full px-3 py-2 rounded-md bg-white focus:outline-none"
                            maxLength={10}
                            disabled
                        />
                    </div>
                    {isEditMode ?
                        <button type="button" className="w-full bg-[#d14d91] hover:bg-[#bc3575] text-white font-bold py-3 rounded-full mt-6 transition-colors duration-300" onClick={onSave}>
                            Save
                        </button> :
                        <div className="flex flex-row justify-between">
                            <button type="button" className="w-[40%] bg-[#d14d91] hover:bg-[#bc3575] text-white font-bold py-3 rounded-full mt-6 transition-colors duration-300" onClick={onEdit}>
                                Edit
                            </button>
                            <button type="button" className="w-[40%] bg-[#d14d91] hover:bg-[#bc3575] text-white font-bold py-3 rounded-full mt-6 transition-colors duration-300" onClick={onDelete}>
                                Delete
                            </button>
                        </div>
                    }
                </form>

                <FullScreenLoader loading={loading}/>
            </div>
            {/* Confirmation Popup */}
            <ConfirmationPopup
                isOpen={isConfirmationPopupOpen}
                message="Are you sure you want to delete the account? This action cannot be undone."
                onConfirm={handleConfirmationPopupConfirm}
                onCancel={handleConfirmationPopupCancel}
                confirmText="Yes, Delete"
                cancelText="No, Cancel"
                confirmButtonColor="bg-pink-500 hover:bg-pink-600"
            />
        </>
    )
}