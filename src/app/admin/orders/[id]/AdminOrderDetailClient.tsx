"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowLeft, Clock, CheckCircle2, Truck, AlertCircle, FileText, User, MapPin, 
  Printer, RotateCcw, XCircle, Loader2, Eye, Sparkles, Check, X, ShieldAlert, Package
} from 'lucide-react';
import { updateOrderStatus } from '@/app/actions/admin';
import { 
  adminProcessItemCancellation, 
  adminUpdateOrderStatusWithReason 
} from '@/app/actions/orderManagement';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import CustomCupViewerModal from '@/components/studio/CustomCupViewerModal';

export default function AdminOrderDetailClient({ order: initialOrder }: { order: any }) {
  const router = useRouter();
  const [order, setOrder] = useState(initialOrder);
  const [loading, setLoading] = useState(false);

  // Modal hủy toàn bộ đơn
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  // Modal yêu cầu chỉnh sửa thiết kế
  const [designRejectModalOpen, setDesignRejectModalOpen] = useState(false);
  const [designRejectReason, setDesignRejectReason] = useState('');

  // Modal từ chối hủy sản phẩm
  const [itemRejectModalOpen, setItemRejectModalOpen] = useState(false);
  const [rejectingItemId, setRejectingItemId] = useState<string | null>(null);
  const [itemRejectReason, setItemRejectReason] = useState('');

  // Modal xem 3D visualizer
  const [viewingCustomItem, setViewingCustomItem] = useState<any | null>(null);
  const [processingItemId, setProcessingItemId] = useState<string | null>(null);

  const formatVND = (num: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
  };

  // Fetch newest order details
  const refreshOrder = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from('orders')
      .select(`
        id, buyer_id, created_at, total_price, status, buyer_name_snapshot, buyer_email_snapshot, shipping_address,
        profiles:buyer_id(id, full_name, phone_number, store_name),
        order_items(id, quantity, price, status, product_id, products(id, name, image_url, description, category, technical_specs))
      `)
      .eq('id', order.id)
      .single();

    if (data) {
      setOrder(data);
    }
  };

  // REALTIME SYNCHRONIZATION
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`admin-order-realtime-${order.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${order.id}`,
        },
        () => {
          refreshOrder();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'order_items',
          filter: `order_id=eq.${order.id}`,
        },
        () => {
          refreshOrder();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [order.id]);

  const handleUpdate = async (status: string, reason?: string) => {
    setLoading(true);
    try {
      const res = await adminUpdateOrderStatusWithReason(order.id, status, reason);
      if (!res.success) {
        alert('Lỗi cập nhật: ' + res.error);
      } else {
        await refreshOrder();
        router.refresh();
      }
    } catch (err: any) {
      alert('Lỗi cập nhật trạng thái: ' + err.message);
    } finally {
      setLoading(false);
      setCancelModalOpen(false);
      setDesignRejectModalOpen(false);
    }
  };

  // Xử lý yêu cầu hủy sản phẩm từ khách
  const handleItemCancelAction = async (itemId: string, accept: boolean, rejectReason?: string) => {
    setProcessingItemId(itemId);
    try {
      const res = await adminProcessItemCancellation(order.id, itemId, accept, rejectReason);
      if (!res.success) {
        alert('Lỗi xử lý yêu cầu hủy: ' + res.error);
      } else {
        await refreshOrder();
        router.refresh();
      }
    } catch (err: any) {
      alert('Lỗi: ' + err.message);
    } finally {
      setProcessingItemId(null);
      setItemRejectModalOpen(false);
      setRejectingItemId(null);
      setItemRejectReason('');
    }
  };

  const rawAddress = order.shipping_address || '';
  const addressParts = rawAddress.split('|');
  const deliveryAddress = addressParts[0]?.replace('Địa chỉ:', '').trim() || rawAddress;
  const deliveryPhone = addressParts.find((p: string) => p.includes('SĐT:'))?.replace('SĐT:', '').trim() || order.profiles?.phone_number || 'Chưa cung cấp';
  const deliveryNote = addressParts.find((p: string) => p.includes('Ghi chú:'))?.replace('Ghi chú:', '').trim() || '';
  
  const designRejectionNote = rawAddress.includes('[LÝ DO ĐIỀU CHỈNH:')
    ? rawAddress.split('[LÝ DO ĐIỀU CHỈNH:')[1]?.replace(']', '').trim()
    : '';

  const formattedCode = `#${order.id.slice(0, 8).toUpperCase()}`;

  // Kiểm tra xem đơn hàng có chứa sản phẩm Custom Cup không
  const hasCustomItems = order.order_items?.some(
    (item: any) => item.products?.category === 'user_custom'
  );

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

        <div className="flex items-center gap-3">
          <button 
            onClick={refreshOrder}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-[#DDD8D2] text-[#3A211E] rounded-full text-xs font-bold hover:bg-[#EDECEA] transition-colors shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Làm mới
          </button>
          <button 
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#DDD8D2] text-[#3A211E] rounded-full text-xs font-bold hover:bg-[#EDECEA] transition-colors shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" /> In phiếu đóng gói
          </button>
        </div>
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
            {hasCustomItems && (
              <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-700" /> Đơn có ly Custom 3D
              </span>
            )}
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-[#3A211E] tracking-tight">
            Chi tiết đơn hàng {formattedCode}
          </h1>
        </div>

        {/* Status Actions: Hỗ trợ quy trình kiểm tra thiết kế chuyên nghiệp */}
        <div className="flex flex-wrap items-center gap-2.5">
          
          {/* 1. ĐƠN CÓ LY CUSTOM: BƯỚC DUYỆT THIẾT KẾ (Phần 2.4) */}
          {hasCustomItems && order.status === 'pending' && (
            <button
              onClick={() => handleUpdate('design_review')}
              disabled={loading}
              className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-full text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Eye className="w-3.5 h-3.5" />}
              Bắt đầu kiểm tra thiết kế
            </button>
          )}

          {hasCustomItems && order.status === 'design_review' && (
            <>
              <button
                onClick={() => handleUpdate('confirmed')}
                disabled={loading}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                Phê duyệt thiết kế
              </button>
              <button
                onClick={() => setDesignRejectModalOpen(true)}
                disabled={loading}
                className="px-4 py-2.5 bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 rounded-full text-xs font-bold transition-colors flex items-center gap-1.5 disabled:opacity-50"
              >
                <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
                Yêu cầu chỉnh sửa
              </button>
            </>
          )}

          {hasCustomItems && order.status === 'design_rejected' && (
            <div className="flex items-center gap-2">
              <span className="px-3.5 py-1.5 bg-amber-100 text-amber-900 border border-amber-300 rounded-full text-xs font-bold flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-amber-700" /> Chờ khách chỉnh sửa
              </span>
              <button
                onClick={() => handleUpdate('confirmed')}
                disabled={loading}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-xs font-bold"
              >
                Phê duyệt lại thiết kế
              </button>
            </div>
          )}

          {/* 2. ĐƠN THƯỜNG KHÔNG CÓ CUSTOM */}
          {!hasCustomItems && order.status === 'pending' && (
            <button
              onClick={() => handleUpdate('confirmed')}
              disabled={loading}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
              Xác nhận đơn hàng
            </button>
          )}

          {/* 3. BƯỚC SẢN XUẤT */}
          {order.status === 'confirmed' && (
            <button
              onClick={() => handleUpdate('in_production')}
              disabled={loading}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Package className="w-3.5 h-3.5" />}
              Bắt đầu sản xuất
            </button>
          )}

          {/* 4. BÀN GIAO VẬN CHUYỂN */}
          {order.status === 'in_production' && (
            <button
              onClick={() => handleUpdate('shipping')}
              disabled={loading}
              className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-full text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Truck className="w-3.5 h-3.5" />}
              Bàn giao vận chuyển
            </button>
          )}

          {/* 5. GIAO HÀNG THÀNH CÔNG */}
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

          {/* 6. HỦY ĐƠN */}
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

      {/* Rejection Note Warning if applicable */}
      {designRejectionNote && (
        <div className="bg-amber-50 p-4 rounded-2xl border border-amber-300 text-xs text-amber-900 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <strong className="block text-amber-950 font-bold">Lý do yêu cầu khách chỉnh sửa thiết kế:</strong>
            <p className="mt-0.5">{designRejectionNote}</p>
          </div>
        </div>
      )}

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
                const isCustom = prod.category === 'user_custom';

                let specs: any = prod.technical_specs;
                if (!specs || Object.keys(specs).length === 0) {
                  try {
                    if (prod.description && prod.description.startsWith('{')) {
                      specs = JSON.parse(prod.description);
                    }
                  } catch (e) {}
                }

                const isItemCancelled = item.status === 'cancelled';
                const isCancelRequested = item.status?.startsWith('cancel_requested');
                const cancelRequestReason = isCancelRequested ? item.status.split(':::')[1] : '';

                return (
                  <div key={item.id} className="py-6 first:pt-0 last:pb-0 space-y-4">
                    
                    {/* Item Row */}
                    <div className="flex gap-4 items-start">
                      
                      {/* Product Thumbnail (Clean, no weird overlays) */}
                      <div 
                        onClick={() => isCustom && setViewingCustomItem(item)}
                        className={`relative w-22 h-22 bg-[#F7F6F2] rounded-2xl border border-[#DDD8D2] overflow-hidden shrink-0 flex items-center justify-center p-1.5 ${
                          isCustom ? 'cursor-pointer hover:border-[#3A211E] transition-colors group' : ''
                        }`}
                      >
                        {prod.image_url ? (
                          <img src={prod.image_url} alt="" className="w-full h-full object-contain p-1 rounded-xl" />
                        ) : (
                          <span className="text-xs text-[#6F625E]">No image</span>
                        )}
                        {isCustom && (
                          <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl">
                            <span className="text-[10px] text-white font-bold bg-black/60 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <Eye className="w-3 h-3" /> Xem 3D
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-bold text-base text-[#3A211E]">{prod.name}</h4>
                          <span className="font-bold text-sm text-[#3A211E]">
                            {formatVND(item.price * item.quantity)}
                          </span>
                        </div>

                        {isCustom && (
                          <span className="inline-block bg-[#BFDCEF]/60 text-[#3A211E] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#BFDCEF] mt-1">
                            ✦ Ly thiết kế riêng (Custom Cup)
                          </span>
                        )}

                        <p className="text-xs text-[#6F625E] mt-1">
                          Số lượng: <strong>{item.quantity}</strong> × {formatVND(item.price)}
                        </p>

                        {/* Nút Xem thiết kế 3D (Phần 2.1) */}
                        {isCustom && (
                          <div className="mt-3 flex items-center gap-2">
                            <button
                              onClick={() => setViewingCustomItem(item)}
                              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#3A211E] text-white rounded-full text-xs font-bold hover:bg-[#4A2A25] transition-colors shadow-xs"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              Xem thiết kế 3D
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* YÊU CẦU HỦY SẢN PHẨM TỪ KHÁCH (Phần 5.4) */}
                    {isCancelRequested && (
                      <div className="p-4 bg-amber-50 rounded-2xl border border-amber-300 text-xs space-y-3 animate-in fade-in">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-amber-950 block">Khách hàng gửi yêu cầu hủy sản phẩm này</span>
                            <p className="text-amber-800 mt-0.5">Lý do: <em>"{cancelRequestReason}"</em></p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 pt-1">
                          <button
                            onClick={() => handleItemCancelAction(item.id, true)}
                            disabled={processingItemId === item.id}
                            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-full text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                          >
                            {processingItemId === item.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                            Chấp nhận hủy sản phẩm
                          </button>
                          <button
                            onClick={() => {
                              setRejectingItemId(item.id);
                              setItemRejectReason('');
                              setItemRejectModalOpen(true);
                            }}
                            disabled={processingItemId === item.id}
                            className="px-4 py-2 bg-white border border-[#DDD8D2] hover:bg-[#EDECEA] text-[#3A211E] rounded-full text-xs font-bold transition-colors"
                          >
                            Từ chối hủy
                          </button>
                        </div>
                      </div>
                    )}

                    {isItemCancelled && (
                      <div className="p-2.5 bg-rose-50 rounded-xl border border-rose-200 text-xs text-rose-700 font-bold inline-flex items-center gap-1.5">
                        <XCircle className="w-3.5 h-3.5" /> Sản phẩm này đã bị hủy (không tính vào tổng tiền COD)
                      </div>
                    )}

                    {/* Custom Specs Snapshot for Production */}
                    {specs && !isItemCancelled && (
                      <div className="bg-[#FAF9F6] rounded-2xl p-4 border border-[#DDD8D2] text-xs space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="font-bold text-[#3A211E] uppercase tracking-wide">
                            Thông số kỹ thuật sản xuất
                          </p>
                          <button
                            onClick={() => setViewingCustomItem(item)}
                            className="text-[11px] text-amber-800 hover:underline font-bold flex items-center gap-1"
                          >
                            <Eye className="w-3 h-3" /> Mở công cụ kiểm tra 3D
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-[#6F625E]">
                          <p><strong className="text-[#3A211E]">Kiểu ly:</strong> {specs.modelName || specs.modelType}</p>
                          <p><strong className="text-[#3A211E]">Màu thân ly:</strong> {specs.cupColorName || specs.cupColor}</p>
                          {specs.lidColor && <p><strong className="text-[#3A211E]">Màu nắp:</strong> {specs.lidColor}</p>}
                          {specs.customText && <p><strong className="text-[#3A211E]">Chữ in:</strong> "{specs.customText}" (Font: {specs.font})</p>}
                        </div>

                        {/* Flat Printable Texture for Production */}
                        {specs.printableTexture && (
                          <div className="pt-2 border-t border-[#DDD8D2] flex items-center justify-between">
                            <span className="font-bold text-[#3A211E]">Bản in nhiệt phẳng:</span>
                            <a 
                              href={specs.printableTexture} 
                              target="_blank" 
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:underline font-bold"
                            >
                              <FileText className="w-3.5 h-3.5" /> Mở file in (2048×1024)
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

        {/* Info Column (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Customer Profile */}
          <div className="bg-white rounded-[28px] p-6 sm:p-7 border border-[#DDD8D2] shadow-sm space-y-4">
            <h3 className="font-bold text-base text-[#3A211E] flex items-center gap-2">
              <User className="w-4 h-4 text-[#4A2A25]" /> Thông tin khách hàng
            </h3>

            <div className="text-xs space-y-2.5 text-[#6F625E]">
              <div className="flex justify-between">
                <span>Họ và tên:</span>
                <strong className="text-[#3A211E] text-sm">{order.buyer_name_snapshot || 'Khách vãng lai'}</strong>
              </div>
              <div className="flex justify-between">
                <span>Số điện thoại:</span>
                <strong className="text-[#3A211E]">{deliveryPhone}</strong>
              </div>
              <div className="flex justify-between">
                <span>Email:</span>
                <span className="text-[#3A211E]">{order.buyer_email_snapshot || 'Chưa cung cấp'}</span>
              </div>
            </div>
          </div>

          {/* Delivery & Shipping Info */}
          <div className="bg-white rounded-[28px] p-6 sm:p-7 border border-[#DDD8D2] shadow-sm space-y-4">
            <h3 className="font-bold text-base text-[#3A211E] flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#4A2A25]" /> Địa chỉ giao hàng
            </h3>

            <div className="text-xs space-y-2 text-[#6F625E]">
              <p className="leading-relaxed text-[#3A211E] font-medium">{deliveryAddress}</p>
              {deliveryNote && (
                <div className="p-3 bg-[#F7F6F2] rounded-xl border border-[#DDD8D2] text-[#3A211E] italic mt-2">
                  Ghi chú đơn hàng: "{deliveryNote}"
                </div>
              )}
            </div>
          </div>

          {/* Payment & Financial Summary */}
          <div className="bg-white rounded-[28px] p-6 sm:p-7 border border-[#DDD8D2] shadow-sm space-y-4">
            <h3 className="font-bold text-base text-[#3A211E] flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#4A2A25]" /> Thanh toán & Tổng kết COD
            </h3>

            <div className="text-xs space-y-2 text-[#6F625E]">
              <div className="flex justify-between">
                <span>Phương thức thanh toán:</span>
                <strong className="text-[#3A211E]">COD (Thu tiền khi nhận hàng)</strong>
              </div>
              <div className="flex justify-between">
                <span>Trạng thái thanh toán:</span>
                <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                  order.status === 'delivered' 
                    ? 'bg-emerald-100 text-emerald-800' 
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {order.status === 'delivered' ? 'Đã thu tiền' : 'Chưa thu tiền'}
                </span>
              </div>
              <div className="border-t border-[#DDD8D2] pt-3 flex justify-between items-baseline">
                <span className="font-bold text-sm text-[#3A211E]">Tổng tiền thu COD:</span>
                <span className="font-black text-2xl text-[#3A211E]">
                  {formatVND(order.total_price)}
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* MODAL XEM CHI TIẾT THIẾT KẾ 3D (Phần 2) */}
      <CustomCupViewerModal
        isOpen={!!viewingCustomItem}
        onClose={() => setViewingCustomItem(null)}
        item={viewingCustomItem}
        mode="admin"
      />

      {/* MODAL YÊU CẦU CHỈNH SỬA THIẾT KẾ (Phần 2.4) */}
      {designRejectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-[28px] border border-[#DDD8D2] shadow-2xl max-w-md w-full p-6 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#DDD8D2] pb-3">
              <h3 className="font-bold text-base text-[#3A211E] flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-600" />
                Yêu cầu khách chỉnh sửa thiết kế
              </h3>
              <button 
                onClick={() => setDesignRejectModalOpen(false)}
                className="text-[#6F625E] hover:text-[#3A211E]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#6F625E]">
              Vui lòng nhập lý do cụ thể vì sao thiết kế này chưa đạt chuẩn sản xuất (ví dụ: Hình ảnh quá mờ, chữ in tràn viền an toàn, độ phân giải thấp...).
            </p>

            <textarea
              rows={3}
              value={designRejectReason}
              onChange={(e) => setDesignRejectReason(e.target.value)}
              placeholder="Nhập lý do gửi đến khách hàng..."
              className="w-full p-3 bg-[#FAF9F6] border border-[#DDD8D2] rounded-2xl text-xs text-[#3A211E] focus:outline-none focus:ring-2 focus:ring-[#3A211E]/30 resize-none"
            />

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDesignRejectModalOpen(false)}
                className="px-5 py-2.5 rounded-full border border-[#DDD8D2] text-[#3A211E] text-xs font-bold hover:bg-[#EDECEA]"
              >
                Hủy bỏ
              </button>
              <button
                onClick={() => handleUpdate('design_rejected', designRejectReason)}
                disabled={!designRejectReason.trim() || loading}
                className="px-5 py-2.5 rounded-full bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors disabled:opacity-50 flex items-center gap-1.5"
              >
                {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                Gửi yêu cầu chỉnh sửa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL TỪ CHỐI HỦY SẢN PHẨM (Phần 5.4) */}
      {itemRejectModalOpen && rejectingItemId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-[28px] border border-[#DDD8D2] shadow-2xl max-w-md w-full p-6 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#DDD8D2] pb-3">
              <h3 className="font-bold text-base text-[#3A211E]">
                Từ chối yêu cầu hủy sản phẩm
              </h3>
              <button 
                onClick={() => setItemRejectModalOpen(false)}
                className="text-[#6F625E] hover:text-[#3A211E]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#6F625E]">
              Nhập lý do từ chối yêu cầu hủy của khách hàng:
            </p>

            <textarea
              rows={3}
              value={itemRejectReason}
              onChange={(e) => setItemRejectReason(e.target.value)}
              placeholder="Ví dụ: Sản phẩm đã được đưa vào dây chuyền in nhiệt..."
              className="w-full p-3 bg-[#FAF9F6] border border-[#DDD8D2] rounded-2xl text-xs text-[#3A211E] focus:outline-none focus:ring-2 focus:ring-[#3A211E]/30 resize-none"
            />

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setItemRejectModalOpen(false)}
                className="px-5 py-2.5 rounded-full border border-[#DDD8D2] text-[#3A211E] text-xs font-bold hover:bg-[#EDECEA]"
              >
                Quay lại
              </button>
              <button
                onClick={() => handleItemCancelAction(rejectingItemId, false, itemRejectReason)}
                disabled={!itemRejectReason.trim()}
                className="px-5 py-2.5 rounded-full bg-[#3A211E] hover:bg-[#4A2A25] text-white text-xs font-bold transition-colors disabled:opacity-50"
              >
                Xác nhận từ chối
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL HỦY ĐƠN HÀNG */}
      {cancelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-[#DDD8D2] shadow-xl space-y-4">
            <h3 className="text-lg font-bold text-[#3A211E] flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-rose-600" /> Xác nhận hủy đơn hàng
            </h3>
            <p className="text-xs text-[#6F625E]">
              Sau khi hủy, số lượng sản phẩm tiêu chuẩn sẽ được tự động hoàn lại vào kho hàng.
            </p>
            <input 
              type="text" 
              placeholder="Nhập lý do hủy đơn (ví dụ: Khách đổi ý, Hết hàng...)"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#F7F6F2] border border-[#DDD8D2] rounded-xl text-xs focus:outline-none focus:border-[#3A211E]"
            />
            <div className="flex justify-end gap-3 pt-2">
              <button 
                onClick={() => setCancelModalOpen(false)}
                className="px-4 py-2 border border-[#DDD8D2] rounded-full text-xs font-bold text-[#6F625E] hover:bg-[#F7F6F2]"
              >
                Quay lại
              </button>
              <button 
                onClick={() => handleUpdate('cancelled', cancelReason)}
                disabled={loading}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-full text-xs font-bold transition-colors disabled:opacity-50"
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
