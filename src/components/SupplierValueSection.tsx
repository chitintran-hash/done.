import React from 'react';
import { SectionHeader } from './ui/SectionHeader';
import { Building2, Package, Coins, BarChart3, ShieldCheck, ArrowRight } from 'lucide-react';

interface SupplierValueSectionProps {
  onLearnMore?: () => void;
}

export const SupplierValueSection: React.FC<SupplierValueSectionProps> = ({ onLearnMore }) => {
  const values = [
    {
      icon: <Package className="w-5 h-5 text-[#006EE9]" />,
      title: 'ĐẨY SẢN LƯỢNG LỚN TRONG THỜI GIAN NGẮN',
      description:
        'Cơ chế chốt phòng gom giúp tiêu thụ số lượng lớn sản phẩm (nông sản, đồ gia dụng, đồ ăn) mà không phải gánh chi phí quảng cáo đơn lẻ tốn kém.',
    },
    {
      icon: <Coins className="w-5 h-5 text-[#006EE9]" />,
      title: 'PHÍ NỀN TẢNG MINH BẠCH & ĐỐI SOÁT RÕ RÀNG',
      description:
        'Mức phí sàn demo chỉ 7% trên tiền hàng. Toàn bộ dòng tiền bán hàng và yêu cầu rút tiền đối soát được quản lý minh bạch trên bảng điều khiển NCC.',
    },
    {
      icon: <BarChart3 className="w-5 h-5 text-[#006EE9]" />,
      title: 'TIẾP CẬN CỤM KHÁCH HÀNG KTX & KHU DÂN CƯ',
      description:
        'Kết nối trực tiếp với hàng nghìn sinh viên, cán bộ, cư dân có nhu cầu mua sắm định kỳ tại từng cụm địa bàn siêu cục bộ.',
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-[#006EE9]" />,
      title: 'XÁC MINH DANH TÍNH & BẢO HỘ THƯƠNG HIỆU',
      description:
        'Hồ sơ pháp lý, chứng nhận ATTP và công bố sản phẩm được kiểm duyệt bài bản, xây dựng niềm tin vững chắc đối với người tiêu dùng.',
    },
  ];

  return (
    <section className="py-12 px-6 sm:px-8 rounded-3xl bg-white border border-[#E6E6EE] my-8 shadow-xs relative overflow-hidden">
      <div className="relative z-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F4FFE8] border border-[#D0FFA4] text-[11px] font-black uppercase tracking-wider text-[#000181] mb-3 shadow-xs">
          <Building2 className="w-3.5 h-3.5 text-[#006EE9]" />
          <span>DÀNH CHO ĐỐI TÁC CUNG ỨNG</span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
          <div className="max-w-2xl">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#000181] uppercase tracking-tight leading-snug">
              TẠI SAO NHÀ CUNG CẤP LỰA CHỌN FLASHGROUP?
            </h2>
            <p className="text-xs sm:text-sm text-[#53536A] font-normal mt-2 leading-relaxed">
              Giải pháp phân phối hàng hóa thế hệ mới: giao hàng theo cụm điểm nhận, nhận đơn sỉ từ nhiều người mua nhỏ lẻ, cắt giảm lãng phí trung gian.
            </p>
          </div>

          {onLearnMore && (
            <button
              onClick={onLearnMore}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#006EE9] hover:bg-[#000181] text-white font-extrabold text-xs transition shadow-md shadow-[#006EE9]/20 shrink-0 cursor-pointer"
            >
              <span>Xem chính sách nhà cung cấp</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {values.map((v, i) => (
            <div
              key={i}
              className="bg-[#FCFCF7] rounded-2xl p-5 border border-[#E6E6EE] hover:border-[#83E7FF] hover:bg-white transition-all duration-200"
            >
              <div className="w-10 h-10 rounded-xl bg-[#EFFBFF] border border-[#83E7FF]/40 flex items-center justify-center mb-4">
                {v.icon}
              </div>
              <h4 className="font-extrabold text-[#000181] text-xs sm:text-sm uppercase tracking-tight mb-2">
                {v.title}
              </h4>
              <p className="text-xs text-[#53536A] leading-relaxed">
                {v.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
