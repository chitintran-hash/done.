"use client";

import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';

export default function Header() {
  const [user, setUser] = useState<User | null>(null);

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
      
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span className="text-sm text-muted-foreground">{user.email}</span>
            <button 
              onClick={handleSignOut}
              className="text-sm font-medium hover:text-accent transition-colors"
            >
              Đăng xuất
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="text-sm font-medium hover:text-accent transition-colors">
              Đăng nhập
            </Link>
            <Link href="/register" className="text-sm font-medium px-4 py-2 bg-foreground text-background rounded-full hover:bg-foreground/90 transition-colors">
              Đăng ký
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
