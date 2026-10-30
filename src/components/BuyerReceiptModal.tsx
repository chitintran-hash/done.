import React from 'react';
import { Order } from '../types';
import { formatVND } from '../utils/pricing';
import { X, FileText, CheckCircle2, MapPin, CreditCard, Calendar, Package } from 'lucide-react';

interface BuyerReceiptModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

// Requirement 19: Buyer Receipt
// Shows Product, Quantity, Unit price, Product subtotal, Shared delivery fee, Total paid, Payment method, Order ID, Payment status, Date.
// Strictly DOES NOT show platform commission, supplier cost, or supplier margin to Buyer.
export const BuyerReceiptModal: React.FC<BuyerReceiptModalProps> = ({
  order,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !order) return null;

  const paymentDate = order.paidAt || order.createdAt;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative space-y-5 text-xs">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#F5FBD9] text-[#0C0D10] flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#0C0D10] block">
                BIÊN LAI GIAO DỊCH MÔ PHỎNG
              </span>
              <h3 className="text-base font-black text-slate-900">Chi tiết thanh toán</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Order Meta */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2">
          <div className="flex justify-between">
            <span className="text-slate-500">Mã đơn hàng (Order ID):</span>
            <span className="font-mono font-bold text-slate-900">{order.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Trạng thái thanh toán:</span>
            <span className="inline-flex items-center gap-1 font-bold text-[#0C0D10] uppercase">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {order.status}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 flex items-center gap-1">
              <CreditCard className="w-3.5 h-3.5 text-slate-400" /> Phương thức:
            </span>
            <span className="font-bold text-slate-800">{order.paymentMethod || 'MOMO (Mô phỏng)'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" /> Thời gian:
            </span>
            <span className="font-medium text-slate-700">
              {new Date(paymentDate).toLocaleString('vi-VN')}
            </span>
          </div>
        </div>

        {/* Product & Price Breakdown */}
        <div className="space-y-3 border-t border-b border-slate-100 py-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-2">
              <Package className="w-4 h-4 text-[#0C0D10] shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-slate-900 text-sm">{order.productName}</div>
                <div className="text-slate-500 mt-0.5">
                  Số lượng: <strong>{order.quantity}</strong> {order.unit || 'đơn vị'} ×{' '}
                  <strong>{formatVND(order.unitPrice)}</strong>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2 space-y-2 border-t border-dashed border-slate-200">
            <div className="flex justify-between text-slate-600">
              <span>Đơn giá chốt (Unit price):</span>
              <span className="font-semibold text-slate-900">{formatVND(order.unitPrice)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Tiền hàng (Product subtotal):</span>
              <span className="font-bold text-slate-900">{formatVND(order.productSubtotal)}</span>
            </div>
            {order.voucherDiscount !== undefined && order.voucherDiscount > 0 && (
              <div className="flex justify-between text-[#0C0D10] font-bold">
                <span>Mã ưu đãi ({order.voucherCode || 'VOUCHER'}):</span>
                <span>-{formatVND(order.voucherDiscount)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-600">
              <span>Phí giao hàng chia sẻ (Shared delivery fee):</span>
              <span className="font-bold text-slate-900">{formatVND(order.shippingFee)}</span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-baseline justify-between">
            <span className="text-sm font-black text-slate-900">Tổng đã thanh toán (Total paid):</span>
            <span className="text-xl font-black text-[#0C0D10]">{formatVND(order.totalAmount)}</span>
          </div>
        </div>

        {/* Pickup Info (Phase 7 Snapshot Req 31, 45) */}
        <div className="bg-[#F5FBD9]/70 border border-[#C7F000] rounded-2xl p-3.5 flex items-start space-x-2.5">
          <MapPin className="w-4 h-4 text-[#0C0D10] shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <div className="font-bold text-slate-900">
              Điểm nhận: {order.pickupPointName || order.pickupPoint}
            </div>
            {order.pickupAddress && (
              <div className="text-[11px] text-slate-500">{order.pickupAddress}</div>
            )}
            <div className="text-[11px] font-semibold text-[#0C0D10]">
              Khung giờ nhận hàng (Pickup Window): {order.pickupWindow || '26 Oct • 18:00 – 21:00'}
            </div>
            <div className="text-[11px] font-mono font-bold text-emerald-800 pt-0.5">
              Mã nhận Locker / Pickup Code: {order.pickupCode}
            </div>
          </div>
        </div>

        {/* Tax & Invoice Boundary (Phase 8 Req 25) */}
        {(order.supplierTaxCode || order.invoiceReference) && (
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-[11px] space-y-1">
            {order.supplierTaxCode && (
              <div className="flex justify-between">
                <span className="text-slate-500">Mã số thuế NCC:</span>
                <span className="font-mono font-bold text-slate-800">{order.supplierTaxCode}</span>
              </div>
            )}
            {order.invoiceReference && (
              <div className="flex justify-between">
                <span className="text-slate-500">Tham chiếu chứng từ / Hóa đơn:</span>
                <span className="font-mono font-semibold text-slate-700">{order.invoiceReference}</span>
              </div>
            )}
          </div>
        )}

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-2.5 text-center space-y-0.5">
          <p className="text-[11px] font-bold text-amber-900">
            Thanh toán mô phỏng – không phát sinh giao dịch tiền thật.
          </p>
          <p className="text-[10px] text-amber-700">
            Tất cả giao dịch và biên lai thanh toán trong prototype đều là dữ liệu mô phỏng.
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition"
        >
          Đóng biên lai
        </button>
      </div>
    </div>
  );
};
