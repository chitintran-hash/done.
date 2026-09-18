'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, User as UserIcon, ShoppingCart, Menu } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { useCartStore } from '@/store/useCartStore';

export default function Header() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const cart = useCartStore();

  useEffect(() => {
    const supabase = createClient();
    
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
  };

  return (
    <header className="absolute top-0 left-0 right-0 z-50 bg-transparent">
      <div className="max-w-[1400px] mx-auto px-6 h-24 flex items-center justify-between">
        {/* Mobile Menu Icon */}
        <div className="lg:hidden flex items-center">
          <Menu className="w-6 h-6 text-[#5c4a43]" />
        </div>

        {/* Logo */}
        <Link href="/" className="flex flex-col items-start hover:opacity-80 transition-opacity">
          <div className="flex items-center gap-1 text-[#d86a7a]">
            <span className="text-4xl font-extrabold tracking-tighter" style={{ fontFamily: 'Nunito, Quicksand, sans-serif' }}>cupfy</span>
            <span className="text-2xl mt-1">♡</span>
          </div>
          <span className="text-[#d86a7a] text-[13px] font-medium tracking-wide mt-[-4px]">
            Your cup, your story
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-10">
          <Link href="/" className={`text-[15px] font-medium tracking-wide hover:text-[#d86a7a] transition-colors ${pathname === '/' ? 'text-[#d86a7a]' : 'text-[#5c4a43]'}`}>
            Home
          </Link>
          <Link href="/products" className={`text-[15px] font-medium tracking-wide hover:text-[#d86a7a] transition-colors ${pathname.startsWith('/products') ? 'text-[#d86a7a]' : 'text-[#5c4a43]'}`}>
            Shop
          </Link>
          <Link href="/products?collection=all" className="text-[15px] font-medium tracking-wide hover:text-[#d86a7a] transition-colors text-[#5c4a43]">
            Collections
          </Link>
          <Link href="/custom-cup" className={`text-[15px] font-medium tracking-wide hover:text-[#d86a7a] transition-colors ${pathname === '/custom-cup' ? 'text-[#d86a7a]' : 'text-[#5c4a43]'}`}>
            Custom Cup
          </Link>
          <Link href="/about" className="text-[15px] font-medium tracking-wide hover:text-[#d86a7a] transition-colors text-[#5c4a43]">
            About
          </Link>
        </nav>

        {/* Right Icons */}
        <div className="flex items-center gap-6 text-[#5c4a43]">
          <button className="hover:text-[#d86a7a] transition-colors">
            <Search className="w-[22px] h-[22px]" strokeWidth={1.5} />
          </button>

          {user ? (
            <div className="relative group">
              <Link href="/account" className="hover:text-[#d86a7a] transition-colors flex items-center">
                <UserIcon className="w-[22px] h-[22px]" strokeWidth={1.5} />
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
            <Link href="/login" className="hover:text-[#d86a7a] transition-colors">
              <UserIcon className="w-[22px] h-[22px]" strokeWidth={1.5} />
            </Link>
          )}

          <Link href="/cart" className="relative hover:text-[#d86a7a] transition-colors">
            <ShoppingCart className="w-[22px] h-[22px]" strokeWidth={1.5} />
            {cart.items.length >= 0 && (
              <span className="absolute -top-1.5 -right-2.5 w-4 h-4 bg-[#d86a7a] text-white text-[10px] font-bold rounded-full flex items-center justify-center border border-white">
                {cart.items.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
