'use client';

import React from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  Trash2,
  Gift,
  Sparkles,
  HelpCircle,
  FileCheck2,
  ShoppingCart,
  Check,
  X
} from 'lucide-react';
import { DesignLayer, TextLayer, ImageLayer, StudioAddon, StudioPricingBreakdown, CupModelDef } from './types';

interface StudioPricingSidebarProps {
  selectedModel: CupModelDef;
  layers: DesignLayer[];
  selectedLayerId: string | null;
  onUpdateLayer: (id: string, updates: Partial<DesignLayer>) => void;
  onDeleteLayer: (id: string) => void;
  isOutOfSafeZone: boolean;
  addons: StudioAddon[];
  onToggleAddon: (id: string) => void;
  onUpdateAddonNote: (id: string, note: string) => void;
  pricing: StudioPricingBreakdown;
  onAddToCart: () => void;
  isAddingToCart: boolean;
  formatVND: (num: number) => string;
  onCloseMobile?: () => void;
  onOpenGiftModal?: () => void;
}

export function StudioPricingSidebar({
  selectedModel,
  layers,
  selectedLayerId,
  onUpdateLayer,
  onDeleteLayer,
  isOutOfSafeZone,
  addons,
  onToggleAddon,
  onUpdateAddonNote,
  pricing,
  onAddToCart,
  isAddingToCart,
  formatVND,
  onCloseMobile,
  onOpenGiftModal,
}: StudioPricingSidebarProps) {
  const selectedLayer = layers.find((l) => l.id === selectedLayerId) || null;

  return (
    <div className="flex flex-col h-full bg-white select-none">
      {/* Top Header of Sidebar */}
      <div className="p-4 border-b border-[#E8DFD8] flex items-center justify-between bg-white shrink-0">
        <div>
          <h3 className="font-extrabold text-sm text-[#3A211E] uppercase tracking-wider">
            Chi Phí & Phụ Kiện
          </h3>
          <p className="text-[11px] text-[#765B52]">
            Tự động tính theo nội dung thiết kế
          </p>
        </div>
        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="p-1.5 hover:bg-[#FFF9E8] rounded-full text-[#765B52] hover:text-[#3A211E] lg:hidden"
            aria-label="Đóng bảng"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6">
        {/* 1. CHẤT LƯỢNG FILE / IN ẤN (Theo ảnh ví dụ) */}
        <div className="space-y-2">
          <span className="text-[11px] font-black uppercase tracking-wider text-[#765B52] block">
            Chất lượng file
          </span>
          <div
            className={`p-3 rounded-2xl flex items-center gap-2.5 text-xs font-bold transition-all ${
              isOutOfSafeZone
                ? 'bg-amber-50 border border-amber-200 text-amber-900'
                : 'bg-emerald-50 border border-emerald-200 text-emerald-800'
            }`}
          >
            {isOutOfSafeZone ? (
              <>
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Chi tiết vượt vùng in an toàn (15mm)</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Print Quality: Excellent (Chuẩn in UV)</span>
              </>
            )}
          </div>
        </div>

        {/* 2. ĐỐI TƯỢNG ĐANG CHỌN (Quick Inspector theo đúng ảnh ví dụ) */}
        <div className="space-y-3 bg-[#FAF7F2] p-4 rounded-2xl border border-[#E8DFD8]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#765B52]">
              Đối tượng đang chọn
            </span>
            {selectedLayer && (
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-white border border-[#E8DFD8] text-[#3A211E]">
                {selectedLayer.type === 'text'
                  ? 'Chữ'
                  : selectedLayer.type === 'sticker'
                  ? 'Sticker'
                  : 'Hình ảnh'}
              </span>
            )}
          </div>

          {selectedLayer ? (
            <div className="space-y-3 text-xs">
              {/* Layer Title */}
              <div className="text-[13px] font-bold text-[#3A211E] truncate">
                {selectedLayer.type === 'text'
                  ? `"${(selectedLayer as TextLayer).text || 'Văn bản'}"`
                  : selectedLayer.name}
              </div>

              {/* Slider: Kích thước */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-[#765B52] font-semibold">
                  <span>Kích thước</span>
                  <span className="font-mono">{Math.round(selectedLayer.scale * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.3"
                  max="2.5"
                  step="0.05"
                  value={selectedLayer.scale}
                  onChange={(e) =>
                    onUpdateLayer(selectedLayer.id, { scale: parseFloat(e.target.value) })
                  }
                  className="w-full accent-[#FFBF00] h-1.5 bg-[#E8DFD8] rounded-lg cursor-pointer"
                />
              </div>

              {/* Slider: Xoay */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-[#765B52] font-semibold">
                  <span>Xoay</span>
                  <span className="font-mono">{Math.round(selectedLayer.rotation)}°</span>
                </div>
                <input
                  type="range"
                  min="-180"
                  max="180"
                  step="1"
                  value={selectedLayer.rotation}
                  onChange={(e) =>
                    onUpdateLayer(selectedLayer.id, { rotation: parseInt(e.target.value, 10) })
                  }
                  className="w-full accent-[#FFBF00] h-1.5 bg-[#E8DFD8] rounded-lg cursor-pointer"
                />
              </div>

              {/* Slider: Độ trong suốt */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-[#765B52] font-semibold">
                  <span>Độ trong suốt</span>
                  <span className="font-mono">{Math.round((selectedLayer.opacity ?? 1) * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.05"
                  value={selectedLayer.opacity ?? 1}
                  onChange={(e) =>
                    onUpdateLayer(selectedLayer.id, { opacity: parseFloat(e.target.value) })
                  }
                  className="w-full accent-[#FFBF00] h-1.5 bg-[#E8DFD8] rounded-lg cursor-pointer"
                />
              </div>

              {/* Nút Xóa đối tượng */}
              <button
                type="button"
                onClick={() => onDeleteLayer(selectedLayer.id)}
                className="w-full py-2 px-3 mt-2 bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Xóa đối tượng này</span>
              </button>
            </div>
          ) : (
            <div className="text-[11px] text-[#765B52] py-2 text-center">
              Chạm vào chữ, ảnh hoặc sticker trên ly để tinh chỉnh kích thước và góc xoay.
            </div>
          )}
        </div>

        {/* 3. GÓI CÁ NHÂN HÓA (Theo logic: text -> tính thêm, ảnh -> tính thêm, sticker -> bao gồm trong text) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#765B52]">
              Phí cá nhân hóa
            </span>
            <span className="text-[10px] text-[#765B52] italic">Theo thiết kế thực tế</span>
          </div>

          <div className="space-y-2 text-xs">
            {/* Phí In Chữ */}
            <div
              className={`p-3 rounded-2xl border flex items-center justify-between transition-all ${
                pricing.hasText
                  ? 'bg-amber-50/80 border-[#FFBF00] text-[#3A211E]'
                  : 'bg-white border-[#E8DFD8] text-[#765B52]'
              }`}
            >
              <div>
                <div className="font-bold text-[#3A211E] flex items-center gap-1.5">
                  <span>In chữ / Khắc tên</span>
                  {pricing.hasText && (
                    <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded-full bg-[#FFBF00] text-[#3A211E]">
                      x{pricing.textCount}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-[#765B52] mt-0.5">
                  {pricing.hasText ? 'Đã thêm chữ lên ly' : 'Chưa thêm chữ (0₫)'}
                </p>
              </div>
              <div className="font-black text-[#3A211E]">
                {pricing.hasText ? `+${formatVND(pricing.textFee)}` : '+0 ₫'}
              </div>
            </div>

            {/* Phí In Ảnh */}
            <div
              className={`p-3 rounded-2xl border flex items-center justify-between transition-all ${
                pricing.hasImage
                  ? 'bg-amber-50/80 border-[#FFBF00] text-[#3A211E]'
                  : 'bg-white border-[#E8DFD8] text-[#765B52]'
              }`}
            >
              <div>
                <div className="font-bold text-[#3A211E] flex items-center gap-1.5">
                  <span>In hình ảnh / Logo màu</span>
                  {pricing.hasImage && (
                    <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded-full bg-[#FFBF00] text-[#3A211E]">
                      x{pricing.imageCount}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-[#765B52] mt-0.5">
                  {pricing.hasImage ? 'Đã tải ảnh lên ly' : 'Chưa tải ảnh (0₫)'}
                </p>
              </div>
              <div className="font-black text-[#3A211E]">
                {pricing.hasImage ? `+${formatVND(pricing.imageFee)}` : '+0 ₫'}
              </div>
            </div>

            {/* Sticker Trang Trí */}
            <div
              className={`p-3 rounded-2xl border flex items-center justify-between transition-all ${
                pricing.hasSticker
                  ? 'bg-amber-50/50 border-amber-200 text-[#3A211E]'
                  : 'bg-white border-[#E8DFD8] text-[#765B52]'
              }`}
            >
              <div>
                <div className="font-bold text-[#3A211E] flex items-center gap-1.5">
                  <span>Họa tiết Sticker</span>
                  {pricing.hasSticker && (
                    <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800">
                      x{pricing.stickerCount}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-[#765B52] mt-0.5">
                  {pricing.hasText && pricing.hasSticker
                    ? 'Miễn phí (đã gồm trong phí in chữ)'
                    : pricing.hasSticker
                    ? 'Phí in sticker cơ bản'
                    : 'Chưa thêm sticker'}
                </p>
              </div>
              <div className="font-black text-[#3A211E]">
                {pricing.hasText && pricing.hasSticker
                  ? '0 ₫ (Free)'
                  : pricing.hasSticker
                  ? `+${formatVND(pricing.stickerFee)}`
                  : '+0 ₫'}
              </div>
            </div>
          </div>
        </div>

        {/* 4. PHỤ KIỆN & QUÀ TẶNG (Theo đúng hình mẫu media_1792602411067.png) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#765B52]">
              Phụ kiện mua kèm
            </span>
            <span className="text-[10px] text-[#765B52] italic">Tùy chọn</span>
          </div>

          <div className="space-y-2.5">
            {addons.map((addon) => (
              <div
                key={addon.id}
                className={`p-3.5 rounded-2xl border transition-all duration-200 ${
                  addon.selected
                    ? 'bg-[#FFF9E8] border-[#FFBF00] shadow-xs'
                    : 'bg-white border-[#E8DFD8] hover:border-amber-300'
                }`}
              >
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={addon.selected}
                    onChange={() => onToggleAddon(addon.id)}
                    className="mt-0.5 w-4 h-4 rounded text-[#FFBF00] focus:ring-[#FFBF00] cursor-pointer"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-[#3A211E]">{addon.name}</span>
                      <span className="font-black text-xs text-[#3A211E]">
                        +{formatVND(addon.price)}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#765B52] mt-0.5 leading-snug">
                      {addon.description}
                    </p>
                  </div>
                </label>

                {/* Nếu chọn Thiệp chúc mừng: Hiện ô nhập lời chúc */}
                {addon.id === 'card' && addon.selected && (
                  <div className="mt-2.5 pt-2 border-t border-[#E8DFD8]/80 animate-in fade-in duration-150">
                    <label className="text-[10px] font-bold text-[#3A211E] block mb-1">
                      Lời nhắn viết lên thiệp:
                    </label>
                    <textarea
                      rows={2}
                      value={addon.note || ''}
                      onChange={(e) => onUpdateAddonNote(addon.id, e.target.value)}
                      placeholder="VD: Chúc mừng sinh nhật bạn thân yêu! Mong bạn luôn vui vẻ và hạnh phúc..."
                      className="w-full p-2 bg-white border border-[#E8DFD8] rounded-xl text-xs text-[#3A211E] placeholder:text-[#765B52]/60 focus:outline-none focus:border-[#FFBF00]"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 5. BẢNG TÍNH GIÁ CHI TIẾT (Real-time Price Breakdown) */}
        <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E8DFD8] space-y-2 text-xs">
          <span className="text-[11px] font-black uppercase tracking-wider text-[#765B52] block mb-1">
            Chi tiết giá
          </span>

          {/* Phôi ly gốc */}
          <div className="flex justify-between text-[#765B52]">
            <span>Ly phôi ({pricing.modelName}):</span>
            <span className="font-bold text-[#3A211E]">{formatVND(pricing.baseCupPrice)}</span>
          </div>

          {/* Phí in chữ */}
          {pricing.hasText && (
            <div className="flex justify-between text-[#765B52]">
              <span>In chữ / Khắc tên:</span>
              <span className="font-bold text-[#3A211E]">+{formatVND(pricing.textFee)}</span>
            </div>
          )}

          {/* Phí in ảnh */}
          {pricing.hasImage && (
            <div className="flex justify-between text-[#765B52]">
              <span>In ảnh màu / Logo:</span>
              <span className="font-bold text-[#3A211E]">+{formatVND(pricing.imageFee)}</span>
            </div>
          )}

          {/* Phí sticker */}
          {pricing.hasSticker && (
            <div className="flex justify-between text-[#765B52]">
              <span>Sticker trang trí:</span>
              <span className="font-bold text-[#3A211E]">
                {pricing.hasText ? 'Miễn phí (0₫)' : `+${formatVND(pricing.stickerFee)}`}
              </span>
            </div>
          )}

          {/* Phụ kiện đã chọn */}
          {pricing.selectedAddons.map((ad) => (
            <div key={ad.id} className="flex justify-between text-[#765B52]">
              <span>{ad.name}:</span>
              <span className="font-bold text-[#3A211E]">+{formatVND(ad.price)}</span>
            </div>
          ))}

          {/* Divider */}
          <div className="pt-2 border-t border-[#E8DFD8] flex items-center justify-between">
            <span className="font-extrabold text-sm text-[#3A211E]">TỔNG GIÁ THIẾT KẾ:</span>
            <span className="font-black text-lg text-[#3A211E]">
              {formatVND(pricing.totalPrice)}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom CTA Button */}
      <div className="p-4 border-t border-[#E8DFD8] bg-white shrink-0 space-y-2.5">
        <button
          onClick={onAddToCart}
          disabled={isAddingToCart}
          className="w-full py-3.5 px-4 bg-[#FFBF00] hover:bg-[#FFD147] text-[#3A211E] rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-98 disabled:opacity-70 cursor-pointer"
        >
          {isAddingToCart ? (
            <>
              <Check className="w-4 h-4" />
              <span>ĐANG LƯU VÀO GIỎ...</span>
            </>
          ) : (
            <>
              <ShoppingCart className="w-4 h-4" />
              <span>THÊM VÀO GIỎ • {formatVND(pricing.totalPrice)}</span>
            </>
          )}
        </button>

        {/* Nút Gửi tặng bạn bè (Demo) */}
        {onOpenGiftModal && (
          <button
            type="button"
            onClick={onOpenGiftModal}
            className="w-full py-2.5 px-3 bg-[#FFF9E8] hover:bg-[#FFF3C4] text-[#3A211E] border border-amber-300 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-98"
          >
            <Gift className="w-4 h-4 text-[#FFBF00]" />
            <span>Gửi tặng bạn bè (Demo)</span>
          </button>
        )}
      </div>
    </div>
  );
}
