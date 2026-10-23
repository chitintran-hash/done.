"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Heart, Check, ShoppingBag } from "lucide-react";
import { useLanguageStore } from "@/store/useLanguageStore";
import { useCartStore } from "@/store/useCartStore";

interface TemplateCardActionsProps {
  templateId: string;
  templateName: string;
  price?: number;
  imageUrl?: string;
}

export default function TemplateCardActions({
  templateId,
  templateName,
  price = 0,
  imageUrl = '',
}: TemplateCardActionsProps) {
  const [saved, setSaved] = useState(false);
  const [added, setAdded] = useState(false);
  const cart = useCartStore();
  const language = useLanguageStore((state) => state.language);
  const isEn = language === "en";

  const handleToggleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSaved(!saved);
  };

  const handleQuickAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    cart.addItem({
      id: templateId,
      name: templateName,
      price: price,
      image: imageUrl,
      quantity: 1,
      isCustom: false,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="flex items-center gap-2 mt-auto w-full pt-1">
      {/* Nút Đặt mua ngay (dẫn trực tiếp vào trang sản phẩm để mua, KHÔNG link 3D studio) */}
      <Link
        href={`/products/${templateId}`}
        className="flex-1 py-2.5 px-3 bg-[#3A211E] hover:bg-[#201817] text-white rounded-2xl font-extrabold text-xs sm:text-sm text-center transition-all duration-200 active:scale-98 shadow-sm hover:shadow-md line-clamp-1"
      >
        {isEn ? "Buy now" : "Đặt mua ngay"}
      </Link>

      {/* Nút thêm nhanh vào giỏ hàng */}
      <button
        type="button"
        onClick={handleQuickAddToCart}
        aria-label={added ? "Đã thêm vào giỏ" : "Thêm vào giỏ"}
        title={added ? "Đã thêm vào giỏ hàng!" : "Thêm vào giỏ hàng"}
        className={`w-10 h-10 rounded-2xl font-extrabold text-xs sm:text-sm border transition-all duration-200 active:scale-95 flex items-center justify-center cursor-pointer shrink-0 ${
          added
            ? "bg-emerald-600 border-emerald-600 text-white shadow-xs"
            : "bg-[#FFBF00] hover:bg-[#FFD147] border-[#FFBF00] text-[#3A211E]"
        }`}
      >
        {added ? <Check className="w-4 h-4 stroke-[2.5]" /> : <ShoppingBag className="w-4 h-4" />}
      </button>

      {/* Nút lưu mẫu */}
      <button
        type="button"
        onClick={handleToggleSave}
        aria-label={saved ? "Đã lưu mẫu" : "Lưu mẫu"}
        className={`w-10 h-10 rounded-2xl font-extrabold text-xs sm:text-sm border transition-all duration-200 active:scale-95 flex items-center justify-center cursor-pointer shrink-0 ${
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
      </button>
    </div>
  );
}
