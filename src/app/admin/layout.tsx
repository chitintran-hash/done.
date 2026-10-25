"use client";

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter, usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  BarChart3,
  ShoppingCart, 
  Box, 
  Layers, 
  Truck, 
  Paintbrush, 
  Users, 
  TrendingUp, 
  PieChart, 
  FileText, 
  Settings, 
  Home,
  LogOut,
  ShieldCheck,
  Menu,
  X,
  Building2
} from 'lucide-react';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string>('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAdmin = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user || user.email?.toLowerCase().trim() !== 'tranchitin2006@gmail.com') {
        // Cho phép truy cập cổng Trạm Nghỉ để chấm điểm và đánh giá đồ án
        if (pathname?.startsWith('/admin/tram-nghi')) {
          setUserEmail(user?.email || 'admin@tramnghi.vn (Demo Học Phần)');
          setLoading(false);
          return;
        }
        router.push('/');
      } else {
        setUserEmail(user.email);
        setLoading(false);
      }
    };
    checkAdmin();
  }, [router, pathname]);

  const navItems = [
    { label: "Trạm Nghỉ (Đối Tác & Workshop)", href: "/admin/tram-nghi", icon: Building2 },
    { label: "Tổng quan", href: "/admin", icon: LayoutDashboard },
    { label: "Phân tích truy cập", href: "/admin/analytics", icon: BarChart3 },
    { label: "Đơn hàng", href: "/admin/orders", icon: ShoppingCart },
    { label: "Sản phẩm", href: "/admin/products", icon: Box },
    { label: "Kho hàng", href: "/admin/inventory", icon: Layers },
    { label: "Vận chuyển", href: "/admin/shipping", icon: Truck },
    { label: "Thiết kế tùy chỉnh", href: "/admin/custom-requests", icon: Paintbrush },
    { label: "Khách hàng", href: "/admin/users", icon: Users },
    { label: "Doanh thu", href: "/admin/revenue", icon: TrendingUp },
    { label: "Chi phí & Lợi nhuận", href: "/admin/profit", icon: PieChart },
    { label: "Báo cáo", href: "/admin/reports", icon: FileText },
    { label: "Cài đặt", href: "/admin/settings", icon: Settings },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6 text-[#3A211E]">
        <div className="bg-white p-8 rounded-2xl shadow-xs border border-[#E8DFD8] text-center max-w-sm w-full">
          <div className="w-12 h-12 rounded-full bg-[#FFF3C4] border border-[#FFBF00] flex items-center justify-center mx-auto mb-4 text-[#3A211E]">
            <ShieldCheck className="w-6 h-6 animate-pulse" />
          </div>
          <h2 className="font-bold text-lg text-[#3A211E]">Đang kiểm tra quyền truy cập...</h2>
          <p className="text-sm text-[#765B52] mt-2">Hệ thống quản trị thương hiệu Cupfy</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white text-[#3A211E] overflow-hidden">
      {/* Mobile Menu Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white border-r border-[#E8DFD8] flex flex-col transition-transform duration-300
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Brand Header */}
        <div className="p-6 border-b border-[#E8DFD8] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFBF00] border border-[#E8DFD8] flex items-center justify-center font-bold text-[#3A211E] text-xl shadow-xs">
              ☕
            </div>
            <div>
              <div className="font-black text-xl text-[#3A211E] tracking-tight">CUPFY ADMIN</div>
              <div className="text-xs text-[#765B52] font-medium flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> D2C Management
              </div>
            </div>
          </div>
          <button 
            className="lg:hidden p-1.5 text-[#765B52] hover:text-[#3A211E]"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1 custom-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.href === '/admin' 
              ? pathname === '/admin'
              : pathname.startsWith(item.href);

            return (
              <Link 
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3.5 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
                  isActive 
                    ? 'bg-[#FFBF00] text-[#3A211E] shadow-xs font-bold' 
                    : 'text-[#765B52] hover:text-[#3A211E] hover:bg-[#FFF9E8]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#3A211E]' : 'text-[#765B52]'}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer Admin Info & Return to Store */}
        <div className="p-4 border-t border-[#E8DFD8] bg-[#FFF9E8] space-y-2">
          <div className="px-3 py-2 bg-white rounded-xl border border-[#E8DFD8] text-xs">
            <div className="text-[#765B52]">Tài khoản quản trị:</div>
            <div className="font-medium text-[#3A211E] truncate mt-0.5">{userEmail}</div>
          </div>

          <Link 
            href="/" 
            className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-white border border-[#E8DFD8] text-[#3A211E] text-xs font-bold hover:bg-[#FFF3C4] transition-colors shadow-xs"
          >
            <Home className="w-4 h-4" />
            Về Cửa Hàng Khách
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top bar for mobile trigger & breadcrumbs */}
        <header className="lg:hidden bg-white border-b border-[#E8DFD8] px-6 py-4 flex items-center justify-between">
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 -ml-2 text-[#3A211E] hover:bg-[#FFF9E8] rounded-lg"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="font-bold text-sm text-[#3A211E]">CUPFY Quản Trị</div>
          <Link href="/" className="text-xs text-[#3A211E] font-semibold underline">
            Cửa hàng
          </Link>
        </header>

        {/* Page Content Viewport */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#FFF9E8]/30">
          <div className="max-w-[1500px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
