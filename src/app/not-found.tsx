import Link from 'next/link';
import { Sparkles, ArrowLeft, PaintBucket } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen pt-32 pb-20 bg-[#F7F6F2] flex flex-col items-center justify-center px-6">
      <div className="w-24 h-24 bg-white rounded-3xl shadow-sm flex items-center justify-center mb-8 rotate-12 relative">
        <PaintBucket className="w-12 h-12 text-[#6B463D]" />
        <Sparkles className="w-6 h-6 text-[#201817] absolute -top-2 -right-2" />
      </div>
      
      <h1 className="text-4xl md:text-5xl font-extrabold text-[#201817] mb-4 text-center">
        Đang được xây dựng <span className="text-[#6B463D]">✨</span>
      </h1>
      
      <p className="text-lg text-[#6F625E] text-center max-w-md mb-10">
        Tính năng hoặc trang bạn vừa truy cập hiện đang được đội ngũ CUPFY phát triển và sẽ sớm ra mắt trong thời gian tới. 
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Link href="/" className="px-8 py-4 bg-white text-[#201817] rounded-full font-bold flex items-center justify-center gap-2 border border-[#DDD8D2] hover:bg-[#EDECEA] transition-colors w-full sm:w-auto">
          <ArrowLeft className="w-5 h-5" /> Về trang chủ
        </Link>
        <Link href="/custom-cup" className="px-8 py-4 bg-[#4A2A25] text-white rounded-full font-bold flex items-center justify-center gap-2 hover:bg-[#6F625E] transition-colors shadow-md w-full sm:w-auto">
          Tự thiết kế ly ngay <Sparkles className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
}
