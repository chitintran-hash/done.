'use client';

import React, { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ChevronLeft,
  ShoppingCart,
  Undo2,
  Redo2,
  RotateCcw,
  Check,
  ShieldAlert,
  SlidersHorizontal,
  Eye,
  FileCheck2,
  HelpCircle,
  Gift
} from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { translations, TranslationKey } from '@/lib/i18n/translations';
import { createClient } from '@/lib/supabase/client';

import {
  DesignLayer,
  TextLayer,
  ImageLayer,
  CupModelDef,
  CupColorOption,
  StudioViewMode,
  StudioAddon,
  StudioPricingBreakdown
} from '@/components/studio/types';
import { CUP_MODELS, CUP_COLOR_OPTIONS, CLEAR_GLASS_COLOR, findMatchedDbProduct } from '@/components/studio/cupDefinitions';
import { GOOGLE_FONTS_URL } from '@/components/studio/fontLibrary';
import { useCanvasTexture, CANVAS_WIDTH, CANVAS_HEIGHT } from '@/components/studio/useCanvasTexture';
import { StudioScene } from '@/components/studio/StudioScene';
import { StudioToolbar } from '@/components/studio/StudioToolbar';
import { StudioPricingSidebar } from '@/components/studio/StudioPricingSidebar';
import GiftCreationModal from '@/components/gift/GiftCreationModal';

const DRAFT_STORAGE_KEY = 'cupfy-studio-draft-v2';

function CustomCupStudioInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const cartStore = useCartStore();
  const { language } = useLanguageStore();
  const t = (key: TranslationKey) =>
    translations[language]?.[key] !== undefined ? translations[language][key] : key;

  // Selected State
  const [selectedModel, setSelectedModel] = useState<CupModelDef>(CUP_MODELS[0]);
  const [selectedColor, setSelectedColor] = useState<CupColorOption>(CLEAR_GLASS_COLOR);
  const [lidColor, setLidColor] = useState<string>('#FFBF00');
  const [viewMode, setViewMode] = useState<StudioViewMode>('studio');
  const [showSafeZone, setShowSafeZone] = useState<boolean>(true);
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('models');
  const isDemoCup = selectedModel.isDemo || selectedModel.id === 'plastic_boba';

  // Addons State (Hộp quà, Charm, Thiệp)
  const [addons, setAddons] = useState<StudioAddon[]>([
    {
      id: 'gift_box',
      name: 'Gói quà / Hộp quà cao cấp',
      price: 30000,
      description: 'Hộp carton cứng, nơ ruy băng sang trọng, lót rơm chống sốc.',
      selected: false,
    },
    {
      id: 'charm',
      name: 'Charm trang trí ly',
      price: 15000,
      description: 'Charm mini đính quai ly dễ thương, tạo điểm nhấn cá nhân.',
      selected: false,
    },
    {
      id: 'card',
      name: 'Thiệp chúc mừng viết tay',
      price: 5000,
      description: 'Thiệp viết tay gửi người thương kèm lời chúc ý nghĩa.',
      selected: false,
      note: '',
    },
  ]);

  const [isMobilePricingOpen, setIsMobilePricingOpen] = useState(false);
  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);

  const get3DSnapshot = () => {
    const canvasEl = canvasElementRef.current || document.querySelector('canvas');
    if (canvasEl) {
      try {
        return canvasEl.toDataURL('image/jpeg', 0.85);
      } catch (e) {
        console.error('Error capturing 3D canvas:', e);
      }
    }
    return '';
  };

  const handleToggleAddon = (id: string) => {
    setAddons((prev) =>
      prev.map((a) => (a.id === id ? { ...a, selected: !a.selected } : a))
    );
  };

  const handleUpdateAddonNote = (id: string, note: string) => {
    setAddons((prev) =>
      prev.map((a) => (a.id === id ? { ...a, note } : a))
    );
  };

  // Layers State
  const [layers, setLayers] = useState<DesignLayer[]>([
    {
      id: 'default-text-1',
      type: 'text',
      name: 'Logo mẫu',
      text: 'YOUR LOGO',
      font: "'Be Vietnam Pro', sans-serif",
      fontSize: 64,
      color: '#3A211E',
      isBold: true,
      align: 'center',
      x: CANVAS_WIDTH / 2,
      y: CANVAS_HEIGHT / 2,
      rotation: 0,
      scale: 1,
      locked: false,
      visible: true,
      opacity: 1,
      lineHeight: 1.25,
    },
  ]);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>('default-text-1');

  // Undo / Redo History Stack (up to 50 steps)
  const historyRef = useRef<DesignLayer[][]>([layers]);
  const historyIndexRef = useRef<number>(0);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  // 3D Canvas element reference for capturing snapshot
  const canvasElementRef = useRef<HTMLCanvasElement | null>(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [dbProducts, setDbProducts] = useState<any[]>([]);

  // Mobile drawer toggle
  const [isMobilePanelOpen, setIsMobilePanelOpen] = useState(true);

  // Texture Engine Hook
  const { texture, isOutOfSafeZone, exportFlatPrintSheet } = useCanvasTexture(layers, showSafeZone);

  // Update history stack
  const pushHistory = useCallback((newLayers: DesignLayer[]) => {
    const currentHist = historyRef.current.slice(0, historyIndexRef.current + 1);
    currentHist.push(JSON.parse(JSON.stringify(newLayers)));
    if (currentHist.length > 50) currentHist.shift();
    historyRef.current = currentHist;
    historyIndexRef.current = currentHist.length - 1;
    setCanUndo(historyIndexRef.current > 0);
    setCanRedo(false);

    // Save draft to localStorage
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(
          DRAFT_STORAGE_KEY,
          JSON.stringify({
            modelId: selectedModel.id,
            colorId: selectedColor.id,
            lidColor,
            layers: newLayers,
          })
        );
      } catch (e) {
        // storage quota exceeded or disabled
      }
    }
  }, [selectedModel.id, selectedColor.id, lidColor]);

  // Undo Handler
  const handleUndo = useCallback(() => {
    if (historyIndexRef.current > 0) {
      historyIndexRef.current -= 1;
      const prevLayers = JSON.parse(
        JSON.stringify(historyRef.current[historyIndexRef.current])
      );
      setLayers(prevLayers);
      setCanUndo(historyIndexRef.current > 0);
      setCanRedo(historyIndexRef.current < historyRef.current.length - 1);
    }
  }, []);

  // Redo Handler
  const handleRedo = useCallback(() => {
    if (historyIndexRef.current < historyRef.current.length - 1) {
      historyIndexRef.current += 1;
      const nextLayers = JSON.parse(
        JSON.stringify(historyRef.current[historyIndexRef.current])
      );
      setLayers(nextLayers);
      setCanUndo(historyIndexRef.current > 0);
      setCanRedo(historyIndexRef.current < historyRef.current.length - 1);
    }
  }, []);

  // Keyboard Shortcuts (Cmd+Z / Ctrl+Z / Cmd+Shift+Z / Ctrl+Y)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        handleRedo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo]);

  // Fetch Database Products to bind real prices and IDs
  useEffect(() => {
    const fetchDbProducts = async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from('products')
          .select('*')
          .neq('category', 'user_custom')
          .not('category', 'in', '("gift_box","gift","admin_community_post","admin_about_post")')
          .eq('approval_status', 'active');
        if (data && data.length > 0) {
          setDbProducts(data);

          // Check if productId in query
          const targetId = searchParams.get('productId');
          if (targetId) {
            const matched = data.find((p) => p.id === targetId);
            if (matched) {
              const matchedModel = CUP_MODELS.find(
                (m) =>
                  m.name.toLowerCase().includes(matched.name.toLowerCase()) ||
                  matched.name.toLowerCase().includes(m.name.toLowerCase()) ||
                  (m.id === 'glass_tall' && matched.name.toLowerCase().includes('cao')) ||
                  (m.id === 'glass_mug' && matched.name.toLowerCase().includes('quai')) ||
                  (m.id === 'glass_can' && matched.name.toLowerCase().includes('trung')) ||
                  (m.id === 'glass_rocks' && (matched.name.toLowerCase().includes('thấp') || matched.name.toLowerCase().includes('nhỏ')))
              );
              if (matchedModel) {
                setSelectedModel({
                  ...matchedModel,
                  defaultPrice: matched.price,
                });
              }
            }
          } else {
            // Synchronize active model price with real DB store price
            setSelectedModel((prev) => {
              const matched = findMatchedDbProduct(prev, data);
              return matched?.price ? { ...prev, defaultPrice: matched.price } : prev;
            });
          }
        }
      } catch (err) {
        console.error('Error fetching db products:', err);
      }
    };
    fetchDbProducts();
  }, [searchParams]);

  // Restore Draft from LocalStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
        if (savedDraft) {
          const parsed = JSON.parse(savedDraft);
          let loadedModel = CUP_MODELS[0];
          if (parsed.modelId) {
            const m = CUP_MODELS.find((x) => x.id === parsed.modelId);
            if (m) {
              loadedModel = m;
              setSelectedModel(m);
            }
          }
          if (loadedModel.category === 'glass') {
            setSelectedColor(CLEAR_GLASS_COLOR);
          } else if (parsed.colorId) {
            const c = CUP_COLOR_OPTIONS.find((x) => x.id === parsed.colorId);
            if (c) setSelectedColor(c);
          }
          if (parsed.lidColor) setLidColor(parsed.lidColor);
          if (parsed.layers && Array.isArray(parsed.layers) && parsed.layers.length > 0) {
            setLayers(parsed.layers);
            historyRef.current = [parsed.layers];
            historyIndexRef.current = 0;
            setSelectedLayerId(parsed.layers[0].id);
          }
        }
      } catch (e) {
        // parse error ignored
      }
    }
  }, []);

  const handleSelectModel = (model: CupModelDef) => {
    const matched = findMatchedDbProduct(model, dbProducts);
    const finalPrice = matched?.price || model.defaultPrice;
    setSelectedModel({
      ...model,
      defaultPrice: finalPrice,
    });
    if (model.category === 'glass') {
      setSelectedColor(CLEAR_GLASS_COLOR);
    }
  };

  // Update Layer Callback
  const handleUpdateLayer = (id: string, updates: Partial<DesignLayer>) => {
    setLayers((prev) => {
      const next = prev.map((l) => (l.id === id ? ({ ...l, ...updates } as DesignLayer) : l));
      pushHistory(next);
      return next;
    });
  };

  const isPlaceholderTextLayer = (l: DesignLayer) => {
    return (
      l.id === 'default-text-1' ||
      (l.type === 'text' && (l as TextLayer).text?.trim().toUpperCase() === 'YOUR LOGO')
    );
  };

  // Add Text Layer
  const handleAddTextLayer = () => {
    // If the only layer is default placeholder "YOUR LOGO", replace it
    const cleanLayers = layers.filter((l) => !isPlaceholderTextLayer(l));

    const newTextLayer: TextLayer = {
      id: 'text-' + Date.now(),
      type: 'text',
      name: 'Chữ in mới',
      text: 'Cupfy Vietnam',
      font: "'Be Vietnam Pro', sans-serif",
      fontSize: 54,
      color: '#3A211E',
      isBold: true,
      align: 'center',
      x: CANVAS_WIDTH / 2,
      y: CANVAS_HEIGHT / 2 + (cleanLayers.length * 20),
      rotation: 0,
      scale: 1,
      locked: false,
      visible: true,
      opacity: 1,
      lineHeight: 1.25,
    };
    const next = [...cleanLayers, newTextLayer];
    setLayers(next);
    setSelectedLayerId(newTextLayer.id);
    setActiveTab('text');
    pushHistory(next);
  };

  // Add Image Layer (Strict Aspect Ratio Preservation & Automatic Lightweight Compression)
  const handleAddImageLayer = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const rawData = reader.result as string;
      const img = new Image();
      img.onload = () => {
        const origW = img.naturalWidth || 600;
        const origH = img.naturalHeight || 600;
        const aspectRatio = origW / origH;

        // Downscale image to max 800px to ensure fast rendering, no memory exhaustion, and instant checkout
        const maxDim = 800;
        let exportW = origW;
        let exportH = origH;
        if (exportW > maxDim || exportH > maxDim) {
          if (exportW > exportH) {
            exportH = Math.round((exportH * maxDim) / exportW);
            exportW = maxDim;
          } else {
            exportW = Math.round((exportW * maxDim) / exportH);
            exportH = maxDim;
          }
        }

        let compressedUrl = rawData;
        try {
          const offCanvas = document.createElement('canvas');
          offCanvas.width = exportW;
          offCanvas.height = exportH;
          const offCtx = offCanvas.getContext('2d');
          if (offCtx) {
            offCtx.drawImage(img, 0, 0, exportW, exportH);
            compressedUrl = offCanvas.toDataURL(file.type === 'image/png' ? 'image/png' : 'image/jpeg', 0.85);
          }
        } catch (e) {
          console.warn('Image resize warning, using raw data:', e);
        }

        // Base display size on 2048 canvas maintaining strict natural aspect ratio
        let baseW = 380;
        let baseH = baseW / aspectRatio;

        if (baseH > 480) {
          baseH = 480;
          baseW = baseH * aspectRatio;
        }

        const newImgLayer: ImageLayer = {
          id: 'img-' + Date.now(),
          type: 'image',
          name: file.name.slice(0, 20),
          url: compressedUrl,
          naturalWidth: exportW,
          naturalHeight: exportH,
          aspectRatio,
          width: Math.round(baseW),
          height: Math.round(baseH),
          x: CANVAS_WIDTH / 2,
          y: CANVAS_HEIGHT / 2,
          rotation: 0,
          scale: 1,
          locked: false,
          visible: true,
          opacity: 1,
        };

        // Remove placeholder "YOUR LOGO" if present
        const cleanLayers = layers.filter((l) => !isPlaceholderTextLayer(l));
        const next = [...cleanLayers, newImgLayer];
        setLayers(next);
        setSelectedLayerId(newImgLayer.id);
        setActiveTab('upload');
        pushHistory(next);
      };
      img.src = rawData;
    };
    reader.readAsDataURL(file);
  };

  // Add Sticker Layer
  const handleAddStickerLayer = (stickerUrl: string, stickerName: string) => {
    const newStickerLayer: ImageLayer = {
      id: 'sticker-' + Date.now(),
      type: 'sticker',
      name: stickerName,
      url: stickerUrl,
      naturalWidth: 512,
      naturalHeight: 512,
      aspectRatio: 1,
      width: 260,
      height: 260,
      x: CANVAS_WIDTH / 2,
      y: CANVAS_HEIGHT / 2,
      rotation: 0,
      scale: 1,
      locked: false,
      visible: true,
      opacity: 1,
    };
    // Remove placeholder "YOUR LOGO" text layer if present so customer isn't charged text fee
    const cleanLayers = layers.filter((l) => !isPlaceholderTextLayer(l));
    const next = [...cleanLayers, newStickerLayer];
    setLayers(next);
    setSelectedLayerId(newStickerLayer.id);
    setActiveTab('stickers');
    pushHistory(next);
  };

  // Delete Layer
  const handleDeleteLayer = (id: string) => {
    const next = layers.filter((l) => l.id !== id);
    setLayers(next);
    if (selectedLayerId === id) {
      setSelectedLayerId(next.length > 0 ? next[next.length - 1].id : null);
    }
    pushHistory(next);
  };

  // Duplicate Layer
  const handleDuplicateLayer = (id: string) => {
    const target = layers.find((l) => l.id === id);
    if (!target) return;
    const clone = {
      ...JSON.parse(JSON.stringify(target)),
      id: 'clone-' + Date.now(),
      name: target.name + ' (Bản sao)',
      x: Math.min(CANVAS_WIDTH - 200, target.x + 40),
      y: Math.min(CANVAS_HEIGHT - 200, target.y + 40),
    };
    const next = [...layers, clone];
    setLayers(next);
    setSelectedLayerId(clone.id);
    pushHistory(next);
  };

  // Move Layer Order
  const handleMoveLayerOrder = (id: string, direction: 'up' | 'down') => {
    const idx = layers.findIndex((l) => l.id === id);
    if (idx === -1) return;
    if (direction === 'up' && idx < layers.length - 1) {
      const next = [...layers];
      const temp = next[idx];
      next[idx] = next[idx + 1];
      next[idx + 1] = temp;
      setLayers(next);
      pushHistory(next);
    } else if (direction === 'down' && idx > 0) {
      const next = [...layers];
      const temp = next[idx];
      next[idx] = next[idx - 1];
      next[idx - 1] = temp;
      setLayers(next);
      pushHistory(next);
    }
  };

  // Reset Design
  const handleResetDesign = () => {
    if (!confirm('Bạn có chắc muốn đặt lại toàn bộ thiết kế về ban đầu không?')) return;
    const initialLayers: DesignLayer[] = [
      {
        id: 'default-text-1',
        type: 'text',
        name: 'Logo mẫu',
        text: 'YOUR LOGO',
        font: "'Be Vietnam Pro', sans-serif",
        fontSize: 64,
        color: '#3A211E',
        isBold: true,
        align: 'center',
        x: CANVAS_WIDTH / 2,
        y: CANVAS_HEIGHT / 2,
        rotation: 0,
        scale: 1,
        locked: false,
        visible: true,
        opacity: 1,
        lineHeight: 1.25,
      },
    ];
    setLayers(initialLayers);
    setSelectedLayerId('default-text-1');
    pushHistory(initialLayers);
  };

  // Add to Cart
  const handleAddToCart = () => {
    if (selectedModel.isDemo || selectedModel.id === 'plastic_boba') {
      alert('Mẫu ly nhựa hiện đang là phiên bản Demo trải nghiệm thiết kế 3D. Cửa hàng chưa mở bán chính thức nên quý khách chưa thể đặt mua.');
      return;
    }

    setIsAddingToCart(true);

    // 1. Capture 3D Snapshot (Optimized lightweight 400x400 thumbnail)
    let snapshotImage = '/images/cupfy-hero.png';
    const canvasEl = canvasElementRef.current || document.querySelector('canvas');
    if (canvasEl) {
      try {
        const thumbCanvas = document.createElement('canvas');
        thumbCanvas.width = 400;
        thumbCanvas.height = 400;
        const thumbCtx = thumbCanvas.getContext('2d');
        if (thumbCtx) {
          thumbCtx.drawImage(canvasEl, 0, 0, 400, 400);
          snapshotImage = thumbCanvas.toDataURL('image/jpeg', 0.8);
        } else {
          snapshotImage = canvasEl.toDataURL('image/jpeg', 0.6);
        }
      } catch (e) {
        console.error('Error capturing 3D canvas:', e);
      }
    }

    // 2. Export High Resolution 2D Flat Sheet for production printing
    const flatPrintSheet = exportFlatPrintSheet();

    // 3. Summaries for display in order tables
    const textLayers = layers.filter((l) => l.type === 'text') as TextLayer[];
    const imgLayers = layers.filter((l) => l.type === 'image' || l.type === 'sticker') as ImageLayer[];
    const mainText = textLayers.map((t) => t.text).join(' | ') || '';
    const mainFont = textLayers[0]?.font || 'Be Vietnam Pro';
    const mainColor = textLayers[0]?.color || '#3A211E';

    // Match with real DB product if available
    const matchedDbProd = findMatchedDbProduct(selectedModel, dbProducts);

    const price = pricingBreakdown.totalPrice;
    const productName = matchedDbProd
      ? `${matchedDbProd.name} (Custom Studio)`
      : `${selectedModel.name} (Custom Studio)`;

    setTimeout(() => {
      cartStore.addItem({
        id: 'custom-' + Date.now(),
        name: productName,
        price,
        quantity: 1,
        image: snapshotImage,
        isCustom: true,
        customSpecs: {
          version: '2.0',
          baseProductId: matchedDbProd ? matchedDbProd.id : null,
          modelType: selectedModel.id,
          modelName: selectedModel.name,
          basePrice: pricingBreakdown.baseCupPrice,
          textFee: pricingBreakdown.textFee,
          imageFee: pricingBreakdown.imageFee,
          stickerFee: pricingBreakdown.stickerFee,
          addons: pricingBreakdown.selectedAddons.map((a) => ({
            id: a.id,
            name: a.name,
            price: a.price,
            note: a.note || '',
          })),
          category: selectedModel.category,
          capacity: selectedModel.capacity,
          heightMm: selectedModel.heightMm,
          diameterMm: selectedModel.diameterMm,
          cupColor: selectedColor.color,
          cupColorName: selectedColor.name,
          glassTint: selectedColor.glassTint,
          lidColor: selectedModel.id === 'plastic_boba' ? lidColor : undefined,
          strawColor: selectedModel.id === 'plastic_boba' ? '#FFFFFF' : undefined,
          customText: mainText,
          textColor: mainColor,
          font: mainFont,
          uploadedImage: imgLayers[0]?.url || '',
          originalImage: '',
          printableTexture: flatPrintSheet,
          previewImage: snapshotImage,
          layers: JSON.parse(JSON.stringify(layers)),
          safeZoneCompliant: !isOutOfSafeZone,
        },
      });

      router.push('/cart');
    }, 600);
  };

  // Pricing calculation (Real-time dynamic breakdown)
  const pricingBreakdown: StudioPricingBreakdown = React.useMemo(() => {
    const isDemo = selectedModel.isDemo || selectedModel.id === 'plastic_boba';
    const matchedDbProd = isDemo ? null : findMatchedDbProduct(selectedModel, dbProducts);
    const baseCupPrice = isDemo ? 0 : (matchedDbProd ? matchedDbProd.price : selectedModel.defaultPrice);

    const textLayers = layers.filter((l) => l.type === 'text');
    const imageLayers = layers.filter((l) => l.type === 'image');
    const stickerLayers = layers.filter((l) => l.type === 'sticker');

    const hasText = textLayers.length > 0;
    const hasImage = imageLayers.length > 0;
    const hasSticker = stickerLayers.length > 0;

    // In chữ / Khắc tên: 15.000₫ nếu có chữ
    const textFee = hasText ? 15000 : 0;

    // In hình ảnh / Logo: 20.000₫ nếu có ảnh
    const imageFee = hasImage ? 20000 : 0;

    // Sticker: Đã bao gồm trong phí in chữ (nếu có chữ thì 0₫, nếu chỉ có sticker thì +15.000₫)
    const stickerFee = !hasText && hasSticker ? 15000 : 0;

    const selectedAddons = addons.filter((a) => a.selected);
    const addonsTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);

    const totalPrice = baseCupPrice + textFee + imageFee + stickerFee + addonsTotal;

    return {
      baseCupPrice,
      modelName: selectedModel.name,
      hasText,
      textCount: textLayers.length,
      textFee,
      hasImage,
      imageCount: imageLayers.length,
      imageFee,
      hasSticker,
      stickerCount: stickerLayers.length,
      stickerFee,
      selectedAddons,
      addonsTotal,
      totalPrice,
    };
  }, [dbProducts, selectedModel, layers, addons]);

  const formatVND = (num: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
  };

  return (
    <div className="flex flex-col h-screen w-full bg-white text-[#3A211E] overflow-hidden select-none font-sans">
      {/* Preload all 22 Vietnamese Google Fonts */}
      <link rel="stylesheet" href={GOOGLE_FONTS_URL} />

      {/* TOP NAVIGATION BAR */}
      <header className="h-16 bg-white border-b border-[#E8DFD8] flex items-center justify-between px-3 sm:px-4 md:px-6 z-20 shrink-0 shadow-xs gap-2">
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <Link
            href="/"
            className="p-2 hover:bg-[#FFF9E8] rounded-full transition-colors text-[#3A211E]"
            title="Quay lại trang chủ"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div className="h-6 w-px bg-[#E8DFD8]"></div>
          <div className="flex items-center gap-2">
            <span className="font-black text-sm md:text-base text-[#3A211E] tracking-tight whitespace-nowrap">
              CUPFY 3D STUDIO
            </span>
            <span className="bg-[#FFF9E8] text-[#3A211E] border border-[#E8DFD8] px-2.5 py-0.5 rounded-full text-[11px] font-bold whitespace-nowrap">
              {selectedModel.name}
            </span>
          </div>
        </div>

        {/* Center: Undo / Redo & View Mode Switches */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Undo / Redo buttons */}
          <div className="flex items-center bg-[#FFF9E8] border border-[#E8DFD8] rounded-xl p-1 gap-1">
            <button
              onClick={handleUndo}
              disabled={!canUndo}
              title="Hoàn tác (Ctrl+Z)"
              className={`p-1.5 rounded-lg transition-colors ${
                canUndo
                  ? 'hover:bg-white text-[#3A211E] shadow-xs'
                  : 'text-neutral-300 cursor-not-allowed'
              }`}
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleRedo}
              disabled={!canRedo}
              title="Làm lại (Ctrl+Y)"
              className={`p-1.5 rounded-lg transition-colors ${
                canRedo
                  ? 'hover:bg-white text-[#3A211E] shadow-xs'
                  : 'text-neutral-300 cursor-not-allowed'
              }`}
            >
              <Redo2 className="w-4 h-4" />
            </button>
            <div className="w-px h-4 bg-[#E8DFD8] mx-0.5"></div>
            <button
              onClick={handleResetDesign}
              title="Đặt lại thiết kế"
              className="p-1.5 hover:bg-white text-[#765B52] hover:text-[#3A211E] rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* View Modes (Studio / White / Transparent) */}
          <div className="hidden xl:flex items-center bg-[#FFF9E8] border border-[#E8DFD8] rounded-xl p-1 text-xs font-bold text-[#765B52]">
            <button
              onClick={() => setViewMode('studio')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'studio'
                  ? 'bg-[#FFBF00] text-[#3A211E] shadow-xs'
                  : 'hover:text-[#3A211E]'
              }`}
            >
              Studio Bàn Trắng
            </button>
            <button
              onClick={() => setViewMode('white')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'white'
                  ? 'bg-[#FFBF00] text-[#3A211E] shadow-xs'
                  : 'hover:text-[#3A211E]'
              }`}
            >
              Nền Trắng Tinh
            </button>
            <button
              onClick={() => setViewMode('transparent')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'transparent'
                  ? 'bg-[#FFBF00] text-[#3A211E] shadow-xs'
                  : 'hover:text-[#3A211E]'
              }`}
            >
              Nền Trong Suốt
            </button>
          </div>

          {/* Safe Zone Toggle */}
          <button
            onClick={() => setShowSafeZone(!showSafeZone)}
            title="Bật/Tắt đường hướng dẫn vùng in an toàn"
            className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-colors ${
              showSafeZone
                ? 'bg-[#FFF3C4] border-[#FFBF00] text-[#3A211E]'
                : 'bg-white border-[#E8DFD8] text-[#765B52] hover:text-[#3A211E]'
            }`}
          >
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>Vùng In</span>
          </button>
        </div>

        {/* Right: Price & Add To Cart Button */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          <button
            onClick={() => setIsMobilePricingOpen(true)}
            className="text-right flex flex-col items-end cursor-pointer group whitespace-nowrap"
            title="Nhấn để xem chi tiết chi phí và phụ kiện"
          >
            <div className="text-[10px] text-[#765B52] font-bold group-hover:text-[#FFBF00] transition-colors flex items-center gap-1">
              <span>GIÁ THIẾT KẾ</span>
              <Gift className="w-3 h-3 text-[#FFBF00]" />
            </div>
            {isDemoCup ? (
              <span className="text-xs font-black text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">
                Bản Demo
              </span>
            ) : (
              <div className="text-sm md:text-base font-black text-[#3A211E] group-hover:text-[#FFBF00] transition-colors">
                {formatVND(pricingBreakdown.totalPrice)}
              </div>
            )}
          </button>

          {/* Nút Gửi tặng bạn bè (Demo) */}
          <button
            type="button"
            onClick={() => setIsGiftModalOpen(true)}
            className="px-2.5 sm:px-3 md:px-3.5 py-2 bg-[#FFF9E8] hover:bg-[#FFF3C4] text-[#3A211E] border border-amber-300 rounded-full font-extrabold text-xs flex items-center gap-1.5 shadow-xs transition-all active:scale-95 cursor-pointer whitespace-nowrap shrink-0"
            title="Tạo liên kết mở hộp quà 3D gửi tặng bạn bè (Demo)"
          >
            <Gift className="w-3.5 h-3.5 text-[#FFBF00]" />
            <span className="hidden md:inline">Gửi tặng bạn bè</span>
            <span className="px-1.5 py-0.2 rounded-full bg-amber-200 text-[#3A211E] text-[9px] font-black uppercase">
              Demo
            </span>
          </button>

          {isDemoCup ? (
            <button
              type="button"
              onClick={() => {
                alert('Mẫu ly nhựa hiện đang là phiên bản Demo trải nghiệm thiết kế 3D. Cửa hàng chưa mở bán chính thức nên quý khách chưa thể thêm vào giỏ hàng. Bạn vẫn có thể trải nghiệm thiết kế và gửi tặng quà ảo 3D!');
              }}
              className="px-3 sm:px-3.5 py-2.5 bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 rounded-full font-black text-xs flex items-center gap-1.5 transition-all cursor-not-allowed whitespace-nowrap shrink-0 shadow-xs"
              title="Mẫu demo trải nghiệm, chưa mở bán"
            >
              <span>MẪU DEMO (CHƯA BÁN)</span>
            </button>
          ) : (
            <button
              onClick={handleAddToCart}
              disabled={isAddingToCart}
              className="px-3.5 sm:px-4 md:px-5 py-2.5 bg-[#FFBF00] text-[#3A211E] rounded-full font-black text-xs md:text-sm flex items-center gap-1.5 sm:gap-2 hover:bg-[#FFD147] shadow-md transition-all disabled:opacity-70 active:scale-95 border border-[#FFBF00] cursor-pointer whitespace-nowrap shrink-0"
            >
              {isAddingToCart ? (
                <>
                  <Check className="w-4 h-4 text-[#3A211E]" />
                  <span>ĐANG LƯU...</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4 shrink-0" />
                  <span>THÊM VÀO GIỎ</span>
                </>
              )}
            </button>
          )}
        </div>
      </header>

      {/* MAIN STUDIO WORKSPACE */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Toolbar & Properties Drawer */}
        <div
          className={`h-full z-10 transition-transform duration-300 md:translate-x-0 ${
            isMobilePanelOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }`}
        >
          <StudioToolbar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            selectedModel={selectedModel}
            setSelectedModel={handleSelectModel}
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
            lidColor={lidColor}
            setLidColor={setLidColor}
            layers={layers}
            selectedLayerId={selectedLayerId}
            setSelectedLayerId={setSelectedLayerId}
            onUpdateLayer={handleUpdateLayer}
            onAddTextLayer={handleAddTextLayer}
            onAddImageLayer={handleAddImageLayer}
            onAddStickerLayer={handleAddStickerLayer}
            onDeleteLayer={handleDeleteLayer}
            onDuplicateLayer={handleDuplicateLayer}
            onMoveLayerOrder={handleMoveLayerOrder}
            formatVND={formatVND}
            addons={addons}
            onToggleAddon={handleToggleAddon}
            onUpdateAddonNote={handleUpdateAddonNote}
            pricing={pricingBreakdown}
            dbProducts={dbProducts}
          />
        </div>

        {/* Mobile Toggle Button for Pricing & Accessories */}
        <button
          onClick={() => setIsMobilePricingOpen(true)}
          className="lg:hidden absolute bottom-6 left-6 z-30 p-3 bg-[#FFBF00] text-[#3A211E] rounded-full shadow-xl flex items-center gap-2 text-xs font-black border border-amber-300 active:scale-95 cursor-pointer"
        >
          <Gift className="w-4 h-4" />
          <span>Báo giá & Phụ kiện</span>
        </button>

        {/* Mobile Toggle Button for Drawer */}
        <button
          onClick={() => setIsMobilePanelOpen(!isMobilePanelOpen)}
          className="md:hidden absolute bottom-6 right-6 z-30 p-3 bg-[#3A211E] text-white rounded-full shadow-xl flex items-center gap-2 text-xs font-bold active:scale-95 cursor-pointer"
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>{isMobilePanelOpen ? 'Ẩn Công Cụ' : 'Mở Công Cụ'}</span>
        </button>

        {/* 3D Scene Viewport */}
        <main className="flex-1 h-full relative overflow-hidden bg-white">
          <StudioScene
            modelDef={selectedModel}
            selectedColor={selectedColor}
            lidColor={lidColor}
            canvasTexture={texture}
            viewMode={viewMode}
            showSafeZone={showSafeZone}
            isAutoRotating={isAutoRotating}
            setIsAutoRotating={setIsAutoRotating}
            onCanvasReady={(c) => {
              canvasElementRef.current = c;
            }}
          />

          {/* Out of Safe Zone Warning Toast */}
          {isOutOfSafeZone && (
            <div className="absolute top-16 left-1/2 -translate-x-1/2 z-20 bg-amber-500/95 text-white px-4 py-2 rounded-2xl shadow-lg border border-amber-600 backdrop-blur-md flex items-center gap-2 text-xs font-bold animate-bounce">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>
                Cảnh báo: Một số nội dung đang vượt quá vùng in an toàn (15mm mép ly). Hãy căn chỉnh lại để sản phẩm in ra đẹp nhất!
              </span>
            </div>
          )}
        </main>

        {/* Right Sidebar: StudioPricingSidebar (Desktop: lg+) */}
        <div className="hidden lg:flex h-full w-80 xl:w-88 border-l border-[#E8DFD8] bg-white z-10 shrink-0 flex-col">
          <StudioPricingSidebar
            selectedModel={selectedModel}
            layers={layers}
            selectedLayerId={selectedLayerId}
            onUpdateLayer={handleUpdateLayer}
            onDeleteLayer={handleDeleteLayer}
            isOutOfSafeZone={isOutOfSafeZone}
            addons={addons}
            onToggleAddon={handleToggleAddon}
            onUpdateAddonNote={handleUpdateAddonNote}
            pricing={pricingBreakdown}
            onAddToCart={handleAddToCart}
            isAddingToCart={isAddingToCart}
            formatVND={formatVND}
            onOpenGiftModal={() => setIsGiftModalOpen(true)}
          />
        </div>

        {/* Mobile Slide-up Drawer for Pricing & Addons */}
        {isMobilePricingOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex flex-col justify-end animate-in fade-in duration-150">
            <div className="bg-white rounded-t-3xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-200">
              <StudioPricingSidebar
                selectedModel={selectedModel}
                layers={layers}
                selectedLayerId={selectedLayerId}
                onUpdateLayer={handleUpdateLayer}
                onDeleteLayer={handleDeleteLayer}
                isOutOfSafeZone={isOutOfSafeZone}
                addons={addons}
                onToggleAddon={handleToggleAddon}
                onUpdateAddonNote={handleUpdateAddonNote}
                pricing={pricingBreakdown}
                onAddToCart={handleAddToCart}
                isAddingToCart={isAddingToCart}
                formatVND={formatVND}
                onCloseMobile={() => setIsMobilePricingOpen(false)}
                onOpenGiftModal={() => {
                  setIsMobilePricingOpen(false);
                  setIsGiftModalOpen(true);
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Gift Creation Modal (Tặng quà tương tác Demo) */}
      <GiftCreationModal
        isOpen={isGiftModalOpen}
        onClose={() => setIsGiftModalOpen(false)}
        modelId={selectedModel.id}
        cupColor={selectedColor}
        lidColor={lidColor}
        layers={layers}
        previewImage={get3DSnapshot()}
      />
    </div>
  );
}

export default function CustomCupStudioPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-full items-center justify-center bg-white">
          <div className="w-10 h-10 border-4 border-[#E8DFD8] border-t-[#FFBF00] rounded-full animate-spin"></div>
        </div>
      }
    >
      <CustomCupStudioInner />
    </Suspense>
  );
}
