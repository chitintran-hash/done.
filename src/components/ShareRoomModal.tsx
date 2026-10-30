import React, { useState, useRef } from 'react';
import { GroupRoom } from '../types';
import {
  getCurrentPrice,
  getNextTier,
  formatVND,
  getRoomShareUrl,
  generateRoomShareMessage,
} from '../utils/pricing';
import {
  Share2,
  Copy,
  Check,
  X,
  Sparkles,
  Users,
  TrendingDown,
  Gift,
} from 'lucide-react';

interface ShareRoomModalProps {
  room: GroupRoom | null;
  currentUserId?: string;
  isOpen: boolean;
  onClose: () => void;
  onRoomShared?: (roomId: string) => void;
  showToast: (msg: string) => void;
}

export const ShareRoomModal: React.FC<ShareRoomModalProps> = ({
  room,
  currentUserId,
  isOpen,
  onClose,
  onRoomShared,
  showToast,
}) => {
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);
  const [fallbackSelectMode, setFallbackSelectMode] = useState(false);
  const urlInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen || !room) return null;

  const currentPrice = room.finalPrice ?? getCurrentPrice(room.totalQuantity, room.priceTiers);
  const nextTier = getNextTier(room.totalQuantity, room.priceTiers);
  const shareUrl = getRoomShareUrl(room.id, currentUserId);
  const shareMessage = generateRoomShareMessage(room, shareUrl);

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
        setCopiedUrl(true);
        setTimeout(() => setCopiedUrl(false), 2500);
        showToast('Đã sao chép link phòng gom!');
        onRoomShared?.(room.id);
      } else {
        throw new Error('Clipboard unavailable');
      }
    } catch {
      setFallbackSelectMode(true);
      urlInputRef.current?.select();
      showToast('Hãy nhấn Ctrl+C để sao chép đường dẫn bên dưới.');
    }
  };

  const handleCopyFullMessage = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareMessage);
        setCopiedMessage(true);
        setTimeout(() => setCopiedMessage(false), 2500);
        showToast('Đã sao chép link phòng gom!');
        onRoomShared?.(room.id);
      } else {
        throw new Error('Clipboard unavailable');
      }
    } catch {
      setFallbackSelectMode(true);
      urlInputRef.current?.select();
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share({
          title: `Mua gom ${room.productName} trên FlashGroup`,
          text: shareMessage,
          url: shareUrl,
        });
        onRoomShared?.(room.id);
        showToast('Đã chia sẻ phòng gom thành công!');
        return;
      } catch (err: any) {
        if (err?.name === 'AbortError') return;
        // Fallback to copy
      }
    }
    await handleCopyFullMessage();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-slate-900 text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-widest text-emerald-300 font-black block">
                CÀNG ĐÔNG, CÀNG RẺ • SOCIAL GROUP BUYING
              </span>
              <h3 className="text-base font-black text-white">Mời bạn vào phòng gom</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 text-slate-300 hover:text-white hover:bg-white/20 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5 max-h-[82vh] overflow-y-auto">
          {/* Room Summary & Tier Progress (Req 4) */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <span className="text-2xl">{room.emoji}</span>
                <div>
                  <h4 className="text-sm font-black text-slate-900">{room.productName}</h4>
                  <span className="text-[11px] text-slate-500 flex items-center gap-1">
                    <Users className="w-3 h-3 text-[#0C0D10]" />
                    Hiện tại: <strong>{room.totalQuantity} sản phẩm</strong> ({room.participantCount} người)
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Giá hiện tại</span>
                <span className="text-base font-black text-slate-900">{formatVND(currentPrice)}</span>
              </div>
            </div>

            {nextTier ? (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="text-xs font-extrabold text-amber-900 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>
                      Chỉ cần thêm <strong>{nextTier.requiredQuantity} sản phẩm</strong> để cả nhóm mở khóa:
                    </span>
                  </div>
                  <div className="text-[11px] text-amber-700 font-semibold flex items-center gap-1">
                    <TrendingDown className="w-3.5 h-3.5" />
                    <span>Tiết kiệm thêm {formatVND(nextTier.savingPerUnit)}/{room.unit} cho mọi người!</span>
                  </div>
                </div>
                <div className="bg-white border border-amber-300 px-3 py-1.5 rounded-xl text-right shrink-0 shadow-sm">
                  <span className="text-lg font-black text-[#0C0D10] block">
                    {formatVND(nextTier.nextPrice)}
                  </span>
                </div>
              </div>
            ) : (
              <div className="bg-[#F5FBD9] border border-[#C7F000] rounded-xl p-3 text-xs font-bold text-emerald-800 flex items-center justify-between">
                <span>🎉 Phòng đã mở khóa mức giá nhóm ưu đãi:</span>
                <span className="text-base font-black text-[#0C0D10]">{formatVND(currentPrice)}</span>
              </div>
            )}
          </div>

          {/* Referral Reward Notice */}
          {currentUserId && (
            <div className="bg-[#F5FBD9]/70 border border-[#C7F000] rounded-2xl p-3.5 flex items-start space-x-2.5 text-xs text-emerald-900">
              <Gift className="w-4 h-4 text-[#0C0D10] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Thưởng giới thiệu +20 FlashPoints (Điểm thưởng demo):</span>{' '}
                Khi bạn bè mở link của bạn, tham gia phòng và nhận hàng thành công tại Locker (`picked_up`), bạn sẽ nhận ngay +20 điểm thưởng!
              </div>
            </div>
          )}

          {/* Shareable Link Input */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-black uppercase text-slate-600 tracking-wider block">
              Link mời tham gia phòng gom {currentUserId ? '(Có gắn mã giới thiệu của bạn)' : ''}
            </label>
            <div className="flex items-center space-x-2">
              <input
                ref={urlInputRef}
                type="text"
                readOnly
                value={shareUrl}
                onClick={(e) => (e.target as HTMLInputElement).select()}
                className="flex-1 text-xs font-mono bg-slate-100 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-800 focus:outline-none focus:border-[#C7F000]"
              />
              <button
                type="button"
                onClick={handleCopyLink}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center space-x-1.5 shrink-0 transition"
              >
                {copiedUrl ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedUrl ? 'Đã chép' : 'Copy Link'}</span>
              </button>
            </div>
            {fallbackSelectMode && (
              <p className="text-[11px] text-amber-700 font-semibold">
                Trình duyệt chặn tự động chép. Vui lòng bôi đen đường dẫn trên và nhấn Ctrl+C.
              </p>
            )}
          </div>

          {/* Friendly Vietnamese Message Preview (Req 5) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-black uppercase text-slate-600 tracking-wider">
                Nội dung tin nhắn gợi ý
              </label>
              <button
                type="button"
                onClick={handleCopyFullMessage}
                className="text-[11px] font-bold text-[#0C0D10] hover:text-emerald-800 flex items-center space-x-1"
              >
                {copiedMessage ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedMessage ? 'Đã sao chép lời nhắn!' : 'Sao chép cả tin nhắn'}</span>
              </button>
            </div>
            <pre className="whitespace-pre-wrap font-sans text-xs bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-slate-700 leading-relaxed">
              {shareMessage}
            </pre>
          </div>

          {/* Primary Action Buttons: Copy Link & Share (Req 4) */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              type="button"
              onClick={handleCopyLink}
              className="py-3 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-xs flex items-center justify-center space-x-2 transition"
            >
              <Copy className="w-4 h-4 text-slate-600" />
              <span>Copy Link</span>
            </button>
            <button
              type="button"
              onClick={handleNativeShare}
              className="py-3 px-4 rounded-xl bg-[#3155FF] hover:bg-[#3155FF] text-white text-white font-black text-xs flex items-center justify-center space-x-2 shadow-lg shadow-emerald-600/20 transition"
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
          </div>

          {/* Prototype Disclaimer (Req 56) */}
          <div className="text-[11px] text-center text-slate-400 border-t border-slate-100 pt-3">
            Ưu đãi, điểm thưởng và chương trình giới thiệu trong prototype là dữ liệu mô phỏng.
          </div>
        </div>
      </div>
    </div>
  );
};
