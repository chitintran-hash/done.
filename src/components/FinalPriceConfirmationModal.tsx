import React, { useState } from 'react';
import { GroupRoom, GroupParticipation } from '../types';
import { formatVND, getCurrentPrice, getSharedShipping } from '../utils/pricing';
import {
  X,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Truck,
  Package,
  ShieldCheck,
  Zap,
  ArrowLeft,
  XCircle,
} from 'lucide-react';

interface FinalPriceConfirmationModalProps {
  room: GroupRoom;
  participation: GroupParticipation;
  isOpen: boolean;
  onClose: () => void;
  onConfirmCheckout: () => void;
  onCancelParticipation: () => void;
}

export const FinalPriceConfirmationModal: React.FC<FinalPriceConfirmationModalProps> = ({
  room,
  participation,
  isOpen,
  onClose,
  onConfirmCheckout,
  onCancelParticipation,
}) => {
  const [isConfirmingCancel, setIsConfirmingCancel] = useState<boolean>(false);

  if (!isOpen) return null;

  const finalUnitPrice = room.finalPrice ?? getCurrentPrice(room.totalQuantity, room.priceTiers);
  const sharedShipping =
    room.shippingPerBuyerSnapshot ??
    room.finalBuyerShippingShare ??
    getSharedShipping(room.totalShippingFee, room.participantCount);
  const productSubtotal = finalUnitPrice * participation.quantity;
  const grandTotal = productSubtotal + sharedShipping;
  const unitSavings = Math.max(0, room.initialPrice - finalUnitPrice);

  // Determine unlocked tier label
  const activeTier = room.priceTiers.find(
    (t) =>
      room.totalQuantity >= t.minQuantity &&
      (t.maxQuantity === undefined || room.totalQuantity <= t.maxQuantity)
  );
  const tierLabel = activeTier
    ? activeTier.maxQuantity
      ? `mốc ${activeTier.minQuantity}–${activeTier.maxQuantity} suất`
      : `mốc ${activeTier.minQuantity}+ suất (cao nhất)`
    : 'mốc số lượng tối ưu';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in font-sans">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative overflow-hidden transform transition-all space-y-5">
        {/* VIEW 1: CONFIRMATION DIALOG WHEN BUYER CLICKS "KHÔNG TIẾP TỤC" (MỤC 7 & 8) */}
        {isConfirmingCancel ? (
          <div className="space-y-5 animate-fade-in">
            <div className="flex items-center space-x-3 text-rose-600">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6 text-rose-600" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-rose-700 block">
                  XÁC NHẬN HỦY TRƯỚC THANH TOÁN
                </span>
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  Bạn có chắc không muốn tiếp tục đơn mua chung này?
                </h3>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2 text-xs text-slate-700">
              <div className="flex justify-between items-center">
                <span>Sản phẩm:</span>
                <strong className="text-slate-900">{room.productName}</strong>
              </div>
              <div className="flex justify-between items-center">
                <span>Giá cuối cùng đã chốt:</span>
                <strong className="text-[#3155FF] font-black text-sm">
                  {formatVND(finalUnitPrice)} / {room.unit}
                </strong>
              </div>
              <div className="flex justify-between items-center">
                <span>Số lượng của bạn:</span>
                <strong className="text-slate-900">{participation.quantity} {room.unit}</strong>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] leading-relaxed">
              <strong>Lưu ý:</strong> Sau khi xác nhận hủy, suất của bạn sẽ không được chuyển sang bước thanh toán. Vì bạn <strong>chưa thanh toán</strong> nên đây là thao tác <em>hủy trước thanh toán</em> (không phát sinh chi phí và không cần hoàn tiền).
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsConfirmingCancel(false)}
                className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Quay lại</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsConfirmingCancel(false);
                  onCancelParticipation();
                }}
                className="py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs uppercase tracking-wider transition flex items-center justify-center gap-1.5 shadow-md shadow-rose-600/25 cursor-pointer active:scale-98"
              >
                <XCircle className="w-4 h-4" />
                <span>Xác nhận không mua</span>
              </button>
            </div>
          </div>
        ) : (
          /* VIEW 2: MAIN FINAL PRICE CONFIRMATION SCREEN */
          <>
            {/* Header */}
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-3">
                <div className="w-11 h-11 rounded-2xl bg-[#3155FF] text-[#C7F000] flex items-center justify-center shadow-md">
                  <Zap className="w-6 h-6 fill-[#C7F000] text-[#3155FF]" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-[#3155FF] tracking-wider block">
                    PHÒNG ĐÃ CHỐT
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-slate-900">
                    Xác nhận mức giá cuối cùng
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Product & Room Summary */}
            <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200 flex items-center space-x-3">
              <img
                src={room.productImage}
                alt={room.productName}
                className="w-14 h-14 rounded-xl object-cover shrink-0 border border-slate-200"
              />
              <div className="min-w-0 flex-1">
                <h4 className="font-black text-slate-900 text-sm truncate">
                  {room.emoji} {room.productName}
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Quy cách: <strong>{room.unit}</strong> • Điểm nhận:{' '}
                  <strong>{room.pickupPointName || room.pickupPoint}</strong>
                </p>
              </div>
            </div>

            {/* BLOCK NỔI BẬT: GIÁ CUỐI CÙNG & TỔNG SỐ LƯỢNG (MỤC 3 & 4) */}
            <div className="bg-[#EEF1FF] border-2 border-[#3155FF]/30 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                <span className="flex items-center gap-1.5 text-[#3155FF]">
                  <CheckCircle2 className="w-4 h-4 text-[#3155FF]" />
                  <span>Kết quả chốt phòng của nhóm:</span>
                </span>
                <span className="bg-[#3155FF] text-white px-2.5 py-0.5 rounded-full text-[11px] font-black">
                  {room.finalTotalQuantity ?? room.totalQuantity} {room.unit} ({room.finalParticipantCount ?? room.participantCount} người)
                </span>
              </div>

              <div className="pt-2 border-t border-[#3155FF]/20 flex items-baseline justify-between">
                <div>
                  <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider block">
                    GIÁ CUỐI CÙNG
                  </span>
                  <span className="text-xs text-[#3155FF] font-bold">
                    Nhóm đã đạt {tierLabel}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-2xl sm:text-3xl font-black text-[#0C0D10] tracking-tight">
                    {formatVND(finalUnitPrice)}
                  </span>
                  <span className="text-xs text-slate-500 ml-1">/ {room.unit}</span>
                  {unitSavings > 0 && (
                    <span className="block text-[10px] font-bold text-emerald-700">
                      (Tiết kiệm {formatVND(unitSavings)} so với giá khởi điểm)
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* FINANCIAL BREAKDOWN: GIÁ SẢN PHẨM + SHIP CHIA SẺ = TỔNG THANH TOÁN (MỤC 5, 18, 19) */}
            <div className="space-y-2 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div className="flex justify-between items-center text-slate-600">
                <span className="flex items-center gap-1.5 font-bold">
                  <Package className="w-4 h-4 text-[#3155FF]" />
                  <span>Số lượng của bạn:</span>
                </span>
                <strong className="text-slate-900 text-sm font-black">
                  {participation.quantity} {room.unit}
                </strong>
              </div>

              <div className="flex justify-between items-center text-slate-600">
                <span>Giá sản phẩm ({participation.quantity} × {formatVND(finalUnitPrice)}):</span>
                <strong className="text-slate-900 font-bold">{formatVND(productSubtotal)}</strong>
              </div>

              <div className="flex justify-between items-center text-slate-600">
                <span className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-[#3155FF]" />
                  <span>Phí giao nhận chia sẻ ({room.finalParticipantCount ?? room.participantCount} người cùng chia):</span>
                </span>
                <strong className="text-slate-900 font-bold">{formatVND(sharedShipping)}</strong>
              </div>

              <div className="pt-2.5 border-t border-slate-200 flex justify-between items-baseline">
                <div>
                  <span className="text-xs font-black text-slate-900 block uppercase tracking-wide">
                    TỔNG CẦN THANH TOÁN:
                  </span>
                  <span className="text-[10px] text-slate-500">Giá chốt cố định • 0đ phụ phí ẩn</span>
                </div>
                <span className="text-2xl font-black text-[#3155FF]">{formatVND(grandTotal)}</span>
              </div>
            </div>

            {/* Policy Disclosure */}
            <div className="bg-[#F5FBD9] border border-[#C7F000] p-3 rounded-xl flex items-start space-x-2 text-slate-800">
              <ShieldCheck className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
              <p className="text-[11px] leading-relaxed">
                Mức giá đã được khóa cố định. Bạn có quyền chọn <strong>Tiếp tục thanh toán</strong> để nhận hàng tại Smart Locker, hoặc <strong>Không tiếp tục</strong> (hủy trước thanh toán mà không bị trừ tiền).
              </p>
            </div>

            {/* ACTION BUTTONS (MỤC 6 & 7) */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={onConfirmCheckout}
                className="w-full py-3.5 px-6 rounded-2xl bg-[#3155FF] hover:bg-[#2444DC] text-white font-black text-xs uppercase tracking-wider transition shadow-lg shadow-[#3155FF]/25 flex items-center justify-center space-x-2 cursor-pointer active:scale-98"
              >
                <span>Tiếp tục thanh toán ({formatVND(grandTotal)})</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setIsConfirmingCancel(true)}
                className="w-full py-2.5 px-6 rounded-2xl bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 font-bold text-xs uppercase tracking-wider transition border border-slate-200 cursor-pointer"
              >
                Không tiếp tục (Hủy trước thanh toán)
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
