"use client";

import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { Globe, ShoppingCart, Search, User as UserIcon } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const { t, language, setLanguage } = useLanguage();
  const cart = useCartStore();

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
    <header className="fixed top-0 left-0 right-0 h-16 border-b border-border bg-background/80 backdrop-blur-md flex items-center justify-between px-6 z-50">
      <Link href="/" className="font-bold text-xl tracking-tight">
        DONE.
      </Link>
      <div className="hidden md:flex flex-1 items-center justify-center gap-8 px-8">
        <Link href="/products" className="text-sm font-medium hover:text-accent transition-colors">Sản phẩm</Link>
        <Link href="/build" className="text-sm font-medium hover:text-accent transition-colors">Solution Builder</Link>
        <Link href="/sell" className="text-sm font-medium text-orange-600 hover:text-orange-700 transition-colors">Trở thành Người bán</Link>
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={() => setLanguage(language === 'vi' ? 'en' : 'vi')}
          className="flex items-center gap-2 text-sm font-medium hover:text-accent transition-colors border border-border px-3 py-1.5 rounded-full"
        >
          <Globe className="w-4 h-4" />
          {language === 'vi' ? 'EN' : 'VI'}
        </button>

        <Link href="/cart" className="relative p-2 text-foreground hover:text-accent transition-colors">
          <ShoppingCart className="w-5 h-5" />
          {cart.items.length > 0 && (
            <span className="absolute top-0 right-0 w-4 h-4 bg-accent text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {cart.items.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          )}
        </Link>
        
        {user ? (
            <>
              {user.email?.toLowerCase().trim() === 'tranchitin2006@gmail.com' && (
                <Link href="/admin" className="text-sm font-medium text-accent hover:underline">
                  {t('nav.admin')}
                </Link>
              )}
              {user.user_metadata?.role === 'seller' ? (
                <Link href="/seller" className="text-sm font-medium text-orange-600 hover:underline">
                  {t('nav.seller')}
                </Link>
              ) : (
                <>
                  <Link href="/orders" className="text-sm font-medium hover:underline">
                    Đơn hàng của tôi
                  </Link>
                  <Link href="/sell" className="text-sm font-medium text-orange-600 hover:underline">
                    {t('nav.seller')}
                  </Link>
                </>
              )}
              <span className="text-sm text-muted-foreground hidden lg:inline-block flex items-center gap-2">
                {user.user_metadata?.avatar_url ? (
                  <img src={user.user_metadata.avatar_url} alt="Avatar" className="w-6 h-6 rounded-full object-cover" />
                ) : (
                  <UserIcon className="w-4 h-4" />
                )}
                {user.user_metadata?.full_name || user.email}
              </span>
              <button 
                onClick={handleSignOut}
                className="text-sm font-medium text-red-600 hover:underline"
              >
                {t('nav.logout')}
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium hover:underline hidden sm:block">
                {t('nav.login')}
              </Link>
              <Link href="/register" className="text-sm font-medium bg-foreground text-background px-4 py-2 rounded-full hover:bg-foreground/90 transition-colors">
                {t('nav.register')}
              </Link>
            </>
          )}
      </div>
    </header>
  );
}
