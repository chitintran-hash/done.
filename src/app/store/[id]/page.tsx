"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Store, MapPin, Mail, Phone, Calendar, Package } from 'lucide-react';
import Link from 'next/link';
import { formatVND } from '@/lib/utils/currency';

export default function StorePage() {
  const params = useParams();
  const storeId = params.id as string;
  const supabase = createClient();

  const [store, setStore] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!storeId) return;
    const fetchStore = async () => {
      // Fetch store profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', storeId)
        .single();
      
      setStore(profile);

      // Fetch store products
      const { data: prods } = await supabase
        .from('products')
        .select('*')
        .eq('seller_id', storeId)
        .eq('approval_status', 'active');

      if (prods) setProducts(prods);
      setLoading(false);
    };
    fetchStore();
  }, [storeId]);

  if (loading) return <div className="min-h-[50vh] flex items-center justify-center">Đang tải...</div>;
  if (!store) return <div className="min-h-[50vh] flex items-center justify-center text-xl">Không tìm thấy cửa hàng</div>;

  return (
    <div className="min-h-screen bg-muted/10 pb-20">
      {/* Store Header/Cover */}
      <div className="w-full h-48 md:h-64 bg-slate-200 relative">
        {store.cover_url && (
          <img src={store.cover_url} alt="Cover" className="w-full h-full object-cover" />
        )}
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-16 md:-mt-24 relative z-10">
        {/* Store Info Card */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-border flex flex-col md:flex-row gap-8 items-start md:items-center">
          <div className="w-32 h-32 md:w-48 md:h-48 rounded-full border-4 border-white bg-orange-100 flex items-center justify-center shrink-0 overflow-hidden shadow-md">
            {store.logo_url ? (
              <img src={store.logo_url} alt="Logo" className="w-full h-full object-cover" />
            ) : (
              <Store className="w-16 h-16 text-orange-600" />
            )}
          </div>

          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{store.store_name || store.full_name || 'Cửa hàng DONE.'}</h1>
            <p className="text-muted-foreground mb-6 line-clamp-2 max-w-3xl">{store.store_description || 'Cửa hàng chuyên kinh doanh các sản phẩm Setup và công thái học.'}</p>
            
            <div className="flex flex-wrap gap-4 md:gap-8 text-sm">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-accent" />
                <span className="font-medium">{products.length} Sản phẩm</span>
              </div>
              {store.address && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{store.address}</span>
                </div>
              )}
              {store.phone_number && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="w-4 h-4" />
                  <span>{store.phone_number}</span>
                </div>
              )}
              {store.store_email && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  <span>{store.store_email}</span>
                </div>
              )}
              {store.created_at && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>Tham gia: {new Date(store.created_at).toLocaleDateString('vi-VN')}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Store Products */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
            Tất cả sản phẩm
            <span className="text-sm font-normal text-muted-foreground ml-2">({products.length})</span>
          </h2>
          
          {products.length === 0 ? (
            <div className="text-center py-20 bg-white border border-border rounded-3xl">
              <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Chưa có sản phẩm</h3>
              <p className="text-muted-foreground">Cửa hàng này hiện chưa có sản phẩm nào đang bán.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map(product => (
                <Link key={product.id} href={`/products/${product.id}`} className="group bg-white rounded-3xl border border-border overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
                  <div className="aspect-square bg-muted relative overflow-hidden">
                    <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-bold text-lg mb-4 group-hover:text-accent transition-colors line-clamp-2">{product.name}</h3>
                    <div className="mt-auto flex items-end justify-between">
                      <span className="text-xl font-bold text-accent">{formatVND(product.price)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
