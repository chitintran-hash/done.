'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/store/useCartStore';
import { Gift, Check, ShoppingBag, Sparkles } from 'lucide-react';

interface GiftBoxItem {
  id: string;
  name: string;
  price: number;
  description?: string;
  image_url?: string;
  stock?: number;
}

export default function GiftBoxList({ initialGiftBoxes }: { initialGiftBoxes: GiftBoxItem[] }) {
  const cart = useCartStore();
  const [addedId, setAddedId] = useState<string | null>(null);

  const handleAddToCart = (box: GiftBoxItem) => {
    cart.addItem({
      id: box.id,
      name: box.name,
      price: Number(box.price) || 0,
      image: box.image_url || '',
      quantity: 1,
      isCustom: false,
    });
    setAddedId(box.id);
    setTimeout(() => setAddedId(null), 2500);
  };

  if (!initialGiftBoxes || initialGiftBoxes.length === 0) {
    return null;
  }

  return (
    <div className="mb-20">
      <div className="text-center max-w-xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF3A6] border border-[#DDD8D2] text-[11px] font-bold text-[#4A2A25] uppercase tracking-wider mb-3">
          <Gift className="w-3.5 h-3.5 text-amber-700" />
          Bộ Sưu Tập Hộp Quà & Phụ Kiện Đóng Gói
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-[#3A211E] tracking-tight">
          Chọn Hộp Quà Hoàn Hảo Cho Chiếc Ly Của Bạn
        </h2>
        <p className="text-sm text-[#6F625E] mt-2">
          Được thiết kế tinh tế với đệm rơm chống va đập, nơ thắt thủ công và thiệp viết tay theo yêu cầu.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {initialGiftBoxes.map((box) => {
          const isInCart = cart.items.some((i) => i.id === box.id);
          const isJustAdded = addedId === box.id;

          return (
            <div
              key={box.id}
              className="bg-white rounded-3xl border border-[#DDD8D2] shadow-xs hover:shadow-md transition-all p-5 flex flex-col justify-between group overflow-hidden"
            >
              <div>
                <div className="relative aspect-square w-full rounded-2xl bg-[#FAF9F6] border border-[#DDD8D2] overflow-hidden mb-4 p-2">
                  <Image
                    src={box.image_url || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&q=80'}
                    alt={box.name}
                    fill
                    className="object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full text-[11px] font-black text-[#4A2A25] shadow-xs border border-[#DDD8D2]">
                    {Number(box.price).toLocaleString('vi-VN')} ₫
                  </div>
                </div>

                <h3 className="font-bold text-[#3A211E] text-base mb-1.5 line-clamp-1">
                  {box.name}
                </h3>
                <p className="text-xs text-[#6F625E] leading-relaxed line-clamp-2 mb-4">
                  {box.description || 'Hộp quà cao cấp thiết kế riêng cho ly Cupfy, lót rơm bảo vệ và kèm thiệp tay.'}
                </p>
              </div>

              <div className="pt-3 border-t border-[#DDD8D2]/60 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleAddToCart(box)}
                  className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-2xs ${
                    isJustAdded || isInCart
                      ? 'bg-emerald-700 text-white hover:bg-emerald-800'
                      : 'bg-[#4A2A25] text-white hover:bg-[#3A211E]'
                  }`}
                >
                  {isJustAdded ? (
                    <>
                      <Check className="w-3.5 h-3.5" /> Đã thêm vào giỏ!
                    </>
                  ) : isInCart ? (
                    <>
                      <ShoppingBag className="w-3.5 h-3.5" /> Thêm tiếp (+1)
                    </>
                  ) : (
                    <>
                      <Gift className="w-3.5 h-3.5" /> Thêm vào giỏ
                    </>
                  )}
                </button>
                <Link
                  href="/custom-cup"
                  className="p-2.5 rounded-xl border border-[#DDD8D2] text-[#4A2A25] hover:bg-[#FAF9F6] transition-colors"
                  title="Thiết kế ly để bỏ vào hộp quà này"
                >
                  <Sparkles className="w-4 h-4" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
