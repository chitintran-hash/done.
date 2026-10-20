'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, ArrowRight, Heart, PlusCircle, Trash2, Calendar, User, ShieldCheck } from 'lucide-react';
import AdminPostModal from '@/components/AdminPostModal';
import { deletePost } from '@/app/actions/posts';

interface AboutClientProps {
  initialPosts: any[];
  isAdmin: boolean;
}

export default function AboutClient({ initialPosts, isAdmin }: AboutClientProps) {
  const [posts, setPosts] = useState(initialPosts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa bài ghi chép này?')) return;
    setDeletingId(id);
    try {
      await deletePost(id, 'about');
      setPosts((prev) => prev.filter((p) => p.id !== id));
      alert('Đã xóa bài ghi chép thành công!');
    } catch (e: any) {
      alert('Lỗi khi xóa: ' + e.message);
    }
    setDeletingId(null);
  };

  return (
    <div className="min-h-screen pt-[100px] md:pt-[120px] pb-24 bg-[#F7F6F2]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* Main Brand Profile Article */}
        <div className="bg-white rounded-[2.5rem] sm:rounded-[3rem] p-6 sm:p-12 md:p-16 shadow-xs border border-[#DDD8D2] mb-14">
          
          {/* Header & Slogan */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FFF3A6] border border-[#DDD8D2] text-[11px] font-bold text-[#4A2A25] uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              Câu Chuyện Thương Hiệu
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#3A211E] tracking-tight mb-4">
              Giới Thiệu Về Cupfy
            </h1>
            <p className="text-base sm:text-lg text-[#6F625E] font-medium max-w-2xl mx-auto italic font-serif">
              "Your cup. Your vibe. Your story."
            </p>
          </div>

          {/* Official Cupfy Cover Banner */}
          <div className="relative w-full aspect-[1024/378] rounded-3xl overflow-hidden mb-12 shadow-sm border border-[#DDD8D2] bg-[#FDF4B8]">
            <Image 
              src="/images/cupfy-cover-banner.jpg" 
              alt="Ảnh bìa nhận diện thương hiệu chính thức Cupfy" 
              fill 
              priority
              className="object-cover" 
            />
          </div>

          {/* Official Brand Narrative */}
          <div className="space-y-8 text-sm sm:text-base text-[#3A211E] leading-relaxed">
            
            <div className="p-6 bg-[#FAF9F6] rounded-3xl border border-[#DDD8D2] space-y-4">
              <p className="font-medium text-base sm:text-lg text-[#201817]">
                <strong>Cupfy</strong> là thương hiệu kinh doanh ly uống nước và ly cá nhân hóa trực tuyến tại Việt Nam.
              </p>
              <p className="text-[#4A3E3D]">
                Thông qua website <strong>Cupfy.space</strong>, khách hàng có thể lựa chọn mẫu ly, thêm chữ, hình ảnh, logo và các họa tiết trang trí để tạo ra sản phẩm mang dấu ấn cá nhân.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-[#3A211E]">
                Sản phẩm & Ứng dụng thực tế
              </h2>
              <p className="text-[#4A3E3D]">
                Cupfy cung cấp các sản phẩm ly thủy tinh, ly nhựa và ly thiết kế theo yêu cầu.
              </p>
              <p className="text-[#4A3E3D]">
                Sản phẩm phù hợp để sử dụng hằng ngày, làm quà tặng hoặc phục vụ nhu cầu xây dựng hình ảnh thương hiệu của các cửa hàng kinh doanh đồ uống, quán cà phê, trà sữa và doanh nghiệp nhỏ.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-[#3A211E]">
                Trải nghiệm thiết kế 3D trực quan
              </h2>
              <p className="text-[#4A3E3D]">
                Cupfy hướng đến trải nghiệm mua sắm trực quan, giúp khách hàng chủ động thiết kế, xem trước ở chế độ 3D 360° chân thật và đặt hàng trên cùng một nền tảng trực tuyến thuận tiện và nhanh chóng.
              </p>
            </div>

            {/* Quality & Craftsmanship Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <div className="bg-[#FAF9F6] p-6 sm:p-8 rounded-3xl border border-[#DDD8D2]">
                <h3 className="font-bold text-lg mb-2 text-[#3A211E]">Chất lượng vật liệu an toàn</h3>
                <p className="text-xs sm:text-sm text-[#6F625E] leading-relaxed">
                  Tập trung vào phôi ly thủy tinh pha lê Borosilicate chịu nhiệt và ly nhựa PP 2 lớp an toàn cho sức khỏe, kết hợp công nghệ in UV hiện đại cho đường nét sắc sảo, bền màu theo thời gian.
                </p>
              </div>

              <div className="bg-[#FFF3A6]/40 p-6 sm:p-8 rounded-3xl border border-[#DDD8D2]">
                <h3 className="font-bold text-lg mb-2 text-[#3A211E]">Tự do thể hiện cá tính</h3>
                <p className="text-xs sm:text-sm text-[#6F625E] leading-relaxed">
                  Công cụ thiết kế ly 3D thân thiện giúp biến ý tưởng sáng tạo thành hiện thực. Dù là một câu quote tâm đắc hay logo quán cà phê, Cupfy đều đồng hành để tạo nên chiếc ly của riêng bạn.
                </p>
              </div>
            </div>

            {/* Internal Links (Phần 10) */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8 border-t border-[#DDD8D2]">
              <Link
                href="/products"
                className="w-full sm:w-auto px-8 py-3.5 bg-white text-[#3A211E] border border-[#DDD8D2] rounded-full font-bold text-sm hover:bg-[#EDECEA] transition-colors text-center shadow-xs"
              >
                Khám phá cửa hàng Cupfy →
              </Link>
              <Link
                href="/custom-cup"
                className="w-full sm:w-auto px-8 py-3.5 bg-[#4A2A25] text-white rounded-full font-bold text-sm hover:bg-[#3A211E] transition-colors text-center shadow-sm flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-[#FFF3A6]" />
                Tự thiết kế ly ngay ✨
              </Link>
            </div>

          </div>
        </div>

        {/* ADMIN JOURNAL & PHOTO SECTION (Phần yêu cầu của User) */}
        <div className="bg-white rounded-[2.5rem] sm:rounded-[3rem] p-6 sm:p-10 md:p-12 shadow-xs border border-[#DDD8D2]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-[#DDD8D2] pb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#BFDCEF]/40 border border-[#BFDCEF] text-[10px] font-bold text-[#3A211E] uppercase tracking-wider mb-2">
                Nhật Ký & Hoạt Động
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#3A211E] tracking-tight">
                Khoảnh Khắc Xưởng Ly Cupfy
              </h2>
              <p className="text-xs sm:text-sm text-[#6F625E] mt-1">
                Những hình ảnh hậu trường sản xuất, ghi chép và câu chuyện sáng tạo từ đội ngũ Cupfy.
              </p>
            </div>

            {/* Admin Add Post Button */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-5 py-2.5 bg-[#FFF3A6] hover:bg-[#FFE978] text-[#201817] rounded-full font-bold text-xs sm:text-sm border border-[#DDD8D2] flex items-center gap-2 shadow-xs transition-colors shrink-0"
            >
              <PlusCircle className="w-4 h-4 text-amber-800" />
              Đăng ảnh & ghi chép mới
            </button>
          </div>

          {/* Posts Feed */}
          {posts.length === 0 ? (
            <div className="text-center py-16 bg-[#FAF9F6] rounded-3xl border border-dashed border-[#DDD8D2]">
              <Sparkles className="w-10 h-10 text-amber-700/40 mx-auto mb-3" />
              <h3 className="font-bold text-sm sm:text-base text-[#3A211E] mb-1">Chưa có bài ghi chép nào</h3>
              <p className="text-xs text-[#6F625E] max-w-md mx-auto">
                Admin có thể bấm nút "Đăng ảnh & ghi chép mới" phía trên để chia sẻ câu chuyện và hình ảnh của xưởng ly.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {posts.map((post) => (
                <div 
                  key={post.id} 
                  className="bg-[#FAF9F6] rounded-3xl border border-[#DDD8D2] overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow"
                >
                  {post.imageUrl && (
                    <div className="relative w-full aspect-video bg-slate-100 overflow-hidden">
                      <img 
                        src={post.imageUrl} 
                        alt={post.title} 
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center gap-2 text-[11px] text-[#6F625E] mb-1.5">
                        <span className="flex items-center gap-1 font-medium">
                          <User className="w-3 h-3 text-[#4A2A25]" />
                          {post.author}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                      <h3 className="font-bold text-base text-[#201817] leading-snug">
                        {post.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#4A3E3D] mt-2 leading-relaxed whitespace-pre-line">
                        {post.content}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#DDD8D2]/60 flex items-center justify-between">
                      <span className="text-[10px] text-[#6F625E] italic">Khoảnh khắc Cupfy</span>
                      <button
                        onClick={() => handleDelete(post.id)}
                        disabled={deletingId === post.id}
                        className="text-xs font-bold text-rose-700 hover:text-rose-900 flex items-center gap-1 py-1 px-2 rounded-lg hover:bg-rose-50 transition-colors"
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

      </div>

      {/* Admin Post Modal */}
      <AdminPostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        category="about"
        onPostCreated={() => window.location.reload()}
      />
    </div>
  );
}
