import React, { useState, useEffect, useMemo } from 'react';
import {
  MapPin,
  Search,
  CheckCircle2,
  ChevronDown,
  RefreshCw,
  AlertTriangle,
  Building2,
  Home,
  Briefcase,
  Compass,
  X,
  Edit3,
  Check,
  Eye,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import {
  AdministrativeOption,
  VietnamAddress,
  VietnamAddressProvider,
  GeocodedAddressResult,
  AddressLabelType,
} from '../types/address';
import {
  defaultVietnamAddressProvider,
  formatVietnameseAddress,
  geocodeVietnameseAddress,
} from '../services/vietnamAddressService';

export interface VietnamAddressSelectorProps {
  initialAddress?: Partial<VietnamAddress>;
  provider?: VietnamAddressProvider;
  onAddressChange?: (address: VietnamAddress) => void;
  onViewOnMap?: (geocoded: GeocodedAddressResult, address: VietnamAddress) => void;
  onConfirmAddress?: (address: VietnamAddress, geocoded?: GeocodedAddressResult) => void;
  // Recipient info integration (optional for delivery forms)
  showRecipientFields?: boolean;
  recipientName?: string;
  recipientPhone?: string;
  deliveryNote?: string;
  addressLabel?: AddressLabelType;
  onRecipientInfoChange?: (info: {
    recipientName: string;
    recipientPhone: string;
    deliveryNote: string;
    label: AddressLabelType;
  }) => void;
  className?: string;
  compact?: boolean;
}

type SelectionLevel = 'province' | 'district' | 'ward';

export const VietnamAddressSelector: React.FC<VietnamAddressSelectorProps> = ({
  initialAddress,
  provider = defaultVietnamAddressProvider,
  onAddressChange,
  onViewOnMap,
  onConfirmAddress,
  showRecipientFields = false,
  recipientName: initialRecipientName = '',
  recipientPhone: initialRecipientPhone = '',
  deliveryNote: initialDeliveryNote = '',
  addressLabel: initialAddressLabel = 'NHÀ',
  onRecipientInfoChange,
  className = '',
  compact = false,
}) => {
  // Cascading Selection State (Initial state is EMPTY: No preselected demo/university!)
  const [provinceCode, setProvinceCode] = useState<string>(initialAddress?.provinceCode || '');
  const [provinceName, setProvinceName] = useState<string>(initialAddress?.provinceName || '');

  const [districtCode, setDistrictCode] = useState<string>(initialAddress?.districtCode || '');
  const [districtName, setDistrictName] = useState<string>(initialAddress?.districtName || '');

  const [wardCode, setWardCode] = useState<string>(initialAddress?.wardCode || '');
  const [wardName, setWardName] = useState<string>(initialAddress?.wardName || '');

  const [street, setStreet] = useState<string>(initialAddress?.street || '');
  const [houseNumber, setHouseNumber] = useState<string>(initialAddress?.houseNumber || '');

  // Recipient details state
  const [label, setLabel] = useState<AddressLabelType>(initialAddressLabel);
  const [recipientName, setRecipientName] = useState<string>(initialRecipientName);
  const [recipientPhone, setRecipientPhone] = useState<string>(initialRecipientPhone);
  const [deliveryNote, setDeliveryNote] = useState<string>(initialDeliveryNote);

  // Administrative lists
  const [provinces, setProvinces] = useState<AdministrativeOption[]>([]);
  const [districts, setDistricts] = useState<AdministrativeOption[]>([]);
  const [wards, setWards] = useState<AdministrativeOption[]>([]);

  // Loading & Error states
  const [isLoadingProvinces, setIsLoadingProvinces] = useState<boolean>(false);
  const [isLoadingDistricts, setIsLoadingDistricts] = useState<boolean>(false);
  const [isLoadingWards, setIsLoadingWards] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Geocoding and Preview state
  const [isGeocoding, setIsGeocoding] = useState<boolean>(false);
  const [geocodedResult, setGeocodedResult] = useState<GeocodedAddressResult | null>(null);
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);

  // Search Modal/Sheet state for searchable dropdowns
  const [activeModal, setActiveModal] = useState<SelectionLevel | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // 1. Load Provinces on Mount
  const loadProvinces = async () => {
    setIsLoadingProvinces(true);
    setApiError(null);
    try {
      const list = await provider.getProvinces();
      setProvinces(list);
    } catch (e: any) {
      setApiError('KHÔNG THỂ TẢI DANH SÁCH ĐỊA CHỈ');
    } finally {
      setIsLoadingProvinces(false);
    }
  };

  useEffect(() => {
    loadProvinces();
  }, [provider]);

  // 2. Cascading: When Province changes, load Districts
  useEffect(() => {
    if (!provinceCode) {
      setDistricts([]);
      setDistrictCode('');
      setDistrictName('');
      setWards([]);
      setWardCode('');
      setWardName('');
      return;
    }

    let isMounted = true;
    const fetchDistricts = async () => {
      setIsLoadingDistricts(true);
      setApiError(null);
      try {
        const list = await provider.getDistricts(provinceCode);
        if (isMounted) {
          setDistricts(list);
        }
      } catch {
        if (isMounted) setApiError('KHÔNG THỂ TẢI DANH SÁCH ĐỊA CHỈ');
      } finally {
        if (isMounted) setIsLoadingDistricts(false);
      }
    };

    fetchDistricts();
    return () => {
      isMounted = false;
    };
  }, [provinceCode, provider]);

  // 3. Cascading: When District changes, load Wards
  useEffect(() => {
    if (!districtCode) {
      setWards([]);
      setWardCode('');
      setWardName('');
      return;
    }

    let isMounted = true;
    const fetchWards = async () => {
      setIsLoadingWards(true);
      setApiError(null);
      try {
        const list = await provider.getWards(districtCode);
        if (isMounted) {
          setWards(list);
        }
      } catch {
        if (isMounted) setApiError('KHÔNG THỂ TẢI DANH SÁCH ĐỊA CHỈ');
      } finally {
        if (isMounted) setIsLoadingWards(false);
      }
    };

    fetchWards();
    return () => {
      isMounted = false;
    };
  }, [districtCode, provider]);

  // 4. Construct current VietnamAddress object
  const currentAddress: VietnamAddress = useMemo(() => {
    const raw: VietnamAddress = {
      provinceCode,
      provinceName,
      districtCode,
      districtName,
      wardCode,
      wardName,
      street: street.trim(),
      houseNumber: houseNumber.trim(),
      latitude: geocodedResult?.latitude,
      longitude: geocodedResult?.longitude,
    };
    raw.formattedAddress = formatVietnameseAddress(raw);
    return raw;
  }, [
    provinceCode,
    provinceName,
    districtCode,
    districtName,
    wardCode,
    wardName,
    street,
    houseNumber,
    geocodedResult,
  ]);

  // Sync address changes with parent
  useEffect(() => {
    onAddressChange?.(currentAddress);
  }, [currentAddress, onAddressChange]);

  // Sync recipient details changes with parent
  useEffect(() => {
    onRecipientInfoChange?.({
      recipientName,
      recipientPhone,
      deliveryNote,
      label,
    });
  }, [recipientName, recipientPhone, deliveryNote, label, onRecipientInfoChange]);

  // Handle province selection
  const handleSelectProvince = (opt: AdministrativeOption) => {
    setProvinceCode(opt.code);
    setProvinceName(opt.name);
    // Clear dependent levels
    setDistrictCode('');
    setDistrictName('');
    setWardCode('');
    setWardName('');
    setStreet('');
    setHouseNumber('');
    setGeocodedResult(null);
    setIsConfirmed(false);
    setActiveModal(null);
    setSearchQuery('');
  };

  // Handle district selection
  const handleSelectDistrict = (opt: AdministrativeOption) => {
    setDistrictCode(opt.code);
    setDistrictName(opt.name);
    // Clear dependent levels
    setWardCode('');
    setWardName('');
    setStreet('');
    setHouseNumber('');
    setGeocodedResult(null);
    setIsConfirmed(false);
    setActiveModal(null);
    setSearchQuery('');
  };

  // Handle ward selection
  const handleSelectWard = (opt: AdministrativeOption) => {
    setWardCode(opt.code);
    setWardName(opt.name);
    setGeocodedResult(null);
    setIsConfirmed(false);
    setActiveModal(null);
    setSearchQuery('');
  };

  // Validation
  const isAddressComplete =
    Boolean(provinceCode) &&
    Boolean(districtCode) &&
    Boolean(wardCode) &&
    Boolean(street.trim()) &&
    Boolean(houseNumber.trim());

  // Geocode address when user clicks "XEM TRÊN BẢN ĐỒ"
  const handleLocateOnMap = async () => {
    if (!provinceName || !districtName) {
      alert('Vui lòng chọn Tỉnh/Thành phố và Quận/Huyện trước khi xem bản đồ.');
      return;
    }
    setIsGeocoding(true);
    setIsConfirmed(false);
    try {
      const result = await geocodeVietnameseAddress(currentAddress);
      setGeocodedResult(result);
      setIsPreviewMode(true);
      onViewOnMap?.(result, currentAddress);
    } finally {
      setIsGeocoding(false);
    }
  };

  // Confirm address button
  const handleConfirm = () => {
    if (!isAddressComplete) {
      alert('Vui lòng nhập đầy đủ: Tỉnh/Thành, Quận/Huyện, Phường/Xã, Tên đường và Số nhà.');
      return;
    }
    setIsConfirmed(true);
    setIsPreviewMode(true);
    onConfirmAddress?.(currentAddress, geocodedResult || undefined);
  };

  // Search filter for dropdown modal/sheet
  const filteredOptions = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (activeModal === 'province') {
      if (!q) return provinces;
      return provinces.filter((p) => p.name.toLowerCase().includes(q));
    }
    if (activeModal === 'district') {
      if (!q) return districts;
      return districts.filter((d) => d.name.toLowerCase().includes(q));
    }
    if (activeModal === 'ward') {
      if (!q) return wards;
      return wards.filter((w) => w.name.toLowerCase().includes(q));
    }
    return [];
  }, [activeModal, searchQuery, provinces, districts, wards]);

  return (
    <div
      className={`bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-5 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
              Địa chỉ nhận hàng (Vietnam Address Flow)
            </h3>
            <p className="text-[11px] text-slate-400">
              Chọn chuẩn phân cấp hành chính 63 Tỉnh/Thành phố toàn quốc
            </p>
          </div>
        </div>

        {isConfirmed && (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Đã xác nhận
          </span>
        )}
      </div>

      {/* 7. FALLBACK IF API FAILS */}
      {apiError && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-center gap-2 text-rose-700 text-xs font-bold">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{apiError}</span>
          </div>
          <button
            type="button"
            onClick={loadProvinces}
            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>THỬ LẠI</span>
          </button>
        </div>
      )}

      {/* 11. ADDRESS PREVIEW (IF CONFIRMED OR IN PREVIEW MODE) */}
      {isPreviewMode && currentAddress.formattedAddress && (
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 animate-fade-in">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              ĐỊA CHỈ CỦA BẠN (PREVIEW)
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsPreviewMode(false)}
                className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-xs cursor-pointer"
              >
                <Edit3 className="w-3 h-3 text-emerald-600" />
                <span>CHỈNH SỬA</span>
              </button>
            </div>
          </div>

          <div className="text-sm font-black text-slate-900 leading-snug">
            {currentAddress.formattedAddress}
          </div>

          {geocodedResult && (
            <div className="flex items-center justify-between pt-2 border-t border-slate-200/80 text-[11px]">
              <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
                <Compass className="w-3.5 h-3.5" />
                <span>{geocodedResult.confidenceLabel}:</span>
                <span className="font-mono text-slate-600">
                  {geocodedResult.latitude.toFixed(4)}, {geocodedResult.longitude.toFixed(4)}
                </span>
              </div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">
                Nguồn: {geocodedResult.source}
              </span>
            </div>
          )}
        </div>
      )}

      {/* 15. ADDRESS LABEL & RECIPIENT DETAILS (WHEN APPLICABLE) */}
      {showRecipientFields && !isPreviewMode && (
        <div className="space-y-4 pt-1">
          {/* Address Label: NHÀ / CÔNG TY / KHÁC */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">
              Nhãn địa chỉ (Address Label)
            </label>
            <div className="flex items-center gap-2">
              {(['NHÀ', 'CÔNG TY', 'KHÁC'] as AddressLabelType[]).map((lbl) => (
                <button
                  key={lbl}
                  type="button"
                  onClick={() => setLabel(lbl)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition cursor-pointer ${
                    label === lbl
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {lbl === 'NHÀ' && <Home className="w-3.5 h-3.5" />}
                  {lbl === 'CÔNG TY' && <Briefcase className="w-3.5 h-3.5" />}
                  {lbl === 'KHÁC' && <MapPin className="w-3.5 h-3.5" />}
                  <span>{lbl}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Recipient Details: Họ tên, Số điện thoại, Ghi chú */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Họ và tên người nhận *
              </label>
              <input
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="VD: Nguyễn Văn A"
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Số điện thoại người nhận *
              </label>
              <input
                type="tel"
                value={recipientPhone}
                onChange={(e) => setRecipientPhone(e.target.value)}
                placeholder="VD: 0901234567"
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* 1. MAIN ADDRESS FLOW INPUTS */}
      {!isPreviewMode && (
        <div className="space-y-4">
          {/* Level 1: TỈNH / THÀNH PHỐ */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
              <span>TỈNH / THÀNH PHỐ *</span>
              {isLoadingProvinces && (
                <span className="text-[10px] text-emerald-600 font-semibold animate-pulse">
                  ĐANG TẢI TỈNH / THÀNH PHỐ...
                </span>
              )}
            </label>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setActiveModal('province');
              }}
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-left text-xs font-medium flex items-center justify-between hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer shadow-xs"
            >
              <span className={provinceName ? 'font-bold text-slate-900' : 'text-slate-400'}>
                {provinceName || '[ CHỌN TỈNH / THÀNH PHỐ ]'}
              </span>
              <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
            </button>
          </div>

          {/* Level 2: QUẬN / HUYỆN / THÀNH PHỐ THUỘC TỈNH */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
              <span>QUẬN / HUYỆN / THÀNH PHỐ THUỘC TỈNH *</span>
              {isLoadingDistricts && (
                <span className="text-[10px] text-emerald-600 font-semibold animate-pulse">
                  ĐANG TẢI QUẬN / HUYỆN...
                </span>
              )}
            </label>
            <button
              type="button"
              disabled={!provinceCode || isLoadingDistricts}
              onClick={() => {
                setSearchQuery('');
                setActiveModal('district');
              }}
              className={`w-full p-2.5 rounded-xl border border-slate-200 text-left text-xs font-medium flex items-center justify-between transition ${
                !provinceCode
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed border-slate-200'
                  : 'bg-white hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer shadow-xs'
              }`}
            >
              <span className={districtName ? 'font-bold text-slate-900' : 'text-slate-400'}>
                {districtName || '[ CHỌN QUẬN / HUYỆN ]'}
              </span>
              <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
            </button>
          </div>

          {/* Level 3: PHƯỜNG / XÃ / THỊ TRẤN */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
              <span>PHƯỜNG / XÃ / THỊ TRẤN *</span>
              {isLoadingWards && (
                <span className="text-[10px] text-emerald-600 font-semibold animate-pulse">
                  ĐANG TẢI PHƯỜNG / XÃ...
                </span>
              )}
            </label>
            <button
              type="button"
              disabled={!districtCode || isLoadingWards}
              onClick={() => {
                setSearchQuery('');
                setActiveModal('ward');
              }}
              className={`w-full p-2.5 rounded-xl border border-slate-200 text-left text-xs font-medium flex items-center justify-between transition ${
                !districtCode
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed border-slate-200'
                  : 'bg-white hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer shadow-xs'
              }`}
            >
              <span className={wardName ? 'font-bold text-slate-900' : 'text-slate-400'}>
                {wardName || '[ CHỌN PHƯỜNG / XÃ ]'}
              </span>
              <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
            </button>
          </div>

          {/* Level 4 & 5: ĐƯỜNG & SỐ NHÀ */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-bold text-slate-700 block">
                ĐƯỜNG (TÊN ĐƯỜNG / KHU VỰC) *
              </label>
              <input
                type="text"
                disabled={!wardCode}
                value={street}
                onChange={(e) => {
                  setStreet(e.target.value);
                  setGeocodedResult(null);
                  setIsConfirmed(false);
                }}
                placeholder="[ NHẬP HOẶC CHỌN TÊN ĐƯỜNG ]"
                className={`w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                  !wardCode ? 'bg-slate-100 cursor-not-allowed text-slate-400' : 'bg-white'
                }`}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">
                SỐ NHÀ / CĂN HỘ *
              </label>
              <input
                type="text"
                disabled={!wardCode}
                value={houseNumber}
                onChange={(e) => {
                  setHouseNumber(e.target.value);
                  setGeocodedResult(null);
                  setIsConfirmed(false);
                }}
                placeholder="[ NHẬP SỐ NHÀ ]"
                className={`w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                  !wardCode ? 'bg-slate-100 cursor-not-allowed text-slate-400' : 'bg-white'
                }`}
              />
            </div>
          </div>

          {/* Delivery Note (if recipient fields enabled) */}
          {showRecipientFields && (
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">
                Ghi chú giao hàng (Delivery Note)
              </label>
              <input
                type="text"
                value={deliveryNote}
                onChange={(e) => setDeliveryNote(e.target.value)}
                placeholder="VD: Gửi bảo vệ sảnh tòa nhà, gọi trước khi giao..."
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              />
            </div>
          )}
        </div>
      )}

      {/* ACTION BUTTONS: [ XEM TRÊN BẢN ĐỒ ] & [ XÁC NHẬN ĐỊA CHỈ ] */}
      <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100">
        <button
          type="button"
          onClick={handleLocateOnMap}
          disabled={!provinceCode || isGeocoding}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-xs"
        >
          <Compass className={`w-4 h-4 text-emerald-600 ${isGeocoding ? 'animate-spin' : ''}`} />
          <span>{isGeocoding ? 'ĐANG TÌM TỌA ĐỘ...' : 'XEM TRÊN BẢN ĐỒ'}</span>
        </button>

        <div className="flex items-center gap-2">
          {geocodedResult && (
            <button
              type="button"
              onClick={handleLocateOnMap}
              className="px-3 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 border border-slate-200 rounded-xl bg-white shadow-xs"
            >
              CHỌN LẠI TRÊN BẢN ĐỒ
            </button>
          )}

          <button
            type="button"
            onClick={handleConfirm}
            disabled={!isAddressComplete}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-black text-xs transition shadow-md ${
              isAddressComplete
                ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20 cursor-pointer active:scale-95'
                : 'bg-slate-300 cursor-not-allowed'
            }`}
          >
            <Check className="w-4 h-4" />
            <span>XÁC NHẬN ĐỊA CHỈ</span>
          </button>
        </div>
      </div>

      {/* SEARCHABLE SELECTION MODAL / SHEET (Req 3 & 24) */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-lg w-full max-h-[85vh] sm:max-h-[75vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-slide-up">
            {/* Sheet Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase text-emerald-600 tracking-wider block">
                  CHỌN ĐƠN VỊ HÀNH CHÍNH
                </span>
                <h4 className="text-sm font-black text-slate-900 mt-0.5">
                  {activeModal === 'province' && 'Chọn Tỉnh / Thành phố'}
                  {activeModal === 'district' && `Chọn Quận / Huyện (${provinceName})`}
                  {activeModal === 'ward' && `Chọn Phường / Xã (${districtName})`}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Search Input at Top */}
            <div className="p-3.5 bg-slate-50 border-b border-slate-100">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    activeModal === 'province'
                      ? 'Nhập tên Tỉnh/Thành phố (VD: Hồ Chí Minh, Hà Nội...)'
                      : activeModal === 'district'
                      ? 'Nhập tên Quận/Huyện (VD: Quận 7, Cầu Giấy...)'
                      : 'Nhập tên Phường/Xã (VD: Tân Phong, Dịch Vọng...)'
                  }
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                />
              </div>
            </div>

            {/* List with large touch targets */}
            <div className="flex-1 overflow-y-auto p-2 divide-y divide-slate-100">
              {filteredOptions.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  Không tìm thấy kết quả phù hợp với từ khóa "{searchQuery}".
                </div>
              ) : (
                filteredOptions.map((opt) => {
                  const isSelected =
                    (activeModal === 'province' && opt.code === provinceCode) ||
                    (activeModal === 'district' && opt.code === districtCode) ||
                    (activeModal === 'ward' && opt.code === wardCode);

                  return (
                    <button
                      key={opt.code}
                      type="button"
                      onClick={() => {
                        if (activeModal === 'province') handleSelectProvince(opt);
                        if (activeModal === 'district') handleSelectDistrict(opt);
                        if (activeModal === 'ward') handleSelectWard(opt);
                      }}
                      className={`w-full p-3 rounded-xl text-left text-xs font-bold flex items-center justify-between transition cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-50 text-emerald-800'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span>{opt.name}</span>
                      {isSelected && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
                    </button>
                  );
                })
              )}
            </div>

            {/* Sheet Footer */}
            <div className="p-3 bg-slate-50 border-t border-slate-100 text-right">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
