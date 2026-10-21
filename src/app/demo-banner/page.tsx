'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Sparkles, Check, Palette, Eye, RefreshCw } from 'lucide-react';

export default function DemoBannerPage() {
  const [bannerMode, setBannerMode] = useState<'hybrid' | 'graphic'>('hybrid');
  const [headlineTop, setHeadlineTop] = useState('CUSTOMIZE');
  const [headlineBottom, setHeadlineBottom] = useState('YOUR CUP');
  const [subHeadline, setSubHeadline] = useState('Thiết kế chiếc ly mang đậm dấu ấn riêng của bạn');
  const [ctaText, setCtaText] = useState('Thiết kế ly ngay ✨');

  return (
    <div className="min-h-screen bg-[#F7F6F2] pt-24 md:pt-28 pb-20">
      {/* Thanh thông báo chế độ Demo dành cho Admin/Khách hàng */}
      <div className="max-w-[1400px] mx-auto px-6 mb-6">
        <div className="bg-[#3A211E] text-white rounded-2xl p-4 md:p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg border border-[#DDD8D2]/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FDB813] text-[#3A211E] flex items-center justify-center font-bold text-xl shrink-0 shadow-sm">
              ✨
            </div>
            <div>
              <h2 className="font-bold text-base md:text-lg flex items-center gap-2">
                Bản Demo Banner Hero phong cách HIPPEAS cho Cupfy
                <span className="text-xs bg-[#FDB813] text-[#3A211E] px-2.5 py-0.5 rounded-full font-semibold">
                  Preview Mode
                </span>
              </h2>
              <p className="text-xs md:text-sm text-[#DDD8D2]">
                Header và các tính năng của Cupfy vẫn giữ nguyên. Dưới đây là demo phần khung banner mới.
              </p>
            </div>
          </div>

          {/* Bộ điều khiển chuyển đổi nhanh */}
          <div className="flex items-center gap-2 bg-[#201817] p-1.5 rounded-xl border border-white/10 shrink-0">
            <button
              onClick={() => setBannerMode('hybrid')}
              className={`px-3.5 py-1.5 rounded-lg text-xs md:text-sm font-semibold transition-all ${
                bannerMode === 'hybrid'
                  ? 'bg-[#FDB813] text-[#201817] shadow-sm'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Chế độ Web Dynamic (HTML/CSS)
            </button>
            <button
              onClick={() => setBannerMode('graphic')}
              className={`px-3.5 py-1.5 rounded-lg text-xs md:text-sm font-semibold transition-all ${
                bannerMode === 'graphic'
                  ? 'bg-[#FDB813] text-[#201817] shadow-sm'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Chế độ Graphic Hoàn chỉnh
            </button>
          </div>
        </div>
      </div>

      {/* KHU VỰC HERO BANNER THEO PHONG CÁCH HIPPEAS */}
      <section className="max-w-[1400px] mx-auto px-6 mb-12">
        <div className="relative w-full rounded-[32px] md:rounded-[40px] overflow-hidden bg-[#FDB813] shadow-[0_20px_60px_rgba(253,184,19,0.25)] border border-[#FDB813]/40 min-h-[460px] md:min-h-[520px] lg:min-h-[560px] flex items-center">
          
          {bannerMode === 'graphic' ? (
            /* Lựa chọn 1: Banner Graphic hoàn chỉnh chất lượng cao */
            <div className="relative w-full aspect-[16/9] min-h-[460px] md:min-h-[520px] lg:min-h-[560px] flex items-center">
              <Image
                src="/images/cupfy-hippeas-banner.jpg"
                alt="Cupfy - Customize Your Cup Hero Banner"
                fill
                priority
                className="object-cover object-center"
              />
              {/* Vùng bấm CTA vô hình đè lên nút trên hình */}
              <Link
                href="/custom-cup"
                className="absolute left-[5%] bottom-[14%] sm:bottom-[16%] md:bottom-[20%] w-[180px] sm:w-[220px] h-[50px] sm:h-[60px] rounded-full z-10 hover:opacity-10 transition-opacity"
                aria-label="Thiết kế ngay"
              />
            </div>
          ) : (
            /* Lựa chọn 2: Dynamic Web (Nền hình ly xoay chéo + Chữ HTML/CSS sắc nét, responsive & chuẩn SEO) */
            <div className="relative w-full h-full min-h-[460px] md:min-h-[520px] lg:min-h-[560px] flex items-center overflow-hidden">
              
              {/* Nền hoạt hoạ ly thuỷ tinh Cupfy trải nghiêng 25 độ ở bên phải */}
              <div className="absolute inset-0 z-0">
                <Image
                  src="/images/cupfy-hippeas-bg.jpg"
                  alt="Bộ sưu tập ly thuỷ tinh Cupfy"
                  fill
                  priority
                  className="object-cover object-right md:object-center"
                />
                {/* Lớp phủ chuyển màu nhẹ trên màn hình điện thoại giúp chữ luôn nổi bật */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#FDB813] via-[#FDB813]/90 md:via-[#FDB813]/40 to-transparent z-[1]" />
              </div>

              {/* Nội dung bên trái: Chữ to ấn tượng + Nút bấm */}
              <div className="relative z-10 w-full lg:w-[50%] p-8 sm:p-12 md:p-16 flex flex-col items-start">
                
                {/* Tag nhỏ thương hiệu */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/30 backdrop-blur-md border border-white/40 text-[#3A211E] text-xs sm:text-sm font-bold uppercase tracking-wider mb-4 shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 text-[#3A211E]" />
                  <span>Cá nhân hóa mọi chiếc ly</span>
                </div>

                {/* Tiêu đề khổng lồ đặc trưng Hippeas */}
                <h1 className="font-black text-5xl sm:text-6xl md:text-7xl lg:text-[76px] leading-[0.98] tracking-tight uppercase mb-5 select-none">
                  <span className="block text-white drop-shadow-sm font-heading">
                    {headlineTop}
                  </span>
                  <span className="block text-[#3A211E] mt-1 font-heading">
                    {headlineBottom}
                  </span>
                </h1>

                {/* Mô tả phụ */}
                <p className="text-base sm:text-lg md:text-xl text-[#3A211E] font-medium leading-snug mb-8 max-w-[460px]">
                  {subHeadline}
                </p>

                {/* Nút bấm hình con nhộng (Pill button) màu nâu cà phê đậm */}
                <div className="flex flex-wrap items-center gap-4">
                  <Link
                    href="/custom-cup"
                    className="inline-flex items-center justify-center gap-2 px-8 sm:px-10 py-4 bg-[#3A211E] text-[#FDB813] hover:text-white rounded-full font-bold text-base sm:text-lg transition-all duration-200 hover:bg-[#201817] hover:scale-105 shadow-[0_8px_24px_rgba(58,33,30,0.25)] group"
                  >
                    <span>{ctaText}</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <Link
                    href="/products"
                    className="inline-flex items-center justify-center px-7 py-4 bg-white/90 hover:bg-white text-[#3A211E] rounded-full font-bold text-base transition-all duration-200 border border-white/60 shadow-sm hover:shadow"
                  >
                    Xem sản phẩm
                  </Link>
                </div>
              </div>

            </div>
          )}

        </div>
      </section>

      {/* KHU VỰC ĐIỀU CHỈNH THỬ NGHIỆM DÀNH CHO ADMIN */}
      <section className="max-w-[1400px] mx-auto px-6">
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#DDD8D2] shadow-sm">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#DDD8D2]">
            <Palette className="w-6 h-6 text-[#3A211E]" />
            <h3 className="text-xl font-bold text-[#201817]">
              Bảng tùy chỉnh thử nội dung banner (Thử nghiệm trực tiếp)
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-xs font-bold text-[#6F625E] uppercase mb-2">
                Dòng chữ 1 (Màu trắng)
              </label>
              <input
                type="text"
                value={headlineTop}
                onChange={(e) => setHeadlineTop(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#DDD8D2] text-sm font-semibold focus:outline-none focus:border-[#3A211E]"
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => setHeadlineTop('CUSTOMIZE')}
                  className="text-xs text-blue-600 hover:underline"
                >
                  CUSTOMIZE
                </button>
                <button
                  onClick={() => setHeadlineTop('THIẾT KẾ')}
                  className="text-xs text-blue-600 hover:underline"
                >
                  THIẾT KẾ
                </button>
                <button
                  onClick={() => setHeadlineTop('SÁNG TẠO')}
                  className="text-xs text-blue-600 hover:underline"
                >
                  SÁNG TẠO
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#6F625E] uppercase mb-2">
                Dòng chữ 2 (Màu nâu đậm)
              </label>
              <input
                type="text"
                value={headlineBottom}
                onChange={(e) => setHeadlineBottom(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#DDD8D2] text-sm font-semibold focus:outline-none focus:border-[#3A211E]"
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => setHeadlineBottom('YOUR CUP')}
                  className="text-xs text-blue-600 hover:underline"
                >
                  YOUR CUP
                </button>
                <button
                  onClick={() => setHeadlineBottom('CHẤT RIÊNG')}
                  className="text-xs text-blue-600 hover:underline"
                >
                  CHẤT RIÊNG
                </button>
                <button
                  onClick={() => setHeadlineBottom('LY CỦA BẠN')}
                  className="text-xs text-blue-600 hover:underline"
                >
                  LY CỦA BẠN
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#6F625E] uppercase mb-2">
                Câu mô tả phụ
              </label>
              <input
                type="text"
                value={subHeadline}
                onChange={(e) => setSubHeadline(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#DDD8D2] text-sm focus:outline-none focus:border-[#3A211E]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#6F625E] uppercase mb-2">
                Nút kêu gọi hành động (CTA)
              </label>
              <input
                type="text"
                value={ctaText}
                onChange={(e) => setCtaText(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#DDD8D2] text-sm focus:outline-none focus:border-[#3A211E]"
              />
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-[#DDD8D2] flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-[#6F625E]">
              💡 <strong>Lưu ý:</strong> Trang chủ hiện tại của Cupfy vẫn được giữ nguyên bản gốc. Nếu bạn ưng ý mẫu banner này, tôi sẽ chính thức áp dụng thay thế vào trang chủ cho bạn!
            </p>
            <Link
              href="/"
              className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-[#201817] text-sm font-bold transition-colors shrink-0"
            >
              Về trang chủ hiện tại
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
