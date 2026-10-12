'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { DesignLayer, TextLayer, ImageLayer } from './types';

export const CANVAS_WIDTH = 2048;
export const CANVAS_HEIGHT = 1024;

export const SAFE_ZONE = {
  minX: 160,
  maxX: 1888,
  minY: 130, // ~15mm from rim
  maxY: 894, // ~10mm from bottom
};

export function useCanvasTexture(layers: DesignLayer[], showSafeZone: boolean) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const textureRef = useRef<THREE.CanvasTexture | null>(null);
  const [texture, setTexture] = useState<THREE.CanvasTexture | null>(null);
  const imageCacheRef = useRef<Map<string, HTMLImageElement>>(new Map());
  const [isOutOfSafeZone, setIsOutOfSafeZone] = useState(false);

  // Initialize Canvas & CanvasTexture once
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const canvas = document.createElement('canvas');
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    canvasRef.current = canvas;

    const canvasTex = new THREE.CanvasTexture(canvas);
    canvasTex.wrapS = THREE.RepeatWrapping;
    canvasTex.wrapT = THREE.ClampToEdgeWrapping;
    canvasTex.minFilter = THREE.LinearFilter;
    canvasTex.magFilter = THREE.LinearFilter;
    canvasTex.generateMipmaps = false;
    textureRef.current = canvasTex;
    setTexture(canvasTex);

    return () => {
      canvasTex.dispose();
    };
  }, []);

  // Preload and cache images
  useEffect(() => {
    layers.forEach((layer) => {
      if ((layer.type === 'image' || layer.type === 'sticker') && layer.url) {
        if (!imageCacheRef.current.has(layer.url)) {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.src = layer.url;
          img.onload = () => {
            imageCacheRef.current.set(layer.url, img);
            redraw();
          };
        }
      }
    });
  }, [layers]);

  // Redraw Canvas
  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 1. Clear with 100% transparency
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    let hasOutOfBounds = false;

    // 2. Optional Safe Print Zone Guideline overlay
    if (showSafeZone) {
      ctx.save();
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.4)';
      ctx.lineWidth = 4;
      ctx.setLineDash([16, 12]);
      ctx.strokeRect(
        SAFE_ZONE.minX,
        SAFE_ZONE.minY,
        SAFE_ZONE.maxX - SAFE_ZONE.minX,
        SAFE_ZONE.maxY - SAFE_ZONE.minY
      );

      ctx.fillStyle = 'rgba(59, 130, 246, 0.6)';
      ctx.font = 'bold 24px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('--- VÙNG IN AN TOÀN (15MM CÁCH MIỆNG LY) ---', CANVAS_WIDTH / 2, SAFE_ZONE.minY - 20);
      ctx.fillText('--- GIỚI HẠN ĐÁY LY (10MM CÁCH ĐÁY) ---', CANVAS_WIDTH / 2, SAFE_ZONE.maxY + 36);
      ctx.restore();
    }

    // 3. Render Layers in Order
    layers.forEach((layer) => {
      if (!layer.visible) return;

      ctx.save();
      ctx.translate(layer.x, layer.y);
      ctx.rotate((layer.rotation * Math.PI) / 180);
      ctx.scale(layer.scale, layer.scale);
      ctx.globalAlpha = layer.opacity;

      if (layer.type === 'text') {
        const textLayer = layer as TextLayer;
        const fontStyle = `${textLayer.isItalic ? 'italic ' : ''}${textLayer.isBold ? 'bold ' : ''}${textLayer.fontSize}px ${textLayer.font}`;
        ctx.font = fontStyle;
        ctx.fillStyle = textLayer.color;
        ctx.textAlign = textLayer.align;
        ctx.textBaseline = 'middle';

        // Multi-line support
        const lines = (textLayer.text || '').split('\n');
        const lineHeight = textLayer.fontSize * (textLayer.lineHeight || 1.25);
        const totalHeight = (lines.length - 1) * lineHeight;

        lines.forEach((line, index) => {
          const yOffset = index * lineHeight - totalHeight / 2;
          ctx.fillText(line, 0, yOffset);
        });

        // Safe zone calculation check
        const halfH = ((totalHeight + textLayer.fontSize) * layer.scale) / 2;
        if (
          layer.y - halfH < SAFE_ZONE.minY ||
          layer.y + halfH > SAFE_ZONE.maxY
        ) {
          hasOutOfBounds = true;
        }
      } else if (layer.type === 'image' || layer.type === 'sticker') {
        const imgLayer = layer as ImageLayer;
        const img = imageCacheRef.current.get(imgLayer.url);

        if (img && img.complete) {
          // Strictly preserves natural aspect ratio without stretching
          ctx.drawImage(
            img,
            -imgLayer.width / 2,
            -imgLayer.height / 2,
            imgLayer.width,
            imgLayer.height
          );
        }

        // Safe zone calculation check
        const halfH = (imgLayer.height * layer.scale) / 2;
        if (
          layer.y - halfH < SAFE_ZONE.minY ||
          layer.y + halfH > SAFE_ZONE.maxY
        ) {
          hasOutOfBounds = true;
        }
      }

      ctx.restore();
    });

    setIsOutOfSafeZone(hasOutOfBounds);

    if (textureRef.current) {
      textureRef.current.needsUpdate = true;
    }
  }, [layers, showSafeZone]);

  useEffect(() => {
    // Check if fonts are loaded then redraw
    if (typeof document !== 'undefined' && document.fonts) {
      document.fonts.ready.then(() => {
        redraw();
      });
    }
    redraw();
  }, [layers, showSafeZone, redraw]);

  // Export High Resolution 2D Flat Sheet for production
  const exportFlatPrintSheet = useCallback((): string => {
    if (!canvasRef.current) return '';
    return canvasRef.current.toDataURL('image/png');
  }, []);

  return {
    canvasRef,
    texture,
    isOutOfSafeZone,
    redraw,
    exportFlatPrintSheet,
  };
}
