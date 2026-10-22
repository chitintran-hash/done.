import React from "react";
import { createClient } from "@/lib/supabase/server";
import { getTranslation } from "@/lib/i18n/server";
import TemplatesClient, { TemplateItem } from "./TemplatesClient";

export const revalidate = 0;

export default async function TemplatesPage() {
  const { t } = await getTranslation();
  const supabase = await createClient();

  // Chỉ lấy những sản phẩm được đăng với danh mục "Mẫu có sẵn" (category === 'template')
  const { data: dbTemplates } = await supabase
    .from("products")
    .select("id, name, description, price, image_url, technical_specs, category")
    .eq("is_available", true)
    .eq("category", "template")
    .order("created_at", { ascending: false });

  const templates: TemplateItem[] = dbTemplates || [];

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
            Khám phá các mẫu ly thiết kế sẵn được đăng bán tại Cupfy. Chọn mẫu bạn thích để tự tay sáng tạo theo phong cách riêng hoặc đặt mua nhanh chóng!
          </p>
        </div>

        {/* Templates Grid with Filters */}
        <TemplatesClient initialTemplates={templates} />
      </div>
    </div>
  );
}
