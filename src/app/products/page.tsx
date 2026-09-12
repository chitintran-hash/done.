"use client";

import { useEffect, useState, Suspense } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Search, ShoppingCart, AlertCircle, Store, Loader2, Heart } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { formatVND } from '@/lib/utils/currency';

export default function ProductCatalogPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>}>
      <ProductCatalogContent />
    </Suspense>
  );
}

function ProductCatalogContent() {
  const supabase = createClient();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters from query params
  const searchParams = useSearchParams();
  const recipient = searchParams.get('recipient');
  const occasion = searchParams.get('occasion');
  const interest = searchParams.get('interest');
  const budget = searchParams.get('budget');
  const style = searchParams.get('style');
  const zodiac = searchParams.get('zodiac');
  const numerology = searchParams.get('numerology');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [priceSort, setPriceSort] = useState<'asc'|'desc'|'none'>('none');

  useEffect(() => {
    let ignore = false;
    const fetchProducts = async () => {
      setLoading(true);
      let query = supabase
        .from('products')
        .select('*, profiles!products_seller_id_fkey(store_name, logo_url)')
        .eq('is_available', true);

      // We handle overlaps manually in JS or we can use Supabase Contains filter.
      // Since it's text[], we use .cs (contains) 
      if (recipient && recipient !== 'all') {
        const arr = recipient.split(',');
        query = query.contains('recipient_tags', arr);
      }
      if (occasion && occasion !== 'all') {
        const arr = occasion.split(',');
        query = query.contains('occasion_tags', arr);
      }
      if (interest && interest !== 'all') {
        const arr = interest.split(',');
        query = query.contains('interest_tags', arr);
      }
      if (style && style !== 'all') {
        const arr = style.split(',');
        query = query.contains('style_tags', arr);
      }
      if (zodiac && zodiac !== 'all') {
        const arr = zodiac.split(',');
        query = query.contains('zodiac_tags', arr);
      }
      if (numerology && numerology !== 'all') {
        const arr = numerology.split(',');
        query = query.contains('numerology_tags', arr);
      }

      if (priceSort !== 'none') {
        query = query.order('price', { ascending: priceSort === 'asc' });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query;
      if (!ignore) {
        let finalData = data || [];
        
        // Handle manual budget filtering
        if (budget && budget !== 'all') {
          finalData = finalData.filter(p => {
            if (budget === 'under-200k') return p.price < 200000;
            if (budget === '200k-500k') return p.price >= 200000 && p.price <= 500000;
            if (budget === '500k-1m') return p.price > 500000 && p.price <= 1000000;
            if (budget === 'over-1m') return p.price > 1000000;
            return true;
          });
        }

        setProducts(finalData);
        setLoading(false);
      }
    };

    fetchProducts();
    
    return () => {
      ignore = true;
    };
  }, [searchParams, priceSort, supabase, budget, interest, occasion, recipient, style, numerology, zodiac]);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isGiftFinderResult = recipient || occasion || interest || budget || style;

  return (
    <div className="max-w-7xl mx-auto px-6 pt-32 pb-24 font-sans">
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary tracking-tight">
          {isGiftFinderResult ? "Tụi mình nghĩ người ấy sẽ thích những món này" : "Tất cả Quà Tặng"}
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Khám phá bộ sưu tập quà tặng độc đáo và ý nghĩa.
        </p>
      </div>

      {/* Filters Area */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 border-b border-border pb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Tìm theo tên sản phẩm..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-border focus:border-primary focus:outline-none transition-colors"
          />
        </div>
        
        <select 
          value={priceSort}
          onChange={(e) => setPriceSort(e.target.value as any)}
          className="px-4 py-3 rounded-xl border border-border focus:border-primary focus:outline-none bg-white min-w-[200px]"
        >
          <option value="none">Sắp xếp: Mới nhất</option>
          <option value="asc">Giá: Thấp đến cao</option>
          <option value="desc">Giá: Cao đến thấp</option>
        </select>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {[1,2,3,4,5,6,7,8].map(i => (
            <div key={i} className="animate-pulse bg-muted rounded-2xl aspect-[3/4]"></div>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-24 bg-ug-cream rounded-3xl">
          <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Chưa tìm thấy món quà phù hợp</h3>
          <p className="text-muted-foreground mb-6">Hãy thử thay đổi tiêu chí lọc hoặc tìm kiếm lại nhé.</p>
          <Link href="/gift-finder" className="inline-block bg-primary text-white font-bold px-8 py-3 rounded-full hover:bg-primary/90 transition-colors">
            Tìm quà lại từ đầu
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((product) => {
            const isOutOfStock = product.stock <= 0;
            return (
              <Link href={`/products/${product.id}`} key={product.id} className="group flex flex-col bg-white border border-border rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="relative aspect-square bg-ug-cream overflow-hidden">
                  <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  {isOutOfStock && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
                      <span className="px-6 py-2 bg-red-100 text-red-700 font-bold rounded-full transform -rotate-12 shadow-sm">HẾT HÀNG</span>
                    </div>
                  )}
                  <button className="absolute top-4 right-4 p-2 bg-white/80 hover:bg-white rounded-full text-muted-foreground hover:text-red-500 transition-colors shadow-sm z-10">
                    <Heart className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    <Store className="w-3 h-3" />
                    <span className="line-clamp-1">{product.profiles?.store_name || 'Người bán DONE.'}</span>
                  </div>
                  <h3 className="font-bold text-lg mb-4 text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                    {product.name}
                  </h3>
                  <div className="mt-auto flex items-end justify-between">
                    <span className="text-xl font-bold text-primary">
                      {formatVND(product.price)}
                    </span>
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
