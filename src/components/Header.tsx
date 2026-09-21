'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, User as UserIcon, ShoppingCart, Menu, ChevronDown, Pause } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { useCartStore } from '@/store/useCartStore';

export default function Header() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const cart = useCartStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [lang, setLang] = useState('EN');

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

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 shadow-sm ${isScrolled ? "-translate-y-9" : ""}`}>
      {/* Utility Top Bar (Matches Stanley's black top bar but with a deep pink/brown tone for Cupfy) */}
      <div className="bg-[#2F201E] h-9 w-full text-white flex items-center px-6 text-xs font-medium tracking-wide">
        <div className="w-1/3 flex items-center">
          <button className="hover:text-gray-300"><Pause className="w-3 h-3 fill-current" /></button>
        </div>
        <div className="w-1/3 flex justify-center text-center">
          Welcome to Cupfy | Your cup, your story
        </div>
        <div className="w-1/3 flex justify-end items-center gap-6">
          <Link href="/club" className="hidden lg:block hover:text-gray-300">Join the Club</Link>
          <Link href="/login" className="hidden lg:block hover:text-gray-300">Sign In | Sign Up</Link>
          <Link href="/support" className="hidden lg:block hover:text-gray-300">Support</Link>
          <button 
            className="flex items-center gap-1 hover:text-gray-300 cursor-pointer"
            onClick={() => setLang(lang === 'EN' ? 'VN' : 'EN')}
          >
            {lang} <ChevronDown className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Main Header Navbar */}
      <div className="bg-white h-[76px] flex items-center justify-between px-6 border-b border-gray-100">
        
        {/* Mobile Menu Icon */}
        <div className="lg:hidden flex items-center">
          <Menu className="w-6 h-6 text-[#2F201E]" />
        </div>

        <div className="flex items-center gap-10 h-full">
          {/* Logo */}
          <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
            <span className="text-3xl font-extrabold tracking-tighter text-[#2F201E]" style={{ fontFamily: 'Nunito, Quicksand, sans-serif' }}>
              CUPFY<span className="text-xl ml-1 text-[#D9788F]">♡</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8 h-full">
            <Link href="/products" className={`text-[14px] font-bold uppercase tracking-wider transition-colors h-full flex items-center border-b-4 ${pathname.startsWith('/products') ? 'border-[#2F201E] text-[#2F201E]' : 'border-transparent text-[#2F201E] hover:border-gray-300'}`}>
              Shop
            </Link>
            <Link href="/trending" className="text-[14px] font-bold uppercase tracking-wider text-[#2F201E] hover:border-gray-300 border-b-4 border-transparent h-full flex items-center transition-colors">
              Trending
            </Link>
            <Link href="/custom-cup" className={`text-[14px] font-bold uppercase tracking-wider transition-colors h-full flex items-center border-b-4 ${pathname === '/custom-cup' ? 'border-[#2F201E] text-[#2F201E]' : 'border-transparent text-[#2F201E] hover:border-gray-300'}`}>
              Customize
            </Link>
            <Link href="/sale" className="text-[14px] font-bold uppercase tracking-wider text-[#D9788F] hover:border-[#D9788F] border-b-4 border-transparent h-full flex items-center transition-colors">
              Sale
            </Link>
          </nav>
        </div>

        {/* Right Section (Search & Icons) */}
        <div className="flex items-center gap-6">
          {/* Search Bar */}
          <div className="hidden lg:flex items-center relative w-[280px]">
            <Search className="w-4 h-4 absolute left-4 text-gray-500" strokeWidth={2} />
            <input 
              type="text" 
              placeholder="What are you looking for?" 
              className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:border-[#2F201E] focus:ring-1 focus:ring-[#2F201E] transition-all"
            />
          </div>

          <div className="flex items-center gap-5 text-[#2F201E]">
            {user ? (
              <div className="relative group">
                <Link href="/account" className="hover:text-[#D9788F] transition-colors flex items-center">
                  <UserIcon className="w-[22px] h-[22px]" strokeWidth={2} />
                </Link>
                <div className="absolute right-0 top-full mt-2 w-48 bg-white shadow-lg rounded-md overflow-hidden hidden group-hover:block border border-border">
                  <Link href="/account" className="block px-4 py-3 text-sm hover:bg-muted text-foreground">Tài khoản</Link>
                  <Link href="/orders" className="block px-4 py-3 text-sm hover:bg-muted text-foreground">Đơn hàng</Link>
                  {user.email?.toLowerCase().trim() === 'tranchitin2006@gmail.com' && (
                    <Link href="/admin" className="block px-4 py-3 text-sm hover:bg-muted font-medium text-[#d86a7a]">Quản trị Admin</Link>
                  )}
                  <button onClick={handleSignOut} className="w-full text-left px-4 py-3 text-sm hover:bg-muted font-medium text-red-600">Đăng xuất</button>
                </div>
              </div>
            ) : (
              <Link href="/login" className="hover:text-[#D9788F] transition-colors">
                <UserIcon className="w-[22px] h-[22px]" strokeWidth={2} />
              </Link>
            )}

            <Link href="/cart" className="relative hover:text-[#D9788F] transition-colors">
              <ShoppingCart className="w-[22px] h-[22px]" strokeWidth={2} />
              {cart.items.length >= 0 && (
                <span className="absolute -top-1.5 -right-2.5 w-[18px] h-[18px] bg-[#D9788F] text-white text-[10px] font-bold rounded-full flex items-center justify-center border border-white">
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
