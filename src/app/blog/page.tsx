import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { BookOpen, Sparkles, Clock, User, ArrowRight } from 'lucide-react';
import { BLOG_ARTICLES } from '@/data/blogArticles';

export const metadata: Metadata = {
  title: {
    absolute: 'Cẩm Nang Thiết Kế & Chọn Ly Uống Nước | Cupfy',
  },
  description: 'Tổng hợp kinh nghiệm tự thiết kế ly online, chọn hình in sắc nét, ý tưởng quà tặng ly độc bản và giải pháp ly in logo cho quán cà phê từ Cupfy.',
  alternates: {
    canonical: 'https://www.cupfy.space/blog',
  },
  openGraph: {
    title: 'Cẩm Nang Thiết Kế & Chọn Ly Uống Nước | Cupfy',
    description: 'Tổng hợp kinh nghiệm tự thiết kế ly online, chọn hình in sắc nét, ý tưởng quà tặng ly độc bản và giải pháp ly in logo cho quán cà phê từ Cupfy.',
    url: 'https://www.cupfy.space/blog',
    siteName: 'Cupfy',
    locale: 'vi_VN',
    type: 'website',
  },
};

export default function BlogListingPage() {
  return (
    <div className="min-h-screen pt-[100px] md:pt-[120px] pb-24 bg-[#FFF9E8]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FFF3C4] border border-[#E8DFD8] text-[11px] font-bold text-[#3A211E] uppercase tracking-wider mb-4">
            <BookOpen className="w-3.5 h-3.5" />
            Cẩm Nang & Kinh Nghiệm
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#3A211E] tracking-tight mb-4">
            Kiến Thức & Xu Hướng Ly
          </h1>
          <p className="text-sm sm:text-base text-[#765B52] leading-relaxed">
            Khám phá những mẹo hay về thiết kế ly cá nhân hóa, ý tưởng quà tặng độc đáo và bí quyết chọn ly hoàn hảo cho đồ uống của bạn.
          </p>
        </div>

        {/* Featured First Article */}
        {BLOG_ARTICLES.length > 0 && (
          <div className="mb-12">
            <Link 
              href={`/blog/${BLOG_ARTICLES[0].slug}`}
              className="bg-white rounded-[2.5rem] border border-[#E8DFD8] overflow-hidden grid grid-cols-1 lg:grid-cols-12 shadow-xs hover:shadow-md transition-shadow group"
            >
              <div className="lg:col-span-7 relative aspect-video lg:aspect-auto min-h-[300px] overflow-hidden bg-slate-100">
                <Image 
                  src={BLOG_ARTICLES[0].coverImage} 
                  alt={BLOG_ARTICLES[0].title}
                  fill
                  priority
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between">
                <div>
                  <span className="inline-block px-3 py-1 rounded-full bg-[#FFF3C4] border border-[#FFBF00]/40 text-[10px] font-bold text-[#3A211E] uppercase tracking-wider mb-3">
                    {BLOG_ARTICLES[0].category}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-[#3A211E] leading-tight mb-3 group-hover:text-[#3A211E] transition-colors">
                    {BLOG_ARTICLES[0].title}
                  </h2>
                  <p className="text-xs sm:text-sm text-[#765B52] leading-relaxed line-clamp-3">
                    {BLOG_ARTICLES[0].excerpt}
                  </p>
                </div>

                <div className="pt-6 border-t border-[#E8DFD8]/60 flex items-center justify-between text-xs text-[#765B52]">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    {BLOG_ARTICLES[0].readTime}
                  </span>
                  <span className="font-bold text-[#3A211E] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Đọc tiếp <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Rest of Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {BLOG_ARTICLES.slice(1).map((article) => (
            <Link
              key={article.slug}
              href={`/blog/${article.slug}`}
              className="bg-white rounded-[2rem] border border-[#E8DFD8] overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow group"
            >
              <div className="relative w-full aspect-video overflow-hidden bg-slate-100">
                <Image
                  src={article.coverImage}
                  alt={article.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#FFF9E8] border border-[#E8DFD8] text-[10px] font-bold text-[#765B52] uppercase tracking-wider mb-2.5">
                    {article.category}
                  </span>
                  <h3 className="font-bold text-lg text-[#3A211E] leading-snug group-hover:text-[#3A211E] transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#765B52] mt-2 leading-relaxed line-clamp-2">
                    {article.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#E8DFD8]/60 flex items-center justify-between text-xs text-[#765B52]">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {article.readTime}
                  </span>
                  <span className="font-bold text-[#3A211E] flex items-center gap-1">
                    Xem bài viết <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA Studio Banner at bottom */}
        <div className="mt-16 bg-[#FFF3C4] rounded-[2.5rem] border border-[#E8DFD8] p-8 sm:p-12 text-center shadow-xs">
          <h2 className="text-2xl sm:text-3xl font-black text-[#3A211E] mb-3">
            Sẵn Sàng Sáng Tạo Chiếc Ly Của Riêng Bạn?
          </h2>
          <p className="text-sm text-[#765B52] mb-6 max-w-lg mx-auto leading-relaxed">
            Thử nghiệm công cụ thiết kế 3D hoàn toàn miễn phí. Thêm chữ, ảnh và xem trước chân thật chỉ trong vài thao tác.
          </p>
          <Link
            href="/custom-cup"
            className="px-8 py-3.5 bg-[#3A211E] text-white rounded-full font-bold text-sm hover:bg-[#201817] transition-colors shadow-sm inline-flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-[#FFBF00]" />
            Bắt đầu thiết kế 3D ngay
          </Link>
        </div>

      </div>
    </div>
  );
}
