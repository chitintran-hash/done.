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
    badge: 'BƯỚC 1 / 21 • BUYER',
    instruction: 'Xem danh sách các phòng gom đang hoạt động tại khu vực xung quanh bạn.',
    explanation:
      'FlashGroup nhóm người mua theo địa bàn siêu cục bộ (bán kính gần Smart Locker / KTX / Chung cư) để chia sẻ 100% chi phí vận chuyển chặng cuối.',
  },
  {
    stepNumber: 2,
    title: 'MỞ PHÒNG DÂU DEMO',
    targetRole: 'buyer',
    badge: 'BƯỚC 2 / 21 • BUYER',
    instruction: 'Nhấn vào phòng gom "Dâu Tây Đà Lạt — DEMO".',
    explanation:
      'Phòng gom được thiết kế sẵn cho kịch bản trình bày với biểu tượng 🍓, nhãn DEMO rõ ràng và vị trí tại Smart Locker KTX Khu A.',
  },
  {
    stepNumber: 3,
    title: 'QUAN SÁT TIẾN ĐỘ 19 / 20 SUẤT',
    targetRole: 'buyer',
    badge: 'BƯỚC 3 / 21 • BUYER',
    instruction: 'Quan sát phòng đang có 19 / 20 suất đã đặt (18 người tham gia), mức giá hiện tại là 99.000đ.',
    explanation:
      'Giá KHÔNG tự giảm theo thời gian đếm ngược. Giá chỉ giảm khi tổng số lượng sản phẩm đạt ngưỡng nấc tiếp theo (bậc 20 suất = 89.000đ).',
  },
  {
    stepNumber: 4,
    title: 'THAM GIA 1 SẢN PHẨM',
    targetRole: 'buyer',
    badge: 'BƯỚC 4 / 21 • BUYER',
    instruction: 'Nhấn nút "THAM GIA PHÒNG GOM", chọn số lượng 1 hộp và bấm Xác nhận.',
    explanation:
      'Hành động này đẩy tổng số lượng lên 20 suất, vừa đủ kích hoạt nấc giảm giá sâu nhất (89.000đ).',
  },
  {
    stepNumber: 5,
    title: 'GIÁ GIẢM XUỐNG 89.000đ',
    targetRole: 'buyer',
    badge: 'BƯỚC 5 / 21 • BUYER',
    instruction: 'Chứng kiến phòng đạt 20/20 suất và giá toàn nhóm lập tức hạ xuống 89.000đ.',
    explanation:
      'Cơ chế Dynamic Price Tier tính theo tổng số lượng (totalQuantity) được áp dụng cho toàn bộ người trong phòng khi chốt phòng.',
  },
  {
    stepNumber: 6,
    title: 'RÀ SOÁT HỢP ĐỒNG & THANH TOÁN',
    targetRole: 'buyer',
    badge: 'BƯỚC 6 / 21 • BUYER',
    instruction: 'Xem màn hình Checkout, tích chọn đồng ý điều khoản giao dịch từ xa và bấm Đặt hàng.',
    explanation:
      'Tổng tiền 1 suất: 89.000đ + 3.000đ ship chia sẻ = 92.000đ. Phí nền tảng 7% không thu trên tiền ship.',
  },
  {
    stepNumber: 7,
    title: 'THEO DÕI GIAO HÀNG CHUNG & MÃ LOCKER',
    targetRole: 'buyer',
    badge: 'BƯỚC 7 / 21 • BUYER',
    instruction: 'Xem đơn hàng với mã nhận hàng 6 ký tự và timeline theo dõi chuyển hàng về Locker.',
    explanation:
      'Nhận hàng không tiếp xúc tại Smart Locker KTX Khu A với mã PIN bí mật và mã QR tiện lợi.',
  },
  {
    stepNumber: 8,
    title: 'CHUYỂN SANG VAI TRÒ NHÀ CUNG CẤP',
    targetRole: 'supplier',
    badge: 'BƯỚC 8 / 21 • SUPPLIER',
    instruction: 'Trên thanh Presenter Panel bên dưới, nhấn chuyển sang vai trò "NCC".',
    explanation:
      'Giao diện nhà cung cấp cho phép kiểm tra đơn hàng theo lô, chuẩn bị hàng và theo dõi doanh thu đối soát.',
  },
  {
    stepNumber: 9,
    title: 'KIỂM TRA TÀI CHÍNH NHÀ CUNG CẤP',
    targetRole: 'supplier',
    badge: 'BƯỚC 9 / 21 • SUPPLIER',
    instruction: 'Vào mục "Doanh thu" kiểm tra số liệu: Doanh thu gộp 1.780.000đ, phí sàn 124.600đ, thực nhận 1.655.400đ.',
    explanation:
      'Toán tài chính hoàn toàn nhất quán: 20 × 89.000 = 1.780.000đ; 1.780.000 × 7% = 124.600đ; NCC nhận 1.655.400đ.',
  },
  {
    stepNumber: 10,
    title: 'CHUYỂN SANG VAI TRÒ QUẢN TRỊ VIÊN',
    targetRole: 'admin',
    badge: 'BƯỚC 10 / 21 • ADMIN',
    instruction: 'Trên thanh Presenter Panel, nhấn chuyển sang "ADMIN".',
    explanation:
      'Quản trị viên có toàn quyền kiểm soát sàn, theo dõi đối soát hoa hồng 7% và hồ sơ tuân thủ pháp lý.',
  },
  {
    stepNumber: 11,
    title: 'XEM ĐỐI SOÁT & KHIẾU NẠI ADMIN',
    targetRole: 'admin',
    badge: 'BƯỚC 11 / 21 • ADMIN',
    instruction: 'Vào tab Finance kiểm tra doanh thu sàn 124.600đ và tab Compliance xem hồ sơ pháp lý.',
    explanation:
      'Hoàn tất chu trình mua gom chuẩn 3 vai trò: Buyer mua rẻ -> NCC bán sỉ tối ưu -> Admin vận hành minh bạch.',
  },
  // FlashGrowth Ecosystem Extension (Phần AP)
  {
    stepNumber: 12,
    title: 'FLASHMATCH: TẠO NHU CẦU MUA GOM',
    targetRole: 'buyer',
    badge: 'BƯỚC 12 / 21 • FLASHGROWTH',
    instruction: 'Mở FlashMatch Demand Pool và quan sát cách Buyer tạo nhu cầu gom hàng mới.',
    explanation:
      'Thay vì bị động chờ đợi, người mua chủ động gom nhu cầu để mời gọi các nhà cung cấp uy tín gửi chào giá.',
  },
  {
    stepNumber: 13,
    title: 'FLASHCOMMIT: TÍN HIỆU CAM KẾT MUA',
    targetRole: 'buyer',
    badge: 'BƯỚC 13 / 21 • FLASHGROWTH',
    instruction: 'Thiết lập mức cam kết mua thực: Sẵn sàng mua nếu giá đạt ngưỡng <= 95.000đ.',
    explanation:
      'Tín hiệu cam kết số lượng giúp Supplier an tâm đưa ra offer giá sỉ tốt nhất mà không xâm phạm dữ liệu cá nhân.',
  },
  {
    stepNumber: 14,
    title: 'FLASHMERGE: GỘP NHU CẦU TƯƠNG ĐỒNG',
    targetRole: 'buyer',
    badge: 'BƯỚC 14 / 21 • FLASHGROWTH',
    instruction: 'Nhấn "Xác nhận Gộp Nhu Cầu" giữa 2 nhóm nước khoáng gần nhau (22 + 10 = 32 suất).',
    explanation:
      'FlashMerge giúp rút ngắn thời gian gom, tăng tỷ lệ hoàn thành phòng và giúp mở khóa ngay nấc giá sỉ sâu hơn.',
  },
  {
    stepNumber: 15,
    title: 'SUPPLIER: GỬI CHÀO GIÁ OFFER',
    targetRole: 'supplier',
    badge: 'BƯỚC 15 / 21 • SUPPLIER',
    instruction: 'Chuyển sang NCC, vào Bảng Nhu Cầu (Request Board) và gửi chào giá bậc thang.',
    explanation:
      'Nhà cung cấp chủ động tiếp cận tập khách hàng đã có sẵn nhu cầu gom chung, giảm chi phí tìm kiếm khách hàng.',
  },
  {
    stepNumber: 16,
    title: 'CHỌN OFFER & CHỐT PHÒNG GOM',
    targetRole: 'buyer',
    badge: 'BƯỚC 16 / 21 • BUYER',
    instruction: 'Nhóm người mua chấp thuận Offer chính (có Offer dự phòng Backup Offer lưu trữ an toàn).',
    explanation:
      'Đảm bảo chuỗi cung ứng không bị đứt đoạn kể cả khi nhà cung cấp chính gặp sự cố đột xuất.',
  },
  {
    stepNumber: 17,
    title: 'FLASHREPEAT: MUA CHUNG ĐỊNH KỲ',
    targetRole: 'buyer',
    badge: 'BƯỚC 17 / 21 • FLASHGROWTH',
    instruction: 'Khám phá phòng gom sữa tươi FlashRepeat giao Thứ Hai hàng tuần cho cư dân.',
    explanation:
      'Chuyển đổi từ giao dịch một lần sang dòng GMV và hoa hồng lặp lại định kỳ (Recurring GMV & Commission).',
  },
  {
    stepNumber: 18,
    title: 'FLASHRESCUE: DEAL XẢ KHO TRONG NGÀY',
    targetRole: 'buyer',
    badge: 'BƯỚC 18 / 21 • FLASHGROWTH',
    instruction: 'Xem deal FlashRescue Dâu Tây xuất dư hội nghị với nhãn "Deal thời gian giới hạn".',
    explanation:
      'Tạo thêm giao dịch từ lượng hàng tươi ngon có nguy cơ đọng kho, hỗ trợ tiêu thụ nông sản và tăng GMV sàn.',
  },
  {
    stepNumber: 19,
    title: 'FLASHBUNDLE & FLASHADD-ON',
    targetRole: 'buyer',
    badge: 'BƯỚC 19 / 21 • FLASHGROWTH',
    instruction: 'Khám phá Combo tuần 3 món và chọn thêm Sữa Chua FlashAdd-on giao cùng chuyến.',
    explanation:
      'Nâng cao giá trị đơn hàng trung bình (AOV) từ 90k lên 249k, tối ưu hóa công suất vận chuyển theo lô.',
  },
  {
    stepNumber: 20,
    title: 'SUPPLIER PRO & FLASHBOOST SMART',
    targetRole: 'supplier',
    badge: 'BƯỚC 20 / 21 • SUPPLIER',
    instruction: 'NCC kích hoạt gói Pro, xem Demand Intelligence và tạo chiến dịch quảng bá FlashBoost.',
    explanation:
      'Mở ra các nguồn thu dịch vụ giá trị gia tăng (Subscription & Ads) độc lập ngoài hoa hồng giao dịch.',
  },
  {
    stepNumber: 21,
    title: 'ADMIN UNIT ECONOMICS RADAR',
    targetRole: 'admin',
    badge: 'BƯỚC 21 / 21 • ADMIN',
    instruction: 'Xem bảng Unit Economics: Platform Revenue 5 nguồn - Chi phí biến đổi 4 loại = Contribution dương.',
    explanation:
      'Kiểm soát nghiêm ngặt bài toán tài chính đơn vị, chứng minh mô hình FlashGroup tăng trưởng bền vững và có lãi trên từng đơn.',
  },
];

interface GuidedDemoOverlayProps {
  currentStepIndex: number;
  onNextStep: () => void;
  onPrevStep: () => void;
  onClose: () => void;
  onJumpToStep?: (idx: number) => void;
}

export const GuidedDemoOverlay: React.FC<GuidedDemoOverlayProps> = ({
  currentStepIndex,
  onNextStep,
  onPrevStep,
  onClose,
  onJumpToStep,
}) => {
  const step = GUIDED_DEMO_STEPS[currentStepIndex] || GUIDED_DEMO_STEPS[0];
  const isLast = currentStepIndex >= GUIDED_DEMO_STEPS.length - 1;
  const isFirst = currentStepIndex === 0;

  return (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 w-[92vw] max-w-lg animate-fade-in font-sans">
      <div className="bg-[#3155FF] text-white rounded-3xl border-2 border-[#3155FF]/30 p-5 shadow-2xl backdrop-blur-md space-y-3.5">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] font-black uppercase text-[#3155FF] tracking-wider block">
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
                  ? 'w-6 bg-[#C7F000]'
                  : idx < currentStepIndex
                  ? 'w-2 bg-[#3155FF]'
                  : 'w-2 bg-white/20'
              }`}
              title={`Bước ${s.stepNumber}: ${s.title}`}
            />
          ))}
        </div>

        {/* Instruction Spotlight Box */}
        <div className="bg-[#003CCB]/60 rounded-2xl p-3 border border-[#3155FF]/30/40 space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-black text-[#C7F000]">
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span>THAO TÁC CẦN THỰC HIỆN:</span>
          </div>
          <p className="text-xs text-white font-medium leading-relaxed">{step.instruction}</p>
        </div>

        {/* Context / Business Logic Explanation */}
        <p className="text-[11px] text-[#C8CBF0] leading-relaxed italic">
          💡 {step.explanation}
        </p>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-1 border-t border-white/15 text-xs">
          <button
            type="button"
            onClick={onPrevStep}
            disabled={isFirst}
            className="px-3 py-1.5 rounded-xl border border-white/20 text-white hover:bg-white/10 font-bold flex items-center gap-1 transition disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Trước</span>
          </button>

          <span className="text-[10px] text-[#C8CBF0] font-bold">
            {currentStepIndex + 1} / {GUIDED_DEMO_STEPS.length}
          </span>

          <button
            type="button"
            onClick={onNextStep}
            className="px-4 py-1.5 rounded-xl bg-[#C7F000] hover:bg-[#EEF1FF] text-[#0C0D10] font-black flex items-center gap-1 transition shadow-md shadow-[#C7F000]/20 cursor-pointer active:scale-95"
          >
            <span>{isLast ? 'Hoàn thành' : 'Tiếp tục'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
