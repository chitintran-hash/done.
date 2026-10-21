"use client";

import { useEffect, useState, Suspense } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Search, Loader2, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import AddToCartButton from '@/components/AddToCartButton';

import { matchesSearchQuery } from '@/lib/utils/search';

export default function ProductCatalogPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-[50vh]"><Loader2 className="w-8 h-8 animate-spin text-[#FFBF00]" /></div>}>
      <ProductCatalogContent />
    </Suspense>
  );
}

function ProductCatalogContent() {
  const supabase = createClient();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category') || 'all';
  const collectionParam = searchParams.get('collection') || 'all';
  const queryParam = searchParams.get('q') || searchParams.get('search') || '';

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(queryParam);
  
  // States cho filter
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [sortOrder, setSortOrder] = useState('newest');

  useEffect(() => {
    setSelectedCategory(categoryParam);
  }, [categoryParam]);

  useEffect(() => {
    if (queryParam !== undefined) {
      setSearchTerm(queryParam);
    }
  }, [queryParam]);

  useEffect(() => {
    let ignore = false;
    const fetchProducts = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('is_available', true)
        .neq('category', 'user_custom')
        .not('category', 'like', 'admin_%');

      if (!ignore && data) {
        setProducts(data);
      }
      if (!ignore) setLoading(false);
    };

    fetchProducts();
    return () => { ignore = true; };
  }, []);

  let displayed = [...products];

  if (searchTerm.trim()) {
    displayed = displayed.filter(p => 
      matchesSearchQuery(`${p.name} ${p.technical_specs?.capacity || ''} ${p.technical_specs?.material || ''} ${p.category || ''}`, searchTerm)
    );
  }

  if (selectedCategory === 'all') {
    if (!searchTerm.trim()) {
      displayed = displayed.filter(p => p.category !== 'gift_box' && p.category !== 'gift');
    }
  } else if (selectedCategory === 'gift_box') {
    displayed = displayed.filter(p => p.category === 'gift_box' || p.category === 'gift');
  } else {
    displayed = displayed.filter(p => p.category === selectedCategory);
  }

  if (collectionParam !== 'all') {
    displayed = displayed.filter(p => {
      const specs = p.technical_specs || {};
      return specs.collection === collectionParam;
    });
  }

  if (sortOrder === 'price_asc') {
    displayed.sort((a, b) => a.price - b.price);
  } else if (sortOrder === 'price_desc') {
    displayed.sort((a, b) => b.price - a.price);
  } else {
    displayed.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  const categories = [
    { id: 'all', name: 'Tất cả ly' },
    { id: 'glass', name: 'Ly thủy tinh' },
    { id: 'plastic', name: 'Ly nhựa' },
    { id: 'custom', name: 'Ly custom phôi' },
    { id: 'gift_box', name: 'Túi & Hộp quà riêng' }
  ];

  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-6 pt-32 pb-16">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-[#3A211E] mb-3 tracking-tight">
              {selectedCategory === 'gift_box' ? 'Túi & Hộp Quà Tặng' : 'Cửa Hàng Ly Cupfy'}
            </h1>
            <p className="text-[#765B52] text-base md:text-lg max-w-xl">
              {selectedCategory === 'gift_box'
                ? 'Bộ sưu tập túi quà và hộp quà cao cấp, lót rơm chống sốc kèm nơ và thiệp nhắn gửi yêu thương.'
                : 'Khám phá bộ sưu tập những chiếc ly xinh xắn, giúp mỗi ngụm nước bạn uống đều ngập tràn niềm vui.'}
            </p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="sticky top-28 space-y-8 bg-white p-6 rounded-2xl border border-[#E8DFD8]">
              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm ly..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-full border border-[#E8DFD8] bg-[#FFF9E8] text-sm text-[#3A211E] placeholder:text-[#765B52]/70 focus:outline-none focus:border-[#FFBF00] transition-colors"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
                <Search className="w-4 h-4 text-[#765B52] absolute left-3.5 top-3" />
              </div>

              {/* Categories */}
              <div>
                <h3 className="font-bold text-[#3A211E] mb-3.5 uppercase tracking-wider text-xs">Danh mục</h3>
                <div className="flex flex-col gap-2">
                  {categories.map(c => (
                    <button 
                      key={c.id}
                      onClick={() => setSelectedCategory(c.id)}
                      className={`text-sm px-4 py-2.5 rounded-full font-bold transition-all text-left w-full border ${
                        selectedCategory === c.id 
                          ? 'bg-[#FFBF00] text-[#3A211E] border-[#FFBF00] shadow-sm' 
                          : 'bg-white text-[#3A211E] border-[#E8DFD8] hover:bg-[#FFF9E8]'
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div>
                <h3 className="font-bold text-[#3A211E] mb-3.5 uppercase tracking-wider text-xs">Sắp xếp</h3>
                <div className="relative">
                  <select 
                    className="w-full appearance-none border border-[#E8DFD8] bg-white rounded-xl px-4 py-2.5 text-sm font-semibold text-[#3A211E] focus:outline-none focus:border-[#FFBF00]"
                    value={sortOrder}
                    onChange={e => setSortOrder(e.target.value)}
                  >
                    <option value="newest">Mới nhất</option>
                    <option value="price_asc">Giá: Thấp đến Cao</option>
                    <option value="price_desc">Giá: Cao đến Thấp</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-[#765B52] absolute right-4 top-3 pointer-events-none" />
                </div>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#FFBF00]" /></div>
            ) : displayed.length === 0 ? (
              <div className="text-center py-20 bg-[#FFF9E8] rounded-3xl border border-[#E8DFD8] border-dashed">
                <p className="text-[#765B52] text-lg">Chưa có ly nào phù hợp với tìm kiếm của bạn.</p>
                <button 
                  onClick={() => { setSelectedCategory('all'); setSearchTerm(''); }}
                  className="mt-4 px-6 py-2.5 bg-[#FFBF00] text-[#3A211E] rounded-full font-bold hover:bg-[#3A211E] hover:text-white transition-colors"
                >
                  Xóa bộ lọc
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {displayed.map(product => (
                  <div key={product.id} className="group relative flex flex-col bg-white rounded-2xl p-4 border border-[#E8DFD8] hover:border-[#FFBF00] hover:shadow-md transition-all">
                    <Link href={`/products/${product.id}`} className="relative w-full aspect-square rounded-xl overflow-hidden bg-[#FFF9E8] mb-3.5 block border border-[#E8DFD8]/40">
                      <Image 
                        src={product.image_url || 'https://images.unsplash.com/photo-1544885896-01584c6c0b39?w=600&q=80'} 
                        alt={product.name} 
                        fill 
                        className="object-contain p-4 group-hover:scale-105 transition-transform duration-500" 
                      />
                      {product.category === 'gift_box' || product.category === 'gift' ? (
                        <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider bg-[#FFBF00] text-[#3A211E] rounded-full shadow-sm">
                          Hộp quà
                        </span>
                      ) : product.technical_specs?.is_customizable ? (
                        <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider bg-[#FFBF00] text-[#3A211E] rounded-full shadow-sm">
                          Custom
                        </span>
                      ) : null}
                    </Link>
                    <div className="flex flex-col flex-1">
                      <Link href={`/products/${product.id}`} className="font-bold text-base text-[#3A211E] hover:text-[#765B52] transition-colors mb-0.5 line-clamp-1">
                        {product.name}
                      </Link>
                      {product.technical_specs?.capacity && (
                        <span className="text-xs text-[#765B52] mb-2">{product.technical_specs.capacity}</span>
                      )}
                      <div className="mt-auto pt-2 flex items-center justify-between gap-2">
                        <span className="text-[#3A211E] font-black text-base">
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                        </span>
                        <AddToCartButton product={product} variant="icon" className="w-8 h-8 !p-0" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
