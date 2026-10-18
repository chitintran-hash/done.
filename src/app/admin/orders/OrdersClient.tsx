"use client";

import { useState } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Check, 
  X, 
  Truck, 
  Package, 
  ChevronDown, 
  AlertCircle,
  ExternalLink,
  Printer,
  RotateCcw
} from 'lucide-react';
import { updateOrderStatus } from '@/app/actions/admin';

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  status: string;
  product_id?: string;
  products?: {
    id: string;
    name: string;
    image_url: string;
    description: string;
    category: string;
    technical_specs: any;
  };
}

interface Order {
  id: string;
  created_at: string;
  total_price: number;
  status: string;
  buyer_name_snapshot?: string;
  buyer_email_snapshot?: string;
  shipping_address?: string;
  profiles?: any;
  order_items: any[];
}

const ORDER_STATUS_MAP: Record<string, { label: string; color: string }> = {
  pending: { label: "Chờ xác nhận", color: "bg-amber-100 text-amber-800 border-amber-200" },
  confirmed: { label: "Đã xác nhận", color: "bg-blue-100 text-blue-800 border-blue-200" },
  design_review: { label: "Đang kiểm tra thiết kế", color: "bg-purple-100 text-purple-800 border-purple-200" },
  design_rejected: { label: "Yêu cầu chỉnh sửa", color: "bg-orange-100 text-orange-800 border-orange-200" },
  in_production: { label: "Đang sản xuất", color: "bg-indigo-100 text-indigo-800 border-indigo-200" },
  quality_check: { label: "Đang kiểm tra chất lượng", color: "bg-teal-100 text-teal-800 border-teal-200" },
  packaging: { label: "Đang đóng gói", color: "bg-cyan-100 text-cyan-800 border-cyan-200" },
  handed_to_carrier: { label: "Đã bàn giao vận chuyển", color: "bg-orange-100 text-orange-800 border-orange-200" },
  shipping: { label: "Đang giao hàng", color: "bg-sky-100 text-sky-800 border-sky-200" },
  delivered: { label: "Đã giao thành công", color: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  completed: { label: "Đã giao thành công", color: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  cancelled: { label: "Đã hủy", color: "bg-rose-100 text-rose-800 border-rose-200" },
  returned: { label: "Hoàn trả", color: "bg-gray-200 text-gray-800 border-gray-300" }
};

export default function OrdersClient({ initialOrders }: { initialOrders: Order[] }) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  // Status Modal State
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
  const [nextStatus, setNextStatus] = useState<string>('confirmed');
  const [carrier, setCarrier] = useState('Giao Hàng Nhanh (GHN)');
  const [trackingCode, setTrackingCode] = useState('');
  const [shippingFee, setShippingFee] = useState<number>(30000);

  const formatVND = (num: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
  };

  const filteredOrders = orders.filter(o => {
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    const s = searchTerm.toLowerCase().trim();
    const matchesSearch = !s || 
      o.id.toLowerCase().includes(s) ||
      (o.buyer_name_snapshot && o.buyer_name_snapshot.toLowerCase().includes(s)) ||
      (o.buyer_email_snapshot && o.buyer_email_snapshot.toLowerCase().includes(s)) ||
      (o.profiles?.full_name && o.profiles.full_name.toLowerCase().includes(s)) ||
      (o.shipping_address && o.shipping_address.toLowerCase().includes(s));
    return matchesStatus && matchesSearch;
  });

  const handleUpdateStatus = async (orderId: string, status: string, info?: any) => {
    setLoadingId(orderId);
    try {
      await updateOrderStatus(orderId, status, info);
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(prev => prev ? { ...prev, status } : null);
      }
      setEditingOrderId(null);
    } catch (e: any) {
      alert("Lỗi cập nhật trạng thái đơn: " + e.message);
    }
    setLoadingId(null);
  };

  const handleExportCSV = () => {
    if (orders.length === 0) {
      alert("Không có đơn hàng nào để xuất!");
      return;
    }

    const headers = [
      "Mã Đơn Hàng",
      "Ngày Đặt",
      "Tên Khách Hàng",
      "Email",
      "Địa Chỉ Giao Hàng",
      "Tổng Tiền (VNĐ)",
      "Trạng Thái",
      "Số Lượng Sản Phẩm"
    ];

    const rows = filteredOrders.map(o => [
      `#${o.id.slice(0, 8).toUpperCase()}`,
      new Date(o.created_at).toLocaleString('vi-VN'),
      `"${o.buyer_name_snapshot || o.profiles?.full_name || 'Khách vãng lai'}"`,
      o.buyer_email_snapshot || o.profiles?.email || '',
      `"${(o.shipping_address || '').replace(/"/g, '""')}"`,
      o.total_price,
      ORDER_STATUS_MAP[o.status]?.label || o.status,
      o.order_items?.length || 0
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Cupfy_Don_Hang_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Controls: Search, Filter, Export */}
      <div className="bg-white p-5 rounded-3xl border border-[#DDD8D2] shadow-sm flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
        <div className="flex flex-1 gap-3 items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6F625E]" />
            <input 
              type="text" 
              placeholder="Tìm theo mã đơn, tên khách, email, địa chỉ..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#F7F6F2] rounded-xl text-xs border border-[#DDD8D2] focus:outline-none focus:border-[#4A2A25]"
            />
          </div>

          <select 
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-[#F7F6F2] border border-[#DDD8D2] rounded-xl text-xs font-medium text-[#201817] focus:outline-none"
          >
            <option value="all">Tất cả trạng thái ({orders.length})</option>
            {Object.entries(ORDER_STATUS_MAP).map(([key, item]) => (
              <option key={key} value={key}>{item.label}</option>
            ))}
          </select>
        </div>

        <button 
          onClick={handleExportCSV}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-[#EDECEA] text-[#3A211E] rounded-xl text-xs font-bold hover:bg-[#DDD8D2] transition-colors shadow-sm"
        >
          <Download className="w-4 h-4" />
          Xuất Báo Cáo CSV
        </button>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-[#DDD8D2] shadow-sm overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="p-16 text-center text-[#6F625E]">
            <Package className="w-12 h-12 mx-auto mb-3 opacity-40 text-[#4A2A25]" />
            <div className="font-bold text-sm text-[#201817]">Không tìm thấy đơn hàng nào</div>
            <p className="text-xs text-[#6F625E] mt-1">Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc trạng thái.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7F6F2] border-b border-[#DDD8D2] text-[#6F625E]">
                <tr>
                  <th className="py-4 px-6 font-semibold">Mã Đơn</th>
                  <th className="py-4 px-4 font-semibold">Khách Hàng</th>
                  <th className="py-4 px-4 font-semibold">Ngày Đặt</th>
                  <th className="py-4 px-4 font-semibold">Sản Phẩm</th>
                  <th className="py-4 px-4 font-semibold">Tổng Tiền</th>
                  <th className="py-4 px-4 font-semibold">Trạng Thái</th>
                  <th className="py-4 px-6 font-semibold text-right">Hành Động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DDD8D2]/60">
                {filteredOrders.map(order => {
                  const statusInfo = ORDER_STATUS_MAP[order.status] || { label: order.status, color: "bg-gray-100 text-gray-700" };
                  return (
                    <tr key={order.id} className="hover:bg-[#F7F6F2]/40 transition-colors">
                      <td className="py-4 px-6 font-mono font-bold text-[#4A2A25]">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-bold text-[#201817] text-sm">
                          {order.buyer_name_snapshot || order.profiles?.full_name || 'Khách vãng lai'}
                        </div>
                        <div className="text-[11px] text-[#6F625E] mt-0.5">{order.buyer_email_snapshot || order.profiles?.email}</div>
                      </td>
                      <td className="py-4 px-4 text-[#6F625E]">
                        {new Date(order.created_at).toLocaleDateString('vi-VN', {
                          day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-[#201817]">{order.order_items?.length || 0} món</span>
                          {order.order_items?.some(i => i.products?.category === 'user_custom') && (
                            <span className="px-2 py-0.5 rounded-full bg-[#FFF3A6] text-[#3A211E] text-[10px] font-bold border border-[#DDD8D2]">
                              Custom Cup
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4 font-bold text-sm text-[#201817]">
                        {formatVND(Number(order.total_price) || 0)}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-[11px] font-bold border ${statusInfo.color}`}>
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right space-x-2">
                        <Link 
                          href={`/admin/orders/${order.id}`}
                          className="px-3 py-1.5 bg-[#EDECEA] text-[#3A211E] rounded-xl text-xs font-semibold hover:bg-[#DDD8D2] transition-colors inline-block"
                        >
                          Chi Tiết
                        </Link>
                        <button 
                          onClick={() => {
                            setEditingOrderId(order.id);
                            setNextStatus(order.status);
                          }}
                          className="px-3 py-1.5 bg-[#4A2A25] text-white rounded-xl text-xs font-semibold hover:bg-[#3A211E] transition-colors shadow-sm"
                        >
                          Đổi Trạng Thái
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

      {/* DETAIL MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-[#DDD8D2] shadow-2xl p-6 md:p-8 space-y-6">
            <div className="flex justify-between items-start border-b border-[#DDD8D2] pb-4">
              <div>
                <div className="text-xs font-bold text-[#4A2A25] uppercase tracking-wider">Thông Tin Đơn Hàng Chi Tiết</div>
                <h3 className="text-xl font-black text-[#3A211E] font-mono mt-1">
                  #{selectedOrder.id.toUpperCase()}
                </h3>
                <div className="text-xs text-[#6F625E] mt-1">
                  Đặt lúc: {new Date(selectedOrder.created_at).toLocaleString('vi-VN')}
                </div>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 rounded-full hover:bg-[#EDECEA] text-[#6F625E]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer Info Card */}
            <div className="bg-[#F7F6F2] p-4 rounded-2xl border border-[#DDD8D2] space-y-2 text-xs">
              <div className="font-bold text-[#3A211E] text-sm">Thông Tin Giao Hàng:</div>
              <div className="grid grid-cols-2 gap-2 text-[#6F625E]">
                <div><span className="font-semibold text-[#201817]">Người nhận:</span> {selectedOrder.buyer_name_snapshot || 'Chưa cập nhật'}</div>
                <div><span className="font-semibold text-[#201817]">Email:</span> {selectedOrder.buyer_email_snapshot || 'Chưa cập nhật'}</div>
                <div className="col-span-2">
                  <span className="font-semibold text-[#201817]">Địa chỉ nhận hàng:</span> {selectedOrder.shipping_address || 'Chưa cập nhật'}
                </div>
              </div>
            </div>

            {/* Items List */}
            <div className="space-y-3">
              <div className="font-bold text-sm text-[#3A211E]">Danh Sách Sản Phẩm:</div>
              <div className="divide-y divide-[#DDD8D2] border border-[#DDD8D2] rounded-2xl overflow-hidden">
                {selectedOrder.order_items?.map(item => {
                  let customSpecs: any = null;
                  if (item.products?.category === 'user_custom' && item.products?.description) {
                    try { customSpecs = JSON.parse(item.products.description); } catch(e){}
                  }

                  return (
                    <div key={item.id} className="p-4 flex gap-4 text-xs bg-white">
                      {item.products?.image_url && (
                        <div className="w-16 h-16 bg-[#EDECEA] rounded-xl border border-[#DDD8D2] p-1 shrink-0 flex items-center justify-center">
                          <img src={item.products.image_url} alt="" className="w-full h-full object-contain" />
                        </div>
                      )}
                      <div className="flex-1 space-y-1">
                        <div className="font-bold text-[#201817] text-sm">{item.products?.name || 'Sản phẩm Cupfy'}</div>
                        <div className="text-[#6F625E]">Đơn giá: {formatVND(item.price)} x Số lượng: {item.quantity}</div>
                        
                        {/* Custom Specs Display */}
                        {customSpecs && (
                          <div className="bg-[#FFF3A6]/40 p-2.5 rounded-xl border border-[#DDD8D2] mt-2 space-y-1 text-[11px] text-[#3A211E]">
                            <div className="font-bold text-[#4A2A25]">Thiết kế tùy chỉnh Cupfy Studio:</div>
                            <div>- Kiểu ly: {customSpecs.modelType === 'tumbler' ? 'Tumbler (Ống hút)' : 'Mug (Cốc quai)'}</div>
                            {customSpecs.customText && <div>- Khắc chữ: <strong>"{customSpecs.customText}"</strong> (Màu: {customSpecs.textColor})</div>}
                            {customSpecs.uploadedImage && (
                              <div className="flex items-center gap-2 pt-1">
                                <span>- Ảnh khách tải:</span>
                                <a 
                                  href={customSpecs.uploadedImage} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="text-blue-600 underline font-semibold flex items-center gap-1"
                                >
                                  Xem ảnh gốc <ExternalLink className="w-3 h-3" />
                                </a>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="font-bold text-sm text-[#201817] text-right">
                        {formatVND(item.price * item.quantity)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Summary */}
            <div className="flex justify-between items-center pt-2 border-t border-[#DDD8D2]">
              <span className="font-bold text-[#3A211E]">Tổng Thanh Toán:</span>
              <span className="text-xl font-black text-[#4A2A25]">{formatVND(selectedOrder.total_price)}</span>
            </div>

            {/* Quick Actions */}
            <div className="flex justify-end gap-3 pt-4">
              <button 
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2.5 bg-[#EDECEA] text-[#3A211E] rounded-xl text-xs font-bold hover:bg-[#DDD8D2]"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* UPDATE STATUS MODAL */}
      {editingOrderId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full border border-[#DDD8D2] shadow-2xl p-6 space-y-5">
            <div className="flex justify-between items-center border-b border-[#DDD8D2] pb-3">
              <h3 className="font-bold text-[#3A211E] text-base">Cập Nhật Trạng Thái Đơn Hàng</h3>
              <button onClick={() => setEditingOrderId(null)} className="text-[#6F625E]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-[#201817] block mb-1.5">Chọn Trạng Thái Mới:</label>
                <select 
                  value={nextStatus}
                  onChange={e => setNextStatus(e.target.value)}
                  className="w-full p-2.5 bg-[#F7F6F2] border border-[#DDD8D2] rounded-xl text-xs font-medium"
                >
                  {Object.entries(ORDER_STATUS_MAP).map(([val, item]) => (
                    <option key={val} value={val}>{item.label}</option>
                  ))}
                </select>
              </div>

              {/* Shipping info inputs if moving to shipping */}
              {['handed_to_carrier', 'shipping', 'delivered'].includes(nextStatus) && (
                <div className="bg-[#F7F6F2] p-3.5 rounded-2xl border border-[#DDD8D2] space-y-3">
                  <div className="font-bold text-[#3A211E]">Thông Tin Vận Chuyển:</div>
                  <div>
                    <label className="text-[11px] text-[#6F625E] block mb-1">Đơn vị vận chuyển:</label>
                    <input 
                      type="text" 
                      value={carrier}
                      onChange={e => setCarrier(e.target.value)}
                      placeholder="VD: Giao Hàng Nhanh (GHN), Viettel Post..."
                      className="w-full p-2 bg-white border border-[#DDD8D2] rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-[#6F625E] block mb-1">Mã vận đơn (Tracking Number):</label>
                    <input 
                      type="text" 
                      value={trackingCode}
                      onChange={e => setTrackingCode(e.target.value)}
                      placeholder="VD: GHN-82931049"
                      className="w-full p-2 bg-white border border-[#DDD8D2] rounded-lg text-xs font-mono"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#DDD8D2]">
              <button 
                onClick={() => setEditingOrderId(null)}
                className="px-4 py-2 bg-[#EDECEA] text-[#3A211E] rounded-xl text-xs font-bold"
              >
                Hủy
              </button>
              <button 
                onClick={() => handleUpdateStatus(editingOrderId, nextStatus, {
                  carrier,
                  trackingNumber: trackingCode,
                  shippingFee
                })}
                disabled={loadingId === editingOrderId}
                className="px-5 py-2 bg-[#4A2A25] text-white rounded-xl text-xs font-bold hover:bg-[#3A211E]"
              >
                {loadingId === editingOrderId ? 'Đang lưu...' : 'Lưu Thay Đổi'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
