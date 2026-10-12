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
  Info
} from 'lucide-react';
import {
  DesignLayer,
  TextLayer,
  ImageLayer,
  CupModelDef,
  CupColorOption
} from './types';
import { CUP_MODELS, CUP_COLOR_OPTIONS, LID_COLOR_OPTIONS, PRESET_STICKERS } from './cupDefinitions';
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
      <div className="w-20 bg-white border-r border-[#E8E3DF] flex flex-col items-center py-6 gap-3 z-10 shrink-0 shadow-[4px_0_12px_rgba(0,0,0,0.02)]">
        <button
          onClick={() => setActiveTab('models')}
          className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl w-16 transition-all ${
            activeTab === 'models'
              ? 'bg-[#3E2925] text-white shadow-md'
              : 'text-[#6F625E] hover:text-[#201817] hover:bg-[#F7F6F2]'
          }`}
        >
          <Box className="w-5 h-5" />
          <span className="text-[10px] font-bold text-center leading-tight">Mẫu ly</span>
        </button>

        <button
          onClick={() => setActiveTab('colors')}
          className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl w-16 transition-all ${
            activeTab === 'colors'
              ? 'bg-[#3E2925] text-white shadow-md'
              : 'text-[#6F625E] hover:text-[#201817] hover:bg-[#F7F6F2]'
          }`}
        >
          <div
            className="w-5 h-5 rounded-full border-2 border-current"
            style={{ backgroundColor: selectedColor.color }}
          ></div>
          <span className="text-[10px] font-bold">Màu ly</span>
        </button>

        <button
          onClick={() => setActiveTab('text')}
          className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl w-16 transition-all ${
            activeTab === 'text'
              ? 'bg-[#3E2925] text-white shadow-md'
              : 'text-[#6F625E] hover:text-[#201817] hover:bg-[#F7F6F2]'
          }`}
        >
          <Type className="w-5 h-5" />
          <span className="text-[10px] font-bold">Chữ</span>
        </button>

        <button
          onClick={() => setActiveTab('upload')}
          className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl w-16 transition-all ${
            activeTab === 'upload'
              ? 'bg-[#3E2925] text-white shadow-md'
              : 'text-[#6F625E] hover:text-[#201817] hover:bg-[#F7F6F2]'
          }`}
        >
          <Upload className="w-5 h-5" />
          <span className="text-[10px] font-bold">Tải ảnh</span>
        </button>

        <button
          onClick={() => setActiveTab('stickers')}
          className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl w-16 transition-all ${
            activeTab === 'stickers'
              ? 'bg-[#3E2925] text-white shadow-md'
              : 'text-[#6F625E] hover:text-[#201817] hover:bg-[#F7F6F2]'
          }`}
        >
          <Smile className="w-5 h-5" />
          <span className="text-[10px] font-bold">Sticker</span>
        </button>

        <div className="w-8 h-px bg-[#E8E3DF] my-1"></div>

        <button
          onClick={() => setActiveTab('layers')}
          className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl w-16 transition-all relative ${
            activeTab === 'layers'
              ? 'bg-[#3E2925] text-white shadow-md'
              : 'text-[#6F625E] hover:text-[#201817] hover:bg-[#F7F6F2]'
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
      </div>

      {/* 2. Flyout Properties Drawer Panel */}
      <div className="w-80 md:w-96 bg-white border-r border-[#E8E3DF] p-6 flex flex-col gap-6 z-10 overflow-y-auto shadow-[4px_0_12px_rgba(0,0,0,0.02)]">
        {/* ==================== TAB: MẪU LY ==================== */}
        {activeTab === 'models' && (
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-[#201817] text-base">Chọn Mẫu Ly Thực Tế</h3>
              <p className="text-xs text-[#6F625E] mt-1">
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
                        ? 'border-[#3E2925] bg-[#FAF9F6] shadow-sm'
                        : 'border-[#E8E3DF] hover:border-[#3E2925]/60 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-[#201817] flex items-center gap-1.5">
                        {m.name}
                        {isSelected && <Check className="w-4 h-4 text-[#059669]" />}
                      </span>
                      <span className="font-black text-sm text-[#4A2A25]">
                        {formatVND(m.defaultPrice)}
                      </span>
                    </div>

                    <p className="text-xs text-[#6F625E]">{m.subtitle}</p>

                    <div className="flex items-center gap-2 pt-1 border-t border-[#E8E3DF]/60 text-[11px] text-[#6F625E]">
                      <span className="bg-white px-2 py-0.5 rounded-md border border-[#E8E3DF] font-bold">
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

            <div className="bg-[#FAF9F6] p-3.5 rounded-2xl border border-[#E8E3DF] flex items-start gap-2 text-xs text-[#6F625E]">
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
              <h3 className="font-bold text-[#201817] text-base">Vật Liệu & Màu Thân Ly</h3>
              <p className="text-xs text-[#6F625E] mt-1">
                Chất liệu thủy tinh cao cấp (MeshPhysicalMaterial) khúc xạ ánh sáng chân thực.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {CUP_COLOR_OPTIONS.map((c) => {
                const isSelected = selectedColor.id === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedColor(c)}
                    className={`p-3 rounded-xl border-2 flex items-center gap-2.5 transition-all text-left ${
                      isSelected
                        ? 'border-[#3E2925] bg-[#FAF9F6]'
                        : 'border-[#E8E3DF] hover:border-[#3E2925]/50'
                    }`}
                  >
                    <span
                      className="w-6 h-6 rounded-full border border-black/10 shrink-0 shadow-inner"
                      style={{ backgroundColor: c.color }}
                    ></span>
                    <span className="text-xs font-bold text-[#201817] line-clamp-1 leading-tight">
                      {c.name}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Lid Color for Boba Cup */}
            {selectedModel.id === 'plastic_boba' && (
              <div className="border-t border-[#E8E3DF] pt-6 space-y-3">
                <h4 className="font-bold text-[#201817] text-sm">Màu Nắp Ly Nhựa</h4>
                <div className="flex flex-wrap gap-2.5">
                  {LID_COLOR_OPTIONS.map((l) => (
                    <button
                      key={l.id}
                      onClick={() => setLidColor(l.color)}
                      title={l.name}
                      className={`w-9 h-9 rounded-full border-2 transition-all ${
                        lidColor === l.color ? 'border-[#3E2925] scale-110' : 'border-[#E8E3DF]'
                      }`}
                      style={{ backgroundColor: l.color }}
                    />
                  ))}
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
                <h3 className="font-bold text-[#201817] text-base">Dán Chữ Cong Lên Thân Ly</h3>
                <p className="text-xs text-[#6F625E]">Chữ uốn cong tự nhiên theo độ cong của ly.</p>
              </div>
              <button
                onClick={onAddTextLayer}
                className="px-3.5 py-2 bg-[#3E2925] text-white rounded-xl text-xs font-bold hover:bg-[#201817] shadow-sm flex items-center gap-1.5 transition-all"
              >
                + Thêm Chữ
              </button>
            </div>

            {selectedLayer && selectedLayer.type === 'text' ? (
              <div className="space-y-5 bg-[#FAF9F6] p-4 rounded-2xl border border-[#E8E3DF]">
                <div>
                  <label className="text-xs font-bold text-[#201817] mb-1.5 block">
                    Nội dung in (Hỗ trợ nhiều dòng & dấu tiếng Việt):
                  </label>
                  <textarea
                    value={(selectedLayer as TextLayer).text}
                    onChange={(e) =>
                      onUpdateLayer(selectedLayer.id, { text: e.target.value })
                    }
                    placeholder="Nhập tên hoặc câu quote tiếng Việt..."
                    className="w-full p-3 bg-white border border-[#E8E3DF] rounded-xl text-sm focus:outline-none focus:border-[#3E2925] resize-none h-20 shadow-sm"
                  />
                </div>

                {/* Font Category and Search */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-[#201817]">
                      Thư viện Font Tiếng Việt (22 font):
                    </label>
                  </div>

                  <div className="relative mb-2">
                    <Search className="w-3.5 h-3.5 text-[#6F625E] absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Tìm font chữ..."
                      value={fontSearch}
                      onChange={(e) => setFontSearch(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 bg-white border border-[#E8E3DF] rounded-lg text-xs focus:outline-none focus:border-[#3E2925]"
                    />
                  </div>

                  <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-none">
                    {FONT_CATEGORIES.map((cat) => (
                      <button
                        key={cat.key}
                        onClick={() => setFontCategory(cat.key)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-colors ${
                          fontCategory === cat.key
                            ? 'bg-[#3E2925] text-white'
                            : 'bg-white border border-[#E8E3DF] text-[#6F625E] hover:text-[#201817]'
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
                              ? 'border-[#3E2925] bg-white shadow-sm ring-1 ring-[#3E2925]'
                              : 'border-[#E8E3DF] bg-white hover:border-[#3E2925]/60'
                          }`}
                        >
                          <div>
                            <span className="font-bold text-xs text-[#201817] block">
                              {f.name}
                            </span>
                            <span
                              className="text-xs text-[#4A2A25] line-clamp-1 mt-0.5"
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
                  <label className="text-xs font-bold text-[#201817] mb-2 block">
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
                          ? 'bg-[#3E2925] text-white border-[#3E2925]'
                          : 'bg-white border-[#E8E3DF] text-[#201817]'
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
                          ? 'bg-[#3E2925] text-white border-[#3E2925]'
                          : 'bg-white border-[#E8E3DF] text-[#201817]'
                      }`}
                    >
                      <Italic className="w-4 h-4" />
                    </button>
                    <div className="h-6 w-px bg-[#E8E3DF] mx-1"></div>
                    <button
                      onClick={() =>
                        onUpdateLayer(selectedLayer.id, { align: 'left' })
                      }
                      className={`p-2 rounded-lg border ${
                        (selectedLayer as TextLayer).align === 'left'
                          ? 'bg-[#3E2925] text-white border-[#3E2925]'
                          : 'bg-white border-[#E8E3DF] text-[#201817]'
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
                          ? 'bg-[#3E2925] text-white border-[#3E2925]'
                          : 'bg-white border-[#E8E3DF] text-[#201817]'
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
                          ? 'bg-[#3E2925] text-white border-[#3E2925]'
                          : 'bg-white border-[#E8E3DF] text-[#201817]'
                      }`}
                    >
                      <AlignRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Text Color */}
                <div>
                  <label className="text-xs font-bold text-[#201817] mb-2 block">
                    Màu chữ in:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      '#201817',
                      '#FFFFFF',
                      '#4A2A25',
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
                            ? 'border-[#3E2925] scale-110'
                            : 'border-[#E8E3DF]'
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
                      className="w-7 h-7 rounded-full border border-[#E8E3DF] cursor-pointer overflow-hidden p-0"
                    />
                  </div>
                </div>

                {/* Size and Position Sliders */}
                <div className="space-y-3 pt-3 border-t border-[#E8E3DF]">
                  <div>
                    <div className="flex justify-between text-xs font-bold text-[#201817] mb-1">
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
                      className="w-full accent-[#3E2925]"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold text-[#201817] mb-1">
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
                      className="w-full accent-[#3E2925]"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold text-[#201817] mb-1">
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
                      className="w-full accent-[#3E2925]"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold text-[#201817] mb-1">
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
                      className="w-full accent-[#3E2925]"
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
                      className="flex-1 py-2 px-3 bg-white border border-[#E8E3DF] text-[#201817] rounded-xl text-xs font-bold hover:bg-[#FAF9F6] transition-colors"
                    >
                      Căn Giữa Ly
                    </button>
                    <button
                      onClick={() => onDuplicateLayer(selectedLayer.id)}
                      className="p-2 bg-white border border-[#E8E3DF] text-[#201817] rounded-xl text-xs hover:bg-[#FAF9F6]"
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
              <div className="p-8 text-center text-[#6F625E] border-2 border-dashed border-[#E8E3DF] rounded-2xl bg-[#FAF9F6]">
                <Type className="w-8 h-8 mx-auto mb-2 opacity-40 text-[#3E2925]" />
                <p className="text-xs font-bold text-[#201817]">Chưa chọn chữ nào</p>
                <p className="text-[11px] text-[#6F625E] mt-1 mb-4">
                  Bấm "+ Thêm Chữ" để viết tên, câu chúc hoặc quote yêu thích.
                </p>
                <button
                  onClick={onAddTextLayer}
                  className="px-4 py-2 bg-[#3E2925] text-white rounded-xl text-xs font-bold hover:bg-[#201817] shadow-sm inline-block"
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
              <h3 className="font-bold text-[#201817] text-base">Tải Ảnh / Logo Cá Nhân</h3>
              <p className="text-xs text-[#6F625E] mt-1">
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
              className="w-full py-8 border-2 border-dashed border-[#E8E3DF] rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-[#3E2925] hover:bg-[#FAF9F6] transition-all"
            >
              <Upload className="w-8 h-8 text-[#6F625E]" />
              <span className="font-bold text-xs text-[#201817]">Click hoặc kéo thả ảnh vào đây</span>
              <span className="text-[10px] text-[#6F625E]">Hỗ trợ JPG, PNG (khuyên dùng PNG trong suốt)</span>
            </button>

            {selectedLayer && (selectedLayer.type === 'image' || selectedLayer.type === 'sticker') ? (
              <div className="space-y-4 bg-[#FAF9F6] p-4 rounded-2xl border border-[#E8E3DF]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#201817]">Thông tin ảnh:</span>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                    Khóa tỷ lệ chuẩn 100%
                  </span>
                </div>

                <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-[#E8E3DF]">
                  <img
                    src={(selectedLayer as ImageLayer).url}
                    alt="Preview"
                    className="w-14 h-14 object-contain rounded-lg border border-[#E8E3DF] bg-neutral-100"
                  />
                  <div className="text-xs">
                    <div className="font-bold text-[#201817] line-clamp-1">{selectedLayer.name}</div>
                    <div className="text-[11px] text-[#6F625E]">
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
                    <div className="flex justify-between text-xs font-bold text-[#201817] mb-1">
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
                      className="w-full accent-[#3E2925]"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold text-[#201817] mb-1">
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
                      className="w-full accent-[#3E2925]"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold text-[#201817] mb-1">
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
                      className="w-full accent-[#3E2925]"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold text-[#201817] mb-1">
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
                      className="w-full accent-[#3E2925]"
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
                      className="flex-1 py-2 px-3 bg-white border border-[#E8E3DF] text-[#201817] rounded-xl text-xs font-bold hover:bg-[#FAF9F6]"
                    >
                      Căn Giữa Ly
                    </button>
                    <button
                      onClick={() => onDuplicateLayer(selectedLayer.id)}
                      className="p-2 bg-white border border-[#E8E3DF] text-[#201817] rounded-xl text-xs hover:bg-[#FAF9F6]"
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
              <h3 className="font-bold text-[#201817] text-base">Họa Tiết & Sticker Độc Quyền</h3>
              <p className="text-xs text-[#6F625E] mt-1">
                Các mẫu sticker dễ thương và nghệ thuật chuẩn chất lượng cao.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {PRESET_STICKERS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => onAddStickerLayer(s.url, s.name)}
                  className="aspect-square p-4 rounded-2xl border border-[#E8E3DF] bg-[#FAF9F6] hover:bg-white hover:border-[#3E2925] transition-all flex flex-col items-center justify-center gap-2 group"
                >
                  <img
                    src={s.url}
                    alt={s.name}
                    className="w-12 h-12 object-contain group-hover:scale-110 transition-transform"
                  />
                  <span className="text-[11px] font-bold text-[#6F625E] group-hover:text-[#201817]">
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
              <h3 className="font-bold text-[#201817] text-base">Quản Lý Các Lớp In (Layers)</h3>
              <p className="text-xs text-[#6F625E] mt-1">
                Sắp xếp thứ tự trước sau, khóa vị trí hoặc ẩn layer khi cần.
              </p>
            </div>

            {layers.length === 0 ? (
              <div className="p-8 text-center text-[#6F625E] border border-[#E8E3DF] rounded-2xl bg-[#FAF9F6]">
                <Layers className="w-8 h-8 mx-auto mb-2 opacity-30 text-[#3E2925]" />
                <span className="text-xs font-bold text-[#201817]">Chưa có layer nào</span>
                <p className="text-[11px] text-[#6F625E] mt-1">
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
                          ? 'border-[#3E2925] bg-[#FAF9F6] shadow-sm'
                          : 'border-[#E8E3DF] bg-white hover:border-[#3E2925]/50'
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
                            className="w-8 h-8 rounded-lg object-contain bg-neutral-100 border border-[#E8E3DF]"
                          />
                        )}
                        <div>
                          <div className="font-bold text-xs text-[#201817] line-clamp-1">
                            {layer.type === 'text'
                              ? `"${(layer as TextLayer).text.slice(0, 16)}"`
                              : layer.name}
                          </div>
                          <div className="text-[10px] text-[#6F625E]">
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
                          className="p-1.5 hover:bg-[#EDECEA] text-[#6F625E] rounded-lg"
                          title="Lên trên"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onMoveLayerOrder(layer.id, 'down')}
                          className="p-1.5 hover:bg-[#EDECEA] text-[#6F625E] rounded-lg"
                          title="Xuống dưới"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() =>
                            onUpdateLayer(layer.id, { visible: !layer.visible })
                          }
                          className="p-1.5 hover:bg-[#EDECEA] text-[#6F625E] rounded-lg"
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
                          className="p-1.5 hover:bg-[#EDECEA] text-[#6F625E] rounded-lg"
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
      </div>
    </div>
  );
}
