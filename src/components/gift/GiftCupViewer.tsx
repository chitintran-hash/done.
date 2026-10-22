"use client";

import React, { Suspense, useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { Cup3DModel } from "@/components/studio/Cup3DModel";
import { CUP_MODELS, CLEAR_GLASS_COLOR } from "@/components/studio/cupDefinitions";
import { CupModelDef, CupColorOption, DesignLayer } from "@/components/studio/types";
import { useCanvasTexture } from "@/components/studio/useCanvasTexture";
import { RotateCw, ZoomIn, ZoomOut, Sparkles } from "lucide-react";

interface GiftCupViewerProps {
  modelId: string;
  cupColor?: CupColorOption | null;
  lidColor?: string;
  layers: DesignLayer[];
  previewImage?: string;
  autoRotate?: boolean;
  className?: string;
}

export default function GiftCupViewer({
  modelId,
  cupColor,
  lidColor = "#FFBF00",
  layers = [],
  previewImage = "",
  autoRotate = true,
  className = "",
}: GiftCupViewerProps) {
  const [isRotating, setIsRotating] = useState(autoRotate);
  const [hasWebGL, setHasWebGL] = useState(true);
  const controlsRef = useRef<any>(null);

  // Match model definition
  const modelDef: CupModelDef =
    CUP_MODELS.find((m) => m.id === modelId) || CUP_MODELS[0];
  const selectedColor: CupColorOption = cupColor || CLEAR_GLASS_COLOR;

  // Generate real dynamic texture from layers
  const { texture } = useCanvasTexture(layers, false);

  // Check WebGL support
  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (!gl) setHasWebGL(false);
    } catch (e) {
      setHasWebGL(false);
    }
  }, []);

  const resetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.object.position.set(0, 1.5, 7.0);
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  };

  const tableY =
    modelDef.id === "glass_tall" ? -2.1 : modelDef.id === "glass_rocks" ? -1.64 : -1.75;

  return (
    <div className={`relative w-full h-full flex items-center justify-center select-none ${className}`}>
      {hasWebGL ? (
        <div className="relative w-full h-full">
          {/* Subtle Ambient Glow */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="w-[320px] h-[320px] bg-[#FFBF00]/15 rounded-full blur-3xl pointer-events-none" />
          </div>

          <Canvas
            shadows
            camera={{ position: [0, 1.5, 7.0], fov: 42 }}
            gl={{ preserveDrawingBuffer: true, antialias: true, alpha: true }}
            className="w-full h-full cursor-grab active:cursor-grabbing"
          >
            {/* Lights */}
            <ambientLight intensity={1.1} />
            <directionalLight position={[5, 8, 5]} intensity={1.3} castShadow />
            <directionalLight position={[-5, 4, -4]} intensity={0.6} />
            <pointLight position={[0, -2, 3]} intensity={0.5} />

            <Suspense fallback={null}>
              <Cup3DModel
                modelDef={modelDef}
                selectedColor={selectedColor}
                lidColor={lidColor}
                canvasTexture={texture}
                showSafeZone={false}
              />

              {/* Realistic Contact Shadow */}
              <ContactShadows
                position={[0, tableY, 0]}
                opacity={0.5}
                scale={10}
                blur={1.8}
                far={4}
              />
            </Suspense>

            <OrbitControls
              ref={controlsRef}
              enablePan={false}
              enableZoom={true}
              minDistance={3.8}
              maxDistance={11.0}
              minPolarAngle={Math.PI / 6}
              maxPolarAngle={Math.PI / 1.9}
              autoRotate={isRotating}
              autoRotateSpeed={2.4}
            />
          </Canvas>

          {/* Floating Interaction Hint */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-xs text-[11px] font-bold text-[#3A211E] border border-[#E8DFD8]">
            <Sparkles className="w-3.5 h-3.5 text-[#FFBF00]" />
            <span>Chạm hoặc vuốt để xoay ly 360°</span>
          </div>

          {/* Quick Rotation Toggle Button */}
          <button
            onClick={() => setIsRotating(!isRotating)}
            className={`absolute top-3 right-3 z-10 p-2 rounded-full border shadow-xs transition-all cursor-pointer ${
              isRotating
                ? "bg-[#FFBF00] text-[#3A211E] border-[#FFBF00]"
                : "bg-white/90 backdrop-blur-md text-[#765B52] border-[#E8DFD8] hover:text-[#3A211E]"
            }`}
            title={isRotating ? "Dừng xoay tự động" : "Bật xoay tự động 360°"}
          >
            <RotateCw className={`w-4 h-4 ${isRotating ? "animate-spin" : ""}`} style={{ animationDuration: "6s" }} />
          </button>
        </div>
      ) : previewImage ? (
        /* High-Res Snapshot Fallback */
        <div className="relative w-full h-full flex items-center justify-center p-4">
          <div className="relative w-full max-w-[340px] aspect-square">
            <Image
              src={previewImage}
              alt="Chiếc ly được thiết kế riêng"
              fill
              className="object-contain drop-shadow-xl"
              priority
            />
          </div>
        </div>
      ) : (
        <div className="text-center p-6 text-[#765B52]">
          <p className="font-bold">Chiếc ly được thiết kế riêng cho bạn</p>
        </div>
      )}
    </div>
  );
}
