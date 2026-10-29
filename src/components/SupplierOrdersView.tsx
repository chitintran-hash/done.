import React, { useState } from 'react';
import { Order, OrderStatus } from '../types';
import { formatVND, getOrderFinancialSnapshot } from '../utils/pricing';
import { Package, CheckCircle2, ArrowRight } from 'lucide-react';

interface SupplierOrdersProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, nextStatus: OrderStatus) => void;
  showToast: (msg: string) => void;
}

export const SupplierOrdersView: React.FC<SupplierOrdersProps> = ({
  orders,
  onUpdateOrderStatus,
}) => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(orders[0] || null);

  const getNextStatus = (current: OrderStatus): OrderStatus | null => {
    switch (current) {
      case 'paid':
        return 'preparing';
      case 'preparing':
        return 'in_transit';
      case 'in_transit':
        return 'ready_for_pickup';
      case 'ready_for_pickup':
        return 'picked_up';
      default:
        return null;
    }
  };

  const getStatusActionLabel = (next: OrderStatus) => {
    switch (next) {
      case 'preparing':
        return 'Bắt đầu chuẩn bị hàng (Preparing)';
      case 'in_transit':
        return 'Xuất kho giao đến Locker (In Transit)';
      case 'ready_for_pickup':
        return 'Hàng đã vào Locker (Ready for Pickup)';
      case 'picked_up':
        return 'Xác nhận khách đã nhận (Picked Up)';
      default:
        return 'Cập nhật trạng thái';
    }
  };

  const activeOrder = orders.find((o) => o.id === selectedOrder?.id) || orders[0] || null;
  const activeSnap = activeOrder ? getOrderFinancialSnapshot(activeOrder) : null;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <Package className="w-6 h-6 text-amber-600" />
          <span>Xử lý Đơn hàng Gom ({orders.length})</span>
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Quy trình chuyển giao tuần tự: Đã thanh toán → Chuẩn bị → Đang giao kho → Sẵn sàng tại Locker → Đã nhận (Mở khóa doanh thu đối soát)
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8">
          <Package className="w-12 h-12 text-slate-300 mx-auto mb-2" />
          <h3 className="font-bold text-slate-800 text-sm">Chưa có đơn hàng gom nào</h3>
          <p className="text-xs text-slate-400 mt-1">Đơn hàng mới từ người mua sẽ xuất hiện tại đây khi phòng gom chốt</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order list */}
          <div className="lg:col-span-2 space-y-3">
            {orders.map((ord) => {
              const isSelected = activeOrder?.id === ord.id;
              const nextStatus = getNextStatus(ord.status);
              const snap = getOrderFinancialSnapshot(ord);

              return (
                <div
                  key={ord.id}
                  onClick={() => setSelectedOrder(ord)}
                  className={`p-5 rounded-2xl border transition cursor-pointer flex flex-col justify-between space-y-3 ${
                    isSelected
                      ? 'bg-white border-2 border-amber-500 shadow-md ring-2 ring-amber-500/10'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[11px] font-mono font-bold text-slate-400 block">{ord.id}</span>
                      <h4 className="font-bold text-slate-900 text-base">{ord.productName}</h4>
                      <div className="text-xs text-slate-500 mt-0.5">
                        Số lượng: <strong>{ord.quantity}</strong> • Điểm nhận: <strong>{ord.pickupPoint}</strong>
                      </div>
                    </div>

                    <div className="text-right">
                      <span
                        className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase border ${
                          ord.status === 'picked_up'
                            ? 'bg-teal-50 text-teal-700 border-teal-200'
                            : ord.status === 'ready_for_pickup'
                            ? 'bg-[#F4FFE8] text-[#000181] border-[#D0FFA4]'
                            : ord.status === 'in_transit'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : ord.status === 'preparing'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : ord.status === 'refunded' || ord.status === 'cancelled'
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        {ord.status}
                      </span>
                      <div className="text-sm font-black text-[#000181] mt-1">
                        Thực nhận: {formatVND(snap.effectiveNet)}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Khách trả: {formatVND(ord.totalAmount)}
                      </div>
                    </div>
                  </div>

                  {/* Step Forward Action Button */}
                  {nextStatus && (
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400">
                        Mã nhận khách: <strong>{ord.pickupCode}</strong>
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onUpdateOrderStatus(ord.id, nextStatus);
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition flex items-center space-x-1.5 shadow-sm active:scale-95"
                      >
                        <span>{getStatusActionLabel(nextStatus)}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Order Detail & Financial Breakdown Panel (Requirement 9) */}
          {activeOrder && activeSnap && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6 h-fit sticky top-24 text-xs">
              <div className="border-b border-slate-100 pb-3">
                <span className="text-[10px] font-black uppercase text-amber-600 tracking-wider block">
                  CHI TIẾT ĐƠN HÀNG & DÒNG TIỀN SUPPLIER
                </span>
                <h3 className="text-base font-black text-slate-900 mt-0.5">{activeOrder.id}</h3>
                <span className="text-slate-400">Phòng gom: {activeOrder.roomId}</span>
              </div>

              {/* Requirement 9: SUPPLIER ORDER FINANCIAL DETAIL */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                <div className="font-black text-slate-900 text-xs uppercase tracking-wider border-b border-slate-200 pb-1.5">
                  Chi tiết Tài chính Đơn hàng
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>Buyer paid (Tổng khách thanh toán):</span>
                  <span className="font-bold text-slate-900">{formatVND(activeOrder.totalAmount)}</span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>Shipping (Cước xe gom chia sẻ):</span>
                  <span className="font-semibold text-slate-500">{formatVND(activeOrder.shippingFee)}</span>
                </div>

                <div className="border-t border-dashed border-slate-200 pt-2 space-y-2">
                  <div className="flex justify-between text-slate-800">
                    <span>Product subtotal ({activeOrder.quantity} sp):</span>
                    <span className="font-bold text-slate-900">{formatVND(activeOrder.productSubtotal)}</span>
                  </div>

                  <div className="flex justify-between text-[#000181]">
                    <span>Platform fee ({Math.round(activeSnap.commissionRate * 100)}%):</span>
                    <span className="font-bold">-{formatVND(activeSnap.rawCommission)}</span>
                  </div>

                  <div className="flex justify-between text-slate-900 font-bold border-t border-slate-200 pt-2">
                    <span>Supplier net proceeds (Supplier earnings):</span>
                    <span className="text-[#000181] font-black text-sm">
                      {activeSnap.isReversed ? '0đ (Đã hoàn/hủy)' : formatVND(activeSnap.effectiveNet)}
                    </span>
                  </div>
                </div>

                <p className="text-[10px] text-slate-400 italic pt-1">
                  * Cước vận chuyển ({formatVND(activeOrder.shippingFee)}) được tách biệt, không tính vào phí hoa hồng hay doanh thu ròng sản phẩm.
                </p>
              </div>

              {/* Sequential Timeline */}
              <div className="space-y-4">
                <span className="font-bold text-slate-900 block text-xs">Trạng thái vòng đời đơn hàng:</span>
                <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  <div className="relative">
                    <div
                      className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        activeOrder.paidAt || activeOrder.status !== 'awaiting_payment'
                          ? 'border-emerald-600 bg-[#006EE9] text-white'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      <CheckCircle2 className="w-2.5 h-2.5" />
                    </div>
                    <div className="font-bold text-slate-900">Đã thanh toán (Paid)</div>
                    <div className="text-[10px] text-slate-400">
                      {activeOrder.paidAt
                        ? new Date(activeOrder.paidAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
                        : 'Hoàn tất'}
                    </div>
                  </div>

                  <div className="relative">
                    <div
                      className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        activeOrder.status === 'preparing' ||
                        activeOrder.status === 'in_transit' ||
                        activeOrder.status === 'ready_for_pickup' ||
                        activeOrder.status === 'picked_up'
                          ? 'border-emerald-600 bg-[#006EE9] text-white'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      <CheckCircle2 className="w-2.5 h-2.5" />
                    </div>
                    <div className="font-bold text-slate-900">Đang chuẩn bị hàng (Preparing)</div>
                    <div className="text-[10px] text-slate-400">Đóng gói theo danh sách gom</div>
                  </div>

                  <div className="relative">
                    <div
                      className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        activeOrder.status === 'in_transit' ||
                        activeOrder.status === 'ready_for_pickup' ||
                        activeOrder.status === 'picked_up'
                          ? 'border-emerald-600 bg-[#006EE9] text-white'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      <CheckCircle2 className="w-2.5 h-2.5" />
                    </div>
                    <div className="font-bold text-slate-900">Đang giao đến điểm nhận (In Transit)</div>
                    <div className="text-[10px] text-slate-400">Xe gom chở đến Locker / Căn tin</div>
                  </div>

                  <div className="relative">
                    <div
                      className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        activeOrder.status === 'ready_for_pickup' || activeOrder.status === 'picked_up'
                          ? 'border-emerald-600 bg-[#006EE9] text-white'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      <CheckCircle2 className="w-2.5 h-2.5" />
                    </div>
                    <div className="font-bold text-slate-900">Sẵn sàng tại Locker (Ready for Pickup)</div>
                    <div className="text-[10px] text-slate-400">Mã PIN: {activeOrder.pickupCode}</div>
                  </div>

                  <div className="relative">
                    <div
                      className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        activeOrder.status === 'picked_up'
                          ? 'border-emerald-600 bg-[#006EE9] text-white'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      <CheckCircle2 className="w-2.5 h-2.5" />
                    </div>
                    <div className="font-bold text-slate-900">Khách đã nhận hàng (Picked Up)</div>
                    <div className="text-[10px] text-slate-400">
                      {activeOrder.status === 'picked_up'
                        ? 'Đã mở khóa số dư khả dụng (Available)'
                        : 'Chờ khách quét QR nhận hàng để mở khóa doanh thu'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
