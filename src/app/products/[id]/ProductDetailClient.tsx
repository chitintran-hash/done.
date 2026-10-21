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
      <div className="min-h-[60vh] flex flex-col items-center justify-center pt-32 text-center px-4 bg-white">
        <h2 className="text-3xl font-serif font-bold mb-4 text-[#3A211E]">Không tìm thấy sản phẩm</h2>
        <p className="text-[#765B52] mb-6">Sản phẩm này có thể đã ngừng kinh doanh hoặc đường dẫn không chính xác.</p>
        <Link href="/products" className="px-6 py-3 bg-[#FFBF00] text-[#3A211E] rounded-full font-bold text-sm hover:bg-[#3A211E] hover:text-white transition-colors">
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
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-32 pb-16">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs sm:text-sm text-[#765B52] mb-8 font-medium">
          <Link href="/" className="hover:text-[#3A211E] transition-colors">Trang chủ</Link>
          <ChevronRight className="w-3.5 h-3.5 opacity-60" />
          <Link href="/products" className="hover:text-[#3A211E] transition-colors">Cửa hàng</Link>
          <ChevronRight className="w-3.5 h-3.5 opacity-60" />
          <span className="text-[#3A211E] font-bold truncate max-w-[200px] sm:max-w-none">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Gallery / Product Image */}
          <div className="relative aspect-square rounded-[2.5rem] overflow-hidden bg-[#FFF9E8]/60 border border-[#E8DFD8] shadow-sm flex items-center justify-center p-8">
            <Image 
              src={product.image_url || 'https://images.unsplash.com/photo-1544885896-01584c6c0b39?w=600&q=80'} 
              alt={`${product.name} - Ly đẹp chính hãng Cupfy`} 
              fill 
              priority
              className="object-contain p-6"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {isOutOfStock && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-xs flex items-center justify-center">
                <span className="px-6 py-3 bg-red-100 text-red-800 font-bold tracking-widest uppercase rounded-full text-xs border border-red-200">
                  TẠM HẾT HÀNG
                </span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFBF00] text-[11px] font-bold text-[#3A211E] uppercase tracking-wider mb-3">
                {product.category === 'glass' ? 'Ly Thủy Tinh' : product.category === 'plastic' ? 'Ly Nhựa An Toàn' : 'Sản Phẩm Cupfy'}
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-[#3A211E] mb-3 leading-tight tracking-tight">
                {product.name}
              </h1>
              <p className="text-2xl sm:text-3xl text-[#3A211E] font-black mb-6">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
              </p>

              <p className="text-[#765B52] text-sm sm:text-base leading-relaxed mb-8">
                {product.description || `Khám phá ${product.name} tại Cupfy với thiết kế tối giản, phù hợp sử dụng hằng ngày. Xem thông tin sản phẩm và đặt mua trực tuyến.`}
              </p>

              {/* Specifications */}
              <div className="grid grid-cols-2 gap-y-3.5 gap-x-6 mb-8 text-xs sm:text-sm bg-[#FFF9E8] p-5 rounded-2xl border border-[#E8DFD8]">
                {specs.material && (
                  <div className="flex flex-col">
                    <span className="text-[#765B52] text-xs mb-0.5">Chất liệu:</span>
                    <span className="font-bold text-[#3A211E]">{specs.material}</span>
                  </div>
                )}
                {specs.capacity && (
                  <div className="flex flex-col">
                    <span className="text-[#765B52] text-xs mb-0.5">Dung tích:</span>
                    <span className="font-bold text-[#3A211E]">{specs.capacity}</span>
                  </div>
                )}
                {specs.color && (
                  <div className="flex flex-col">
                    <span className="text-[#765B52] text-xs mb-0.5">Màu sắc:</span>
                    <span className="font-bold text-[#3A211E]">{specs.color}</span>
                  </div>
                )}
                <div className="flex flex-col">
                  <span className="text-[#765B52] text-xs mb-0.5">Tình trạng:</span>
                  <span className={`font-bold ${isOutOfStock ? 'text-red-600' : 'text-[#3A211E]'}`}>
                    {isOutOfStock ? 'Hết hàng' : `Còn hàng (Giao toàn quốc)`}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3.5 pt-4 border-t border-[#E8DFD8]">
              {addedSuccess && (
                <div className="p-3 bg-[#FFF3C4] text-[#3A211E] rounded-2xl border border-[#FFBF00]/40 text-xs sm:text-sm font-semibold flex items-center gap-2 animate-in fade-in">
                  <Check className="w-4 h-4 text-[#3A211E]" />
                  <span>Đã thêm sản phẩm vào giỏ hàng thành công!</span>
                </div>
              )}

              <div className="flex gap-3">
                <div className="flex items-center border border-[#E8DFD8] rounded-full h-13 w-28 justify-between px-3 bg-white">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                    className="text-[#765B52] hover:text-[#3A211E]"
                    title="Giảm số lượng"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-bold text-base text-[#3A211E]">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)} 
                    className="text-[#765B52] hover:text-[#3A211E]"
                    title="Tăng số lượng"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                
                {/* Nút Thêm vào giỏ: Nền vàng Cupfy #FFBF00, chữ nâu #3A211E */}
                <button 
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className="flex-1 h-13 rounded-full bg-[#FFBF00] text-[#3A211E] font-bold hover:bg-[#FFD147] transition-all disabled:opacity-50 text-xs sm:text-sm shadow-sm"
                >
                  Thêm vào giỏ
                </button>
              </div>
              
              {/* Nút Mua ngay: Nền nâu chocolate #3A211E, chữ trắng */}
              <button 
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className="w-full h-13 rounded-full bg-[#3A211E] text-white font-bold hover:bg-[#201817] transition-all disabled:opacity-50 text-xs sm:text-sm shadow-sm"
              >
                Mua ngay (COD toàn quốc)
              </button>

              {/* Tự thiết kế ly này */}
              <button 
                onClick={handleCustomize}
                className="w-full h-13 rounded-full bg-[#FFF9E8] hover:bg-[#FFF3C4] text-[#3A211E] font-bold transition-all border border-[#E8DFD8] flex items-center justify-center gap-2 text-xs sm:text-sm"
              >
                <Sparkles className="w-4 h-4 text-[#3A211E]" />
                Tự thiết kế ly này
              </button>
            </div>

            <AuthRequiredModal 
              isOpen={showAuthModal} 
              onClose={() => setShowAuthModal(false)} 
              redirectUrl="/checkout" 
            />
            
            <div className="mt-8 pt-6 border-t border-[#E8DFD8] grid grid-cols-2 gap-4 text-xs text-[#765B52]">
              <div className="flex gap-2.5 items-start">
                <ShieldCheck className="w-5 h-5 text-[#3A211E] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-[#3A211E]">Bảo hành bể vỡ 100%</h4>
                  <p className="mt-0.5 leading-snug">Đổi mới miễn phí nếu ly nứt vỡ khi vận chuyển.</p>
                </div>
              </div>
              <div className="flex gap-2.5 items-start">
                <Info className="w-5 h-5 text-[#3A211E] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-[#3A211E]">Giao hàng 30.000đ</h4>
                  <p className="mt-0.5 leading-snug">Đồng giá COD toàn quốc từ 2 đến 5 ngày làm việc.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
