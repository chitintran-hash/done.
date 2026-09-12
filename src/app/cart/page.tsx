"use client";

import { useCartStore } from '@/store/useCartStore';
import { useRouter } from 'next/navigation';
import { Store, Truck, ArrowRight, ShoppingBag, Trash2, Plus, Minus, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { formatVND } from '@/lib/utils/currency';
import { SHIPPING_FEE } from '@/lib/constants';

export default function CartPage() {
  const cart = useCartStore();
  const router = useRouter();

  if (cart.items.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-6">
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center">
          <ShoppingBag className="w-10 h-10 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-bold">Giỏ quà của bạn đang trống</h2>
        <p className="text-muted-foreground text-center max-w-md">
          Có vẻ như bạn chưa thêm món quà nào vào giỏ. Khám phá ngay bộ sưu tập quà tặng của DONE. Gifting.
        </p>
        <div className="flex gap-4 mt-4">
          <button onClick={() => router.push('/gift-finder')} className="px-6 py-3 bg-primary text-white rounded-full font-bold transition-colors hover:bg-primary/90">
            Tìm quà cho người ấy
          </button>
          <button onClick={() => router.push('/products')} className="px-6 py-3 bg-muted text-foreground rounded-full font-bold transition-colors hover:bg-border">
            Xem tất cả quà tặng
          </button>
        </div>
      </div>
    );
  }

  // Group products by Seller ID (Sub-orders)
  const subOrders = cart.items.reduce((acc: Record<string, any>, item) => {
    if (!acc[item.sellerId]) {
      acc[item.sellerId] = {
        sellerId: item.sellerId,
        storeName: item.storeName || 'Cửa hàng DONE.',
        items: [],
        subtotal: 0,
        shippingFee: SHIPPING_FEE,
        maxDelivery: 0
      };
    }
    acc[item.sellerId].items.push(item);
    acc[item.sellerId].subtotal += item.price * item.quantity;
    if (item.deliveryDays > acc[item.sellerId].maxDelivery) {
      acc[item.sellerId].maxDelivery = item.deliveryDays;
    }
    return acc;
  }, {} as Record<string, any>);

  const subOrdersList = Object.values(subOrders);
  const totalShipping = subOrdersList.reduce((sum, order) => sum + order.shippingFee, 0);
  const itemsTotal = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const masterTotal = itemsTotal + totalShipping;

  return (
    <div className="min-h-screen bg-muted/20 p-6 lg:p-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-end mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <ShoppingBag className="w-8 h-8" /> Giỏ hàng của bạn
          </h1>
          <button onClick={() => cart.clearCart()} className="text-sm text-red-600 font-medium hover:underline flex items-center gap-1">
            <Trash2 className="w-4 h-4" /> Xóa tất cả
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {subOrdersList.length > 1 && (
              <div className="p-4 bg-orange-50 text-orange-800 border border-orange-200 rounded-xl text-sm font-medium flex gap-3">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>Cảnh báo: Giỏ hàng của bạn bao gồm sản phẩm từ {subOrdersList.length} Người Bán khác nhau. Đơn hàng sẽ được tách thành {subOrdersList.length} kiện hàng (Sub-orders) và có thể giao vào các thời điểm khác nhau.</span>
              </div>
            )}

            {subOrdersList.map((order, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
                <div className="bg-muted/30 px-6 py-4 border-b border-border flex flex-wrap gap-4 items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-lg">
                    <Store className="w-5 h-5 text-muted-foreground" />
                    {order.storeName}
                  </div>
                  <div className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <Truck className="w-4 h-4" /> Nhận hàng trong khoảng {order.maxDelivery} ngày
                  </div>
                </div>
                
                <div className="p-6 space-y-6">
                  {order.items.map((item: any) => (
                    <div key={item.id} className="flex gap-4 items-start sm:items-center flex-col sm:flex-row">
                      <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-xl border border-border bg-muted" />
                      <div className="flex-1">
                        <Link href={`/products/${item.id}`} className="font-bold hover:text-accent transition-colors line-clamp-1">{item.name}</Link>
                        <div className="font-bold text-lg text-accent mt-1">
                          {formatVND(item.price)}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                        <div className="flex items-center gap-3 bg-muted/50 rounded-lg p-1 border border-border">
                          <button 
                            onClick={() => {
                              if (item.quantity > 1) {
                                cart.updateQuantity(item.id, item.quantity - 1);
                              } else {
                                cart.removeItem(item.id);
                              }
                            }}
                            className="w-8 h-8 flex items-center justify-center bg-white rounded shadow-sm hover:text-accent"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="font-medium w-4 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => cart.updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center bg-white rounded shadow-sm hover:text-accent"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <button 
                          onClick={() => cart.removeItem(item.id)}
                          className="p-2 text-muted-foreground hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-muted/30 border-t border-border flex justify-between items-center">
                <div className="text-muted-foreground font-medium">
                  Tổng {order.items.reduce((s:number, i:any) => s + i.quantity, 0)} sản phẩm + Phí ship {formatVND(order.shippingFee)}
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-muted-foreground">Tạm tính (Sub-order)</div>
                  <div className="font-bold text-xl text-accent">{formatVND(order.subtotal + order.shippingFee)}</div>
                </div>
              </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-border p-6 sticky top-24 shadow-sm">
              <h2 className="text-xl font-bold mb-6">Tổng đơn hàng</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-medium">Tạm tính ({cart.items.length} sản phẩm)</span>
                  <span className="font-bold">{formatVND(itemsTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-medium">Tổng phí giao hàng</span>
                  <span className="font-bold">{formatVND(totalShipping)}</span>
                </div>
              </div>
              <div className="pt-4 border-t border-border flex justify-between items-end">
                <span className="font-bold text-lg">Tổng thanh toán</span>
                <span className="text-3xl font-black text-accent">{formatVND(masterTotal)}</span>
              </div>
              <p className="text-right text-xs text-muted-foreground mt-1">Đã bao gồm VAT</p>

              <button 
                onClick={() => router.push('/checkout')}
                className="w-full py-4 bg-foreground text-background rounded-xl font-bold text-lg hover:bg-foreground/90 transition-all flex items-center justify-center gap-2 mt-6"
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
