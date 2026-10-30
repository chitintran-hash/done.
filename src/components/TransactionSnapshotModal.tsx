import React from 'react';
import type { Order, Product, Supplier, TransactionSnapshot } from '../types';
import { formatVND } from '../utils/pricing';
import {
  X,
  FileCheck2,
  Download,
  Printer,
  ShieldCheck,
  Building2,
  Package,
  Calendar,
} from 'lucide-react';

interface TransactionSnapshotModalProps {
  order: Order | null;
  snapshot?: TransactionSnapshot | null;
  fallbackProduct?: Product | null;
  fallbackSupplier?: Supplier | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TransactionSnapshotModal: React.FC<TransactionSnapshotModalProps> = ({
  order,
  snapshot,
  fallbackProduct,
  fallbackSupplier,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !order) return null;

  // Preserve immutable snapshot values when present; construct deterministic snapshot for legacy demo orders
  const effectiveSnapshot: TransactionSnapshot = snapshot || {
    id: order.contractSnapshotId || `SNAP-${order.id}`,
    orderId: order.id,
    userId: order.userId,
    sellerId: order.supplierId || fallbackSupplier?.id || 'supplier-profile-demo',
    productSnapshot: {
      id: fallbackProduct?.id || 'prod-snapshot',
      name: order.productName,
      unit: order.unit || fallbackProduct?.unit || 'Đơn vị',
      origin: fallbackProduct?.origin || 'Việt Nam (Mô phỏng)',
      manufacturer: fallbackProduct?.manufacturer || 'Đơn vị sản xuất mô phỏng',
      organizationResponsibleName:
        fallbackProduct?.organizationResponsibleName ||
        fallbackSupplier?.legalName ||
        fallbackSupplier?.businessName ||
        'Nhà cung cấp mô phỏng',
      organizationResponsibleAddress:
        fallbackProduct?.organizationResponsibleAddress ||
        fallbackSupplier?.businessAddress ||
        fallbackSupplier?.location ||
        'TP. Thủ Đức, TP.HCM',
      quantityOrWeight: fallbackProduct?.quantityOrWeight || order.unit || 'Theo quy cách công bố',
      warranty: fallbackProduct?.warranty || 'Đổi trả trong 24h tại điểm nhận',
      expiryDate: fallbackProduct?.expiryDate || 'Theo bao bì lô hàng',
      batchNumber: fallbackProduct?.batchNumber || 'LOT-DEMO-2026',
    },
    sellerSnapshot: {
      id: order.supplierId || fallbackSupplier?.id || 'supplier-profile-demo',
      businessName: fallbackSupplier?.businessName || 'Nhà phân phối Thực phẩm A – Demo',
      legalName:
        fallbackSupplier?.legalName ||
        'Công ty TNHH Phân Phối Thực Phẩm A (Bản Mô Phỏng Học Thuật)',
      taxCode: order.supplierTaxCode || fallbackSupplier?.taxCode || '0312345678',
      businessRegistrationNumber:
        fallbackSupplier?.businessRegistrationNumber ||
        fallbackSupplier?.businessRegistration ||
        '0312345678-DEMO',
      businessAddress:
        fallbackSupplier?.businessAddress ||
        fallbackSupplier?.location ||
        'Khu Công Nghệ Cao, TP. Thủ Đức, TP.HCM',
      contactPhone: fallbackSupplier?.contactPhone || '0987654321',
      complaintContact:
        fallbackSupplier?.complaintContact ||
        'supplier@flashgroup.demo • 0987654321 (Tiếp nhận trong 03 ngày làm việc)',
      returnPolicy:
        fallbackSupplier?.returnPolicy ||
        'Đổi trả trong 24 giờ tại điểm nhận nếu sản phẩm hư hỏng hoặc không đúng mô tả.',
    },
    quantity: order.quantity,
    unitPrice: order.unitPrice,
    discount: order.voucherDiscount || 0,
    fees: 0,
    shipping: order.shippingFee,
    finalPrice: order.totalAmount,
    paymentMethod:
      order.paymentMethod || 'MOMO (Thanh toán mô phỏng – không phát sinh giao dịch tiền thật)',
    pickupMethod: `${order.pickupPointName || order.pickupPoint} (${order.pickupWindow || 'Khung giờ tiêu chuẩn'}) – Đối tác giao nhận mô phỏng`,
    termsVersion: 'v2026.1',
    sellerPolicyVersion: 'v2026.1',
    returnPolicyVersion: 'v2026.1',
    privacyVersion: 'v2026.1',
    supplierTaxCode: order.supplierTaxCode || fallbackSupplier?.taxCode || '0312345678',
    invoiceReference: order.invoiceReference || `INV-DEMO-${order.id}`,
    confirmationEvent: 'Tôi xác nhận đặt hàng',
    timestamp: order.paidAt || order.createdAt,
  };

  const handleDownloadJson = () => {
    const blob = new Blob([JSON.stringify(effectiveSnapshot, null, 2)], {
      type: 'application/json;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `HoSoGiaoDich_${effectiveSnapshot.orderId}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadHtml = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <title>Hồ sơ giao dịch điện tử #${effectiveSnapshot.orderId}</title>
  <style>
    body { font-family: Arial, sans-serif; color: #0f172a; max-width: 820px; margin: 24px auto; padding: 20px; line-height: 1.5; }
    h1 { font-size: 20px; margin-bottom: 4px; }
    .badge { display: inline-block; background: #ecfdf5; color: #065f46; border: 1px solid #6ee7b7; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: bold; }
    .box { border: 1px solid #cbd5e1; border-radius: 10px; padding: 14px; margin-top: 14px; background: #f8fafc; }
    table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 13px; }
    th, td { border: 1px solid #cbd5e1; padding: 8px 10px; text-align: left; }
    th { background: #e2e8f0; }
    .note { font-size: 11px; color: #475569; margin-top: 16px; }
  </style>
</head>
<body>
  <span class="badge">BẢN CHỤP HỢP ĐỒNG GIAO DỊCH BẤT BIẾN (TRANSACTION CONTRACT SNAPSHOT)</span>
  <h1>Hồ sơ Giao dịch Điện tử #${effectiveSnapshot.orderId}</h1>
  <p>Mã bản chụp: <strong>${effectiveSnapshot.id}</strong> • Thời điểm xác nhận: <strong>${new Date(effectiveSnapshot.timestamp).toLocaleString('vi-VN')}</strong></p>

  <div class="box">
    <h3>1. Thông tin Nhà cung cấp (Seller Snapshot)</h3>
    <p><strong>Tên pháp lý / kinh doanh:</strong> ${effectiveSnapshot.sellerSnapshot.legalName || effectiveSnapshot.sellerSnapshot.businessName}</p>
    <p><strong>Mã số ĐKKD:</strong> ${effectiveSnapshot.sellerSnapshot.businessRegistrationNumber || 'N/A'} • <strong>Mã số thuế:</strong> ${effectiveSnapshot.supplierTaxCode || 'N/A'}</p>
    <p><strong>Địa chỉ:</strong> ${effectiveSnapshot.sellerSnapshot.businessAddress || 'N/A'}</p>
    <p><strong>Đầu mối khiếu nại:</strong> ${effectiveSnapshot.sellerSnapshot.complaintContact || 'N/A'}</p>
    <p><strong>Chính sách đổi trả:</strong> ${effectiveSnapshot.sellerSnapshot.returnPolicy || 'N/A'}</p>
  </div>

  <div class="box">
    <h3>2. Thông tin Sản phẩm & Nhãn hàng hóa tại thời điểm chốt đơn (Product Snapshot)</h3>
    <p><strong>Sản phẩm:</strong> ${effectiveSnapshot.productSnapshot.name} (${effectiveSnapshot.productSnapshot.unit})</p>
    <p><strong>Xuất xứ:</strong> ${effectiveSnapshot.productSnapshot.origin || 'N/A'} • <strong>Nhà sản xuất:</strong> ${effectiveSnapshot.productSnapshot.manufacturer || 'N/A'}</p>
    <p><strong>Tổ chức chịu trách nhiệm:</strong> ${effectiveSnapshot.productSnapshot.organizationResponsibleName || 'N/A'}</p>
    <p><strong>Bảo hành / Đổi trả:</strong> ${effectiveSnapshot.productSnapshot.warranty || 'N/A'} • <strong>Số lô:</strong> ${effectiveSnapshot.productSnapshot.batchNumber || 'N/A'}</p>
  </div>

  <div class="box">
    <h3>3. Chi tiết Tài chính & Điều khoản Phiên bản</h3>
    <table>
      <tr><th>Hạng mục</th><th>Giá trị</th></tr>
      <tr><td>Số lượng</td><td>${effectiveSnapshot.quantity} ${effectiveSnapshot.productSnapshot.unit}</td></tr>
      <tr><td>Đơn giá chốt nhóm (Unit Price)</td><td>${formatVND(effectiveSnapshot.unitPrice)}</td></tr>
      <tr><td>Giảm giá khuyến mại (Discount)</td><td>-${formatVND(effectiveSnapshot.discount)}</td></tr>
      <tr><td>Phí giao nhận chia sẻ (Shipping)</td><td>${formatVND(effectiveSnapshot.shipping)}</td></tr>
      <tr><td>Phí khác (Fees)</td><td>${formatVND(effectiveSnapshot.fees)}</td></tr>
      <tr><td><strong>Tổng thanh toán cuối cùng (Final Payable)</strong></td><td><strong>${formatVND(effectiveSnapshot.finalPrice)}</strong></td></tr>
      <tr><td>Phương thức thanh toán</td><td>${effectiveSnapshot.paymentMethod}</td></tr>
      <tr><td>Phương thức giao nhận</td><td>${effectiveSnapshot.pickupMethod}</td></tr>
      <tr><td>Mã tham chiếu chứng từ (Invoice Ref)</td><td>${effectiveSnapshot.invoiceReference}</td></tr>
      <tr><td>Sự kiện xác nhận</td><td>${effectiveSnapshot.confirmationEvent}</td></tr>
      <tr><td>Phiên bản văn bản pháp lý</td><td>Terms ${effectiveSnapshot.termsVersion} • Seller ${effectiveSnapshot.sellerPolicyVersion} • Return ${effectiveSnapshot.returnPolicyVersion} • Privacy ${effectiveSnapshot.privacyVersion}</td></tr>
    </table>
  </div>

  <p class="note">Lưu ý: FlashGroup là prototype học thuật. Thanh toán mô phỏng – không phát sinh giao dịch tiền thật. Hồ sơ này bảo lưu nguyên trạng dữ liệu tại thời điểm xác nhận đặt hàng.</p>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `HoSoGiaoDich_${effectiveSnapshot.orderId}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 text-xs">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-[#F5FBD9] text-[#0C0D10] flex items-center justify-center">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#0C0D10] block">
                HỒ SƠ HỢP ĐỒNG GIAO DỊCH BẤT BIẾN (IMMUTABLE CONTRACT SNAPSHOT)
              </span>
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                Hồ sơ giao dịch #{effectiveSnapshot.orderId}
              </h3>
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

        {/* Snapshot Meta */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">
              Mã Snapshot / Mã đơn
            </span>
            <span className="font-mono font-bold text-slate-900">
              {effectiveSnapshot.id} / {effectiveSnapshot.orderId}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold flex items-center gap-1">
              <Calendar className="w-3 h-3" /> Thời điểm xác nhận đặt hàng
            </span>
            <span className="font-bold text-slate-900">
              {new Date(effectiveSnapshot.timestamp).toLocaleString('vi-VN')}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">
              Sự kiện xác nhận của Người mua
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded bg-[#F5FBD9] text-emerald-800 font-bold text-[11px]">
              “{effectiveSnapshot.confirmationEvent}”
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">
              Mã chứng từ / MST Nhà cung cấp (Tax Boundary)
            </span>
            <span className="font-mono font-semibold text-slate-800">
              {effectiveSnapshot.invoiceReference} • MST: {effectiveSnapshot.supplierTaxCode || 'N/A'}
            </span>
          </div>
        </div>

        {/* Seller & Product Snapshots */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-slate-200 p-4 space-y-1.5">
            <div className="font-black text-slate-900 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-amber-600" />
              <span>Thông tin Nhà cung cấp (Đã khóa)</span>
            </div>
            <div className="text-slate-600 space-y-1 text-[11px]">
              <div>
                <strong>Pháp nhân:</strong>{' '}
                {effectiveSnapshot.sellerSnapshot.legalName ||
                  effectiveSnapshot.sellerSnapshot.businessName}
              </div>
              <div>
                <strong>ĐKKD / MST:</strong>{' '}
                {effectiveSnapshot.sellerSnapshot.businessRegistrationNumber || 'N/A'} /{' '}
                {effectiveSnapshot.supplierTaxCode || 'N/A'}
              </div>
              <div>
                <strong>Địa chỉ:</strong>{' '}
                {effectiveSnapshot.sellerSnapshot.businessAddress || 'N/A'}
              </div>
              <div>
                <strong>Đầu mối khiếu nại:</strong>{' '}
                {effectiveSnapshot.sellerSnapshot.complaintContact || 'N/A'}
              </div>
              <div>
                <strong>Đổi trả:</strong>{' '}
                {effectiveSnapshot.sellerSnapshot.returnPolicy || 'N/A'}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 p-4 space-y-1.5">
            <div className="font-black text-slate-900 flex items-center gap-1.5">
              <Package className="w-4 h-4 text-[#0C0D10]" />
              <span>Thông tin Sản phẩm (Đã khóa)</span>
            </div>
            <div className="text-slate-600 space-y-1 text-[11px]">
              <div>
                <strong>Tên SP:</strong> {effectiveSnapshot.productSnapshot.name} (
                {effectiveSnapshot.productSnapshot.unit})
              </div>
              <div>
                <strong>Xuất xứ:</strong> {effectiveSnapshot.productSnapshot.origin || 'N/A'}
              </div>
              <div>
                <strong>Nhà sản xuất:</strong>{' '}
                {effectiveSnapshot.productSnapshot.manufacturer || 'N/A'}
              </div>
              <div>
                <strong>Tổ chức chịu trách nhiệm:</strong>{' '}
                {effectiveSnapshot.productSnapshot.organizationResponsibleName || 'N/A'}
              </div>
              <div>
                <strong>Bảo hành / Số lô:</strong>{' '}
                {effectiveSnapshot.productSnapshot.warranty || 'N/A'} •{' '}
                {effectiveSnapshot.productSnapshot.batchNumber || 'N/A'}
              </div>
            </div>
          </div>
        </div>

        {/* Financial & Version Snapshot */}
        <div className="rounded-2xl border border-slate-200 p-4 bg-slate-50/70 space-y-2">
          <div className="flex justify-between">
            <span className="text-slate-600">
              Số lượng × Đơn giá chốt ({effectiveSnapshot.quantity} ×{' '}
              {formatVND(effectiveSnapshot.unitPrice)}):
            </span>
            <span className="font-bold text-slate-900">
              {formatVND(effectiveSnapshot.quantity * effectiveSnapshot.unitPrice)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Khuyến mại / Voucher (Discount):</span>
            <span className="font-bold text-[#0C0D10]">
              -{formatVND(effectiveSnapshot.discount)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Phí giao nhận chia sẻ (Shipping):</span>
            <span className="font-bold text-slate-900">
              {formatVND(effectiveSnapshot.shipping)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Phụ phí khác (Fees):</span>
            <span className="font-bold text-slate-900">{formatVND(effectiveSnapshot.fees)}</span>
          </div>
          <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline">
            <span className="font-black text-slate-900 text-sm">
              Tổng giá trị hợp đồng giao dịch (Final Payable):
            </span>
            <span className="font-black text-[#0C0D10] text-lg">
              {formatVND(effectiveSnapshot.finalPrice)}
            </span>
          </div>
          <div className="pt-2 border-t border-dashed border-slate-200 text-[11px] text-slate-500 space-y-0.5">
            <div>
              <strong>Thanh toán:</strong> {effectiveSnapshot.paymentMethod} (Thanh toán mô phỏng – không phát sinh giao dịch tiền thật.)
            </div>
            <div>
              <strong>Giao nhận:</strong> {effectiveSnapshot.pickupMethod}
            </div>
            <div>
              <strong>Phiên bản chính sách áp dụng:</strong> Terms {effectiveSnapshot.termsVersion} •
              Seller Policy {effectiveSnapshot.sellerPolicyVersion} • Return Policy{' '}
              {effectiveSnapshot.returnPolicyVersion} • Privacy {effectiveSnapshot.privacyVersion}
            </div>
          </div>
        </div>

        <div className="bg-[#F5FBD9] border border-[#C7F000] rounded-xl p-3 flex items-start gap-2 text-[11px] text-emerald-900">
          <ShieldCheck className="w-4 h-4 text-[#0C0D10] shrink-0 mt-0.5" />
          <span>
            Bản chụp giao dịch này được khóa cố định tại thời điểm bạn nhấn <strong>“Tôi xác nhận đặt hàng”</strong>. Mọi thay đổi giá sản phẩm hoặc thông tin nhà cung cấp về sau không làm thay đổi hồ sơ giao dịch lịch sử này.
          </span>
        </div>

        {/* Actions: View / Download HTML / Download JSON / Print (Req 6 & 37) */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadHtml}
              className="px-3.5 py-2.5 rounded-xl bg-[#3155FF] hover:bg-[#3155FF] text-white text-white font-bold text-xs transition flex items-center gap-1.5 shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Tải hồ sơ giao dịch (.HTML)</span>
            </button>
            <button
              type="button"
              onClick={handleDownloadJson}
              className="px-3.5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs transition flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Tải JSON</span>
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="px-3.5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs transition flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>In hồ sơ</span>
            </button>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
