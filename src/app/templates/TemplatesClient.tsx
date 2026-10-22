"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, ShoppingBag, PlusCircle } from "lucide-react";
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
  if (specs?.vibe) return specs.vibe;
  const n = name.toLowerCase();
  if (n.includes("quai")) return "Có quai cầm";
  if (n.includes("brainrot")) return "Brainrot Edition";
  if (n.includes("classic") || n.includes("facet")) return "Classic Facet";
  if (n.includes("cao")) return "Dáng cao";
  if (n.includes("nhỏ") || n.includes("thấp")) return "Dáng lùn";
  if (n.includes("trung")) return "Cỡ vừa";
  return "Mẫu có sẵn";
}

function getCupBg(name: string, specs?: any): string {
  if (specs?.card_bg) return specs.card_bg;
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

  const [selectedVibe, setSelectedVibe] = useState<string>("all");

  // Extract unique vibes from the templates (based on technical_specs.vibe or tag)
  const availableVibes = useMemo(() => {
    const vibes = new Set<string>();
    initialTemplates.forEach((t) => {
      const v = t.technical_specs?.vibe || getCupTag(t.name, t.technical_specs);
      if (v) vibes.add(v);
    });
    return Array.from(vibes);
  }, [initialTemplates]);

  // Filter templates
  const filteredTemplates = useMemo(() => {
    if (selectedVibe === "all") return initialTemplates;
    return initialTemplates.filter((t) => {
      const v = t.technical_specs?.vibe || getCupTag(t.name, t.technical_specs);
      return v.toLowerCase() === selectedVibe.toLowerCase();
    });
  }, [initialTemplates, selectedVibe]);

  if (initialTemplates.length === 0) {
    return (
      <div className="w-full text-center py-20 px-6 bg-white rounded-[32px] border border-[#E8DFD8] shadow-sm max-w-2xl mx-auto">
        <div className="w-20 h-20 rounded-full bg-[#FFF9E8] flex items-center justify-center mx-auto mb-5 text-4xl shadow-inner border border-[#FFBF00]/30">
          ✨
        </div>
        <h3 className="text-2xl font-black text-[#171717] mb-3">
          {isEn ? "No templates available yet" : "Chưa có sản phẩm nào trong Mẫu có sẵn"}
        </h3>
        <p className="text-[#765B52] text-sm sm:text-base leading-relaxed mb-8 max-w-md mx-auto">
          {isEn
            ? "When admin adds a product and selects category 'Mẫu có sẵn', it will appear here."
            : "Khi admin đăng sản phẩm mới và chọn mục 'Mẫu có sẵn', sản phẩm đó sẽ tự động hiển thị tại đây."}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#3A211E] hover:bg-[#201817] text-white rounded-full font-bold text-sm transition-all shadow-sm"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{isEn ? "Browse all products" : "Xem tất cả tại Cửa hàng"}</span>
          </Link>
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-white hover:bg-[#FFF9E8] text-[#3A211E] border border-[#E8DFD8] rounded-full font-bold text-sm transition-all shadow-xs"
          >
            <PlusCircle className="w-4 h-4 text-[#F06806]" />
            <span>{isEn ? "Go to Admin Products" : "Đăng mẫu trong Quản trị"}</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Vibe / Category Filter Tabs */}
      {availableVibes.length > 1 && (
        <div className="flex items-center justify-center flex-wrap gap-2 sm:gap-3 mb-10 sm:mb-12">
          <button
            onClick={() => setSelectedVibe("all")}
            className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-extrabold transition-all duration-200 cursor-pointer ${
              selectedVibe === "all"
                ? "bg-[#3A211E] text-white shadow-md scale-105"
                : "bg-white text-[#765B52] hover:bg-[#FAF7F2] border border-[#E8DFD8]"
            }`}
          >
            {isEn ? "All Templates" : "Tất cả mẫu"} ({initialTemplates.length})
          </button>

          {availableVibes.map((vibe) => {
            const count = initialTemplates.filter((t) => {
              const v = t.technical_specs?.vibe || getCupTag(t.name, t.technical_specs);
              return v.toLowerCase() === vibe.toLowerCase();
            }).length;

            const isActive = selectedVibe.toLowerCase() === vibe.toLowerCase();

            return (
              <button
                key={vibe}
                onClick={() => setSelectedVibe(vibe)}
                className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-extrabold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-[#FFBF00] text-[#3A211E] shadow-md scale-105 font-black"
                    : "bg-white text-[#765B52] hover:bg-[#FAF7F2] border border-[#E8DFD8]"
                }`}
              >
                {vibe} ({count})
              </button>
            );
          })}
        </div>
      )}

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {filteredTemplates.map((tmpl) => {
          const cardBg = getCupBg(tmpl.name, tmpl.technical_specs);
          const tag = getCupTag(tmpl.name, tmpl.technical_specs);
          const capacity = getCupCapacity(tmpl.name, tmpl.technical_specs);
          const icon = tmpl.technical_specs?.icon || "✨";

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
                      {icon}
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
    </div>
  );
}
