export const dynamic = 'force-dynamic';

import { fetchShippingOrders } from '@/app/actions/admin';
import ShippingClient from './ShippingClient';
import { Truck } from 'lucide-react';

export default async function AdminShippingPage() {
  const data = await fetchShippingOrders();

  return (
    <div className="space-y-8 pb-12">
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-[#DDD8D2] shadow-sm flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#4A2A25] tracking-wide uppercase bg-[#FFF3A6] px-3 py-1 rounded-full w-fit mb-3 border border-[#DDD8D2]">
            Fulfillment & Delivery
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-[#3A211E] tracking-tight">
            Quản Lý Vận Chuyển & Giao Hàng
          </h1>
          <p className="text-sm text-[#6F625E] mt-1.5">
            Theo dõi từng chặng hoàn tất đơn hàng: từ đóng gói, bàn giao hãng vận chuyển đến phát hàng thành công.
          </p>
        </div>
      </div>

      <ShippingClient initialData={data} />
    </div>
  );
}
