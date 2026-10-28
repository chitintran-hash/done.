import React, { useState } from 'react';
import { Order, Review } from '../types';
import { Star, X, Check, MessageSquare } from 'lucide-react';

interface ReviewModalProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
  onSubmitReview: (newReview: Review) => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  order,
  isOpen,
  onClose,
  onSubmitReview,
}) => {
  const [productRating, setProductRating] = useState<number>(5);
  const [supplierRating, setSupplierRating] = useState<number>(5);
  const [pickupRating, setPickupRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRev: Review = {
      id: `rev-${Date.now()}`,
      orderId: order.id,
      userId: order.userId,
      supplierId: order.supplierId || 'supplier-profile-demo',
      productRating,
      supplierRating,
      pickupRating,
      comment: comment.trim() || undefined,
      createdAt: new Date().toISOString(),
    };
    onSubmitReview(newRev);
  };

  const renderStarSelector = (value: number, onChange: (v: number) => void) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="p-1 text-slate-300 hover:text-amber-400 focus:outline-none transition"
          >
            <Star
              className={`w-6 h-6 ${
                star <= value ? 'text-amber-400 fill-amber-400' : 'text-slate-200'
              }`}
            />
          </button>
        ))}
        <span className="text-xs font-bold text-slate-600 pl-2">{value}/5</span>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative overflow-hidden transform transition-all">
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div>
            <span className="text-[11px] font-black uppercase text-emerald-600 tracking-wider block">
              ĐÁNH GIÁ ĐƠN HÀNG HOÀN TẤT
            </span>
            <h3 className="text-base font-black text-slate-900 mt-0.5">{order.productName}</h3>
            <p className="text-xs text-slate-400">Mã đơn: {order.id}</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="py-5 space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              1. Chất lượng sản phẩm (Product Quality)
            </label>
            {renderStarSelector(productRating, setProductRating)}
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              2. Trách nhiệm nhà cung cấp (Supplier Service)
            </label>
            {renderStarSelector(supplierRating, setSupplierRating)}
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              3. Trải nghiệm nhận hàng tại Locker (Pickup Experience)
            </label>
            {renderStarSelector(pickupRating, setPickupRating)}
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Nhận xét / Ý kiến đóng góp (tùy chọn)
            </label>
            <textarea
              rows={3}
              placeholder="Chia sẻ cảm nhận về giá thành, chất lượng và trải nghiệm nhận hàng..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="pt-2 flex items-center space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="w-1/3 py-3 rounded-xl border border-slate-300 font-bold text-xs text-slate-700 hover:bg-slate-100 transition"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="w-2/3 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs transition shadow-md shadow-emerald-600/20 flex items-center justify-center space-x-1.5 active:scale-98"
            >
              <Check className="w-4 h-4" />
              <span>GỬI ĐÁNH GIÁ</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
