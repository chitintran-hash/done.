"use client";

import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { Globe, ShoppingCart, Search, User as UserIcon, Heart, Gift } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const { t, language, setLanguage } = useLanguage();
  const cart = useCartStore();
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
  };

  return (
    <header className="fixed top-0 left-0 right-0 border-b border-border bg-white z-50">
      {/* Top Row */}
      <div className="flex items-center justify-between px-6 lg:px-12 h-20">
        {/* Logo */}
        <Link href="/" className="font-bold text-3xl tracking-tighter text-primary">
          DONE.<span className="text-sm font-medium tracking-normal text-foreground opacity-70 ml-1">Gifting</span>
        </Link>

        {/* Search Bar */}
        <div className="hidden lg:flex flex-1 max-w-2xl mx-8 relative">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-muted-foreground" />
          </div>
          <input 
            type="text" 
            placeholder="Tìm quà tặng cho người ấy, dịp đặc biệt, hoặc theo sở thích..."
            className="w-full h-12 pl-12 pr-4 rounded-full border border-border bg-muted/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
          />
        </div>

        {/* Icons */}
        <div className="flex items-center gap-6">
          {user ? (
            <div className="group relative">
              <button className="flex flex-col items-center gap-1 text-primary hover:text-primary/80 transition-colors">
                {user.user_metadata?.avatar_url ? (
                  <img src={user.user_metadata.avatar_url} alt="Avatar" className="w-6 h-6 rounded-full object-cover" />
                ) : (
                  <UserIcon className="w-6 h-6" />
                )}
                <span className="text-[10px] font-bold uppercase tracking-wider">Tài khoản</span>
              </button>
              <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-border rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all flex flex-col overflow-hidden">
                 <Link href="/orders" className="px-4 py-3 text-sm hover:bg-muted font-medium">Đơn hàng của tôi</Link>
                 {user.user_metadata?.role === 'seller' && <Link href="/seller" className="px-4 py-3 text-sm hover:bg-muted font-medium text-orange-600">Quản lý cửa hàng</Link>}
                 {user.email?.toLowerCase().trim() === 'tranchitin2006@gmail.com' && <Link href="/admin" className="px-4 py-3 text-sm hover:bg-muted font-medium text-accent">Quản trị Admin</Link>}
                 <button onClick={handleSignOut} className="px-4 py-3 text-sm hover:bg-muted font-medium text-red-600 text-left">Đăng xuất</button>
              </div>
            </div>
          ) : (
            <Link href="/login" className="flex flex-col items-center gap-1 text-primary hover:text-primary/80 transition-colors">
              <UserIcon className="w-6 h-6" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Đăng nhập</span>
            </Link>
          )}

          <Link href="/favorites" className="flex flex-col items-center gap-1 text-primary hover:text-primary/80 transition-colors">
            <Heart className="w-6 h-6" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Yêu thích</span>
          </Link>

          <Link href="/gift-finder" className="flex flex-col items-center gap-1 text-primary hover:text-primary/80 transition-colors">
            <Gift className="w-6 h-6" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Tìm quà</span>
          </Link>

          <Link href="/cart" className="relative flex flex-col items-center gap-1 text-primary hover:text-primary/80 transition-colors">
            <ShoppingCart className="w-6 h-6" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Giỏ quà</span>
            {cart.items.length > 0 && (
              <span className="absolute -top-1 -right-2 w-5 h-5 bg-accent text-accent-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                {cart.items.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Bottom Nav Row */}
      <nav className="hidden lg:flex items-center justify-center gap-8 h-12 border-t border-border relative">
        <div 
          className="h-full flex items-center"
          onMouseEnter={() => setIsMegaMenuOpen(true)}
          onMouseLeave={() => setIsMegaMenuOpen(false)}
        >
          <Link href="/products" className="text-sm font-bold tracking-wide uppercase hover:text-primary transition-colors h-full flex items-center border-b-2 border-transparent hover:border-primary">
            Quà Tặng
          </Link>

          {/* Mega Menu Overlay */}
          {isMegaMenuOpen && (
            <div className="absolute top-full left-0 right-0 bg-white border-b border-border shadow-[0_10px_30px_rgba(0,0,0,0.05)] p-10 grid grid-cols-4 gap-8 z-50">
              <div>
                <h3 className="font-bold text-primary mb-4 uppercase tracking-wider text-sm">Theo Người Nhận</h3>
                <ul className="space-y-3">
                  <li><Link href="/products?recipient=ban-gai" className="text-sm text-muted-foreground hover:text-primary">Cho Bạn Gái / Vợ</Link></li>
                  <li><Link href="/products?recipient=ban-trai" className="text-sm text-muted-foreground hover:text-primary">Cho Bạn Trai / Chồng</Link></li>
                  <li><Link href="/products?recipient=ban-than" className="text-sm text-muted-foreground hover:text-primary">Cho Bạn Thân</Link></li>
                  <li><Link href="/products?recipient=me" className="text-sm text-muted-foreground hover:text-primary">Cho Mẹ</Link></li>
                  <li><Link href="/products?recipient=bo" className="text-sm text-muted-foreground hover:text-primary">Cho Bố</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-primary mb-4 uppercase tracking-wider text-sm">Theo Dịp</h3>
                <ul className="space-y-3">
                  <li><Link href="/products?occasion=sinh-nhat" className="text-sm text-muted-foreground hover:text-primary">Sinh Nhật</Link></li>
                  <li><Link href="/products?occasion=ky-niem" className="text-sm text-muted-foreground hover:text-primary">Kỷ Niệm</Link></li>
                  <li><Link href="/products?occasion=tan-gia" className="text-sm text-muted-foreground hover:text-primary">Tân Gia</Link></li>
                  <li><Link href="/products?occasion=tot-nghiep" className="text-sm text-muted-foreground hover:text-primary">Tốt Nghiệp</Link></li>
                  <li><Link href="/products?occasion=valentine" className="text-sm text-muted-foreground hover:text-primary">Valentine</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-primary mb-4 uppercase tracking-wider text-sm">Theo Sở Thích</h3>
                <ul className="space-y-3">
                  <li><Link href="/products?interest=cong-nghe" className="text-sm text-muted-foreground hover:text-primary">Đồ Công Nghệ</Link></li>
                  <li><Link href="/products?interest=gaming" className="text-sm text-muted-foreground hover:text-primary">Gaming</Link></li>
                  <li><Link href="/products?interest=decor" className="text-sm text-muted-foreground hover:text-primary">Trang Trí Nhà Cửa</Link></li>
                  <li><Link href="/products?interest=lam-dep" className="text-sm text-muted-foreground hover:text-primary">Làm Đẹp</Link></li>
                  <li><Link href="/products?interest=du-lich" className="text-sm text-muted-foreground hover:text-primary">Du Lịch</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-primary mb-4 uppercase tracking-wider text-sm">Theo Ngân Sách</h3>
                <ul className="space-y-3">
                  <li><Link href="/products?budget=under-200k" className="text-sm text-muted-foreground hover:text-primary">Dưới 200.000đ</Link></li>
                  <li><Link href="/products?budget=200k-500k" className="text-sm text-muted-foreground hover:text-primary">Từ 200K - 500K</Link></li>
                  <li><Link href="/products?budget=500k-1m" className="text-sm text-muted-foreground hover:text-primary">Từ 500K - 1 Triệu</Link></li>
                  <li><Link href="/products?budget=over-1m" className="text-sm text-muted-foreground hover:text-primary">Trên 1 Triệu</Link></li>
                </ul>
              </div>
            </div>
          )}
        </div>

        <Link href="/products?occasion=sinh-nhat" className="text-sm font-bold tracking-wide uppercase text-muted-foreground hover:text-primary transition-colors">Sinh Nhật</Link>
        <Link href="/products?recipient=all" className="text-sm font-bold tracking-wide uppercase text-muted-foreground hover:text-primary transition-colors">Người Nhận</Link>
        <Link href="/products?occasion=all" className="text-sm font-bold tracking-wide uppercase text-muted-foreground hover:text-primary transition-colors">Dịp Đặc Biệt</Link>
        <Link href="/products?interest=all" className="text-sm font-bold tracking-wide uppercase text-muted-foreground hover:text-primary transition-colors">Sở Thích</Link>
        <Link href="/products?zodiac=all" className="text-sm font-bold tracking-wide uppercase text-muted-foreground hover:text-primary transition-colors">Cung Hoàng Đạo</Link>
        <Link href="/products?numerology=all" className="text-sm font-bold tracking-wide uppercase text-muted-foreground hover:text-primary transition-colors">Thần Số Học</Link>
        <Link href="/products?sale=true" className="text-sm font-bold tracking-wide uppercase text-red-600 hover:text-red-700 transition-colors">Ưu Đãi</Link>
      </nav>
    </header>
  );
}
