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
    <footer className="bg-muted border-t border-border pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-1">
          <Link href="/" className="text-3xl font-bold tracking-widest text-primary font-serif mb-4 block">
            CUPFY
          </Link>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Find your cup. Make it yours. <br />
            {t('Everyday cups with your own story.')}
          </p>
        </div>
        
        <div>
          <h4 className="font-bold mb-6 text-foreground tracking-wide uppercase text-sm">Shop</h4>
          <ul className="space-y-4">
            <li><Link href="/products?category=glass" className="text-muted-foreground hover:text-[#181818] text-sm transition-colors">{t('Glass Cup' as any)}</Link></li>
            <li><Link href="/products?category=thermos" className="text-muted-foreground hover:text-[#181818] text-sm transition-colors">{t('Thermos' as any)}</Link></li>
            <li><Link href="/products?category=plastic" className="text-muted-foreground hover:text-[#181818] text-sm transition-colors">{t('Plastic Cup' as any)}</Link></li>
            <li><Link href="/custom-cup" className="text-muted-foreground hover:text-primary text-sm transition-colors">Custom Cup</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-bold mb-6 text-foreground tracking-wide uppercase text-sm">{t('Customer Care' as any)}</h4>
          <ul className="space-y-4">
            <li><Link href="/shipping" className="text-muted-foreground hover:text-primary text-sm transition-colors">{t('Shipping Policy' as any)}</Link></li>
            <li><Link href="/returns" className="text-muted-foreground hover:text-primary text-sm transition-colors">{t('Return Policy' as any)}</Link></li>
            <li><Link href="/faq" className="text-muted-foreground hover:text-primary text-sm transition-colors">{t('FAQ' as any)}</Link></li>
            <li><Link href="/contact" className="text-muted-foreground hover:text-primary text-sm transition-colors">{t('Contact' as any)}</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-bold mb-6 text-foreground tracking-wide uppercase text-sm">{t('Connect' as any)}</h4>
          <ul className="space-y-4">
            <li><a href="#" className="text-muted-foreground hover:text-primary text-sm transition-colors">Instagram</a></li>
            <li><a href="#" className="text-muted-foreground hover:text-primary text-sm transition-colors">Facebook</a></li>
            <li><a href="#" className="text-muted-foreground hover:text-primary text-sm transition-colors">TikTok</a></li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 mt-16 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between">
        <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} CUPFY. All rights reserved.</p>
      </div>
    </footer>
  );
}
