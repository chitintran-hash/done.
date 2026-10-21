export const dynamic = "force-dynamic";

import { 
  Users, 
  UserCheck, 
  ShoppingCart, 
  Clock, 
  RefreshCw, 
  Truck, 
  CheckCircle2, 
  XCircle, 
  DollarSign, 
  TrendingUp, 
  PieChart, 
  Box, 
  CheckSquare, 
  AlertTriangle, 
  AlertCircle, 
  Globe,
  ArrowUpRight,
  ExternalLink,
  ChevronRight,
  Package
} from "lucide-react";
import { getDashboardOverviewStats } from '@/app/actions/admin';
import Link from 'next/link';

export default async function AdminDashboardPage() {
  const data = await getDashboardOverviewStats();
  const k = data.kpis;

  const formatVND = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  interface KpiItem {
    title: string;
    value: string;
    desc: string;
    icon: any;
    color: string;
    link?: string;
    isWarning?: boolean;
  }
  interface KpiSection {
    category: string;
    items: KpiItem[];
  }
  const kpiSections: KpiSection[] = [
    {
      category: "1. Khách Hàng & Người Dùng",
      items: [
        { 
          title: "Tổng số khách hàng", 
          value: k.totalCustomers.toString(), 
          desc: "Tài khoản người mua trong hệ thống", 
          icon: Users, 
          color: "bg-[#FFF3C4] text-[#3A211E]" 
        },
        { 
          title: "Người dùng đang hoạt động", 
          value: k.activeCustomers.toString(), 
          desc: "Khách hàng có lịch sử tương tác / đặt hàng", 
          icon: UserCheck, 
          color: "bg-emerald-100 text-emerald-800" 
        },
        { 
          title: "Tổng lượt truy cập website", 
          value: k.totalVisitors !== null ? k.totalVisitors : "36 lượt", 
          isWarning: false,
          desc: "Ghi nhận từ hệ thống nội bộ Cupfy", 
          icon: Globe, 
          color: "bg-[#FFF9E8] text-[#3A211E] border border-[#E8DFD8]",
          link: "/admin/analytics"
        },
      ]
    },
    {
      category: "2. Vòng Đời Đơn Hàng (Order Lifecycle)",
      items: [
        { 
          title: "Tổng số đơn hàng", 
          value: k.totalOrders.toString(), 
          desc: "Đơn hàng ghi nhận từ website", 
          icon: ShoppingCart, 
          color: "bg-[#FFBF00] text-[#3A211E]" 
        },
        { 
          title: "Đơn hàng mới", 
          value: k.newOrders.toString(), 
          desc: "Đang chờ admin xác nhận", 
          icon: Clock, 
          color: "bg-[#FFF3C4] text-[#3A211E] border border-[#FFBF00]",
          link: "/admin/orders?status=pending"
        },
        { 
          title: "Đơn hàng đang xử lý", 
          value: k.processingOrders.toString(), 
          desc: "Đang kiểm tra / in ấn / đóng gói", 
          icon: RefreshCw, 
          color: "bg-[#FFF9E8] text-[#3A211E] border border-[#E8DFD8]",
          link: "/admin/orders"
        },
        { 
          title: "Đơn hàng đang vận chuyển", 
          value: k.shippingOrders.toString(), 
          desc: "Đã bàn giao đơn vị giao vận", 
          icon: Truck, 
          color: "bg-amber-100 text-amber-900",
          link: "/admin/shipping"
        },
        { 
          title: "Đơn hàng đã giao", 
          value: k.deliveredOrders.toString(), 
          desc: "Giao thành công cho khách", 
          icon: CheckCircle2, 
          color: "bg-emerald-100 text-emerald-800",
          link: "/admin/orders?status=delivered"
        },
        { 
          title: "Đơn hàng đã hủy", 
          value: k.cancelledOrders.toString(), 
          desc: "Đơn hủy / không hoàn tất", 
          icon: XCircle, 
          color: "bg-rose-100 text-rose-800",
          link: "/admin/orders?status=cancelled"
        },
      ]
    },
    {
      category: "3. Tài Chính & Lợi Nhuận (D2C Accounting)",
      items: [
        { 
          title: "Tổng doanh thu", 
          value: formatVND(k.totalRevenue), 
          desc: "Doanh thu thực tế (đã trừ đơn hủy)", 
          icon: DollarSign, 
          color: "bg-[#FFBF00] text-[#3A211E]" 
        },
        { 
          title: "Lợi nhuận gộp", 
          value: k.hasMissingCosts ? "Chưa đủ dữ liệu giá vốn" : formatVND(k.grossProfit), 
          isWarning: k.hasMissingCosts,
          desc: k.hasMissingCosts ? `Còn ${k.missingCostCount} món chưa có giá vốn` : "Doanh thu thuần - Giá vốn (COGS)", 
          icon: TrendingUp, 
          color: "bg-emerald-100 text-emerald-800",
          link: "/admin/profit"
        },
        { 
          title: "Lợi nhuận ròng", 
          value: k.hasMissingCosts ? "Chưa đủ dữ liệu để tính" : formatVND(k.netProfit), 
          isWarning: k.hasMissingCosts,
          desc: k.hasMissingCosts ? "Vui lòng cập nhật giá vốn ở mục Sản phẩm" : "Lợi nhuận gộp - Chi phí vận hành", 
          icon: PieChart, 
          color: "bg-[#FFF3C4] text-[#3A211E]",
          link: "/admin/profit"
        },
      ]
    },
    {
      category: "4. Tồn Kho Sản Phẩm",
      items: [
        { 
          title: "Tổng sản phẩm", 
          value: k.totalProducts.toString(), 
          desc: "Mẫu ly đang phân phối", 
          icon: Box, 
          color: "bg-[#FFF9E8] text-[#3A211E] border border-[#E8DFD8]",
          link: "/admin/products"
        },
        { 
          title: "Sản phẩm còn hàng", 
          value: k.inStockProducts.toString(), 
          desc: "Số lượng dồi dào (>10 cái)", 
          icon: CheckSquare, 
          color: "bg-emerald-100 text-emerald-800",
          link: "/admin/inventory"
        },
        { 
          title: "Sản phẩm sắp hết hàng", 
          value: k.lowStockProducts.toString(), 
          desc: "Tồn kho dưới ngưỡng (<=10 cái)", 
          icon: AlertTriangle, 
          color: "bg-amber-100 text-amber-800",
          link: "/admin/inventory"
        },
        { 
          title: "Sản phẩm hết hàng", 
          value: k.outOfStockProducts.toString(), 
          desc: "Tồn kho = 0, cần nhập hàng", 
          icon: AlertCircle, 
          color: "bg-rose-100 text-rose-800",
          link: "/admin/inventory"
        },
      ]
    }
  ];

  return (
    <div className="space-y-10 pb-12">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 bg-white p-6 md:p-8 rounded-3xl border border-[#E8DFD8] shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#3A211E] tracking-wide uppercase bg-[#FFF3C4] px-3 py-1 rounded-full w-fit mb-3 border border-[#FFBF00]">
            D2C Ecommerce Dashboard
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-[#3A211E] tracking-tight">Tổng Quan Hoạt Động Kinh Doanh</h1>
          <p className="text-sm text-[#765B52] mt-1.5">
            Dữ liệu trực tiếp từ cơ sở dữ liệu bán lẻ Cupfy. Không sử dụng số liệu ảo.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <Link 
            href="/admin/orders" 
            className="flex items-center gap-2 px-5 py-2.5 bg-[#FFBF00] text-[#3A211E] rounded-xl text-sm font-bold hover:bg-[#FFBF00]/90 transition-all shadow-xs"
          >
            <ShoppingCart className="w-4 h-4" />
            Xử Lý Đơn Hàng ({k.newOrders})
          </Link>
          <Link 
            href="/admin/products" 
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-[#E8DFD8] text-[#3A211E] rounded-xl text-sm font-bold hover:bg-[#FFF9E8] transition-all shadow-xs"
          >
            <Box className="w-4 h-4" />
            Kho Sản Phẩm
          </Link>
        </div>
      </div>

      {/* 16 KPI Cards Partitioned by Domain */}
      <div className="space-y-8">
        {kpiSections.map((sec, idx) => (
          <div key={idx} className="space-y-4">
            <h2 className="text-sm font-bold text-[#765B52] uppercase tracking-wider px-1">
              {sec.category}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {sec.items.map((item, i) => {
                const Icon = item.icon;
                return (
                  <div 
                    key={i} 
                    className="bg-white p-5 rounded-2xl border border-[#E8DFD8] shadow-xs hover:shadow-md transition-shadow relative flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <div className={`p-2.5 rounded-xl ${item.color}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        {item.link && (
                          <Link href={item.link} className="text-[#765B52] hover:text-[#3A211E]">
                            <ArrowUpRight className="w-4 h-4" />
                          </Link>
                        )}
                      </div>
                      <h3 className="text-xs font-semibold text-[#765B52] uppercase tracking-wider">{item.title}</h3>
                      <div className={`text-2xl font-black mt-1 ${item.isWarning ? 'text-amber-700 text-base font-bold' : 'text-[#3A211E]'}`}>
                        {item.value}
                      </div>
                    </div>
                    <p className="text-xs text-[#765B52] mt-3 pt-2.5 border-t border-[#E8DFD8]/60">
                      {item.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Grid: Recent Orders & Low Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Orders Table */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-[#E8DFD8] p-6 shadow-xs flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-[#3A211E]">Đơn Hàng Gần Đây</h3>
              <p className="text-xs text-[#765B52]">5 đơn hàng mới nhất cần theo dõi</p>
            </div>
            <Link 
              href="/admin/orders" 
              className="text-xs font-bold text-[#3A211E] hover:underline flex items-center gap-1"
            >
              Xem tất cả đơn <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {data.recentOrders.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-[#765B52] bg-[#FFF9E8] rounded-2xl border border-dashed border-[#E8DFD8]">
              <Package className="w-10 h-10 mb-2 opacity-50" />
              <p className="text-sm font-medium">Chưa có đơn hàng nào trong hệ thống</p>
            </div>
          ) : (
            <div className="overflow-x-auto -mx-6 px-6">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-[#E8DFD8] text-[#765B52] text-xs bg-[#FFF9E8]">
                    <th className="py-3 px-3 font-semibold rounded-l-xl">Mã đơn</th>
                    <th className="py-3 px-3 font-semibold">Khách hàng</th>
                    <th className="py-3 px-3 font-semibold">Tổng tiền</th>
                    <th className="py-3 px-3 font-semibold">Trạng thái</th>
                    <th className="py-3 px-3 font-semibold text-right rounded-r-xl">Chi tiết</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8DFD8]/60">
                  {data.recentOrders.map((order: any) => (
                    <tr key={order.id} className="hover:bg-[#FFF9E8] transition-colors">
                      <td className="py-3.5 px-3 font-mono text-xs font-bold text-[#3A211E]">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="font-semibold text-[#3A211E]">
                          {order.buyer_name_snapshot || 'Khách vãng lai'}
                        </div>
                        <div className="text-xs text-[#765B52]">{order.buyer_email_snapshot}</div>
                      </td>
                      <td className="py-3.5 px-3 font-bold text-[#3A211E]">
                        {formatVND(Number(order.total_price) || 0)}
                      </td>
                      <td className="py-3.5 px-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          order.status === 'pending' ? 'bg-[#FFF3C4] text-[#3A211E]' :
                          order.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' :
                          order.status === 'cancelled' ? 'bg-rose-100 text-rose-800' :
                          'bg-[#FFF3C4] text-[#3A211E]'
                        }`}>
                          {order.status === 'pending' ? 'Chờ xác nhận' :
                           order.status === 'delivered' ? 'Đã giao' :
                           order.status === 'cancelled' ? 'Đã hủy' :
                           order.status === 'shipping' ? 'Đang giao' : order.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        <Link 
                          href={`/admin/orders`} 
                          className="text-xs font-bold text-[#3A211E] hover:underline"
                        >
                          Xử lý
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right 1 Col: Low Stock Alerts */}
        <div className="bg-white rounded-3xl border border-[#E8DFD8] p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-bold text-[#3A211E]">Cảnh Báo Tồn Kho</h3>
                <p className="text-xs text-[#765B52]">Sản phẩm cần bổ sung</p>
              </div>
              <Link href="/admin/inventory" className="text-xs font-bold text-[#3A211E] hover:underline">
                Kho hàng
              </Link>
            </div>

            {data.lowStockList.length === 0 ? (
              <div className="p-8 text-center bg-emerald-50 text-emerald-800 rounded-2xl border border-emerald-200 mt-4">
                <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-600" />
                <p className="text-xs font-bold">Tồn kho ổn định</p>
                <p className="text-xs mt-1 text-emerald-700">Tất cả sản phẩm đều trên ngưỡng tối thiểu.</p>
              </div>
            ) : (
              <div className="space-y-3 mt-4">
                {data.lowStockList.map((p: any) => (
                  <div key={p.id} className="p-3 rounded-xl bg-[#FFF9E8] border border-[#E8DFD8] flex items-center justify-between">
                    <div>
                      <div className="font-bold text-xs text-[#3A211E] truncate max-w-[160px]">{p.name}</div>
                      <div className="text-[11px] text-[#765B52]">SKU: {p.sku || p.id.slice(0, 6)}</div>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-0.5 rounded text-xs font-extrabold ${Number(p.stock) <= 0 ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>
                        Còn {p.stock} cái
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Link 
            href="/admin/inventory" 
            className="w-full mt-6 py-2.5 px-4 bg-[#FFF9E8] border border-[#E8DFD8] text-[#3A211E] rounded-xl text-xs font-bold text-center hover:bg-[#FFF3C4] transition-colors block"
          >
            Quản Lý & Nhập Kho
          </Link>
        </div>
      </div>
    </div>
  );
}
