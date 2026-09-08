"use client";

import { useEffect, useState } from 'react';
import { Package, Truck, DollarSign, AlertCircle, ShoppingBag, Box } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SellerDashboard() {
  const router = useRouter();
  const supabase = createClient();
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeProducts: 0,
    lowStockProducts: 0,
    outOfStockProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    revenue: 0
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const sellerId = user.id;

      // Fetch Products Stats
      const { data: products } = await supabase
        .from('products')
        .select('is_available, stock')
        .eq('seller_id', sellerId);
      
      const totalProducts = products?.length || 0;
      const activeProducts = products?.filter(p => p.is_available).length || 0;
      const lowStockProducts = products?.filter(p => p.stock > 0 && p.stock <= 5).length || 0;
      const outOfStockProducts = products?.filter(p => p.stock === 0).length || 0;

      // Fetch Orders Stats (from order_items)
      const { data: orderItems } = await supabase
        .from('order_items')
        .select('id, order_id, price, quantity, status, created_at, products(name)')
        .eq('seller_id', sellerId)
        .order('created_at', { ascending: false });

      const uniqueOrders = new Set(orderItems?.map(item => item.order_id));
      const totalOrders = uniqueOrders.size;
      const pendingOrders = orderItems?.filter(item => item.status === 'pending').length || 0;
      const revenue = orderItems?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;

      setStats({ 
        totalProducts, 
        activeProducts, 
        lowStockProducts, 
        outOfStockProducts, 
        totalOrders, 
        pendingOrders,
        revenue 
      });

      // Get 5 recent order items
      setRecentOrders(orderItems?.slice(0, 5) || []);
      setLoading(false);
    };

    fetchDashboard();
  }, []);

  if (loading) return <div className="p-8">Đang tải dữ liệu Dashboard...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Tổng quan Cửa hàng</h1>
        <p className="text-muted-foreground mt-2">Cập nhật tình hình kinh doanh của bạn trên hệ thống DONE.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Metric Cards */}
        <div className="bg-white p-6 rounded-2xl border border-border shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <p className="text-sm font-medium text-muted-foreground">Tổng Doanh Thu</p>
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-green-600">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-foreground">
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(stats.revenue)}
          </h3>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-border shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <p className="text-sm font-medium text-muted-foreground">Đơn Hàng Mới (Chờ xử lý)</p>
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-foreground">
            {stats.pendingOrders} <span className="text-sm font-normal text-muted-foreground">/ {stats.totalOrders} tổng</span>
          </h3>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-border shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <p className="text-sm font-medium text-muted-foreground">Sản Phẩm Đang Bán</p>
            <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center text-orange-600">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-foreground">
            {stats.activeProducts} <span className="text-sm font-normal text-muted-foreground">/ {stats.totalProducts} tổng</span>
          </h3>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-border shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <p className="text-sm font-medium text-muted-foreground">Cảnh Báo Tồn Kho</p>
            <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center text-red-600">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="flex gap-4">
            <div>
              <div className="text-xl font-bold text-red-600">{stats.outOfStockProducts}</div>
              <div className="text-xs text-muted-foreground">Hết hàng</div>
            </div>
            <div>
              <div className="text-xl font-bold text-yellow-600">{stats.lowStockProducts}</div>
              <div className="text-xs text-muted-foreground">Sắp hết</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-muted/30">
          <h2 className="font-bold text-lg">Đơn hàng gần đây</h2>
          <Link href="/seller/orders" className="text-sm text-accent hover:underline font-medium">
            Xem tất cả
          </Link>
        </div>
        
        {recentOrders.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            <Box className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>Chưa có đơn hàng nào.</p>
            <p className="text-sm mt-1">Đơn hàng mới sẽ xuất hiện tại đây.</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {recentOrders.map(order => (
              <div key={order.id} className="p-4 px-6 flex items-center justify-between hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                    <ShoppingBag className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm line-clamp-1">{order.products?.name}</h4>
                    <p className="text-xs text-muted-foreground">Mã đơn: #{order.order_id.split('-')[0].toUpperCase()} • {new Date(order.created_at).toLocaleDateString('vi-VN')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="font-bold text-sm">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.price * order.quantity)}
                    </div>
                    <div className="text-xs text-muted-foreground">SL: {order.quantity}</div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-bold w-24 text-center ${
                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    order.status === 'preparing' ? 'bg-blue-100 text-blue-700' :
                    order.status === 'shipped' ? 'bg-green-100 text-green-700' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {order.status.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
