'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Search, User as UserIcon, ShoppingCart, Menu, Heart, X, Package, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useEffect, useState, useRef } from 'react';
import { User } from '@supabase/supabase-js';
import { useCartStore } from '@/store/useCartStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { translations, TranslationKey } from '@/lib/i18n/translations';
import { matchesSearchQuery } from '@/lib/utils/search';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const cart = useCartStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, setLanguage } = useLanguageStore();
  const t = (key: TranslationKey) => translations[language][key] !== undefined ? translations[language][key] : key;

  // Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);

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

  // Click outside to close search dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced live search
  useEffect(() => {
    const trimmed = searchQuery.trim();
    if (!trimmed || trimmed.length < 2) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from('products')
          .select('id, name, price, image_url, category, technical_specs')
          .eq('is_available', true)
          .neq('category', 'user_custom')
          .not('category', 'like', 'admin_%')
          .limit(30);

        if (data) {
          const matches = data.filter((p) => {
            const haystack = `${p.name || ''} ${p.technical_specs?.capacity || ''} ${p.technical_specs?.vibe || ''} ${p.category || ''}`;
            return matchesSearchQuery(haystack, trimmed);
          });
          setSearchResults(matches.slice(0, 5));
          setShowDropdown(true);
        }
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 220);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;
    setShowDropdown(false);
    setMobileMenuOpen(false);
    router.push(`/products?q=${encodeURIComponent(query)}`);
  };

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
  };

  if (pathname === '/custom-cup' || pathname.startsWith('/admin')) return null;

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-[#E8DFD8] ${isScrolled ? "bg-white/95 backdrop-blur-md shadow-sm" : "bg-white"}`}>
      <div className="max-w-[1440px] mx-auto h-[80px] flex items-center justify-between px-4 sm:px-6 gap-3 xl:gap-6">
        
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

        {/* Left Side: Logo + Nav Items (strictly no wrapping) */}
        <div className="flex items-center gap-3 xl:gap-6 2xl:gap-8 h-full shrink min-w-0">
          {/* Logo Cupfy mới: Ly cười vàng tươi đặc trưng */}
          <Link href="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity py-1 shrink-0 group">
            <div className="relative h-10 w-10 sm:h-11 sm:w-11 md:h-12 md:w-12 rounded-2xl overflow-hidden shadow-xs border border-amber-300/70 shrink-0 bg-[#FFBF00]">
              <Image 
                src="/images/cupfy-logo.png" 
                alt="Cupfy Logo" 
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation - whitespace-nowrap prevents line wrapping on any screen */}
          <nav className="hidden lg:flex items-center gap-2 xl:gap-5 2xl:gap-6 h-full whitespace-nowrap shrink-0">
            <Link 
              href="/products" 
              className={`text-xs xl:text-[13.5px] 2xl:text-[14px] font-extrabold uppercase tracking-tight xl:tracking-wider whitespace-nowrap transition-colors h-full flex items-center border-b-2 ${pathname.startsWith('/products') ? 'border-[#3A211E] text-[#3A211E]' : 'border-transparent text-[#765B52] hover:text-[#3A211E]'}`}
            >
              {t('Shop' as any)}
            </Link>
            
            {/* Nút Thiết Kế Ly: Nền vàng #FFBF00, chữ nâu #3A211E */}
            <Link 
              href="/custom-cup" 
              className="text-xs xl:text-[13.5px] 2xl:text-[14px] font-extrabold uppercase tracking-tight xl:tracking-wider whitespace-nowrap text-[#3A211E] bg-[#FFBF00] px-3.5 py-2 xl:px-5 xl:py-2.5 rounded-full hover:bg-[#FFD147] hover:shadow-md transition-all duration-200 border border-[#E8DFD8] shadow-xs flex items-center shrink-0"
            >
              {t('Design Your Cup' as any)}
            </Link>

            {/* Mẫu có sẵn */}
            <Link 
              href="/templates" 
              className={`text-xs xl:text-[13.5px] 2xl:text-[14px] font-extrabold uppercase tracking-tight xl:tracking-wider whitespace-nowrap transition-colors h-full flex items-center border-b-2 ${pathname.startsWith('/templates') ? 'border-[#3A211E] text-[#3A211E]' : 'border-transparent text-[#765B52] hover:text-[#3A211E]'}`}
            >
              {t('Templates' as any)}
            </Link>

            <Link 
              href="/community" 
              className={`text-xs xl:text-[13.5px] 2xl:text-[14px] font-extrabold uppercase tracking-tight xl:tracking-wider whitespace-nowrap transition-colors h-full flex items-center border-b-2 ${pathname.startsWith('/community') ? 'border-[#3A211E] text-[#3A211E]' : 'border-transparent text-[#765B52] hover:text-[#3A211E]'}`}
            >
              {t('Community' as any)}
            </Link>
            <Link 
              href="/gifts" 
              className={`text-xs xl:text-[13.5px] 2xl:text-[14px] font-extrabold uppercase tracking-tight xl:tracking-wider whitespace-nowrap transition-colors h-full flex items-center border-b-2 ${pathname.startsWith('/gifts') ? 'border-[#3A211E] text-[#3A211E]' : 'border-transparent text-[#765B52] hover:text-[#3A211E]'}`}
            >
              {t('Gifts' as any)}
            </Link>
            <Link 
              href="/about" 
              className={`text-xs xl:text-[13.5px] 2xl:text-[14px] font-extrabold uppercase tracking-tight xl:tracking-wider whitespace-nowrap transition-colors h-full flex items-center border-b-2 ${pathname.startsWith('/about') ? 'border-[#3A211E] text-[#3A211E]' : 'border-transparent text-[#765B52] hover:text-[#3A211E]'}`}
            >
              {t('About' as any)}
            </Link>
          </nav>
        </div>

        {/* Right Section (Search & Icons) */}
        <div className="flex items-center gap-3 xl:gap-5 shrink-0">
          {/* Search Bar Form with live dropdown */}
          <div ref={searchRef} className="hidden lg:block relative w-[170px] xl:w-[210px] 2xl:w-[230px]">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <button
                type="submit"
                aria-label="Tìm kiếm"
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#765B52] hover:text-[#3A211E] transition-colors cursor-pointer"
              >
                <Search className="w-4 h-4" strokeWidth={2.2} />
              </button>
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => { if (searchResults.length > 0) setShowDropdown(true); }}
                placeholder={t('Search products, templates...')} 
                className="w-full pl-10 pr-8 py-2 bg-[#FFF9E8] border border-[#E8DFD8] rounded-full text-xs xl:text-sm text-[#3A211E] placeholder:text-[#765B52]/70 focus:outline-none focus:border-[#FFBF00] focus:ring-2 focus:ring-[#FFBF00]/30 transition-all font-medium"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => { setSearchQuery(''); setSearchResults([]); setShowDropdown(false); }}
                  aria-label="Xóa từ khóa"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#765B52] hover:text-[#3A211E] p-0.5 rounded-full hover:bg-black/5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </form>

            {/* Live Search Popup Dropdown */}
            {showDropdown && (
              <div className="absolute right-0 top-full mt-2 w-[320px] sm:w-[360px] bg-white rounded-2xl shadow-[0_12px_40px_rgba(58,33,30,0.14)] border border-[#E8DFD8] overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="p-2.5 border-b border-[#E8DFD8] bg-[#FFF9E8]/80 flex items-center justify-between text-xs font-bold text-[#765B52]">
                  <span>Gợi ý tìm kiếm ({searchResults.length})</span>
                  {isSearching && (
                    <span className="flex items-center gap-1 text-[#FFBF00]">
                      <Loader2 className="w-3 h-3 animate-spin" /> Đang tìm...
                    </span>
                  )}
                </div>
                
                {searchResults.length > 0 ? (
                  <div className="max-h-[340px] overflow-y-auto divide-y divide-[#E8DFD8]/50">
                    {searchResults.map((item) => (
                      <Link
                        key={item.id}
                        href={item.category === 'template' ? `/custom-cup?template=${item.id}` : `/products/${item.id}`}
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-3 p-3 hover:bg-[#FFF9E8] transition-colors group"
                      >
                        <div className="w-12 h-12 rounded-xl bg-[#FAF7F2] border border-[#E8DFD8] overflow-hidden relative shrink-0 flex items-center justify-center">
                          {item.image_url ? (
                            <Image
                              src={item.image_url}
                              alt={item.name}
                              fill
                              className="object-contain p-1 group-hover:scale-105 transition-transform"
                              sizes="48px"
                            />
                          ) : item.technical_specs?.icon ? (
                            <span className="text-2xl">{item.technical_specs.icon}</span>
                          ) : (
                            <span className="text-xs text-[#765B52]">Cupfy</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                          <h4 className="text-xs sm:text-sm font-bold text-[#3A211E] truncate group-hover:text-[#FFBF00] transition-colors">
                            {item.name}
                          </h4>
                          <p className="text-[11px] text-[#765B52]">
                            {item.technical_specs?.capacity || (item.category === 'template' ? item.technical_specs?.vibe : '') || 'Ly Cupfy'}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-xs font-black text-[#3A211E]">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price || 0)}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  !isSearching && (
                    <div className="p-6 text-center text-xs text-[#765B52]">
                      Không tìm thấy sản phẩm nào khớp với &quot;{searchQuery}&quot;
                    </div>
                  )
                )}

                {searchQuery.trim() && (
                  <button
                    type="button"
                    onClick={handleSearchSubmit}
                    className="w-full p-2.5 bg-[#FFF9E8] hover:bg-[#FFBF00] text-[#3A211E] text-xs font-bold text-center border-t border-[#E8DFD8] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Xem tất cả kết quả cho &quot;{searchQuery}&quot;</span>
                    <Search className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 sm:gap-4 text-[#3A211E]">
            {/* Language Toggle */}
            <div className="hidden md:flex bg-[#FFF9E8] rounded-full p-1 border border-[#E8DFD8] shrink-0">
              <button 
                onClick={() => {
                  setLanguage('vi');
                  document.cookie = "NEXT_LOCALE=vi; path=/; max-age=31536000";
                  window.location.reload();
                }}
                className={`text-[10px] font-bold px-3 py-1.5 rounded-full transition-all cursor-pointer ${language === 'vi' ? 'bg-[#FFBF00] text-[#3A211E] shadow-sm' : 'text-[#765B52] hover:text-[#3A211E]'}`}
              >
                VI
              </button>
              <button 
                onClick={() => {
                  setLanguage('en');
                  document.cookie = "NEXT_LOCALE=en; path=/; max-age=31536000";
                  window.location.reload();
                }}
                className={`text-[10px] font-bold px-3 py-1.5 rounded-full transition-all cursor-pointer ${language === 'en' ? 'bg-[#FFBF00] text-[#3A211E] shadow-sm' : 'text-[#765B52] hover:text-[#3A211E]'}`}
              >
                EN
              </button>
            </div>

            {/* Profile Dropdown */}
            {user ? (
              <div className="relative group shrink-0">
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
                      className="w-full text-left px-4 py-3 text-sm hover:bg-red-50 font-bold text-red-600 border-t border-[#E8DFD8] cursor-pointer"
                    >
                      {t('Logout' as any)}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link href="/login" className="hover:text-[#765B52] transition-colors p-1 shrink-0" title={t('Login' as any)}>
                <UserIcon className="w-[22px] h-[22px]" strokeWidth={2} />
              </Link>
            )}

            {/* Cart Icon */}
            <Link href="/cart" className="relative hover:text-[#765B52] transition-colors p-1 shrink-0" title={t('Cart' as any)}>
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
          {/* Mobile Search Input */}
          <div ref={mobileSearchRef} className="mb-5">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <Search className="w-4 h-4 text-[#765B52] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('Search products, templates...')}
                className="w-full pl-10 pr-8 py-2.5 rounded-full border border-[#E8DFD8] bg-[#FFF9E8] text-sm text-[#3A211E] placeholder:text-[#765B52]/70 focus:outline-none focus:border-[#FFBF00]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#765B52]"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </form>
          </div>

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
