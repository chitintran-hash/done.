import React, { useState } from 'react';
import { GroupRoom, Product, Supplier, PickupPoint, PickupSlot } from '../types';
import {
  getCurrentPrice,
  formatVND,
  formatTime,
  DEFAULT_PLATFORM_COMMISSION_RATE,
  calculatePickupPointScore,
  formatPickupSlotWindow,
} from '../utils/pricing';
import { StatusBadge } from './StatusBadge';
import {
  Plus,
  Layers,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Edit2,
  X,
  Lock,
  ArrowRight,
  Calculator,
  MapPin,
  Sparkles,
  Calendar
} from 'lucide-react';

interface SupplierGroupRoomsProps {
  rooms: GroupRoom[];
  products: Product[];
  supplier: Supplier;
  pickupPoints?: PickupPoint[];
  pickupSlots?: PickupSlot[];
  commissionRate?: number;
  onAddRoom: (newRoom: GroupRoom) => void;
  onUpdateRoom: (room: GroupRoom) => void;
  onCancelRoom: (roomId: string, reason: string) => void;
  onSelectRoom: (roomId: string) => void;
  getSecondsLeft: (endAt: string) => number;
  showToast: (msg: string) => void;
}

export const SupplierGroupRoomsView: React.FC<SupplierGroupRoomsProps> = ({
  rooms,
  products,
  supplier,
  pickupPoints = [],
  pickupSlots = [],
  commissionRate = DEFAULT_PLATFORM_COMMISSION_RATE,
  onAddRoom,
  onUpdateRoom,
  onCancelRoom,
  onSelectRoom,
  getSecondsLeft,
  showToast,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'draft' | 'active' | 'completed' | 'cancelled'>('active');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [editingRoom, setEditingRoom] = useState<GroupRoom | null>(null);
  const [cancellingRoomId, setCancellingRoomId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState<string>('Hết hàng đột xuất tại nông trại');

  // Create Room Form State
  const [selectedProdId, setSelectedProdId] = useState<string>(products[0]?.id || '');
  const [maxQuantity, setMaxQuantity] = useState<number>(20);
  const [durationMinutes, setDurationMinutes] = useState<number>(60);
  const [pickupPoint, setPickupPoint] = useState<string>('KTX A – Locker 03');
  const [pickupAddress, setPickupAddress] = useState<string>('Khu KTX ĐHQG, Thủ Đức, TP.HCM');
  const [selectedPickupPointId, setSelectedPickupPointId] = useState<string>(
    '00000000-0000-0000-0000-000000000701'
  );
  const [selectedPickupSlotId, setSelectedPickupSlotId] = useState<string>(
    '00000000-0000-0000-0000-000000000712'
  );
  const [pointFilter, setPointFilter] = useState<string>('ALL');
  const [shippingFee, setShippingFee] = useState<number>(60000);
  const [initialPrice, setInitialPrice] = useState<number>(120000);
  const [t2Qty] = useState<number>(5);
  const [t2Price, setT2Price] = useState<number>(110000);
  const [t3Qty] = useState<number>(10);
  const [t3Price, setT3Price] = useState<number>(99000);
  const [t4Qty] = useState<number>(20);
  const [t4Price, setT4Price] = useState<number>(89000);
  const [roomDesc] = useState<string>('Phòng gom sản phẩm mở theo mức giá nhóm.');

  const supplierRooms = rooms.filter((r) => r.supplierId === supplier.id);

  const filteredRooms = supplierRooms.filter((r) => {
    if (activeTab === 'draft') return r.status === 'draft';
    if (activeTab === 'active') return r.status === 'active';
    if (activeTab === 'completed') return r.status === 'successful' || r.status === 'closed';
    if (activeTab === 'cancelled') return r.status === 'cancelled';
    return true;
  });

  const selectedProduct = products.find((p) => p.id === selectedProdId) || products[0];
  const unitCost = selectedProduct?.unitCost;

  // Build preview tiers for Profitability Preview (Req 17 & 18)
  const previewTiers = [
    { label: 'Tier 1 (1 – 4)', qty: 1, price: initialPrice },
    { label: `Tier 2 (${t2Qty} – ${t3Qty - 1})`, qty: t2Qty, price: t2Price },
    { label: `Tier 3 (${t3Qty} – ${t4Qty - 1})`, qty: t3Qty, price: t3Price },
    { label: `Tier 4 (${t4Qty} sp • Max)`, qty: t4Qty, price: t4Price },
  ];

  const hasLowMarginWarning =
    unitCost !== undefined &&
    unitCost > 0 &&
    previewTiers.some((t) => t.price <= unitCost);

  const handleOpenCreate = () => {
    if (products.length === 0) {
      showToast('Vui lòng thêm sản phẩm vào danh mục trước khi mở phòng gom.');
      return;
    }
    if (selectedProduct) {
      setMaxQuantity(Math.min(20, selectedProduct.stockQuantity));
    }
    setIsCreateModalOpen(true);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    if (maxQuantity > selectedProduct.stockQuantity) {
      showToast(`Số lượng tối đa (${maxQuantity}) không được vượt quá tồn kho khả dụng (${selectedProduct.stockQuantity})!`);
      return;
    }

    const now = Date.now();
    const durationMs = durationMinutes * 60 * 1000;
    const isVerified = supplier.verificationStatus === 'verified';

    const chosenPoint = pickupPoints.find((p) => p.id === selectedPickupPointId);
    if (chosenPoint && (chosenPoint.status === 'full' || chosenPoint.currentLoad >= chosenPoint.capacity)) {
      showToast('Điểm nhận hàng này đã đầy (FULL). Vui lòng chọn điểm nhận khác còn sức chứa!');
      return;
    }
    const chosenSlot = pickupSlots.find((s) => s.id === selectedPickupSlotId);
    const slotSnapshot = chosenSlot
      ? formatPickupSlotWindow(chosenSlot)
      : '26 Oct • 18:00 – 21:00';

    const newRoom: GroupRoom = {
      id: `room-${Date.now()}`,
      productId: selectedProduct.id,
      supplierId: supplier.id,
      productName: selectedProduct.name,
      category: selectedProduct.category,
      productImage: selectedProduct.image,
      unit: selectedProduct.unit,
      supplierName: supplier.businessName,
      participantCount: 0,
      totalQuantity: 0,
      maxParticipants: maxQuantity,
      maxQuantity: maxQuantity,
      initialPrice,
      priceTiers: [
        { minQuantity: 1, maxQuantity: t2Qty - 1, price: initialPrice },
        { minQuantity: t2Qty, maxQuantity: t3Qty - 1, price: t2Price },
        { minQuantity: t3Qty, maxQuantity: t4Qty - 1, price: t3Price },
        { minQuantity: t4Qty, price: t4Price },
      ],
      startAt: new Date(now).toISOString(),
      endAt: new Date(now + durationMs).toISOString(),
      pickupPoint: chosenPoint ? chosenPoint.name : pickupPoint,
      pickupAddress: chosenPoint ? chosenPoint.address : pickupAddress,
      pickupPointId: chosenPoint?.id,
      pickupSlotId: chosenSlot?.id,
      pickupPointName: chosenPoint ? chosenPoint.name : pickupPoint,
      pickupSlotSnapshot: slotSnapshot,
      normalShippingEstimate: 20000,
      totalShippingFee: shippingFee,
      distance: chosenPoint?.distance || '350m',
      distanceMeters: chosenPoint?.distanceMeters || 350,
      mapCoords: chosenPoint?.mapCoords || { x: Math.floor(25 + Math.random() * 50), y: Math.floor(25 + Math.random() * 50) },
      emoji: '📦',
      description: roomDesc.trim() || selectedProduct.description,
      status: isVerified ? 'active' : 'draft',
    };

    onAddRoom(newRoom);
    setIsCreateModalOpen(false);
    if (!isVerified) {
      showToast('Tài khoản chưa xác minh: Phòng gom đã được lưu dưới dạng BẢN NHÁP (Draft).');
    } else {
      showToast(`Đã mở phòng gom "${newRoom.productName}" thành công!`);
    }
  };

  const handleConfirmCancel = () => {
    if (!cancellingRoomId) return;
    onCancelRoom(cancellingRoomId, cancelReason);
    setCancellingRoomId(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Layers className="w-6 h-6 text-amber-600" />
            <span>Quản lý Phòng gom ({supplierRooms.length})</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Cấu hình các nấc thang giá, mô phỏng biên lợi nhuận theo từng bậc và địa điểm giao hàng tập trung
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="self-start sm:self-auto px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center space-x-1.5 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Tạo phòng gom mới</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex bg-white p-1 rounded-2xl border border-slate-200 overflow-x-auto scrollbar-none">
        {[
          { id: 'active', label: `Đang mở gom (${supplierRooms.filter((r) => r.status === 'active').length})` },
          { id: 'draft', label: `Bản nháp (${supplierRooms.filter((r) => r.status === 'draft').length})` },
          { id: 'completed', label: `Đã chốt / Hoàn tất (${supplierRooms.filter((r) => r.status === 'successful' || r.status === 'closed').length})` },
          { id: 'cancelled', label: `Đã hủy (${supplierRooms.filter((r) => r.status === 'cancelled').length})` },
          { id: 'all', label: `Tất cả (${supplierRooms.length})` },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
              activeTab === t.id ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Group Room List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRooms.length === 0 ? (
          <div className="col-span-full py-16 text-center bg-white rounded-3xl border border-slate-200 p-8">
            <Layers className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <span className="text-xs font-bold text-slate-500 block">Không có phòng gom nào trong mục này</span>
          </div>
        ) : (
          filteredRooms.map((room) => {
            const secondsLeft = getSecondsLeft(room.endAt);
            const currentPrice = room.finalPrice ?? getCurrentPrice(room.totalQuantity, room.priceTiers);

            return (
              <div
                key={room.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center space-x-3">
                      <img
                        src={room.productImage}
                        alt={room.productName}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-100"
                      />
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-bold text-slate-900 text-sm">{room.productName}</h4>
                        </div>
                        <span className="text-xs text-slate-400">
                          {room.unit} • Locker: <strong>{room.pickupPoint}</strong>
                        </span>
                      </div>
                    </div>
                    <StatusBadge status={room.status} size="sm" />
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-2 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>Người tham gia:</span>
                      <span className="font-bold text-slate-900">{room.participantCount} / {room.maxParticipants}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Số lượng đã gom:</span>
                      <span className="font-bold text-slate-900">{room.totalQuantity} / {room.maxQuantity} {room.unit}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>{room.finalPrice !== undefined ? 'Giá chốt:' : 'Giá hiện tại:'}</span>
                      <span className="font-black text-[#0C0D10] text-sm">{formatVND(currentPrice)}</span>
                    </div>
                    {room.status === 'active' && (
                      <div className="flex justify-between text-slate-500 text-[11px] pt-1 border-t border-slate-200">
                        <span>Hạn chót gom:</span>
                        <span className="font-mono font-bold text-slate-800">{formatTime(secondsLeft)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => onSelectRoom(room.id)}
                    className="text-xs font-bold text-[#0C0D10] hover:underline flex items-center space-x-1"
                  >
                    <span>Xem trang Buyer</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setEditingRoom(room)}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition flex items-center space-x-1"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Sửa</span>
                    </button>

                    {room.status === 'active' && (
                      <button
                        onClick={() => setCancellingRoomId(room.id)}
                        className="px-3 py-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-600 text-xs font-bold transition flex items-center space-x-1"
                      >
                        <XCircle className="w-3 h-3" />
                        <span>Hủy phòng</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* CREATE GROUP ROOM MODAL WITH PROFITABILITY PREVIEW (Req 17 & 18) */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative max-h-[92vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100 mb-4">
              <div>
                <span className="text-[11px] font-black uppercase text-amber-600 tracking-wider block">
                  THIẾT LẬP PHÒNG GOM & MÔ PHỎNG LỢI NHUẬN
                </span>
                <h3 className="text-lg font-black text-slate-900">Mở đợt gom giá nhóm mới</h3>
              </div>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              {/* Product Selector */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">Chọn sản phẩm từ danh mục *</label>
                <select
                  value={selectedProdId}
                  onChange={(e) => {
                    setSelectedProdId(e.target.value);
                    const prod = products.find((p) => p.id === e.target.value);
                    if (prod) {
                      setMaxQuantity(Math.min(20, prod.stockQuantity));
                    }
                  }}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-amber-500 bg-white font-medium"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (Tồn kho: {p.stockQuantity} {p.unit}
                      {p.unitCost ? ` • Giá vốn nội bộ: ${formatVND(p.unitCost)}` : ''})
                    </option>
                  ))}
                </select>
                {selectedProduct && (
                  <div className="mt-1.5 text-[11px] text-slate-500 flex flex-wrap items-center gap-2">
                    <span>Quy cách: <strong>{selectedProduct.unit}</strong></span>
                    <span>•</span>
                    <span>Tồn kho: <strong className="text-[#0C0D10]">{selectedProduct.stockQuantity}</strong></span>
                    <span>•</span>
                    <span>
                      Chi phí ước tính / đơn vị (nội bộ):{' '}
                      <strong className="text-amber-700">
                        {unitCost ? formatVND(unitCost) : 'Chưa thiết lập'}
                      </strong>
                    </span>
                  </div>
                )}
              </div>

              {/* Capacity & Duration */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Số lượng tối đa gom đợt này (Tối đa {selectedProduct?.stockQuantity}) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={selectedProduct?.stockQuantity || 100}
                    value={maxQuantity}
                    onChange={(e) => setMaxQuantity(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Thời lượng đợt gom (phút)</label>
                  <select
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="15">15 phút (Flash)</option>
                    <option value="30">30 phút</option>
                    <option value="60">1 giờ</option>
                    <option value="120">2 giờ</option>
                  </select>
                </div>
              </div>

              {/* Price Ladder Setup */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-black text-slate-900 block uppercase tracking-wider text-[11px]">
                    Cấu hình bậc thang giá theo số lượng gom
                  </span>
                  <span className="text-[10px] font-bold text-[#0C0D10] bg-[#EEF1FF] px-2 py-0.5 rounded-full border border-indigo-200">
                    Phí nền tảng demo: {Math.round(commissionRate * 100)}%
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-500 block mb-1">Tier 1 (Gốc)</span>
                    <input
                      type="number"
                      value={initialPrice}
                      onChange={(e) => setInitialPrice(Number(e.target.value))}
                      className="w-full p-1.5 border rounded text-xs font-bold"
                    />
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-500 block mb-1">Mốc {t2Qty}+ sp</span>
                    <input
                      type="number"
                      value={t2Price}
                      onChange={(e) => setT2Price(Number(e.target.value))}
                      className="w-full p-1.5 border rounded text-xs text-[#0C0D10] font-bold"
                    />
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-500 block mb-1">Mốc {t3Qty}+ sp</span>
                    <input
                      type="number"
                      value={t3Price}
                      onChange={(e) => setT3Price(Number(e.target.value))}
                      className="w-full p-1.5 border rounded text-xs text-[#0C0D10] font-bold"
                    />
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-500 block mb-1">Mốc {t4Qty}+ sp (Max)</span>
                    <input
                      type="number"
                      value={t4Price}
                      onChange={(e) => setT4Price(Number(e.target.value))}
                      className="w-full p-1.5 border rounded text-xs text-[#0C0D10] font-bold"
                    />
                  </div>
                </div>

                {/* Requirement 18: Price Tier vs Unit Cost Warning */}
                {hasLowMarginWarning && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 flex items-start space-x-2">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <strong>Cảnh báo: Giá tier này thấp hơn hoặc bằng chi phí ước tính ({formatVND(unitCost!)}).</strong>
                      <span className="block text-[11px] text-rose-700 mt-0.5">
                        Bạn vẫn có thể lưu phòng gom nếu đây là chiến dịch xả kho/khuyến mãi, nhưng hãy kiểm tra lại biên lợi nhuận bên dưới.
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Requirement 17: PROFITABILITY PREVIEW */}
              <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-200 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span className="font-black text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <Calculator className="w-4 h-4 text-amber-600" />
                    <span>Profitability Preview (Mô phỏng Lợi nhuận theo Bậc giá)</span>
                  </span>
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-lg">
                    Ước tính – chưa bao gồm mọi chi phí vận hành
                  </span>
                </div>

                <div className="overflow-x-auto bg-white rounded-xl border border-amber-200/80">
                  <table className="w-full text-left text-[11px]">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                      <tr>
                        <th className="py-2.5 px-3">Tier Quantity</th>
                        <th className="py-2.5 px-3">Selling Price</th>
                        <th className="py-2.5 px-3">Est. Unit Margin</th>
                        <th className="py-2.5 px-3">Est. Total Margin</th>
                        <th className="py-2.5 px-3">Platform Fee ({Math.round(commissionRate * 100)}%)</th>
                        <th className="py-2.5 px-3">Est. Supplier Net</th>
                        <th className="py-2.5 px-3 text-right">Est. Contribution</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {previewTiers.map((t, idx) => {
                        const gmvTier = t.price * t.qty;
                        const feeTier = Math.round(gmvTier * commissionRate);
                        const supplierNetTier = gmvTier - feeTier;
                        const unitMargin = unitCost !== undefined ? t.price - unitCost : null;
                        const totalGrossMargin = unitMargin !== null ? unitMargin * t.qty : null;
                        const netContribution = totalGrossMargin !== null ? totalGrossMargin - feeTier : null;
                        const isBelowCost = unitCost !== undefined && t.price <= unitCost;

                        return (
                          <tr key={idx} className={isBelowCost ? 'bg-rose-50/70' : ''}>
                            <td className="py-2.5 px-3 font-bold text-slate-900">
                              {t.label} ({t.qty} sp)
                            </td>
                            <td className="py-2.5 px-3 font-bold text-slate-800">
                              {formatVND(t.price)}
                              {isBelowCost && (
                                <span className="ml-1 text-[9px] bg-rose-100 text-rose-700 font-black px-1.5 py-0.2 rounded">
                                  ≤ Giá vốn
                                </span>
                              )}
                            </td>
                            <td className="py-2.5 px-3 font-semibold">
                              {unitMargin !== null ? (
                                <span className={unitMargin <= 0 ? 'text-rose-600 font-bold' : 'text-slate-700'}>
                                  {formatVND(unitMargin)}
                                </span>
                              ) : (
                                <span className="text-slate-400">—</span>
                              )}
                            </td>
                            <td className="py-2.5 px-3 font-semibold">
                              {totalGrossMargin !== null ? (
                                <span className={totalGrossMargin <= 0 ? 'text-rose-600 font-bold' : 'text-slate-800'}>
                                  {formatVND(totalGrossMargin)}
                                </span>
                              ) : (
                                <span className="text-slate-400">—</span>
                              )}
                            </td>
                            <td className="py-2.5 px-3 font-semibold text-[#3155FF]">
                              -{formatVND(feeTier)}
                            </td>
                            <td className="py-2.5 px-3 font-bold text-[#0C0D10]">
                              {formatVND(supplierNetTier)}
                            </td>
                            <td className="py-2.5 px-3 text-right font-black">
                              {netContribution !== null ? (
                                <span className={netContribution < 0 ? 'text-rose-600' : 'text-[#0C0D10]'}>
                                  {formatVND(netContribution)}
                                </span>
                              ) : (
                                <span className="text-slate-400">Chưa nhập giá vốn</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Step 1 & Step 2: Pickup Point Network & Pickup Slot Selection (Req 10, 11, 35, 43, 44) */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="font-black text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-orange-600" />
                      <span>Bước 1: Chọn Điểm Nhận Hàng Chung (Choose Pickup Point)</span>
                    </span>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Gợi ý dựa trên khoảng cách, sức chứa và lượng phòng đang hoạt động
                    </p>
                  </div>

                  {/* Filter Pills (Req 35) */}
                  <div className="flex flex-wrap gap-1">
                    {[
                      { id: 'ALL', label: 'Tất cả' },
                      { id: 'NEAREST', label: 'Nearest' },
                      { id: 'AVAILABLE', label: 'Available Capacity' },
                      { id: 'dorm', label: 'Dorm' },
                      { id: 'locker', label: 'Locker' },
                      { id: 'apartment', label: 'Apartment' },
                      { id: 'store', label: 'Store' },
                    ].map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setPointFilter(f.id)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition cursor-pointer ${
                          pointFilter === f.id
                            ? 'bg-slate-900 text-white'
                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Pickup Points Cards */}
                {pickupPoints.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {(() => {
                      const activePoints = pickupPoints.filter((p) => p.status !== 'inactive');
                      const scored = activePoints.map((pt) => {
                        const activeRoomCount = rooms.filter(
                          (r) =>
                            r.status === 'active' &&
                            (r.pickupPointId === pt.id || r.pickupPoint === pt.name)
                        ).length;
                        return {
                          pt,
                          activeRoomCount,
                          score: calculatePickupPointScore(pt, activeRoomCount),
                        };
                      });
                      const bestId = [...scored].sort((a, b) => b.score - a.score)[0]?.pt.id;

                      let displayed = [...scored];
                      if (pointFilter === 'NEAREST') {
                        displayed.sort(
                          (a, b) => (a.pt.distanceMeters || 400) - (b.pt.distanceMeters || 400)
                        );
                      } else if (pointFilter === 'AVAILABLE') {
                        displayed = displayed.filter(
                          (x) => x.pt.status === 'active' && x.pt.currentLoad < x.pt.capacity
                        );
                      } else if (
                        pointFilter === 'dorm' ||
                        pointFilter === 'locker' ||
                        pointFilter === 'apartment' ||
                        pointFilter === 'store'
                      ) {
                        displayed = displayed.filter((x) => x.pt.type === pointFilter);
                      }

                      return displayed.map(({ pt, activeRoomCount }) => {
                        const isFull = pt.status === 'full' || pt.currentLoad >= pt.capacity;
                        const isSelected = selectedPickupPointId === pt.id;
                        const isBest = pt.id === bestId && !isFull;

                        return (
                          <div
                            key={pt.id}
                            onClick={() => {
                              if (isFull) {
                                showToast('Điểm nhận này đã ĐẦY (FULL), không thể gán thêm phòng gom.');
                                return;
                              }
                              setSelectedPickupPointId(pt.id);
                              setPickupPoint(pt.name);
                              setPickupAddress(pt.address);
                              const firstAvailableSlot = pickupSlots.find(
                                (s) =>
                                  s.pickupPointId === pt.id &&
                                  s.status === 'available' &&
                                  s.reservedCount < s.capacity
                              );
                              if (firstAvailableSlot) {
                                setSelectedPickupSlotId(firstAvailableSlot.id);
                              }
                            }}
                            className={`p-3 rounded-xl border text-left transition relative ${
                              isFull
                                ? 'bg-slate-100 border-slate-200 opacity-60 cursor-not-allowed'
                                : isSelected
                                ? 'bg-amber-50/80 border-amber-500 ring-2 ring-amber-500/20 cursor-pointer'
                                : 'bg-white border-slate-200 hover:border-amber-300 cursor-pointer'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5 flex-wrap">
                                <span>{pt.name}</span>
                                {isBest && (
                                  <span
                                    title="Gợi ý dựa trên khoảng cách, sức chứa và lượng phòng đang hoạt động"
                                    className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[9px] font-black bg-[#F5FBD9] text-emerald-800 border border-[#C7F000]"
                                  >
                                    <Sparkles className="w-2.5 h-2.5" />
                                    Phù hợp nhất
                                  </span>
                                )}
                              </div>
                              <span
                                className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase ${
                                  isFull
                                    ? 'bg-rose-100 text-rose-700'
                                    : 'bg-slate-100 text-slate-700'
                                }`}
                              >
                                {isFull ? 'FULL' : `${pt.currentLoad}/${pt.capacity}`}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-500 mt-1 truncate">{pt.address}</p>
                            <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1.5 pt-1.5 border-t border-slate-100">
                              <span>Cách {pt.distance || '350m'} • {pt.operatingHours}</span>
                              <span>{activeRoomCount} phòng đang mở</span>
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>
                ) : (
                  <input
                    type="text"
                    value={pickupPoint}
                    onChange={(e) => setPickupPoint(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                  />
                )}

                {/* Step 2: Choose Pickup Slot (Req 10, 11) */}
                <div className="pt-2 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#3155FF]" />
                      <span>Bước 2: Chọn Khung Giờ Nhận Hàng (Choose Pickup Slot)</span>
                    </label>
                    <select
                      value={selectedPickupSlotId}
                      onChange={(e) => setSelectedPickupSlotId(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-semibold text-slate-800"
                    >
                      {pickupSlots
                        .filter(
                          (s) =>
                            (!selectedPickupPointId || s.pickupPointId === selectedPickupPointId) &&
                            s.status === 'available' &&
                            s.reservedCount < s.capacity
                        )
                        .map((s) => (
                          <option key={s.id} value={s.id}>
                            {formatPickupSlotWindow(s)} (Còn trống {s.capacity - s.reservedCount}/{s.capacity} chỗ)
                          </option>
                        ))}
                      {pickupSlots.filter(
                        (s) =>
                          (!selectedPickupPointId || s.pickupPointId === selectedPickupPointId) &&
                          s.status === 'available' &&
                          s.reservedCount < s.capacity
                      ).length === 0 && (
                        <option value="default-slot">26 Oct • 18:00 – 21:00 (Khung giờ tiêu chuẩn)</option>
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Tổng cước xe gom (chia đều cho Buyer, không tính phí sàn)
                    </label>
                    <input
                      type="number"
                      value={shippingFee}
                      onChange={(e) => setShippingFee(Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-bold"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="w-1/3 py-3 rounded-xl border border-slate-300 font-bold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold transition shadow-md"
                >
                  PHÁT HÀNH PHÒNG GOM
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT ROOM MODAL */}
      {editingRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <span className="text-[11px] font-black uppercase text-amber-600 tracking-wider block">
                  CHỈNH SỬA PHÒNG GOM
                </span>
                <h3 className="text-base font-black text-slate-900">{editingRoom.productName}</h3>
                <span className="text-xs text-slate-400">
                  Số người đã tham gia: <strong>{editingRoom.participantCount}</strong>
                </span>
              </div>
              <button onClick={() => setEditingRoom(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {editingRoom.participantCount > 0 ? (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 flex items-start space-x-2">
                  <Lock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Quy tắc bảo vệ người mua:</strong> Không thể thay đổi các bậc giá sau khi đã có người tham gia phòng gom ({editingRoom.participantCount} người).
                  </span>
                </div>
              ) : (
                <div className="p-3 bg-[#F5FBD9] border border-[#C7F000] rounded-xl text-emerald-800 flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#0C0D10] shrink-0" />
                  <span>Phòng chưa có người tham gia, bạn có thể tự do điều chỉnh thông số.</span>
                </div>
              )}

              <div>
                <label className="font-bold text-slate-700 block mb-1">Mô tả và hướng dẫn nhận hàng</label>
                <textarea
                  rows={3}
                  value={editingRoom.description}
                  onChange={(e) => setEditingRoom({ ...editingRoom, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Địa chỉ nhận hàng</label>
                <input
                  type="text"
                  value={editingRoom.pickupAddress}
                  onChange={(e) => setEditingRoom({ ...editingRoom, pickupAddress: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div className="pt-2 flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => setEditingRoom(null)}
                  className="w-1/3 py-2.5 rounded-xl border border-slate-300 font-bold"
                >
                  Đóng
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onUpdateRoom(editingRoom);
                    setEditingRoom(null);
                    showToast('Đã lưu thông tin phòng gom!');
                  }}
                  className="w-2/3 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold transition shadow-md"
                >
                  LƯU THAY ĐỔI
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CANCEL ROOM CONFIRMATION MODAL */}
      {cancellingRoomId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 text-xs space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="text-base font-black text-slate-900">Xác nhận HỦY phòng gom?</h3>
              <p className="text-slate-500 mt-1">
                Phòng gom sẽ chuyển sang trạng thái CANCELLED và gửi thông báo tự động đến tất cả người mua đã tham gia.
              </p>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Lý do hủy phòng</label>
              <textarea
                rows={2}
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="pt-2 flex items-center space-x-3">
              <button
                type="button"
                onClick={() => setCancellingRoomId(null)}
                className="w-1/2 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-700"
              >
                Giữ lại phòng
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                className="w-1/2 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold transition shadow-md shadow-rose-600/20"
              >
                XÁC NHẬN HỦY
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
