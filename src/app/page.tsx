"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, Store } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatVND } from "@/lib/utils/currency";

const images = [
  "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&w=1600&q=80"
];

const categories = [
  { id: 'desk', name: 'Bàn Làm Việc', image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=600&q=80' },
  { id: 'chair', name: 'Ghế Công Thái Học', image: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&w=600&q=80' },
  { id: 'monitor', name: 'Màn Hình', image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80' },
  { id: 'desk_lamp', name: 'Đèn Bàn', image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=600&q=80' },
  { id: 'keyboard', name: 'Bàn Phím & Chuột', image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=600&q=80' },
  { id: 'headphone', name: 'Tai Nghe & Loa', image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=600&q=80' },
];

export default function Home() {
  const router = useRouter();
  const [currentImg, setCurrentImg] = useState(0);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImg((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchFeatured = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from('products')
        .select('*, profiles!products_seller_id_fkey(store_name, logo_url)')
        .eq('approval_status', 'active')
        .limit(8);
      
      if (data) setFeaturedProducts(data);
    };
    fetchFeatured();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* 1. HERO SECTION */}
      <section className="flex flex-col items-center justify-center p-6 pt-20 pb-16">
        <div className="max-w-4xl w-full text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Hoàn thiện góc học tập và làm việc theo cách của bạn.
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Chọn từng sản phẩm bạn thích hoặc để DONE. gợi ý một setup phù hợp với không gian, nhu cầu và ngân sách của bạn.
          </p>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => router.push('/build')}
              className="group flex items-center justify-center gap-2 px-8 py-3.5 bg-foreground text-background rounded-xl font-medium hover:bg-foreground/90 transition-all w-full sm:w-auto shadow-md"
            >
              Tạo setup của bạn
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button 
              onClick={() => router.push('/products')}
              className="flex items-center justify-center px-8 py-3.5 bg-muted text-foreground rounded-xl font-medium hover:bg-border transition-all w-full sm:w-auto"
            >
              Khám phá sản phẩm
            </button>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="pt-12 w-full max-w-5xl mx-auto"
          >
            <div className="relative rounded-2xl overflow-hidden border border-border aspect-[21/9] group bg-muted">
              {images.map((src, index) => (
                <img 
                  key={src}
                  src={src} 
                  alt="DONE. Workspace Setup" 
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                    index === currentImg ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. CATEGORY EXPLORER */}
      <section className="py-20 bg-muted/20 border-t border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Danh mục phổ biến</h2>
              <p className="text-muted-foreground">Khám phá các mảnh ghép cho góc làm việc của bạn.</p>
            </div>
            <Link href="/products" className="hidden sm:flex items-center gap-2 font-medium text-accent hover:underline">
              Xem tất cả <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {categories.map((cat) => (
              <Link key={cat.id} href={`/products?category=${cat.id}`} className="group relative rounded-2xl overflow-hidden aspect-[4/3] md:aspect-[3/2] border border-border">
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6">
                  <span className="text-white font-bold text-lg md:text-xl">{cat.name}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS */}
      <section className="py-20 border-t border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Sản phẩm nổi bật</h2>
              <p className="text-muted-foreground">Lựa chọn hàng đầu từ cộng đồng.</p>
            </div>
          </div>
          
          {featuredProducts.length === 0 ? (
            <div className="text-center py-20 bg-muted/30 border border-border border-dashed rounded-2xl">
              <p className="text-muted-foreground">Hệ thống đang cập nhật sản phẩm.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {featuredProducts.map(product => (
                <Link key={product.id} href={`/products/${product.id}`} className="group bg-white rounded-2xl border border-border overflow-hidden hover:border-accent hover:shadow-lg transition-all duration-300 flex flex-col">
                  <div className="aspect-square bg-muted relative overflow-hidden">
                    <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="font-bold text-base mb-3 group-hover:text-accent transition-colors line-clamp-2">{product.name}</h3>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center overflow-hidden shrink-0 border border-border">
                        {product.profiles?.logo_url ? (
                          <img src={product.profiles.logo_url} alt="Logo" className="w-full h-full object-cover" />
                        ) : (
                          <Store className="w-3 h-3 text-orange-600" />
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground line-clamp-1">{product.profiles?.store_name || 'Người bán DONE.'}</span>
                    </div>
                    <div className="mt-auto">
                      <span className="text-lg font-bold text-accent">{formatVND(product.price)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. BRAND STORY */}
      <section className="py-24 bg-muted/30 border-t border-border">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-4xl font-bold mb-8 tracking-tight">Câu chuyện của DONE.</h2>
          <div className="space-y-6 text-base md:text-lg text-muted-foreground leading-relaxed">
            <p>Một góc học tập tốt không bắt đầu từ việc mua thật nhiều đồ. Nó bắt đầu từ việc hiểu mình cần gì, có bao nhiêu không gian và những sản phẩm nào thực sự tương thích với nhau.</p>
            <p>DONE. được xây dựng để đơn giản hóa quá trình đó.</p>
            <p>Chúng tôi muốn biến việc xây dựng góc học tập và làm việc từ một quá trình tìm kiếm rời rạc thành một trải nghiệm liền mạch và trọn vẹn hơn.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
