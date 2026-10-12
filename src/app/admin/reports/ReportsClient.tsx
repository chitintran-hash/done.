"use client";

import { useState } from 'react';
import { 
  FileText, 
  Download, 
  Calendar, 
  Filter, 
  Table, 
  CheckCircle2, 
  Printer, 
  TrendingUp, 
  DollarSign, 
  Box, 
  Users 
} from 'lucide-react';

export default function ReportsClient({
  orders,
  products,
  customers,
  financials
}: {
  orders: any[];
  products: any[];
  customers: any[];
  financials: any;
}) {
  const [reportType, setReportType] = useState('sales');
  const [dateRange, setDateRange] = useState('30d');

  const formatVND = (num: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
  };

  const handleExportCSV = () => {
    let headers: string[] = [];
    let rows: any[][] = [];
    let filename = `Cupfy_Bao_Cao_${reportType}_${new Date().toISOString().slice(0, 10)}.csv`;

    if (reportType === 'sales' || reportType === 'orders') {
      headers = ["Mã Đơn", "Ngày Đặt", "Khách Hàng", "Email", "Tổng Tiền (VNĐ)", "Trạng Thái"];
      rows = orders.map(o => [
        `#${o.id.slice(0, 8).toUpperCase()}`,
        new Date(o.created_at).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }),
        `"${o.buyer_name_snapshot || 'Khách vãng lai'}"`,
        o.buyer_email_snapshot || '',
        o.total_price,
        o.status
      ]);
    } else if (reportType === 'inventory') {
      headers = ["Mã SKU", "Tên Sản Phẩm", "Danh Mục", "Tồn Vật Lý", "Giá Vốn (VNĐ)", "Giá Bán (VNĐ)", "Giá Trị Tồn Kho (VNĐ)"];
      rows = products.map(p => [
        `"${p.sku || p.id.slice(0, 6)}"`,
        `"${p.name.replace(/"/g, '""')}"`,
        p.category,
        p.stock,
        p.technical_specs?.cost_price || 0,
        p.price,
        (p.stock || 0) * (p.technical_specs?.cost_price || p.price || 0)
      ]);
    } else if (reportType === 'customers') {
      headers = ["Mã Khách", "Họ Tên", "Email", "Số ĐT", "Tổng Đơn", "Tổng Chi Tiêu (VNĐ)"];
      rows = customers.map(c => [
        c.id.slice(0, 8),
        `"${c.name}"`,
        c.email,
        c.phoneNumber,
        c.totalOrders,
        c.totalSpent
      ]);
    } else if (reportType === 'revenue' || reportType === 'profit') {
      headers = ["Khoản Mục Kế Toán", "Số Tiền (VNĐ)", "Ghi Chú"];
      rows = [
        ["Doanh Số Bán Hàng Gộp (Gross Sales)", financials.grossSales, "Đã loại trừ đơn hủy"],
        ["Tiền Hoàn Trả (Refunds)", financials.refunds, "Các đơn hoàn tiền"],
        ["Doanh Thu Thuần (Net Sales)", financials.netSales, "Gross Sales trừ Refunds"],
        ["Giá Vốn Hàng Bán (COGS)", financials.cogs, "Giá vốn phôi ly & in ấn"],
        ["Lợi Nhuận Gộp (Gross Profit)", financials.grossProfit, "Net Sales trừ COGS"],
        ["Chi Phí Vận Hành (OpEx)", financials.operatingExpenses, "Quảng cáo, bao bì, kho bãi"],
        ["Lợi Nhuận Ròng (Net Profit)", financials.netProfit, "Lợi nhuận sau toàn bộ chi phí"]
      ];
    }

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Report Type Selector & Controls */}
      <div className="bg-white p-5 rounded-3xl border border-[#DDD8D2] shadow-sm flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'sales', label: 'Báo Cáo Bán Hàng', icon: TrendingUp },
            { key: 'revenue', label: 'Báo Cáo Doanh Thu', icon: DollarSign },
            { key: 'profit', label: 'Báo Cáo Lợi Nhuận', icon: DollarSign },
            { key: 'inventory', label: 'Báo Cáo Tồn Kho', icon: Box },
            { key: 'orders', label: 'Báo Cáo Đơn Hàng', icon: FileText },
            { key: 'customers', label: 'Báo Cáo Khách Hàng', icon: Users },
          ].map(r => {
            const Icon = r.icon;
            return (
              <button
                key={r.key}
                onClick={() => setReportType(r.key)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  reportType === r.key
                    ? 'bg-[#4A2A25] text-white shadow-sm'
                    : 'bg-[#F7F6F2] border border-[#DDD8D2] text-[#6F625E] hover:bg-[#EDECEA]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {r.label}
              </button>
            );
          })}
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-[#EDECEA] text-[#3A211E] rounded-xl text-xs font-bold hover:bg-[#DDD8D2] transition-colors shadow-sm shrink-0"
        >
          <Download className="w-4 h-4" /> Xuất File CSV (UTF-8 BOM)
        </button>
      </div>

      {/* Report Preview Data Table */}
      <div className="bg-white rounded-3xl border border-[#DDD8D2] shadow-sm overflow-hidden p-6 space-y-4">
        <div className="flex justify-between items-center border-b border-[#DDD8D2] pb-4">
          <div>
            <h3 className="text-base font-bold text-[#3A211E]">Xem Trước Báo Cáo Trực Tiếp</h3>
            <p className="text-xs text-[#6F625E]">Múi giờ chuẩn: Asia/Ho_Chi_Minh (GMT+7)</p>
          </div>
          <span className="text-xs font-mono font-bold bg-[#F7F6F2] px-3 py-1 rounded-full border border-[#DDD8D2]">
            {new Date().toLocaleDateString('vi-VN')}
          </span>
        </div>

        <div className="overflow-x-auto">
          {reportType === 'sales' || reportType === 'orders' ? (
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7F6F2] border-b border-[#DDD8D2] text-[#6F625E]">
                <tr>
                  <th className="py-3 px-4 font-semibold">Mã Đơn</th>
                  <th className="py-3 px-4 font-semibold">Ngày Đặt</th>
                  <th className="py-3 px-4 font-semibold">Khách Hàng</th>
                  <th className="py-3 px-4 font-semibold">Tổng Tiền</th>
                  <th className="py-3 px-4 font-semibold">Trạng Thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DDD8D2]/60">
                {orders.map((o: any) => (
                  <tr key={o.id}>
                    <td className="py-3 px-4 font-mono font-bold text-[#4A2A25]">#{o.id.slice(0, 8).toUpperCase()}</td>
                    <td className="py-3 px-4 text-[#6F625E]">{new Date(o.created_at).toLocaleString('vi-VN')}</td>
                    <td className="py-3 px-4 font-medium text-[#201817]">{o.buyer_name_snapshot || 'Khách vãng lai'}</td>
                    <td className="py-3 px-4 font-bold text-[#201817]">{formatVND(o.total_price)}</td>
                    <td className="py-3 px-4 font-semibold text-[#4A2A25]">{o.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : reportType === 'inventory' ? (
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7F6F2] border-b border-[#DDD8D2] text-[#6F625E]">
                <tr>
                  <th className="py-3 px-4 font-semibold">SKU</th>
                  <th className="py-3 px-4 font-semibold">Tên Sản Phẩm</th>
                  <th className="py-3 px-4 font-semibold">Tồn Kho</th>
                  <th className="py-3 px-4 font-semibold">Giá Bán</th>
                  <th className="py-3 px-4 font-semibold">Giá Trị Tồn</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DDD8D2]/60">
                {products.map((p: any) => (
                  <tr key={p.id}>
                    <td className="py-3 px-4 font-mono font-bold text-[#4A2A25]">{p.sku || p.id.slice(0, 6)}</td>
                    <td className="py-3 px-4 font-medium text-[#201817]">{p.name}</td>
                    <td className="py-3 px-4 font-bold text-[#201817]">{p.stock} cái</td>
                    <td className="py-3 px-4">{formatVND(p.price)}</td>
                    <td className="py-3 px-4 font-bold text-[#4A2A25]">{formatVND((p.stock || 0) * (p.price || 0))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : reportType === 'customers' ? (
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7F6F2] border-b border-[#DDD8D2] text-[#6F625E]">
                <tr>
                  <th className="py-3 px-4 font-semibold">Tên Khách</th>
                  <th className="py-3 px-4 font-semibold">Email</th>
                  <th className="py-3 px-4 font-semibold">Số Đơn</th>
                  <th className="py-3 px-4 font-semibold">Tổng Chi Tiêu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DDD8D2]/60">
                {customers.map((c: any) => (
                  <tr key={c.id}>
                    <td className="py-3 px-4 font-medium text-[#201817]">{c.name}</td>
                    <td className="py-3 px-4 text-[#6F625E]">{c.email}</td>
                    <td className="py-3 px-4 font-bold text-[#201817]">{c.totalOrders} đơn</td>
                    <td className="py-3 px-4 font-black text-[#4A2A25]">{formatVND(c.totalSpent)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7F6F2] border-b border-[#DDD8D2] text-[#6F625E]">
                <tr>
                  <th className="py-3 px-4 font-semibold">Chỉ Số Kế Toán</th>
                  <th className="py-3 px-4 font-semibold">Số Tiền Thực Tế</th>
                  <th className="py-3 px-4 font-semibold">Diễn Giải</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DDD8D2]/60">
                <tr>
                  <td className="py-3 px-4 font-bold">Tổng Doanh Số Gộp (Gross Sales)</td>
                  <td className="py-3 px-4 font-black text-[#201817]">{formatVND(financials.grossSales)}</td>
                  <td className="py-3 px-4 text-[#6F625E]">Tổng tiền đặt hàng từ các đơn không hủy</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold">Doanh Thu Thuần (Net Sales)</td>
                  <td className="py-3 px-4 font-black text-emerald-800">{formatVND(financials.netSales)}</td>
                  <td className="py-3 px-4 text-[#6F625E]">Gross Sales trừ đơn hoàn trả (Refunds)</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold">Giá Vốn Hàng Bán (COGS)</td>
                  <td className="py-3 px-4 font-black text-[#4A2A25]">{formatVND(financials.cogs)}</td>
                  <td className="py-3 px-4 text-[#6F625E]">Giá vốn phôi ly từ xưởng</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold">Chi Phí Vận Hành (OpEx)</td>
                  <td className="py-3 px-4 font-black text-rose-700">-{formatVND(financials.operatingExpenses)}</td>
                  <td className="py-3 px-4 text-[#6F625E]">Chi phí quảng cáo, bao bì và vận hành đã ghi nhận</td>
                </tr>
                <tr className="bg-[#FFF3A6]/20 font-bold">
                  <td className="py-3.5 px-4 text-[#3A211E] text-sm">LỢI NHUẬN RÒNG (NET PROFIT)</td>
                  <td className="py-3.5 px-4 font-black text-base text-[#4A2A25]">{formatVND(financials.netProfit)}</td>
                  <td className="py-3.5 px-4 text-[#6F625E]">Lợi nhuận thực tế thu về sau tất cả chi phí</td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
