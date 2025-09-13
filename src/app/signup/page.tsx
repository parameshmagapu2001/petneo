"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function SignupPage() {
  const [step, setStep] = useState(1);
  const router = useRouter();

  // Step 1: Phone Verification
  const [phone, setPhone] = useState("+91 9876543210");
  const [otp, setOtp] = useState("1234");
  const [showOtp, setShowOtp] = useState(false);
  const [verified, setVerified] = useState(false);

  // Step 2: Personal Info
  const [personal, setPersonal] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "johndoe@gmail.com",
    password: "123456",
  });
  const [showPassword, setShowPassword] = useState(false);

  // Step 3: Professional Info
  const [professional, setProfessional] = useState({
    qualification: "BVSc",
    specialization: "Veterinary Surgery",
    licenseNo: "LIC12345",
    licenseAuth: "Govt Authority",
    experience: "5 Years",
    clinicName: "Neo Pet Clinic",
    location: "Hyderabad",
    certificate: null as File | null,
  });

  const mockApiOtp = "1234";

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

  const handleFinalSubmit = () => {
    const payload = { phone, personal, professional };
    console.log("Final Signup Data:", payload);
    alert("Signup successful ✅");
    router.push("/doctor");
  };

  // small reusable label + input wrapper
  const FieldLabel = ({ children }: { children: React.ReactNode }) => (
    <label className="block text-sm font-medium text-gray-700 mb-1">{children}</label>
  );

  return (
    <div className={`flex flex-col md:flex-row min-h-screen ${poppins.className}`}>
      {/* Left Section (form) */}
      <div className="flex-1 flex flex-col justify-center px-6 md:px-16 bg-white text-black">
        {/* Logo */}
        <div className="mb-6">
          {/* Replace /logo.png with your logo file */}
          <Image src="/images/logo.svg" alt="PetNeo Logo" width={140} height={50} />
        </div>

        {/* Constrain form width so placeholders/inputs are not full-screen wide */}
        <div className="w-full max-w-md">
          {/* Stepper */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-2">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`h-2 w-8 rounded-full ${step >= s ? "bg-pink-500" : "bg-gray-300"}`}
                />
              ))}
            </div>
            <div className="text-sm text-gray-500">Step {step} of 3</div>
          </div>

          {/* STEP 1 - Phone */}
          {step === 1 && (
            <section aria-label="Phone verification">
              <h2 className="text-xl font-semibold mb-1">Sign Up</h2>
              <p className="text-sm text-gray-600 mb-4">Phone verification — enter your phone number</p>

              <div className="mb-4">
                <FieldLabel>Phone Number</FieldLabel>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Enter your phone number"
                    className="flex-1 border rounded-md px-3 py-2 placeholder-gray-400"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                  <button
                    onClick={handleSendOtp}
                    className="px-3 py-2 rounded-md bg-blue-500 text-white"
                    aria-label="Send OTP"
                  >
                    Send
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <FieldLabel>OTP</FieldLabel>
                <div className="relative">
                  <input
                    type={showOtp ? "text" : "password"}
                    placeholder="Enter OTP"
                    className="w-full border rounded-md px-3 py-2 placeholder-gray-400"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowOtp(!showOtp)}
                    className="absolute right-2 top-2 text-gray-500"
                    aria-label="Toggle OTP visibility"
                  >
                    {showOtp ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {verified && (
                <div className="flex items-center text-green-600 mb-4">
                  <CheckCircle2 className="mr-2" /> Verified
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={handleVerifyOtp}
                  className="flex-1 py-2 rounded-md bg-blue-500 text-white"
                >
                  Verify & Next
                </button>
              </div>
            </section>
          )}

          {/* STEP 2 - Personal / Holder Details */}
          {step === 2 && (
            <section aria-label="Personal details">
              <h2 className="text-xl font-semibold mb-1">Holder Details</h2>
              <p className="text-sm text-gray-600 mb-4">Personal information — enter your name and contact</p>

              <div className="md:flex md:gap-4">
                <div className="md:flex-1 mb-3">
                  <FieldLabel>First Name</FieldLabel>
                  <input
                    type="text"
                    placeholder="Enter your first name"
                    className="w-full border rounded-md px-3 py-2 placeholder-gray-400"
                    value={personal.firstName}
                    onChange={(e) => setPersonal({ ...personal, firstName: e.target.value })}
                  />
                </div>

                <div className="md:flex-1 mb-3">
                  <FieldLabel>Last Name</FieldLabel>
                  <input
                    type="text"
                    placeholder="Enter your last name"
                    className="w-full border rounded-md px-3 py-2 placeholder-gray-400"
                    value={personal.lastName}
                    onChange={(e) => setPersonal({ ...personal, lastName: e.target.value })}
                  />
                </div>
              </div>

              <div className="mb-3">
                <FieldLabel>Email</FieldLabel>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full border rounded-md px-3 py-2 placeholder-gray-400"
                  value={personal.email}
                  onChange={(e) => setPersonal({ ...personal, email: e.target.value })}
                />
              </div>

              <div className="mb-4">
                <FieldLabel>Password</FieldLabel>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="w-full border rounded-md px-3 py-2 placeholder-gray-400"
                    value={personal.password}
                    onChange={(e) => setPersonal({ ...personal, password: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-2 text-gray-500"
                    aria-label="Toggle password"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="py-2 px-4 rounded-md border text-gray-700"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="ml-auto py-2 px-4 rounded-md bg-blue-500 text-white"
                >
                  Next
                </button>
              </div>
            </section>
          )}

          {/* STEP 3 - Professional Details */}
          {step === 3 && (
            <section aria-label="Professional details">
              <h2 className="text-xl font-semibold mb-1">Professional Details</h2>
              <p className="text-sm text-gray-600 mb-4">Clinic / license information — enter your professional details</p>

              <div className="mb-3">
                <FieldLabel>Qualification</FieldLabel>
                <input
                  type="text"
                  placeholder="Enter qualification (e.g., BVSc)"
                  className="w-full border rounded-md px-3 py-2 placeholder-gray-400"
                  value={professional.qualification}
                  onChange={(e) => setProfessional({ ...professional, qualification: e.target.value })}
                />
              </div>

              <div className="md:flex md:gap-4">
                <div className="md:flex-1 mb-3">
                  <FieldLabel>Specialization</FieldLabel>
                  <input
                    type="text"
                    placeholder="Enter specialization"
                    className="w-full border rounded-md px-3 py-2 placeholder-gray-400"
                    value={professional.specialization}
                    onChange={(e) => setProfessional({ ...professional, specialization: e.target.value })}
                  />
                </div>

                <div className="md:flex-1 mb-3">
                  <FieldLabel>Years of Experience</FieldLabel>
                  <input
                    type="text"
                    placeholder="Enter years of experience"
                    className="w-full border rounded-md px-3 py-2 placeholder-gray-400"
                    value={professional.experience}
                    onChange={(e) => setProfessional({ ...professional, experience: e.target.value })}
                  />
                </div>
              </div>

              <div className="mb-3">
                <FieldLabel>License Number</FieldLabel>
                <input
                  type="text"
                  placeholder="Enter license number"
                  className="w-full border rounded-md px-3 py-2 placeholder-gray-400"
                  value={professional.licenseNo}
                  onChange={(e) => setProfessional({ ...professional, licenseNo: e.target.value })}
                />
              </div>

              <div className="mb-3">
                <FieldLabel>License Issuing Authority</FieldLabel>
                <input
                  type="text"
                  placeholder="Enter issuing authority"
                  className="w-full border rounded-md px-3 py-2 placeholder-gray-400"
                  value={professional.licenseAuth}
                  onChange={(e) => setProfessional({ ...professional, licenseAuth: e.target.value })}
                />
              </div>

              <div className="mb-3">
                <FieldLabel>Clinic Name</FieldLabel>
                <input
                  type="text"
                  placeholder="Enter clinic name"
                  className="w-full border rounded-md px-3 py-2 placeholder-gray-400"
                  value={professional.clinicName}
                  onChange={(e) => setProfessional({ ...professional, clinicName: e.target.value })}
                />
              </div>

              <div className="mb-3">
                <FieldLabel>Location</FieldLabel>
                <input
                  type="text"
                  placeholder="Enter location"
                  className="w-full border rounded-md px-3 py-2 placeholder-gray-400"
                  value={professional.location}
                  onChange={(e) => setProfessional({ ...professional, location: e.target.value })}
                />
              </div>

              <div className="mb-4">
                <FieldLabel>Certificate (optional)</FieldLabel>
                <input
                  type="file"
                  className="w-full border rounded-md px-3 py-2 text-gray-500"
                  onChange={(e) =>
                    setProfessional({
                      ...professional,
                      certificate: e.target.files ? e.target.files[0] : null,
                    })
                  }
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(2)}
                  className="py-2 px-4 rounded-md border text-gray-700"
                >
                  Back
                </button>
                <button
                  onClick={handleFinalSubmit}
                  className="ml-auto py-2 px-4 rounded-md bg-pink-500 text-white"
                >
                  Submit
                </button>
              </div>
            </section>
          )}
        </div>
      </div>

      {/* Right Section (banner) */}
        <div className="hidden md:flex w-1/2 bg-blue-400 items-center justify-center px-8 md:px-12 lg:px-16 py-12 relative">
          <div className="bg-blue-300 bg-opacity-30 p-10 rounded-lg text-white text-center relative max-w-md w-full">
            <h2 className="text-2xl font-semibold mb-8">
              Welcome to PetNeo - <br /> Connecting Pets & Vets
            </h2>
            <Image
              src="/images/dog.svg"
              alt="Dog"
              width={380}
              height={380}
              className="mx-auto relative z-10"
            />
            {/* Carousel dots */}
            <div className="flex justify-center gap-2 mt-6">
              <span className="w-3 h-3 rounded-full bg-white"></span>
              <span className="w-3 h-3 rounded-full bg-white opacity-50"></span>
            </div>
          </div>
        </div>
    </div>
  );
}
