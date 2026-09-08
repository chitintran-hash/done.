"use client";

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, ShoppingCart, Store, Info, ShieldCheck, Box } from 'lucide-react';
import Link from 'next/link';
import { useCartStore } from '@/store/useCartStore';

export default function ProductDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const supabase = createClient();
  const cart = useCartStore();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*, profiles!products_seller_id_fkey(store_name)')
        .eq('id', id)
        .single();
      
      if (!error && data) {
        setProduct(data);
      }
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-4">
        <Box className="w-16 h-16 text-muted-foreground" />
        <h2 className="text-2xl font-bold">Không tìm thấy sản phẩm</h2>
        <p className="text-muted-foreground">Sản phẩm này có thể đã bị xóa hoặc không còn tồn tại.</p>
        <Link href="/products" className="text-accent hover:underline font-medium mt-4">Quay lại danh sách</Link>
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0 || !product.is_available;

  const handleAddToCart = () => {
    cart.addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image_url,
      sellerId: product.seller_id,
      storeName: product.profiles?.store_name || 'Người bán DONE.',
      deliveryDays: product.delivery_days || 3,
      quantity: 1
    });
    router.push('/cart');
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <Link href="/products" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors">
        <ArrowLeft className="w-5 h-5" /> Quay lại danh sách
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image Section */}
        <div className="relative aspect-square rounded-3xl overflow-hidden bg-muted border border-border">
          <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
          {isOutOfStock && (
            <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center">
              <span className="px-6 py-3 bg-red-100 text-red-700 font-bold text-xl rounded-xl transform -rotate-12 border border-red-200">HẾT HÀNG</span>
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="flex flex-col">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              {product.brand && (
                <span className="px-3 py-1 bg-muted font-bold text-xs rounded uppercase tracking-wider">{product.brand}</span>
              )}
              <span className="px-3 py-1 bg-accent/10 text-accent font-bold text-xs rounded capitalize">{product.category.replace('_', ' ')}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{product.name}</h1>
            <div className="text-4xl font-black text-accent">
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
            </div>
          </div>

          <div className="bg-muted/30 border border-border rounded-2xl p-5 mb-8 flex items-start gap-4">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border border-border shrink-0">
              <Store className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h3 className="font-bold text-lg">{product.profiles?.store_name || 'Người bán DONE.'}</h3>
              <p className="text-sm text-muted-foreground">Cam kết chính hãng & hỗ trợ đổi trả theo chính sách DONE.</p>
            </div>
          </div>

          <div className="space-y-6 flex-1">
            {product.description && (
              <div>
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2"><Info className="w-5 h-5" /> Mô tả sản phẩm</h3>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{product.description}</p>
              </div>
            )}

            <div>
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><ShieldCheck className="w-5 h-5" /> Thông số kỹ thuật (Compatibility)</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {product.width && <div className="p-3 bg-muted/50 rounded-lg"><strong>Chiều rộng:</strong> {product.width} cm</div>}
                {product.depth && <div className="p-3 bg-muted/50 rounded-lg"><strong>Chiều sâu:</strong> {product.depth} cm</div>}
                {product.height && <div className="p-3 bg-muted/50 rounded-lg"><strong>Chiều cao:</strong> {product.height} cm</div>}
                {product.max_load && <div className="p-3 bg-muted/50 rounded-lg"><strong>Tải trọng:</strong> {product.max_load} kg</div>}
                {product.vesa_supported && product.vesa_supported.length > 0 && <div className="p-3 bg-muted/50 rounded-lg"><strong>VESA:</strong> {product.vesa_supported.join(', ')}</div>}
                {product.supported_monitor_size && <div className="p-3 bg-muted/50 rounded-lg"><strong>Màn hình tối đa:</strong> {product.supported_monitor_size}"</div>}
                {product.desk_thickness && <div className="p-3 bg-muted/50 rounded-lg"><strong>Độ dày bàn:</strong> {product.desk_thickness} cm</div>}
                {product.clamp_thickness_max && <div className="p-3 bg-muted/50 rounded-lg"><strong>Ngàm kẹp tối đa:</strong> {product.clamp_thickness_max} cm</div>}
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-border flex flex-col sm:flex-row gap-4">
            <button 
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="flex-1 py-4 px-8 bg-foreground text-background rounded-full font-bold text-lg flex items-center justify-center gap-3 hover:bg-foreground/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
