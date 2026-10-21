import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MousePointer2, Paintbrush, Eye, ShoppingBag, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getTranslation } from "@/lib/i18n/server";
import HeroSlider from "@/components/HeroSlider";

export default async function Home() {
  const { t } = await getTranslation();
  const supabase = await createClient();
  const { data: latestProducts } = await supabase
    .from("products")
    .select("*")
    .neq("category", "user_custom")
    .not("category", "in", '("gift_box","gift","admin_community_post","admin_about_post")')
    .limit(4);

  return (
    <main className="flex flex-col min-h-screen pt-28 md:pt-36 lg:pt-[150px] bg-[#FFF9E8]">
      
      {/* PHẦN 1: Hero Section phong cách Banner Gradient Vàng Ấm + Khung Ly & 4 Badges */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 mb-16 md:mb-24 w-full">
        <div className="relative w-full rounded-[36px] md:rounded-[48px] overflow-hidden bg-gradient-to-br from-[#FCB827] via-[#FDC640] via-60% to-[#FFD868] shadow-[0_25px_60px_rgba(252,188,47,0.28)] border border-amber-300/60 min-h-[540px] md:min-h-[580px] lg:min-h-[600px] flex flex-col lg:flex-row items-center justify-between p-6 sm:p-10 lg:p-12 xl:p-16 gap-10">
          
          {/* Lớp ánh sáng tỏa (Ambient Glows) */}
          <div className="absolute -right-24 -top-24 w-[420px] h-[420px] bg-white/25 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -left-20 -bottom-20 w-[360px] h-[360px] bg-amber-500/20 rounded-full blur-2xl pointer-events-none"></div>

          {/* Cột trái: Nội dung chữ gốc CUSTOMIZE YOUR CUP + Nút CTA */}
          <div className="relative z-10 w-full lg:w-[48%] xl:w-[46%] flex flex-col items-start text-left">
            
            {/* Tag nhỏ thương hiệu */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/85 backdrop-blur-md border border-white/70 text-[#3A211E] text-xs sm:text-sm font-extrabold uppercase tracking-wider mb-4 sm:mb-5 shadow-xs">
              <Sparkles className="w-4 h-4 text-[#FFBF00]" />
              <span>{t("hero_tag" as any)}</span>
            </div>

            {/* Tiêu đề khổng lồ: Nâu chocolate #3A211E sang trọng, độ tương phản cao */}
            <h1 className="font-heading font-black text-5xl sm:text-6xl md:text-7xl lg:text-[72px] xl:text-[76px] leading-[0.94] tracking-tight uppercase mb-5 select-none text-[#3A211E]">
              <span className="block text-[#3A211E]">
                CUSTOMIZE
              </span>
              <span className="block text-[#3A211E] mt-1.5">
                YOUR CUP
              </span>
            </h1>

            {/* Đoạn mô tả phụ gốc */}
            <p className="text-base sm:text-lg md:text-xl text-[#3A211E]/85 font-medium leading-relaxed mb-8 max-w-[460px]">
              {t("hero_subtitle_banner" as any)}
            </p>

            {/* Cặp nút bấm CTA: Nút chính nâu chocolate chữ trắng, nút phụ nền trắng chữ nâu */}
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/custom-cup"
                className="inline-flex items-center justify-center gap-2 px-9 py-4 bg-[#3A211E] text-white rounded-full font-black text-base sm:text-lg transition-all duration-200 hover:bg-[#201817] hover:scale-105 shadow-[0_12px_28px_rgba(58,33,30,0.22)] group"
              >
                <span>{t("hero_btn_design" as any)}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/products"
                className="inline-flex items-center justify-center px-8 py-4 bg-white hover:bg-[#FFF9E8] text-[#3A211E] rounded-full font-bold text-base transition-all duration-200 border border-white/80 shadow-xs hover:shadow-sm"
              >
                {t("hero_btn_shop" as any)}
              </Link>
            </div>

          </div>

          {/* Cột phải: Slider hình ảnh với khung viền bo cong trắng 3D + 4 Badges */}
          <div className="relative z-10 w-full lg:w-[52%] xl:w-[54%] flex items-center justify-center p-2 sm:p-4 lg:p-6">
            <div className="relative w-full max-w-[620px]">

              {/* BADGE 1: DRAG & DROP (Góc trên bên trái) */}
              <div className="absolute -top-4 -left-3 sm:-top-5 sm:-left-5 z-30 bg-white text-[#171717] font-black text-xs sm:text-[13px] px-4 sm:px-5 py-2 sm:py-2.5 rounded-full shadow-[0_12px_28px_rgba(0,0,0,0.18)] border border-white/80 -rotate-6 select-none hover:rotate-0 hover:scale-105 transition-all duration-200 cursor-default flex items-center gap-1.5">
                <span>DRAG & DROP</span>
              </div>

              {/* BADGE 2: 360° PREVIEW (Góc trên bên phải) */}
              <div className="absolute top-4 -right-3 sm:top-5 sm:-right-5 z-30 bg-[#A0091F] text-white font-black text-xs sm:text-[13px] px-4 sm:px-5 py-2 sm:py-2.5 rounded-full shadow-[0_12px_28px_rgba(160,9,31,0.35)] rotate-8 select-none hover:rotate-0 hover:scale-105 transition-all duration-200 cursor-default flex items-center gap-1.5">
                <span>360° PREVIEW</span>
              </div>

              {/* BADGE 3: PRINT READY ✓ (Góc dưới bên trái) */}
              <div className="absolute bottom-10 -left-3 sm:bottom-12 sm:-left-5 z-30 bg-[#EF6807] text-white font-black text-xs sm:text-[13px] px-4 sm:px-5 py-2 sm:py-2.5 rounded-full shadow-[0_12px_28px_rgba(239,104,7,0.35)] -rotate-6 select-none hover:rotate-0 hover:scale-105 transition-all duration-200 cursor-default flex items-center gap-1.5">
                <span>PRINT READY ✓</span>
              </div>

              {/* BADGE 4: SAVE DESIGN (Góc dưới bên phải) */}
              <div className="absolute -bottom-3 -right-2 sm:-bottom-4 sm:-right-4 z-30 bg-[#2C9EC6] text-white font-black text-xs sm:text-[13px] px-4 sm:px-5 py-2 sm:py-2.5 rounded-full shadow-[0_12px_28px_rgba(44,158,198,0.35)] rotate-6 select-none hover:rotate-0 hover:scale-105 transition-all duration-200 cursor-default flex items-center gap-1.5">
                <span>SAVE DESIGN</span>
              </div>

              {/* KHUNG BO VIỀN TRẮNG NỔI 3D CHỨA SLIDER */}
              <div className="p-2 sm:p-3 bg-white/75 backdrop-blur-md rounded-[34px] md:rounded-[42px] border-[3px] border-white/95 shadow-[0_22px_55px_rgba(58,33,30,0.18)]">
                <HeroSlider />
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* PHẦN 2: Cách hoạt động */}
      <section className="bg-[#FFF9E8]/50 py-24 border-y border-[#E8DFD8]">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-extrabold text-[#3A211E] mb-4">{t("how_title" as any)}</h3>
            <p className="text-[#765B52] text-lg">{t("how_subtitle" as any)}</p>
          </div>
          <div className="relative grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {/* Decorative dashed line */}
            <div className="hidden md:block absolute top-[44px] left-[12%] right-[12%] h-[2px] border-t-2 border-dashed border-[#E8DFD8] z-0"></div>

            {[
              { icon: MousePointer2, title: t("how_step1_title" as any), desc: t("how_step1_desc" as any) },
              { icon: Paintbrush, title: t("how_step2_title" as any), desc: t("how_step2_desc" as any) },
              { icon: Eye, title: t("how_step3_title" as any), desc: t("how_step3_desc" as any) },
              { icon: ShoppingBag, title: t("how_step4_title" as any), desc: t("how_step4_desc" as any) }
            ].map((step, i) => (
              <div key={i} className="relative bg-white rounded-[24px] p-8 text-center flex flex-col items-center hover:-translate-y-1 transition-transform duration-300 border border-[#E8DFD8] shadow-sm hover:shadow-md z-10 overflow-hidden group">
                <div className="w-20 h-20 bg-[#FFF3C4] text-[#3A211E] rounded-full flex items-center justify-center mb-6 shadow-sm relative z-10 border border-[#E8DFD8]/60">
                  <step.icon className="w-8 h-8" strokeWidth={2} />
                </div>
                
                <h4 className="text-xl font-bold text-[#3A211E] mb-3 relative z-10">{step.title}</h4>
                <p className="text-sm text-[#765B52] leading-relaxed relative z-10">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PHẦN 3: Sản phẩm nổi bật */}
      <section className="max-w-[1400px] mx-auto px-6 py-24 w-full">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h3 className="text-3xl font-extrabold text-[#3A211E] mb-3">{t("products_title" as any)}</h3>
            <p className="text-[#765B52] text-lg">{t("products_subtitle" as any)}</p>
          </div>
          <Link href="/products" className="hidden sm:flex items-center gap-2 font-bold text-[#3A211E] hover:text-[#765B52] transition-colors">
            {t("products_view_all" as any)}<ArrowRight className="w-5 h-5" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {latestProducts?.map((product) => (
            <Link href={`/products/${product.id}`} key={product.id} className="group bg-white rounded-[24px] overflow-hidden border border-[#E8DFD8] hover:border-[#FFBF00] transition-colors flex flex-col h-full shadow-sm hover:shadow-md">
              <div className="relative aspect-square bg-white overflow-hidden p-8 flex items-center justify-center border-b border-[#E8DFD8]">
                {product.image_url ? (
                  <Image
                    src={product.image_url}
                    alt={`${product.name} - Ly đẹp chính hãng Cupfy`}
                    fill
                    className="object-contain p-8 group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="text-[#765B52] text-sm">No image</div>
                )}
              </div>
              <div className="p-6 flex flex-col flex-grow bg-white">
                <h4 className="font-bold text-lg text-[#3A211E] mb-2 line-clamp-2 leading-tight">{product.name}</h4>
                <p className="text-sm text-[#765B52] mb-5">{product.capacity || '500ml'}</p>
                <div className="mt-auto flex items-center justify-between">
                  <span className="font-black text-[#3A211E] text-lg">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                  </span>
                  <span className="text-[#3A211E] font-bold text-sm bg-[#FFBF00] px-4 py-2 rounded-full group-hover:bg-[#3A211E] group-hover:text-white transition-colors">
                    {t("products_view_detail" as any)}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        <div className="mt-10 flex justify-center sm:hidden">
          <Link href="/products" className="px-8 py-4 bg-white text-[#3A211E] border border-[#E8DFD8] rounded-full font-bold flex items-center gap-2">
            {t("products_view_all" as any)}<ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* PHẦN 4: Section custom banner */}
      <section className="w-full px-4 md:px-6 mb-24">
        <div className="max-w-[1400px] mx-auto bg-[#FFF9E8] rounded-[32px] overflow-hidden flex flex-col md:flex-row items-center relative border border-[#E8DFD8] shadow-sm">
          <div className="w-full md:w-1/2 p-8 sm:p-12 md:p-14 lg:p-20 z-10 flex flex-col items-start bg-[#FFF9E8]">
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#3A211E] mb-6 leading-[1.15] tracking-tight">
              {t("banner_title" as any)}
            </h3>
            <p className="text-base sm:text-lg text-[#765B52] mb-8 md:mb-10 max-w-[440px] leading-relaxed">
              {t("banner_desc" as any)}
            </p>
            <Link href="/custom-cup" className="px-8 py-4 bg-[#3A211E] text-white rounded-full font-bold text-base sm:text-lg hover:bg-[#201817] transition-all shadow-md inline-block">
              {t("banner_btn" as any)}
            </Link>
          </div>
          <div className="w-full md:w-1/2 p-6 sm:p-8 md:p-10 lg:p-12 flex items-center justify-center relative z-0">
            <div className="relative w-full max-w-[480px] aspect-square rounded-[28px] overflow-hidden">
              <Image 
                src="/images/cupfy-custom-cups.jpg" 
                alt="Bộ sưu tập 4 mẫu ly thủy tinh đính họa tiết cá nhân hóa Cupfy" 
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 480px"
              />
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
