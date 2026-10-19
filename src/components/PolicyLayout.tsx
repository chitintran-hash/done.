'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  ShieldCheck, 
  FileText, 
  Cookie, 
  Truck, 
  RotateCcw, 
  Clock, 
  Mail, 
  Phone, 
  ChevronRight,
  HelpCircle
} from 'lucide-react';

interface PolicyLayoutProps {
  title: string;
  subtitle?: string;
  effectiveDate?: string;
  currentSlug: 'privacy' | 'terms' | 'cookies' | 'shipping' | 'returns';
  children: React.ReactNode;
}

const POLICIES = [
  { slug: 'privacy', href: '/privacy', label: 'Bảo mật thông tin', icon: ShieldCheck },
  { slug: 'terms', href: '/terms', label: 'Điều khoản sử dụng', icon: FileText },
  { slug: 'cookies', href: '/cookies', label: 'Chính sách Cookie', icon: Cookie },
  { slug: 'shipping', href: '/shipping', label: 'Chính sách giao hàng', icon: Truck },
  { slug: 'returns', href: '/returns', label: 'Đổi trả & hoàn tiền', icon: RotateCcw },
];

export default function PolicyLayout({
  title,
  subtitle,
  effectiveDate = '20/10/2026',
  currentSlug,
  children,
}: PolicyLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen pt-[100px] md:pt-[120px] pb-24 bg-[#F7F6F2]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-[#6F625E] mb-6 font-medium">
          <Link href="/" className="hover:text-[#3A211E] transition-colors">Trang chủ</Link>
          <ChevronRight className="w-3.5 h-3.5 opacity-60" />
          <span>Quy chế & Chính sách</span>
          <ChevronRight className="w-3.5 h-3.5 opacity-60" />
          <span className="text-[#3A211E] font-bold">{title}</span>
        </nav>

        {/* Policy Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 no-scrollbar">
          {POLICIES.map((p) => {
            const Icon = p.icon;
            const isActive = currentSlug === p.slug || pathname === p.href;
            return (
              <Link
                key={p.slug}
                href={p.href}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                  isActive
                    ? 'bg-[#3A211E] text-white border-[#3A211E] shadow-sm'
                    : 'bg-white text-[#6F625E] hover:text-[#201817] hover:bg-[#EDECEA] border-[#DDD8D2]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#FFF3A6]' : 'text-[#6F625E]'}`} />
                <span>{p.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Main Content Card */}
        <article className="bg-white rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-10 md:p-14 shadow-xs border border-[#DDD8D2]">
          
          {/* Header */}
          <header className="border-b border-[#DDD8D2] pb-8 mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF3A6] border border-[#DDD8D2] text-[11px] font-bold text-[#4A2A25] uppercase tracking-wider mb-4">
              <ShieldCheck className="w-3.5 h-3.5" />
              Chính sách chính thức Cupfy
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#3A211E] tracking-tight leading-snug">
              {title}
            </h1>

            {subtitle && (
              <p className="text-sm md:text-base text-[#6F625E] mt-3 leading-relaxed">
                {subtitle}
              </p>
            )}

            <div className="flex items-center gap-2 mt-4 text-xs font-medium text-[#6F625E]">
              <Clock className="w-3.5 h-3.5 text-amber-700" />
              <span>Ngày ban hành: <strong>{effectiveDate}</strong></span>
              <span>•</span>
              <span>Phạm vi: <strong>Toàn quốc & Website Cupfy.space</strong></span>
            </div>
          </header>

          {/* Policy Body */}
          <div className="prose prose-stone max-w-none text-sm md:text-base text-[#3A211E] leading-relaxed space-y-8">
            {children}
          </div>

          {/* Footer Contact Support */}
          <footer className="mt-12 pt-8 border-t border-[#DDD8D2] bg-[#FAF9F6] -mx-6 sm:-mx-10 md:-mx-14 -mb-6 sm:-mb-10 md:-mb-14 p-6 sm:p-8 rounded-b-[2rem] sm:rounded-b-[3rem] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-[#3A211E] text-sm flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-amber-700" />
                Bạn cần hỗ trợ thêm về chính sách này?
              </h4>
              <p className="text-xs text-[#6F625E] mt-1">
                Đội ngũ hỗ trợ Cupfy luôn sẵn sàng giải đáp thắc mắc và đồng hành cùng bạn.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <a 
                href="mailto:support@cupfy.space" 
                className="px-4 py-2 bg-white text-[#3A211E] font-bold rounded-xl border border-[#DDD8D2] hover:bg-[#EDECEA] transition-colors flex items-center gap-1.5"
              >
                <Mail className="w-3.5 h-3.5 text-[#4A2A25]" />
                support@cupfy.space
              </a>
              <Link
                href="/contact"
                className="px-4 py-2 bg-[#4A2A25] text-white font-bold rounded-xl hover:bg-[#3A211E] transition-colors flex items-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5" />
                Liên hệ hỗ trợ
              </Link>
            </div>
          </footer>

        </article>

      </div>
    </div>
  );
}
