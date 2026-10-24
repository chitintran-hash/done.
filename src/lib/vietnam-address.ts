import rawData from '@/data/vietnam-provinces-districts.json';

export interface District {
  code: number;
  name: string;
  division_type: string;
  codename: string;
  province_code: number;
}

export interface Province {
  code: number;
  name: string;
  division_type: string;
  codename: string;
  phone_code: number;
  districts: District[];
}

export interface Ward {
  code: number;
  name: string;
  division_type?: string;
}

export const VIETNAM_PROVINCES: Province[] = rawData as Province[];

// Gợi ý các Tỉnh/Thành phố lớn phổ biến nhất để khách hàng chọn nhanh chỉ bằng 1 chạm
export const POPULAR_PROVINCES = [
  { code: 79, name: 'TP. Hồ Chí Minh', badge: 'Phổ biến', icon: '🏙️' },
  { code: 1, name: 'Hà Nội', badge: 'Phổ biến', icon: '🏛️' },
  { code: 48, name: 'Đà Nẵng', badge: 'Phổ biến', icon: '🌉' },
  { code: 74, name: 'Bình Dương', badge: '', icon: '🏭' },
  { code: 75, name: 'Đồng Nai', badge: '', icon: '🌲' },
  { code: 92, name: 'Cần Thơ', badge: '', icon: '🌾' },
  { code: 31, name: 'Hải Phòng', badge: '', icon: '🌊' },
];

// Gợi ý nhanh các Quận/Huyện trung tâm phổ biến
export const POPULAR_DISTRICTS: Record<number, string[]> = {
  // TP. Hồ Chí Minh
  79: ['Quận 1', 'Quận 3', 'Quận Bình Thạnh', 'Thành phố Thủ Đức', 'Quận Gò Vấp', 'Quận Tân Bình', 'Quận 7', 'Quận 10'],
  // Hà Nội
  1: ['Quận Hoàn Kiếm', 'Quận Cầu Giấy', 'Quận Đống Đa', 'Quận Ba Đình', 'Quận Hai Bà Trưng', 'Quận Thanh Xuân', 'Quận Tây Hồ'],
  // Đà Nẵng
  48: ['Quận Hải Châu', 'Quận Thanh Khê', 'Quận Sơn Trà', 'Quận Ngũ Hành Sơn', 'Quận Cẩm Lệ'],
};

export function getDistricts(provinceCode: number | string): District[] {
  const code = Number(provinceCode);
  const province = VIETNAM_PROVINCES.find((p) => p.code === code);
  return province?.districts || [];
}

// In-memory cache cho Wards để không phải gọi API nhiều lần
const wardsCache: Record<number, Ward[]> = {};

export async function fetchWards(districtCode: number | string): Promise<Ward[]> {
  const code = Number(districtCode);
  if (!code) return [];

  if (wardsCache[code]) {
    return wardsCache[code];
  }

  try {
    const res = await fetch(`/api/address/wards?districtCode=${code}`);
    if (!res.ok) throw new Error('Fetch failed');
    const data = await res.json();
    const wards = data.wards || [];
    wardsCache[code] = wards;
    return wards;
  } catch (err) {
    console.error('Error loading wards for district', code, err);
    return [];
  }
}
