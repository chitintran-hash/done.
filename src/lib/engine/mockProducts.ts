export type ProductCategory = 'desk' | 'chair' | 'monitor_arm' | 'lamp' | 'accessory';
export type StylePreference = 'minimal' | 'gaming' | 'ergonomic' | 'productivity';

export interface ProductSpecs {
  width?: number; // cm
  depth?: number; // cm
  height?: number; // cm
  maxLoad?: number; // kg (for arm or desk)
  vesaSupported?: boolean; // for arm
  clampThicknessMax?: number; // cm (for arm)
  deskThickness?: number; // cm (for desk)
  style: StylePreference[];
}

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  image: string;
  specs: ProductSpecs;
  description: string;
  isAvailable: boolean;
}

export const mockProducts: Product[] = [
  // --- DESKS ---
  {
    id: 'd1',
    name: 'Bàn Tối Giản DONE. Basic 100cm',
    category: 'desk',
    price: 850000,
    image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=400&q=80',
    description: 'Bàn làm việc cơ bản, nhỏ gọn cho không gian hẹp.',
    specs: { width: 100, depth: 60, height: 75, deskThickness: 1.5, maxLoad: 50, style: ['minimal', 'productivity'] },
    isAvailable: true
  },
  {
    id: 'd2',
    name: 'Bàn Nâng Hạ Ergonomic Pro 120cm',
    category: 'desk',
    price: 4500000,
    image: 'https://images.unsplash.com/photo-1595514535315-2207905f0376?auto=format&fit=crop&w=400&q=80',
    description: 'Bàn nâng hạ thông minh, bảo vệ cột sống.',
    specs: { width: 120, depth: 70, height: 120, deskThickness: 2.5, maxLoad: 100, style: ['ergonomic', 'productivity'] },
    isAvailable: true
  },
  {
    id: 'd3',
    name: 'Bàn Gaming Z-Core 140cm',
    category: 'desk',
    price: 2200000,
    image: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&w=400&q=80',
    description: 'Bàn chữ Z chắc chắn, mặt carbon.',
    specs: { width: 140, depth: 60, height: 75, deskThickness: 1.8, maxLoad: 80, style: ['gaming'] },
    isAvailable: true
  },
  {
    id: 'd4',
    name: 'Bàn Sinh Viên Tiết Kiệm 80cm',
    category: 'desk',
    price: 450000,
    image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=400&q=80',
    description: 'Giải pháp siêu rẻ cho không gian trọ nhỏ.',
    specs: { width: 80, depth: 50, height: 75, deskThickness: 1.5, maxLoad: 30, style: ['minimal'] },
    isAvailable: true
  },
  
  // --- CHAIRS ---
  {
    id: 'c1',
    name: 'Ghế Xoay Lưới Văn Phòng Basic',
    category: 'chair',
    price: 650000,
    image: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&w=400&q=80',
    description: 'Ghế xoay lưng lưới thoáng mát.',
    specs: { style: ['minimal', 'productivity'] },
    isAvailable: true
  },
  {
    id: 'c2',
    name: 'Ghế Ergonomic Butterfly V2',
    category: 'chair',
    price: 3500000,
    image: 'https://images.unsplash.com/photo-1595514535315-2207905f0376?auto=format&fit=crop&w=400&q=80',
    description: 'Ghế công thái học hỗ trợ thắt lưng 5 chiều.',
    specs: { style: ['ergonomic', 'productivity'] },
    isAvailable: true
  },
  {
    id: 'c3',
    name: 'Ghế Gaming Titan X',
    category: 'chair',
    price: 2800000,
    image: 'https://images.unsplash.com/photo-1595514535315-2207905f0376?auto=format&fit=crop&w=400&q=80',
    description: 'Ghế gaming da PU cao cấp.',
    specs: { style: ['gaming'] },
    isAvailable: true
  },

  // --- MONITOR ARMS ---
  {
    id: 'a1',
    name: 'Giá đỡ màn hình NB F80 (17-30 inch)',
    category: 'monitor_arm',
    price: 350000,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=400&q=80',
    description: 'Tay đỡ màn hình quốc dân, siêu rẻ.',
    specs: { maxLoad: 9, vesaSupported: true, clampThicknessMax: 9, style: ['productivity', 'gaming', 'minimal', 'ergonomic'] },
    isAvailable: true
  },
  {
    id: 'a2',
    name: 'Arm Màn Hình Heavy Duty T9 (Đến 40 inch)',
    category: 'monitor_arm',
    price: 1200000,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=400&q=80',
    description: 'Tay đỡ siêu trọng cho màn hình to, màn hình cong.',
    specs: { maxLoad: 18, vesaSupported: true, clampThicknessMax: 10, style: ['ergonomic', 'productivity'] },
    isAvailable: true
  },

  // --- LAMPS ---
  {
    id: 'l1',
    name: 'Đèn bàn LED chống cận Minimal',
    category: 'lamp',
    price: 250000,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=400&q=80',
    description: 'Đèn LED 3 chế độ sáng.',
    specs: { style: ['minimal', 'productivity'] },
    isAvailable: true
  },
  {
    id: 'l2',
    name: 'Đèn treo màn hình (Monitor Light Bar)',
    category: 'lamp',
    price: 850000,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=400&q=80',
    description: 'Tiết kiệm không gian bàn làm việc, không chói mắt.',
    specs: { style: ['ergonomic', 'productivity', 'gaming'] },
    isAvailable: true
  },
  {
    id: 'l3',
    name: 'Đèn LED RGB dán cạnh bàn',
    category: 'lamp',
    price: 150000,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=400&q=80',
    description: 'Đèn viền trang trí.',
    specs: { style: ['gaming'] },
    isAvailable: true
  },

  // --- ACCESSORIES ---
  {
    id: 'acc1',
    name: 'Khay quản lý dây điện dưới bàn',
    category: 'accessory',
    price: 180000,
    image: 'https://images.unsplash.com/photo-1542385151-efd9000785a0?auto=format&fit=crop&w=400&q=80',
    description: 'Giấu dây điện gọn gàng.',
    specs: { style: ['minimal', 'productivity', 'ergonomic', 'gaming'] },
    isAvailable: true
  },
  {
    id: 'acc2',
    name: 'Giá đỡ Laptop Nhôm Tản Nhiệt',
    category: 'accessory',
    price: 320000,
    image: 'https://images.unsplash.com/photo-1542385151-efd9000785a0?auto=format&fit=crop&w=400&q=80',
    description: 'Nâng cao màn hình laptop, chống mỏi cổ.',
    specs: { style: ['ergonomic', 'productivity', 'minimal'] },
    isAvailable: true
  },
  {
    id: 'acc3',
    name: 'Pad Chuột Cỡ Lớn (90x40cm)',
    category: 'accessory',
    price: 120000,
    image: 'https://images.unsplash.com/photo-1542385151-efd9000785a0?auto=format&fit=crop&w=400&q=80',
    description: 'Lót chuột bao phủ bàn.',
    specs: { style: ['gaming', 'productivity'] },
    isAvailable: true
  }
];
