"use client";

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCartStore } from '@/store/useCartStore';
import Image from 'next/image';
import { CheckCircle2, Paintbrush, Type, Upload } from 'lucide-react';

export default function CustomCupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialProductId = searchParams.get('productId');
  const cart = useCartStore();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    cupStyle: initialProductId || 'cup-1',
    text: '',
    color: '#f28482',
    position: 'center',
    note: ''
  });

  const cups = [
    { id: 'cup-1', name: 'Ly sứ trắng tối giản', price: 129000, img: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&q=80' },
    { id: 'cup-2', name: 'Ly thủy tinh trong suốt', price: 149000, img: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=600&q=80' },
    { id: 'cup-3', name: 'Ly giữ nhiệt Pastel', price: 199000, img: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&q=80' },
  ];

  const selectedCup = cups.find(c => c.id === formData.cupStyle) || cups[0];

  const handleNext = () => setStep(step + 1);
  const handlePrev = () => setStep(step - 1);

  const handleAddToCart = () => {
    cart.addItem({
      id: `custom-${Date.now()}`,
      name: `Custom: ${selectedCup.name}`,
      price: selectedCup.price + 30000, // phí custom
      image: selectedCup.img,
      quantity: 1,
      isCustom: true,
      customText: formData.text,
      customNote: formData.note
    });
    router.push('/cart');
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">Custom your cup, your way.</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Chọn mẫu ly, thêm chữ hoặc phong cách riêng. Một chiếc ly nhỏ nhưng mang đúng cá tính của bạn.
        </p>
      </div>

      {/* Stepper */}
      <div className="flex items-center justify-center mb-12">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${step >= s ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>
              {s}
            </div>
            {s < 3 && <div className={`w-16 h-1 mx-2 ${step > s ? 'bg-primary' : 'bg-muted'}`}></div>}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-3xl p-8 border border-border shadow-sm min-h-[500px]">
        {step === 1 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-2xl font-serif font-bold text-center">Bước 1: Chọn dáng ly</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {cups.map(cup => (
                <div 
                  key={cup.id}
                  onClick={() => setFormData({...formData, cupStyle: cup.id})}
                  className={`cursor-pointer rounded-2xl overflow-hidden border-2 transition-all ${formData.cupStyle === cup.id ? 'border-primary ring-4 ring-primary/20' : 'border-transparent hover:border-border'}`}
                >
                  <div className="aspect-square relative bg-muted">
                    <Image src={cup.img} alt={cup.name} fill className="object-cover" />
                  </div>
                  <div className="p-4 text-center bg-muted/20">
                    <h3 className="font-medium text-foreground">{cup.name}</h3>
                    <p className="text-primary font-bold">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(cup.price)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-8">
              <button onClick={handleNext} className="bg-foreground text-white px-8 py-3 rounded-full font-medium hover:bg-black transition-colors">Tiếp tục</button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 animate-in fade-in slide-in-from-right-4">
            <div>
              <h2 className="text-2xl font-serif font-bold mb-6">Bước 2: Thiết kế</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="flex items-center gap-2 font-medium mb-2"><Type className="w-4 h-4" /> Nội dung in</label>
                  <input 
                    type="text" 
                    maxLength={20}
                    placeholder="Tên của bạn hoặc 1 câu quote ngắn (max 20 ký tự)" 
                    className="w-full p-4 rounded-xl border border-border focus:border-primary focus:outline-none"
                    value={formData.text}
                    onChange={e => setFormData({...formData, text: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="flex items-center gap-2 font-medium mb-2"><Paintbrush className="w-4 h-4" /> Màu sắc chữ</label>
                  <div className="flex gap-4">
                    {['#f28482', '#4a3f35', '#222222', '#ffffff'].map(color => (
                      <button 
                        key={color}
                        onClick={() => setFormData({...formData, color})}
                        className={`w-10 h-10 rounded-full border-2 ${formData.color === color ? 'border-primary scale-110' : 'border-border'}`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="flex items-center gap-2 font-medium mb-2"><Upload className="w-4 h-4" /> Ghi chú thêm</label>
                  <textarea 
                    rows={3} 
                    placeholder="Bạn muốn in ở vị trí nào? Có icon nhỏ nào không?" 
                    className="w-full p-4 rounded-xl border border-border focus:border-primary focus:outline-none resize-none"
                    value={formData.note}
                    onChange={e => setFormData({...formData, note: e.target.value})}
                  />
                  <p className="text-xs text-muted-foreground mt-2">*Ở phiên bản hiện tại, Cupfy sẽ liên hệ xác nhận thiết kế qua Zalo trước khi in.</p>
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <button onClick={handlePrev} className="text-muted-foreground hover:text-foreground font-medium px-4 py-3">Quay lại</button>
                <button onClick={handleNext} className="bg-foreground text-white px-8 py-3 rounded-full font-medium hover:bg-black transition-colors">Xem trước</button>
              </div>
            </div>
            
            <div className="bg-muted/30 rounded-2xl flex items-center justify-center p-8 relative">
              <div className="w-full max-w-sm aspect-square relative rounded-xl overflow-hidden shadow-lg">
                <Image src={selectedCup.img} alt={selectedCup.name} fill className="object-cover" />
                {formData.text && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span 
                      className="text-3xl font-serif font-bold text-center px-4" 
                      style={{ color: formData.color, textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
                    >
                      {formData.text}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col items-center justify-center animate-in fade-in slide-in-from-right-4 py-8">
            <CheckCircle2 className="w-16 h-16 text-primary mb-6" />
            <h2 className="text-3xl font-serif font-bold text-center mb-4">Hoàn tất thiết kế!</h2>
            <p className="text-muted-foreground text-center mb-8 max-w-md">
              Chiếc ly {selectedCup.name.toLowerCase()} với thiết kế riêng của bạn đã sẵn sàng. Thêm vào giỏ hàng ngay.
            </p>
            
            <div className="bg-muted/20 border border-border rounded-2xl p-6 w-full max-w-md mb-8 flex gap-4 items-center">
              <div className="w-20 h-20 relative rounded-lg overflow-hidden shrink-0">
                <Image src={selectedCup.img} alt={selectedCup.name} fill className="object-cover" />
              </div>
              <div>
                <h4 className="font-medium text-foreground">Custom {selectedCup.name}</h4>
                <p className="text-sm text-muted-foreground mt-1">Text: "{formData.text || 'Không có'}"</p>
                <p className="text-primary font-bold mt-2">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedCup.price + 30000)}
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <button onClick={handlePrev} className="border border-border text-foreground px-8 py-3 rounded-full font-medium hover:bg-muted transition-colors">Chỉnh sửa lại</button>
              <button onClick={handleAddToCart} className="bg-primary text-white px-8 py-3 rounded-full font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">Thêm vào giỏ hàng</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
