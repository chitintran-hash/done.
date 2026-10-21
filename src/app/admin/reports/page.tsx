export const dynamic = 'force-dynamic';

import { 
  fetchAdminOrders, 
  fetchAdminProducts, 
  fetchAdminCustomers, 
  fetchRevenueAndProfit 
} from '@/app/actions/admin';
import ReportsClient from './ReportsClient';
import { FileText } from 'lucide-react';

export default async function AdminReportsPage() {
  const [orders, products, customers, financials] = await Promise.all([
    fetchAdminOrders(),
    fetchAdminProducts(),
    fetchAdminCustomers(),
    fetchRevenueAndProfit('all')
  ]);

  return (
    <div className="space-y-8 pb-12">
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-[#E8DFD8] shadow-xs flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#3A211E] tracking-wide uppercase bg-[#FFF3C4] px-3 py-1 rounded-full w-fit mb-3 border border-[#E8DFD8]">
            Data Export & Compliance
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-[#3A211E] tracking-tight">
            Trung Tâm Báo Cáo & Xuất Dữ Liệu
          </h1>
          <p className="text-sm text-[#765B52] mt-1.5">
            Tổng hợp báo cáo bán hàng, doanh thu, lợi nhuận, tồn kho và xuất file CSV tương thích chuẩn Excel tiếng Việt.
          </p>
        </div>
      </div>

      <ReportsClient 
        orders={orders}
        products={products}
        customers={customers}
        financials={financials}
      />
    </div>
  );
}
