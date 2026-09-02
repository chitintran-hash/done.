import { Activity, Box, ShoppingCart, Users } from "lucide-react";

export default function AdminDashboardPage() {
  const stats = [
    { title: "Tổng nhà bán", value: "24", icon: Users, trend: "+12%" },
    { title: "Sản phẩm chờ duyệt", value: "8", icon: Box, trend: "Cần xử lý" },
    { title: "Đơn hàng (Master Orders)", value: "156", icon: ShoppingCart, trend: "+45%" },
    { title: "Lỗi tương thích (Rules)", value: "0", icon: Activity, trend: "Ổn định" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Trang Tổng Quan Quản Trị</h1>
        <p className="text-muted-foreground mt-2">Theo dõi các chỉ số quan trọng của toàn bộ hệ thống DONE.</p>
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
                <span className={`text-sm font-medium ${stat.trend.includes('+') ? 'text-green-600' : 'text-orange-500'}`}>
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
          <h3 className="font-bold text-lg mb-4">Sản phẩm chờ duyệt gần đây</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-border">
              <div>
                <p className="font-medium">Bàn phím cơ Keychron K8 Pro</p>
                <p className="text-sm text-muted-foreground">Seller: GearVN</p>
              </div>
              <button className="px-4 py-2 bg-accent/10 text-accent font-medium rounded-lg text-sm">Duyệt ngay</button>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border">
              <div>
                <p className="font-medium">Ghế Ergonomic Herman Miller</p>
                <p className="text-sm text-muted-foreground">Seller: SiliconZ</p>
              </div>
              <button className="px-4 py-2 bg-accent/10 text-accent font-medium rounded-lg text-sm">Duyệt ngay</button>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-border shadow-sm">
          <h3 className="font-bold text-lg mb-4">Cảnh báo hệ thống (Rules)</h3>
          <div className="flex items-center justify-center h-48 bg-muted/30 rounded-xl border border-dashed border-border text-muted-foreground">
            Không có ngoại lệ (Exception) nào về Compatibility.
          </div>
        </div>
      </div>
    </div>
  );
}
