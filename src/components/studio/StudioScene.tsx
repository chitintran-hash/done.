'use client';

import React, { Suspense, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { Cup3DModel } from './Cup3DModel';
import { CupModelDef, CupColorOption, StudioViewMode } from './types';
import { RotateCw, ZoomIn, ZoomOut, Compass, Sparkles } from 'lucide-react';

interface StudioSceneProps {
  modelDef: CupModelDef;
  selectedColor: CupColorOption;
  lidColor: string;
  canvasTexture: THREE.CanvasTexture | null;
  viewMode: StudioViewMode;
  showSafeZone: boolean;
  isAutoRotating: boolean;
  setIsAutoRotating: (v: boolean) => void;
  onCanvasReady?: (canvas: HTMLCanvasElement) => void;
}

export function StudioScene({
  modelDef,
  selectedColor,
  lidColor,
  canvasTexture,
  viewMode,
  showSafeZone,
  isAutoRotating,
  setIsAutoRotating,
  onCanvasReady,
}: StudioSceneProps) {
  const controlsRef = useRef<any>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  const resetCamera = (position: [number, number, number]) => {
    if (controlsRef.current) {
      controlsRef.current.object.position.set(...position);
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  };

  const zoomCamera = (delta: number) => {
    if (controlsRef.current) {
      const camera = controlsRef.current.object;
      const factor = delta > 0 ? 0.85 : 1.15;
      camera.position.multiplyScalar(factor);
      controlsRef.current.update();
    }
  };

  const tableY = modelDef.id === 'glass_rocks' ? -1.0 : modelDef.id === 'glass_tall' ? -1.8 : -1.5;

  return (
    <div
      ref={canvasContainerRef}
      className={`relative w-full h-full overflow-hidden select-none transition-colors duration-300 ${
        viewMode === 'studio'
          ? 'bg-[#FFF9E8]'
          : viewMode === 'white'
          ? 'bg-[#FFFFFF]'
          : 'bg-transparent'
      }`}
      style={
        viewMode === 'transparent'
          ? {
              backgroundImage: `radial-gradient(#e5e7eb 1px, transparent 1px), radial-gradient(#e5e7eb 1px, transparent 1px)`,
              backgroundSize: '24px 24px',
              backgroundPosition: '0 0, 12px 12px',
              backgroundColor: '#f9fafb'
            }
          : undefined
      }
    >
      {/* Studio Lighting Ambient Glow (Only in Studio Mode) */}
      {viewMode === 'studio' && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-50/40 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-[#EDECEA]/40 to-transparent"></div>
        </div>
      )}

      {/* Floating 3D Interaction Guide */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 bg-white/90 px-4 py-2 rounded-full shadow-sm text-xs font-bold text-[#3A211E] border border-[#E8DFD8] backdrop-blur-md">
        <Sparkles className="w-3.5 h-3.5 text-[#FFBF00]" />
        <span>Kéo chuột để xoay 360° • Cuộn để phóng to/thu nhỏ</span>
      </div>

      {/* Quick Camera Preset Controls Overlay */}
      <div className="absolute bottom-6 left-6 z-10 flex flex-col gap-2">
        <div className="bg-white/90 backdrop-blur-md p-1.5 rounded-2xl border border-[#E8DFD8] shadow-md flex flex-col gap-1">
          <button
            onClick={() => resetCamera([0, 1.5, 7.0])}
            title="Góc nhìn chính diện"
            className="p-2 hover:bg-[#FFF9E8] text-[#3A211E] rounded-xl transition-colors text-xs font-bold flex items-center gap-2"
          >
            <Compass className="w-4 h-4 text-[#3A211E]" />
            <span className="hidden md:inline">Chính diện</span>
          </button>
          <button
            onClick={() => resetCamera([4.5, 2.8, 5.0])}
            title="Góc nhìn 45 độ"
            className="p-2 hover:bg-[#FFF9E8] text-[#3A211E] rounded-xl transition-colors text-xs font-bold flex items-center gap-2"
          >
            <Compass className="w-4 h-4 text-[#3A211E] rotate-45" />
            <span className="hidden md:inline">Góc nghiêng 45°</span>
          </button>
          <button
            onClick={() => resetCamera([0, 5.5, 3.5])}
            title="Góc nhìn từ trên xuống"
            className="p-2 hover:bg-[#FFF9E8] text-[#3A211E] rounded-xl transition-colors text-xs font-bold flex items-center gap-2"
          >
            <Compass className="w-4 h-4 text-[#3A211E] rotate-90" />
            <span className="hidden md:inline">Nhìn từ trên</span>
          </button>
          <div className="h-px bg-[#E8DFD8] my-1"></div>
          <button
            onClick={() => zoomCamera(1)}
            title="Phóng to"
            className="p-2 hover:bg-[#FFF9E8] text-[#3A211E] rounded-xl transition-colors flex items-center justify-center"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => zoomCamera(-1)}
            title="Thu nhỏ"
            className="p-2 hover:bg-[#FFF9E8] text-[#3A211E] rounded-xl transition-colors flex items-center justify-center"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsAutoRotating(!isAutoRotating)}
            title={isAutoRotating ? 'Dừng tự xoay' : 'Bật tự động xoay 360°'}
            className={`p-2 rounded-xl transition-colors flex items-center justify-center ${
              isAutoRotating ? 'bg-[#3A211E] text-white' : 'hover:bg-[#FFF9E8] text-[#3A211E]'
            }`}
          >
            <RotateCw className={`w-4 h-4 ${isAutoRotating ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* R3F 3D Canvas */}
      <Suspense
        fallback={
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <div className="w-10 h-10 border-3 border-[#E8DFD8] border-t-[#FFBF00] rounded-full animate-spin"></div>
            <span className="font-bold text-xs text-[#3A211E]">Đang tải môi trường 3D Studio...</span>
          </div>
        }
      >
        <Canvas
          camera={{ position: [0, 1.8, 7.2], fov: 42 }}
          shadows
          gl={{
            preserveDrawingBuffer: true,
            antialias: true,
            alpha: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.15
          }}
          onCreated={({ gl }) => {
            if (onCanvasReady) onCanvasReady(gl.domElement);
          }}
        >
          {/* Background color for transmission sampling */}
          {viewMode === 'studio' && <color attach="background" args={['#FFF9E8']} />}
          {viewMode === 'white' && <color attach="background" args={['#FFFFFF']} />}

          {/* Studio Lights */}
          <ambientLight intensity={0.7} />
          <directionalLight
            position={[5, 8, 5]}
            intensity={1.4}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-bias={-0.0001}
          />
          <directionalLight position={[-5, 4, -3]} intensity={0.5} />
          <directionalLight position={[0, 2, 6]} intensity={0.75} />
          <spotLight position={[0, 7, 5]} intensity={0.6} penumbra={1} angle={0.7} />

          {/* HDR Environment for Photorealistic Glass Refraction & Highlights */}
          <Environment preset="studio" />

          {/* 3D Glass Cup Model */}
          <Cup3DModel
            modelDef={modelDef}
            selectedColor={selectedColor}
            lidColor={lidColor}
            canvasTexture={canvasTexture}
            showSafeZone={showSafeZone}
          />

          {/* Realistic Floor Table Surface & Soft Contact Shadows */}
          {viewMode !== 'transparent' && (
            <>
              <mesh position={[0, tableY - 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <planeGeometry args={[40, 40]} />
                <shadowMaterial opacity={0.12} />
              </mesh>
              <ContactShadows
                position={[0, tableY, 0]}
                opacity={0.65}
                scale={12}
                blur={2.4}
                far={3}
                color="#3A211E"
              />
            </>
          )}

          {/* Orbit Controls with Camera Limits to prevent clipping inside cup */}
          <OrbitControls
            ref={controlsRef}
            enablePan={false}
            minDistance={4.6}
            maxDistance={12}
            minPolarAngle={0.2}
            maxPolarAngle={Math.PI / 1.5}
            enableDamping={true}
            dampingFactor={0.06}
            autoRotate={isAutoRotating}
            autoRotateSpeed={1.5}
          />
        </Canvas>
      </Suspense>
    </div>
  );
}
