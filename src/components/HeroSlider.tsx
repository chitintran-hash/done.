"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SlideItem {
  id: number;
  src: string;
  alt: string;
}

const SLIDES: SlideItem[] = [
  {
    id: 1,
    src: "/images/cupfy-hero-mug.jpg",
    alt: "Ly quai thủy tinh trong suốt cao cấp Cupfy",
  },
  {
    id: 2,
    src: "/images/cupfy-hero-tumbler.jpg",
    alt: "Không gian sáng tạo ly tự thiết kế Cupfy",
  },
  {
    id: 3,
    src: "/images/cupfy-hero-creator.jpg",
    alt: "Khách hàng tự hào cầm trên tay chiếc ly Cupfy cá nhân hóa",
  },
];

const SLIDE_DURATION = 4500; // 4.5 seconds per slide
const PROGRESS_STEP_MS = 50;

export default function HeroSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Touch swipe handling
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
    setProgress(0);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
    setProgress(0);
  }, []);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
    setProgress(0);
  }, []);

  // Timer for smooth horizontal auto-sliding progress bar
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const increment = (PROGRESS_STEP_MS / SLIDE_DURATION) * 100;
        if (prev + increment >= 100) {
          nextSlide();
          return 0;
        }
        return prev + increment;
      });
    }, PROGRESS_STEP_MS);

    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  // Touch swipe listeners
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 50) {
      nextSlide();
    } else if (diff < -50) {
      prevSlide();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <div
      className="relative w-full max-w-[660px] xl:max-w-[720px] mx-auto select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Khung ảnh to tràn viền, bo góc tròn lớn, không viền trắng, không chữ */}
      <div className="relative w-full aspect-[4/3.2] sm:aspect-[4/3] md:aspect-[16/11] lg:aspect-[4/3] xl:aspect-[16/11] rounded-[28px] md:rounded-[36px] overflow-hidden shadow-[0_25px_60px_rgba(58,33,30,0.25)] bg-[#FFF9E8]">
        
        {/* Horizontal Sliding Track */}
        <div
          className="flex w-full h-full transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {SLIDES.map((slide, index) => (
            <div
              key={slide.id}
              className="relative w-full h-full shrink-0 grow-0 basis-full"
            >
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                priority={index === 0}
                quality={95}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 55vw, 720px"
                className="object-cover"
              />
            </div>
          ))}
        </div>

        {/* Navigation Arrows (Prev / Next) */}
        <button
          type="button"
          onClick={prevSlide}
          aria-label="Ảnh trước"
          className="absolute left-3.5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/85 hover:bg-white text-[#3A211E] shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 backdrop-blur-md"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={nextSlide}
          aria-label="Ảnh kế tiếp"
          className="absolute right-3.5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/85 hover:bg-white text-[#3A211E] shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 backdrop-blur-md"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* THANH TỰ ĐỘNG TRƯỢT NGANG (Segmented Horizontal Progress Bar) */}
        <div className="absolute bottom-4 left-6 right-6 z-20 flex items-center gap-2.5">
          {SLIDES.map((slide, idx) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => goToSlide(idx)}
              aria-label={`Chuyển đến ảnh ${idx + 1}`}
              className="flex-1 h-2 rounded-full bg-black/25 hover:bg-black/35 backdrop-blur-sm transition-colors overflow-hidden relative cursor-pointer py-1.5 -my-1.5"
            >
              <div
                className="h-full rounded-full bg-white shadow-sm transition-all"
                style={{
                  width:
                    idx === currentIndex
                      ? `${progress}%`
                      : idx < currentIndex
                      ? "100%"
                      : "0%",
                  transitionDuration: idx === currentIndex ? "50ms" : "300ms",
                }}
              />
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}
