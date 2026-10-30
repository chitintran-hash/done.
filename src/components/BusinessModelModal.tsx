import React from 'react';
import {
  X,
  Zap,
  Layers,
  Users,
  TrendingDown,
  PackageCheck,
  Truck,
  Percent,
  HelpCircle,
  ShieldAlert,
  Calculator
} from 'lucide-react';
import { formatVND } from '../utils/pricing';

interface BusinessModelModalProps {
  isOpen: boolean;
  onClose: () => void;
  commissionRate: number;
}

export const BusinessModelModal: React.FC<BusinessModelModalProps> = ({
  isOpen,
  onClose,
  commissionRate,
}) => {
  if (!isOpen) return null;

  const pct = Math.round(commissionRate * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto space-y-6 text-xs">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-[#3155FF] text-white flex items-center justify-center shadow-md">
              <Zap className="w-5 h-5 fill-white" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#0C0D10] block">
                MÔ HÌNH KINH DOANH & DÒNG TIỀN TRUNG GIAN
              </span>
              <h3 className="text-lg sm:text-xl font-black text-slate-900">
                FlashGroup hoạt động thế nào?
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Academic Intermediary Tooltip Box (Req 27) */}
        <div className="bg-[#EEF1FF] border border-indigo-200 rounded-2xl p-4 flex items-start space-x-3">
          <HelpCircle className="w-5 h-5 text-[#3155FF] shrink-0 mt-0.5" />
          <div className="space-y-1 text-indigo-950">
            <div className="font-black text-xs uppercase tracking-wide text-[#0C0D10]">
              Vai trò Sàn trung gian (Marketplace Intermediary)
            </div>
            <p className="font-semibold leading-relaxed">
              FlashGroup không mua lại hàng từ Supplier. Supplier vẫn sở hữu và fulfil sản phẩm. FlashGroup thu phí nền tảng trên giao dịch thành công.
            </p>
            <span className="inline-block bg-[#F3EEFF] text-indigo-800 font-bold text-[11px] px-2.5 py-0.5 rounded-full border border-indigo-300 mt-1">
              Phí nền tảng demo: {pct}%
            </span>
          </div>
        </div>

        {/* 6 Core Steps (Req 28) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {[
            {
              step: '1. Supplier tạo mức giá theo số lượng',
              desc: 'Nhà cung cấp thiết lập bậc thang giá (Price Tiers) giảm dần theo quy mô đơn gom và ước tính biên lợi nhuận.',
              icon: Layers,
              color: 'bg-amber-50 text-amber-700 border-amber-200',
            },
            {
              step: '2. Buyer mua chung',
              desc: 'Người mua tại cùng cụm KTX / chung cư tham gia phòng gom trước hạn chót để cộng dồn sản lượng.',
              icon: Users,
              color: 'bg-[#F5FBD9] text-[#0C0D10] border-[#C7F000]',
            },
            {
              step: '3. Giá giảm khi lượng mua đạt mốc',
              desc: 'Khi tổng số lượng vượt qua từng mốc tier, đơn giá tự động giảm cho toàn bộ thành viên trong phòng.',
              icon: TrendingDown,
              color: 'bg-teal-50 text-teal-700 border-teal-200',
            },
            {
              step: '4. Supplier bán volume lớn hơn',
              desc: 'Nhà cung cấp chốt đơn số lượng lớn trong một lần xuất kho, tối ưu chi phí vận hành và đóng gói.',
              icon: PackageCheck,
              color: 'bg-blue-50 text-blue-700 border-blue-200',
            },
            {
              step: '5. Buyer chia sẻ chi phí giao hàng',
              desc: 'Tổng cước xe gom về điểm nhận (Locker / Hub) được chia đều cho số người tham gia.',
              icon: Truck,
              color: 'bg-[#F3EEFF] text-[#0C0D10] border-[#7B3FF2]/30',
            },
            {
              step: '6. FlashGroup thu phí nền tảng',
              desc: `FlashGroup thu phí nền tảng demo (${pct}%) tính trên tiền hàng (không tính trên phí vận chuyển).`,
              icon: Percent,
              color: 'bg-[#EEF1FF] text-[#0C0D10] border-indigo-200',
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-4 rounded-2xl border border-slate-200 bg-white shadow-sm flex flex-col justify-between space-y-2"
              >
                <div className="space-y-2">
                  <div className={`w-8 h-8 rounded-xl border flex items-center justify-center ${item.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <h4 className="font-black text-slate-900 text-xs">{item.step}</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Example Financial Breakdown (Req 2, 3 & 32) */}
        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-black text-slate-900 text-xs flex items-center gap-2 uppercase tracking-wider">
              <Calculator className="w-4 h-4 text-[#0C0D10]" />
              <span>Ví dụ Minh họa Dòng tiền: Phòng gom Dâu tây Đà Lạt (20 người mua)</span>
            </h4>
            <span className="text-[10px] font-bold text-slate-500">Phí nền tảng demo: 7%</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 1 Unit Breakdown */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
              <div className="font-bold text-slate-900 border-b border-slate-100 pb-1.5">
                A. Trên 1 đơn hàng của Buyer (Số lượng: 1 hộp)
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Đơn giá chốt (Final price):</span>
                <span className="font-bold text-slate-900">{formatVND(89000)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Tiền hàng (Product subtotal):</span>
                <span className="font-bold text-slate-900">{formatVND(89000)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Phí giao chia sẻ (60,000đ / 20 người):</span>
                <span className="font-bold text-slate-900">{formatVND(3000)}</span>
              </div>
              <div className="flex justify-between text-[#0C0D10] font-bold border-t border-slate-100 pt-1.5">
                <span>Tổng Buyer thanh toán:</span>
                <span>{formatVND(92000)}</span>
              </div>
              <div className="flex justify-between text-[#0C0D10] pt-1">
                <span>Phí nền tảng demo (7% × 89,000đ):</span>
                <span className="font-bold">-{formatVND(6230)}</span>
              </div>
              <div className="flex justify-between text-amber-800 font-black">
                <span>Supplier thực nhận (Supplier net):</span>
                <span>{formatVND(82770)}</span>
              </div>
            </div>

            {/* 20 Units Room Breakdown */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
              <div className="font-bold text-slate-900 border-b border-slate-100 pb-1.5">
                B. Toàn bộ Phòng gom (20 hộp • 20 người mua)
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Tổng GMV tiền hàng (20 × 89,000đ):</span>
                <span className="font-bold text-slate-900">{formatVND(1780000)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Tổng phí vận chuyển gom (20 × 3,000đ):</span>
                <span className="font-bold text-slate-900">{formatVND(60000)}</span>
              </div>
              <div className="flex justify-between text-[#0C0D10]">
                <span>Doanh thu phí nền tảng (7% GMV):</span>
                <span className="font-bold">{formatVND(124600)}</span>
              </div>
              <div className="flex justify-between text-[#0C0D10] font-black border-t border-slate-100 pt-1.5">
                <span>Doanh thu ròng Supplier (Net proceeds):</span>
                <span>{formatVND(1655400)}</span>
              </div>
              <p className="text-[10px] text-slate-400 italic pt-1">
                * Lưu ý: Cước vận chuyển không tính vào phí hoa hồng nền tảng. Doanh thu chỉ mở khóa đối soát khi đơn đạt trạng thái Đã nhận hàng (picked_up).
              </p>
            </div>
          </div>
        </div>

        {/* Simulation Disclaimer (Req 29) */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 flex items-center space-x-2.5 text-amber-900">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
          <span className="font-semibold text-[11px]">
            Tất cả giao dịch, phí nền tảng, đối soát và thanh toán trong prototype đều là dữ liệu mô phỏng.
          </span>
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition"
          >
            Đã hiểu mô hình
          </button>
        </div>
      </div>
    </div>
  );
};
