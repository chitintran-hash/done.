export const dynamic = 'force-dynamic';

import { fetchRevenueAndProfit } from '@/app/actions/admin';
import RevenueClient from './RevenueClient';
import { TrendingUp } from 'lucide-react';

export default async function AdminRevenuePage({
  searchParams,
}: {
  searchParams?: Promise<{ range?: string }>;
}) {
  const params = await searchParams;
  const range = params?.range || '30d';
  const data = await fetchRevenueAndProfit(range);

  return (
    <div className="space-y-8 pb-12">
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-[#E8DFD8] shadow-xs flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#3A211E] tracking-wide uppercase bg-[#FFF3C4] px-3 py-1 rounded-full w-fit mb-3 border border-[#E8DFD8]">
            Financial Accounting
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-[#3A211E] tracking-tight">
            Quản Lý & Phân Tích Doanh Thu
          </h1>
          <p className="text-sm text-[#765B52] mt-1.5">
            Báo cáo doanh số bán lẻ D2C, các khoản hoàn trả, dòng tiền thực thu và phân bổ theo danh mục sản phẩm.
          </p>
        </div>
      </div>

      <RevenueClient initialData={data} />
    </div>
  );
}
