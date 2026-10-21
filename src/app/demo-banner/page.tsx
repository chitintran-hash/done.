'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Sparkles, Palette, Eye, Coffee, GlassWater } from 'lucide-react';

export default function DemoBannerPage() {
  const [selectedBg, setSelectedBg] = useState<'drinks' | 'clear' | 'old'>('drinks');
  const [headlineTop, setHeadlineTop] = useState('CUSTOMIZE');
  const [headlineBottom, setHeadlineBottom] = useState('YOUR CUP');
  const [subHeadline, setSubHeadline] = useState('Tự tay thiết kế chiếc ly mang đậm dấu ấn riêng của bạn. Xem 3D trực quan 360°, in ấn theo yêu cầu từ 1 chiếc!');
  const [ctaText, setCtaText] = useState('Thiết kế ly ngay');

  const bgMap = {
    drinks: '/images/cupfy-hippeas-bg.jpg',
    clear: '/images/cupfy-hippeas-bg-v3.jpg',
    old: '/images/cupfy-hippeas-banner.jpg',
  };

  return (
    <div className="min-h-screen bg-[#FFF9E8] pt-24 md:pt-28 pb-20">
      {/* Thanh thông báo chế độ Demo dành cho Admin/Khách hàng */}
      <div className="max-w-[1400px] mx-auto px-6 mb-6">
        <div className="bg-[#3A211E] text-white rounded-2xl p-4 md:p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg border border-[#E8DFD8]/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFBF00] text-[#3A211E] flex items-center justify-center font-bold text-xl shrink-0 shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base md:text-lg flex items-center gap-2">
                Bản Demo Khắc Phục Độ Nét Banner (Không Còn Lỗi Chữ AI)
                <span className="text-xs bg-[#FCBF02] text-[#3A211E] px-2.5 py-0.5 rounded-full font-semibold">
                  HD Update
                </span>
              </h2>
              <p className="text-xs md:text-sm text-[#DDD8D2]">
                Hình ảnh ly được thay bằng ảnh thức uống & thuỷ tinh sắc nét 100%, khử hoàn toàn chữ AI bị méo.
              </p>
            </div>
          </div>

          {/* Bộ chọn hình ảnh nền ly */}
          <div className="flex items-center gap-2 bg-[#201817] p-1.5 rounded-xl border border-white/10 shrink-0">
            <button
              onClick={() => setSelectedBg('drinks')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs md:text-sm font-semibold transition-all ${
                selectedBg === 'drinks'
                  ? 'bg-[#FCBF02] text-[#201817] shadow-sm font-bold'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <Coffee className="w-4 h-4" />
              <span>Mẫu 1: Ly Cà Phê & Trà Đào (Rõ nét nhất)</span>
            </button>
            <button
              onClick={() => setSelectedBg('clear')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs md:text-sm font-semibold transition-all ${
                selectedBg === 'clear'
                  ? 'bg-[#FCBF02] text-[#201817] shadow-sm font-bold'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <GlassWater className="w-4 h-4" />
              <span>Mẫu 2: Ly Thuỷ Tinh & Đế Gỗ Cupfy</span>
            </button>
          </div>
        </div>
      </div>

      {/* KHU VỰC HERO BANNER THEO PHONG CÁCH HIPPEAS SẮC NÉT */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 mb-12">
        <div className="relative w-full rounded-[32px] md:rounded-[44px] overflow-hidden bg-[#FCBF02] shadow-[0_20px_60px_rgba(252,191,2,0.25)] border border-[#FCBF02]/40 min-h-[460px] md:min-h-[520px] lg:min-h-[560px] flex items-center">
          
          {/* Nền hình ly sắc nét */}
          <div className="absolute inset-0 z-0 pointer-events-none select-none">
            <Image
              src={bgMap[selectedBg]}
              alt="Bộ sưu tập ly thuỷ tinh Cupfy"
              fill
              priority
              quality={95}
              className="object-cover object-right md:object-center"
            />
            {/* Lớp phủ chuyển màu giúp chữ luôn nổi bật trên mọi thiết bị */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#FCBF02] via-[#FCBF02]/90 md:via-[#FCBF02]/25 to-transparent z-[1]" />
          </div>

          {/* Nội dung bên trái: Chữ to ấn tượng + Nút bấm */}
          <div className="relative z-10 w-full lg:w-[52%] p-8 sm:p-12 md:p-16 flex flex-col items-start">
            
            {/* Tag nhỏ thương hiệu */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/35 backdrop-blur-md border border-white/50 text-[#3A211E] text-xs sm:text-sm font-extrabold uppercase tracking-wider mb-4 sm:mb-5 shadow-sm">
              <Sparkles className="w-4 h-4 text-[#3A211E]" />
              <span>Cá nhân hóa mọi chiếc ly</span>
            </div>

            {/* Tiêu đề khổng lồ đặc trưng Hippeas */}
            <h1 className="font-heading font-black text-5xl sm:text-6xl md:text-7xl lg:text-[76px] leading-[0.94] tracking-tight uppercase mb-5 select-none">
              <span className="block text-white drop-shadow-sm">
                {headlineTop}
              </span>
              <span className="block text-[#3A211E] mt-1.5">
                {headlineBottom}
              </span>
            </h1>

            {/* Mô tả phụ */}
            <p className="text-base sm:text-lg md:text-xl text-[#3A211E] font-medium leading-relaxed mb-8 max-w-[480px]">
              {subHeadline}
            </p>

            {/* Nút bấm hình con nhộng (Pill button) màu nâu cà phê đậm */}
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/custom-cup"
                className="inline-flex items-center justify-center gap-2 px-9 py-4 bg-[#3A211E] text-[#FCBF02] hover:text-white rounded-full font-black text-base sm:text-lg transition-all duration-200 hover:bg-[#201817] hover:scale-105 shadow-[0_10px_25px_rgba(58,33,30,0.25)] group"
              >
                <span>{ctaText}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/products"
                className="inline-flex items-center justify-center px-8 py-4 bg-white/90 hover:bg-white text-[#3A211E] rounded-full font-bold text-base transition-all duration-200 border border-white/60 shadow-sm hover:shadow"
              >
                Xem sản phẩm
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* BẢNG TÙY BIẾN DÀNH CHO ADMIN */}
      <section className="max-w-[1400px] mx-auto px-6">
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#DDD8D2] shadow-sm">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#DDD8D2]">
            <Palette className="w-6 h-6 text-[#3A211E]" />
            <h3 className="text-xl font-bold text-[#201817]">
              Kiểm tra & Tùy biến Banner (Đã khử hoàn toàn lỗi chữ AI)
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-xs font-bold text-[#6F625E] uppercase mb-2">
                Dòng 1 (Màu trắng)
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
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#6F625E] uppercase mb-2">
                Dòng 2 (Màu nâu đậm)
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
              💡 <strong>Cải tiến:</strong> Hình ảnh ly thuỷ tinh được chụp/render với độ nét studio cao, thức uống màu sắc tươi ngon, không dán chữ AI giả mạo nên 100% rõ ràng, chuyên nghiệp!
            </p>
            <Link
              href="/"
              className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-[#201817] text-sm font-bold transition-colors shrink-0"
            >
              Về trang chủ
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
