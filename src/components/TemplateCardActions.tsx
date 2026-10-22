"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useLanguageStore } from "@/store/useLanguageStore";

interface TemplateCardActionsProps {
  templateId: string;
  templateName: string;
}

export default function TemplateCardActions({
  templateId,
}: TemplateCardActionsProps) {
  const [saved, setSaved] = useState(false);
  const language = useLanguageStore((state) => state.language);
  const isEn = language === "en";

  const handleToggleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSaved(!saved);
  };

  return (
    <div className="flex items-center gap-2 mt-auto w-full pt-1">
      <Link
        href={`/custom-cup?productId=${encodeURIComponent(templateId)}`}
        className="flex-1 py-3 px-4 bg-[#171717] hover:bg-[#2A201C] text-white rounded-2xl font-extrabold text-xs sm:text-sm text-center transition-all duration-200 active:scale-98 shadow-sm hover:shadow-md"
      >
        {isEn ? "Use this model" : "Dùng mẫu này"}
      </Link>
      <button
        type="button"
        onClick={handleToggleSave}
        aria-label={saved ? "Đã lưu mẫu" : "Lưu mẫu"}
        className={`py-3 px-4 rounded-2xl font-extrabold text-xs sm:text-sm border transition-all duration-200 active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer shrink-0 ${
          saved
            ? "bg-rose-50 border-rose-300 text-rose-600 shadow-xs"
            : "bg-white hover:bg-[#FFF9E8] border-[#E8DFD8] text-[#3A211E]"
        }`}
      >
        <Heart
          className={`w-4 h-4 transition-colors ${
            saved ? "fill-rose-500 text-rose-500" : "text-[#3A211E]"
          }`}
        />
        <span>{saved ? (isEn ? "Saved" : "Đã lưu") : (isEn ? "Save" : "Lưu")}</span>
      </button>
    </div>
  );
}
