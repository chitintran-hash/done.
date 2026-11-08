import React, { useState, useMemo } from 'react';
import { Order, OrderStatus, User } from '../types';
import { formatVND, getOrderFinancialSnapshot } from '../utils/pricing';
import { Package, CheckCircle2, ArrowRight, Clock, Truck, ShieldAlert, Table, LayoutGrid, MapPin } from 'lucide-react';

interface SupplierOrdersProps {
  orders: Order[];
  users?: User[];
  onUpdateOrderStatus: (orderId: string, nextStatus: OrderStatus) => void;
  showToast: (msg: string) => void;
}

export const SupplierOrdersView: React.FC<SupplierOrdersProps> = ({
  orders,
  users = [],
  onUpdateOrderStatus,
}) => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(orders[0] || null);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [filterStatus, setFilterStatus] = useState<'all' | 'awaiting_payment' | 'paid' | 'preparing' | 'in_transit' | 'ready_for_pickup' | 'picked_up'>('all');

  // Phần 24: Tách riêng Nhu cầu dự kiến vs Doanh thu đã xác nhận
  const projectedRevenue = useMemo(() => {
    return orders
      .filter((o) => o.status === 'awaiting_payment')
      .reduce((sum, o) => sum + getOrderFinancialSnapshot(o).effectiveNet, 0);
  }, [orders]);

  const confirmedNet = useMemo(() => {
    return orders
      .filter(
        (o) =>
          o.status !== 'cancelled' &&
          o.status !== 'cancelled_before_payment' &&
          o.status !== 'refunded' &&
          o.status !== 'awaiting_payment'
      )
      .reduce((sum, o) => sum + getOrderFinancialSnapshot(o).effectiveNet, 0);
  }, [orders]);

  const processingCount = useMemo(() => {
    return orders.filter(
      (o) => o.status === 'paid' || o.status === 'preparing' || o.status === 'in_transit' || o.status === 'ready_for_pickup'
    ).length;
  }, [orders]);

  const filteredOrders = useMemo(() => {
    if (filterStatus === 'all') return orders;
    return orders.filter((o) => o.status === filterStatus);
  }, [orders, filterStatus]);

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

  const getVietnameseStatusLabel = (status: OrderStatus) => {
    switch (status) {
      case 'awaiting_payment':
        return 'Chờ thanh toán';
      case 'paid':
        return 'Đã thanh toán';
      case 'preparing':
        return 'Đang chuẩn bị';
      case 'in_transit':
        return 'Đang vận chuyển';
      case 'ready_for_pickup':
        return 'Sẵn sàng tại Locker';
      case 'picked_up':
        return 'Đã nhận hàng';
      case 'cancelled_before_payment':
        return 'Đã hủy trước TT';
      case 'cancelled':
        return 'Đã hủy';
      case 'refunded':
        return 'Đã hoàn tiền';
      default:
        return status;
    }
  };

  const activeOrder = orders.find((o) => o.id === selectedOrder?.id) || filteredOrders[0] || null;
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

      {/* Phần 24: Hai khối thống kê rõ ràng: Nhu cầu dự kiến vs Doanh thu đã xác nhận */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200">
          <span className="text-[11px] font-black uppercase text-amber-800 tracking-wider flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            Nhu cầu dự kiến (Chờ TT)
          </span>
          <div className="text-xl font-black text-amber-800 mt-1">
            {formatVND(projectedRevenue)}
          </div>
          <span className="text-[10px] text-amber-700 mt-0.5 block">
            {orders.filter((o) => o.status === 'awaiting_payment').length} đơn đang chờ người mua thanh toán
          </span>
        </div>

        <div className="bg-[#F5FBD9] p-4 rounded-2xl border border-[#C7F000]">
          <span className="text-[11px] font-black uppercase text-emerald-900 tracking-wider flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#0C0D10]" />
            Doanh thu đã xác nhận
          </span>
          <div className="text-xl font-black text-[#0C0D10] mt-1">
            {formatVND(confirmedNet)}
          </div>
          <span className="text-[10px] text-emerald-800 mt-0.5 block">
            Thực nhận của Supplier từ các đơn đã thanh toán
          </span>
        </div>

        <div className="bg-[#EEF1FF] p-4 rounded-2xl border border-[#3155FF]/30">
          <span className="text-[11px] font-black uppercase text-[#000181] tracking-wider flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-[#006EE9]" />
            Đơn đang xử lý / Vận chuyển
          </span>
          <div className="text-xl font-black text-[#000181] mt-1">
            {processingCount} đơn
          </div>
          <span className="text-[10px] text-slate-500 mt-0.5 block">
            Đã thanh toán, đang chuẩn bị hoặc sẵn sàng tại Locker
          </span>
        </div>
      </div>

      {/* Filter Tabs & View Mode Switcher (Requirement 7) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-b border-slate-200 pb-3">
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'all', label: `Tất cả (${orders.length})` },
            { id: 'awaiting_payment', label: `Chờ thanh toán (${orders.filter((o) => o.status === 'awaiting_payment').length})` },
            { id: 'paid', label: `Đã thanh toán (${orders.filter((o) => o.status === 'paid').length})` },
            { id: 'preparing', label: `Đang chuẩn bị (${orders.filter((o) => o.status === 'preparing').length})` },
            { id: 'in_transit', label: `Đang giao (${orders.filter((o) => o.status === 'in_transit').length})` },
            { id: 'ready_for_pickup', label: `Tại Locker (${orders.filter((o) => o.status === 'ready_for_pickup').length})` },
            { id: 'picked_up', label: `Đã nhận (${orders.filter((o) => o.status === 'picked_up').length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterStatus(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                filterStatus === tab.id
                  ? 'bg-[#3155FF] text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shrink-0 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setViewMode('table')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
              viewMode === 'table' ? 'bg-[#3155FF] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            <span>Bảng (Table)</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('cards')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
              viewMode === 'cards' ? 'bg-[#3155FF] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Thẻ (Cards)</span>
          </button>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8">
          <Package className="w-12 h-12 text-slate-300 mx-auto mb-2" />
          <h3 className="font-bold text-slate-800 text-sm">Không có đơn hàng nào trong danh mục này</h3>
          <p className="text-xs text-slate-400 mt-1">Chọn tab khác để xem danh sách đơn hàng</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order list / Table (Requirement 7) */}
          <div className="lg:col-span-2 space-y-3">
            {viewMode === 'table' ? (
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold text-[10px]">
                      <tr>
                        <th className="py-3 px-3">Mã đơn</th>
                        <th className="py-3 px-3">Người mua</th>
                        <th className="py-3 px-3">Sản phẩm</th>
                        <th className="py-3 px-2">Số lượng</th>
                        <th className="py-3 px-3">Giá đã chốt</th>
                        <th className="py-3 px-3">Tổng tiền</th>
                        <th className="py-3 px-3">Thanh toán</th>
                        <th className="py-3 px-3">Giao nhận</th>
                        <th className="py-3 px-3 text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredOrders.map((ord) => {
                        const isSelected = activeOrder?.id === ord.id;
                        const buyer = users.find((u) => u.id === ord.userId);
                        const buyerName = buyer?.name || (ord.userId === 'user-buyer-1' ? 'Nguyễn Minh Anh' : 'Khách hàng');
                        const nextStatus = getNextStatus(ord.status);
                        const isPaid = ord.status !== 'awaiting_payment' && ord.status !== 'cancelled_before_payment';

                        return (
                          <tr
                            key={ord.id}
                            onClick={() => setSelectedOrder(ord)}
                            className={`transition cursor-pointer ${
                              isSelected ? 'bg-amber-50/70 font-semibold' : 'hover:bg-slate-50/80'
                            }`}
                          >
                            <td className="py-3 px-3 font-mono font-bold text-slate-900">{ord.id}</td>
                            <td className="py-3 px-3 text-slate-800 font-bold whitespace-nowrap">{buyerName}</td>
                            <td className="py-3 px-3 text-slate-800">{ord.productName}</td>
                            <td className="py-3 px-2 font-bold text-slate-900 whitespace-nowrap">{ord.quantity} {ord.unit || 'suất'}</td>
                            <td className="py-3 px-3 font-bold text-[#3155FF] whitespace-nowrap">{formatVND(ord.unitPrice)}</td>
                            <td className="py-3 px-3 font-black text-slate-900 whitespace-nowrap">{formatVND(ord.totalAmount)}</td>
                            <td className="py-3 px-3 whitespace-nowrap">
                              <span
                                className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase border ${
                                  isPaid
                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                    : ord.status === 'cancelled_before_payment'
                                    ? 'bg-slate-100 text-slate-600 border-slate-200'
                                    : 'bg-amber-50 text-amber-800 border-amber-200'
                                }`}
                              >
                                {isPaid ? 'Đã thanh toán' : ord.status === 'cancelled_before_payment' ? 'Đã hủy trước TT' : 'Chờ thanh toán'}
                              </span>
                            </td>
                            <td className="py-3 px-3 whitespace-nowrap">
                              <span
                                className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase border ${
                                  ord.status === 'picked_up'
                                    ? 'bg-teal-50 text-teal-700 border-teal-200'
                                    : ord.status === 'ready_for_pickup'
                                    ? 'bg-[#F5FBD9] text-[#0C0D10] border-[#C7F000]'
                                    : ord.status === 'in_transit'
                                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                                    : ord.status === 'preparing'
                                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                                    : 'bg-slate-100 text-slate-600 border-slate-200'
                                }`}
                              >
                                {getVietnameseStatusLabel(ord.status)}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-right whitespace-nowrap">
                              {nextStatus ? (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onUpdateOrderStatus(ord.id, nextStatus);
                                  }}
                                  className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] transition shadow-xs cursor-pointer"
                                >
                                  {nextStatus === 'preparing'
                                    ? 'Chuẩn bị'
                                    : nextStatus === 'in_transit'
                                    ? 'Giao Locker'
                                    : nextStatus === 'ready_for_pickup'
                                    ? 'Đã vào tủ'
                                    : 'Khách nhận'}
                                </button>
                              ) : (
                                <span className="text-[10px] text-slate-400">
                                  {ord.status === 'awaiting_payment' ? 'Chờ thanh toán' : '—'}
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredOrders.map((ord) => {
                  const isSelected = activeOrder?.id === ord.id;
                  const nextStatus = getNextStatus(ord.status);
                  const snap = getOrderFinancialSnapshot(ord);
                  const buyer = users.find((u) => u.id === ord.userId);
                  const buyerName = buyer?.name || (ord.userId === 'user-buyer-1' ? 'Nguyễn Minh Anh' : 'Khách hàng');

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
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-mono font-bold text-slate-400">{ord.id}</span>
                            <span className="text-xs font-bold text-slate-700">• Người mua: <strong className="text-slate-900">{buyerName}</strong></span>
                          </div>
                          <h4 className="font-bold text-slate-900 text-base mt-0.5">{ord.productName}</h4>
                          <div className="text-xs text-slate-500 mt-0.5">
                            Số lượng: <strong>{ord.quantity}</strong> • Điểm nhận: <strong>{ord.pickupPoint}</strong>
                          </div>
                          <div className="text-xs text-slate-500">
                            Giá đã chốt: <strong className="text-[#3155FF]">{formatVND(ord.unitPrice)}</strong>
                          </div>
                        </div>

                        <div className="text-right">
                          <span
                            className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase border ${
                              ord.status === 'picked_up'
                                ? 'bg-teal-50 text-teal-700 border-teal-200'
                                : ord.status === 'ready_for_pickup'
                                ? 'bg-[#F5FBD9] text-[#0C0D10] border-[#C7F000]'
                                : ord.status === 'in_transit'
                                ? 'bg-blue-50 text-blue-700 border-blue-200'
                                : ord.status === 'preparing'
                                ? 'bg-amber-50 text-amber-700 border-amber-200'
                                : ord.status === 'awaiting_payment'
                                ? 'bg-[#FAF0FF] text-[#000181] border-[#E8A0FF]'
                                : ord.status === 'refunded' || ord.status === 'cancelled' || ord.status === 'cancelled_before_payment'
                                ? 'bg-rose-50 text-rose-700 border-rose-200'
                                : 'bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                          >
                            {getVietnameseStatusLabel(ord.status)}
                          </span>
                          <div className="text-sm font-black text-[#0C0D10] mt-1">
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
                            className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition flex items-center space-x-1.5 shadow-sm active:scale-95 cursor-pointer"
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
            )}
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

                  <div className="flex justify-between text-[#0C0D10]">
                    <span>Platform fee ({Math.round(activeSnap.commissionRate * 100)}%):</span>
                    <span className="font-bold">-{formatVND(activeSnap.rawCommission)}</span>
                  </div>

                  <div className="flex justify-between text-slate-900 font-bold border-t border-slate-200 pt-2">
                    <span>Supplier net proceeds (Supplier earnings):</span>
                    <span className="text-[#0C0D10] font-black text-sm">
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
                          ? 'border-emerald-600 bg-[#3155FF] text-white'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      <CheckCircle2 className="w-2.5 h-2.5" />
                    </div>
                    <div className="font-bold text-slate-900">Đã thanh toán (Paid)</div>
                    <div className="text-[10px] text-slate-400">
                      {activeOrder.paidAt
                        ? new Date(activeOrder.paidAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
                        : activeOrder.status === 'awaiting_payment'
                        ? 'Chờ người mua xác nhận thanh toán'
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
                          ? 'border-emerald-600 bg-[#3155FF] text-white'
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
                          ? 'border-emerald-600 bg-[#3155FF] text-white'
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
                          ? 'border-emerald-600 bg-[#3155FF] text-white'
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
                          ? 'border-emerald-600 bg-[#3155FF] text-white'
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
