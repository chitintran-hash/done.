import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  Map,
  Marker as MaplibreMarker,
  Popup as MaplibrePopup,
  StyleSpecification,
} from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import {
  MapPin,
  Search,
  Filter,
  Navigation,
  Building2,
  Package,
  Sparkles,
  AlertCircle,
  X,
  Store,
  Compass,
  LocateFixed,
  RefreshCw,
  Plus,
  Minus,
  ArrowRight,
  CheckCircle2,
  ChevronUp,
} from 'lucide-react';
import type { GroupRoom, PickupPoint } from '../types';
import { formatVND, getCurrentPrice, getNextTier } from '../utils/pricing';
import { AddressSelector } from './AddressSelector';
import { VietnamAddressSelector } from './VietnamAddressSelector';
import { LocationService, GeocodedLocation } from '../services/locationService';
import {
  MapStylePreset,
  getAvailableStylePresets,
  buildFlashGroupVectorStyle,
  getOsmRasterStyle,
  getMapApiKey,
} from '../services/mapVectorStyleService';


// ----------------------------------------------------
// HAVERSINE DISTANCE UTILITIES (REAL METRIC CALCULATIONS)
// ----------------------------------------------------
function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function formatMeters(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)} M`;
  }
  return `${(meters / 1000).toFixed(1)} KM`;
}

// ----------------------------------------------------
// COMPONENT PROPS
// ----------------------------------------------------
interface InteractiveFlashMapProps {
  rooms: GroupRoom[];
  pickupPoints: PickupPoint[];
  onSelectRoom: (roomId: string) => void;
  onSelectPickupPoint?: (pointId: string) => void;
}

export const InteractiveFlashMap: React.FC<InteractiveFlashMapProps> = ({
  rooms,
  pickupPoints,
  onSelectRoom,
  onSelectPickupPoint,
}) => {
  // Cities & Neighborhoods
  const CITIES = [
    { id: 'all', name: 'Toàn quốc' },
    { id: 'hcm', name: 'TP. Hồ Chí Minh' },
    { id: 'hn', name: 'Hà Nội' },
    { id: 'dn', name: 'Đà Nẵng' },
  ];

  const AREAS: Record<
    string,
    { id: string; name: string; center: [number, number]; zoom: number }[]
  > = {
    hcm: [
      { id: 'quan_1', name: 'Quận 1 (Trung tâm)', center: [106.7009, 10.7769], zoom: 14 },
      { id: 'thu_duc', name: 'TP. Thủ Đức', center: [106.7725, 10.8495], zoom: 14 },
      { id: 'binh_thanh', name: 'Bình Thạnh', center: [106.7118, 10.8035], zoom: 14 },
      { id: 'quan_7', name: 'Quận 7 (Phú Mỹ Hưng)', center: [106.7082, 10.7329], zoom: 14 },
    ],
    hn: [
      { id: 'hoan_kiem', name: 'Hoàn Kiếm (Hà Nội)', center: [105.8542, 21.0285], zoom: 14 },
      { id: 'cau_giay', name: 'Cầu Giấy', center: [105.7826, 21.0313], zoom: 14 },
      { id: 'hai_ba_trung', name: 'Hai Bà Trưng', center: [105.8675, 20.9958], zoom: 14 },
    ],
    dn: [
      { id: 'hai_chau', name: 'Đà Nẵng (Hải Châu)', center: [108.2022, 16.0544], zoom: 14 },
    ],
  };

  // State Filters
  const [selectedCity, setSelectedCity] = useState<string>('hcm');
  const [selectedArea, setSelectedArea] = useState<string>('quan_1');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState<boolean>(false);
  const [pinTypeFilter, setPinTypeFilter] = useState<'all' | 'rooms' | 'points'>('all');
  const [selectedRadius, setSelectedRadius] = useState<number>(5000); // 5 KM
  const [selectedPickupType, setSelectedPickupType] = useState<string>('all');
  const [nearTargetTierOnly, setNearTargetTierOnly] = useState<boolean>(false);

  // Address Selector Toggle & Pin
  const [showAddressSelector, setShowAddressSelector] = useState<boolean>(false);
  const [temporaryMapPin, setTemporaryMapPin] = useState<[number, number] | null>(null);
  const [temporaryPinConfirmed, setTemporaryPinConfirmed] = useState<boolean>(false);
  const [geocodedInfo, setGeocodedInfo] = useState<GeocodedLocation | null>(null);

  // User Geolocation State (Only on explicit click)
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null); // [lng, lat]
  const [locationAccuracy, setLocationAccuracy] = useState<number | null>(null);
  const [locationPermissionStatus, setLocationPermissionStatus] = useState<
    'idle' | 'prompting' | 'granted' | 'denied' | 'unsupported'
  >('idle');
  const [locationNotice, setLocationNotice] = useState<string | null>(null);

  // Selected Pin for detailed popup/sidebar
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(rooms[0]?.id || null);
  const [selectedPointId, setSelectedPointId] = useState<string | null>(null);

  // Mobile Bottom Sheet State
  const [isMobileSheetOpen, setIsMobileSheetOpen] = useState<boolean>(false);

  // Vector Basemap Style State (BẢN ĐỒ / TỐI GIẢN / VỆ TINH)
  const [activeStylePreset, setActiveStylePreset] = useState<MapStylePreset>('streets');
  const [isLoadingVectorStyle, setIsLoadingVectorStyle] = useState<boolean>(false);
  const [vectorStyleError, setVectorStyleError] = useState<string | null>(null);
  const availableStylePresets = useMemo(() => getAvailableStylePresets(), []);

  // Map Engine Loading / Error State
  const [isMapLoaded, setIsMapLoaded] = useState<boolean>(false);
  const [hasMapError, setHasMapError] = useState<boolean>(false);

  // MapLibre Instance Ref
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<Map | null>(null);
  const activeMarkersRef = useRef<MaplibreMarker[]>([]);
  const renderMarkersRef = useRef<() => void>(() => {});

  // Reference coordinates for distance calculations: [lat, lng]
  const referenceCoords = useMemo<[number, number]>(() => {
    if (userLocation) return [userLocation[1], userLocation[0]];
    if (temporaryMapPin) return [temporaryMapPin[1], temporaryMapPin[0]];
    return [10.7769, 106.7009]; // Default TP. Hồ Chí Minh center
  }, [userLocation, temporaryMapPin]);

  // Compute Real Distances for Rooms
  const roomsWithDistance = useMemo(() => {
    return rooms.map((r) => {
      const lat = r.latitude || 10.7769;
      const lng = r.longitude || 106.7009;
      const distMeters = calculateHaversineDistance(
        referenceCoords[0],
        referenceCoords[1],
        lat,
        lng
      );
      return {
        ...r,
        calculatedMeters: distMeters,
        formattedDistance: formatMeters(distMeters),
      };
    });
  }, [rooms, referenceCoords]);

  // Filter Rooms
  const filteredRooms = useMemo(() => {
    return roomsWithDistance.filter((r) => {
      if (pinTypeFilter === 'points') return false;

      // City filter
      if (selectedCity === 'hcm' && r.provinceOrCity && r.provinceOrCity !== 'TP. Hồ Chí Minh')
        return false;
      if (selectedCity === 'hn' && r.provinceOrCity && r.provinceOrCity !== 'Hà Nội') return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = r.productName.toLowerCase().includes(q);
        const matchPoint = r.pickupPoint.toLowerCase().includes(q);
        const matchSupplier = r.supplierName.toLowerCase().includes(q);
        if (!matchName && !matchPoint && !matchSupplier) return false;
      }

      // Near Target Tier
      if (nearTargetTierOnly) {
        const next = getNextTier(r.totalQuantity, r.priceTiers);
        if (!next || next.requiredQuantity > 3) return false;
      }

      return true;
    });
  }, [roomsWithDistance, pinTypeFilter, selectedCity, searchQuery, nearTargetTierOnly]);

  // Compute Real Distances for Pickup Points
  const pointsWithDistance = useMemo(() => {
    return pickupPoints.map((pt) => {
      const lat = pt.latitude || 10.775;
      const lng = pt.longitude || 106.702;
      const distMeters = calculateHaversineDistance(
        referenceCoords[0],
        referenceCoords[1],
        lat,
        lng
      );
      return {
        ...pt,
        calculatedMeters: distMeters,
        formattedDistance: formatMeters(distMeters),
      };
    });
  }, [pickupPoints, referenceCoords]);

  // Filter Pickup Points
  const filteredPoints = useMemo(() => {
    return pointsWithDistance.filter((pt) => {
      if (pinTypeFilter === 'rooms') return false;

      // City filter
      if (selectedCity === 'hcm' && pt.provinceOrCity && pt.provinceOrCity !== 'TP. Hồ Chí Minh')
        return false;
      if (selectedCity === 'hn' && pt.provinceOrCity && pt.provinceOrCity !== 'Hà Nội') return false;

      // Category / Type
      if (selectedPickupType !== 'all' && pt.type !== selectedPickupType) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = pt.name.toLowerCase().includes(q);
        const matchAddr = pt.address.toLowerCase().includes(q);
        if (!matchName && !matchAddr) return false;
      }

      return true;
    });
  }, [pointsWithDistance, pinTypeFilter, selectedCity, selectedPickupType, searchQuery]);

  // Grouped Search Results for Top Search Bar
  const groupedSearchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.toLowerCase();

    const matchedDistricts = LocationService.getDistricts('hcm')
      .concat(LocationService.getDistricts('hn'))
      .filter((d) => d.name.toLowerCase().includes(q));
    const matchedAreas = (AREAS[selectedCity] || []).filter((a) =>
      a.name.toLowerCase().includes(q)
    );

    const matchedRooms = roomsWithDistance
      .filter((r) => r.productName.toLowerCase().includes(q))
      .slice(0, 3);

    const matchedPts = pointsWithDistance
      .filter((p) => p.name.toLowerCase().includes(q) || p.address.toLowerCase().includes(q))
      .slice(0, 3);

    const matchedSuppliers = Array.from(new Set(rooms.map((r) => r.supplierName)))
      .filter((s) => s.toLowerCase().includes(q))
      .slice(0, 2);

    return {
      areas: matchedAreas,
      districts: matchedDistricts,
      rooms: matchedRooms,
      points: matchedPts,
      suppliers: matchedSuppliers,
    };
  }, [searchQuery, roomsWithDistance, pointsWithDistance, selectedCity, rooms]);

  // Directions URL Generator
  const getDirectionsUrl = (destLat: number, destLng: number) => {
    if (userLocation) {
      return `https://www.google.com/maps/dir/?api=1&origin=${userLocation[1]},${userLocation[0]}&destination=${destLat},${destLng}`;
    }
    return `https://www.google.com/maps/dir/?api=1&destination=${destLat},${destLng}`;
  };

  // ----------------------------------------------------
  // INITIALIZE MAPLIBRE GL JS WITH VECTOR BASEMAP & CUSTOM LABELS
  // ----------------------------------------------------
  // ----------------------------------------------------
  // INITIALIZE MAPLIBRE GL JS ONCE (ROBUST VECTOR/RASTER BASEMAP)
  // ----------------------------------------------------
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    let isMounted = true;
    setIsLoadingVectorStyle(true);
    setVectorStyleError(null);

    const initMap = async () => {
      try {
        console.log(`[FlashMap] Initializing MapLibre instance with preset "${activeStylePreset}"`);
        const initialStyle = await buildFlashGroupVectorStyle(activeStylePreset);

        if (!isMounted || !mapContainerRef.current) return;

        const map = new Map({
          container: mapContainerRef.current,
          style: initialStyle,
          center: [106.7009, 10.7769], // Default TP. Hồ Chí Minh
          zoom: 13.5,
          minZoom: 3,
          maxZoom: 20,
          attributionControl: { compact: true },
        });

        mapInstanceRef.current = map;

        let hasMarkedReady = false;
        const markMapReady = () => {
          if (hasMarkedReady || !isMounted) return;
          hasMarkedReady = true;
          console.info('[FlashMap] Map is ready for display! Style preset:', activeStylePreset);
          setIsMapLoaded(true);
          setHasMapError(false);
          setIsLoadingVectorStyle(false);
          map.resize();
          renderMarkersRef.current();
        };

        map.once('load', markMapReady);
        map.once('idle', markMapReady);
        map.on('style.load', () => {
          console.info('[FlashMap] Basemap style loaded successfully');
          map.resize();
          renderMarkersRef.current();
        });

        // Fail-safe guard timeout: Never let the loading spinner hang
        const loadGuardTimer = setTimeout(() => {
          if (!hasMarkedReady) {
            console.warn('[FlashMap] Map load timeout guard triggered, forcing display');
            markMapReady();
          }
        }, 2000);

        map.on('error', (e) => {
          console.error('[FlashMap] MapLibre runtime event:', e);
        });

        // Map Click for "CHỌN TRÊN BẢN ĐỒ"
        map.on('click', (e) => {
          const coords: [number, number] = [
            Number(e.lngLat.lng.toFixed(6)),
            Number(e.lngLat.lat.toFixed(6)),
          ];
          setTemporaryMapPin(coords);
          setTemporaryPinConfirmed(false);
        });

        // Ensure resize on frame and timeouts
        requestAnimationFrame(() => map.resize());
        const t1 = setTimeout(() => map.resize(), 100);
        const t2 = setTimeout(() => map.resize(), 300);
        const t3 = setTimeout(() => map.resize(), 600);

        const handleResize = () => map.resize();
        window.addEventListener('resize', handleResize);

        const observer = new ResizeObserver(() => map.resize());
        if (mapContainerRef.current) {
          observer.observe(mapContainerRef.current);
        }

        return () => {
          clearTimeout(loadGuardTimer);
          clearTimeout(t1);
          clearTimeout(t2);
          clearTimeout(t3);
          window.removeEventListener('resize', handleResize);
          observer.disconnect();
          map.remove();
          mapInstanceRef.current = null;
        };
      } catch (err: any) {
        console.error('[FlashMap] Failed to initialize map, trying fallback:', err);
        if (isMounted && mapContainerRef.current) {
          try {
            const fallbackStyle = getOsmRasterStyle();
            const map = new Map({
              container: mapContainerRef.current,
              style: fallbackStyle,
              center: [106.7009, 10.7769],
              zoom: 13.5,
              attributionControl: { compact: true },
            });
            mapInstanceRef.current = map;
            setIsMapLoaded(true);
            setHasMapError(false);
            setIsLoadingVectorStyle(false);
            setTimeout(() => map.resize(), 100);
          } catch (fallbackErr) {
            setHasMapError(true);
            setVectorStyleError('Không thể tải bản đồ. Vui lòng kiểm tra kết nối mạng.');
            setIsLoadingVectorStyle(false);
          }
        }
      }
    };

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // ----------------------------------------------------
  // SWITCH BASEMAP STYLE PRESET (USES map.setStyle(), NO RE-CREATING MAP)
  // ----------------------------------------------------
  const isFirstStyleRun = useRef(true);
  useEffect(() => {
    if (isFirstStyleRun.current) {
      isFirstStyleRun.current = false;
      return;
    }
    const map = mapInstanceRef.current;
    if (!map) return;

    let isCancelled = false;
    setIsLoadingVectorStyle(true);

    buildFlashGroupVectorStyle(activeStylePreset)
      .then((newStyle) => {
        if (isCancelled || !mapInstanceRef.current) return;
        console.info('[FlashMap] Switching basemap style to:', activeStylePreset);
        mapInstanceRef.current.setStyle(newStyle);
      })
      .catch((err) => {
        console.error('[FlashMap] Failed to update style preset:', err);
      })
      .finally(() => {
        if (!isCancelled) setIsLoadingVectorStyle(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [activeStylePreset]);


  // ----------------------------------------------------
  // RENDER MARKERS (STREET MAP FIRST - NO DUPLICATE LABELS)
  // ----------------------------------------------------
  const renderMarkers = useCallback(() => {
    const map = mapInstanceRef.current;
    if (!map || !isMapLoaded) return;

    // Clear old markers
    activeMarkersRef.current.forEach((m) => m.remove());
    activeMarkersRef.current = [];

    // 1. User GPS Location Marker
    if (userLocation) {
      const el = document.createElement('div');
      el.className = 'user-gps-marker';
      el.innerHTML = `
        <div style="
          position: relative;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <div style="
            position: absolute;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: rgba(49, 85, 255, 0.35);
            animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
          "></div>
          <div style="
            position: relative;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: #3155FF;
            border: 3px solid #FFFFFF;
            box-shadow: 0 4px 10px rgba(49, 85, 255, 0.5);
          "></div>
        </div>
      `;
      const popup = new MaplibrePopup({ offset: 15 }).setHTML(`
        <div style="font-size: 12px; font-weight: bold; color: #0C0D10; padding: 4px;">
          📍 Vị trí hiện tại của bạn (GPS)
          ${locationAccuracy ? `<div style="font-size: 10px; color: #596273; font-weight: normal;">Độ chính xác: ±${locationAccuracy}m</div>` : ''}
        </div>
      `);
      const marker = new MaplibreMarker({ element: el })
        .setLngLat(userLocation)
        .setPopup(popup)
        .addTo(map);
      activeMarkersRef.current.push(marker);
    }

    // 2. Temporary Pin (CHỌN TRÊN BẢN ĐỒ / ĐỊA CHỈ)
    if (temporaryMapPin) {
      const el = document.createElement('div');
      el.className = 'temp-address-pin';
      el.innerHTML = `
        <div style="
          display: flex;
          flex-direction: column;
          align-items: center;
          cursor: grab;
          transform: translateY(-50%);
        ">
          <div style="
            width: 38px;
            height: 38px;
            border-radius: 12px;
            background: #3155FF;
            border: 3px solid #FFFFFF;
            box-shadow: 0 8px 20px rgba(58, 36, 56, 0.45);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #FFFFFF;
            font-size: 16px;
          ">
            📍
          </div>
          <div style="
            width: 0;
            height: 0;
            border-left: 6px solid transparent;
            border-right: 6px solid transparent;
            border-top: 7px solid #3155FF;
            margin-top: -1px;
          "></div>
        </div>
      `;
      const popup = new MaplibrePopup({ offset: 25 }).setHTML(`
        <div style="font-size: 12px; font-weight: bold; color: #0C0D10; padding: 4px;">
          <div>📍 Vị trí địa chỉ bạn chọn</div>
          <div style="font-size: 10px; color: #596273; font-weight: normal; margin-top: 2px;">
            ${geocodedInfo?.precisionInfo || 'Kéo hoặc click trên bản đồ để di chuyển'}
          </div>
        </div>
      `);
      const marker = new MaplibreMarker({ element: el, draggable: true })
        .setLngLat(temporaryMapPin)
        .setPopup(popup)
        .addTo(map);

      marker.on('dragend', () => {
        const lngLat = marker.getLngLat();
        setTemporaryMapPin([Number(lngLat.lng.toFixed(6)), Number(lngLat.lat.toFixed(6))]);
        setTemporaryPinConfirmed(false);
      });

      activeMarkersRef.current.push(marker);
    }

    // 3. Group Room Markers (Plum Color #A15C78 with emoji)
    if (pinTypeFilter === 'all' || pinTypeFilter === 'rooms') {
      filteredRooms.forEach((room) => {
        const lat = room.latitude || 10.7769;
        const lng = room.longitude || 106.7009;
        const isSelected = selectedRoomId === room.id;
        const currentPrice =
          room.finalPrice ?? getCurrentPrice(room.totalQuantity, room.priceTiers);
        const nextTier = getNextTier(room.totalQuantity, room.priceTiers);
        const percent = Math.min(
          100,
          Math.round((room.totalQuantity / room.maxQuantity) * 100)
        );

        const el = document.createElement('div');
        el.className = 'custom-room-marker cursor-pointer';
        el.innerHTML = `
          <div style="
            display: flex;
            flex-direction: column;
            align-items: center;
            transform: translateY(-50%) ${isSelected ? 'scale(1.15)' : ''};
            transition: transform 0.2s ease;
          ">
            <div style="
              width: ${isSelected ? '46px' : '38px'};
              height: ${isSelected ? '46px' : '38px'};
              background: ${isSelected ? '#1C35B8' : '#3155FF'}; color: #FFFFFF;
              border: 3px solid #FFFFFF;
              box-shadow: ${isSelected ? '0 0 0 3px #3155FF, 0 8px 20px rgba(49, 85, 255, 0.45)' : '0 8px 20px rgba(49, 85, 255, 0.25)'};
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: ${isSelected ? '22px' : '17px'};
            ">
              ${room.emoji}
            </div>
            <div style="
              width: 0;
              height: 0;
              border-left: 6px solid transparent;
              border-right: 6px solid transparent;
              border-top: 7px solid ${isSelected ? '#1C35B8' : '#3155FF'};
              margin-top: -1px;
            "></div>
          </div>
        `;

        // Marketplace Card Popup
        const popupContent = `
          <div style="width: 250px; font-family: sans-serif; color: #0C0D10; padding: 4px;">
            <div style="display: flex; gap: 10px; align-items: center;">
              <img src="${room.productImage}" alt="${room.productName}" style="width: 52px; height: 52px; border-radius: 10px; object-fit: cover; border: 1px solid #E4E8F0;" />
              <div style="min-width: 0; flex: 1;">
                <div style="font-size: 10px; font-weight: 700; color: #596273; text-transform: uppercase; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                  ${room.supplierName} • DEMO
                </div>
                <h4 style="font-size: 13px; font-weight: 900; color: #0C0D10; margin: 2px 0 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                  ${room.emoji} ${room.productName.toUpperCase()}
                </h4>
                <div style="display: flex; align-items: baseline; gap: 6px; margin-top: 2px;">
                  <span style="font-size: 14px; font-weight: 900; color: #0C0D10;">
                    ${formatVND(currentPrice)}
                  </span>
                  <span style="font-size: 10px; text-decoration: line-through; color: #596273;">
                    ${formatVND(room.initialPrice)}
                  </span>
                </div>
              </div>
            </div>

            <div style="background: #F6F7FC; border: 1px solid #E4E8F0; border-radius: 10px; padding: 8px; margin: 8px 0; font-size: 11px;">
              <div style="display: flex; justify-content: space-between; font-weight: 700; color: #596273;">
                <span>${room.totalQuantity} / ${room.maxQuantity} ${room.unit}</span>
                <span style="color: #3155FF; font-weight: 900;">${percent}%</span>
              </div>
              <div style="width: 100%; height: 6px; background: #E4E8F0; border-radius: 999px; overflow: hidden; margin-top: 4px;">
                <div style="width: ${percent}%; height: 100%; background: #3155FF; border-radius: 999px;"></div>
              </div>
              ${
                nextTier
                  ? `<div style="font-size: 10px; color: #3155FF; font-weight: 800; margin-top: 4px;">
                      CÒN ${nextTier.requiredQuantity} SẢN PHẨM ĐỂ GIẢM CÒN ${formatVND(nextTier.nextPrice)}
                    </div>`
                  : ''
              }
            </div>

            <div style="font-size: 10px; color: #596273; display: flex; justify-content: space-between; border-top: 1px solid #E4E8F0; padding-top: 6px;">
              <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">ĐIỂM NHẬN: ${room.pickupPoint}</span>
              <span style="font-weight: 800; color: #0C0D10; margin-left: 6px;">${room.formattedDistance}</span>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-top: 8px;">
              <button id="popup-btn-room-${room.id}" style="
                background: #3155FF;
                color: #ffffff;
                border: none;
                border-radius: 8px;
                padding: 6px;
                font-size: 11px;
                font-weight: 800;
                cursor: pointer;
              ">
                XEM PHÒNG
              </button>
              <a href="${getDirectionsUrl(lat, lng)}" target="_blank" rel="noreferrer" style="
                background: #F6F7FC;
                color: #3155FF;
                border: 1px solid #E4E8F0;
                border-radius: 8px;
                padding: 6px;
                font-size: 11px;
                font-weight: 800;
                text-align: center;
                text-decoration: none;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
              ">
                CHỈ ĐƯỜNG
              </a>
            </div>
          </div>
        `;

        const popup = new MaplibrePopup({ offset: 25, maxWidth: '280px' }).setHTML(
          popupContent
        );

        popup.on('open', () => {
          const btn = document.getElementById(`popup-btn-room-${room.id}`);
          if (btn) {
            btn.onclick = () => onSelectRoom(room.id);
          }
        });

        el.onclick = () => {
          setSelectedPointId(null);
          setSelectedRoomId(room.id);
        };

        const marker = new MaplibreMarker({ element: el })
          .setLngLat([lng, lat])
          .setPopup(popup)
          .addTo(map);

        activeMarkersRef.current.push(marker);
      });
    }

    // 4. Pickup Point Markers (Coral Color #E58E72 with parcel icon)
    if (pinTypeFilter === 'all' || pinTypeFilter === 'points') {
      filteredPoints.forEach((point) => {
        const lat = point.latitude || 10.775;
        const lng = point.longitude || 106.702;
        const isSelected = selectedPointId === point.id;
        const loadPercent = Math.min(
          100,
          Math.round((point.currentLoad / point.capacity) * 100)
        );

        const el = document.createElement('div');
        el.className = 'custom-pickup-marker cursor-pointer';
        el.innerHTML = `
          <div style="
            display: flex;
            flex-direction: column;
            align-items: center;
            transform: translateY(-50%) ${isSelected ? 'scale(1.15)' : ''};
            transition: transform 0.2s ease;
          ">
            <div style="
              width: ${isSelected ? '42px' : '34px'};
              height: ${isSelected ? '42px' : '34px'};
              border-radius: 12px;
              background: #C7F000; color: #0C0D10;
              border: ${isSelected ? '3px solid #3155FF' : '2.5px solid #FFFFFF'};
              box-shadow: 0 6px 16px rgba(229, 142, 114, 0.45);
              display: flex;
              align-items: center;
              justify-content: center;
              color: #ffffff;
              font-size: 14px;
            ">
              📦
            </div>
            <div style="
              width: 0;
              height: 0;
              border-left: 5px solid transparent;
              border-right: 5px solid transparent;
              border-top: 6px solid ${isSelected ? '#3155FF' : '#C7F000'};
              margin-top: -1px;
            "></div>
          </div>
        `;

        const popupContent = `
          <div style="width: 250px; font-family: sans-serif; color: #0C0D10; padding: 4px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 10px; font-weight: 800; background: #EEF1FF; color: #3155FF; padding: 2px 6px; border-radius: 4px;">
                ${point.type.toUpperCase()}
              </span>
              <span style="font-size: 10px; font-weight: 700; color: #596273;">
                ${point.formattedDistance}
              </span>
            </div>

            <h4 style="font-size: 13px; font-weight: 900; color: #0C0D10; margin: 6px 0 2px;">
              ${point.name}
            </h4>
            <div style="font-size: 11px; color: #596273; line-height: 1.3;">
              ${point.address}
            </div>

            <div style="background: #F6F7FC; border: 1px solid #E4E8F0; border-radius: 10px; padding: 8px; margin: 8px 0; font-size: 11px;">
              <div style="display: flex; justify-content: space-between; font-weight: 700; color: #596273;">
                <span>Sức chứa:</span>
                <span>${point.currentLoad} / ${point.capacity} ngăn</span>
              </div>
              <div style="width: 100%; height: 6px; background: #E4E8F0; border-radius: 999px; overflow: hidden; margin-top: 4px;">
                <div style="width: ${loadPercent}%; height: 100%; background: #C7F000; color: #0C0D10; border-radius: 999px;"></div>
              </div>
              <div style="display: flex; justify-content: space-between; font-size: 10px; color: #596273; margin-top: 4px;">
                <span>Mở cửa: ${point.operatingHours}</span>
                <span style="color: #3155FF; font-weight: 800;">
                  ${point.status === 'active' ? 'Đang nhận gom' : 'Đầy'}
                </span>
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px;">
              <button id="popup-btn-point-${point.id}" style="
                background: #3155FF; color: #ffffff;
                border: none;
                border-radius: 8px;
                padding: 6px;
                font-size: 11px;
                font-weight: 800;
                cursor: pointer;
              ">
                XEM ĐIỂM NHẬN
              </button>
              <a href="${getDirectionsUrl(lat, lng)}" target="_blank" rel="noreferrer" style="
                background: #F6F7FC;
                color: #3155FF;
                border: 1px solid #E4E8F0;
                border-radius: 8px;
                padding: 6px;
                font-size: 11px;
                font-weight: 800;
                text-align: center;
                text-decoration: none;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
              ">
                CHỈ ĐƯỜNG
              </a>
            </div>
          </div>
        `;

        const popup = new MaplibrePopup({ offset: 20, maxWidth: '280px' }).setHTML(
          popupContent
        );

        popup.on('open', () => {
          const btn = document.getElementById(`popup-btn-point-${point.id}`);
          if (btn && onSelectPickupPoint) {
            btn.onclick = () => onSelectPickupPoint(point.id);
          }
        });

        el.onclick = () => {
          setSelectedRoomId(null);
          setSelectedPointId(point.id);
          if (onSelectPickupPoint) onSelectPickupPoint(point.id);
        };

        const marker = new MaplibreMarker({ element: el })
          .setLngLat([lng, lat])
          .setPopup(popup)
          .addTo(map);

        activeMarkersRef.current.push(marker);
      });
    }
  }, [
    isMapLoaded,
    userLocation,
    locationAccuracy,
    temporaryMapPin,
    geocodedInfo,
    pinTypeFilter,
    filteredRooms,
    filteredPoints,
    selectedRoomId,
    selectedPointId,
    onSelectRoom,
    onSelectPickupPoint,
  ]);

  // Re-run markers on updates
  useEffect(() => {
    renderMarkersRef.current = renderMarkers;
    renderMarkers();
  }, [renderMarkers]);

  // ----------------------------------------------------
  // GEOLOCATION ACTION HANDLER
  // ----------------------------------------------------
  const handleRequestUserLocation = () => {
    if (!navigator.geolocation) {
      setLocationPermissionStatus('unsupported');
      setLocationNotice(
        'Trình duyệt không hỗ trợ Geolocation. Bạn có thể chọn khu vực bằng tay.'
      );
      return;
    }

    setLocationPermissionStatus('prompting');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lng = pos.coords.longitude;
        const lat = pos.coords.latitude;
        setUserLocation([lng, lat]);
        setLocationAccuracy(Math.round(pos.coords.accuracy || 15));
        setLocationPermissionStatus('granted');

        mapInstanceRef.current?.flyTo({
          center: [lng, lat],
          zoom: 15,
          essential: true,
        });

        setLocationNotice(
          `Đã định vị vị trí của bạn thành công (Độ chính xác: ±${Math.round(pos.coords.accuracy || 15)}m)`
        );
      },
      (err) => {
        console.warn('Geolocation denied or error:', err.message);
        setLocationPermissionStatus('denied');
        setLocationNotice(
          'VỊ TRÍ CHƯA ĐƯỢC CHIA SẺ (Vui lòng chọn Tỉnh/Thành hoặc khu vực).'
        );
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  // Change Area Handler
  const handleSelectArea = (areaId: string) => {
    setSelectedArea(areaId);
    const currentAreaList = AREAS[selectedCity] || [];
    const matched = currentAreaList.find((a) => a.id === areaId);
    if (matched && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo({
        center: matched.center,
        zoom: matched.zoom,
        essential: true,
      });
    }
  };

  // Handle Geocoded Address Selection
  const handleAddressGeocoded = (res: GeocodedLocation) => {
    setGeocodedInfo(res);
    setTemporaryMapPin([res.longitude, res.latitude]);
    setTemporaryPinConfirmed(false);
    mapInstanceRef.current?.flyTo({
      center: [res.longitude, res.latitude],
      zoom: 15.5,
      essential: true,
    });
  };

  const handleConfirmAddress = (res: GeocodedLocation) => {
    setTemporaryPinConfirmed(true);
    setLocationNotice(`Đã xác nhận vị trí nhận hàng: ${res.formattedAddress}`);
  };

  return (
    <div className="space-y-6">
      {/* 1. TOP HEADER & SEARCH BAR */}
      <div className="bg-[#FFFFFF] rounded-3xl border border-[#E4E8F0] p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 bg-[#EEF1FF] text-[#3155FF] px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2 border border-[#E4E8F0]">
              <Compass className="w-3.5 h-3.5 text-[#3155FF]" />
              <span>FLASHMAP • BẢN ĐỒ ĐƯỜNG PHỐ SIÊU CỤC BỘ</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#0C0D10] tracking-tight uppercase">
              BẢN ĐỒ PHÒNG GOM & ĐIỂM NHẬN HÀNG
            </h1>
            <p className="text-xs sm:text-sm text-[#596273] mt-1 max-w-2xl leading-relaxed">
              Khám phá các phòng gom theo khu phố, chung cư, tòa nhà văn phòng và mạng lưới Smart Locker gần bạn trên nền bản đồ đường phố OpenStreetMap thời gian thực.
            </p>
          </div>

          {/* Action Buttons: Geolocation & Address Flow */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => setShowAddressSelector((prev) => !prev)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer border ${
                showAddressSelector
                  ? 'bg-[#EEF1FF] text-[#3155FF] border-[#E4E8F0]'
                  : 'bg-[#FFFFFF] text-[#0C0D10] hover:bg-[#F6F7FC] border-[#E4E8F0] shadow-xs'
              }`}
            >
              <Building2 className="w-4 h-4 text-[#3155FF]" />
              <span>{showAddressSelector ? 'ẨN CHỌN ĐỊA CHỈ' : 'CHỌN ĐỊA CHỈ'}</span>
            </button>

            <button
              onClick={handleRequestUserLocation}
              disabled={locationPermissionStatus === 'prompting'}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-[#3155FF] hover:bg-[#2444DC] text-white shadow-md shadow-[#3155FF]/20 transition-all active:scale-95 cursor-pointer"
            >
              <Navigation
                className={`w-4 h-4 ${locationPermissionStatus === 'prompting' ? 'animate-spin' : ''}`}
              />
              <span>
                {locationPermissionStatus === 'granted'
                  ? 'CẬP NHẬT VỊ TRÍ'
                  : 'DÙNG VỊ TRÍ CỦA TÔI'}
              </span>
            </button>
          </div>
        </div>

        {/* Top Search Bar */}
        <div className="relative">
          <div className="relative flex items-center">
            <Search className="w-5 h-5 text-[#596273] absolute left-4 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchDropdownOpen(Boolean(e.target.value.trim()));
              }}
              onFocus={() => {
                if (searchQuery.trim()) setIsSearchDropdownOpen(true);
              }}
              placeholder="TÌM ĐỊA CHỈ, KHU VỰC, PHÒNG GOM HOẶC ĐIỂM NHẬN..."
              className="w-full pl-12 pr-10 py-3.5 bg-[#F6F7FC] hover:bg-white focus:bg-white border border-[#E4E8F0] focus:border-[#3155FF] rounded-2xl text-xs sm:text-sm font-semibold text-[#0C0D10] placeholder:text-[#596273] focus:outline-none focus:ring-2 focus:ring-[#3155FF]/20 transition shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setIsSearchDropdownOpen(false);
                }}
                className="absolute right-3.5 p-1 text-[#596273] hover:text-[#0C0D10] rounded-full cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Grouped Search Results Dropdown */}
          {isSearchDropdownOpen && groupedSearchResults && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-[#FFFFFF] rounded-2xl shadow-2xl border border-[#E4E8F0] z-50 overflow-hidden divide-y divide-[#E4E8F0]/60 max-h-96 overflow-y-auto animate-fade-in text-xs">
              {/* Group: KHU VỰC */}
              {groupedSearchResults.areas.length > 0 && (
                <div className="p-3">
                  <div className="text-[10px] font-black uppercase text-[#596273] tracking-wider mb-1.5 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#3155FF]" />
                    <span>KHU VỰC</span>
                  </div>
                  {groupedSearchResults.areas.map((ar) => (
                    <div
                      key={ar.id}
                      onClick={() => {
                        handleSelectArea(ar.id);
                        setIsSearchDropdownOpen(false);
                      }}
                      className="p-2 rounded-xl hover:bg-[#EEF1FF] cursor-pointer font-bold text-[#0C0D10] flex items-center justify-between"
                    >
                      <span>{ar.name}</span>
                      <span className="text-[10px] text-[#3155FF] font-semibold">Xem trên bản đồ &rarr;</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Group: PHÒNG GOM */}
              {groupedSearchResults.rooms.length > 0 && (
                <div className="p-3">
                  <div className="text-[10px] font-black uppercase text-[#596273] tracking-wider mb-1.5 flex items-center gap-1">
                    <Package className="w-3.5 h-3.5 text-[#A15C78]" />
                    <span>PHÒNG GOM</span>
                  </div>
                  {groupedSearchResults.rooms.map((rm) => (
                    <div
                      key={rm.id}
                      onClick={() => {
                        setSelectedRoomId(rm.id);
                        if (rm.latitude && rm.longitude) {
                          mapInstanceRef.current?.flyTo({
                            center: [rm.longitude, rm.latitude],
                            zoom: 16,
                            essential: true,
                          });
                        }
                        setIsSearchDropdownOpen(false);
                      }}
                      className="p-2 rounded-xl hover:bg-[#EEF1FF] cursor-pointer flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-[#0C0D10]">{rm.emoji} {rm.productName}</div>
                        <div className="text-[11px] text-[#596273]">Điểm: {rm.pickupPoint} • {rm.formattedDistance}</div>
                      </div>
                      <span className="font-black text-[#3155FF]">{formatVND(rm.finalPrice || rm.initialPrice)}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Group: ĐIỂM NHẬN */}
              {groupedSearchResults.points.length > 0 && (
                <div className="p-3">
                  <div className="text-[10px] font-black uppercase text-[#596273] tracking-wider mb-1.5 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-[#E58E72]" />
                    <span>ĐIỂM NHẬN HÀNG</span>
                  </div>
                  {groupedSearchResults.points.map((pt) => (
                    <div
                      key={pt.id}
                      onClick={() => {
                        setSelectedPointId(pt.id);
                        if (pt.latitude && pt.longitude) {
                          mapInstanceRef.current?.flyTo({
                            center: [pt.longitude, pt.latitude],
                            zoom: 16,
                            essential: true,
                          });
                        }
                        setIsSearchDropdownOpen(false);
                      }}
                      className="p-2 rounded-xl hover:bg-[#F6F7FC] cursor-pointer flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-[#0C0D10]">{pt.name}</div>
                        <div className="text-[11px] text-[#596273] line-clamp-1">{pt.address} • {pt.formattedDistance}</div>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#EEF1FF] text-[#3155FF]">
                        {pt.type.toUpperCase()}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Group: NHÀ CUNG CẤP */}
              {groupedSearchResults.suppliers.length > 0 && (
                <div className="p-3">
                  <div className="text-[10px] font-black uppercase text-[#596273] tracking-wider mb-1.5 flex items-center gap-1">
                    <Store className="w-3.5 h-3.5 text-[#C58B52]" />
                    <span>NHÀ CUNG CẤP</span>
                  </div>
                  {groupedSearchResults.suppliers.map((sup, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setSearchQuery(sup);
                        setIsSearchDropdownOpen(false);
                      }}
                      className="p-2 rounded-xl hover:bg-[#F6F7FC] cursor-pointer font-bold text-[#0C0D10] flex items-center justify-between"
                    >
                      <span>{sup}</span>
                      <span className="text-[10px] text-[#3155FF] font-semibold">Lọc phòng gom &rarr;</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Location Notice Banner */}
        {locationNotice && (
          <div
            className={`p-3 rounded-2xl text-xs font-semibold flex items-center justify-between ${
              locationPermissionStatus === 'granted'
                ? 'bg-[#EEF1FF] text-[#3155FF] border border-[#E4E8F0]'
                : 'bg-amber-50 text-amber-900 border border-amber-200'
            }`}
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#3155FF] shrink-0" />
              <span>{locationNotice}</span>
            </div>
            <button onClick={() => setLocationNotice(null)} className="text-[#596273] hover:text-[#0C0D10] cursor-pointer">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Structured Address Selector Component (Full Vietnam Administrative Flow) */}
        {showAddressSelector && (
          <div className="pt-2 animate-fade-in">
            <VietnamAddressSelector
              onViewOnMap={(geocoded, vAddr) => {
                handleAddressGeocoded({
                  latitude: geocoded.latitude,
                  longitude: geocoded.longitude,
                  confidence: geocoded.confidence,
                  confidenceLabel: geocoded.confidenceLabel,
                  precisionInfo: geocoded.source,
                  formattedAddress: vAddr.formattedAddress || '',
                });
              }}
              onConfirmAddress={(vAddr, geocoded) => {
                handleConfirmAddress({
                  latitude: geocoded?.latitude || vAddr.latitude || 10.7769,
                  longitude: geocoded?.longitude || vAddr.longitude || 106.7009,
                  confidence: geocoded?.confidence || 'approximate',
                  confidenceLabel: geocoded?.confidenceLabel || 'VỊ TRÍ TÌM ĐƯỢC',
                  precisionInfo: geocoded?.source || 'administrative_center',
                  formattedAddress: vAddr.formattedAddress || '',
                });
              }}

            />
          </div>
        )}
      </div>

      {/* 2. MAIN MAP VIEW (GOOGLE MAPS LAYOUT: LEFT 380px, RIGHT MAP EXPANDS) */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* LEFT COLUMN: FILTERS & ROOM RESULT CARDS (380px width) */}
        <div className="w-full lg:w-[380px] shrink-0 space-y-4">
          {/* Filter Panel */}
          <div className="bg-[#FFFFFF] rounded-3xl border border-[#E4E8F0] p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#E4E8F0]/80 pb-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-[#0C0D10] flex items-center gap-1.5">
                <Filter className="w-4 h-4 text-[#3155FF]" />
                <span>BỘ LỌC FLASHMAP</span>
              </h3>
              <span className="text-xs font-bold text-[#3155FF] bg-[#EEF1FF] px-2.5 py-0.5 rounded-full border border-[#E4E8F0]">
                {filteredRooms.length} phòng • {filteredPoints.length} điểm
              </span>
            </div>

            {/* City Selector */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase text-[#596273] tracking-wider">
                THÀNH PHỐ
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {CITIES.filter((c) => c.id !== 'all').map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setSelectedCity(c.id);
                      const firstArea = AREAS[c.id]?.[0];
                      if (firstArea && mapInstanceRef.current) {
                        setSelectedArea(firstArea.id);
                        mapInstanceRef.current.flyTo({
                          center: firstArea.center,
                          zoom: firstArea.zoom,
                          essential: true,
                        });
                      }
                    }}
                    className={`py-2 px-2.5 rounded-xl text-xs font-bold border transition text-center cursor-pointer ${
                      selectedCity === c.id ? 'bg-[#C7F000] text-[#0C0D10] border-[#3155FF] shadow-xs font-black' : 'bg-white text-[#0C0D10] hover:bg-[#EEF1FF] border-[#E4E8F0]'
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Sub-areas Chips */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase text-[#596273] tracking-wider">
                KHU VỰC CHI TIẾT
              </label>
              <div className="flex flex-wrap gap-1.5">
                {(AREAS[selectedCity] || []).map((ar) => (
                  <button
                    key={ar.id}
                    onClick={() => handleSelectArea(ar.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                      selectedArea === ar.id ? 'bg-[#C7F000] text-[#0C0D10] border-[#3155FF] shadow-xs font-black' : 'bg-white text-[#0C0D10] hover:bg-[#EEF1FF] border-[#E4E8F0]'
                    }`}
                  >
                    {ar.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Pin Type Filters */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase text-[#596273] tracking-wider">
                LOẠI GHIM HIỂN THỊ
              </label>
              <div className="grid grid-cols-3 gap-1 bg-[#EEF1FF]/70 p-1 rounded-xl">
                {[
                  { id: 'all', label: 'Tất cả' },
                  { id: 'rooms', label: '🛒 Phòng gom' },
                  { id: 'points', label: '📦 Điểm nhận' },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setPinTypeFilter(t.id as any)}
                    className={`py-1.5 rounded-lg text-[11px] font-bold transition cursor-pointer text-center ${
                      pinTypeFilter === t.id ? 'bg-[#C7F000] text-[#0C0D10] shadow-xs font-black' : 'text-[#596273] hover:text-[#0C0D10]'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Radius Options */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase text-[#596273] tracking-wider">
                BÁN KÍNH TÌM KIẾM
              </label>
              <div className="grid grid-cols-5 gap-1">
                {[
                  { label: '1 KM', val: 1000 },
                  { label: '3 KM', val: 3000 },
                  { label: '5 KM', val: 5000 },
                  { label: '10 KM', val: 10000 },
                  { label: '20 KM', val: 20000 },
                ].map((r) => (
                  <button
                    key={r.val}
                    onClick={() => setSelectedRadius(r.val)}
                    className={`py-1.5 rounded-xl text-[10px] font-bold border transition text-center cursor-pointer ${
                      selectedRadius === r.val ? 'bg-[#C7F000] text-[#0C0D10] border-[#3155FF] shadow-xs font-black' : 'bg-white text-[#596273] hover:bg-[#EEF1FF] border-[#E4E8F0]'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Pickup Point Categories */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase text-[#596273] tracking-wider">
                LOẠI ĐIỂM NHẬN
              </label>
              <select
                value={selectedPickupType}
                onChange={(e) => setSelectedPickupType(e.target.value)}
                className="w-full px-3 py-2 bg-[#F6F7FC] border border-[#E4E8F0] rounded-xl text-xs font-bold text-[#0C0D10] focus:outline-none focus:border-[#3155FF]"
              >
                <option value="all">Tất cả loại điểm nhận</option>
                <option value="locker">SMART LOCKER (Tự động 24/7)</option>
                <option value="apartment">CHUNG CƯ / TÒA NHÀ</option>
                <option value="community">KHU DÂN CƯ / TỔ DÂN PHỐ</option>
                <option value="office">TÒA NHÀ VĂN PHÒNG</option>
                <option value="store">CỬA HÀNG ĐỐI TÁC</option>
                <option value="hub">LOCAL COLLECTION HUB</option>
                <option value="dormitory">KÝ TÚC XÁ (DORMITORY)</option>
              </select>
            </div>

            {/* Special Opportunity Toggle */}
            <div className="pt-2 border-t border-[#E4E8F0]/80">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={nearTargetTierOnly}
                  onChange={(e) => setNearTargetTierOnly(e.target.checked)}
                  className="w-4 h-4 rounded text-[#3155FF] focus:ring-[#3155FF] border-[#E4E8F0]"
                />
                <span className="text-xs font-bold text-[#0C0D10] flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#3155FF]" />
                  Chỉ hiện phòng sắp đạt mốc giá rẻ tiếp theo
                </span>
              </label>
            </div>
          </div>

          {/* List of Result Cards */}
          <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
            <div className="text-[11px] font-black uppercase text-[#596273] tracking-wider flex items-center justify-between">
              <span>DANH SÁCH PHÒNG GOM GẦN ĐÂY</span>
              <span>{filteredRooms.length} phòng</span>
            </div>
            {filteredRooms.length === 0 ? (
              <div className="bg-[#FFFFFF] rounded-2xl p-6 text-center text-xs text-[#596273] border border-[#E4E8F0]">
                Không có phòng gom nào phù hợp với bộ lọc trong bán kính đã chọn
              </div>
            ) : (
              filteredRooms.map((r) => {
                const currentPrice = r.finalPrice ?? getCurrentPrice(r.totalQuantity, r.priceTiers);
                const nextTier = getNextTier(r.totalQuantity, r.priceTiers);
                const isSelected = selectedRoomId === r.id;

                return (
                  <div
                    key={r.id}
                    onClick={() => {
                      setSelectedRoomId(r.id);
                      if (r.latitude && r.longitude && mapInstanceRef.current) {
                        mapInstanceRef.current.flyTo({
                          center: [r.longitude, r.latitude],
                          zoom: 16,
                          essential: true,
                        });
                      }
                    }}
                    className={`bg-[#FFFFFF] rounded-2xl p-4 border transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md ${
                      isSelected ? 'border-[#3155FF] ring-2 ring-[#3155FF]/30 bg-[#EAF7FF]' : 'border-[#E4E8F0] hover:border-[#3155FF] bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-[#596273] block">
                          {r.supplierName} • DEMO
                        </span>
                        <h4 className="font-black text-sm text-[#0C0D10] mt-0.5">
                          {r.emoji} {r.productName.toUpperCase()}
                        </h4>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EEF1FF] text-[#3155FF]">
                        {r.totalQuantity}/{r.maxQuantity}
                      </span>
                    </div>

                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="text-base font-black text-[#0C0D10]">
                        {formatVND(currentPrice)}
                      </span>
                      <span className="text-xs text-[#596273] line-through">
                        {formatVND(r.initialPrice)}
                      </span>
                      {nextTier && (
                        <span className="text-[10px] font-bold text-[#3155FF] bg-[#F6F7FC] px-1.5 py-0.5 rounded border border-[#E4E8F0] ml-auto">
                          Còn {nextTier.requiredQuantity} sp để giảm tiếp
                        </span>
                      )}
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-[#E4E8F0]/80 flex items-center justify-between text-xs text-[#596273]">
                      <div className="flex items-center gap-1.5 truncate">
                        <MapPin className="w-3.5 h-3.5 text-[#3155FF] shrink-0" />
                        <span className="truncate">{r.pickupPoint}</span>
                      </div>
                      <span className="font-bold text-[#0C0D10] shrink-0 ml-2">
                        📏 {r.formattedDistance}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectRoom(r.id);
                        }}
                        className="w-full py-2 rounded-xl bg-[#3155FF] hover:bg-[#3155FF] text-white font-extrabold text-xs shadow-sm text-center block transition cursor-pointer"
                      >
                        XEM PHÒNG
                      </button>
                      <a
                        href={getDirectionsUrl(r.latitude || 10.7769, r.longitude || 106.7009)}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="w-full py-2 rounded-xl bg-white hover:bg-[#EEF1FF] text-[#0C0D10] border border-[#3155FF] font-extrabold text-xs text-center flex items-center justify-center gap-1 transition cursor-pointer"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        <span>CHỈ ĐƯỜNG</span>
                      </a>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: LARGE INTERACTIVE STREET MAP CONTAINER (REAL DIMENSIONS) */}
        <div className="w-full lg:flex-1 min-w-0 space-y-4">
          <div
            className="flashmap-container rounded-3xl overflow-hidden shadow-xl border border-[#E4E8F0] relative"
          >
            {/* Loading Indicator */}
            {(!isMapLoaded || isLoadingVectorStyle) && !hasMapError && (
              <div className="absolute inset-0 z-20 bg-[#F6F7FC]/80 backdrop-blur-xs flex flex-col items-center justify-center space-y-3">
                <div className="w-10 h-10 border-4 border-[#3155FF] border-t-transparent rounded-full animate-spin"></div>
                <span className="text-xs font-bold text-[#3155FF] uppercase tracking-wider">
                  Đang tải bản đồ FlashGroup...
                </span>
              </div>
            )}

            {/* Error Fallback (Req 2: Clear configuration / network error) */}
            {hasMapError && (
              <div className="absolute inset-0 z-30 bg-[#FFFFFF]/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
                <AlertCircle className="w-12 h-12 text-[#3155FF] mb-3" />
                <h3 className="text-lg font-black text-[#0C0D10] uppercase tracking-wide">
                  KHÔNG THỂ TẢI BẢN ĐỒ
                </h3>
                <p className="text-xs text-[#596273] max-w-md mt-1 mb-2 leading-relaxed">
                  {vectorStyleError || 'Đã xảy ra sự cố kết nối máy chủ bản đồ. Danh sách phòng gom và điểm nhận vẫn hoạt động bình thường.'}
                </p>
                {!getMapApiKey() && (
                  <p className="text-[11px] text-[#3155FF] max-w-md mb-4 bg-[#EEF1FF] p-2.5 rounded-xl border border-[#E4E8F0] leading-relaxed">
                    💡 Cấu hình: Nếu bạn sử dụng MapTiler hoặc nhà cung cấp vector cần khóa truy cập, vui lòng thiết lập biến môi trường <code>VITE_MAP_API_KEY</code> trong <code>.env</code>.
                  </p>
                )}
                <button
                  onClick={() => {
                    setHasMapError(false);
                    setActiveStylePreset('streets');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#3155FF] hover:bg-[#3155FF] text-white font-black text-xs shadow-md transition active:scale-95 cursor-pointer flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>THỬ LẠI</span>
                </button>
              </div>
            )}

            {/* Actual MapLibre DOM Node with Real Dimensions */}
            <div
              ref={mapContainerRef}
              className="w-full h-full min-h-[500px] relative"
            />

            {/* Floating Map Style Selector (BẢN ĐỒ / TỐI GIẢN / VỆ TINH) */}
            <div className="absolute top-4 left-4 z-10 flex items-center bg-[#FFFFFF]/95 backdrop-blur-md p-1 rounded-2xl shadow-lg border border-[#E4E8F0]">
              {availableStylePresets.map((preset) => {
                const isActive = activeStylePreset === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setActiveStylePreset(preset.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-[#3155FF] text-white shadow-xs'
                        : 'text-[#596273] hover:text-[#0C0D10] hover:bg-[#EEF1FF]'
                    }`}
                    title={preset.description}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>


            {/* Floating Controls (+, -, My Location) */}
            <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
              <button
                onClick={() => mapInstanceRef.current?.zoomIn()}
                title="Phóng to (+)"
                className="w-10 h-10 rounded-xl bg-[#FFFFFF]/95 hover:bg-white text-[#0C0D10] hover:text-[#3155FF] shadow-lg border border-[#E4E8F0] flex items-center justify-center transition cursor-pointer"
              >
                <Plus className="w-5 h-5" />
              </button>
              <button
                onClick={() => mapInstanceRef.current?.zoomOut()}
                title="Thu nhỏ (-)"
                className="w-10 h-10 rounded-xl bg-[#FFFFFF]/95 hover:bg-white text-[#0C0D10] hover:text-[#3155FF] shadow-lg border border-[#E4E8F0] flex items-center justify-center transition cursor-pointer"
              >
                <Minus className="w-5 h-5" />
              </button>
              <button
                onClick={handleRequestUserLocation}
                title="Vị trí của tôi"
                className="w-10 h-10 rounded-xl bg-[#FFFFFF]/95 hover:bg-white text-[#0C0D10] hover:text-[#3155FF] shadow-lg border border-[#E4E8F0] flex items-center justify-center transition cursor-pointer"
              >
                <LocateFixed className="w-5 h-5" />
              </button>
            </div>

            {/* Map Legend */}
            <div className="absolute bottom-4 left-4 z-10 bg-[#FFFFFF]/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-[#E4E8F0] text-[11px] font-bold text-[#0C0D10] space-y-2 pointer-events-auto max-w-xs">
              <div className="text-[10px] font-black uppercase tracking-wider text-[#596273]">
                CHÚ THÍCH BẢN ĐỒ ĐƯỜNG PHỐ
              </div>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#3155FF] border border-white shrink-0"></div>
                  <span>Vị trí của bạn</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-md bg-[#3155FF] border border-white shrink-0"></div>
                  <span>Phòng gom</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-md bg-[#C7F000] border border-white shrink-0"></div>
                  <span>Điểm nhận</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-md bg-[#C7F000] border border-white shrink-0"></div>
                  <span>Nhà cung cấp</span>
                </div>
              </div>
            </div>

            {/* Legal Attribution (Requirement 9) */}
            <div className="absolute bottom-2 right-4 z-10 text-[10px] text-[#596273] bg-[#FFFFFF]/90 px-2 py-0.5 rounded backdrop-blur-xs pointer-events-auto border border-[#E4E8F0]">
              © <a
                href="https://www.openstreetmap.org/copyright"
                target="_blank"
                rel="noreferrer"
                className="underline hover:text-[#0C0D10]"
              >
                OpenStreetMap
              </a> contributors
            </div>

            {/* Mobile Bottom Sheet Trigger */}
            <div className="lg:hidden absolute bottom-4 right-4 z-10">
              <button
                onClick={() => setIsMobileSheetOpen((prev) => !prev)}
                className="px-4 py-2.5 rounded-2xl bg-[#3155FF] text-white font-bold text-xs shadow-xl flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <span>{filteredRooms.length} PHÒNG GOM</span>
                <ChevronUp
                  className={`w-4 h-4 transition-transform ${isMobileSheetOpen ? 'rotate-180' : ''}`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
