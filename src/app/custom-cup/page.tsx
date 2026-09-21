
'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Type, Image as ImageIcon, Smile, ShoppingCart, Save, Layers, Share2, Check } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Text, useTexture } from '@react-three/drei';
import { useCartStore } from '@/store/useCartStore';

function StickerDecal({ url }: { url: string }) {
  const texture = useTexture(url);
  return (
    <mesh position={[0, 0, 1.42]} rotation={[0, 0, 0]}>
      <planeGeometry args={[1.5, 1.5]} />
      <meshBasicMaterial map={texture} transparent opacity={0.9} depthWrite={false} />
    </mesh>
  );
}

function ProceduralCup({ cupColor, lidColor, customText, textColor, sticker }: any) {
  return (
    <group position={[0, -1, 0]}>
      {/* Cup Body */}
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
        
        {/* Custom Text */}
        {customText && (
          <Text 
            position={[0, 0.5, 1.41]} 
            fontSize={0.4} 
            color={textColor}
            font="https://fonts.gstatic.com/s/bevietnampro/v11/w8Q0H34z5zto_8b4Z9C2gK0p8R8vD_S-w8I.woff"
            anchorX="center"
            anchorY="middle"
            maxWidth={2}
            textAlign="center"
          >
            {customText}
          </Text>
        )}

        {/* Sticker */}
        {sticker && (
          <StickerDecal url={sticker} />
        )}
      </mesh>

      {/* Lid */}
      <mesh position={[0, 3.4, 0]}>
        <cylinderGeometry args={[1.45, 1.45, 0.3, 64]} />
        <meshStandardMaterial color={lidColor} roughness={0.4} />
      </mesh>

      {/* Straw */}
      <mesh position={[0, 4.5, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 4, 16]} />
        <meshPhysicalMaterial color="#ffffff" transmission={0.9} roughness={0.1} transparent opacity={0.6} />
      </mesh>
    </group>
  );
}

export default function CustomCupStudio() {
  const router = useRouter();
  const cartStore = useCartStore();
  
  const [cupColor, setCupColor] = useState('#ffffff');
  const [lidColor, setLidColor] = useState('#FFCFE0');
  const [customText, setCustomText] = useState('');
  const [textColor, setTextColor] = useState('#181818');
  const [sticker, setSticker] = useState('');
  
  const [activeTab, setActiveTab] = useState('colors');
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const cupColors = ['#ffffff', '#FFCFE0', '#BFE5D0', '#FFEDA8', '#DCD1FF', '#C8DFFF'];
  const lidColors = ['#ffffff', '#FFCFE0', '#181818', '#FFB15C', '#CFE8C4', '#DCD1FF'];
  const textColors = ['#181818', '#ffffff', '#FFB15C', '#EF4444', '#3B82F6'];
  const stickers = [
    { id: 'cat', url: 'https://cdn-icons-png.flaticon.com/512/616/616430.png' },
    { id: 'flower', url: 'https://cdn-icons-png.flaticon.com/512/1087/1087420.png' },
    { id: 'heart', url: 'https://cdn-icons-png.flaticon.com/512/833/833472.png' }
  ];

  const handleAddToCart = () => {
    setIsAddingToCart(true);
    setTimeout(() => {
      cartStore.addItem({
        id: 'custom-' + Date.now(),
        name: 'My Awesome Cup ✨',
        price: 250000,
        quantity: 1,
        image: '/images/cupfy-hero.png', // In a real app, we would capture the canvas frame here
        isCustom: true,
        customSpecs: {
          cupColor,
          lidColor,
          customText,
          textColor,
          sticker
        }
      });
      router.push('/cart');
    }, 800);
  };

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
          <button className="px-6 py-2.5 text-sm font-bold bg-[#181818] text-white rounded-full flex items-center gap-2 hover:bg-[#333333] shadow-md transition-all disabled:opacity-70" onClick={handleAddToCart} disabled={isAddingToCart}>
            {isAddingToCart ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
            {isAddingToCart ? 'ĐÃ THÊM' : 'THÊM VÀO GIỎ - 250.000đ'}
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Toolbar */}
        <div className="w-20 bg-white border-r border-[#EAE7DE] flex flex-col items-center py-6 gap-6 z-10 shrink-0">
          <button onClick={() => setActiveTab('colors')} className={`flex flex-col items-center gap-1.5 p-3 rounded-xl transition-colors ${activeTab === 'colors' ? 'bg-[#FFF9E8] text-[#181818]' : 'text-[#888888] hover:text-[#181818]'}`}>
            <Layers className="w-6 h-6" />
            <span className="text-[10px] font-bold">Màu sắc</span>
          </button>
          <button onClick={() => setActiveTab('text')} className={`flex flex-col items-center gap-1.5 p-3 rounded-xl transition-colors ${activeTab === 'text' ? 'bg-[#FFF9E8] text-[#181818]' : 'text-[#888888] hover:text-[#181818]'}`}>
            <Type className="w-6 h-6" />
            <span className="text-[10px] font-bold">Chữ</span>
          </button>
          <button onClick={() => setActiveTab('sticker')} className={`flex flex-col items-center gap-1.5 p-3 rounded-xl transition-colors ${activeTab === 'sticker' ? 'bg-[#FFF9E8] text-[#181818]' : 'text-[#888888] hover:text-[#181818]'}`}>
            <Smile className="w-6 h-6" />
            <span className="text-[10px] font-bold">Sticker</span>
          </button>
        </div>

        {/* Properties Panel */}
        <div className="w-72 bg-white border-r border-[#EAE7DE] p-6 flex flex-col gap-8 z-10 overflow-y-auto">
          {activeTab === 'colors' && (
            <>
              <div>
                <h3 className="font-bold text-[#181818] mb-4">Màu thân ly</h3>
                <div className="flex flex-wrap gap-3">
                  {cupColors.map(c => (
                    <button key={c} onClick={() => setCupColor(c)} className={`w-10 h-10 rounded-full border-2 transition-all ${cupColor === c ? 'border-[#181818] scale-110' : 'border-[#EAE7DE]'}`} style={{ backgroundColor: c }} />
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-bold text-[#181818] mb-4">Màu nắp ly</h3>
                <div className="flex flex-wrap gap-3">
                  {lidColors.map(c => (
                    <button key={c} onClick={() => setLidColor(c)} className={`w-10 h-10 rounded-full border-2 transition-all ${lidColor === c ? 'border-[#181818] scale-110' : 'border-[#EAE7DE]'}`} style={{ backgroundColor: c === '#ffffff' ? '#f0f0f0' : c }} />
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === 'text' && (
            <>
              <div>
                <h3 className="font-bold text-[#181818] mb-4">Nội dung in</h3>
                <textarea 
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder="Nhập tên hoặc câu quote..."
                  className="w-full p-3 bg-[#F7F7F5] border border-[#EAE7DE] rounded-xl text-sm focus:outline-none focus:border-[#FFB15C] resize-none h-24"
                />
              </div>
              <div>
                <h3 className="font-bold text-[#181818] mb-4">Màu chữ</h3>
                <div className="flex flex-wrap gap-3">
                  {textColors.map(c => (
                    <button key={c} onClick={() => setTextColor(c)} className={`w-8 h-8 rounded-full border-2 transition-all ${textColor === c ? 'border-[#181818] scale-110' : 'border-[#EAE7DE]'}`} style={{ backgroundColor: c }} />
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === 'sticker' && (
            <div>
              <h3 className="font-bold text-[#181818] mb-4">Chọn Sticker</h3>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => setSticker('')} className={`aspect-square rounded-xl border-2 flex items-center justify-center font-bold text-gray-400 ${sticker === '' ? 'border-[#181818]' : 'border-[#EAE7DE]'}`}>
                  Trống
                </button>
                {stickers.map(s => (
                  <button key={s.id} onClick={() => setSticker(s.url)} className={`aspect-square rounded-xl border-2 flex items-center justify-center p-4 ${sticker === s.url ? 'border-[#181818] bg-[#FFF9E8]' : 'border-[#EAE7DE] hover:bg-[#F7F7F5]'}`}>
                    <img src={s.url} alt={s.id} className="w-full h-full object-contain opacity-80" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 3D Canvas */}
        <div className="flex-1 relative bg-[#FFF9E8]">
          <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10 bg-white/90 px-5 py-2.5 rounded-full shadow-sm text-xs font-bold text-[#181818] border border-[#EAE7DE]">
            Kéo chuột để xoay 360°
          </div>
          <Suspense fallback={<div className="flex items-center justify-center h-full font-bold">Đang tải mô hình 3D...</div>}>
            <Canvas camera={{ position: [0, 2, 8], fov: 45 }}>
              <ambientLight intensity={0.5} />
              <directionalLight position={[5, 5, 5]} intensity={1} />
              <Environment preset="city" />
              <ProceduralCup cupColor={cupColor} lidColor={lidColor} customText={customText} textColor={textColor} sticker={sticker} />
              <ContactShadows position={[0, -1, 0]} opacity={0.4} scale={10} blur={2} far={4} />
              <OrbitControls enablePan={false} minDistance={4} maxDistance={12} maxPolarAngle={Math.PI / 1.5} />
            </Canvas>
          </Suspense>
        </div>
      </div>
    </div>
  );
}
