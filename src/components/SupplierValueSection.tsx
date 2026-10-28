import React from 'react';
import { SectionHeader } from './ui/SectionHeader';
import { Building2, Package, Coins, BarChart3, ShieldCheck, ArrowRight } from 'lucide-react';

interface SupplierValueSectionProps {
  onLearnMore?: () => void;
}

export const SupplierValueSection: React.FC<SupplierValueSectionProps> = ({ onLearnMore }) => {
  const values = [
    {
      icon: <Package className="w-5 h-5 text-emerald-600" />,
      title: 'ĐẨY SẢN LƯỢNG LỚN TRONG THỜI GIAN NGẮN',
      description:
        'Cơ chế chốt phòng gom giúp tiêu thụ số lượng lớn sản phẩm (nông sản, đồ gia dụng, đồ ăn) mà không phải gánh chi phí quảng cáo đơn lẻ tốn kém.',
    },
    {
      icon: <Coins className="w-5 h-5 text-emerald-600" />,
      title: 'PHÍ NỀN TẢNG MINH BẠCH & ĐỐI SOÁT RÕ RÀNG',
      description:
        'Mức phí sàn demo chỉ 7% trên tiền hàng. Toàn bộ dòng tiền bán hàng và yêu cầu rút tiền đối soát được quản lý minh bạch trên bảng điều khiển NCC.',
    },
    {
      icon: <BarChart3 className="w-5 h-5 text-emerald-600" />,
      title: 'TIẾP CẬN CỤM KHÁCH HÀNG KTX & KHU DÂN CƯ',
      description:
        'Kết nối trực tiếp với hàng nghìn sinh viên, cán bộ, cư dân có nhu cầu mua sắm định kỳ tại từng cụm địa bàn siêu cục bộ.',
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-emerald-600" />,
      title: 'XÁC MINH DANH TÍNH & BẢO HỘ THƯƠNG HIỆU',
      description:
        'Hồ sơ pháp lý, chứng nhận ATTP và công bố sản phẩm được kiểm duyệt bài bản, xây dựng niềm tin vững chắc đối với người tiêu dùng.',
    },
  ];

  return (
    <section className="py-8">
      <div className="bg-gradient-to-br from-slate-900 via-deep-blue to-slate-950 text-white rounded-3xl p-8 sm:p-10 border border-slate-800 shadow-xl relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-[11px] font-black uppercase tracking-wider text-emerald-300 mb-3 shadow-xs">
            <Building2 className="w-3.5 h-3.5" />
            <span>DÀNH CHO ĐỐI TÁC CUNG ỨNG</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
            <div className="max-w-2xl">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white uppercase tracking-tight leading-snug">
                TẠI SAO NHÀ CUNG CẤP LỰA CHỌN FLASHGROUP?
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 font-normal mt-2 leading-relaxed">
                Giải pháp phân phối hàng hóa thế hệ mới: giao hàng theo cụm điểm nhận, nhận đơn sỉ từ nhiều người mua nhỏ lẻ, cắt giảm lãng phí trung gian.
              </p>
            </div>

            {onLearnMore && (
              <button
                type="button"
                onClick={onLearnMore}
                className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition cursor-pointer shadow-md shrink-0 active:scale-98"
              >
                <span>Chính sách Nhà cung cấp</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
            {values.map((v, i) => (
              <div
                key={i}
                className="bg-slate-800/60 backdrop-blur-xs rounded-2xl p-5 border border-slate-700/70 hover:border-emerald-500/50 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center mb-3 text-emerald-400">
                  {v.icon}
                </div>
                <h4 className="font-extrabold text-white text-xs sm:text-sm uppercase tracking-tight mb-1.5">
                  {v.title}
                </h4>
                <p className="text-xs text-slate-300 font-normal leading-relaxed">
                  {v.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
