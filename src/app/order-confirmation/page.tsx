"use client";

import { useRouter } from 'next/navigation';
import { useGoalStore } from '@/store/useGoalStore';
import { useEffect } from 'react';
import { PartyPopper, ArrowRight, Layout } from 'lucide-react';

export default function OrderConfirmationPage() {
  const router = useRouter();
  const store = useGoalStore();

  useEffect(() => {
    // Optional: clear store or trigger confetti
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-2xl w-full text-center space-y-8">
        <div className="mx-auto w-24 h-24 bg-accent/10 rounded-full flex items-center justify-center animate-bounce">
          <PartyPopper className="w-12 h-12 text-accent" />
        </div>
        
        <h1 className="text-5xl font-black tracking-tight">Thành Công!</h1>
        
        <div className="space-y-2 text-lg text-muted-foreground">
          <p>Đơn hàng của bạn đã được ghi nhận.</p>
          <p>Hệ thống đã tự động chia nhỏ thành các **Sub-orders** và gửi thông báo đến từng Nhà bán (Seller) để chuẩn bị hàng.</p>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row justify-center gap-4">
          <button 
            onClick={() => router.push('/my-setup')}
            className="px-8 py-4 bg-accent text-white rounded-full font-bold hover:bg-accent/90 transition-all flex items-center justify-center gap-2"
          >
            <Layout className="w-5 h-5" />
            Xem góc máy của tôi (My Setup)
          </button>
          
          <button 
            onClick={() => { store.reset(); router.push('/'); }}
            className="px-8 py-4 bg-muted text-foreground rounded-full font-medium hover:bg-border transition-all flex items-center justify-center gap-2"
          >
            Về trang chủ
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
