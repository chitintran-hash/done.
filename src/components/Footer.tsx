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
        background: '#0C0D10',
        borderTop: '1px solid rgba(255, 255, 255, 0.12)',
      }}
      className="text-[#C4CCD8] mt-20 relative font-sans"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">
        {/* Main 5-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-8 pb-12 border-b border-white/[0.12]">
          {/* COLUMN 1: BRAND BLOCK (lg:col-span-4) */}
          <div className="lg:col-span-4 space-y-4">
            <Link to="/" className="inline-flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-2xl bg-[#3155FF] flex items-center justify-center text-[#C7F000] shadow-lg shadow-black/25 group-hover:scale-105 transition-transform">
                <Zap className="w-5 h-5 fill-[#C7F000] stroke-[#0C0D10]" />
              </div>
              <div>
                <span className="text-xl font-black tracking-tight text-[#FFFFFF] block leading-none">
                  FLASH<span className="text-[#3155FF]">GROUP</span>
                </span>
                <span className="text-xs text-[#C4CCD8] font-bold tracking-wider uppercase mt-0.5 block">
                  CÀNG ĐÔNG, CÀNG RẺ.
                </span>
              </div>
            </Link>

            <p className="text-xs text-[#C4CCD8] leading-relaxed max-w-sm">
              Nền tảng mua gom theo khu vực, kết nối người mua, nhà cung cấp và điểm nhận hàng.
            </p>

            <div className="pt-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[11px] font-black text-[#C7F000] tracking-wider uppercase shadow-xs">
                <Scale className="w-3.5 h-3.5 text-[#3155FF]" />
                <span>PROTOTYPE HỌC THUẬT</span>
              </span>
            </div>
          </div>

          {/* COLUMN 2: MARKETPLACE (lg:col-span-2) */}
          <div className="lg:col-span-2 space-y-3.5">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#FFFFFF] flex items-center gap-1.5">
              <ShoppingBag className="w-3.5 h-3.5 text-[#3155FF]" />
              <span>MARKETPLACE</span>
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link
                  to="/marketplace"
                  className="text-[#C4CCD8] hover:text-white font-semibold transition-colors block"
                >
                  KHÁM PHÁ
                </Link>
              </li>
              <li>
                <Link
                  to="/flashmap"
                  className="text-[#C4CCD8] hover:text-white font-semibold transition-colors flex items-center gap-1"
                >
                  <span>FLASHMAP</span>
                  <span className="text-[9px] font-bold px-1.5 py-0.2 bg-[#3155FF] text-white rounded">
                    BẢN ĐỒ
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  to="/how-it-works"
                  className="text-[#C4CCD8] hover:text-white font-semibold transition-colors block"
                >
                  CÁCH HOẠT ĐỘNG
                </Link>
              </li>
              <li>
                <Link
                  to="/pickup-points"
                  className="text-[#C4CCD8] hover:text-white font-semibold transition-colors block"
                >
                  ĐIỂM NHẬN HÀNG
                </Link>
              </li>
              <li>
                <Link
                  to="/suppliers"
                  className="text-[#C4CCD8] hover:text-white font-semibold transition-colors block"
                >
                  NHÀ CUNG CẤP
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 3: HỖ TRỢ (lg:col-span-2) */}
          <div className="lg:col-span-2 space-y-3.5">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#FFFFFF] flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-[#3155FF]" />
              <span>HỖ TRỢ</span>
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link
                  to="/help"
                  className="text-[#C4CCD8] hover:text-white font-semibold transition-colors block"
                >
                  TRUNG TÂM TRỢ GIÚP
                </Link>
              </li>
              <li>
                <Link
                  to="/orders"
                  className="text-[#C4CCD8] hover:text-white font-semibold transition-colors block"
                >
                  THEO DÕI ĐƠN
                </Link>
              </li>
              <li>
                <Link
                  to="/complaints"
                  className="text-[#C4CCD8] hover:text-white font-semibold transition-colors block"
                >
                  KHIẾU NẠI & TRANH CHẤP
                </Link>
              </li>
              <li>
                <Link
                  to="/refund-policy"
                  className="text-[#C4CCD8] hover:text-white font-semibold transition-colors block"
                >
                  ĐỔI TRẢ & HOÀN TIỀN
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-[#C4CCD8] hover:text-white font-semibold transition-colors block"
                >
                  LIÊN HỆ
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 4: PHÁP LÝ (lg:col-span-2) */}
          <div className="lg:col-span-2 space-y-3.5">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#FFFFFF] flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#3155FF]" />
              <span>PHÁP LÝ</span>
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link
                  to="/terms"
                  className="text-[#C4CCD8] hover:text-white font-semibold transition-colors block"
                >
                  ĐIỀU KHOẢN SỬ DỤNG
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-[#C4CCD8] hover:text-white font-semibold transition-colors block"
                >
                  CHÍNH SÁCH QUYỀN RIÊNG TƯ
                </Link>
              </li>
              <li>
                <Link
                  to="/marketplace-rules"
                  className="text-[#C4CCD8] hover:text-white font-semibold transition-colors block"
                >
                  QUY CHẾ NỀN TẢNG
                </Link>
              </li>
              <li>
                <Link
                  to="/seller-policy"
                  className="text-[#C4CCD8] hover:text-white font-semibold transition-colors block"
                >
                  CHÍNH SÁCH NHÀ CUNG CẤP
                </Link>
              </li>
              <li>
                <Link
                  to="/transaction-policy"
                  className="text-[#C4CCD8] hover:text-white font-semibold transition-colors block"
                >
                  CHÍNH SÁCH GIAO DỊCH
                </Link>
              </li>
              <li className="pt-1">
                <Link
                  to="/legal"
                  className="text-xs font-black text-[#3155FF] hover:text-[#C7F000] flex items-center gap-1 group transition-colors"
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
              <h4 className="text-xs font-black uppercase tracking-wider text-[#FFFFFF] flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#3155FF]" />
                <span>QUYỀN RIÊNG TƯ</span>
              </h4>
              <ul className="space-y-2.5 text-xs">
                <li>
                  <Link
                    to="/privacy-center"
                    className="text-[#C4CCD8] hover:text-white font-semibold transition-colors block"
                  >
                    TRUNG TÂM QUYỀN RIÊNG TƯ
                  </Link>
                </li>
                <li>
                  <Link
                    to="/privacy-center/data"
                    className="text-[#C4CCD8] hover:text-white font-semibold transition-colors block"
                  >
                    XEM DỮ LIỆU CỦA TÔI
                  </Link>
                </li>
                <li>
                  <Link
                    to="/privacy-center/consent"
                    className="text-[#C4CCD8] hover:text-white font-semibold transition-colors block"
                  >
                    QUẢN LÝ CONSENT
                  </Link>
                </li>
              </ul>
            </div>

            {/* Social Icons (Demo) */}
            <div className="pt-2 border-t border-white/[0.12] space-y-2">
              <span className="text-[11px] font-bold text-[#C4CCD8] block uppercase tracking-wider">
                KẾT NỐI
              </span>
              <div className="flex items-center space-x-2">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  title="Facebook Demo"
                  className="w-7 h-7 rounded-lg bg-white/10 border border-white/20 hover:border-[#3155FF] text-[#C4CCD8] hover:text-white flex items-center justify-center transition-all cursor-pointer text-xs font-black"
                >
                  f
                </a>
                <a
                  href="https://zalo.me"
                  target="_blank"
                  rel="noreferrer"
                  title="Zalo Demo"
                  className="w-7 h-7 rounded-lg bg-white/10 border border-white/20 hover:border-[#3155FF] text-[#C4CCD8] hover:text-white flex items-center justify-center transition-all cursor-pointer text-xs font-black"
                >
                  Z
                </a>
                <a
                  href="https://telegram.org"
                  target="_blank"
                  rel="noreferrer"
                  title="Telegram Demo"
                  className="w-7 h-7 rounded-lg bg-white/10 border border-white/20 hover:border-[#3155FF] text-[#C4CCD8] hover:text-white flex items-center justify-center transition-all cursor-pointer text-xs font-black"
                >
                  tg
                </a>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  title="GitHub Demo"
                  className="w-7 h-7 rounded-lg bg-white/10 border border-white/20 hover:border-[#3155FF] text-[#C4CCD8] hover:text-white flex items-center justify-center transition-all cursor-pointer text-xs font-black"
                >
                  gh
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Separated Bottom Bar */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-[#C4CCD8]">
          <div className="text-center md:text-left">
            <span>© 2026 FlashGroup. Academic Prototype.</span>
          </div>

          <div className="text-center text-[#C4CCD8] italic">
            <span>Thanh toán và logistics hiện đang được mô phỏng.</span>
          </div>

          <div className="flex items-center space-x-4">
            <Link to="/privacy" className="text-[#C4CCD8] hover:text-white transition-colors font-medium">
              QUYỀN RIÊNG TƯ
            </Link>
            <span className="text-white/20">•</span>
            <Link to="/terms" className="text-[#C4CCD8] hover:text-white transition-colors font-medium">
              ĐIỀU KHOẢN
            </Link>
            <span className="text-white/20">•</span>
            <Link to="/contact" className="text-[#C4CCD8] hover:text-white transition-colors font-medium">
              LIÊN HỆ
            </Link>
            <span className="text-white/20">•</span>
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1 text-[#3155FF] hover:text-[#C7F000] transition-colors font-bold cursor-pointer"
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
