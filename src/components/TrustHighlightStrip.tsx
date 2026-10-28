import React from 'react';
import { TrendingDown, MapPin, Layers, HeartHandshake } from 'lucide-react';

export const TrustHighlightStrip: React.FC = () => {
  const highlights = [
    {
      icon: <TrendingDown className="w-5 h-5 text-blue-600" />,
      title: 'GIÁ CÀNG RẺ KHI CÀNG ĐÔNG',
      description: 'Mở khóa mức giá sỉ ưu đãi khi số lượng thành viên gom cùng đạt mốc.',
      badge: 'Tiết kiệm đến 40%',
    },
    {
      icon: <MapPin className="w-5 h-5 text-blue-600" />,
      title: 'ĐIỂM NHẬN HÀNG TIỆN LỢI',
      description: 'Nhận hàng dễ dàng tại Locker thông minh hoặc điểm gom KTX / Khu dân cư gần bạn.',
      badge: 'Miễn phí lưu kho 24h',
    },
    {
      icon: <Layers className="w-5 h-5 text-blue-600" />,
      title: 'MINH BẠCH MỨC GIÁ THEO MỐC',
      description: 'Bậc thang giá và phí giao hàng chia đều hiển thị rõ ràng, không phụ phí ẩn.',
      badge: 'Hợp đồng điện tử',
    },
    {
      icon: <HeartHandshake className="w-5 h-5 text-blue-600" />,
      title: 'HỖ TRỢ NGƯỜI MUA & NHÀ CUNG CẤP',
      description: 'Cam kết SLA phản hồi tiếp nhận khiếu nại trong vòng 03 ngày làm việc.',
      badge: 'SLA 3 ngày',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 py-2">
      {highlights.map((h, i) => (
        <div
          key={i}
          className="bg-white/90 backdrop-blur-xs rounded-2xl p-4 sm:p-5 border border-light-border shadow-xs hover:border-blue-400 hover:shadow-sm transition-all duration-200 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200/60 flex items-center justify-center shrink-0">
                {h.icon}
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200/80">
                {h.badge}
              </span>
            </div>
            <h4 className="font-extrabold text-brand-dark text-xs sm:text-sm uppercase tracking-tight mb-1">
              {h.title}
            </h4>
            <p className="text-xs text-neutral-text font-normal leading-relaxed">
              {h.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
