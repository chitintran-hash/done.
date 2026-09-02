"use client";

import { useGoalStore } from '@/store/useGoalStore';
import { useRouter } from 'next/navigation';
import { Store, Truck, ArrowRight, ShoppingBag } from 'lucide-react';
import { buildSolutions } from '@/lib/engine/compatibility';
import { useMemo } from 'react';

export default function CartPage() {
  const store = useGoalStore();
  const router = useRouter();

  // In a real app, cart is stored in its own state/DB. For MVP, we'll just re-evaluate Best-fit.
  const solution = useMemo(() => {
    if (!store.goal) return null;
    const solutions = buildSolutions({
      budget: store.budget,
      maxWidth: store.maxWidth,
      style: store.style,
      ownedItems: store.ownedItems,
      deadlineDays: store.deadlineDays
    });
    return solutions.find(s => s.type === 'best-fit') || solutions[0];
  }, [store]);

  if (!solution) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-6">
        <h2 className="text-2xl font-bold">Giỏ hàng trống</h2>
        <button onClick={() => router.push('/build')} className="px-6 py-3 bg-foreground text-background rounded-full font-medium">
          Tạo Solution ngay
        </button>
      </div>
    );
  }

  // Group products by Seller ID (Sub-orders)
  const subOrders = solution.products.reduce((acc, product) => {
    if (!acc[product.sellerId]) {
      acc[product.sellerId] = {
        sellerId: product.sellerId,
        products: [],
        subtotal: 0,
        shippingFee: 35000, // Mock fixed shipping fee per seller
        maxDelivery: 0
      };
    }
    acc[product.sellerId].products.push(product);
    acc[product.sellerId].subtotal += product.price;
    if (product.deliveryDays > acc[product.sellerId].maxDelivery) {
      acc[product.sellerId].maxDelivery = product.deliveryDays;
    }
    return acc;
  }, {} as Record<string, any>);

  const subOrdersList = Object.values(subOrders);
  const totalShipping = subOrdersList.reduce((sum, order) => sum + order.shippingFee, 0);
  const masterTotal = solution.totalPrice + totalShipping;

  return (
    <div className="min-h-screen bg-muted/20 p-6 lg:p-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <ShoppingBag className="w-8 h-8" /> Giỏ hàng Solution
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {subOrdersList.length > 1 && (
              <div className="p-4 bg-orange-50 text-orange-800 border border-orange-200 rounded-xl text-sm font-medium">
                Cảnh báo: Bộ giải pháp của bạn được cung cấp bởi {subOrdersList.length} nhà bán khác nhau. Đơn hàng sẽ được tách thành {subOrdersList.length} kiện hàng (Sub-orders) và có thể giao vào các thời điểm khác nhau.
              </div>
            )}

            {subOrdersList.map((order, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-border overflow-hidden">
                <div className="bg-muted/30 px-6 py-4 border-b border-border flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-lg">
                    <Store className="w-5 h-5 text-muted-foreground" />
                    {order.sellerId.replace('seller-', '').toUpperCase()}
                  </div>
                  <div className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <Truck className="w-4 h-4" /> Nhận hàng trong {order.maxDelivery} ngày
                  </div>
                </div>
                
                <div className="p-6 space-y-6">
                  {order.products.map((p: any) => (
                    <div key={p.id} className="flex gap-4 items-center">
                      <img src={p.image} alt={p.name} className="w-20 h-20 object-cover rounded-xl border border-border" />
                      <div className="flex-1">
                        <h4 className="font-bold">{p.name}</h4>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{p.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg">
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p.price)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-muted/10 px-6 py-4 border-t border-border flex justify-end items-center gap-6">
                  <div className="text-sm text-muted-foreground">Phí giao hàng: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.shippingFee)}</div>
                  <div className="font-bold">
                    Tạm tính: <span className="text-accent">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.subtotal + order.shippingFee)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-border p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-6">Master Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-muted-foreground">
                  <span>Tổng tiền hàng ({solution.products.length} sản phẩm)</span>
                  <span className="font-medium text-foreground">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(solution.totalPrice)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Tổng phí giao hàng ({subOrdersList.length} kiện)</span>
                  <span className="font-medium text-foreground">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalShipping)}</span>
                </div>
              </div>

              <div className="pt-6 border-t border-border mb-8">
                <div className="flex justify-between items-end">
                  <span className="font-bold text-lg">Tổng cộng</span>
                  <span className="font-black text-3xl text-accent">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(masterTotal)}</span>
                </div>
                <p className="text-right text-xs text-muted-foreground mt-1">Đã bao gồm VAT</p>
              </div>

              <button 
                onClick={() => router.push('/checkout')}
                className="w-full py-4 bg-foreground text-background rounded-xl font-bold text-lg hover:bg-foreground/90 transition-all flex items-center justify-center gap-2"
              >
                Tiến hành thanh toán
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
