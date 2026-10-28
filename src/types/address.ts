// Types for Vietnam Administrative Hierarchy and Delivery Address System

export type AdministrativeOption = {
  code: string;
  name: string;
};

export type VietnamAddress = {
  provinceCode?: string;
  provinceName?: string;

  districtCode?: string;
  districtName?: string;

  wardCode?: string;
  wardName?: string;

  street?: string;
  houseNumber?: string;

  latitude?: number;
  longitude?: number;

  formattedAddress?: string;
};

export interface VietnamAddressProvider {
  getProvinces(): Promise<AdministrativeOption[]>;
  getDistricts(provinceCode: string): Promise<AdministrativeOption[]>;
  getWards(districtCode: string): Promise<AdministrativeOption[]>;
}

export type AddressLabelType = 'NHÀ' | 'CÔNG TY' | 'KHÁC';

export interface SavedBuyerAddress {
  id: string;
  userId: string;
  label: AddressLabelType;
  recipientName: string;
  recipientPhone: string;
  address: VietnamAddress;
  deliveryNote?: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GeocodedAddressResult {
  latitude: number;
  longitude: number;
  confidence: 'exact' | 'approximate' | 'fallback';
  confidenceLabel: string; // 'VỊ TRÍ TÌM ĐƯỢC' | 'VỊ TRÍ TƯƠNG ĐỐI'
  formattedAddress: string;
  source: 'nominatim' | 'administrative_center' | 'manual';
}
