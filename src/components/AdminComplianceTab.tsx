import React, { useState } from 'react';
import type {
  Supplier,
  SupplierVerificationStatus,
  SupplierVerificationDocument,
  Product,
  ProductReport,
  ComplaintCase,
  ComplaintMessage,
  ComplaintStatus,
  PrivacyRequest,
  AccountDeletionStage,
  Review,
  ReviewModerationReason,
  ModerationAction,
  AuditEvent,
  ComplianceChecklistItem,
  ComplianceChecklistStatus,
} from '../types';
import { isComplaintSlaRisk } from '../utils/pricing';
import {
  ShieldCheck,
  Building2,
  FileText,
  AlertTriangle,
  ShieldAlert,
  Ban,
  Lock,
  MessageSquare,
  CheckCircle2,
  Clock,
  EyeOff,
  RotateCcw,
  ClipboardCheck,
  History,
  Star,
} from 'lucide-react';

interface AdminComplianceTabProps {
  suppliers: Supplier[];
  verificationDocuments: SupplierVerificationDocument[];
  products: Product[];
  productReports: ProductReport[];
  complaints: ComplaintCase[];
  complaintMessages: ComplaintMessage[];
  privacyRequests: PrivacyRequest[];
  reviews: Review[];
  moderationActions: ModerationAction[];
  auditEvents: AuditEvent[];
  complianceChecklist: ComplianceChecklistItem[];
  onUpdateSupplierVerification: (
    supplierId: string,
    status: SupplierVerificationStatus,
    reason?: string
  ) => void;
  onReviewDocument: (
    docId: string,
    status: 'approved' | 'rejected',
    note: string
  ) => void;
  onModerateProduct: (
    productId: string,
    action: 'temporarily_hide' | 'request_supplier_evidence' | 'reinstate' | 'permanently_deactivate',
    reason: string
  ) => void;
  onResolveProductReport: (
    reportId: string,
    status: ProductReport['status'],
    note: string
  ) => void;
  onAdminUpdateComplaint: (
    complaintId: string,
    status: ComplaintStatus,
    message?: string,
    resolution?: string
  ) => void;
  onAdminUpdatePrivacyRequest: (
    requestId: string,
    status: PrivacyRequest['status'],
    deletionStage?: AccountDeletionStage,
    adminNote?: string
  ) => void;
  onModerateReview: (
    reviewId: string,
    isModerated: boolean,
    reason?: ReviewModerationReason
  ) => void;
  onUpdateChecklistItem: (
    itemId: string,
    status: ComplianceChecklistStatus,
    internalNote: string
  ) => void;
}

const MODERATION_REASONS: { value: ReviewModerationReason; label: string }[] = [
  { value: 'illegal_content', label: 'Nội dung vi phạm pháp luật (illegal_content)' },
  { value: 'harassment', label: 'Quấy rối / xúc phạm danh dự (harassment)' },
  { value: 'spam', label: 'Quảng cáo rác / spam lặp lại (spam)' },
  { value: 'personal_data_exposure', label: 'Làm lộ dữ liệu cá nhân (personal_data_exposure)' },
  { value: 'unrelated_content', label: 'Nội dung hoàn toàn không liên quan (unrelated_content)' },
  { value: 'prohibited_content', label: 'Ngôn từ / hàng hóa bị cấm (prohibited_content)' },
];

export const AdminComplianceTab: React.FC<AdminComplianceTabProps> = ({
  suppliers,
  verificationDocuments,
  products,
  productReports,
  complaints,
  complaintMessages,
  privacyRequests,
  reviews,
  moderationActions,
  auditEvents,
  complianceChecklist,
  onUpdateSupplierVerification,
  onReviewDocument,
  onModerateProduct,
  onResolveProductReport,
  onAdminUpdateComplaint,
  onAdminUpdatePrivacyRequest,
  onModerateReview,
  onUpdateChecklistItem,
}) => {
  const [subTab, setSubTab] = useState<
    | 'suppliers_docs'
    | 'products_safety'
    | 'complaints_sla'
    | 'privacy_deletion'
    | 'reviews_moderation'
    | 'audit_checklist'
  >('suppliers_docs');

  // Local inputs for actions requiring mandatory reason
  const [supplierReasonMap, setSupplierReasonMap] = useState<Record<string, string>>({});
  const [docNoteMap, setDocNoteMap] = useState<Record<string, string>>({});
  const [productReasonMap, setProductReasonMap] = useState<Record<string, string>>({});
  const [complaintNoteMap, setComplaintNoteMap] = useState<Record<string, string>>({});
  const [privacyNoteMap, setPrivacyNoteMap] = useState<Record<string, string>>({});
  const [reviewReasonMap, setReviewReasonMap] = useState<Record<string, ReviewModerationReason>>({});
  const [checklistNoteMap, setChecklistNoteMap] = useState<Record<string, string>>({});

  // 8 Summary KPI Counts (Req 29)
  const pendingSuppliersCount = suppliers.filter(
    (s) => s.verificationStatus === 'pending' || s.verificationStatus === 'unverified'
  ).length;
  const pendingDocsCount = verificationDocuments.filter((d) => d.status === 'pending').length;
  const openComplaintsCount = complaints.filter(
    (c) => c.status !== 'resolved' && c.status !== 'rejected'
  ).length;
  const slaRiskComplaintsCount = complaints.filter((c) => isComplaintSlaRisk(c)).length;
  const openProductReportsCount = productReports.filter(
    (r) => r.status === 'open' || r.status === 'investigating'
  ).length;
  const suspendedProductsCount = products.filter(
    (p) =>
      p.status === 'temporarily_hidden' ||
      p.status === 'evidence_requested' ||
      p.status === 'permanently_deactivated'
  ).length;
  const pendingPrivacyCount = privacyRequests.filter(
    (r) => r.status === 'submitted' || r.status === 'in_review'
  ).length;
  const moderatedReviewsCount = reviews.filter((r) => r.isModerated).length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 block">
            QUẢN TRỊ TUÂN THỦ PHÁP LÝ, BẢO VỆ NGƯỜI TIÊU DÙNG & DỮ LIỆU CÁ NHÂN (PHASE 8)
          </span>
          <h3 className="text-xl font-black mt-0.5">
            Admin Compliance & Legal Governance Center
          </h3>
          <p className="text-xs text-slate-300 mt-1">
            Kiểm duyệt nhà cung cấp 7 trạng thái, chứng từ ngành hàng, khiếu nại SLA 3 ngày làm việc, báo cáo an toàn sản phẩm, yêu cầu quyền riêng tư (NĐ 13/2023) và nhật ký kiểm toán bất biến.
          </p>
        </div>
        <div className="px-3.5 py-2 rounded-2xl bg-amber-500/10 border border-amber-400/30 text-amber-300 text-xs font-bold shrink-0">
          Nguyên mẫu học thuật • Không tuyên bố chứng nhận nhà nước
        </div>
      </div>

      {/* 8 Required Compliance KPI Cards (Req 29) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        <button
          type="button"
          onClick={() => setSubTab('suppliers_docs')}
          className="bg-white p-3.5 rounded-2xl border border-slate-200 text-left hover:border-amber-400 transition shadow-sm"
        >
          <span className="text-[10px] font-bold uppercase text-slate-400 block">
            Pending Supplier Verification
          </span>
          <span className="text-2xl font-black text-amber-600 mt-1 block">
            {pendingSuppliersCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setSubTab('suppliers_docs')}
          className="bg-white p-3.5 rounded-2xl border border-slate-200 text-left hover:border-emerald-400 transition shadow-sm"
        >
          <span className="text-[10px] font-bold uppercase text-slate-400 block">
            Pending Product Documents
          </span>
          <span className="text-2xl font-black text-[#000181] mt-1 block">
            {pendingDocsCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setSubTab('complaints_sla')}
          className="bg-white p-3.5 rounded-2xl border border-slate-200 text-left hover:border-blue-400 transition shadow-sm"
        >
          <span className="text-[10px] font-bold uppercase text-slate-400 block">
            Open Complaints
          </span>
          <span className="text-2xl font-black text-blue-600 mt-1 block">
            {openComplaintsCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setSubTab('complaints_sla')}
          className="bg-white p-3.5 rounded-2xl border border-rose-200 bg-rose-50/40 text-left hover:border-rose-400 transition shadow-sm"
        >
          <span className="text-[10px] font-bold uppercase text-rose-700 block">
            Complaint SLA Risks
          </span>
          <span className="text-2xl font-black text-rose-600 mt-1 block">
            {slaRiskComplaintsCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setSubTab('products_safety')}
          className="bg-white p-3.5 rounded-2xl border border-slate-200 text-left hover:border-rose-400 transition shadow-sm"
        >
          <span className="text-[10px] font-bold uppercase text-slate-400 block">
            Product Safety Reports
          </span>
          <span className="text-2xl font-black text-rose-600 mt-1 block">
            {openProductReportsCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setSubTab('products_safety')}
          className="bg-white p-3.5 rounded-2xl border border-slate-200 text-left hover:border-slate-400 transition shadow-sm"
        >
          <span className="text-[10px] font-bold uppercase text-slate-400 block">
            Suspended Products
          </span>
          <span className="text-2xl font-black text-slate-800 mt-1 block">
            {suspendedProductsCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setSubTab('privacy_deletion')}
          className="bg-white p-3.5 rounded-2xl border border-slate-200 text-left hover:border-indigo-400 transition shadow-sm"
        >
          <span className="text-[10px] font-bold uppercase text-slate-400 block">
            Privacy Requests
          </span>
          <span className="text-2xl font-black text-[#006EE9] mt-1 block">
            {pendingPrivacyCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setSubTab('reviews_moderation')}
          className="bg-white p-3.5 rounded-2xl border border-slate-200 text-left hover:border-purple-400 transition shadow-sm"
        >
          <span className="text-[10px] font-bold uppercase text-slate-400 block">
            Moderated Reviews
          </span>
          <span className="text-2xl font-black text-[#000181] mt-1 block">
            {moderatedReviewsCount}
          </span>
        </button>
      </div>

      {/* Sub-navigation pills */}
      <div className="flex flex-wrap gap-2 bg-white p-2 rounded-2xl border border-slate-200">
        {[
          {
            id: 'suppliers_docs',
            label: '1. Xác minh NCC & Chứng từ ngành hàng',
            icon: <Building2 className="w-3.5 h-3.5" />,
          },
          {
            id: 'products_safety',
            label: '2. Báo cáo An toàn & Đình chỉ SP',
            icon: <ShieldAlert className="w-3.5 h-3.5" />,
          },
          {
            id: 'complaints_sla',
            label: '3. Khiếu nại & SLA 3 ngày làm việc',
            icon: <MessageSquare className="w-3.5 h-3.5" />,
          },
          {
            id: 'privacy_deletion',
            label: '4. Quyền riêng tư & Xóa tài khoản',
            icon: <Lock className="w-3.5 h-3.5" />,
          },
          {
            id: 'reviews_moderation',
            label: '5. Kiểm duyệt Đánh giá (Review Integrity)',
            icon: <Star className="w-3.5 h-3.5" />,
          },
          {
            id: 'audit_checklist',
            label: '6. Audit Log Bất biến & Checklist Pháp lý',
            icon: <ClipboardCheck className="w-3.5 h-3.5" />,
          },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setSubTab(t.id as any)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              subTab === t.id
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {t.icon}
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* SUB-TAB 1: SUPPLIER VERIFICATION (7 STATES) & CATEGORY COMPLIANCE DOCUMENTS */}
      {subTab === 'suppliers_docs' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4">
            <h4 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-amber-600" />
              <span>Quản lý Xác minh Nhà cung cấp (7 trạng thái) & Đình chỉ hoạt động (Req 1 & 28)</span>
            </h4>
            <div className="space-y-3">
              {suppliers.map((sup) => (
                <div
                  key={sup.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col lg:flex-row lg:items-center justify-between gap-4 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-black text-slate-900 text-sm">{sup.businessName}</span>
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                        {sup.isDemo ? 'Dữ liệu mô phỏng' : 'Tài khoản thực'}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-900 text-white text-[10px] font-mono font-bold">
                        Trạng thái: {sup.verificationStatus}
                      </span>
                    </div>
                    <div className="text-slate-600">
                      Pháp nhân: <strong>{sup.legalName || sup.businessName}</strong> • ĐKKD:{' '}
                      <code>{sup.businessRegistrationNumber || sup.businessRegistration || 'N/A'}</code>{' '}
                      • MST: <code>{sup.taxCode || 'N/A'}</code> • Đại diện:{' '}
                      {sup.legalRepresentative || 'N/A'}
                    </div>
                    {sup.suspensionReason && (
                      <div className="text-rose-700 font-semibold">
                        Lý do tạm ngưng/từ chối: {sup.suspensionReason}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      type="text"
                      value={supplierReasonMap[sup.id] || ''}
                      onChange={(e) =>
                        setSupplierReasonMap((prev) => ({ ...prev, [sup.id]: e.target.value }))
                      }
                      placeholder="Ghi chú/Lý do đình chỉ (verification failed, document issue...)"
                      className="p-2 rounded-xl border border-slate-300 bg-white text-xs w-64"
                    />
                    <select
                      value={sup.verificationStatus}
                      onChange={(e) =>
                        onUpdateSupplierVerification(
                          sup.id,
                          e.target.value as SupplierVerificationStatus,
                          supplierReasonMap[sup.id] || 'Cập nhật trạng thái xác minh bởi Admin'
                        )
                      }
                      className="p-2 rounded-xl border border-slate-300 bg-white font-bold text-slate-800 text-xs"
                    >
                      <option value="unverified">unverified (Chưa xác minh)</option>
                      <option value="pending">pending (Chờ duyệt)</option>
                      <option value="identity_verified">
                        identity_verified (Đã xác minh danh tính)
                      </option>
                      <option value="business_verified">
                        business_verified (Đã xác minh ĐKKD/MST)
                      </option>
                      <option value="document_verified">
                        document_verified (Đã xác minh chứng từ ngành hàng)
                      </option>
                      <option value="rejected">rejected (Từ chối xác minh)</option>
                      <option value="suspended">suspended (Đình chỉ hoạt động)</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Category Compliance Documents Review (Req 4 & 35) */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-base font-black text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#000181]" />
                <span>Kiểm duyệt Chứng từ Tuân thủ theo Danh mục ({verificationDocuments.length})</span>
              </h4>
              <span className="text-[11px] text-slate-500">
                🔒 Bảo mật RLS: Chỉ Nhà cung cấp sở hữu & Admin được phép truy cập
              </span>
            </div>

            <div className="space-y-3">
              {verificationDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{doc.documentTitle}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          doc.status === 'approved'
                            ? 'bg-[#D0FFA4]/40 text-emerald-800'
                            : doc.status === 'rejected'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {doc.status}
                      </span>
                    </div>
                    <div className="text-slate-600">
                      Loại: <code>{doc.documentType}</code> • Số hiệu:{' '}
                      <strong>{doc.documentNumber || 'N/A'}</strong> • Danh mục:{' '}
                      {doc.category || 'Chung'} • Tệp:{' '}
                      <code>{doc.fileMetadata?.fileName || 'metadata.pdf'}</code>
                    </div>
                    {doc.reviewNote && (
                      <div className="text-[#000181] font-medium">
                        Nhận xét của Admin: {doc.reviewNote}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <input
                      type="text"
                      value={docNoteMap[doc.id] || ''}
                      onChange={(e) =>
                        setDocNoteMap((prev) => ({ ...prev, [doc.id]: e.target.value }))
                      }
                      placeholder="Ghi chú thẩm định..."
                      className="p-2 rounded-xl border border-slate-300 bg-white text-xs w-48"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        onReviewDocument(
                          doc.id,
                          'approved',
                          docNoteMap[doc.id] || 'Chứng từ hợp lệ theo danh mục sản phẩm.'
                        )
                      }
                      className="px-3 py-1.5 rounded-xl bg-[#006EE9] hover:bg-[#000181] text-white text-white font-bold"
                    >
                      Duyệt
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        onReviewDocument(
                          doc.id,
                          'rejected',
                          docNoteMap[doc.id] || 'Chứng từ chưa đầy đủ hoặc sai định dạng.'
                        )
                      }
                      className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold"
                    >
                      Từ chối
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: PRODUCT SAFETY REPORTS & PRODUCT SUSPENSION (Req 26 & 27) */}
      {subTab === 'products_safety' && (
        <div className="space-y-6">
          {/* Product Safety Reports from Buyers */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4">
            <h4 className="text-base font-black text-slate-900 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-600" />
              <span>Báo cáo An toàn Sản phẩm từ Người mua ({productReports.length})</span>
            </h4>
            <div className="space-y-3">
              {productReports.map((rep) => (
                <div
                  key={rep.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{rep.productName}</span>
                      <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-black">
                        {rep.reason}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold uppercase">
                        {rep.status}
                      </span>
                    </div>
                    <p className="text-slate-700">{rep.description}</p>
                    <div className="text-[10px] text-slate-400">
                      Người báo cáo: {rep.reporterUserId} •{' '}
                      {new Date(rep.createdAt).toLocaleString('vi-VN')}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() =>
                        onResolveProductReport(
                          rep.id,
                          'investigating',
                          'Đang yêu cầu Nhà cung cấp bổ sung thông tin nhãn/cảnh báo.'
                        )
                      }
                      className="px-3 py-1.5 rounded-xl bg-amber-500 text-white font-bold"
                    >
                      Xác minh
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        onResolveProductReport(
                          rep.id,
                          'action_taken',
                          'Đã xử lý cảnh báo và cập nhật trạng thái sản phẩm.'
                        )
                      }
                      className="px-3 py-1.5 rounded-xl bg-[#006EE9] text-white font-bold"
                    >
                      Hoàn tất xử lý
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Product Suspension Controls (Req 27) */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4">
            <h4 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Ban className="w-5 h-5 text-slate-800" />
              <span>Kiểm soát Trạng thái & Đình chỉ Sản phẩm (Không xóa cứng dữ liệu – Req 27)</span>
            </h4>
            <div className="space-y-3">
              {products.map((prod) => (
                <div
                  key={prod.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col lg:flex-row lg:items-center justify-between gap-4 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{prod.name}</span>
                      <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-800 font-mono text-[10px] font-bold">
                        {prod.status}
                      </span>
                    </div>
                    <div className="text-slate-500">
                      Xuất xứ: {prod.origin || 'Chưa có'} • Đơn vị chịu trách nhiệm:{' '}
                      {prod.organizationResponsibleName || 'Chưa có'}
                    </div>
                    {prod.suspensionReason && (
                      <div className="text-rose-600 font-semibold">
                        Lý do xử lý gần nhất: {prod.suspensionReason} ({prod.suspendedBy})
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      type="text"
                      value={productReasonMap[prod.id] || ''}
                      onChange={(e) =>
                        setProductReasonMap((prev) => ({ ...prev, [prod.id]: e.target.value }))
                      }
                      placeholder="Nhập lý do bắt buộc (Reason)..."
                      className="p-2 rounded-xl border border-slate-300 bg-white text-xs w-52"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        onModerateProduct(
                          prod.id,
                          'temporarily_hide',
                          productReasonMap[prod.id] || 'Tạm ẩn để rà soát thông tin nhãn hàng hóa'
                        )
                      }
                      className="px-2.5 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold"
                    >
                      Tạm ẩn
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        onModerateProduct(
                          prod.id,
                          'request_supplier_evidence',
                          productReasonMap[prod.id] || 'Yêu cầu bổ sung hồ sơ tự công bố/xuất xứ'
                        )
                      }
                      className="px-2.5 py-1.5 rounded-xl bg-blue-100 hover:bg-blue-200 text-blue-900 font-bold"
                    >
                      Yêu cầu chứng từ
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        onModerateProduct(
                          prod.id,
                          'reinstate',
                          productReasonMap[prod.id] || 'Đã bổ sung đầy đủ hồ sơ hợp lệ'
                        )
                      }
                      className="px-2.5 py-1.5 rounded-xl bg-[#D0FFA4]/40 hover:bg-emerald-200 text-emerald-900 font-bold"
                    >
                      Khôi phục
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        onModerateProduct(
                          prod.id,
                          'permanently_deactivate',
                          productReasonMap[prod.id] || 'Ngưng vĩnh viễn do vi phạm quy định an toàn'
                        )
                      }
                      className="px-2.5 py-1.5 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-900 font-bold"
                    >
                      Ngưng vĩnh viễn
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: COMPLAINTS & 3-WORKING-DAY SLA WORKFLOW (Req 8, 10) */}
      {subTab === 'complaints_sla' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-base font-black text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              <span>Điều phối Khiếu nại & Giám sát Hạn phản hồi 03 Ngày làm việc ({complaints.length})</span>
            </h4>
            <span className="text-[11px] text-slate-500">
              🔒 Không cho phép xóa lịch sử khiếu nại (Req 10)
            </span>
          </div>

          <div className="space-y-4">
            {complaints.map((c) => {
              const slaRisk = isComplaintSlaRisk(c);
              const caseMsgs = complaintMessages.filter((m) => m.complaintId === c.id);

              return (
                <div
                  key={c.id}
                  className={`p-4 rounded-2xl border space-y-3 text-xs ${
                    slaRisk ? 'bg-rose-50/40 border-rose-300' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-sm text-slate-900">{c.id}</span>
                      <span className="font-bold text-slate-800">{c.complaintType}</span>
                      {slaRisk && (
                        <span className="px-2 py-0.5 rounded bg-rose-600 text-white text-[10px] font-black flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Rủi ro SLA 3 ngày làm việc
                        </span>
                      )}
                    </div>
                    <span className="font-mono text-[11px] text-slate-600">
                      Gửi: {new Date(c.submittedAt).toLocaleString('vi-VN')} • Hạn tiếp nhận:{' '}
                      <strong className="text-amber-800">
                        {new Date(c.acknowledgementDeadline).toLocaleString('vi-VN')}
                      </strong>
                    </span>
                  </div>

                  <p className="text-slate-700">{c.description}</p>

                  {c.evidenceMetadata.length > 0 && (
                    <div className="text-[11px] text-slate-500">
                      Bằng chứng riêng tư ({c.evidenceMetadata.length}):{' '}
                      {c.evidenceMetadata.map((ev) => ev.fileName).join(', ')}
                    </div>
                  )}

                  {caseMsgs.length > 0 && (
                    <div className="bg-white rounded-xl p-3 border border-slate-200 space-y-1">
                      {caseMsgs.slice(-2).map((m) => (
                        <div key={m.id} className="text-[11px] text-slate-600">
                          <strong>{m.senderName}:</strong> {m.message}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <input
                      type="text"
                      value={complaintNoteMap[c.id] || ''}
                      onChange={(e) =>
                        setComplaintNoteMap((prev) => ({ ...prev, [c.id]: e.target.value }))
                      }
                      placeholder="Nhập phản hồi hoặc kết luận giải quyết..."
                      className="flex-1 min-w-[220px] p-2 rounded-xl border border-slate-300 bg-white"
                    />
                    <select
                      value={c.status}
                      onChange={(e) =>
                        onAdminUpdateComplaint(
                          c.id,
                          e.target.value as ComplaintStatus,
                          complaintNoteMap[c.id] || undefined,
                          e.target.value === 'resolved'
                            ? complaintNoteMap[c.id] || 'Đã giải quyết thỏa đáng cho Người mua'
                            : undefined
                        )
                      }
                      className="p-2 rounded-xl border border-slate-300 bg-white font-bold"
                    >
                      <option value="submitted">submitted</option>
                      <option value="acknowledged">acknowledged (Tiếp nhận)</option>
                      <option value="investigating">investigating (Đang xác minh)</option>
                      <option value="awaiting_buyer">awaiting_buyer</option>
                      <option value="awaiting_supplier">awaiting_supplier</option>
                      <option value="resolved">resolved (Đã giải quyết)</option>
                      <option value="rejected">rejected</option>
                      <option value="escalated">escalated</option>
                    </select>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-TAB 4: PRIVACY REQUESTS & ACCOUNT DELETION 5-STAGE WORKFLOW (Req 14, 18) */}
      {subTab === 'privacy_deletion' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4">
          <h4 className="text-base font-black text-slate-900 flex items-center gap-2">
            <Lock className="w-5 h-5 text-[#006EE9]" />
            <span>Xử lý Yêu cầu Quyền riêng tư & Quy trình Xóa tài khoản Bảo lưu Chứng từ ({privacyRequests.length})</span>
          </h4>
          <div className="space-y-3">
            {privacyRequests.map((req) => (
              <div
                key={req.id}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col lg:flex-row lg:items-center justify-between gap-4 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">
                      {req.userName || req.userId} — Loại: {req.requestType.toUpperCase()}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-[#FAF0FF] text-indigo-800 font-bold text-[10px]">
                      Status: {req.status}
                    </span>
                    {req.deletionStage && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-mono text-[10px]">
                        Deletion stage: {req.deletionStage}
                      </span>
                    )}
                  </div>
                  <p className="text-slate-600">{req.details}</p>
                  {req.retainedCategoriesExplanation && (
                    <p className="text-[11px] text-indigo-800">
                      <strong>Bảo lưu:</strong> {req.retainedCategoriesExplanation}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <input
                    type="text"
                    value={privacyNoteMap[req.id] || ''}
                    onChange={(e) =>
                      setPrivacyNoteMap((prev) => ({ ...prev, [req.id]: e.target.value }))
                    }
                    placeholder="Ghi chú phản hồi của Admin..."
                    className="p-2 rounded-xl border border-slate-300 bg-white w-52"
                  />
                  {req.requestType === 'deletion' && (
                    <select
                      value={req.deletionStage || 'requested'}
                      onChange={(e) => {
                        const stage = e.target.value as AccountDeletionStage;
                        const status =
                          stage === 'partially_retained'
                            ? 'partially_retained'
                            : stage === 'completed'
                            ? 'completed'
                            : 'in_review';
                        onAdminUpdatePrivacyRequest(
                          req.id,
                          status,
                          stage,
                          privacyNoteMap[req.id] ||
                            'Đã xóa dữ liệu tùy chọn; bảo lưu chứng từ giao dịch/đối soát theo quy định.'
                        );
                      }}
                      className="p-2 rounded-xl border border-slate-300 bg-white font-bold"
                    >
                      <option value="requested">1. requested</option>
                      <option value="identity_check">2. identity_check</option>
                      <option value="processing">3. processing</option>
                      <option value="partially_retained">
                        4. partially_retained (Bảo lưu chứng từ GD)
                      </option>
                      <option value="completed">5. completed</option>
                    </select>
                  )}
                  <button
                    type="button"
                    onClick={() =>
                      onAdminUpdatePrivacyRequest(
                        req.id,
                        req.requestType === 'deletion' ? 'partially_retained' : 'completed',
                        req.requestType === 'deletion' ? 'partially_retained' : undefined,
                        privacyNoteMap[req.id] || 'Đã xử lý yêu cầu quyền chủ thể dữ liệu.'
                      )
                    }
                    className="px-3 py-1.5 rounded-xl bg-[#006EE9] text-white font-bold"
                  >
                    Xác nhận hoàn tất
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 5: REVIEW INTEGRITY MODERATION (Req 11) */}
      {subTab === 'reviews_moderation' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900">
            <strong>Nguyên tắc Bảo toàn Tính trung thực của Đánh giá (Req 11):</strong> Nghiêm cấm ẩn đánh giá chỉ vì số sao thấp hoặc nhận xét tiêu cực về chất lượng. Chỉ được ẩn nội dung chữ khi vi phạm 1 trong 6 lý do pháp lý dưới đây và vẫn giữ nguyên điểm số đánh giá thực tế.
          </div>

          <div className="space-y-3">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col lg:flex-row lg:items-center justify-between gap-4 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-800">Đơn #{rev.orderId}</span>
                    <span className="text-amber-600 font-black">
                      ★ SP: {rev.productRating}/5 • NCC: {rev.supplierRating}/5 • Điểm nhận:{' '}
                      {rev.pickupRating}/5
                    </span>
                    {rev.isModerated && (
                      <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-black">
                        Đã ẩn nội dung ({rev.moderationReason})
                      </span>
                    )}
                  </div>
                  <p className="text-slate-700">
                    {rev.isModerated
                      ? `Nội dung đã được ẩn do vi phạm quy định (Gốc: "${rev.comment}")`
                      : rev.comment || '(Không có bình luận chữ)'}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <select
                    value={reviewReasonMap[rev.id] || 'spam'}
                    onChange={(e) =>
                      setReviewReasonMap((prev) => ({
                        ...prev,
                        [rev.id]: e.target.value as ReviewModerationReason,
                      }))
                    }
                    className="p-2 rounded-xl border border-slate-300 bg-white text-xs"
                  >
                    {MODERATION_REASONS.map((r) => (
                      <option key={r.value} value={r.value}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                  {!rev.isModerated ? (
                    <button
                      type="button"
                      onClick={() =>
                        onModerateReview(rev.id, true, reviewReasonMap[rev.id] || 'spam')
                      }
                      className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold flex items-center gap-1"
                    >
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>Ẩn nội dung vi phạm</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onModerateReview(rev.id, false)}
                      className="px-3 py-1.5 rounded-xl bg-[#006EE9] hover:bg-[#000181] text-white text-white font-bold flex items-center gap-1"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Khôi phục hiển thị</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 6: APPEND-ONLY AUDIT LOG & INTERNAL COMPLIANCE CHECKLIST (Req 7, 30, 33) */}
      {subTab === 'audit_checklist' && (
        <div className="space-y-6">
          {/* Internal Government-Registration & Legal Checklist (Req 33) */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <ClipboardCheck className="w-5 h-5 text-[#000181]" />
                  <span>Danh mục Rà soát Tuân thủ Nội bộ (Admin-Only Internal Checklist – Req 33)</span>
                </h4>
                <p className="text-xs text-slate-500">
                  Lưu ý quan trọng: Đây chỉ là danh sách kiểm tra nội bộ phục vụ đồ án học thuật. Việc đánh dấu hoàn thành (completed) KHÔNG đại diện cho việc đã được cơ quan nhà nước hoặc Bộ Công Thương cấp phép/xác nhận.
                </p>
              </div>
            </div>

            <div className="space-y-2.5">
              {complianceChecklist.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col lg:flex-row lg:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="font-bold text-slate-900">{item.title}</div>
                    <div className="text-[11px] text-[#000181] font-semibold">
                      Căn cứ tham chiếu: {item.legalBasis}
                    </div>
                    <p className="text-[11px] text-slate-600">{item.description}</p>
                    {item.internalNote && (
                      <div className="text-[11px] text-slate-500 italic">
                        Ghi chú nội bộ: {item.internalNote}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <input
                      type="text"
                      value={checklistNoteMap[item.id] ?? item.internalNote ?? ''}
                      onChange={(e) =>
                        setChecklistNoteMap((prev) => ({ ...prev, [item.id]: e.target.value }))
                      }
                      placeholder="Ghi chú rà soát nội bộ..."
                      className="p-2 rounded-xl border border-slate-300 bg-white w-52 text-xs"
                    />
                    <select
                      value={item.status}
                      onChange={(e) =>
                        onUpdateChecklistItem(
                          item.id,
                          e.target.value as ComplianceChecklistStatus,
                          checklistNoteMap[item.id] ?? item.internalNote ?? ''
                        )
                      }
                      className="p-2 rounded-xl border border-slate-300 bg-white font-bold text-xs"
                    >
                      <option value="not_reviewed">not_reviewed</option>
                      <option value="in_progress">in_progress</option>
                      <option value="completed">completed (Rà soát nội bộ)</option>
                      <option value="not_applicable">not_applicable</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Append-Only Electronic Transaction & Compliance Audit Log (Req 7 & 30) */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <History className="w-5 h-5 text-[#006EE9]" />
                  <span>Nhật ký Kiểm toán Giao dịch & Tuân thủ Bất biến (Append-Only Audit Trail – Req 7 & 30)</span>
                </h4>
                <p className="text-xs text-slate-500">
                  Chỉ cho phép ghi nối tiếp (Append-only). Giao diện Admin không có quyền chỉnh sửa hoặc xóa các sự kiện lịch sử. Không lưu mật khẩu hay thông tin bí mật.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-mono text-xs font-bold">
                {auditEvents.length} events
              </span>
            </div>

            <div className="overflow-x-auto max-h-96">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold uppercase text-slate-500">
                  <tr>
                    <th className="py-2.5 px-3">Thời gian (Timestamp)</th>
                    <th className="py-2.5 px-3">Loại sự kiện (Event Type)</th>
                    <th className="py-2.5 px-3">Tác nhân (Actor)</th>
                    <th className="py-2.5 px-3">Mã bản ghi (Record ID)</th>
                    <th className="py-2.5 px-3">Metadata an toàn</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {auditEvents.map((ev) => (
                    <tr key={ev.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500">
                        {new Date(ev.timestamp).toLocaleString('vi-VN')}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded bg-[#EFFBFF] text-indigo-800 border border-indigo-200 font-mono font-bold text-[11px]">
                          {ev.eventType}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-slate-800">
                        {ev.actorName || ev.actorId} ({ev.actorRole || 'user'})
                      </td>
                      <td className="py-2.5 px-3 font-mono text-slate-700">{ev.recordId}</td>
                      <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500">
                        {JSON.stringify(ev.safeMetadata)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
