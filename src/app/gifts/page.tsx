import Image from 'next/image';
import Link from 'next/link';
import { Gift, Package, Star } from 'lucide-react';

export default function GiftsPage() {
  return (
    <div className="min-h-screen pt-[120px] pb-24 bg-[#F7F6F2]">
      <div className="container mx-auto px-6">
        
        {/* Hero */}
        <div className="bg-[#FFF3A6] rounded-[3rem] p-12 md:p-20 flex flex-col md:flex-row items-center gap-12 mb-24">
          <div className="w-full md:w-1/2">
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-[#3B2725] mb-6 leading-tight">
              Gói Trọn <br/><span className="text-[#D9788F]">Yêu Thương</span>
            </h1>
            <p className="text-[#6F625E] text-lg mb-8 max-w-md">
              Những chiếc ly độc bản sẽ càng ý nghĩa hơn khi được bọc trong những hộp quà xinh xắn từ Cupfy. Dành tặng cho những người đặc biệt nhất.
            </p>
            <Link href="/products" className="bg-[#3B2725] text-white px-8 py-4 rounded-full font-bold hover:bg-[#201514] transition-colors inline-block">
              Chọn Quà Ngay
            </Link>
          </div>
          <div className="w-full md:w-1/2 relative aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
            <Image src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&q=80" alt="Gifts" fill className="object-cover" />
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {[
            { icon: Gift, title: "Hộp Quà Cao Cấp", desc: "Hộp quà thiết kế riêng với lót nhung và thiệp viết tay." },
            { icon: Package, title: "Đóng Gói Chống Sốc", desc: "Đảm bảo ly thủy tinh an toàn tuyệt đối trong quá trình vận chuyển." },
            { icon: Star, title: "Quà Tặng Doanh Nghiệp", desc: "In logo số lượng lớn với chiết khấu hấp dẫn cho doanh nghiệp." }
          ].map((feat, idx) => (
            <div key={idx} className="bg-white p-8 rounded-3xl text-center shadow-sm border border-border">
              <div className="w-16 h-16 bg-[#F7F6F2] rounded-full flex items-center justify-center mx-auto mb-6 text-[#D9788F]">
                <feat.icon className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-xl text-[#3B2725] mb-4">{feat.title}</h3>
              <p className="text-[#6F625E]">{feat.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-3xl font-serif font-bold text-[#3B2725] mb-6">Bạn đang tìm quà cho Doanh nghiệp?</h2>
          <p className="text-[#6F625E] mb-8">Liên hệ trực tiếp với chúng tôi để nhận báo giá tốt nhất cho đơn hàng số lượng lớn.</p>
          <a href="mailto:hello@cupfy.vn" className="inline-block border-2 border-[#3B2725] text-[#3B2725] px-8 py-3 rounded-full font-bold hover:bg-[#3B2725] hover:text-white transition-colors">
            Liên hệ báo giá
          </a>
        </div>

      </div>
    </div>
  );
}
