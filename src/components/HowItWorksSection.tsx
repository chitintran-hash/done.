import React from 'react';
import { SectionHeader } from './ui/SectionHeader';
import { Search, Users, TrendingDown, PackageCheck, ArrowRight } from 'lucide-react';

interface HowItWorksSectionProps {
  onExploreClick?: () => void;
  onExplore?: () => void;
}

export const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({ onExploreClick, onExplore }) => {
  const steps = [
    {
      num: '01',
      icon: <Search className="w-6 h-6 text-[#3155FF]" />,
      title: 'CHỌN PHÒNG GOM',
      description:
        'Tìm kiếm sản phẩm thiết yếu hoặc nông sản tươi đang mở gom gần khu vực KTX hoặc căn hộ của bạn.',
      badge: 'Bán kính < 3km',
    },
    {
      num: '02',
      icon: <Users className="w-6 h-6 text-[#3155FF]" />,
      title: 'THAM GIA CÙNG CỘNG ĐỒNG',
      description:
        'Đăng ký số lượng muốn mua và rủ bạn bè cùng phòng, cùng tầng tham gia để tăng tổng số lượng nhóm.',
      badge: 'Rủ bạn cùng mua',
    },
    {
      num: '03',
      icon: <TrendingDown className="w-6 h-6 text-[#3155FF]" />,
      title: 'ĐẠT MỐC GIÁ TỐT HƠN',
      description:
        'Càng nhiều sản phẩm được gom, bậc giá càng hạ xuống. Toàn bộ người mua cùng được hưởng mức giá chốt thấp nhất.',
      badge: 'Càng đông, càng rẻ',
    },
    {
      num: '04',
      icon: <PackageCheck className="w-6 h-6 text-[#3155FF]" />,
      title: 'NHẬN HÀNG TẠI ĐIỂM NHẬN',
      description:
        'Đơn hàng gom thành lô chung chuyển về Điểm nhận (Locker/Kho KTX). Quét mã QR nhận hàng nhanh chóng và chia đều cước giao.',
      badge: 'Nhận hàng mã QR',
    },
  ];

  return (
    <section className="py-12 px-6 sm:px-8 rounded-3xl bg-[#F5FBD9] border border-[#C7F000] my-8 shadow-xs">
      <SectionHeader
        badge="QUY TRÌNH MUA CHUNG"
        title="CÁCH HOẠT ĐỘNG"
        subtitle="FlashGroup kết nối người mua cùng khu vực địa lý để đặt mua theo lô, giúp nhà cung cấp tối ưu vận chuyển và mang lại giá sỉ cho từng cá nhân."
        align="left"
      />

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
    </section>
  );
};
