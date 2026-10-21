'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Sparkles, Check, Move, Eye, Printer, Bookmark, RotateCcw } from 'lucide-react';
import HeroSlider from '@/components/HeroSlider';

export default function DemoBannerPage() {
  const [cupView, setCupView] = useState<'mockup' | 'slider'>('mockup');
  const [gradientPreset, setGradientPreset] = useState<'sample' | 'warm'>('sample');

  const gradientStyles = {
    sample: 'from-[#FCB827] via-[#FDC640] via-60% to-[#FFD868]',
    warm: 'from-[#F59E0B] via-[#FFBF00] to-[#FDE047]'
  };

  return (
    <div className="min-h-screen bg-[#FFF9E8] pt-24 md:pt-28 pb-20">
      
      {/* Thanh thông báo & bảng điều khiển tương tác */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 mb-8">
        <div className="bg-[#171717] text-white rounded-3xl p-5 md:p-6 flex flex-col md:flex-row items-center justify-between gap-5 shadow-xl border border-white/10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FCB827] text-[#171717] flex items-center justify-center font-bold text-2xl shrink-0 shadow-sm">
              ✨
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-base md:text-lg">
                  Bản Demo: Banner Vàng Gradient & 4 Icon Badge Nổi
                </h2>
                <span className="text-[10px] bg-[#FCB827] text-[#171717] px-2.5 py-0.5 rounded-full font-black uppercase">
                  MẪU YÊU CẦU
                </span>
              </div>
              <p className="text-xs md:text-sm text-gray-300 mt-0.5">
                Màu vàng gradient ấm áp, khung ảnh bo viền trắng nổi 3D và 4 badge (DRAG & DROP, 360° PREVIEW, PRINT READY, SAVE DESIGN).
              </p>
            </div>
          </div>

          {/* Bộ chuyển đổi chế độ xem */}
          <div className="flex flex-wrap items-center gap-2 bg-[#261E1A] p-1.5 rounded-2xl border border-white/10 shrink-0">
            <button
              onClick={() => setCupView('mockup')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                cupView === 'mockup'
                  ? 'bg-[#FCB827] text-[#171717] shadow-sm'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Mẫu Ly Cupfy (Theo Ảnh Mẫu)
            </button>
            <button
              onClick={() => setCupView('slider')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                cupView === 'slider'
                  ? 'bg-[#FCB827] text-[#171717] shadow-sm'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Slider Ảnh Thật (3 Ảnh)
            </button>
          </div>
        </div>
      </div>

      {/* KHU VỰC BANNER DEMO CHÍNH */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 w-full mb-16">
        <div 
          className={`relative w-full rounded-[36px] md:rounded-[48px] overflow-hidden bg-gradient-to-br ${gradientStyles[gradientPreset]} shadow-[0_25px_60px_rgba(252,188,47,0.28)] border border-amber-300/60 min-h-[580px] md:min-h-[620px] flex flex-col lg:flex-row items-center justify-between p-6 sm:p-10 lg:p-14 xl:p-16 gap-10`}
        >
          {/* Lớp ánh sáng tỏa (Glow effects) */}
          <div className="absolute -right-24 -top-24 w-[420px] h-[420px] bg-white/25 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -left-20 -bottom-20 w-[360px] h-[360px] bg-amber-500/20 rounded-full blur-2xl pointer-events-none"></div>

          {/* CỘT TRÁI: Nội dung chữ, nút bấm, checklist */}
          <div className="relative z-10 w-full lg:w-[50%] flex flex-col items-start text-left">
            
            {/* Tag nhỏ thương hiệu */}
            <div className="text-[12px] sm:text-[13px] font-black uppercase tracking-[0.22em] text-[#A66002] mb-3 sm:mb-4 select-none">
              CUPFY · CUSTOM CUP STUDIO
            </div>

            {/* Tiêu đề khổng lồ */}
            <h1 className="font-heading font-black text-4xl sm:text-5xl md:text-6xl lg:text-[62px] xl:text-[66px] leading-[1.04] tracking-tight text-[#171717] mb-6 select-none">
              Tự tạo chiếc ly<br />
              mang đúng<br />
              chất bạn.
            </h1>

            {/* Đoạn mô tả chi tiết */}
            <p className="text-base sm:text-lg text-[#1F1A17]/90 font-medium leading-relaxed max-w-[480px] mb-8">
              Chọn ly, thêm tên hoặc hình ảnh, xem trước 360°, kiểm tra chất lượng và đặt sản xuất — tất cả trên một website.
            </p>

            {/* Cặp nút bấm CTA */}
            <div className="flex flex-wrap items-center gap-4 mb-8">
              <Link
                href="/custom-cup"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#171717] text-white rounded-full font-extrabold text-sm sm:text-base transition-all duration-200 hover:bg-[#2A201C] hover:scale-105 shadow-[0_12px_28px_rgba(23,23,23,0.25)] group"
              >
                <span className="text-amber-400">✨</span>
                <span>Thiết kế ly của bạn</span>
              </Link>

              <Link
                href="/products"
                className="inline-flex items-center justify-center px-7 py-4 bg-white text-[#171717] rounded-full font-bold text-sm sm:text-base transition-all duration-200 hover:bg-[#FFF9E8] hover:scale-102 border border-white/60 shadow-sm"
              >
                Xem sản phẩm
              </Link>
            </div>

            {/* 4 Checkmark tính năng dưới nút bấm */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-xs sm:text-sm font-bold text-[#1F1A17]">
              <div className="flex items-center gap-2">
                <span className="text-[#171717] font-black">✓</span>
                <span>Xem trước 360°</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#171717] font-black">✓</span>
                <span>Cảnh báo ảnh mờ</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#171717] font-black">✓</span>
                <span>Giá cập nhật trực tiếp</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#171717] font-black">✓</span>
                <span>Lưu thiết kế</span>
              </div>
            </div>

          </div>

          {/* CỘT PHẢI: Khung ảnh chiếc ly + 4 Icon Badge nổi bao quanh */}
          <div className="relative z-10 w-full lg:w-[48%] flex items-center justify-center p-2 sm:p-6 lg:p-8">
            
            {/* CONTAINER KHUNG LY */}
            <div className="relative w-full max-w-[400px]">

              {/* BADGE 1: DRAG & DROP (Góc trên bên trái) */}
              <div className="absolute -top-5 -left-4 sm:-top-7 sm:-left-8 z-30 bg-white text-[#171717] font-black text-xs sm:text-[13px] px-5 py-2.5 rounded-full shadow-[0_12px_30px_rgba(0,0,0,0.15)] border border-white/80 -rotate-6 select-none hover:rotate-0 hover:scale-105 transition-all duration-200 cursor-default flex items-center gap-1.5">
                <span>DRAG & DROP</span>
              </div>

              {/* BADGE 2: 360° PREVIEW (Góc trên bên phải) */}
              <div className="absolute top-6 -right-4 sm:top-8 sm:-right-8 z-30 bg-[#A0091F] text-white font-black text-xs sm:text-[13px] px-5 py-2.5 rounded-full shadow-[0_12px_30px_rgba(160,9,31,0.4)] rotate-8 select-none hover:rotate-0 hover:scale-105 transition-all duration-200 cursor-default flex items-center gap-1.5">
                <span>360° PREVIEW</span>
              </div>

              {/* BADGE 3: PRINT READY ✓ (Góc dưới bên trái) */}
              <div className="absolute bottom-12 -left-4 sm:bottom-16 sm:-left-8 z-30 bg-[#EF6807] text-white font-black text-xs sm:text-[13px] px-5 py-2.5 rounded-full shadow-[0_12px_30px_rgba(239,104,7,0.4)] -rotate-6 select-none hover:rotate-0 hover:scale-105 transition-all duration-200 cursor-default flex items-center gap-1.5">
                <span>PRINT READY ✓</span>
              </div>

              {/* BADGE 4: SAVE DESIGN (Góc dưới bên phải) */}
              <div className="absolute -bottom-3 -right-2 sm:-bottom-5 sm:-right-6 z-30 bg-[#2C9EC6] text-white font-black text-xs sm:text-[13px] px-5 py-2.5 rounded-full shadow-[0_12px_30px_rgba(44,158,198,0.4)] rotate-6 select-none hover:rotate-0 hover:scale-105 transition-all duration-200 cursor-default flex items-center gap-1.5">
                <span>SAVE DESIGN</span>
              </div>

              {/* KHUNG CHỨA HÌNH LY (Viền bo nổi 3D + Đổ bóng sang trọng) */}
              <div className="w-full aspect-[4/5] rounded-[36px] sm:rounded-[44px] bg-gradient-to-b from-white/95 via-white/85 to-[#FFF3C4]/60 backdrop-blur-md p-6 sm:p-8 flex flex-col items-center justify-center relative overflow-hidden shadow-[0_20px_60px_rgba(58,33,30,0.18)] border-[3px] border-white/90">
                
                {cupView === 'mockup' ? (
                  /* VIEW 1: Chiếc ly Cupfy phong cách Vector Mockup (Như trong ảnh mẫu) */
                  <div className="w-full h-full flex flex-col items-center justify-center animate-in fade-in duration-300">
                    <div className="relative w-[240px] sm:w-[270px] h-[340px] sm:h-[370px] rounded-[32px] bg-gradient-to-r from-[#FFFDF7] via-white to-[#FDF8EC] shadow-[0_25px_40px_rgba(58,33,30,0.12)] border border-amber-200/50 flex flex-col items-center justify-center p-6 text-center">
                      
                      {/* Ánh sáng phản chiếu thân ly */}
                      <div className="absolute left-4 top-0 bottom-0 w-8 bg-gradient-to-r from-white/70 to-transparent rounded-l-[32px]"></div>
                      
                      {/* Logo Cupfy dập nổi trên thân ly */}
                      <div className="flex flex-col items-center select-none my-auto">
                        <div className="text-4xl sm:text-5xl font-black text-[#A0091F] tracking-tight lowercase">
                          cupfy<span className="text-[#EF6807]">.</span>
                        </div>
                        <div className="text-[11px] sm:text-xs font-black tracking-[0.25em] text-[#0284C7] uppercase mt-2">
                          YOUR CUP · YOUR STORY
                        </div>
                      </div>

                      <div className="text-[11px] text-[#765B52] font-semibold mt-auto opacity-75">
                        Bản mô phỏng 3D trực quan
                      </div>
                    </div>
                  </div>
                ) : (
                  /* VIEW 2: Slider ảnh thật của Cupfy */
                  <div className="w-full h-full flex items-center justify-center animate-in fade-in duration-300">
                    <div className="w-full h-full rounded-[28px] overflow-hidden bg-white shadow-inner flex items-center justify-center">
                      <HeroSlider />
                    </div>
                  </div>
                )}

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* CHI TIẾT BẢNG MÀU VÀ GIAO DIỆN ĐƯỢC ĐỒNG BỘ */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E8DFD8] shadow-sm">
          <h3 className="font-extrabold text-xl text-[#3A211E] mb-6 flex items-center gap-2">
            <span>🎨</span> Bảng màu thương hiệu & các chi tiết sẽ được đồng bộ toàn website:
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="p-5 rounded-2xl bg-[#FFF9E8] border border-[#E8DFD8]">
              <div className="w-full h-14 rounded-xl bg-gradient-to-r from-[#FCB827] via-[#FDC640] to-[#FFD868] mb-3 shadow-inner"></div>
              <div className="font-extrabold text-sm text-[#3A211E]">Vàng Gradient Banner</div>
              <div className="text-xs text-[#765B52] mt-1 font-mono">#FCB827 ➜ #FFD868</div>
              <p className="text-xs text-[#765B52] mt-2">Nền banner chính, tạo cảm giác ấm áp, trẻ trung và tràn đầy năng lượng.</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FFF9E8] border border-[#E8DFD8]">
              <div className="w-full h-14 rounded-xl bg-[#FFF9E8] border-2 border-[#E8DFD8] mb-3 flex items-center justify-center font-bold text-xs text-[#765B52]">
                Background
              </div>
              <div className="font-extrabold text-sm text-[#3A211E]">Kem Trắng Ngà (#FFF9E8)</div>
              <div className="text-xs text-[#765B52] mt-1 font-mono">#FFF9E8</div>
              <p className="text-xs text-[#765B52] mt-2">Màu nền toàn bộ website (Header, Background trang chủ, Footer transition).</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FFF9E8] border border-[#E8DFD8]">
              <div className="w-full h-14 rounded-xl bg-[#171717] mb-3 flex items-center justify-center font-bold text-xs text-white">
                Button CTA
              </div>
              <div className="font-extrabold text-sm text-[#3A211E]">Đen Chocolate (#171717)</div>
              <div className="text-xs text-[#765B52] mt-1 font-mono">#171717</div>
              <p className="text-xs text-[#765B52] mt-2">Nút bấm chính "Thiết kế ly", tiêu đề lớn và màu chữ tương phản cao.</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FFF9E8] border border-[#E8DFD8]">
              <div className="flex gap-1.5 mb-3">
                <span className="w-7 h-14 rounded-lg bg-white border border-[#E8DFD8]"></span>
                <span className="w-7 h-14 rounded-lg bg-[#A0091F]"></span>
                <span className="w-7 h-14 rounded-lg bg-[#EF6807]"></span>
                <span className="w-7 h-14 rounded-lg bg-[#2C9EC6]"></span>
              </div>
              <div className="font-extrabold text-sm text-[#3A211E]">Bộ 4 Badges Nổi</div>
              <div className="text-xs text-[#765B52] mt-1 font-mono">Trắng, Đỏ, Cam, Xanh</div>
              <p className="text-xs text-[#765B52] mt-2">DRAG & DROP, 360° PREVIEW, PRINT READY, SAVE DESIGN tạo điểm nhấn công nghệ.</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#FFF3C4] border border-[#FFBF00]/40 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs sm:text-sm text-[#3A211E]">
              <strong>Bạn thấy bản Demo này thế nào?</strong> Nếu bạn ưng ý với màu gradient vàng này và cách bố trí các badge bao quanh ảnh ly, hãy xác nhận để tôi áp dụng chính thức ra Trang Chủ [www.cupfy.space](https://www.cupfy.space)!
            </div>
            <Link
              href="/"
              className="px-6 py-2.5 rounded-full bg-[#3A211E] text-white font-bold text-xs shrink-0 hover:bg-[#171717] transition-all"
            >
              Về Trang Chủ
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
