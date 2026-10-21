import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MousePointer2, Paintbrush, Eye, ShoppingBag, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getTranslation } from "@/lib/i18n/server";

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
    <main className="flex flex-col min-h-screen pt-28 md:pt-36 lg:pt-[150px] bg-white">
      
      {/* PHẦN 1: Hero Section phong cách Banner HIPPEAS (Nền vàng Cupfy #FFBF00 + Chữ bên trái) */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 mb-16 md:mb-24 w-full">
        <div className="relative w-full rounded-[32px] md:rounded-[44px] overflow-hidden bg-[#FFBF00] shadow-[0_20px_60px_rgba(255,191,0,0.25)] border border-[#FFBF00]/40 min-h-[460px] md:min-h-[520px] lg:min-h-[560px] flex flex-col lg:flex-row items-center justify-between">
          
          {/* Cột trái: Chữ to ấn tượng + Nút CTA hình con nhộng */}
          <div className="relative z-10 w-full lg:w-[54%] p-8 sm:p-12 md:p-16 flex flex-col items-start">
            
            {/* Tag nhỏ thương hiệu */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/35 backdrop-blur-md border border-white/50 text-[#3A211E] text-xs sm:text-sm font-extrabold uppercase tracking-wider mb-4 sm:mb-5 shadow-sm">
              <Sparkles className="w-4 h-4 text-[#3A211E]" />
              <span>Cá nhân hóa mọi chiếc ly</span>
            </div>

            {/* Tiêu đề khổng lồ đặc trưng Hippeas: Trắng + Nâu chocolate */}
            <h1 className="font-heading font-black text-5xl sm:text-6xl md:text-7xl lg:text-[76px] leading-[0.94] tracking-tight uppercase mb-5 select-none">
              <span className="block text-white drop-shadow-sm">
                CUSTOMIZE
              </span>
              <span className="block text-[#3A211E] mt-1.5">
                YOUR CUP
              </span>
            </h1>

            {/* Mô tả phụ: Nâu chocolate */}
            <p className="text-base sm:text-lg md:text-xl text-[#3A211E] font-medium leading-relaxed mb-8 max-w-[480px]">
              Tự tay thiết kế chiếc ly mang đậm dấu ấn riêng của bạn. Xem 3D trực quan 360°, in ấn theo yêu cầu từ 1 chiếc!
            </p>

            {/* Nút bấm CTA: Nền nâu chocolate chữ trắng, nút phụ nền trắng chữ nâu */}
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/custom-cup"
                className="inline-flex items-center justify-center gap-2 px-9 py-4 bg-[#3A211E] text-white rounded-full font-black text-base sm:text-lg transition-all duration-200 hover:bg-[#201817] hover:scale-105 shadow-[0_10px_25px_rgba(58,33,30,0.25)] group"
              >
                <span>{t("hero_btn_design" as any)}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/products"
                className="inline-flex items-center justify-center px-8 py-4 bg-white hover:bg-[#FFF9E8] text-[#3A211E] rounded-full font-bold text-base transition-all duration-200 border border-white/60 shadow-sm hover:shadow"
              >
                {t("hero_btn_shop" as any)}
              </Link>
            </div>
          </div>

          {/* Cột phải: Để trống chờ hình ảnh kèm thanh trượt từ người dùng */}
          <div className="w-full lg:w-[46%] min-h-[200px] lg:min-h-full flex items-center justify-center p-8 relative">
            {/* Chỗ trống sẵn sàng cho slider hình ảnh */}
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
                {/* Large background number */}
                <span className="absolute -bottom-4 -right-2 text-[100px] font-black text-[#FFF3C4] opacity-60 group-hover:scale-110 transition-transform duration-500 pointer-events-none select-none">
                  0{i + 1}
                </span>

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
          <div className="w-full md:w-1/2 p-10 md:p-16 lg:p-24 z-10 flex flex-col items-start bg-gradient-to-r from-[#FFF9E8] via-[#FFF9E8] to-transparent">
            <h3 className="text-4xl md:text-5xl font-extrabold text-[#3A211E] mb-6 leading-[1.15] tracking-tight">
              {t("banner_title" as any)}
            </h3>
            <p className="text-lg text-[#765B52] mb-10 max-w-[440px] leading-relaxed">
              {t("banner_desc" as any)}
            </p>
            <Link href="/custom-cup" className="px-8 py-4 bg-[#3A211E] text-white rounded-full font-bold text-lg hover:bg-[#201817] transition-all shadow-md inline-block">
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
            <div className="absolute inset-0 bg-gradient-to-r from-[#FFF9E8] via-transparent to-transparent hidden md:block"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-[#FFF9E8] via-transparent to-transparent md:hidden"></div>
          </div>
        </div>
      </section>

    </main>
  );
}
