export const dynamic = 'force-dynamic';

import { fetchAdminOrders } from '@/app/actions/admin';
import OrdersClient from './OrdersClient';
import { ShoppingCart } from 'lucide-react';

export default async function AdminOrdersPage() {
  const orders = await fetchAdminOrders();

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-[#DDD8D2] shadow-sm flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#4A2A25] tracking-wide uppercase bg-[#FFF3A6] px-3 py-1 rounded-full w-fit mb-3 border border-[#DDD8D2]">
            D2C Direct Orders
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-[#3A211E] tracking-tight">
            Quản Lý Đơn Hàng Cupfy
          </h1>
          <p className="text-sm text-[#6F625E] mt-1.5">
            Theo dõi, xử lý và cập nhật tiến độ giao hàng cho khách hàng bán lẻ trực tiếp.
          </p>
        </div>
      </div>

      {/* Orders Client Table */}
      <OrdersClient initialOrders={orders} />
    </div>
  );
}
