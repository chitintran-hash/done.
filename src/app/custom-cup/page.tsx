
'use client';

import React, { useState, Suspense, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Type, Image as ImageIcon, Smile, ShoppingCart, Save, Layers, Share2, Check, Upload, Box } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Text, useTexture, Decal, RenderTexture } from '@react-three/drei';
import * as THREE from 'three';
import { useCartStore } from '@/store/useCartStore';
import { createClient } from '@/lib/supabase/client';
import { useEffect } from 'react';


// Safe Decal Component using Drei's Decal
function StickerDecal({ url, isText, text, textColor, radius, transform }: any) {
  const texture = url ? useTexture(url) : null;
  
  // Calculate position based on cylinder coordinates
  const x = Math.sin(transform.rotY) * radius;
  const z = Math.cos(transform.rotY) * radius;
  const pos: [number, number, number] = [x, transform.y, z];
  const rot: [number, number, number] = [0, transform.rotY, 0];
  
  const scaleX = isText ? transform.scale * 2 : transform.scale;
  const scaleY = transform.scale;
  const scaleZ = 1.5; // Decal projection depth

  if (isText && text) {
    return (
      <Decal position={pos} rotation={rot} scale={[scaleX, scaleY, scaleZ] as [number, number, number]}>
        <meshBasicMaterial transparent polygonOffset polygonOffsetFactor={-10} depthWrite={false}>
          <RenderTexture attach="map" width={1024} height={512}>
            <Text 
              fontSize={2.5} 
              color={textColor}
              anchorX="center"
              anchorY="middle"
              position={[0, 0, 0]}
            >
              {text}
            </Text>
          </RenderTexture>
        </meshBasicMaterial>
      </Decal>
    );
  }

  if (texture) {
    return (
      <Decal position={pos} rotation={rot} scale={[scaleX, scaleY, scaleZ] as [number, number, number]}>
        <meshBasicMaterial 
          map={texture as any} 
          transparent 
          polygonOffset 
          polygonOffsetFactor={-10} 
          depthWrite={false}
        />
      </Decal>
    );
  }
  return null;
}

function ProceduralCup({ modelType, cupColor, lidColor, customText, textColor, sticker, uploadedImage, textTransform, stickerTransform }: any) {
  const isMug = modelType === 'mug';
  const isGlass = modelType === 'glass';
  const isTumbler = modelType === 'tumbler';
  
  const radius = isMug ? 1.5 : (isGlass ? 1.4 : 1.35);
  const groupY = isMug ? -0.5 : -1;
  const bodyY = isMug ? 1.25 : 1.75;
  const height = isMug ? 2.5 : 3.5;
  const topRadius = isMug ? 1.5 : 1.4;
  const botRadius = isMug ? 1.5 : (isGlass ? 1.3 : 1.1);

  return (
    <group position={[0, groupY, 0]}>
      {/* Cup Body */}
      <mesh position={[0, bodyY, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[topRadius, botRadius, height, 64, 1, true]} />
        
        {isMug ? (
          <meshStandardMaterial color={cupColor} roughness={0.2} metalness={0.1} side={THREE.DoubleSide} />
        ) : (
          <meshPhysicalMaterial color={cupColor} transmission={0.9} opacity={1} transparent roughness={0.1} thickness={1.5} ior={1.5} clearcoat={1} side={THREE.DoubleSide} />
        )}
        
        {customText && <StickerDecal isText text={customText} textColor={textColor} radius={radius} transform={textTransform} />}
        {sticker && <StickerDecal url={sticker} radius={radius} transform={stickerTransform} />}
        {uploadedImage && <StickerDecal url={uploadedImage} radius={radius} transform={stickerTransform} />}
      </mesh>

      {/* Bottom Cap */}
      <mesh position={[0, bodyY - height/2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[botRadius, botRadius, 0.1, 64]} />
        {isMug ? (
          <meshStandardMaterial color={cupColor} roughness={0.2} metalness={0.1} />
        ) : (
          <meshPhysicalMaterial color={cupColor} transmission={0.9} transparent roughness={0.1} ior={1.5} />
        )}
      </mesh>

      {/* Handle for Mug */}
      {isMug && (
        <mesh position={[1.5, 1.25, 0]} rotation={[0, 0, -Math.PI / 2]} castShadow>
          <torusGeometry args={[0.7, 0.22, 16, 64, Math.PI]} />
          <meshStandardMaterial color={cupColor} roughness={0.2} />
        </mesh>
      )}

      {/* Lid & Straw for Tumbler */}
      {isTumbler && (
        <>
          <mesh position={[0, 3.65, 0]} castShadow>
            <cylinderGeometry args={[1.45, 1.45, 0.3, 64]} />
            <meshStandardMaterial color={lidColor} roughness={0.3} />
          </mesh>
          <mesh position={[0, 4.8, 0]}>
            <cylinderGeometry args={[0.12, 0.12, 4, 16]} />
            <meshPhysicalMaterial color="#ffffff" transmission={0.9} roughness={0.1} transparent opacity={0.6} />
          </mesh>
        </>
      )}
    </group>
  );
}

export default function CustomCupStudio() {
  const router = useRouter();
  const cartStore = useCartStore();
  
  const [modelType, setModelType] = useState('tumbler'); // tumbler, mug
  const [cupColor, setCupColor] = useState('#ffffff');
  const [lidColor, setLidColor] = useState('#FFCFE0');
  const [customText, setCustomText] = useState('');
  const [textColor, setTextColor] = useState('#181818');
  const [sticker, setSticker] = useState('');
  const [uploadedImage, setUploadedImage] = useState('');

  const [textTransform, setTextTransform] = useState({ y: 0, rotY: 0, scale: 1 });
  const [stickerTransform, setStickerTransform] = useState({ y: 0, rotY: 0, scale: 1.5 });

  
  const [activeTab, setActiveTab] = useState('models');
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [customizableProducts, setCustomizableProducts] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  useEffect(() => {
    const fetchProds = async () => {
      const supabase = createClient();
      const { data } = await supabase.from('products').select('*').contains('technical_specs', { is_customizable: true }).eq('approval_status', 'active');
      if (data && data.length > 0) {
        setCustomizableProducts(data);
        setSelectedProduct(data[0]);
        
        let initType = 'tumbler';
        if (data[0].category === 'thermos') initType = 'tumbler';
        else if (data[0].category === 'plastic') initType = 'mug';
        else if (data[0].category === 'glass') initType = 'glass';
        if (data[0].name.toLowerCase().includes('mug') || data[0].name.toLowerCase().includes('quai')) initType = 'mug';
        if (data[0].name.toLowerCase().includes('boba') || data[0].name.toLowerCase().includes('ống hút')) initType = 'tumbler';
        setModelType(initType);

      }
    };
    fetchProds();
  }, []);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const cupColors = [
    '#ffffff', '#181818', '#FFCFE0', '#BFE5D0', '#FFEDA8', '#DCD1FF', '#C8DFFF', 
    '#FFB15C', '#EF4444', '#3B82F6', '#10B981', '#F472B6', '#FBBF24'
  ];
  
  const stickers = [
    { id: 'cat', url: 'https://cdn-icons-png.flaticon.com/512/616/616430.png' },
    { id: 'flower', url: 'https://cdn-icons-png.flaticon.com/512/1087/1087420.png' },
    { id: 'heart', url: 'https://cdn-icons-png.flaticon.com/512/833/833472.png' },
    { id: 'star', url: 'https://cdn-icons-png.flaticon.com/512/118/118669.png' },
    { id: 'smile', url: 'https://cdn-icons-png.flaticon.com/512/742/742751.png' },
    { id: 'coffee', url: 'https://cdn-icons-png.flaticon.com/512/1047/1047503.png' }
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Use FileReader to get base64 so it can be saved to the database for Admin
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
        setSticker(''); // Clear preset sticker if uploading photo
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddToCart = () => {
    setIsAddingToCart(true);
    
    const canvas = document.querySelector('canvas');
    let capturedImage = '/images/cupfy-hero.png';
    if (canvas) {
      capturedImage = canvas.toDataURL('image/webp', 0.8);
    }

    setTimeout(() => {
      cartStore.addItem({
        id: 'custom-' + Date.now(),
        name: selectedProduct ? `${selectedProduct.name} (Custom)` : (modelType === 'tumbler' ? 'Ly Tumbler Tuỳ Chỉnh' : 'Cốc Sứ Tuỳ Chỉnh'),
        price: selectedProduct ? selectedProduct.price : (modelType === 'tumbler' ? 250000 : 180000),
        quantity: 1,
        image: capturedImage, 
        isCustom: true,
        customSpecs: {
          modelType,
          cupColor,
          lidColor,
          customText,
          textColor,
          sticker,
          uploadedImage,
          textTransform,
          stickerTransform
        }
      });
      router.push('/cart');
    }, 800);
  };

  return (
    <div className="flex flex-col h-screen w-full bg-[#F7F7F5] overflow-hidden">
      {/* Top Bar */}
      <div className="h-16 bg-white border-b border-[#EAE7DE] flex items-center justify-between px-4 z-10 shrink-0 shadow-sm">
        <div className="flex items-center gap-4">
          <Link href="/" className="p-2 hover:bg-[#F7F7F5] rounded-full transition-colors">
            <ChevronLeft className="w-5 h-5 text-[#181818]" />
          </Link>
          <div className="h-6 w-px bg-[#EAE7DE]"></div>
          <span className="font-bold text-[#181818]">Thiết kế của tôi ✨</span>
        </div>

        <div className="flex items-center gap-3">
          <button className="px-6 py-2.5 text-sm font-bold bg-[#181818] text-white rounded-full flex items-center gap-2 hover:bg-[#333333] shadow-md transition-all disabled:opacity-70" onClick={handleAddToCart} disabled={isAddingToCart}>
            {isAddingToCart ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
            {isAddingToCart ? 'ĐÃ THÊM' : 'THÊM VÀO GIỎ'}
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        
        {/* Left Toolbar */}
        <div className="w-20 bg-white border-r border-[#EAE7DE] flex flex-col items-center py-6 gap-4 z-10 shrink-0 shadow-[4px_0_12px_rgba(0,0,0,0.02)]">
          <button onClick={() => setActiveTab('models')} className={`flex flex-col items-center gap-1.5 p-3 rounded-xl transition-colors ${activeTab === 'models' ? 'bg-[#FFF9E8] text-[#181818]' : 'text-[#888888] hover:text-[#181818]'}`}>
            <Box className="w-6 h-6" />
            <span className="text-[10px] font-bold text-center leading-tight">Mẫu ly</span>
          </button>
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
          <button onClick={() => setActiveTab('upload')} className={`flex flex-col items-center gap-1.5 p-3 rounded-xl transition-colors ${activeTab === 'upload' ? 'bg-[#FFF9E8] text-[#181818]' : 'text-[#888888] hover:text-[#181818]'}`}>
            <ImageIcon className="w-6 h-6" />
            <span className="text-[10px] font-bold">Ảnh</span>
          </button>
        </div>

        {/* Properties Panel */}
        <div className="w-80 bg-white border-r border-[#EAE7DE] p-6 flex flex-col gap-8 z-10 overflow-y-auto shadow-[4px_0_12px_rgba(0,0,0,0.02)]">
          
          {activeTab === 'models' && (
            <div>
              <h3 className="font-bold text-[#181818] mb-4">Chọn Mẫu Ly</h3>
              <div className="grid grid-cols-2 gap-3">
                {customizableProducts.length > 0 ? customizableProducts.map(p => (
                  <button key={p.id} onClick={() => {
                    setSelectedProduct(p);
                    let type = 'tumbler';
                    if (p.category === 'thermos') type = 'tumbler';
                    else if (p.category === 'plastic') type = 'mug';
                    else if (p.category === 'glass') type = 'glass';
                    
                    if (p.name.toLowerCase().includes('mug') || p.name.toLowerCase().includes('quai')) type = 'mug';
                    if (p.name.toLowerCase().includes('boba') || p.name.toLowerCase().includes('ống hút')) type = 'tumbler';
                    
                    setModelType(type);
                  }} className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all ${selectedProduct?.id === p.id ? 'border-[#181818] bg-[#FFF9E8]' : 'border-[#EAE7DE] hover:border-[#181818]'}`}>
                    
                                        {(() => {
                      let type = 'tumbler';
                      if (p.category === 'thermos') type = 'tumbler';
                      else if (p.category === 'plastic') type = 'mug';
                      else if (p.category === 'glass') type = 'glass';
                      if (p.name.toLowerCase().includes('mug') || p.name.toLowerCase().includes('quai')) type = 'mug';
                      if (p.name.toLowerCase().includes('boba') || p.name.toLowerCase().includes('ống hút')) type = 'tumbler';
                      
                      return (
                        <>
                          {type === 'tumbler' && (
                            <div className="w-8 h-12 border-2 border-current rounded-b-md rounded-t-sm mb-2 opacity-80 relative">
                              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-1 h-3 bg-current"></div>
                            </div>
                          )}
                          {type === 'mug' && (
                            <div className="w-10 h-8 border-2 border-current rounded-md mb-2 opacity-80 relative mt-2">
                              <div className="absolute top-1 -right-3 w-3 h-4 border-2 border-l-0 border-current rounded-r-full"></div>
                            </div>
                          )}
                          {type === 'glass' && (
                            <div className="w-8 h-10 border-2 border-current rounded-b-md mb-2 opacity-80 relative mt-2">
                            </div>
                          )}
                        </>
                      );
                    })()}

                    <span className="font-bold text-sm text-center line-clamp-1">{p.name}</span>
                    <span className="text-[#888888] text-xs">{new Intl.NumberFormat('vi-VN').format(p.price)}đ</span>
                  </button>
                )) : (
                  <div className="col-span-2 text-center text-[#888888] py-4 text-sm">Chưa có sản phẩm nào cho phép custom.</div>
                )}
              </div>
            </div>          )}

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
              {modelType === 'tumbler' && (
                <div>
                  <h3 className="font-bold text-[#181818] mb-4">Màu nắp ly</h3>
                  <div className="flex flex-wrap gap-3">
                    {cupColors.map(c => (
                      <button key={c} onClick={() => setLidColor(c)} className={`w-10 h-10 rounded-full border-2 transition-all ${lidColor === c ? 'border-[#181818] scale-110' : 'border-[#EAE7DE]'}`} style={{ backgroundColor: c === '#ffffff' ? '#f0f0f0' : c }} />
                    ))}
                  </div>
                </div>
              )}
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
                  {['#181818', '#ffffff', '#FFB15C', '#EF4444', '#3B82F6', '#10B981', '#F472B6'].map(c => (
                    <button key={c} onClick={() => setTextColor(c)} className={`w-8 h-8 rounded-full border-2 transition-all ${textColor === c ? 'border-[#181818] scale-110' : 'border-[#EAE7DE]'}`} style={{ backgroundColor: c }} />
                  ))}
                </div>
              <div className="mt-6 border-t border-[#EAE7DE] pt-6">
                <h3 className="font-bold text-[#181818] mb-4">Điều chỉnh Vị trí</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-[#888888] flex justify-between"><span>Xoay ngang</span> <span>{Math.round(textTransform.rotY * (180/Math.PI))}°</span></label>
                    <input type="range" min={-Math.PI} max={Math.PI} step={0.01} value={textTransform.rotY} onChange={(e) => setTextTransform({...textTransform, rotY: parseFloat(e.target.value)})} className="w-full accent-[#181818]" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#888888] flex justify-between"><span>Độ cao</span> <span>{textTransform.y.toFixed(2)}</span></label>
                    <input type="range" min={-1.5} max={1.5} step={0.01} value={textTransform.y} onChange={(e) => setTextTransform({...textTransform, y: parseFloat(e.target.value)})} className="w-full accent-[#181818]" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#888888] flex justify-between"><span>Kích thước</span> <span>{textTransform.scale.toFixed(2)}</span></label>
                    <input type="range" min={0.2} max={3} step={0.05} value={textTransform.scale} onChange={(e) => setTextTransform({...textTransform, scale: parseFloat(e.target.value)})} className="w-full accent-[#181818]" />
                  </div>
                </div>
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
                  <button key={s.id} onClick={() => { setSticker(s.url); setUploadedImage(''); }} className={`aspect-square rounded-xl border-2 flex items-center justify-center p-4 ${sticker === s.url ? 'border-[#181818] bg-[#FFF9E8]' : 'border-[#EAE7DE] hover:bg-[#F7F7F5]'}`}>
                    <img src={s.url} alt={s.id} className="w-full h-full object-contain opacity-80" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'upload' && (
            <div>
              <h3 className="font-bold text-[#181818] mb-4">Tải ảnh Meme/Logo của bạn</h3>
              <p className="text-sm text-[#888888] mb-4">Hình ảnh sẽ được in trực tiếp lên thân ly. Khuyến nghị ảnh nền trong suốt (PNG).</p>
              
              <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />
              
              <button onClick={() => fileInputRef.current?.click()} className="w-full py-8 border-2 border-dashed border-[#EAE7DE] rounded-xl flex flex-col items-center justify-center gap-3 hover:border-[#181818] hover:bg-[#F7F7F5] transition-all">
                <Upload className="w-8 h-8 text-[#888888]" />
                <span className="font-bold text-[#333333]">Click để tải ảnh lên</span>
              </button>

              {uploadedImage && (
                <div className="mt-6">
                  <h4 className="text-sm font-bold text-[#181818] mb-2">Ảnh đã tải lên:</h4>
                  <div className="relative w-full aspect-square rounded-xl border border-[#EAE7DE] overflow-hidden bg-[#F7F7F5] flex items-center justify-center p-4">
                    <img src={uploadedImage} alt="Uploaded" className="w-full h-full object-contain" />
                    <button onClick={() => setUploadedImage('')} className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-sm text-red-500 font-bold text-xs px-2 hover:bg-red-500 hover:text-white transition-colors">Xoá</button>
                  </div>
                </div>
              )}
            
              <div className="mt-6 border-t border-[#EAE7DE] pt-6">
                <h3 className="font-bold text-[#181818] mb-4">Điều chỉnh Vị trí</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-[#888888] flex justify-between"><span>Xoay ngang</span> <span>{Math.round(stickerTransform.rotY * (180/Math.PI))}°</span></label>
                    <input type="range" min={-Math.PI} max={Math.PI} step={0.01} value={stickerTransform.rotY} onChange={(e) => setStickerTransform({...stickerTransform, rotY: parseFloat(e.target.value)})} className="w-full accent-[#181818]" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#888888] flex justify-between"><span>Độ cao</span> <span>{stickerTransform.y.toFixed(2)}</span></label>
                    <input type="range" min={-1.5} max={1.5} step={0.01} value={stickerTransform.y} onChange={(e) => setStickerTransform({...stickerTransform, y: parseFloat(e.target.value)})} className="w-full accent-[#181818]" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#888888] flex justify-between"><span>Kích thước</span> <span>{stickerTransform.scale.toFixed(2)}</span></label>
                    <input type="range" min={0.2} max={4} step={0.05} value={stickerTransform.scale} onChange={(e) => setStickerTransform({...stickerTransform, scale: parseFloat(e.target.value)})} className="w-full accent-[#181818]" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 3D Canvas */}
        <div className="flex-1 relative bg-[#FFF9E8] overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <img src="https://images.unsplash.com/photo-1618220179428-22790b46a0eb?w=1600&q=80" alt="" className="w-full h-full object-cover opacity-[0.15] mix-blend-multiply blur-sm" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#FFF9E8] via-transparent to-transparent"></div>
          </div>
          <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10 bg-white/90 px-6 py-3 rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.08)] text-sm font-bold text-[#181818] border border-[#EAE7DE] backdrop-blur-md">
            Kéo chuột để xoay 360°
          </div>
          
          <Suspense fallback={
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <div className="w-10 h-10 border-4 border-[#FFEDA8] border-t-[#FFB15C] rounded-full animate-spin"></div>
              <span className="font-bold text-[#181818]">Đang tải môi trường 3D...</span>
            </div>
          }>
            <Canvas camera={{ position: [0, 2, 9], fov: 45 }} shadows gl={{ preserveDrawingBuffer: true }}>
              <ambientLight intensity={0.6} />
              <directionalLight position={[5, 8, 5]} intensity={1.2} castShadow shadow-mapSize={1024} />
              <spotLight position={[-5, 5, 5]} intensity={0.5} penumbra={1} />
              
              <Environment preset="studio" />
              
              <ProceduralCup 
                modelType={modelType}
                cupColor={cupColor} 
                lidColor={lidColor} 
                customText={customText} 
                textColor={textColor} 
                sticker={sticker} 
                uploadedImage={uploadedImage}
                textTransform={textTransform}
                stickerTransform={stickerTransform}
              />
              
              <ContactShadows position={[0, -1.05, 0]} opacity={0.6} scale={15} blur={2.5} far={4} color="#181818" />
              
              <OrbitControls enablePan={false} minDistance={5} maxDistance={12} maxPolarAngle={Math.PI / 1.4} />
            </Canvas>
          </Suspense>
        </div>
      </div>
    </div>
  );
}
