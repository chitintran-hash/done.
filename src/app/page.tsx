import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MousePointer2, Paintbrush, Eye, ShoppingBag, Sparkles, Star } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getTranslation } from "@/lib/i18n/server";
import HeroSlider from "@/components/HeroSlider";

export default async function Home() {
  const { t } = await getTranslation();
  const supabase = await createClient();
  const { data: latestProducts } = await supabase.from("products").select("*").neq("category", "user_custom").limit(4);

  return (
    <main className="flex flex-col min-h-screen pt-[112px] bg-[#F7F6F2]">
      
      {/* PHẦN 1: Banner thương hiệu lớn */}
      <section className="w-full px-4 md:px-6 mb-16 md:mb-24 mt-4">
        <div className="mx-auto w-full md:w-[88%] h-[300px] md:h-[380px] rounded-[32px] shadow-[0_10px_40px_rgba(0,0,0,0.04)] relative overflow-hidden flex flex-col items-center justify-center bg-gradient-to-r from-[#F7F6F2] to-[#D9ECF8]">
          <Sparkles className="absolute top-12 left-[20%] text-[#4A2A25] opacity-40 w-8 h-8" />
          <Star className="absolute bottom-16 right-[25%] text-[#BFDCEF] opacity-80 w-6 h-6 fill-current" />
          <Star className="absolute top-24 right-[15%] text-[#F7F6F2] opacity-90 w-4 h-4 fill-current" />
          <Sparkles className="absolute bottom-20 left-[30%] text-[#FFCFE0] opacity-60 w-5 h-5" />
          
          <h1 className="text-7xl md:text-[8rem] font-black text-[#3A211E] tracking-widest mb-2 z-10 uppercase">
            CUPFY
          </h1>
          <p className="text-lg md:text-2xl text-[#6F625E] font-medium z-10 text-center px-4 tracking-wide">
            Chiếc ly của bạn, câu chuyện của bạn
          </p>
        </div>
      </section>

      {/* PHẦN 2: Section giới thiệu chính */}
      <section className="max-w-[1400px] mx-auto px-6 mb-24 w-full">
        <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
          
          {/* Cột trái: Nội dung chữ */}
          <div className="w-full md:w-1/2 flex flex-col items-start z-10">
            <h2 className="text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold text-[#201817] leading-[1.15] mb-6 tracking-tight">
              Tự thiết kế chiếc ly mang <span className="text-[#6B463D] italic font-serif">dấu ấn riêng</span> của bạn
            </h2>
            <p className="text-lg text-[#6F625E] mb-4 leading-relaxed max-w-[500px]">
              Cupfy giúp bạn chọn mẫu ly, thêm chữ, hình ảnh hoặc nét vẽ cá nhân, sau đó xem trước và đặt làm chiếc ly dành riêng cho mình.
            </p>
            <p className="text-md text-[#6F625E] font-medium mb-10 opacity-80 border-l-2 border-[#B9D9EC] pl-4">
              Không cần biết thiết kế. Chỉ cần có một ý tưởng.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link href="/custom-cup" className="px-8 py-4 bg-[#4A2A25] text-white rounded-full font-bold text-lg flex items-center justify-center hover:bg-[#3A211E] transition-colors shadow-[0_8px_20px_rgba(0,0,0,0.1)]">
                Thiết kế ly ngay
              </Link>
              <Link href="/templates" className="px-8 py-4 bg-white text-[#201817] border border-[#DDD8D2] rounded-full font-bold text-lg flex items-center justify-center hover:bg-[#EDECEA] transition-colors">
                Khám phá cửa hàng
              </Link>
            </div>
          </div>

          {/* Cột phải: Slider ảnh */}
          <div className="w-full md:w-1/2 flex flex-col gap-5 z-10">
            <HeroSlider />
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 mt-1 text-sm font-semibold text-[#6F625E]">
              <span className="flex items-center gap-1.5"><Star className="w-4 h-4 text-[#4A2A25] fill-current"/> Tự vẽ ở bất cứ đâu</span>
              <span className="flex items-center gap-1.5"><Star className="w-4 h-4 text-[#4A2A25] fill-current"/> Biến ý tưởng thành chiếc ly thật</span>
              <span className="flex items-center gap-1.5"><Star className="w-4 h-4 text-[#4A2A25] fill-current"/> Thiết kế cho chính mình hoặc quà tặng</span>
            </div>
          </div>
        </div>
      </section>

      {/* PHẦN 3: Cách hoạt động */}
      <section className="bg-white py-24 border-y border-[#DDD8D2]">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-extrabold text-[#201817] mb-4">Cách thức hoạt động</h3>
            <p className="text-[#6F625E] text-lg">4 bước đơn giản để sở hữu chiếc ly trong mơ</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: MousePointer2, title: "Chọn mẫu ly", desc: "Đa dạng kiểu dáng từ ly thuỷ tinh đến ly giữ nhiệt" },
              { icon: Paintbrush, title: "Thêm thiết kế", desc: "Cá nhân hoá với hình vẽ, chữ, và sticker" },
              { icon: Eye, title: "Xem trước 3D", desc: "Trải nghiệm hình ảnh thực tế đa chiều" },
              { icon: ShoppingBag, title: "Đặt hàng", desc: "Nhận chiếc ly độc bản ngay tại nhà" }
            ].map((step, i) => (
              <div key={i} className="bg-[#F7F6F2] rounded-[24px] p-8 text-center flex flex-col items-center hover:-translate-y-1 transition-transform duration-300">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm text-[#4A2A25]">
                  <step.icon className="w-8 h-8" strokeWidth={1.75} />
                </div>
                <h4 className="text-xl font-bold text-[#201817] mb-3">{step.title}</h4>
                <p className="text-sm text-[#6F625E] leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PHẦN 4: Sản phẩm nổi bật */}
      <section className="max-w-[1400px] mx-auto px-6 py-24 w-full">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h3 className="text-3xl font-extrabold text-[#201817] mb-3">Khám phá mẫu ly yêu thích</h3>
            <p className="text-[#6F625E] text-lg">Những mẫu ly được lựa chọn nhiều nhất tuần qua</p>
          </div>
          <Link href="/products" className="hidden sm:flex items-center gap-2 font-bold text-[#201817] hover:text-[#4A2A25] transition-colors">
            Xem tất cả <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {latestProducts?.map((product) => (
            <Link href={`/products/${product.id}`} key={product.id} className="group bg-white rounded-[24px] overflow-hidden border border-[#DDD8D2] hover:border-[#B9D9EC] transition-colors flex flex-col h-full shadow-sm hover:shadow-md">
              <div className="relative aspect-square bg-white overflow-hidden p-8 flex items-center justify-center border-b border-[#DDD8D2]">
                {product.image_url ? (
                  <Image
                    src={product.image_url}
                    alt={product.name}
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
                  <span className="text-[#4A2A25] font-bold text-sm bg-[#F7F6F2] px-4 py-2 rounded-full group-hover:bg-[#4A2A25] group-hover:text-white transition-colors">
                    Xem chi tiết
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        <div className="mt-10 flex justify-center sm:hidden">
          <Link href="/products" className="px-8 py-4 bg-white text-[#201817] border border-[#DDD8D2] rounded-full font-bold flex items-center gap-2">
            Xem tất cả <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* PHẦN 5: Section custom */}
      <section className="w-full px-4 md:px-6 mb-24">
        <div className="max-w-[1400px] mx-auto bg-[#BFDCEF]/20 rounded-[32px] overflow-hidden flex flex-col md:flex-row items-center relative border border-[#BFDCEF]/30 shadow-sm">
          <div className="w-full md:w-1/2 p-10 md:p-16 lg:p-24 z-10 flex flex-col items-start bg-gradient-to-r from-[#EDECEA] via-[#EDECEA] to-transparent">
            <h3 className="text-4xl md:text-5xl font-extrabold text-[#201817] mb-6 leading-[1.15] tracking-tight">
              Một chiếc ly không cần giống bất kỳ ai
            </h3>
            <p className="text-lg text-[#6F625E] mb-10 max-w-[440px] leading-relaxed">
              Bạn có thể thêm tên, ngày kỷ niệm, hình vẽ, sticker, quote hoặc phong cách riêng của mình lên chiếc ly.
            </p>
            <Link href="/custom-cup" className="px-8 py-4 bg-[#4A2A25] text-white rounded-full font-bold text-lg hover:bg-[#3A211E] transition-all shadow-md inline-block">
              Bắt đầu thiết kế
            </Link>
          </div>
          <div className="w-full md:w-1/2 h-[350px] md:h-full md:absolute md:right-0 md:top-0 bottom-0 relative z-0">
            <Image 
              src="/images/hero-slider-1.jpg" 
              alt="Custom cup examples" 
              fill
              className="object-cover object-center"
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
