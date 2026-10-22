"use client";

import React from "react";

export type GiftBoxStyle = "classic" | "love" | "birthday";
export type GiftBoxAnimationState = "idle" | "shaking" | "untying" | "opening" | "open";

interface GiftBoxVisualProps {
  boxStyle: GiftBoxStyle;
  animationState?: GiftBoxAnimationState;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const BOX_THEMES = {
  classic: {
    name: "Cupfy Classic",
    sub: "Hộp vàng Cupfy với nơ nâu sang trọng",
    boxBg: "bg-gradient-to-br from-[#FFD24C] via-[#FFBF00] to-[#E6A800]",
    boxBorder: "border-[#D99B00]",
    lidBg: "bg-gradient-to-b from-[#FFE082] via-[#FFBF00] to-[#E6A800]",
    ribbonColor: "bg-[#3A211E]",
    ribbonBorder: "border-[#201311]/40",
    ribbonGlow: "shadow-[0_2px_10px_rgba(58,33,30,0.3)]",
    bowColor: "text-[#3A211E]",
    shadow: "shadow-[0_25px_50px_-12px_rgba(255,191,0,0.35)]",
    accent: "#3A211E",
  },
  love: {
    name: "Cupfy Love",
    sub: "Hộp trắng tinh khôi với nơ nâu lãng mạn",
    boxBg: "bg-gradient-to-br from-[#FFFFFF] via-[#FAF7F2] to-[#EFEAE2]",
    boxBorder: "border-[#E0D8CE]",
    lidBg: "bg-gradient-to-b from-[#FFFFFF] via-[#F7F4EE] to-[#EBE4D8]",
    ribbonColor: "bg-[#3A211E]",
    ribbonBorder: "border-[#201311]/30",
    ribbonGlow: "shadow-[0_2px_10px_rgba(58,33,30,0.2)]",
    bowColor: "text-[#3A211E]",
    shadow: "shadow-[0_25px_50px_-12px_rgba(58,33,30,0.15)]",
    accent: "#3A211E",
  },
  birthday: {
    name: "Cupfy Birthday",
    sub: "Hộp nâu chocolate với nơ vàng tiệc mừng",
    boxBg: "bg-gradient-to-br from-[#4D2E2A] via-[#3A211E] to-[#251513]",
    boxBorder: "border-[#251513]",
    lidBg: "bg-gradient-to-b from-[#55332E] via-[#3A211E] to-[#251513]",
    ribbonColor: "bg-[#FFBF00]",
    ribbonBorder: "border-[#D99B00]/40",
    ribbonGlow: "shadow-[0_2px_10px_rgba(255,191,0,0.4)]",
    bowColor: "text-[#FFBF00]",
    shadow: "shadow-[0_25px_50px_-12px_rgba(58,33,30,0.4)]",
    accent: "#FFBF00",
  },
};

export default function GiftBoxVisual({
  boxStyle = "classic",
  animationState = "idle",
  className = "",
  size = "lg",
}: GiftBoxVisualProps) {
  const theme = BOX_THEMES[boxStyle] || BOX_THEMES.classic;

  const isShaking = animationState === "shaking";
  const isUntying = animationState === "untying";
  const isOpening = animationState === "opening";
  const isOpen = animationState === "open";

  // Dimensions based on size
  const sizeClasses = {
    sm: "w-[130px] h-[130px]",
    md: "w-[190px] h-[190px]",
    lg: "w-[240px] h-[240px] sm:w-[280px] sm:h-[280px]",
  }[size];

  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      {/* 3D Box Container */}
      <div
        className={`relative ${sizeClasses} flex items-center justify-center transition-transform duration-300 ${
          isShaking ? "animate-box-wiggle" : ""
        }`}
        style={{ perspective: "1000px" }}
      >
        {/* Soft Ambient Ground Shadow */}
        <div
          className={`absolute -bottom-5 w-[85%] h-8 bg-black/20 rounded-[100%] blur-md transition-all duration-700 ${
            isOpen ? "scale-110 opacity-40" : "scale-100 opacity-60"
          }`}
        />

        {/* BOX BODY (Bottom Part) */}
        <div
          className={`absolute bottom-0 w-full h-[65%] rounded-b-[24px] rounded-t-[8px] ${theme.boxBg} border ${theme.boxBorder} ${theme.shadow} overflow-hidden transition-all duration-700`}
        >
          {/* Subtle 3D Inner Lighting Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-white/20 pointer-events-none" />

          {/* Vertical Ribbon */}
          <div
            className={`absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[22%] ${theme.ribbonColor} border-x ${theme.ribbonBorder} ${theme.ribbonGlow} transition-all duration-500 ${
              isUntying || isOpening || isOpen ? "opacity-30 scale-x-90" : "opacity-100"
            }`}
          >
            {/* Satin Sheen Line */}
            <div className="absolute inset-y-0 left-1/3 w-[2px] bg-white/30 blur-[0.5px]" />
          </div>

          {/* Horizontal Ribbon */}
          <div
            className={`absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[22%] ${theme.ribbonColor} border-y ${theme.ribbonBorder} ${theme.ribbonGlow} transition-all duration-500 ${
              isUntying || isOpening || isOpen ? "opacity-30 scale-y-90" : "opacity-100"
            }`}
          >
            <div className="absolute inset-x-0 top-1/3 h-[2px] bg-white/30 blur-[0.5px]" />
          </div>

          {/* Golden/Dark Cupfy Tag Seal */}
          <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md bg-black/10 backdrop-blur-xs text-[10px] font-black uppercase tracking-wider text-black/50">
            Cupfy
          </div>
        </div>

        {/* BOX LID (Top Part with Bow) */}
        <div
          className={`absolute top-[12%] w-[106%] h-[32%] rounded-[18px] ${theme.lidBg} border ${theme.boxBorder} shadow-lg z-20 flex items-center justify-center transition-all duration-700 ease-out origin-top-left ${
            isOpening
              ? "-translate-y-28 -rotate-12 scale-95 opacity-0 pointer-events-none"
              : isOpen
              ? "hidden"
              : "translate-y-0 rotate-0 opacity-100"
          }`}
        >
          {/* Lid Overhang Lip Shadow */}
          <div className="absolute -bottom-2 inset-x-0 h-2 bg-black/25 blur-xs rounded-b-md" />

          {/* Lid Vertical Ribbon */}
          <div
            className={`absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[22%] ${theme.ribbonColor} border-x ${theme.ribbonBorder} ${theme.ribbonGlow}`}
          >
            <div className="absolute inset-y-0 left-1/3 w-[2px] bg-white/30 blur-[0.5px]" />
          </div>

          {/* Lid Horizontal Ribbon */}
          <div
            className={`absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[50%] ${theme.ribbonColor} border-y ${theme.ribbonBorder} ${theme.ribbonGlow}`}
          >
            <div className="absolute inset-x-0 top-1/3 h-[2px] bg-white/30 blur-[0.5px]" />
          </div>

          {/* 3D LUXURY RIBBON BOW KNOT ON TOP */}
          <div
            className={`absolute -top-7 left-1/2 -translate-x-1/2 transition-all duration-500 ${
              isUntying || isOpening || isOpen
                ? "scale-125 opacity-0 -translate-y-6"
                : "scale-100 opacity-100"
            }`}
          >
            {/* SVG 3D Ribbon Bow */}
            <svg
              width="84"
              height="52"
              viewBox="0 0 84 52"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="drop-shadow-md"
            >
              {/* Left Bow Loop */}
              <path
                d="M42 26 C28 10, 6 6, 8 24 C10 40, 32 32, 42 26 Z"
                fill={theme.accent}
                stroke={theme.accent === "#FFBF00" ? "#D99B00" : "#201311"}
                strokeWidth="1.5"
              />
              <path
                d="M40 25 C30 14, 12 12, 14 24 C16 34, 32 29, 40 25 Z"
                fill="white"
                fillOpacity="0.2"
              />

              {/* Right Bow Loop */}
              <path
                d="M42 26 C56 10, 78 6, 76 24 C74 40, 52 32, 42 26 Z"
                fill={theme.accent}
                stroke={theme.accent === "#FFBF00" ? "#D99B00" : "#201311"}
                strokeWidth="1.5"
              />
              <path
                d="M44 25 C54 14, 72 12, 70 24 C68 34, 52 29, 44 25 Z"
                fill="white"
                fillOpacity="0.2"
              />

              {/* Left Ribbon Tail */}
              <path
                d="M38 28 C28 36, 18 46, 12 50 L20 44 L28 48 C32 40, 36 34, 38 28 Z"
                fill={theme.accent}
                opacity="0.95"
              />

              {/* Right Ribbon Tail */}
              <path
                d="M46 28 C56 36, 66 46, 72 50 L64 44 L56 48 C52 40, 48 34, 46 28 Z"
                fill={theme.accent}
                opacity="0.95"
              />

              {/* Center Bow Knot */}
              <ellipse
                cx="42"
                cy="26"
                rx="7.5"
                ry="6.5"
                fill={theme.accent}
                stroke={theme.accent === "#FFBF00" ? "#D99B00" : "#201311"}
                strokeWidth="1.5"
              />
              <ellipse cx="40.5" cy="24.5" rx="3.5" ry="2.5" fill="white" fillOpacity="0.35" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
