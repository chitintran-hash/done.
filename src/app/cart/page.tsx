"use client";

import { useCartStore } from '@/store/useCartStore';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function CartPage() {
  const cart = useCartStore();
  const router = useRouter();

  if (cart.items.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-6">
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center">
          <ShoppingBag className="w-10 h-10 text-muted-foreground" />
        </div>
        <h2 className="text-3xl font-serif font-bold text-foreground">Giỏ hàng của bạn đang trống</h2>
        <p className="text-muted-foreground text-center max-w-md text-lg">
          Hãy khám phá những chiếc ly xinh xắn tại Cupfy nhé.
        </p>
        <div className="flex gap-4 mt-6">
          <button onClick={() => router.push('/products')} className="px-8 py-4 bg-primary text-white rounded-full font-medium transition-colors hover:bg-primary/90">
            Khám phá Shop
          </button>
        </div>
      </div>
    );
  }

  const subtotal = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingFee = 30000;
  const total = subtotal + shippingFee;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-serif font-bold text-foreground mb-12">Giỏ hàng</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-border rounded-3xl p-6">
            <div className="space-y-6 divide-y divide-border">
              {cart.items.map((item, index) => (
                <div key={item.id + index} className="flex gap-6 pt-6 first:pt-0">
                  <div className="w-24 h-24 bg-muted rounded-xl flex-shrink-0 overflow-hidden relative">
                    <img src={item.image || 'https://images.unsplash.com/photo-1544885896-01584c6c0b39?w=600&q=80'} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h3 className="font-medium text-lg text-foreground">{item.name}</h3>
                        {item.isCustom && (
                          <div className="mt-1 text-sm text-primary font-medium bg-primary/10 px-2 py-1 rounded w-max">
                            + Ly thiết kế riêng
                            {item.customText && <div className="text-xs mt-1 text-muted-foreground">Text: {item.customText}</div>}
                          </div>
                        )}
                      </div>
                      <span className="font-bold text-lg text-foreground whitespace-nowrap">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price * item.quantity)}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-end">
                      <div className="flex items-center border border-border rounded-full h-10 w-28 justify-between px-3 mt-4">
                        <button onClick={() => cart.updateQuantity(item.id, item.quantity - 1)} className="text-muted-foreground hover:text-foreground">
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="font-medium">{item.quantity}</span>
                        <button onClick={() => cart.updateQuantity(item.id, item.quantity + 1)} className="text-muted-foreground hover:text-foreground">
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <button onClick={() => cart.removeItem(item.id)} className="text-red-500 hover:text-red-600 p-2 hover:bg-red-50 rounded-full transition-colors">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-muted/30 rounded-3xl p-8 border border-border sticky top-28">
            <h2 className="text-xl font-bold mb-6 text-foreground">Tóm tắt đơn hàng</h2>
            <div className="space-y-4 mb-6 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Tạm tính ({cart.items.reduce((s, i) => s + i.quantity, 0)} sản phẩm)</span>
                <span className="font-medium text-foreground">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Phí giao hàng</span>
                <span className="font-medium text-foreground">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(shippingFee)}
                </span>
              </div>
            </div>
            
            <div className="border-t border-border pt-6 mb-8">
              <div className="flex justify-between items-end">
                <span className="font-bold text-foreground">Tổng cộng</span>
                <span className="text-3xl font-bold text-primary">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground text-right mt-1">(Đã bao gồm VAT nếu có)</p>
            </div>
            
            <button 
              onClick={() => router.push('/checkout')}
              className="w-full bg-foreground text-white py-4 rounded-full font-medium text-lg hover:bg-black transition-colors flex items-center justify-center gap-2"
            >
              Tiến hành thanh toán <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
