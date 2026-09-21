'use client';

import Link from 'next/link';
import { useCartStore } from '@/store/useCartStore';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import Image from 'next/image';

export default function CartPage() {
  const { items, updateQuantity, removeItem } = useCartStore();

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="bg-[#F7F7F5] min-h-screen pt-[120px] pb-24">
      <div className="max-w-5xl mx-auto px-6">
        <h1 className="text-3xl font-extrabold text-[#181818] mb-8">Giỏ hàng của bạn</h1>

        {items.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-[#EAE7DE]">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-xl font-bold text-[#181818] mb-4">Giỏ hàng đang trống</h2>
            <p className="text-[#888888] mb-8">Hãy thiết kế ngay cho mình một chiếc ly độc nhất vô nhị nhé!</p>
            <Link href="/custom-cup" className="inline-flex bg-[#FFEDA8] text-[#181818] font-bold px-8 py-3 rounded-full hover:bg-[#F4D35E] transition-colors border border-[#EAE7DE]">
              Bắt đầu thiết kế ✨
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="bg-white p-6 rounded-2xl shadow-sm border border-[#EAE7DE] flex gap-6 relative">
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="absolute top-4 right-4 text-[#888888] hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>

                  <div className="w-24 h-24 bg-[#FFF9E8] rounded-xl flex items-center justify-center shrink-0 border border-[#EAE7DE] overflow-hidden relative p-2">
                    <Image src={item.image || "/images/cupfy-hero.png"} alt={item.name} fill className="object-contain p-2" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-bold text-lg text-[#181818]">{item.name}</h3>
                        <p className="text-sm font-bold text-[#FFB15C]">{item.price.toLocaleString('vi-VN')} đ</p>
                      </div>
                    </div>

                    {item.isCustom && item.customSpecs && (
                      <div className="bg-[#F7F7F5] rounded-xl p-3 mt-3 mb-4 text-xs text-[#333333] space-y-1.5 border border-[#EAE7DE]">
                        <p><span className="font-bold">Loại ly:</span> {item.customSpecs.modelType === 'tumbler' ? 'Tumbler (Ống hút)' : 'Mug (Cốc quai)'}</p>
                        <p><span className="font-bold">Màu thân:</span> {item.customSpecs.cupColor}</p>
                        {item.customSpecs.modelType === 'tumbler' && <p><span className="font-bold">Màu nắp:</span> {item.customSpecs.lidColor}</p>}
                        {item.customSpecs.customText && <p><span className="font-bold">Nội dung in:</span> "{item.customSpecs.customText}" (Màu: {item.customSpecs.textColor})</p>}
                        {item.customSpecs.sticker && <p><span className="font-bold">Sticker:</span> Có hình dán</p>}
                        {item.customSpecs.uploadedImage && <p><span className="font-bold">Ảnh:</span> Khách hàng tải lên</p>}
                      </div>
                    )}

                    <div className="flex items-center gap-3 bg-[#F7F7F5] w-fit rounded-full px-1 py-1 border border-[#EAE7DE]">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center bg-white rounded-full text-[#181818] shadow-sm"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="font-bold text-sm w-4 text-center text-[#181818]">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center bg-white rounded-full text-[#181818] shadow-sm"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#EAE7DE] h-fit sticky top-[100px]">
              <h3 className="font-bold text-xl text-[#181818] mb-6">Tổng đơn hàng</h3>
              
              <div className="space-y-4 text-sm text-[#333333] mb-6 border-b border-[#EAE7DE] pb-6">
                <div className="flex justify-between">
                  <span>Tạm tính</span>
                  <span className="font-bold">{subtotal.toLocaleString('vi-VN')} đ</span>
                </div>
                <div className="flex justify-between">
                  <span>Phí vận chuyển</span>
                  <span>Miễn phí</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-8">
                <span className="font-bold text-[#181818]">Tổng thanh toán</span>
                <span className="font-extrabold text-2xl text-[#EF4444]">{subtotal.toLocaleString('vi-VN')} đ</span>
              </div>

              <Link href="/checkout" className="w-full bg-[#181818] text-white font-bold py-4 rounded-full flex items-center justify-center gap-2 hover:bg-[#333333] transition-colors shadow-md">
                THANH TOÁN <ArrowRight className="w-5 h-5" />
              </Link>
              
              <p className="text-xs text-center text-[#888888] mt-4">
                Sản phẩm thiết kế riêng sẽ được in và giao trong 3-5 ngày làm việc.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
