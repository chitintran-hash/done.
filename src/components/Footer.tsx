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
    <footer className="bg-[#3A211E] border-t border-[#3A211E] pt-16 pb-10">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
        
        {/* Brand & Mission */}
        <div className="col-span-1 md:col-span-1">
          <Link href="/" className="text-3xl font-bold tracking-widest text-[#FFFFFF] mb-4 block">
            CUPFY
          </Link>
          <p className="text-[#EDECEA] text-sm leading-relaxed">
            Find your cup. Make it yours. <br />
            Những chiếc ly nhỏ xinh cho mọi khoảnh khắc hằng ngày của bạn.
          </p>
        </div>
        
        {/* Shop Column */}
        <div>
          <h4 className="font-bold mb-6 text-[#FFFFFF] tracking-wide uppercase text-sm">Shop</h4>
          <ul className="space-y-3.5">
            <li><Link href="/products?category=glass" className="text-[#EDECEA] hover:text-[#FFF3A6] text-sm transition-colors">Ly thuỷ tinh</Link></li>
            <li><Link href="/products?category=plastic" className="text-[#EDECEA] hover:text-[#FFF3A6] text-sm transition-colors">Ly nhựa</Link></li>
            <li><Link href="/custom-cup" className="text-[#EDECEA] hover:text-[#FFF3A6] text-sm transition-colors">Custom Cup</Link></li>
            <li><Link href="/gifts" className="text-[#EDECEA] hover:text-[#FFF3A6] text-sm transition-colors">Bộ quà tặng</Link></li>
          </ul>
        </div>
        
        {/* Customer Care & Policies */}
        <div>
          <h4 className="font-bold mb-6 text-[#FFFFFF] tracking-wide uppercase text-sm">Chăm sóc khách hàng</h4>
          <ul className="space-y-3">
            <li><Link href="/shipping" className="text-[#EDECEA] hover:text-[#FFF3A6] text-sm transition-colors">Chính sách giao hàng</Link></li>
            <li><Link href="/returns" className="text-[#EDECEA] hover:text-[#FFF3A6] text-sm transition-colors">Chính sách đổi trả & hoàn tiền</Link></li>
            <li><Link href="/privacy" className="text-[#EDECEA] hover:text-[#FFF3A6] text-sm transition-colors">Chính sách bảo mật</Link></li>
            <li><Link href="/terms" className="text-[#EDECEA] hover:text-[#FFF3A6] text-sm transition-colors">Điều khoản sử dụng</Link></li>
            <li><Link href="/cookies" className="text-[#EDECEA] hover:text-[#FFF3A6] text-sm transition-colors">Chính sách Cookie</Link></li>
            <li><Link href="/faq" className="text-[#EDECEA] hover:text-[#FFF3A6] text-sm transition-colors">Câu hỏi thường gặp</Link></li>
            <li><Link href="/contact" className="text-[#EDECEA] hover:text-[#FFF3A6] text-sm transition-colors">Liên hệ</Link></li>
          </ul>
        </div>
        
        {/* Social Connect */}
        <div>
          <h4 className="font-bold mb-6 text-[#FFFFFF] tracking-wide uppercase text-sm">Kết nối</h4>
          <ul className="space-y-3.5">
            <li><a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-[#EDECEA] hover:text-[#FFF3A6] text-sm transition-colors">Instagram</a></li>
            <li><a href="https://facebook.com" target="_blank" rel="noreferrer" className="text-[#EDECEA] hover:text-[#FFF3A6] text-sm transition-colors">Facebook</a></li>
            <li><a href="https://tiktok.com" target="_blank" rel="noreferrer" className="text-[#EDECEA] hover:text-[#FFF3A6] text-sm transition-colors">TikTok</a></li>
            <li><a href="mailto:support@cupfy.space" className="text-[#EDECEA] hover:text-[#FFF3A6] text-sm transition-colors">support@cupfy.space</a></li>
          </ul>
        </div>

      </div>
      
      {/* Bottom Legal Links & Copyright */}
      <div className="max-w-7xl mx-auto px-4 mt-14 pt-8 border-t border-[#4A2A25] flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-xs text-[#EDECEA]/80">© 2026 CUPFY. All rights reserved.</p>
        
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-[#EDECEA]/75">
          <Link href="/privacy" className="hover:text-[#FFF3A6] transition-colors">Bảo mật</Link>
          <span>•</span>
          <Link href="/terms" className="hover:text-[#FFF3A6] transition-colors">Điều khoản</Link>
          <span>•</span>
          <Link href="/cookies" className="hover:text-[#FFF3A6] transition-colors">Cookie</Link>
          <span>•</span>
          <Link href="/shipping" className="hover:text-[#FFF3A6] transition-colors">Giao hàng</Link>
          <span>•</span>
          <Link href="/returns" className="hover:text-[#FFF3A6] transition-colors">Đổi trả & Hoàn tiền</Link>
        </div>
      </div>
    </footer>
  );
}
