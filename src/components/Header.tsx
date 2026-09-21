'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, User as UserIcon, ShoppingCart, Menu, Heart } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { useCartStore } from '@/store/useCartStore';

export default function Header() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const cart = useCartStore();
  const [isScrolled, setIsScrolled] = useState(false);

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
  if (pathname === '/custom-cup') return null;


  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-[#EAE7DE] ${isScrolled ? "bg-white/95 backdrop-blur-md shadow-sm" : "bg-[#FFF9E8]"}`}>
      <div className="max-w-[1400px] mx-auto h-[80px] flex items-center justify-between px-6">
        
        {/* Mobile Menu Icon */}
        <div className="lg:hidden flex items-center">
          <Menu className="w-6 h-6 text-[#181818]" />
        </div>

        <div className="flex items-center gap-10 h-full">
          {/* Logo */}
          <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
            <span className="text-3xl font-extrabold tracking-tighter text-[#181818]">
              CUPFY<span className="text-xl ml-1 text-[#FFB15C]">✨</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8 h-full">
            <Link href="/products" className={`text-[15px] font-bold transition-colors h-full flex items-center border-b-2 ${pathname.startsWith('/products') ? 'border-[#181818] text-[#181818]' : 'border-transparent text-[#333333] hover:text-[#181818]'}`}>
              Shop
            </Link>
            <Link href="/custom-cup" className="text-[15px] font-bold text-[#000000] bg-[#FFEDA8] px-5 py-2.5 rounded-full hover:bg-[#F4D35E] transition-colors flex items-center gap-2 shadow-sm border border-[#EAE7DE]">
              Design Your Cup ✨
            </Link>
            <Link href="/templates" className="text-[15px] font-bold transition-colors text-[#333333] hover:text-[#181818] h-full flex items-center border-b-2 border-transparent">
              Templates
            </Link>
            <Link href="/community" className="text-[15px] font-bold transition-colors text-[#333333] hover:text-[#181818] h-full flex items-center border-b-2 border-transparent">
              Community
            </Link>
            <Link href="/gifts" className="text-[15px] font-bold transition-colors text-[#333333] hover:text-[#181818] h-full flex items-center border-b-2 border-transparent">
              Gifts
            </Link>
            <Link href="/about" className="text-[15px] font-bold transition-colors text-[#333333] hover:text-[#181818] h-full flex items-center border-b-2 border-transparent">
              About
            </Link>
          </nav>
        </div>

        {/* Right Section (Search & Icons) */}
        <div className="flex items-center gap-6">
          <div className="hidden lg:flex items-center relative w-[240px]">
            <Search className="w-4 h-4 absolute left-4 text-[#333333]" strokeWidth={2} />
            <input 
              type="text" 
              placeholder="Tìm sản phẩm, mẫu..." 
              className="w-full pl-11 pr-4 py-2 bg-white border border-[#EAE7DE] rounded-full text-sm focus:outline-none focus:border-[#FFB15C] focus:ring-1 focus:ring-[#FFB15C] transition-all"
            />
          </div>

          <div className="flex items-center gap-5 text-[#181818]">
            {user ? (
              <div className="relative group">
                <Link href="/account" className="hover:text-[#FFB15C] transition-colors flex items-center">
                  <UserIcon className="w-[22px] h-[22px]" strokeWidth={2} />
                </Link>
                <div className="absolute right-0 top-full mt-2 w-48 bg-white shadow-lg rounded-xl overflow-hidden hidden group-hover:block border border-[#EAE7DE]">
                  <Link href="/account" className="block px-4 py-3 text-sm hover:bg-[#F7F7F5] text-[#181818] font-medium">Account & Designs</Link>
                  <Link href="/orders" className="block px-4 py-3 text-sm hover:bg-[#F7F7F5] text-[#181818] font-medium">Đơn hàng</Link>
                  <Link href="/wishlist" className="block px-4 py-3 text-sm hover:bg-[#F7F7F5] text-[#181818] font-medium flex items-center justify-between">Wishlist <Heart className="w-3 h-3"/></Link>
                  {user.email?.toLowerCase().trim() === 'tranchitin2006@gmail.com' && (
                    <Link href="/admin" className="block px-4 py-3 text-sm hover:bg-[#F7F7F5] font-bold text-[#FFB15C]">Quản trị Admin</Link>
                  )}
                  <button onClick={handleSignOut} className="w-full text-left px-4 py-3 text-sm hover:bg-[#F7F7F5] font-bold text-red-500 border-t border-[#EAE7DE]">Đăng xuất</button>
                </div>
              </div>
            ) : (
              <Link href="/login" className="hover:text-[#FFB15C] transition-colors">
                <UserIcon className="w-[22px] h-[22px]" strokeWidth={2} />
              </Link>
            )}

            <Link href="/cart" className="relative hover:text-[#FFB15C] transition-colors">
              <ShoppingCart className="w-[22px] h-[22px]" strokeWidth={2} />
              {cart.items.length >= 0 && (
                <span className="absolute -top-1.5 -right-2.5 w-[18px] h-[18px] bg-[#000000] text-white text-[10px] font-bold rounded-full flex items-center justify-center border border-[#FFF9E8]">
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
