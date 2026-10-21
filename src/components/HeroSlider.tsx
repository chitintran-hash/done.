"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Sparkles, Heart } from "lucide-react";

interface SlideItem {
  id: number;
  src: string;
  alt: string;
  tag: string;
  title: string;
  description: string;
}

const SLIDES: SlideItem[] = [
  {
    id: 1,
    src: "/images/cupfy-hero-mug.jpg",
    alt: "Ly quai thủy tinh trong suốt cao cấp Cupfy",
    tag: "Thủy Tinh Trong Suốt",
    title: "Ly Quai Thủy Tinh Cao Cấp",
    description: "Chất liệu Borosilicate chịu nhiệt, độ trong suốt hoàn hảo.",
  },
  {
    id: 2,
    src: "/images/cupfy-hero-tumbler.jpg",
    alt: "Không gian sáng tạo ly tự thiết kế Cupfy",
    tag: "Custom Studio 3D",
    title: "Không Gian Sáng Tạo Ly Tự Thiết Kế",
    description: "Tùy biến chữ, hình ảnh & họa tiết theo chất riêng của bạn.",
  },
  {
    id: 3,
    src: "/images/cupfy-hero-creator.jpg",
    alt: "Khách hàng tự hào cầm trên tay chiếc ly Cupfy cá nhân hóa",
    tag: "Khoảnh Khắc Cupfy",
    title: "Chiếc Ly Độc Bản Của Riêng Bạn",
    description: "Đồng hành cùng bạn tạo nên món quà ý nghĩa và phong cách.",
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
      // Swiped left -> next
      nextSlide();
    } else if (diff < -50) {
      // Swiped right -> prev
      prevSlide();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <div
      className="relative w-full max-w-[560px] mx-auto select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Outer Card with subtle white border & glass shadow on yellow hero */}
      <div className="relative rounded-[28px] md:rounded-[36px] p-2.5 sm:p-3 bg-white/95 backdrop-blur-md shadow-[0_20px_50px_rgba(58,33,30,0.22)] border-2 border-white/90 overflow-hidden">
        
        {/* Horizontal Slider Frame */}
        <div className="relative w-full aspect-[4/3.6] sm:aspect-[4/3.2] md:aspect-[4/3] rounded-[22px] md:rounded-[28px] overflow-hidden bg-[#FFF9E8]">
          
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
                  quality={90}
                  sizes="(max-width: 768px) 100vw, 560px"
                  className="object-cover"
                />

                {/* Subtle dark gradient overlay at bottom for readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent pointer-events-none" />

                {/* Top Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-white/60 text-[11px] font-bold text-[#3A211E] shadow-sm">
                    <Sparkles className="w-3.5 h-3.5 text-[#FFBF00]" />
                    {slide.tag}
                  </span>
                </div>

                {/* Bottom Caption Info */}
                <div className="absolute bottom-9 left-4 right-4 z-10 text-white pointer-events-none">
                  <h3 className="font-bold text-base sm:text-lg leading-snug drop-shadow-sm line-clamp-1">
                    {slide.title}
                  </h3>
                  <p className="text-xs text-white/90 mt-0.5 line-clamp-1 drop-shadow-xs">
                    {slide.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows (Prev / Next) */}
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Ảnh trước"
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/90 hover:bg-white text-[#3A211E] shadow-md flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 border border-white/80"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={nextSlide}
            aria-label="Ảnh kế tiếp"
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/90 hover:bg-white text-[#3A211E] shadow-md flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 border border-white/80"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* THANH TỰ ĐỘNG TRƯỢT NGANG (Segmented Horizontal Auto-Slide Progress Bar) */}
          <div className="absolute bottom-3 left-4 right-4 z-20 flex items-center gap-2">
            {SLIDES.map((slide, idx) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => goToSlide(idx)}
                aria-label={`Chuyển đến slide ${idx + 1}`}
                className="flex-1 h-1.5 rounded-full bg-white/35 hover:bg-white/50 transition-colors overflow-hidden relative cursor-pointer group py-1 -my-1"
              >
                <div
                  className="h-1.5 rounded-full bg-[#FFBF00] shadow-sm transition-all"
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

        {/* Small subtle footer indicator underneath frame */}
        <div className="flex items-center justify-between px-3 pt-2.5 text-[11px] font-bold text-[#765B52]">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Bộ sưu tập ly thực tế Cupfy
          </span>
          <span className="font-mono text-[#3A211E]">
            0{currentIndex + 1} / 0{SLIDES.length}
          </span>
        </div>

      </div>
    </div>
  );
}
