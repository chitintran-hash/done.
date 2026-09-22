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
    <div className="min-h-screen pt-[120px] pb-24 bg-[#FFF9E8]">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#3B2725] mb-6">Cộng đồng Cupfy</h1>
          <p className="text-[#6B4B4B] text-lg">
            Khám phá những thiết kế độc đáo nhất từ cộng đồng. Lấy cảm hứng hoặc tự tạo ra tác phẩm mang đậm dấu ấn cá nhân của bạn!
          </p>
          <div className="mt-8">
            <Link href="/custom-cup" className="bg-[#3B2725] text-white px-8 py-3 rounded-full font-bold hover:bg-[#201514] transition-colors inline-block">
              Thiết kế ly ngay ✨
            </Link>
          </div>
        </div>

        {customCups && customCups.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {customCups.map((cup, idx) => (
              <div key={idx} className="group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                <div className="relative aspect-square w-full">
                  <Image 
                    src={cup.image_url || 'https://images.unsplash.com/photo-1544885896-01584c6c0b39?w=600&q=80'} 
                    alt={cup.name} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    <button className="bg-white/90 p-3 rounded-full hover:bg-white text-red-500 transition-colors">
                      <Heart className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="p-4 border-t border-border">
                  <h3 className="font-bold text-[#3B2725] line-clamp-1">{cup.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">Bởi một người dùng Cupfy</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white/50 rounded-3xl border border-dashed border-[#D9788F]">
            <div className="text-4xl mb-4">🎨</div>
            <h3 className="text-xl font-bold text-[#3B2725] mb-2">Chưa có thiết kế nào</h3>
            <p className="text-[#6B4B4B]">Hãy là người đầu tiên chia sẻ thiết kế của mình lên cộng đồng!</p>
          </div>
        )}
      </div>
    </div>
  );
}
