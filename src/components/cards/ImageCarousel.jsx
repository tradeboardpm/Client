"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const images = [
  "/images/Dashboard.png",
  "/images/Journal.png",
  "/images/Dashboard.png",
  "/images/Journal.png",
];

const captions = [
  "Welcome to Tradeboard! 👋",
  "Manage your trades efficiently",
  "Track your performance",
  "Stay on top of the market",
];

export default function ImageCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden py-8">
      <div className="relative w-full h-full">
        {images.map((src, index) => (
          <div
            key={index}
            className="absolute top-0 w-full h-full"
            style={{
              transform: `translateX(${(index - currentIndex) * 100}%)`,
              transition: "transform 0.5s ease-in-out",
            }}
          >
            <div className="relative w-full h-full">
              <Image
                src={src}
                alt={`Slide ${index + 1}`}
                layout="fill"
                objectFit="contain"
                className="rounded-lg p-20"
              />
            </div>
          </div>
        ))}

        <div
          className={`absolute bottom-0 left-0 right-0 p-4  text-white transition-opacity duration-500 `}
        >
          <h2 className="text-2xl font-bold">Welcome to Tradeboard! 👋</h2>
          <p className="mt-2">
            Lorem ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s.
          </p>
        </div>
      </div>
    </div>
  );
}
