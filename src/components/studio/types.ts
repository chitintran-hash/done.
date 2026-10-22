export type LayerType = 'text' | 'image' | 'sticker';

export interface BaseLayer {
  id: string;
  type: LayerType;
  name: string;
  x: number; // 0 to 2048 (horizontal wrap around cup)
  y: number; // 0 to 1024 (vertical along cup height)
  rotation: number; // in degrees
  scale: number;
  locked: boolean;
  visible: boolean;
  opacity: number;
}

export interface TextLayer extends BaseLayer {
  type: 'text';
  text: string;
  font: string; // Font family
  fontSize: number;
  color: string;
  isBold?: boolean;
  isItalic?: boolean;
  align: 'left' | 'center' | 'right';
  letterSpacing?: number;
  lineHeight?: number;
}

export interface ImageLayer extends BaseLayer {
  type: 'image' | 'sticker';
  url: string;
  originalFile?: string; // High-res base64 data kept untouched for production
  naturalWidth: number;
  naturalHeight: number;
  aspectRatio: number; // strictly locked width / height
  width: number;
  height: number;
}

export type DesignLayer = TextLayer | ImageLayer;

export type StudioViewMode = 'studio' | 'white' | 'transparent';

export interface CupModelDef {
  id: string;
  name: string;
  subtitle: string;
  category: 'glass' | 'plastic';
  defaultPrice: number;
  capacity: string;
  heightMm: string;
  diameterMm: string;
  hasLid: boolean;
  hasHandle: boolean;
  isParametric: boolean;
  isDemo?: boolean;
  // Dimensions for printable overlay sleeve matching physical profile
  sleeve: {
    radiusTop: number;
    radiusBottom: number;
    height: number;
    y: number;
  };
}

export interface CupColorOption {
  id: string;
  name: string;
  color: string;
  glassTint: string;
  isFrosted?: boolean;
  isCeramic?: boolean;
}

export interface StudioAddon {
  id: string;
  name: string;
  price: number;
  description: string;
  selected: boolean;
  note?: string;
}

export interface StudioPricingBreakdown {
  baseCupPrice: number;
  modelName: string;
  hasText: boolean;
  textCount: number;
  textFee: number;
  hasImage: boolean;
  imageCount: number;
  imageFee: number;
  hasSticker: boolean;
  stickerCount: number;
  stickerFee: number;
  selectedAddons: StudioAddon[];
  addonsTotal: number;
  totalPrice: number;
}
