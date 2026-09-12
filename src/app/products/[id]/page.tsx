"use client";

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, ShoppingCart, Store, Info, ShieldCheck, Box, ChevronRight, Minus, Plus } from 'lucide-react';
import Link from 'next/link';
import { useCartStore } from '@/store/useCartStore';
import { formatVND } from '@/lib/utils/currency';

export default function ProductDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const supabase = createClient();
  const router = useRouter();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const cart = useCartStore();

  useEffect(() => {
    const fetchProduct = async () => {
      const { data } = await supabase
        .from('products')
        .select('*, profiles!products_seller_id_fkey(store_name, logo_url)')
        .eq('id', id)
        .single();
      
      if (data) {
        setProduct(data);
        setSelectedImage(data.image_url);
      }
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return <div className="min-h-[80vh] flex items-center justify-center">Đang tải sản phẩm...</div>;
  }

  if (!product) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Sản phẩm không tồn tại</h2>
        <Link href="/products" className="text-accent hover:underline">Quay lại cửa hàng</Link>
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = () => {
    cart.addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image_url,
      sellerId: product.seller_id,
      storeName: product.profiles?.store_name || 'Người bán DONE.',
      deliveryDays: product.delivery_days || 3,
      quantity: quantity
    });
    router.push('/cart');
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <Link href="/" className="hover:text-foreground transition-colors">Trang chủ</Link>
        <ChevronRight className="w-4 h-4" />
        <Link href="/products" className="hover:text-foreground transition-colors">Sản phẩm</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-foreground font-medium line-clamp-1">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Gallery */}
        <div className="lg:col-span-7">
          <div className="sticky top-24 space-y-4">
            <div className="aspect-[4/3] bg-white rounded-2xl border border-border overflow-hidden flex items-center justify-center relative">
              <img src={selectedImage} alt={product.name} className="w-full h-full object-contain" />
              {isOutOfStock && (
                <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center">
                  <span className="px-6 py-3 bg-red-100 text-red-700 font-bold text-xl rounded-xl transform -rotate-12 border border-red-200 shadow-xl">HẾT HÀNG</span>
                </div>
              )}
            </div>
            
            {/* Thumbnails */}
            {(product.image_urls?.length > 0 || product.image_url) && (
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {product.image_url && (
                  <button 
                    onClick={() => setSelectedImage(product.image_url)}
                    className={`w-24 h-24 shrink-0 rounded-xl border-2 overflow-hidden bg-white ${selectedImage === product.image_url ? 'border-accent' : 'border-transparent hover:border-border'}`}
                  >
                    <img src={product.image_url} alt="Thumb" className="w-full h-full object-cover" />
                  </button>
                )}
                {product.image_urls?.map((url: string, idx: number) => (
                  <button 
                    key={idx}
                    onClick={() => setSelectedImage(url)}
                    className={`w-24 h-24 shrink-0 rounded-xl border-2 overflow-hidden bg-white ${selectedImage === url ? 'border-accent' : 'border-transparent hover:border-border'}`}
                  >
                    <img src={url} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Info */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              {product.brand && (
                <span className="px-3 py-1 bg-muted font-bold text-xs rounded uppercase tracking-wider">{product.brand}</span>
              )}
              <span className="px-3 py-1 bg-accent/10 text-accent font-bold text-xs rounded capitalize">{product.category.replace('_', ' ')}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mb-3">{product.name}</h1>
            <div className="text-3xl font-black text-accent">
              {formatVND(product.price)}
            </div>
          </div>

          <div className="bg-white border border-border rounded-xl p-5 mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center border border-border shrink-0 overflow-hidden text-orange-600 font-bold text-lg">
                  {product.profiles?.logo_url ? (
                    <img src={product.profiles.logo_url} alt="Logo" className="w-full h-full object-cover" />
                  ) : (
                    product.profiles?.store_name ? product.profiles.store_name.charAt(0).toUpperCase() : <Store className="w-6 h-6" />
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-lg">{product.profiles?.store_name || 'Người bán DONE.'}</h3>
                </div>
              </div>
              <Link href={`/store/${product.seller_id}`} className="px-4 py-2 bg-muted text-foreground text-sm font-bold rounded-full hover:bg-border transition-colors whitespace-nowrap">
                Xem Shop
              </Link>
            </div>
          </div>

          <div className="space-y-6 flex-1">
            {product.description && (
              <div>
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2"><Info className="w-5 h-5" /> Mô tả sản phẩm</h3>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{product.description}</p>
              </div>
            )}

            {/* Gift Tags Section */}
            <div className="space-y-3">
              <h3 className="font-bold text-lg mb-2 flex items-center gap-2"><Box className="w-5 h-5" /> Phù hợp với</h3>
              <div className="flex flex-wrap gap-2">
                {product.recipient_tags?.map((tag: string) => (
                  <span key={tag} className="px-3 py-1 bg-ug-cream text-primary border border-primary/20 rounded-full text-sm font-medium capitalize">Người nhận: {tag.replace('-', ' ')}</span>
                ))}
                {product.occasion_tags?.map((tag: string) => (
                  <span key={tag} className="px-3 py-1 bg-ug-mint text-primary border border-primary/20 rounded-full text-sm font-medium capitalize">Dịp: {tag.replace('-', ' ')}</span>
                ))}
                {product.interest_tags?.map((tag: string) => (
                  <span key={tag} className="px-3 py-1 bg-muted text-foreground border border-border rounded-full text-sm font-medium capitalize">Sở thích: {tag.replace('-', ' ')}</span>
                ))}
                {product.zodiac_tags?.map((tag: string) => (
                  <span key={tag} className="px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full text-sm font-medium capitalize">Cung Hoàng Đạo: {tag.replace('-', ' ')}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-border">
            <div className="flex items-center gap-4 mb-6">
              <span className="font-bold">Số lượng:</span>
              <div className="flex items-center border border-border rounded-full bg-white">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 hover:bg-muted rounded-l-full" disabled={isOutOfStock}>
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-bold">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="p-2 hover:bg-muted rounded-r-full" disabled={isOutOfStock}>
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <span className="text-sm text-muted-foreground">Còn {product.stock} sản phẩm</span>
            </div>

            <button 
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="w-full py-4 px-8 bg-foreground text-background rounded-full font-bold text-lg flex items-center justify-center gap-3 hover:bg-foreground/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingCart className="w-5 h-5" />
              {isOutOfStock ? 'Sản phẩm tạm hết hàng' : 'Thêm vào giỏ hàng'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
