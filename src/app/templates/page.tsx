import React from "react";
import { createClient } from "@/lib/supabase/server";
import { getTranslation } from "@/lib/i18n/server";
import TemplatesClient, { TemplateItem } from "./TemplatesClient";

export const revalidate = 0;

export default async function TemplatesPage() {
  const { t } = await getTranslation();
  const supabase = await createClient();

  const { data: dbTemplates } = await supabase
    .from("products")
    .select("id, name, description, price, image_url, technical_specs, category")
    .eq("is_available", true)
    .in("category", ["glass", "plastic", "template"])
    .order("price", { ascending: false });

  const fallbackTemplates: TemplateItem[] = [
    {
      id: "3bd416e6-6e46-4b4f-8530-0ed6f25bfc45",
      name: "Ly Thuỷ Tinh Có Quai",
      price: 145000,
      image_url: "/images/products/quai.jpg",
      category: "glass",
      technical_specs: {
        vibe: "Có quai cầm",
        card_bg: "#FFEAEA",
        capacity: "400ml",
        material: "Thủy tinh cao cấp",
      },
    },
    {
      id: "29440931-5abe-4663-aafc-7823cedaa392",
      name: "Ly Thuỷ Tinh Cao Brainrot",
      price: 130000,
      image_url: "/images/products/brainrot.jpg",
      category: "glass",
      technical_specs: {
        vibe: "Brainrot Edition",
        card_bg: "#DCFCE7",
        capacity: "350ml",
        material: "Thủy tinh cao cấp",
      },
    },
    {
      id: "49c8dfa4-25e7-45c5-9a52-a4d67e170983",
      name: "Ly Thuỷ Tinh Cao",
      price: 115000,
      image_url: "/images/products/cao.jpg",
      category: "glass",
      technical_specs: {
        vibe: "Dáng cao",
        card_bg: "#FFF2D6",
        capacity: "350ml",
        material: "Thủy tinh cao cấp",
      },
    },
    {
      id: "885b3b47-d1b8-4681-8e4b-31e14502491a",
      name: "Ly Thuỷ Tinh Cỡ Trung",
      price: 115000,
      image_url: "/images/products/trung.jpg",
      category: "glass",
      technical_specs: {
        vibe: "Cỡ vừa",
        card_bg: "#EBF5FF",
        capacity: "380ml",
        material: "Thủy tinh cao cấp",
      },
    },
    {
      id: "0c3dffa3-98cd-488b-b403-d2aaa12932fb",
      name: "Ly thủy tinh Classic Facet",
      price: 109000,
      image_url: "/images/products/classic.jpg",
      category: "glass",
      technical_specs: {
        vibe: "Classic Facet",
        card_bg: "#F3E8FF",
        capacity: "300ml",
        material: "Thủy tinh cao cấp",
      },
    },
    {
      id: "c9146584-8451-4d18-b0f8-92d5fdde494c",
      name: "Ly Thuỷ Tinh Nhỏ",
      price: 105000,
      image_url: "/images/products/nho.jpg",
      category: "glass",
      technical_specs: {
        vibe: "Dáng lùn",
        card_bg: "#E8F8F0",
        capacity: "250ml",
        material: "Thủy tinh cao cấp",
      },
    },
  ];

  const templates: TemplateItem[] =
    dbTemplates && dbTemplates.length > 0 ? dbTemplates : fallbackTemplates;

  return (
    <div className="min-h-screen pt-28 md:pt-36 lg:pt-[150px] pb-24 bg-[#FFF9E8]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs font-black uppercase tracking-[0.2em] text-[#F06806] inline-block mb-3">
            {t("templates_vibe_tag" as any)}
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-black text-[#171717] mb-4">
            {t("templates_section_title" as any)}
          </h1>
          <p className="text-[#765B52] text-base sm:text-lg leading-relaxed">
            Khám phá bộ sưu tập mẫu ly bán sẵn chính hãng Cupfy. Chọn mẫu ly bạn thích để bắt đầu tự tay tuỳ biến thiết kế riêng hoặc đặt mua nhanh chóng!
          </p>
        </div>

        {/* Templates Grid with Filters */}
        <TemplatesClient initialTemplates={templates} />
      </div>
    </div>
  );
}
