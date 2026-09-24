import { createClient } from '@/lib/supabase/server';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, MessageCircle } from 'lucide-react';

export default async function CommunityPage() {
  const supabase = await createClient();
  
  // Fetch user-customized cups
  const { data: customCups } = await supabase
    .from('products')
    .select('*')
    .eq('category', 'custom')
    .order('created_at', { ascending: false })
    .limit(20);

  return (
    <div className="min-h-screen pt-[120px] pb-24 bg-[#F7F6F2]">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#3B2725] mb-6">Cộng đồng Cupfy</h1>
          <p className="text-[#6F625E] text-lg">
            Khám phá những thiết kế độc đáo nhất từ cộng đồng. Lấy cảm hứng hoặc tự tạo ra tác phẩm mang đậm dấu ấn cá nhân của bạn!
          </p>
          <div className="mt-8">
            <Link href="/" className="bg-white border-2 border-[#3B2725] text-[#3B2725] px-8 py-3 rounded-full font-bold hover:bg-muted transition-colors inline-block mr-4">
              Về trang chủ
            </Link>
            <Link href="/custom-cup" className="bg-[#3B2725] text-white px-8 py-3 rounded-full font-bold hover:bg-[#201514] transition-colors inline-block">
              Thiết kế ly ngay ✨
            </Link>
          </div>
        </div>

        {false ? ( <div /> ) : (
          <div className="text-center py-20 bg-white/50 rounded-3xl border border-dashed border-[#D9788F]">
            <div className="text-4xl mb-4">🎨</div>
            <h3 className="text-xl font-bold text-[#3B2725] mb-2">Chưa có thiết kế nào</h3>
            <p className="text-[#6F625E]">Admin đang chuẩn bị những tác phẩm tuyệt vời để trưng bày tại đây. Bạn hãy quay lại sau nhé!</p>
          </div>
        )}
      </div>
    </div>
  );
}
