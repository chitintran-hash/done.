"use client";

import { useEffect, useState } from 'react';
import { useGoalStore } from '@/store/useGoalStore';
import { buildSolutions, Solution } from '@/lib/engine/compatibility';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle2, ChevronRight, Monitor, Package, ShieldCheck } from 'lucide-react';
import Image from 'next/image';

export default function SolutionsPage() {
  const store = useGoalStore();
  const router = useRouter();
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!store.goal && !store.budget) {
      router.push('/');
      return;
    }

    // Simulate processing time for UX
    const timer = setTimeout(() => {
      const generated = buildSolutions({
        budget: store.budget,
        maxWidth: store.maxWidth,
        style: store.style,
        ownedItems: store.ownedItems,
        deadlineDays: store.deadlineDays
      });
      setSolutions(generated);
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-6">
        <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
        <h2 className="text-2xl font-bold animate-pulse">Đang xây dựng giải pháp...</h2>
        <div className="space-y-2 text-muted-foreground text-center">
          <p className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-accent" /> Kiểm tra kích thước ({store.maxWidth}cm)</p>
          <p className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-accent" /> Lọc theo ngân sách ({store.budget / 1000000}Tr)</p>
          <p className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-accent" /> Loại bỏ thiết bị đã có</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6 lg:p-12">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Giải pháp dành riêng cho bạn</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            DONE. đã chọn lọc và tính toán độ tương thích phần cứng để đưa ra 3 phương án tối ưu nhất.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {solutions.map((sol, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              key={sol.id}
              className={`bg-white rounded-3xl p-6 border-2 transition-all hover:shadow-xl flex flex-col ${
                sol.type === 'best-fit' ? 'border-accent shadow-lg relative' : 'border-border'
              }`}
            >
              {sol.type === 'best-fit' && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent text-white px-4 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" /> Khuyên dùng
                </div>
              )}
              
              <h3 className="text-2xl font-bold mb-2">{sol.name}</h3>
              <div className="text-3xl font-black text-foreground mb-6">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(sol.totalPrice)}
              </div>

              <div className="space-y-4 flex-1">
                {sol.products.map(p => (
                  <div key={p.id} className="flex gap-4 items-center p-3 bg-muted/50 rounded-xl">
                    <img src={p.image} alt={p.name} className="w-16 h-16 object-cover rounded-lg" />
                    <div className="flex-1">
                      <h4 className="font-medium text-sm line-clamp-2">{p.name}</h4>
                      <p className="text-xs text-muted-foreground mt-1 capitalize">{p.category.replace('_', ' ')}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => router.push(`/solutions/${sol.id}`)}
                className={`mt-8 w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                  sol.type === 'best-fit' 
                    ? 'bg-accent text-white hover:bg-accent/90' 
                    : 'bg-foreground text-white hover:bg-foreground/90'
                }`}
              >
                Xem chi tiết
                <ChevronRight className="w-5 h-5" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
