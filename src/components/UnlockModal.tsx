import React from 'react';
import { formatVND } from '../utils/pricing';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 text-center shadow-2xl border-4 border-emerald-400 relative overflow-hidden transform transition-all">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 via-amber-400 to-emerald-500" />
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
          <span className="text-4xl">🎉</span>
        </div>

        <p className="text-xs uppercase tracking-widest font-extrabold text-emerald-600 mb-1">
          NEW PRICE UNLOCKED
        </p>
        <h2 className="text-2xl font-black text-slate-900 mb-2">MỨC GIÁ MỚI ĐÃ MỞ KHÓA!</h2>
        <p className="text-xs text-slate-500 mb-6 font-medium">
          Vừa có thành viên tham gia phòng <span className="font-bold text-slate-800">"{roomName}"</span>
        </p>

        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 mb-6">
          <div className="text-xs text-emerald-700 font-bold uppercase mb-1">
            GIÁ ÁP DỤNG CHO TOÀN BỘ NHÓM
          </div>
          <div className="text-4xl font-extrabold text-emerald-600 tracking-tight">
            {formatVND(newPrice)}
            <span className="text-sm font-medium text-emerald-800 ml-1">/ {unit}</span>
          </div>
          <p className="text-xs text-emerald-800 mt-2 font-medium">
            ✨ Cả nhóm vừa mở khóa mức giá thấp hơn{' '}
            <strong className="font-bold underline">{formatVND(savedPerUnit)}</strong>!
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-6 rounded-xl transition shadow-lg shadow-emerald-600/30 active:scale-98"
        >
          Tuyệt vời, tiếp tục xem phòng!
        </button>
      </div>
    </div>
  );
};
