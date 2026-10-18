'use client';

import React, { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  X, Eye, RotateCw, ZoomIn, ZoomOut, Download, ExternalLink, 
  Layers, Type, Palette, Sparkles, CheckCircle2, AlertCircle, ShieldCheck
} from 'lucide-react';
import { CUP_MODELS, CUP_COLOR_OPTIONS, CLEAR_GLASS_COLOR } from './cupDefinitions';
import { useCanvasTexture } from './useCanvasTexture';
import { CupModelDef, CupColorOption, DesignLayer, TextLayer, ImageLayer } from './types';

// Dynamic import StudioScene to avoid SSR canvas hydration mismatch
const StudioScene = dynamic(
  () => import('./StudioScene').then((mod) => mod.StudioScene),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex flex-col items-center justify-center bg-[#FAF9F6] text-[#3A211E]">
        <div className="w-8 h-8 border-3 border-[#3A211E] border-t-transparent rounded-full animate-spin mb-3" />
        <span className="text-xs font-medium">Đang tải không gian 3D...</span>
      </div>
    )
  }
);

interface CustomCupViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: any;
  mode?: 'customer' | 'admin';
}

export default function CustomCupViewerModal({
  isOpen,
  onClose,
  item,
  mode = 'customer',
}: CustomCupViewerModalProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'3d' | 'preview' | 'printsheet'>('3d');
  const [isAutoRotating, setIsAutoRotating] = useState(true);

  // Extract customSpecs safely from technical_specs or description
  const specs = useMemo(() => {
    if (!item) return null;
    const prod = item.products || item;
    let s = prod?.technical_specs;
    if (!s || Object.keys(s).length === 0) {
      try {
        if (typeof prod?.description === 'string' && prod.description.startsWith('{')) {
          s = JSON.parse(prod.description);
        }
      } catch (e) {}
    }
    return s || null;
  }, [item]);

  // Model definition
  const modelDef: CupModelDef = useMemo(() => {
    if (specs?.modelType) {
      const found = CUP_MODELS.find((m) => m.id === specs.modelType);
      if (found) return found;
    }
    return CUP_MODELS[0];
  }, [specs]);

  // Color definition
  const selectedColor: CupColorOption = useMemo(() => {
    if (modelDef.category === 'glass') {
      return CLEAR_GLASS_COLOR;
    }
    if (specs?.cupColor) {
      const found = CUP_COLOR_OPTIONS.find((c) => c.color === specs.cupColor);
      if (found) return found;
      return {
        id: 'custom',
        name: specs.cupColorName || 'Tùy chỉnh',
        color: specs.cupColor,
        glassTint: specs.glassTint || false,
      };
    }
    return CUP_COLOR_OPTIONS[0];
  }, [specs, modelDef]);

  const lidColor = specs?.lidColor || '#FFF3A6';
  const layers: DesignLayer[] = useMemo(() => specs?.layers || [], [specs]);

  // Render texture using canvas engine
  const { texture } = useCanvasTexture(layers, false);

  if (!isOpen || !item) return null;

  const prod = item.products || item;
  const previewImage = specs?.previewImage || prod?.image_url;
  const printSheetUrl = specs?.printableTexture;

  const textLayers = layers.filter((l) => l.type === 'text') as TextLayer[];
  const imageLayers = layers.filter((l) => l.type === 'image' || l.type === 'sticker') as ImageLayer[];

  const handleRedesign = () => {
    if (typeof window !== 'undefined' && specs) {
      try {
        const draft = {
          modelId: specs.modelType || modelDef.id,
          colorId: selectedColor.id,
          lidColor: specs.lidColor || lidColor,
          layers: specs.layers || [],
        };
        localStorage.setItem('cupfy-studio-draft-v2', JSON.stringify(draft));
        router.push('/custom-cup');
      } catch (e) {
        console.error('Lỗi khi lưu bản thiết kế vào studio:', e);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-[28px] border border-[#DDD8D2] shadow-2xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-[#DDD8D2] flex items-center justify-between bg-[#F7F6F2] shrink-0">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-white border border-[#DDD8D2] text-[#3A211E] shadow-xs">
              <Sparkles className="w-5 h-5 text-amber-600" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading text-lg font-bold text-[#3A211E]">
                  {prod?.name || 'Chiếc Ly Cá Nhân Hóa'}
                </h3>
                <span className="bg-[#BFDCEF]/60 text-[#3A211E] px-2.5 py-0.5 rounded-full text-[11px] font-bold border border-[#BFDCEF]">
                  Thiết kế riêng
                </span>
              </div>
              <p className="text-xs text-[#6F625E]">
                Mẫu ly: <strong>{specs?.modelName || modelDef.name}</strong> • Dung tích: <strong>{specs?.capacity || modelDef.capacity || 'Tiêu chuẩn'}</strong>
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#EDECEA] text-[#6F625E] hover:text-[#3A211E] transition-colors"
            title="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Main Content: 2-column layout */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#DDD8D2]">
          
          {/* Left Column: Interactive 3D / Viewport (7 cols) */}
          <div className="lg:col-span-7 flex flex-col bg-[#FAF9F6] p-4 sm:p-6">
            
            {/* View Mode Switcher */}
            <div className="flex items-center justify-between mb-3 shrink-0">
              <div className="flex items-center gap-1.5 p-1 bg-white rounded-full border border-[#DDD8D2] shadow-xs">
                <button
                  onClick={() => setActiveTab('3d')}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                    activeTab === '3d'
                      ? 'bg-[#3A211E] text-white shadow-xs'
                      : 'text-[#6F625E] hover:text-[#3A211E]'
                  }`}
                >
                  Mô hình 3D xoay 360°
                </button>
                <button
                  onClick={() => setActiveTab('preview')}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                    activeTab === 'preview'
                      ? 'bg-[#3A211E] text-white shadow-xs'
                      : 'text-[#6F625E] hover:text-[#3A211E]'
                  }`}
                >
                  Ảnh thực tế (Snapshot)
                </button>
                {printSheetUrl && (
                  <button
                    onClick={() => setActiveTab('printsheet')}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                      activeTab === 'printsheet'
                        ? 'bg-[#3A211E] text-white shadow-xs'
                        : 'text-[#6F625E] hover:text-[#3A211E]'
                    }`}
                  >
                    Bản in phẳng (2D)
                  </button>
                )}
              </div>

              {activeTab === '3d' && (
                <button
                  onClick={() => setIsAutoRotating(!isAutoRotating)}
                  className={`p-2 rounded-full border text-xs font-bold flex items-center gap-1 transition-colors ${
                    isAutoRotating
                      ? 'bg-amber-100 border-amber-300 text-amber-800'
                      : 'bg-white border-[#DDD8D2] text-[#6F625E] hover:text-[#3A211E]'
                  }`}
                  title="Bật/Tắt tự động xoay"
                >
                  <RotateCw className={`w-3.5 h-3.5 ${isAutoRotating ? 'animate-spin' : ''}`} />
                </button>
              )}
            </div>

            {/* Viewport Display Area */}
            <div className="relative flex-1 min-h-[380px] sm:min-h-[460px] rounded-2xl bg-white border border-[#DDD8D2] overflow-hidden shadow-inner flex items-center justify-center">
              {activeTab === '3d' ? (
                <div className="w-full h-full relative">
                  <StudioScene
                    modelDef={modelDef}
                    selectedColor={selectedColor}
                    lidColor={lidColor}
                    canvasTexture={texture}
                    viewMode="studio"
                    showSafeZone={false}
                    isAutoRotating={isAutoRotating}
                    setIsAutoRotating={setIsAutoRotating}
                  />
                  <div className="absolute bottom-3 left-3 bg-black/40 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-medium pointer-events-none">
                    Kéo chuột để xoay 360° • Cuộn chuột để phóng to/thu nhỏ
                  </div>
                </div>
              ) : activeTab === 'preview' ? (
                <div className="relative w-full h-full p-4 flex items-center justify-center bg-[#F7F6F2]">
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="Ảnh thực tế chiếc ly"
                      className="max-h-[420px] w-auto object-contain rounded-xl shadow-md border border-[#DDD8D2]"
                    />
                  ) : (
                    <div className="text-center text-[#6F625E] text-xs">
                      Không có ảnh xem trước
                    </div>
                  )}
                </div>
              ) : (
                <div className="relative w-full h-full p-4 flex flex-col items-center justify-center bg-[#FAF9F6] overflow-auto">
                  {printSheetUrl ? (
                    <div className="space-y-3 text-center">
                      <img
                        src={printSheetUrl}
                        alt="Bản in phẳng"
                        className="max-h-[360px] w-auto object-contain rounded-xl border border-[#DDD8D2] shadow-sm bg-white p-2"
                      />
                      <a
                        href={printSheetUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#3A211E] text-white rounded-full text-xs font-bold hover:bg-[#4A2A25] transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" /> Mở ảnh gốc chất lượng cao (2048×1024)
                      </a>
                    </div>
                  ) : null}
                </div>
              )}
            </div>

            <p className="text-[11px] text-[#6F625E] mt-3 text-center">
              Chế độ chỉ xem an toàn (Read-only) • Dữ liệu thiết kế gốc được bảo lưu bất biến theo mã đơn hàng
            </p>
          </div>

          {/* Right Column: Detailed Specs Breakdown (5 cols) */}
          <div className="lg:col-span-5 p-6 overflow-y-auto space-y-6">
            
            {/* 1. Cup Model & Color Specifications */}
            <div className="space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-[#3A211E] flex items-center gap-1.5">
                <Palette className="w-4 h-4 text-amber-700" /> Thông số vật liệu & Màu sắc
              </h4>
              <div className="bg-[#FAF9F6] p-4 rounded-2xl border border-[#DDD8D2] text-xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[#6F625E]">Loại ly:</span>
                  <span className="font-bold text-[#3A211E]">{specs?.modelName || modelDef.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#6F625E]">Chất liệu:</span>
                  <span className="font-bold text-[#3A211E]">
                    {modelDef.category === 'glass' ? 'Thủy tinh pha lê cao cấp' : 'Nhựa PP 2 lớp an toàn'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#6F625E]">Màu sắc thân ly:</span>
                  <div className="flex items-center gap-2">
                    <span 
                      className="w-4 h-4 rounded-full border border-black/20 shrink-0" 
                      style={{ backgroundColor: selectedColor.color }} 
                    />
                    <span className="font-bold text-[#3A211E]">{selectedColor.name}</span>
                  </div>
                </div>
                {modelDef.hasLid && (
                  <div className="flex items-center justify-between">
                    <span className="text-[#6F625E]">Màu nắp & Ống hút:</span>
                    <div className="flex items-center gap-2">
                      <span 
                        className="w-4 h-4 rounded-full border border-black/20 shrink-0" 
                        style={{ backgroundColor: lidColor }} 
                      />
                      <span className="font-mono text-[11px] font-bold text-[#3A211E]">{lidColor}</span>
                    </div>
                  </div>
                )}
                {specs?.capacity && (
                  <div className="flex items-center justify-between">
                    <span className="text-[#6F625E]">Dung tích:</span>
                    <span className="font-bold text-[#3A211E]">{specs.capacity}</span>
                  </div>
                )}
              </div>
            </div>

            {/* 2. Custom Text Content */}
            {textLayers.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#3A211E] flex items-center gap-1.5">
                  <Type className="w-4 h-4 text-blue-700" /> Nội dung chữ in ({textLayers.length})
                </h4>
                <div className="space-y-2">
                  {textLayers.map((tl, i) => (
                    <div key={tl.id || i} className="bg-[#FAF9F6] p-3.5 rounded-2xl border border-[#DDD8D2] text-xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-[#3A211E]">"{tl.text}"</span>
                        <div className="flex items-center gap-1.5">
                          <span 
                            className="w-3.5 h-3.5 rounded-full border border-black/20" 
                            style={{ backgroundColor: tl.color }} 
                          />
                          <span className="font-mono text-[10px] text-[#6F625E]">{tl.color}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-[#6F625E]">
                        <span>Font: <strong>{tl.font}</strong></span>
                        <span>•</span>
                        <span>Cỡ chữ: <strong>{tl.fontSize}px</strong></span>
                        <span>•</span>
                        <span>Góc xoay: <strong>{Math.round(tl.rotation || 0)}°</strong></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. Uploaded Artwork / Logos */}
            {imageLayers.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#3A211E] flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-emerald-700" /> Hình ảnh & Sticker ({imageLayers.length})
                </h4>
                <div className="space-y-2.5">
                  {imageLayers.map((il, i) => (
                    <div key={il.id || i} className="bg-[#FAF9F6] p-3 rounded-2xl border border-[#DDD8D2] flex items-center gap-3 text-xs">
                      <div className="w-14 h-14 bg-white rounded-xl border border-[#DDD8D2] p-1 shrink-0 flex items-center justify-center overflow-hidden">
                        <img src={il.url} alt={il.name} className="max-w-full max-h-full object-contain" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-[#3A211E] truncate">{il.name || `Hình ảnh ${i + 1}`}</p>
                        <p className="text-[11px] text-[#6F625E] mt-0.5">
                          Tỷ lệ: {il.naturalWidth}×{il.naturalHeight}px • Thu phóng: {Math.round(il.scale * 100)}%
                        </p>
                        {il.originalFile && (
                          <a 
                            href={il.originalFile} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="inline-flex items-center gap-1 text-[11px] text-blue-600 hover:underline font-bold mt-1"
                          >
                            <ExternalLink className="w-3 h-3" /> Mở ảnh gốc
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. Production Compliance */}
            <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Độ an toàn in ấn & Gia công</p>
                <p className="text-[11px] text-emerald-700 mt-0.5">
                  Tất cả các lớp chữ và hình ảnh đều tuân thủ vùng in an toàn 15mm tính từ miệng ly và 10mm tính từ đáy ly.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-[#DDD8D2] flex items-center justify-between bg-[#F7F6F2] shrink-0">
          <div>
            {mode === 'customer' && (
              <button
                onClick={handleRedesign}
                className="px-5 py-2.5 bg-[#FFF3A6] hover:bg-[#FFE978] text-[#201817] rounded-full text-xs font-bold transition-colors border border-[#DDD8D2] flex items-center gap-1.5 shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                Thiết kế lại từ mẫu này ✨
              </button>
            )}
          </div>

          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#3A211E] hover:bg-[#4A2A25] text-white rounded-full text-xs font-bold transition-colors shadow-sm"
          >
            Đóng
          </button>
        </div>

      </div>
    </div>
  );
}
