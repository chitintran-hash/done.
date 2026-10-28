import React, { useState, useEffect, useMemo } from 'react';
import type { LegalDocument, LegalDocumentSlug, Voucher } from '../types';
import { formatVND } from '../utils/pricing';
import {
  X,
  FileText,
  Calendar,
  ShieldCheck,
  Ticket,
  Gift,
  Scale,
  Search,
  AlertTriangle,
  Info,
  CheckCircle2,
} from 'lucide-react';

interface LegalCenterModalProps {
  isOpen: boolean;
  initialSlug: LegalDocumentSlug;
  documents: LegalDocument[];
  vouchers: Voucher[];
  onClose: () => void;
}

export const LegalCenterModal: React.FC<LegalCenterModalProps> = ({
  isOpen,
  initialSlug,
  documents,
  vouchers,
  onClose,
}) => {
  const [activeSlug, setActiveSlug] = useState<LegalDocumentSlug>(initialSlug);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setActiveSlug(initialSlug);
    }
  }, [isOpen, initialSlug]);

  if (!isOpen) return null;

  const filteredDocs = useMemo(() => {
    if (!searchQuery.trim()) return documents;
    const q = searchQuery.toLowerCase();
    return documents.filter(
      (d) =>
        d.title.toLowerCase().includes(q) ||
        d.summary.toLowerCase().includes(q) ||
        d.slug.toLowerCase().includes(q)
    );
  }, [documents, searchQuery]);

  const activeDoc =
    documents.find((d) => d.slug === activeSlug) ||
    documents[0];

  // Helper to split document content into structured numbered cards
  const parsedSections = useMemo(() => {
    if (!activeDoc || !activeDoc.content) return [];
    const lines = activeDoc.content.split('\n').filter((l) => l.trim().length > 0);
    const sections: { title?: string; body: string }[] = [];
    let currentSection: { title?: string; body: string } | null = null;

    lines.forEach((line) => {
      const match = line.match(/^(\d+\.\s*[^:]+)(?::\s*(.*))?$/);
      if (match) {
        if (currentSection) sections.push(currentSection);
        currentSection = {
          title: match[1].trim(),
          body: match[2] ? match[2].trim() : '',
        };
      } else {
        if (currentSection) {
          currentSection.body += (currentSection.body ? '\n' : '') + line;
        } else {
          currentSection = { body: line };
        }
      }
    });

    if (currentSection) sections.push(currentSection);
    return sections;
  }, [activeDoc]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[92vh] flex flex-col border border-light-border shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-brand-dark text-white flex items-center justify-between shrink-0 border-b border-slate-800">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md">
              <Scale className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 block">
                TRUNG TÂM PHÁP LÝ & QUY CHẾ HOẠT ĐỘNG
              </span>
              <h3 className="text-base sm:text-lg font-black text-white uppercase tracking-tight">
                VĂN BẢN QUY CHẾ, CHÍNH SÁCH & MINH BẠCH KHUYẾN MẠI
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-cream-bg">
          {/* Sidebar Document Selector */}
          <div className="lg:w-80 bg-white border-b lg:border-b-0 lg:border-r border-light-border p-3.5 flex flex-col shrink-0">
            <div className="relative mb-3">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm văn bản..."
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
              />
            </div>

            <div className="overflow-y-auto space-y-1.5 pr-1 flex-1 scrollbar-none">
              {filteredDocs.map((doc) => {
                const isSelected = doc.slug === activeSlug;
                return (
                  <button
                    key={doc.slug}
                    type="button"
                    onClick={() => setActiveSlug(doc.slug)}
                    className={`w-full text-left p-3 rounded-2xl transition cursor-pointer flex items-start gap-2.5 ${
                      isSelected
                        ? 'bg-deep-blue text-white shadow-sm'
                        : 'bg-white hover:bg-slate-100/80 text-neutral-text border border-slate-200/60'
                    }`}
                  >
                    <FileText
                      className={`w-4 h-4 shrink-0 mt-0.5 ${
                        isSelected ? 'text-emerald-300' : 'text-slate-400'
                      }`}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="font-extrabold text-xs leading-snug truncate">
                        {doc.title}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded ${
                            isSelected
                              ? 'bg-emerald-500/30 text-emerald-200'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {doc.version}
                        </span>
                        <span
                          className={`text-[10px] ${
                            isSelected ? 'text-slate-300' : 'text-slate-400'
                          }`}
                        >
                          {doc.effectiveDate}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 p-6 sm:p-8 overflow-y-auto space-y-6">
            {activeDoc && (
              <>
                {/* Header Banner */}
                <div className="bg-white rounded-3xl p-6 border border-light-border shadow-xs space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                      HỒ SƠ PHÁP LÝ CHÍNH THỨC
                    </span>
                    <div className="flex flex-wrap items-center gap-2 text-[11px]">
                      <span className="px-2.5 py-1 rounded-xl bg-deep-blue text-white font-mono font-black shadow-2xs">
                        Phiên bản: {activeDoc.version}
                      </span>
                      <span className="px-2.5 py-1 rounded-xl bg-slate-100 text-slate-700 font-bold border border-slate-200 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        Hiệu lực: {activeDoc.effectiveDate}
                      </span>
                      <span className="px-2.5 py-1 rounded-xl bg-slate-100 text-slate-700 font-bold border border-slate-200">
                        Cập nhật: {activeDoc.lastUpdated}
                      </span>
                    </div>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-black text-brand-dark uppercase tracking-tight">
                    {activeDoc.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-neutral-text font-normal leading-relaxed border-t border-slate-100 pt-3">
                    {activeDoc.summary}
                  </p>
                </div>

                {/* Structured Section Cards */}
                <div className="space-y-4">
                  {parsedSections.map((sec, idx) => (
                    <div
                      key={idx}
                      className="bg-white rounded-2xl p-5 border border-light-border shadow-xs hover:border-slate-300 transition-colors"
                    >
                      {sec.title && (
                        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-100">
                          <span className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-700 font-black text-xs flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <h4 className="font-extrabold text-brand-dark text-xs sm:text-sm uppercase tracking-wide">
                            {sec.title}
                          </h4>
                        </div>
                      )}
                      <p className="text-xs sm:text-sm text-neutral-text leading-relaxed font-normal whitespace-pre-line">
                        {sec.body}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Promotion Voucher Transparency Table */}
                {activeDoc.slug === 'promotion_voucher_terms' && (
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center space-x-2">
                      <Ticket className="w-4 h-4 text-emerald-600" />
                      <h4 className="text-sm font-black text-brand-dark uppercase tracking-tight">
                        DANH MỤC KHUYẾN MẠI & VOUCHER ĐANG ÁP DỤNG (NGHỊ ĐỊNH 81/2018/NĐ-CP)
                      </h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {vouchers.map((v) => (
                        <div
                          key={v.id}
                          className="rounded-2xl border border-light-border p-4 bg-white space-y-2.5 text-xs shadow-2xs"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono font-black text-sm px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-300">
                              {v.code}
                            </span>
                            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                              Tài trợ: {v.fundedBy === 'supplier' ? 'Nhà cung cấp' : 'Sàn FlashGroup'}
                            </span>
                          </div>
                          <div className="font-extrabold text-brand-dark text-sm">{v.name}</div>
                          <div className="space-y-1 text-[11px] text-neutral-text">
                            <div>
                              <strong>Đơn vị tổ chức:</strong>{' '}
                              {v.organizer || 'FlashGroup Academic Prototype Marketplace'}
                            </div>
                            <div>
                              <strong>Mức giảm:</strong>{' '}
                              {v.type === 'fixed'
                                ? formatVND(v.value)
                                : `${Math.round((v.value > 1 ? v.value / 100 : v.value) * 100)}% (Tối đa ${formatVND(v.maxDiscount || 20000)})`}
                              {' • '}Trần pháp lý ≤ 50%
                            </div>
                            <div>
                              <strong>Thời gian:</strong>{' '}
                              {new Date(v.startAt).toLocaleDateString('vi-VN')} –{' '}
                              {new Date(v.endAt).toLocaleDateString('vi-VN')}
                            </div>
                            <div>
                              <strong>Giới hạn:</strong> Tổng {v.usageLimit ?? 500} lượt • Đơn tối thiểu{' '}
                              {formatVND(v.minimumOrder || 0)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Referral Terms Card */}
                {activeDoc.slug === 'referral_program_terms' && (
                  <div className="bg-warm-beige rounded-2xl p-5 border border-amber-200/80 space-y-2.5 text-xs">
                    <div className="flex items-center space-x-2 text-amber-900 font-black">
                      <Gift className="w-4 h-4 text-amber-600" />
                      <span className="uppercase tracking-wide">
                        TÓM TẮT ĐIỀU KIỆN CHƯƠNG TRÌNH GIỚI THIỆU & FLASHPOINTS
                      </span>
                    </div>
                    <ul className="list-disc pl-5 space-y-1.5 text-amber-900">
                      <li>
                        <strong>Điều kiện hợp lệ:</strong> Tài khoản Buyer đang hoạt động chia sẻ link phòng gom có mã giới thiệu (`?ref=userId`).
                      </li>
                      <li>
                        <strong>Mức thưởng:</strong> +20 FlashPoints (Điểm thưởng demo) cho mỗi lượt giới thiệu hoàn tất.
                      </li>
                      <li>
                        <strong>Quy tắc chống gian lận:</strong> Chặn tự giới thiệu bản thân (No self-referral), không cộng điểm trùng lặp.
                      </li>
                      <li>
                        <strong>Ranh giới FlashPoints:</strong> FlashPoints chỉ là <strong>Điểm thưởng demo</strong>, không phải tiền mặt, không phải số dư ví điện tử và không hỗ trợ rút tiền.
                      </li>
                    </ul>
                  </div>
                )}

                {/* Highlight Legal Note Box */}
                <div className="bg-emerald-50/80 rounded-2xl p-4 border border-emerald-200/80 flex items-start gap-3 text-xs text-emerald-900">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    <strong>Lưu ý bảo vệ quyền lợi người tiêu dùng:</strong> Mọi quy chế và điều khoản của FlashGroup được biên soạn tuân thủ theo Luật Bảo vệ quyền lợi người tiêu dùng 2023, Nghị định 85/2021/NĐ-CP và Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-white border-t border-light-border flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-500 font-medium">
            Tài liệu số: <span className="font-mono font-bold text-slate-700">{activeDoc.slug}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-brand-dark hover:bg-slate-800 text-white font-extrabold text-xs transition cursor-pointer shadow-xs"
          >
            Đóng văn bản
          </button>
        </div>
      </div>
    </div>
  );
};
