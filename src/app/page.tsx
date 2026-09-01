import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6">
      <div className="max-w-3xl w-full text-center space-y-8">
        
        <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent font-medium text-sm mb-4">
          <CheckCircle2 className="w-4 h-4" />
          <span>DONE. Study Setup</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
          What do you want to get <span className="text-accent">DONE?</span>
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Đừng mất thời gian tìm kiếm từng món đồ. Hãy nói cho chúng tôi mục tiêu, không gian và ngân sách của bạn. DONE. sẽ xây dựng góc học tập hoàn chỉnh cho bạn.
        </p>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            href="/build" 
            className="group flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-full font-medium text-lg hover:bg-primary/90 transition-all w-full sm:w-auto"
          >
            Bắt đầu tạo Solution
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link 
            href="/shop" 
            className="flex items-center justify-center px-8 py-4 bg-muted text-foreground rounded-full font-medium text-lg hover:bg-border transition-all w-full sm:w-auto"
          >
            Mua lẻ sản phẩm
          </Link>
        </div>

      </div>
    </div>
  );
}
