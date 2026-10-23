"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, PlusCircle } from "lucide-react";
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
    capacity?: string;
    material?: string;
    [key: string]: any;
  } | null;
}

interface TemplatesClientProps {
  initialTemplates: TemplateItem[];
}

function getCupCapacity(name: string, specs?: any): string {
  if (specs?.capacity) return specs.capacity.toString().includes("ml") ? specs.capacity : `${specs.capacity}ml`;
  const n = name.toLowerCase();
  if (n.includes("quai")) return "400ml";
  if (n.includes("cao")) return "350ml";
  if (n.includes("trung")) return "380ml";
  if (n.includes("nhỏ") || n.includes("thấp")) return "250ml";
  return "350ml";
}

export default function TemplatesClient({ initialTemplates }: TemplatesClientProps) {
  const language = useLanguageStore((state) => state.language);
  const isEn = language === "en";

  if (initialTemplates.length === 0) {
    return (
      <div className="w-full text-center py-20 px-6 bg-white rounded-[32px] border border-[#E8DFD8] shadow-sm max-w-2xl mx-auto">
        <div className="w-20 h-20 rounded-full bg-[#FFF9E8] flex items-center justify-center mx-auto mb-5 text-4xl shadow-inner border border-[#FFBF00]/30">
          🥛
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
      {/* Templates Grid - Clean direct product presentation without background tinting or vibe tags */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-7">
        {initialTemplates.map((tmpl) => {
          const capacity = getCupCapacity(tmpl.name, tmpl.technical_specs);
          const material = tmpl.technical_specs?.material || "Thuỷ tinh cao cấp";

          return (
            <div
              key={tmpl.id}
              className="bg-white rounded-[26px] p-4 border border-[#E8DFD8] shadow-[0_4px_20px_rgba(58,33,30,0.03)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group"
            >
              {/* Cup Image Area - Clean neutral presentation directly displaying the ready-made cup */}
              <Link
                href={`/products/${tmpl.id}`}
                className="relative w-full aspect-square rounded-[20px] bg-[#FAF7F2] border border-[#E8DFD8]/60 overflow-hidden flex items-center justify-center p-3 mb-3.5 block cursor-pointer group-hover:border-[#FFBF00] transition-colors"
              >
                {/* Badge: Capacity */}
                {capacity && (
                  <div className="absolute top-3 right-3 z-10 px-2.5 py-1 rounded-full bg-white/95 text-[#3A211E] text-[11px] font-bold shadow-xs border border-[#E8DFD8]/60">
                    {capacity}
                  </div>
                )}
                <div className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full bg-[#3A211E] text-white text-[10px] font-bold uppercase tracking-wider shadow-xs">
                  Mẫu có sẵn
                </div>

                {tmpl.image_url ? (
                  <Image
                    src={tmpl.image_url}
                    alt={tmpl.name}
                    fill
                    className="object-contain p-2 mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                ) : (
                  <span className="text-6xl select-none">🥛</span>
                )}
              </Link>

              {/* Info Area */}
              <div className="flex flex-col flex-grow">
                {/* Subtitle / Material */}
                <div className="flex items-center justify-between text-xs text-[#765B52] mb-1.5">
                  <span className="font-medium">{material}</span>
                  <span className="font-semibold text-emerald-700">Chính hãng</span>
                </div>

                {/* Title */}
                <Link href={`/products/${tmpl.id}`} className="group-hover:text-[#F06806] transition-colors">
                  <h3 className="text-base sm:text-lg font-heading font-black text-[#171717] mb-1 line-clamp-1">
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

                {/* Action Buttons: Đặt mua ngay & Thêm vào giỏ hàng (Không link vào 3D studio) */}
                <TemplateCardActions
                  templateId={tmpl.id}
                  templateName={tmpl.name}
                  price={tmpl.price || 0}
                  imageUrl={tmpl.image_url || ''}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
