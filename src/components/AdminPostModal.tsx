'use client';

import React, { useState, useRef } from 'react';
import { X, Upload, Image as ImageIcon, Loader2, Sparkles, CheckCircle2 } from 'lucide-react';
import { createPost, uploadPostImage } from '@/app/actions/posts';

interface AdminPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: 'community' | 'about';
  onPostCreated?: () => void;
}

export default function AdminPostModal({
  isOpen,
  onClose,
  category,
  onPostCreated,
}: AdminPostModalProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [authorName, setAuthorName] = useState('Cupfy Admin');
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    const res = await uploadPostImage(formData);
    if (res.success && res.url) {
      setImageUrl(res.url);
    } else {
      alert('Lỗi tải ảnh lên: ' + (res.error || 'Vui lòng thử lại'));
    }
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Vui lòng nhập tiêu đề bài viết!');
      return;
    }
    if (!content.trim()) {
      alert('Vui lòng nhập nội dung ghi chép!');
      return;
    }

    setSubmitting(true);
    try {
      await createPost({
        title: title.trim(),
        content: content.trim(),
        imageUrl: imageUrl.trim() || undefined,
        category,
        authorName: authorName.trim() || 'Cupfy Admin',
      });
      alert('Đăng bài viết và ảnh thành công!');
      setTitle('');
      setContent('');
      setImageUrl('');
      onClose();
      if (onPostCreated) onPostCreated();
    } catch (err: any) {
      alert('Lỗi khi đăng bài: ' + err.message);
    }
    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div 
        className="bg-white rounded-[28px] border border-[#DDD8D2] shadow-2xl max-w-xl w-full p-6 md:p-8 space-y-5 animate-in zoom-in-95 max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#DDD8D2] pb-4">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#FFF3A6] text-[#4A2A25]">
              <Sparkles className="w-5 h-5 text-amber-700" />
            </span>
            <div>
              <h3 className="font-bold text-lg text-[#3A211E]">
                {category === 'community' ? 'Đăng Bài Lên Cộng Đồng' : 'Thêm Nhật Ký / Ảnh Giới Thiệu'}
              </h3>
              <p className="text-xs text-[#6F625E]">Dành riêng cho Quản trị viên Cupfy</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#EDECEA] text-[#6F625E] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs md:text-sm">
          {/* Title */}
          <div>
            <label className="block font-bold text-[#3A211E] mb-1">Tiêu đề bài viết / Khoảnh khắc *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="VD: Chiếc ly thủy tinh kỷ niệm 1 năm của khách hàng..."
              className="w-full px-4 py-2.5 rounded-xl border border-[#DDD8D2] focus:outline-none focus:border-[#4A2A25] bg-[#FAF9F6]"
            />
          </div>

          {/* Author */}
          <div>
            <label className="block font-bold text-[#3A211E] mb-1">Tác giả / Người đăng</label>
            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="VD: Cupfy Admin"
              className="w-full px-4 py-2.5 rounded-xl border border-[#DDD8D2] focus:outline-none focus:border-[#4A2A25] bg-[#FAF9F6]"
            />
          </div>

          {/* Image Upload or URL */}
          <div>
            <label className="block font-bold text-[#3A211E] mb-1.5">Hình ảnh đăng tải</label>
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  disabled={uploading}
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2.5 bg-[#EDECEA] hover:bg-[#DDD8D2] text-[#3A211E] rounded-xl font-bold flex items-center gap-1.5 transition-colors text-xs"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-amber-700" />
                      Đang tải ảnh lên...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 text-[#4A2A25]" />
                      Chọn ảnh từ thiết bị
                    </>
                  )}
                </button>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Hoặc dán URL ảnh trực tiếp..."
                  className="flex-1 px-3 py-2 rounded-xl border border-[#DDD8D2] focus:outline-none focus:border-[#4A2A25] bg-[#FAF9F6] text-xs"
                />
              </div>

              {/* Image Preview */}
              {imageUrl && (
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-[#DDD8D2] bg-slate-100 flex items-center justify-center">
                  <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setImageUrl('')}
                    className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-full hover:bg-black/80 transition-colors"
                    title="Xóa ảnh này"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Content / Notes */}
          <div>
            <label className="block font-bold text-[#3A211E] mb-1">Nội dung ghi chép tự do *</label>
            <textarea
              required
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Chia sẻ câu chuyện, ý nghĩa thiết kế hoặc những dòng cảm xúc về chiếc ly..."
              className="w-full px-4 py-3 rounded-xl border border-[#DDD8D2] focus:outline-none focus:border-[#4A2A25] bg-[#FAF9F6] resize-y"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#DDD8D2]">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-[#EDECEA] text-[#3A211E] rounded-full font-bold hover:bg-[#DDD8D2] transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 bg-[#4A2A25] text-white rounded-full font-bold hover:bg-[#3A211E] transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Đang đăng...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Đăng Ngay
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
