import React from 'react';
import { SectionHeader } from './ui/SectionHeader';
import {
  Search,
  Users,
  TrendingDown,
  PackageCheck,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Calculator,
  Truck,
  Building2,
  HelpCircle,
} from 'lucide-react';

interface HowItWorksSectionProps {
  onExploreClick?: () => void;
  onExplore?: () => void;
}

export const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({ onExploreClick, onExplore }) => {
  const steps = [
    {
      num: '01',
      icon: <Search className="w-6 h-6 text-[#3155FF]" />,
      title: 'CHỌN PHÒNG GOM GẦN BẠN',
      description:
        'Tìm kiếm sản phẩm thiết yếu, nông sản tươi đang mở gom gần khu vực KTX, chung cư hoặc văn phòng của bạn trên FlashMap.',
      badge: 'Bán kính gần bạn',
    },
    {
      num: '02',
      icon: <Users className="w-6 h-6 text-[#3155FF]" />,
      title: 'THAM GIA CÙNG CỘNG ĐỒNG',
      description:
        'Đăng ký số lượng muốn mua và rủ bạn bè cùng khu vực tham gia để tăng tổng số lượng của nhóm.',
      badge: 'Rủ bạn cùng mua',
    },
    {
      num: '03',
      icon: <TrendingDown className="w-6 h-6 text-[#3155FF]" />,
      title: 'MỞ KHÓA GIÁ THEO SỐ LƯỢNG',
      description:
        'Khi tổng số lượng đạt mốc, bậc giá tiếp theo được mở khóa. Toàn bộ người mua cùng nhận mức giá chốt theo bậc số lượng đạt được.',
      badge: 'Càng đông, càng rẻ',
    },
    {
      num: '04',
      icon: <PackageCheck className="w-6 h-6 text-[#3155FF]" />,
      title: 'NHẬN HÀNG TẠI ĐIỂM NHẬN',
      description:
        'Đơn hàng gom thành lô chung chuyển về Smart Locker hoặc Điểm nhận. Quét mã QR/PIN nhận hàng 24/7 và chia sẻ cước giao.',
      badge: 'Smart Locker 24/7',
    },
  ];

  return (
    <section className="py-12 px-6 sm:px-8 rounded-3xl bg-[#F5FBD9] border border-[#C7F000] my-8 shadow-xs space-y-8">
      <SectionHeader
        badge="QUY TRÌNH MUA CHUNG"
        title="CÁCH HOẠT ĐỘNG"
        subtitle="Gom nhu cầu gần nhau, mở khóa mức giá theo số lượng và chia sẻ chi phí giao nhận về Smart Locker / điểm nhận gần bạn."
        align="left"
      />

      {/* 4 Process Steps */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {steps.map((st, i) => (
          <div
            key={i}
            className="bg-white rounded-3xl p-6 border border-[#E4E8F0] shadow-xs hover:border-[#3155FF]/30 hover:shadow-md transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 relative overflow-hidden"
          >
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="w-12 h-12 rounded-2xl bg-[#F6F7FC] border border-[#E4E8F0] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                  {st.icon}
                </div>
                <span className="font-mono font-black text-2xl text-[#E4E8F0] group-hover:text-[#3155FF] transition-colors">
                  {st.num}
                </span>
              </div>

              <div className="mb-2">
                <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-[#C7F000] text-[#0C0D10] border border-[#3155FF]/20">
                  {st.badge}
                </span>
              </div>

              <h3 className="font-black text-[#0C0D10] text-sm sm:text-base uppercase tracking-tight mb-2 group-hover:text-[#3155FF] transition-colors">
                {st.title}
              </h3>
              <p className="text-xs text-[#596273] font-normal leading-relaxed">
                {st.description}
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-[#E4E8F0] flex items-center justify-between text-[11px] font-bold text-[#596273] group-hover:text-[#3155FF] transition-colors">
              <span>Bước {i + 1}/4</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>

      {/* Strategic Positioning & Market Context (Phần 3, 4, 8, 9) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
        {/* Box 1: FlashGroup phù hợp khi nào? */}
        <div className="bg-white rounded-3xl p-6 border border-[#E4E8F0] shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#F5FBD9] text-[#0C0D10] border border-[#C7F000]">
              <CheckCircle2 className="w-4 h-4 text-[#0C0D10]" />
            </div>
            <h4 className="font-black text-xs uppercase tracking-wider text-[#0C0D10]">
              FlashGroup phù hợp khi nào?
            </h4>
          </div>
          <ul className="text-xs text-[#596273] space-y-2 leading-relaxed">
            <li className="flex items-start gap-1.5">
              <span className="text-[#3155FF] font-black">•</span>
              <span>Nhiều người gần nhau (KTX, chung cư, văn phòng) cần cùng một sản phẩm.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-[#3155FF] font-black">•</span>
              <span>Nhà cung cấp có khả năng giảm giá theo bậc số lượng của nhóm.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-[#3155FF] font-black">•</span>
              <span>Có thể giao theo lô và có điểm nhận hàng thuận tiện (Smart Locker 24/7).</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-[#3155FF] font-black">•</span>
              <span>Tổng chi phí mua chung thấp hơn hoặc hợp lý hơn mua từng đơn riêng lẻ.</span>
            </li>
          </ul>
        </div>

        {/* Box 2: Khi nào không nên dùng FlashGroup? */}
        <div className="bg-white rounded-3xl p-6 border border-[#E4E8F0] shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-50 text-amber-700 border border-amber-200">
              <AlertCircle className="w-4 h-4 text-amber-600" />
            </div>
            <h4 className="font-black text-xs uppercase tracking-wider text-[#0C0D10]">
              Khi nào không nên dùng?
            </h4>
          </div>
          <p className="text-xs text-[#596273] leading-relaxed">
            Không phải sản phẩm nào cũng phù hợp với mô hình mua chung.
          </p>
          <ul className="text-xs text-[#596273] space-y-2 leading-relaxed">
            <li className="flex items-start gap-1.5">
              <span className="text-amber-600 font-black">•</span>
              <span>Nếu giá bán lẻ trên thị trường đã thấp hơn, việc gom nhóm không tạo thêm lợi ích.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-amber-600 font-black">•</span>
              <span>Khi bạn cần giao gấp từng món riêng lẻ trong 1–2 giờ mà không muốn chờ phòng gom chốt.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-amber-600 font-black">•</span>
              <span>Trong các trường hợp đó, người dùng có thể chọn kênh mua sắm khác phù hợp hơn.</span>
            </li>
          </ul>
        </div>

        {/* Box 3: Vì sao Nhà cung cấp có thể giảm giá? */}
        <div className="bg-white rounded-3xl p-6 border border-[#E4E8F0] shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#EEF1FF] text-[#3155FF] border border-[#3155FF]/30">
              <Building2 className="w-4 h-4 text-[#3155FF]" />
            </div>
            <h4 className="font-black text-xs uppercase tracking-wider text-[#0C0D10]">
              Vì sao NCC có thể giảm giá?
            </h4>
          </div>
          <p className="text-xs text-[#596273] leading-relaxed">
            Khi tổng số lượng tăng, nhà cung cấp có thể xử lý đơn theo lô, giảm chi phí xử lý trên mỗi đơn và tối ưu hóa vận chuyển một chuyến thay vì giao lẻ phân tán.
          </p>
          <div className="p-2.5 rounded-xl bg-[#F6F7FC] border border-[#E4E8F0] text-[11px] text-[#596273]">
            <strong className="text-[#0C0D10] block mb-0.5">Nhóm sản phẩm phù hợp nhất:</strong>
            Nông sản tươi, thực phẩm, sản phẩm theo mùa, hàng tiêu dùng và nguồn cung trực tiếp có lợi thế khi gom đơn theo lô.
          </div>
        </div>
      </div>

      {/* Transparent Total Cost Banner (Phần 5) */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E4E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[#EEF1FF] text-[#3155FF] shrink-0">
            <Calculator className="w-5 h-5 text-[#3155FF]" />
          </div>
          <div>
            <div className="font-black text-slate-900 uppercase tracking-wide">
              Minh bạch Tổng chi phí (Total Cost of Ownership)
            </div>
            <div className="text-slate-500 mt-0.5">
              Tổng thanh toán = <strong>Đơn giá sản phẩm theo bậc</strong> + <strong>Phí giao nhận chia sẻ</strong>. FlashGroup tạo giá trị từ cả bậc giá số lượng và tối ưu cước giao chặng cuối.
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-[#F6F7FC] px-4 py-2 rounded-xl border border-[#E4E8F0] font-mono font-bold text-[#0C0D10] shrink-0 text-center sm:text-right">
          <span>Ví dụ: 89.000đ (sản phẩm) + 3.000đ (ship chia sẻ) = 92.000đ</span>
        </div>
      </div>
    </section>
  );
};
