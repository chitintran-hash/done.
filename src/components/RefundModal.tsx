import React, { useState } from 'react';
import { Order, RefundRequest } from '../types';
import { formatVND } from '../utils/pricing';
import { AlertCircle, X, ShieldAlert } from 'lucide-react';

interface RefundModalProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
  onSubmitRefund: (request: RefundRequest) => void;
}

export const RefundModal: React.FC<RefundModalProps> = ({
  order,
  isOpen,
  onClose,
  onSubmitRefund,
}) => {
  const [reason, setReason] = useState<string>('Product unavailable');
  const [detail, setDetail] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newReq: RefundRequest = {
      id: `rf-${Date.now()}`,
      orderId: order.id,
      userId: order.userId,
      reason: detail.trim() ? `${reason}: ${detail.trim()}` : reason,
      status: 'requested',
      createdAt: new Date().toISOString(),
    };
    onSubmitRefund(newReq);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative overflow-hidden transform transition-all">
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div>
            <span className="text-[11px] font-black uppercase text-rose-600 tracking-wider block">
              YÊU CẦU HOÀN TIỀN (SIMULATED REFUND)
            </span>
            <h3 className="text-base font-black text-slate-900 mt-0.5">{order.productName}</h3>
            <p className="text-xs text-slate-400">
              Đơn hàng {order.id} • Số tiền: <strong>{formatVND(order.totalAmount)}</strong>
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="py-5 space-y-4">
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-start space-x-2">
            <ShieldAlert className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
            <span>
              <strong>Lưu ý học thuật:</strong> Quy trình hoàn tiền (Refund flow) trong phiên bản này là mô phỏng luồng nghiệp vụ trên hệ thống, không phát sinh giao dịch ngân hàng thực tế.
            </span>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Lý do yêu cầu hoàn tiền</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:border-rose-500 bg-white"
            >
              <option value="Supplier cancelled">Nhà cung cấp đã hủy đợt gom (Supplier cancelled)</option>
              <option value="Product unavailable">Hàng bị thiếu hoặc hết tồn kho tại kho gom (Product unavailable)</option>
              <option value="Pickup issue">Locker không mở / trục trặc tại điểm nhận (Pickup issue)</option>
              <option value="Wrong item">Giao nhầm sản phẩm hoặc hư hỏng (Wrong item)</option>
              <option value="Other">Lý do khác (Other)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Mô tả thêm (tùy chọn)</label>
            <textarea
              rows={3}
              placeholder="Cung cấp thêm thông tin chi tiết để quản trị viên đối chiếu..."
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:border-rose-500"
            />
          </div>

          <div className="pt-2 flex items-center space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="w-1/3 py-3 rounded-xl border border-slate-300 font-bold text-xs text-slate-700 hover:bg-slate-100 transition"
            >
              Đóng
            </button>
            <button
              type="submit"
              className="w-2/3 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition shadow-md shadow-rose-600/20 active:scale-98"
            >
              GỬI YÊU CẦU HOÀN TIỀN
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
