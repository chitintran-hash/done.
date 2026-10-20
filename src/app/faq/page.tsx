import { Metadata } from 'next';
import Link from 'next/link';
import { HelpCircle, ChevronRight, Sparkles, ShieldCheck, Truck, RotateCcw } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Câu Hỏi Thường Gặp (FAQ) | Cupfy',
  description: 'Giải đáp những thắc mắc thường gặp về đặt mua ly, tự thiết kế ly 3D, giao hàng và đổi trả tại Cupfy.space.',
};

const FAQS = [
  {
    q: 'Tôi có thể tự thiết kế ly theo ý thích như thế nào?',
    a: 'Bạn chỉ cần truy cập trang "Thiết Kế Ly" (/custom-cup), chọn loại ly (thủy tinh hoặc ly nhựa), màu sắc nắp ly, thêm chữ, thay đổi font chữ và tải ảnh/logo lên. Hệ thống sẽ mô phỏng 3D 360° theo thời gian thực để bạn xem trước trước khi bấm Đặt Hàng.'
  },
  {
    q: 'Phí giao hàng của Cupfy là bao nhiêu?',
    a: 'Cupfy áp dụng mức phí giao hàng đồng giá 30.000 VNĐ cho toàn bộ đơn hàng trên toàn quốc, không phụ thuộc vào số lượng sản phẩm.'
  },
  {
    q: 'Phương thức thanh toán của Cupfy là gì?',
    a: 'Hiện tại Cupfy áp dụng phương thức thanh toán khi nhận hàng (COD). Bạn chỉ cần thanh toán đúng số tiền trên đơn hàng cho nhân viên bưu tá khi nhận được kiện hàng.'
  },
  {
    q: 'Thời gian giao hàng mất bao lâu?',
    a: 'Đối với ly có sẵn, thời gian giao hàng từ 2 đến 5 ngày làm việc. Đối với ly thiết kế riêng, đội ngũ Cupfy sẽ kiểm tra file in và tiến hành in ấn trong vòng 1-2 ngày trước khi bàn giao cho đơn vị vận chuyển.'
  },
  {
    q: 'Nếu ly bị nứt vỡ trong lúc vận chuyển thì tôi phải làm sao?',
    a: 'Cupfy cam kết bảo hành 100% rủi ro bể vỡ trong quá trình giao nhận! Bạn chỉ cần chụp ảnh hoặc quay video kiện hàng và liên hệ với chúng tôi qua email tranchitin2006@gmail.com hoặc hotline 0916 799 627. Cupfy sẽ gửi sản phẩm mới hoàn toàn miễn phí hoặc hoàn tiền theo yêu cầu.'
  },
  {
    q: 'Tôi có thể hủy đơn hàng ly custom sau khi đặt không?',
    a: 'Bạn có thể hủy đơn nếu thiết kế chưa được phê duyệt hoặc chưa đưa vào sản xuất in ấn. Nếu sản phẩm đã bắt đầu in, vui lòng liên hệ sớm với hỗ trợ khách hàng để được xem xét theo tình trạng thực tế.'
  }
];

export default function FAQPage() {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  };

  return (
    <div className="min-h-screen pt-[100px] md:pt-[120px] pb-24 bg-[#F7F6F2]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        <div className="text-center max-w-xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF3A6] border border-[#DDD8D2] text-[11px] font-bold text-[#4A2A25] uppercase tracking-wider mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            Trợ Giúp & Hướng Dẫn
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#3A211E] tracking-tight">
            Câu Hỏi Thường Gặp
          </h1>
          <p className="text-sm md:text-base text-[#6F625E] mt-2">
            Tổng hợp những thắc mắc phổ biến nhất của khách hàng về sản phẩm, thiết kế và quy trình giao nhận.
          </p>
        </div>

        <div className="space-y-4 mb-12">
          {FAQS.map((faq, i) => (
            <div key={i} className="bg-white p-6 rounded-3xl border border-[#DDD8D2] shadow-xs space-y-2">
              <h3 className="font-bold text-base text-[#3A211E] flex items-start gap-2.5">
                <span className="w-6 h-6 rounded-full bg-[#FFF3A6] text-[#4A2A25] inline-flex items-center justify-center text-xs font-black shrink-0 mt-0.5">Q</span>
                <span>{faq.q}</span>
              </h3>
              <p className="text-sm text-[#4A3E3D] leading-relaxed pl-8">
                {faq.a}
              </p>
            </div>
          ))}
        </div>

        {/* Quick links to official policies */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-[#DDD8D2] shadow-xs text-center">
          <h2 className="font-bold text-lg text-[#3A211E] mb-2">Xem Chi Tiết Quy Chế Hoạt Động</h2>
          <p className="text-xs text-[#6F625E] mb-6">Đọc thêm các điều khoản chính sách đầy đủ có hiệu lực từ 20/10/2026</p>
          <div className="flex flex-wrap justify-center gap-3 text-xs font-bold">
            <Link href="/privacy" className="px-4 py-2.5 rounded-full bg-[#F7F6F2] hover:bg-[#EDECEA] text-[#3A211E] border border-[#DDD8D2]">
              🔒 Chính sách bảo mật
            </Link>
            <Link href="/terms" className="px-4 py-2.5 rounded-full bg-[#F7F6F2] hover:bg-[#EDECEA] text-[#3A211E] border border-[#DDD8D2]">
              📜 Điều khoản sử dụng
            </Link>
            <Link href="/cookies" className="px-4 py-2.5 rounded-full bg-[#F7F6F2] hover:bg-[#EDECEA] text-[#3A211E] border border-[#DDD8D2]">
              🍪 Chính sách Cookie
            </Link>
            <Link href="/shipping" className="px-4 py-2.5 rounded-full bg-[#F7F6F2] hover:bg-[#EDECEA] text-[#3A211E] border border-[#DDD8D2]">
              🚚 Chính sách giao hàng
            </Link>
            <Link href="/returns" className="px-4 py-2.5 rounded-full bg-[#F7F6F2] hover:bg-[#EDECEA] text-[#3A211E] border border-[#DDD8D2]">
              🔄 Đổi trả & hoàn tiền
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
