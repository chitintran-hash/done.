import React, { useState } from 'react';
import type {
  User,
  Order,
  ConsentPurpose,
  ConsentRecord,
  PrivacyRequest,
  PrivacyRequestType,
  LegalDocumentSlug,
} from '../types';
import {
  ShieldCheck,
  Lock,
  Download,
  Trash2,
  Eye,
  RotateCcw,
  AlertCircle,
  CheckCircle2,
  Clock,
  FileText,
  Sliders,
} from 'lucide-react';

interface PrivacyCenterViewProps {
  currentUser: User;
  orders: Order[];
  consentRecords: ConsentRecord[];
  privacyRequests: PrivacyRequest[];
  onToggleOptionalConsent: (purpose: ConsentPurpose, accepted: boolean) => void;
  onWithdrawAllOptionalConsent: () => void;
  onSubmitPrivacyRequest: (
    requestType: PrivacyRequestType,
    details: string,
    retainedExplanation?: string
  ) => void;
  onOpenLegalDoc: (slug: LegalDocumentSlug) => void;
  showToast: (msg: string) => void;
}

const PURPOSE_META: {
  purpose: ConsentPurpose;
  title: string;
  description: string;
  isRequired: boolean;
  dataUsed: string;
}[] = [
  {
    purpose: 'account_required',
    title: 'Quản lý tài khoản & Định danh (account_required)',
    description: 'Xác thực đăng nhập, bảo mật phiên làm việc và định danh thành viên tham gia phòng gom.',
    isRequired: true,
    dataUsed: 'Họ tên hiển thị, Email, Vai trò tài khoản',
  },
  {
    purpose: 'order_fulfillment',
    title: 'Thực hiện hợp đồng giao dịch & Đơn hàng (order_fulfillment)',
    description: 'Chốt giá mua gom, lập bản chụp hợp đồng giao dịch (Contract Snapshot), xử lý hoàn tiền và đối soát.',
    isRequired: true,
    dataUsed: 'Mã đơn hàng, Sản phẩm, Số lượng, Giá chốt, Lịch sử thanh toán mô phỏng',
  },
  {
    purpose: 'pickup_logistics',
    title: 'Điều phối giao hàng chung & Nhận tại Locker (pickup_logistics)',
    description: 'Cấp mã nhận hàng 6 ký tự (FG-XXXX), phân bổ khung giờ nhận tại Điểm gom/Locker đã chọn.',
    isRequired: true,
    dataUsed: 'Số điện thoại nhận hàng, Điểm nhận hàng, Khung giờ nhận, Mã Pickup Code',
  },
  {
    purpose: 'marketing',
    title: 'Thông báo khuyến mại & Tiếp thị (marketing)',
    description: 'Gửi thông báo về chương trình ưu đãi, mã voucher mới hoặc chiến dịch mua gom theo mùa.',
    isRequired: false,
    dataUsed: 'Email, Tùy chọn ngành hàng yêu thích (Mặc định: TẮT)',
  },
  {
    purpose: 'personalized_recommendations',
    title: 'Gợi ý phòng gom cá nhân hóa (personalized_recommendations)',
    description: 'Ưu tiên gợi ý sản phẩm dựa trên lịch sử phòng gom bạn từng xem hoặc lưu yêu thích.',
    isRequired: false,
    dataUsed: 'Danh sách yêu thích, Lịch sử xem phòng gom (Mặc định: TẮT)',
  },
  {
    purpose: 'precise_location',
    title: 'Vị trí khoảng cách chi tiết trên FlashMap (precise_location)',
    description: 'Ước tính khoảng cách từ vị trí hiện tại tới các Điểm nhận hàng quanh khu vực.',
    isRequired: false,
    dataUsed: 'Tọa độ khu vực mô phỏng / Bán kính lọc bản đồ (Mặc định: TẮT)',
  },
  {
    purpose: 'referral_tracking',
    title: 'Theo dõi mã giới thiệu bạn bè (referral_tracking)',
    description: 'Ghi nhận lượt mời bạn bè tham gia phòng gom để tính Điểm thưởng demo (FlashPoints).',
    isRequired: false,
    dataUsed: 'Mã giới thiệu (?ref=userId), Trạng thái hoàn tất đơn giới thiệu (Mặc định: TẮT)',
  },
  {
    purpose: 'analytics_optional',
    title: 'Phân tích trải nghiệm sử dụng tùy chọn (analytics_optional)',
    description: 'Thống kê ẩn danh hiệu suất giao diện phục vụ nghiên cứu cải tiến học thuật.',
    isRequired: false,
    dataUsed: 'Sự kiện tương tác giao diện tổng hợp (Mặc định: TẮT)',
  },
];

export const PrivacyCenterView: React.FC<PrivacyCenterViewProps> = ({
  currentUser,
  orders,
  consentRecords,
  privacyRequests,
  onToggleOptionalConsent,
  onWithdrawAllOptionalConsent,
  onSubmitPrivacyRequest,
  onOpenLegalDoc,
  showToast,
}) => {
  const [selectedRequestType, setSelectedRequestType] = useState<PrivacyRequestType>('access');
  const [requestDetails, setRequestDetails] = useState<string>('');

  const myConsents = consentRecords.filter((c) => c.userId === currentUser.id);
  const myRequests = privacyRequests.filter((r) => r.userId === currentUser.id);
  const myOrders = orders.filter((o) => o.userId === currentUser.id);

  // Get latest consent status for each purpose (Optional defaults strictly to FALSE per Req 15)
  const getLatestConsentForPurpose = (purpose: ConsentPurpose, isRequired: boolean) => {
    const records = myConsents
      .filter((c) => c.purpose === purpose)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    if (records.length > 0) return records[0];
    return {
      id: `default-${purpose}`,
      userId: currentUser.id,
      purpose,
      isRequired,
      accepted: isRequired ? true : false,
      policyVersion: 'v2026.1',
      source: isRequired ? 'contract_necessity' : 'default_off',
      timestamp: currentUser.createdAt,
    };
  };

  const handleExportAccountData = () => {
    const exportPayload = {
      exportedAt: new Date().toISOString(),
      privacyPolicyVersion: 'v2026.1',
      legalNotice:
        'Bản trích xuất dữ liệu cá nhân theo Nghị định 13/2023/NĐ-CP & Luật Bảo vệ quyền lợi người tiêu dùng 2023 (FlashGroup Academic Prototype)',
      userProfile: {
        id: currentUser.id,
        name: currentUser.name,
        email: currentUser.email,
        phone: currentUser.phone || null,
        role: currentUser.role,
        preferredPickupPoint: currentUser.preferredPickupPoint || null,
        createdAt: currentUser.createdAt,
      },
      consentRecords: myConsents,
      ordersSummary: myOrders.map((o) => ({
        id: o.id,
        productName: o.productName,
        quantity: o.quantity,
        totalAmount: o.totalAmount,
        status: o.status,
        pickupPoint: o.pickupPointName || o.pickupPoint,
        createdAt: o.createdAt,
      })),
      privacyRequestsHistory: myRequests,
    };

    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], {
      type: 'application/json;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FlashGroup_DuLieuCaNhan_${currentUser.id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    onSubmitPrivacyRequest(
      'export',
      'Trích xuất toàn bộ dữ liệu tài khoản, lịch sử đồng ý (consent) và danh sách đơn hàng sang định dạng JSON.'
    );
    showToast('Đã tải xuống bản trích xuất dữ liệu cá nhân (.JSON)!');
  };

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const defaultNoteMap: Record<PrivacyRequestType, string> = {
      access: 'Yêu cầu cung cấp bản sao danh mục dữ liệu cá nhân và mục đích xử lý hiện hành.',
      withdraw_consent: 'Yêu cầu rút lại sự đồng ý đối với các mục đích xử lý dữ liệu tùy chọn.',
      deletion:
        'Yêu cầu xóa dữ liệu tài khoản cá nhân (hiểu rõ các chứng từ giao dịch/đối soát bắt buộc phải bảo lưu theo quy định).',
      restriction: 'Yêu cầu hạn chế xử lý dữ liệu cá nhân đối với các tác vụ không thiết yếu.',
      objection: 'Phản đối xử lý dữ liệu cá nhân cho mục đích tiếp thị/phân tích tùy chọn.',
      export: 'Yêu cầu xuất dữ liệu tài khoản.',
    };

    const retainedExplanation =
      selectedRequestType === 'deletion'
        ? 'Theo Luật Giao dịch điện tử 2023 và quy định lưu trữ chứng từ thương mại/kế toán, hồ sơ hợp đồng giao dịch (Transaction Snapshots), mã đơn hàng và dữ liệu đối soát tài chính không thể bị xóa trắng ngay lập tức mà sẽ được chuyển sang trạng thái Lưu trữ hạn chế (partially_retained). Thông tin tiếp thị và tùy chọn cá nhân sẽ được xóa.'
        : undefined;

    onSubmitPrivacyRequest(
      selectedRequestType,
      requestDetails.trim() || defaultNoteMap[selectedRequestType],
      retainedExplanation
    );
    setRequestDetails('');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-lg border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[11px] font-black uppercase">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Nghị định 13/2023/NĐ-CP & Luật BVQLNTD 2023</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Trung tâm Quyền riêng tư & Dữ liệu cá nhân
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
            Kiểm soát minh bạch dữ liệu được thu thập, quản lý sự đồng ý theo từng mục đích cụ thể (Purpose-specific consent), trích xuất dữ liệu hoặc gửi yêu cầu quyền chủ thể dữ liệu.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0">
          <div className="px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">
              Phiên bản Chính sách Quyền riêng tư
            </span>
            <span className="font-mono font-black text-emerald-400">v2026.1 (Hiệu lực 01/10/2026)</span>
          </div>
          <button
            type="button"
            onClick={() => onOpenLegalDoc('privacy_policy')}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs transition flex items-center justify-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5 text-emerald-400" />
            <span>Xem toàn văn Chính sách Quyền riêng tư</span>
          </button>
        </div>
      </div>

      {/* 1. Data Collected & Connected Processing Summary (Req 14) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
        <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
          <Eye className="w-5 h-5 text-emerald-600" />
          <span>1. Danh mục dữ liệu đang lưu trữ & Mục đích xử lý liên kết</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
            <span className="text-[10px] font-black uppercase text-emerald-700">
              Dữ liệu định danh cơ bản
            </span>
            <div className="font-bold text-slate-900">{currentUser.name}</div>
            <div className="text-slate-600">Email: {currentUser.email}</div>
            <div className="text-slate-600">SĐT: {currentUser.phone || 'Chưa cung cấp'}</div>
            <p className="text-[11px] text-slate-500 pt-1">
              Mục đích: Xác thực tài khoản và gửi thông báo trạng thái đơn hàng/mã nhận Locker.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
            <span className="text-[10px] font-black uppercase text-blue-700">
              Dữ liệu giao dịch & Điểm nhận
            </span>
            <div className="font-bold text-slate-900">{myOrders.length} đơn hàng đã ghi nhận</div>
            <div className="text-slate-600">
              Điểm nhận ưu tiên: {currentUser.preferredPickupPoint || 'KTX A – Locker 03'}
            </div>
            <p className="text-[11px] text-slate-500 pt-1">
              Mục đích: Thực hiện nghĩa vụ hợp đồng mua gom, đối soát tài chính và cấp mã nhận hàng tại điểm tập kết.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-1.5">
            <span className="text-[10px] font-black uppercase text-amber-800">
              Nguyên tắc bảo lưu pháp lý (Retention Rule)
            </span>
            <div className="font-bold text-amber-950">Không xóa trắng chứng từ giao dịch</div>
            <p className="text-[11px] text-amber-900 leading-relaxed">
              Khi bạn rút lại consent tùy chọn hoặc yêu cầu xóa tài khoản, dữ liệu tiếp thị dừng xử lý ngay lập tức; tuy nhiên hồ sơ giao dịch và đối soát bắt buộc phải bảo lưu theo Luật Giao dịch điện tử 2023.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Purpose-Specific Consent Controls (Req 15, 16, 17) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Sliders className="w-5 h-5 text-emerald-600" />
              <span>2. Quản lý sự đồng ý theo từng mục đích (Purpose-Specific Consent)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Các mục đích tùy chọn (Optional) mặc định ở trạng thái <strong>TẮT (OFF)</strong> và không bao giờ là điều kiện bắt buộc để thanh toán đơn hàng.
            </p>
          </div>
          <button
            type="button"
            onClick={onWithdrawAllOptionalConsent}
            className="self-start sm:self-auto px-3.5 py-2 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-800 font-bold text-xs transition flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Rút lại toàn bộ consent tùy chọn</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PURPOSE_META.map((item) => {
            const currentRecord = getLatestConsentForPurpose(item.purpose, item.isRequired);
            const isAccepted = item.isRequired ? true : currentRecord.accepted;

            return (
              <div
                key={item.purpose}
                className={`rounded-2xl p-4 border transition flex flex-col justify-between gap-3 ${
                  item.isRequired
                    ? 'bg-slate-50 border-slate-200'
                    : isAccepted
                    ? 'bg-emerald-50/50 border-emerald-300'
                    : 'bg-white border-slate-200'
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-bold text-slate-900 text-xs">{item.title}</span>
                    {item.isRequired ? (
                      <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-black uppercase shrink-0">
                        Bắt buộc cho giao dịch
                      </span>
                    ) : (
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase shrink-0 ${
                          isAccepted
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}
                      >
                        {isAccepted ? 'Đang BẬT (Đã đồng ý)' : 'Đang TẮT (Mặc định OFF)'}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-600">{item.description}</p>
                  <div className="text-[10px] text-slate-400">
                    <strong>Phạm vi dữ liệu:</strong> {item.dataUsed}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 font-mono">
                    Cập nhật: {new Date(currentRecord.timestamp).toLocaleDateString('vi-VN')} (
                    {currentRecord.policyVersion})
                  </span>
                  {item.isRequired ? (
                    <span className="text-slate-500 font-semibold flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Luôn bật để thực hiện đơn hàng
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onToggleOptionalConsent(item.purpose, !isAccepted)}
                      className={`px-3 py-1 rounded-lg font-bold text-xs transition ${
                        isAccepted
                          ? 'bg-rose-100 hover:bg-rose-200 text-rose-800'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      }`}
                    >
                      {isAccepted ? 'Rút lại đồng ý (Tắt)' : 'Cấp sự đồng ý (Bật)'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Data Subject Rights & Account Deletion Workflow (Req 14, 17, 18) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
          <h3 className="text-base font-black text-slate-900">
            3. Thực hiện Quyền của Chủ thể Dữ liệu
          </h3>
          <p className="text-xs text-slate-500">
            Gửi yêu cầu chính thức tới bộ phận Quản trị Tuân thủ (Admin Compliance) hoặc tải trực tiếp dữ liệu tài khoản của bạn.
          </p>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleExportAccountData}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Xuất dữ liệu tài khoản (Export JSON)</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedRequestType('deletion')}
              className="px-3.5 py-2 rounded-xl border border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-800 font-bold text-xs transition flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Yêu cầu xóa tài khoản</span>
            </button>
          </div>

          <form onSubmit={handleRequestSubmit} className="space-y-3 pt-2">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Loại yêu cầu quyền riêng tư *
              </label>
              <select
                value={selectedRequestType}
                onChange={(e) => setSelectedRequestType(e.target.value as PrivacyRequestType)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white font-semibold text-slate-800"
              >
                <option value="access">1. Yêu cầu truy cập dữ liệu (Request data access)</option>
                <option value="withdraw_consent">
                  2. Rút lại sự đồng ý tùy chọn (Withdraw optional consent)
                </option>
                <option value="deletion">
                  3. Yêu cầu xóa tài khoản & dữ liệu (Request deletion)
                </option>
                <option value="restriction">
                  4. Yêu cầu hạn chế xử lý dữ liệu (Request processing restriction)
                </option>
                <option value="objection">
                  5. Phản đối xử lý dữ liệu tùy chọn (Object to optional processing)
                </option>
              </select>
            </div>

            {selectedRequestType === 'deletion' && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 text-[11px] text-amber-900 space-y-1.5">
                <div className="font-black flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Quy trình 5 bước xóa tài khoản & Bảo lưu chứng từ bắt buộc (Req 18):</span>
                </div>
                <p>
                  Yêu cầu xóa sẽ đi qua các trạng thái: <code>requested</code> →{' '}
                  <code>identity_check</code> → <code>processing</code> →{' '}
                  <code>completed / partially_retained</code>.
                </p>
                <p>
                  <strong>Hạng mục được xóa:</strong> Sở thích tiếp thị, gợi ý cá nhân hóa, vị trí tùy chọn.
                  <br />
                  <strong>Hạng mục phải bảo lưu (partially_retained):</strong> Hồ sơ hợp đồng giao dịch (Transaction Snapshots), hóa đơn/đối soát đơn hàng và lịch sử giải quyết khiếu nại theo quy định pháp luật thương mại & giao dịch điện tử.
                </p>
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Nội dung chi tiết / Ghi chú thêm
              </label>
              <textarea
                rows={3}
                value={requestDetails}
                onChange={(e) => setRequestDetails(e.target.value)}
                placeholder="Nhập chi tiết yêu cầu của bạn (hoặc để trống để dùng nội dung tiêu chuẩn)..."
                className="w-full text-xs p-3 rounded-xl border border-slate-300"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition"
            >
              Gửi yêu cầu quyền riêng tư
            </button>
          </form>
        </div>

        {/* Request History & Consent Audit Log */}
        <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
          <div>
            <h3 className="text-base font-black text-slate-900">
              4. Lịch sử Yêu cầu Quyền riêng tư & Nhật ký Consent
            </h3>
            <p className="text-xs text-slate-500">
              Toàn bộ thao tác cấp hoặc rút lại sự đồng ý đều được lưu vết kiểm toán (Auditable Consent Record).
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-black uppercase text-slate-500">
              Yêu cầu đã gửi ({myRequests.length})
            </h4>
            {myRequests.length === 0 ? (
              <div className="p-4 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-xs text-slate-400 text-center">
                Chưa có yêu cầu quyền riêng tư nào.
              </div>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {myRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 uppercase">
                        Loại: {req.requestType}
                        {req.deletionStage ? ` • Bước: ${req.deletionStage}` : ''}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          req.status === 'completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : req.status === 'partially_retained'
                            ? 'bg-indigo-100 text-indigo-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {req.status}
                      </span>
                    </div>
                    <p className="text-slate-600">{req.details}</p>
                    {req.retainedCategoriesExplanation && (
                      <p className="text-[11px] text-indigo-800 bg-indigo-50 p-2 rounded-lg border border-indigo-100">
                        <strong>Giải thích dữ liệu bảo lưu:</strong> {req.retainedCategoriesExplanation}
                      </p>
                    )}
                    {req.adminNote && (
                      <p className="text-[11px] text-emerald-800 font-semibold">
                        Phản hồi Admin: {req.adminNote}
                      </p>
                    )}
                    <div className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(req.createdAt).toLocaleString('vi-VN')}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100">
            <h4 className="text-xs font-black uppercase text-slate-500">
              Nhật ký kiểm toán Consent ({myConsents.length} bản ghi)
            </h4>
            <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
              {myConsents
                .slice()
                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                .map((rec) => (
                  <div
                    key={rec.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px]"
                  >
                    <div>
                      <span className="font-mono font-bold text-slate-800">{rec.purpose}</span>
                      <span className="text-slate-400 block text-[10px]">
                        Nguồn: {rec.source} • Policy {rec.policyVersion} •{' '}
                        {new Date(rec.timestamp).toLocaleString('vi-VN')}
                      </span>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded font-bold ${
                        rec.accepted
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {rec.accepted ? (
                        <>
                          <CheckCircle2 className="w-3 h-3" /> ĐỒNG Ý
                        </>
                      ) : (
                        'TỪ CHỐI / ĐÃ RÚT'
                      )}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
