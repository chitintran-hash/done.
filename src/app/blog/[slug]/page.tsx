import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, Clock, User, Calendar, Sparkles, ArrowLeft, Share2 } from 'lucide-react';
import { BLOG_ARTICLES } from '@/data/blogArticles';

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = BLOG_ARTICLES.find((a) => a.slug === slug);

  if (!article) {
    return {
      title: 'Không Tìm Thấy Bài Viết | Cupfy',
      description: 'Bài viết không tồn tại trên Cupfy.',
    };
  }

  return {
    title: {
      absolute: `${article.title} | Cupfy`,
    },
    description: article.excerpt,
    alternates: {
      canonical: `https://www.cupfy.space/blog/${article.slug}`,
    },
    openGraph: {
      title: `${article.title} | Cupfy`,
      description: article.excerpt,
      url: `https://www.cupfy.space/blog/${article.slug}`,
      siteName: 'Cupfy',
      locale: 'vi_VN',
      type: 'article',
      publishedTime: article.publishedAt,
      authors: [article.author],
      images: [
        {
          url: article.coverImage,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
  };
}

export default async function BlogDetailPage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = BLOG_ARTICLES.find((a) => a.slug === slug);

  if (!article) {
    notFound();
  }

  // Schema.org Article Structured Data (Phần 5)
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    image: [article.coverImage],
    datePublished: '2026-10-20T00:00:00+07:00',
    dateModified: '2026-10-20T00:00:00+07:00',
    author: {
      '@type': 'Person',
      name: article.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Cupfy',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.cupfy.space/icon.jpg',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://www.cupfy.space/blog/${article.slug}`,
    },
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Trang chủ',
        item: 'https://www.cupfy.space',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Cẩm nang',
        item: 'https://www.cupfy.space/blog',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: article.title,
        item: `https://www.cupfy.space/blog/${article.slug}`,
      },
    ],
  };

  const relatedArticles = BLOG_ARTICLES.filter((a) => a.slug !== article.slug).slice(0, 2);

  return (
    <div className="min-h-screen pt-[100px] md:pt-[120px] pb-24 bg-[#FFF9E8]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Breadcrumb (Phần 5 & 10) */}
        <nav className="flex items-center gap-2 text-xs text-[#765B52] mb-6 font-medium">
          <Link href="/" className="hover:text-[#3A211E] transition-colors">Trang chủ</Link>
          <ChevronRight className="w-3.5 h-3.5 opacity-60" />
          <Link href="/blog" className="hover:text-[#3A211E] transition-colors">Cẩm nang</Link>
          <ChevronRight className="w-3.5 h-3.5 opacity-60" />
          <span className="text-[#3A211E] font-bold truncate max-w-[220px] sm:max-w-none">{article.title}</span>
        </nav>

        {/* Main Article Container */}
        <article className="bg-white rounded-[2.5rem] sm:rounded-[3rem] p-6 sm:p-10 md:p-14 shadow-xs border border-[#E8DFD8]">
          
          {/* Article Header */}
          <header className="border-b border-[#E8DFD8] pb-8 mb-8">
            <span className="inline-block px-3 py-1 rounded-full bg-[#FFF3C4] border border-[#E8DFD8] text-[10px] font-bold text-[#3A211E] uppercase tracking-wider mb-4">
              {article.category}
            </span>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#3A211E] leading-tight tracking-tight mb-4">
              {article.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[#765B52]">
              <span className="flex items-center gap-1.5 font-bold text-[#3A211E]">
                <User className="w-3.5 h-3.5 text-[#3A211E]" />
                {article.author}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {article.publishedAt}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {article.readTime}
              </span>
            </div>
          </header>

          {/* Cover Image */}
          <div className="relative w-full aspect-video rounded-3xl overflow-hidden mb-8 border border-[#E8DFD8] shadow-xs">
            <Image
              src={article.coverImage}
              alt={article.title}
              fill
              priority
              className="object-cover"
            />
          </div>

          {/* Lead Excerpt */}
          <p className="text-base sm:text-lg font-medium text-[#3A211E] leading-relaxed mb-8 p-5 bg-[#FFF9E8] rounded-2xl border-l-4 border-[#FFBF00]">
            {article.excerpt}
          </p>

          {/* Article Body */}
          <div className="space-y-6 text-sm sm:text-base text-[#3A211E] leading-relaxed">
            {article.content.map((paragraph, idx) => {
              if (paragraph.startsWith('### ')) {
                return (
                  <h2 key={idx} className="text-xl sm:text-2xl font-bold text-[#3A211E] pt-4 mb-2 tracking-tight">
                    {paragraph.replace('### ', '')}
                  </h2>
                );
              }
              if (paragraph.startsWith('- ')) {
                return (
                  <li key={idx} className="ml-4 list-disc text-[#765B52]">
                    {paragraph.replace('- ', '')}
                  </li>
                );
              }
              return (
                <p key={idx} className="text-[#765B52]">
                  {paragraph}
                </p>
              );
            })}
          </div>

          {/* In-Article CTA Banner (Phần 10: Liên kết nội bộ) */}
          <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-[#FFF3C4] border border-[#E8DFD8] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-base sm:text-lg text-[#3A211E]">
                Thử nghiệm thiết kế chiếc ly của bạn ngay!
              </h3>
              <p className="text-xs sm:text-sm text-[#765B52] mt-0.5">
                Xem trước 3D chân thực, thêm tên và ảnh tùy ý trước khi đặt hàng.
              </p>
            </div>
            <Link
              href={article.callToActionLink}
              className="px-6 py-3 bg-[#3A211E] text-white rounded-full font-bold text-xs sm:text-sm hover:bg-[#201817] transition-colors shrink-0 shadow-sm flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-[#FFBF00]" />
              {article.callToActionText}
            </Link>
          </div>

          {/* Back & Related */}
          <div className="mt-12 pt-8 border-t border-[#E8DFD8] flex items-center justify-between">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#3A211E] hover:underline"
            >
              <ArrowLeft className="w-4 h-4" /> Quay lại danh sách bài viết
            </Link>
          </div>

        </article>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <div className="mt-12">
            <h3 className="font-bold text-lg text-[#3A211E] mb-6">Bài Viết Liên Quan</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {relatedArticles.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/blog/${rel.slug}`}
                  className="bg-white p-5 rounded-3xl border border-[#E8DFD8] shadow-xs hover:shadow-md transition-shadow flex gap-4 items-center group"
                >
                  <div className="relative w-20 h-20 rounded-2xl overflow-hidden shrink-0 bg-slate-100">
                    <Image src={rel.coverImage} alt={rel.title} fill className="object-cover group-hover:scale-105 transition-transform" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[#765B52] uppercase tracking-wider">{rel.category}</span>
                    <h4 className="font-bold text-sm text-[#3A211E] leading-snug line-clamp-2 mt-1 group-hover:text-[#3A211E]">
                      {rel.title}
                    </h4>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
