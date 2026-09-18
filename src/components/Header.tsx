'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart, UserIcon, Search, Menu } from 'lucide-react';
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
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        {/* Mobile Menu Icon */}
        <div className="lg:hidden flex items-center">
          <Menu className="w-6 h-6 text-foreground" />
        </div>

        {/* Logo */}
        <Link href="/" className="text-3xl font-bold tracking-widest text-primary font-serif">
          CUPFY
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          <Link href="/products" className={`text-sm font-medium tracking-wide hover:text-primary transition-colors ${pathname.startsWith('/products') ? 'text-primary' : 'text-foreground'}`}>
            Shop
          </Link>
          <Link href="/products?collection=all" className="text-sm font-medium tracking-wide hover:text-primary transition-colors text-foreground">
            Collections
          </Link>
          <Link href="/custom-cup" className={`text-sm font-medium tracking-wide hover:text-primary transition-colors ${pathname === '/custom-cup' ? 'text-primary' : 'text-foreground'}`}>
            Custom Cup
          </Link>
          <Link href="/about" className="text-sm font-medium tracking-wide hover:text-primary transition-colors text-foreground">
            About
          </Link>
        </nav>

        {/* Right Icons */}
        <div className="flex items-center gap-6">
          <button className="text-foreground hover:text-primary transition-colors">
            <Search className="w-5 h-5" />
          </button>

          {user ? (
            <div className="relative group">
              <Link href="/account" className="text-foreground hover:text-primary transition-colors flex items-center">
                <UserIcon className="w-5 h-5" />
              </Link>
              <div className="absolute right-0 top-full mt-2 w-48 bg-white shadow-lg rounded-md overflow-hidden hidden group-hover:block border border-border">
                <Link href="/account" className="block px-4 py-3 text-sm hover:bg-muted text-foreground">Tài khoản</Link>
                <Link href="/orders" className="block px-4 py-3 text-sm hover:bg-muted text-foreground">Đơn hàng</Link>
                {user.email?.toLowerCase().trim() === 'tranchitin2006@gmail.com' && (
                  <Link href="/admin" className="block px-4 py-3 text-sm hover:bg-muted font-medium text-primary">Quản trị Admin</Link>
                )}
                <button onClick={handleSignOut} className="w-full text-left px-4 py-3 text-sm hover:bg-muted font-medium text-red-600">Đăng xuất</button>
              </div>
            </div>
          ) : (
            <Link href="/login" className="text-foreground hover:text-primary transition-colors">
              <UserIcon className="w-5 h-5" />
            </Link>
          )}

          <Link href="/cart" className="relative text-foreground hover:text-primary transition-colors">
            <ShoppingCart className="w-5 h-5" />
            {cart.items.length > 0 && (
              <span className="absolute -top-2 -right-2 w-4 h-4 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                {cart.items.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
