"use client";

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Check, Clock, PackageCheck, Truck, CheckCircle2, AlertCircle, ArrowLeft, RefreshCw, ShieldAlert, FileText } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id: orderId } = use(params);
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrder = async () => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push(`/login?redirect=/orders/${orderId}`);
        return;
      }

      // Check admin status
      const isAdmin = user.email?.toLowerCase().trim() === 'tranchitin2006@gmail.com';

      const { data, error: fetchErr } = await supabase
        .from('orders')
        .select(`
          id, created_at, status, total_price, shipping_address, buyer_id, buyer_name_snapshot, buyer_email_snapshot,
          order_items (
            id, quantity, price, status, product_id,
            products ( id, name, image_url, description, category )
          )
        `)
        .eq('id', orderId)
        .single();

      if (fetchErr || !data) {
        setError('Không tìm thấy thông tin đơn hàng hoặc mã đơn không tồn tại.');
        setLoading(false);
        return;
      }

      // Bảo mật (6.3): Chỉ chủ đơn hàng hoặc Admin mới có quyền xem
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
  }, [orderId]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchOrder();
    setRefreshing(false);
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

  // Parse recipient info from shipping_address if formatted
  const rawAddress = order.shipping_address || '';
  const addressParts = rawAddress.split('|');
  const deliveryAddress = addressParts[0]?.replace('Địa chỉ:', '').trim() || rawAddress;
  const deliveryPhone = addressParts.find((p: string) => p.includes('SĐT:'))?.replace('SĐT:', '').trim() || 'Chưa cung cấp';
  const deliveryNote = addressParts.find((p: string) => p.includes('Ghi chú:'))?.replace('Ghi chú:', '').trim() || '';

  // 4 Steps mapping
  const steps = [
    { key: 'pending', label: 'Chờ xác nhận', desc: 'Đơn hàng đã được ghi nhận và đang chờ Cupfy kiểm tra.' },
    { key: 'confirmed', label: 'Đã xác nhận', desc: 'Cupfy đã xác nhận đơn hàng và chuẩn bị sản xuất/đóng gói.' },
    { key: 'shipping', label: 'Đang giao hàng', desc: 'Đơn hàng đã được bàn giao cho đơn vị vận chuyển.' },
    { key: 'delivered', label: 'Đã giao hàng', desc: 'Đơn hàng đã được giao thành công đến bạn.' },
  ];

  const getStepIndex = (status: string) => {
    switch (status) {
      case 'pending': return 0;
      case 'confirmed':
      case 'in_production':
      case 'design_review':
      case 'quality_check':
      case 'packaging': return 1;
      case 'shipping':
      case 'handed_to_carrier': return 2;
      case 'delivered':
      case 'completed': return 3;
      case 'cancelled': return -1;
      default: return 0;
    }
  };

  const currentStepIdx = getStepIndex(order.status);
  const isCancelled = order.status === 'cancelled';

  const subtotal = (order.order_items || []).reduce((sum: number, item: any) => sum + (Number(item.price) * Number(item.quantity)), 0);
  const shippingFee = 30000;
  const formattedCode = `#${order.id.slice(0, 8).toUpperCase()}`;

  return (
    <div className="min-h-screen bg-[#F7F6F2] pt-28 pb-20">
      <div className="max-w-[1100px] mx-auto px-6">
        
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
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

        {/* Tiêu đề trang trọng */}
        <div className="bg-white rounded-[28px] p-8 border border-[#DDD8D2] shadow-sm mb-8 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#BFDCEF]/40 border border-[#BFDCEF] text-xs font-bold text-[#3A211E] mb-3">
                <FileText className="w-3.5 h-3.5" /> Mã đơn: {formattedCode}
              </div>
              <h1 className="font-heading text-3xl font-bold text-[#3A211E] mb-2">
                Đơn hàng của bạn đã được ghi nhận!
              </h1>
              <p className="text-sm text-[#6F625E]">
                Cảm ơn bạn đã mua sắm tại Cupfy. Chúng tôi sẽ cập nhật tiến độ đơn hàng ngay tại đây.
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

        {/* THANH TIẾN TRÌNH ĐƠN HÀNG (6.1) */}
        <div className="bg-white rounded-[28px] p-6 sm:p-10 border border-[#DDD8D2] shadow-sm mb-8">
          <h2 className="font-heading text-xl font-bold text-[#3A211E] mb-8">
            Tiến độ đơn hàng
          </h2>

          {isCancelled ? (
            <div className="p-5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 flex items-start gap-4">
              <AlertCircle className="w-6 h-6 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-base">Đơn hàng này đã bị hủy</p>
                <p className="text-sm mt-1">
                  Đơn hàng đã được hủy bởi quản trị viên hoặc theo yêu cầu xử lý đơn. Nếu bạn cần hỗ trợ thêm, vui lòng liên hệ bộ phận Chăm sóc khách hàng Cupfy.
                </p>
              </div>
            </div>
          ) : (
            <div>
              {/* Progress Bar for Desktop & Mobile */}
              <div className="relative">
                {/* Horizontal line for desktop */}
                <div className="hidden md:block absolute top-[22px] left-[10%] right-[10%] h-[3px] bg-[#EDECEA] z-0">
                  <div 
                    className="h-full bg-[#3A211E] transition-all duration-500"
                    style={{ width: `${(Math.max(0, currentStepIdx) / (steps.length - 1)) * 100}%` }}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-4 relative z-10">
                  {steps.map((step, idx) => {
                    const isCompleted = currentStepIdx > idx;
                    const isCurrent = currentStepIdx === idx;

                    return (
                      <div key={step.key} className="flex md:flex-col items-start md:items-center text-left md:text-center gap-4 md:gap-3">
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
                          <p className={`text-base font-bold ${isCurrent ? 'text-[#3A211E]' : isCompleted ? 'text-[#3A211E]' : 'text-[#6F625E]'}`}>
                            {step.label}
                          </p>
                          <p className="text-xs text-[#6F625E] mt-1 max-w-[200px] leading-relaxed">
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* THÔNG TIN CHI TIẾT ĐƠN HÀNG & SẢN PHẨM */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Cột trái: Danh sách sản phẩm (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-[28px] p-6 sm:p-8 border border-[#DDD8D2] shadow-sm">
            <h2 className="font-heading text-xl font-bold text-[#3A211E] mb-6">
              Sản phẩm trong đơn ({order.order_items?.length || 0})
            </h2>

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
                  <div key={item.id} className="py-5 first:pt-0 last:pb-0 flex gap-4 sm:gap-5 items-start">
                    <div className="relative w-20 h-20 bg-[#F7F6F2] rounded-2xl border border-[#DDD8D2] overflow-hidden shrink-0 flex items-center justify-center p-1.5">
                      {prod.image_url ? (
                        <Image 
                          src={prod.image_url} 
                          alt={prod.name || 'Ly Cupfy'} 
                          fill 
                          className="object-contain p-1.5" 
                        />
                      ) : (
                        <span className="text-xs text-[#6F625E]">No image</span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-base text-[#3A211E]">{prod.name}</h4>
                      
                      {specs && (
                        <div className="mt-2 p-3 bg-[#F7F6F2] rounded-xl text-xs text-[#6F625E] space-y-1 border border-[#DDD8D2]/60">
                          {specs.modelName && <p><span className="font-semibold text-[#3A211E]">Kiểu ly:</span> {specs.modelName}</p>}
                          {specs.cupColorName && <p><span className="font-semibold text-[#3A211E]">Màu sắc:</span> {specs.cupColorName}</p>}
                          {specs.lidColor && <p><span className="font-semibold text-[#3A211E]">Màu nắp:</span> {specs.lidColor}</p>}
                          {specs.customText && <p><span className="font-semibold text-[#3A211E]">Chữ in:</span> "{specs.customText}" (Font: {specs.font || 'Chuẩn'})</p>}
                        </div>
                      )}

                      <div className="mt-3 flex items-center justify-between text-sm">
                        <span className="text-[#6F625E]">
                          Số lượng: <strong className="text-[#3A211E]">{item.quantity}</strong> × {Number(item.price).toLocaleString('vi-VN')} ₫
                        </span>
                        <span className="font-bold text-[#3A211E]">
                          {(Number(item.price) * Number(item.quantity)).toLocaleString('vi-VN')} ₫
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cột phải: Thông tin giao hàng & Tổng thanh toán (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* THÔNG TIN GIAO HÀNG & NGƯỜI NHẬN */}
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
                  <p className="text-xs text-[#6F625E] mt-0.5">Tiền mặt cho bưu tá</p>
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
                  <span className="font-semibold text-[#3A211E]">{subtotal.toLocaleString('vi-VN')} ₫</span>
                </div>
                <div className="flex justify-between text-[#6F625E]">
                  <span>Phí giao hàng</span>
                  <span className="font-semibold text-[#3A211E]">{shippingFee.toLocaleString('vi-VN')} ₫</span>
                </div>
                <div className="border-t border-[#DDD8D2] pt-3 flex justify-between items-baseline">
                  <span className="font-bold text-base text-[#3A211E]">Tổng thanh toán</span>
                  <span className="font-heading text-2xl font-extrabold text-[#3A211E]">
                    {Number(order.total_price).toLocaleString('vi-VN')} ₫
                  </span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
