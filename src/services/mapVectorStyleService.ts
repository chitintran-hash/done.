// MapVectorStyleService: Controlled Vector Basemap Builder for FlashGroup
// Integrates vector basemap (MapLibre-compatible) + controlled layer filtering + FlashGroup Vietnamese geographic labels

import type { StyleSpecification } from 'maplibre-gl';

export type MapStylePreset = 'streets' | 'minimal' | 'satellite';

export interface StylePresetOption {
  id: MapStylePreset;
  label: string;
  description: string;
  isAvailable: boolean;
  requiresApiKey: boolean;
}

// In-Memory Style Cache to avoid re-fetching on preset switches
const vectorStyleCache = new Map<string, StyleSpecification>();

// Geographic Coordinates for FlashGroup Vietnamese Display Labels
// (Strict application-level labels only - no fabricated sovereignty boundaries or polygons)
export const FLASHGROUP_GEOGRAPHIC_LABELS_GEOJSON = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        id: 'hoang_sa',
        name: 'QUẦN ĐẢO HOÀNG SA',
        type: 'archipelago',
        minzoom: 4,
        maxzoom: 12,
      },
      geometry: {
        type: 'Point',
        coordinates: [111.9, 16.5],
      },
    },
    {
      type: 'Feature',
      properties: {
        id: 'truong_sa',
        name: 'QUẦN ĐẢO TRƯỜNG SA',
        type: 'archipelago',
        minzoom: 4,
        maxzoom: 12,
      },
      geometry: {
        type: 'Point',
        coordinates: [114.3, 10.0],
      },
    },
    {
      type: 'Feature',
      properties: {
        id: 'bien_dong',
        name: 'BIỂN ĐÔNG',
        type: 'sea',
        minzoom: 4,
        maxzoom: 8,
      },
      geometry: {
        type: 'Point',
        coordinates: [113.2, 14.2],
      },
    },
  ],
};

// Check configured vector provider API key from environment variable
export function getMapApiKey(): string {
  const envKey = (import.meta.env.VITE_MAP_API_KEY as string | undefined)?.trim();
  return envKey || '';
}

// Check available style presets
export function getAvailableStylePresets(): StylePresetOption[] {
  return [
    {
      id: 'streets',
      label: 'BẢN ĐỒ',
      description: 'Bản đồ đường phố chi tiết (ngõ ngách, tên đường, khu dân cư, công viên)',
      isAvailable: true,
      requiresApiKey: false,
    },
    {
      id: 'minimal',
      label: 'TỐI GIẢN',
      description: 'Giao diện đơn sắc thanh lịch, làm nổi bật điểm gom & phòng gom',
      isAvailable: true,
      requiresApiKey: false,
    },
    {
      id: 'satellite',
      label: 'VỆ TINH',
      description: 'Ảnh chụp vệ tinh viễn thám độ phân giải cao Esri World Imagery',
      isAvailable: true,
      requiresApiKey: false,
    },
  ];
}

// Get the base style JSON URL depending on configured provider and API key
export function getBaseVectorStyleUrl(preset: MapStylePreset): string {
  const apiKey = getMapApiKey();

  if (apiKey) {
    if (preset === 'satellite') {
      return `https://api.maptiler.com/maps/satellite/style.json?key=${apiKey}`;
    }
    if (preset === 'minimal') {
      return `https://api.maptiler.com/maps/basic-v2/style.json?key=${apiKey}`;
    }
    return `https://api.maptiler.com/maps/streets-v2/style.json?key=${apiKey}`;
  }

  // Without an API key, do not load any external provider requiring credentials
  return '';
}

// Guaranteed OpenStreetMap street basemap style (Zero watermark, 100% open, high detail)
export function getOsmRasterStyle(): StyleSpecification {
  return {
    version: 8,
    name: 'FlashGroup Standard Streets',
    glyphs: 'https://fonts.openmaptiles.org/{fontstack}/{range}.pbf',
    sources: {
      'osm-tiles': {
        type: 'raster',
        tiles: [
          'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
          'https://a.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
          'https://b.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
        ],
        tileSize: 256,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxzoom: 19,
      },
      'flashgroup-geographic-labels': {
        type: 'geojson',
        data: FLASHGROUP_GEOGRAPHIC_LABELS_GEOJSON as any,
      },
    },
    layers: [
      {
        id: 'osm-tiles-layer',
        type: 'raster',
        source: 'osm-tiles',
        minzoom: 0,
        maxzoom: 19,
      },
      {
        id: 'flashgroup-geographic-labels-layer',
        type: 'symbol',
        source: 'flashgroup-geographic-labels',
        minzoom: 3,
        maxzoom: 13,
        layout: {
          'text-field': ['get', 'name'],
          'text-font': ['Open Sans Bold', 'Noto Sans Regular'],
          'text-size': [
            'interpolate',
            ['linear'],
            ['zoom'],
            3, 11,
            6, 12,
            8, 13,
            11, 14,
          ],
          'text-letter-spacing': 0.05,
          'text-transform': 'uppercase',
          'text-allow-overlap': false,
          'text-ignore-placement': false,
          'symbol-placement': 'point',
        },
        paint: {
          'text-color': '#0C0D10',
          'text-halo-color': '#ffffff',
          'text-halo-width': 2,
          'text-halo-blur': 0.5,
        },
      },
    ],
  };
}

// Minimal basemap style (Esri Light Gray Canvas & Labels - Clean & Watermark-Free)
export function getMinimalRasterStyle(): StyleSpecification {
  return {
    version: 8,
    name: 'FlashGroup Minimal Canvas',
    glyphs: 'https://fonts.openmaptiles.org/{fontstack}/{range}.pbf',
    sources: {
      'esri-gray-base': {
        type: 'raster',
        tiles: [
          'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
        ],
        tileSize: 256,
        attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
        maxzoom: 19,
      },
      'esri-gray-labels': {
        type: 'raster',
        tiles: [
          'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}',
        ],
        tileSize: 256,
        maxzoom: 19,
      },
      'flashgroup-geographic-labels': {
        type: 'geojson',
        data: FLASHGROUP_GEOGRAPHIC_LABELS_GEOJSON as any,
      },
    },
    layers: [
      {
        id: 'esri-gray-base-layer',
        type: 'raster',
        source: 'esri-gray-base',
        minzoom: 0,
        maxzoom: 19,
      },
      {
        id: 'esri-gray-labels-layer',
        type: 'raster',
        source: 'esri-gray-labels',
        minzoom: 0,
        maxzoom: 19,
      },
      {
        id: 'flashgroup-geographic-labels-layer',
        type: 'symbol',
        source: 'flashgroup-geographic-labels',
        minzoom: 3,
        maxzoom: 13,
        layout: {
          'text-field': ['get', 'name'],
          'text-font': ['Open Sans Bold', 'Noto Sans Regular'],
          'text-size': [
            'interpolate',
            ['linear'],
            ['zoom'],
            3, 11,
            6, 12,
            8, 13,
            11, 14,
          ],
          'text-letter-spacing': 0.05,
          'text-transform': 'uppercase',
          'text-allow-overlap': false,
          'text-ignore-placement': false,
          'symbol-placement': 'point',
        },
        paint: {
          'text-color': '#0C0D10',
          'text-halo-color': '#ffffff',
          'text-halo-width': 2,
          'text-halo-blur': 0.5,
        },
      },
    ],
  };
}

// Satellite basemap style (Esri World Imagery)
export function getSatelliteRasterStyle(): StyleSpecification {
  return {
    version: 8,
    name: 'FlashGroup Satellite Imagery',
    glyphs: 'https://fonts.openmaptiles.org/{fontstack}/{range}.pbf',
    sources: {
      'esri-satellite': {
        type: 'raster',
        tiles: [
          'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        ],
        tileSize: 256,
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
        maxzoom: 19,
      },
      'flashgroup-geographic-labels': {
        type: 'geojson',
        data: FLASHGROUP_GEOGRAPHIC_LABELS_GEOJSON as any,
      },
    },
    layers: [
      {
        id: 'esri-satellite-layer',
        type: 'raster',
        source: 'esri-satellite',
        minzoom: 0,
        maxzoom: 19,
      },
      {
        id: 'flashgroup-geographic-labels-layer',
        type: 'symbol',
        source: 'flashgroup-geographic-labels',
        minzoom: 3,
        maxzoom: 13,
        layout: {
          'text-field': ['get', 'name'],
          'text-font': ['Open Sans Bold', 'Noto Sans Regular'],
          'text-size': [
            'interpolate',
            ['linear'],
            ['zoom'],
            3, 11,
            6, 12,
            8, 13,
            11, 14,
          ],
          'text-letter-spacing': 0.05,
          'text-transform': 'uppercase',
          'text-allow-overlap': false,
          'text-ignore-placement': false,
          'symbol-placement': 'point',
        },
        paint: {
          'text-color': '#ffffff',
          'text-halo-color': '#000000',
          'text-halo-width': 2,
          'text-halo-blur': 0.5,
        },
      },
    ],
  };
}

// Build and refine the style object
export async function buildFlashGroupVectorStyle(
  preset: MapStylePreset = 'streets'
): Promise<StyleSpecification> {
  const cacheKey = `${preset}_${getMapApiKey() ? 'keyed' : 'open'}`;
  if (vectorStyleCache.has(cacheKey)) {
    return vectorStyleCache.get(cacheKey)!;
  }

  // Preset routing: instantaneous & robust basemap specifications
  if (preset === 'minimal') {
    const minStyle = getMinimalRasterStyle();
    vectorStyleCache.set(cacheKey, minStyle);
    return minStyle;
  }

  if (preset === 'satellite') {
    const satStyle = getSatelliteRasterStyle();
    vectorStyleCache.set(cacheKey, satStyle);
    return satStyle;
  }

  // Default 'streets' preset:
  const apiKey = getMapApiKey();
  if (!apiKey) {
    // Zero-Key: Return OpenStreetMap street style instantly with full Vietnamese labels
    const streetsStyle = getOsmRasterStyle();
    vectorStyleCache.set(cacheKey, streetsStyle);
    return streetsStyle;
  }

  const url = getBaseVectorStyleUrl(preset);
  console.log(`[FlashMap] Loading keyed vector basemap style for preset "${preset}" from:`, url);

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!res.ok) {
      console.warn(`[FlashMap] Vector basemap returned ${res.status}, using standard streets fallback.`);
      return getOsmRasterStyle();
    }

    const baseStyle: StyleSpecification = await res.json();
  const disabledLayers: string[] = [];
  const modifiedLayers: string[] = [];

  // Provider Label Suppression Rules:
  // Identify and hide layers that render conflicting foreign-language sea / marine / disputed island labels
  const CONFLICTING_LAYER_PATTERNS = [
    /^watername_sea$/i,
    /^watername_ocean$/i,
    /marine-label/i,
    /sea-label/i,
    /ocean-label/i,
    /disputed/i,
  ];

  // Vietnamese Language Preference Expression
  const vietnameseTextExpr = [
    'coalesce',
    ['get', 'name:vi'],
    ['get', 'name_vi'],
    ['get', 'name:en'],
    ['get', 'name_en'],
    ['get', 'name'],
  ];

  const processedLayers = baseStyle.layers.map((layer) => {
    // 1. Hide conflicting provider sea/ocean/disputed label layers
    const isConflictingLayer = CONFLICTING_LAYER_PATTERNS.some((pattern) =>
      pattern.test(layer.id)
    );

    if (isConflictingLayer) {
      disabledLayers.push(layer.id);
      return {
        ...layer,
        layout: {
          ...(layer.layout || {}),
          visibility: 'none',
        },
      };
    }

    // 2. Adjust place labels to prioritize Vietnamese text
    if (
      layer.type === 'symbol' &&
      layer.layout &&
      'text-field' in layer.layout &&
      layer.id.startsWith('place_')
    ) {
      modifiedLayers.push(layer.id);
      return {
        ...layer,
        layout: {
          ...layer.layout,
          'text-field': vietnameseTextExpr,
        },
        // Filter out conflicting foreign administrative entity names (e.g., Sansha / Xisha)
        filter: layer.filter
          ? [
              'all',
              layer.filter,
              ['!=', ['get', 'name'], 'Sansha'],
              ['!=', ['get', 'name:en'], 'Sansha'],
              ['!=', ['get', 'name'], 'Xisha'],
              ['!=', ['get', 'name'], 'Nansha'],
            ]
          : [
              'all',
              ['!=', ['get', 'name'], 'Sansha'],
              ['!=', ['get', 'name:en'], 'Sansha'],
              ['!=', ['get', 'name'], 'Xisha'],
              ['!=', ['get', 'name'], 'Nansha'],
            ],
      };
    }

    return layer;
  });

  // 3. Inject FlashGroup Controlled GeoJSON Label Source
  const flashgroupGeoSource = {
    type: 'geojson',
    data: FLASHGROUP_GEOGRAPHIC_LABELS_GEOJSON,
  };

  // 4. Inject FlashGroup Controlled Symbol Layer
  // Styled like normal, subtle map typography (no black badge, no button appearance, no political banner)
  const flashgroupGeoLayer = {
    id: 'flashgroup-geographic-labels-layer',
    type: 'symbol',
    source: 'flashgroup-geographic-labels',
    minzoom: 3,
    maxzoom: 13,
    layout: {
      'text-field': ['get', 'name'],
      'text-font': ['Montserrat SemiBold', 'Open Sans Bold', 'Noto Sans Regular'],
      'text-size': [
        'interpolate',
        ['linear'],
        ['zoom'],
        3, 11,
        6, 12,
        8, 13,
        11, 14,
      ],
      'text-letter-spacing': 0.05,
      'text-transform': 'uppercase',
      'text-allow-overlap': false,
      'text-ignore-placement': false,
      'symbol-placement': 'point',
    },
    paint: {
      'text-color': '#0C0D10', // Text Main
      'text-halo-color': '#ffffff',
      'text-halo-width': 1.5,
      'text-halo-blur': 0.5,
    },
  };

  const finalStyle: StyleSpecification = {
    ...baseStyle,
    sources: {
      ...baseStyle.sources,
      'flashgroup-geographic-labels': flashgroupGeoSource as any,
    },
    layers: [...processedLayers, flashgroupGeoLayer as any],
  };

  console.log('[FlashMap] Vector style configured successfully:', {
    preset,
    totalLayers: finalStyle.layers.length,
    disabledProviderLayers: disabledLayers,
    vietnameseLocalizedLayers: modifiedLayers.length,
    injectedCustomLayer: 'flashgroup-geographic-labels-layer',
  });

  vectorStyleCache.set(cacheKey, finalStyle);
  return finalStyle;
} catch (err) {
  console.warn('[FlashMap] Vector style processing failed, falling back to OSM raster style:', err);
  return getOsmRasterStyle();
}
}
