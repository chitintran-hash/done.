"use client";

import { useState } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  RotateCcw, 
  Truck, 
  CreditCard, 
  Calendar, 
  PieChart as PieIcon,
  Download,
  ArrowUpRight,
  Sparkles,
  Loader2
} from 'lucide-react';
import { fetchRevenueAndProfit } from '@/app/actions/admin';

export default function RevenueClient({ 
  initialData, 
  initialRange = '30d' 
}: { 
  initialData: any;
  initialRange?: string;
}) {
  const [data, setData] = useState(initialData);
  const [dateRange, setDateRange] = useState(initialRange);
  const [isLoading, setIsLoading] = useState(false);

  const formatVND = (num: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num || 0);
  };

  const handleRangeChange = async (key: string) => {
    if (key === dateRange && !isLoading) return;
    setDateRange(key);
    setIsLoading(true);
    try {
      const freshData = await fetchRevenueAndProfit(key);
      setData(freshData);
      window.history.replaceState(null, '', `/admin/revenue?range=${key}`);
    } catch (err) {
      console.error('Error fetching revenue:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportCSV = () => {
    const headers = ["Chỉ Số Doanh Thu", "Giá Trị (VNĐ)", "Ghi Chú Kế Toán"];
    const rows = [
      ["Tổng Doanh Số Gộp (Gross Sales)", data.grossSales, "Tổng giá trị đơn hàng hợp lệ"],
      ["Tiền Hoàn Trả (Refunds)", data.refunds, "Các đơn hàng hoàn trả"],
      ["Doanh Thu Thuần (Net Sales)", data.netSales, "Gross Sales trừ Refunds"],
      ["Doanh Thu Vận Chuyển (Shipping)", data.shippingRevenue, "Thu từ phí giao hàng"],
      ["Tổng Thực Thu (Collected Revenue)", data.totalCollected, "Dòng tiền bán lẻ thực tế"],
      ["Doanh Thu Phôi Ly Custom", data.customDesignOptions?.customBaseCupRevenue || 0, "Tiền phôi ly thiết kế"],
      ["Doanh Thu Phí In Chữ / Khắc Tên", data.customDesignOptions?.customTextRevenue || 0, "Phí in chữ"],
      ["Doanh Thu Phí In Ảnh / Logo", data.customDesignOptions?.customImageRevenue || 0, "Phí in ảnh"],
      ["Doanh Thu Phí Sticker", data.customDesignOptions?.customStickerRevenue || 0, "Phí sticker"],
      ["Doanh Thu Phụ Kiện Hộp Quà", data.customDesignOptions?.customAddonsRevenue || 0, "Phụ kiện hộp quà, thiệp"]
    ];

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Cupfy_Doanh_Thu_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      {/* Date Filter & Export Header */}
      <div className="bg-white p-5 rounded-3xl border border-[#E8DFD8] shadow-xs flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { key: 'today', label: 'Hôm nay' },
            { key: '7d', label: '7 ngày qua' },
            { key: '30d', label: '30 ngày qua' },
            { key: '90d', label: '90 ngày qua' },
            { key: 'year', label: 'Năm nay' },
            { key: 'all', label: 'Toàn bộ thời gian' }
          ].map(b => (
            <button
              key={b.key}
              onClick={() => handleRangeChange(b.key)}
              disabled={isLoading}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                dateRange === b.key
                  ? 'bg-[#FFBF00] text-[#3A211E] font-bold shadow-xs'
                  : 'bg-[#FFF9E8] border border-[#E8DFD8] text-[#765B52] hover:bg-[#FFF3C4]'
              }`}
            >
              {isLoading && dateRange === b.key && (
                <Loader2 className="w-3 h-3 animate-spin text-[#3A211E]" />
              )}
              <span>{b.label}</span>
            </button>
          ))}
        </div>

        <button 
          onClick={handleExportCSV}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-[#FFF3C4] text-[#3A211E] border border-[#E8DFD8] rounded-xl text-xs font-bold hover:bg-[#FFBF00]/30 transition-colors shadow-xs cursor-pointer"
        >
          <Download className="w-4 h-4" />
          Xuất Báo Cáo Kế Toán
        </button>
      </div>

      {/* Accounting KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-3xl border border-[#E8DFD8] shadow-xs">
          <div className="flex justify-between items-start mb-3">
            <span className="text-xs font-bold text-[#765B52] uppercase tracking-wider">Tổng Doanh Số Gộp</span>
            <div className="p-2 bg-[#FFF3C4] text-[#3A211E] rounded-xl"><DollarSign className="w-4 h-4" /></div>
          </div>
          <div className="text-2xl font-black text-[#3A211E]">{formatVND(data.grossSales)}</div>
          <p className="text-xs text-[#765B52] mt-2">Gross Sales từ toàn bộ đơn hàng hợp lệ</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#E8DFD8] shadow-xs">
          <div className="flex justify-between items-start mb-3">
            <span className="text-xs font-bold text-[#765B52] uppercase tracking-wider">Tiền Hoàn Trả (Refunds)</span>
            <div className="p-2 bg-rose-100 text-rose-800 rounded-xl"><RotateCcw className="w-4 h-4" /></div>
          </div>
          <div className="text-2xl font-black text-rose-700">{formatVND(data.refunds)}</div>
          <p className="text-xs text-[#765B52] mt-2">Các đơn hoàn hàng hoặc lỗi</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#E8DFD8] shadow-xs">
          <div className="flex justify-between items-start mb-3">
            <span className="text-xs font-bold text-[#765B52] uppercase tracking-wider">Doanh Thu Thuần</span>
            <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl"><TrendingUp className="w-4 h-4" /></div>
          </div>
          <div className="text-2xl font-black text-emerald-800">{formatVND(data.netSales)}</div>
          <p className="text-xs text-[#765B52] mt-2">Net Sales = Gross Sales - Refunds</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#E8DFD8] shadow-xs">
          <div className="flex justify-between items-start mb-3">
            <span className="text-xs font-bold text-[#765B52] uppercase tracking-wider">Tổng Thực Thu</span>
            <div className="p-2 bg-[#FFBF00] text-[#3A211E] rounded-xl"><CreditCard className="w-4 h-4" /></div>
          </div>
          <div className="text-2xl font-black text-[#3A211E]">{formatVND(data.totalCollected)}</div>
          <p className="text-xs text-[#765B52] mt-2">Dòng tiền bán lẻ thực tế nhận được</p>
        </div>
      </div>

      {/* Doanh Thu Từ Các Tùy Chọn Thiết Kế Ly (Custom Studio Options Breakdown) */}
      <div className="bg-white rounded-3xl border border-[#E8DFD8] p-6 md:p-8 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E8DFD8]/60 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-[#FFF3C4] text-[#3A211E] rounded-lg">
                <Sparkles className="w-4 h-4 text-[#D97706]" />
              </span>
              <h3 className="text-lg font-bold text-[#3A211E]">
                Doanh Thu Tùy Chọn Thiết Kế Ly (Custom Studio)
              </h3>
            </div>
            <p className="text-xs text-[#765B52] mt-1">
              Phân tích doanh số từ phôi ly, phí in chữ, phí in ảnh/logo màu và phụ kiện hộp quà/thiệp
            </p>
          </div>
          <div className="sm:text-right bg-[#FFF9E8] px-4 py-2 rounded-2xl border border-[#E8DFD8]">
            <span className="text-[10px] font-bold text-[#765B52] uppercase block">Tổng Doanh Thu Custom</span>
            <span className="text-xl font-black text-[#3A211E]">
              {formatVND(data.customDesignOptions?.totalCustomRevenue || 0)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {/* Phôi ly thiết kế */}
          <div className="p-4 rounded-2xl bg-[#FFF9E8] border border-[#E8DFD8] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#765B52]">Phôi Ly Thiết Kế</span>
              <span className="text-base">🥛</span>
            </div>
            <div className="text-lg font-black text-[#3A211E] mt-3">
              {formatVND(data.customDesignOptions?.customBaseCupRevenue || 0)}
            </div>
            <div className="text-[11px] text-[#765B52] mt-1">Theo dáng ly khách chọn</div>
          </div>

          {/* Phí in chữ / Khắc tên */}
          <div className="p-4 rounded-2xl bg-[#FFF9E8] border border-[#E8DFD8] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#765B52]">In Chữ / Khắc Tên</span>
              <span className="text-base">✍️</span>
            </div>
            <div className="text-lg font-black text-[#3A211E] mt-3">
              {formatVND(data.customDesignOptions?.customTextRevenue || 0)}
            </div>
            <div className="text-[11px] text-[#765B52] mt-1">Phí 15.000₫ / đơn có chữ</div>
          </div>

          {/* Phí in hình ảnh / Logo */}
          <div className="p-4 rounded-2xl bg-[#FFF9E8] border border-[#E8DFD8] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#765B52]">In Ảnh / Logo Màu</span>
              <span className="text-base">🖼️</span>
            </div>
            <div className="text-lg font-black text-[#3A211E] mt-3">
              {formatVND(data.customDesignOptions?.customImageRevenue || 0)}
            </div>
            <div className="text-[11px] text-[#765B52] mt-1">Phí 20.000₫ / đơn có ảnh</div>
          </div>

          {/* Phí sticker trang trí */}
          <div className="p-4 rounded-2xl bg-[#FFF9E8] border border-[#E8DFD8] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#765B52]">Sticker Trang Trí</span>
              <span className="text-base">✨</span>
            </div>
            <div className="text-lg font-black text-[#3A211E] mt-3">
              {formatVND(data.customDesignOptions?.customStickerRevenue || 0)}
            </div>
            <div className="text-[11px] text-[#765B52] mt-1">Kèm in chữ hoặc dán riêng</div>
          </div>

          {/* Hộp quà & Phụ kiện */}
          <div className="p-4 rounded-2xl bg-[#FFF9E8] border border-[#E8DFD8] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#765B52]">Hộp Quà & Phụ Kiện</span>
              <span className="text-base">🎁</span>
            </div>
            <div className="text-lg font-black text-[#3A211E] mt-3">
              {formatVND(data.customDesignOptions?.customAddonsRevenue || 0)}
            </div>
            <div className="text-[11px] text-[#765B52] mt-1">Hộp quà, thiệp, túi giấy</div>
          </div>
        </div>
      </div>

      {/* Revenue Over Time Chart & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-[#E8DFD8] p-6 md:p-8 shadow-xs space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-[#3A211E]">Xu Hướng Doanh Thu Theo Ngày</h3>
              <p className="text-xs text-[#765B52]">Dữ liệu đơn hàng thực tế ghi nhận qua từng ngày</p>
            </div>
            <span className="text-xs font-bold text-[#3A211E] bg-[#FFF3C4] px-3 py-1 rounded-full border border-[#E8DFD8]">
              Doanh Thu Thực
            </span>
          </div>

          {data.timelineData.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-xs text-[#765B52] bg-[#FFF9E8] rounded-2xl border border-dashed border-[#E8DFD8]">
              Chưa có dữ liệu giao dịch trong khoảng thời gian này.
            </div>
          ) : (
            <div className="space-y-4">
              <div className="h-48 flex items-end gap-3 pt-8 pb-2 px-4 bg-[#FFF9E8] rounded-2xl border border-[#E8DFD8]">
                {data.timelineData.map((t: any, i: number) => {
                  const max = Math.max(...data.timelineData.map((d: any) => d.revenue), 1);
                  const heightPct = Math.max(10, Math.round((t.revenue / max) * 100));
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                      <div className="text-[10px] font-bold text-[#3A211E] opacity-0 group-hover:opacity-100 transition-opacity">
                        {formatVND(t.revenue)}
                      </div>
                      <div 
                        style={{ height: `${heightPct}%` }}
                        className="w-full bg-[#FFBF00] rounded-t-lg transition-all hover:bg-[#FFBF00]/80"
                      />
                      <div className="text-[10px] font-medium text-[#765B52] truncate">{t.date}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Category Breakdown */}
        <div className="bg-white rounded-3xl border border-[#E8DFD8] p-6 md:p-8 shadow-xs space-y-6">
          <div>
            <h3 className="text-lg font-bold text-[#3A211E]">Doanh Thu Theo Danh Mục Ly</h3>
            <p className="text-xs text-[#765B52]">Phân bổ theo dòng sản phẩm bán ra</p>
          </div>

          <div className="space-y-3">
            {Object.keys(data.categoryBreakdown).length === 0 ? (
              <div className="p-8 text-center text-xs text-[#765B52]">Chưa có dữ liệu danh mục</div>
            ) : (
              Object.entries(data.categoryBreakdown).map(([cat, amount]: [string, any], i) => (
                <div key={i} className="p-3.5 rounded-2xl bg-[#FFF9E8] border border-[#E8DFD8] flex justify-between items-center text-xs">
                  <div>
                    <div className="font-bold text-[#3A211E] uppercase">{cat === 'glass' ? 'Ly Thủy Tinh' : cat === 'user_custom' ? 'Ly Custom Studio' : cat}</div>
                    <div className="text-[11px] text-[#765B52]">Dòng sản phẩm Cupfy</div>
                  </div>
                  <div className="font-black text-sm text-[#3A211E]">
                    {formatVND(amount)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
