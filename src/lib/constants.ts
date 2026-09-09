export const SHIPPING_FEE = 35000;

export const CATEGORIES = {
  furniture: [
    { id: 'desk', name: 'Bàn (Desk)' },
    { id: 'chair', name: 'Ghế (Chair)' },
    { id: 'drawer', name: 'Ngăn kéo bàn' },
    { id: 'cabinet', name: 'Tủ hoặc hộc bàn' },
    { id: 'desk_shelf', name: 'Kệ bàn' },
    { id: 'bookshelf', name: 'Kệ sách nhỏ' }
  ],
  display: [
    { id: 'monitor', name: 'Màn hình' },
    { id: 'monitor_arm', name: 'Monitor Arm' },
    { id: 'monitor_stand', name: 'Kệ màn hình' }
  ],
  accessories: [
    { id: 'keyboard', name: 'Bàn phím' },
    { id: 'mouse', name: 'Chuột' },
    { id: 'mouse_pad', name: 'Mouse Pad' },
    { id: 'laptop_stand', name: 'Laptop Stand' },
    { id: 'webcam', name: 'Webcam' },
    { id: 'microphone', name: 'Microphone' },
    { id: 'speaker', name: 'Loa' },
    { id: 'headphone', name: 'Tai nghe' }
  ],
  power_connectivity: [
    { id: 'docking_station', name: 'Docking Station' },
    { id: 'usb_hub', name: 'USB Hub' },
    { id: 'power_strip', name: 'Ổ cắm điện' },
    { id: 'charger', name: 'Sạc' },
    { id: 'cable', name: 'Cáp kết nối' }
  ],
  organization: [
    { id: 'cable_management', name: 'Quản lý dây' },
    { id: 'desk_organizer', name: 'Desk Organizer' }
  ],
  ergonomics: [
    { id: 'desk_lamp', name: 'Đèn bàn' },
    { id: 'footrest', name: 'Footrest' },
    { id: 'ergo_accessories', name: 'Các phụ kiện công thái học' }
  ]
};

// Flat map for easy ID to Name translation
export const CATEGORY_MAP = Object.values(CATEGORIES).flat().reduce((acc, cat) => {
  acc[cat.id] = cat.name;
  return acc;
}, {} as Record<string, string>);
