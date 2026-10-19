'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import * as THREE from 'three';
import { 
  X, Eye, RotateCw, ZoomIn, ZoomOut, Download, ExternalLink, 
  Layers, Type, Palette, Sparkles, CheckCircle2, AlertCircle, ShieldCheck,
  Compass, Maximize2, RefreshCw, Printer, FileDown, Check
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
        <span className="text-xs font-bold">Đang khởi tạo không gian 3D toàn bộ ly...</span>
      </div>
    )
  }
);

interface CustomCupViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: any;
  mode?: 'customer' | 'admin';
  onStatusChange?: (itemId: string, status: string) => Promise<void> | void;
}

export default function CustomCupViewerModal({
  isOpen,
  onClose,
  item,
  mode = 'customer',
  onStatusChange,
}: CustomCupViewerModalProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'3d' | 'printsheet' | 'preview'>('3d');
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [contrastMode, setContrastMode] = useState<'checkerboard' | 'dark' | 'cup_color'>('checkerboard');
  const [showDieLineGuides, setShowDieLineGuides] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [statusUpdating, setStatusUpdating] = useState(false);

  // Extract customSpecs safely from item, products.technical_specs, or products.description
  const specs = useMemo(() => {
    if (!item) return null;
    if (item.customSpecs && Object.keys(item.customSpecs).length > 0) {
      return item.customSpecs;
    }
    const prod = item.products || item;
    let s = prod?.technical_specs;
    if (!s || Object.keys(s).length === 0) {
      try {
        if (typeof prod?.description === 'string' && prod.description.startsWith('{')) {
          s = JSON.parse(prod.description);
        } else if (typeof prod?.description === 'object') {
          s = prod.description;
        }
      } catch (e) {}
    }
    return s || item;
  }, [item]);

  // Model definition
  const modelDef: CupModelDef = useMemo(() => {
    const modelType = specs?.modelType || item?.modelType;
    if (modelType) {
      const found = CUP_MODELS.find((m) => m.id === modelType);
      if (found) return found;
    }
    return CUP_MODELS[0];
  }, [specs, item]);

  // Color definition
  const selectedColor: CupColorOption = useMemo(() => {
    if (modelDef.category === 'glass') {
      return CLEAR_GLASS_COLOR;
    }
    const colorHex = specs?.cupColor || item?.cupColor;
    if (colorHex) {
      const found = CUP_COLOR_OPTIONS.find((c) => c.color?.toLowerCase() === colorHex.toLowerCase());
      if (found) return found;
      return {
        id: 'custom',
        name: specs?.cupColorName || item?.cupColorName || 'Tùy chỉnh',
        color: colorHex,
        glassTint: specs?.glassTint || false,
      };
    }
    return CUP_COLOR_OPTIONS[0];
  }, [specs, item, modelDef]);

  const lidColor = specs?.lidColor || item?.lidColor || '#FFF3A6';
  const layers: DesignLayer[] = useMemo(() => specs?.layers || item?.layers || [], [specs, item]);

  // Render texture using canvas engine
  const { texture: canvasTex } = useCanvasTexture(layers, false);
  const [fallbackTexture, setFallbackTexture] = useState<THREE.Texture | null>(null);

  const prod = item?.products || item;
  const previewImage = specs?.previewImage || prod?.image_url || item?.cupImage;
  const printSheetUrl = specs?.printableTexture || item?.printableTexture;

  // Fallback loader if layers are empty but printableTexture exists
  useEffect(() => {
    if (layers.length === 0 && printSheetUrl && typeof window !== 'undefined') {
      const loader = new THREE.TextureLoader();
      loader.load(printSheetUrl, (tex) => {
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.ClampToEdgeWrapping;
        tex.minFilter = THREE.LinearFilter;
        tex.magFilter = THREE.LinearFilter;
        setFallbackTexture(tex);
      });
    } else {
      setFallbackTexture(null);
    }
  }, [layers, printSheetUrl]);

  const activeTexture = layers.length > 0 ? canvasTex : fallbackTexture;

  if (!isOpen || !item) return null;

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

  const handleActionStatus = async (status: string) => {
    if (!onStatusChange || !item.itemId) return;
    setStatusUpdating(true);
    try {
      await onStatusChange(item.itemId, status);
    } catch (e: any) {
      alert('Lỗi cập nhật trạng thái: ' + e.message);
    }
    setStatusUpdating(false);
  };

  const orderId = item.orderId || (item.orders as any)?.id || '';
  const customerName = item.customerName || (item.orders as any)?.buyer_name_snapshot || 'Khách hàng';
  const customerEmail = item.customerEmail || (item.orders as any)?.buyer_email_snapshot || '';
  const itemStatus = item.itemStatus || item.status || 'pending';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/65 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-[28px] border border-[#DDD8D2] shadow-2xl w-full max-w-6xl max-h-[94vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="px-5 py-3.5 border-b border-[#DDD8D2] flex items-center justify-between bg-[#F7F6F2] shrink-0">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-white border border-[#DDD8D2] text-[#3A211E] shadow-xs">
              <Sparkles className="w-5 h-5 text-amber-600" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading text-base md:text-lg font-bold text-[#3A211E]">
                  {specs?.modelName || modelDef.name} — Hồ Sơ Bản In Toàn Bộ Ly
                </h3>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                  itemStatus === 'approved' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
                  itemStatus === 'in_printing' ? 'bg-indigo-100 text-indigo-800 border-indigo-200' :
                  itemStatus === 'completed' ? 'bg-teal-100 text-teal-800 border-teal-200' :
                  'bg-amber-100 text-amber-800 border-amber-200'
                }`}>
                  {itemStatus === 'approved' ? 'Đã Duyệt In' :
                   itemStatus === 'in_printing' ? 'Đang In' :
                   itemStatus === 'completed' ? 'Đã Hoàn Thành' : 'Chờ Phê Duyệt'}
                </span>
              </div>
              <p className="text-xs text-[#6F625E]">
                Khách: <strong>{customerName}</strong> {customerEmail ? `(${customerEmail})` : ''} • Đơn: <code className="font-mono text-[#4A2A25]">#{orderId ? orderId.slice(0, 8).toUpperCase() : 'N/A'}</code>
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#EDECEA] text-[#6F625E] hover:text-[#3A211E] transition-colors"
            title="Đóng cửa sổ"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Main Content: 2-column layout */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#DDD8D2]">
          
          {/* Left Column: Interactive 3D / Viewport (7 cols) */}
          <div className="lg:col-span-7 flex flex-col bg-[#FAF9F6] p-4 sm:p-5">
            
            {/* View Mode Switcher */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3 shrink-0">
              <div className="flex items-center gap-1.5 p-1 bg-white rounded-full border border-[#DDD8D2] shadow-xs">
                <button
                  onClick={() => setActiveTab('3d')}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeTab === '3d'
                      ? 'bg-[#3A211E] text-white shadow-xs'
                      : 'text-[#6F625E] hover:text-[#3A211E]'
                  }`}
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  Mô hình 3D toàn bộ ly
                </button>
                <button
                  onClick={() => setActiveTab('printsheet')}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeTab === 'printsheet'
                      ? 'bg-[#3A211E] text-white shadow-xs'
                      : 'text-[#6F625E] hover:text-[#3A211E]'
                  }`}
                >
                  <Printer className="w-3.5 h-3.5" />
                  Bản in trải phẳng (Die-line 2D)
                </button>
                {previewImage && (
                  <button
                    onClick={() => setActiveTab('preview')}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                      activeTab === 'preview'
                        ? 'bg-[#3A211E] text-white shadow-xs'
                        : 'text-[#6F625E] hover:text-[#3A211E]'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Ảnh thực tế
                  </button>
                )}
              </div>

              {activeTab === '3d' && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsAutoRotating(!isAutoRotating)}
                    className={`px-2.5 py-1.5 rounded-full border text-[11px] font-bold flex items-center gap-1 transition-colors ${
                      isAutoRotating
                        ? 'bg-amber-100 border-amber-300 text-amber-800'
                        : 'bg-white border-[#DDD8D2] text-[#6F625E] hover:text-[#3A211E]'
                    }`}
                    title="Bật/Tắt tự động xoay"
                  >
                    <RotateCw className={`w-3 h-3 ${isAutoRotating ? 'animate-spin' : ''}`} />
                    <span>{isAutoRotating ? 'Đang xoay' : 'Dừng xoay'}</span>
                  </button>
                </div>
              )}

              {activeTab === 'printsheet' && (
                <div className="flex items-center gap-1 bg-white p-1 rounded-full border border-[#DDD8D2] text-[11px]">
                  <span className="text-[10px] text-[#6F625E] font-medium px-2">Nền:</span>
                  <button
                    onClick={() => setContrastMode('checkerboard')}
                    className={`px-2 py-0.5 rounded-full font-bold transition-colors ${
                      contrastMode === 'checkerboard' ? 'bg-[#3A211E] text-white' : 'text-[#6F625E] hover:text-[#3A211E]'
                    }`}
                    title="Nền caro mờ tương phản - Chuẩn đồ họa"
                  >
                    Caro
                  </button>
                  <button
                    onClick={() => setContrastMode('dark')}
                    className={`px-2 py-0.5 rounded-full font-bold transition-colors ${
                      contrastMode === 'dark' ? 'bg-[#3A211E] text-white' : 'text-[#6F625E] hover:text-[#3A211E]'
                    }`}
                    title="Nền tối - Nổi bật chữ trắng"
                  >
                    Tối
                  </button>
                  <button
                    onClick={() => setContrastMode('cup_color')}
                    className={`px-2 py-0.5 rounded-full font-bold transition-colors ${
                      contrastMode === 'cup_color' ? 'bg-[#3A211E] text-white' : 'text-[#6F625E] hover:text-[#3A211E]'
                    }`}
                    title="Nền mô phỏng màu ly thực tế"
                  >
                    Màu ly
                  </button>

                  <div className="h-3 w-[1px] bg-[#DDD8D2] mx-1" />

                  <button
                    onClick={() => setShowDieLineGuides(!showDieLineGuides)}
                    className={`px-2 py-0.5 rounded-full font-bold transition-colors ${
                      showDieLineGuides ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'text-[#6F625E]'
                    }`}
                    title="Bật/Tắt đường gióng định vị miệng ly, đáy ly và vùng in"
                  >
                    Vạch gióng
                  </button>
                </div>
              )}
            </div>

            {/* Viewport Display Area */}
            <div className="relative flex-1 min-h-[380px] sm:min-h-[460px] rounded-2xl border border-[#DDD8D2] overflow-hidden shadow-inner flex items-center justify-center bg-white">
              
              {/* TAB 1: 3D MODEL VIEW */}
              {activeTab === '3d' && (
                <div className="w-full h-full relative">
                  <StudioScene
                    modelDef={modelDef}
                    selectedColor={selectedColor}
                    lidColor={lidColor}
                    canvasTexture={activeTexture as any}
                    viewMode="studio"
                    showSafeZone={false}
                    isAutoRotating={isAutoRotating}
                    setIsAutoRotating={setIsAutoRotating}
                  />
                  <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-[10px] font-medium pointer-events-none flex items-center gap-1.5 shadow-md">
                    <Sparkles className="w-3 h-3 text-amber-300" />
                    Kéo chuột để xoay 360° toàn bộ ly • Cuộn chuột để phóng to/thu nhỏ
                  </div>
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-[#DDD8D2] text-[10px] font-bold text-[#3A211E] shadow-sm">
                    {modelDef.category === 'glass' ? 'Thủy tinh trong suốt' : 'Nhựa PP 2 lớp'}
                  </div>
                </div>
              )}

              {/* TAB 2: UNROLLED DIE-LINE PRINT SHEET (2D) */}
              {activeTab === 'printsheet' && (
                <div 
                  className="relative w-full h-full p-4 flex flex-col items-center justify-center overflow-auto select-none transition-colors duration-200"
                  style={{
                    backgroundColor: contrastMode === 'dark' ? '#0f172a' : contrastMode === 'cup_color' ? (selectedColor.color || '#ffffff') : undefined,
                    backgroundImage: contrastMode === 'checkerboard' 
                      ? 'repeating-conic-gradient(#cbd5e1 0% 25%, #ffffff 0% 50%)' 
                      : undefined,
                    backgroundSize: contrastMode === 'checkerboard' ? '18px 18px' : undefined,
                  }}
                >
                  {/* Die-line Container matching 2048 x 1024 proportion (2:1 ratio) */}
                  <div 
                    className="relative w-full max-w-[680px] aspect-[2/1] rounded-xl border-2 shadow-2xl flex items-center justify-center overflow-hidden transition-transform duration-200"
                    style={{
                      transform: `scale(${zoomLevel})`,
                      borderColor: contrastMode === 'dark' ? '#334155' : '#94a3b8',
                      backgroundColor: contrastMode === 'cup_color' ? (selectedColor.color || '#ffffff') : 'transparent',
                    }}
                  >
                    {/* The Actual Printed Decal Layer */}
                    {printSheetUrl ? (
                      <img
                        src={printSheetUrl}
                        alt="Bản in trải phẳng toàn thân ly"
                        className="w-full h-full object-contain pointer-events-none"
                        style={{
                          filter: contrastMode === 'cup_color' && selectedColor.color?.toLowerCase() === '#ffffff'
                            ? 'drop-shadow(0 0 1px rgba(0,0,0,0.4))'
                            : undefined
                        }}
                      />
                    ) : (
                      <div className="text-center p-6 text-xs text-[#6F625E]">
                        Chưa có file trải phẳng tự động. Vui lòng kiểm tra các lớp chữ và ảnh ở cột bên phải.
                      </div>
                    )}

                    {/* Technical Die-line Overlay Guides */}
                    {showDieLineGuides && (
                      <div className="absolute inset-0 pointer-events-none font-mono text-[9px] uppercase tracking-wider">
                        
                        {/* Top Rim Boundary (15mm from rim) */}
                        <div className="absolute top-[12.7%] inset-x-0 border-b-2 border-dashed border-rose-500/70 flex justify-between px-2 pb-0.5">
                          <span className="bg-rose-600 text-white px-1.5 py-0.2 rounded font-bold">▲ Mép Miệng Ly (15mm)</span>
                          <span className="text-rose-500 font-bold bg-white/80 px-1 rounded">VÙNG GIỚI HẠN MIỆNG</span>
                        </div>

                        {/* Bottom Base Boundary (10mm from bottom) */}
                        <div className="absolute bottom-[12.7%] inset-x-0 border-t-2 border-dashed border-rose-500/70 flex justify-between px-2 pt-0.5">
                          <span className="bg-rose-600 text-white px-1.5 py-0.2 rounded font-bold">▼ Mép Đáy Ly (10mm)</span>
                          <span className="text-rose-500 font-bold bg-white/80 px-1 rounded">VÙNG GIỚI HẠN ĐÁY</span>
                        </div>

                        {/* Center Front Axis (0°) */}
                        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 border-r-2 border-dashed border-sky-500/60 flex flex-col justify-between py-1">
                          <span className="bg-sky-600 text-white px-1.5 py-0.2 rounded font-bold mx-auto">TÂM CHÍNH DIỆN (0°)</span>
                          <span className="bg-sky-600 text-white px-1.5 py-0.2 rounded font-bold mx-auto">TRỤC GIỮA</span>
                        </div>

                        {/* Left Seam Axis (180°) */}
                        <div className="absolute inset-y-0 left-0 border-r border-dashed border-slate-400/50 flex flex-col justify-center px-1">
                          <span className="rotate-90 bg-slate-700 text-white px-1 py-0.2 rounded font-bold origin-left text-[8px]">MÉP LƯNG (180°)</span>
                        </div>

                        {/* Right Seam Axis (180°) */}
                        <div className="absolute inset-y-0 right-0 border-l border-dashed border-slate-400/50 flex flex-col justify-center px-1">
                          <span className="-rotate-90 bg-slate-700 text-white px-1 py-0.2 rounded font-bold origin-right text-[8px]">MÉP LƯNG (180°)</span>
                        </div>

                        {/* Safe Print Zone Outer Box */}
                        <div className="absolute top-[12.7%] bottom-[12.7%] left-[7.8%] right-[7.8%] border border-dashed border-emerald-500/80 rounded-sm pointer-events-none">
                          <div className="absolute top-1 left-1 bg-emerald-700/80 text-white px-1.5 py-0.2 rounded text-[8px] font-bold">
                            KHỔ IN AN TOÀN (2048 × 1024 PX)
                          </div>
                        </div>

                      </div>
                    )}
                  </div>

                  {/* Die-line Info & Zoom toolbar */}
                  <div className="flex items-center justify-between w-full max-w-[680px] mt-3 pt-2 text-xs text-[#6F625E]">
                    <div className="flex items-center gap-1.5 font-medium text-[11px]">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span>Bản in trải phẳng 360° toàn thân ly • Khổ chuẩn máy in UV phẳng</span>
                    </div>

                    <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm p-1 rounded-lg border border-[#DDD8D2]">
                      <button
                        onClick={() => setZoomLevel((z) => Math.max(0.7, z - 0.15))}
                        className="p-1 hover:bg-[#F7F6F2] rounded text-[#3A211E]"
                        title="Thu nhỏ"
                      >
                        <ZoomOut className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-[11px] font-mono font-bold px-1.5 text-[#3A211E]">{Math.round(zoomLevel * 100)}%</span>
                      <button
                        onClick={() => setZoomLevel((z) => Math.min(1.6, z + 0.15))}
                        className="p-1 hover:bg-[#F7F6F2] rounded text-[#3A211E]"
                        title="Phóng to"
                      >
                        <ZoomIn className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setZoomLevel(1)}
                        className="p-1 hover:bg-[#F7F6F2] rounded text-[#6F625E] hover:text-[#3A211E]"
                        title="Đặt lại 100%"
                      >
                        <RefreshCw className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: REAL SNAPSHOT PREVIEW */}
              {activeTab === 'preview' && (
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
              )}

            </div>

            {/* Bottom Production Quick Tip */}
            <div className="flex items-center justify-between text-[11px] text-[#6F625E] mt-3 px-1">
              <span>Đường kính ly: <strong>{specs?.diameterMm || modelDef.diameterMm || 90}mm</strong> • Chiều cao: <strong>{specs?.heightMm || modelDef.heightMm || 155}mm</strong></span>
              {printSheetUrl && (
                <a
                  href={printSheetUrl}
                  target="_blank"
                  rel="noreferrer"
                  download={`ban-in-cupfy-${orderId || 'production'}.png`}
                  className="font-bold text-indigo-700 hover:underline flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" /> Tải file in UV (2048×1024)
                </a>
              )}
            </div>
          </div>

          {/* Right Column: Detailed Specs Breakdown (5 cols) */}
          <div className="lg:col-span-5 p-5 overflow-y-auto space-y-5">
            
            {/* 1. Customer & Order Info (When Admin Mode) */}
            {mode === 'admin' && (
              <div className="bg-[#FAF9F6] p-4 rounded-2xl border border-[#DDD8D2] space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-[#201817]">{customerName}</span>
                  <span className="font-mono text-[11px] font-bold text-[#4A2A25]">
                    Đơn: #{orderId ? orderId.slice(0, 8).toUpperCase() : 'N/A'}
                  </span>
                </div>
                {customerEmail && (
                  <div className="text-[11px] text-[#6F625E]">Email: {customerEmail}</div>
                )}
                {item.price && (
                  <div className="flex justify-between items-center pt-1 border-t border-[#DDD8D2]/60 text-[11px]">
                    <span className="text-[#6F625E]">Đơn giá custom:</span>
                    <span className="font-bold text-[#4A2A25]">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price * (item.quantity || 1))}
                      {item.quantity > 1 ? ` (${item.quantity} ly)` : ''}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* 2. Cup Model & Color Specifications */}
            <div className="space-y-2.5">
              <h4 className="font-bold text-xs uppercase tracking-wider text-[#3A211E] flex items-center gap-1.5">
                <Palette className="w-4 h-4 text-amber-700" /> Thông số phôi ly & Màu sắc
              </h4>
              <div className="bg-[#FAF9F6] p-3.5 rounded-2xl border border-[#DDD8D2] text-xs space-y-2 leading-relaxed">
                <div className="flex items-center justify-between">
                  <span className="text-[#6F625E]">Phôi ly cơ sở:</span>
                  <span className="font-bold text-[#3A211E]">{specs?.modelName || modelDef.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#6F625E]">Chất liệu phôi:</span>
                  <span className="font-bold text-[#3A211E]">
                    {modelDef.category === 'glass' ? 'Thủy tinh pha lê cao cấp' : 'Nhựa PP 2 lớp an toàn'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#6F625E]">Màu thân ly:</span>
                  <div className="flex items-center gap-2">
                    <span 
                      className="w-4 h-4 rounded-full border border-black/20 shrink-0 shadow-xs" 
                      style={{ backgroundColor: selectedColor.color }} 
                    />
                    <span className="font-bold text-[#3A211E]">{selectedColor.name}</span>
                    <code className="text-[10px] bg-white px-1.5 py-0.5 rounded border border-[#DDD8D2] font-mono text-[#6F625E]">
                      {selectedColor.color}
                    </code>
                  </div>
                </div>
                {modelDef.hasLid && (
                  <div className="flex items-center justify-between">
                    <span className="text-[#6F625E]">Màu nắp & Ống hút:</span>
                    <div className="flex items-center gap-2">
                      <span 
                        className="w-4 h-4 rounded-full border border-black/20 shrink-0 shadow-xs" 
                        style={{ backgroundColor: lidColor }} 
                      />
                      <code className="text-[10px] bg-white px-1.5 py-0.5 rounded border border-[#DDD8D2] font-mono text-[#3A211E]">
                        {lidColor}
                      </code>
                    </div>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-[#6F625E]">Dung tích & Kích thước:</span>
                  <span className="font-bold text-[#3A211E]">
                    {specs?.capacity || modelDef.capacity || 'Tiêu chuẩn'} ({modelDef.diameterMm}×{modelDef.heightMm}mm)
                  </span>
                </div>
              </div>
            </div>

            {/* 3. Custom Text Layers with Contrast Preview (White text 100% visible) */}
            {textLayers.length > 0 && (
              <div className="space-y-2.5">
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#3A211E] flex items-center gap-1.5">
                  <Type className="w-4 h-4 text-blue-700" /> Nội dung chữ in ({textLayers.length})
                </h4>
                <div className="space-y-2">
                  {textLayers.map((tl, i) => (
                    <div key={tl.id || i} className="bg-[#FAF9F6] p-3 rounded-2xl border border-[#DDD8D2] text-xs space-y-2">
                      
                      {/* High-Contrast Visual Box so White Text is vividly legible */}
                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 shadow-inner flex items-center justify-between overflow-hidden">
                        <span 
                          style={{ 
                            color: tl.color, 
                            fontFamily: tl.font, 
                            fontWeight: tl.isBold ? 'bold' : 'normal',
                            fontStyle: tl.isItalic ? 'italic' : 'normal'
                          }} 
                          className="text-base truncate drop-shadow-xs"
                        >
                          "{tl.text}"
                        </span>
                        <span 
                          className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700 shrink-0 ml-2"
                        >
                          Mực: {tl.color}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[#6F625E] px-1">
                        <span>Font: <strong>{tl.font}</strong></span>
                        <span>•</span>
                        <span>Cỡ chữ: <strong>{tl.fontSize}px</strong></span>
                        <span>•</span>
                        <span>Góc xoay: <strong>{Math.round(tl.rotation || 0)}°</strong></span>
                        <span>•</span>
                        <span>Căn lề: <strong>{tl.align}</strong></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. Uploaded Artwork / Logos */}
            {imageLayers.length > 0 && (
              <div className="space-y-2.5">
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#3A211E] flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-emerald-700" /> Hình ảnh & Sticker ({imageLayers.length})
                </h4>
                <div className="space-y-2">
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
                        {(il.originalFile || il.url) && (
                          <a 
                            href={il.originalFile || il.url} 
                            target="_blank" 
                            rel="noreferrer" 
                            download
                            className="inline-flex items-center gap-1 text-[11px] text-blue-600 hover:underline font-bold mt-1"
                          >
                            <Download className="w-3 h-3" /> Tải ảnh gốc độ nét cao
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. Production Compliance */}
            <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Độ an toàn in ấn & Gia công xưởng</p>
                <p className="text-[11px] text-emerald-700 mt-0.5">
                  Thiết kế hiển thị trọn vẹn 360° quanh thân ly. Tuân thủ chuẩn in cách miệng ly 15mm và cách đáy 10mm.
                </p>
              </div>
            </div>

            {/* 6. Admin Production Controls */}
            {mode === 'admin' && onStatusChange && (
              <div className="p-4 bg-indigo-50/80 rounded-2xl border border-indigo-200 space-y-3">
                <div className="font-bold text-xs text-indigo-950 flex items-center gap-1.5">
                  <Printer className="w-4 h-4 text-indigo-700" />
                  Xử lý sản xuất & Phê duyệt thiết kế
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    disabled={statusUpdating}
                    onClick={() => handleActionStatus('approved')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 ${
                      itemStatus === 'approved' 
                        ? 'bg-emerald-700 text-white shadow-xs' 
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Duyệt In Ấn
                  </button>
                  <button
                    disabled={statusUpdating}
                    onClick={() => handleActionStatus('in_printing')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 ${
                      itemStatus === 'in_printing' 
                        ? 'bg-indigo-700 text-white shadow-xs' 
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    }`}
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    Bắt Đầu In
                  </button>
                  <button
                    disabled={statusUpdating}
                    onClick={() => handleActionStatus('completed')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 ${
                      itemStatus === 'completed' 
                        ? 'bg-teal-700 text-white shadow-xs' 
                        : 'bg-teal-600 hover:bg-teal-700 text-white'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    Đã In Xong
                  </button>
                  <button
                    disabled={statusUpdating}
                    onClick={() => handleActionStatus('rejected')}
                    className="py-2 px-3 bg-rose-100 hover:bg-rose-200 text-rose-800 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 border border-rose-200"
                  >
                    <AlertCircle className="w-3.5 h-3.5" />
                    Yêu Cầu Sửa
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-[#DDD8D2] flex items-center justify-between bg-[#F7F6F2] shrink-0">
          <div className="flex items-center gap-2">
            {mode === 'customer' && (
              <button
                onClick={handleRedesign}
                className="px-4 py-2 bg-[#FFF3A6] hover:bg-[#FFE978] text-[#201817] rounded-full text-xs font-bold transition-colors border border-[#DDD8D2] flex items-center gap-1.5 shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                Thiết kế lại từ mẫu này ✨
              </button>
            )}

            {printSheetUrl && (
              <a
                href={printSheetUrl}
                target="_blank"
                rel="noreferrer"
                download={`ban-in-cupfy-${orderId || 'production'}.png`}
                className="px-4 py-2 bg-indigo-700 hover:bg-indigo-800 text-white rounded-full text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <FileDown className="w-3.5 h-3.5" />
                Tải Bản In 2048×1024 (UV)
              </a>
            )}
          </div>

          <button
            onClick={onClose}
            className="px-6 py-2 bg-[#3A211E] hover:bg-[#4A2A25] text-white rounded-full text-xs font-bold transition-colors shadow-sm"
          >
            Đóng Cửa Sổ
          </button>
        </div>

      </div>
    </div>
  );
}
