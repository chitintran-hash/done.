import { Package, TrendingUp, Truck, AlertCircle } from "lucide-react";

export default function SellerDashboardPage() {
  const stats = [
    { title: "Doanh thu (tháng)", value: "145.500.000đ", icon: TrendingUp, trend: "+24%" },
    { title: "Sản phẩm đang bán", value: "32", icon: Package, trend: "4 hết hàng" },
    { title: "Sub-orders chờ giao", value: "12", icon: Truck, trend: "Cần đóng gói" },
    { title: "Đánh giá trung bình", value: "4.8/5", icon: AlertCircle, trend: "Tốt" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Kênh Nhà Bán (Seller Center)</h1>
        <p className="text-muted-foreground mt-2">Quản lý cửa hàng, sản phẩm và theo dõi đơn hàng được phân bổ từ DONE.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white p-6 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-orange-50 rounded-xl">
                  <Icon className="w-6 h-6 text-orange-600" />
                </div>
                <span className={`text-sm font-medium ${stat.trend.includes('+') ? 'text-green-600' : 'text-orange-600'}`}>
                  {stat.trend}
                </span>
              </div>
              <h3 className="text-muted-foreground text-sm font-medium">{stat.title}</h3>
              <p className="text-2xl font-bold mt-1">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-white p-6 rounded-2xl border border-border shadow-sm">
        <h3 className="font-bold text-lg mb-4">Đơn hàng mới (Sub-orders)</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Vì DONE. thanh toán gom theo Master Order, hệ thống đã tách đơn và đây là những sản phẩm bạn cần đóng gói giao đi.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border text-sm text-muted-foreground">
                <th className="py-3 font-medium">Mã Đơn</th>
                <th className="py-3 font-medium">Sản phẩm</th>
                <th className="py-3 font-medium">Số tiền</th>
                <th className="py-3 font-medium">Hạn giao hàng</th>
                <th className="py-3 font-medium">Hành động</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr className="border-b border-border hover:bg-muted/30">
                <td className="py-4 font-medium">#SUB-1092-A</td>
                <td className="py-4">Bàn Ergonomic 120cm</td>
                <td className="py-4 font-medium">4.500.000đ</td>
                <td className="py-4 text-orange-600 font-medium">Hôm nay</td>
                <td className="py-4">
                  <button className="px-3 py-1.5 bg-foreground text-background rounded font-medium text-xs">Xác nhận giao</button>
                </td>
              </tr>
              <tr className="hover:bg-muted/30">
                <td className="py-4 font-medium">#SUB-1093-C</td>
                <td className="py-4">Đèn Monitor Light Bar</td>
                <td className="py-4 font-medium">850.000đ</td>
                <td className="py-4 text-muted-foreground">Ngày mai</td>
                <td className="py-4">
                  <button className="px-3 py-1.5 bg-foreground text-background rounded font-medium text-xs">Xác nhận giao</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
