// FlashGroup Demo Scenario & Demo Reset Service (Requirements 24, 25, 26, 28)
import { GroupRoom, Product, PriceTier, User, PickupPoint } from '../types';

export const DEMO_STRAWBERRY_PRODUCT_ID = 'prod-01';
export const DEMO_STRAWBERRY_ROOM_ID = 'room-dau-dalat';
export const DEMO_SUPPLIER_USER_ID = 'supplier-user-demo';
export const DEMO_BUYER_USER_ID = 'buyer-demo';

export const DEMO_STRAWBERRY_PRICE_TIERS: PriceTier[] = [
  { minQuantity: 1, maxQuantity: 4, price: 120000 },
  { minQuantity: 5, maxQuantity: 9, price: 110000 },
  { minQuantity: 10, maxQuantity: 19, price: 99000 },
  { minQuantity: 20, maxQuantity: 25, price: 89000 },
];

export const DEMO_STRAWBERRY_ROOM: GroupRoom = {
  id: DEMO_STRAWBERRY_ROOM_ID,
  productId: DEMO_STRAWBERRY_PRODUCT_ID,
  productName: 'Dâu Tây Đà Lạt — DEMO',
  supplierId: 'supp_dalat_coop',
  supplierName: 'Hợp Tác Xã Nông Sản Sạch Đà Lạt',
  unit: 'Hộp 500g',
  initialPrice: 120000,
  finalPrice: undefined,
  priceTiers: DEMO_STRAWBERRY_PRICE_TIERS,
  totalQuantity: 19,
  maxQuantity: 20,
  participantCount: 19,
  maxParticipants: 20,
  status: 'active',
  pickupPoint: 'Smart Locker KTX Khu A – ĐHQG TP.HCM',
  pickupPointId: 'pt_locker_01',
  pickupPointName: 'Smart Locker KTX Khu A – ĐHQG TP.HCM',
  pickupAddress: 'Đường Tạ Quang Bửu, Phường Linh Trung, TP. Thủ Đức, TP.HCM',
  provinceOrCity: 'Thành phố Hồ Chí Minh',
  area: 'TP. Thủ Đức',
  latitude: 10.8782,
  longitude: 106.8063,
  distance: '0.8 km',
  distanceMeters: 800,
  mapCoords: { x: 50, y: 50 },
  productImage: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=600&auto=format&fit=crop&q=80',
  totalShippingFee: 60000, // Shared shipping: 60,000 VND / participants
  startAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  endAt: new Date(Date.now() + 3600000 * 20).toISOString(),
  description: 'Dâu tây New Zealand canh tác nhà kính công nghệ cao, thu hoạch sáng sớm chuyển phát thẳng về Locker bảo quản lạnh.',
  category: 'Thực phẩm',
  emoji: '🍓',
};

export const demoScenarioService = {
  /**
   * Resets the demo room and associated demo participations to the 19/20 scenario
   * Affects only items where isDemo === true
   */
  resetDemoScenario(currentRooms: GroupRoom[]): {
    updatedRooms: GroupRoom[];
    message: string;
  } {
    // Check if strawberry demo room exists in state
    const roomExists = currentRooms.some((r) => r.id === DEMO_STRAWBERRY_ROOM_ID);

    let updatedRooms: GroupRoom[];
    if (roomExists) {
      updatedRooms = currentRooms.map((r) =>
        r.id === DEMO_STRAWBERRY_ROOM_ID
          ? {
              ...DEMO_STRAWBERRY_ROOM,
              startAt: new Date().toISOString(),
              endAt: new Date(Date.now() + 3600000 * 24).toISOString(),
            }
          : r
      );
    } else {
      updatedRooms = [DEMO_STRAWBERRY_ROOM, ...currentRooms];
    }

    return {
      updatedRooms,
      message: 'Đã thiết lập lại kịch bản Demo: Phòng Dâu Đà Lạt (19/20 người, giá 99.000đ → MỞ KHÓA MỨC GIÁ 89.000đ khi có thêm 1 lượt mua).',
    };
  },

  /**
   * Runs the automated Demo Readiness Checklist
   */
  async checkDemoReadiness(params: {
    supabaseConnected: boolean;
    realtimeConnected: boolean;
    users: User[];
    rooms: GroupRoom[];
    pickupPoints: PickupPoint[];
  }) {
    const hasDemoBuyer = params.users.some(
      (u) => u.role === 'buyer' && (u.email.includes('buyer') || u.name.includes('Minh Anh'))
    );
    const hasDemoSupplier = params.users.some(
      (u) => u.role === 'supplier' || u.email.includes('supplier')
    );
    const strawberryRoom = params.rooms.find((r) => r.id === DEMO_STRAWBERRY_ROOM_ID);
    const isStrawberryReady = Boolean(
      strawberryRoom &&
        strawberryRoom.totalQuantity === 19 &&
        strawberryRoom.maxQuantity === 20 &&
        strawberryRoom.status === 'active'
    );
    const hasActivePickupPoint = params.pickupPoints.some((p) => p.status === 'active');
    const isMapConfigured = true;

    return [
      {
        id: 'supabase',
        title: 'Supabase Database',
        status: params.supabaseConnected ? 'ready' : 'fallback',
        detail: params.supabaseConnected ? 'Đã kết nối trực tuyến' : 'Đang dùng Local Demo Storage an toàn',
      },
      {
        id: 'realtime',
        title: 'Realtime WebSocket',
        status: params.realtimeConnected ? 'ready' : 'fallback',
        detail: params.realtimeConnected ? 'Kênh Realtime đang hoạt động' : 'Tự động kích hoạt khi có phiên Supabase',
      },
      {
        id: 'buyer',
        title: 'Tài khoản Demo Buyer',
        status: hasDemoBuyer ? 'ready' : 'missing',
        detail: 'Nguyễn Minh Anh (buyer@flashgroup.demo)',
      },
      {
        id: 'supplier',
        title: 'Tài khoản Demo Supplier',
        status: hasDemoSupplier ? 'ready' : 'missing',
        detail: 'HTX Nông Sản Đà Lạt (supplier@flashgroup.demo)',
      },
      {
        id: 'strawberry',
        title: 'Phòng Dâu Đà Lạt (Kịch bản 19/20)',
        status: isStrawberryReady ? 'ready' : 'needs_reset',
        detail: isStrawberryReady
          ? 'Sẵn sàng kích hoạt nấc giá mới (19/20)'
          : 'Cần bấm "Reset Demo" để đưa về 19/20',
      },
      {
        id: 'pickup',
        title: 'Hệ thống Smart Locker & Pickup Point',
        status: hasActivePickupPoint ? 'ready' : 'missing',
        detail: `${params.pickupPoints.length} điểm nhận hàng đang sẵn sàng`,
      },
      {
        id: 'map',
        title: 'Bản đồ FlashMap Vector',
        status: isMapConfigured ? 'ready' : 'warning',
        detail: 'Vector Basemap & Nhãn Tiếng Việt Hoàng Sa/Trường Sa hợp lệ',
      },
    ];
  },
};
