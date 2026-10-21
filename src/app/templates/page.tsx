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
    .select("id, name, description, price, image_url, technical_specs")
    .eq("category", "template")
    .eq("is_available", true)
    .order("created_at", { ascending: false });

  const fallbackTemplates: TemplateItem[] = [
    {
      id: "4f8cc6e6-16d0-4437-8188-81a867f96286",
      name: "Mochi Cat",
      image_url: "",
      technical_specs: {
        vibe: "Cute",
        card_bg: "#FCE7F3",
        icon: "🐱",
      },
    },
    {
      id: "29440931-5abe-4663-aafc-7823cedaa392",
      name: "Matcha Morning",
      image_url: "",
      technical_specs: {
        vibe: "Cozy",
        card_bg: "#DCFCE7",
        icon: "🍵",
      },
    },
    {
      id: "21e4cf22-5bd9-43e8-aaf5-609e59732a58",
      name: "Retro Orange",
      image_url: "",
      technical_specs: {
        vibe: "Retro",
        card_bg: "#FBBF24",
        icon: "✦",
      },
    },
    {
      id: "template-strawberry",
      name: "Sweet Berry",
      image_url: "",
      technical_specs: {
        vibe: "Cute",
        card_bg: "#FFE4E6",
        icon: "🍓",
      },
    },
    {
      id: "template-latte",
      name: "Warm Latte",
      image_url: "",
      technical_specs: {
        vibe: "Cozy",
        card_bg: "#E8DFD8",
        icon: "☕",
      },
    },
    {
      id: "template-midnight",
      name: "Cosmic Vibe",
      image_url: "",
      technical_specs: {
        vibe: "Retro",
        card_bg: "#E9D5FF",
        icon: "🌙",
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
            Khởi đầu nhanh chóng với hàng loạt mẫu thiết kế đẹp mắt theo từng Vibe (Cute, Cozy, Retro...). Chọn mẫu bạn thích và bắt đầu tuỳ chỉnh theo ý muốn!
          </p>
        </div>

        {/* Templates Grid with Vibe Filters */}
        <TemplatesClient initialTemplates={templates} />
      </div>
    </div>
  );
}
