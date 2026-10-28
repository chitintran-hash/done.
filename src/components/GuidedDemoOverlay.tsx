import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  X,
  Sparkles,
  Info,
  CheckCircle2,
  Compass,
  ShoppingBag,
  CreditCard,
  Truck,
  QrCode,
  Building2,
  ShieldAlert,
} from 'lucide-react';

export interface GuidedStep {
  stepNumber: number;
  title: string;
  targetRole: 'buyer' | 'supplier' | 'admin';
  targetSelector?: string;
  badge: string;
  instruction: string;
  explanation: string;
}

export const GUIDED_DEMO_STEPS: GuidedStep[] = [
  {
    stepNumber: 1,
    title: 'KHÁM PHÁ PHÒNG GOM',
    targetRole: 'buyer',
    badge: 'BƯỚC 1 / 11 • BUYER',
    instruction: 'Xem danh sách các phòng gom đang hoạt động tại khu vực xung quanh bạn.',
    explanation:
      'FlashGroup nhóm người mua theo địa bàn siêu cục bộ (bán kính gần Smart Locker / KTX / Chung cư) để chia sẻ 100% chi phí vận chuyển chặng cuối.',
  },
  {
    stepNumber: 2,
    title: 'MỞ PHÒNG DÂU DEMO',
    targetRole: 'buyer',
    badge: 'BƯỚC 2 / 11 • BUYER',
    instruction: 'Nhấn vào phòng gom "Dâu Tây Đà Lạt — DEMO".',
    explanation:
      'Phòng gom được thiết kế sẵn cho kịch bản trình bày với biểu tượng 🍓, nhãn DEMO rõ ràng và vị trí tại Smart Locker KTX Khu A.',
  },
  {
    stepNumber: 3,
    title: 'QUAN SÁT TIẾN ĐỘ 19 / 20',
    targetRole: 'buyer',
    badge: 'BƯỚC 3 / 11 • BUYER',
    instruction: 'Quan sát phòng đang có 19 / 20 người tham gia, mức giá hiện tại là 99.000đ.',
    explanation:
      'Giá KHÔNG tự giảm theo thời gian đếm ngược. Giá chỉ giảm khi số lượng thành viên đạt ngưỡng nấc tiếp theo (bậc 20 sản phẩm = 89.000đ).',
  },
  {
    stepNumber: 4,
    title: 'THAM GIA 1 SẢN PHẨM',
    targetRole: 'buyer',
    badge: 'BƯỚC 4 / 11 • BUYER',
    instruction: 'Nhấn nút "Tham gia phòng gom", chọn số lượng 1 hộp và xác nhận.',
    explanation:
      'Lượt tham gia thứ 20 của bạn là mảnh ghép quyết định để đưa cả nhóm vượt ngưỡng bậc giá tối ưu nhất của nhà cung cấp.',
  },
  {
    stepNumber: 5,
    title: 'MỞ KHÓA MỨC GIÁ 89.000đ',
    targetRole: 'buyer',
    badge: 'BƯỚC 5 / 11 • BUYER',
    instruction: 'Quan sát phòng gom đạt 20 / 20 thành viên và kích hoạt bảng thông báo MỞ KHÓA MỨC GIÁ 89.000đ!',
    explanation:
      'Toàn bộ 20 người tham gia đều được hưởng giá 89.000đ/hộp (tiết kiệm thêm 10.000đ/hộp). Mô hình Mua gom siêu cục bộ phát huy tối đa lợi ích nhóm.',
  },
  {
    stepNumber: 6,
    title: 'ĐẾN TRANG THANH TOÁN (CHECKOUT)',
    targetRole: 'buyer',
    badge: 'BƯỚC 6 / 11 • BUYER',
    instruction: 'Nhấn nút "Đến thanh toán" để xác lập hợp đồng giao dịch điện tử từ xa.',
    explanation:
      'Hệ thống hiển thị minh bạch hồ sơ giao kết: thông tin pháp lý nhà cung cấp, xuất xứ, địa chỉ điểm nhận Locker, chính sách bảo hành và đổi trả.',
  },
  {
    stepNumber: 7,
    title: 'XÁC NHẬN THANH TOÁN MÔ PHỎNG',
    targetRole: 'buyer',
    badge: 'BƯỚC 7 / 11 • BUYER',
    instruction: 'Tích chọn xác nhận điều khoản giao dịch từ xa và nhấn "Tôi xác nhận đặt hàng".',
    explanation:
      'Thanh toán mô phỏng an toàn (không trừ tiền thật), tự động tạo bản lưu Snapshot hợp đồng giao dịch bất biến theo Nghị định 55/2024/NĐ-CP.',
  },
  {
    stepNumber: 8,
    title: 'THEO DÕI LOGISTICS LÔ HÀNG',
    targetRole: 'buyer',
    badge: 'BƯỚC 8 / 11 • BUYER',
    instruction: 'Tại tab "Đơn Hàng", xem tiến trình vận chuyển lô gom chung về điểm nhận.',
    explanation:
      'Nhà cung cấp gom 20 sản phẩm vào 1 kiện hàng duy nhất gửi về điểm Smart Locker, giảm 90% lượng phương tiện giao hàng rời rạc trong đô thị.',
  },
  {
    stepNumber: 9,
    title: 'MÃ NHẬN HÀNG LOCKER BẢO MẬT',
    targetRole: 'buyer',
    badge: 'BƯỚC 9 / 11 • BUYER',
    instruction: 'Xem mã QR nhận hàng độc bản của bạn để quét mở ngăn tủ Smart Locker.',
    explanation:
      'Người mua có thể chủ động ghé Locker lấy hàng theo khung giờ rảnh, không bị phụ thuộc vào giờ shipper gọi điện.',
  },
  {
    stepNumber: 10,
    title: 'DOANH THU NHÀ CUNG CẤP (SUPPLIER)',
    targetRole: 'supplier',
    badge: 'BƯỚC 10 / 11 • NCC',
    instruction: 'Dùng Bảng Trình Bày chuyển sang DEMO NCC để xem báo cáo doanh thu & yêu cầu đối soát.',
    explanation:
      'Tổng GMV: 1.780.000đ. Hoa hồng nền tảng 7%: 124.600đ. Thực nhận ròng của NCC: 1.655.400đ (Phí ship 60.000đ không tính vào hoa hồng).',
  },
  {
    stepNumber: 11,
    title: 'TỔNG QUAN QUẢN TRỊ (ADMIN)',
    targetRole: 'admin',
    badge: 'BƯỚC 11 / 11 • ADMIN',
    instruction: 'Chuyển sang DEMO ADMIN để duyệt đối soát, giám sát hợp đồng và kiểm tra tuân thủ.',
    explanation:
      'Admin quản lý toàn diện: duyệt xác minh NCC, đối soát minh bạch, xử lý khiếu nại SLA 3 ngày làm việc và lưu vết sự kiện kiểm toán bất biến.',
  },
];

interface GuidedDemoOverlayProps {
  currentStepIndex: number;
  onNextStep: () => void;
  onPrevStep: () => void;
  onClose: () => void;
  onJumpToStep?: (index: number) => void;
}

export const GuidedDemoOverlay: React.FC<GuidedDemoOverlayProps> = ({
  currentStepIndex,
  onNextStep,
  onPrevStep,
  onClose,
  onJumpToStep,
}) => {
  const step = GUIDED_DEMO_STEPS[currentStepIndex] || GUIDED_DEMO_STEPS[0];
  const isFirst = currentStepIndex === 0;
  const isLast = currentStepIndex === GUIDED_DEMO_STEPS.length - 1;

  return (
    <div
      aria-live="polite"
      className="fixed bottom-20 md:bottom-6 left-4 z-50 max-w-md w-full animate-slide-up font-sans"
    >
      <div className="bg-[#211A22]/95 backdrop-blur-md text-white rounded-3xl p-5 border-2 border-[#F3B37A] shadow-2xl space-y-3.5 relative overflow-hidden">
        {/* Top Glow Ribbon */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#F3B37A] via-[#C77C86] to-[#68415F]" />

        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] font-black uppercase text-[#F3B37A] tracking-wider block">
              {step.badge}
            </span>
            <h3 className="text-sm font-black text-white leading-tight">{step.title}</h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition cursor-pointer"
            title="Đóng hướng dẫn demo"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Progress Dots */}
        <div className="flex items-center gap-1.5 py-1">
          {GUIDED_DEMO_STEPS.map((s, idx) => (
            <button
              key={s.stepNumber}
              type="button"
              onClick={() => onJumpToStep && onJumpToStep(idx)}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                idx === currentStepIndex
                  ? 'w-6 bg-[#F3B37A]'
                  : idx < currentStepIndex
                  ? 'w-2 bg-[#68415F]'
                  : 'w-2 bg-white/20'
              }`}
              title={`Bước ${s.stepNumber}: ${s.title}`}
            />
          ))}
        </div>

        {/* Instruction Spotlight Box */}
        <div className="bg-[#3A2438]/80 rounded-2xl p-3 border border-[#F3B37A]/40 space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-black text-[#F3B37A]">
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span>THAO TÁC CẦN THỰC HIỆN:</span>
          </div>
          <p className="text-xs text-white font-medium leading-relaxed">{step.instruction}</p>
        </div>

        {/* Context / Business Logic Explanation */}
        <p className="text-[11px] text-[#CBBFC6] leading-relaxed italic">
          💡 {step.explanation}
        </p>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-1 border-t border-white/10 text-xs">
          <button
            type="button"
            onClick={onPrevStep}
            disabled={isFirst}
            className="px-3 py-1.5 rounded-xl border border-white/20 text-[#FFF8F1] hover:bg-white/10 font-bold flex items-center gap-1 transition disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Trước</span>
          </button>

          <span className="text-[10px] text-[#CBBFC6] font-bold">
            {currentStepIndex + 1} / {GUIDED_DEMO_STEPS.length}
          </span>

          <button
            type="button"
            onClick={onNextStep}
            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#F3B37A] to-[#E8957B] hover:opacity-90 text-[#211A22] font-black flex items-center gap-1 transition shadow-md shadow-[#F3B37A]/20 cursor-pointer active:scale-95"
          >
            <span>{isLast ? 'Hoàn thành' : 'Tiếp tục'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
