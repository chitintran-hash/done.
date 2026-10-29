import React from 'react';
import type { Supplier } from '../types';
import { getSupplierVerificationDisplay } from '../utils/pricing';
import {
  X,
  Building2,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  Star,
  AlertCircle,
  RotateCcw,
  FileText,
} from 'lucide-react';

interface SellerInfoModalProps {
  supplier: Supplier | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenComplaint?: () => void;
}

export const SellerInfoModal: React.FC<SellerInfoModalProps> = ({
  supplier,
  isOpen,
  onClose,
  onOpenComplaint,
}) => {
  if (!isOpen || !supplier) return null;

  const verif = getSupplierVerificationDisplay(supplier);

  const supplierTypeLabels: Record<Supplier['supplierType'], string> = {
    manufacturer: 'Nhà sản xuất / Hợp tác xã (Manufacturer)',
    official_distributor: 'Nhà phân phối ủy quyền (Official Distributor)',
    local_retailer: 'Đơn vị bán lẻ nội địa (Local Retailer)',
    wholesaler: 'Nhà bán buôn (Wholesaler)',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 text-xs">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-start space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-1.5">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${verif.badgeColor}`}
                >
                  {verif.buyerBadgeLabel}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold">
                  {verif.statusLabel}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 mt-1">
                {supplier.businessName}
              </h3>
              <p className="text-xs text-slate-500">
                {supplier.legalName || 'Chưa cung cấp tên pháp nhân đầy đủ trong bản mô phỏng'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Legal Transparency Grid (Req 1 & 2) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100 space-y-1">
            <span className="text-[10px] font-bold uppercase text-slate-400">
              Tên pháp lý / hộ kinh doanh
            </span>
            <div className="font-bold text-slate-900">
              {supplier.legalName || supplier.businessName}
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100 space-y-1">
            <span className="text-[10px] font-bold uppercase text-slate-400">
              Loại hình nhà cung cấp
            </span>
            <div className="font-bold text-slate-900">
              {supplierTypeLabels[supplier.supplierType] || supplier.supplierType}
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100 space-y-1">
            <span className="text-[10px] font-bold uppercase text-slate-400">
              Mã số ĐKKD / Mã số thuế (Mô phỏng)
            </span>
            <div className="font-mono font-bold text-slate-900">
              ĐKKD: {supplier.businessRegistrationNumber || supplier.businessRegistration || 'Chưa cung cấp'}
              {' • '}MST: {supplier.taxCode || 'Chưa cung cấp'}
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100 space-y-1">
            <span className="text-[10px] font-bold uppercase text-slate-400">
              Người đại diện theo pháp luật
            </span>
            <div className="font-bold text-slate-900">
              {supplier.legalRepresentative || 'Chưa cung cấp trong dữ liệu mô phỏng'}
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100 space-y-1 sm:col-span-2">
            <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#000181]" /> Địa chỉ trụ sở / kho xuất hàng
            </span>
            <div className="font-semibold text-slate-800">
              {supplier.businessAddress || supplier.location || 'Chưa cung cấp'}
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100 space-y-1">
            <span className="text-[10px] font-bold uppercase text-slate-400">
              Phương thức liên hệ
            </span>
            <div className="space-y-0.5 font-semibold text-slate-800">
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{supplier.contactPhone || 'Chưa cung cấp'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{supplier.email || 'Chưa cung cấp'}</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100 space-y-1">
            <span className="text-[10px] font-bold uppercase text-slate-400">
              Đánh giá trung thực từ người mua
            </span>
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center gap-1 font-black text-amber-600 text-sm">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                {supplier.rating.toFixed(1)}
              </span>
              <span className="text-slate-500">({supplier.totalReviews} lượt đánh giá)</span>
            </div>
            {supplier.verifiedAt && (
              <div className="text-[10px] text-[#000181] font-semibold">
                Duyệt hồ sơ nội bộ: {new Date(supplier.verifiedAt).toLocaleDateString('vi-VN')}
              </div>
            )}
          </div>
        </div>

        {/* Complaint Contact & Return Policy (Req 2) */}
        <div className="space-y-3">
          <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 space-y-1">
            <div className="font-black text-amber-900 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span>Đầu mối tiếp nhận phản ánh & khiếu nại (Complaint Contact)</span>
            </div>
            <p className="text-amber-900">
              {supplier.complaintContact ||
                `${supplier.email || 'Chưa có email'} • ${supplier.contactPhone || 'Chưa có SĐT'} (Tiếp nhận và phản hồi trong 03 ngày làm việc)`}
            </p>
          </div>

          <div className="bg-[#F4FFE8]/70 border border-[#D0FFA4] rounded-2xl p-4 space-y-1">
            <div className="font-black text-emerald-900 flex items-center gap-1.5">
              <RotateCcw className="w-4 h-4 text-[#000181]" />
              <span>Chính sách đổi trả & hoàn tiền của Nhà cung cấp (Return Policy)</span>
            </div>
            <p className="text-emerald-900">
              {supplier.returnPolicy ||
                'Áp dụng theo Chính sách đổi trả & hoàn tiền chung của nền tảng FlashGroup (trong vòng 24h kể từ khi nhận hàng tại điểm hẹn).'}
            </p>
          </div>
        </div>

        {/* Security & Privacy Boundary Note (Req 1 & 35) */}
        <div className="bg-slate-100 rounded-2xl p-3.5 border border-slate-200 flex items-start gap-2.5 text-[11px] text-slate-600">
          <ShieldCheck className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
          <div>
            <strong>Bảo mật chứng từ gốc:</strong> Hồ sơ đăng ký kinh doanh và tài liệu xác minh chi tiết do Nhà cung cấp tải lên chỉ được lưu trữ nội bộ để Admin kiểm duyệt; không công khai tập tin riêng tư cho bên thứ ba.{' '}
            {supplier.isDemo && (
              <span className="font-semibold text-amber-700">
                Đây là Dữ liệu mô phỏng phục vụ đồ án học thuật, không phải xác nhận của cơ quan nhà nước.
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-end gap-2.5 pt-2">
          {onOpenComplaint && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenComplaint();
              }}
              className="px-4 py-2.5 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs transition flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Gửi khiếu nại về Nhà cung cấp này</span>
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition"
          >
            Đóng thông tin
          </button>
        </div>
      </div>
    </div>
  );
};
