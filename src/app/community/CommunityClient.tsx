'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, MessageCircle, Sparkles, PlusCircle, Trash2, Calendar, User, Share2 } from 'lucide-react';
import AdminPostModal from '@/components/AdminPostModal';
import { deletePost } from '@/app/actions/posts';

interface CommunityClientProps {
  initialPosts: any[];
  isAdmin: boolean;
}

export default function CommunityClient({ initialPosts, isAdmin }: CommunityClientProps) {
  const [posts, setPosts] = useState(initialPosts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa bài viết này khỏi cộng đồng?')) return;
    setDeletingId(id);
    try {
      await deletePost(id, 'community');
      setPosts((prev) => prev.filter((p) => p.id !== id));
      alert('Đã xóa bài viết thành công!');
    } catch (e: any) {
      alert('Lỗi khi xóa bài viết: ' + e.message);
    }
    setDeletingId(null);
  };

  const toggleLike = (id: string) => {
    setLikedPosts((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-screen pt-[100px] md:pt-[120px] pb-24 bg-[#F7F6F2]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Community Header Banner */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FFF3A6] border border-[#DDD8D2] text-[11px] font-bold text-[#4A2A25] uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Không Gian Sáng Tạo
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#3A211E] tracking-tight mb-4">
            Cộng Đồng Cupfy
          </h1>
          <p className="text-sm sm:text-base text-[#6F625E] leading-relaxed">
            Khám phá những thiết kế độc đáo nhất từ cộng đồng. Lấy cảm hứng hoặc tự tạo ra tác phẩm mang đậm dấu ấn cá nhân của bạn!
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link 
              href="/" 
              className="px-6 py-2.5 bg-white border border-[#DDD8D2] text-[#3A211E] rounded-full font-bold text-xs sm:text-sm hover:bg-[#EDECEA] transition-colors"
            >
              Về trang chủ
            </Link>
            <Link 
              href="/custom-cup" 
              className="px-6 py-2.5 bg-[#4A2A25] text-white rounded-full font-bold text-xs sm:text-sm hover:bg-[#3A211E] transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-[#FFF3A6]" />
              Thiết kế ly ngay ✨
            </Link>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-2.5 bg-[#FFF3A6] hover:bg-[#FFE978] text-[#201817] rounded-full font-bold text-xs sm:text-sm border border-[#DDD8D2] flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <PlusCircle className="w-4 h-4 text-amber-800" />
              Đăng ảnh & bài viết mới
            </button>
          </div>
        </div>

        {/* Community Feed Grid */}
        {posts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[2.5rem] border border-dashed border-[#DDD8D2] p-8 max-w-2xl mx-auto shadow-xs">
            <div className="text-5xl mb-4">🎨</div>
            <h3 className="text-xl font-bold text-[#3A211E] mb-2">Chưa có bài viết nào trong cộng đồng</h3>
            <p className="text-sm text-[#6F625E] mb-6">
              Bạn có thể bấm nút "Đăng ảnh & bài viết mới" phía trên để chia sẻ mẫu ly và câu chuyện sáng tạo đầu tiên!
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3 bg-[#4A2A25] text-white rounded-full font-bold text-xs sm:text-sm hover:bg-[#3A211E] transition-colors inline-flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4 text-[#FFF3A6]" />
              Đăng bài viết đầu tiên ngay
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {posts.map((post) => (
              <div 
                key={post.id} 
                className="bg-white rounded-[2rem] border border-[#DDD8D2] overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow group"
              >
                {post.imageUrl && (
                  <div className="relative w-full aspect-square bg-[#FAF9F6] overflow-hidden border-b border-[#DDD8D2]/60">
                    <img 
                      src={post.imageUrl} 
                      alt={post.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}

                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-[#6F625E] mb-2">
                      <span className="flex items-center gap-1.5 font-bold text-[#3A211E]">
                        <User className="w-3.5 h-3.5 text-[#4A2A25]" />
                        {post.author}
                      </span>
                      <span className="flex items-center gap-1 font-mono">
                        <Calendar className="w-3 h-3" />
                        {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                      </span>
                    </div>

                    <h3 className="font-bold text-base sm:text-lg text-[#201817] leading-snug">
                      {post.title}
                    </h3>
                    
                    <p className="text-xs sm:text-sm text-[#4A3E3D] mt-2 leading-relaxed whitespace-pre-line line-clamp-4">
                      {post.content}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#DDD8D2]/60 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleLike(post.id)}
                        className={`flex items-center gap-1 text-xs font-bold transition-colors ${
                          likedPosts[post.id] ? 'text-rose-600' : 'text-[#6F625E] hover:text-rose-600'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${likedPosts[post.id] ? 'fill-current' : ''}`} />
                        <span>{likedPosts[post.id] ? 1 : 0}</span>
                      </button>
                      <Link
                        href="/custom-cup"
                        className="text-xs font-bold text-[#4A2A25] hover:underline flex items-center gap-1"
                      >
                        <Sparkles className="w-3 h-3 text-amber-600" />
                        Tự làm mẫu này
                      </Link>
                    </div>

                    <button
                      onClick={() => handleDelete(post.id)}
                      disabled={deletingId === post.id}
                      className="text-xs font-bold text-rose-700 hover:text-rose-900 flex items-center gap-1 p-1 rounded-lg hover:bg-rose-50 transition-colors"
                      title="Xóa bài viết này"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Xóa
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Admin Post Modal */}
      <AdminPostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        category="community"
        onPostCreated={() => window.location.reload()}
      />
    </div>
  );
}
