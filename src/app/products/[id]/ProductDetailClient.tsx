"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, Plus, Minus, Info, ShieldCheck, Check, Sparkles } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/store/useCartStore';
import AuthRequiredModal from '@/components/AuthRequiredModal';
import { createClient } from '@/lib/supabase/client';

interface ProductDetailClientProps {
  initialProduct: any;
}

export default function ProductDetailClient({ initialProduct }: ProductDetailClientProps) {
  const [product] = useState(initialProduct);
  const [quantity, setQuantity] = useState(1);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const cart = useCartStore();
  const router = useRouter();
  const supabase = createClient();

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center pt-32 text-center px-4">
        <h2 className="text-3xl font-serif font-bold mb-4 text-[#3A211E]">Không tìm thấy sản phẩm</h2>
        <p className="text-[#6F625E] mb-6">Sản phẩm này có thể đã ngừng kinh doanh hoặc đường dẫn không chính xác.</p>
        <Link href="/products" className="px-6 py-3 bg-[#3A211E] text-white rounded-full font-bold text-sm hover:bg-[#4A2A25] transition-colors">
          Quay lại Cửa hàng
        </Link>
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0;
  const specs = product.technical_specs || {};

  const handleAddToCart = () => {
    cart.addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image_url,
      quantity: quantity,
      isCustom: false,
    });
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 3000);
  };

  const handleBuyNow = async () => {
    cart.addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image_url,
      quantity: quantity,
      isCustom: false,
    });

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setShowAuthModal(true);
    } else {
      router.push('/checkout');
    }
  };

  const handleCustomize = () => {
    router.push(`/custom-cup?productId=${product.id}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-32 pb-16">
      {/* Breadcrumb (Phần 4 & 5) */}
      <nav className="flex items-center gap-2 text-xs sm:text-sm text-[#6F625E] mb-8 font-medium">
        <Link href="/" className="hover:text-[#3A211E] transition-colors">Trang chủ</Link>
        <ChevronRight className="w-3.5 h-3.5 opacity-60" />
        <Link href="/products" className="hover:text-[#3A211E] transition-colors">Cửa hàng</Link>
        <ChevronRight className="w-3.5 h-3.5 opacity-60" />
        <span className="text-[#3A211E] font-bold truncate max-w-[200px] sm:max-w-none">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        {/* Gallery / Product Image */}
        <div className="relative aspect-square rounded-[2.5rem] overflow-hidden bg-white border border-[#DDD8D2] shadow-sm flex items-center justify-center p-8">
          <Image 
            src={product.image_url || 'https://images.unsplash.com/photo-1544885896-01584c6c0b39?w=600&q=80'} 
            alt={`${product.name} - Ly đẹp chính hãng Cupfy`} 
            fill 
            priority
            className="object-contain p-6"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          {isOutOfStock && (
            <div className="absolute inset-0 bg-white/70 backdrop-blur-xs flex items-center justify-center">
              <span className="px-6 py-3 bg-rose-100 text-rose-700 font-bold tracking-widest uppercase rounded-full text-xs border border-rose-200">
                TẠM HẾT HÀNG
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF3A6] border border-[#DDD8D2] text-[11px] font-bold text-[#4A2A25] uppercase tracking-wider mb-3">
              {product.category === 'glass' ? 'Ly Thủy Tinh' : product.category === 'plastic' ? 'Ly Nhựa An Toàn' : 'Sản Phẩm Cupfy'}
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-[#201817] mb-3 leading-tight tracking-tight">
              {product.name}
            </h1>
            <p className="text-2xl sm:text-3xl text-[#4A2A25] font-black mb-6">
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
            </p>

            <p className="text-[#4A3E3D] text-sm sm:text-base leading-relaxed mb-8">
              {product.description || `Khám phá ${product.name} tại Cupfy với thiết kế tối giản, phù hợp sử dụng hằng ngày. Xem thông tin sản phẩm và đặt mua trực tuyến.`}
            </p>

            {/* Specifications */}
            <div className="grid grid-cols-2 gap-y-3.5 gap-x-6 mb-8 text-xs sm:text-sm bg-[#FAF9F6] p-5 rounded-2xl border border-[#DDD8D2]">
              {specs.material && (
                <div className="flex flex-col">
                  <span className="text-[#6F625E] text-xs mb-0.5">Chất liệu:</span>
                  <span className="font-bold text-[#3A211E]">{specs.material}</span>
                </div>
              )}
              {specs.capacity && (
                <div className="flex flex-col">
                  <span className="text-[#6F625E] text-xs mb-0.5">Dung tích:</span>
                  <span className="font-bold text-[#3A211E]">{specs.capacity}</span>
                </div>
              )}
              {specs.color && (
                <div className="flex flex-col">
                  <span className="text-[#6F625E] text-xs mb-0.5">Màu sắc:</span>
                  <span className="font-bold text-[#3A211E]">{specs.color}</span>
                </div>
              )}
              <div className="flex flex-col">
                <span className="text-[#6F625E] text-xs mb-0.5">Tình trạng:</span>
                <span className={`font-bold ${isOutOfStock ? 'text-rose-600' : 'text-emerald-700'}`}>
                  {isOutOfStock ? 'Hết hàng' : `Còn hàng (Giao toàn quốc)`}
                </span>
              </div>
            </div>
          </div>

          {/* Actions & Internal Links (Phần 10) */}
          <div className="flex flex-col gap-3.5 pt-4 border-t border-[#DDD8D2]">
            {addedSuccess && (
              <div className="p-3 bg-emerald-50 text-emerald-800 rounded-2xl border border-emerald-200 text-xs sm:text-sm font-semibold flex items-center gap-2 animate-in fade-in">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Đã thêm sản phẩm vào giỏ hàng thành công!</span>
              </div>
            )}

            <div className="flex gap-3">
              <div className="flex items-center border border-[#DDD8D2] rounded-full h-13 w-28 justify-between px-3 bg-white">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                  className="text-[#6F625E] hover:text-[#201817]"
                  title="Giảm số lượng"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-bold text-base text-[#201817]">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)} 
                  className="text-[#6F625E] hover:text-[#201817]"
                  title="Tăng số lượng"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <button 
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="flex-1 h-13 rounded-full bg-[#3A211E] text-white font-bold hover:bg-[#4A2A25] transition-colors disabled:opacity-50 text-xs sm:text-sm shadow-sm"
              >
                Thêm vào giỏ
              </button>
            </div>
            
            <button 
              onClick={handleBuyNow}
              disabled={isOutOfStock}
              className="w-full h-13 rounded-full border-2 border-[#3A211E] text-[#3A211E] font-bold hover:bg-[#EDECEA] transition-colors disabled:opacity-50 text-xs sm:text-sm"
            >
              Mua ngay (COD toàn quốc)
            </button>

            {/* Internal link to Studio (Phần 10: "Tự thiết kế ly này") */}
            <button 
              onClick={handleCustomize}
              className="w-full h-13 rounded-full bg-[#FFF3A6] hover:bg-[#FFE978] text-[#201817] font-bold transition-colors border border-[#DDD8D2] flex items-center justify-center gap-2 text-xs sm:text-sm shadow-xs"
            >
              <Sparkles className="w-4 h-4 text-amber-700" />
              Tự thiết kế ly này ✨
            </button>
          </div>

          <AuthRequiredModal 
            isOpen={showAuthModal} 
            onClose={() => setShowAuthModal(false)} 
            redirectUrl="/checkout" 
          />
          
          <div className="mt-8 pt-6 border-t border-[#DDD8D2] grid grid-cols-2 gap-4 text-xs text-[#6F625E]">
            <div className="flex gap-2.5 items-start">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-[#3A211E]">Bảo hành bể vỡ 100%</h4>
                <p className="mt-0.5 leading-snug">Đổi mới miễn phí nếu ly nứt vỡ khi vận chuyển.</p>
              </div>
            </div>
            <div className="flex gap-2.5 items-start">
              <Info className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-[#3A211E]">Giao hàng 30.000đ</h4>
                <p className="mt-0.5 leading-snug">Đồng giá COD toàn quốc từ 2 đến 5 ngày làm việc.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
