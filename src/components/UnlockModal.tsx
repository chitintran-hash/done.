import React from 'react';
import { formatVND } from '../utils/pricing';
import { Sparkles, CheckCircle2 } from 'lucide-react';

interface UnlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  newPrice: number;
  savedPerUnit: number;
  roomName: string;
  unit: string;
}

export const UnlockModal: React.FC<UnlockModalProps> = ({
  isOpen,
  onClose,
  newPrice,
  savedPerUnit,
  roomName,
  unit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#000181]/75 backdrop-blur-md animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 text-center shadow-2xl border border-[#E6E6EE] relative overflow-hidden transform transition-all">
        {/* Top decorative accent: linear-gradient(90deg, #E8A0FF, #83E7FF, #D0FFA4) */}
        <div
          className="absolute top-0 left-0 w-full h-2.5"
          style={{ background: 'linear-gradient(90deg, #E8A0FF 0%, #83E7FF 50%, #D0FFA4 100%)' }}
        />

        {/* Subtle decorative confetti shapes */}
        <div className="absolute top-4 left-6 w-3 h-3 rounded-full bg-[#D0FFA4]/60 transform rotate-12" />
        <div className="absolute top-8 right-8 w-2.5 h-2.5 rounded-sm bg-[#E8A0FF]/60 transform -rotate-45" />
        <div className="absolute bottom-12 left-8 w-3 h-3 rounded-full bg-[#83E7FF]/60" />
        <div className="absolute bottom-16 right-6 w-2 h-2 rounded-sm bg-[#D0FFA4]/60 transform rotate-45" />

        <div className="w-20 h-20 bg-[#D0FFA4] text-[#000181] rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#000181]/10 animate-bounce">
          <Sparkles className="w-10 h-10 text-[#000181] stroke-[2.2]" />
        </div>

        <p className="text-xs uppercase tracking-widest font-black text-[#006EE9] mb-1">
          NEW PRICE UNLOCKED
        </p>
        <h2 className="text-2xl font-black text-[#000181] mb-2 tracking-tight">
          MỨC GIÁ MỚI ĐÃ MỞ KHÓA!
        </h2>
        <p className="text-xs text-[#53536A] mb-6 font-medium">
          Vừa có thành viên tham gia phòng <span className="font-bold text-[#000181]">"{roomName}"</span>
        </p>

        {/* Highlight panel in Powdered Lime #D0FFA4 */}
        <div className="bg-[#D0FFA4] border border-[#000181]/20 rounded-2xl p-5 mb-6 text-[#000181] shadow-xs">
          <div className="text-[11px] text-[#000181] font-black uppercase tracking-wider mb-1 flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#000181]" />
            <span>GIÁ ÁP DỤNG CHO TOÀN BỘ NHÓM</span>
          </div>
          <div className="text-4xl font-black text-[#000181] tracking-tight">
            {formatVND(newPrice)}
            <span className="text-sm font-bold text-[#53536A] ml-1">/ {unit}</span>
          </div>
          <p className="text-xs text-[#000181] mt-2 font-bold">
            ✨ Cả nhóm vừa mở khóa mức giá thấp hơn{' '}
            <strong className="font-black underline">{formatVND(savedPerUnit)}</strong>!
          </p>
        </div>

        {/* Primary CTA in Blue Raspberry #006EE9 */}
        <button
          onClick={onClose}
          className="w-full bg-[#006EE9] hover:bg-[#000181] text-white font-black py-3.5 px-6 rounded-xl transition shadow-lg shadow-[#006EE9]/25 active:scale-98 cursor-pointer uppercase text-xs tracking-wider"
        >
          TUYỆT VỜI, TIẾP TỤC XEM PHÒNG!
        </button>
      </div>
    </div>
  );
};
