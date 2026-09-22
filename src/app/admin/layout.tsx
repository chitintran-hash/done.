"use client";

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter, usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Box, ListChecks, Settings, LogOut, ShoppingCart, Paintbrush, Home } from 'lucide-react';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAdmin = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user || user.email?.toLowerCase().trim() !== 'tranchitin2006@gmail.com') {
        router.push('/');
      } else {
        setLoading(false);
      }
    };
    checkAdmin();
  }, [router]);

  if (loading) return <div className="p-8 text-center text-primary">Đang kiểm tra quyền truy cập...</div>;

  return (
    <div className="flex h-screen bg-muted/30">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-border p-4 flex flex-col">
        <div className="font-serif font-bold text-2xl mb-8 text-primary px-4 tracking-widest mt-4">
          CUPFY ADMIN
        </div>
        <nav className="flex-1 space-y-2">
          <Link href="/admin" className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${pathname === '/admin' ? 'bg-primary/10 text-primary' : 'hover:bg-muted text-muted-foreground hover:text-foreground'}`}>
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>
          <Link href="/admin/products" className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${pathname.startsWith('/admin/products') ? 'bg-primary/10 text-primary' : 'hover:bg-muted text-muted-foreground hover:text-foreground'}`}>
            <Box className="w-5 h-5" />
            Sản phẩm
          </Link>
          <Link href="/admin/orders" className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${pathname.startsWith('/admin/orders') ? 'bg-primary/10 text-primary' : 'hover:bg-muted text-muted-foreground hover:text-foreground'}`}>
            <ShoppingCart className="w-5 h-5" />
            Đơn hàng
          </Link>
          <Link href="/admin/custom-requests" className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${pathname.startsWith('/admin/custom-requests') ? 'bg-primary/10 text-primary' : 'hover:bg-muted text-muted-foreground hover:text-foreground'}`}>
            <Paintbrush className="w-5 h-5" />
            Custom Requests
          </Link>
          <Link href="/admin/users" className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${pathname.startsWith('/admin/users') ? 'bg-primary/10 text-primary' : 'hover:bg-muted text-muted-foreground hover:text-foreground'}`}>
            <Users className="w-5 h-5" />
            Khách hàng
          </Link>
        </nav>
        <Link href="/" className="flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-white border-2 border-border text-foreground font-bold hover:bg-muted transition-colors mt-auto shadow-sm">
          <Home className="w-5 h-5" />
          Về trang chủ
        </Link>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8 bg-white m-4 rounded-3xl shadow-sm border border-border">
        {children}
      </main>
    </div>
  );
}
