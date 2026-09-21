'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { ChevronLeft, Type, Image as ImageIcon, Smile, ShoppingCart, Save, Layers, Share2 } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';

function ProceduralCup({ cupColor, lidColor }: { cupColor: string, lidColor: string }) {
  return (
    <group position={[0, -1, 0]}>
      {/* Cup Body - Glass/Plastic Material */}
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[1.4, 1.1, 3.5, 64]} />
        <meshPhysicalMaterial 
          color={cupColor}
          transmission={0.6}
          opacity={0.9}
          transparent
          roughness={0.15}
          thickness={0.5}
          envMapIntensity={1}
        />
      </mesh>

      {/* Lid */}
      <mesh position={[0, 3.4, 0]}>
        <cylinderGeometry args={[1.45, 1.45, 0.3, 64]} />
        <meshStandardMaterial color={lidColor} roughness={0.4} />
      </mesh>

      {/* Straw */}
      <mesh position={[0, 4.5, 0]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 4, 16]} />
        <meshPhysicalMaterial color="#ffffff" transmission={0.9} roughness={0.1} transparent opacity={0.6} />
      </mesh>
    </group>
  );
}

export default function CustomCupStudio() {
  const [cupColor, setCupColor] = useState('#ffffff');
  const [lidColor, setLidColor] = useState('#FFCFE0');
  const [activeTab, setActiveTab] = useState('colors');

  const cupColors = ['#ffffff', '#FFCFE0', '#BFE5D0', '#FFEDA8', '#DCD1FF', '#C8DFFF'];
  const lidColors = ['#ffffff', '#FFCFE0', '#181818', '#FFB15C', '#CFE8C4', '#DCD1FF'];

  return (
    <div className="flex flex-col h-screen w-full bg-[#F7F7F5] overflow-hidden">
      {/* Top Bar */}
      <div className="h-16 bg-white border-b border-[#EAE7DE] flex items-center justify-between px-4 z-10 shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/" className="p-2 hover:bg-[#F7F7F5] rounded-full transition-colors">
            <ChevronLeft className="w-5 h-5 text-[#181818]" />
          </Link>
          <div className="h-6 w-px bg-[#EAE7DE]"></div>
          <span className="font-bold text-[#181818]">My Awesome Cup ✨</span>
        </div>

        <div className="flex items-center gap-3">
          <button className="px-4 py-2 text-sm font-semibold text-[#333333] hover:bg-[#F7F7F5] rounded-full flex items-center gap-2">
            <Share2 className="w-4 h-4" /> Share
          </button>
          <button className="px-4 py-2 text-sm font-semibold text-[#333333] hover:bg-[#F7F7F5] rounded-full flex items-center gap-2">
            <Save className="w-4 h-4" /> LƯU
          </button>
          <button className="px-6 py-2.5 text-sm font-bold bg-[#181818] text-white rounded-full flex items-center gap-2 hover:bg-[#333333] shadow-[0_4px_14px_rgba(0,0,0,0.1)] transition-all">
            <ShoppingCart className="w-4 h-4" /> THÊM VÀO GIỎ - 250.000đ
          </button>
        </div>
      </div>

      {/* Main Studio Area */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Toolbar Strip */}
        <div className="w-20 bg-white border-r border-[#EAE7DE] flex flex-col items-center py-6 gap-6 z-10 shrink-0">
          <button onClick={() => setActiveTab('colors')} className={`flex flex-col items-center gap-1.5 p-3 rounded-xl transition-colors ${activeTab === 'colors' ? 'bg-[#FFF9E8] text-[#181818]' : 'text-[#888888] hover:text-[#181818]'}`}>
            <Layers className="w-6 h-6" />
            <span className="text-[10px] font-bold">Màu sắc</span>
          </button>
          <button onClick={() => setActiveTab('text')} className={`flex flex-col items-center gap-1.5 p-3 rounded-xl transition-colors ${activeTab === 'text' ? 'bg-[#FFF9E8] text-[#181818]' : 'text-[#888888] hover:text-[#181818]'}`}>
            <Type className="w-6 h-6" />
            <span className="text-[10px] font-bold">Thêm chữ</span>
          </button>
          <button onClick={() => setActiveTab('sticker')} className={`flex flex-col items-center gap-1.5 p-3 rounded-xl transition-colors ${activeTab === 'sticker' ? 'bg-[#FFF9E8] text-[#181818]' : 'text-[#888888] hover:text-[#181818]'}`}>
            <Smile className="w-6 h-6" />
            <span className="text-[10px] font-bold">Sticker</span>
          </button>
          <button onClick={() => setActiveTab('upload')} className={`flex flex-col items-center gap-1.5 p-3 rounded-xl transition-colors ${activeTab === 'upload' ? 'bg-[#FFF9E8] text-[#181818]' : 'text-[#888888] hover:text-[#181818]'}`}>
            <ImageIcon className="w-6 h-6" />
            <span className="text-[10px] font-bold">Tải ảnh lên</span>
          </button>
        </div>

        {/* Properties Panel (Left) */}
        <div className="w-72 bg-white border-r border-[#EAE7DE] p-6 flex flex-col gap-8 z-10 overflow-y-auto">
          {activeTab === 'colors' && (
            <>
              <div>
                <h3 className="font-bold text-[#181818] mb-4">Màu thân ly</h3>
                <div className="flex flex-wrap gap-3">
                  {cupColors.map(c => (
                    <button 
                      key={c} 
                      onClick={() => setCupColor(c)}
                      className={`w-10 h-10 rounded-full border-2 transition-all ${cupColor === c ? 'border-[#181818] scale-110' : 'border-transparent shadow-sm'}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-bold text-[#181818] mb-4">Màu nắp ly</h3>
                <div className="flex flex-wrap gap-3">
                  {lidColors.map(c => (
                    <button 
                      key={c} 
                      onClick={() => setLidColor(c)}
                      className={`w-10 h-10 rounded-full border-2 transition-all ${lidColor === c ? 'border-[#181818] scale-110' : 'border-transparent shadow-sm'}`}
                      style={{ backgroundColor: c === '#ffffff' ? '#f0f0f0' : c }}
                    />
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab !== 'colors' && (
            <div className="flex flex-col items-center justify-center h-full text-center opacity-50">
              <span className="text-4xl mb-2">🚧</span>
              <p className="text-sm font-medium">Tính năng đang được phát triển trong Phase tiếp theo.</p>
            </div>
          )}
        </div>

        {/* 3D Canvas Area */}
        <div className="flex-1 relative bg-[#FFF9E8]">
          <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full shadow-sm text-xs font-bold text-[#333333] border border-[#EAE7DE]">
            Kéo chuột để xoay 360° | Cuộn để Zoom
          </div>
          <Suspense fallback={<div className="flex items-center justify-center h-full font-bold">Đang tải mô hình 3D...</div>}>
            <Canvas camera={{ position: [0, 2, 8], fov: 45 }}>
              <ambientLight intensity={0.5} />
              <directionalLight position={[5, 5, 5]} intensity={1} />
              
              {/* Studio Environment for nice reflections */}
              <Environment preset="city" />

              <ProceduralCup cupColor={cupColor} lidColor={lidColor} />

              <ContactShadows position={[0, -1, 0]} opacity={0.4} scale={10} blur={2} far={4} />
              <OrbitControls enablePan={false} minDistance={4} maxDistance={12} maxPolarAngle={Math.PI / 1.5} />
            </Canvas>
          </Suspense>
        </div>

      </div>
    </div>
  );
}
