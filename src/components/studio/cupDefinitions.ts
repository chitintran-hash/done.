import { CupModelDef, CupColorOption } from './types';

export const CUP_MODELS: CupModelDef[] = [
  {
    id: 'glass_tall',
    name: 'Ly Thuỷ Tinh Cao',
    subtitle: 'Dáng Highball thon cao, đáy kính đúc nguyên khối dày dặn',
    category: 'glass',
    defaultPrice: 40000,
    capacity: '350ml',
    heightMm: '155 mm',
    diameterMm: '68 mm',
    hasLid: false,
    hasHandle: false,
    isParametric: true,
    sleeve: {
      radiusTop: 1.25,
      radiusBottom: 1.10,
      height: 3.0,
      y: 2.3
    }
  },
  {
    id: 'glass_mug',
    name: 'Ly Thuỷ Tinh Có Quai',
    subtitle: 'Quai cầm thủy tinh đúc liền khối, thành ly chịu lực tốt',
    category: 'glass',
    defaultPrice: 60000,
    capacity: '400ml',
    heightMm: '130 mm',
    diameterMm: '78 mm',
    hasLid: false,
    hasHandle: true,
    isParametric: true,
    sleeve: {
      radiusTop: 1.35,
      radiusBottom: 1.35,
      height: 2.2,
      y: 1.7
    }
  },
  {
    id: 'glass_can',
    name: 'Ly Thuỷ Tinh Cỡ Trung',
    subtitle: 'Dáng Tumbler thon vừa tay, đáy kính đúc nguyên khối dày dặn',
    category: 'glass',
    defaultPrice: 45000,
    capacity: '380ml',
    heightMm: '135 mm',
    diameterMm: '75 mm',
    hasLid: false,
    hasHandle: false,
    isParametric: true,
    sleeve: {
      radiusTop: 1.37,
      radiusBottom: 1.18,
      height: 2.75,
      y: 2.02
    }
  },
  {
    id: 'glass_rocks',
    name: 'Ly Thuỷ Tinh Thấp (Nhỏ)',
    subtitle: 'Dáng Tumbler tròn thấp, đáy đúc nguyên khối dày dặn',
    category: 'glass',
    defaultPrice: 29000,
    capacity: '250ml',
    heightMm: '95 mm',
    diameterMm: '76 mm',
    hasLid: false,
    hasHandle: false,
    isParametric: true,
    sleeve: {
      radiusTop: 1.36,
      radiusBottom: 1.22,
      height: 2.45,
      y: 1.88
    }
  },
  {
    id: 'plastic_boba',
    name: 'Ly Nhựa Có Nắp & Ống Hút',
    subtitle: 'Nhựa cao cấp tái sử dụng (BPA-Free), kèm nắp vòm & ống hút',
    category: 'plastic',
    defaultPrice: 35000,
    capacity: '500ml',
    heightMm: '165 mm',
    diameterMm: '90 mm',
    hasLid: true,
    hasHandle: false,
    isParametric: true,
    sleeve: {
      radiusTop: 1.52,
      radiusBottom: 1.20,
      height: 3.1,
      y: 2.05
    }
  }
];

export const CLEAR_GLASS_COLOR: CupColorOption = {
  id: 'clear',
  name: 'Pha Lê Trong Suốt',
  color: '#FFFFFF',
  glassTint: '#ffffff',
};

export const PLASTIC_COLOR_OPTIONS: CupColorOption[] = [
  { id: 'white', name: 'Trắng Tinh Khiết', color: '#FFFFFF', glassTint: '#ffffff' },
  { id: 'black', name: 'Đen Mờ Huyền Bí', color: '#18181B', glassTint: '#18181b' },
  { id: 'cream', name: 'Vàng Kem Pastel', color: '#FFF3A6', glassTint: '#fff3a6' },
  { id: 'sky', name: 'Xanh Pastel', color: '#BFDCEF', glassTint: '#bfdcef' },
  { id: 'matcha', name: 'Xanh Matcha', color: '#BFE5D0', glassTint: '#bfe5d0' },
  { id: 'lavender', name: 'Tím Lavender', color: '#DCD1FF', glassTint: '#dcd1ff' },
  { id: 'pink', name: 'Hồng Baby', color: '#FBCFE8', glassTint: '#fbcfe8' },
  { id: 'coffee', name: 'Nâu Cà Phê', color: '#4A2A25', glassTint: '#4a2a25' }
];

export const CUP_COLOR_OPTIONS: CupColorOption[] = [
  CLEAR_GLASS_COLOR,
  ...PLASTIC_COLOR_OPTIONS
];

export const LID_COLOR_OPTIONS = [
  { id: 'cream', name: 'Vàng Kem', color: '#FFF3A6' },
  { id: 'coffee', name: 'Nâu Cà Phê', color: '#4A2A25' },
  { id: 'sky', name: 'Xanh Pastel', color: '#BFDCEF' },
  { id: 'matcha', name: 'Xanh Matcha', color: '#BFE5D0' },
  { id: 'lavender', name: 'Tím Lavender', color: '#DCD1FF' },
  { id: 'black', name: 'Đen Mờ', color: '#18181B' },
  { id: 'white', name: 'Trắng Tinh', color: '#FFFFFF' }
];

export const PRESET_STICKERS = [
  { id: 'coffee-cup', name: 'Ly Cà Phê', url: 'https://cdn-icons-png.flaticon.com/512/1047/1047503.png' },
  { id: 'cat-smile', name: 'Mèo Dễ Thương', url: 'https://cdn-icons-png.flaticon.com/512/616/616430.png' },
  { id: 'daisy', name: 'Hoa Cúc Nhỏ', url: 'https://cdn-icons-png.flaticon.com/512/1087/1087420.png' },
  { id: 'heart', name: 'Trái Tim Yêu Thương', url: 'https://cdn-icons-png.flaticon.com/512/833/833472.png' },
  { id: 'star', name: 'Ngôi Sao Lấp Lánh', url: 'https://cdn-icons-png.flaticon.com/512/118/118669.png' },
  { id: 'smile', name: 'Mặt Cười Tích Cực', url: 'https://cdn-icons-png.flaticon.com/512/742/742751.png' },
  { id: 'tea-leaf', name: 'Mầm Lá Trà', url: 'https://cdn-icons-png.flaticon.com/512/628/628283.png' },
  { id: 'croissant', name: 'Bánh Sừng Bò', url: 'https://cdn-icons-png.flaticon.com/512/3014/3014521.png' }
];
