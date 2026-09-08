"use client";

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Package, Search } from 'lucide-react';

export default function SellerOrdersPage() {
  const supabase = createClient();
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Fetch order items that belong to this seller
    const { data, error } = await supabase
      .from('order_items')
      .select(`
        id, quantity, price, status, created_at,
        orders ( id, shipping_address, buyer_id ),
        products ( name, sku, image_url )
      `)
      .eq('seller_id', user.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setOrderItems(data);
    }
    setLoading(false);
  };

  const updateStatus = async (id: string, newStatus: string) => {
    await supabase.from('order_items').update({ status: newStatus }).eq('id', id);
    fetchOrders();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Quản lý Đơn hàng</h1>
        <p className="text-muted-foreground mt-1">Xử lý các đơn hàng (Sub-orders) được phân bổ cho cửa hàng của bạn.</p>
      </div>

      <div className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Tìm mã đơn hàng..." 
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-border focus:border-accent focus:outline-none"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-muted-foreground">Đang tải dữ liệu đơn hàng...</div>
        ) : orderItems.length === 0 ? (
          <div className="p-16 text-center text-muted-foreground">
            <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
            <p>Chưa có đơn hàng nào.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border bg-muted/20 text-sm">
                  <th className="px-6 py-4 font-medium text-muted-foreground">Sản phẩm</th>
                  <th className="px-6 py-4 font-medium text-muted-foreground">Master Order</th>
                  <th className="px-6 py-4 font-medium text-muted-foreground">Số lượng</th>
                  <th className="px-6 py-4 font-medium text-muted-foreground">Tổng tiền</th>
                  <th className="px-6 py-4 font-medium text-muted-foreground">Trạng thái</th>
                  <th className="px-6 py-4 font-medium text-muted-foreground">Cập nhật</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {orderItems.map((item) => (
                  <tr key={item.id} className="border-b border-border hover:bg-muted/10 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={item.products?.image_url} alt="" className="w-10 h-10 rounded object-cover border border-border" />
                        <div>
                          <p className="font-bold">{item.products?.name}</p>
                          <p className="text-xs text-muted-foreground">SKU: {item.products?.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs">
                      {item.orders?.id.substring(0, 8)}...
                      <div className="mt-1 text-muted-foreground truncate w-32" title={item.orders?.shipping_address}>
                        {item.orders?.shipping_address}
                      </div>
                    </td>
                    <td className="px-6 py-4">{item.quantity}</td>
                    <td className="px-6 py-4 font-bold text-accent">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price * item.quantity)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-bold rounded-md ${
                        item.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        item.status === 'preparing' ? 'bg-blue-100 text-blue-700' :
                        item.status === 'shipped' ? 'bg-green-100 text-green-700' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {item.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <select 
                        value={item.status} 
                        onChange={(e) => updateStatus(item.id, e.target.value)}
                        className="text-xs p-2 rounded border border-border bg-white"
                      >
                        <option value="pending">Chờ xác nhận</option>
                        <option value="preparing">Đang chuẩn bị</option>
                        <option value="shipped">Đã gửi hàng</option>
                        <option value="cancelled">Hủy</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
