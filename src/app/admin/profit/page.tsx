export const dynamic = 'force-dynamic';

import { fetchRevenueAndProfit } from '@/app/actions/admin';
import ProfitClient from './ProfitClient';
import { PieChart } from 'lucide-react';

export default async function AdminProfitPage() {
  const data = await fetchRevenueAndProfit('all');

  return (
    <div className="space-y-8 pb-12">
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-[#DDD8D2] shadow-sm flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#4A2A25] tracking-wide uppercase bg-[#FFF3A6] px-3 py-1 rounded-full w-fit mb-3 border border-[#DDD8D2]">
            D2C Profit & Cost Accounting
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-[#3A211E] tracking-tight">
            Quản Lý Chi Phí & Lợi Nhuận
          </h1>
          <p className="text-sm text-[#6F625E] mt-1.5">
            Tính toán lợi nhuận gộp (Gross Profit) và lợi nhuận ròng (Net Profit) dựa trên giá vốn thực tế và sổ chi phí vận hành.
          </p>
        </div>
      </div>

      <ProfitClient initialData={data} />
    </div>
  );
}
