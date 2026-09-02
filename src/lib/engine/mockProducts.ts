export type ProductCategory = 'desk' | 'chair' | 'monitor_arm' | 'desk_lamp' | 'cable_management';
export type StylePreference = 'minimal' | 'gaming' | 'ergonomic' | 'productivity';
export type DataValue<T> = T | 'N/A' | 'MISSING';

export interface ProductSpecs {
  // Dimensions
  width: DataValue<number>; // cm
  depth: DataValue<number>; // cm
  height: DataValue<number>; // cm
  
  // Specific properties
  maxLoad: DataValue<number>; // kg (for arm or desk)
  vesaSupported: DataValue<string[]>; // for arm (e.g. ['75x75', '100x100'])
  supportedMonitorSize: DataValue<number>; // max inches (for arm)
  clampThicknessMax: DataValue<number>; // cm (for arm, cable management)
  deskThickness: DataValue<number>; // cm (for desk)
  
  style: StylePreference[];
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  brand: string;
  category: ProductCategory;
  price: number;
  image: string;
  specs: ProductSpecs;
  description: string;
  isAvailable: boolean;
  sellerId: string;
  deliveryDays: number;
}

export const mockProducts: Product[] = [
  // --- DESKS (2 SKUs) ---
  {
    id: 'd1', sku: 'SKU-D-01',
    name: 'Bàn Nâng Hạ Ergonomic Sihoo', brand: 'Sihoo', sellerId: 'seller-siliconz',
    category: 'desk', price: 4500000,
    image: 'https://images.unsplash.com/photo-1595514535315-2207905f0376?auto=format&fit=crop&w=400&q=80',
    description: 'Bàn nâng hạ thông minh, bảo vệ cột sống, động cơ kép.',
    isAvailable: true, deliveryDays: 2,
    specs: {
      width: 140, depth: 70, height: 'N/A', 
      deskThickness: 2.5, maxLoad: 120, 
      vesaSupported: 'N/A', supportedMonitorSize: 'N/A', clampThicknessMax: 'N/A',
      style: ['ergonomic', 'productivity']
    }
  },
  {
    id: 'd2', sku: 'SKU-D-02',
    name: 'Bàn Gỗ Tối Giản IKEA Linnmon', brand: 'IKEA', sellerId: 'seller-ikea-vn',
    category: 'desk', price: 850000,
    image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=400&q=80',
    description: 'Bàn làm việc cơ bản, nhỏ gọn cho không gian hẹp.',
    isAvailable: true, deliveryDays: 5,
    specs: {
      width: 100, depth: 60, height: 74, 
      deskThickness: 1.5, maxLoad: 50, 
      vesaSupported: 'N/A', supportedMonitorSize: 'N/A', clampThicknessMax: 'N/A',
      style: ['minimal', 'productivity']
    }
  },
  
  // --- CHAIRS (2 SKUs) ---
  {
    id: 'c1', sku: 'SKU-C-01',
    name: 'Ghế Công Thái Học Herman Miller Aeron', brand: 'Herman Miller', sellerId: 'seller-siliconz',
    category: 'chair', price: 25000000,
    image: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&w=400&q=80',
    description: 'Ghế công thái học cao cấp nhất thế giới.',
    isAvailable: true, deliveryDays: 3,
    specs: {
      width: 68, depth: 60, height: 'N/A', 
      deskThickness: 'N/A', maxLoad: 150, 
      vesaSupported: 'N/A', supportedMonitorSize: 'N/A', clampThicknessMax: 'N/A',
      style: ['ergonomic', 'productivity']
    }
  },
  {
    id: 'c2', sku: 'SKU-C-02',
    name: 'Ghế Xoay Lưới Văn Phòng Basic', brand: 'Hòa Phát', sellerId: 'seller-hoaphat',
    category: 'chair', price: 650000,
    image: 'https://images.unsplash.com/photo-1595514535315-2207905f0376?auto=format&fit=crop&w=400&q=80',
    description: 'Ghế xoay lưng lưới thoáng mát, giá rẻ.',
    isAvailable: true, deliveryDays: 1,
    specs: {
      width: 55, depth: 50, height: 'N/A', 
      deskThickness: 'N/A', maxLoad: 90, 
      vesaSupported: 'N/A', supportedMonitorSize: 'N/A', clampThicknessMax: 'N/A',
      style: ['minimal', 'productivity']
    }
  },

  // --- MONITOR ARMS (2 SKUs) ---
  {
    id: 'a1', sku: 'SKU-A-01',
    name: 'Giá đỡ màn hình NB F80', brand: 'North Bayou', sellerId: 'seller-gearvn',
    category: 'monitor_arm', price: 350000,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=400&q=80',
    description: 'Tay đỡ màn hình quốc dân, siêu rẻ, hỗ trợ tốt.',
    isAvailable: true, deliveryDays: 2,
    specs: {
      width: 'N/A', depth: 'N/A', height: 'N/A', 
      deskThickness: 'N/A', maxLoad: 9, 
      vesaSupported: ['75x75', '100x100'], supportedMonitorSize: 30, clampThicknessMax: 9,
      style: ['productivity', 'gaming', 'minimal', 'ergonomic']
    }
  },
  {
    id: 'a2', sku: 'SKU-A-02',
    name: 'Arm Màn Hình Heavy Duty T9', brand: 'Human Motion', sellerId: 'seller-siliconz',
    category: 'monitor_arm', price: 1200000,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=400&q=80',
    description: 'Tay đỡ siêu trọng cho màn hình to, cong.',
    isAvailable: true, deliveryDays: 2,
    specs: {
      width: 'N/A', depth: 'N/A', height: 'N/A', 
      deskThickness: 'N/A', maxLoad: 18, 
      vesaSupported: ['75x75', '100x100'], supportedMonitorSize: 40, clampThicknessMax: 10,
      style: ['ergonomic', 'productivity']
    }
  },

  // --- LAMPS (2 SKUs) ---
  {
    id: 'l1', sku: 'SKU-L-01',
    name: 'Đèn treo màn hình Baseus I-Wok', brand: 'Baseus', sellerId: 'seller-cellphones',
    category: 'desk_lamp', price: 550000,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=400&q=80',
    description: 'Đèn LED gắn trên màn hình, không chói mắt.',
    isAvailable: true, deliveryDays: 1,
    specs: {
      width: 45, depth: 'N/A', height: 'N/A', 
      deskThickness: 'N/A', maxLoad: 'N/A', 
      vesaSupported: 'N/A', supportedMonitorSize: 'N/A', clampThicknessMax: 'N/A',
      style: ['ergonomic', 'productivity']
    }
  },
  {
    id: 'l2', sku: 'SKU-L-02',
    name: 'Đèn bàn thông minh Xiaomi', brand: 'Xiaomi', sellerId: 'seller-cellphones',
    category: 'desk_lamp', price: 850000,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=400&q=80',
    description: 'Đèn bàn chống cận, điều khiển qua app.',
    isAvailable: true, deliveryDays: 1,
    specs: {
      width: 15, depth: 15, height: 45, 
      deskThickness: 'N/A', maxLoad: 'N/A', 
      vesaSupported: 'N/A', supportedMonitorSize: 'N/A', clampThicknessMax: 'N/A',
      style: ['minimal', 'productivity']
    }
  },

  // --- CABLE MANAGEMENT (2 SKUs) ---
  {
    id: 'acc1', sku: 'SKU-ACC-01',
    name: 'Khay quản lý dây điện kẹp bàn', brand: 'IKEA', sellerId: 'seller-ikea-vn',
    category: 'cable_management', price: 250000,
    image: 'https://images.unsplash.com/photo-1542385151-efd9000785a0?auto=format&fit=crop&w=400&q=80',
    description: 'Giấu dây điện gọn gàng mà không cần khoan bàn.',
    isAvailable: true, deliveryDays: 5,
    specs: {
      width: 50, depth: 10, height: 10, 
      deskThickness: 'N/A', maxLoad: 5, 
      vesaSupported: 'N/A', supportedMonitorSize: 'N/A', clampThicknessMax: 4.5,
      style: ['minimal', 'productivity', 'ergonomic', 'gaming']
    }
  },
  {
    id: 'acc2', sku: 'SKU-ACC-02',
    name: 'Ống luồn dây điện xương cá', brand: 'OEM', sellerId: 'seller-gearvn',
    category: 'cable_management', price: 90000,
    image: 'https://images.unsplash.com/photo-1542385151-efd9000785a0?auto=format&fit=crop&w=400&q=80',
    description: 'Thu gọn dây cáp từ bàn xuống sàn nhà.',
    isAvailable: true, deliveryDays: 2,
    specs: {
      width: 'N/A', depth: 'N/A', height: 100, 
      deskThickness: 'N/A', maxLoad: 'N/A', 
      vesaSupported: 'N/A', supportedMonitorSize: 'N/A', clampThicknessMax: 'N/A',
      style: ['minimal', 'productivity']
    }
  }
];
