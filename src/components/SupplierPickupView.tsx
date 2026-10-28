import React, { useState } from 'react';
import type { Order, PickupPoint } from '../types';
import { formatVND } from '../utils/pricing';
import {
  QrCode,
  CheckCircle2,
  MapPin,
  X,
  Search,
  AlertTriangle,
  Box,
  Clock,
} from 'lucide-react';

interface SupplierPickupProps {
  orders: Order[];
  pickupPoints?: PickupPoint[];
  onSimulatePickupScan: (orderId: string) => void;
  onMarkOrderOverdue?: (orderId: string) => void;
  showToast: (msg: string) => void;
}

export const SupplierPickupView: React.FC<SupplierPickupProps> = ({
  orders,
  pickupPoints = [],
  onSimulatePickupScan,
  onMarkOrderOverdue,
  showToast,
}) => {
  const [scanningOrder, setScanningOrder] = useState<Order | null>(null);
  const [selectedPointId, setSelectedPointId] = useState<string>('ALL');
  const [manualCode, setManualCode] = useState<string>('');
  const [scanError, setScanError] = useState<string | null>(null);

  const readyOrders = orders.filter(
    (o) => o.status === 'ready_for_pickup' || o.status === 'pickup_overdue'
  );
  const completedOrders = orders.filter((o) => o.status === 'picked_up');

  const selectedPoint = pickupPoints.find((p) => p.id === selectedPointId);

  const handleConfirmScan = () => {
    if (!scanningOrder) return;
    onSimulatePickupScan(scanningOrder.id);
    setScanningOrder(null);
  };

  // Req 27: Verify Pickup Scan by Pickup Code
  const handleManualCodeScan = (e: React.FormEvent) => {
    e.preventDefault();
    setScanError(null);
    const trimmed = manualCode.trim().toUpperCase();
    if (!trimmed) {
      setScanError('Vui lòng nhập hoặc chọn mã nhận hàng (Pickup Code).');
      return;
    }

    const matchedOrder = orders.find(
      (o) =>
        o.pickupCode.toUpperCase() === trimmed ||
        o.id.toUpperCase() === trimmed
    );

    if (!matchedOrder) {
      setScanError(`Không tìm thấy đơn hàng với mã "${trimmed}".`);
      return;
    }

    if (
      matchedOrder.status !== 'ready_for_pickup' &&
      matchedOrder.status !== 'pickup_overdue'
    ) {
      setScanError(
        `Đơn hàng #${matchedOrder.id} đang ở trạng thái "${matchedOrder.status}" (chỉ hợp lệ khi đã đến điểm nhận - ready_for_pickup).`
      );
      return;
    }

    if (selectedPointId !== 'ALL' && selectedPoint) {
      const orderPointMatch =
        matchedOrder.pickupPointId === selectedPoint.id ||
        matchedOrder.pickupPoint === selectedPoint.name ||
        matchedOrder.pickupPointName === selectedPoint.name;
      if (!orderPointMatch) {
        setScanError(
          `Sai điểm nhận hàng! Đơn #${matchedOrder.id} thuộc về "${
            matchedOrder.pickupPointName || matchedOrder.pickupPoint
          }", không phải "${selectedPoint.name}".`
        );
        return;
      }
    }

    onSimulatePickupScan(matchedOrder.id);
    setManualCode('');
    showToast(
      `Quét mã ${matchedOrder.pickupCode} thành công! Đơn #${matchedOrder.id} chuyển sang Đã nhận hàng.`
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <QrCode className="w-6 h-6 text-amber-600" />
          <span>Điểm giao nhận Locker & Quét mã QR (Pickup Verification)</span>
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Xác thực mã nhận hàng (Pickup Code / QR) tại điểm gom, kiểm tra sức chứa Locker và hoàn tất bàn giao cho người mua.
        </p>
      </div>

      {/* Locker / Pickup Point Verification Terminal & Capacity Card (Req 25, 27, 29) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <form
          onSubmit={handleManualCodeScan}
          className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <Search className="w-4 h-4 text-amber-600" />
              Trạm Xác Thực Mã Nhận Hàng (Simulate Locker / Hub Scanner)
            </h3>
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
              KIỂM TRA 3 BƯỚC
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                1. Điểm nhận hàng hiện tại (Pickup Point)
              </label>
              <select
                value={selectedPointId}
                onChange={(e) => {
                  setSelectedPointId(e.target.value);
                  setScanError(null);
                }}
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-xs font-semibold text-slate-800 bg-slate-50"
              >
                <option value="ALL">Tất cả điểm nhận (All Pickup Points)</option>
                {pickupPoints.map((pt) => (
                  <option key={pt.id} value={pt.id}>
                    {pt.name} ({pt.currentLoad}/{pt.capacity})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                2. Nhập hoặc chọn Pickup Code (VD: FG-482910)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={manualCode}
                  onChange={(e) => {
                    setManualCode(e.target.value);
                    setScanError(null);
                  }}
                  placeholder="Nhập mã FG-XXXXXX..."
                  className="flex-1 rounded-xl border border-slate-300 px-3 py-2 text-xs font-mono font-bold uppercase text-slate-900"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm shrink-0 cursor-pointer"
                >
                  Simulate Scan
                </button>
              </div>
            </div>
          </div>

          {readyOrders.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] text-slate-500 font-medium">Chọn nhanh mã đang chờ:</span>
              {readyOrders.slice(0, 5).map((o) => (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => {
                    setManualCode(o.pickupCode);
                    setScanError(null);
                  }}
                  className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-amber-50 hover:text-amber-700 text-slate-700 border border-slate-200 cursor-pointer"
                >
                  {o.pickupCode} ({o.pickupPointName || o.pickupPoint})
                </button>
              ))}
            </div>
          )}

          {scanError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{scanError}</span>
            </div>
          )}
        </form>

        {/* Locker Capacity Status Card (Req 29) */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                <Box className="w-4 h-4 text-indigo-600" />
                Sức chứa Tủ / Điểm nhận
              </span>
              {(() => {
                const pt = selectedPoint || pickupPoints[0];
                if (!pt) return null;
                const ratio = pt.capacity > 0 ? pt.currentLoad / pt.capacity : 0;
                const label =
                  pt.currentLoad >= pt.capacity || pt.status === 'full'
                    ? 'Full'
                    : ratio >= 0.75
                    ? 'Near Full'
                    : 'Available';
                const badgeClass =
                  label === 'Full'
                    ? 'bg-rose-100 text-rose-700'
                    : label === 'Near Full'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-emerald-100 text-emerald-700';
                return (
                  <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase ${badgeClass}`}>
                    {label}
                  </span>
                );
              })()}
            </div>

            {(() => {
              const pt = selectedPoint || pickupPoints[0];
              if (!pt) {
                return (
                  <p className="text-xs text-slate-500 mt-2">
                    Locker Capacity: 32 / 50 occupied
                  </p>
                );
              }
              const pct = Math.min(100, Math.round((pt.currentLoad / Math.max(1, pt.capacity)) * 100));
              return (
                <div className="mt-3 space-y-2">
                  <div className="text-sm font-bold text-slate-800">{pt.name}</div>
                  <div className="text-xs font-semibold text-slate-600">
                    Locker Capacity: <strong className="text-slate-900">{pt.currentLoad} / {pt.capacity}</strong> occupied ({pct}%)
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        pct >= 100
                          ? 'bg-rose-500'
                          : pct >= 75
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Giờ mở cửa: {pt.operatingHours} • Khi khách quét mã nhận hàng hoàn tất Lô giao, sức chứa tủ sẽ tự động giải phóng.
                  </p>
                </div>
              );
            })()}
          </div>
        </div>
      </div>

      {/* Ready for Pickup Queue */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
            <span>Kiện hàng đang chờ khách lấy tại Điểm nhận ({readyOrders.length})</span>
          </h3>
        </div>

        {readyOrders.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-8">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <h4 className="font-bold text-slate-800 text-sm">
              Tất cả kiện hàng tại Điểm nhận đã được khách nhận
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              Khi lô giao hàng chuyển sang "Arrived at Pickup", toàn bộ đơn trong lô sẽ hiển thị tại đây
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {readyOrders.map((ord) => (
              <div
                key={ord.id}
                className={`bg-white rounded-2xl border p-5 shadow-sm space-y-4 relative overflow-hidden ${
                  ord.status === 'pickup_overdue'
                    ? 'border-rose-300 bg-rose-50/20'
                    : 'border-emerald-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-slate-400 block">
                      {ord.id} {ord.deliveryBatchId ? `• Batch #${ord.deliveryBatchId}` : ''}
                    </span>
                    <h4 className="font-bold text-slate-900 text-base">{ord.productName}</h4>
                    <span className="text-xs text-slate-500 font-medium">
                      Khách mua: <strong>{ord.quantity} sản phẩm</strong> ({formatVND(ord.totalAmount)})
                    </span>
                  </div>

                  {ord.status === 'pickup_overdue' ? (
                    <span className="bg-rose-100 text-rose-700 border border-rose-200 text-[10px] font-black px-2.5 py-1 rounded-full uppercase">
                      QUÁ HẠN NHẬN (OVERDUE)
                    </span>
                  ) : (
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black px-2.5 py-1 rounded-full uppercase">
                      CHỜ QUÉT MÃ
                    </span>
                  )}
                </div>

                {ord.status === 'pickup_overdue' && (
                  <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-[11px] font-semibold text-rose-700 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 shrink-0" />
                    <span>Quá thời gian nhận hàng. Vui lòng liên hệ điểm nhận.</span>
                  </div>
                )}

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-1.5 text-slate-600">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{ord.pickupPointName || ord.pickupPoint}</span>
                  </div>

                  <div className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                    PIN: {ord.pickupCode}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setScanningOrder(ord)}
                    className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition shadow-sm flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <QrCode className="w-4 h-4" />
                    <span>MÔ PHỎNG QUÉT MÃ QR</span>
                  </button>

                  {onMarkOrderOverdue && ord.status === 'ready_for_pickup' && (
                    <button
                      type="button"
                      onClick={() => onMarkOrderOverdue(ord.id)}
                      title="Mô phỏng quá khung giờ nhận hàng (Late Pickup)"
                      className="px-3 py-2.5 rounded-xl border border-slate-200 hover:bg-rose-50 hover:text-rose-700 text-slate-600 font-bold text-[11px] cursor-pointer"
                    >
                      Quá hạn
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Scan Modal */}
      {scanningOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 text-xs space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-black uppercase text-amber-600 tracking-wider block">
                  XÁC NHẬN BÀN GIAO KIỆN HÀNG
                </span>
                <h3 className="text-base font-black text-slate-900">{scanningOrder.productName}</h3>
              </div>
              <button
                onClick={() => setScanningOrder(null)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Mã đơn hàng:</span>
                <span className="font-mono font-bold text-slate-900">{scanningOrder.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Mã PIN xác thực:</span>
                <span className="font-mono font-bold text-emerald-700 text-sm">
                  {scanningOrder.pickupCode}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Điểm nhận:</span>
                <span className="font-bold text-slate-800">
                  {scanningOrder.pickupPointName || scanningOrder.pickupPoint}
                </span>
              </div>
              {scanningOrder.pickupWindow && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Khung giờ nhận:</span>
                  <span className="font-semibold text-slate-700">{scanningOrder.pickupWindow}</span>
                </div>
              )}
            </div>

            <p className="text-[11px] text-slate-500">
              Hành động này mô phỏng việc khách hàng quét mã QR trên màn hình Locker và nhận hàng thành công. Trạng thái đơn sẽ chuyển sang <strong>PICKED_UP</strong>.
            </p>

            <div className="pt-2 flex items-center space-x-3">
              <button
                type="button"
                onClick={() => setScanningOrder(null)}
                className="w-1/3 py-2.5 rounded-xl border border-slate-300 font-bold cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleConfirmScan}
                className="w-2/3 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold transition shadow-md shadow-teal-600/20 cursor-pointer"
              >
                XÁC NHẬN HOÀN TẤT NHẬN
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Recent Picked Up Orders */}
      {completedOrders.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-sm">
            Lịch sử kiện hàng đã bàn giao ({completedOrders.length})
          </h3>
          <div className="divide-y divide-slate-100 text-xs">
            {completedOrders.map((ord) => (
              <div key={ord.id} className="py-3 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 block">
                    {ord.productName} ({ord.quantity} sp)
                  </span>
                  <span className="text-slate-400 text-[11px]">
                    {ord.id} • {ord.pickupPointName || ord.pickupPoint} • Mã: {ord.pickupCode}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-teal-700 font-bold text-[10px] bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                    ĐÃ NHẬN HÀNG
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    {ord.pickedUpAt
                      ? new Date(ord.pickedUpAt).toLocaleTimeString('vi-VN', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : 'Đã nhận'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
