import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ShieldCheck,
  Scale,
  FileText,
  HelpCircle,
  Phone,
  Mail,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  Building2,
  Users,
  Search,
  ChevronRight,
  TrendingDown,
  RotateCcw,
  Sparkles,
  ExternalLink,
  Printer,
  ShoppingBag,
} from 'lucide-react';
import type { LegalDocument, LegalDocumentSlug, PickupPoint, Supplier } from '../types';
import { formatVND } from '../utils/pricing';

// ==========================================
// 1. LEGAL POLICY & REGULATORY HUB PAGE
// ==========================================
interface LegalPolicyPageViewProps {
  slug: LegalDocumentSlug | 'legal';
  documents: LegalDocument[];
}

export const LegalPolicyPageView: React.FC<LegalPolicyPageViewProps> = ({ slug, documents }) => {
  const navigate = useNavigate();

  // Find document or default to terms
  const currentDoc =
    slug === 'legal'
      ? null
      : documents.find((d) => d.slug === slug) || documents.find((d) => d.slug === 'terms_of_use') || documents[0];

  const policyMenu: { slug: LegalDocumentSlug; title: string; badge: string; path: string }[] = [
    { slug: 'terms_of_use', title: 'ĐIỀU KHOẢN SỬ DỤNG', badge: 'v2026.1', path: '/terms' },
    { slug: 'privacy_policy', title: 'CHÍNH SÁCH QUYỀN RIÊNG TƯ (NĐ 13/2023)', badge: 'NĐ 13/2023', path: '/privacy' },
    { slug: 'marketplace_operating_rules', title: 'QUY CHẾ NỀN TẢNG TMĐT', badge: 'NĐ 85/2021', path: '/marketplace-rules' },
    { slug: 'seller_policy', title: 'CHÍNH SÁCH NHÀ CUNG CẤP & XÁC MINH', badge: 'Xác minh 7 bước', path: '/seller-policy' },
    { slug: 'transaction_policy', title: 'CHÍNH SÁCH GIAO DỊCH TỪ XA & HỢP ĐỒNG', badge: 'NĐ 55/2024', path: '/transaction-policy' },
    { slug: 'return_refund_policy', title: 'CHÍNH SÁCH ĐỔI TRẢ & HOÀN TIỀN', badge: 'Bảo vệ quyền lợi', path: '/refund-policy' },
    { slug: 'shipping_pickup_policy', title: 'CHÍNH SÁCH GIAO HÀNG GOM CHUNG', badge: 'NĐ 163/2017', path: '/shipping-policy' },
    { slug: 'promotion_voucher_terms', title: 'ĐIỀU KHOẢN MINH BẠCH KHUYẾN MẠI', badge: 'NĐ 81/2018', path: '/promotion-terms' },
    { slug: 'referral_program_terms', title: 'ĐIỀU KHOẢN CHƯƠNG TRÌNH GIỚI THIỆU', badge: 'Luật Cạnh tranh', path: '/referral-terms' },
    { slug: 'community_review_rules', title: 'QUY TẮC CỘNG ĐỒNG & BÌNH LUẬN', badge: 'Kiểm duyệt công bằng', path: '/community-rules' },
    { slug: 'complaint_dispute_policy', title: 'GIẢI QUYẾT KHIẾU NẠI & TRANH CHẤP', badge: 'SLA 3 ngày', path: '/complaints' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
      {/* Back to Home / Marketplace */}
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>QUAY LẠI TRANG CHỦ</span>
        </Link>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Scale className="w-4 h-4 text-blue-600" />
          <span>Nguyên mẫu nghiên cứu học thuật • Bộ Công Thương / ĐHQG</span>
        </div>
      </div>

      {/* Hero Header (Req 17: Blue/Navy/Indigo/Cyan System) */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0B1020 0%, #1E3A8A 45%, #4F46E5 75%, #06B6D4 100%)',
        }}
        className="rounded-3xl text-white p-8 sm:p-10 shadow-xl border border-white/10"
      >
        <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold text-cyan-300 border border-white/20 mb-3 uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4 text-cyan-300" />
          <span>TRUNG TÂM PHÁP LÝ & QUY CHẾ NỀN TẢNG</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white mb-2">
          {slug === 'legal' ? 'TẤT CẢ VĂN BẢN QUY CHẾ & CHÍNH SÁCH FLASHGROUP' : currentDoc?.title.toUpperCase()}
        </h1>
        <p className="text-xs sm:text-sm text-slate-200 max-w-3xl leading-relaxed">
          Toàn bộ quy chế và chính sách bảo vệ quyền lợi người tiêu dùng theo Luật Giao dịch điện tử 2023, Nghị định 55/2024/NĐ-CP và Nghị định 13/2023/NĐ-CP.
        </p>
      </div>

      {/* Main Grid: Policy Navigation Sidebar + Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Menu Links */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm space-y-2">
          <div className="text-[11px] font-black uppercase tracking-wider text-slate-400 px-3 py-1">
            DANH MỤC VĂN BẢN
          </div>
          {policyMenu.map((item) => (
            <Link
              key={item.slug}
              to={item.path}
              className={`flex items-center justify-between p-3 rounded-xl text-xs font-bold transition-all ${
                currentDoc?.slug === item.slug
                  ? 'bg-[#EEF2FF] text-[#4F46E5] border border-[#C7D2FE] shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <span className="line-clamp-1">{item.title}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 shrink-0 ml-2">
                {item.badge}
              </span>
            </Link>
          ))}
        </div>

        {/* Right: Policy Document Content */}
        <div className="lg:col-span-8 space-y-6">
          {slug === 'legal' ? (
            /* Hub View */
            <div className="space-y-4">
              <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">
                DANH SÁCH 11 VĂN BẢN CHÍNH THỨC CỦA NỀN TẢNG
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {policyMenu.map((m) => (
                  <Link
                    key={m.slug}
                    to={m.path}
                    className="p-5 bg-white rounded-2xl border border-slate-200/80 hover:border-blue-500 shadow-sm hover:shadow-md transition-all group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                        {m.badge}
                      </span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600" />
                    </div>
                    <h3 className="font-black text-xs sm:text-sm text-slate-900 group-hover:text-blue-600 uppercase">
                      {m.title}
                    </h3>
                  </Link>
                ))}
              </div>
            </div>
          ) : currentDoc ? (
            /* Single Document View (Req 30 & 31: Strong uppercase title, small metadata, normal readable body) */
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-blue-100 text-blue-800">
                      Phiên bản: {currentDoc.version}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      Ngày ban hành: {currentDoc.effectiveDate}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      • Cập nhật: {currentDoc.lastUpdated}
                    </span>
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
                    {currentDoc.title}
                  </h2>
                </div>
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-slate-500" />
                  <span>In văn bản</span>
                </button>
              </div>

              {/* Summary Callout */}
              <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-4 text-xs font-medium text-blue-900 leading-relaxed">
                <strong className="text-blue-950 font-black">TÓM TẮT QUY ĐỊNH:</strong> {currentDoc.summary}
              </div>

              {/* Parsed Articles (Req 31: Normal readable body, NOT uppercase) */}
              <div className="space-y-4">
                {currentDoc.content.split('\n\n').map((paragraph, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-2xl bg-slate-50/60 border border-slate-100 text-xs text-slate-700 leading-relaxed font-normal whitespace-pre-line"
                  >
                    {paragraph}
                  </div>
                ))}
              </div>

              {/* Legal Warning Notice */}
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>LƯU Ý QUYỀN KHIẾU NẠI & HỖ TRỢ PHÁP LÝ:</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Người mua có quyền gửi yêu cầu giải quyết tranh chấp thông qua Trung tâm Khiếu nại FlashGroup trong thời hạn 24 giờ kể từ khi nhận hàng theo quy định tại Điều 31 Luật Bảo vệ quyền lợi người tiêu dùng 2023.
                </p>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 2. HOW IT WORKS PAGE (/how-it-works)
// ==========================================
export const HowItWorksPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10 animate-fade-in">
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>QUAY LẠI TRANG CHỦ</span>
        </Link>
      </div>

      <div
        style={{
          background: 'linear-gradient(135deg, #0B1020 0%, #1E3A8A 45%, #4F46E5 75%, #06B6D4 100%)',
        }}
        className="rounded-3xl text-white p-8 sm:p-12 shadow-xl border border-white/10 text-center"
      >
        <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold text-cyan-300 border border-white/20 mb-4 uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-cyan-300" />
          <span>MÔ HÌNH MUA GOM SIÊU CỤC BỘ (HYPERLOCAL GROUP BUYING)</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight mb-4">
          CÁCH FLASHGROUP HOẠT ĐỘNG
        </h1>
        <p className="text-xs sm:text-base text-slate-200 max-w-2xl mx-auto leading-relaxed">
          Kết nối người mua gần nhau tại KTX, chung cư, khu phố và văn phòng để cùng gom đủ số lượng, tự động hạ mức giá sỉ và gom đơn vào một chuyến giao duy nhất.
        </p>
      </div>

      {/* 4 Steps Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          {
            step: '01',
            title: 'CHỌN PHÒNG GOM GẦN BẠN',
            desc: 'Tìm kiếm phòng gom mở tại KTX, chung cư hoặc khu phố của bạn trên FlashMap. Bán kính nhận hàng thuận tiện.',
            badge: 'Bán kính < 3km',
          },
          {
            step: '02',
            title: 'THAM GIA CÙNG CỘNG ĐỒNG',
            desc: 'Đăng ký số lượng muốn mua và rủ thêm người xung quanh tham gia để tăng tổng sản lượng phòng.',
            badge: 'Rủ bạn cùng mua',
          },
          {
            step: '03',
            title: 'ĐẠT MỐC GIÁ TỐT HƠN',
            desc: 'Càng đông người mua, bậc giá tự động hạ xuống. Toàn bộ nhóm cùng được hưởng mức giá chốt thấp nhất.',
            badge: 'Càng đông, càng rẻ',
          },
          {
            step: '04',
            title: 'NHẬN HÀNG TẠI LOCKER / HUB',
            desc: 'Toàn bộ đơn hàng gom thành 1 chuyến xe về Locker hoặc bàn giao KTX. Quét mã QR nhận hàng 24h và chia đều cước.',
            badge: 'Chia sẻ 100% cước',
          },
        ].map((st) => (
          <div
            key={st.step}
            className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between"
          >
            <div>
              <span className="text-3xl font-black text-blue-600 block mb-2">{st.step}</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 mb-3 inline-block">
                {st.badge}
              </span>
              <h3 className="font-black text-sm uppercase text-slate-900 mb-2">{st.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">{st.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Comparison Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
        <h2 className="text-lg font-black uppercase text-slate-900 tracking-tight">
          SO SÁNH: FLASHGROUP VS. THƯƠNG MẠI TRUYỀN THỐNG
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[11px]">
                <th className="py-3 px-4">Tiêu chí</th>
                <th className="py-3 px-4 text-blue-700">Mô hình Mua gom FlashGroup</th>
                <th className="py-3 px-4 text-slate-600">Mua lẻ trực tuyến thông thường</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-3 px-4 font-bold text-slate-900">Mức giá sản phẩm</td>
                <td className="py-3 px-4 text-blue-700 font-bold">Giảm 15% – 35% theo bậc sỉ</td>
                <td className="py-3 px-4 text-slate-600">Giá bán lẻ niêm yết cố định</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-slate-900">Chi phí vận chuyển</td>
                <td className="py-3 px-4 text-blue-700 font-bold">Chia đều theo lô (chỉ 2k – 5k/người)</td>
                <td className="py-3 px-4 text-slate-600">Mỗi đơn trả phí ship riêng (20k – 35k)</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-slate-900">Điểm nhận hàng</td>
                <td className="py-3 px-4 text-blue-700 font-bold">Smart Locker, sảnh KTX, hub chung cư</td>
                <td className="py-3 px-4 text-slate-600">Phải túc trực điện thoại nhận shipper</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-slate-900">Bảo đảm rủi ro</td>
                <td className="py-3 px-4 text-blue-700 font-bold">Hoàn tiền 100% nếu không đủ số lượng</td>
                <td className="py-3 px-4 text-slate-600">Phụ thuộc quy định từng sàn</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 3. PICKUP POINTS DIRECTORY PAGE (/pickup-points)
// ==========================================
export const PickupPointsDirectoryPage: React.FC<{ pickupPoints: PickupPoint[] }> = ({ pickupPoints }) => {
  const [filterCity, setFilterCity] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [search, setSearch] = useState<string>('');

  const filtered = pickupPoints.filter((pt) => {
    if (filterCity !== 'all' && pt.provinceOrCity && !pt.provinceOrCity.includes(filterCity)) return false;
    if (filterType !== 'all' && pt.type !== filterType) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      if (!pt.name.toLowerCase().includes(q) && !pt.address.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>QUAY LẠI TRANG CHỦ</span>
        </Link>
        <Link
          to="/flashmap"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-blue-600 transition-colors"
        >
          <MapPin className="w-3.5 h-3.5 text-cyan-400" />
          <span>MỞ TRÊN FLASHMAP</span>
        </Link>
      </div>

      <div
        style={{
          background: 'linear-gradient(135deg, #0B1020 0%, #1E3A8A 45%, #4F46E5 75%, #06B6D4 100%)',
        }}
        className="rounded-3xl text-white p-8 sm:p-10 shadow-xl border border-white/10"
      >
        <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold text-cyan-300 border border-white/20 mb-3 uppercase tracking-wider">
          <MapPin className="w-4 h-4 text-cyan-300" />
          <span>MẠNG LƯỚI LOGISTICS SIÊU CỤC BỘ</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white mb-2">
          DANH SÁCH ĐIỂM NHẬN HÀNG & SMART LOCKER
        </h1>
        <p className="text-xs sm:text-sm text-slate-200 max-w-2xl leading-relaxed">
          Các điểm nhận hàng phân bố tại KTX, cụm chung cư, tòa nhà văn phòng và khu dân cư khắp TP.HCM và Hà Nội.
        </p>
      </div>

      {/* Filters Bar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm flex flex-wrap gap-3 items-center justify-between">
        <div className="flex items-center gap-2">
          <select
            value={filterCity}
            onChange={(e) => setFilterCity(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700"
          >
            <option value="all">Tất cả thành phố</option>
            <option value="Hồ Chí Minh">TP. Hồ Chí Minh</option>
            <option value="Hà Nội">Hà Nội</option>
          </select>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700"
          >
            <option value="all">Tất cả loại hình</option>
            <option value="locker">Smart Locker</option>
            <option value="dorm">Ký túc xá</option>
            <option value="apartment">Chung cư</option>
            <option value="store">Cửa hàng đối tác</option>
          </select>
        </div>

        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên điểm hoặc địa chỉ..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Grid of Pickup Points */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((pt) => {
          const loadPercent = Math.min(100, Math.round((pt.currentLoad / pt.capacity) * 100));
          return (
            <div
              key={pt.id}
              className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-100 text-cyan-800">
                    {pt.type === 'locker'
                      ? 'SMART LOCKER'
                      : pt.type === 'apartment'
                      ? 'CHUNG CƯ'
                      : pt.type === 'dorm'
                      ? 'KÝ TÚC XÁ'
                      : 'ĐIỂM GOM CỘNG ĐỒNG'}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      pt.status === 'active' ? 'bg-blue-100 text-blue-800' : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {pt.status === 'active' ? 'Đang mở nhận' : 'Đã đầy'}
                  </span>
                </div>
                <h3 className="font-black text-sm text-slate-900 mb-1">{pt.name}</h3>
                <p className="text-xs text-slate-500 line-clamp-2">{pt.address}</p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                <div className="flex justify-between text-slate-600 font-medium">
                  <span>Sức chứa:</span>
                  <span className="font-bold text-slate-900">
                    {pt.currentLoad} / {pt.capacity} ngăn
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${loadPercent > 80 ? 'bg-amber-500' : 'bg-cyan-500'}`}
                    style={{ width: `${loadPercent}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-500 pt-1">
                  <span>Giờ mở cửa: {pt.operatingHours}</span>
                  <span className="font-bold text-blue-600">{pt.distance || 'Gần bạn'}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ==========================================
// 4. SUPPLIERS DIRECTORY PAGE (/suppliers)
// ==========================================
export const SuppliersDirectoryPage: React.FC<{ suppliers: Supplier[] }> = ({ suppliers }) => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>QUAY LẠI TRANG CHỦ</span>
        </Link>
        <Link
          to="/seller-policy"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
        >
          <span>CHÍNH SÁCH NHÀ CUNG CẤP</span>
        </Link>
      </div>

      <div
        style={{
          background: 'linear-gradient(135deg, #0B1020 0%, #1E3A8A 45%, #4F46E5 75%, #06B6D4 100%)',
        }}
        className="rounded-3xl text-white p-8 sm:p-10 shadow-xl border border-white/10"
      >
        <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold text-cyan-300 border border-white/20 mb-3 uppercase tracking-wider">
          <Building2 className="w-4 h-4 text-cyan-300" />
          <span>ĐỐI TÁC CUNG ỨNG XÁC MINH</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white mb-2">
          DANH BẠ NHÀ CUNG CẤP & ĐỐI TÁC SẢN XUẤT
        </h1>
        <p className="text-xs sm:text-sm text-slate-200 max-w-2xl leading-relaxed">
          Các nhà cung ứng nông sản, thực phẩm và đồ gia dụng đã qua thẩm định hồ sơ đăng ký kinh doanh và cam kết chất lượng theo Nghị định 111/2021/NĐ-CP.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {suppliers.map((s) => (
          <div
            key={s.id}
            className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
                  {s.verificationStatus === 'verified' || s.verificationStatus === 'business_verified'
                    ? '✓ ĐÃ XÁC MINH PHÁP LÝ'
                    : 'ĐANG DUYỆT HỒ SƠ'}
                </span>
                <span className="text-xs font-bold text-amber-600 flex items-center gap-1">
                  ★ {s.rating.toFixed(1)}
                </span>
              </div>
              <h3 className="font-black text-base text-slate-900 mb-1">{s.businessName}</h3>
              <p className="text-xs text-slate-500 font-medium mb-2">{s.legalName || 'Doanh nghiệp thương mại'}</p>
              <p className="text-xs text-slate-600 line-clamp-2 font-normal">{s.sourceDescription}</p>
            </div>

            <div className="pt-3 border-t border-slate-100 text-xs space-y-1.5 text-slate-500">
              <div className="flex justify-between">
                <span>Mã số thuế / ĐKKD:</span>
                <span className="font-bold text-slate-800">{s.taxCode || 'Đã kiểm tra'}</span>
              </div>
              <div className="flex justify-between">
                <span>Khu vực hoạt động:</span>
                <span className="font-bold text-slate-800">{s.location || 'TP.HCM'}</span>
              </div>
              <div className="flex justify-between">
                <span>Số đánh giá:</span>
                <span className="font-bold text-slate-800">{s.totalReviews} lượt</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// 5. HELP CENTER PAGE (/help)
// ==========================================
export const HelpCenterPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>QUAY LẠI TRANG CHỦ</span>
        </Link>
      </div>

      <div
        style={{
          background: 'linear-gradient(135deg, #0B1020 0%, #1E3A8A 45%, #4F46E5 75%, #06B6D4 100%)',
        }}
        className="rounded-3xl text-white p-8 sm:p-10 shadow-xl border border-white/10 text-center"
      >
        <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold text-cyan-300 border border-white/20 mb-3 uppercase tracking-wider">
          <HelpCircle className="w-4 h-4 text-cyan-300" />
          <span>TRUNG TÂM TRỢ GIÚP & HỖ TRỢ KHÁCH HÀNG</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white mb-2">
          CHÚNG TÔI CÓ THỂ GIÚP GÌ CHO BẠN?
        </h1>
        <p className="text-xs sm:text-sm text-slate-200 max-w-xl mx-auto leading-relaxed">
          Giải đáp thắc mắc về cơ chế mua gom, thanh toán, nhận hàng tại Locker và quy trình khiếu nại bảo vệ quyền lợi người tiêu dùng.
        </p>
      </div>

      {/* Top Topics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { title: 'QUY TRÌNH MUA GOM', desc: 'Cách mở phòng, tham gia nhóm và hạ bậc giá', link: '/how-it-works' },
          { title: 'NHẬN HÀNG LOCKER', desc: 'Hướng dẫn quét mã QR và mở tủ thông minh', link: '/pickup-points' },
          { title: 'KHIẾU NẠI & HOÀN TIỀN', desc: 'Quy trình giải quyết tranh chấp trong 24h', link: '/complaints' },
        ].map((t) => (
          <Link
            key={t.title}
            to={t.link}
            className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:border-blue-500 transition-all block"
          >
            <h3 className="font-black text-xs text-slate-900 uppercase mb-1">{t.title}</h3>
            <p className="text-xs text-slate-500">{t.desc}</p>
          </Link>
        ))}
      </div>

      {/* FAQs */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-4">
        <h2 className="text-lg font-black text-slate-900 uppercase">CÂU HỎI THƯỜNG GẶP (FAQ)</h2>
        <div className="space-y-3">
          {[
            {
              q: 'Nếu phòng gom không đạt đủ số lượng khi hết giờ thì sao?',
              a: 'Hệ thống tự động hủy phòng và hoàn trả 100% tiền tạm giữ (hoặc giải phóng giao dịch) về tài khoản của bạn mà không phát sinh bất kỳ khoản phí nào.',
            },
            {
              q: 'Làm thế nào để nhận hàng tại Smart Locker?',
              a: 'Khi lô hàng giao đến điểm nhận, bạn sẽ nhận được thông báo kèm mã QR nhận hàng 6 ký tự. Đến tủ Locker đã chọn, quét mã trên màn hình và nhận hàng trong vòng 24 giờ.',
            },
            {
              q: 'Tôi có thể trả hàng nếu nông sản bị dập nát không?',
              a: 'Có. Theo chính sách hoàn tiền 24 giờ của FlashGroup, bạn chỉ cần chụp ảnh hiện trạng và gửi khiếu nại tại Trung tâm Khiếu nại để được duyệt hoàn tiền ngay.',
            },
          ].map((faq, i) => (
            <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-1">
              <h4 className="font-bold text-slate-900">{faq.q}</h4>
              <p className="text-slate-600 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 6. CONTACT PAGE (/contact)
// ==========================================
export const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState<boolean>(false);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>QUAY LẠI TRANG CHỦ</span>
        </Link>
      </div>

      <div
        style={{
          background: 'linear-gradient(135deg, #0B1020 0%, #1E3A8A 45%, #4F46E5 75%, #06B6D4 100%)',
        }}
        className="rounded-3xl text-white p-8 sm:p-10 shadow-xl border border-white/10 text-center"
      >
        <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold text-cyan-300 border border-white/20 mb-3 uppercase tracking-wider">
          <Phone className="w-4 h-4 text-cyan-300" />
          <span>LIÊN HỆ & KẾT NỐI HỢP TÁC</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white mb-2">
          LIÊN HỆ FLASHGROUP
        </h1>
        <p className="text-xs sm:text-sm text-slate-200 max-w-xl mx-auto leading-relaxed">
          Đóng góp ý kiến nghiên cứu học thuật hoặc đăng ký trở thành Nhà cung cấp / Điểm nhận hàng đối tác.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Contact Info */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-4">
          <h2 className="text-lg font-black uppercase text-slate-900">THÔNG TIN ĐIỀU PHỐI</h2>
          <div className="space-y-3 text-xs text-slate-600">
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <strong>Trụ sở nghiên cứu đồ án:</strong>
                <p className="text-slate-800 font-semibold">Trường Đại học Tôn Đức Thắng</p>
                <p>19 Nguyễn Hữu Thọ, phường Tân Hưng, TP. Hồ Chí Minh</p>
                <p className="text-[11px] text-slate-500 italic">(trước đây thuộc phường Tân Phong, Quận 7)</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-blue-600 shrink-0" />
              <div>
                <strong>Hotline điều phối (Demo):</strong> 0906025608 (08:00 – 21:00)
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-blue-600 shrink-0" />
              <div>
                <strong>Email hỗ trợ học thuật:</strong> contact@flashgroup.edu.vn
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4 text-blue-600 shrink-0" />
              <div>
                <strong>Thời gian tiếp nhận khiếu nại:</strong> 24/7 qua cổng trực tuyến
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-4">
          <h2 className="text-lg font-black uppercase text-slate-900">GỬI TIN NHẮN TRỰC TUYẾN</h2>
          {submitted ? (
            <div className="p-4 bg-blue-50 text-blue-800 rounded-2xl text-xs font-bold text-center space-y-1 border border-blue-200">
              <CheckCircle2 className="w-6 h-6 text-blue-600 mx-auto" />
              <p>Đã gửi tin nhắn thành công! Đội ngũ dự án sẽ phản hồi qua email của bạn.</p>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitted(true);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="font-bold text-slate-700 block mb-1">Họ tên của bạn</label>
                <input
                  required
                  type="text"
                  placeholder="Nguyễn Văn A"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Email liên hệ</label>
                <input
                  required
                  type="email"
                  placeholder="name@example.com"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nội dung liên hệ</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Góp ý hoặc yêu cầu hỗ trợ..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xs rounded-xl transition shadow-md cursor-pointer"
              >
                GỬI TIN NHẮN
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
