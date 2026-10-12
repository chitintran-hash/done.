export const dynamic = 'force-dynamic';

import { fetchInventory } from '@/app/actions/admin';
import InventoryClient from './InventoryClient';
import { Layers } from 'lucide-react';

export default async function AdminInventoryPage() {
  const { inventoryList, historyLogs } = await fetchInventory();

  return (
    <div className="space-y-8 pb-12">
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-[#DDD8D2] shadow-sm flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#4A2A25] tracking-wide uppercase bg-[#FFF3A6] px-3 py-1 rounded-full w-fit mb-3 border border-[#DDD8D2]">
            D2C Inventory Engine
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-[#3A211E] tracking-tight">
            Quản Lý Kho Hàng & Phôi Ly
          </h1>
          <p className="text-sm text-[#6F625E] mt-1.5">
            Kiểm soát tồn kho vật lý, số lượng đang giữ chỗ cho đơn hàng, định mức giá vốn và lịch sử xuất nhập kho.
          </p>
        </div>
      </div>

      <InventoryClient 
        initialInventory={inventoryList} 
        initialLogs={historyLogs} 
      />
    </div>
  );
}
