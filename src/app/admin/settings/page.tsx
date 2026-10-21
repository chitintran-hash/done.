export const dynamic = 'force-dynamic';

import { 
  Settings, 
  Store, 
  Globe, 
  Truck, 
  Bell, 
  ShieldCheck, 
  Save, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

export default function AdminSettingsPage() {
  const isGA4Configured = Boolean(process.env.GA4_PROPERTY_ID);

  return (
    <div className="space-y-8 pb-12">
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-[#E8DFD8] shadow-xs flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#3A211E] tracking-wide uppercase bg-[#FFF3C4] px-3 py-1 rounded-full w-fit mb-3 border border-[#E8DFD8]">
            D2C System Configuration
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-[#3A211E] tracking-tight">
            Cài Đặt Hệ Thống Cupfy
          </h1>
          <p className="text-sm text-[#765B52] mt-1.5">
            Cấu hình thông tin thương hiệu, tích hợp Google Analytics 4, chính sách giao hàng và cảnh báo tồn kho.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Settings Forms */}
        <div className="lg:col-span-2 space-y-6">
          {/* Brand Info */}
          <div className="bg-white rounded-3xl border border-[#E8DFD8] p-6 md:p-8 shadow-xs space-y-4 text-xs">
            <div className="flex items-center gap-3 border-b border-[#E8DFD8] pb-3">
              <Store className="w-5 h-5 text-[#3A211E]" />
              <h3 className="font-bold text-sm text-[#3A211E]">Thông Tin Thương Hiệu Cupfy</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-[#3A211E] block mb-1">Tên cửa hàng:</label>
                <input 
                  type="text" 
                  defaultValue="Cupfy - Canva Cho Ly" 
                  className="w-full p-2.5 bg-[#FFF9E8] border border-[#E8DFD8] rounded-xl font-medium text-[#3A211E] focus:outline-none focus:border-[#FFBF00]"
                />
              </div>

              <div>
                <label className="font-bold text-[#3A211E] block mb-1">Hotline CSKH:</label>
                <input 
                  type="text" 
                  defaultValue="0916 799 627" 
                  className="w-full p-2.5 bg-[#FFF9E8] border border-[#E8DFD8] rounded-xl font-medium text-[#3A211E] focus:outline-none focus:border-[#FFBF00]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-bold text-[#3A211E] block mb-1">Địa chỉ kho xuất hàng & xưởng in:</label>
                <input 
                  type="text" 
                  defaultValue="KDC Phong Phú 4, Xã Phong Phú, Huyện Bình Chánh, TP. Hồ Chí Minh" 
                  className="w-full p-2.5 bg-[#FFF9E8] border border-[#E8DFD8] rounded-xl font-medium text-[#3A211E] focus:outline-none focus:border-[#FFBF00]"
                />
              </div>

              <div>
                <label className="font-bold text-[#3A211E] block mb-1">Email quản trị viên:</label>
                <input 
                  type="email" 
                  defaultValue="tranchitin2006@gmail.com" 
                  disabled
                  className="w-full p-2.5 bg-[#FFF3C4]/50 text-[#765B52] border border-[#E8DFD8] rounded-xl font-medium cursor-not-allowed"
                />
              </div>

              <div>
                <label className="font-bold text-[#3A211E] block mb-1">Tên miền chính thức:</label>
                <input 
                  type="text" 
                  defaultValue="cupfy.space" 
                  disabled
                  className="w-full p-2.5 bg-[#FFF3C4]/50 text-[#765B52] border border-[#E8DFD8] rounded-xl font-medium cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Shipping Defaults */}
          <div className="bg-white rounded-3xl border border-[#E8DFD8] p-6 md:p-8 shadow-xs space-y-4 text-xs">
            <div className="flex items-center gap-3 border-b border-[#E8DFD8] pb-3">
              <Truck className="w-5 h-5 text-[#3A211E]" />
              <h3 className="font-bold text-sm text-[#3A211E]">Cấu Hình Giao Vận & Đóng Gói</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-[#3A211E] block mb-1">Cước vận chuyển tiêu chuẩn:</label>
                <input 
                  type="number" 
                  defaultValue="30000" 
                  className="w-full p-2.5 bg-[#FFF9E8] border border-[#E8DFD8] rounded-xl font-bold text-[#3A211E] focus:outline-none focus:border-[#FFBF00]"
                />
              </div>

              <div>
                <label className="font-bold text-[#3A211E] block mb-1">Miễn phí vận chuyển từ đơn:</label>
                <input 
                  type="number" 
                  defaultValue="300000" 
                  className="w-full p-2.5 bg-[#FFF9E8] border border-[#E8DFD8] rounded-xl font-bold text-[#3A211E] focus:outline-none focus:border-[#FFBF00]"
                />
              </div>

              <div>
                <label className="font-bold text-[#3A211E] block mb-1">Thời gian in ấn & gia công:</label>
                <input 
                  type="text" 
                  defaultValue="1 - 2 ngày làm việc" 
                  className="w-full p-2.5 bg-[#FFF9E8] border border-[#E8DFD8] rounded-xl font-medium text-[#3A211E] focus:outline-none focus:border-[#FFBF00]"
                />
              </div>

              <div>
                <label className="font-bold text-[#3A211E] block mb-1">Ngưỡng cảnh báo tồn kho tối thiểu:</label>
                <input 
                  type="number" 
                  defaultValue="10" 
                  className="w-full p-2.5 bg-[#FFF9E8] border border-[#E8DFD8] rounded-xl font-bold text-[#3A211E] focus:outline-none focus:border-[#FFBF00]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Integrations Status */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-[#E8DFD8] p-6 shadow-xs space-y-4 text-xs">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-[#3A211E]" />
              <h3 className="font-bold text-sm text-[#3A211E]">Hệ Thống Theo Dõi Nội Bộ</h3>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#FFF9E8] border border-[#E8DFD8] space-y-2 text-[#3A211E]">
              <div className="flex items-center justify-between">
                <span className="font-bold">Theo dõi lưu lượng:</span>
                <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-emerald-100 text-emerald-800">
                  NATIVE TRACKING
                </span>
              </div>
              <p className="text-[11px] text-[#765B52]">
                Hệ thống tự động ghi nhận lượt ra vào, tài khoản hoạt động và phiên đăng nhập trực tiếp, không phụ thuộc dịch vụ bên ngoài.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#FFF9E8] border border-[#E8DFD8] space-y-2 text-[#3A211E]">
              <div className="flex items-center justify-between">
                <span className="font-bold">Database Supabase:</span>
                <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-emerald-100 text-emerald-800">
                  HOẠT ĐỘNG
                </span>
              </div>
              <p className="text-[11px] text-[#765B52]">
                Cơ sở dữ liệu đám mây PostgreSQL tại Supabase kết nối qua Service Role Key an toàn.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#FFF9E8] border border-[#E8DFD8] space-y-2 text-[#3A211E]">
              <div className="flex items-center justify-between">
                <span className="font-bold">Cổng Vận Chuyển:</span>
                <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-[#FFF3C4] text-[#3A211E]">
                  MANUAL MODE
                </span>
              </div>
              <p className="text-[11px] text-[#765B52]">
                Admin tự nhập mã vận đơn và phân bổ hãng vận chuyển thực tế khi bàn giao hàng.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-[#FFF9E8] border border-[#FFBF00]/40 text-xs text-[#3A211E] space-y-2">
            <div className="font-bold text-[#3A211E] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#FFBF00]" /> Bảo Mật Quản Trị
            </div>
            <p className="text-[#765B52] leading-relaxed">
              Mọi quyền hạn truy cập các báo cáo doanh thu, lợi nhuận và cơ sở dữ liệu khách hàng được bảo vệ nghiêm ngặt ở tầng Server Side Actions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
