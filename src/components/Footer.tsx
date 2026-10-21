'use client';

import Link from 'next/link';
import { usePathname } from "next/navigation";
import { useLanguageStore } from '@/store/useLanguageStore';
import { translations, TranslationKey } from '@/lib/i18n/translations';

export default function Footer() {
  const pathname = usePathname();
  const { language } = useLanguageStore();
  const t = (key: TranslationKey) => translations[language]?.[key] || key;

  if (pathname === "/custom-cup") return null;

  return (
    <footer className="bg-[#3A211E] border-t border-[#3A211E] pt-16 pb-10 text-white">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
        
        {/* Brand & Mission */}
        <div className="col-span-1 md:col-span-1">
          <Link href="/" className="text-3xl font-bold tracking-widest text-white mb-4 block hover:opacity-90 transition-opacity">
            CUPFY
          </Link>
          <p className="text-white/80 text-sm leading-relaxed">
            Find your cup. Make it yours. <br />
            {t("Everyday cups with your own story." as any)}
          </p>
        </div>
        
        {/* Shop Column */}
        <div>
          <h4 className="font-bold mb-6 text-white tracking-wide uppercase text-sm">{t('Shop' as any)}</h4>
          <ul className="space-y-3.5">
            <li><Link href="/products?category=glass" className="text-white/80 hover:text-white hover:underline text-sm transition-all">{t('Glass Cup' as any)}</Link></li>
            <li><Link href="/products?category=plastic" className="text-white/80 hover:text-white hover:underline text-sm transition-all">{t('Plastic Cup' as any)}</Link></li>
            <li><Link href="/custom-cup" className="text-white/80 hover:text-white hover:underline text-sm transition-all">{t('Custom Cup' as any)}</Link></li>
            <li><Link href="/gifts" className="text-white/80 hover:text-white hover:underline text-sm transition-all">{t('Gift Sets' as any)}</Link></li>
          </ul>
        </div>
        
        {/* Customer Care & Policies */}
        <div>
          <h4 className="font-bold mb-6 text-white tracking-wide uppercase text-sm">{t('Customer Care' as any)}</h4>
          <ul className="space-y-3">
            <li><Link href="/shipping" className="text-white/80 hover:text-white hover:underline text-sm transition-all">{t('Shipping Policy' as any)}</Link></li>
            <li><Link href="/returns" className="text-white/80 hover:text-white hover:underline text-sm transition-all">{t('Return & Refund Policy' as any)}</Link></li>
            <li><Link href="/privacy" className="text-white/80 hover:text-white hover:underline text-sm transition-all">{t('Privacy Policy' as any)}</Link></li>
            <li><Link href="/terms" className="text-white/80 hover:text-white hover:underline text-sm transition-all">{t('Terms of Service' as any)}</Link></li>
            <li><Link href="/cookies" className="text-white/80 hover:text-white hover:underline text-sm transition-all">{t('Cookie Policy' as any)}</Link></li>
            <li><Link href="/faq" className="text-white/80 hover:text-white hover:underline text-sm transition-all">{t('FAQ' as any)}</Link></li>
            <li><Link href="/contact" className="text-white/80 hover:text-white hover:underline text-sm transition-all">{t('Contact' as any)}</Link></li>
          </ul>
        </div>
        
        {/* Social Connect */}
        <div>
          <h4 className="font-bold mb-6 text-white tracking-wide uppercase text-sm">{t('Connect' as any)}</h4>
          <ul className="space-y-3.5">
            <li><a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-white/80 hover:text-white hover:underline text-sm transition-all">Instagram</a></li>
            <li><a href="https://facebook.com" target="_blank" rel="noreferrer" className="text-white/80 hover:text-white hover:underline text-sm transition-all">Facebook</a></li>
            <li><a href="https://tiktok.com" target="_blank" rel="noreferrer" className="text-white/80 hover:text-white hover:underline text-sm transition-all">TikTok</a></li>
            <li><a href="mailto:tranchitin2006@gmail.com" className="text-white/80 hover:text-white hover:underline text-sm transition-all">tranchitin2006@gmail.com</a></li>
            <li><a href="tel:0916799627" className="text-white/80 hover:text-white hover:underline text-sm transition-all">Hotline: 0916 799 627</a></li>
          </ul>
        </div>

      </div>
      
      {/* Bottom Legal Links & Copyright */}
      <div className="max-w-7xl mx-auto px-4 mt-14 pt-8 border-t border-white/15 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-xs text-white/70">© 2026 CUPFY. All rights reserved.</p>
        
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-white/70">
          <Link href="/privacy" className="hover:text-white hover:underline transition-all">{t('Privacy' as any)}</Link>
          <span>•</span>
          <Link href="/terms" className="hover:text-white hover:underline transition-all">{t('Terms' as any)}</Link>
          <span>•</span>
          <Link href="/cookies" className="hover:text-white hover:underline transition-all">{t('Cookie' as any)}</Link>
          <span>•</span>
          <Link href="/shipping" className="hover:text-white hover:underline transition-all">{t('Shipping' as any)}</Link>
          <span>•</span>
          <Link href="/returns" className="hover:text-white hover:underline transition-all">{t('Returns & Refunds' as any)}</Link>
        </div>
      </div>
    </footer>
  );
}
