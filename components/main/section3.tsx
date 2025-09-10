"use client";

import Image from "next/image";
import { useRef } from "react";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";

const categories = [
  { id: 1, name: "Accessories", products: "84 products", img: "/accessories.jpg" },
  { id: 2, name: "Food", products: "64 products", img: "/food.jpg" },
  { id: 3, name: "Furniture", products: "22 products", img: "/furniture.jpg" },
  { id: 4, name: "Bags", products: "16 products", img: "/bags.jpg" },
  { id: 5, name: "Toys", products: "40 products", img: "/toys.jpg" },
    { id: 3, name: "Furniture", products: "22 products", img: "/furniture.jpg" },
  { id: 4, name: "Bags", products: "16 products", img: "/bags.jpg" },
  { id: 5, name: "Toys", products: "40 products", img: "/toys.jpg" },
];

export default function HomeSection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -300 : 300,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="w-full bg-white">
      {/* Browse By Category Section */}
      <section className="py-26 px-6 md:px-22">
        <div className="flex justify-between items-center mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Browse By Category
          </h2><br /><br />
          <div className="flex space-x-3"><br /><br />
            <button
              onClick={() => scroll("left")}
              className="w-10 h-10 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center hover:bg-pink-200 transition"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-10 h-10 rounded-full bg-pink-500 text-white flex items-center justify-center hover:bg-pink-600 transition"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scroll-smooth no-scrollbar"
        >
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="min-w-[250px] flex-shrink-0 rounded-3xl overflow-hidden shadow-xl bg-white hover:scale-105 transform transition"
            >
              <div className="w-full h-48 relative">
                <Image src={cat.img} alt={cat.name} fill className="object-cover" />
              </div>
              <div className="bg-pink-100 p-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{cat.name}</h3>
                  <p className="text-sm text-gray-600">{cat.products}</p>
                </div>
                <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-pink-600 shadow">
                  ➝
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Dog Section */}
      <section className="py-16 px-6 md:px-12 bg-gray-50">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* LEFT SIDE */}
          <div className="relative flex justify-center items-center">
            <div className="absolute -z-10 w-[90%] h-[90%] bg-pink-200 rounded-[60%] rotate-6" />
            <Image
              src="/dog.png"
              alt="Dog"
              width={450}
              height={400}
              className="relative z-10 rounded-xl shadow-lg"
            />

            <div className="absolute top-10 right-10 z-20 flex flex-col items-center">
              <button className="w-16 h-16 rounded-full bg-pink-600 flex items-center justify-center text-white shadow-lg">
                <Play size={24} />
              </button>
              <span className="text-sm text-white mt-2">Learn more</span>
            </div>

            <Image
              src="/icons/paw.svg"
              alt="Paw"
              width={50}
              height={50}
              className="absolute top-8 left-8 opacity-70"
            />
            <Image
              src="/icons/bone.svg"
              alt="Bone"
              width={40}
              height={40}
              className="absolute bottom-8 left-1/2 opacity-70"
            />
          </div>

          {/* RIGHT SIDE */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Dogs do speak, but only to those who know how to listen.
            </h2>
            <p className="text-gray-600 mb-6">
              Sweet roll ice cream powder candy canes ice cream donut pudding
              biscuit ice cream. Cupcake tootsie roll sugar plum danish pudding
              fruitcake cheesecake jelly-o. Pie muffin topping cake. Pudding
              biscuit caramels tobp.
            </p>

            <button className="bg-pink-600 text-white px-6 py-3 rounded-md shadow-lg hover:bg-pink-700 transition inline-flex items-center">
              Explore More <span className="ml-2">➝</span>
            </button>
          </div>
        </div>
      </section>

      <style jsx>{`
        /* Hide scrollbar */
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
