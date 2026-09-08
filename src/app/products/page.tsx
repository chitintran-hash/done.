"use client";

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Search, Filter, ShoppingCart, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function ProductCatalogPage() {
  const supabase = createClient();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [priceSort, setPriceSort] = useState<'asc'|'desc'|'none'>('none');

  useEffect(() => {
    fetchProducts();
  }, [category, priceSort]);

  const fetchProducts = async () => {
    setLoading(true);
    let query = supabase
      .from('products')
      .select('*, profiles!products_seller_id_fkey(store_name)')
      .eq('is_available', true);

    if (category !== 'all') {
      query = query.eq('category', category);
    }
    if (priceSort !== 'none') {
      query = query.order('price', { ascending: priceSort === 'asc' });
    } else {
      query = query.order('created_at', { ascending: false });
    }

    const { data, error } = await query;
    if (!error && data) {
      setProducts(data);
    }
    setLoading(false);
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Sản Phẩm</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Khám phá các sản phẩm phù hợp cho góc học tập và làm việc của bạn.
        </p>
      </div>

      {/* Filters Area */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Tìm kiếm sản phẩm..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-2xl border border-border focus:border-accent focus:outline-none transition-colors"
          />
        </div>
        <select 
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-4 py-3 rounded-2xl border border-border focus:border-accent focus:outline-none bg-white min-w-[150px]"
        >
          <option value="all">Tất cả danh mục</option>
          <option value="desk">Bàn (Desk)</option>
          <option value="chair">Ghế (Chair)</option>
          <option value="monitor_arm">Tay đỡ (Monitor Arm)</option>
          <option value="desk_lamp">Đèn bàn</option>
          <option value="cable_management">Quản lý cáp</option>
        </select>
        <select 
          value={priceSort}
          onChange={(e) => setPriceSort(e.target.value as any)}
          className="px-4 py-3 rounded-2xl border border-border focus:border-accent focus:outline-none bg-white min-w-[150px]"
        >
          <option value="none">Sắp xếp: Mặc định</option>
          <option value="asc">Giá: Thấp đến cao</option>
          <option value="desc">Giá: Cao đến thấp</option>
        </select>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1,2,3,4,5,6,7,8].map(i => (
            <div key={i} className="animate-pulse bg-muted rounded-2xl aspect-[3/4]"></div>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-muted/20 rounded-3xl border border-border border-dashed">
          <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Chưa có sản phẩm phù hợp</h3>
          <p className="text-muted-foreground">Các Người Bán đang cập nhật sản phẩm mới. Vui lòng quay lại sau.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const isOutOfStock = product.stock <= 0;
            return (
              <Link href={`/products/${product.id}`} key={product.id} className="group flex flex-col bg-white border border-border rounded-2xl overflow-hidden hover:shadow-lg transition-all">
                <div className="relative aspect-square bg-muted">
                  <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  {isOutOfStock && (
                    <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center">
                      <span className="px-4 py-2 bg-red-100 text-red-700 font-bold rounded-lg transform -rotate-12">HẾT HÀNG</span>
                    </div>
                  )}
                  {product.brand && (
                    <div className="absolute top-3 left-3 px-2 py-1 bg-background/90 text-xs font-bold rounded shadow-sm">
                      {product.brand}
                    </div>
                  )}
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-bold text-lg mb-1 group-hover:text-accent transition-colors line-clamp-2">{product.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4 truncate">
                    Bởi: {product.profiles?.store_name || 'Người bán DONE.'}
                  </p>
                  <div className="mt-auto flex items-end justify-between">
                    <span className="text-xl font-bold text-accent">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                    </span>
                    <button 
                      disabled={isOutOfStock}
                      className="p-2 rounded-full bg-muted text-foreground hover:bg-foreground hover:text-background transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ShoppingCart className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
