import { Metadata } from 'next';
import Link from 'next/link';
import { Mail, Phone, MapPin, Clock, MessageCircle, Send, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Liên Hệ Hỗ Trợ | Cupfy',
  description: 'Thông tin liên hệ, hotline, email và kênh hỗ trợ khách hàng của Cupfy.',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen pt-[100px] md:pt-[120px] pb-24 bg-[#F7F6F2]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        <div className="text-center max-w-xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF3A6] border border-[#DDD8D2] text-[11px] font-bold text-[#4A2A25] uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Chăm Sóc Khách Hàng
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#3A211E] tracking-tight">
            Liên Hệ Với Cupfy
          </h1>
          <p className="text-sm md:text-base text-[#6F625E] mt-2">
            Chúng tôi luôn lắng nghe và hỗ trợ bạn trong suốt quá trình chọn ly, thiết kế và đặt hàng.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-3xl border border-[#DDD8D2] shadow-xs text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-2xl bg-[#FFF3A6] flex items-center justify-center text-[#4A2A25] mb-4">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-[#3A211E] text-base mb-1">Email Hỗ Trợ</h3>
            <p className="text-xs text-[#6F625E] mb-3">Phản hồi trong vòng 2-4 giờ làm việc</p>
            <a href="mailto:tranchitin2006@gmail.com" className="text-sm font-bold text-[#4A2A25] hover:underline">
              tranchitin2006@gmail.com
            </a>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#DDD8D2] shadow-xs text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-2xl bg-[#BFDCEF] flex items-center justify-center text-[#3A211E] mb-4">
              <Phone className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-[#3A211E] text-base mb-1">Hotline / Zalo</h3>
            <p className="text-xs text-[#6F625E] mb-3">Hỗ trợ tư vấn & xác nhận đơn</p>
            <a href="tel:0916799627" className="text-sm font-bold text-[#4A2A25] hover:underline">
              0916 799 627
            </a>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#DDD8D2] shadow-xs text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-800 mb-4">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-[#3A211E] text-base mb-1">Giờ Làm Việc</h3>
            <p className="text-xs text-[#6F625E] mb-3">Thứ Hai đến Chủ Nhật</p>
            <span className="text-sm font-bold text-[#4A2A25]">
              08:00 - 20:00
            </span>
          </div>
        </div>

        {/* Quick Links to Policies */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-[#DDD8D2] shadow-xs">
          <h2 className="font-bold text-lg text-[#3A211E] mb-4">Các Chính Sách & Hướng Dẫn</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs md:text-sm">
            <Link href="/shipping" className="p-3.5 rounded-2xl bg-[#F7F6F2] hover:bg-[#EDECEA] text-[#3A211E] font-bold border border-[#DDD8D2] transition-colors flex items-center justify-between">
              <span>🚚 Chính sách giao hàng (30.000đ)</span>
              <span>→</span>
            </Link>
            <Link href="/returns" className="p-3.5 rounded-2xl bg-[#F7F6F2] hover:bg-[#EDECEA] text-[#3A211E] font-bold border border-[#DDD8D2] transition-colors flex items-center justify-between">
              <span>🔄 Chính sách đổi trả & hoàn tiền</span>
              <span>→</span>
            </Link>
            <Link href="/privacy" className="p-3.5 rounded-2xl bg-[#F7F6F2] hover:bg-[#EDECEA] text-[#3A211E] font-bold border border-[#DDD8D2] transition-colors flex items-center justify-between">
              <span>🔒 Chính sách bảo mật thông tin</span>
              <span>→</span>
            </Link>
            <Link href="/terms" className="p-3.5 rounded-2xl bg-[#F7F6F2] hover:bg-[#EDECEA] text-[#3A211E] font-bold border border-[#DDD8D2] transition-colors flex items-center justify-between">
              <span>📜 Điều khoản sử dụng</span>
              <span>→</span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
