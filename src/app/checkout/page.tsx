"use client";

import { useCartStore } from '@/store/useCartStore';
import { useRouter } from 'next/navigation';
import { processCheckout } from '@/app/actions/checkout';

import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function CheckoutPage() {
  const router = useRouter();
  const cart = useCartStore();
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    district: '',
    ward: '',
    note: ''
  });

  const subtotal = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingFee = 30000;
  const total = subtotal + shippingFee;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id || null;

      const orderData = {
        buyer_id: userId,
        name: formData.name,
        email: formData.email,
        address: formData.address,
        ward: formData.ward,
        district: formData.district,
        city: formData.city,
        total: total,
      };

      const result = await processCheckout(orderData, cart.items);

      if (!result.success) {
        throw new Error(result.error);
      }

      cart.clearCart();
      router.push('/order-confirmation');
      
    } catch (error: any) {
      console.error(error);
      alert("Có lỗi xảy ra khi đặt hàng: " + error.message);
      setLoading(false);
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Giỏ hàng trống</h2>
        <button onClick={() => router.push('/products')} className="px-6 py-3 bg-primary text-white rounded-full">Quay lại mua sắm</button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <Link href="/cart" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Quay lại giỏ hàng
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Form */}
        <div>
          <h2 className="text-3xl font-serif font-bold text-foreground mb-8">Thông tin giao hàng</h2>
          <form id="checkout-form" onSubmit={handleCheckout} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Họ tên *</label>
                <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-3 rounded-xl border border-border focus:border-primary focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Số điện thoại *</label>
                <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full p-3 rounded-xl border border-border focus:border-primary focus:outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-3 rounded-xl border border-border focus:border-primary focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">Địa chỉ *</label>
              <input required type="text" name="address" value={formData.address} onChange={handleChange} className="w-full p-3 rounded-xl border border-border focus:border-primary focus:outline-none" placeholder="Số nhà, tên đường..." />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Tỉnh/Thành *</label>
                <input required type="text" name="city" value={formData.city} onChange={handleChange} className="w-full p-3 rounded-xl border border-border focus:border-primary focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Quận/Huyện *</label>
                <input required type="text" name="district" value={formData.district} onChange={handleChange} className="w-full p-3 rounded-xl border border-border focus:border-primary focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Phường/Xã *</label>
                <input required type="text" name="ward" value={formData.ward} onChange={handleChange} className="w-full p-3 rounded-xl border border-border focus:border-primary focus:outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">Ghi chú đơn hàng (Tùy chọn)</label>
              <textarea name="note" rows={3} value={formData.note} onChange={handleChange} className="w-full p-3 rounded-xl border border-border focus:border-primary focus:outline-none resize-none"></textarea>
            </div>
            
            <div className="pt-4">
              <h3 className="font-bold mb-4">Phương thức thanh toán</h3>
              <div className="p-4 rounded-xl border-2 border-primary bg-primary/5 cursor-pointer flex items-center gap-3">
                <input type="radio" checked readOnly className="w-5 h-5 accent-primary" />
                <span className="font-medium">Thanh toán khi nhận hàng (COD)</span>
              </div>
            </div>
          </form>
        </div>

        {/* Summary */}
        <div>
          <div className="bg-muted/30 rounded-3xl p-8 border border-border sticky top-28">
            <h2 className="text-2xl font-serif font-bold text-foreground mb-6">Đơn hàng của bạn</h2>
            
            <div className="space-y-4 max-h-[40vh] overflow-y-auto mb-6 pr-2">
              {cart.items.map(item => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-16 h-16 rounded-lg bg-white overflow-hidden shrink-0 border border-border relative">
                    <img src={item.image || 'https://images.unsplash.com/photo-1544885896-01584c6c0b39?w=600&q=80'} alt={item.name} className="w-full h-full object-cover" />
                    <span className="absolute -top-2 -right-2 bg-foreground text-white w-5 h-5 flex items-center justify-center rounded-full text-xs">{item.quantity}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm line-clamp-1">{item.name}</h4>
                    {item.isCustom && <p className="text-xs text-primary mt-1">Ly thiết kế riêng</p>}
                    <p className="text-sm font-medium text-muted-foreground mt-1">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-6 space-y-4 mb-6">
              <div className="flex justify-between text-muted-foreground">
                <span>Tạm tính</span>
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
                <span className="font-bold text-foreground text-lg">Tổng cộng</span>
                <span className="text-3xl font-bold text-primary">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total)}
                </span>
              </div>
            </div>
            
            <button 
              type="submit"
              form="checkout-form"
              disabled={loading}
              className="w-full py-4 bg-foreground text-background rounded-full font-bold text-lg hover:bg-black transition-all disabled:opacity-50"
            >
              {loading ? 'Đang xử lý...' : 'Xác nhận Đặt Hàng'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
