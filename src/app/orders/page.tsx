"use client";

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Package, Search, Truck } from 'lucide-react';
import Link from 'next/link';

export default function BuyerOrdersPage() {
  const supabase = createClient();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Fetch master orders for the buyer
    const { data, error } = await supabase
      .from('orders')
      .select(`
        id, created_at, status, total_price, shipping_address,
        order_items (
          id, quantity, price, status,
          products ( name, image_url, profiles (store_name) )
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
    return <div className="p-12 text-center text-muted-foreground">Đang tải đơn hàng...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 min-h-[80vh]">
      <h1 className="text-3xl font-bold mb-8">Đơn hàng của tôi</h1>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-muted/20 rounded-3xl border border-border border-dashed">
          <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Chưa có đơn hàng nào</h3>
          <p className="text-muted-foreground mb-6">Bạn chưa mua bất kỳ sản phẩm nào trên DONE.</p>
          <Link href="/products" className="px-6 py-3 bg-foreground text-background rounded-full font-medium">Mua sắm ngay</Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm">
              <div className="bg-muted/30 px-6 py-4 border-b border-border flex flex-wrap gap-4 items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Mã đơn hàng</p>
                  <p className="font-mono font-bold text-sm">#{order.id.split('-')[0].toUpperCase()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Ngày đặt</p>
                  <p className="font-bold text-sm">{new Date(order.created_at).toLocaleDateString('vi-VN')}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tổng tiền</p>
                  <p className="font-bold text-sm text-accent">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.total_price)}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    order.status === 'completed' ? 'bg-green-100 text-green-700' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    <Truck className="w-3 h-3" />
                    {order.status.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="divide-y divide-border">
                {order.order_items.map((item: any) => (
                  <div key={item.id} className="p-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                    <img src={item.products?.image_url} alt="" className="w-20 h-20 object-cover rounded-lg border border-border" />
                    <div className="flex-1">
                      <h4 className="font-bold text-lg leading-tight mb-1">{item.products?.name}</h4>
                      <p className="text-sm text-muted-foreground mb-2">Cung cấp bởi: <strong>{item.products?.profiles?.store_name || 'Người bán DONE.'}</strong></p>
                      <div className="flex items-center gap-4 text-sm font-medium">
                        <span className="text-accent">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}</span>
                        <span className="text-muted-foreground">x{item.quantity}</span>
                      </div>
                    </div>
                    <div className="text-right w-full sm:w-auto">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        item.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        item.status === 'preparing' ? 'bg-blue-100 text-blue-700' :
                        item.status === 'shipped' ? 'bg-green-100 text-green-700' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {item.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
