"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, Heart } from "lucide-react";
import { useLanguageStore } from "@/store/useLanguageStore";
import TemplateCardActions from "@/components/TemplateCardActions";

export interface TemplateItem {
  id: string;
  name: string;
  price?: number;
  description?: string | null;
  image_url?: string | null;
  category?: string;
  technical_specs?: {
    vibe?: string;
    card_bg?: string;
    icon?: string;
    capacity?: string;
    material?: string;
    [key: string]: any;
  } | null;
}

interface TemplatesClientProps {
  initialTemplates: TemplateItem[];
}

function getCupTag(name: string, specs?: any): string {
  const n = name.toLowerCase();
  if (specs?.vibe && specs.vibe !== "Cute" && specs.vibe !== "Cozy" && specs.vibe !== "Retro") {
    return specs.vibe;
  }
  if (n.includes("quai")) return "Có quai cầm";
  if (n.includes("brainrot")) return "Brainrot Edition";
  if (n.includes("classic") || n.includes("facet")) return "Classic Facet";
  if (n.includes("cao")) return "Dáng cao";
  if (n.includes("nhỏ") || n.includes("thấp")) return "Dáng lùn";
  if (n.includes("trung")) return "Cỡ vừa";
  return "Thuỷ tinh cao cấp";
}

function getCupBg(name: string, specs?: any): string {
  if (specs?.card_bg && specs.card_bg !== "#FCE7F3") {
    return specs.card_bg;
  }
  const n = name.toLowerCase();
  if (n.includes("quai")) return "#FFEAEA"; // Soft coral
  if (n.includes("brainrot")) return "#DCFCE7"; // Soft mint
  if (n.includes("cao")) return "#FFF2D6"; // Warm amber cream
  if (n.includes("trung")) return "#EBF5FF"; // Soft blue
  if (n.includes("classic") || n.includes("facet")) return "#F3E8FF"; // Soft lavender
  if (n.includes("nhỏ") || n.includes("thấp")) return "#E8F8F0"; // Soft sage
  return "#FFF2D6";
}

function getCupCapacity(name: string, specs?: any): string {
  if (specs?.capacity) return specs.capacity.toString().includes("ml") ? specs.capacity : `${specs.capacity}ml`;
  const n = name.toLowerCase();
  if (n.includes("quai")) return "400ml";
  if (n.includes("brainrot")) return "350ml";
  if (n.includes("cao")) return "350ml";
  if (n.includes("trung")) return "380ml";
  if (n.includes("classic")) return "300ml";
  if (n.includes("nhỏ") || n.includes("thấp")) return "250ml";
  return "350ml";
}

export default function TemplatesClient({ initialTemplates }: TemplatesClientProps) {
  const language = useLanguageStore((state) => state.language);
  const isEn = language === "en";

  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Filter Categories: Tất cả mẫu, Ly dáng cao, Ly có quai, Ly vừa & nhỏ
  const filterTabs = useMemo(() => {
    return [
      { id: "all", label: isEn ? "All Cups" : "Tất cả mẫu" },
      { id: "tall", label: isEn ? "Tall Glasses" : "Ly dáng cao" },
      { id: "handle", label: isEn ? "With Handle" : "Ly có quai" },
      { id: "short", label: isEn ? "Medium & Short" : "Ly vừa & nhỏ" },
    ];
  }, [isEn]);

  // Filter templates
  const filteredTemplates = useMemo(() => {
    if (selectedCategory === "all") return initialTemplates;
    return initialTemplates.filter((t) => {
      const n = t.name.toLowerCase();
      if (selectedCategory === "tall") {
        return n.includes("cao") && !n.includes("quai");
      }
      if (selectedCategory === "handle") {
        return n.includes("quai");
      }
      if (selectedCategory === "short") {
        return n.includes("trung") || n.includes("nhỏ") || n.includes("thấp") || n.includes("classic") || n.includes("facet");
      }
      return true;
    });
  }, [initialTemplates, selectedCategory]);

  return (
    <div className="w-full">
      {/* Category Filter Tabs */}
      <div className="flex items-center justify-center flex-wrap gap-2 sm:gap-3 mb-10 sm:mb-12">
        {filterTabs.map((tab) => {
          let count = initialTemplates.length;
          if (tab.id === "tall") {
            count = initialTemplates.filter((t) => t.name.toLowerCase().includes("cao") && !t.name.toLowerCase().includes("quai")).length;
          } else if (tab.id === "handle") {
            count = initialTemplates.filter((t) => t.name.toLowerCase().includes("quai")).length;
          } else if (tab.id === "short") {
            count = initialTemplates.filter((t) => {
              const n = t.name.toLowerCase();
              return n.includes("trung") || n.includes("nhỏ") || n.includes("thấp") || n.includes("classic") || n.includes("facet");
            }).length;
          }

          const isActive = selectedCategory === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id)}
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-extrabold transition-all duration-200 cursor-pointer ${
                isActive
                  ? "bg-[#3A211E] text-white shadow-md scale-105"
                  : "bg-white text-[#765B52] hover:bg-[#FAF7F2] border border-[#E8DFD8]"
              }`}
            >
              {tab.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {filteredTemplates.map((tmpl) => {
          const cardBg = getCupBg(tmpl.name, tmpl.technical_specs);
          const tag = getCupTag(tmpl.name, tmpl.technical_specs);
          const capacity = getCupCapacity(tmpl.name, tmpl.technical_specs);

          return (
            <div
              key={tmpl.id}
              className="bg-white rounded-[28px] p-3.5 sm:p-4 border border-[#EBE3DC] shadow-[0_4px_25px_rgba(58,33,30,0.04)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group"
            >
              {/* Colored Top Area with Cup Preview */}
              <div
                className="w-full h-[230px] sm:h-[250px] rounded-[22px] flex items-center justify-center relative overflow-hidden transition-transform duration-300 group-hover:scale-[1.01]"
                style={{ backgroundColor: cardBg }}
              >
                {/* Badges: Capacity & Quality */}
                <div className="absolute top-3 right-3 z-10 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[#3A211E] text-[11px] font-black shadow-xs">
                  {capacity}
                </div>
                <div className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full bg-black/10 backdrop-blur-md text-[#3A211E] text-[10px] font-bold uppercase tracking-wider">
                  Cupfy Choice
                </div>

                {/* Floating Showcase Box with Real Cup Image */}
                <Link
                  href={`/products/${tmpl.id}`}
                  className="w-[140px] h-[190px] sm:w-[160px] sm:h-[210px] rounded-[22px] bg-white/95 shadow-[0_12px_28px_rgba(0,0,0,0.07)] border border-white/70 flex items-center justify-center p-3 select-none transition-transform duration-300 group-hover:scale-105 relative block cursor-pointer"
                >
                  {tmpl.image_url ? (
                    <Image
                      src={tmpl.image_url}
                      alt={tmpl.name}
                      fill
                      className="object-contain p-2 mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, 250px"
                    />
                  ) : (
                    <span className="text-5xl sm:text-6xl drop-shadow-xs select-none">
                      🥛
                    </span>
                  )}
                </Link>
              </div>

              {/* Bottom Info Area */}
              <div className="px-1.5 pt-3.5 pb-1 flex flex-col flex-grow">
                {/* Tag & Capacity */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#F4EFEA] text-[#171717] font-extrabold text-xs select-none">
                    {tag}
                  </span>
                  <span className="text-xs font-semibold text-[#765B52]">
                    Chính hãng
                  </span>
                </div>

                {/* Title */}
                <Link href={`/products/${tmpl.id}`} className="group-hover:text-[#F06806] transition-colors">
                  <h3 className="text-lg sm:text-xl font-heading font-black text-[#171717] mb-1 line-clamp-1">
                    {tmpl.name}
                  </h3>
                </Link>

                {/* Price */}
                <div className="mb-3.5">
                  <span className="text-lg sm:text-xl font-black text-[#3A211E]">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(tmpl.price || 0)}
                  </span>
                </div>

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
            {isEn ? "No cup models found in this category." : "Chưa có mẫu ly nào thuộc phân loại này."}
          </p>
          <button
            onClick={() => setSelectedCategory("all")}
            className="text-[#FFBF00] font-black underline hover:text-[#3A211E] cursor-pointer"
          >
            {isEn ? "View all cup models" : "Xem tất cả mẫu ly"}
          </button>
        </div>
      )}
    </div>
  );
}
