"use client";

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter, useParams } from 'next/navigation';
import { ChevronRight, Plus, Minus, Info, ShieldCheck, Heart } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/store/useCartStore';

export default function ProductDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const supabase = createClient();
  const router = useRouter();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const cart = useCartStore();

  useEffect(() => {
    const fetchProduct = async () => {
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
      
      if (data) {
        setProduct(data);
      }
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return <div className="min-h-[60vh] flex items-center justify-center text-primary">Đang tải...</div>;
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="text-3xl font-serif font-bold mb-4 text-foreground">Không tìm thấy sản phẩm</h2>
        <Link href="/products" className="text-primary hover:underline">Quay lại Shop</Link>
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
      isCustom: false
    });
    // Hiển thị thông báo hoặc chuyển hướng
    alert("Đã thêm vào giỏ hàng");
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push('/cart');
  };

  const handleCustomize = () => {
    router.push(`/custom-cup?productId=${product.id}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <ChevronRight className="w-4 h-4" />
        <Link href="/products" className="hover:text-primary transition-colors">Shop</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-foreground font-medium">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Gallery */}
        <div className="relative aspect-square rounded-3xl overflow-hidden bg-muted">
          <Image 
            src={product.image_url || 'https://images.unsplash.com/photo-1544885896-01584c6c0b39?w=600&q=80'} 
            alt={product.name} 
            fill 
            className="object-cover"
          />
          {isOutOfStock && (
            <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center">
              <span className="px-8 py-4 bg-red-100 text-red-700 font-bold tracking-widest uppercase rounded-full">HẾT HÀNG</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <h1 className="text-4xl font-serif font-bold text-foreground mb-4">{product.name}</h1>
          <p className="text-3xl text-primary font-medium mb-6">
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
          </p>

          <p className="text-muted-foreground text-lg leading-relaxed mb-8">
            {product.description || "Thiết kế tinh tế, chất liệu an toàn, phù hợp cho mọi thức uống hằng ngày của bạn."}
          </p>

          {/* Specs */}
          <div className="grid grid-cols-2 gap-y-4 gap-x-8 mb-10 text-sm">
            {specs.material && (
              <div className="flex flex-col">
                <span className="text-muted-foreground mb-1">Chất liệu</span>
                <span className="font-medium text-foreground">{specs.material}</span>
              </div>
            )}
            {specs.capacity && (
              <div className="flex flex-col">
                <span className="text-muted-foreground mb-1">Dung tích</span>
                <span className="font-medium text-foreground">{specs.capacity}</span>
              </div>
            )}
            {specs.color && (
              <div className="flex flex-col">
                <span className="text-muted-foreground mb-1">Màu sắc</span>
                <span className="font-medium text-foreground">{specs.color}</span>
              </div>
            )}
            {specs.size && (
              <div className="flex flex-col">
                <span className="text-muted-foreground mb-1">Kích thước</span>
                <span className="font-medium text-foreground">{specs.size}</span>
              </div>
            )}
            <div className="flex flex-col">
              <span className="text-muted-foreground mb-1">Tình trạng</span>
              <span className={`font-medium ${isOutOfStock ? 'text-red-500' : 'text-green-600'}`}>
                {isOutOfStock ? 'Hết hàng' : `Còn ${product.stock} sản phẩm`}
              </span>
            </div>
          </div>

          <div className="h-px w-full bg-border mb-10"></div>

          {/* Actions */}
          <div className="flex flex-col gap-4">
            <div className="flex gap-4">
              <div className="flex items-center border border-border rounded-full h-14 w-32 justify-between px-4">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-muted-foreground hover:text-foreground">
                  <Minus className="w-5 h-5" />
                </button>
                <span className="font-medium text-lg">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="text-muted-foreground hover:text-foreground">
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              <button 
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="flex-1 h-14 rounded-full bg-foreground text-white font-medium hover:bg-black transition-colors disabled:opacity-50"
              >
                Add to Cart
              </button>
            </div>
            
            <button 
              onClick={handleBuyNow}
              disabled={isOutOfStock}
              className="w-full h-14 rounded-full border border-primary text-primary font-medium hover:bg-primary/5 transition-colors disabled:opacity-50"
            >
              Buy Now
            </button>

            {specs.is_customizable && (
              <button 
                onClick={handleCustomize}
                className="w-full h-14 mt-4 rounded-full bg-primary text-white font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
              >
                Customize This Cup
              </button>
            )}
          </div>
          
          <div className="mt-12 space-y-4">
            <div className="flex gap-4 items-start">
              <ShieldCheck className="w-6 h-6 text-primary shrink-0" />
              <div>
                <h4 className="font-medium text-foreground">Bảo hành 30 ngày</h4>
                <p className="text-sm text-muted-foreground">Đổi trả miễn phí nếu sản phẩm có lỗi từ nhà sản xuất.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <Info className="w-6 h-6 text-primary shrink-0" />
              <div>
                <h4 className="font-medium text-foreground">Hướng dẫn bảo quản</h4>
                <p className="text-sm text-muted-foreground">Rửa sạch sau khi sử dụng. Không dùng búi sắt cọ rửa để tránh trầy xước.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
