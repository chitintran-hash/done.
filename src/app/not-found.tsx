import Link from 'next/link';
import { Sparkles, ArrowLeft, PaintBucket } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen pt-32 pb-20 bg-[#FFF9E8] flex flex-col items-center justify-center px-6">
      <div className="w-24 h-24 bg-white rounded-3xl shadow-sm flex items-center justify-center mb-8 rotate-12 relative">
        <PaintBucket className="w-12 h-12 text-[#FFB15C]" />
        <Sparkles className="w-6 h-6 text-[#181818] absolute -top-2 -right-2" />
      </div>
      
      <h1 className="text-4xl md:text-5xl font-extrabold text-[#181818] mb-4 text-center">
        Đang được xây dựng <span className="text-[#FFB15C]">✨</span>
      </h1>
      
      <p className="text-lg text-[#888888] text-center max-w-md mb-10">
        Tính năng hoặc trang bạn vừa truy cập hiện đang được đội ngũ CUPFY phát triển và sẽ sớm ra mắt trong thời gian tới. 
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Link href="/" className="px-8 py-4 bg-white text-[#181818] rounded-full font-bold flex items-center justify-center gap-2 border border-[#EAE7DE] hover:bg-[#F7F7F5] transition-colors w-full sm:w-auto">
          <ArrowLeft className="w-5 h-5" /> Về trang chủ
        </Link>
        <Link href="/custom-cup" className="px-8 py-4 bg-[#181818] text-white rounded-full font-bold flex items-center justify-center gap-2 hover:bg-[#333333] transition-colors shadow-md w-full sm:w-auto">
          Tự thiết kế ly ngay <Sparkles className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
}
