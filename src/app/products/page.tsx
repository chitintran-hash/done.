"use client";

import { useEffect, useState, Suspense } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Search, Loader2, Filter, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';

export default function ProductCatalogPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-[50vh]"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}>
      <ProductCatalogContent />
    </Suspense>
  );
}

function ProductCatalogContent() {
  const supabase = createClient();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category') || 'all';
  const collectionParam = searchParams.get('collection') || 'all';

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // States cho filter
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [sortOrder, setSortOrder] = useState('newest');

  useEffect(() => {
    setSelectedCategory(categoryParam);
  }, [categoryParam]);

  useEffect(() => {
    let ignore = false;
    const fetchProducts = async () => {
      setLoading(true);
      // Lấy toàn bộ sản phẩm ly, giả định các sản phẩm cũ đã bị xoá
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_available', true);

      if (!ignore && data) {
        setProducts(data);
      }
      if (!ignore) setLoading(false);
    };

    fetchProducts();
    return () => { ignore = true; };
  }, []);

  // Filter in JS
  let displayed = [...products];

  if (searchTerm) {
    displayed = displayed.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  if (selectedCategory !== 'all') {
    displayed = displayed.filter(p => p.category === selectedCategory);
  }

  // Tạm thời chưa filter collection vì cần setup trong technical_specs
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
    // newest - assume higher id or created_at
    displayed.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  const categories = [
    { id: 'all', name: 'Tất cả ly' },
    { id: 'coffee', name: 'Ly cà phê' },
    { id: 'milktea', name: 'Ly trà sữa' },
    { id: 'glass', name: 'Ly thủy tinh' },
    { id: 'straw', name: 'Ly ống hút' },
    { id: 'thermos', name: 'Ly giữ nhiệt' },
    { id: 'gift', name: 'Ly quà tặng' },
    { id: 'office', name: 'Ly văn phòng' },
    { id: 'minimal', name: 'Phong cách tối giản' }
  ];

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-serif font-bold text-foreground mb-4">Shop Cups</h1>
          <p className="text-muted-foreground text-lg max-w-xl">
            Khám phá bộ sưu tập những chiếc ly xinh xắn, giúp mỗi ngụm nước bạn uống đều ngập tràn niềm vui.
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-64 flex-shrink-0">
          <div className="sticky top-28 space-y-10">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm ly..."
                className="w-full pl-10 pr-4 py-3 rounded-full border border-border bg-white text-sm focus:outline-none focus:border-primary transition-colors"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
              <Search className="w-4 h-4 text-muted-foreground absolute left-4 top-3.5" />
            </div>

            {/* Categories */}
            <div>
              <h3 className="font-bold text-foreground mb-4 uppercase tracking-wider text-sm">Danh mục</h3>
              <ul className="space-y-3">
                {categories.map(c => (
                  <li key={c.id}>
                    <button 
                      onClick={() => setSelectedCategory(c.id)}
                      className={`text-sm hover:text-primary transition-colors text-left w-full ${selectedCategory === c.id ? 'text-primary font-bold' : 'text-muted-foreground'}`}
                    >
                      {c.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Sort */}
            <div>
              <h3 className="font-bold text-foreground mb-4 uppercase tracking-wider text-sm">Sắp xếp</h3>
              <div className="relative">
                <select 
                  className="w-full appearance-none border border-border bg-white rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary"
                  value={sortOrder}
                  onChange={e => setSortOrder(e.target.value)}
                >
                  <option value="newest">Mới nhất</option>
                  <option value="price_asc">Giá: Thấp đến Cao</option>
                  <option value="price_desc">Giá: Cao đến Thấp</option>
                </select>
                <ChevronDown className="w-4 h-4 text-muted-foreground absolute right-4 top-3.5 pointer-events-none" />
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
          ) : displayed.length === 0 ? (
            <div className="text-center py-20 bg-muted/30 rounded-3xl border border-border border-dashed">
              <p className="text-muted-foreground text-lg">Chưa có ly nào phù hợp với tìm kiếm của bạn.</p>
              <button 
                onClick={() => { setSelectedCategory('all'); setSearchTerm(''); }}
                className="mt-4 text-primary font-bold hover:underline"
              >
                Xóa bộ lọc
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
              {displayed.map(product => (
                <div key={product.id} className="group relative flex flex-col">
                  <Link href={`/products/${product.id}`} className="relative w-full aspect-square rounded-2xl overflow-hidden bg-muted mb-4 block">
                    <Image 
                      src={product.image_url || 'https://images.unsplash.com/photo-1544885896-01584c6c0b39?w=600&q=80'} 
                      alt={product.name} 
                      fill 
                      className="object-cover group-hover:scale-105 transition-transform duration-700" 
                    />
                    {product.technical_specs?.is_customizable && (
                      <span className="absolute top-3 left-3 px-3 py-1 text-xs font-bold uppercase tracking-wider bg-white/90 backdrop-blur-sm text-foreground rounded-full">
                        Custom
                      </span>
                    )}
                  </Link>
                  <div className="flex flex-col flex-1">
                    <Link href={`/products/${product.id}`} className="font-medium text-lg text-foreground hover:text-primary transition-colors mb-1 line-clamp-1">
                      {product.name}
                    </Link>
                    <span className="text-muted-foreground font-medium">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
