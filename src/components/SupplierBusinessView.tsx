import React, { useState } from 'react';
import {
  TrendingUp,
  Sparkles,
  Zap,
  Target,
  BarChart3,
  Award,
  Crown,
  Bell,
  MapPin,
  CheckCircle2,
  Clock,
  ArrowRight,
  Boxes,
  Sliders,
  DollarSign,
  Plus,
  ShieldCheck,
  Eye,
  Rocket,
  Flame,
} from 'lucide-react';
import type {
  Supplier,
  FlashMatchDemand,
  GroupRoom,
  Product,
} from '../types';
import { formatVND } from '../utils/pricing';

interface SupplierBusinessViewProps {
  supplier: Supplier;
  demands: FlashMatchDemand[];
  rooms: GroupRoom[];
  products: Product[];
  onOpenFlashMatch: () => void;
  onCreateRescueDeal: (dealData: {
    productId: string;
    productName: string;
    originalPrice: number;
    rescuePrice: number;
    quantity: number;
    deadline: string;
    reason: string;
    area: string;
  }) => void;
  onUpgradePro?: () => void;
  onLaunchBoost?: (campaign: { productName: string; targetArea: string; category: string; budget: number }) => void;
}

export const SupplierBusinessView: React.FC<SupplierBusinessViewProps> = ({
  supplier,
  demands,
  rooms,
  products,
  onOpenFlashMatch,
  onCreateRescueDeal,
  onUpgradePro,
  onLaunchBoost,
}) => {
  const [subTab, setSubTab] = useState<'requests' | 'insights' | 'boost' | 'rescue' | 'pro'>('requests');
  const [isPro, setIsPro] = useState<boolean>(supplier.isPro || false);

  // Rescue deal creation form
  const [rescueProductId, setRescueProductId] = useState<string>(products[0]?.id || '');
  const [rescueOriginalPrice, setRescueOriginalPrice] = useState<number>(120000);
  const [rescuePrice, setRescuePrice] = useState<number>(79000);
  const [rescueQty, setRescueQty] = useState<number>(30);
  const [rescueDeadline, setRescueDeadline] = useState<string>('20:00 Hôm nay');
  const [rescueReason, setRescueReason] = useState<string>('Nông sản Đà Lạt tươi giòn cần giải phóng kho trong ngày.');
  const [rescueArea, setRescueArea] = useState<string>('TP. Thủ Đức');

  // FlashBoost form state (Phần M)
  const [boostTargetArea, setBoostTargetArea] = useState<string>('TP. Thủ Đức');
  const [boostCategory, setBoostCategory] = useState<string>('Thực phẩm');
  const [boostBudget, setBoostBudget] = useState<number>(150000);
  const [boostSuccess, setBoostSuccess] = useState<boolean>(false);

  // Demands summary by category (Phần K: FlashRequest Board)
  const categoryDemandSummary = [
    { category: 'Thực phẩm & Nông sản', units: 248, area: 'TP. Thủ Đức & Q7', growth: '+32%', hot: true },
    { category: 'Nước uống đóng chai', units: 186, area: 'KTX Khu A (ĐHQG)', growth: '+45%', hot: true },
    { category: 'Đồ gia dụng & Tiêu dùng', units: 94, area: 'Quận 7 (Phú Mỹ Hưng)', growth: '+18%', hot: false },
    { category: 'Trái cây theo mùa', units: 142, area: 'Toàn thành phố', growth: '+27%', hot: true },
  ];

  // Near completion rooms (Phần AF: Cơ hội hôm nay)
  const nearCompletionRooms = rooms.filter(
    (r) => r.status === 'active' && r.totalQuantity >= (r.maxQuantity || 20) * 0.75
  );

  return (
    <div className="space-y-6 text-xs animate-fade-in">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0C0D10] via-[#000181] to-[#3155FF] rounded-3xl p-6 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg border border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#C7F000] text-[#0C0D10] text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
              <Zap className="w-3 h-3 text-[#0C0D10]" /> FlashBusiness Engine
            </span>
            {isPro && (
              <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-900 text-[10px] font-black uppercase flex items-center gap-1">
                <Crown className="w-3 h-3" /> Supplier Pro Active
              </span>
            )}
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Trung Tâm Nhu Cầu & Tăng Trưởng Doanh Số
          </h2>
          <p className="text-white/80 text-xs max-w-xl">
            Tiếp cận trực tiếp các nhóm nhu cầu đang phát sinh, tung deal FlashRescue xả kho nhanh và gia tăng đơn hàng định kỳ.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {!isPro ? (
            <button
              onClick={() => {
                setIsPro(true);
                onUpgradePro?.();
              }}
              className="px-4 py-2.5 rounded-xl bg-[#C7F000] text-[#0C0D10] font-black hover:bg-lime-400 transition cursor-pointer shadow-md flex items-center gap-1.5"
            >
              <Crown className="w-4 h-4" />
              Nâng cấp Supplier Pro
            </button>
          ) : (
            <span className="px-3 py-1.5 rounded-xl bg-white/10 text-white border border-white/20 text-xs font-bold">
              Gói Pro: Còn 28 ngày
            </span>
          )}
        </div>
      </div>

      {/* Retention Widget: Cơ Hội Hôm Nay (Phần AF) */}
      <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-200 flex items-center justify-center text-amber-900 font-black">
            ⚡
          </div>
          <div>
            <h4 className="font-black text-amber-950 text-xs">Cơ hội phát triển doanh thu hôm nay</h4>
            <p className="text-amber-800 text-[11px] mt-0.5">
              Có <strong>{demands.length} nhu cầu FlashMatch</strong> đang chờ chào giá • <strong>{nearCompletionRooms.length} phòng gom</strong> sắp đạt mốc giá cao nhất • <strong>1 nhóm FlashRepeat</strong> cần bổ sung nguồn hàng tuần tới.
            </p>
          </div>
        </div>
        <button
          onClick={onOpenFlashMatch}
          className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition cursor-pointer whitespace-nowrap shadow-xs"
        >
          Xem & Gửi Chào Giá Ngay
        </button>
      </div>

      {/* Sub Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        {[
          { id: 'requests', label: 'Bảng Nhu Cầu Đang Tăng (Request Board)', icon: BarChart3 },
          { id: 'insights', label: 'FlashInsight (Phân Tích Cầu)', icon: Sparkles },
          { id: 'rescue', label: 'Tạo Deal FlashRescue (Xả kho nhanh)', icon: Flame },
          { id: 'boost', label: 'FlashBoost Smart (Quảng bá ngữ cảnh)', icon: Rocket },
          { id: 'pro', label: 'Gói Supplier Pro', icon: Crown },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = subTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSubTab(tab.id as any)}
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

      {/* SUB-VIEW 1: REQUEST BOARD (Phần K) */}
      {subTab === 'requests' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-[#3155FF]" />
                  FlashRequest Board — Nhu Cầu Gom Hàng Tổng Hợp Theo Khu Vực
                </h3>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  FlashGroup không chỉ đợi Supplier đăng hàng mà giúp Supplier tìm <strong>nhu cầu đã tồn tại sẵn</strong>. Dữ liệu tổng hợp ẩn danh bảo vệ người mua.
                </p>
              </div>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                Tổng nhu cầu: 670 suất
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
              {categoryDemandSummary.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-[#3155FF]/40 transition space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 text-xs">{item.category}</span>
                    {item.hot && (
                      <span className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 text-[9px] font-black uppercase">
                        HOT
                      </span>
                    )}
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-black text-slate-900">{item.units} suất</span>
                    <span className="text-[11px] font-bold text-emerald-600">{item.growth}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 block">Khu vực: {item.area}</span>
                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                    <button
                      onClick={onOpenFlashMatch}
                      className="text-[11px] font-bold text-[#3155FF] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>Gửi chào giá</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 2: FLASHINSIGHT (Phần L) */}
      {subTab === 'insights' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#7B3FF2]" />
                  FlashInsight — Phân Tích Cầu & Dự Báo Tiêu Dùng
                </h3>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  Dữ liệu vĩ mô giúp nhà cung cấp chuẩn bị số lượng, tối ưu mốc giá bậc thang và lên lịch vận chuyển theo lô.
                </p>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                isPro ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-slate-100 text-slate-700'
              }`}>
                {isPro ? 'Pro Intelligence' : 'Basic Tier'}
              </span>
            </div>

            {/* Basic Metrics (Free) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Tổng lượt xem phòng</span>
                <span className="text-lg font-black text-slate-900 mt-1">1.842 lượt</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Tổng suất đã gom</span>
                <span className="text-lg font-black text-[#0C0D10] mt-1">198 suất</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Tỷ lệ mở khóa giá</span>
                <span className="text-lg font-black text-blue-700 mt-1">87.5%</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Độ cam kết (FlashCommit)</span>
                <span className="text-lg font-black text-[#7B3FF2] mt-1">74%</span>
              </div>
            </div>

            {/* Pro Intelligence Section (Phần L) */}
            <div className="border border-amber-200 rounded-2xl bg-amber-50/40 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-950 flex items-center gap-1.5 text-xs">
                  <Crown className="w-4 h-4 text-amber-600" />
                  Dữ Liệu Pro: Dự Báo Nhu Cầu Chu Kỳ Tiếp Theo
                </span>
                {!isPro && (
                  <span className="text-[10px] text-amber-700 font-bold bg-amber-100 px-2 py-0.5 rounded-full">
                    Dành cho Supplier Pro
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-white p-3 rounded-xl border border-amber-200">
                  <span className="text-slate-400 text-[10px] block font-bold">Nhu cầu FlashRepeat tuần tới</span>
                  <strong className="text-sm font-black text-slate-900 block mt-0.5">42 suất (Sữa & Nước)</strong>
                  <span className="text-[10px] text-slate-500 mt-0.5 block">Khách đã bật nhắc chu kỳ</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-amber-200">
                  <span className="text-slate-400 text-[10px] block font-bold">Khung giờ đặt hàng cao điểm</span>
                  <strong className="text-sm font-black text-slate-900 block mt-0.5">18:00 – 21:30 hàng ngày</strong>
                  <span className="text-[10px] text-slate-500 mt-0.5 block">Phù hợp set giờ chốt phòng</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-amber-200">
                  <span className="text-slate-400 text-[10px] block font-bold">Mức giá kỳ vọng bình quân</span>
                  <strong className="text-sm font-black text-slate-900 block mt-0.5">92.000đ – 98.000đ</strong>
                  <span className="text-[10px] text-slate-500 mt-0.5 block">Tính từ dữ liệu FlashCommit</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 3: FLASHRESCUE CREATOR (Phần D) */}
      {subTab === 'rescue' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
              <Flame className="w-4 h-4 text-rose-600" />
              Tạo Deal FlashRescue — Giải Phóng Hàng Tồn Trong Thời Gian Ngắn
            </h3>
            <p className="text-slate-500 text-[11px] mt-0.5">
              Dành cho nông sản theo mùa, thực phẩm cận hạn còn nguyên chất lượng, hoặc lượng hàng dư sau sự kiện. Giúp giảm thiểu hao hụt tồn kho.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Chọn sản phẩm cần giải phóng *</label>
              <select
                value={rescueProductId}
                onChange={(e) => setRescueProductId(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:outline-hidden"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} (Tồn kho: {p.stockQuantity})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Lý do mở deal FlashRescue *</label>
              <input
                type="text"
                value={rescueReason}
                onChange={(e) => setRescueReason(e.target.value)}
                placeholder="Ví dụ: Nông sản thu hoạch sớm cần xuất trong ngày..."
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Giá bán thông thường (đ) *</label>
              <input
                type="number"
                value={rescueOriginalPrice}
                onChange={(e) => setRescueOriginalPrice(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-bold"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Giá FlashRescue ưu đãi (đ) *</label>
              <input
                type="number"
                value={rescuePrice}
                onChange={(e) => setRescuePrice(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-bold text-rose-600"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Số lượng cần bán (suất) *</label>
              <input
                type="number"
                value={rescueQty}
                onChange={(e) => setRescueQty(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Thời hạn kết thúc deal *</label>
              <input
                type="text"
                value={rescueDeadline}
                onChange={(e) => setRescueDeadline(e.target.value)}
                placeholder="Ví dụ: 20:00 Hôm nay"
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Khu vực phân phối *</label>
              <select
                value={rescueArea}
                onChange={(e) => setRescueArea(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs"
              >
                <option value="TP. Thủ Đức">TP. Thủ Đức (KTX ĐHQG)</option>
                <option value="Quận 7 (Phú Mỹ Hưng)">Quận 7 (Phú Mỹ Hưng)</option>
                <option value="Bình Thạnh">Bình Thạnh</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={() => {
                const prod = products.find((p) => p.id === rescueProductId);
                onCreateRescueDeal({
                  productId: rescueProductId,
                  productName: prod?.name || 'Sản phẩm FlashRescue',
                  originalPrice: rescueOriginalPrice,
                  rescuePrice,
                  quantity: rescueQty,
                  deadline: rescueDeadline,
                  reason: rescueReason,
                  area: rescueArea,
                });
                alert('Đã kích hoạt Deal FlashRescue thành công! Sản phẩm sẽ được hiển thị với nhãn "Deal thời gian giới hạn".');
              }}
              className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs transition cursor-pointer shadow-sm flex items-center gap-1.5"
            >
              <Flame className="w-4 h-4" />
              Kích hoạt Deal FlashRescue
            </button>
          </div>
        </div>
      )}

      {/* SUB-VIEW 4: FLASHBOOST SMART (Phần M) */}
      {subTab === 'boost' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
              <Rocket className="w-4 h-4 text-[#3155FF]" />
              FlashBoost Smart — Tăng Trưởng Hiển Thị Đúng Ngữ Cảnh
            </h3>
            <p className="text-slate-500 text-[11px] mt-0.5">
              Quảng bá phòng mua chung đến nhóm khách hàng có nhu cầu tương thích tại cùng khu vực giao hàng. Luôn hiển thị nhãn minh bạch: <strong>"Được tài trợ"</strong>.
            </p>
          </div>

          {boostSuccess && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-emerald-800 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Đã kích hoạt chiến dịch FlashBoost thành công! Ngân sách: {formatVND(boostBudget)}.
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Mục tiêu danh mục quan tâm *</label>
              <select
                value={boostCategory}
                onChange={(e) => setBoostCategory(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs"
              >
                <option value="Thực phẩm">Người quan tâm Thực phẩm & Nông sản</option>
                <option value="Nước uống">Người quan tâm Nước uống đóng chai</option>
                <option value="Đồ gia dụng">Người quan tâm Tiêu dùng gia đình</option>
              </select>
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Khu vực tiếp cận *</label>
              <select
                value={boostTargetArea}
                onChange={(e) => setBoostTargetArea(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs"
              >
                <option value="TP. Thủ Đức">TP. Thủ Đức (Bán kính 3km quanh Locker A3)</option>
                <option value="Quận 7 (Phú Mỹ Hưng)">Quận 7 (Phú Mỹ Hưng - Tân Hưng)</option>
              </select>
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Ngân sách chiến dịch (đ) *</label>
              <input
                type="number"
                step={50000}
                value={boostBudget}
                onChange={(e) => setBoostBudget(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-bold"
              />
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-slate-600 text-[11px] space-y-1">
            <span className="font-bold text-slate-800 block">Cam kết tuân thủ đạo đức & riêng tư:</span>
            <p>• Không nhắm mục tiêu theo dữ liệu nhạy cảm (sức khỏe, tôn giáo, thông tin cá nhân).</p>
            <p>• Hiển thị công khai nhãn tài trợ, không làm sai lệch vị trí xếp hạng cơ học của phòng gom thông thường.</p>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={() => {
                onLaunchBoost?.({
                  productName: 'Chiến dịch Boost Ngữ Cảnh',
                  targetArea: boostTargetArea,
                  category: boostCategory,
                  budget: boostBudget,
                });
                setBoostSuccess(true);
                setTimeout(() => setBoostSuccess(false), 4000);
              }}
              className="px-5 py-2.5 rounded-xl bg-[#3155FF] hover:bg-[#000181] text-white font-black text-xs transition cursor-pointer shadow-xs flex items-center gap-1.5"
            >
              <Rocket className="w-4 h-4" />
              Khởi chạy FlashBoost Smart ({formatVND(boostBudget)})
            </button>
          </div>
        </div>
      )}

      {/* SUB-VIEW 5: SUPPLIER PRO UPGRADE (Phần U) */}
      {subTab === 'pro' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div className="text-center max-w-lg mx-auto space-y-2">
            <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-black text-[11px] uppercase tracking-wider inline-flex items-center gap-1">
              <Crown className="w-3.5 h-3.5 text-amber-600" />
              Gói Hội Viên Supplier Pro
            </span>
            <h3 className="text-xl font-black text-slate-900">
              Công Cụ Tăng Trưởng Doanh Số Toàn Diện Cho Nhà Cung Cấp
            </h3>
            <p className="text-slate-500 text-xs">
              Mở rộng quyền truy cập Demand Intelligence, thông báo nhu cầu theo thời gian thực và xuất báo cáo tài chính chuyên sâu.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
              <h4 className="font-bold text-slate-800 text-sm">Gói Tiêu Chuẩn (Free)</h4>
              <div className="text-2xl font-black text-slate-900">0đ</div>
              <ul className="space-y-2 text-slate-600 text-xs">
                <li>✓ Đăng sản phẩm & tạo phòng gom không giới hạn</li>
                <li>✓ Nhận đơn hàng & thanh toán đối soát minh bạch</li>
                <li>✓ Phân tích chuyển đổi cơ bản (View, Quantity)</li>
                <li>✓ Không bao giờ bị khóa tính năng vận hành cốt lõi</li>
              </ul>
            </div>

            <div className="p-5 rounded-2xl border-2 border-amber-400 bg-gradient-to-b from-amber-50/50 to-white space-y-3 relative shadow-md">
              <span className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-black uppercase">
                Khuyên Dùng
              </span>
              <h4 className="font-bold text-amber-900 text-sm flex items-center gap-1.5">
                <Crown className="w-4 h-4 text-amber-600" />
                Gói Supplier Pro
              </h4>
              <div className="text-2xl font-black text-amber-900">
                299.000đ <span className="text-xs font-normal text-slate-500">/tháng</span>
              </div>
              <ul className="space-y-2 text-slate-700 text-xs">
                <li>✓ Toàn bộ tính năng gói Tiêu chuẩn</li>
                <li>✓ Báo cáo dự báo nhu cầu FlashRepeat & FlashCommit</li>
                <li>✓ Nhận thông báo sớm nhất khi có FlashMatch mới</li>
                <li>✓ Tặng 1 chiến dịch FlashBoost Smart mỗi tháng</li>
                <li>✓ Xuất báo cáo đối soát thuế theo định dạng chuẩn</li>
              </ul>
              <button
                onClick={() => {
                  setIsPro(true);
                  onUpgradePro?.();
                  alert('Đã kích hoạt gói Supplier Pro mô phỏng thành công!');
                }}
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs transition cursor-pointer shadow-xs mt-2"
              >
                {isPro ? 'Đã kích hoạt Pro' : 'Nâng cấp Pro ngay'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
