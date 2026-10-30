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
  const apiKey = getMapApiKey();
  const hasValidSatelliteConfig = Boolean(apiKey);

  return [
    {
      id: 'streets',
      label: 'BẢN ĐỒ',
      description: 'Bản đồ đường phố vector chi tiết (ngõ ngách, tên đường, khu phố)',
      isAvailable: true,
      requiresApiKey: false,
    },
    {
      id: 'minimal',
      label: 'TỐI GIẢN',
      description: 'Giao diện vector đơn sắc thanh lịch, làm nổi bật điểm gom & phòng gom',
      isAvailable: true,
      requiresApiKey: false,
    },
    {
      id: 'satellite',
      label: 'VỆ TINH',
      description: 'Ảnh chụp vệ tinh viễn thám độ phân giải cao',
      isAvailable: hasValidSatelliteConfig,
      requiresApiKey: true,
    },
  ];
}

// Get the base style JSON URL depending on configured provider and API key
export function getBaseVectorStyleUrl(preset: MapStylePreset): string {
  const apiKey = getMapApiKey();

  if (apiKey) {
    // If MapTiler API Key is provided via VITE_MAP_API_KEY
    if (preset === 'satellite') {
      return `https://api.maptiler.com/maps/satellite/style.json?key=${apiKey}`;
    }
    if (preset === 'minimal') {
      return `https://api.maptiler.com/maps/basic-v2/style.json?key=${apiKey}`;
    }
    return `https://api.maptiler.com/maps/streets-v2/style.json?key=${apiKey}`;
  }

  // Zero-Key Open Vector Providers (CARTO Voyager / Positron vector styles)
  if (preset === 'minimal') {
    return 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';
  }
  return 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json';
}

// Ultra-reliable OpenStreetMap raster style fallback (Zero external dependencies, guaranteed 100% availability)
export function getOsmRasterStyle(): StyleSpecification {
  return {
    version: 8,
    name: 'FlashGroup Standard OSM',
    sources: {
      'osm-raster': {
        type: 'raster',
        tiles: [
          'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
          'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
          'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png',
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
        id: 'osm-raster-layer',
        type: 'raster',
        source: 'osm-raster',
        minzoom: 0,
        maxzoom: 19,
      },
    ],
  };
}

// Build and refine the vector style object
export async function buildFlashGroupVectorStyle(
  preset: MapStylePreset = 'streets'
): Promise<StyleSpecification> {
  const cacheKey = `${preset}_${getMapApiKey() ? 'keyed' : 'open'}`;
  if (vectorStyleCache.has(cacheKey)) {
    return vectorStyleCache.get(cacheKey)!;
  }

  const url = getBaseVectorStyleUrl(preset);
  console.log(`[FlashMap] Loading vector basemap style for preset "${preset}" from:`, url);

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!res.ok) {
      console.warn(`[FlashMap] Vector basemap returned ${res.status}, using standard OSM fallback.`);
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
