"use client";

import { useGoalStore } from '@/store/useGoalStore';
import { buildSolutions, Solution } from '@/lib/engine/compatibility';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CheckCircle, ArrowLeft, ShoppingBag, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function SolutionDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const store = useGoalStore();
  const router = useRouter();
  
  const [solution, setSolution] = useState<Solution | null>(null);

  useEffect(() => {
    if (!store.goal && !store.budget) {
      router.push('/');
      return;
    }
    const generated = buildSolutions({
      budget: store.budget,
      maxWidth: store.maxWidth,
      style: store.style,
      ownedItems: store.ownedItems
    });
    
    const found = generated.find(s => s.id === id);
    if (found) {
      setSolution(found);
    } else {
      router.push('/solutions');
    }
  }, [id]);

  if (!solution) return <div className="p-12 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-background p-6 lg:p-12">
      <div className="max-w-4xl mx-auto">
        <Link href="/solutions" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="w-5 h-5" /> Quay lại
        </Link>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">{solution.name}</h1>
            <p className="text-muted-foreground">Được tối ưu cho ngân sách và không gian {store.maxWidth}cm của bạn.</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground mb-1">Tổng cộng</div>
            <div className="text-4xl font-black text-accent">
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(solution.totalPrice)}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {solution.products.map(product => (
            <div key={product.id} className="bg-white rounded-2xl p-6 border border-border flex flex-col md:flex-row gap-6 items-start">
              <img src={product.image} alt={product.name} className="w-full md:w-48 h-48 object-cover rounded-xl" />
              
              <div className="flex-1 space-y-4">
                <div>
                  <h3 className="text-xl font-bold">{product.name}</h3>
                  <div className="text-lg font-semibold text-foreground/80 mt-1">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                  </div>
                </div>
                
                <p className="text-muted-foreground text-sm leading-relaxed">{product.description}</p>
                
                <div className="bg-accent/10 text-accent p-4 rounded-xl flex gap-3 items-start">
                  <CheckCircle className="w-5 h-5 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-semibold block mb-1">Vì sao phù hợp?</span>
                    <p className="text-sm">{solution.explanation[product.id]}</p>
                  </div>
                </div>
              </div>

              <button className="flex items-center justify-center gap-2 px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors w-full md:w-auto shrink-0">
                <RefreshCw className="w-4 h-4" /> Smart Swap
              </button>
            </div>
          ))}
        </div>

        <div className="mt-12 flex justify-end border-t border-border pt-8">
          <button className="px-8 py-4 bg-foreground text-background rounded-full font-bold text-lg flex items-center gap-3 hover:bg-foreground/90 transition-all">
            <ShoppingBag className="w-5 h-5" />
            Thêm bộ giải pháp vào giỏ hàng
          </button>
        </div>
      </div>
    </div>
  );
}
