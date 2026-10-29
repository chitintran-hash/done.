import React, { useState, useMemo } from 'react';
import { Order, Supplier, SupplierPayout } from '../types';
import {
  formatVND,
  getOrderFinancialSnapshot,
  classifyOrderEarningStatus,
} from '../utils/pricing';
import {
  Wallet,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle2,
  RotateCcw,
  HelpCircle,
  Send,
  X,
  FileCheck2,
  ShieldAlert,
  Percent
} from 'lucide-react';

interface SupplierEarningsProps {
  supplier: Supplier;
  orders: Order[];
  payouts: SupplierPayout[];
  commissionRate: number;
  onRequestPayout: (params: {
    amount: number;
    orderIds: string[];
    periodStart: string;
    periodEnd: string;
    note?: string;
  }) => Promise<void>;
  onOpenBusinessModel?: () => void;
  showToast: (msg: string) => void;
}

export const SupplierEarningsView: React.FC<SupplierEarningsProps> = ({
  supplier,
  orders,
  payouts,
  commissionRate,
  onRequestPayout,
  onOpenBusinessModel,
  showToast,
}) => {
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'pending' | 'reversed' | 'paid_out'>('all');
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState<boolean>(false);
  const [payoutNote, setPayoutNote] = useState<string>('Đối soát đơn hàng đã giao thành công tại Locker');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Filter orders belonging to this supplier
  const supplierOrders = useMemo(() => {
    return orders.filter((o) => !o.supplierId || o.supplierId === supplier.id);
  }, [orders, supplier.id]);

  const supplierPayouts = useMemo(() => {
    return payouts.filter((p) => p.supplierId === supplier.id);
  }, [payouts, supplier.id]);

  // Calculate financial metrics from real order & payout data (Req 6, 7, 8, 11)
  const metrics = useMemo(() => {
    let grossSales = 0;
    let platformFees = 0;
    let netEarnings = 0;
    let pendingEarnings = 0;
    let availableBalance = 0;
    let reversedAmount = 0;

    const availableOrders: Order[] = [];
    const pendingOrders: Order[] = [];
    const reversedOrders: Order[] = [];
    const paidOutOrders: Order[] = [];

    supplierOrders.forEach((ord) => {
      const snap = getOrderFinancialSnapshot(ord);
      const classification = classifyOrderEarningStatus(ord, supplierPayouts);

      if (classification === 'reversed') {
        reversedAmount += snap.rawNet;
        reversedOrders.push(ord);
        return;
      }

      if (classification === 'unpaid') {
        return;
      }

      // Valid paid/active/picked_up order
      grossSales += snap.effectiveGross;
      platformFees += snap.effectiveCommission;
      netEarnings += snap.effectiveNet;

      if (classification === 'pending') {
        pendingEarnings += snap.effectiveNet;
        pendingOrders.push(ord);
      } else if (classification === 'available') {
        availableBalance += snap.effectiveNet;
        availableOrders.push(ord);
      } else if (classification === 'paid_out' || classification === 'in_payout_request') {
        paidOutOrders.push(ord);
      }
    });

    const paidOutTotal = supplierPayouts
      .filter((p) => p.status === 'paid')
      .reduce((sum, p) => sum + p.amount, 0);

    const pendingPayoutRequestsTotal = supplierPayouts
      .filter((p) => p.status === 'pending' || p.status === 'approved')
      .reduce((sum, p) => sum + p.amount, 0);

    return {
      grossSales,
      platformFees,
      netEarnings,
      pendingEarnings,
      availableBalance,
      paidOutTotal,
      pendingPayoutRequestsTotal,
      reversedAmount,
      availableOrders,
      pendingOrders,
      reversedOrders,
      paidOutOrders,
    };
  }, [supplierOrders, supplierPayouts]);

  const periodRange = useMemo(() => {
    if (metrics.availableOrders.length === 0) {
      const nowIso = new Date().toISOString();
      return { start: nowIso, end: nowIso };
    }
    const timestamps = metrics.availableOrders.map((o) =>
      new Date(o.pickedUpAt || o.paidAt || o.createdAt).getTime()
    );
    return {
      start: new Date(Math.min(...timestamps)).toISOString(),
      end: new Date(Math.max(...timestamps)).toISOString(),
    };
  }, [metrics.availableOrders]);

  const filteredOrdersList = useMemo(() => {
    if (statusFilter === 'available') return metrics.availableOrders;
    if (statusFilter === 'pending') return metrics.pendingOrders;
    if (statusFilter === 'reversed') return metrics.reversedOrders;
    if (statusFilter === 'paid_out') return metrics.paidOutOrders;
    return supplierOrders;
  }, [statusFilter, metrics, supplierOrders]);

  const handleConfirmPayoutRequest = async () => {
    if (metrics.availableBalance <= 0 || metrics.availableOrders.length === 0) {
      showToast('Số dư khả dụng phải lớn hơn 0đ để gửi yêu cầu đối soát.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onRequestPayout({
        amount: metrics.availableBalance,
        orderIds: metrics.availableOrders.map((o) => o.id),
        periodStart: periodRange.start,
        periodEnd: periodRange.end,
        note: payoutNote.trim() || undefined,
      });
      setIsPayoutModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Wallet className="w-6 h-6 text-amber-600" />
              <span>Doanh thu & Đối soát (Supplier Earnings)</span>
            </h2>
            <span className="bg-amber-100 text-amber-800 border border-amber-300 text-[10px] font-black px-2.5 py-0.5 rounded-full">
              Phí nền tảng demo: {Math.round(commissionRate * 100)}%
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Theo dõi doanh thu gộp, phí nền tảng, số dư khả dụng (khi khách đã nhận hàng tại Locker) và yêu cầu đối soát
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {onOpenBusinessModel && (
            <button
              onClick={onOpenBusinessModel}
              className="px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition flex items-center space-x-1.5"
            >
              <HelpCircle className="w-4 h-4 text-[#006EE9]" />
              <span>Mô hình phí</span>
            </button>
          )}

          {/* Requirement 10: Yêu cầu đối soát button (disabled when availableBalance <= 0) */}
          <button
            onClick={() => setIsPayoutModalOpen(true)}
            disabled={metrics.availableBalance <= 0}
            className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-bold text-xs shadow-md transition flex items-center space-x-1.5 active:scale-95"
          >
            <Send className="w-4 h-4" />
            <span>Yêu cầu đối soát ({formatVND(metrics.availableBalance)})</span>
          </button>
        </div>
      </div>

      {/* Requirement 27: Financial Help Tooltip Banner */}
      <div className="bg-[#EFFBFF]/80 border border-indigo-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-start space-x-2.5">
          <HelpCircle className="w-4 h-4 text-[#006EE9] shrink-0 mt-0.5" />
          <div className="text-indigo-950">
            <strong>Cơ chế trung gian FlashGroup:</strong> FlashGroup không mua lại hàng từ Supplier. Supplier vẫn sở hữu và fulfil sản phẩm. FlashGroup thu phí nền tảng trên giao dịch thành công (không thu phí trên cước vận chuyển).
          </div>
        </div>
        <span className="text-[11px] font-bold text-[#000181] shrink-0 bg-white px-2.5 py-1 rounded-lg border border-indigo-200">
          Mở khóa rút khi: PICKED_UP
        </span>
      </div>

      {/* 6 Financial Cards (Requirement 7) */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] text-slate-400 font-bold uppercase">Gross Sales</span>
          <div className="text-lg sm:text-xl font-black text-slate-900 mt-1">
            {formatVND(metrics.grossSales)}
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Tổng tiền hàng (chưa trừ phí)</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] text-[#006EE9] font-bold uppercase flex items-center gap-1">
            <Percent className="w-3 h-3" /> Platform Fees
          </span>
          <div className="text-lg sm:text-xl font-black text-[#006EE9] mt-1">
            -{formatVND(metrics.platformFees)}
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">
            Phí nền tảng demo: {Math.round(commissionRate * 100)}%
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] text-[#000181] font-bold uppercase">Net Earnings</span>
          <div className="text-lg sm:text-xl font-black text-[#000181] mt-1">
            {formatVND(metrics.netEarnings)}
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Tổng doanh thu ròng</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-amber-200 bg-amber-50/30 shadow-sm">
          <span className="text-[11px] text-amber-800 font-bold uppercase flex items-center gap-1">
            <Clock className="w-3 h-3" /> Pending Earnings
          </span>
          <div className="text-lg sm:text-xl font-black text-amber-700 mt-1">
            {formatVND(metrics.pendingEarnings)}
          </div>
          <span className="text-[10px] text-amber-700/80 mt-1 block">
            {metrics.pendingOrders.length} đơn đang giao / chờ nhận
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border-2 border-[#D0FFA4] bg-[#F4FFE8]/40 shadow-sm">
          <span className="text-[11px] text-emerald-800 font-black uppercase flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#000181]" /> Available Balance
          </span>
          <div className="text-lg sm:text-xl font-black text-[#000181] mt-1">
            {formatVND(metrics.availableBalance)}
          </div>
          <span className="text-[10px] text-[#000181] font-semibold mt-1 block">
            {metrics.availableOrders.length} đơn picked_up sẵn sàng rút
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] text-teal-700 font-bold uppercase">Paid Out</span>
          <div className="text-lg sm:text-xl font-black text-teal-700 mt-1">
            {formatVND(metrics.paidOutTotal)}
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">
            {metrics.pendingPayoutRequestsTotal > 0
              ? `Đang chờ duyệt: ${formatVND(metrics.pendingPayoutRequestsTotal)}`
              : 'Đã đối soát hoàn tất'}
          </span>
        </div>
      </div>

      {/* Order Financial Breakdown Table by Earning Status (Req 8 & 9) */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">
              Chi tiết Doanh thu từng Đơn hàng (Order Financial Breakdown)
            </h3>
            <p className="text-[11px] text-slate-400">
              Phân loại trạng thái doanh thu: Pending (đang xử lý) • Available (đã nhận hàng) • Reversed (đã hoàn/hủy)
            </p>
          </div>

          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold overflow-x-auto">
            {[
              { id: 'all', label: `Tất cả (${supplierOrders.length})` },
              { id: 'available', label: `Available (${metrics.availableOrders.length})` },
              { id: 'pending', label: `Pending (${metrics.pendingOrders.length})` },
              { id: 'paid_out', label: `Đã yêu cầu/Chi trả (${metrics.paidOutOrders.length})` },
              { id: 'reversed', label: `Reversed (${metrics.reversedOrders.length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition ${
                  statusFilter === tab.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Mã đơn / Sản phẩm</th>
                <th className="py-3.5 px-4">Trạng thái đơn</th>
                <th className="py-3.5 px-4">Buyer Paid</th>
                <th className="py-3.5 px-4">Product Subtotal</th>
                <th className="py-3.5 px-4">Shipping (Chia sẻ)</th>
                <th className="py-3.5 px-4">Platform Fee</th>
                <th className="py-3.5 px-4">Supplier Net</th>
                <th className="py-3.5 px-4 text-right">Trạng thái đối soát</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrdersList.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    Không có đơn hàng nào trong nhóm trạng thái này.
                  </td>
                </tr>
              ) : (
                filteredOrdersList.map((ord) => {
                  const snap = getOrderFinancialSnapshot(ord);
                  const earningStatus = classifyOrderEarningStatus(ord, supplierPayouts);

                  return (
                    <tr key={ord.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-slate-900 block">{ord.id}</span>
                        <span className="text-[11px] text-slate-500">
                          {ord.productName} ({ord.quantity} sp × {formatVND(ord.unitPrice)})
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                          {ord.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-800">{formatVND(ord.totalAmount)}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">{formatVND(ord.productSubtotal)}</td>
                      <td className="py-3.5 px-4 text-slate-500">{formatVND(ord.shippingFee)}</td>
                      <td className="py-3.5 px-4 font-semibold text-[#006EE9]">
                        {snap.isReversed
                          ? '0đ (Reversed)'
                          : `-${formatVND(snap.effectiveCommission)} (${Math.round(snap.commissionRate * 100)}%)`}
                      </td>
                      <td className="py-3.5 px-4 font-black text-[#000181]">
                        {snap.isReversed ? (
                          <span className="line-through text-slate-400">{formatVND(snap.rawNet)}</span>
                        ) : (
                          formatVND(snap.effectiveNet)
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {earningStatus === 'available' && (
                          <span className="bg-[#D0FFA4]/40 text-emerald-800 border border-[#D0FFA4] text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
                            AVAILABLE (Khả dụng)
                          </span>
                        )}
                        {earningStatus === 'pending' && (
                          <span className="bg-amber-100 text-amber-800 border border-amber-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                            PENDING (Chờ khách nhận)
                          </span>
                        )}
                        {earningStatus === 'in_payout_request' && (
                          <span className="bg-blue-100 text-blue-800 border border-blue-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                            ĐANG ĐỐI SOÁT
                          </span>
                        )}
                        {earningStatus === 'paid_out' && (
                          <span className="bg-teal-100 text-teal-800 border border-teal-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                            PAID OUT (Đã trả)
                          </span>
                        )}
                        {earningStatus === 'reversed' && (
                          <span className="bg-rose-100 text-rose-800 border border-rose-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                            REVERSED (0đ)
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payout Requests History */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-amber-600" />
              <span>Lịch sử Yêu cầu Đối soát (Supplier Payouts: {supplierPayouts.length})</span>
            </h3>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold text-[10px]">
              <tr>
                <th className="py-3 px-4">Mã đối soát</th>
                <th className="py-3 px-4">Số đơn gộp</th>
                <th className="py-3 px-4">Kỳ đối soát</th>
                <th className="py-3 px-4">Số tiền thực nhận</th>
                <th className="py-3 px-4">Ngày yêu cầu</th>
                <th className="py-3 px-4">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {supplierPayouts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-slate-400">
                    Chưa có yêu cầu đối soát nào. Khi đơn hàng chuyển sang trạng thái <strong>picked_up</strong>, bạn có thể bấm "Yêu cầu đối soát".
                  </td>
                </tr>
              ) : (
                supplierPayouts.map((po) => (
                  <tr key={po.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{po.id}</td>
                    <td className="py-3.5 px-4 font-semibold">{po.orderCount} đơn hàng</td>
                    <td className="py-3.5 px-4 text-slate-500">
                      {po.periodStart ? new Date(po.periodStart).toLocaleDateString('vi-VN') : '—'} →{' '}
                      {po.periodEnd ? new Date(po.periodEnd).toLocaleDateString('vi-VN') : '—'}
                    </td>
                    <td className="py-3.5 px-4 font-black text-[#000181] text-sm">{formatVND(po.amount)}</td>
                    <td className="py-3.5 px-4 text-slate-500">
                      {new Date(po.requestedAt).toLocaleString('vi-VN')}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase border ${
                          po.status === 'paid'
                            ? 'bg-teal-100 text-teal-800 border-teal-300'
                            : po.status === 'approved'
                            ? 'bg-[#D0FFA4]/40 text-emerald-800 border-[#D0FFA4]'
                            : po.status === 'rejected'
                            ? 'bg-rose-100 text-rose-800 border-rose-300'
                            : 'bg-amber-100 text-amber-800 border-amber-300'
                        }`}
                      >
                        {po.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Requirement 10: SUPPLIER PAYOUT REQUEST MODAL */}
      {isPayoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 text-xs">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase text-amber-600 tracking-wider block">
                  ĐỐI SOÁT DOANH THU NHÀ CUNG CẤP
                </span>
                <h3 className="text-lg font-black text-slate-900">Yêu cầu đối soát thanh toán</h3>
              </div>
              <button
                onClick={() => setIsPayoutModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Số dư khả dụng (Available balance):</span>
                <span className="font-bold text-slate-900 text-sm">{formatVND(metrics.availableBalance)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Số đơn hàng đủ điều kiện (Orders included):</span>
                <span className="font-bold text-slate-900">{metrics.availableOrders.length} đơn (picked_up)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Kỳ đối soát (Period):</span>
                <span className="font-semibold text-slate-800">
                  {new Date(periodRange.start).toLocaleDateString('vi-VN')} –{' '}
                  {new Date(periodRange.end).toLocaleDateString('vi-VN')}
                </span>
              </div>
              <div className="pt-2.5 border-t border-slate-200 flex justify-between items-baseline">
                <span className="font-black text-slate-900 text-sm">Số tiền đề nghị rút (Requested payout):</span>
                <span className="text-xl font-black text-[#000181]">{formatVND(metrics.availableBalance)}</span>
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Ghi chú đối soát (Tùy chọn)</label>
              <input
                type="text"
                value={payoutNote}
                onChange={(e) => setPayoutNote(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300"
                placeholder="Ghi chú kỳ đối soát..."
              />
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start space-x-2 text-[11px] text-amber-900">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                Các đơn hàng đưa vào yêu cầu này sẽ được khóa thông qua bảng <code>payout_orders</code> để chống trùng lặp đối soát (Double Payout Protection).
              </span>
            </div>

            <div className="flex items-center space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setIsPayoutModalOpen(false)}
                className="w-1/3 py-3 rounded-xl border border-slate-300 font-bold text-slate-700"
              >
                Hủy
              </button>
              <button
                type="button"
                disabled={isSubmitting || metrics.availableBalance <= 0}
                onClick={handleConfirmPayoutRequest}
                className="w-2/3 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold transition shadow-md disabled:opacity-50"
              >
                {isSubmitting ? 'Đang gửi yêu cầu...' : 'Gửi yêu cầu đối soát'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
