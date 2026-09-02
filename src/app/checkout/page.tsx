"use client";

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleCheckout = () => {
    setLoading(true);
    setTimeout(() => {
      router.push('/order-confirmation');
    }, 2000);
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 bg-muted/20">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-border text-center space-y-6">
        <div className="mx-auto w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8 text-accent" />
        </div>
        <h1 className="text-2xl font-bold">Mô phỏng Thanh Toán</h1>
        <p className="text-muted-foreground text-sm">
          Đây là màn hình thanh toán giả lập cho MVP. Trong thực tế, hệ thống sẽ kết nối với cổng thanh toán (Stripe, VNPay) để thanh toán cho Master Order.
        </p>
        
        <button 
          onClick={handleCheckout}
          disabled={loading}
          className="w-full py-4 bg-foreground text-background rounded-xl font-bold text-lg hover:bg-foreground/90 transition-all disabled:opacity-50"
        >
          {loading ? 'Đang xử lý thanh toán...' : 'Xác nhận Thanh Toán ngay'}
        </button>
      </div>
    </div>
  );
}
