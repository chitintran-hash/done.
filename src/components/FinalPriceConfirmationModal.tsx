import React from 'react';
import { GroupRoom, GroupParticipation } from '../types';
import { formatVND, getCurrentPrice, getSharedShipping } from '../utils/pricing';
import { X, CheckCircle2, AlertCircle, ArrowRight, Truck, Package, ShieldCheck, Zap } from 'lucide-react';

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
  if (!isOpen) return null;

  const finalUnitPrice = room.finalPrice ?? getCurrentPrice(room.totalQuantity, room.priceTiers);
  const sharedShipping =
    room.shippingPerBuyerSnapshot ??
    getSharedShipping(room.totalShippingFee, room.participantCount);
  const productSubtotal = finalUnitPrice * participation.quantity;
  const grandTotal = productSubtotal + sharedShipping;
  const unitSavings = Math.max(0, room.initialPrice - finalUnitPrice);
  const totalSavings = unitSavings * participation.quantity;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in font-sans">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#E6E6EE] relative overflow-hidden transform transition-all space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#E6E6EE]">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-[#000181] text-[#D0FFA4] flex items-center justify-center shadow-md">
              <Zap className="w-6 h-6 fill-[#D0FFA4] stroke-[#000181]" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-[#006EE9] tracking-wider block">
                PHÒNG ĐÃ CHỐT GIÁ
              </span>
              <h3 className="text-lg sm:text-xl font-black text-[#000181]">
                Xác nhận mức giá cuối cùng
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#53536A] hover:text-[#000181] hover:bg-[#F6F7FB] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Product & Room Summary */}
        <div className="bg-[#F6F7FB] rounded-2xl p-4 border border-[#E6E6EE] flex items-center space-x-3.5">
          <img
            src={room.productImage}
            alt={room.productName}
            className="w-16 h-16 rounded-xl object-cover shrink-0 border border-[#E6E6EE]"
          />
          <div className="min-w-0 flex-1">
            <h4 className="font-black text-[#000181] text-sm truncate">
              {room.emoji} {room.productName}
            </h4>
            <p className="text-xs text-[#53536A] mt-0.5">
              Quy cách: <strong>{room.unit}</strong> • Điểm nhận:{' '}
              <strong>{room.pickupPointName || room.pickupPoint}</strong>
            </p>
          </div>
        </div>

        {/* Group Result Banner */}
        <div className="bg-[#F4FFE8] border border-[#D0FFA4] rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-[#000181]">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#006EE9]" />
              <span>Kết quả gom chung của nhóm:</span>
            </span>
            <span className="bg-[#D0FFA4] text-[#000181] px-2.5 py-0.5 rounded-full text-[11px] font-black">
              {room.totalQuantity} {room.unit} ({room.participantCount} người tham gia)
            </span>
          </div>
          <div className="flex items-baseline justify-between pt-1 border-t border-[#D0FFA4]/60">
            <span className="text-xs text-[#53536A] font-medium">Mức giá đã mở khóa:</span>
            <div className="text-right">
              <span className="text-xl font-black text-[#000181]">
                {formatVND(finalUnitPrice)}
              </span>
              <span className="text-xs text-[#53536A] ml-1">/ {room.unit}</span>
              {unitSavings > 0 && (
                <span className="block text-[11px] font-bold text-[#006EE9]">
                  (Tiết kiệm {formatVND(unitSavings)} so với giá ban đầu {formatVND(room.initialPrice)})
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Buyer Financial Breakdown */}
        <div className="space-y-2.5 text-xs">
          <div className="flex justify-between items-center text-[#53536A]">
            <span className="flex items-center gap-1.5">
              <Package className="w-4 h-4 text-[#000181]" />
              <span>Số lượng của bạn:</span>
            </span>
            <strong className="text-[#000181] text-sm">
              {participation.quantity} {room.unit}
            </strong>
          </div>

          <div className="flex justify-between items-center text-[#53536A]">
            <span>Tiền sản phẩm ({participation.quantity} × {formatVND(finalUnitPrice)}):</span>
            <strong className="text-[#000181]">{formatVND(productSubtotal)}</strong>
          </div>

          <div className="flex justify-between items-center text-[#53536A]">
            <span className="flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-[#006EE9]" />
              <span>Phí giao hàng chia sẻ ({room.participantCount} người cùng chia):</span>
            </span>
            <strong className="text-[#000181]">{formatVND(sharedShipping)}</strong>
          </div>

          <div className="pt-3 border-t border-[#E6E6EE] flex justify-between items-baseline">
            <div>
              <span className="text-sm font-black text-[#000181] block">Tổng số tiền thanh toán:</span>
              <span className="text-[11px] text-[#53536A]">Đã bao gồm tiền hàng và phí giao chia sẻ</span>
            </div>
            <span className="text-2xl font-black text-[#006EE9]">{formatVND(grandTotal)}</span>
          </div>
        </div>

        {/* Transparent Policy Disclosure */}
        <div className="bg-[#EFFBFF] border border-[#83E7FF] p-3.5 rounded-2xl flex items-start space-x-2.5 text-[#000181]">
          <ShieldCheck className="w-5 h-5 text-[#006EE9] shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed font-medium">
            Mức giá này được xác định bởi tổng số lượng thực tế khi phòng gom kết thúc. Bạn có quyền
            chọn <strong>Tiếp tục thanh toán</strong> để nhận hàng tại Smart Locker, hoặc{' '}
            <strong>Không tiếp tục</strong> mà không bị trừ bất kỳ chi phí nào.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-1">
          <button
            type="button"
            onClick={onConfirmCheckout}
            className="w-full py-3.5 px-6 rounded-2xl bg-[#006EE9] hover:bg-[#000181] text-white font-black text-xs uppercase tracking-wider transition shadow-lg shadow-[#006EE9]/25 flex items-center justify-center space-x-2 cursor-pointer active:scale-98"
          >
            <span>Tiếp tục thanh toán ({formatVND(grandTotal)})</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onCancelParticipation}
            className="w-full py-2.5 px-6 rounded-2xl bg-white hover:bg-[#F6F7FB] text-[#53536A] hover:text-[#000181] font-bold text-xs uppercase tracking-wider transition border border-[#E6E6EE] cursor-pointer"
          >
            Không tiếp tục (Hủy đăng ký mua)
          </button>
        </div>
      </div>
    </div>
  );
};
