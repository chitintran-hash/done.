import React, { useState } from 'react';
import {
  Sparkles,
  Zap,
  Users,
  Target,
  ArrowRight,
  TrendingDown,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Share2,
  Building2,
  Boxes,
  Plus,
  AlertCircle,
  HelpCircle,
  X,
  MapPin,
  ChevronRight,
  Award,
  Layers,
  Search,
} from 'lucide-react';
import type {
  FlashMatchDemand,
  GroupRoom,
  SupplierOffer,
  User,
  FlashCommitment,
} from '../types';
import { formatVND } from '../utils/pricing';
import { aggregateDemandCurve, findAutoMatchRoom, findMergeableDemands } from '../utils/growthEngine';

interface FlashMatchHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  demands: FlashMatchDemand[];
  rooms: GroupRoom[];
  onCreateDemand: (demand: Omit<FlashMatchDemand, 'id' | 'createdAt' | 'commitments' | 'offers' | 'currentQuantity' | 'participantCount'>) => void;
  onJoinDemand: (demandId: string, quantity: number, commitmentType: 'interested' | 'committed', targetPrice?: number) => void;
  onAcceptOffer?: (demandId: string, offerId: string) => void;
  onMergeDemands?: (sourceDemandId: string, targetDemandId: string) => void;
  onSubmitSupplierOffer?: (demandId: string, offer: Omit<SupplierOffer, 'id' | 'demandId' | 'createdAt' | 'status'>) => void;
  onSelectRoom?: (roomId: string) => void;
}

export const FlashMatchHubModal: React.FC<FlashMatchHubModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  demands,
  rooms,
  onCreateDemand,
  onJoinDemand,
  onAcceptOffer,
  onMergeDemands,
  onSubmitSupplierOffer,
  onSelectRoom,
}) => {
  const [activeTab, setActiveTab] = useState<'pool' | 'create' | 'my_demands'>('pool');
  const [selectedDemand, setSelectedDemand] = useState<FlashMatchDemand | null>(null);

  // Filter state for Demand Pool
  const [filterArea, setFilterArea] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Commit modal state (Phần B)
  const [commitModalDemand, setCommitModalDemand] = useState<FlashMatchDemand | null>(null);
  const [commitQuantity, setCommitQuantity] = useState<number>(2);
  const [commitmentType, setCommitmentType] = useState<'interested' | 'committed'>('committed');
  const [targetMaxPrice, setTargetMaxPrice] = useState<number>(95000);

  // Supplier Offer modal state (Phần A, N)
  const [offerModalDemand, setOfferModalDemand] = useState<FlashMatchDemand | null>(null);
  const [offerUnitPrice, setOfferUnitPrice] = useState<number>(95000);
  const [offerMinQty, setOfferMinQty] = useState<number>(20);
  const [offerDelivery, setOfferDelivery] = useState<string>('Giao trong 24h tới Locker');
  const [offerNote, setOfferNote] = useState<string>('Hàng chuẩn xuất xưởng có hóa đơn GTGT');

  // Create demand form state (Phần A, E)
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Nước uống');
  const [newTargetQty, setNewTargetQty] = useState(25);
  const [newArea, setNewArea] = useState('TP. Thủ Đức');
  const [newPickupPoint, setNewPickupPoint] = useState('KTX Khu A – Locker Thông Minh Tòa A3');
  const [newDesc, setNewDesc] = useState('');

  if (!isOpen) return null;

  // Auto-Match check (Phần E: FlashAutoMatch)
  const autoMatchRoom = findAutoMatchRoom(newTitle, newCategory, rooms);

  // Filtered demands
  const filteredDemands = demands.filter((d) => {
    const matchArea = filterArea === 'all' || d.area === filterArea;
    const matchSearch =
      !searchQuery.trim() ||
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchArea && matchSearch;
  });

  const isSupplier = currentUser?.role === 'supplier';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-[#000181] via-[#3155FF] to-[#7B3FF2] text-white flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#C7F000] text-[#0C0D10] text-[10px] font-black uppercase tracking-wider">
                FlashMatch Engine
              </span>
              <span className="text-white/80 text-xs font-semibold">Tăng trưởng Mua Gom Nhu Cầu</span>
            </div>
            <h2 className="text-lg sm:text-2xl font-black text-white">
              Nhu Cầu Nhóm (Demand Pool) & Chào Giá Nhà Cung Cấp
            </h2>
            <p className="text-xs text-white/80 max-w-xl">
              Người mua phát tín hiệu nhu cầu $\rightarrow$ tập hợp số lượng $\rightarrow$ Nhà cung cấp gửi chào giá cạnh tranh.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-2.5 bg-slate-50 text-xs font-bold">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('pool')}
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                activeTab === 'pool'
                  ? 'bg-[#3155FF] text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              Nhu cầu đang gom ({demands.length})
            </button>
            <button
              onClick={() => setActiveTab('create')}
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'create'
                  ? 'bg-[#3155FF] text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              Tạo nhu cầu mới
            </button>
          </div>
          <span className="text-[11px] text-slate-500 hidden sm:inline">
            FlashCommit bảo mật: Không tiết lộ danh tính cá nhân người mua
          </span>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* TAB 1: DEMAND POOL */}
          {activeTab === 'pool' && (
            <div className="space-y-4">
              {/* Filter bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs">
                <div className="relative flex-1 w-full sm:w-auto">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Tìm nhu cầu theo tên sản phẩm, danh mục..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:border-[#3155FF]"
                  />
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <span className="text-slate-500 text-[11px] whitespace-nowrap">Khu vực:</span>
                  <select
                    value={filterArea}
                    onChange={(e) => setFilterArea(e.target.value)}
                    className="bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold focus:outline-hidden"
                  >
                    <option value="all">Tất cả khu vực</option>
                    <option value="TP. Thủ Đức">TP. Thủ Đức (KTX ĐHQG)</option>
                    <option value="Quận 7 (Phú Mỹ Hưng)">Quận 7 (Phú Mỹ Hưng)</option>
                    <option value="Bình Thạnh">Bình Thạnh</option>
                  </select>
                </div>
              </div>

              {/* Demands List */}
              <div className="space-y-4">
                {filteredDemands.map((demand) => {
                  const curve = aggregateDemandCurve(demand);
                  const mergeCandidates = findMergeableDemands(demand, demands);
                  const acceptedOffer = demand.offers.find((o) => o.id === demand.selectedOfferId);
                  const backupOffer = demand.offers.find((o) => o.id === demand.backupOfferId);

                  return (
                    <div
                      key={demand.id}
                      className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4 hover:border-[#3155FF]/40 transition"
                    >
                      {/* Top metadata */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded-full bg-blue-50 text-[#3155FF] border border-blue-200 font-bold text-[10px]">
                              {demand.category}
                            </span>
                            <span className="text-[11px] text-slate-500 flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-slate-400" />
                              {demand.area} • {demand.pickupPointName}
                            </span>
                          </div>
                          <h3 className="font-black text-slate-900 text-base mt-1">{demand.title}</h3>
                          <p className="text-xs text-slate-600 mt-0.5">{demand.description}</p>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-[10px] font-bold text-slate-400 uppercase block">Tiến độ gom</span>
                          <span className="text-lg font-black text-[#0C0D10]">
                            {demand.currentQuantity} / {demand.targetQuantity} suất
                          </span>
                          <span className="text-[10px] text-slate-500 block">
                            {demand.participantCount} người tham gia
                          </span>
                        </div>
                      </div>

                      {/* FlashCommit Signal Box (Phần B) */}
                      <div className="bg-[#FAF0FF] p-3 rounded-xl border border-[#E8A0FF] text-xs space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#7B3FF2] flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-[#7B3FF2]" />
                            Tín Hiệu FlashCommit (Độ cam kết mua thực)
                          </span>
                          <span className="text-[11px] text-[#7B3FF2] font-extrabold">
                            {curve.committedCount} người cam kết ({curve.committedQuantity} suất)
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                          <div className="bg-white/80 p-2 rounded-lg">
                            <span className="text-slate-400 block text-[10px]">Quan tâm chung</span>
                            <strong className="text-slate-800">{curve.interestedCount} người</strong>
                          </div>
                          <div className="bg-white/80 p-2 rounded-lg">
                            <span className="text-slate-400 block text-[10px]">Cam kết mua nếu $\le$ 95.000đ</span>
                            <strong className="text-emerald-700">
                              {curve.priceBrackets.find((b) => b.maxPrice <= 95000)?.quantity || 10} suất sẵn sàng
                            </strong>
                          </div>
                          <div className="bg-white/80 p-2 rounded-lg">
                            <span className="text-slate-400 block text-[10px]">Ước tính GMV tiềm năng</span>
                            <strong className="text-[#3155FF]">
                              {formatVND(demand.currentQuantity * 95000)}
                            </strong>
                          </div>
                        </div>
                      </div>

                      {/* Offers section (Phần A, AB) */}
                      {demand.offers.length > 0 && (
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-2">
                          <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                            <Boxes className="w-3.5 h-3.5 text-blue-600" />
                            Chào giá từ Nhà Cung Cấp ({demand.offers.length})
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {acceptedOffer && (
                              <div className="bg-white p-2.5 rounded-lg border-2 border-emerald-300">
                                <div className="flex items-center justify-between text-[11px]">
                                  <span className="font-bold text-slate-900">{acceptedOffer.supplierName}</span>
                                  <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[9px] font-black uppercase">
                                    Đang chọn (Chính)
                                  </span>
                                </div>
                                <div className="text-sm font-black text-[#0C0D10] mt-1">
                                  {formatVND(acceptedOffer.unitPrice)}/suất
                                </div>
                                <p className="text-[10px] text-slate-500 mt-0.5">{acceptedOffer.deliveryEstimate} • {acceptedOffer.note}</p>
                              </div>
                            )}

                            {backupOffer && (
                              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                                <div className="flex items-center justify-between text-[11px]">
                                  <span className="font-bold text-slate-700">{backupOffer.supplierName}</span>
                                  <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[9px] font-black uppercase">
                                    Chào giá dự phòng (Backup)
                                  </span>
                                </div>
                                <div className="text-sm font-black text-slate-800 mt-1">
                                  {formatVND(backupOffer.unitPrice)}/suất
                                </div>
                                <p className="text-[10px] text-slate-500 mt-0.5">{backupOffer.deliveryEstimate} • {backupOffer.note}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* FlashMerge Suggestion (Phần Z) */}
                      {mergeCandidates.length > 0 && (
                        <div className="bg-[#F5FBD9] p-3 rounded-xl border border-[#C7F000] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                          <div className="space-y-0.5">
                            <span className="font-black text-[#0C0D10] flex items-center gap-1 text-[11px]">
                              💡 Đề xuất FlashMerge: Có nhu cầu tương đồng gần bạn!
                            </span>
                            <p className="text-slate-700 text-[11px]">
                              Nhu cầu <strong>"{mergeCandidates[0].title}"</strong> có <strong>{mergeCandidates[0].currentQuantity} suất</strong>. Gộp lại sẽ đạt <strong>{demand.currentQuantity + mergeCandidates[0].currentQuantity} suất</strong> để đạt mốc giá rẻ hơn!
                            </p>
                          </div>
                          <button
                            onClick={() => onMergeDemands?.(demand.id, mergeCandidates[0].id)}
                            className="px-3 py-1.5 rounded-xl bg-[#0C0D10] text-[#C7F000] font-black text-xs hover:bg-slate-800 transition whitespace-nowrap cursor-pointer shadow-xs"
                          >
                            Xác nhận Gộp Nhu Cầu
                          </button>
                        </div>
                      )}

                      {/* Action buttons */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                        <span className="text-[11px] text-slate-400">
                          Hạn chốt chào giá: {new Date(demand.expiresAt).toLocaleTimeString('vi-VN')} {new Date(demand.expiresAt).toLocaleDateString('vi-VN')}
                        </span>

                        <div className="flex items-center gap-2">
                          {isSupplier ? (
                            <button
                              onClick={() => {
                                setOfferModalDemand(demand);
                                setOfferUnitPrice(95000);
                              }}
                              className="px-3.5 py-1.5 rounded-xl bg-[#3155FF] text-white font-bold text-xs hover:bg-[#000181] transition cursor-pointer shadow-xs"
                            >
                              Gửi Chào Giá (Supplier Offer)
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                setCommitModalDemand(demand);
                                setCommitQuantity(2);
                              }}
                              className="px-4 py-2 rounded-xl bg-[#3155FF] text-white font-black text-xs hover:bg-[#000181] transition cursor-pointer shadow-xs flex items-center gap-1.5"
                            >
                              <span>Tham Gia Nhu Cầu</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: CREATE DEMAND */}
          {activeTab === 'create' && (
            <div className="max-w-2xl mx-auto space-y-5 text-xs">
              <div className="bg-blue-50 p-4 rounded-2xl border border-blue-200">
                <h4 className="font-bold text-[#000181] text-sm flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#3155FF]" />
                  Tạo Nhu Cầu Mua Gom & Mở Đấu Thầu Giá Sỉ
                </h4>
                <p className="text-slate-600 text-[11px] mt-1">
                  Nếu sản phẩm bạn cần chưa có phòng mua chung nào, hãy đăng nhu cầu. FlashMatch sẽ gom thêm cư dân xung quanh và thông báo đến các nhà cung cấp uy tín gửi chào giá.
                </p>
              </div>

              {/* Proactive AutoMatch Detection (Phần E: FlashAutoMatch) */}
              {autoMatchRoom && (
                <div className="bg-[#FAF0FF] p-4 rounded-2xl border-2 border-[#7B3FF2] animate-bounce-short">
                  <div className="flex items-center justify-between text-xs font-bold text-[#7B3FF2] mb-1">
                    <span className="flex items-center gap-1.5">
                      ⚡ Phát hiện phòng mua chung tương thích!
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-[#7B3FF2] text-white text-[10px]">
                      FlashAutoMatch
                    </span>
                  </div>
                  <p className="text-slate-700 text-xs">
                    Đã có phòng <strong>"{autoMatchRoom.productName}"</strong> tại <strong>{autoMatchRoom.area}</strong> đang gom <strong>{autoMatchRoom.totalQuantity}/{autoMatchRoom.maxQuantity} suất</strong>.
                  </p>
                  <div className="mt-2.5 flex items-center justify-between">
                    <span className="text-sm font-black text-[#0C0D10]">
                      Giá hiện tại: {formatVND(autoMatchRoom.initialPrice)} (Có thể giảm thêm)
                    </span>
                    <button
                      onClick={() => {
                        onClose();
                        onSelectRoom?.(autoMatchRoom.id);
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-[#7B3FF2] text-white font-black text-xs hover:bg-[#5E2DBA] transition cursor-pointer shadow-xs"
                    >
                      Tham gia phòng hiện có thay vì tạo mới
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tên sản phẩm / nhu cầu gom *</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Nước khoáng Lavie 500ml thùng 24 chai..."
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:outline-hidden focus:border-[#3155FF]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Danh mục *</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:outline-hidden"
                    >
                      <option value="Nước uống">Nước uống & Đồ uống</option>
                      <option value="Thực phẩm">Thực phẩm & Nông sản</option>
                      <option value="Đồ gia dụng">Đồ gia dụng & Tiêu dùng</option>
                      <option value="Văn phòng phẩm">Văn phòng phẩm & Khác</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Mục tiêu số lượng cần gom *</label>
                    <input
                      type="number"
                      min={5}
                      max={500}
                      value={newTargetQty}
                      onChange={(e) => setNewTargetQty(Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:outline-hidden focus:border-[#3155FF]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Khu vực gom *</label>
                    <select
                      value={newArea}
                      onChange={(e) => setNewArea(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:outline-hidden"
                    >
                      <option value="TP. Thủ Đức">TP. Thủ Đức (Làng Đại học ĐHQG)</option>
                      <option value="Quận 7 (Phú Mỹ Hưng)">Quận 7 (Phú Mỹ Hưng - Tân Hưng)</option>
                      <option value="Bình Thạnh">Bình Thạnh (Landmark 81)</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Điểm nhận hàng mong muốn *</label>
                    <input
                      type="text"
                      value={newPickupPoint}
                      onChange={(e) => setNewPickupPoint(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:outline-hidden focus:border-[#3155FF]"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Mô tả chi tiết nhu cầu</label>
                  <textarea
                    rows={3}
                    placeholder="Ghi rõ yêu cầu quy cách, hạn sử dụng mong muốn, thời gian giao thuận tiện..."
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:outline-hidden focus:border-[#3155FF]"
                  />
                </div>

                <div className="pt-3 flex justify-end">
                  <button
                    disabled={!newTitle.trim()}
                    onClick={() => {
                      onCreateDemand({
                        creatorId: currentUser?.id || 'guest-buyer',
                        creatorName: currentUser?.name || 'Người mua ẩn danh',
                        title: newTitle,
                        category: newCategory,
                        description: newDesc,
                        targetQuantity: newTargetQty,
                        area: newArea,
                        pickupPointName: newPickupPoint,
                        status: 'gathering',
                        expiresAt: new Date(Date.now() + 3600000 * 24).toISOString(),
                      });
                      setActiveTab('pool');
                    }}
                    className={`px-5 py-2.5 rounded-xl font-black text-xs transition shadow-xs cursor-pointer ${
                      newTitle.trim()
                        ? 'bg-[#3155FF] text-white hover:bg-[#000181]'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    Đăng Nhu Cầu FlashMatch
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* SUB-MODAL: FLASHCOMMIT (Phần B) */}
        {commitModalDemand && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-2xs animate-fade-in">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[10px] font-black uppercase text-[#7B3FF2] tracking-wider block">
                    Thiết lập Cam Kết Mua (FlashCommit)
                  </span>
                  <h4 className="font-black text-slate-900 text-sm mt-0.5">
                    {commitModalDemand.title}
                  </h4>
                </div>
                <button
                  onClick={() => setCommitModalDemand(null)}
                  className="p-1 rounded-xl text-slate-400 hover:text-slate-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="bg-[#FAF0FF] p-3 rounded-xl border border-[#E8A0FF] space-y-1">
                <span className="font-bold text-[#7B3FF2] block">Tại sao nên cam kết?</span>
                <p className="text-slate-600 text-[11px]">
                  Tín hiệu cam kết số lượng giúp Nhà Cung Cấp tự tin giảm giá sâu hơn cho nhóm. Bạn chỉ thanh toán sau khi offer đạt điều kiện.
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Số lượng đăng ký (suất)</label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setCommitQuantity((q) => Math.max(1, q - 1))}
                      className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 font-bold text-slate-700"
                    >
                      -
                    </button>
                    <span className="text-base font-black text-slate-900">{commitQuantity}</span>
                    <button
                      onClick={() => setCommitQuantity((q) => q + 1)}
                      className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 font-bold text-slate-700"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Mức độ cam kết</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setCommitmentType('interested')}
                      className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                        commitmentType === 'interested'
                          ? 'border-[#3155FF] bg-blue-50 text-[#000181]'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <strong className="block text-xs">Quan tâm</strong>
                      <span className="text-[10px] text-slate-500">Chờ xem giá rồi quyết định</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setCommitmentType('committed')}
                      className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                        commitmentType === 'committed'
                          ? 'border-[#7B3FF2] bg-[#FAF0FF] text-[#7B3FF2]'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <strong className="block text-xs">Cam kết mua</strong>
                      <span className="text-[10px] text-slate-500">Nếu đạt mức giá mục tiêu</span>
                    </button>
                  </div>
                </div>

                {commitmentType === 'committed' && (
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Tôi sẵn sàng mua nếu giá $\le$
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        step={1000}
                        value={targetMaxPrice}
                        onChange={(e) => setTargetMaxPrice(Number(e.target.value))}
                        className="flex-1 p-2 rounded-xl border border-slate-300 text-xs font-bold"
                      />
                      <span className="font-mono text-slate-500">đ/suất</span>
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-1">
                      Nhà cung cấp chỉ thấy tổng số lượng cam kết, không thấy danh tính của bạn.
                    </span>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  onClick={() => setCommitModalDemand(null)}
                  className="px-3.5 py-1.5 rounded-xl text-slate-500 hover:bg-slate-100 font-bold cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  onClick={() => {
                    onJoinDemand(
                      commitModalDemand.id,
                      commitQuantity,
                      commitmentType,
                      commitmentType === 'committed' ? targetMaxPrice : undefined
                    );
                    setCommitModalDemand(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#3155FF] text-white font-black hover:bg-[#000181] transition cursor-pointer shadow-xs"
                >
                  Xác nhận tham gia
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SUB-MODAL: SUPPLIER OFFER (Phần A, N) */}
        {offerModalDemand && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-2xs animate-fade-in">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[10px] font-black uppercase text-blue-600 tracking-wider block">
                    Gửi Chào Giá FlashMatch (Supplier Offer)
                  </span>
                  <h4 className="font-black text-slate-900 text-sm mt-0.5">
                    {offerModalDemand.title}
                  </h4>
                </div>
                <button
                  onClick={() => setOfferModalDemand(null)}
                  className="p-1 rounded-xl text-slate-400 hover:text-slate-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Mức giá chào (đ/suất) *</label>
                    <input
                      type="number"
                      step={1000}
                      value={offerUnitPrice}
                      onChange={(e) => setOfferUnitPrice(Number(e.target.value))}
                      className="w-full p-2 rounded-xl border border-slate-300 text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Số lượng tối thiểu *</label>
                    <input
                      type="number"
                      value={offerMinQty}
                      onChange={(e) => setOfferMinQty(Number(e.target.value))}
                      className="w-full p-2 rounded-xl border border-slate-300 text-xs font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Thời gian cam kết giao *</label>
                  <input
                    type="text"
                    value={offerDelivery}
                    onChange={(e) => setOfferDelivery(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Ghi chú nguồn hàng / VAT</label>
                  <textarea
                    rows={2}
                    value={offerNote}
                    onChange={(e) => setOfferNote(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  onClick={() => setOfferModalDemand(null)}
                  className="px-3.5 py-1.5 rounded-xl text-slate-500 hover:bg-slate-100 font-bold cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  onClick={() => {
                    onSubmitSupplierOffer?.(offerModalDemand.id, {
                      supplierId: currentUser?.id || 'supplier-demo',
                      supplierName: currentUser?.name || 'Nhà Cung Cấp Đối Tác',
                      unitPrice: offerUnitPrice,
                      minQuantity: offerMinQty,
                      deliveryEstimate: offerDelivery,
                      note: offerNote,
                      priceTiers: [
                        { minQuantity: offerMinQty, price: offerUnitPrice },
                      ],
                    });
                    setOfferModalDemand(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#3155FF] text-white font-black hover:bg-[#000181] transition cursor-pointer shadow-xs"
                >
                  Gửi Chào Giá Ngay
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
