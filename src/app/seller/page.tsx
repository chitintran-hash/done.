"use client";

import { useEffect, useState } from 'react';
import { Package, Truck, DollarSign, TrendingUp } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function SellerDashboard() {
  const router = useRouter();
  const supabase = createClient();
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeProducts: 0,
    totalOrders: 0,
    revenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const sellerId = user.id;

      // Fetch Products Stats
      const { data: products } = await supabase
        .from('products')
        .select('is_available')
        .eq('seller_id', sellerId);
      
      const totalProducts = products?.length || 0;
      const activeProducts = products?.filter(p => p.is_available).length || 0;

      // Fetch Orders Stats (from order_items)
      const { data: orderItems } = await supabase
        .from('order_items')
        .select('order_id, price, quantity')
        .eq('seller_id', sellerId);

      const uniqueOrders = new Set(orderItems?.map(item => item.order_id));
      const totalOrders = uniqueOrders.size;
      const revenue = orderItems?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;

      setStats({ totalProducts, activeProducts, totalOrders, revenue });
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
        <div className="bg-white p-6 rounded-2xl border border-border shadow-sm flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Doanh thu</p>
            <h3 className="text-2xl font-bold text-foreground">
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(stats.revenue)}
            </h3>
          </div>
          <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-border shadow-sm flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Đơn hàng (Sub-orders)</p>
            <h3 className="text-2xl font-bold text-foreground">{stats.totalOrders}</h3>
          </div>
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
            <Truck className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-border shadow-sm flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Sản phẩm đang bán</p>
            <h3 className="text-2xl font-bold text-foreground">{stats.activeProducts} <span className="text-sm font-normal text-muted-foreground">/ {stats.totalProducts}</span></h3>
          </div>
          <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
            <Package className="w-6 h-6" />
          </div>
        </div>
      </div>
    </div>
  );
}
