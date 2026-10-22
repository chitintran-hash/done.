'use client';

import React, { useState, useRef } from 'react';
import {
  Box,
  Layers,
  Type,
  ImageIcon,
  Smile,
  Upload,
  Trash2,
  Copy,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Search,
  Check,
  AlertTriangle,
  Move,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Info,
  Gift
} from 'lucide-react';
import {
  DesignLayer,
  TextLayer,
  ImageLayer,
  CupModelDef,
  CupColorOption,
  StudioAddon,
  StudioPricingBreakdown
} from './types';
import { CUP_MODELS, CUP_COLOR_OPTIONS, CLEAR_GLASS_COLOR, PLASTIC_COLOR_OPTIONS, LID_COLOR_OPTIONS, PRESET_STICKERS } from './cupDefinitions';
import { FONT_LIBRARY, FONT_CATEGORIES } from './fontLibrary';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from './useCanvasTexture';

interface StudioToolbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedModel: CupModelDef;
  setSelectedModel: (m: CupModelDef) => void;
  selectedColor: CupColorOption;
  setSelectedColor: (c: CupColorOption) => void;
  lidColor: string;
  setLidColor: (c: string) => void;
  layers: DesignLayer[];
  selectedLayerId: string | null;
  setSelectedLayerId: (id: string | null) => void;
  onUpdateLayer: (id: string, updates: Partial<DesignLayer>) => void;
  onAddTextLayer: () => void;
  onAddImageLayer: (file: File) => void;
  onAddStickerLayer: (stickerUrl: string, stickerName: string) => void;
  onDeleteLayer: (id: string) => void;
  onDuplicateLayer: (id: string) => void;
  onMoveLayerOrder: (id: string, direction: 'up' | 'down') => void;
  formatVND: (num: number) => string;
  addons?: StudioAddon[];
  onToggleAddon?: (id: string) => void;
  onUpdateAddonNote?: (id: string, note: string) => void;
  pricing?: StudioPricingBreakdown;
}

export function StudioToolbar({
  activeTab,
  setActiveTab,
  selectedModel,
  setSelectedModel,
  selectedColor,
  setSelectedColor,
  lidColor,
  setLidColor,
  layers,
  selectedLayerId,
  setSelectedLayerId,
  onUpdateLayer,
  onAddTextLayer,
  onAddImageLayer,
  onAddStickerLayer,
  onDeleteLayer,
  onDuplicateLayer,
  onMoveLayerOrder,
  formatVND,
  addons = [],
  onToggleAddon,
  onUpdateAddonNote,
  pricing,
}: StudioToolbarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fontSearch, setFontSearch] = useState('');
  const [fontCategory, setFontCategory] = useState<string>('all');

  const selectedLayer = layers.find((l) => l.id === selectedLayerId) || null;

  // Filter fonts
  const filteredFonts = FONT_LIBRARY.filter((f) => {
    const matchesSearch =
      f.name.toLowerCase().includes(fontSearch.toLowerCase()) ||
      f.sampleDescription.toLowerCase().includes(fontSearch.toLowerCase());
    const matchesCategory =
      fontCategory === 'all' || f.category === fontCategory;
    return matchesSearch && matchesCategory;
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onAddImageLayer(file);
      e.target.value = '';
    }
  };

  return (
    <div className="flex h-full select-none">
      {/* 1. Left Vertical Icon Sidebar */}
      <div className="w-20 bg-white border-r border-[#E8DFD8] flex flex-col items-center py-6 gap-3 z-10 shrink-0 shadow-[4px_0_12px_rgba(0,0,0,0.02)]">
        <button
          onClick={() => setActiveTab('models')}
          className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl w-16 transition-all ${
            activeTab === 'models' ? 'bg-[#FFBF00] text-[#3A211E] shadow-sm font-bold' : 'text-[#765B52] hover:text-[#3A211E] hover:bg-[#FFF9E8]'
          }`}
        >
          <Box className="w-5 h-5" />
          <span className="text-[10px] font-bold text-center leading-tight">Mẫu ly</span>
        </button>

        <button
          onClick={() => setActiveTab('colors')}
          className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl w-16 transition-all ${
            activeTab === 'colors' ? 'bg-[#FFBF00] text-[#3A211E] shadow-sm font-bold' : 'text-[#765B52] hover:text-[#3A211E] hover:bg-[#FFF9E8]'
          }`}
        >
          <div
            className="w-5 h-5 rounded-full border-2 border-current flex items-center justify-center text-[9px]"
            style={{ backgroundColor: selectedModel.category === 'glass' ? '#ffffff' : selectedColor.color }}
          >
            {selectedModel.category === 'glass' ? <Sparkles className="w-2.5 h-2.5 text-[#3A211E]" /> : null}
          </div>
          <span className="text-[10px] font-bold">Màu ly</span>
        </button>

        <button
          onClick={() => setActiveTab('text')}
          className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl w-16 transition-all ${
            activeTab === 'text' ? 'bg-[#FFBF00] text-[#3A211E] shadow-sm font-bold' : 'text-[#765B52] hover:text-[#3A211E] hover:bg-[#FFF9E8]'
          }`}
        >
          <Type className="w-5 h-5" />
          <span className="text-[10px] font-bold">Chữ</span>
        </button>

        <button
          onClick={() => setActiveTab('upload')}
          className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl w-16 transition-all ${
            activeTab === 'upload' ? 'bg-[#FFBF00] text-[#3A211E] shadow-sm font-bold' : 'text-[#765B52] hover:text-[#3A211E] hover:bg-[#FFF9E8]'
          }`}
        >
          <Upload className="w-5 h-5" />
          <span className="text-[10px] font-bold">Tải ảnh</span>
        </button>

        <button
          onClick={() => setActiveTab('stickers')}
          className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl w-16 transition-all ${
            activeTab === 'stickers' ? 'bg-[#FFBF00] text-[#3A211E] shadow-sm font-bold' : 'text-[#765B52] hover:text-[#3A211E] hover:bg-[#FFF9E8]'
          }`}
        >
          <Smile className="w-5 h-5" />
          <span className="text-[10px] font-bold">Sticker</span>
        </button>

        <div className="w-8 h-px bg-[#E8DFD8] my-1"></div>

        <button
          onClick={() => setActiveTab('layers')}
          className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl w-16 transition-all relative ${
            activeTab === 'layers' ? 'bg-[#FFBF00] text-[#3A211E] shadow-sm font-bold' : 'text-[#765B52] hover:text-[#3A211E] hover:bg-[#FFF9E8]'
          }`}
        >
          <Layers className="w-5 h-5" />
          <span className="text-[10px] font-bold">Layer</span>
          {layers.length > 0 && (
            <span className="absolute top-1 right-2 w-4 h-4 bg-[#D97706] text-white rounded-full text-[9px] font-bold flex items-center justify-center">
              {layers.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('pricing')}
          className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl w-16 transition-all relative ${
            activeTab === 'pricing' ? 'bg-[#FFBF00] text-[#3A211E] shadow-sm font-bold' : 'text-[#765B52] hover:text-[#3A211E] hover:bg-[#FFF9E8]'
          }`}
        >
          <Gift className="w-5 h-5" />
          <span className="text-[10px] font-bold text-center leading-tight">Phụ kiện</span>
          {addons.some((a) => a.selected) && (
            <span className="absolute top-1 right-2 w-2 h-2 bg-[#D97706] rounded-full"></span>
          )}
        </button>
      </div>

      {/* 2. Flyout Properties Drawer Panel */}
      <div className="w-80 md:w-96 bg-white border-r border-[#E8DFD8] p-6 flex flex-col gap-6 z-10 overflow-y-auto shadow-[4px_0_12px_rgba(0,0,0,0.02)]">
        {/* ==================== TAB: MẪU LY ==================== */}
        {activeTab === 'models' && (
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-[#3A211E] text-base">Chọn Mẫu Ly Thực Tế</h3>
              <p className="text-xs text-[#765B52] mt-1">
                Tất cả mẫu ly đều có hình dạng và tỷ lệ tham số 3D chuẩn xác.
              </p>
            </div>

            <div className="space-y-3">
              {CUP_MODELS.map((m) => {
                const isSelected = selectedModel.id === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => setSelectedModel(m)}
                    className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex flex-col gap-2 ${
                      isSelected
                        ? 'border-[#3A211E] bg-[#FFF9E8] shadow-sm'
                        : 'border-[#E8DFD8] hover:border-[#3A211E]/60 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-[#3A211E] flex items-center gap-1.5">
                        {m.name}
                        {isSelected && <Check className="w-4 h-4 text-[#059669]" />}
                      </span>
                      <span className="font-black text-sm text-[#3A211E]">
                        {formatVND(m.defaultPrice)}
                      </span>
                    </div>

                    <p className="text-xs text-[#765B52]">{m.subtitle}</p>

                    <div className="flex items-center gap-2 pt-1 border-t border-[#E8DFD8]/60 text-[11px] text-[#765B52]">
                      <span className="bg-white px-2 py-0.5 rounded-md border border-[#E8DFD8] font-bold">
                        {m.capacity}
                      </span>
                      <span>Cao: {m.heightMm}</span>
                      <span>•</span>
                      <span>Miệng: {m.diameterMm}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="bg-[#FFF9E8] p-3.5 rounded-2xl border border-[#E8DFD8] flex items-start gap-2 text-xs text-[#765B52]">
              <Info className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" />
              <span>
                Mô hình 3D được dựng tham số chuẩn xác có thành đôi, độ dày đáy đúc thực tế và viền miệng kính.
              </span>
            </div>
          </div>
        )}

        {/* ==================== TAB: MÀU SẮC & VẬT LIỆU ==================== */}
        {activeTab === 'colors' && (
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-[#3A211E] text-base">Màu Sắc & Vật Liệu</h3>
              <p className="text-xs text-[#765B52] mt-1">
                {selectedModel.name}
              </p>
            </div>

            {selectedModel.category === 'glass' ? (
              <div className="bg-[#FFF9E8] p-5 rounded-2xl border border-[#E8DFD8] space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-[#E8DFD8] shadow-sm flex items-center justify-center shrink-0">
                    <Sparkles className="w-6 h-6 text-[#FFBF00]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#3A211E]">Thủy Tinh Pha Lê Nguyên Bản</h4>
                    <span className="inline-block bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200 mt-1">
                      100% Trong Suốt Tự Nhiên
                    </span>
                  </div>
                </div>

                <p className="text-xs text-[#765B52] leading-relaxed">
                  Toàn bộ các dòng <strong>ly thủy tinh</strong> tại Cupfy đều được sản xuất từ chất liệu thủy tinh pha lê trong suốt tự nhiên, không nhuộm màu để giữ trọn độ tinh khiết và an toàn vệ sinh tối đa.
                </p>

                <div className="bg-white p-3.5 rounded-xl border border-[#E8DFD8] text-xs space-y-2">
                  <div className="flex justify-between text-[#765B52]">
                    <span>Chất liệu:</span>
                    <strong className="text-[#3A211E]">Thủy tinh quang học cao cấp</strong>
                  </div>
                  <div className="flex justify-between text-[#765B52]">
                    <span>Độ truyền sáng (Transmission):</span>
                    <strong className="text-emerald-700">98% Trong suốt</strong>
                  </div>
                  <div className="flex justify-between text-[#765B52]">
                    <span>Đổi màu thân ly:</span>
                    <strong className="text-[#3A211E]">Chỉ áp dụng cho ly nhựa</strong>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#E8DFD8] space-y-2">
                  <p className="text-[11px] text-[#765B52]">
                    Bạn muốn thiết kế mẫu ly có thể tùy chọn nhiều màu sắc thân & nắp ly?
                  </p>
                  <button
                    onClick={() => {
                      const plastic = CUP_MODELS.find(m => m.id === 'plastic_boba');
                      if (plastic) {
                        setSelectedModel(plastic);
                        setSelectedColor(PLASTIC_COLOR_OPTIONS[0]);
                      }
                    }}
                    className="w-full py-2.5 px-4 bg-[#3A211E] text-white rounded-xl text-xs font-bold hover:bg-[#3A211E] shadow-sm transition-all flex items-center justify-center gap-2"
                  >
                    <Box className="w-4 h-4" />
                    <span>Chuyển Sang Ly Nhựa Có Nắp</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <h4 className="font-bold text-[#3A211E] text-sm mb-1">Màu Thân Ly Nhựa</h4>
                  <p className="text-xs text-[#765B52] mb-3">Nhựa nguyên sinh an toàn BPA-Free, bề mặt mịn cao cấp.</p>
                  <div className="grid grid-cols-2 gap-2.5">
                    {PLASTIC_COLOR_OPTIONS.map((c) => {
                      const isSelected = selectedColor.id === c.id;
                      return (
                        <button
                          key={c.id}
                          onClick={() => setSelectedColor(c)}
                          className={`p-3 rounded-xl border-2 flex items-center gap-2.5 transition-all text-left ${
                            isSelected
                              ? 'border-[#3A211E] bg-[#FFF9E8]'
                              : 'border-[#E8DFD8] hover:border-[#3A211E]/50'
                          }`}
                        >
                          <span
                            className="w-6 h-6 rounded-full border border-black/10 shrink-0 shadow-inner"
                            style={{ backgroundColor: c.color }}
                          ></span>
                          <span className="text-xs font-bold text-[#3A211E] line-clamp-1 leading-tight">
                            {c.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Lid Color for Boba Cup */}
                <div className="border-t border-[#E8DFD8] pt-6 space-y-3">
                  <h4 className="font-bold text-[#3A211E] text-sm">Màu Nắp Ly Nhựa</h4>
                  <div className="flex flex-wrap gap-2.5">
                    {LID_COLOR_OPTIONS.map((l) => (
                      <button
                        key={l.id}
                        onClick={() => setLidColor(l.color)}
                        title={l.name}
                        className={`w-9 h-9 rounded-full border-2 transition-all ${
                          lidColor === l.color ? 'border-[#3A211E] scale-110' : 'border-[#E8DFD8]'
                        }`}
                        style={{ backgroundColor: l.color }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================== TAB: CHỮ (TEXT TOOL) ==================== */}
        {activeTab === 'text' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-[#3A211E] text-base">Dán Chữ Cong Lên Thân Ly</h3>
                <p className="text-xs text-[#765B52]">Chữ uốn cong tự nhiên theo độ cong của ly.</p>
              </div>
              <button
                onClick={onAddTextLayer}
                className="px-3.5 py-2 bg-[#3A211E] text-white rounded-xl text-xs font-bold hover:bg-[#3A211E] shadow-sm flex items-center gap-1.5 transition-all"
              >
                + Thêm Chữ
              </button>
            </div>

            {selectedLayer && selectedLayer.type === 'text' ? (
              <div className="space-y-5 bg-[#FFF9E8] p-4 rounded-2xl border border-[#E8DFD8]">
                <div>
                  <label className="text-xs font-bold text-[#3A211E] mb-1.5 block">
                    Nội dung in (Hỗ trợ nhiều dòng & dấu tiếng Việt):
                  </label>
                  <textarea
                    value={(selectedLayer as TextLayer).text}
                    onChange={(e) =>
                      onUpdateLayer(selectedLayer.id, { text: e.target.value })
                    }
                    placeholder="Nhập tên hoặc câu quote tiếng Việt..."
                    className="w-full p-3 bg-white border border-[#E8DFD8] rounded-xl text-sm focus:outline-none focus:border-[#3A211E] resize-none h-20 shadow-sm"
                  />
                </div>

                {/* Font Category and Search */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-[#3A211E]">
                      Thư viện Font Tiếng Việt (22 font):
                    </label>
                  </div>

                  <div className="relative mb-2">
                    <Search className="w-3.5 h-3.5 text-[#765B52] absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Tìm font chữ..."
                      value={fontSearch}
                      onChange={(e) => setFontSearch(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 bg-white border border-[#E8DFD8] rounded-lg text-xs focus:outline-none focus:border-[#3A211E]"
                    />
                  </div>

                  <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-none">
                    {FONT_CATEGORIES.map((cat) => (
                      <button
                        key={cat.key}
                        onClick={() => setFontCategory(cat.key)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-colors ${
                          fontCategory === cat.key
                            ? 'bg-[#FFBF00] text-[#3A211E] font-bold'
                            : 'bg-white border border-[#E8DFD8] text-[#765B52] hover:text-[#3A211E]'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>

                  {/* Font List Scroll */}
                  <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1 mt-1">
                    {filteredFonts.map((f) => {
                      const isSelected =
                        (selectedLayer as TextLayer).font === f.family;
                      return (
                        <button
                          key={f.id}
                          onClick={() =>
                            onUpdateLayer(selectedLayer.id, { font: f.family })
                          }
                          className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-center justify-between ${
                            isSelected
                              ? 'border-[#3A211E] bg-white shadow-sm ring-1 ring-[#3A211E]'
                              : 'border-[#E8DFD8] bg-white hover:border-[#3A211E]/60'
                          }`}
                        >
                          <div>
                            <span className="font-bold text-xs text-[#3A211E] block">
                              {f.name}
                            </span>
                            <span
                              className="text-xs text-[#3A211E] line-clamp-1 mt-0.5"
                              style={{ fontFamily: f.family }}
                            >
                              {f.previewText}
                            </span>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-[#059669]" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Text Formatting Tools */}
                <div>
                  <label className="text-xs font-bold text-[#3A211E] mb-2 block">
                    Định dạng & Căn lề:
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        onUpdateLayer(selectedLayer.id, {
                          isBold: !(selectedLayer as TextLayer).isBold,
                        })
                      }
                      className={`p-2 rounded-lg border text-xs font-bold ${
                        (selectedLayer as TextLayer).isBold
                          ? 'bg-[#FFBF00] text-[#3A211E] border-[#FFBF00] font-bold'
                          : 'bg-white border-[#E8DFD8] text-[#3A211E]'
                      }`}
                    >
                      <Bold className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() =>
                        onUpdateLayer(selectedLayer.id, {
                          isItalic: !(selectedLayer as TextLayer).isItalic,
                        })
                      }
                      className={`p-2 rounded-lg border text-xs font-bold ${
                        (selectedLayer as TextLayer).isItalic
                          ? 'bg-[#FFBF00] text-[#3A211E] border-[#FFBF00] font-bold'
                          : 'bg-white border-[#E8DFD8] text-[#3A211E]'
                      }`}
                    >
                      <Italic className="w-4 h-4" />
                    </button>
                    <div className="h-6 w-px bg-[#E8DFD8] mx-1"></div>
                    <button
                      onClick={() =>
                        onUpdateLayer(selectedLayer.id, { align: 'left' })
                      }
                      className={`p-2 rounded-lg border ${
                        (selectedLayer as TextLayer).align === 'left'
                          ? 'bg-[#FFBF00] text-[#3A211E] border-[#FFBF00] font-bold'
                          : 'bg-white border-[#E8DFD8] text-[#3A211E]'
                      }`}
                    >
                      <AlignLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() =>
                        onUpdateLayer(selectedLayer.id, { align: 'center' })
                      }
                      className={`p-2 rounded-lg border ${
                        (selectedLayer as TextLayer).align === 'center'
                          ? 'bg-[#FFBF00] text-[#3A211E] border-[#FFBF00] font-bold'
                          : 'bg-white border-[#E8DFD8] text-[#3A211E]'
                      }`}
                    >
                      <AlignCenter className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() =>
                        onUpdateLayer(selectedLayer.id, { align: 'right' })
                      }
                      className={`p-2 rounded-lg border ${
                        (selectedLayer as TextLayer).align === 'right'
                          ? 'bg-[#FFBF00] text-[#3A211E] border-[#FFBF00] font-bold'
                          : 'bg-white border-[#E8DFD8] text-[#3A211E]'
                      }`}
                    >
                      <AlignRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Text Color */}
                <div>
                  <label className="text-xs font-bold text-[#3A211E] mb-2 block">
                    Màu chữ in:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      '#3A211E',
                      '#FFFFFF',
                      '#3A211E',
                      '#D97706',
                      '#DC2626',
                      '#2563EB',
                      '#059669',
                      '#DB2777',
                    ].map((col) => (
                      <button
                        key={col}
                        onClick={() =>
                          onUpdateLayer(selectedLayer.id, { color: col })
                        }
                        className={`w-7 h-7 rounded-full border-2 transition-transform ${
                          (selectedLayer as TextLayer).color === col
                            ? 'border-[#3A211E] scale-110'
                            : 'border-[#E8DFD8]'
                        }`}
                        style={{ backgroundColor: col }}
                      />
                    ))}
                    <input
                      type="color"
                      value={(selectedLayer as TextLayer).color}
                      onChange={(e) =>
                        onUpdateLayer(selectedLayer.id, { color: e.target.value })
                      }
                      className="w-7 h-7 rounded-full border border-[#E8DFD8] cursor-pointer overflow-hidden p-0"
                    />
                  </div>
                </div>

                {/* Size and Position Sliders */}
                <div className="space-y-3 pt-3 border-t border-[#E8DFD8]">
                  <div>
                    <div className="flex justify-between text-xs font-bold text-[#3A211E] mb-1">
                      <span>Cỡ chữ:</span>
                      <span>{(selectedLayer as TextLayer).fontSize} px</span>
                    </div>
                    <input
                      type="range"
                      min="24"
                      max="140"
                      value={(selectedLayer as TextLayer).fontSize}
                      onChange={(e) =>
                        onUpdateLayer(selectedLayer.id, {
                          fontSize: parseInt(e.target.value),
                        })
                      }
                      className="w-full accent-[#FFBF00]"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold text-[#3A211E] mb-1">
                      <span>Vị trí xoay quanh ly:</span>
                      <span>{Math.round((selectedLayer.x / CANVAS_WIDTH) * 360)}°</span>
                    </div>
                    <input
                      type="range"
                      min="200"
                      max="1848"
                      value={selectedLayer.x}
                      onChange={(e) =>
                        onUpdateLayer(selectedLayer.id, {
                          x: parseInt(e.target.value),
                        })
                      }
                      className="w-full accent-[#FFBF00]"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold text-[#3A211E] mb-1">
                      <span>Độ cao trên thân ly:</span>
                      <span>{Math.round(selectedLayer.y)} px</span>
                    </div>
                    <input
                      type="range"
                      min="180"
                      max="850"
                      value={selectedLayer.y}
                      onChange={(e) =>
                        onUpdateLayer(selectedLayer.id, {
                          y: parseInt(e.target.value),
                        })
                      }
                      className="w-full accent-[#FFBF00]"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold text-[#3A211E] mb-1">
                      <span>Góc nghiêng:</span>
                      <span>{selectedLayer.rotation}°</span>
                    </div>
                    <input
                      type="range"
                      min="-180"
                      max="180"
                      value={selectedLayer.rotation}
                      onChange={(e) =>
                        onUpdateLayer(selectedLayer.id, {
                          rotation: parseInt(e.target.value),
                        })
                      }
                      className="w-full accent-[#FFBF00]"
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() =>
                        onUpdateLayer(selectedLayer.id, {
                          x: CANVAS_WIDTH / 2,
                          y: CANVAS_HEIGHT / 2,
                          rotation: 0,
                        })
                      }
                      className="flex-1 py-2 px-3 bg-white border border-[#E8DFD8] text-[#3A211E] rounded-xl text-xs font-bold hover:bg-[#FFF9E8] transition-colors"
                    >
                      Căn Giữa Ly
                    </button>
                    <button
                      onClick={() => onDuplicateLayer(selectedLayer.id)}
                      className="p-2 bg-white border border-[#E8DFD8] text-[#3A211E] rounded-xl text-xs hover:bg-[#FFF9E8]"
                      title="Nhân bản chữ"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteLayer(selectedLayer.id)}
                      className="p-2 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs hover:bg-red-100"
                      title="Xóa chữ"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-[#765B52] border-2 border-dashed border-[#E8DFD8] rounded-2xl bg-[#FFF9E8]">
                <Type className="w-8 h-8 mx-auto mb-2 opacity-40 text-[#3A211E]" />
                <p className="text-xs font-bold text-[#3A211E]">Chưa chọn chữ nào</p>
                <p className="text-[11px] text-[#765B52] mt-1 mb-4">
                  Bấm "+ Thêm Chữ" để viết tên, câu chúc hoặc quote yêu thích.
                </p>
                <button
                  onClick={onAddTextLayer}
                  className="px-4 py-2 bg-[#3A211E] text-white rounded-xl text-xs font-bold hover:bg-[#3A211E] shadow-sm inline-block"
                >
                  + Thêm Chữ Mới
                </button>
              </div>
            )}
          </div>
        )}

        {/* ==================== TAB: TẢI ẢNH (UPLOAD TOOL - STRICT ASPECT RATIO) ==================== */}
        {activeTab === 'upload' && (
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-[#3A211E] text-base">Tải Ảnh / Logo Cá Nhân</h3>
              <p className="text-xs text-[#765B52] mt-1">
                Tự động giữ nguyên 100% tỷ lệ gốc (Aspect Ratio). Không bao giờ bị méo hình.
              </p>
            </div>

            <input
              type="file"
              accept="image/png,image/jpeg,image/jpg"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileUpload}
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-8 border-2 border-dashed border-[#E8DFD8] rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-[#3A211E] hover:bg-[#FFF9E8] transition-all"
            >
              <Upload className="w-8 h-8 text-[#765B52]" />
              <span className="font-bold text-xs text-[#3A211E]">Click hoặc kéo thả ảnh vào đây</span>
              <span className="text-[10px] text-[#765B52]">Hỗ trợ JPG, PNG (khuyên dùng PNG trong suốt)</span>
            </button>

            {selectedLayer && (selectedLayer.type === 'image' || selectedLayer.type === 'sticker') ? (
              <div className="space-y-4 bg-[#FFF9E8] p-4 rounded-2xl border border-[#E8DFD8]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#3A211E]">Thông tin ảnh:</span>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                    Khóa tỷ lệ chuẩn 100%
                  </span>
                </div>

                <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-[#E8DFD8]">
                  <img
                    src={(selectedLayer as ImageLayer).url}
                    alt="Preview"
                    className="w-14 h-14 object-contain rounded-lg border border-[#E8DFD8] bg-neutral-100"
                  />
                  <div className="text-xs">
                    <div className="font-bold text-[#3A211E] line-clamp-1">{selectedLayer.name}</div>
                    <div className="text-[11px] text-[#765B52]">
                      Kích thước gốc: {(selectedLayer as ImageLayer).naturalWidth} ×{' '}
                      {(selectedLayer as ImageLayer).naturalHeight} px
                    </div>
                    <div className="text-[11px] text-[#059669] font-bold">
                      Tỷ lệ: {((selectedLayer as ImageLayer).aspectRatio).toFixed(2)}:1
                    </div>
                  </div>
                </div>

                {/* Image Size and Controls with LOCKED ASPECT RATIO */}
                <div className="space-y-3 pt-2">
                  <div>
                    <div className="flex justify-between text-xs font-bold text-[#3A211E] mb-1">
                      <span>Thu phóng (Khóa tỷ lệ):</span>
                      <span>{Math.round((selectedLayer as ImageLayer).width * selectedLayer.scale)} px</span>
                    </div>
                    <input
                      type="range"
                      min="0.3"
                      max="3.0"
                      step="0.05"
                      value={selectedLayer.scale}
                      onChange={(e) =>
                        onUpdateLayer(selectedLayer.id, {
                          scale: parseFloat(e.target.value),
                        })
                      }
                      className="w-full accent-[#FFBF00]"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold text-[#3A211E] mb-1">
                      <span>Vị trí xoay quanh ly:</span>
                      <span>{Math.round((selectedLayer.x / CANVAS_WIDTH) * 360)}°</span>
                    </div>
                    <input
                      type="range"
                      min="200"
                      max="1848"
                      value={selectedLayer.x}
                      onChange={(e) =>
                        onUpdateLayer(selectedLayer.id, {
                          x: parseInt(e.target.value),
                        })
                      }
                      className="w-full accent-[#FFBF00]"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold text-[#3A211E] mb-1">
                      <span>Độ cao trên thân ly:</span>
                      <span>{Math.round(selectedLayer.y)} px</span>
                    </div>
                    <input
                      type="range"
                      min="180"
                      max="850"
                      value={selectedLayer.y}
                      onChange={(e) =>
                        onUpdateLayer(selectedLayer.id, {
                          y: parseInt(e.target.value),
                        })
                      }
                      className="w-full accent-[#FFBF00]"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold text-[#3A211E] mb-1">
                      <span>Góc xoay:</span>
                      <span>{selectedLayer.rotation}°</span>
                    </div>
                    <input
                      type="range"
                      min="-180"
                      max="180"
                      value={selectedLayer.rotation}
                      onChange={(e) =>
                        onUpdateLayer(selectedLayer.id, {
                          rotation: parseInt(e.target.value),
                        })
                      }
                      className="w-full accent-[#FFBF00]"
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() =>
                        onUpdateLayer(selectedLayer.id, {
                          x: CANVAS_WIDTH / 2,
                          y: CANVAS_HEIGHT / 2,
                          rotation: 0,
                        })
                      }
                      className="flex-1 py-2 px-3 bg-white border border-[#E8DFD8] text-[#3A211E] rounded-xl text-xs font-bold hover:bg-[#FFF9E8]"
                    >
                      Căn Giữa Ly
                    </button>
                    <button
                      onClick={() => onDuplicateLayer(selectedLayer.id)}
                      className="p-2 bg-white border border-[#E8DFD8] text-[#3A211E] rounded-xl text-xs hover:bg-[#FFF9E8]"
                      title="Nhân bản ảnh"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteLayer(selectedLayer.id)}
                      className="p-2 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs hover:bg-red-100"
                      title="Xóa ảnh"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        )}

        {/* ==================== TAB: STICKER ==================== */}
        {activeTab === 'stickers' && (
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-[#3A211E] text-base">Họa Tiết & Sticker</h3>
              <p className="text-xs text-[#765B52] mt-0.5">
                Sticker dễ thương chuẩn in UV sắc nét.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {PRESET_STICKERS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => onAddStickerLayer(s.url, s.name)}
                  className="aspect-square p-4 rounded-2xl border border-[#E8DFD8] bg-[#FFF9E8] hover:bg-white hover:border-[#3A211E] transition-all flex flex-col items-center justify-center gap-2 group"
                >
                  <img
                    src={s.url}
                    alt={s.name}
                    className="w-12 h-12 object-contain group-hover:scale-110 transition-transform"
                  />
                  <span className="text-[11px] font-bold text-[#765B52] group-hover:text-[#3A211E]">
                    {s.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ==================== TAB: QUẢN LÝ LAYER ==================== */}
        {activeTab === 'layers' && (
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-[#3A211E] text-base">Quản Lý Các Lớp In (Layers)</h3>
              <p className="text-xs text-[#765B52] mt-1">
                Sắp xếp thứ tự trước sau, khóa vị trí hoặc ẩn layer khi cần.
              </p>
            </div>

            {layers.length === 0 ? (
              <div className="p-8 text-center text-[#765B52] border border-[#E8DFD8] rounded-2xl bg-[#FFF9E8]">
                <Layers className="w-8 h-8 mx-auto mb-2 opacity-30 text-[#3A211E]" />
                <span className="text-xs font-bold text-[#3A211E]">Chưa có layer nào</span>
                <p className="text-[11px] text-[#765B52] mt-1">
                  Hãy thêm chữ, tải ảnh hoặc chọn sticker để bắt đầu.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {[...layers].reverse().map((layer) => {
                  const isSelected = selectedLayerId === layer.id;
                  return (
                    <div
                      key={layer.id}
                      onClick={() => setSelectedLayerId(layer.id)}
                      className={`p-3 rounded-2xl border-2 transition-all flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'border-[#3A211E] bg-[#FFF9E8] shadow-sm'
                          : 'border-[#E8DFD8] bg-white hover:border-[#3A211E]/50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        {layer.type === 'text' ? (
                          <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-xs">
                            T
                          </div>
                        ) : (
                          <img
                            src={(layer as ImageLayer).url}
                            alt=""
                            className="w-8 h-8 rounded-lg object-contain bg-neutral-100 border border-[#E8DFD8]"
                          />
                        )}
                        <div>
                          <div className="font-bold text-xs text-[#3A211E] line-clamp-1">
                            {layer.type === 'text'
                              ? `"${(layer as TextLayer).text.slice(0, 16)}"`
                              : layer.name}
                          </div>
                          <div className="text-[10px] text-[#765B52]">
                            {layer.type === 'text' ? 'Chữ in' : 'Hình ảnh'}
                          </div>
                        </div>
                      </div>

                      <div
                        className="flex items-center gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => onMoveLayerOrder(layer.id, 'up')}
                          className="p-1.5 hover:bg-[#EDECEA] text-[#765B52] rounded-lg"
                          title="Lên trên"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onMoveLayerOrder(layer.id, 'down')}
                          className="p-1.5 hover:bg-[#EDECEA] text-[#765B52] rounded-lg"
                          title="Xuống dưới"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() =>
                            onUpdateLayer(layer.id, { visible: !layer.visible })
                          }
                          className="p-1.5 hover:bg-[#EDECEA] text-[#765B52] rounded-lg"
                          title={layer.visible ? 'Ẩn layer' : 'Hiện layer'}
                        >
                          {layer.visible ? (
                            <Eye className="w-3.5 h-3.5" />
                          ) : (
                            <EyeOff className="w-3.5 h-3.5 text-red-500" />
                          )}
                        </button>
                        <button
                          onClick={() =>
                            onUpdateLayer(layer.id, { locked: !layer.locked })
                          }
                          className="p-1.5 hover:bg-[#EDECEA] text-[#765B52] rounded-lg"
                          title={layer.locked ? 'Mở khóa' : 'Khóa'}
                        >
                          {layer.locked ? (
                            <Lock className="w-3.5 h-3.5 text-amber-600" />
                          ) : (
                            <Unlock className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <button
                          onClick={() => onDeleteLayer(layer.id)}
                          className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg"
                          title="Xóa layer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ==================== TAB: PHỤ KIỆN & BÁO GIÁ ==================== */}
        {activeTab === 'pricing' && (
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-[#3A211E] text-base">Phụ Kiện & Báo Giá</h3>
              <p className="text-xs text-[#765B52] mt-1">
                Tự động tính chi phí thiết kế và chọn thêm phụ kiện quà tặng.
              </p>
            </div>

            {/* Phụ kiện mua kèm */}
            <div className="space-y-3">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#765B52] block">
                Phụ kiện đóng gói
              </span>
              <div className="space-y-2.5">
                {addons.map((addon) => (
                  <div
                    key={addon.id}
                    className={`p-3.5 rounded-2xl border transition-all ${
                      addon.selected
                        ? 'bg-[#FFF9E8] border-[#FFBF00] shadow-xs'
                        : 'bg-white border-[#E8DFD8]'
                    }`}
                  >
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={addon.selected}
                        onChange={() => onToggleAddon && onToggleAddon(addon.id)}
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

                    {addon.id === 'card' && addon.selected && onUpdateAddonNote && (
                      <div className="mt-2.5 pt-2 border-t border-[#E8DFD8]">
                        <label className="text-[10px] font-bold text-[#3A211E] block mb-1">
                          Lời nhắn thiệp:
                        </label>
                        <textarea
                          rows={2}
                          value={addon.note || ''}
                          onChange={(e) => onUpdateAddonNote(addon.id, e.target.value)}
                          placeholder="Nhập lời chúc muốn gửi..."
                          className="w-full p-2 bg-white border border-[#E8DFD8] rounded-xl text-xs text-[#3A211E]"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Tóm tắt chi phí */}
            {pricing && (
              <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E8DFD8] space-y-2 text-xs">
                <span className="text-[11px] font-black uppercase tracking-wider text-[#765B52] block mb-1">
                  Chi tiết giá
                </span>
                <div className="flex justify-between text-[#765B52]">
                  <span>Ly phôi ({pricing.modelName}):</span>
                  <span className="font-bold text-[#3A211E]">{formatVND(pricing.baseCupPrice)}</span>
                </div>
                {pricing.hasText && (
                  <div className="flex justify-between text-[#765B52]">
                    <span>Phí in chữ ({pricing.textCount} chữ):</span>
                    <span className="font-bold text-[#3A211E]">+{formatVND(pricing.textFee)}</span>
                  </div>
                )}
                {pricing.hasImage && (
                  <div className="flex justify-between text-[#765B52]">
                    <span>Phí in ảnh ({pricing.imageCount} ảnh):</span>
                    <span className="font-bold text-[#3A211E]">+{formatVND(pricing.imageFee)}</span>
                  </div>
                )}
                {pricing.hasSticker && (
                  <div className="flex justify-between text-[#765B52]">
                    <span>Sticker trang trí:</span>
                    <span className="font-bold text-[#3A211E]">
                      {pricing.hasText ? 'Miễn phí (0₫)' : `+${formatVND(pricing.stickerFee)}`}
                    </span>
                  </div>
                )}
                {pricing.selectedAddons.map((ad) => (
                  <div key={ad.id} className="flex justify-between text-[#765B52]">
                    <span>{ad.name}:</span>
                    <span className="font-bold text-[#3A211E]">+{formatVND(ad.price)}</span>
                  </div>
                ))}
                <div className="pt-2 border-t border-[#E8DFD8] flex items-center justify-between">
                  <span className="font-extrabold text-sm text-[#3A211E]">TỔNG GIÁ:</span>
                  <span className="font-black text-lg text-[#3A211E]">
                    {formatVND(pricing.totalPrice)}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
