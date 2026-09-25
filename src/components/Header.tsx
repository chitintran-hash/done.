'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, User as UserIcon, ShoppingCart, Menu, Heart } from 'lucide-react';
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
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-[#DDD8D2] ${isScrolled ? "bg-white/95 backdrop-blur-md shadow-sm" : "bg-[#F7F6F2]"}`}>
      <div className="max-w-[1400px] mx-auto h-[80px] flex items-center justify-between px-6">
        
        {/* Mobile Menu Icon */}
        <div className="lg:hidden flex items-center">
          <Menu className="w-6 h-6 text-[#201817]" />
        </div>

        <div className="flex items-center gap-10 h-full">
          {/* Logo */}
          <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
            <span className="text-3xl font-extrabold tracking-tighter text-[#3A211E]">
              CUPFY<span className="text-xl ml-1 text-[#6B463D]">✨</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8 h-full">
            <Link href="/products" className={`text-[15px] font-bold transition-colors h-full flex items-center border-b-2 ${pathname.startsWith('/products') ? 'border-[#201817] text-[#201817]' : 'border-transparent text-[#6F625E] hover:text-[#201817]'}`}>{t('Shop' as any)}</Link>
            <Link href="/custom-cup" className="text-[15px] font-bold text-[#201817] bg-[#FFF3A6] px-5 py-2.5 rounded-full hover:bg-[#EDECEA] transition-colors flex items-center gap-2 shadow-sm border border-[#DDD8D2]">{t('Design Your Cup ✨' as any)}</Link>
            <Link href="/templates" className="text-[15px] font-bold transition-colors text-[#6F625E] hover:text-[#201817] h-full flex items-center border-b-2 border-transparent">{t('Templates' as any)}</Link>
            <Link href="/community" className="text-[15px] font-bold transition-colors text-[#6F625E] hover:text-[#201817] h-full flex items-center border-b-2 border-transparent">{t('Community' as any)}</Link>
            <Link href="/gifts" className="text-[15px] font-bold transition-colors text-[#6F625E] hover:text-[#201817] h-full flex items-center border-b-2 border-transparent">{t('Gifts' as any)}</Link>
            <Link href="/about" className="text-[15px] font-bold transition-colors text-[#6F625E] hover:text-[#201817] h-full flex items-center border-b-2 border-transparent">{t('About' as any)}</Link>
          </nav>
        </div>

        {/* Right Section (Search & Icons) */}
        <div className="flex items-center gap-6">
          <div className="hidden lg:flex items-center relative w-[240px]">
            <Search className="w-4 h-4 absolute left-4 text-[#6F625E]" strokeWidth={2} />
            <input 
              type="text" 
              placeholder={t('Search products, templates...')} 
              className="w-full pl-11 pr-4 py-2 bg-white border border-[#DDD8D2] rounded-full text-sm focus:outline-none focus:border-[#6B463D] focus:ring-1 focus:ring-[#6B463D] transition-all"
            />
          </div>

          <div className="flex items-center gap-5 text-[#201817]">
          {/* Language Toggle */}
          <div className="hidden md:flex bg-[#DDD8D2] rounded-full p-1 border border-[#DDD8D2]">
            <button 
              onClick={() => {
                setLanguage('vi');
                document.cookie = "NEXT_LOCALE=vi; path=/; max-age=31536000";
                window.location.reload();
              }}
              className={`text-[10px] font-bold px-3 py-1.5 rounded-full transition-all ${language === 'vi' ? 'bg-white text-[#201817] shadow-sm' : 'text-[#6F625E] hover:text-[#201817]'}`}
            >
              VI
            </button>
            <button 
              onClick={() => {
                setLanguage('en');
                document.cookie = "NEXT_LOCALE=en; path=/; max-age=31536000";
                window.location.reload();
              }}
              className={`text-[10px] font-bold px-3 py-1.5 rounded-full transition-all ${language === 'en' ? 'bg-white text-[#201817] shadow-sm' : 'text-[#6F625E] hover:text-[#201817]'}`}
            >
              EN
            </button>
          </div>
            {user ? (
              <div className="relative group">
                <Link href="/account" className="hover:text-[#6B463D] transition-colors flex items-center">
                  <UserIcon className="w-[22px] h-[22px]" strokeWidth={2} />
                </Link>
                <div className="absolute right-0 top-full pt-4 w-52 hidden group-hover:block z-50">
                  <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-[#DDD8D2]">
                  <Link href="/account" className="block px-4 py-3 text-sm hover:bg-[#EDECEA] text-[#201817] font-medium">{t('Profile' as any)}</Link>
                  <Link href="/orders" className="block px-4 py-3 text-sm hover:bg-[#EDECEA] text-[#201817] font-medium">Đơn hàng</Link>
                  <Link href="/wishlist" className="block px-4 py-3 text-sm hover:bg-[#EDECEA] text-[#201817] font-medium flex items-center justify-between">Wishlist <Heart className="w-3 h-3"/></Link>
                  {user.email?.toLowerCase().trim() === 'tranchitin2006@gmail.com' && (
                    <Link href="/admin" className="block px-4 py-3 text-sm hover:bg-[#EDECEA] font-bold text-[#6B463D]">Quản trị Admin</Link>
                  )}
                  <button onClick={handleSignOut} className="w-full text-left px-4 py-3 text-sm hover:bg-[#EDECEA] font-bold text-red-500 border-t border-[#DDD8D2]">{t('Logout' as any)}</button>
                  </div>
                </div>
              </div>
            ) : (
              <Link href="/login" className="hover:text-[#6B463D] transition-colors">
                <UserIcon className="w-[22px] h-[22px]" strokeWidth={2} />
              </Link>
            )}

            <Link href="/cart" className="relative hover:text-[#6B463D] transition-colors">
              <ShoppingCart className="w-[22px] h-[22px]" strokeWidth={2} />
              {cart.items.length >= 0 && (
                <span className="absolute -top-1.5 -right-2.5 w-[18px] h-[18px] bg-[#4A2A25] text-white text-[10px] font-bold rounded-full flex items-center justify-center border border-[#F7F6F2]">
                  {cart.items.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
