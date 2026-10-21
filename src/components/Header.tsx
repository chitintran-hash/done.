'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Search, User as UserIcon, ShoppingCart, Menu, Heart, X, Package } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { useCartStore } from '@/store/useCartStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { translations, TranslationKey } from '@/lib/i18n/translations';

export default function Header() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const cart = useCartStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, setLanguage } = useLanguageStore();
  const t = (key: TranslationKey) => translations[language][key] !== undefined ? translations[language][key] : key;

  useEffect(() => {
    const supabase = createClient();
    
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      subscription.unsubscribe();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
  };

  if (pathname === '/custom-cup' || pathname.startsWith('/admin')) return null;

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-[#E8DFD8] ${isScrolled ? "bg-white/95 backdrop-blur-md shadow-sm" : "bg-white"}`}>
      <div className="max-w-[1400px] mx-auto h-[80px] flex items-center justify-between px-6">
        
        {/* Mobile Menu Icon */}
        <div className="lg:hidden flex items-center">
          <button 
            onClick={() => setMobileMenuOpen(prev => !prev)}
            className="p-2 -ml-2 text-[#3A211E] hover:text-[#765B52] transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        <div className="flex items-center gap-10 h-full">
          {/* Logo Wordmark dạng chữ cupfy màu đen kèm chấm cam */}
          <Link href="/" className="flex items-center hover:opacity-85 transition-opacity py-1.5 group">
            <div className="relative h-8 w-[105px] sm:h-9 sm:w-[120px]">
              <Image 
                src="/images/cupfy-wordmark@2x.png" 
                alt="Cupfy Logo" 
                fill
                className="object-contain object-left"
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8 h-full">
            <Link 
              href="/products" 
              className={`text-[15px] font-extrabold uppercase tracking-wider transition-colors h-full flex items-center border-b-2 ${pathname.startsWith('/products') ? 'border-[#3A211E] text-[#3A211E]' : 'border-transparent text-[#765B52] hover:text-[#3A211E]'}`}
            >
              {t('Shop' as any)}
            </Link>
            
            {/* Nút Thiết Kế Ly: Nền vàng #FFBF00, chữ nâu #3A211E */}
            <Link 
              href="/custom-cup" 
              className="text-[15px] font-extrabold uppercase tracking-wider text-[#3A211E] bg-[#FFBF00] px-5 py-2.5 rounded-full hover:bg-[#FFD147] hover:shadow-md transition-all duration-200 border border-[#E8DFD8] shadow-sm flex items-center"
            >
              {t('Design Your Cup' as any)}
            </Link>

            {/* Mẫu có sẵn */}
            <Link 
              href="/templates" 
              className={`text-[15px] font-extrabold uppercase tracking-wider transition-colors h-full flex items-center border-b-2 ${pathname.startsWith('/templates') ? 'border-[#3A211E] text-[#3A211E]' : 'border-transparent text-[#765B52] hover:text-[#3A211E]'}`}
            >
              {t('Templates' as any)}
            </Link>

            <Link 
              href="/community" 
              className={`text-[15px] font-extrabold uppercase tracking-wider transition-colors h-full flex items-center border-b-2 ${pathname.startsWith('/community') ? 'border-[#3A211E] text-[#3A211E]' : 'border-transparent text-[#765B52] hover:text-[#3A211E]'}`}
            >
              {t('Community' as any)}
            </Link>
            <Link 
              href="/gifts" 
              className={`text-[15px] font-extrabold uppercase tracking-wider transition-colors h-full flex items-center border-b-2 ${pathname.startsWith('/gifts') ? 'border-[#3A211E] text-[#3A211E]' : 'border-transparent text-[#765B52] hover:text-[#3A211E]'}`}
            >
              {t('Gifts' as any)}
            </Link>
            <Link 
              href="/about" 
              className={`text-[15px] font-extrabold uppercase tracking-wider transition-colors h-full flex items-center border-b-2 ${pathname.startsWith('/about') ? 'border-[#3A211E] text-[#3A211E]' : 'border-transparent text-[#765B52] hover:text-[#3A211E]'}`}
            >
              {t('About' as any)}
            </Link>
          </nav>
        </div>

        {/* Right Section (Search & Icons) */}
        <div className="flex items-center gap-6">
          <div className="hidden lg:flex items-center relative w-[240px]">
            <Search className="w-4 h-4 absolute left-4 text-[#765B52]" strokeWidth={2} />
            <input 
              type="text" 
              placeholder={t('Search products, templates...')} 
              className="w-full pl-11 pr-4 py-2 bg-[#FFF9E8] border border-[#E8DFD8] rounded-full text-sm text-[#3A211E] placeholder:text-[#765B52]/70 focus:outline-none focus:border-[#FFBF00] focus:ring-1 focus:ring-[#FFBF00] transition-all"
            />
          </div>

          <div className="flex items-center gap-5 text-[#3A211E]">
            {/* Language Toggle */}
            <div className="hidden md:flex bg-[#FFF9E8] rounded-full p-1 border border-[#E8DFD8]">
              <button 
                onClick={() => {
                  setLanguage('vi');
                  document.cookie = "NEXT_LOCALE=vi; path=/; max-age=31536000";
                  window.location.reload();
                }}
                className={`text-[10px] font-bold px-3 py-1.5 rounded-full transition-all ${language === 'vi' ? 'bg-[#FFBF00] text-[#3A211E] shadow-sm' : 'text-[#765B52] hover:text-[#3A211E]'}`}
              >
                VI
              </button>
              <button 
                onClick={() => {
                  setLanguage('en');
                  document.cookie = "NEXT_LOCALE=en; path=/; max-age=31536000";
                  window.location.reload();
                }}
                className={`text-[10px] font-bold px-3 py-1.5 rounded-full transition-all ${language === 'en' ? 'bg-[#FFBF00] text-[#3A211E] shadow-sm' : 'text-[#765B52] hover:text-[#3A211E]'}`}
              >
                EN
              </button>
            </div>

            {/* Profile Dropdown */}
            {user ? (
              <div className="relative group">
                <Link href="/account" className="hover:text-[#765B52] transition-colors flex items-center p-1">
                  <UserIcon className="w-[22px] h-[22px]" strokeWidth={2} />
                </Link>
                <div className="absolute right-0 top-full pt-4 w-56 hidden group-hover:block z-50">
                  <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-[#E8DFD8]">
                    <Link href="/account" className="block px-4 py-3 text-sm hover:bg-[#FFF9E8] text-[#3A211E] font-medium border-b border-[#E8DFD8]">
                      {t('Profile' as any)}
                    </Link>
                    <Link href="/orders" className="flex items-center justify-between px-4 py-3 text-sm hover:bg-[#FFF9E8] text-[#3A211E] font-medium">
                      <span>{t('My Orders' as any)}</span>
                      <Package className="w-4 h-4 text-[#765B52]" />
                    </Link>
                    <Link href="/wishlist" className="flex items-center justify-between px-4 py-3 text-sm hover:bg-[#FFF9E8] text-[#3A211E] font-medium">
                      <span>{t('Wishlist' as any)}</span>
                      <Heart className="w-3.5 h-3.5 text-[#765B52]" />
                    </Link>
                    {user.email?.toLowerCase().trim() === 'tranchitin2006@gmail.com' && (
                      <Link href="/admin" className="block px-4 py-3 text-sm hover:bg-[#FFF3C4] font-bold text-[#3A211E] border-t border-[#E8DFD8]">
                        {t('Admin Dashboard' as any)}
                      </Link>
                    )}
                    <button 
                      onClick={handleSignOut} 
                      className="w-full text-left px-4 py-3 text-sm hover:bg-red-50 font-bold text-red-600 border-t border-[#E8DFD8]"
                    >
                      {t('Logout' as any)}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link href="/login" className="hover:text-[#765B52] transition-colors p-1" title={t('Login' as any)}>
                <UserIcon className="w-[22px] h-[22px]" strokeWidth={2} />
              </Link>
            )}

            {/* Cart Icon */}
            <Link href="/cart" className="relative hover:text-[#765B52] transition-colors p-1" title={t('Cart' as any)}>
              <ShoppingCart className="w-[22px] h-[22px]" strokeWidth={2} />
              {cart.items.length >= 0 && (
                <span className="absolute -top-1 -right-1.5 w-[18px] h-[18px] bg-[#3A211E] text-white text-[10px] font-bold rounded-full flex items-center justify-center border border-white">
                  {cart.items.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-[#E8DFD8] px-6 py-6 shadow-lg animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col gap-4">
            <Link 
              href="/products" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-extrabold uppercase tracking-wider text-[#3A211E] py-2 border-b border-[#E8DFD8]"
            >
              {t('Shop' as any)}
            </Link>
            <Link 
              href="/custom-cup" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-extrabold uppercase tracking-wider text-[#3A211E] bg-[#FFBF00] px-4 py-3 rounded-xl flex items-center justify-between"
            >
              <span>{t('Design Your Cup' as any)}</span>
              <span>→</span>
            </Link>
            <Link 
              href="/templates" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-extrabold uppercase tracking-wider text-[#3A211E] py-2 border-b border-[#E8DFD8]"
            >
              {t('Templates' as any)}
            </Link>
            <Link 
              href="/community" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-extrabold uppercase tracking-wider text-[#3A211E] py-2 border-b border-[#E8DFD8]"
            >
              {t('Community' as any)}
            </Link>
            <Link 
              href="/gifts" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-extrabold uppercase tracking-wider text-[#3A211E] py-2 border-b border-[#E8DFD8]"
            >
              {t('Gifts' as any)}
            </Link>
            <Link 
              href="/about" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-extrabold uppercase tracking-wider text-[#3A211E] py-2 border-b border-[#E8DFD8]"
            >
              {t('About' as any)}
            </Link>
            <Link 
              href="/orders" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-extrabold uppercase tracking-wider text-[#3A211E] py-2 flex items-center gap-2"
            >
              <Package className="w-4 h-4 text-[#765B52]" /> {t('My Orders' as any)}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
