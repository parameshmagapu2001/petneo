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
  { id: 1, name: "Dog", img: "/dog.png" },
  { id: 2, name: "Cat", img: "/cat.png" },
  { id: 3, name: "Parrot", img: "/parrot.png" },
  { id: 4, name: "Hamster", img: "/hamster.png" },
  { id: 5, name: "Rabbit", img: "/rabbit.png" },
  { id: 6, name: "Turtle", img: "/turtle.png" },
  // ➝ add as many as you want here
];

export default function Section2() {
  const [showAll, setShowAll] = useState(false);

  // show only first 4 unless "See More" is clicked
  const visiblePets = showAll ? pets : pets.slice(0, 4);

  return (
    <>
      {/* Hero Section */}
     <section className="relative w-screen h-screen overflow-hidden font-[Poppins]">
  {/* Background Image (70vh) */}
  <div className="w-full h-[70vh] relative">
    <Image
      src="/images/img1.svg"
      alt="Background"
      fill
      className="object-cover"
      priority
    />

    {/* Text Content (bottom-left) */}
    <div className="absolute bottom-8 left-30 max-w-lg text-white">
      <h1 className="text-4xl md:text-5xl font-bold leading-tight">
        "Caring Hands for Happy Paws"
      </h1>
      <p className="mt-4 text-lg md:text-xl font-light">
        Expert veterinary care to keep your pets healthy and thriving.
      </p>
    </div>
  </div>

  {/* White Space (30vh) */}
  <div className="w-full h-[30vh] bg-white"></div>

  {/* Dog Image (bottom-right) */}
  <div className="absolute bottom-0 right-[10%] h-full flex items-end">
    <Image
      src="/images/cat.svg"
      alt="Dog"
      width={400}
      height={400}
      className="object-contain"
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
            src="/paw-shape.png" // 👈 Replace with your paw collage image
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
          src="/cat1.jpg"
          alt="Cat"
          width={200}
          height={200}
          className="rounded-2xl object-cover"
        />
        <Image
          src="/dog1.jpg"
          alt="Dog"
          width={200}
          height={200}
          className="rounded-2xl object-cover"
        />
        <Image
          src="/cat2.jpg"
          alt="Cat"
          width={200}
          height={200}
          className="rounded-2xl object-cover"
        />
        <Image
          src="/dog2.jpg"
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
