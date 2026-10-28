import React, { useState } from 'react';
import type { Product, ProductReportReason } from '../types';
import { X, AlertTriangle, ShieldAlert } from 'lucide-react';

interface ProductReportModalProps {
  product: Product | null;
  roomId?: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmitReport: (reason: ProductReportReason, description: string) => void;
}

export const ProductReportModal: React.FC<ProductReportModalProps> = ({
  product,
  isOpen,
  onClose,
  onSubmitReport,
}) => {
  const [reason, setReason] = useState<ProductReportReason>('incorrect_information');
  const [description, setDescription] = useState<string>('');

  if (!isOpen || !product) return null;

  const reasonOptions: { value: ProductReportReason; label: string }[] = [
    { value: 'unsafe_product', label: 'Sản phẩm không an toàn (Unsafe product)' },
    { value: 'incorrect_information', label: 'Thông tin nhãn/mô tả không chính xác (Incorrect information)' },
    { value: 'expired_product', label: 'Sản phẩm hết hạn / cận hạn bất thường (Expired product)' },
    { value: 'counterfeit_suspicion', label: 'Nghi ngờ hàng giả / xâm phạm SHTT (Counterfeit suspicion)' },
    { value: 'prohibited_product', label: 'Hàng hóa thuộc danh mục cấm kinh doanh (Prohibited product)' },
    { value: 'missing_origin_information', label: 'Thiếu thông tin xuất xứ / đơn vị chịu trách nhiệm (Missing origin)' },
    { value: 'other', label: 'Lý do khác (Other)' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;
    onSubmitReport(reason, description.trim());
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 text-xs">
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-rose-600 block">
                GIÁM SÁT AN TOÀN & NHÃN HÀNG HÓA (NĐ 111/2021 & NĐ 15/2018)
              </span>
              <h3 className="text-base font-black text-slate-900">Báo cáo sản phẩm</h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">
              Sản phẩm đang báo cáo
            </span>
            <div className="font-bold text-slate-900 text-sm mt-0.5">{product.name}</div>
            <div className="text-[11px] text-slate-500">
              Mã SP: {product.id} • Xuất xứ: {product.origin || 'Chưa kê khai'}
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1.5">
              Lý do báo cáo vi phạm / an toàn sản phẩm *
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value as ProductReportReason)}
              className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-semibold text-slate-800 focus:outline-none focus:border-rose-500"
            >
              {reasonOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1.5">
              Mô tả chi tiết dấu hiệu vi phạm hoặc thiếu thông tin *
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ví dụ: Sản phẩm thực phẩm chưa hiển thị số bản tự công bố hoặc thiếu cảnh báo dị ứng..."
              className="w-full p-3 rounded-xl border border-slate-300 focus:outline-none focus:border-rose-500"
            />
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2 text-[11px] text-amber-900">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              Báo cáo sẽ được chuyển trực tiếp tới <strong>Admin Compliance Dashboard</strong> để kiểm tra, yêu cầu Nhà cung cấp giải trình chứng từ hoặc tạm ẩn sản phẩm.
            </span>
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-md transition"
            >
              Gửi báo cáo tới Admin
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
