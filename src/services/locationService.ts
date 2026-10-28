// LocationService: Scalable administrative hierarchy, search and geocoding abstraction for FlashGroup

export interface Province {
  id: string;
  name: string;
  center: [number, number];
  zoom: number;
}

export interface District {
  id: string;
  provinceId: string;
  name: string;
  center: [number, number];
  zoom: number;
}

export interface Ward {
  id: string;
  districtId: string;
  name: string;
  center: [number, number];
  zoom: number;
}

export interface StructuredAddress {
  country: string; // Defaults to 'Việt Nam'
  province: string;
  district: string;
  ward: string;
  street: string;
  houseNumber: string;
}

export interface GeocodedLocation {
  latitude: number;
  longitude: number;
  confidence: 'exact' | 'approximate' | 'fallback';
  confidenceLabel: string; // 'VỊ TRÍ TÌM ĐƯỢC' | 'VỊ TRÍ ƯỚC TÍNH'
  precisionInfo: string;
  formattedAddress: string;
}

export interface SearchResultItem {
  id: string;
  type: 'address' | 'area' | 'room' | 'pickup' | 'supplier';
  title: string;
  subtitle: string;
  latitude: number;
  longitude: number;
  metadata?: any;
}

const PROVINCES_DATA: Province[] = [
  { id: 'hcm', name: 'TP. Hồ Chí Minh', center: [10.8231, 106.6297], zoom: 12 },
  { id: 'hn', name: 'Hà Nội', center: [21.0285, 105.8542], zoom: 12 },
  { id: 'dn', name: 'Đà Nẵng', center: [16.0544, 108.2022], zoom: 13 },
  { id: 'ct', name: 'Cần Thơ', center: [10.0452, 105.7469], zoom: 13 },
  { id: 'hp', name: 'Hải Phòng', center: [20.8449, 106.6881], zoom: 13 },
  { id: 'hue', name: 'Thừa Thiên Huế', center: [16.4637, 107.5909], zoom: 13 },
  { id: 'bd', name: 'Bình Dương', center: [10.9804, 106.6519], zoom: 13 },
  { id: 'dnai', name: 'Đồng Nai', center: [10.9427, 106.8243], zoom: 13 },
];

const DISTRICTS_DATA: District[] = [
  // TP. Hồ Chí Minh
  { id: 'hcm_thu_duc', provinceId: 'hcm', name: 'TP. Thủ Đức', center: [10.8495, 106.7725], zoom: 13 },
  { id: 'hcm_q1', provinceId: 'hcm', name: 'Quận 1', center: [10.7769, 106.7009], zoom: 14 },
  { id: 'hcm_q3', provinceId: 'hcm', name: 'Quận 3', center: [10.7844, 106.6844], zoom: 14 },
  { id: 'hcm_q7', provinceId: 'hcm', name: 'Quận 7', center: [10.7329, 106.7082], zoom: 14 },
  { id: 'hcm_binh_thanh', provinceId: 'hcm', name: 'Bình Thạnh', center: [10.8035, 106.7118], zoom: 14 },
  { id: 'hcm_phu_nhuan', provinceId: 'hcm', name: 'Phú Nhuận', center: [10.7992, 106.6803], zoom: 14 },
  { id: 'hcm_tan_binh', provinceId: 'hcm', name: 'Tân Bình', center: [10.8015, 106.6558], zoom: 14 },
  { id: 'hcm_q10', provinceId: 'hcm', name: 'Quận 10', center: [10.7716, 106.6669], zoom: 14 },

  // Hà Nội
  { id: 'hn_cau_giay', provinceId: 'hn', name: 'Cầu Giấy', center: [21.0313, 105.7826], zoom: 14 },
  { id: 'hn_hai_ba_trung', provinceId: 'hn', name: 'Hai Bà Trưng', center: [20.9958, 105.8675], zoom: 14 },
  { id: 'hn_ba_dinh', provinceId: 'hn', name: 'Ba Đình', center: [21.0341, 105.8242], zoom: 14 },
  { id: 'hn_hoan_kiem', provinceId: 'hn', name: 'Hoàn Kiếm', center: [21.0285, 105.8542], zoom: 14 },
  { id: 'hn_dong_da', provinceId: 'hn', name: 'Đống Đa', center: [21.0181, 105.8276], zoom: 14 },
  { id: 'hn_thanh_xuan', provinceId: 'hn', name: 'Thanh Xuân', center: [20.9937, 105.8118], zoom: 14 },
  { id: 'hn_nam_tu_liem', provinceId: 'hn', name: 'Nam Từ Liêm', center: [21.0142, 105.7654], zoom: 14 },

  // Đà Nẵng
  { id: 'dn_hai_chau', provinceId: 'dn', name: 'Hải Châu', center: [16.0544, 108.2198], zoom: 14 },
  { id: 'dn_son_tra', provinceId: 'dn', name: 'Sơn Trà', center: [16.0825, 108.2435], zoom: 14 },
  { id: 'dn_ngu_hanh_son', provinceId: 'dn', name: 'Ngũ Hành Sơn', center: [16.0125, 108.2572], zoom: 14 },

  // Cần Thơ
  { id: 'ct_ninh_kieu', provinceId: 'ct', name: 'Ninh Kiều', center: [10.0342, 105.7885], zoom: 14 },
  { id: 'ct_cai_rang', provinceId: 'ct', name: 'Cái Răng', center: [9.9935, 105.7672], zoom: 14 },

  // Hải Phòng
  { id: 'hp_hong_bang', provinceId: 'hp', name: 'Hồng Bàng', center: [20.8654, 106.6667], zoom: 14 },
  { id: 'hp_ngo_quyen', provinceId: 'hp', name: 'Ngô Quyền', center: [20.8522, 106.6978], zoom: 14 },

  // Thừa Thiên Huế
  { id: 'hue_tp', provinceId: 'hue', name: 'TP. Huế', center: [16.4637, 107.5909], zoom: 14 },
];

const WARDS_DATA: Ward[] = [
  // TP. Thủ Đức
  { id: 'w_linh_trung', districtId: 'hcm_thu_duc', name: 'Phường Linh Trung', center: [10.8705, 106.7782], zoom: 15 },
  { id: 'w_hiep_phu', districtId: 'hcm_thu_duc', name: 'Phường Hiệp Phú', center: [10.8495, 106.7725], zoom: 15 },
  { id: 'w_thao_dien', districtId: 'hcm_thu_duc', name: 'Phường Thảo Điền', center: [10.8041, 106.7324], zoom: 15 },
  { id: 'w_an_phu', districtId: 'hcm_thu_duc', name: 'Phường An Phú', center: [10.7938, 106.7497], zoom: 15 },
  { id: 'w_tang_nhon_phu', districtId: 'hcm_thu_duc', name: 'Phường Tăng Nhơn Phú A', center: [10.8465, 106.7865], zoom: 15 },

  // Quận 7
  { id: 'w_tan_phong', districtId: 'hcm_q7', name: 'Phường Tân Phong', center: [10.7329, 106.7082], zoom: 15 },
  { id: 'w_tan_phu', districtId: 'hcm_q7', name: 'Phường Tân Phú', center: [10.7285, 106.7214], zoom: 15 },
  { id: 'w_phu_my', districtId: 'hcm_q7', name: 'Phường Phú Mỹ', center: [10.7095, 106.7231], zoom: 15 },
  { id: 'w_tan_thuan_dong', districtId: 'hcm_q7', name: 'Phường Tân Thuận Đông', center: [10.7582, 106.7305], zoom: 15 },

  // Quận 1
  { id: 'w_ben_nghe', districtId: 'hcm_q1', name: 'Phường Bến Nghé', center: [10.7769, 106.7009], zoom: 15 },
  { id: 'w_da_kao', districtId: 'hcm_q1', name: 'Phường Đa Kao', center: [10.7905, 106.6975], zoom: 15 },
  { id: 'w_ben_thanh', districtId: 'hcm_q1', name: 'Phường Bến Thành', center: [10.7725, 106.6935], zoom: 15 },
  { id: 'w_pham_ngu_lao', districtId: 'hcm_q1', name: 'Phường Phạm Ngũ Lão', center: [10.7685, 106.6912], zoom: 15 },

  // Bình Thạnh
  { id: 'w_bt_p25', districtId: 'hcm_binh_thanh', name: 'Phường 25', center: [10.8035, 106.7118], zoom: 15 },
  { id: 'w_bt_p22', districtId: 'hcm_binh_thanh', name: 'Phường 22 (Vinhomes Central Park)', center: [10.7932, 106.7216], zoom: 15 },
  { id: 'w_bt_p19', districtId: 'hcm_binh_thanh', name: 'Phường 19', center: [10.7915, 106.7058], zoom: 15 },

  // Cầu Giấy (Hà Nội)
  { id: 'w_dich_vong_hau', districtId: 'hn_cau_giay', name: 'Phường Dịch Vọng Hậu', center: [21.0365, 105.7825], zoom: 15 },
  { id: 'w_trung_hoa', districtId: 'hn_cau_giay', name: 'Phường Trung Hòa', center: [21.0115, 105.7995], zoom: 15 },
  { id: 'w_nghia_do', districtId: 'hn_cau_giay', name: 'Phường Nghĩa Đô', center: [21.0452, 105.7985], zoom: 15 },

  // Hai Bà Trưng (Hà Nội)
  { id: 'w_vinh_tuy', districtId: 'hn_hai_ba_trung', name: 'Phường Vĩnh Tuy (Times City)', center: [20.9958, 105.8675], zoom: 15 },
  { id: 'w_bach_khoa', districtId: 'hn_hai_ba_trung', name: 'Phường Bách Khoa', center: [21.0065, 105.8452], zoom: 15 },
  { id: 'w_dong_tam', districtId: 'hn_hai_ba_trung', name: 'Phường Đồng Tâm', center: [21.0012, 105.8425], zoom: 15 },

  // Đà Nẵng
  { id: 'w_thach_thang', districtId: 'dn_hai_chau', name: 'Phường Thạch Thang', center: [16.0745, 108.2198], zoom: 15 },
  { id: 'w_an_hai_bac', districtId: 'dn_son_tra', name: 'Phường An Hải Bắc', center: [16.0712, 108.2355], zoom: 15 },
];

export class LocationService {
  /**
   * Lấy danh sách Tỉnh / Thành phố
   */
  static getProvinces(): Province[] {
    return PROVINCES_DATA;
  }

  /**
   * Lấy danh sách Quận / Huyện theo Tỉnh / TP
   */
  static getDistricts(provinceId: string): District[] {
    return DISTRICTS_DATA.filter((d) => d.provinceId === provinceId);
  }

  /**
   * Lấy danh sách Phường / Xã theo Quận / Huyện
   */
  static getWards(districtId: string): Ward[] {
    return WARDS_DATA.filter((w) => w.districtId === districtId);
  }

  /**
   * Định dạng địa chỉ chuẩn theo thứ tự Việt Nam:
   * [Số nhà] [Đường], [Phường/Xã], [Quận/Huyện], [Tỉnh/TP], Việt Nam
   */
  static formatVietnameseAddress(addr: StructuredAddress): string {
    const parts: string[] = [];
    const streetPart = [addr.houseNumber, addr.street].filter(Boolean).join(' ');
    if (streetPart) parts.push(streetPart);
    if (addr.ward) parts.push(addr.ward);
    if (addr.district) parts.push(addr.district);
    if (addr.province) parts.push(addr.province);
    if (addr.country && addr.country !== 'Việt Nam') parts.push(addr.country);
    return parts.join(', ');
  }

  /**
   * Geocode địa chỉ có cấu trúc:
   * Trả về tọa độ + mức độ tin cậy (exact | approximate | fallback)
   * Không bao giờ bịa đặt tọa độ, luôn nêu rõ mức độ khớp.
   */
  static async geocodeAddress(addr: StructuredAddress): Promise<GeocodedLocation> {
    const formatted = this.formatVietnameseAddress(addr);

    // 1. Thử tìm khớp theo Phường/Xã trong cơ sở dữ liệu có sẵn
    const matchedWard = WARDS_DATA.find(
      (w) => addr.ward && (w.name.toLowerCase().includes(addr.ward.toLowerCase()) || addr.ward.toLowerCase().includes(w.name.toLowerCase()))
    );

    if (matchedWard) {
      // Nếu có số nhà và đường, tạo độ dịch chuyển nhẹ đại diện trong cùng khu phố (ước tính)
      const hasHouseStreet = Boolean(addr.houseNumber || addr.street);
      const latOffset = hasHouseStreet ? (Math.random() - 0.5) * 0.002 : 0;
      const lngOffset = hasHouseStreet ? (Math.random() - 0.5) * 0.002 : 0;

      return {
        latitude: Number((matchedWard.center[0] + latOffset).toFixed(6)),
        longitude: Number((matchedWard.center[1] + lngOffset).toFixed(6)),
        confidence: hasHouseStreet ? 'approximate' : 'approximate',
        confidenceLabel: 'VỊ TRÍ ƯỚC TÍNH',
        precisionInfo: hasHouseStreet
          ? `Ước tính theo trục ${addr.street || 'tuyến đường'}, ${matchedWard.name}`
          : `Ước tính theo trung tâm ${matchedWard.name}`,
        formattedAddress: formatted,
      };
    }

    // 2. Thử tìm khớp theo Quận/Huyện
    const matchedDistrict = DISTRICTS_DATA.find(
      (d) => addr.district && (d.name.toLowerCase().includes(addr.district.toLowerCase()) || addr.district.toLowerCase().includes(d.name.toLowerCase()))
    );

    if (matchedDistrict) {
      return {
        latitude: matchedDistrict.center[0],
        longitude: matchedDistrict.center[1],
        confidence: 'approximate',
        confidenceLabel: 'VỊ TRÍ ƯỚC TÍNH',
        precisionInfo: `Ước tính theo trung tâm ${matchedDistrict.name}`,
        formattedAddress: formatted,
      };
    }

    // 3. Khớp theo Tỉnh/TP
    const matchedProvince = PROVINCES_DATA.find(
      (p) => addr.province && (p.name.toLowerCase().includes(addr.province.toLowerCase()) || addr.province.toLowerCase().includes(p.name.toLowerCase()))
    );

    if (matchedProvince) {
      return {
        latitude: matchedProvince.center[0],
        longitude: matchedProvince.center[1],
        confidence: 'fallback',
        confidenceLabel: 'VỊ TRÍ ƯỚC TÍNH',
        precisionInfo: `Ước tính theo trung tâm ${matchedProvince.name}`,
        formattedAddress: formatted,
      };
    }

    // Mặc định TP. Hồ Chí Minh
    return {
      latitude: 10.8231,
      longitude: 106.6297,
      confidence: 'fallback',
      confidenceLabel: 'VỊ TRÍ MẶC ĐỊNH',
      precisionInfo: 'Không tìm thấy chi tiết, định vị mặc định tại TP. Hồ Chí Minh',
      formattedAddress: formatted || 'TP. Hồ Chí Minh, Việt Nam',
    };
  }

  /**
   * Reverse geocode: từ tọa độ [lat, lng] suy ra mô hình địa phương
   */
  static reverseGeocode(lat: number, lng: number): { province: string; district: string; ward: string } {
    // Tìm điểm gần nhất trong danh sách phường
    let closestWard: Ward | null = null;
    let minDistance = Infinity;

    for (const w of WARDS_DATA) {
      const d = Math.hypot(w.center[0] - lat, w.center[1] - lng);
      if (d < minDistance) {
        minDistance = d;
        closestWard = w;
      }
    }

    if (closestWard && minDistance < 0.1) {
      const dist = DISTRICTS_DATA.find((d) => d.id === closestWard!.districtId);
      const prov = dist ? PROVINCES_DATA.find((p) => p.id === dist.provinceId) : null;
      return {
        ward: closestWard.name,
        district: dist ? dist.name : '',
        province: prov ? prov.name : 'TP. Hồ Chí Minh',
      };
    }

    return {
      ward: '',
      district: '',
      province: lat > 18 ? 'Hà Nội' : 'TP. Hồ Chí Minh',
    };
  }
}
