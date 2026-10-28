import React from 'react';
import { Link } from 'react-router-dom';
import {
  Zap,
  Scale,
  ShoppingBag,
  HelpCircle,
  ShieldCheck,
  Lock,
  ArrowUp,
  ArrowRight,
} from 'lucide-react';
import type { LegalDocumentSlug } from '../types';

interface FooterProps {
  onNavigateTab?: (tab: string) => void;
  onOpenLegalDoc?: (slug: LegalDocumentSlug) => void;
  onOpenBusinessModel?: () => void;
}

export const Footer: React.FC<FooterProps> = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      style={{
        background: 'linear-gradient(135deg, #171116 0%, #211A22 50%, #2C1E29 100%)',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      }}
      className="text-[#CBBFC6] mt-20 relative font-sans"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">
        {/* Main 5-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-8 pb-12 border-b border-white/[0.08]">
          {/* COLUMN 1: BRAND BLOCK (lg:col-span-4) */}
          <div className="lg:col-span-4 space-y-4">
            <Link to="/" className="inline-flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#3A2438] via-[#68415F] to-[#C77C86] flex items-center justify-center text-white shadow-lg shadow-[#68415F]/20 group-hover:scale-105 transition-transform">
                <Zap className="w-5 h-5 fill-white" />
              </div>
              <div>
                <span className="text-xl font-black tracking-tight text-[#FFF8F1] block leading-none">
                  Flash<span className="text-[#F3B37A]">Group</span>
                </span>
                <span className="text-xs text-[#C77C86] font-bold tracking-wider uppercase mt-0.5 block">
                  CÀNG ĐÔNG, CÀNG RẺ.
                </span>
              </div>
            </Link>

            <p className="text-xs text-[#CBBFC6] leading-relaxed max-w-sm">
              Nền tảng mua gom theo khu vực, kết nối người mua, nhà cung cấp và điểm nhận hàng.
            </p>

            <div className="pt-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#211A22] border border-[#68415F]/50 text-[11px] font-black text-[#F3B37A] tracking-wider uppercase shadow-xs">
                <Scale className="w-3.5 h-3.5 text-[#C77C86]" />
                <span>PROTOTYPE HỌC THUẬT</span>
              </span>
            </div>
          </div>

          {/* COLUMN 2: MARKETPLACE (lg:col-span-2) */}
          <div className="lg:col-span-2 space-y-3.5">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#FFF8F1] flex items-center gap-1.5">
              <ShoppingBag className="w-3.5 h-3.5 text-[#C77C86]" />
              <span>MARKETPLACE</span>
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link
                  to="/marketplace"
                  className="text-[#CBBFC6] hover:text-[#F3B37A] font-semibold transition-colors block"
                >
                  KHÁM PHÁ
                </Link>
              </li>
              <li>
                <Link
                  to="/flashmap"
                  className="text-[#CBBFC6] hover:text-[#F3B37A] font-semibold transition-colors flex items-center gap-1"
                >
                  <span>FLASHMAP</span>
                  <span className="text-[9px] font-bold px-1.5 py-0.2 bg-[#68415F]/40 text-[#F3B37A] rounded">
                    BẢN ĐỒ
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  to="/how-it-works"
                  className="text-[#CBBFC6] hover:text-[#F3B37A] font-semibold transition-colors block"
                >
                  CÁCH HOẠT ĐỘNG
                </Link>
              </li>
              <li>
                <Link
                  to="/pickup-points"
                  className="text-[#CBBFC6] hover:text-[#F3B37A] font-semibold transition-colors block"
                >
                  ĐIỂM NHẬN HÀNG
                </Link>
              </li>
              <li>
                <Link
                  to="/suppliers"
                  className="text-[#CBBFC6] hover:text-[#F3B37A] font-semibold transition-colors block"
                >
                  NHÀ CUNG CẤP
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 3: HỖ TRỢ (lg:col-span-2) */}
          <div className="lg:col-span-2 space-y-3.5">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#FFF8F1] flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-[#C77C86]" />
              <span>HỖ TRỢ</span>
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link
                  to="/help"
                  className="text-[#CBBFC6] hover:text-[#F3B37A] font-semibold transition-colors block"
                >
                  TRUNG TÂM TRỢ GIÚP
                </Link>
              </li>
              <li>
                <Link
                  to="/orders"
                  className="text-[#CBBFC6] hover:text-[#F3B37A] font-semibold transition-colors block"
                >
                  THEO DÕI ĐƠN
                </Link>
              </li>
              <li>
                <Link
                  to="/complaints"
                  className="text-[#CBBFC6] hover:text-[#F3B37A] font-semibold transition-colors block"
                >
                  KHIẾU NẠI & TRANH CHẤP
                </Link>
              </li>
              <li>
                <Link
                  to="/refund-policy"
                  className="text-[#CBBFC6] hover:text-[#F3B37A] font-semibold transition-colors block"
                >
                  ĐỔI TRẢ & HOÀN TIỀN
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-[#CBBFC6] hover:text-[#F3B37A] font-semibold transition-colors block"
                >
                  LIÊN HỆ
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 4: PHÁP LÝ (lg:col-span-2) */}
          <div className="lg:col-span-2 space-y-3.5">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#FFF8F1] flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C77C86]" />
              <span>PHÁP LÝ</span>
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link
                  to="/terms"
                  className="text-[#CBBFC6] hover:text-[#F3B37A] font-semibold transition-colors block"
                >
                  ĐIỀU KHOẢN SỬ DỤNG
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-[#CBBFC6] hover:text-[#F3B37A] font-semibold transition-colors block"
                >
                  CHÍNH SÁCH QUYỀN RIÊNG TƯ
                </Link>
              </li>
              <li>
                <Link
                  to="/marketplace-rules"
                  className="text-[#CBBFC6] hover:text-[#F3B37A] font-semibold transition-colors block"
                >
                  QUY CHẾ NỀN TẢNG
                </Link>
              </li>
              <li>
                <Link
                  to="/seller-policy"
                  className="text-[#CBBFC6] hover:text-[#F3B37A] font-semibold transition-colors block"
                >
                  CHÍNH SÁCH NHÀ CUNG CẤP
                </Link>
              </li>
              <li>
                <Link
                  to="/transaction-policy"
                  className="text-[#CBBFC6] hover:text-[#F3B37A] font-semibold transition-colors block"
                >
                  CHÍNH SÁCH GIAO DỊCH
                </Link>
              </li>
              <li className="pt-1">
                <Link
                  to="/legal"
                  className="text-xs font-black text-[#C77C86] hover:text-[#F3B37A] flex items-center gap-1 group transition-colors"
                >
                  <span>XEM TẤT CẢ CHÍNH SÁCH</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 5: QUYỀN RIÊNG TƯ & KẾT NỐI (lg:col-span-2) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="space-y-3.5">
              <h4 className="text-xs font-black uppercase tracking-wider text-[#FFF8F1] flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#C77C86]" />
                <span>QUYỀN RIÊNG TƯ</span>
              </h4>
              <ul className="space-y-2.5 text-xs">
                <li>
                  <Link
                    to="/privacy-center"
                    className="text-[#CBBFC6] hover:text-[#F3B37A] font-semibold transition-colors block"
                  >
                    TRUNG TÂM QUYỀN RIÊNG TƯ
                  </Link>
                </li>
                <li>
                  <Link
                    to="/privacy-center/data"
                    className="text-[#CBBFC6] hover:text-[#F3B37A] font-semibold transition-colors block"
                  >
                    XEM DỮ LIỆU CỦA TÔI
                  </Link>
                </li>
                <li>
                  <Link
                    to="/privacy-center/consent"
                    className="text-[#CBBFC6] hover:text-[#F3B37A] font-semibold transition-colors block"
                  >
                    QUẢN LÝ CONSENT
                  </Link>
                </li>
              </ul>
            </div>

            {/* Social Icons (Demo) */}
            <div className="pt-2 border-t border-white/[0.08] space-y-2">
              <span className="text-[11px] font-bold text-[#CBBFC6] block uppercase tracking-wider">
                KẾT NỐI
              </span>
              <div className="flex items-center space-x-2">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  title="Facebook Demo"
                  className="w-7 h-7 rounded-lg bg-[#211A22] border border-white/10 hover:border-[#F3B37A] text-[#CBBFC6] hover:text-white flex items-center justify-center transition-all cursor-pointer text-xs font-black"
                >
                  f
                </a>
                <a
                  href="https://zalo.me"
                  target="_blank"
                  rel="noreferrer"
                  title="Zalo Demo"
                  className="w-7 h-7 rounded-lg bg-[#211A22] border border-white/10 hover:border-[#F3B37A] text-[#CBBFC6] hover:text-white flex items-center justify-center transition-all cursor-pointer text-xs font-black"
                >
                  Z
                </a>
                <a
                  href="https://telegram.org"
                  target="_blank"
                  rel="noreferrer"
                  title="Telegram Demo"
                  className="w-7 h-7 rounded-lg bg-[#211A22] border border-white/10 hover:border-[#F3B37A] text-[#CBBFC6] hover:text-white flex items-center justify-center transition-all cursor-pointer text-xs font-black"
                >
                  tg
                </a>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  title="GitHub Demo"
                  className="w-7 h-7 rounded-lg bg-[#211A22] border border-white/10 hover:border-[#F3B37A] text-[#CBBFC6] hover:text-white flex items-center justify-center transition-all cursor-pointer text-xs font-black"
                >
                  gh
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Separated Bottom Bar */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-[#CBBFC6]">
          <div className="text-center md:text-left">
            <span>© 2026 FlashGroup. Academic Prototype.</span>
          </div>

          <div className="text-center text-[#756871] italic">
            <span>Thanh toán và logistics hiện đang được mô phỏng.</span>
          </div>

          <div className="flex items-center space-x-4">
            <Link to="/privacy" className="hover:text-[#F3B37A] transition-colors font-medium">
              QUYỀN RIÊNG TƯ
            </Link>
            <span className="text-white/20">•</span>
            <Link to="/terms" className="hover:text-[#F3B37A] transition-colors font-medium">
              ĐIỀU KHOẢN
            </Link>
            <span className="text-white/20">•</span>
            <Link to="/contact" className="hover:text-[#F3B37A] transition-colors font-medium">
              LIÊN HỆ
            </Link>
            <span className="text-white/20">•</span>
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1 text-[#C77C86] hover:text-[#F3B37A] transition-colors font-bold cursor-pointer"
              title="Lên đầu trang"
            >
              <span>ĐẦU TRANG</span>
              <ArrowUp className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
