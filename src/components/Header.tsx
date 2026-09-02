"use client";

import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { Globe } from 'lucide-react';

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const { t, language, setLanguage } = useLanguage();

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
        <button 
          onClick={() => setLanguage(language === 'vi' ? 'en' : 'vi')}
          className="flex items-center gap-2 text-sm font-medium hover:text-accent transition-colors mr-2 border border-border px-3 py-1.5 rounded-full"
        >
          <Globe className="w-4 h-4" />
          {language === 'vi' ? 'EN' : 'VI'}
        </button>

        {user ? (
          <>
            {user.email === 'tranchitin2006@gmail.com' && (
              <Link href="/admin" className="text-sm font-medium text-accent hover:underline">
                {t('nav.admin')}
              </Link>
            )}
            <span className="text-sm text-muted-foreground">{user.email}</span>
            <button 
              onClick={handleSignOut}
              className="text-sm font-medium hover:text-accent transition-colors"
            >
              {t('nav.logout')}
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="text-sm font-medium hover:text-accent transition-colors">
              {t('nav.login')}
            </Link>
            <Link href="/register" className="text-sm font-medium px-4 py-2 bg-foreground text-background rounded-full hover:bg-foreground/90 transition-colors">
              {t('nav.register')}
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
