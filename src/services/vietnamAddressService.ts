// Vietnam Administrative Address Service & Provider System for FlashGroup
// Follows strict abstraction for VietnamAddressProvider with in-memory caching and offline fallback

import {
  AdministrativeOption,
  VietnamAddress,
  VietnamAddressProvider,
  SavedBuyerAddress,
  GeocodedAddressResult,
  AddressLabelType,
} from '../types/address';
import {
  VIETNAM_PROVINCES,
  VIETNAM_DISTRICTS_MAP,
  VIETNAM_WARDS_MAP,
  getFallbackDistrictsForProvince,
  getFallbackWardsForDistrict,
} from '../data/vietnamAdministrativeData';

// In-Memory Cache (Req 26: avoid refetching identical administrative lists)
class AdministrativeDataCache {
  private provinces: AdministrativeOption[] | null = null;
  private districtsByProvince = new Map<string, AdministrativeOption[]>();
  private wardsByDistrict = new Map<string, AdministrativeOption[]>();

  getProvinces(): AdministrativeOption[] | null {
    return this.provinces;
  }

  setProvinces(data: AdministrativeOption[]): void {
    this.provinces = data;
  }

  getDistricts(provinceCode: string): AdministrativeOption[] | null {
    return this.districtsByProvince.get(provinceCode) || null;
  }

  setDistricts(provinceCode: string, data: AdministrativeOption[]): void {
    this.districtsByProvince.set(provinceCode, data);
  }

  getWards(districtCode: string): AdministrativeOption[] | null {
    return this.wardsByDistrict.get(districtCode) || null;
  }

  setWards(districtCode: string, data: AdministrativeOption[]): void {
    this.wardsByDistrict.set(districtCode, data);
  }

  clear(): void {
    this.provinces = null;
    this.districtsByProvince.clear();
    this.wardsByDistrict.clear();
  }
}

export const adminCache = new AdministrativeDataCache();

// Primary Vietnam Address Provider: OpenApi with automatic local fallback & caching
export class OpenApiVietnamAddressProvider implements VietnamAddressProvider {
  private baseUrl = 'https://provinces.open-api.vn/api';
  private fetchTimeoutMs = 3500;

  async getProvinces(): Promise<AdministrativeOption[]> {
    const cached = adminCache.getProvinces();
    if (cached && cached.length > 0) {
      return cached;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.fetchTimeoutMs);

      const resp = await fetch(`${this.baseUrl}/p/`, { credentials: 'omit', signal: controller.signal });
      clearTimeout(timeoutId);

      if (!resp.ok) {
        throw new Error(`HTTP ${resp.status}`);
      }

      const raw = await resp.json();
      if (Array.isArray(raw) && raw.length > 0) {
        const list: AdministrativeOption[] = raw.map((p: any) => ({
          code: String(p.code),
          name: p.name,
        }));
        adminCache.setProvinces(list);
        return list;
      }
    } catch {
      // Graceful fallback to bundled complete Vietnam dataset (all 63 provinces)
    }

    const fallbackList: AdministrativeOption[] = VIETNAM_PROVINCES.map((p) => ({
      code: p.code,
      name: p.name,
    }));
    adminCache.setProvinces(fallbackList);
    return fallbackList;
  }

  async getDistricts(provinceCode: string): Promise<AdministrativeOption[]> {
    if (!provinceCode) return [];

    const cached = adminCache.getDistricts(provinceCode);
    if (cached && cached.length > 0) {
      return cached;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.fetchTimeoutMs);

      const resp = await fetch(`${this.baseUrl}/p/${provinceCode}?depth=2`, { credentials: 'omit', signal: controller.signal });
      clearTimeout(timeoutId);

      if (!resp.ok) {
        throw new Error(`HTTP ${resp.status}`);
      }

      const raw = await resp.json();
      if (raw && Array.isArray(raw.districts) && raw.districts.length > 0) {
        const list: AdministrativeOption[] = raw.districts.map((d: any) => ({
          code: String(d.code),
          name: d.name,
        }));
        adminCache.setDistricts(provinceCode, list);
        return list;
      }
    } catch {
      // Fallback
    }

    const fallbackList = getFallbackDistrictsForProvince(provinceCode).map((d) => ({
      code: d.code,
      name: d.name,
    }));
    adminCache.setDistricts(provinceCode, fallbackList);
    return fallbackList;
  }

  async getWards(districtCode: string): Promise<AdministrativeOption[]> {
    if (!districtCode) return [];

    const cached = adminCache.getWards(districtCode);
    if (cached && cached.length > 0) {
      return cached;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.fetchTimeoutMs);

      const resp = await fetch(`${this.baseUrl}/d/${districtCode}?depth=2`, { credentials: 'omit', signal: controller.signal });
      clearTimeout(timeoutId);

      if (!resp.ok) {
        throw new Error(`HTTP ${resp.status}`);
      }

      const raw = await resp.json();
      if (raw && Array.isArray(raw.wards) && raw.wards.length > 0) {
        const list: AdministrativeOption[] = raw.wards.map((w: any) => ({
          code: String(w.code),
          name: w.name,
        }));
        adminCache.setWards(districtCode, list);
        return list;
      }
    } catch {
      // Fallback
    }

    const fallbackList = getFallbackWardsForDistrict(districtCode).map((w) => ({
      code: w.code,
      name: w.name,
    }));
    adminCache.setWards(districtCode, fallbackList);
    return fallbackList;
  }
}

// Global active provider instance (replaceable)
export let defaultVietnamAddressProvider: VietnamAddressProvider = new OpenApiVietnamAddressProvider();

export function setVietnamAddressProvider(provider: VietnamAddressProvider) {
  defaultVietnamAddressProvider = provider;
}

// 10. FORMATTED ADDRESS HELPER
export function formatVietnameseAddress(addr: Partial<VietnamAddress>): string {
  const parts: string[] = [];

  const streetPart = [addr.houseNumber?.trim(), addr.street?.trim()].filter(Boolean).join(' ');
  if (streetPart) parts.push(streetPart);
  if (addr.wardName?.trim()) parts.push(addr.wardName.trim());
  if (addr.districtName?.trim()) parts.push(addr.districtName.trim());
  if (addr.provinceName?.trim()) parts.push(addr.provinceName.trim());

  return parts.join(', ');
}

// 12. MAP INTEGRATION & GEOCODING
export async function geocodeVietnameseAddress(
  address: Partial<VietnamAddress>
): Promise<GeocodedAddressResult> {
  const formatted = formatVietnameseAddress(address);

  // 1. Try Nominatim Geocoder
  if (formatted) {
    try {
      const query = encodeURIComponent(`${formatted}, Vietnam`);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1&countrycodes=vn`,
        {
          headers: {
            'Accept-Language': 'vi,en',
            'User-Agent': 'FlashGroup-Logistics/1.0',
          },
          signal: controller.signal,
        }
      );
      clearTimeout(timeoutId);

      if (res.ok) {
        const results = await res.json();
        if (Array.isArray(results) && results.length > 0) {
          const lat = parseFloat(results[0].lat);
          const lon = parseFloat(results[0].lon);
          if (!isNaN(lat) && !isNaN(lon)) {
            return {
              latitude: lat,
              longitude: lon,
              confidence: 'exact',
              confidenceLabel: 'VỊ TRÍ TÌM ĐƯỢC',
              formattedAddress: formatted,
              source: 'nominatim',
            };
          }
        }
      }
    } catch {
      // Proceed to administrative center fallback
    }
  }

  // 2. Fallback to Local Coordinate Dictionary (Ward -> District -> Province)
  let foundLat: number | undefined = address.latitude;
  let foundLng: number | undefined = address.longitude;

  if (address.wardCode && VIETNAM_WARDS_MAP[address.districtCode || '']) {
    const w = VIETNAM_WARDS_MAP[address.districtCode || '']?.find(
      (item) => item.code === address.wardCode
    );
    if (w && w.lat && w.lng) {
      foundLat = w.lat;
      foundLng = w.lng;
    }
  }

  if (!foundLat && address.districtCode && VIETNAM_DISTRICTS_MAP[address.provinceCode || '']) {
    const d = VIETNAM_DISTRICTS_MAP[address.provinceCode || '']?.find(
      (item) => item.code === address.districtCode
    );
    if (d && d.lat && d.lng) {
      foundLat = d.lat;
      foundLng = d.lng;
    }
  }

  if (!foundLat && address.provinceCode) {
    const p = VIETNAM_PROVINCES.find((item) => item.code === address.provinceCode);
    if (p && p.lat && p.lng) {
      foundLat = p.lat;
      foundLng = p.lng;
    }
  }

  const finalLat = foundLat || 10.7769; // TP.HCM Default
  const finalLng = foundLng || 106.7009;

  return {
    latitude: finalLat,
    longitude: finalLng,
    confidence: 'approximate',
    confidenceLabel: 'VỊ TRÍ TÌM ĐƯỢC',
    formattedAddress: formatted || 'Việt Nam',
    source: 'administrative_center',
  };
}

// 17. SAVED BUYER ADDRESSES SERVICE (LOCAL STORAGE & MULTI-ADDRESS CRUD)
const SAVED_ADDRESSES_STORAGE_KEY = 'flashgroup_saved_buyer_addresses_v1';

export const savedBuyerAddressService = {
  getSavedAddresses(userId: string): SavedBuyerAddress[] {
    try {
      const raw = localStorage.getItem(SAVED_ADDRESSES_STORAGE_KEY);
      if (raw) {
        const all: SavedBuyerAddress[] = JSON.parse(raw);
        const userAddresses = all.filter((a) => a.userId === userId);
        if (userAddresses.length > 0) return userAddresses;
      }
    } catch (e) {
      console.warn('Failed to parse saved addresses from localStorage', e);
    }

    // Default Seed Address for standard Buyer (Req 15, 16, 17)
    const initialSeed: SavedBuyerAddress[] = [
      {
        id: 'addr_default_1',
        userId: userId,
        label: 'NHÀ',
        recipientName: 'Nguyễn Minh Anh',
        recipientPhone: '0901234567',
        isDefault: true,
        address: {
          provinceCode: '79',
          provinceName: 'Thành phố Hồ Chí Minh',
          districtCode: '778',
          districtName: 'Quận 7',
          wardCode: '27490',
          wardName: 'Phường Tân Phong',
          street: 'Nguyễn Hữu Thọ',
          houseNumber: '105',
          latitude: 10.7300,
          longitude: 106.7080,
          formattedAddress: '105 Nguyễn Hữu Thọ, Phường Tân Phong, Quận 7, Thành phố Hồ Chí Minh',
        },
        deliveryNote: 'Giao giờ hành chính, gọi trước 15 phút',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'addr_company_2',
        userId: userId,
        label: 'CÔNG TY',
        recipientName: 'Nguyễn Minh Anh',
        recipientPhone: '0901234567',
        isDefault: false,
        address: {
          provinceCode: '79',
          provinceName: 'Thành phố Hồ Chí Minh',
          districtCode: '769',
          districtName: 'Thành phố Thủ Đức',
          wardCode: '26848',
          wardName: 'Phường Hiệp Phú',
          street: 'Khu Công Nghệ Cao (SHTP)',
          houseNumber: 'Lô E2a-7',
          latitude: 10.8490,
          longitude: 106.7840,
          formattedAddress: 'Lô E2a-7 Khu Công Nghệ Cao (SHTP), Phường Hiệp Phú, Thành phố Thủ Đức, Thành phố Hồ Chí Minh',
        },
        deliveryNote: 'Gửi lễ tân tòa nhà',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    try {
      localStorage.setItem(SAVED_ADDRESSES_STORAGE_KEY, JSON.stringify(initialSeed));
    } catch {
      // Ignored
    }
    return initialSeed;
  },

  saveAddress(newAddr: Omit<SavedBuyerAddress, 'id' | 'createdAt' | 'updatedAt'>): SavedBuyerAddress {
    const raw = localStorage.getItem(SAVED_ADDRESSES_STORAGE_KEY);
    let all: SavedBuyerAddress[] = [];
    if (raw) {
      try {
        all = JSON.parse(raw);
      } catch {
        all = [];
      }
    }

    // If new address is marked default, unset default on other addresses of this user
    if (newAddr.isDefault) {
      all = all.map((a) => (a.userId === newAddr.userId ? { ...a, isDefault: false } : a));
    }

    const created: SavedBuyerAddress = {
      ...newAddr,
      id: `addr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    all.unshift(created);
    localStorage.setItem(SAVED_ADDRESSES_STORAGE_KEY, JSON.stringify(all));
    return created;
  },

  updateAddress(id: string, updates: Partial<SavedBuyerAddress>): SavedBuyerAddress | null {
    const raw = localStorage.getItem(SAVED_ADDRESSES_STORAGE_KEY);
    if (!raw) return null;
    let all: SavedBuyerAddress[] = JSON.parse(raw);
    const targetIdx = all.findIndex((a) => a.id === id);
    if (targetIdx === -1) return null;

    if (updates.isDefault) {
      const uId = all[targetIdx].userId;
      all = all.map((a) => (a.userId === uId ? { ...a, isDefault: false } : a));
    }

    all[targetIdx] = {
      ...all[targetIdx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem(SAVED_ADDRESSES_STORAGE_KEY, JSON.stringify(all));
    return all[targetIdx];
  },

  deleteAddress(id: string): void {
    const raw = localStorage.getItem(SAVED_ADDRESSES_STORAGE_KEY);
    if (!raw) return;
    let all: SavedBuyerAddress[] = JSON.parse(raw);
    all = all.filter((a) => a.id !== id);
    localStorage.setItem(SAVED_ADDRESSES_STORAGE_KEY, JSON.stringify(all));
  },

  setDefaultAddress(id: string, userId: string): void {
    const raw = localStorage.getItem(SAVED_ADDRESSES_STORAGE_KEY);
    if (!raw) return;
    let all: SavedBuyerAddress[] = JSON.parse(raw);
    all = all.map((a) => {
      if (a.userId === userId) {
        return { ...a, isDefault: a.id === id };
      }
      return a;
    });
    localStorage.setItem(SAVED_ADDRESSES_STORAGE_KEY, JSON.stringify(all));
  },
};
