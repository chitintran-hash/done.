"use client";

import { useState } from 'react';
import { 
  Truck, 
  Package, 
  CheckCircle2, 
  RotateCcw, 
  AlertCircle, 
  Search, 
  ExternalLink, 
  Edit3, 
  X,
  Clock,
  Send
} from 'lucide-react';
import { updateOrderStatus } from '@/app/actions/admin';

export default function ShippingClient({ initialData }: { initialData: any }) {
  const [data, setData] = useState(initialData);
  const [activeTab, setActiveTab] = useState<'queue' | 'packing' | 'handed' | 'shipping' | 'delivered' | 'returned'>('queue');
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  // Fulfillment update state
  const [carrier, setCarrier] = useState('Giao Hàng Nhanh (GHN)');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [shippingFee, setShippingFee] = useState<number>(30000);
  const [loadingAction, setLoadingAction] = useState(false);

  const formatVND = (num: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
  };

  const currentList = 
    activeTab === 'queue' ? data.packingQueue :
    activeTab === 'packing' ? data.packaging :
    activeTab === 'handed' ? data.handedToCarrier :
    activeTab === 'shipping' ? data.inTransit :
    activeTab === 'delivered' ? data.delivered :
    data.returned;

  const handleUpdateFulfillment = async (orderId: string, nextStatus: string) => {
    setLoadingAction(true);
    try {
      await updateOrderStatus(orderId, nextStatus, {
        carrier,
        trackingNumber,
        shippingFee
      });
      alert(`Đã cập nhật trạng thái đơn #${orderId.slice(0, 8)} sang: ${nextStatus}!`);
      window.location.reload();
    } catch (e: any) {
      alert("Lỗi: " + e.message);
    }
    setLoadingAction(false);
  };

  return (
    <div className="space-y-6">
      {/* Shipping Statistics Header */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#E8DFD8] shadow-xs">
          <div className="text-xs font-semibold text-[#765B52] uppercase tracking-wider">Tổng Đơn Đã Gửi</div>
          <div className="text-2xl font-black text-[#3A211E] mt-1">{data.stats.totalShipped} đơn</div>
          <p className="text-xs text-[#765B52] mt-1.5">Bao gồm đang giao & đã nhận</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8DFD8] shadow-xs">
          <div className="text-xs font-semibold text-[#765B52] uppercase tracking-wider">Giao Thành Công</div>
          <div className="text-2xl font-black text-emerald-800 mt-1">{data.stats.totalDelivered} đơn</div>
          <p className="text-xs text-[#765B52] mt-1.5">Khách đã nhận hàng</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8DFD8] shadow-xs">
          <div className="text-xs font-semibold text-[#765B52] uppercase tracking-wider">Đơn Hoàn Trả</div>
          <div className="text-2xl font-black text-rose-800 mt-1">{data.stats.totalReturned} đơn</div>
          <p className="text-xs text-[#765B52] mt-1.5">Giao thất bại hoặc hoàn lại</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8DFD8] shadow-xs">
          <div className="text-xs font-semibold text-[#765B52] uppercase tracking-wider">Tổng Cước Vận Chuyển</div>
          <div className="text-2xl font-black text-[#3A211E] mt-1">{formatVND(data.stats.totalShippingFees)}</div>
          <p className="text-xs text-[#765B52] mt-1.5">Ghi nhận từ các đơn giao vận</p>
        </div>
      </div>

      {/* Manual Status Notice */}
      <div className="p-4 rounded-2xl bg-[#FFF9E8] border border-[#FFBF00]/40 text-xs text-[#3A211E] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-[#FFBF00]" />
          <span>
            Hệ thống đang hoạt động ở chế độ <strong>Cập Nhật Vận Chuyển Thủ Công</strong> (Chưa kết nối webhook tự động của đơn vị vận chuyển bên thứ 3).
          </span>
        </div>
        <span className="font-bold text-[11px] bg-[#FFF3C4] px-2.5 py-1 rounded-full text-[#3A211E]">
          Manual Mode
        </span>
      </div>

      {/* Fulfillment Tabs */}
      <div className="flex border-b border-[#E8DFD8] space-x-2 md:space-x-6 overflow-x-auto">
        {[
          { key: 'queue', label: `Chờ Đóng Gói (${data.packingQueue.length})` },
          { key: 'packing', label: `Đang Đóng Gói (${data.packaging.length})` },
          { key: 'handed', label: `Đã Bàn Giao Hãng (${data.handedToCarrier.length})` },
          { key: 'shipping', label: `Đang Giao Hàng (${data.inTransit.length})` },
          { key: 'delivered', label: `Đã Giao Thành Công (${data.delivered.length})` },
          { key: 'returned', label: `Hoàn Trả (${data.returned.length})` },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key as any)}
            className={`pb-3 text-xs md:text-sm font-bold whitespace-nowrap border-b-2 transition-colors ${
              activeTab === t.key 
                ? 'border-[#FFBF00] text-[#3A211E]' 
                : 'border-transparent text-[#765B52] hover:text-[#3A211E]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Orders List in Current Stage */}
      <div className="bg-white rounded-3xl border border-[#E8DFD8] shadow-xs overflow-hidden p-6">
        {currentList.length === 0 ? (
          <div className="p-12 text-center text-[#765B52]">
            <Package className="w-10 h-10 mx-auto mb-2 opacity-40 text-[#3A211E]" />
            <div className="font-bold text-sm text-[#3A211E]">Không có đơn hàng nào ở chặng này</div>
          </div>
        ) : (
          <div className="space-y-4">
            {currentList.map((order: any) => (
              <div key={order.id} className="p-5 rounded-2xl bg-[#FFF9E8] border border-[#E8DFD8] flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-sm text-[#3A211E]">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </span>
                    <span className="font-bold text-[#3A211E] text-sm">
                      {order.buyer_name_snapshot || 'Khách vãng lai'}
                    </span>
                    <span className="text-[11px] text-[#765B52]">
                      ({new Date(order.created_at).toLocaleDateString('vi-VN')})
                    </span>
                  </div>

                  <div className="text-[#765B52]">
                    <strong>Địa chỉ:</strong> {order.cleanAddress}
                  </div>

                  <div className="flex flex-wrap gap-4 text-[11px] pt-1 text-[#765B52]">
                    <div><strong>Hãng vận chuyển:</strong> {order.carrier}</div>
                    <div><strong>Mã vận đơn:</strong> <code className="bg-white px-1.5 py-0.5 rounded border border-[#E8DFD8] font-mono text-[#3A211E]">{order.trackingNumber}</code></div>
                    <div><strong>Cước vận chuyển:</strong> {formatVND(order.shippingFee || 0)}</div>
                  </div>
                </div>

                {/* Next Stage Transition Action */}
                <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                  {order.status === 'confirmed' && (
                    <button
                      onClick={() => handleUpdateFulfillment(order.id, 'packaging')}
                      className="px-4 py-2 bg-[#FFBF00] text-[#3A211E] rounded-xl font-bold hover:bg-[#FFBF00]/90 shadow-xs"
                    >
                      Bắt Đầu Đóng Gói
                    </button>
                  )}

                  {order.status === 'packaging' && (
                    <button
                      onClick={() => {
                        setSelectedOrder(order);
                        setCarrier('Giao Hàng Nhanh (GHN)');
                        setTrackingNumber(`GHN-${Math.floor(10000000 + Math.random() * 90000000)}`);
                      }}
                      className="px-4 py-2 bg-[#3A211E] text-white rounded-xl font-bold hover:bg-[#3A211E]/90 shadow-xs"
                    >
                      Bàn Giao Shipper
                    </button>
                  )}

                  {order.status === 'handed_to_carrier' && (
                    <button
                      onClick={() => handleUpdateFulfillment(order.id, 'shipping')}
                      className="px-4 py-2 bg-[#FFBF00] text-[#3A211E] rounded-xl font-bold hover:bg-[#FFBF00]/90 shadow-xs"
                    >
                      Xác Nhận Đang Giao
                    </button>
                  )}

                  {order.status === 'shipping' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdateFulfillment(order.id, 'delivered')}
                        className="px-3.5 py-2 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700"
                      >
                        Giao Thành Công
                      </button>
                      <button
                        onClick={() => handleUpdateFulfillment(order.id, 'returned')}
                        className="px-3.5 py-2 bg-rose-600 text-white rounded-xl font-bold hover:bg-rose-700"
                      >
                        Hoàn Trả / Thất Bại
                      </button>
                    </div>
                  )}

                  {['delivered', 'completed', 'returned'].includes(order.status) && (
                    <span className="px-3 py-1.5 bg-white border border-[#E8DFD8] rounded-xl font-bold text-[#765B52]">
                      Hoàn Tất Chặng
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SHIPPER HANDOVER MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full border border-[#E8DFD8] shadow-2xl p-6 space-y-4 text-xs">
            <div className="flex justify-between items-center border-b border-[#E8DFD8] pb-3">
              <h3 className="font-bold text-[#3A211E] text-base">Bàn Giao Vận Chuyển: #{selectedOrder.id.slice(0, 8)}</h3>
              <button onClick={() => setSelectedOrder(null)} className="text-[#765B52] hover:text-[#3A211E]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="font-bold text-[#3A211E] block mb-1">Đơn vị vận chuyển:</label>
              <select
                value={carrier}
                onChange={e => setCarrier(e.target.value)}
                className="w-full p-2.5 bg-[#FFF9E8] border border-[#E8DFD8] text-[#3A211E] rounded-xl font-medium focus:outline-none focus:border-[#FFBF00]"
              >
                <option value="Giao Hàng Nhanh (GHN)">Giao Hàng Nhanh (GHN)</option>
                <option value="Viettel Post">Viettel Post</option>
                <option value="Giao Hàng Tiết Kiệm (GHTK)">Giao Hàng Tiết Kiệm (GHTK)</option>
                <option value="Shopee Express (SPX)">Shopee Express (SPX)</option>
                <option value="J&T Express">J&T Express</option>
                <option value="Hỏa Tốc Nội Thành (Ahamove/Grab)">Hỏa Tốc Nội Thành (Ahamove/Grab)</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-[#3A211E] block mb-1">Mã vận đơn (Tracking Code):</label>
              <input 
                type="text" 
                value={trackingNumber}
                onChange={e => setTrackingNumber(e.target.value)}
                placeholder="VD: GHN-12345678"
                className="w-full p-2.5 bg-[#FFF9E8] border border-[#E8DFD8] text-[#3A211E] rounded-xl font-mono text-xs font-bold focus:outline-none focus:border-[#FFBF00]"
                required
              />
            </div>

            <div>
              <label className="font-bold text-[#3A211E] block mb-1">Cước vận chuyển thanh toán cho nhà xe/hãng (VNĐ):</label>
              <input 
                type="number" 
                value={shippingFee}
                onChange={e => setShippingFee(Number(e.target.value))}
                className="w-full p-2.5 bg-[#FFF9E8] border border-[#E8DFD8] text-[#3A211E] rounded-xl font-bold focus:outline-none focus:border-[#FFBF00]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#E8DFD8]">
              <button 
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 bg-[#FFF3C4] text-[#3A211E] rounded-xl font-bold hover:bg-[#FFBF00]/30"
              >
                Hủy
              </button>
              <button 
                type="button"
                disabled={loadingAction}
                onClick={() => handleUpdateFulfillment(selectedOrder.id, 'handed_to_carrier')}
                className="px-5 py-2 bg-[#FFBF00] text-[#3A211E] rounded-xl font-bold hover:bg-[#FFBF00]/90 shadow-xs"
              >
                {loadingAction ? 'Đang lưu...' : 'Xác Nhận Bàn Giao'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
