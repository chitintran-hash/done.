export const dynamic = "force-dynamic";

import { 
  Users, 
  Activity, 
  UserCheck, 
  UserPlus, 
  LogIn, 
  Clock, 
  Eye, 
  ShoppingCart, 
  CreditCard, 
  CheckCircle2, 
  TrendingUp, 
  ArrowRight,
  ShieldCheck,
  Radio,
  Sparkles
} from "lucide-react";
import Link from "next/link";
import { getInternalSystemAnalytics } from "@/app/actions/admin";

export default async function AdminAnalyticsPage() {
  const data = await getInternalSystemAnalytics();
  const { metrics, recentLogins, activityTimeline } = data;

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-[#DDD8D2] shadow-sm flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#4A2A25] tracking-wide uppercase bg-[#FFF3A6] px-3 py-1 rounded-full w-fit mb-3 border border-[#DDD8D2]">
            <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
            Hệ Thống Phân Tích Nội Bộ Cupfy
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-[#3A211E] tracking-tight">
            Theo Dõi Người Dùng & Lượt Truy Cập
          </h1>
          <p className="text-sm text-[#6F625E] mt-1.5">
            Giám sát thời gian thực các tài khoản hoạt động, lượt ra vào website, đăng ký mới, đăng nhập và người dùng đang sử dụng trực tiếp trên hệ thống (hoàn toàn nội bộ, độc lập).
          </p>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 bg-[#F7F6F2] rounded-2xl border border-[#DDD8D2] text-xs font-bold text-[#4A2A25]">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
          Đang cập nhật trực tiếp từ hệ thống
        </div>
      </div>

      {/* 4 PRIMARY METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Currently Online / In Use */}
        <div className="bg-white p-6 rounded-3xl border border-[#DDD8D2] shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
              <Activity className="w-6 h-6 animate-pulse" />
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span> Trực Tuyến
            </span>
          </div>
          <div className="mt-4">
            <div className="text-xs font-bold text-[#6F625E] uppercase tracking-wider">Đang Sử Dụng (Online)</div>
            <div className="text-3xl font-black text-[#201817] mt-1">
              {metrics.currentlyOnline} <span className="text-sm font-semibold text-[#6F625E]">tài khoản</span>
            </div>
            <p className="text-[11px] text-[#6F625E] mt-2">
              Người dùng & admin đang có phiên làm việc trong 2 giờ qua
            </p>
          </div>
        </div>

        {/* Card 2: Visits Today */}
        <div className="bg-white p-6 rounded-3xl border border-[#DDD8D2] shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800">
              <Eye className="w-6 h-6" />
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#EDECEA] text-[#3A211E]">
              Hôm nay
            </span>
          </div>
          <div className="mt-4">
            <div className="text-xs font-bold text-[#6F625E] uppercase tracking-wider">Lượt Ra Vào Website</div>
            <div className="text-3xl font-black text-[#201817] mt-1">
              {metrics.estimatedVisitsToday} <span className="text-sm font-semibold text-[#6F625E]">lượt</span>
            </div>
            <p className="text-[11px] text-[#6F625E] mt-2">
              Ước tính 7 ngày qua: <strong>{metrics.estimatedVisits7d}</strong> lượt ghé thăm
            </p>
          </div>
        </div>

        {/* Card 3: Active Users 24h */}
        <div className="bg-white p-6 rounded-3xl border border-[#DDD8D2] shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-800">
              <UserCheck className="w-6 h-6" />
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
              24 Giờ
            </span>
          </div>
          <div className="mt-4">
            <div className="text-xs font-bold text-[#6F625E] uppercase tracking-wider">Tài Khoản Hoạt Động</div>
            <div className="text-3xl font-black text-[#201817] mt-1">
              {metrics.dailyActiveUsers} <span className="text-sm font-semibold text-[#6F625E]">user</span>
            </div>
            <p className="text-[11px] text-[#6F625E] mt-2">
              Có đăng nhập hoặc tương tác trong vòng 24 giờ qua
            </p>
          </div>
        </div>

        {/* Card 4: Total & New Registrations */}
        <div className="bg-white p-6 rounded-3xl border border-[#DDD8D2] shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="w-12 h-12 rounded-2xl bg-[#FFF3A6] border border-[#DDD8D2] flex items-center justify-center text-[#4A2A25]">
              <UserPlus className="w-6 h-6" />
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#4A2A25] text-white">
              +{metrics.new7Days} tuần này
            </span>
          </div>
          <div className="mt-4">
            <div className="text-xs font-bold text-[#6F625E] uppercase tracking-wider">Tổng Tài Khoản Đăng Ký</div>
            <div className="text-3xl font-black text-[#201817] mt-1">
              {metrics.totalUsers} <span className="text-sm font-semibold text-[#6F625E]">tài khoản</span>
            </div>
            <p className="text-[11px] text-[#6F625E] mt-2">
              Đăng ký mới hôm nay: <strong>+{metrics.newToday}</strong> | 30 ngày: <strong>+{metrics.new30Days}</strong>
            </p>
          </div>
        </div>
      </div>

      {/* SECTION: RECENT LOGINS & USER SESSIONS */}
      <div className="bg-white rounded-3xl border border-[#DDD8D2] p-6 md:p-8 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-[#DDD8D2] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <LogIn className="w-5 h-5 text-[#4A2A25]" />
              <h2 className="text-lg font-bold text-[#3A211E]">Lịch Sử Đăng Nhập & Phiên Hoạt Động Của Tài Khoản</h2>
            </div>
            <p className="text-xs text-[#6F625E] mt-1">
              Ghi nhận trực tiếp từ cơ chế xác thực nội bộ của Cupfy, kiểm tra thời điểm truy cập gần nhất của từng thành viên.
            </p>
          </div>
          <Link 
            href="/admin/users" 
            className="text-xs font-bold text-[#4A2A25] hover:underline flex items-center gap-1"
          >
            Quản lý khách hàng <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F6F2] border-b border-[#DDD8D2] text-[#6F625E]">
              <tr>
                <th className="py-3 px-4 font-semibold">Tài Khoản Email</th>
                <th className="py-3 px-4 font-semibold">Trạng Thái Sử Dụng</th>
                <th className="py-3 px-4 font-semibold">Đăng Nhập Gần Nhất</th>
                <th className="py-3 px-4 font-semibold">Ngày Tạo Tài Khoản</th>
                <th className="py-3 px-4 font-semibold text-right">Chi Tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDD8D2]/60">
              {recentLogins.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-[#6F625E]">
                    Chưa có phiên đăng nhập nào được ghi nhận.
                  </td>
                </tr>
              ) : (
                recentLogins.map(user => {
                  const lastSignIn = user.lastSignInAt 
                    ? new Date(user.lastSignInAt).toLocaleString('vi-VN') 
                    : 'Chưa có dữ liệu';
                  const createdAt = new Date(user.createdAt).toLocaleDateString('vi-VN');

                  return (
                    <tr key={user.id} className="hover:bg-[#F7F6F2]/50 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-[#201817]">
                        {user.email}
                      </td>
                      <td className="py-3.5 px-4">
                        {user.status === 'online' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping"></span>
                            Đang trực tuyến
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold bg-[#EDECEA] text-[#6F625E]">
                            Vừa hoạt động gần đây
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-[#4A2A25]">
                        {lastSignIn}
                      </td>
                      <td className="py-3.5 px-4 text-[#6F625E]">
                        {createdAt}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          href="/admin/users"
                          className="px-3 py-1 bg-[#EDECEA] text-[#3A211E] rounded-lg text-[11px] font-semibold hover:bg-[#DDD8D2] transition-colors"
                        >
                          Hồ sơ
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION: TWO COLUMNS (ACTIVITY TIMELINE & CONVERSION FUNNEL) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Column 1: Live Activity Feed */}
        <div className="bg-white rounded-3xl border border-[#DDD8D2] p-6 md:p-8 shadow-sm space-y-5">
          <div className="flex items-center gap-2 border-b border-[#DDD8D2] pb-3">
            <Clock className="w-5 h-5 text-[#4A2A25]" />
            <h3 className="font-bold text-base text-[#3A211E]">Dòng Sự Kiện Hệ Thống Gần Đây</h3>
          </div>

          <div className="space-y-3">
            {activityTimeline.length === 0 ? (
              <div className="p-8 text-center text-[#6F625E] text-xs">
                Chưa có sự kiện nào gần đây.
              </div>
            ) : (
              activityTimeline.map((item, idx) => (
                <div 
                  key={idx} 
                  className="p-3.5 bg-[#F7F6F2] rounded-2xl border border-[#DDD8D2] flex justify-between items-center text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="font-bold text-[#201817]">{item.title}</div>
                    <div className="text-[11px] text-[#6F625E]">{item.detail}</div>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EDECEA] text-[#4A2A25] mb-1">
                      {item.badge}
                    </span>
                    <div className="text-[10px] text-[#6F625E]">
                      {new Date(item.timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Column 2: Internal Conversion Funnel */}
        <div className="bg-white rounded-3xl border border-[#DDD8D2] p-6 md:p-8 shadow-sm space-y-5">
          <div className="flex items-center gap-2 border-b border-[#DDD8D2] pb-3">
            <TrendingUp className="w-5 h-5 text-[#4A2A25]" />
            <h3 className="font-bold text-base text-[#3A211E]">Phễu Tương Tác Khách Hàng Nội Bộ</h3>
          </div>

          <div className="space-y-3.5 text-xs">
            <div className="p-4 bg-[#F7F6F2] rounded-2xl border border-[#DDD8D2] flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-white rounded-xl text-[#4A2A25] shadow-xs">
                  <Eye className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-[#201817]">1. Ghé Thăm & Xem Sản Phẩm</div>
                  <div className="text-[11px] text-[#6F625E]">Lượt khách truy cập cửa hàng</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-black text-sm text-[#201817]">{metrics.estimatedVisitsToday} lượt</div>
                <div className="text-[10px] text-emerald-700 font-bold">100%</div>
              </div>
            </div>

            <div className="p-4 bg-[#F7F6F2] rounded-2xl border border-[#DDD8D2] flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-white rounded-xl text-[#4A2A25] shadow-xs">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-[#201817]">2. Tài Khoản Đăng Nhập / Tương Tác</div>
                  <div className="text-[11px] text-[#6F625E]">Thành viên duyệt & lưu thiết kế ly</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-black text-sm text-[#201817]">{metrics.dailyActiveUsers} user</div>
                <div className="text-[10px] text-emerald-700 font-bold">
                  {Math.round((metrics.dailyActiveUsers / Math.max(metrics.estimatedVisitsToday, 1)) * 100)}%
                </div>
              </div>
            </div>

            <div className="p-4 bg-[#F7F6F2] rounded-2xl border border-[#DDD8D2] flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-white rounded-xl text-[#4A2A25] shadow-xs">
                  <ShoppingCart className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-[#201817]">3. Đơn Hàng Đã Tạo (Orders)</div>
                  <div className="text-[11px] text-[#6F625E]">Khách hàng hoàn tất đặt hàng</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-black text-sm text-[#4A2A25]">{metrics.totalOrders} đơn</div>
                <div className="text-[10px] text-emerald-700 font-bold">
                  {metrics.totalUsers > 0 ? Math.round((metrics.totalOrders / metrics.totalUsers) * 100) : 0}% trên tổng user
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
