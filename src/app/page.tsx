"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, Monitor, Box, Smartphone, Mouse, Zap, LayoutDashboard, Store } from "lucide-react";
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
  { id: 'desk', name: 'Bàn', icon: LayoutDashboard },
  { id: 'chair', name: 'Ghế', icon: Box },
  { id: 'monitor', name: 'Màn hình', icon: Monitor },
  { id: 'monitor_arm', name: 'Monitor Arm', icon: Zap },
  { id: 'keyboard', name: 'Bàn phím', icon: Smartphone },
  { id: 'mouse', name: 'Chuột', icon: Mouse },
];

export default function Home() {
  const router = useRouter();
  const { t } = useLanguage();
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
        .select('*, profiles!products_seller_id_fkey(store_name)')
        .eq('approval_status', 'active')
        .limit(8);
      
      if (data) setFeaturedProducts(data);
    };
    fetchFeatured();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* 1. HERO SECTION */}
      <section className="flex flex-col items-center justify-center p-6 pt-24 pb-16">
        <div className="max-w-4xl w-full text-center space-y-8">
          <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent font-medium text-sm mb-4">
            <CheckCircle2 className="w-4 h-4" />
            <span>Marketplace Chuyên Biệt Cho Workspace</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            {t('home.hero.title')}
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t('home.hero.subtitle')}
          </p>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => router.push('/build')}
              className="group flex items-center justify-center gap-2 px-8 py-4 bg-foreground text-background rounded-full font-medium text-lg hover:bg-foreground/90 transition-all w-full sm:w-auto shadow-lg"
            >
              {t('home.hero.start')}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button 
              onClick={() => router.push('/products')}
              className="flex items-center justify-center px-8 py-4 bg-muted text-foreground rounded-full font-medium text-lg hover:bg-border transition-all w-full sm:w-auto"
            >
              Khám phá sản phẩm
            </button>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="pt-16 w-full max-w-5xl mx-auto"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-border aspect-video group">
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
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent"></div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. SOLUTION EXPLANATION */}
      <section className="py-24 bg-muted/30 border-y border-border">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">Không chỉ mua sản phẩm.<br/>Hãy xây dựng một setup phù hợp.</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-16 leading-relaxed">
            DONE. kết nối nhu cầu, không gian và ngân sách của bạn với những sản phẩm tương thích. Không còn phỏng đoán, không còn nỗi lo mua về không lắp được.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-8 rounded-3xl border border-border shadow-sm text-left">
              <div className="w-12 h-12 bg-accent/10 text-accent rounded-full flex items-center justify-center mb-6">
                <Box className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Phù hợp Không Gian</h3>
              <p className="text-muted-foreground">Thuật toán phân tích kích thước và giới hạn vật lý của căn phòng để đề xuất đồ đạc vừa vặn nhất.</p>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-border shadow-sm text-left">
              <div className="w-12 h-12 bg-accent/10 text-accent rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Tương Thích 100%</h3>
              <p className="text-muted-foreground">Compatibility Engine đảm bảo monitor arm lắp vừa mặt bàn, hoặc cáp nối đúng chuẩn thiết bị.</p>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-border shadow-sm text-left">
              <div className="w-12 h-12 bg-accent/10 text-accent rounded-full flex items-center justify-center mb-6">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Phù hợp Ngân Sách</h3>
              <p className="text-muted-foreground">Hệ sinh thái hàng ngàn sản phẩm từ nhiều cửa hàng giúp tối ưu chi phí cho nhu cầu của bạn.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CATEGORY EXPLORER */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Khám phá theo danh mục</h2>
              <p className="text-muted-foreground">Tìm kiếm các mảnh ghép cho góc làm việc của bạn.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <Link key={cat.id} href={`/products?category=${cat.id}`} className="group bg-muted/50 border border-border rounded-2xl p-6 flex flex-col items-center justify-center gap-4 hover:bg-white hover:border-accent hover:shadow-lg transition-all text-center">
                <cat.icon className="w-10 h-10 text-muted-foreground group-hover:text-accent transition-colors" />
                <span className="font-bold">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FEATURED PRODUCTS */}
      <section className="py-24 bg-muted/30 border-y border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Sản phẩm nổi bật</h2>
              <p className="text-muted-foreground">Được đề xuất cho các góc làm việc hiện đại.</p>
            </div>
            <Link href="/products" className="hidden sm:flex items-center gap-2 font-bold text-accent hover:underline">
              Xem tất cả <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          {featuredProducts.length === 0 ? (
            <div className="text-center py-20 bg-white border border-border rounded-3xl">
              <p className="text-muted-foreground">Hệ thống đang cập nhật sản phẩm.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map(product => (
                <Link key={product.id} href={`/products/${product.id}`} className="group bg-white rounded-3xl border border-border overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
                  <div className="aspect-square bg-muted relative overflow-hidden p-6">
                    <img src={product.image_url} alt={product.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-bold text-lg mb-4 group-hover:text-accent transition-colors line-clamp-2">{product.name}</h3>
                    <div className="flex items-center gap-2 mb-4">
                      <Store className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground line-clamp-1">{product.profiles?.store_name || 'Người bán DONE.'}</span>
                    </div>
                    <div className="mt-auto flex items-end justify-between">
                      <span className="text-xl font-bold text-accent">{formatVND(product.price)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 5. BRAND STORY */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-8 tracking-tight">Câu chuyện của DONE.</h2>
          <div className="space-y-6 text-lg md:text-xl text-muted-foreground leading-relaxed">
            <p>DONE. bắt đầu từ một câu hỏi đơn giản: Vì sao việc xây dựng một góc học tập hoặc làm việc phù hợp lại phải bắt đầu bằng hàng chục tab tìm kiếm, và kết thúc bằng việc trả hàng vì không lắp vừa?</p>
            <p>Một chiếc bàn đẹp chưa chắc phù hợp với tay đỡ màn hình. Một chiếc màn hình tốt chưa chắc vừa với không gian phòng. Một bộ setup hợp lý không chỉ là tập hợp của những món đồ riêng lẻ.</p>
            <p className="text-foreground font-medium italic">"DONE. được xây dựng để kết nối những lựa chọn đó."</p>
            <p>Chúng tôi giúp bạn đi từ nhu cầu đến một không gian hoàn chỉnh, nơi sản phẩm, thẩm mỹ và ngân sách có thể hoạt động hoàn hảo cùng nhau.</p>
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION (SELLER) */}
      <section className="py-24 bg-foreground text-background">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-8">
          <Store className="w-16 h-16 mx-auto text-orange-500 mb-6" />
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Bạn có sản phẩm phù hợp cho góc làm việc?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Mở cửa hàng trên DONE. và đưa sản phẩm của bạn đến đúng đối tượng khách hàng đang xây dựng setup của riêng họ. Tích hợp trực tiếp vào Solution Builder của chúng tôi.
          </p>
          <button 
            onClick={() => router.push('/register')}
            className="px-8 py-4 bg-orange-600 text-white rounded-full font-bold text-lg hover:bg-orange-700 transition-colors shadow-lg"
          >
            Trở thành Người Bán
          </button>
        </div>
      </section>
    </div>
  );
}
