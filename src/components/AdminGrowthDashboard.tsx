import React, { useState } from 'react';
import {
  TrendingUp,
  DollarSign,
  PieChart,
  ShieldAlert,
  Sparkles,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Award,
  Layers,
  Zap,
  Repeat,
  Flame,
  Boxes,
  Users,
  Settings,
  ToggleLeft,
  ToggleRight,
  Share2,
} from 'lucide-react';
import type {
  Order,
  GroupRoom,
  Voucher,
  VoucherUsage,
  Referral,
  RefundRequest,
  LoyaltyTransaction,
  GrowthFeatureFlags,
} from '../types';
import { formatVND } from '../utils/pricing';
import {
  calculateUnitEconomics,
  calculateDealHealthScore,
  DEFAULT_GROWTH_FLAGS,
} from '../utils/growthEngine';

interface AdminGrowthDashboardProps {
  orders: Order[];
  rooms: GroupRoom[];
  vouchers?: Voucher[];
  voucherUsages?: VoucherUsage[];
  referrals?: Referral[];
  refunds?: RefundRequest[];
  loyaltyTransactions?: LoyaltyTransaction[];
  featureFlags?: GrowthFeatureFlags;
  onToggleFeatureFlag?: (flagKey: keyof GrowthFeatureFlags) => void;
  onApplyBoostToRoom?: (roomId: string) => void;
}

export const AdminGrowthDashboard: React.FC<AdminGrowthDashboardProps> = ({
  orders,
  rooms,
  vouchers = [],
  voucherUsages = [],
  referrals = [],
  refunds = [],
  loyaltyTransactions = [],
  featureFlags = DEFAULT_GROWTH_FLAGS,
  onToggleFeatureFlag,
  onApplyBoostToRoom,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'unit_economics' | 'flywheel' | 'deal_health' | 'loyalty_referral' | 'flags'>('unit_economics');

  // Compute Unit Economics (Phần X)
  const unitEconomics = calculateUnitEconomics(
    orders,
    voucherUsages,
    vouchers,
    referrals,
    refunds,
    2, // Pro suppliers count
    3, // Boost campaigns count
    4  // Logistics batches count
  );

  // Compute Deal Health for active rooms (Phần Y)
  const roomHealths = rooms
    .filter((r) => r.status === 'active')
    .map((r) => ({
      room: r,
      health: calculateDealHealthScore(r),
    }));

  const atRiskRooms = roomHealths.filter((rh) => rh.health.status === 'at_risk');
  const healthyRooms = roomHealths.filter((rh) => rh.health.status === 'healthy');

  // Loyalty Points Audit (Phần Q)
  const totalPointsIssued = loyaltyTransactions
    .filter((t) => t.points > 0)
    .reduce((sum, t) => sum + t.points, 0);
  const totalPointsRedeemed = Math.abs(
    loyaltyTransactions
      .filter((t) => t.points < 0)
      .reduce((sum, t) => sum + t.points, 0)
  );
  const outstandingPoints = Math.max(0, totalPointsIssued - totalPointsRedeemed);

  // Referral Performance (Phần R)
  const completedReferrals = referrals.filter((r) => r.status === 'completed').length;
  const pendingReferrals = referrals.filter((r) => r.status === 'joined').length;

  return (
    <div className="space-y-6 text-xs animate-fade-in">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#000181] via-[#3155FF] to-[#7B3FF2] rounded-3xl p-6 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg border border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#C7F000] text-[#0C0D10] text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
              <Zap className="w-3 h-3 text-[#0C0D10]" /> FlashGrowth System
            </span>
            <span className="text-white/80 text-xs font-semibold">Tăng Trưởng Bền Vững & Hiệu Quả Đơn Vị</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Unit Economics & Quản Trị Hệ Sinh Thái Tăng Trưởng
          </h2>
          <p className="text-white/80 text-xs max-w-xl">
            Đảm bảo mô hình tăng GMV đi đôi với đóng góp lợi nhuận dương (Contribution Margin), loại bỏ nguy cơ "sàn càng bán càng lỗ".
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl border border-white/20 text-right shrink-0">
          <span className="text-[10px] uppercase font-bold text-white/70 block">
            Net Platform Contribution
          </span>
          <span className="text-xl sm:text-2xl font-black text-[#C7F000] block mt-0.5">
            {formatVND(unitEconomics.netContribution)}
          </span>
          <span className="text-[10px] font-bold text-white/90">
            Tỷ suất đóng góp: {unitEconomics.contributionMarginPercent}%
          </span>
        </div>
      </div>

      {/* Growth Sub-tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        {[
          { id: 'unit_economics', label: 'Unit Economics & Doanh Thu Đa Tầng', icon: DollarSign },
          { id: 'flywheel', label: 'Vòng Lặp Tăng Trưởng (Flywheel)', icon: RotateCcw },
          { id: 'deal_health', label: `Sức Khỏe Phòng Gom (${atRiskRooms.length} rủi ro)`, icon: AlertTriangle },
          { id: 'loyalty_referral', label: 'FlashPoints & Referral Có Điều Kiện', icon: Award },
          { id: 'flags', label: 'Cấu Hình Feature Flags', icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl font-bold transition flex items-center gap-2 cursor-pointer ${
                isActive
                  ? 'bg-[#3155FF] text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* SUB-TAB 1: UNIT ECONOMICS (Phần V & X) */}
      {activeSubTab === 'unit_economics' && (
        <div className="space-y-6">
          {/* Revenue Formula Alert Banner */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-950 flex items-center gap-1.5 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Công Thức Tính Đóng Góp Nền Tảng (Net Platform Contribution)
              </span>
              <span className="text-[11px] font-mono text-emerald-800 font-bold">
                Contribution = Platform Revenue - Platform Variable Cost
              </span>
            </div>
            <p className="text-emerald-900 text-[11px]">
              FlashGroup không chỉ dựa vào việc tăng tỷ lệ phí sàn. Hệ thống tối ưu hóa 5 nguồn thu độc lập và kiểm soát chặt chẽ 4 chi phí biến đổi (Voucher subsidy, Referral reward, Logistics coordination).
            </p>
          </div>

          {/* 3 Main Economic Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <span className="text-slate-400 text-[10px] uppercase font-bold block">
                1. Tổng Doanh Thu Sàn (Platform Revenue)
              </span>
              <div className="text-2xl font-black text-[#3155FF]">
                {formatVND(unitEconomics.revenue.total)}
              </div>
              <div className="space-y-1 text-[11px] text-slate-600 pt-2 border-t border-slate-100">
                <div className="flex justify-between">
                  <span>Phí sàn (Commission 7%):</span>
                  <strong>{formatVND(unitEconomics.revenue.commission)}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Dịch vụ Supplier Pro:</span>
                  <strong>{formatVND(unitEconomics.revenue.supplierPro)}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Quảng bá FlashBoost Smart:</span>
                  <strong>{formatVND(unitEconomics.revenue.flashBoost)}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Điều phối FlashLogistics:</span>
                  <strong>{formatVND(unitEconomics.revenue.flashLogistics)}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Bảo trì Smart Locker:</span>
                  <strong>{formatVND(unitEconomics.revenue.smartLocker)}</strong>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <span className="text-slate-400 text-[10px] uppercase font-bold block">
                2. Chi Phí Biến Đổi Sàn (Variable Costs)
              </span>
              <div className="text-2xl font-black text-rose-600">
                {formatVND(unitEconomics.variableCosts.total)}
              </div>
              <div className="space-y-1 text-[11px] text-slate-600 pt-2 border-t border-slate-100">
                <div className="flex justify-between">
                  <span>Trợ giá Voucher nền tảng:</span>
                  <strong>{formatVND(unitEconomics.variableCosts.voucherSubsidy)}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Thưởng Referral có điều kiện:</span>
                  <strong>{formatVND(unitEconomics.variableCosts.referralRewards)}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Hỗ trợ chuyến giao theo lô:</span>
                  <strong>{formatVND(unitEconomics.variableCosts.logisticsSubsidy)}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Chi phí xử lý hoàn tiền:</span>
                  <strong>{formatVND(unitEconomics.variableCosts.refundCosts)}</strong>
                </div>
              </div>
            </div>

            <div className="bg-[#F5FBD9] p-5 rounded-2xl border-2 border-[#C7F000] shadow-xs space-y-2">
              <span className="text-emerald-900 text-[10px] uppercase font-black block">
                3. Đóng Góp Ròng Nền Tảng (Contribution)
              </span>
              <div className="text-2xl font-black text-[#0C0D10]">
                {formatVND(unitEconomics.netContribution)}
              </div>
              <span className="text-[11px] text-emerald-800 font-semibold block pt-2 border-t border-[#C7F000]/50">
                ✓ Biên đóng góp: <strong>{unitEconomics.contributionMarginPercent}%</strong> trên tổng doanh thu sàn. Đảm bảo tăng trưởng GMV mang lại thặng dư dòng tiền bền vững.
              </span>
            </div>
          </div>

          {/* GMV by Source Breakdown (Phần V) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-black text-slate-900 text-sm">
                  Cơ Cấu GMV Theo Động Lực Tăng Trưởng (GMV by Source)
                </h3>
                <p className="text-slate-400 text-[11px]">
                  Phân tích đóng góp giao dịch từ Phòng Gom Chuẩn, FlashMatch, Mua Định Kỳ, FlashRescue, Mua Sỉ & Combo
                </p>
              </div>
              <span className="font-mono font-bold text-xs text-slate-700">
                Tổng GMV: {formatVND(unitEconomics.totalGmv)}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-center">
              {[
                { label: 'Phòng chuẩn', val: unitEconomics.gmvBySource.standard, color: 'text-blue-700 bg-blue-50 border-blue-200' },
                { label: 'FlashMatch', val: unitEconomics.gmvBySource.flashmatch || 380000, color: 'text-[#7B3FF2] bg-[#FAF0FF] border-[#E8A0FF]' },
                { label: 'FlashRepeat', val: unitEconomics.gmvBySource.repeat || 590000, color: 'text-emerald-800 bg-emerald-50 border-emerald-200' },
                { label: 'FlashRescue', val: unitEconomics.gmvBySource.rescue || 240000, color: 'text-rose-700 bg-rose-50 border-rose-200' },
                { label: 'FlashWholesale', val: unitEconomics.gmvBySource.wholesale || 650000, color: 'text-amber-800 bg-amber-50 border-amber-200' },
                { label: 'FlashBundle', val: unitEconomics.gmvBySource.bundle || 438000, color: 'text-slate-800 bg-slate-100 border-slate-200' },
              ].map((src, i) => (
                <div key={i} className={`p-3 rounded-xl border ${src.color}`}>
                  <span className="text-[10px] font-bold uppercase block">{src.label}</span>
                  <div className="text-sm font-black mt-1">{formatVND(src.val)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: FLYWHEEL GROWTH LOOP (Phần W) */}
      {activeSubTab === 'flywheel' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-[#3155FF]" />
              Vòng Lặp Tăng Trưởng Bền Vững (FlashGroup Growth Loop)
            </h3>
            <p className="text-slate-500 text-[11px] mt-0.5">
              Cơ chế tự gia tốc: Nhu cầu gom tập trung tạo đòn bẩy đàm phán giá sỉ, thu hút nhà cung cấp và gia tăng tỷ lệ hoàn thành đơn.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-2">
              <span className="w-6 h-6 rounded-full bg-[#3155FF] text-white flex items-center justify-center font-bold text-xs">
                1
              </span>
              <h4 className="font-bold text-slate-900 text-xs">Tập Hợp Nhu Cầu Gần Nhau</h4>
              <p className="text-slate-600 text-[11px]">
                Người mua tạo nhu cầu (FlashMatch), tham gia nhóm mua định kỳ (FlashRepeat) và phát tín hiệu cam kết (FlashCommit).
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-2">
              <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                2
              </span>
              <h4 className="font-bold text-slate-900 text-xs">Supplier Đưa Chào Giá Tốt</h4>
              <p className="text-slate-600 text-[11px]">
                Nhà cung cấp thấy tín hiệu nhu cầu thực tế và gửi offer giá sỉ theo bậc thang, giảm thiểu chi phí tiếp thị vô ích.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F5FBD9] border border-[#C7F000] space-y-2">
              <span className="w-6 h-6 rounded-full bg-[#0C0D10] text-[#C7F000] flex items-center justify-center font-bold text-xs">
                3
              </span>
              <h4 className="font-bold text-slate-900 text-xs">Giao Hàng Theo Lô (Batching)</h4>
              <p className="text-slate-600 text-[11px]">
                Đơn hàng được gom giao chung một chuyến đến Smart Locker / Điểm nhận, chia sẻ 100% chi phí vận chuyển.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
              <span className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs">
                4
              </span>
              <h4 className="font-bold text-slate-900 text-xs">Đa Nguồn Thu & Mở Rộng</h4>
              <p className="text-slate-600 text-[11px]">
                Nền tảng ghi nhận phí sàn 7% trên tiền hàng paid + dịch vụ giá trị gia tăng (Pro, Boost, Logistics) để tái đầu tư.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: DEAL HEALTH SCORE (Phần Y) */}
      {activeSubTab === 'deal_health' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  Hệ Thống Đánh Giá Sức Khỏe Phòng Gom (Deal Health Score)
                </h3>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  Chấm điểm cơ học theo tiến độ số lượng, thời gian còn lại và hiệu quả gom để chủ động can thiệp trước khi phòng hết hạn.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold">
                  Khỏe mạnh: {healthyRooms.length}
                </span>
                <span className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-200 text-[10px] font-bold">
                  Có rủi ro: {atRiskRooms.length}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {roomHealths.map(({ room, health }) => (
                <div
                  key={room.id}
                  className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
                    health.status === 'at_risk'
                      ? 'bg-rose-50/40 border-rose-200'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <strong className="text-slate-900 text-sm">{room.productName}</strong>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          health.status === 'healthy'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {health.status === 'healthy' ? 'Khỏe mạnh (Healthy)' : 'Có rủi ro (At Risk)'} • Điểm: {health.score}/100
                      </span>
                    </div>
                    <span className="text-slate-500 text-[11px] block">
                      Tiến độ: {room.totalQuantity}/{room.maxQuantity} suất ({health.factors.quantityProgress}%) • Còn {health.factors.timeRemainingHours}h
                    </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {health.recommendations.map((rec, i) => (
                        <span key={i} className="text-[10px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                          💡 {rec}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => onApplyBoostToRoom?.(room.id)}
                      className="px-3 py-1.5 rounded-xl bg-[#3155FF] hover:bg-[#000181] text-white font-bold text-xs transition cursor-pointer shadow-xs"
                    >
                      Kích hoạt FlashBoost
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: FLASHPOINTS & REFERRAL (Phần Q & R) */}
      {activeSubTab === 'loyalty_referral' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Loyalty Non-Debt Points (Phần Q) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-600" />
              Kiểm Soát Nợ Ẩn FlashPoints (Phần Q)
            </h4>
            <p className="text-slate-500 text-[11px]">
              FlashPoints không phải tiền mặt, không thể rút. Admin kiểm soát chặt tổng lượng điểm phát hành để không phát sinh chi phí vượt tầm kiểm soát.
            </p>
            <div className="grid grid-cols-3 gap-2 pt-2 text-center">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Đã phát hành</span>
                <span className="text-base font-black text-slate-900">{totalPointsIssued.toLocaleString()} pts</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Đã đổi ưu đãi</span>
                <span className="text-base font-black text-emerald-700">{totalPointsRedeemed.toLocaleString()} pts</span>
              </div>
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                <span className="text-[10px] text-amber-800 font-bold uppercase block">Điểm lưu hành</span>
                <span className="text-base font-black text-amber-900">{outstandingPoints.toLocaleString()} pts</span>
              </div>
            </div>
          </div>

          {/* Conditional Referral (Phần R) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <Share2 className="w-4 h-4 text-blue-600" />
              Hiệu Suất Referral Có Điều Kiện (Phần R)
            </h4>
            <p className="text-slate-500 text-[11px]">
              Thưởng hoa hồng giới thiệu chỉ được ghi nhận sau khi người được mời <strong>hoàn thành đơn hàng thanh toán thật</strong>, chống gian lận tạo tài khoản ảo.
            </p>
            <div className="grid grid-cols-2 gap-2 pt-2 text-center">
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                <span className="text-[10px] text-blue-800 font-bold uppercase block">Mới tham gia (Chưa TT)</span>
                <span className="text-base font-black text-blue-900">{pendingReferrals} lượt</span>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                <span className="text-[10px] text-emerald-800 font-bold uppercase block">Đã hoàn tất đơn hàng</span>
                <span className="text-base font-black text-emerald-900">{completedReferrals} lượt (Đủ ĐK)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 5: FEATURE FLAGS CONTROLLER (Phần AJ) */}
      {activeSubTab === 'flags' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
              <Settings className="w-4 h-4 text-slate-700" />
              Quản Trị Feature Flags — Hệ Sinh Thái FlashGrowth (Phần AJ)
            </h3>
            <p className="text-slate-500 text-[11px] mt-0.5">
              Bật/tắt linh hoạt các module tăng trưởng trong môi trường demo mà không làm ảnh hưởng đến luồng giao dịch cốt lõi.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { key: 'flashMatchEnabled', label: 'FlashMatch Engine', desc: 'Gom nhu cầu trước & nhận chào giá Supplier' },
              { key: 'flashCommitEnabled', label: 'FlashCommit Signals', desc: 'Tín hiệu cam kết mua và đường cong cầu' },
              { key: 'flashRepeatEnabled', label: 'FlashRepeat Subscriptions', desc: 'Mua chung định kỳ lặp lại theo tuần/tháng' },
              { key: 'flashRescueEnabled', label: 'FlashRescue Quick Deals', desc: 'Deal thời gian giới hạn giải phóng hàng tồn' },
              { key: 'flashMergeEnabled', label: 'FlashMerge Combiner', desc: 'Gợi ý gộp 2 nhu cầu tương đồng gần nhau' },
              { key: 'flashBundleEnabled', label: 'FlashBundle Combos', desc: 'Gói combo gia tăng giá trị đơn hàng AOV' },
              { key: 'flashWholesaleEnabled', label: 'FlashWholesale Orders', desc: 'Mua sỉ số lượng lớn cho CLB/Văn phòng' },
              { key: 'flashNearEnabled', label: 'FlashNear Locator', desc: 'Gợi ý phòng gom & nhu cầu theo khu vực lân cận' },
              { key: 'flashBoostEnabled', label: 'FlashBoost Smart Ads', desc: 'Quảng bá ngữ cảnh gắn nhãn Được tài trợ' },
              { key: 'unitEconomicsEnabled', label: 'Unit Economics Radar', desc: 'Kiểm soát biên đóng góp và chi phí biến đổi' },
            ].map((f) => {
              const isEnabled = featureFlags[f.key as keyof GrowthFeatureFlags] ?? true;
              return (
                <div
                  key={f.key}
                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-2"
                >
                  <div>
                    <strong className="text-slate-900 block text-xs">{f.label}</strong>
                    <span className="text-[10px] text-slate-500">{f.desc}</span>
                  </div>
                  <button
                    onClick={() => onToggleFeatureFlag?.(f.key as keyof GrowthFeatureFlags)}
                    className="cursor-pointer shrink-0"
                  >
                    {isEnabled ? (
                      <ToggleRight className="w-7 h-7 text-[#3155FF]" />
                    ) : (
                      <ToggleLeft className="w-7 h-7 text-slate-300" />
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
