'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/useCartStore';
import { Trash2, Plus, Minus, ArrowRight, Truck } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import AuthRequiredModal from '@/components/AuthRequiredModal';

export default function CartPage() {
  const router = useRouter();
  const { items, updateQuantity, removeItem, addItem } = useCartStore();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(false);
  const [giftBoxes, setGiftBoxes] = useState<any[]>([]);

  useEffect(() => {
    const fetchGiftBoxes = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from('products')
        .select('*')
        .in('category', ['gift_box', 'gift'])
        .eq('is_available', true)
        .order('price', { ascending: true });
      if (data) setGiftBoxes(data);
    };

    fetchGiftBoxes();
  }, []);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = items.length > 0 ? 30000 : 0;
  const total = subtotal + shippingFee;

  const handleProceedToCheckout = async () => {
    setCheckingAuth(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    setCheckingAuth(false);

    if (!user) {
      setShowAuthModal(true);
    } else {
      router.push('/checkout');
    }
  };

  return (
    <div className="bg-[#F7F6F2] min-h-screen pt-28 pb-24">
      {/* Modal yêu cầu đăng nhập trước khi thanh toán */}
      <AuthRequiredModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
        redirectUrl="/checkout" 
      />

      <div className="max-w-5xl mx-auto px-6">
        <h1 className="font-heading text-3xl font-bold text-[#3A211E] mb-8">
          Giỏ hàng của bạn
        </h1>

        {items.length === 0 ? (
          <div className="bg-white rounded-[24px] p-12 text-center shadow-sm border border-[#DDD8D2]">
            <div className="w-20 h-20 bg-[#F7F6F2] rounded-3xl border border-[#DDD8D2] flex items-center justify-center text-3xl mx-auto mb-4">
              🛒
            </div>
            <h2 className="font-heading text-2xl font-bold text-[#3A211E] mb-3">
              Giỏ hàng đang trống
            </h2>
            <p className="text-[#6F625E] text-sm mb-8 max-w-md mx-auto">
              Hãy ghé thăm cửa hàng hoặc tự tay sáng tạo chiếc ly mang dấu ấn độc bản của riêng bạn nhé!
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                href="/custom-cup" 
                className="inline-flex bg-[#3A211E] text-white font-bold px-8 py-3.5 rounded-full hover:bg-[#4A2A25] transition-colors shadow-sm"
              >
                Bắt đầu thiết kế ✨
              </Link>
              <Link 
                href="/products" 
                className="inline-flex bg-white text-[#3A211E] font-bold px-8 py-3.5 rounded-full hover:bg-[#EDECEA] transition-colors border border-[#DDD8D2]"
              >
                Khám phá cửa hàng
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div 
                  key={item.id} 
                  className="bg-white p-6 rounded-[24px] shadow-sm border border-[#DDD8D2] flex flex-col sm:flex-row gap-6 relative"
                >
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="absolute top-5 right-5 text-[#6F625E] hover:text-red-500 transition-colors p-1"
                    title="Xóa sản phẩm"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>

                  <div className="w-24 h-24 bg-[#F7F6F2] rounded-2xl flex items-center justify-center shrink-0 border border-[#DDD8D2] overflow-hidden relative p-2 self-start">
                    {item.image ? (
                      <Image 
                        src={item.image} 
                        alt={item.name} 
                        fill 
                        className="object-contain p-2" 
                      />
                    ) : (
                      <span className="text-xs text-[#6F625E]">No image</span>
                    )}
                  </div>

                  <div className="flex-1 pr-6 sm:pr-8">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-bold text-lg text-[#3A211E]">{item.name}</h3>
                        <p className="text-base font-bold text-[#4A2A25] mt-0.5">
                          {item.price.toLocaleString('vi-VN')} ₫
                        </p>
                      </div>
                    </div>

                    {item.isCustom && item.customSpecs && (
                      <div className="bg-[#F7F6F2] rounded-xl p-3.5 mt-3 mb-4 text-xs text-[#6F625E] space-y-1.5 border border-[#DDD8D2]/80">
                        <div className="flex items-center justify-between">
                          <p>
                            <span className="font-bold text-[#3A211E]">Mẫu ly:</span>{' '}
                            {item.customSpecs.modelName || 'Ly Custom Studio'}
                          </p>
                          <Link href="/custom-cup" className="text-xs font-bold text-[#4A2A25] hover:underline">
                            Chỉnh sửa
                          </Link>
                        </div>
                        {item.customSpecs.cupColorName && (
                          <p><span className="font-bold text-[#3A211E]">Màu sắc:</span> {item.customSpecs.cupColorName}</p>
                        )}
                        {item.customSpecs.lidColor && (
                          <p><span className="font-bold text-[#3A211E]">Màu nắp:</span> {item.customSpecs.lidColor}</p>
                        )}
                        {item.customSpecs.customText && (
                          <p><span className="font-bold text-[#3A211E]">Nội dung in:</span> "{item.customSpecs.customText}" (Font: {item.customSpecs.font || 'Chuẩn'})</p>
                        )}
                      </div>
                    )}

                    <div className="flex items-center gap-3 bg-[#F7F6F2] w-fit rounded-full px-1.5 py-1 border border-[#DDD8D2]">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center bg-white rounded-full text-[#3A211E] shadow-sm hover:bg-[#EDECEA] transition-colors"
                        aria-label="Giảm số lượng"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="font-bold text-sm w-6 text-center text-[#3A211E]">
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center bg-white rounded-full text-[#3A211E] shadow-sm hover:bg-[#EDECEA] transition-colors"
                        aria-label="Tăng số lượng"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Mua kèm hộp quà tặng */}
              {giftBoxes.length > 0 && (
                <div className="bg-white p-6 rounded-[24px] shadow-sm border border-[#DDD8D2]">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🎁</span>
                      <h3 className="font-bold text-base text-[#3A211E]">
                        Mua kèm hộp quà tặng & đóng gói
                      </h3>
                    </div>
                    <span className="text-xs text-[#6F625E]">Phụ kiện đóng gói</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {giftBoxes.map((box) => {
                      const isAdded = items.some((i) => i.id === box.id);
                      return (
                        <div
                          key={box.id}
                          className="p-3 rounded-2xl bg-[#FAF9F6] border border-[#DDD8D2] flex items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-12 h-12 rounded-xl bg-white border border-[#DDD8D2] overflow-hidden shrink-0 relative">
                              <img
                                src={box.image_url || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=300&q=80'}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="min-w-0">
                              <h4 className="font-bold text-xs text-[#201817] truncate">
                                {box.name}
                              </h4>
                              <p className="text-xs font-bold text-[#4A2A25]">
                                +{Number(box.price).toLocaleString('vi-VN')} ₫
                              </p>
                            </div>
                          </div>

                          {isAdded ? (
                            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 shrink-0">
                              ✓ Đã thêm
                            </span>
                          ) : (
                            <button
                              onClick={() =>
                                addItem({
                                  id: box.id,
                                  name: box.name,
                                  price: Number(box.price) || 0,
                                  image: box.image_url || '',
                                  quantity: 1,
                                  isCustom: false,
                                })
                              }
                              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#4A2A25] text-white hover:bg-[#3A211E] transition-colors shrink-0 shadow-2xs"
                            >
                              + Thêm
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-[24px] shadow-sm border border-[#DDD8D2] h-fit sticky top-28">
              <h3 className="font-heading font-bold text-xl text-[#3A211E] mb-6">
                Tổng đơn hàng
              </h3>
              
              <div className="space-y-3.5 text-sm text-[#6F625E] mb-6 border-b border-[#DDD8D2] pb-6">
                <div className="flex justify-between">
                  <span>Tạm tính</span>
                  <span className="font-semibold text-[#3A211E]">
                    {subtotal.toLocaleString('vi-VN')} ₫
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-[#4A2A25]" /> Phí vận chuyển (COD)
                  </span>
                  <span className="font-semibold text-[#3A211E]">
                    {shippingFee.toLocaleString('vi-VN')} ₫
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-baseline mb-8">
                <span className="font-bold text-[#3A211E] text-base">Tổng thanh toán</span>
                <span className="font-heading text-2xl font-bold text-[#3A211E]">
                  {total.toLocaleString('vi-VN')} ₫
                </span>
              </div>

              <button
                onClick={handleProceedToCheckout}
                disabled={checkingAuth}
                className="w-full bg-[#3A211E] text-white font-bold py-4 rounded-full flex items-center justify-center gap-2 hover:bg-[#4A2A25] transition-colors shadow-[0_6px_20px_rgba(58,33,30,0.18)] text-base disabled:opacity-60"
              >
                <span>TIẾP TỤC THANH TOÁN</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              
              <p className="text-xs text-center text-[#6F625E] mt-4">
                Thanh toán tiền mặt khi nhận hàng (COD). Kiểm tra hàng trước khi thanh toán.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
