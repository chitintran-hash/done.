"use client";

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Package, Truck, ArrowRight, Eye, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending: { label: "Chờ xác nhận", color: "bg-[#FFF3C4] text-[#3A211E]" },
  design_review: { label: "Đang kiểm tra thiết kế", color: "bg-[#FFF3C4] text-[#3A211E]" },
  design_rejected: { label: "Cần điều chỉnh thiết kế", color: "bg-orange-100 text-orange-800" },
  confirmed: { label: "Đã xác nhận", color: "bg-[#FFF3C4] text-[#3A211E]" },
  in_production: { label: "Đang sản xuất", color: "bg-[#FFF3C4] text-[#3A211E]" },
  shipping: { label: "Đang giao hàng", color: "bg-amber-100 text-amber-900" },
  delivered: { label: "Đã giao hàng", color: "bg-emerald-100 text-emerald-800" },
  completed: { label: "Đã giao hàng", color: "bg-emerald-100 text-emerald-800" },
  cancelled: { label: "Đã hủy", color: "bg-rose-100 text-rose-800" },
};

export default function BuyerOrdersPage() {
  const supabase = createClient();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('orders')
      .select(`
        id, created_at, status, total_price, shipping_address,
        order_items (
          id, quantity, price, status,
          products ( id, name, image_url, category )
        )
      `)
      .eq('buyer_id', user.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setOrders(data);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center pt-28">
        <RefreshCw className="w-8 h-8 animate-spin text-[#3A211E] mb-3" />
        <p className="text-sm text-[#765B52]">Đang tải danh sách đơn hàng...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-28 pb-20">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-heading text-3xl font-bold text-[#3A211E]">
              Đơn hàng của tôi
            </h1>
            <p className="text-sm text-[#765B52] mt-1">
              Theo dõi và quản lý toàn bộ đơn hàng của bạn tại Cupfy
            </p>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-20 px-6 bg-white rounded-[28px] border border-[#E8DFD8] shadow-xs">
            <div className="w-20 h-20 bg-[#FFF9E8] rounded-3xl border border-[#E8DFD8] flex items-center justify-center text-3xl mx-auto mb-4">
              <Package className="w-10 h-10 text-[#765B52]" />
            </div>
            <h3 className="font-heading text-2xl font-bold text-[#3A211E] mb-2">
              Bạn chưa có đơn hàng nào.
            </h3>
            <p className="text-sm text-[#765B52] max-w-md mx-auto mb-8">
              Hãy bắt đầu mua sắm hoặc tự tay thiết kế chiếc ly đặc biệt cho bản thân nhé!
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                href="/products" 
                className="px-8 py-3.5 bg-[#3A211E] hover:bg-[#201817] text-white rounded-full font-bold text-sm transition-colors shadow-xs"
              >
                Khám phá cửa hàng
              </Link>
              <Link 
                href="/custom-cup" 
                className="px-8 py-3.5 bg-[#FFBF00] text-[#3A211E] hover:bg-[#FFBF00]/90 rounded-full font-bold text-sm transition-colors shadow-xs"
              >
                Thiết kế ly ngay
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const formattedCode = `#${order.id.slice(0, 8).toUpperCase()}`;
              const totalItems = (order.order_items || []).reduce((sum: number, it: any) => sum + (it.quantity || 1), 0);
              const firstItem = order.order_items?.[0]?.products;

              return (
                <div 
                  key={order.id} 
                  className="bg-white border border-[#E8DFD8] rounded-[24px] overflow-hidden shadow-xs hover:shadow-md transition-shadow"
                >
                  {/* Header card */}
                  <div className="bg-[#FFF9E8] px-6 py-4 border-b border-[#E8DFD8] flex flex-wrap gap-4 items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-xs text-[#765B52]">Mã đơn hàng</p>
                        <p className="font-mono font-bold text-[#3A211E]">{formattedCode}</p>
                      </div>
                      <div className="hidden sm:block border-l border-[#E8DFD8] pl-4">
                        <p className="text-xs text-[#765B52]">Ngày đặt</p>
                        <p className="font-semibold text-[#3A211E]">
                          {new Date(order.created_at).toLocaleDateString('vi-VN')}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                        STATUS_LABELS[order.status]?.color || 'bg-[#FFF3C4] text-[#3A211E]'
                      }`}>
                        <Truck className="w-3.5 h-3.5" />
                        {STATUS_LABELS[order.status]?.label || order.status}
                      </span>

                      <Link
                        href={`/orders/${order.id}`}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#3A211E] hover:bg-[#201817] text-white rounded-full text-xs font-bold transition-colors shadow-xs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Xem chi tiết
                      </Link>
                    </div>
                  </div>

                  {/* Body card: Preview sản phẩm */}
                  <div className="p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="relative w-16 h-16 rounded-xl bg-[#FFF9E8] border border-[#E8DFD8] overflow-hidden shrink-0 flex items-center justify-center p-1">
                          {firstItem?.image_url ? (
                            <Image 
                              src={firstItem.image_url} 
                              alt={firstItem.name || 'Sản phẩm'} 
                              fill 
                              className="object-contain p-1" 
                            />
                          ) : (
                            <span className="text-xs text-[#765B52]">Ly Cupfy</span>
                          )}
                        </div>

                        <div>
                          <h4 className="font-bold text-base text-[#3A211E]">
                            {firstItem?.name || 'Sản phẩm Cupfy'}
                            {order.order_items?.length > 1 && (
                              <span className="text-xs text-[#765B52] font-normal ml-2">
                                + {order.order_items.length - 1} sản phẩm khác
                              </span>
                            )}
                          </h4>
                          <p className="text-xs text-[#765B52] mt-0.5">
                            Tổng cộng {totalItems} sản phẩm
                          </p>
                        </div>
                      </div>

                      <div className="text-left sm:text-right border-t sm:border-t-0 pt-3 sm:pt-0 w-full sm:w-auto">
                        <span className="text-xs text-[#765B52] block">Tổng thanh toán</span>
                        <span className="font-heading font-bold text-xl text-[#3A211E]">
                          {Number(order.total_price).toLocaleString('vi-VN')} ₫
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
