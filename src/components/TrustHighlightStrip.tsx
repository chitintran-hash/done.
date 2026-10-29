import React from 'react';
import { TrendingDown, MapPin, Layers, HeartHandshake } from 'lucide-react';

export const TrustHighlightStrip: React.FC = () => {
  const highlights = [
    {
      icon: <TrendingDown className="w-5 h-5 text-[#006EE9]" />,
      title: 'GIÁ CÀNG RẺ KHI CÀNG ĐÔNG',
      description: 'Mở khóa mức giá sỉ ưu đãi khi số lượng thành viên gom cùng đạt mốc.',
      badge: 'Tiết kiệm đến 40%',
      badgeBg: 'bg-[#D0FFA4] text-[#000181]',
    },
    {
      icon: <MapPin className="w-5 h-5 text-[#006EE9]" />,
      title: 'ĐIỂM NHẬN HÀNG TIỆN LỢI',
      description: 'Nhận hàng dễ dàng tại Locker thông minh hoặc điểm gom KTX / Khu dân cư gần bạn.',
      badge: 'Miễn phí lưu kho 24h',
      badgeBg: 'bg-[#83E7FF] text-[#000181]',
    },
    {
      icon: <Layers className="w-5 h-5 text-[#006EE9]" />,
      title: 'MINH BẠCH MỨC GIÁ THEO MỐC',
      description: 'Bậc thang giá và phí giao hàng chia đều hiển thị rõ ràng, không phụ phí ẩn.',
      badge: 'Hợp đồng điện tử',
      badgeBg: 'bg-[#FAF0FF] text-[#000181]',
    },
    {
      icon: <HeartHandshake className="w-5 h-5 text-[#006EE9]" />,
      title: 'HỖ TRỢ NGƯỜI MUA & NHÀ CUNG CẤP',
      description: 'Cam kết SLA phản hồi tiếp nhận khiếu nại trong vòng 03 ngày làm việc.',
      badge: 'SLA 3 ngày',
      badgeBg: 'bg-[#F4FFE8] text-[#000181]',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 py-2">
      {highlights.map((h, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E6E6EE] shadow-xs hover:border-[#83E7FF] hover:shadow-md transition-all duration-200 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="w-10 h-10 rounded-xl bg-[#EFFBFF] border border-[#83E7FF]/40 flex items-center justify-center shrink-0">
                {h.icon}
              </div>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border border-black/10 ${h.badgeBg}`}>
                {h.badge}
              </span>
            </div>
            <h4 className="font-black text-[#000181] text-xs sm:text-sm uppercase tracking-tight mb-1">
              {h.title}
            </h4>
            <p className="text-xs text-[#53536A] font-normal leading-relaxed">
              {h.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
