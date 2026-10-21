"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { Sparkles, SlidersHorizontal } from "lucide-react";
import { useLanguageStore } from "@/store/useLanguageStore";
import TemplateCardActions from "@/components/TemplateCardActions";

export interface TemplateItem {
  id: string;
  name: string;
  image_url?: string | null;
  technical_specs?: {
    vibe?: string;
    card_bg?: string;
    icon?: string;
    [key: string]: any;
  } | null;
}

interface TemplatesClientProps {
  initialTemplates: TemplateItem[];
}

export default function TemplatesClient({ initialTemplates }: TemplatesClientProps) {
  const language = useLanguageStore((state) => state.language);
  const isEn = language === "en";

  const [selectedVibe, setSelectedVibe] = useState<string>("all");

  // Extract unique vibes
  const availableVibes = useMemo(() => {
    const vibes = new Set<string>();
    initialTemplates.forEach((t) => {
      if (t.technical_specs?.vibe) {
        vibes.add(t.technical_specs.vibe);
      }
    });
    return Array.from(vibes);
  }, [initialTemplates]);

  // Filter templates
  const filteredTemplates = useMemo(() => {
    if (selectedVibe === "all") return initialTemplates;
    return initialTemplates.filter(
      (t) => (t.technical_specs?.vibe || "").toLowerCase() === selectedVibe.toLowerCase()
    );
  }, [initialTemplates, selectedVibe]);

  return (
    <div className="w-full">
      {/* Vibe Filter Tabs */}
      <div className="flex items-center justify-center flex-wrap gap-2 sm:gap-3 mb-10 sm:mb-12">
        <button
          onClick={() => setSelectedVibe("all")}
          className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-extrabold transition-all duration-200 cursor-pointer ${
            selectedVibe === "all"
              ? "bg-[#3A211E] text-white shadow-md scale-105"
              : "bg-white text-[#765B52] hover:bg-[#FAF7F2] border border-[#E8DFD8]"
          }`}
        >
          {isEn ? "All Vibes" : "Tất cả mẫu"} ({initialTemplates.length})
        </button>

        {availableVibes.map((vibe) => {
          const count = initialTemplates.filter(
            (t) => (t.technical_specs?.vibe || "").toLowerCase() === vibe.toLowerCase()
          ).length;

          return (
            <button
              key={vibe}
              onClick={() => setSelectedVibe(vibe)}
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-extrabold transition-all duration-200 cursor-pointer ${
                selectedVibe.toLowerCase() === vibe.toLowerCase()
                  ? "bg-[#FFBF00] text-[#3A211E] shadow-md scale-105 font-black"
                  : "bg-white text-[#765B52] hover:bg-[#FAF7F2] border border-[#E8DFD8]"
              }`}
            >
              {vibe} ({count})
            </button>
          );
        })}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {filteredTemplates.map((tmpl) => {
          const cardBg = tmpl.technical_specs?.card_bg || "#FCE7F3";
          const vibe = tmpl.technical_specs?.vibe || "Cute";
          const icon = tmpl.technical_specs?.icon || "🐱";

          return (
            <div
              key={tmpl.id}
              className="bg-white rounded-[28px] p-3.5 sm:p-4 border border-[#EBE3DC] shadow-[0_4px_25px_rgba(58,33,30,0.04)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group"
            >
              {/* Colored Top Container */}
              <div
                className="w-full h-[220px] sm:h-[240px] rounded-[22px] flex items-center justify-center relative overflow-hidden transition-transform duration-300 group-hover:scale-[1.01]"
                style={{ backgroundColor: cardBg }}
              >
                {/* Floating White Card */}
                <div className="w-[120px] h-[160px] sm:w-[130px] sm:h-[170px] rounded-[22px] bg-white/95 shadow-[0_12px_28px_rgba(0,0,0,0.07)] border border-white/60 flex items-center justify-center p-3 select-none transition-transform duration-300 group-hover:scale-105">
                  {tmpl.image_url && !tmpl.technical_specs?.icon ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={tmpl.image_url}
                        alt={tmpl.name}
                        fill
                        className="object-contain"
                        sizes="130px"
                      />
                    </div>
                  ) : (
                    <span className="text-5xl sm:text-6xl drop-shadow-xs select-none">
                      {icon}
                    </span>
                  )}
                </div>
              </div>

              {/* Bottom Info Area */}
              <div className="px-1.5 pt-3.5 pb-1 flex flex-col flex-grow">
                {/* Vibe Tag */}
                <div className="mb-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#F4EFEA] text-[#171717] font-extrabold text-xs select-none">
                    {vibe}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg sm:text-xl font-heading font-black text-[#171717] mb-3.5 line-clamp-1">
                  {tmpl.name}
                </h3>

                {/* Action Buttons: Dùng mẫu này & Lưu */}
                <TemplateCardActions
                  templateId={tmpl.id}
                  templateName={tmpl.name}
                />
              </div>
            </div>
          );
        })}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-16 bg-white rounded-3xl border border-[#E8DFD8]">
          <p className="text-[#765B52] font-bold text-lg mb-2">
            {isEn ? "No templates found in this vibe." : "Chưa có mẫu nào thuộc vibe này."}
          </p>
          <button
            onClick={() => setSelectedVibe("all")}
            className="text-[#FFBF00] font-black underline hover:text-[#3A211E]"
          >
            {isEn ? "View all templates" : "Xem tất cả mẫu"}
          </button>
        </div>
      )}
    </div>
  );
}
