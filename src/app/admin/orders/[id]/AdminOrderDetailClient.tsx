"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Clock, CheckCircle2, Truck, AlertCircle, FileText, User, MapPin, Printer, RotateCcw, XCircle, Loader2 } from 'lucide-react';
import { updateOrderStatus } from '@/app/actions/admin';
import { useRouter } from 'next/navigation';

export default function AdminOrderDetailClient({ order: initialOrder }: { order: any }) {
  const router = useRouter();
  const [order, setOrder] = useState(initialOrder);
  const [loading, setLoading] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  const formatVND = (num: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
  };

  const handleUpdate = async (status: string, reason?: string) => {
    setLoading(true);
    try {
      const trackingInfo = reason ? { carrier: 'Hủy đơn: ' + reason } : undefined;
      await updateOrderStatus(order.id, status, trackingInfo);
      setOrder((prev: any) => ({ ...prev, status }));
      router.refresh();
    } catch (err: any) {
      alert('Lỗi cập nhật trạng thái: ' + err.message);
    } finally {
      setLoading(false);
      setCancelModalOpen(false);
    }
  };

  const rawAddress = order.shipping_address || '';
  const addressParts = rawAddress.split('|');
  const deliveryAddress = addressParts[0]?.replace('Địa chỉ:', '').trim() || rawAddress;
  const deliveryPhone = addressParts.find((p: string) => p.includes('SĐT:'))?.replace('SĐT:', '').trim() || order.profiles?.phone_number || 'Chưa cung cấp';
  const deliveryNote = addressParts.find((p: string) => p.includes('Ghi chú:'))?.replace('Ghi chú:', '').trim() || '';

  const formattedCode = `#${order.id.slice(0, 8).toUpperCase()}`;

  return (
    <div className="space-y-8 pb-16">
      {/* Back button & Page title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Link 
          href="/admin/orders" 
          className="inline-flex items-center gap-2 text-sm text-[#6F625E] hover:text-[#3A211E] font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Quay lại danh sách đơn hàng
        </Link>

        <button 
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#DDD8D2] text-[#3A211E] rounded-full text-xs font-bold hover:bg-[#EDECEA] transition-colors shadow-sm"
        >
          <Printer className="w-3.5 h-3.5" /> In phiếu đóng gói
        </button>
      </div>

      {/* Header Card */}
      <div className="bg-white rounded-[28px] p-6 sm:p-8 border border-[#DDD8D2] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="font-mono text-base font-bold text-[#3A211E] bg-[#F7F6F2] px-3.5 py-1 rounded-full border border-[#DDD8D2]">
              {formattedCode}
            </span>
            <span className="text-xs text-[#6F625E]">
              {new Date(order.created_at).toLocaleString('vi-VN')}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-[#3A211E] tracking-tight">
            Chi tiết đơn hàng {formattedCode}
          </h1>
        </div>

        {/* Status Actions */}
        <div className="flex flex-wrap items-center gap-3">
          {order.status === 'pending' && (
            <button
              onClick={() => handleUpdate('confirmed')}
              disabled={loading}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
              Xác nhận đơn hàng
            </button>
          )}

          {order.status === 'confirmed' && (
            <button
              onClick={() => handleUpdate('shipping')}
              disabled={loading}
              className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-full text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Truck className="w-3.5 h-3.5" />}
              Bàn giao vận chuyển
            </button>
          )}

          {order.status === 'shipping' && (
            <button
              onClick={() => handleUpdate('delivered')}
              disabled={loading}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
              Xác nhận đã giao hàng
            </button>
          )}

          {order.status !== 'cancelled' && order.status !== 'delivered' && (
            <button
              onClick={() => setCancelModalOpen(true)}
              disabled={loading}
              className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-full text-xs font-bold transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              <XCircle className="w-3.5 h-3.5" />
              Hủy đơn
            </button>
          )}

          {order.status === 'delivered' && (
            <span className="px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold border border-emerald-200 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> Đã giao thành công
            </span>
          )}

          {order.status === 'cancelled' && (
            <span className="px-4 py-2 bg-rose-100 text-rose-800 rounded-full text-xs font-bold border border-rose-200 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" /> Đã hủy đơn
            </span>
          )}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Products List (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-[28px] p-6 sm:p-8 border border-[#DDD8D2] shadow-sm">
            <h3 className="text-lg font-bold text-[#3A211E] mb-6">
              Sản phẩm trong đơn ({order.order_items?.length || 0})
            </h3>

            <div className="divide-y divide-[#DDD8D2]/70">
              {order.order_items?.map((item: any) => {
                const prod = item.products || {};
                let specs: any = null;
                try {
                  if (prod.description && prod.description.startsWith('{')) {
                    specs = JSON.parse(prod.description);
                  }
                } catch (e) {}

                return (
                  <div key={item.id} className="py-5 first:pt-0 last:pb-0 space-y-4">
                    <div className="flex gap-4 items-start">
                      <div className="relative w-20 h-20 bg-[#F7F6F2] rounded-2xl border border-[#DDD8D2] overflow-hidden shrink-0 flex items-center justify-center p-1.5">
                        {prod.image_url ? (
                          <Image src={prod.image_url} alt="" fill className="object-contain p-1.5" />
                        ) : (
                          <span className="text-xs text-[#6F625E]">No image</span>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-base text-[#3A211E]">{prod.name}</h4>
                        <p className="text-xs text-[#6F625E] mt-0.5">
                          Số lượng: <strong>{item.quantity}</strong> × {formatVND(item.price)} = <strong>{formatVND(item.price * item.quantity)}</strong>
                        </p>
                      </div>
                    </div>

                    {/* Custom Specs Preview for Production */}
                    {specs && (
                      <div className="bg-[#F7F6F2] rounded-2xl p-4 border border-[#DDD8D2] text-xs space-y-2">
                        <p className="font-bold text-[#3A211E] uppercase tracking-wide">
                          Thông số sản xuất ly cá nhân hóa
                        </p>
                        <div className="grid grid-cols-2 gap-2 text-[#6F625E]">
                          <p><strong className="text-[#3A211E]">Kiểu ly:</strong> {specs.modelName || specs.modelType}</p>
                          <p><strong className="text-[#3A211E]">Màu thân ly:</strong> {specs.cupColorName || specs.cupColor}</p>
                          {specs.lidColor && <p><strong className="text-[#3A211E]">Màu nắp:</strong> {specs.lidColor}</p>}
                          {specs.customText && <p><strong className="text-[#3A211E]">Chữ in:</strong> "{specs.customText}" (Font: {specs.font})</p>}
                        </div>

                        {/* Flat Printable Texture for Production */}
                        {specs.printableTexture && (
                          <div className="pt-2 border-t border-[#DDD8D2]">
                            <p className="font-bold text-[#3A211E] mb-1">File in phẳng (Print Sheet):</p>
                            <a 
                              href={specs.printableTexture} 
                              target="_blank" 
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:underline font-bold"
                            >
                              Xem & Tải bản in độ phân giải cao
                            </a>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Customer & Shipping Details (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Customer Card */}
          <div className="bg-white rounded-[28px] p-6 sm:p-7 border border-[#DDD8D2] shadow-sm space-y-4">
            <h3 className="font-bold text-lg text-[#3A211E] flex items-center gap-2">
              <User className="w-5 h-5 text-[#4A2A25]" /> Khách hàng & Người nhận
            </h3>

            <div className="text-sm space-y-2.5">
              <div>
                <span className="text-xs text-[#6F625E] block">Tên người nhận</span>
                <span className="font-bold text-[#3A211E]">{order.buyer_name_snapshot}</span>
              </div>
              <div>
                <span className="text-xs text-[#6F625E] block">Số điện thoại liên hệ</span>
                <span className="font-bold text-[#3A211E]">{deliveryPhone}</span>
              </div>
              <div>
                <span className="text-xs text-[#6F625E] block">Email thông báo</span>
                <span className="text-[#3A211E]">{order.buyer_email_snapshot || 'N/A'}</span>
              </div>
              <div>
                <span className="text-xs text-[#6F625E] block">Địa chỉ giao hàng</span>
                <span className="text-[#3A211E] leading-relaxed block">{deliveryAddress}</span>
              </div>
              {deliveryNote && (
                <div>
                  <span className="text-xs text-[#6F625E] block">Ghi chú</span>
                  <span className="italic text-[#6F625E] block">{deliveryNote}</span>
                </div>
              )}
            </div>
          </div>

          {/* Payment & Total Card */}
          <div className="bg-white rounded-[28px] p-6 sm:p-7 border border-[#DDD8D2] shadow-sm space-y-4">
            <h3 className="font-bold text-lg text-[#3A211E]">
              Thanh toán & Thu tiền
            </h3>

            <div className="p-3.5 rounded-xl bg-[#F7F6F2] border border-[#DDD8D2] flex items-center justify-between">
              <div>
                <p className="font-bold text-sm text-[#3A211E]">Phương thức: COD</p>
                <p className="text-xs text-[#6F625E]">Thu tiền mặt khi giao hàng</p>
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                order.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {order.status === 'delivered' ? 'Đã thanh toán' : 'Chưa thanh toán'}
              </span>
            </div>

            <div className="pt-2 flex justify-between items-baseline border-t border-[#DDD8D2]">
              <span className="font-bold text-base text-[#3A211E]">Tổng số tiền COD</span>
              <span className="text-2xl font-black text-[#3A211E]">
                {formatVND(order.total_price)}
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Cancel Order Modal */}
      {cancelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-[#DDD8D2] shadow-2xl">
            <h3 className="font-bold text-xl text-[#3A211E] mb-2">Xác nhận hủy đơn hàng</h3>
            <p className="text-sm text-[#6F625E] mb-4">
              Vui lòng nhập lý do hủy đơn hàng để lưu vào lịch sử đơn và thông báo đến khách hàng.
            </p>
            <textarea
              required
              rows={3}
              value={cancelReason}
              onChange={e => setCancelReason(e.target.value)}
              placeholder="Ví dụ: Khách hàng yêu cầu hủy, hết nguyên liệu sản xuất..."
              className="w-full p-3 rounded-xl border border-[#DDD8D2] text-sm focus:border-[#3A211E] focus:outline-none mb-6 resize-none"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setCancelModalOpen(false)}
                className="px-5 py-2.5 bg-[#F7F6F2] hover:bg-[#EDECEA] text-[#3A211E] rounded-full text-xs font-bold transition-colors"
              >
                Đóng
              </button>
              <button
                onClick={() => handleUpdate('cancelled', cancelReason)}
                disabled={loading || !cancelReason.trim()}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-full text-xs font-bold transition-colors disabled:opacity-50"
              >
                Xác nhận hủy đơn
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
