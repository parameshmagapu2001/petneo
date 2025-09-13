"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // ✅ import router
import Image from "next/image";
import { Eye, EyeOff, CheckCircle2 } from "lucide-react";

export default function SignupPage() {
  const [step, setStep] = useState(1);
  const router = useRouter(); // ✅ init router

  // Step 1: Phone Verification
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [verified, setVerified] = useState(false);

  // Step 2: Personal Info
  const [personal, setPersonal] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  // Step 3: Professional Info
  const [professional, setProfessional] = useState({
    qualification: "",
    specialization: "",
    licenseNo: "",
    licenseAuth: "",
    experience: "",
    clinicName: "",
    location: "",
    certificate: null as File | null,
  });

  const mockApiOtp = "1234"; // mock API OTP

  // Handle OTP
  const handleSendOtp = () => {
    alert(`Mock OTP sent: ${mockApiOtp}`);
  };

  const handleVerifyOtp = () => {
    if (otp === mockApiOtp) {
      setVerified(true);
      setStep(2);
    } else {
      alert("Invalid OTP");
    }
  };

  // Handle Submit
  const handleFinalSubmit = () => {
    const payload = {
      phone,
      personal,
      professional,
    };
    console.log("Final Signup Data:", payload);

    // ✅ mock success → redirect to login
    alert("Signup successful ✅");
    router.push("/login"); // redirect to login page
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Section */}
      <div className="flex-1 flex flex-col justify-center px-16 bg-white">
        {/* Logo */}
        <h1 className="text-3xl font-bold text-[#5f27cd] mb-8">
          Pet<span className="text-pink-500">neo</span>
        </h1>

        {/* Stepper / Pagination */}
        <div className="flex gap-2 mb-6">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-2 w-8 rounded-full ${
                step >= s ? "bg-pink-500" : "bg-gray-300"
              }`}
            ></div>
          ))}
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <div>
            <h2 className="text-xl font-semibold mb-6">Sign Up</h2>
            <div className="flex items-center mb-4">
              <input
                type="text"
                placeholder="+91 123456789"
                className="w-full border rounded-md px-3 py-2"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <button
                onClick={handleSendOtp}
                className="ml-2 px-3 py-2 rounded-md bg-blue-500 text-white"
              >
                →
              </button>
            </div>
            <div className="relative mb-4">
              <input
                type={showOtp ? "text" : "password"}
                placeholder="Enter OTP"
                className="w-full border rounded-md px-3 py-2"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowOtp(!showOtp)}
                className="absolute right-2 top-2 text-gray-500"
              >
                {showOtp ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {verified && (
              <div className="flex items-center text-green-600 mb-4">
                <CheckCircle2 className="mr-2" /> Verified
              </div>
            )}
            <button
              onClick={handleVerifyOtp}
              className="w-full py-2 rounded-md bg-blue-500 text-white"
            >
              Verify & Next
            </button>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div>
            <h2 className="text-xl font-semibold mb-6">
              Add your Personal Details
            </h2>
            <input
              type="text"
              placeholder="First Name"
              className="w-full border rounded-md px-3 py-2 mb-3"
              value={personal.firstName}
              onChange={(e) =>
                setPersonal({ ...personal, firstName: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Last Name"
              className="w-full border rounded-md px-3 py-2 mb-3"
              value={personal.lastName}
              onChange={(e) =>
                setPersonal({ ...personal, lastName: e.target.value })
              }
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full border rounded-md px-3 py-2 mb-3"
              value={personal.email}
              onChange={(e) =>
                setPersonal({ ...personal, email: e.target.value })
              }
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full border rounded-md px-3 py-2 mb-3"
              value={personal.password}
              onChange={(e) =>
                setPersonal({ ...personal, password: e.target.value })
              }
            />
            <button
              onClick={() => setStep(3)}
              className="w-full py-2 rounded-md bg-blue-500 text-white"
            >
              Next
            </button>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div>
            <h2 className="text-xl font-semibold mb-6">Our Services</h2>
            <input
              type="text"
              placeholder="Qualification"
              className="w-full border rounded-md px-3 py-2 mb-3"
              value={professional.qualification}
              onChange={(e) =>
                setProfessional({ ...professional, qualification: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Specialization"
              className="w-full border rounded-md px-3 py-2 mb-3"
              value={professional.specialization}
              onChange={(e) =>
                setProfessional({ ...professional, specialization: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="License Number"
              className="w-full border rounded-md px-3 py-2 mb-3"
              value={professional.licenseNo}
              onChange={(e) =>
                setProfessional({ ...professional, licenseNo: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="License Issuing Authority"
              className="w-full border rounded-md px-3 py-2 mb-3"
              value={professional.licenseAuth}
              onChange={(e) =>
                setProfessional({ ...professional, licenseAuth: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Years of Experience"
              className="w-full border rounded-md px-3 py-2 mb-3"
              value={professional.experience}
              onChange={(e) =>
                setProfessional({ ...professional, experience: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Clinic Name"
              className="w-full border rounded-md px-3 py-2 mb-3"
              value={professional.clinicName}
              onChange={(e) =>
                setProfessional({ ...professional, clinicName: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Location"
              className="w-full border rounded-md px-3 py-2 mb-3"
              value={professional.location}
              onChange={(e) =>
                setProfessional({ ...professional, location: e.target.value })
              }
            />
            <input
              type="file"
              className="w-full border rounded-md px-3 py-2 mb-3"
              onChange={(e) =>
                setProfessional({
                  ...professional,
                  certificate: e.target.files ? e.target.files[0] : null,
                })
              }
            />
            <button
              onClick={handleFinalSubmit}
              className="w-full py-2 rounded-md bg-pink-500 text-white"
            >
              Submit
            </button>
          </div>
        )}
      </div>

      {/* Right Section */}
      <div className="flex-1 bg-blue-200 flex justify-center items-center relative rounded-l-3xl">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">
            Welcome to PetNeo - <br /> Connecting Pets & Vets
          </h1>
          <Image
            src="/dog.png"
            alt="Dog"
            width={300}
            height={300}
            className="mx-auto"
          />
        </div>
      </div>
    </div>
  );
}
