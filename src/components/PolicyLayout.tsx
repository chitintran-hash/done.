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

import { useLanguageStore } from '@/store/useLanguageStore';
import { translations, TranslationKey } from '@/lib/i18n/translations';

interface PolicyLayoutProps {
  title: string;
  subtitle?: string;
  effectiveDate?: string;
  currentSlug: 'privacy' | 'terms' | 'cookies' | 'shipping' | 'returns';
  children: React.ReactNode;
}

const POLICIES: { slug: 'privacy' | 'terms' | 'cookies' | 'shipping' | 'returns'; href: string; labelKey: TranslationKey; icon: any }[] = [
  { slug: 'privacy', href: '/privacy', labelKey: 'Privacy Policy', icon: ShieldCheck },
  { slug: 'terms', href: '/terms', labelKey: 'Terms of Service', icon: FileText },
  { slug: 'cookies', href: '/cookies', labelKey: 'Cookie Policy', icon: Cookie },
  { slug: 'shipping', href: '/shipping', labelKey: 'Shipping Policy', icon: Truck },
  { slug: 'returns', href: '/returns', labelKey: 'Return & Refund Policy', icon: RotateCcw },
];

export default function PolicyLayout({
  title,
  subtitle,
  effectiveDate = '20/10/2026',
  currentSlug,
  children,
}: PolicyLayoutProps) {
  const pathname = usePathname();
  const { language } = useLanguageStore();
  const t = (key: TranslationKey) => translations[language]?.[key] || key;

  return (
    <div className="min-h-screen pt-[100px] md:pt-[120px] pb-24 bg-[#FFF9E8]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-[#765B52] mb-6 font-medium">
          <Link href="/" className="hover:text-[#3A211E] transition-colors">{t('Home' as any)}</Link>
          <ChevronRight className="w-3.5 h-3.5 opacity-60" />
          <span>{t('Terms & Policies' as any)}</span>
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
                    : 'bg-white text-[#765B52] hover:text-[#3A211E] hover:bg-[#FFF9E8] border-[#E8DFD8]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#FFBF00]' : 'text-[#765B52]'}`} />
                <span>{t(p.labelKey)}</span>
              </Link>
            );
          })}
        </div>

        {/* Main Content Card */}
        <article className="bg-white rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-10 md:p-14 shadow-xs border border-[#E8DFD8]">
          
          {/* Header */}
          <header className="border-b border-[#E8DFD8] pb-8 mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF3C4] border border-[#FFBF00]/40 text-[11px] font-bold text-[#3A211E] uppercase tracking-wider mb-4">
              <ShieldCheck className="w-3.5 h-3.5" />
              Chính sách chính thức Cupfy
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#3A211E] tracking-tight leading-snug">
              {title}
            </h1>

            {subtitle && (
              <p className="text-sm md:text-base text-[#765B52] mt-3 leading-relaxed">
                {subtitle}
              </p>
            )}

            <div className="flex items-center gap-2 mt-4 text-xs font-medium text-[#765B52]">
              <Clock className="w-3.5 h-3.5 text-[#FFBF00]" />
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
          <footer className="mt-12 pt-8 border-t border-[#E8DFD8] bg-[#FFF9E8] -mx-6 sm:-mx-10 md:-mx-14 -mb-6 sm:-mb-10 md:-mb-14 p-6 sm:p-8 rounded-b-[2rem] sm:rounded-b-[3rem] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-[#3A211E] text-sm flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#3A211E]" />
                Bạn cần hỗ trợ thêm về chính sách này?
              </h4>
              <p className="text-xs text-[#765B52] mt-1">
                Đội ngũ hỗ trợ Cupfy luôn sẵn sàng giải đáp thắc mắc và đồng hành cùng bạn.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <a 
                href="mailto:tranchitin2006@gmail.com" 
                className="px-4 py-2 bg-white text-[#3A211E] font-bold rounded-xl border border-[#E8DFD8] hover:bg-[#FFF3C4] transition-colors flex items-center gap-1.5"
              >
                <Mail className="w-3.5 h-3.5 text-[#3A211E]" />
                tranchitin2006@gmail.com
              </a>
              <Link
                href="/contact"
                className="px-4 py-2 bg-[#3A211E] text-white font-bold rounded-xl hover:bg-[#201817] transition-colors flex items-center gap-1.5"
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
