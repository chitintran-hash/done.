"use client";

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, Package, Truck, Store, LogOut } from 'lucide-react';
import Link from 'next/link';

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
      } else {
        setLoading(false);
      }
    };
    checkAuth();
  }, [router]);

  if (loading) return <div className="p-8 text-center">Đang tải Seller Portal...</div>;

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-muted/20">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-border p-4 flex flex-col">
        <div className="font-bold text-lg mb-8 text-orange-600 px-4">Kênh Người Bán</div>
        <nav className="flex-1 space-y-2">
          <Link href="/seller" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-orange-50 text-orange-600 font-medium">
            <LayoutDashboard className="w-5 h-5" />
            Tổng quan
          </Link>
          <Link href="/seller/products" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground font-medium transition-colors">
            <Package className="w-5 h-5" />
            Quản lý Sản phẩm
          </Link>
          <Link href="/seller/orders" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground font-medium transition-colors">
            <Truck className="w-5 h-5" />
            Đơn hàng (Sub-orders)
          </Link>
          <Link href="/seller/store" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground font-medium transition-colors">
            <Store className="w-5 h-5" />
            Thông tin cửa hàng
          </Link>
        </nav>
        <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-50 text-red-600 font-medium transition-colors mt-auto">
          <LogOut className="w-5 h-5" />
          Về trang chủ
        </Link>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
}
