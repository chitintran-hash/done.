import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MousePointer2, Paintbrush, Eye, ShoppingBag } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getTranslation } from "@/lib/i18n/server";

export default async function Home() {
  const { t } = await getTranslation();
  const supabase = await createClient();
  const { data: latestProducts } = await supabase.from("products").select("*").neq("category", "user_custom").limit(4);

  return (
    <main className="flex flex-col min-h-screen pt-28 md:pt-36 lg:pt-[150px] bg-[#F7F6F2]">
      
      {/* PHẦN 1: Hero Section chính */}
      <section className="max-w-[1400px] mx-auto px-6 mb-20 md:mb-28 w-full">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-14 xl:gap-20">
          
          {/* Cột trái: Nội dung chữ (~48%) */}
          <div className="w-full lg:w-[48%] flex flex-col items-start z-10">
            {/* Tiêu đề chính */}
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-[3.25rem] xl:text-[3.6rem] font-bold text-[#3A211E] leading-[1.16] mb-5 tracking-tight">
              <span className="block">{t("hero_title_line1" as any)}</span>
              <span className="block mt-1 sm:mt-1.5">
                {t("hero_title_line2_prefix" as any)}
                <span className="relative inline-block text-[#4A2A25]">
                  {t("hero_title_line2_highlight" as any)}
                  <svg 
                    aria-hidden="true" 
                    viewBox="0 0 240 18" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="absolute -bottom-2 left-0 w-full h-[8px] text-[#BFDCEF] stroke-current pointer-events-none"
                  >
                    <path 
                      d="M3 13C60 4 180 4 237 13" 
                      stroke="currentColor" 
                      strokeWidth="3.5" 
                      strokeLinecap="round" 
                    />
                  </svg>
                </span>
                {t("hero_title_line2_suffix" as any)}
              </span>
            </h1>

            {/* Mô tả */}
            <p className="text-base sm:text-lg text-[#6F625E] leading-[1.7] mb-6 max-w-[500px]">
              {t("hero_desc" as any)}
            </p>

            {/* Thông điệp ngắn */}
            <div className="inline-flex items-center px-4 py-2.5 rounded-xl bg-[#BFDCEF]/25 border-l-[3px] border-[#89BBD9] mb-8">
              <span className="text-[14px] md:text-[15px] font-medium text-[#4A2A25]">
                {t("hero_short_msg" as any)}
              </span>
            </div>

            {/* Hai nút CTA */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
              <Link 
                href="/custom-cup" 
                className="inline-flex items-center justify-center px-8 py-3.5 bg-[#3A211E] text-white rounded-full font-semibold text-base transition-colors duration-200 hover:bg-[#4A2A25] shadow-[0_4px_16px_rgba(58,33,30,0.12)] text-center"
              >
                {t("hero_btn_design" as any)}
              </Link>
              <Link 
                href="/products" 
                className="inline-flex items-center justify-center px-8 py-3.5 bg-white text-[#3A211E] border border-[#DDD8D2] rounded-full font-semibold text-base transition-colors duration-200 hover:bg-[#EDECEA] text-center"
              >
                {t("hero_btn_shop" as any)}
              </Link>
            </div>
          </div>

          {/* Cột phải: Hình ảnh phong cách lifestyle (~52%) */}
          <div className="w-full lg:w-[52%] relative flex items-center justify-center z-10">
            {/* Vầng sáng pastel trang nhã phía sau hình ảnh */}
            <div 
              aria-hidden="true" 
              className="absolute -inset-2 sm:-inset-4 bg-[#BFDCEF]/35 rounded-[36px] blur-2xl -z-10 transform scale-95 pointer-events-none" 
            />

            <div className="relative w-full aspect-[4/3] rounded-[28px] overflow-hidden border border-[#DDD8D2]/70 shadow-[0_20px_50px_rgba(58,33,30,0.08)] bg-white">
              <Image 
                src="/images/hero-slider-1.jpg" 
                alt="Khách hàng tự thiết kế ly cá nhân hoá cùng Cupfy" 
                fill 
                priority 
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 52vw, 700px"
                className="object-cover object-center"
                quality={92}
              />
              {/* Nhãn nhỏ thương hiệu trang nhã */}
              <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 inline-flex items-center px-4 py-1.5 rounded-full bg-white/95 backdrop-blur-md shadow-sm border border-[#DDD8D2]/60 select-none">
                <span className="text-xs sm:text-sm font-semibold text-[#3A211E] tracking-wide">
                  Your cup, your story
                </span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* PHẦN 3: Cách hoạt động */}
      <section className="bg-white py-24 border-y border-[#DDD8D2]">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-extrabold text-[#201817] mb-4">{t("how_title" as any)}</h3>
            <p className="text-[#6F625E] text-lg">{t("how_subtitle" as any)}</p>
          </div>
          <div className="relative grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {/* Decorative dashed line for desktop */}
            <div className="hidden md:block absolute top-[44px] left-[12%] right-[12%] h-[2px] border-t-2 border-dashed border-[#DDD8D2] z-0"></div>

            {[
              { icon: MousePointer2, title: t("how_step1_title" as any), desc: t("how_step1_desc" as any), color: "bg-[#BFDCEF]/40", textColor: "text-[#3A211E]" },
              { icon: Paintbrush, title: t("how_step2_title" as any), desc: t("how_step2_desc" as any), color: "bg-[#FFF3A6]/60", textColor: "text-[#6B463D]" },
              { icon: Eye, title: t("how_step3_title" as any), desc: t("how_step3_desc" as any), color: "bg-[#B9D9EC]/30", textColor: "text-[#4A2A25]" },
              { icon: ShoppingBag, title: t("how_step4_title" as any), desc: t("how_step4_desc" as any), color: "bg-[#EDECEA]", textColor: "text-[#201817]" }
            ].map((step, i) => (
              <div key={i} className="relative bg-[#F7F6F2] rounded-[24px] p-8 text-center flex flex-col items-center hover:-translate-y-1 transition-transform duration-300 border border-[#DDD8D2] shadow-sm hover:shadow-md z-10 overflow-hidden group">
                {/* Large background number */}
                <span className="absolute -bottom-4 -right-2 text-[100px] font-black text-[#EDECEA] opacity-50 group-hover:scale-110 transition-transform duration-500 pointer-events-none select-none">
                  0{i + 1}
                </span>

                <div className={`w-20 h-20 ${step.color} rounded-full flex items-center justify-center mb-6 shadow-sm ${step.textColor} relative z-10 border border-white`}>
                  <step.icon className="w-8 h-8" strokeWidth={2} />
                </div>
                
                <h4 className="text-xl font-bold text-[#201817] mb-3 relative z-10">{step.title}</h4>
                <p className="text-sm text-[#6F625E] leading-relaxed relative z-10">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PHẦN 4: Sản phẩm nổi bật */}
      <section className="max-w-[1400px] mx-auto px-6 py-24 w-full">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h3 className="text-3xl font-extrabold text-[#201817] mb-3">{t("products_title" as any)}</h3>
            <p className="text-[#6F625E] text-lg">{t("products_subtitle" as any)}</p>
          </div>
          <Link href="/products" className="hidden sm:flex items-center gap-2 font-bold text-[#201817] hover:text-[#4A2A25] transition-colors">{t("products_view_all" as any)}<ArrowRight className="w-5 h-5" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {latestProducts?.map((product) => (
            <Link href={`/products/${product.id}`} key={product.id} className="group bg-white rounded-[24px] overflow-hidden border border-[#DDD8D2] hover:border-[#B9D9EC] transition-colors flex flex-col h-full shadow-sm hover:shadow-md">
              <div className="relative aspect-square bg-white overflow-hidden p-8 flex items-center justify-center border-b border-[#DDD8D2]">
                {product.image_url ? (
                  <Image
                    src={product.image_url}
                    alt={`${product.name} - Ly đẹp chính hãng Cupfy`}
                    fill
                    className="object-contain p-8 group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="text-muted-foreground text-sm">No image</div>
                )}
              </div>
              <div className="p-6 flex flex-col flex-grow bg-white">
                <h4 className="font-bold text-lg text-[#201817] mb-2 line-clamp-2 leading-tight">{product.name}</h4>
                <p className="text-sm text-[#6F625E] mb-5">{product.capacity || '500ml'}</p>
                <div className="mt-auto flex items-center justify-between">
                  <span className="font-black text-[#201817] text-lg">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                  </span>
                  <span className="text-[#4A2A25] font-bold text-sm bg-[#F7F6F2] px-4 py-2 rounded-full group-hover:bg-[#4A2A25] group-hover:text-white transition-colors">{t("products_view_detail" as any)}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        <div className="mt-10 flex justify-center sm:hidden">
          <Link href="/products" className="px-8 py-4 bg-white text-[#201817] border border-[#DDD8D2] rounded-full font-bold flex items-center gap-2">{t("products_view_all" as any)}<ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* PHẦN 5: Section custom */}
      <section className="w-full px-4 md:px-6 mb-24">
        <div className="max-w-[1400px] mx-auto bg-[#BFDCEF]/20 rounded-[32px] overflow-hidden flex flex-col md:flex-row items-center relative border border-[#BFDCEF]/30 shadow-sm">
          <div className="w-full md:w-1/2 p-10 md:p-16 lg:p-24 z-10 flex flex-col items-start bg-gradient-to-r from-[#EDECEA] via-[#EDECEA] to-transparent">
            <h3 className="text-4xl md:text-5xl font-extrabold text-[#201817] mb-6 leading-[1.15] tracking-tight">
              {t("banner_title" as any)}
            </h3>
            <p className="text-lg text-[#6F625E] mb-10 max-w-[440px] leading-relaxed">
              {t("banner_desc" as any)}
            </p>
            <Link href="/custom-cup" className="px-8 py-4 bg-[#4A2A25] text-white rounded-full font-bold text-lg hover:bg-[#3A211E] transition-all shadow-md inline-block">
              {t("banner_btn" as any)}
            </Link>
          </div>
          <div className="w-full md:w-1/2 h-[350px] md:h-full md:absolute md:right-0 md:top-0 bottom-0 relative z-0">
            <Image 
              src="/images/hero-slider-1.jpg" 
              alt="Bộ sưu tập ly thủy tinh và ly nhựa cá nhân hóa Cupfy tại Việt Nam" 
              fill
              className="object-contain object-center"
            />
            {/* Fade overlay for smooth transition into the image */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#EDECEA] via-transparent to-transparent hidden md:block"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-[#EDECEA] via-transparent to-transparent md:hidden"></div>
          </div>
        </div>
      </section>

    </main>
  );
}
