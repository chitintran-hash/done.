import React, { useState } from 'react';
import { GroupRoom } from '../types';
import { getCurrentPrice, getNextTier, formatVND } from '../utils/pricing';
import { X, Sparkles, Plus, Minus, ArrowRight, ShieldAlert, Check } from 'lucide-react';

interface JoinModalProps {
  room: GroupRoom;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (quantity: number) => void;
  hasAlreadyJoined?: boolean;
}

export const JoinModal: React.FC<JoinModalProps> = ({
  room,
  isOpen,
  onClose,
  onConfirm,
  hasAlreadyJoined,
}) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentTotalQuantity = room.totalQuantity;
  const currentPrice = getCurrentPrice(currentTotalQuantity, room.priceTiers);
  const remainingCapacity = Math.max(0, room.maxQuantity - currentTotalQuantity);
  const maxAllowed = Math.min(5, remainingCapacity);

  const projectedQuantity = currentTotalQuantity + quantity;
  const projectedPrice = getCurrentPrice(projectedQuantity, room.priceTiers);
  const savingPerUnit = currentPrice - projectedPrice;
  const isTierUnlocked = savingPerUnit > 0;
  const nextTier = getNextTier(projectedQuantity, room.priceTiers);

  // Validation rules
  let validationError: string | null = null;
  if (hasAlreadyJoined) {
    validationError = 'Bạn đã tham gia phòng gom này rồi.';
  } else if (room.status !== 'active') {
    validationError = 'Phòng gom hiện không ở trạng thái mở.';
  } else if (room.participantCount >= room.maxParticipants) {
    validationError = 'Phòng gom đã đạt giới hạn số người tối đa.';
  } else if (currentTotalQuantity >= room.maxQuantity) {
    validationError = 'Phòng gom đã đạt đủ số lượng sản phẩm tối đa.';
  } else if (remainingCapacity < 1) {
    validationError = 'Không còn suất trống trong phòng gom này.';
  } else if (currentTotalQuantity + quantity > room.maxQuantity) {
    validationError = `Chỉ còn trống ${remainingCapacity} sản phẩm. Vui lòng giảm số lượng.`;
  }

  const handleDecrease = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleIncrease = () => {
    setQuantity((prev) => Math.min(maxAllowed, prev + 1));
  };

  const handleConfirm = async () => {
    if (validationError || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await onConfirm(quantity);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative overflow-hidden transform transition-all">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">{room.emoji}</span>
            <div>
              <span className="text-[11px] font-black uppercase text-[#0C0D10] tracking-wider block">
                THAM GIA PHÒNG GOM
              </span>
              <h3 className="text-lg font-black text-slate-900 leading-snug">{room.productName}</h3>
              <p className="text-xs text-slate-500">
                Quy cách: <strong>{room.unit}</strong> • Pickup: <strong>{room.pickupPoint}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quantity Selector Section */}
        <div className="py-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                Chọn số lượng
              </label>
              <span className="text-xs text-slate-400">
                (Tối đa 5 {room.unit} / thành viên, còn lại {remainingCapacity})
              </span>
            </div>

            {/* Stepper */}
            <div className="flex items-center space-x-3 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
              <button
                type="button"
                onClick={handleDecrease}
                disabled={quantity <= 1}
                className="w-9 h-9 rounded-xl bg-white text-slate-800 flex items-center justify-center font-bold shadow-sm hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center font-black text-lg text-slate-900">{quantity}</span>
              <button
                type="button"
                onClick={handleIncrease}
                disabled={quantity >= maxAllowed}
                className="w-9 h-9 rounded-xl bg-white text-slate-800 flex items-center justify-center font-bold shadow-sm hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Comparison / Projected Price Card */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
            <div className="grid grid-cols-2 gap-3 pb-3 border-b border-slate-200 text-xs">
              <div>
                <span className="text-slate-500 block mb-0.5">Hiện tại:</span>
                <div className="font-bold text-slate-800">
                  {currentTotalQuantity} sản phẩm đã gom
                </div>
                <div className="text-sm font-black text-slate-700 mt-0.5">
                  {formatVND(currentPrice)}/{room.unit}
                </div>
              </div>

              <div className="border-l border-slate-200 pl-3">
                <span className="text-[#0C0D10] font-bold block mb-0.5">
                  Sau khi bạn tham gia:
                </span>
                <div className="font-bold text-slate-900">
                  {projectedQuantity} / {room.maxQuantity} sản phẩm
                </div>
                <div className="text-sm font-black text-[#0C0D10] mt-0.5">
                  {formatVND(projectedPrice)}/{room.unit}
                </div>
              </div>
            </div>

            {/* Unlock tier highlight */}
            {isTierUnlocked ? (
              <div className="bg-[#F5FBD9]/70 border border-[#C7F000] rounded-xl p-3 flex items-start space-x-2.5">
                <Sparkles className="w-5 h-5 text-[#0C0D10] shrink-0 mt-0.5" />
                <div className="text-xs">
                  <div className="font-black text-emerald-900">
                    🎉 SẼ MỞ KHÓA MỨC GIÁ MỚI CHO TOÀN BỘ NHÓM!
                  </div>
                  <div className="text-emerald-800 mt-0.5">
                    Mức giá giảm từ <span className="line-through">{formatVND(currentPrice)}</span> xuống{' '}
                    <strong className="underline">{formatVND(projectedPrice)}</strong>. Tiết kiệm thêm{' '}
                    <strong>{formatVND(savingPerUnit)}/{room.unit}</strong>!
                  </div>
                </div>
              </div>
            ) : nextTier ? (
              <div className="text-xs text-slate-600 flex items-center justify-between bg-white p-2.5 rounded-xl border border-slate-200">
                <span>Mức giá giữ nguyên {formatVND(projectedPrice)}.</span>
                <span className="font-bold text-amber-700">
                  Cần thêm {nextTier.requiredQuantity} sp để mở khóa {formatVND(nextTier.nextPrice)}
                </span>
              </div>
            ) : (
              <div className="text-xs text-emerald-800 font-bold flex items-center space-x-1.5 bg-[#F5FBD9] p-2 rounded-xl border border-[#C7F000]">
                <Check className="w-4 h-4 text-[#0C0D10]" />
                <span>Bạn đang ở bậc giá thấp nhất tối đa của nhà cung cấp!</span>
              </div>
            )}
          </div>

          {/* Validation Warning */}
          {validationError && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-xl text-xs flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{validationError}</span>
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="pt-2 flex items-center space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="w-1/3 py-3.5 rounded-xl border border-slate-300 font-bold text-xs text-slate-700 hover:bg-slate-100 transition"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={Boolean(validationError) || isSubmitting}
            className="w-2/3 py-3.5 rounded-xl bg-[#3155FF] hover:bg-[#3155FF] text-white text-white font-black text-xs transition shadow-lg shadow-emerald-600/30 flex items-center justify-center space-x-1.5 disabled:opacity-40 disabled:cursor-not-allowed active:scale-98"
          >
            {isSubmitting ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Đang xử lý...</span>
              </div>
            ) : (
              <>
                <span>XÁC NHẬN THAM GIA ({quantity} {room.unit})</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
