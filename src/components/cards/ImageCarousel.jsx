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
      {images.map((src, index) => (
        <div
          key={index}
          className={`absolute top-0 left-0 w-full h-full transition-opacity rounded-lg overflow-hidden border-red-400 duration-1000 ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={src}
            alt={`Slide ${index + 1}`}
            layout="fill"
                  objectFit="contain"
                  className="rounded-lg p-20"
          />
          <div className="absolute bottom-0 left-0 right-0 p-4  text-white">
            <h2 className="text-2xl font-bold">{captions[index]}</h2>
            <p className="mt-2">
              Lorem ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s.
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
