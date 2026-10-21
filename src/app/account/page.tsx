import Link from 'next/link';
import { Package, Heart, Settings, User } from 'lucide-react';

export default function AccountPage() {
  return (
    <div className="min-h-screen pt-32 pb-20 bg-white">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-3xl font-extrabold text-[#3A211E] mb-8">Tài khoản của bạn</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/orders" className="bg-white p-6 rounded-2xl border border-[#E8DFD8] hover:border-[#FFBF00] transition-all hover:shadow-md flex items-start gap-4 group">
            <div className="w-12 h-12 bg-[#FFF9E8] rounded-full flex items-center justify-center shrink-0 group-hover:bg-[#FFBF00] transition-colors">
              <Package className="w-6 h-6 text-[#3A211E]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#3A211E] mb-1">Đơn hàng của tôi</h3>
              <p className="text-[#765B52] text-sm">Xem lịch sử mua hàng, theo dõi đơn hàng và trạng thái sản xuất ly thiết kế của bạn.</p>
            </div>
          </Link>
          
          <Link href="/wishlist" className="bg-white p-6 rounded-2xl border border-[#E8DFD8] hover:border-[#FFBF00] transition-all hover:shadow-md flex items-start gap-4 group">
            <div className="w-12 h-12 bg-[#FFF9E8] rounded-full flex items-center justify-center shrink-0 group-hover:bg-[#FFBF00] transition-colors">
              <Heart className="w-6 h-6 text-[#3A211E]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#3A211E] mb-1">Sản phẩm yêu thích</h3>
              <p className="text-[#765B52] text-sm">Danh sách các mẫu ly và ý tưởng thiết kế bạn đã lưu lại để mua sau.</p>
            </div>
          </Link>

          <div className="bg-white p-6 rounded-2xl border border-[#E8DFD8] opacity-70 flex items-start gap-4 cursor-not-allowed">
            <div className="w-12 h-12 bg-[#FFF9E8] rounded-full flex items-center justify-center shrink-0">
              <User className="w-6 h-6 text-[#765B52]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#765B52] mb-1">Thông tin cá nhân</h3>
              <p className="text-[#765B52] text-sm">Cập nhật tên, email và số điện thoại giao hàng mặc định. (Sắp ra mắt)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
