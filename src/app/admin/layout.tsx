"use client";

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, Users, Box, ListChecks, Settings, LogOut } from 'lucide-react';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAdmin = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user || user.email !== 'tranchitin2006@gmail.com') {
        router.push('/');
      } else {
        setLoading(false);
      }
    };
    checkAdmin();
  }, [router]);

  if (loading) return <div className="p-8 text-center">Đang kiểm tra quyền truy cập...</div>;

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-muted/30">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-border p-4 flex flex-col">
        <div className="font-bold text-lg mb-8 text-accent px-4">Admin Portal</div>
        <nav className="flex-1 space-y-2">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-accent/10 text-accent font-medium">
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>
          <Link href="/admin/products" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground font-medium transition-colors">
            <Box className="w-5 h-5" />
            Sản phẩm
          </Link>
          <Link href="/admin/sellers" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground font-medium transition-colors">
            <Users className="w-5 h-5" />
            Nhà bán (Sellers)
          </Link>
          <Link href="/admin/compatibility" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground font-medium transition-colors">
            <ListChecks className="w-5 h-5" />
            Rules Tương thích
          </Link>
          <Link href="/admin/system" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground font-medium transition-colors">
            <Settings className="w-5 h-5" />
            Hệ thống (Dataset)
          </Link>
        </nav>
        <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-50 text-red-600 font-medium transition-colors mt-auto">
          <LogOut className="w-5 h-5" />
          Thoát Admin
        </Link>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
}
