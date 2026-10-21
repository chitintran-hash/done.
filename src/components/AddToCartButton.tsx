"use client";

import React, { useState } from "react";
import { ShoppingBag, Check } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useLanguageStore } from "@/store/useLanguageStore";

interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    price: number;
    image_url?: string;
  };
  className?: string;
  variant?: "pill" | "icon" | "full";
}

export default function AddToCartButton({
  product,
  className = "",
  variant = "pill",
}: AddToCartButtonProps) {
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const language = useLanguageStore((state) => state.language);

  const isEn = language === "en";
  const label = isEn ? "Add to cart" : "Thêm vào giỏ";
  const addedLabel = isEn ? "Added ✓" : "Đã thêm ✓";

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image_url || "/images/hero-slider-1.jpg",
      quantity: 1,
      isCustom: false,
    });

    setAdded(true);
    setTimeout(() => {
      setAdded(false);
    }, 2000);
  };

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={handleAddToCart}
        aria-label={added ? addedLabel : label}
        title={added ? addedLabel : label}
        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 active:scale-95 shadow-sm cursor-pointer ${
          added
            ? "bg-emerald-600 text-white"
            : "bg-[#FFBF00] text-[#3A211E] hover:bg-[#3A211E] hover:text-white"
        } ${className}`}
      >
        {added ? <Check className="w-5 h-5 stroke-[2.5]" /> : <ShoppingBag className="w-5 h-5" />}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleAddToCart}
      aria-label={added ? addedLabel : label}
      className={`inline-flex items-center justify-center gap-1.5 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full font-bold text-xs sm:text-sm transition-all duration-200 active:scale-95 shadow-xs cursor-pointer select-none ${
        added
          ? "bg-emerald-600 text-white shadow-emerald-500/20"
          : "bg-[#FFBF00] text-[#3A211E] hover:bg-[#3A211E] hover:text-white hover:shadow-md"
      } ${className}`}
    >
      {added ? (
        <>
          <Check className="w-4 h-4 stroke-[2.5]" />
          <span>{addedLabel}</span>
        </>
      ) : (
        <>
          <ShoppingBag className="w-4 h-4" />
          <span>{label}</span>
        </>
      )}
    </button>
  );
}
