import { Activity, Box, ShoppingCart, Users, Store } from "lucide-react";
import { getDashboardStats } from "../actions/admin";
import Link from 'next/link';

export default async function AdminDashboardPage() {
  const statsData = await getDashboardStats();

  const stats = [
    { title: "Tổng Người Bán", value: statsData.totalSellers.toString(), icon: Store, trend: "Active" },
    { title: "Tổng Người Dùng", value: statsData.totalUsers.toString(), icon: Users, trend: "Active" },
    { title: "Sản phẩm chờ duyệt", value: statsData.pendingProducts.toString(), icon: Box, trend: "Cần xử lý" },
    { title: "Đơn hàng (Master Orders)", value: statsData.totalOrders.toString(), icon: ShoppingCart, trend: "Toàn hệ thống" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold">Trang Tổng Quan Quản Trị</h1>
          <p className="text-muted-foreground mt-2">Theo dõi các chỉ số quan trọng của toàn bộ hệ thống DONE.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/products" className="px-6 py-2.5 bg-accent text-white rounded-xl font-medium hover:bg-accent/90 transition-all shadow-sm">
            Duyệt Sản Phẩm
          </Link>
          <Link href="/admin/users" className="px-6 py-2.5 bg-foreground text-background rounded-xl font-medium hover:bg-foreground/90 transition-all shadow-sm">
            Quản Lý User
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white p-6 rounded-2xl border border-border shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-accent/10 rounded-xl">
                  <Icon className="w-6 h-6 text-accent" />
                </div>
                <span className="text-sm font-medium text-orange-500">
                  {stat.trend}
                </span>
              </div>
              <h3 className="text-muted-foreground text-sm font-medium">{stat.title}</h3>
              <p className="text-3xl font-bold mt-1">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl border border-border shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg">Sản phẩm chờ duyệt</h3>
            <Link href="/admin/products" className="text-sm text-accent hover:underline">Xem tất cả</Link>
          </div>
          <div className="flex items-center justify-center h-32 bg-muted/30 rounded-xl border border-dashed border-border text-muted-foreground">
            {statsData.pendingProducts === 0 ? 'Không có sản phẩm nào đang chờ duyệt.' : `Có ${statsData.pendingProducts} sản phẩm cần duyệt.`}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-border shadow-sm">
          <h3 className="font-bold text-lg mb-4">Cảnh báo hệ thống (Rules)</h3>
          <div className="flex items-center justify-center h-32 bg-muted/30 rounded-xl border border-dashed border-border text-muted-foreground">
            Không có ngoại lệ (Exception) nào về Compatibility.
          </div>
        </div>
      </div>
    </div>
  );
}
