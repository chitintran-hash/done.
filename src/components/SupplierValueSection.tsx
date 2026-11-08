import React from 'react';
import { SectionHeader } from './ui/SectionHeader';
import { Building2, Package, Coins, BarChart3, ShieldCheck, ArrowRight, Layers, Truck } from 'lucide-react';

interface SupplierValueSectionProps {
  onLearnMore?: () => void;
}

export const SupplierValueSection: React.FC<SupplierValueSectionProps> = ({ onLearnMore }) => {
  const values = [
    {
      icon: <Package className="w-5 h-5 text-[#3155FF]" />,
      title: 'BÁN THEO NHÓM THAY VÌ TỪNG ĐƠN LẺ',
      description:
        'Gom nhu cầu trước từ nhiều người mua cùng khu vực, giúp nhà cung cấp dễ dàng dự đoán số lượng cần thu hoạch và chuẩn bị hàng theo lô.',
    },
    {
      icon: <Truck className="w-5 h-5 text-[#3155FF]" />,
      title: 'TỐI ƯU CHI PHÍ XỬ LÝ & VẬN CHUYỂN',
      description:
        'Thay vì đóng gói và vận chuyển hàng chục đơn lẻ tốn kém, nhà cung cấp giao 1 chuyến xe gom tập trung về Smart Locker hoặc Điểm nhận chung.',
    },
    {
      icon: <Layers className="w-5 h-5 text-[#3155FF]" />,
      title: 'CHỦ ĐỘNG THIẾT LẬP BẬC GIÁ (PRICE TIERS)',
      description:
        'Có công cụ thiết lập mức giá linh hoạt theo số lượng sản phẩm, kiểm soát biên lợi nhuận và theo dõi tiến độ phòng gom trong thời gian thực.',
    },
    {
      icon: <Coins className="w-5 h-5 text-[#3155FF]" />,
      title: 'PHÍ NỀN TẢNG MINH BẠCH (7%)',
      description:
        'Phí nền tảng chỉ tính trên các đơn hàng đã thanh toán thành công (không tính trên cước giao), đối soát và thanh toán rõ ràng cho nhà cung cấp.',
    },
  ];

  return (
    <section className="py-12 px-6 sm:px-8 rounded-3xl bg-white border border-[#E4E8F0] my-8 shadow-xs relative overflow-hidden">
      <div className="relative z-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5FBD9] border border-[#C7F000] text-[11px] font-black uppercase tracking-wider text-[#0C0D10] mb-3 shadow-xs">
          <Building2 className="w-3.5 h-3.5 text-[#3155FF]" />
          <span>DÀNH CHO ĐỐI TÁC CUNG ỨNG</span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
          <div className="max-w-2xl">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#0C0D10] uppercase tracking-tight leading-snug">
              TẠI SAO NHÀ CUNG CẤP LỰA CHỌN FLASHGROUP?
            </h2>
            <p className="text-xs sm:text-sm text-[#596273] font-normal mt-2 leading-relaxed">
              Mô hình mua chung theo lô: gom nhu cầu trước, giảm chi phí xử lý trên mỗi đơn và tối ưu hóa giao nhận chặng cuối về điểm tập trung.
            </p>
          </div>

          {onLearnMore && (
            <button
              onClick={onLearnMore}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#3155FF] hover:bg-[#2444DC] text-white font-extrabold text-xs transition shadow-md shadow-[#3155FF]/20 shrink-0 cursor-pointer"
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
              className="bg-[#F6F7FC] rounded-2xl p-5 border border-[#E4E8F0] hover:border-[#3155FF]/30 hover:bg-white transition-all duration-200"
            >
              <div className="w-10 h-10 rounded-xl bg-[#EEF1FF] border border-[#3155FF]/30 flex items-center justify-center mb-4">
                {v.icon}
              </div>
              <h4 className="font-extrabold text-[#0C0D10] text-xs sm:text-sm uppercase tracking-tight mb-2">
                {v.title}
              </h4>
              <p className="text-xs text-[#596273] leading-relaxed">
                {v.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
