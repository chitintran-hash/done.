"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import GiftBoxVisual, { GiftBoxStyle, GiftBoxAnimationState } from "./GiftBoxVisual";
import GiftCupViewer from "./GiftCupViewer";
import { CupColorOption, DesignLayer } from "@/components/studio/types";
import { Sparkles, RotateCcw, Compass, ArrowRight, Heart, Gift, MessageCircleHeart } from "lucide-react";

export interface GiftDataPayload {
  token?: string;
  sender_name: string;
  recipient_name: string;
  message: string;
  box_style: GiftBoxStyle;
  model_id: string;
  cup_color?: CupColorOption | null;
  lid_color?: string;
  layers: DesignLayer[];
  preview_image?: string;
  is_demo?: boolean;
}

interface GiftUnboxingExperienceProps {
  gift: GiftDataPayload;
  isPreview?: boolean;
  onClosePreview?: () => void;
}

export default function GiftUnboxingExperience({
  gift,
  isPreview = false,
  onClosePreview,
}: GiftUnboxingExperienceProps) {
  const [stage, setStage] = useState<"closed" | "unboxing" | "opened">("closed");
  const [animState, setAnimState] = useState<GiftBoxAnimationState>("idle");
  const [autoRotateCup, setAutoRotateCup] = useState(true);

  const cardRef = useRef<HTMLDivElement>(null);
  const cupViewerRef = useRef<HTMLDivElement>(null);

  // Unboxing sequence:
  // 1. Shaking (0 -> 700ms)
  // 2. Untying ribbon (700ms -> 1400ms)
  // 3. Opening lid (1400ms -> 2000ms)
  // 4. Cup & card revealed (2000ms+)
  const handleOpenGift = () => {
    if (stage !== "closed") return;
    setStage("unboxing");
    setAnimState("shaking");

    // Phase 1 -> 2: Untying ribbon
    setTimeout(() => {
      setAnimState("untying");
    }, 700);

    // Phase 2 -> 3: Lifting lid
    setTimeout(() => {
      setAnimState("opening");
    }, 1400);

    // Phase 3 -> 4: Fully open & reveal cup
    setTimeout(() => {
      setAnimState("open");
      setStage("opened");
    }, 2100);
  };

  // Replay unboxing animation
  const handleReplay = () => {
    setStage("closed");
    setAnimState("idle");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleScrollToCard = () => {
    if (cardRef.current) {
      cardRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const handleFocusCup = () => {
    if (cupViewerRef.current) {
      cupViewerRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      setAutoRotateCup(true);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#FFF9E8] via-[#FAF7F2] to-[#FFF3C4] flex flex-col justify-between py-10 px-4 sm:px-6 relative overflow-hidden">
      {/* Background Decorative Ambient Shapes */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#FFBF00]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-[#FFBF00]/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Demo Bar */}
      <div className="max-w-4xl mx-auto w-full flex items-center justify-between pb-4 border-b border-[#E8DFD8]/60">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-xl bg-[#FFBF00] flex items-center justify-center font-black text-xs text-[#3A211E] shadow-xs">
            C
          </div>
          <span className="font-heading font-black text-lg text-[#3A211E] tracking-tight">
            cupfy.
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-xs">
            <Sparkles className="w-3 h-3 text-[#FFBF00]" />
            <span>Trải nghiệm Demo</span>
          </span>

          {isPreview && onClosePreview && (
            <button
              onClick={onClosePreview}
              className="px-3.5 py-1.5 bg-[#3A211E] hover:bg-[#201817] text-white rounded-full font-bold text-xs transition-colors cursor-pointer"
            >
              Đóng xem thử
            </button>
          )}
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="max-w-4xl mx-auto w-full flex-grow flex flex-col items-center justify-center py-6 sm:py-10 z-10">
        {/* HEADER GREETING (Initial or Unboxed) */}
        <div className="text-center max-w-xl mx-auto mb-8 sm:mb-12 transition-all duration-500">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-[#E8DFD8] text-[#3A211E] text-xs font-bold shadow-xs mb-3">
            <Gift className="w-3.5 h-3.5 text-[#FFBF00]" />
            <span>Món quà bất ngờ dành riêng cho bạn</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-black text-[#171717] tracking-tight leading-tight mb-3">
            {stage === "opened" ? "Món quà đã được mở!" : "Bạn có một món quà đặc biệt!"}
          </h1>

          <p className="text-[#765B52] text-sm sm:text-base leading-relaxed">
            <strong className="text-[#3A211E] font-extrabold">{gift.sender_name}</strong>{" "}
            đã chuẩn bị một món quà dành riêng cho{" "}
            <strong className="text-[#3A211E] font-extrabold">{gift.recipient_name}</strong>.
          </p>
        </div>

        {/* ========================================================
            STAGE 1: CLOSED OR UNBOXING (Before Opening Complete)
           ======================================================== */}
        {stage !== "opened" && (
          <div className="flex flex-col items-center justify-center gap-8 w-full">
            {/* The 3D Gift Box */}
            <div className="py-6 flex items-center justify-center">
              <GiftBoxVisual
                boxStyle={gift.box_style}
                animationState={animState}
                size="lg"
              />
            </div>

            {/* Big Action Button: MỞ QUÀ NGAY */}
            {stage === "closed" ? (
              <button
                onClick={handleOpenGift}
                className="group relative px-10 py-5 bg-[#FFBF00] hover:bg-[#FFD147] text-[#3A211E] rounded-full font-heading font-black text-lg sm:text-xl shadow-[0_15px_35px_rgba(255,191,0,0.4)] hover:shadow-[0_20px_45px_rgba(255,191,0,0.5)] transition-all duration-300 hover:scale-105 active:scale-95 border-2 border-white cursor-pointer animate-bounce"
                style={{ animationDuration: "2.4s" }}
              >
                <div className="flex items-center gap-3">
                  <Gift className="w-6 h-6 text-[#3A211E] group-hover:rotate-12 transition-transform" />
                  <span>MỞ QUÀ NGAY</span>
                </div>
              </button>
            ) : (
              <div className="flex items-center gap-3 px-6 py-3 bg-white/90 rounded-full border border-[#E8DFD8] shadow-sm text-sm font-bold text-[#3A211E] animate-pulse">
                <Sparkles className="w-4 h-4 text-[#FFBF00] animate-spin" />
                <span>Đang tháo nơ và mở hộp quà...</span>
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            STAGE 2: OPENED (The Cup & The Greeting Card)
           ======================================================== */}
        {stage === "opened" && (
          <div className="w-full flex flex-col items-center gap-10 animate-in fade-in zoom-in-95 duration-700">
            {/* 3D Interactive Cup Showcase */}
            <div
              ref={cupViewerRef}
              className="w-full max-w-lg aspect-square sm:aspect-[4/3] bg-white/80 backdrop-blur-md rounded-[36px] border-2 border-white shadow-[0_20px_60px_rgba(58,33,30,0.08)] p-4 flex flex-col items-center justify-center relative overflow-hidden"
            >
              {/* Cupfy Verified Personalization Stamp */}
              <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-[#FFF9E8] border border-[#FFBF00]/40 text-[#3A211E] text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-[#FFBF00]" />
                <span>Ly thiết kế riêng</span>
              </div>

              {/* Real 3D Cup Viewer with 360 Rotation & Texture */}
              <div className="w-full h-full">
                <GiftCupViewer
                  modelId={gift.model_id}
                  cupColor={gift.cup_color}
                  lidColor={gift.lid_color}
                  layers={gift.layers}
                  previewImage={gift.preview_image}
                  autoRotate={autoRotateCup}
                />
              </div>
            </div>

            {/* THE GREETING CARD (Thiệp chúc mừng trang trọng) */}
            <div
              ref={cardRef}
              className="w-full max-w-xl bg-white rounded-[32px] p-8 sm:p-10 border-2 border-[#FFBF00] shadow-[0_20px_50px_rgba(58,33,30,0.08)] relative"
            >
              {/* Card Corner Ornament */}
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#FFBF00] text-[#3A211E] rounded-full text-xs font-black uppercase tracking-wider shadow-xs flex items-center gap-1.5">
                <MessageCircleHeart className="w-3.5 h-3.5" />
                <span>Lời nhắn gửi yêu thương</span>
              </div>

              <div className="space-y-4 pt-2">
                <div className="text-base font-extrabold text-[#3A211E]">
                  Gửi {gift.recipient_name},
                </div>

                <div className="text-[#3A211E] text-base sm:text-lg leading-relaxed whitespace-pre-line font-medium py-2 px-1 border-l-2 border-amber-200 pl-4 bg-amber-50/40 rounded-r-2xl">
                  {gift.message}
                </div>

                <div className="text-right text-base font-extrabold text-[#3A211E] pt-2">
                  Từ {gift.sender_name}
                </div>
              </div>
            </div>

            {/* 4 INTERACTION BUTTONS (Theo yêu cầu mục 7) */}
            <div className="w-full max-w-xl flex flex-wrap items-center justify-center gap-3 pt-2">
              {/* 1. Xoay xem chiếc ly */}
              <button
                onClick={handleFocusCup}
                className="px-5 py-3 rounded-2xl bg-white hover:bg-[#FFF9E8] text-[#3A211E] font-bold text-xs sm:text-sm border border-[#E8DFD8] shadow-xs hover:shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <Compass className="w-4 h-4 text-[#FFBF00]" />
                <span>Xoay xem chiếc ly</span>
              </button>

              {/* 2. Đọc lời nhắn */}
              <button
                onClick={handleScrollToCard}
                className="px-5 py-3 rounded-2xl bg-white hover:bg-[#FFF9E8] text-[#3A211E] font-bold text-xs sm:text-sm border border-[#E8DFD8] shadow-xs hover:shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <Heart className="w-4 h-4 text-rose-500" />
                <span>Đọc lời nhắn</span>
              </button>

              {/* 3. Mở quà lại */}
              <button
                onClick={handleReplay}
                className="px-5 py-3 rounded-2xl bg-white hover:bg-[#FFF9E8] text-[#3A211E] font-bold text-xs sm:text-sm border border-[#E8DFD8] shadow-xs hover:shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <RotateCcw className="w-4 h-4 text-[#765B52]" />
                <span>Mở quà lại</span>
              </button>

              {/* 4. Khám phá Cupfy */}
              <Link
                href="/products"
                className="px-6 py-3 rounded-2xl bg-[#3A211E] hover:bg-[#201817] text-white font-extrabold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 active:scale-95"
              >
                <span>Khám phá Cupfy</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* FOOTER DISCLAIMER (Theo yêu cầu mục 10) */}
      <footer className="max-w-xl mx-auto text-center pt-8 border-t border-[#E8DFD8]/60 text-xs text-[#765B52] leading-relaxed">
        <p className="font-semibold">
          Đây là trải nghiệm tặng quà trực tuyến được tạo trên Cupfy. Không bao gồm giao sản phẩm vật lý.
        </p>
        <p className="text-[11px] text-[#765B52]/70 mt-1">
          Demo phục vụ đồ án Thương mại điện tử • Không phát sinh đơn hàng hay giao dịch tài chính.
        </p>
      </footer>
    </div>
  );
}
