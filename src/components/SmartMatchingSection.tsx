import React, { useState } from 'react';
import {
  Sparkles,
  TrendingDown,
  MapPin,
  Clock,
  Users,
  CheckCircle2,
  ArrowRight,
  Sliders,
  Flame,
  Info,
} from 'lucide-react';
import type { GroupRoom } from '../types';
import { formatVND, getCurrentPrice, getNextTier } from '../utils/pricing';
import { SectionHeader } from './ui/SectionHeader';

interface SmartMatchingSectionProps {
  rooms: GroupRoom[];
  selectedArea: string;
  onSelectRoom: (roomId: string) => void;
  onJoinRoom: (roomId: string) => void;
}

export const SmartMatchingSection: React.FC<SmartMatchingSectionProps> = ({
  rooms,
  selectedArea,
  onSelectRoom,
  onJoinRoom,
}) => {
  // Simulated tier state for Interactive Tier Simulator
  const [simulatorQuantity, setSimulatorQuantity] = useState<number>(15);

  // Generate explainable recommendations using rule-based scoring (Req 16)
  const smartRecommendations = React.useMemo(() => {
    return rooms
      .filter((r) => r.status === 'active')
      .map((room) => {
        const nextTier = getNextTier(room.totalQuantity, room.priceTiers);
        const percentFilled = Math.min(100, Math.round((room.totalQuantity / room.maxQuantity) * 100));

        let reason = 'Thuộc danh mục nhu yếu phẩm hàng ngày';
        let score = 50;

        if (nextTier && nextTier.requiredQuantity <= 2) {
          reason = `Chỉ còn ${nextTier.requiredQuantity} sản phẩm để đạt mốc ${formatVND(nextTier.nextPrice)}`;
          score += 40;
        } else if (room.distanceMeters <= 500) {
          reason = `Rất gần vị trí của bạn (chỉ ${room.distance} tới ${room.pickupPoint})`;
          score += 35;
        } else if (room.participantCount >= 10) {
          reason = 'Phòng gom đang có tốc độ tham gia nhanh nhất hôm nay';
          score += 30;
        } else if (room.category === 'Thực phẩm') {
          reason = 'Nông sản sạch thu hoạch trong ngày, giá gom sỉ tốt';
          score += 20;
        }

        return {
          room,
          reason,
          score,
          nextTier,
          percentFilled,
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  }, [rooms]);

  if (smartRecommendations.length === 0) return null;

  return (
    <section className="space-y-6 pt-6">
      <SectionHeader
        title="GỢI Ý THÔNG MINH (SMART MATCHING)"
        subtitle="Hệ thống tự động phân tích mốc số lượng, khoảng cách điểm nhận và cơ hội hạ bậc giá để gợi ý phòng gom tối ưu nhất cho bạn"
        badge="THUẬT TOÁN MINH BẠCH"
        action={
          <span className="text-xs font-bold text-slate-500 bg-white px-3 py-1.5 rounded-full border border-slate-200">
            Dựa trên quy tắc mốc giá
          </span>
        }
      />

      {/* Recommendations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {smartRecommendations.map(({ room, reason, nextTier, percentFilled }) => {
          const currentPrice = room.finalPrice ?? getCurrentPrice(room.totalQuantity, room.priceTiers);
          const lowestTier = room.priceTiers[room.priceTiers.length - 1];

          return (
            <div
              key={room.id}
              onClick={() => onSelectRoom(room.id)}
              className="bg-white rounded-3xl border border-indigo-200/90 shadow-sm hover:shadow-xl transition-all duration-300 p-5 flex flex-col justify-between group cursor-pointer hover:-translate-y-1 relative overflow-hidden"
            >
              {/* Highlight Ribbon */}
              <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-black uppercase px-3 py-1 rounded-bl-xl tracking-wider">
                GỢI Ý HÔM NAY
              </div>

              <div>
                {/* Explainable Recommendation Box (Req 16) */}
                <div className="mb-3 pr-16">
                  <div className="text-[10px] font-black uppercase tracking-wider text-indigo-800 flex items-center gap-1 mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>VÌ SAO ĐƯỢC GỢI Ý?</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-blue-50/80 border border-blue-200/60 text-xs font-bold text-blue-900 leading-snug">
                    {reason}
                  </div>
                </div>

                {/* Product Info */}
                <div className="flex gap-3 items-center mb-3">
                  <img
                    src={room.productImage}
                    alt={room.productName}
                    className="w-16 h-16 rounded-2xl object-cover shrink-0 border border-slate-200"
                  />
                  <div className="min-w-0 flex-1">
                    <span className="text-[11px] text-slate-400 font-medium block truncate">
                      {room.supplierName}
                    </span>
                    <h3 className="font-extrabold text-sm text-slate-900 line-clamp-1 group-hover:text-blue-600 transition">
                      {room.emoji} {room.productName}
                    </h3>
                    <div className="flex items-baseline gap-1.5 mt-0.5">
                      <span className="text-base font-black text-[#3155FF]">
                        {formatVND(currentPrice)}
                      </span>
                      <span className="text-xs line-through text-slate-400">
                        {formatVND(room.initialPrice)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Progress toward next tier */}
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-1.5 mb-3">
                  <div className="flex justify-between text-xs font-semibold text-slate-600">
                    <span>
                      {room.totalQuantity} / {room.maxQuantity} {room.unit}
                    </span>
                    <span className="font-bold text-[#3155FF]">{percentFilled}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#3155FF] h-full rounded-full transition-all duration-500"
                      style={{ width: `${percentFilled}%` }}
                    />
                  </div>
                  {nextTier && (
                    <div className="text-[11px] font-bold text-amber-700 pt-0.5 flex items-center justify-between">
                      <span>Cơ hội hạ giá:</span>
                      <span>
                        Chỉ cần {nextTier.requiredQuantity} sp nữa → {formatVND(nextTier.nextPrice)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onJoinRoom(room.id);
                }}
                className="w-full py-2.5 rounded-xl font-black text-xs bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-sm flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <span>THAM GIA MỞ KHÓA GIÁ TỐT</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Demand Signals Banner (Req 16) */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50 to-cyan-50 border border-blue-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-700">
          <Flame className="w-4 h-4 text-amber-600 shrink-0 fill-amber-500" />
          <span>
            <strong>Tín hiệu nhu cầu khu vực:</strong> Đang có <strong>42 lượt mua gom</strong> nông
            sản và hàng tiêu dùng tại các điểm Smart Locker trong bán kính 3km hôm nay.
          </span>
        </div>
        <span className="text-[11px] font-bold text-blue-800 bg-white/80 px-2.5 py-1 rounded-lg border border-blue-300 shrink-0">
          DỮ LIỆU DEMO THỜI GIAN THỰC
        </span>
      </div>
    </section>
  );
};
