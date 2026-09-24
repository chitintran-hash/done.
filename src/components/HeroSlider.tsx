"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const images = [
  "/images/hero-slider-1.jpg",
  "/images/hero-slider-2.jpg",
  "/images/hero-slider-3.jpg",
];

export default function HeroSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full aspect-square md:aspect-[4/3] rounded-[24px] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
      {images.map((src, index) => (
        <Image
          key={src}
          src={src}
          alt={`Cupfy hero aesthetic ${index + 1}`}
          fill
          className={`object-cover transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
          priority={index === 0}
          quality={90}
        />
      ))}

      {/* Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentIndex ? "w-8 bg-[#4A2A25]" : "w-2 bg-[#DDD8D2] hover:bg-[#6F625E]"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
