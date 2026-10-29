import React, { useState } from 'react';
import type {
  User,
  Order,
  Supplier,
  ComplaintCase,
  ComplaintMessage,
  ComplaintType,
  ComplaintStatus,
  ComplaintEvidenceItem,
} from '../types';
import { isComplaintSlaRisk } from '../utils/pricing';
import {
  AlertTriangle,
  Clock,
  Send,
  Paperclip,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Lock,
  MessageSquare,
} from 'lucide-react';

interface ComplaintCenterViewProps {
  currentUser: User;
  orders: Order[];
  suppliers: Supplier[];
  complaints: ComplaintCase[];
  messages: ComplaintMessage[];
  initialOrderId?: string;
  initialSupplierId?: string;
  onSubmitComplaint: (params: {
    complaintType: ComplaintType;
    orderId?: string;
    supplierId?: string;
    description: string;
    evidenceMetadata: ComplaintEvidenceItem[];
  }) => void;
  onReplyComplaint: (complaintId: string, message: string, nextStatus?: ComplaintStatus) => void;
  showToast: (msg: string) => void;
}

const COMPLAINT_TYPES: { value: ComplaintType; label: string }[] = [
  { value: 'Product problem', label: 'Vấn đề chất lượng sản phẩm (Product problem)' },
  { value: 'Incorrect information', label: 'Thông tin sai lệch / không đúng mô tả (Incorrect information)' },
  { value: 'Delivery issue', label: 'Sự cố giao nhận / điểm nhận Locker (Delivery issue)' },
  { value: 'Payment issue', label: 'Thắc mắc thanh toán / đối soát (Payment issue)' },
  { value: 'Supplier issue', label: 'Phản ánh về Nhà cung cấp (Supplier issue)' },
  { value: 'Refund issue', label: 'Vấn đề đổi trả / hoàn tiền (Refund issue)' },
  { value: 'Safety issue', label: 'Cảnh báo an toàn thực phẩm / hàng hóa (Safety issue)' },
  { value: 'Other', label: 'Khiếu nại khác (Other)' },
];

const STATUS_BADGE: Record<ComplaintStatus, { label: string; cls: string }> = {
  submitted: { label: 'Mới gửi (submitted)', cls: 'bg-amber-100 text-amber-800 border-amber-300' },
  acknowledged: {
    label: 'Đã tiếp nhận (acknowledged)',
    cls: 'bg-blue-100 text-blue-800 border-blue-300',
  },
  investigating: {
    label: 'Đang xác minh (investigating)',
    cls: 'bg-[#FAF0FF] text-indigo-800 border-indigo-300',
  },
  awaiting_buyer: {
    label: 'Chờ Người mua phản hồi (awaiting_buyer)',
    cls: 'bg-[#FAF0FF] text-purple-800 border-purple-300',
  },
  awaiting_supplier: {
    label: 'Chờ Nhà cung cấp giải trình (awaiting_supplier)',
    cls: 'bg-orange-100 text-orange-800 border-orange-300',
  },
  resolved: {
    label: 'Đã giải quyết (resolved)',
    cls: 'bg-[#D0FFA4]/40 text-emerald-800 border-[#D0FFA4]',
  },
  rejected: {
    label: 'Từ chối (rejected)',
    cls: 'bg-slate-200 text-slate-700 border-slate-300',
  },
  escalated: {
    label: 'Chuyển cấp xử lý cao hơn (escalated)',
    cls: 'bg-rose-100 text-rose-800 border-rose-300',
  },
};

export const ComplaintCenterView: React.FC<ComplaintCenterViewProps> = ({
  currentUser,
  orders,
  suppliers,
  complaints,
  messages,
  initialOrderId,
  initialSupplierId,
  onSubmitComplaint,
  onReplyComplaint,
  showToast,
}) => {
  const [complaintType, setComplaintType] = useState<ComplaintType>('Product problem');
  const [selectedOrderId, setSelectedOrderId] = useState<string>(initialOrderId || '');
  const [selectedSupplierId, setSelectedSupplierId] = useState<string>(
    initialSupplierId || suppliers[0]?.id || 'supplier-profile-demo'
  );
  const [description, setDescription] = useState<string>('');
  const [evidenceFileName, setEvidenceFileName] = useState<string>('');
  const [evidenceDesc, setEvidenceDesc] = useState<string>('');
  const [evidenceList, setEvidenceList] = useState<ComplaintEvidenceItem[]>([]);

  // Filter complaints visible to current user (Req 35: only involved Buyer/Supplier + Admin)
  const mySupplierProfile = suppliers.find((s) => s.userId === currentUser.id);
  const visibleComplaints = complaints.filter((c) => {
    if (currentUser.role === 'admin') return true;
    if (currentUser.role === 'supplier') {
      return c.supplierId === mySupplierProfile?.id || c.supplierId === 'supplier-profile-demo';
    }
    return c.userId === currentUser.id;
  });

  const [activeComplaintId, setActiveComplaintId] = useState<string | null>(
    visibleComplaints[0]?.id || null
  );
  const [replyText, setReplyText] = useState<string>('');

  const myOrders = orders.filter((o) => o.userId === currentUser.id);
  const activeComplaint =
    visibleComplaints.find((c) => c.id === activeComplaintId) || visibleComplaints[0] || null;
  const activeMessages = activeComplaint
    ? messages.filter((m) => m.complaintId === activeComplaint.id)
    : [];

  const handleAddEvidence = () => {
    const cleanName = evidenceFileName.trim() || `anh_bang_chung_${evidenceList.length + 1}.jpg`;
    const newItem: ComplaintEvidenceItem = {
      id: `ev-${Date.now()}`,
      fileName: cleanName,
      fileType: cleanName.endsWith('.pdf') ? 'application/pdf' : 'image/jpeg',
      description: evidenceDesc.trim() || 'Hình ảnh minh chứng đính kèm từ Người mua',
      uploadedAt: new Date().toISOString(),
    };
    setEvidenceList((prev) => [...prev, newItem]);
    setEvidenceFileName('');
    setEvidenceDesc('');
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      showToast('Vui lòng nhập nội dung mô tả khiếu nại.');
      return;
    }

    onSubmitComplaint({
      complaintType,
      orderId: selectedOrderId || undefined,
      supplierId: selectedSupplierId || undefined,
      description: description.trim(),
      evidenceMetadata: evidenceList,
    });

    setDescription('');
    setEvidenceList([]);
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeComplaint || !replyText.trim()) return;
    const nextStatus =
      currentUser.role === 'supplier' && activeComplaint.status === 'submitted'
        ? 'acknowledged'
        : undefined;
    onReplyComplaint(activeComplaint.id, replyText.trim(), nextStatus);
    setReplyText('');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-12">
      {/* Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-lg border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-[11px] font-black uppercase">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Luật Bảo vệ quyền lợi người tiêu dùng 2023 & NĐ 55/2024/NĐ-CP</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Trung tâm Khiếu nại & Tranh chấp
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
            Tiếp nhận phản ánh, đính kèm bằng chứng riêng tư và theo dõi tiến độ giải quyết tranh chấp. Hệ thống tự động tính hạn phản hồi tiếp nhận trong vòng <strong>03 ngày làm việc</strong>.
          </p>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4 text-xs shrink-0 space-y-1">
          <span className="text-[10px] font-bold uppercase text-emerald-400 block">
            Cam kết bảo toàn lịch sử (Req 10)
          </span>
          <div className="font-bold text-white">Không xóa ngầm hồ sơ tranh chấp</div>
          <div className="text-[11px] text-slate-400">
            Bằng chứng đính kèm chỉ hiển thị cho các bên liên quan & Admin.
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Submit New Complaint (For Buyer) or SLA Overview (For Supplier) */}
        {currentUser.role === 'buyer' && (
          <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4 self-start">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#000181]" />
              <span>Gửi hồ sơ khiếu nại mới</span>
            </h3>

            <form onSubmit={handleSubmitForm} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Phân loại khiếu nại (Complaint Type) *
                </label>
                <select
                  value={complaintType}
                  onChange={(e) => setComplaintType(e.target.value as ComplaintType)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-semibold text-slate-800"
                >
                  {COMPLAINT_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Tham chiếu đơn hàng (Order Reference)
                </label>
                <select
                  value={selectedOrderId}
                  onChange={(e) => setSelectedOrderId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-slate-800"
                >
                  <option value="">-- Không gắn đơn hàng cụ thể / Khiếu nại chung --</option>
                  {myOrders.map((o) => (
                    <option key={o.id} value={o.id}>
                      #{o.id} – {o.productName} ({o.quantity} {o.unit || 'đơn vị'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Nhà cung cấp liên quan
                </label>
                <select
                  value={selectedSupplierId}
                  onChange={(e) => setSelectedSupplierId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-slate-800"
                >
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.businessName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Mô tả chi tiết sự việc & yêu cầu giải quyết *
                </label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Mô tả rõ tình trạng sản phẩm, thông tin sai lệch hoặc sự cố tại điểm nhận..."
                  className="w-full p-3 rounded-xl border border-slate-300"
                />
              </div>

              {/* Complaint Evidence Attachment (Req 9) */}
              <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Paperclip className="w-3.5 h-3.5 text-[#000181]" />
                    <span>Đính kèm bằng chứng (Hình ảnh / Tài liệu)</span>
                  </span>
                  <span className="text-[10px] text-slate-500 flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Bảo mật riêng tư
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={evidenceFileName}
                    onChange={(e) => setEvidenceFileName(e.target.value)}
                    placeholder="Tên file (VD: anh_hop_dau.jpg)"
                    className="p-2 rounded-lg border border-slate-300 bg-white text-xs"
                  />
                  <input
                    type="text"
                    value={evidenceDesc}
                    onChange={(e) => setEvidenceDesc(e.target.value)}
                    placeholder="Ghi chú ảnh minh chứng"
                    className="p-2 rounded-lg border border-slate-300 bg-white text-xs"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddEvidence}
                  className="px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-[11px] transition"
                >
                  + Thêm bằng chứng mô phỏng ({evidenceList.length})
                </button>

                {evidenceList.length > 0 && (
                  <div className="space-y-1 pt-1">
                    {evidenceList.map((ev) => (
                      <div
                        key={ev.id}
                        className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-[11px]"
                      >
                        <span className="font-mono font-semibold text-slate-800 truncate">
                          {ev.fileName} – {ev.description}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setEvidenceList((prev) => prev.filter((x) => x.id !== ev.id))
                          }
                          className="text-rose-600 font-bold ml-2"
                        >
                          Xóa
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#006EE9] hover:bg-[#000181] text-white text-white font-bold text-xs shadow-md transition"
              >
                Gửi khiếu nại & Nhận xác nhận SLA 3 ngày làm việc
              </button>
            </form>
          </div>
        )}

        {/* Right Column: Dispute History & Thread (Req 8, 9, 10) */}
        <div
          className={`${
            currentUser.role === 'buyer' ? 'lg:col-span-7' : 'lg:col-span-12'
          } bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5`}
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#006EE9]" />
                <span>Lịch sử Khiếu nại & Giải quyết tranh chấp ({visibleComplaints.length})</span>
              </h3>
              <p className="text-xs text-slate-500">
                Chọn một hồ sơ để xem thời hạn phản hồi (3 ngày làm việc), bằng chứng đính kèm và trao đổi trực tiếp.
              </p>
            </div>
          </div>

          {visibleComplaints.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              Chưa có hồ sơ khiếu nại nào.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {/* List of complaints */}
              <div className="md:col-span-5 space-y-2.5 max-h-[540px] overflow-y-auto pr-1">
                {visibleComplaints.map((c) => {
                  const isSelected = activeComplaint?.id === c.id;
                  const slaRisk = isComplaintSlaRisk(c);
                  const badge = STATUS_BADGE[c.status] || STATUS_BADGE.submitted;

                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setActiveComplaintId(c.id)}
                      className={`w-full text-left p-3.5 rounded-2xl border transition space-y-1.5 text-xs ${
                        isSelected
                          ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-mono font-black text-xs">{c.id}</span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${badge.cls}`}
                        >
                          {c.status}
                        </span>
                      </div>
                      <div className="font-bold truncate">{c.complaintType}</div>
                      <p
                        className={`text-[11px] line-clamp-2 ${
                          isSelected ? 'text-slate-300' : 'text-slate-500'
                        }`}
                      >
                        {c.description}
                      </p>
                      <div className="flex items-center justify-between text-[10px] pt-1">
                        <span className={isSelected ? 'text-slate-400' : 'text-slate-400'}>
                          Gửi: {new Date(c.submittedAt).toLocaleDateString('vi-VN')}
                        </span>
                        {slaRisk && (
                          <span className="px-1.5 py-0.5 rounded bg-rose-500 text-white font-bold">
                            Cảnh báo SLA 3 ngày
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Complaint Detail & Messages */}
              {activeComplaint && (
                <div className="md:col-span-7 rounded-2xl border border-slate-200 p-4 sm:p-5 bg-slate-50/60 flex flex-col justify-between space-y-4 text-xs">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
                      <div>
                        <span className="font-mono font-black text-sm text-slate-900">
                          Hồ sơ #{activeComplaint.id}
                        </span>
                        <div className="text-[11px] text-slate-500">
                          Loại: <strong>{activeComplaint.complaintType}</strong>
                          {activeComplaint.orderId && (
                            <>
                              {' • '}Đơn hàng: <strong>#{activeComplaint.orderId}</strong>
                            </>
                          )}
                        </div>
                      </div>
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-black border ${
                          (STATUS_BADGE[activeComplaint.status] || STATUS_BADGE.submitted).cls
                        }`}
                      >
                        {(STATUS_BADGE[activeComplaint.status] || STATUS_BADGE.submitted).label}
                      </span>
                    </div>

                    {/* SLA 3 Working Days Box (Req 8) */}
                    <div className="bg-white rounded-xl p-3 border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">
                          Ngày gửi (Submitted at)
                        </span>
                        <span className="font-bold text-slate-800">
                          {new Date(activeComplaint.submittedAt).toLocaleString('vi-VN')}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold flex items-center gap-1">
                          <Clock className="w-3 h-3 text-amber-600" /> Hạn tiếp nhận (3 ngày làm việc)
                        </span>
                        <span className="font-bold text-amber-800">
                          {new Date(activeComplaint.acknowledgementDeadline).toLocaleString('vi-VN')}
                        </span>
                      </div>
                      {activeComplaint.acknowledgedAt && (
                        <div className="sm:col-span-2 text-[#000181] font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Đã xác nhận tiếp nhận lúc:{' '}
                          {new Date(activeComplaint.acknowledgedAt).toLocaleString('vi-VN')}
                        </div>
                      )}
                    </div>

                    {/* Description & Private Evidence */}
                    <div className="bg-white rounded-xl p-3.5 border border-slate-200 space-y-2">
                      <div className="font-bold text-slate-900">Nội dung khiếu nại:</div>
                      <p className="text-slate-700 leading-relaxed">{activeComplaint.description}</p>

                      {activeComplaint.evidenceMetadata.length > 0 && (
                        <div className="pt-2 border-t border-slate-100 space-y-1">
                          <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
                            <Lock className="w-3 h-3 text-[#000181]" /> Bằng chứng đính kèm (Chỉ hiển thị nội bộ cho các bên liên quan):
                          </span>
                          {activeComplaint.evidenceMetadata.map((ev) => (
                            <div
                              key={ev.id}
                              className="px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 font-mono text-[11px] text-slate-700"
                            >
                              📎 {ev.fileName} — {ev.description}
                            </div>
                          ))}
                        </div>
                      )}

                      {activeComplaint.resolution && (
                        <div className="p-2.5 rounded-xl bg-[#F4FFE8] border border-[#D0FFA4] text-emerald-900">
                          <strong>Kết quả giải quyết (Resolution):</strong> {activeComplaint.resolution}
                        </div>
                      )}
                    </div>

                    {/* Conversation Thread */}
                    <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                      <span className="text-[10px] font-black uppercase text-slate-400 block">
                        Phản hồi & Lịch sử trao đổi ({activeMessages.length})
                      </span>
                      {activeMessages.map((m) => (
                        <div
                          key={m.id}
                          className={`p-3 rounded-xl border text-xs ${
                            m.senderRole === 'admin'
                              ? 'bg-[#EFFBFF]/80 border-indigo-200 text-indigo-950'
                              : m.senderRole === 'supplier'
                              ? 'bg-amber-50/80 border-amber-200 text-amber-950'
                              : 'bg-white border-slate-200 text-slate-800'
                          }`}
                        >
                          <div className="flex items-center justify-between text-[10px] font-bold mb-1">
                            <span>
                              {m.senderName} ({m.senderRole.toUpperCase()})
                            </span>
                            <span className="text-slate-400">
                              {new Date(m.createdAt).toLocaleString('vi-VN')}
                            </span>
                          </div>
                          <p>{m.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Reply Form */}
                  <form onSubmit={handleSendReply} className="flex items-center gap-2 pt-2">
                    <input
                      type="text"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder={
                        currentUser.role === 'supplier'
                          ? 'Nhập phản hồi giải trình của Nhà cung cấp...'
                          : 'Bổ sung thông tin hoặc phản hồi cho khiếu nại này...'
                      }
                      className="flex-1 p-2.5 rounded-xl border border-slate-300 bg-white text-xs"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 shrink-0"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Gửi phản hồi</span>
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
