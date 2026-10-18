"use client";

import { useEffect, useState, use, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { 
  Check, Clock, PackageCheck, Truck, CheckCircle2, AlertCircle, ArrowLeft, 
  RefreshCw, ShieldAlert, FileText, XCircle, Eye, Sparkles, X, Loader2
} from 'lucide-react';
import Link from 'next/link';
import CustomCupViewerModal from '@/components/studio/CustomCupViewerModal';
import { requestItemCancellation } from '@/app/actions/orderManagement';

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function OrderDetailPage({ params }: OrderDetailPageProps) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F7F6F2] flex flex-col items-center justify-center pt-28">
        <RefreshCw className="w-8 h-8 animate-spin text-[#3A211E] mb-3" />
        <p className="text-sm text-[#6F625E]">Đang tải chi tiết đơn hàng...</p>
      </div>
    }>
      <OrderDetailContent params={params} />
    </Suspense>
  );
}

function OrderDetailPageInner({ orderId }: { orderId: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isNewOrder = searchParams.get('success') === 'true' || searchParams.get('new') === 'true';

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [showSuccessCard, setShowSuccessCard] = useState(isNewOrder);

  // Modal 3D Viewer
  const [selectedCustomItem, setSelectedCustomItem] = useState<any | null>(null);

  // Modal Hủy sản phẩm
  const [cancellingItem, setCancellingItem] = useState<any | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [submittingCancel, setSubmittingCancel] = useState(false);
  const [cancelError, setCancelError] = useState('');
  const [cancelSuccessMsg, setCancelSuccessMsg] = useState('');

  const fetchOrder = async () => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push(`/login?redirect=/orders/${orderId}`);
        return;
      }

      const isAdmin = user.email?.toLowerCase().trim() === 'tranchitin2006@gmail.com';

      const { data, error: fetchErr } = await supabase
        .from('orders')
        .select(`
          id, created_at, status, total_price, shipping_address, buyer_id, buyer_name_snapshot, buyer_email_snapshot,
          order_items (
            id, quantity, price, status, product_id,
            products ( id, name, image_url, description, category, technical_specs )
          )
        `)
        .eq('id', orderId)
        .single();

      if (fetchErr || !data) {
        setError('Không tìm thấy thông tin đơn hàng hoặc mã đơn không tồn tại.');
        setLoading(false);
        return;
      }

      // Bảo mật: Chỉ chủ đơn hàng hoặc Admin mới có quyền xem
      if (data.buyer_id !== user.id && !isAdmin) {
        setError('Bạn không có quyền xem thông tin đơn hàng này.');
        setLoading(false);
        return;
      }

      setOrder(data);
      setLoading(false);
    } catch (err: any) {
      console.error('Fetch order error:', err);
      setError('Đã xảy ra lỗi khi tải đơn hàng.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();

    // SUPABASE REALTIME SUBSCRIPTION (Đồng bộ tức thời trạng thái khi Admin cập nhật)
    const supabase = createClient();
    const channel = supabase
      .channel(`order-realtime-${orderId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${orderId}`,
        },
        () => {
          fetchOrder();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'order_items',
          filter: `order_id=eq.${orderId}`,
        },
        () => {
          fetchOrder();
        }
      )
      .subscribe();

    // Fallback polling mỗi 12 giây
    const interval = setInterval(() => {
      fetchOrder();
    }, 12000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, [orderId]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchOrder();
    setRefreshing(false);
  };

  const handleSendCancelRequest = async () => {
    if (!cancellingItem || !cancelReason.trim()) {
      setCancelError('Vui lòng nhập lý do bạn muốn hủy sản phẩm.');
      return;
    }

    setSubmittingCancel(true);
    setCancelError('');

    try {
      const res = await requestItemCancellation(order.id, cancellingItem.id, cancelReason);
      if (!res.success) {
        setCancelError(res.error || 'Không thể gửi yêu cầu hủy.');
      } else {
        setCancellingItem(null);
        setCancelReason('');
        setCancelSuccessMsg('Yêu cầu hủy sản phẩm đã được gửi đến Admin!');
        setTimeout(() => setCancelSuccessMsg(''), 4000);
        await fetchOrder();
      }
    } catch (err: any) {
      setCancelError(err.message || 'Lỗi gửi yêu cầu hủy.');
    } finally {
      setSubmittingCancel(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F6F2] flex flex-col items-center justify-center pt-28">
        <RefreshCw className="w-8 h-8 animate-spin text-[#3A211E] mb-3" />
        <p className="text-sm text-[#6F625E]">Đang tải chi tiết đơn hàng...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-[70vh] bg-[#F7F6F2] flex flex-col items-center justify-center pt-28 pb-16 px-6 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-600 mb-4">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="font-heading text-2xl font-bold text-[#3A211E] mb-2">Truy cập bị từ chối</h2>
        <p className="text-sm text-[#6F625E] max-w-md mb-6">{error}</p>
        <Link 
          href="/orders" 
          className="px-6 py-3 bg-[#3A211E] text-white rounded-full font-bold text-sm hover:bg-[#4A2A25] transition-colors"
        >
          Quay lại danh sách đơn hàng
        </Link>
      </div>
    );
  }

  // Parse recipient info from shipping_address
  const rawAddress = order.shipping_address || '';
  const addressParts = rawAddress.split('|');
  const deliveryAddress = addressParts[0]?.replace('Địa chỉ:', '').trim() || rawAddress;
  const deliveryPhone = addressParts.find((p: string) => p.includes('SĐT:'))?.replace('SĐT:', '').trim() || 'Chưa cung cấp';
  const deliveryNote = addressParts.find((p: string) => p.includes('Ghi chú:'))?.replace('Ghi chú:', '').trim() || '';
  
  const designRejectionReason = rawAddress.includes('[LÝ DO ĐIỀU CHỈNH:')
    ? rawAddress.split('[LÝ DO ĐIỀU CHỈNH:')[1]?.replace(']', '').trim()
    : '';

  // Check if order contains custom cup
  const hasCustomCup = order.order_items?.some(
    (item: any) => item.products?.category === 'user_custom'
  );

  // 6 STEPS FOR CUSTOM CUP, 4 STEPS FOR REGULAR PRODUCTS (Phần 6.3)
  const steps = hasCustomCup
    ? [
        { key: 'pending', label: 'Chờ xác nhận', desc: 'Đơn hàng đã được ghi nhận và đang chờ kiểm tra.' },
        { key: 'design_review', label: 'Kiểm tra thiết kế', desc: 'Kỹ thuật viên đang kiểm duyệt thông số và bố cục in chiếc ly.' },
        { key: 'confirmed', label: 'Đã xác nhận', desc: 'Thiết kế đã được phê duyệt và đơn hàng đã được chốt.' },
        { key: 'in_production', label: 'Đang sản xuất', desc: 'Xưởng Cupfy đang in nhiệt và gia công hoàn thiện chiếc ly.' },
        { key: 'shipping', label: 'Đang giao hàng', desc: 'Đơn hàng đã được bàn giao cho đơn vị vận chuyển.' },
        { key: 'delivered', label: 'Đã giao hàng', desc: 'Đơn hàng đã được giao thành công đến bạn.' },
      ]
    : [
        { key: 'pending', label: 'Chờ xác nhận', desc: 'Đơn hàng đã được ghi nhận và đang chờ kiểm tra.' },
        { key: 'confirmed', label: 'Đã xác nhận', desc: 'Cupfy đã xác nhận đơn hàng và chuẩn bị đóng gói.' },
        { key: 'shipping', label: 'Đang giao hàng', desc: 'Đơn hàng đã được bàn giao cho đơn vị vận chuyển.' },
        { key: 'delivered', label: 'Đã giao hàng', desc: 'Đơn hàng đã được giao thành công đến bạn.' },
      ];

  const getStepIndex = (status: string, isCustom: boolean) => {
    if (isCustom) {
      switch (status) {
        case 'pending': return 0;
        case 'design_review':
        case 'design_rejected': return 1;
        case 'confirmed': return 2;
        case 'in_production': return 3;
        case 'shipping':
        case 'handed_to_carrier': return 4;
        case 'delivered':
        case 'completed': return 5;
        case 'cancelled': return -1;
        default: return 0;
      }
    } else {
      switch (status) {
        case 'pending': return 0;
        case 'confirmed':
        case 'in_production': return 1;
        case 'shipping':
        case 'handed_to_carrier': return 2;
        case 'delivered':
        case 'completed': return 3;
        case 'cancelled': return -1;
        default: return 0;
      }
    }
  };

  const currentStepIdx = getStepIndex(order.status, hasCustomCup);
  const isCancelled = order.status === 'cancelled';

  const nonCancelledItems = (order.order_items || []).filter((i: any) => i.status !== 'cancelled');
  const subtotal = nonCancelledItems.reduce((sum: number, item: any) => sum + (Number(item.price) * Number(item.quantity)), 0);
  const shippingFee = nonCancelledItems.length > 0 ? 30000 : 0;
  const formattedCode = `#${order.id.slice(0, 8).toUpperCase()}`;

  const formatVND = (num: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
  };

  return (
    <div className="min-h-screen bg-[#F7F6F2] pt-28 pb-20">
      <div className="max-w-[1100px] mx-auto px-6">
        
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <Link 
            href="/orders" 
            className="inline-flex items-center gap-2 text-sm text-[#6F625E] hover:text-[#3A211E] font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Danh sách đơn hàng
          </Link>

          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center gap-2 text-xs font-bold text-[#3A211E] bg-white px-4 py-2 rounded-full border border-[#DDD8D2] hover:bg-[#EDECEA] transition-colors self-start sm:self-auto shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            Cập nhật trạng thái
          </button>
        </div>

        {/* PHẦN 4: THÔNG BÁO XÁC NHẬN ĐẶT HÀNG THÀNH CÔNG */}
        {showSuccessCard && (
          <div className="bg-white rounded-[28px] p-6 sm:p-8 border-2 border-emerald-500/40 shadow-lg mb-8 relative overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600" />
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="w-13 h-13 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center shrink-0 text-emerald-700">
                  <CheckCircle2 className="w-7 h-7 stroke-[2.5]" />
                </div>
                <div>
                  <span className="inline-block bg-emerald-50 text-emerald-800 text-[11px] font-bold px-3 py-0.5 rounded-full border border-emerald-200 mb-1.5">
                    Giao dịch đã được ghi nhận
                  </span>
                  <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#3A211E]">
                    Đặt hàng thành công!
                  </h2>
                  <p className="text-sm text-[#6F625E] mt-1 max-w-xl">
                    Cảm ơn bạn đã mua sắm tại Cupfy. Đơn hàng của bạn đã được ghi nhận và đang chờ xác nhận.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:items-end gap-1.5 w-full sm:w-auto bg-[#F7F6F2] sm:bg-transparent p-4 sm:p-0 rounded-2xl shrink-0">
                <div className="text-xs text-[#6F625E]">
                  Mã đơn: <strong className="font-mono text-[#3A211E]">{formattedCode}</strong>
                </div>
                <div className="text-xs text-[#6F625E]">
                  Tổng thanh toán COD: <strong className="text-sm text-[#3A211E]">{formatVND(order.total_price)}</strong>
                </div>
                <div className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                  Chưa cần thanh toán trước • Thu tiền khi giao hàng
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-6 pt-5 border-t border-[#DDD8D2]">
              <button
                onClick={() => {
                  const el = document.getElementById('order-items-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-5 py-2.5 bg-[#3A211E] hover:bg-[#4A2A25] text-white rounded-full text-xs font-bold transition-colors shadow-sm"
              >
                Xem đơn hàng
              </button>
              <Link
                href="/products"
                className="px-5 py-2.5 bg-white border border-[#DDD8D2] hover:bg-[#EDECEA] text-[#3A211E] rounded-full text-xs font-bold transition-colors"
              >
                Tiếp tục mua sắm
              </Link>
            </div>
          </div>
        )}

        {/* Feedback message sau khi gửi yêu cầu hủy */}
        {cancelSuccessMsg && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-2 mb-6 animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{cancelSuccessMsg}</span>
          </div>
        )}

        {/* Tiêu đề trang đơn hàng */}
        <div className="bg-white rounded-[28px] p-6 sm:p-8 border border-[#DDD8D2] shadow-sm mb-8 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#BFDCEF]/40 border border-[#BFDCEF] text-xs font-bold text-[#3A211E] mb-3">
                <FileText className="w-3.5 h-3.5" /> Mã đơn: {formattedCode}
              </div>
              <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#3A211E] mb-2">
                Chi tiết đơn hàng {formattedCode}
              </h1>
              <p className="text-sm text-[#6F625E]">
                Cảm ơn bạn đã mua sắm tại Cupfy. Tiến độ xử lý đơn hàng được cập nhật tự động theo thời gian thực.
              </p>
            </div>

            <div className="text-center sm:text-right shrink-0">
              <span className="text-xs text-[#6F625E] block">Thời gian đặt</span>
              <span className="font-bold text-sm text-[#3A211E]">
                {new Date(order.created_at).toLocaleString('vi-VN', {
                  hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric'
                })}
              </span>
            </div>
          </div>
        </div>

        {/* THANH TIẾN TRÌNH ĐƠN HÀNG (Phần 6.3) */}
        <div className="bg-white rounded-[28px] p-6 sm:p-10 border border-[#DDD8D2] shadow-sm mb-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-heading text-xl font-bold text-[#3A211E]">
              Tiến độ đơn hàng
            </h2>
            {hasCustomCup && (
              <span className="text-xs font-bold text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                ✦ Quy trình sản xuất ly cá nhân hóa (6 bước)
              </span>
            )}
          </div>

          {isCancelled ? (
            <div className="p-5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 flex items-start gap-4">
              <AlertCircle className="w-6 h-6 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-base">Đơn hàng này đã bị hủy</p>
                <p className="text-sm mt-1">
                  Đơn hàng đã được hủy hoặc tất cả các sản phẩm đã được hủy thành công. Nếu bạn cần hỗ trợ thêm, vui lòng liên hệ bộ phận CSKH Cupfy.
                </p>
              </div>
            </div>
          ) : (
            <div>
              {/* Progress Bar for Desktop & Mobile */}
              <div className="relative">
                {/* Horizontal line for desktop */}
                <div className="hidden md:block absolute top-[22px] left-[8%] right-[8%] h-[3px] bg-[#EDECEA] z-0">
                  <div 
                    className="h-full bg-[#3A211E] transition-all duration-500"
                    style={{ width: `${(Math.max(0, currentStepIdx) / (steps.length - 1)) * 100}%` }}
                  />
                </div>

                <div className={`grid grid-cols-1 ${hasCustomCup ? 'md:grid-cols-6' : 'md:grid-cols-4'} gap-6 md:gap-3 relative z-10`}>
                  {steps.map((step, idx) => {
                    const isCompleted = currentStepIdx > idx;
                    const isCurrent = currentStepIdx === idx;

                    return (
                      <div key={step.key} className="flex md:flex-col items-start md:items-center text-left md:text-center gap-4 md:gap-2.5">
                        <div 
                          className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm shrink-0 border-2 transition-all ${
                            isCompleted 
                              ? 'bg-[#3A211E] border-[#3A211E] text-white' 
                              : isCurrent 
                              ? 'bg-white border-[#3A211E] text-[#3A211E] ring-4 ring-[#BFDCEF]' 
                              : 'bg-[#F7F6F2] border-[#DDD8D2] text-[#6F625E]'
                          }`}
                        >
                          {isCompleted ? <Check className="w-5 h-5 stroke-[2.5]" /> : idx + 1}
                        </div>

                        <div>
                          <p className={`text-sm font-bold ${isCurrent ? 'text-[#3A211E]' : isCompleted ? 'text-[#3A211E]' : 'text-[#6F625E]'}`}>
                            {step.label}
                          </p>
                          <p className="text-[11px] text-[#6F625E] mt-0.5 max-w-[170px] leading-relaxed hidden md:block">
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Warning box if design review requires revision */}
              {order.status === 'design_rejected' && (
                <div className="mt-8 p-5 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 flex items-start gap-4">
                  <AlertCircle className="w-6 h-6 shrink-0 text-amber-600 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-bold text-base">Thiết kế của bạn cần được điều chỉnh</h4>
                    <p className="text-xs mt-1 text-amber-800 leading-relaxed">
                      Đội ngũ kỹ thuật viên Cupfy đã kiểm tra và nhận thấy bản thiết kế cần được căn chỉnh lại để đảm bảo chất lượng in ấn sắc nét nhất.
                    </p>
                    {designRejectionReason && (
                      <div className="text-xs font-semibold mt-2.5 p-3 bg-white/90 rounded-xl border border-amber-200 text-[#3A211E]">
                        Ghi chú từ kỹ thuật viên: "{designRejectionReason}"
                      </div>
                    )}
                    <p className="text-xs text-[#6F625E] mt-3">
                      Vui lòng liên hệ Hotline/Zalo Cupfy (0901234567) hoặc nhấp "Xem thiết kế" bên dưới để tạo bản thiết kế mới.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* THÔNG TIN CHI TIẾT ĐƠN HÀNG & SẢN PHẨM */}
        <div id="order-items-section" className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Cột trái: Danh sách sản phẩm (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-[28px] p-6 sm:p-8 border border-[#DDD8D2] shadow-sm">
            <h2 className="font-heading text-xl font-bold text-[#3A211E] mb-6">
              Sản phẩm trong đơn ({order.order_items?.length || 0})
            </h2>

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

                // Check item cancel state
                const isItemCancelled = item.status === 'cancelled';
                const isCancelRequested = item.status?.startsWith('cancel_requested');
                const cancelRequestReason = isCancelRequested ? item.status.split(':::')[1] : '';
                const isCancelRejected = item.status?.startsWith('cancel_rejected');
                const cancelRejectReason = isCancelRejected ? item.status.split(':::')[1] : '';

                // Allowed to request cancel if order is pending/design_review and item is active
                const canRequestCancel = ['pending', 'design_review'].includes(order.status) && !isItemCancelled && !isCancelRequested;

                return (
                  <div key={item.id} className="py-6 first:pt-0 last:pb-0 space-y-4">
                    <div className="flex gap-4 sm:gap-5 items-start">
                      
                      {/* Product Image: Clean, crisp, no overlays (Phần 7) */}
                      <div 
                        onClick={() => isCustom && setSelectedCustomItem(item)}
                        className={`relative w-22 h-22 bg-[#F7F6F2] rounded-2xl border border-[#DDD8D2] overflow-hidden shrink-0 flex items-center justify-center p-1.5 ${
                          isCustom ? 'cursor-pointer hover:border-[#3A211E] transition-colors group' : ''
                        }`}
                      >
                        {prod.image_url ? (
                          <img 
                            src={prod.image_url} 
                            alt={prod.name || 'Ly Cupfy'} 
                            className="w-full h-full object-contain p-1 rounded-xl" 
                          />
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

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-bold text-base text-[#3A211E]">{prod.name}</h4>
                          <span className="font-bold text-sm text-[#3A211E] shrink-0">
                            {formatVND(Number(item.price) * Number(item.quantity))}
                          </span>
                        </div>

                        {isCustom && (
                          <p className="text-xs text-[#4A2A25] font-semibold mt-0.5 flex items-center gap-1">
                            ✦ Ly thiết kế riêng
                          </p>
                        )}

                        <div className="mt-1 flex items-center justify-between text-xs text-[#6F625E]">
                          <span>
                            Số lượng: <strong className="text-[#3A211E]">{item.quantity}</strong> × {formatVND(Number(item.price))}
                          </span>
                        </div>

                        {/* Custom Cup Action: Open 3D View (Phần 3) */}
                        {isCustom && (
                          <div className="mt-3 flex flex-wrap items-center gap-2">
                            <button
                              onClick={() => setSelectedCustomItem(item)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FAF9F6] border border-[#DDD8D2] text-[#3A211E] text-xs font-bold hover:bg-[#EDECEA] transition-colors shadow-xs"
                            >
                              <Eye className="w-3.5 h-3.5 text-amber-700" />
                              Xem thiết kế 3D của bạn
                            </button>
                          </div>
                        )}

                        {/* Item Cancellation State (Phần 5) */}
                        <div className="mt-3">
                          {isItemCancelled ? (
                            <div className="p-2 bg-rose-50 rounded-xl border border-rose-200 text-xs text-rose-700 font-bold inline-flex items-center gap-1.5">
                              <XCircle className="w-3.5 h-3.5" /> Sản phẩm đã được hủy
                            </div>
                          ) : isCancelRequested ? (
                            <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800 space-y-0.5">
                              <span className="font-bold block">⏳ Đang chờ Admin duyệt yêu cầu hủy sản phẩm</span>
                              <span className="text-[11px] text-[#6F625E] block">Lý do: "{cancelRequestReason}"</span>
                            </div>
                          ) : isCancelRejected ? (
                            <div className="p-2.5 bg-neutral-100 rounded-xl border border-neutral-300 text-xs text-neutral-700 space-y-0.5">
                              <span className="font-bold block">Yêu cầu hủy đã bị từ chối</span>
                              <span className="text-[11px] text-[#6F625E] block">Lý do: "{cancelRejectReason}"</span>
                            </div>
                          ) : canRequestCancel ? (
                            <button
                              onClick={() => {
                                setCancellingItem(item);
                                setCancelReason('');
                                setCancelError('');
                              }}
                              className="text-xs font-bold text-rose-600 hover:text-rose-800 hover:underline inline-flex items-center gap-1"
                            >
                              Yêu cầu hủy sản phẩm
                            </button>
                          ) : !['pending', 'design_review'].includes(order.status) ? (
                            <span className="text-[11px] text-[#6F625E]">
                              Vui lòng liên hệ Cupfy để được hỗ trợ nếu cần thay đổi sản phẩm.
                            </span>
                          ) : null}
                        </div>

                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cột phải: Thông tin nhận hàng & Thanh toán (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* THÔNG TIN NHẬN HÀNG */}
            <div className="bg-white rounded-[28px] p-6 sm:p-7 border border-[#DDD8D2] shadow-sm space-y-4">
              <h3 className="font-heading font-bold text-lg text-[#3A211E]">
                Thông tin nhận hàng
              </h3>

              <div className="text-sm space-y-2.5">
                <div>
                  <span className="text-xs text-[#6F625E] block">Người nhận</span>
                  <span className="font-bold text-[#3A211E]">{order.buyer_name_snapshot}</span>
                </div>

                <div>
                  <span className="text-xs text-[#6F625E] block">Số điện thoại</span>
                  <span className="font-semibold text-[#3A211E]">{deliveryPhone}</span>
                </div>

                <div>
                  <span className="text-xs text-[#6F625E] block">Địa chỉ giao hàng</span>
                  <span className="text-[#3A211E] leading-relaxed block">{deliveryAddress}</span>
                </div>

                {deliveryNote && (
                  <div>
                    <span className="text-xs text-[#6F625E] block">Ghi chú giao hàng</span>
                    <span className="italic text-[#6F625E] block">{deliveryNote}</span>
                  </div>
                )}
              </div>
            </div>

            {/* THANH TOÁN & TỔNG CỘNG */}
            <div className="bg-white rounded-[28px] p-6 sm:p-7 border border-[#DDD8D2] shadow-sm space-y-4">
              <h3 className="font-heading font-bold text-lg text-[#3A211E]">
                Thanh toán
              </h3>

              <div className="p-3.5 rounded-xl bg-[#F7F6F2] border border-[#DDD8D2] flex items-center justify-between">
                <div>
                  <p className="font-bold text-sm text-[#3A211E]">Thanh toán khi nhận hàng (COD)</p>
                  <p className="text-xs text-[#6F625E] mt-0.5">Tiền mặt cho nhân viên giao hàng</p>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                  order.status === 'delivered' 
                    ? 'bg-emerald-100 text-emerald-800' 
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {order.status === 'delivered' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                </span>
              </div>

              <div className="space-y-2.5 text-sm pt-2">
                <div className="flex justify-between text-[#6F625E]">
                  <span>Tạm tính</span>
                  <span className="font-semibold text-[#3A211E]">{formatVND(subtotal)}</span>
                </div>
                <div className="flex justify-between text-[#6F625E]">
                  <span>Phí giao hàng</span>
                  <span className="font-semibold text-[#3A211E]">
                    {shippingFee > 0 ? formatVND(shippingFee) : '0 ₫'}
                  </span>
                </div>
                <div className="border-t border-[#DDD8D2] pt-3 flex justify-between items-baseline">
                  <span className="font-bold text-base text-[#3A211E]">Tổng thanh toán COD</span>
                  <span className="font-heading text-2xl font-extrabold text-[#3A211E]">
                    {formatVND(Number(order.total_price))}
                  </span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* MODAL XEM CHI TIẾT THIẾT KẾ 3D (Phần 3) */}
      <CustomCupViewerModal
        isOpen={!!selectedCustomItem}
        onClose={() => setSelectedCustomItem(null)}
        item={selectedCustomItem}
        mode="customer"
      />

      {/* MODAL XÁC NHẬN HỦY SẢN PHẨM (Phần 5) */}
      {cancellingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-[28px] border border-[#DDD8D2] shadow-2xl max-w-md w-full p-6 space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#DDD8D2] pb-4">
              <h3 className="font-heading text-lg font-bold text-[#3A211E]">
                Bạn muốn hủy sản phẩm này?
              </h3>
              <button 
                onClick={() => { setCancellingItem(null); setCancelReason(''); setCancelError(''); }}
                className="text-[#6F625E] hover:text-[#3A211E]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-3 bg-[#FAF9F6] p-3 rounded-2xl border border-[#DDD8D2]">
              <div className="w-14 h-14 bg-white rounded-xl border border-[#DDD8D2] shrink-0 overflow-hidden relative flex items-center justify-center">
                {cancellingItem.products?.image_url ? (
                  <img 
                    src={cancellingItem.products.image_url} 
                    alt="" 
                    className="w-full h-full object-contain p-1" 
                  />
                ) : (
                  <span className="text-xs text-[#6F625E]">No image</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-[#3A211E] truncate">{cancellingItem.products?.name}</p>
                <p className="text-xs text-[#6F625E] mt-0.5">
                  Số lượng: <strong>{cancellingItem.quantity}</strong> • Tổng: <strong>{formatVND(cancellingItem.price * cancellingItem.quantity)}</strong>
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#3A211E] mb-1.5">
                Lý do hủy sản phẩm <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={3}
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Nhập lý do hủy (ví dụ: muốn đổi mẫu thiết kế khác, đặt nhầm số lượng...)"
                className="w-full p-3 bg-[#FAF9F6] border border-[#DDD8D2] rounded-2xl text-xs text-[#3A211E] focus:outline-none focus:ring-2 focus:ring-[#3A211E]/30 resize-none"
              />
              {cancelError && (
                <p className="text-xs text-rose-600 mt-1">{cancelError}</p>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => { setCancellingItem(null); setCancelReason(''); setCancelError(''); }}
                disabled={submittingCancel}
                className="px-5 py-2.5 rounded-full border border-[#DDD8D2] text-[#3A211E] text-xs font-bold hover:bg-[#EDECEA]"
              >
                Giữ sản phẩm
              </button>
              <button
                onClick={handleSendCancelRequest}
                disabled={submittingCancel || !cancelReason.trim()}
                className="px-5 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors disabled:opacity-50 flex items-center gap-1.5"
              >
                {submittingCancel ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                Gửi yêu cầu hủy
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

function OrderDetailContent({ params }: { params: Promise<{ id: string }> }) {
  const { id: orderId } = use(params);
  return <OrderDetailPageInner orderId={orderId} />;
}
