import Link from 'next/link';
import { Sparkles, ArrowLeft, PaintBucket } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen pt-32 pb-20 bg-[#FFF9E8] flex flex-col items-center justify-center px-6">
      <div className="w-24 h-24 bg-white rounded-3xl shadow-sm flex items-center justify-center mb-8 rotate-12 relative border border-[#E8DFD8]">
        <PaintBucket className="w-12 h-12 text-[#3A211E]" />
        <span className="w-3 h-3 rounded-full bg-[#FFBF00] absolute -top-1 -right-1" />
      </div>
      
      <h1 className="text-4xl md:text-5xl font-extrabold text-[#3A211E] mb-4 text-center">
        Đang được xây dựng
      </h1>
      
      <p className="text-lg text-[#765B52] text-center max-w-md mb-10">
        Tính năng hoặc trang bạn vừa truy cập hiện đang được đội ngũ CUPFY phát triển và sẽ sớm ra mắt trong thời gian tới. 
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Link href="/" className="px-8 py-4 bg-white text-[#3A211E] rounded-full font-bold flex items-center justify-center gap-2 border border-[#E8DFD8] hover:bg-[#FFF9E8] transition-colors w-full sm:w-auto">
          <ArrowLeft className="w-5 h-5" /> Về trang chủ
        </Link>
        <Link href="/custom-cup" className="px-8 py-4 bg-[#FFBF00] text-[#3A211E] rounded-full font-bold flex items-center justify-center gap-2 hover:bg-[#E5AC00] transition-colors shadow-sm w-full sm:w-auto">
          Tự thiết kế ly ngay
        </Link>
      </div>
    </div>
  );
}
