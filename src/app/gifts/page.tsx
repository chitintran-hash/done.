import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Gift, Package, Star, Sparkles, Heart, Phone, Mail } from 'lucide-react';
import GiftBoxList from './GiftBoxList';
import { createClient } from '@/lib/supabase/server';

export const metadata: Metadata = {
  title: {
    absolute: 'Ly Cá Nhân Hóa Làm Quà Tặng | Cupfy',
  },
  description: 'Khám phá ý tưởng quà tặng từ những chiếc ly cá nhân hóa tại Cupfy. Tự thiết kế ly in tên, hình ảnh và lời nhắn dành cho người thân, bạn bè.',
  alternates: {
    canonical: 'https://www.cupfy.space/gifts',
  },
  openGraph: {
    title: 'Ly Cá Nhân Hóa Làm Quà Tặng | Cupfy',
    description: 'Khám phá ý tưởng quà tặng từ những chiếc ly cá nhân hóa tại Cupfy. Tự thiết kế ly in tên, hình ảnh và lời nhắn dành cho người thân, bạn bè.',
    url: 'https://www.cupfy.space/gifts',
    siteName: 'Cupfy',
    locale: 'vi_VN',
    type: 'website',
  },
};

export default async function GiftsPage() {
  const supabase = await createClient();
  const { data: giftBoxes } = await supabase
    .from('products')
    .select('id, name, price, description, image_url, stock')
    .in('category', ['gift_box', 'gift'])
    .eq('is_available', true)
    .order('price', { ascending: true });
  return (
    <div className="min-h-screen pt-[100px] md:pt-[120px] pb-24 bg-[#FFF9E8]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Hero Section */}
        <div className="bg-[#FFBF00] rounded-[2.5rem] sm:rounded-[3rem] p-8 sm:p-14 md:p-20 flex flex-col md:flex-row items-center gap-10 md:gap-14 mb-20 shadow-xs border border-[#FFBF00]">
          <div className="w-full md:w-1/2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 border border-[#E8DFD8] text-[11px] font-bold text-[#3A211E] uppercase tracking-wider mb-4 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#3A211E]" />
              Quà Tặng Cá Nhân Hóa
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-[#3A211E] mb-5 leading-tight tracking-tight">
              Gói Trọn <br/><span className="text-white drop-shadow-xs">Yêu Thương</span>
            </h1>
            <p className="text-[#3A211E] text-sm sm:text-base mb-8 max-w-md leading-relaxed font-medium">
              Những chiếc ly độc bản sẽ càng ý nghĩa hơn khi được in tên, hình ảnh kỷ niệm và lời chúc yêu thương từ Cupfy dành tặng cho những người đặc biệt nhất.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link 
                href="/custom-cup" 
                className="px-7 py-3.5 bg-[#3A211E] text-white rounded-full font-bold text-sm hover:bg-[#3A211E]/90 transition-colors shadow-sm flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-[#FFBF00]" />
                Thiết kế món quà của bạn
              </Link>
              <Link 
                href="/products" 
                className="px-7 py-3.5 bg-white text-[#3A211E] border border-[#E8DFD8] rounded-full font-bold text-sm hover:bg-[#FFF3C4]/30 transition-colors shadow-xs"
              >
                Chọn Quà Có Sẵn
              </Link>
            </div>
          </div>
          <div className="w-full md:w-1/2 relative aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden shadow-xl border border-white/20">
            <Image 
              src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&q=80" 
              alt="Hộp quà tặng ly cá nhân hóa cao cấp tại Cupfy" 
              fill 
              priority
              className="object-cover" 
            />
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-20">
          {[
            { icon: Gift, title: "Hộp Quà Cao Cấp", desc: "Hộp quà thiết kế riêng với lót nhung bảo vệ và thiệp viết tay nhắn gửi lời chúc chân thành." },
            { icon: Package, title: "Đóng Gói Chống Sốc An Toàn", desc: "Đảm bảo ly thủy tinh và ly nhựa an toàn tuyệt đối 100% trong suốt quá trình vận chuyển toàn quốc." },
            { icon: Star, title: "Quà Tặng Doanh Nghiệp", desc: "In logo thương hiệu theo yêu cầu với chiết khấu hấp dẫn cho quán cà phê, trà sữa và doanh nghiệp." }
          ].map((feat, idx) => (
            <div key={idx} className="bg-white p-8 rounded-3xl text-center shadow-xs border border-[#E8DFD8] flex flex-col items-center">
              <div className="w-16 h-16 bg-[#FFF9E8] rounded-2xl flex items-center justify-center mb-5 text-[#3A211E] border border-[#E8DFD8]">
                <feat.icon className="w-8 h-8 text-[#FFBF00]" />
              </div>
              <h3 className="font-bold text-lg sm:text-xl text-[#3A211E] mb-2">{feat.title}</h3>
              <p className="text-xs sm:text-sm text-[#765B52] leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>

        {/* Gift Boxes Showcase */}
        <GiftBoxList initialGiftBoxes={giftBoxes || []} />

        {/* Corporate CTA */}
        <div className="bg-white rounded-3xl border border-[#E8DFD8] p-8 sm:p-12 text-center max-w-3xl mx-auto shadow-xs">
          <h2 className="text-2xl sm:text-3xl font-black text-[#3A211E] mb-3">
            Bạn Đang Tìm Quà Tặng Cho Doanh Nghiệp Hoặc Quán Cà Phê?
          </h2>
          <p className="text-sm text-[#765B52] mb-6 max-w-xl mx-auto leading-relaxed">
            Cupfy nhận thiết kế và in ly thủy tinh, ly nhựa số lượng lớn với nhận diện thương hiệu độc quyền. Liên hệ trực tiếp với chúng tôi để nhận báo giá ưu đãi nhất.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a 
              href="mailto:tranchitin2006@gmail.com" 
              className="px-6 py-3.5 bg-[#3A211E] text-white rounded-full font-bold text-sm hover:bg-[#3A211E]/90 transition-colors shadow-sm flex items-center gap-2"
            >
              <Mail className="w-4 h-4 text-[#FFBF00]" />
              tranchitin2006@gmail.com
            </a>
            <a 
              href="tel:0916799627" 
              className="px-6 py-3.5 bg-[#FFBF00] text-[#3A211E] rounded-full font-bold text-sm hover:bg-[#FFBF00]/90 transition-colors shadow-sm flex items-center gap-2 border border-[#FFBF00]"
            >
              <Phone className="w-4 h-4" />
              Hotline: 0916 799 627
            </a>
            <Link 
              href="/custom-cup" 
              className="px-6 py-3.5 bg-white border border-[#E8DFD8] text-[#3A211E] rounded-full font-bold text-sm hover:bg-[#FFF3C4]/30 transition-colors shadow-xs"
            >
              Thử thiết kế mẫu ngay
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
