import React, { useState } from 'react';
import {
  Truck,
  Package,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Eye,
  X,
  ArrowRight,
  ShieldCheck,
  Users,
  Calendar,
} from 'lucide-react';
import type {
  DeliveryBatch,
  DeliveryBatchStatus,
  DeliveryEvent,
  DeliveryIssue,
  DeliveryIssueType,
  GroupRoom,
  Order,
  PickupPoint,
  User,
} from '../types';
import { formatCurrency, getMaskedBuyerName } from '../utils/pricing';

type SupplierLogisticsViewProps = {
  supplierId: string;
  batches: DeliveryBatch[];
  events: DeliveryEvent[];
  issues: DeliveryIssue[];
  rooms: GroupRoom[];
  orders: Order[];
  pickupPoints: PickupPoint[];
  users: User[];
  onAdvanceBatchStatus: (
    batchId: string,
    nextStatus: DeliveryBatchStatus,
    title: string,
    description?: string
  ) => void;
  onReportIssue: (batchId: string, issueType: DeliveryIssueType, note: string) => void;
};

const STATUS_BADGE: Record<
  DeliveryBatchStatus,
  { label: string; color: string; bg: string }
> = {
  planned: {
    label: 'Planned (Chờ xác nhận)',
    color: 'text-amber-700',
    bg: 'bg-amber-50 border-amber-200',
  },
  confirmed: {
    label: 'Confirmed (Đã xác nhận)',
    color: 'text-blue-700',
    bg: 'bg-blue-50 border-blue-200',
  },
  picked_up_from_supplier: {
    label: 'Handed Over (Đã bàn giao xe)',
    color: 'text-[#000181]',
    bg: 'bg-[#EFFBFF] border-indigo-200',
  },
  in_transit: {
    label: 'In Transit (Đang vận chuyển)',
    color: 'text-[#000181]',
    bg: 'bg-[#FAF0FF] border-[#E8A0FF]',
  },
  arrived_at_pickup: {
    label: 'Arrived at Pickup (Đã đến điểm nhận)',
    color: 'text-[#000181]',
    bg: 'bg-[#F4FFE8] border-[#D0FFA4]',
  },
  completed: {
    label: 'Completed (Hoàn tất giao nhận)',
    color: 'text-teal-700',
    bg: 'bg-teal-50 border-teal-200',
  },
  cancelled: {
    label: 'Cancelled (Đã hủy)',
    color: 'text-slate-600',
    bg: 'bg-slate-100 border-slate-200',
  },
  delivery_issue: {
    label: 'Delivery Issue (Sự cố vận chuyển)',
    color: 'text-rose-700',
    bg: 'bg-rose-50 border-rose-200',
  },
};

export const SupplierLogisticsView: React.FC<SupplierLogisticsViewProps> = ({
  supplierId,
  batches,
  events,
  issues,
  rooms,
  orders,
  pickupPoints,
  users,
  onAdvanceBatchStatus,
  onReportIssue,
}) => {
  const [selectedBatch, setSelectedBatch] = useState<DeliveryBatch | null>(null);
  const [issueModalBatch, setIssueModalBatch] = useState<DeliveryBatch | null>(null);
  const [issueType, setIssueType] = useState<DeliveryIssueType>('Delayed');
  const [issueNote, setIssueNote] = useState('');

  const supplierBatches = batches.filter((b) => b.supplierId === supplierId);

  const getBatchOrders = (batch: DeliveryBatch) =>
    orders.filter(
      (o) =>
        (o.deliveryBatchId === batch.id || o.roomId === batch.roomId) &&
        o.status !== 'cancelled' &&
        o.status !== 'refunded'
    );

  const handleIssueSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueModalBatch) return;
    onReportIssue(issueModalBatch.id, issueType, issueNote.trim() || `Sự cố: ${issueType}`);
    setIssueModalBatch(null);
    setIssueNote('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-orange-700 text-xs font-bold mb-2">
            <Truck className="w-3.5 h-3.5" />
            LOGISTICS GOM ĐƠN & BÀN GIAO LÔ HÀNG (SIMULATED)
          </div>
          <h1 className="text-2xl font-black text-slate-900">
            Quản lý Lô Giao Hàng Chung (Consolidated Batches)
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Mỗi phòng gom đạt mục tiêu được gộp thành 1 chuyến giao chung duy nhất về điểm nhận (Pickup Point), giúp tiết kiệm chi phí vận chuyển cho cả nhóm.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-slate-50 rounded-2xl px-4 py-3 border border-slate-200/80 text-center">
            <div className="text-xs font-semibold text-slate-500">Tổng lô giao</div>
            <div className="text-xl font-black text-slate-900">{supplierBatches.length}</div>
          </div>
          <div className="bg-[#EFFBFF]/70 rounded-2xl px-4 py-3 border border-indigo-100 text-center">
            <div className="text-xs font-semibold text-[#006EE9]">Đang xử lý</div>
            <div className="text-xl font-black text-[#000181]">
              {
                supplierBatches.filter(
                  (b) => b.status !== 'completed' && b.status !== 'cancelled'
                ).length
              }
            </div>
          </div>
          <div className="bg-[#F4FFE8]/70 rounded-2xl px-4 py-3 border border-emerald-100 text-center">
            <div className="text-xs font-semibold text-[#000181]">Tổng đơn gộp</div>
            <div className="text-xl font-black text-[#000181]">
              {supplierBatches.reduce((sum, b) => sum + b.totalOrders, 0)}
            </div>
          </div>
        </div>
      </div>

      {supplierBatches.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center">
          <Truck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800">Chưa có lô giao hàng chung nào</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
            Khi một phòng gom chuyển sang trạng thái thành công (Successful), hệ thống sẽ tự động khởi tạo 1 Delivery Batch tại đây.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5">
          {supplierBatches.map((batch) => {
            const room = rooms.find((r) => r.id === batch.roomId);
            const point = pickupPoints.find((p) => p.id === batch.pickupPointId);
            const badge = STATUS_BADGE[batch.status] || STATUS_BADGE.planned;
            const batchOrders = getBatchOrders(batch);
            const batchIssues = issues.filter((i) => i.batchId === batch.id);

            return (
              <div
                key={batch.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="font-mono text-sm font-black text-slate-900 bg-slate-100 px-3 py-1 rounded-xl">
                        #{batch.id}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${badge.bg} ${badge.color}`}
                      >
                        <Truck className="w-3.5 h-3.5" />
                        {badge.label}
                      </span>
                      {batchIssues.length > 0 && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-700">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          {batchIssues.length} sự cố
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-black text-slate-900 pt-1">
                      {batch.productName || room?.productName || 'Sản phẩm phòng gom'}{' '}
                      <span className="text-xs font-semibold text-slate-400">
                        (Room: {batch.roomId})
                      </span>
                    </h3>
                  </div>

                  {/* Sequential Supplier Handover Buttons (Req 18, 28) */}
                  <div className="flex flex-wrap items-center gap-2">
                    {batch.status === 'planned' && (
                      <button
                        onClick={() =>
                          onAdvanceBatchStatus(
                            batch.id,
                            'confirmed',
                            'Nhà cung cấp xác nhận lô giao chung',
                            `Xác nhận chuẩn bị ${batch.totalUnits} sản phẩm cho ${batch.totalOrders} đơn hàng`
                          )
                        }
                        className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Confirm Batch (Xác nhận lô)
                      </button>
                    )}

                    {batch.status === 'confirmed' && (
                      <button
                        onClick={() =>
                          onAdvanceBatchStatus(
                            batch.id,
                            'picked_up_from_supplier',
                            'Đã bàn giao cho đơn vị vận chuyển',
                            `Bàn giao ${batch.totalUnits} sản phẩm cho ${batch.carrierName}`
                          )
                        }
                        className="px-4 py-2.5 rounded-xl bg-[#006EE9] hover:bg-[#000181] text-white text-white text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
                      >
                        <Package className="w-4 h-4" />
                        Ready for Carrier / Handed Over (Bàn giao xe)
                      </button>
                    )}

                    {batch.status === 'picked_up_from_supplier' && (
                      <button
                        onClick={() =>
                          onAdvanceBatchStatus(
                            batch.id,
                            'in_transit',
                            'Xe giao hàng chung đang vận chuyển',
                            `Lô hàng đang di chuyển đến ${batch.pickupPointName || point?.name || 'điểm nhận'}`
                          )
                        }
                        className="px-4 py-2.5 rounded-xl bg-[#E8A0FF] hover:bg-[#D0FFA4] text-[#000181] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
                      >
                        <ArrowRight className="w-4 h-4" />
                        Dispatch In Transit (Bắt đầu vận chuyển)
                      </button>
                    )}

                    {batch.status === 'in_transit' && (
                      <button
                        onClick={() =>
                          onAdvanceBatchStatus(
                            batch.id,
                            'arrived_at_pickup',
                            `Đã đến điểm nhận ${batch.pickupPointName || point?.name || ''}`,
                            'Tất cả đơn hàng trong lô đã chuyển sang trạng thái Sẵn sàng nhận hàng (Ready for pickup)'
                          )
                        }
                        className="px-4 py-2.5 rounded-xl bg-[#006EE9] hover:bg-[#000181] text-white text-white text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
                      >
                        <MapPin className="w-4 h-4" />
                        Mark Arrived at Pickup (Đã đến điểm nhận)
                      </button>
                    )}

                    <button
                      onClick={() => setSelectedBatch(batch)}
                      className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Eye className="w-4 h-4" />
                      Chi tiết & Đơn gộp ({batchOrders.length || batch.totalOrders})
                    </button>

                    {batch.status !== 'completed' && batch.status !== 'cancelled' && (
                      <button
                        onClick={() => setIssueModalBatch(batch)}
                        className="px-3 py-2.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Báo sự cố
                      </button>
                    )}
                  </div>
                </div>

                {/* Batch Summary Grid (Req 18) */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 pt-4">
                  <div className="bg-slate-50 rounded-2xl p-3">
                    <div className="text-[11px] font-semibold text-slate-500">Pickup Point</div>
                    <div className="text-sm font-bold text-slate-900 mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                      <span className="truncate">
                        {batch.pickupPointName || point?.name || room?.pickupPoint || 'KTX A – Locker 03'}
                      </span>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-3">
                    <div className="text-[11px] font-semibold text-slate-500">Khung giờ nhận (Slot)</div>
                    <div className="text-sm font-bold text-slate-900 mt-0.5 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#006EE9] shrink-0" />
                      <span className="truncate">
                        {batch.pickupWindow || room?.pickupSlotSnapshot || '26 Oct • 18:00 – 21:00'}
                      </span>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-3">
                    <div className="text-[11px] font-semibold text-slate-500">Số lượng sản phẩm</div>
                    <div className="text-sm font-black text-slate-900 mt-0.5">
                      {batch.totalUnits} sản phẩm
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-3">
                    <div className="text-[11px] font-semibold text-slate-500">Số đơn gộp</div>
                    <div className="text-sm font-black text-slate-900 mt-0.5">
                      {batch.totalOrders} đơn hàng
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-3">
                    <div className="text-[11px] font-semibold text-slate-500">Tổng phí giao chuyến</div>
                    <div className="text-sm font-black text-slate-900 mt-0.5">
                      {formatCurrency(batch.totalShippingFee)}
                    </div>
                  </div>

                  <div className="bg-[#F4FFE8]/70 rounded-2xl p-3 border border-emerald-100">
                    <div className="text-[11px] font-semibold text-[#000181]">Ship chia sẻ / Buyer</div>
                    <div className="text-sm font-black text-[#000181] mt-0.5">
                      {formatCurrency(batch.shippingPerBuyer)} / người
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Batch Detail & Masked Order List Modal (Req 46, 54) */}
      {selectedBatch && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 space-y-6">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <div className="text-xs font-bold text-orange-600 uppercase tracking-wider">
                  CHI TIẾT LÔ GIAO HÀNG CHUNG
                </div>
                <h2 className="text-xl font-black text-slate-900 mt-0.5">
                  Delivery Batch #{selectedBatch.id}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Điểm nhận: <span className="font-semibold text-slate-700">{selectedBatch.pickupPointName}</span> • Khung giờ:{' '}
                  <span className="font-semibold text-slate-700">{selectedBatch.pickupWindow || '18:00 – 21:00'}</span>
                </p>
              </div>
              <button
                onClick={() => setSelectedBatch(null)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Privacy Banner (Req 54) */}
            <div className="flex items-center gap-2.5 bg-blue-50 border border-blue-200 rounded-2xl px-4 py-3 text-xs text-blue-800">
              <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
              <span>
                <strong>Bảo mật thông tin người mua:</strong> Danh sách gom đơn chỉ hiển thị tên viết tắt (ví dụ: Minh A., Lan N.) và mã đơn hàng, không tiết lộ số điện thoại, email hay địa chỉ cá nhân.
              </span>
            </div>

            {/* Batch Order List (Req 46) */}
            <div>
              <h3 className="text-sm font-black text-slate-900 mb-3 flex items-center gap-2">
                <Users className="w-4 h-4 text-orange-500" />
                Danh sách Đơn hàng trong Lô ({getBatchOrders(selectedBatch).length} đơn thực tế / {selectedBatch.totalOrders} đơn phòng gom)
              </h3>
              <div className="border border-slate-200 rounded-2xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase border-b border-slate-200">
                      <th className="py-3 px-4">Order ID</th>
                      <th className="py-3 px-4">Người mua (Che tên)</th>
                      <th className="py-3 px-4">Số lượng</th>
                      <th className="py-3 px-4">Mã nhận (Pickup Code)</th>
                      <th className="py-3 px-4">Trạng thái nhận</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {getBatchOrders(selectedBatch).length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-6 text-center text-xs text-slate-500">
                          Các đơn hàng mô phỏng của phòng gom đang được đồng bộ ({selectedBatch.totalOrders} đơn • {selectedBatch.totalUnits} sản phẩm).
                        </td>
                      </tr>
                    ) : (
                      getBatchOrders(selectedBatch).map((order) => {
                        const buyer = users.find((u) => u.id === order.userId);
                        const maskedName = getMaskedBuyerName(buyer?.name || 'Nguyễn Minh Anh');
                        return (
                          <tr key={order.id} className="hover:bg-slate-50/80">
                            <td className="py-3 px-4 font-mono text-xs font-bold text-slate-800">
                              {order.id}
                            </td>
                            <td className="py-3 px-4 font-semibold text-slate-800">
                              {maskedName}
                            </td>
                            <td className="py-3 px-4 font-bold text-slate-900">
                              {order.quantity} {order.unit || 'sp'}
                            </td>
                            <td className="py-3 px-4 font-mono text-xs font-bold text-[#006EE9]">
                              {order.pickupCode}
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                  order.status === 'picked_up'
                                    ? 'bg-[#D0FFA4]/40 text-[#000181]'
                                    : order.status === 'ready_for_pickup'
                                    ? 'bg-amber-100 text-amber-800'
                                    : order.status === 'pickup_overdue'
                                    ? 'bg-rose-100 text-rose-700'
                                    : 'bg-slate-100 text-slate-700'
                                }`}
                              >
                                {order.status === 'picked_up'
                                  ? 'Đã nhận hàng'
                                  : order.status === 'ready_for_pickup'
                                  ? 'Chờ nhận tại Locker'
                                  : order.status === 'pickup_overdue'
                                  ? 'Quá hạn nhận'
                                  : order.status}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Delivery Events Timeline */}
            <div>
              <h3 className="text-sm font-black text-slate-900 mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#006EE9]" />
                Nhật ký vận chuyển (Delivery Events)
              </h3>
              <div className="space-y-3">
                {events
                  .filter((e) => e.batchId === selectedBatch.id)
                  .map((evt) => (
                    <div
                      key={evt.id}
                      className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200/70"
                    >
                      <div className="w-2.5 h-2.5 rounded-full bg-[#006EE9] mt-1.5 shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-slate-900">{evt.title}</span>
                          <span className="text-[11px] text-slate-400">
                            {new Date(evt.createdAt).toLocaleString('vi-VN')}
                          </span>
                        </div>
                        {evt.description && (
                          <p className="text-xs text-slate-600 mt-0.5">{evt.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Report Delivery Issue Modal (Req 39) */}
      {issueModalBatch && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleIssueSubmit}
            className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
                Báo cáo Sự cố Vận chuyển
              </h3>
              <button
                type="button"
                onClick={() => setIssueModalBatch(null)}
                className="p-1.5 rounded-xl bg-slate-100 text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Lô giao hàng: <strong>#{issueModalBatch.id}</strong> ({issueModalBatch.pickupPointName})
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Loại sự cố (Issue Reason)
              </label>
              <select
                value={issueType}
                onChange={(e) => setIssueType(e.target.value as DeliveryIssueType)}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm font-medium"
              >
                <option value="Delayed">Delayed (Giao trễ khung giờ)</option>
                <option value="Damaged shipment">Damaged shipment (Hư hỏng kiện hàng)</option>
                <option value="Pickup point unavailable">
                  Pickup point unavailable (Điểm nhận/Tủ khóa gặp sự cố)
                </option>
                <option value="Other">Other (Lý do khác)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Ghi chú chi tiết
              </label>
              <textarea
                rows={3}
                value={issueNote}
                onChange={(e) => setIssueNote(e.target.value)}
                placeholder="Mô tả phương án xử lý hoặc thời gian dự kiến khắc phục..."
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIssueModalBatch(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold cursor-pointer"
              >
                Gửi báo cáo sự cố
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
