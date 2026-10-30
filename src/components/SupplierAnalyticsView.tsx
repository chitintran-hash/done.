import React, { useMemo } from 'react';
import { GroupRoom, Order, Review, Supplier, DeliveryBatch } from '../types';
import { formatVND, getOrderFinancialSnapshot } from '../utils/pricing';
import { BarChart3, Star, Trophy, Layers, Truck, Sparkles } from 'lucide-react';

interface SupplierAnalyticsProps {
  supplier: Supplier;
  rooms: GroupRoom[];
  orders: Order[];
  reviews: Review[];
  batches?: DeliveryBatch[];
}

// Requirement 25 & Phase 7 Req 36-38: Extend Supplier Analytics with GMV, Net Earnings, Platform Fees, Average Order Value,
// Units Sold, Average Group Size, Top Products, Best Performing Price Tier + Batch Efficiency & Logistics Savings.
export const SupplierAnalyticsView: React.FC<SupplierAnalyticsProps> = ({
  supplier,
  rooms,
  orders,
  batches = [],
}) => {
  const supplierRooms = useMemo(
    () => rooms.filter((r) => r.supplierId === supplier.id),
    [rooms, supplier.id]
  );

  const validSupplierOrders = useMemo(
    () =>
      orders.filter(
        (o) =>
          (!o.supplierId || o.supplierId === supplier.id) &&
          o.status !== 'cancelled' &&
          o.status !== 'refunded'
      ),
    [orders, supplier.id]
  );

  // Financial & Operational Calculations from real order/room data (Req 25)
  const gmv = validSupplierOrders.reduce((acc, o) => acc + o.productSubtotal, 0);
  const platformFees = validSupplierOrders.reduce(
    (acc, o) => acc + getOrderFinancialSnapshot(o).effectiveCommission,
    0
  );
  const netEarnings = validSupplierOrders.reduce(
    (acc, o) => acc + getOrderFinancialSnapshot(o).effectiveNet,
    0
  );
  const averageOrderValue =
    validSupplierOrders.length > 0 ? Math.round(gmv / validSupplierOrders.length) : 0;

  const totalUnitsSold = validSupplierOrders.reduce((acc, o) => acc + o.quantity, 0);

  const totalParticipants = supplierRooms.reduce((acc, r) => acc + r.participantCount, 0);
  const averageGroupSize =
    supplierRooms.length > 0 ? (totalParticipants / supplierRooms.length).toFixed(1) : '0';

  // Top Products by GMV & Units Sold
  const topProducts = useMemo(() => {
    const map: Record<string, { name: string; units: number; gmv: number; net: number }> = {};

    validSupplierOrders.forEach((o) => {
      const snap = getOrderFinancialSnapshot(o);
      if (!map[o.productName]) {
        map[o.productName] = { name: o.productName, units: 0, gmv: 0, net: 0 };
      }
      map[o.productName].units += o.quantity;
      map[o.productName].gmv += o.productSubtotal;
      map[o.productName].net += snap.effectiveNet;
    });

    // Fallback to rooms if no paid orders yet
    if (Object.keys(map).length === 0) {
      supplierRooms.forEach((r) => {
        if (!map[r.productName]) {
          map[r.productName] = { name: r.productName, units: 0, gmv: 0, net: 0 };
        }
        map[r.productName].units += r.totalQuantity;
        const p = r.finalPrice ?? r.priceTiers[r.priceTiers.length - 1]?.price ?? r.initialPrice;
        const estGmv = r.totalQuantity * p;
        map[r.productName].gmv += estGmv;
        map[r.productName].net += estGmv - Math.round(estGmv * 0.07);
      });
    }

    return Object.values(map).sort((a, b) => b.gmv - a.gmv);
  }, [validSupplierOrders, supplierRooms]);

  // Best Performing Price Tier (Req 25)
  const bestPerformingTier = useMemo(() => {
    const tierStats: Record<string, { label: string; units: number; roomsCount: number }> = {};

    supplierRooms.forEach((r) => {
      const unlockedTier = [...r.priceTiers]
        .sort((a, b) => b.minQuantity - a.minQuantity)
        .find((t) => r.totalQuantity >= t.minQuantity) || r.priceTiers[0];

      if (!unlockedTier) return;
      const key = unlockedTier.maxQuantity
        ? `Mốc ${unlockedTier.minQuantity}–${unlockedTier.maxQuantity} đơn vị`
        : `Mốc tối đa ${unlockedTier.minQuantity}+ đơn vị`;

      if (!tierStats[key]) {
        tierStats[key] = { label: key, units: 0, roomsCount: 0 };
      }
      tierStats[key].units += r.totalQuantity;
      tierStats[key].roomsCount += 1;
    });

    const sorted = Object.values(tierStats).sort((a, b) => b.units - a.units);
    return sorted[0] || { label: 'Mốc 20+ đơn vị (Tier 4)', units: totalUnitsSold, roomsCount: 1 };
  }, [supplierRooms, totalUnitsSold]);

  // Category breakdown
  const categoryMap: Record<string, number> = {};
  supplierRooms.forEach((r) => {
    categoryMap[r.category] = (categoryMap[r.category] || 0) + r.totalQuantity;
  });

  // Phase 7 Req 36, 37, 38: Batch Efficiency, Logistics Savings & Delivery Trips Reduced
  const supplierBatches = batches.filter((b) => b.supplierId === supplier.id);
  const pooledOrdersCount =
    supplierBatches.length > 0
      ? supplierBatches.reduce((sum, b) => sum + b.totalOrders, 0)
      : Math.max(validSupplierOrders.length, totalParticipants);
  const batchDeliveriesCount = Math.max(1, supplierBatches.length || supplierRooms.length);
  const tripsAvoided = Math.max(0, pooledOrdersCount - batchDeliveriesCount);
  const normalShipPerOrder = 20000;
  const estIndividualShippingTotal = pooledOrdersCount * normalShipPerOrder;
  const estSharedShippingTotal =
    supplierBatches.length > 0
      ? supplierBatches.reduce((sum, b) => sum + b.totalShippingFee, 0)
      : supplierRooms.reduce((sum, r) => sum + r.totalShippingFee, 0);
  const estLogisticsSaving = Math.max(0, estIndividualShippingTotal - estSharedShippingTotal);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header Profile Badge */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-black text-slate-900">{supplier.businessName}</h2>
            <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-300 uppercase">
              {supplier.verificationStatus}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Loại hình: <strong>{supplier.supplierType}</strong> • {supplier.location || 'TP. Hồ Chí Minh'}
          </p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 flex items-center space-x-3">
          <Star className="w-8 h-8 text-amber-500 fill-amber-400 shrink-0" />
          <div>
            <div className="text-lg font-black text-slate-900 leading-tight">
              {supplier.rating.toFixed(1)} <span className="text-xs text-slate-400 font-normal">/ 5.0</span>
            </div>
            <span className="text-[11px] text-amber-800 font-semibold">{supplier.totalReviews} lượt đánh giá thực</span>
          </div>
        </div>
      </div>

      {/* Requirement 25: Supplier Financial & Operational KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-400 font-semibold">GMV (Tổng tiền hàng)</span>
          <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">{formatVND(gmv)}</div>
          <span className="text-[11px] text-slate-400 mt-1 inline-block">
            Từ {validSupplierOrders.length} đơn hợp lệ
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-400 font-semibold">Net Earnings (Thực nhận)</span>
          <div className="text-xl sm:text-2xl font-black text-[#0C0D10] mt-1">{formatVND(netEarnings)}</div>
          <span className="text-[11px] text-[#0C0D10] font-bold mt-1 inline-block">Sau trừ phí nền tảng</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-400 font-semibold">Platform Fees (Phí sàn)</span>
          <div className="text-xl sm:text-2xl font-black text-[#3155FF] mt-1">{formatVND(platformFees)}</div>
          <span className="text-[11px] text-slate-400 mt-1 inline-block">Phí nền tảng demo</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-400 font-semibold">Average Order Value (AOV)</span>
          <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">{formatVND(averageOrderValue)}</div>
          <span className="text-[11px] text-slate-400 mt-1 inline-block">Giá trị trung bình / đơn</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-400 font-semibold">Units Sold</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{totalUnitsSold}</div>
          <span className="text-[11px] text-slate-400 mt-1 inline-block">Đơn vị sản phẩm đã bán</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-400 font-semibold">Average Group Size</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{averageGroupSize}</div>
          <span className="text-[11px] text-slate-400 mt-1 inline-block">Người tham gia / phòng</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm col-span-2">
          <span className="text-xs text-amber-700 font-bold flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" /> Best Performing Price Tier (Nấc giá hiệu quả nhất)
          </span>
          <div className="text-lg sm:text-xl font-black text-slate-900 mt-1">
            {bestPerformingTier.label}
          </div>
          <span className="text-[11px] text-[#0C0D10] font-semibold mt-1 inline-block">
            Đã gom {bestPerformingTier.units} đơn vị qua {bestPerformingTier.roomsCount} phòng gom
          </span>
        </div>
      </div>

      {/* Phase 7 Req 36, 37, 38: Batch Efficiency & Simulated Logistics Savings */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-indigo-50 rounded-3xl border border-[#C7F000] p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-emerald-800 bg-[#F5FBD9] px-2.5 py-0.5 rounded-full">
              <Truck className="w-3.5 h-3.5" />
              Hiệu quả Gom Đơn & Giao Hàng Chung (Batch Logistics Efficiency)
            </span>
            <h3 className="text-base font-black text-slate-900 mt-1">
              Tác động tối ưu hóa vận chuyển chặng cuối (Last-Mile Consolidation)
            </h3>
          </div>
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0C0D10] bg-white px-3 py-1 rounded-full border border-indigo-200 self-start sm:self-auto">
            <Sparkles className="w-3.5 h-3.5" />
            Ước tính mô phỏng
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-4 border border-emerald-100">
            <div className="text-xs font-bold text-slate-500">
              Estimated Delivery Trips Reduced
            </div>
            <div className="text-2xl font-black text-[#0C0D10] mt-1">
              -{tripsAvoided} chuyến giao lẻ
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Individual orders: <strong>{pooledOrdersCount}</strong> → Batch deliveries:{' '}
              <strong>{batchDeliveriesCount}</strong> (Estimated Individual deliveries avoided:{' '}
              <strong>{tripsAvoided}</strong>)
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-emerald-100">
            <div className="text-xs font-bold text-slate-500">
              So sánh chi phí giao lẻ vs giao chung
            </div>
            <div className="text-sm font-bold text-slate-800 mt-1.5 space-y-0.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Est. individual shipping ({pooledOrdersCount} × 20k):</span>
                <span className="line-through text-slate-400">{formatVND(estIndividualShippingTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Shared batch shipping:</span>
                <span className="font-black text-[#0C0D10]">{formatVND(estSharedShippingTotal)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-[#C7F000]">
            <div className="text-xs font-bold text-[#0C0D10]">
              Estimated Logistics Saving (Ước tính mô phỏng)
            </div>
            <div className="text-2xl font-black text-[#0C0D10] mt-1">
              {formatVND(estLogisticsSaving)}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Tổng cước vận chuyển tiết kiệm cho cộng đồng người mua nhờ gom chung điểm nhận
            </div>
          </div>
        </div>
      </div>

      {/* Top Products & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>Top Products (Sản phẩm dẫn đầu doanh số)</span>
          </h3>

          <div className="divide-y divide-slate-100 text-xs">
            {topProducts.slice(0, 5).map((prod, idx) => (
              <div key={prod.name} className="py-3 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="w-6 h-6 rounded-lg bg-amber-100 text-amber-800 font-black flex items-center justify-center text-[11px]">
                    #{idx + 1}
                  </span>
                  <div>
                    <div className="font-bold text-slate-900">{prod.name}</div>
                    <div className="text-[11px] text-slate-400">Sản lượng: {prod.units} đơn vị</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-black text-[#0C0D10]">{formatVND(prod.gmv)}</div>
                  <div className="text-[10px] text-slate-400">Net: {formatVND(prod.net)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
            <BarChart3 className="w-4 h-4 text-[#0C0D10]" />
            <span>Sản lượng gom theo ngành hàng (Units Pooled by Category)</span>
          </h3>

          <div className="space-y-3 pt-2">
            {Object.entries(categoryMap).map(([cat, qty]) => {
              const max = Math.max(...Object.values(categoryMap), 1);
              const percent = Math.round((qty / max) * 100);

              return (
                <div key={cat} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-slate-700">
                    <span>{cat}</span>
                    <span className="text-[#0C0D10]">{qty} sản phẩm</span>
                  </div>
                  <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all duration-700"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
