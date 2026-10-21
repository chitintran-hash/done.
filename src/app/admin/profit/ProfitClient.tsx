"use client";

import { useState } from 'react';
import { 
  PieChart, 
  Plus, 
  Trash2, 
  AlertTriangle, 
  CheckCircle2, 
  DollarSign, 
  TrendingUp, 
  Layers, 
  ShieldAlert,
  X,
  FileSpreadsheet
} from 'lucide-react';
import { addOperatingExpense, deleteOperatingExpense } from '@/app/actions/admin';

export default function ProfitClient({ initialData }: { initialData: any }) {
  const [data, setData] = useState(initialData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);

  // Expense form
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState<number>(500000);
  const [category, setCategory] = useState('advertising');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState('');

  const formatVND = (num: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
  };

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || amount <= 0) {
      alert("Vui lòng điền tiêu đề và số tiền hợp lệ");
      return;
    }

    setLoadingAction(true);
    try {
      await addOperatingExpense({
        title,
        amount,
        category,
        date,
        notes,
        adminUser: 'Admin Cupfy'
      });
      alert("Đã thêm chi phí vận hành thành công!");
      window.location.reload();
    } catch (e: any) {
      alert("Lỗi: " + e.message);
    }
    setLoadingAction(false);
  };

  const handleDeleteExpense = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa khoản chi phí này?")) return;
    try {
      await deleteOperatingExpense(id);
      setData((prev: any) => ({
        ...prev,
        expensesList: prev.expensesList.filter((e: any) => e.id !== id),
        operatingExpenses: prev.operatingExpenses - (prev.expensesList.find((e: any) => e.id === id)?.price || 0)
      }));
    } catch (e: any) {
      alert("Lỗi: " + e.message);
    }
  };

  return (
    <div className="space-y-8">
      {/* Missing Cost Price Alert */}
      {data.hasMissingCosts && (
        <div className="bg-[#FFF9E8] border border-[#FFBF00]/40 rounded-3xl p-6 text-xs text-[#3A211E] flex items-start gap-4 shadow-xs">
          <div className="p-2.5 bg-[#FFF3C4] rounded-2xl text-[#3A211E] shrink-0">
            <AlertTriangle className="w-5 h-5 text-[#3A211E]" />
          </div>
          <div className="space-y-1">
            <div className="font-bold text-sm text-[#3A211E]">
              Cảnh báo kiểm toán: Chưa đủ dữ liệu giá vốn (COGS)
            </div>
            <p className="text-[#765B52] leading-relaxed">
              Hệ thống phát hiện có <strong>{data.missingCostCount}</strong> sản phẩm bán ra chưa được nhập Giá Vốn (Cost Price) trong trang Sản phẩm. Để tuân thủ nguyên tắc kế toán trung thực, hệ thống không tự ý bịa đặt chi phí vốn. Vui lòng vào trang <strong>Sản phẩm</strong> và cập nhật Giá Vốn cho từng mẫu ly để tính Lợi Nhuận Gộp và Lợi Nhuận Ròng chính xác 100%.
            </p>
          </div>
        </div>
      )}

      {/* Financial Profit Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Doanh thu thuần */}
        <div className="bg-white p-6 rounded-3xl border border-[#E8DFD8] shadow-xs">
          <div className="text-xs font-bold text-[#765B52] uppercase tracking-wider">Doanh Thu Thuần (Net Sales)</div>
          <div className="text-2xl font-black text-[#3A211E] mt-2">{formatVND(data.netSales)}</div>
          <p className="text-xs text-[#765B52] mt-2">Gross Sales sau trừ hoàn trả</p>
        </div>

        {/* Giá vốn hàng bán (COGS) */}
        <div className="bg-white p-6 rounded-3xl border border-[#E8DFD8] shadow-xs">
          <div className="text-xs font-bold text-[#765B52] uppercase tracking-wider">Giá Vốn Hàng Bán (COGS)</div>
          <div className="text-2xl font-black text-[#3A211E] mt-2">{formatVND(data.cogs)}</div>
          <p className="text-xs text-[#765B52] mt-2">Tiền phôi ly, in ấn & gia công</p>
        </div>

        {/* Lợi nhuận gộp */}
        <div className="bg-white p-6 rounded-3xl border border-[#E8DFD8] shadow-xs">
          <div className="text-xs font-bold text-[#765B52] uppercase tracking-wider">Lợi Nhuận Gộp (Gross Profit)</div>
          <div className={`text-2xl font-black mt-2 ${data.hasMissingCosts ? 'text-amber-800 text-lg' : 'text-teal-800'}`}>
            {data.hasMissingCosts ? "Chưa đủ dữ liệu" : formatVND(data.grossProfit)}
          </div>
          <div className="text-xs text-[#765B52] mt-2 flex items-center justify-between">
            <span>Tỷ suất Gross Margin:</span>
            <span className="font-bold text-[#3A211E]">{data.hasMissingCosts ? '--' : `${data.grossMargin}%`}</span>
          </div>
        </div>

        {/* Lợi nhuận ròng */}
        <div className="bg-white p-6 rounded-3xl border border-[#E8DFD8] shadow-xs">
          <div className="text-xs font-bold text-[#765B52] uppercase tracking-wider">Lợi Nhuận Ròng (Net Profit)</div>
          <div className={`text-2xl font-black mt-2 ${data.hasMissingCosts ? 'text-amber-800 text-lg' : 'text-[#3A211E]'}`}>
            {data.hasMissingCosts ? "Chưa đủ dữ liệu" : formatVND(data.netProfit)}
          </div>
          <div className="text-xs text-[#765B52] mt-2 flex items-center justify-between">
            <span>Tỷ suất Net Margin:</span>
            <span className="font-bold text-[#3A211E]">{data.hasMissingCosts ? '--' : `${data.netMargin}%`}</span>
          </div>
        </div>
      </div>

      {/* Operating Expenses Section */}
      <div className="bg-white rounded-3xl border border-[#E8DFD8] p-6 md:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-lg font-bold text-[#3A211E]">Sổ Chi Phí Vận Hành (Operating Expenses)</h3>
            <p className="text-xs text-[#765B52] mt-0.5">
              Ghi nhận chi phí quảng cáo (Facebook/TikTok Ads), bao bì hộp quà, phí cổng thanh toán và kho bãi
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="text-right hidden sm:block">
              <div className="text-xs text-[#765B52]">Tổng chi phí:</div>
              <div className="font-black text-sm text-[#3A211E]">{formatVND(data.operatingExpenses)}</div>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#FFBF00] text-[#3A211E] rounded-xl text-xs font-bold hover:bg-[#FFBF00]/90 shadow-xs w-full sm:w-auto"
            >
              <Plus className="w-4 h-4" /> Ghi Nhận Chi Phí Mới
            </button>
          </div>
        </div>

        {/* Expenses Table */}
        {data.expensesList.length === 0 ? (
          <div className="p-12 text-center text-[#765B52] bg-[#FFF9E8] rounded-2xl border border-dashed border-[#E8DFD8] text-xs">
            Chưa có khoản chi phí vận hành nào được ghi nhận. Nhấn nút bên trên để thêm chi phí thực tế.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FFF9E8] border-b border-[#E8DFD8] text-[#765B52]">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Tên Khoản Chi</th>
                  <th className="py-3.5 px-4 font-semibold">Danh Mục</th>
                  <th className="py-3.5 px-4 font-semibold">Ngày Ghi Nhận</th>
                  <th className="py-3.5 px-4 font-semibold">Số Tiền</th>
                  <th className="py-3.5 px-4 font-semibold">Ghi Chú</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8DFD8]">
                {data.expensesList.map((exp: any) => {
                  const specs = exp.technical_specs || {};
                  return (
                    <tr key={exp.id} className="hover:bg-[#FFF9E8]/40">
                      <td className="py-3.5 px-4 font-bold text-[#3A211E]">{exp.name}</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-0.5 rounded-full bg-[#FFF3C4] text-[#3A211E] text-[11px] font-bold">
                          {specs.expenseCategory === 'advertising' ? 'Quảng cáo (Ads)' :
                           specs.expenseCategory === 'packaging' ? 'Bao bì / Đóng gói' :
                           specs.expenseCategory === 'shipping' ? 'Cước vận chuyển' :
                           specs.expenseCategory === 'processing' ? 'Phí thanh toán' : 'Vận hành khác'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-[#765B52]">
                        {specs.expenseDate || new Date(exp.created_at).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="py-3.5 px-4 font-black text-rose-700 text-sm">
                        -{formatVND(Number(exp.price) || 0)}
                      </td>
                      <td className="py-3.5 px-4 text-[#765B52]">
                        {specs.notes || exp.description || '--'}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleDeleteExpense(exp.id)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Xóa khoản chi"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ADD EXPENSE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <form onSubmit={handleAddExpense} className="bg-white rounded-3xl max-w-md w-full border border-[#E8DFD8] shadow-2xl p-6 space-y-4 text-xs">
            <div className="flex justify-between items-center border-b border-[#E8DFD8] pb-3">
              <h3 className="font-bold text-[#3A211E] text-base">Thêm Chi Phí Vận Hành Mới</h3>
              <button type="button" onClick={() => setIsModalOpen(false)} className="text-[#765B52] hover:text-[#3A211E]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="font-bold text-[#3A211E] block mb-1">Tên khoản chi:</label>
              <input 
                type="text" 
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="VD: Tiền chạy quảng cáo Meta Ads tuần 1..."
                className="w-full p-2.5 bg-[#FFF9E8] border border-[#E8DFD8] rounded-xl text-xs font-semibold text-[#3A211E] placeholder-[#765B52]/60 focus:outline-none focus:border-[#FFBF00]"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-[#3A211E] block mb-1">Danh mục chi phí:</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full p-2.5 bg-[#FFF9E8] border border-[#E8DFD8] rounded-xl text-xs font-medium text-[#3A211E] focus:outline-none focus:border-[#FFBF00]"
                >
                  <option value="advertising">Quảng cáo (Ads)</option>
                  <option value="packaging">Bao bì / Hộp quà</option>
                  <option value="shipping">Vận chuyển / Bù cước</option>
                  <option value="processing">Phí cổng thanh toán</option>
                  <option value="operating">Vận hành / Mặt bằng</option>
                  <option value="other">Chi phí khác</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-[#3A211E] block mb-1">Số tiền (VNĐ):</label>
                <input 
                  type="number" 
                  min="1000"
                  step="1000"
                  value={amount}
                  onChange={e => setAmount(Number(e.target.value))}
                  className="w-full p-2.5 bg-[#FFF9E8] border border-[#E8DFD8] rounded-xl text-xs font-bold text-[#3A211E] focus:outline-none focus:border-[#FFBF00]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-[#3A211E] block mb-1">Ngày ghi nhận:</label>
              <input 
                type="date" 
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full p-2.5 bg-[#FFF9E8] border border-[#E8DFD8] rounded-xl text-xs text-[#3A211E] focus:outline-none focus:border-[#FFBF00]"
                required
              />
            </div>

            <div>
              <label className="font-bold text-[#3A211E] block mb-1">Ghi chú / Chứng từ:</label>
              <textarea 
                rows={2}
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="VD: Hóa đơn quảng cáo thanh toán qua thẻ..."
                className="w-full p-2.5 bg-[#FFF9E8] border border-[#E8DFD8] rounded-xl text-xs text-[#3A211E] placeholder-[#765B52]/60 focus:outline-none focus:border-[#FFBF00]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#E8DFD8]">
              <button 
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-[#FFF3C4] text-[#3A211E] rounded-xl font-bold hover:bg-[#FFBF00]/30 transition-colors"
              >
                Hủy
              </button>
              <button 
                type="submit"
                disabled={loadingAction}
                className="px-5 py-2 bg-[#FFBF00] text-[#3A211E] rounded-xl font-bold hover:bg-[#FFBF00]/90 shadow-xs"
              >
                {loadingAction ? 'Đang lưu...' : 'Lưu Khoản Chi'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
