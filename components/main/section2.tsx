"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Poppins, Lato } from "next/font/google";

// ✅ Load Poppins only for this component
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // you can choose weights
});

// ✅ Load Lato (for headings)
const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700"], // <-- valid weights for Lato
});

const pets = [
  { id: 1, name: "Dog", img: "/images/dog1.svg" },
  { id: 2, name: "Cat", img: "/images/cat1.svg" },
  { id: 3, name: "Parrot", img: "/images/parrot.svg" },
  { id: 4, name: "Hamster", img: "/images/hamster.svg" },
  { id: 5, name: "Dog", img: "/images/dog1.svg" },
  { id: 6, name: "Cat", img: "/images/cat1.svg" },
  // ➝ add as many as you want here
];

export default function Section2() {
  const [showAll, setShowAll] = useState(false);

  // show only first 4 unless "See More" is clicked
  const visiblePets = showAll ? pets : pets.slice(0, 4);

  return (
    <>
      {/* Hero Section */}
    {/* Hero Section */}
<section className="relative w-full overflow-hidden font-[Poppins]">
  {/* Background Image (60vh on desktop, 50vh on mobile) */}
  <div className="w-full h-[60vh] md:h-[70vh] lg:h-[70vh] relative">
    <Image
      src="/images/frame1.svg"
      alt="Background"
      fill
      className="object-cover"
      priority
    />

    {/* Text Content */}
    <div className="absolute bottom-12 left-6 md:bottom-19 md:left-18 max-w-sm md:max-w-xl text-white">
      <h1 className="text-3xl md:text-5xl font-bold leading-tight">
        "Caring Hands for Happy Paws"
      </h1>
      <p className="mt-3 text-base md:text-xl font-light">
        Expert veterinary care to keep your pets healthy and thriving.
      </p>
    </div>
  </div>

  {/* White Space */}
  <div className="w-full h-[20vh] bg-white"></div>

  {/* Dog Image */}
  <div className="absolute bottom-10 right-[5%] md:right-[10%] flex items-end">
    <Image
      src="/images/dog.svg"
      alt="Dog"
      width={250}
      height={250}
      className="object-contain md:w-[400px] md:h-[400px]"
      priority
    />
  </div>
</section>



      {/* Pets Section */}
<section className="w-full py-6 bg-white flex flex-col justify-center items-center">
        <h2 className="text-3xl md:text-5xl font-poppins font-semibold text-pink-400 text-center mb-10">
          Who are you treating today?
        </h2>
{/* Pets Grid */}
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6 max-w-5xl w-full px-6">
  {visiblePets.map((pet, index) => (
    <div
      key={pet.id}
      className={`relative flex flex-col justify-center items-center bg-pink-100 rounded-2xl px-6 py-4 
        ${index % 2 === 0 ? "mt-0" : "mt-10"} w-full h-[220px]`} // wider + shorter
    >
      <Image
        src={pet.img}
        alt={pet.name}
        width={200}   // 👈 reduce image height
        height={150}
        className="object-contain"
      />
      <button className="absolute top-4 right-4 bg-white text-pink-500 font-semibold px-4 py-1 rounded-full shadow">
        View
      </button>
    </div>
  ))}
</div><br />


        {/* See More / See Less */}
        {pets.length > 4 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="mt-8 text-pink-500 font-semibold"
          >
            {showAll ? "View Less" : "View All Pets"}
          </button>
        )}
      </section>


       <section className="relative w-full bg-blue-800 overflow-hidden py-3">
      <motion.div
        className="flex whitespace-nowrap"
        animate={{ x: ["0%", "-100%"] }}
        transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
      >
        {/* Repeat content twice for seamless loop */}
        <div className="flex space-x-8 text-white font-medium text-lg px-6">
          <span>Get 30% OFF on First Order</span>
          <span className="text-2xl">✚</span>
          <span>Get 30% OFF on First Order</span>
          <span className="text-2xl">✚</span>
          <span>Get 30% OFF on First Order</span>
          <span className="text-2xl">✚</span>
          <span>Get 30% OFF on First Order</span>
        </div>
        <div className="flex space-x-8 text-white font-medium text-lg px-6">
          <span>Get 30% OFF on First Order</span>
          <span className="text-2xl">✚</span>
          <span>Get 30% OFF on First Order</span>
          <span className="text-2xl">✚</span>
          <span>Get 30% OFF on First Order</span>
          <span className="text-2xl">✚</span>
          <span>Get 30% OFF on First Order</span>
        </div>
      </motion.div>
    </section>

     <section
      className={`${poppins.className} relative w-full bg-white flex flex-col items-center py-16`}
    >
      {/* Heading */}
      <h2
        className={`${lato.className} text-3xl md:text-5xl font-bold text-gray-900 text-center`}
      >
        YOUR PET WELL BEING
      </h2>
      <p className="text-gray-600 text-center mt-2 mb-12">
        A companion for your pet’s happiness
      </p>

      {/* Content Layout */}
      <div className="relative w-full max-w-6xl flex flex-col md:flex-row items-center justify-center">
        {/* Left Text */}
        <div className="md:w-1/4 text-center md:text-left px-6 mb-10 md:mb-0">
          <p className="text-sm md:text-base text-gray-800 leading-relaxed">
            <span className="font-semibold">Premium Care:</span> <br />
            Pamper your pet with high-quality food, toys, and accessories for a
            healthier, happier life.
          </p>
        </div>

        {/* Center Paw Image */}
        <div className="relative md:w-2/4 flex justify-center items-center">
          <Image
            src="/images/paw.svg" // 👈 Replace with your paw collage image
            alt="Paw Shape"
            width={500}
            height={500}
            className="object-contain"
            priority
          />
        </div>

        {/* Right Text */}
        <div className="md:w-1/4 text-center md:text-right px-6 mt-10 md:mt-0">
          <p className="text-sm md:text-base text-gray-800 leading-relaxed">
            The first order is free: <br />
            Try our top-rated products at no cost.
          </p>
        </div>
      </div>

      {/* Bottom Images Row */}
      <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 px-6">
        <Image
          src="/images/cats1.svg"
          alt="Cat"
          width={200}
          height={200}
          className="rounded-2xl object-cover"
        />
        <Image
          src="/images/cats2.svg"
          alt="Dog"
          width={200}
          height={200}
          className="rounded-2xl object-cover"
        />
        <Image
          src="/images/cats3.svg"
          alt="Cat"
          width={200}
          height={200}
          className="rounded-2xl object-cover"
        />
        <Image
          src="/images/cats4.svg"
          alt="Dog"
          width={200}
          height={200}
          className="rounded-2xl object-cover"
        />
      </div>

      {/* Button */}
      <button className="mt-12 bg-pink-500 text-white px-8 py-3 rounded-full shadow hover:bg-pink-600 transition">
        EXPLORE MORE
      </button>
    </section>
    </>
  );
}
