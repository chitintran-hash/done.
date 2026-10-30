import React, { useState } from 'react';
import type {
  Product,
  GroupRoom,
  Supplier,
  SupplierVerificationDocument,
  ComplianceDocumentType,
} from '../types';
import { formatVND, getSupplierVerificationDisplay } from '../utils/pricing';
import {
  Plus,
  Package,
  Edit2,
  X,
  Power,
  Lock,
  ShieldCheck,
  FileText,
  Upload,
  AlertTriangle,
  Building2,
  MapPin,
} from 'lucide-react';
import { VietnamAddressSelector } from './VietnamAddressSelector';


interface SupplierProductsProps {
  products: Product[];
  rooms: GroupRoom[];
  supplierId: string;
  supplier?: Supplier | null;
  verificationDocuments?: SupplierVerificationDocument[];
  onAddProduct: (prod: Product) => void;
  onUpdateProduct: (prod: Product) => void;
  onUpdateSupplier?: (updated: Supplier) => void;
  onUploadDocument?: (doc: Omit<SupplierVerificationDocument, 'id' | 'createdAt' | 'status'>) => void;
  showToast: (msg: string) => void;
}

const PROHIBITED_CLAIM_PATTERNS = [
  /100%/i,
  /rẻ\s*nhất/i,
  /tốt\s*nhất/i,
  /an\s*toàn\s*nhất/i,
  /cam\s*kết\s*tươi/i,
  /guaranteed\s*fresh/i,
  /safest/i,
  /cheapest/i,
  /\bbest\b/i,
];

const DOC_TYPE_LABELS: { value: ComplianceDocumentType; label: string }[] = [
  { value: 'business_registration', label: 'Giấy chứng nhận đăng ký doanh nghiệp / HKD (business_registration)' },
  { value: 'tax_registration', label: 'Đăng ký mã số thuế (tax_registration)' },
  { value: 'product_self_declaration', label: 'Bản tự công bố sản phẩm – NĐ 15/2018 (product_self_declaration)' },
  { value: 'food_safety_document', label: 'Chứng nhận cơ sở đủ điều kiện ATTP / Kiểm nghiệm (food_safety_document)' },
  { value: 'origin_document', label: 'Chứng từ xuất xứ / Truy xuất nguồn gốc (origin_document)' },
  { value: 'authorization_document', label: 'Giấy ủy quyền phân phối (authorization_document)' },
  { value: 'trademark_authorization', label: 'Giấy phép sử dụng nhãn hiệu (trademark_authorization)' },
  { value: 'other', label: 'Tài liệu tuân thủ khác (other)' },
];

export const SupplierProductsView: React.FC<SupplierProductsProps> = ({
  products,
  rooms,
  supplierId,
  supplier,
  verificationDocuments = [],
  onAddProduct,
  onUpdateProduct,
  onUpdateSupplier,
  onUploadDocument,
  showToast,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isDocModalOpen, setIsDocModalOpen] = useState<boolean>(false);
  const [isEditingSupplierInfo, setIsEditingSupplierInfo] = useState<boolean>(false);

  // Product Form State
  const [name, setName] = useState<string>('');
  const [category, setCategory] = useState<string>('Thực phẩm');
  const [brand, setBrand] = useState<string>('');
  const [unit, setUnit] = useState<string>('Hộp 500g');
  const [quantityOrWeight, setQuantityOrWeight] = useState<string>('500g / hộp');
  const [description, setDescription] = useState<string>('');
  const [image, setImage] = useState<string>(
    'https://images.unsplash.com/photo-1543528176-61b239494933?auto=format&fit=crop&w=800&q=80'
  );
  const [origin, setOrigin] = useState<string>('Đà Lạt, Lâm Đồng, Việt Nam');
  const [manufacturer, setManufacturer] = useState<string>('Nông trại Liên kết – Demo');
  const [orgName, setOrgName] = useState<string>(
    supplier?.legalName || supplier?.businessName || 'Công ty TNHH Phân Phối Thực Phẩm A (Mô phỏng)'
  );
  const [orgAddress, setOrgAddress] = useState<string>(
    supplier?.businessAddress || supplier?.location || 'TP. Thủ Đức, TP.HCM'
  );
  const [ingredients, setIngredients] = useState<string>('');
  const [usageInstructions, setUsageInstructions] = useState<string>(
    'Bảo quản nơi khô ráo hoặc ngăn mát theo hướng dẫn trên bao bì.'
  );
  const [warnings, setWarnings] = useState<string>(
    'Không sử dụng sản phẩm đã quá hạn sử dụng hoặc bao bì bị rách hở.'
  );
  const [expiryDate, setExpiryDate] = useState<string>('06 tháng kể từ NSX');
  const [batchNumber, setBatchNumber] = useState<string>('LOT-202610');
  const [foodComplianceStatus, setFoodComplianceStatus] = useState<string>(
    'Đã khai báo hồ sơ tự công bố sản phẩm (Dữ liệu mô phỏng)'
  );
  const [stockQuantity, setStockQuantity] = useState<number>(50);
  const [moq, setMoq] = useState<number>(5);
  const [unitCost, setUnitCost] = useState<string>('65000');
  const [warranty, setWarranty] = useState<string>('Đổi trả 24h tại điểm nhận');
  const [sourceNote, setSourceNote] = useState<string>('Nguồn hàng mô phỏng phục vụ nghiên cứu');

  // Document Upload Form State (Req 4)
  const [docType, setDocType] = useState<ComplianceDocumentType>('product_self_declaration');
  const [docTitle, setDocTitle] = useState<string>('');
  const [docNumber, setDocNumber] = useState<string>('');
  const [docIssuedBy, setDocIssuedBy] = useState<string>('');
  const [docProductId, setDocProductId] = useState<string>('');
  const [docFileName, setDocFileName] = useState<string>('');

  // Supplier Legal Info Form State (Req 1 & 2)
  const [legalName, setLegalName] = useState<string>(supplier?.legalName || supplier?.businessName || '');
  const [regNumber, setRegNumber] = useState<string>(
    supplier?.businessRegistrationNumber || supplier?.businessRegistration || ''
  );
  const [taxCode, setTaxCode] = useState<string>(supplier?.taxCode || '');
  const [legalRep, setLegalRep] = useState<string>(supplier?.legalRepresentative || '');
  const [businessAddress, setBusinessAddress] = useState<string>(
    supplier?.businessAddress || supplier?.location || ''
  );
  const [isAddressModalOpen, setIsAddressModalOpen] = useState<boolean>(false);
  const [complaintContact, setComplaintContact] = useState<string>(supplier?.complaintContact || '');
  const [returnPolicy, setReturnPolicy] = useState<string>(supplier?.returnPolicy || '');

  const supplierProducts = products.filter((p) => p.supplierId === supplierId);
  const myDocs = verificationDocuments.filter((d) => d.supplierId === supplierId);
  const verifDisplay = getSupplierVerificationDisplay(supplier);

  const hasProhibitedClaim = (text: string): boolean => {
    return PROHIBITED_CLAIM_PATTERNS.some((rx) => rx.test(text));
  };

  const handleOpenAdd = () => {
    setName('');
    setCategory('Thực phẩm');
    setBrand('');
    setUnit('Hộp 500g');
    setQuantityOrWeight('500g / hộp');
    setDescription('');
    setImage('https://images.unsplash.com/photo-1543528176-61b239494933?auto=format&fit=crop&w=800&q=80');
    setOrigin('Việt Nam');
    setManufacturer('Đơn vị sản xuất mô phỏng');
    setOrgName(supplier?.legalName || supplier?.businessName || '');
    setOrgAddress(supplier?.businessAddress || supplier?.location || '');
    setIngredients('');
    setUsageInstructions('Bảo quản theo hướng dẫn trên nhãn bao bì.');
    setWarnings('Không dùng khi sản phẩm quá hạn hoặc hư hỏng.');
    setExpiryDate('06 tháng kể từ NSX');
    setBatchNumber('LOT-202610');
    setFoodComplianceStatus('Đã khai báo bản tự công bố sản phẩm (Dữ liệu mô phỏng)');
    setStockQuantity(50);
    setMoq(5);
    setUnitCost('65000');
    setWarranty('Đổi trả 24h tại điểm nhận');
    setSourceNote('Nguồn hàng mô phỏng phục vụ nghiên cứu');
    setIsAddModalOpen(true);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Tên sản phẩm là bắt buộc.');
      return;
    }
    if (hasProhibitedClaim(name) || hasProhibitedClaim(description)) {
      showToast(
        'Vi phạm quy tắc nhãn hàng hóa (Req 3): Không được dùng từ ngữ tuyệt đối vô căn cứ ("100%", "rẻ nhất", "tốt nhất", "an toàn nhất", "guaranteed fresh") khi chưa có chứng cứ kiểm định.'
      );
      return;
    }

    const parsedCost = unitCost.trim() !== '' ? Number(unitCost) : undefined;

    const newProd: Product = {
      id: `prod-${Date.now()}`,
      supplierId,
      name: name.trim(),
      category,
      brand: brand.trim() || undefined,
      unit: unit.trim(),
      quantityOrWeight: quantityOrWeight.trim() || unit.trim(),
      description: description.trim(),
      image: image.trim(),
      origin: origin.trim() || undefined,
      manufacturer: manufacturer.trim() || undefined,
      organizationResponsibleName: orgName.trim() || undefined,
      organizationResponsibleAddress: orgAddress.trim() || undefined,
      ingredients: ingredients.trim() || undefined,
      usageInstructions: usageInstructions.trim() || undefined,
      warnings: warnings.trim() || undefined,
      expiryDate: expiryDate.trim() || undefined,
      batchNumber: batchNumber.trim() || undefined,
      foodComplianceStatus:
        category === 'Thực phẩm' || category === 'Đồ uống'
          ? foodComplianceStatus.trim()
          : undefined,
      stockQuantity: Number(stockQuantity),
      minimumOrderQuantity: Number(moq),
      unitCost: parsedCost && parsedCost > 0 ? parsedCost : undefined,
      warranty: warranty.trim() || undefined,
      sourceNote: sourceNote.trim() || 'Nguồn hàng mô phỏng phục vụ nghiên cứu',
      status: 'active',
      isDemo: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onAddProduct(newProd);
    setIsAddModalOpen(false);
    showToast(`Đã thêm sản phẩm "${newProd.name}" kèm đầy đủ thông tin nhãn hàng hóa (NĐ 111/2021/NĐ-CP)!`);
  };

  const handleOpenEdit = (prod: Product) => {
    setEditingProduct(prod);
    setDescription(prod.description);
    setImage(prod.image);
    setStockQuantity(prod.stockQuantity);
    setUnitCost(prod.unitCost !== undefined ? String(prod.unitCost) : '');
    setSourceNote(prod.sourceNote);
    setOrigin(prod.origin || '');
    setManufacturer(prod.manufacturer || '');
    setOrgName(prod.organizationResponsibleName || '');
    setOrgAddress(prod.organizationResponsibleAddress || '');
    setQuantityOrWeight(prod.quantityOrWeight || prod.unit);
    setIngredients(prod.ingredients || '');
    setUsageInstructions(prod.usageInstructions || '');
    setWarnings(prod.warnings || '');
    setExpiryDate(prod.expiryDate || '');
    setBatchNumber(prod.batchNumber || '');
    setFoodComplianceStatus(prod.foodComplianceStatus || '');
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    if (hasProhibitedClaim(description)) {
      showToast(
        'Vi phạm quy tắc nhãn hàng hóa (Req 3): Không được dùng từ ngữ tuyệt đối vô căn cứ ("100%", "rẻ nhất", "tốt nhất", "an toàn nhất").'
      );
      return;
    }

    const parsedCost = unitCost.trim() !== '' ? Number(unitCost) : undefined;

    const updated: Product = {
      ...editingProduct,
      description: description.trim(),
      image: image.trim(),
      stockQuantity: Number(stockQuantity),
      unitCost: parsedCost && parsedCost > 0 ? parsedCost : undefined,
      sourceNote: sourceNote.trim(),
      origin: origin.trim() || undefined,
      manufacturer: manufacturer.trim() || undefined,
      organizationResponsibleName: orgName.trim() || undefined,
      organizationResponsibleAddress: orgAddress.trim() || undefined,
      quantityOrWeight: quantityOrWeight.trim() || undefined,
      ingredients: ingredients.trim() || undefined,
      usageInstructions: usageInstructions.trim() || undefined,
      warnings: warnings.trim() || undefined,
      expiryDate: expiryDate.trim() || undefined,
      batchNumber: batchNumber.trim() || undefined,
      foodComplianceStatus: foodComplianceStatus.trim() || undefined,
      updatedAt: new Date().toISOString(),
    };

    onUpdateProduct(updated);
    setEditingProduct(null);
    showToast(`Đã cập nhật thông tin & nhãn tuân thủ cho "${updated.name}"!`);
  };

  const handleToggleStatus = (prod: Product) => {
    if (
      prod.status === 'temporarily_hidden' ||
      prod.status === 'permanently_deactivated'
    ) {
      showToast('Sản phẩm đang bị Admin tạm ẩn/ngưng hoạt động. Vui lòng gửi chứng từ giải trình.');
      return;
    }
    const nextStatus = prod.status === 'active' ? 'inactive' : 'active';
    onUpdateProduct({ ...prod, status: nextStatus, updatedAt: new Date().toISOString() });
    showToast(
      `Đã chuyển sản phẩm sang trạng thái ${nextStatus === 'active' ? 'Hoạt động' : 'Tạm dừng'}`
    );
  };

  const handleDocSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docTitle.trim() || !onUploadDocument) return;
    onUploadDocument({
      supplierId,
      productId: docProductId || undefined,
      category: docProductId
        ? supplierProducts.find((p) => p.id === docProductId)?.category
        : 'Chung',
      documentType: docType,
      documentTitle: docTitle.trim(),
      documentNumber: docNumber.trim() || `DOC-${Date.now()}`,
      issuedBy: docIssuedBy.trim() || 'Đơn vị cấp phát (Mô phỏng)',
      issueDate: new Date().toISOString().split('T')[0],
      fileMetadata: {
        fileName: docFileName.trim() || 'Chung_Tu_Tuan_Thu_DEMO.pdf',
        fileSize: '450 KB',
        mimeType: 'application/pdf',
        note: 'Tài liệu nội bộ chỉ hiển thị cho Nhà cung cấp và Admin',
      },
    });
    setDocTitle('');
    setDocNumber('');
    setDocIssuedBy('');
    setDocFileName('');
    setIsDocModalOpen(false);
  };

  const handleSaveSupplierLegal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supplier || !onUpdateSupplier) return;
    onUpdateSupplier({
      ...supplier,
      legalName: legalName.trim() || supplier.businessName,
      businessRegistrationNumber: regNumber.trim(),
      businessRegistration: regNumber.trim(),
      taxCode: taxCode.trim(),
      legalRepresentative: legalRep.trim(),
      businessAddress: businessAddress.trim(),
      complaintContact: complaintContact.trim(),
      returnPolicy: returnPolicy.trim(),
    });
    setIsEditingSupplierInfo(false);
    showToast('Đã cập nhật hồ sơ pháp lý & chính sách đổi trả của Nhà cung cấp!');
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* 1. SUPPLIER VERIFICATION & COMPLIANCE DOCUMENTS CARD (Req 1, 2, 4) */}
      {supplier && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-black uppercase">
                  <Building2 className="w-3 h-3" /> Hồ sơ Pháp lý & Xác minh Nhà cung cấp
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${verifDisplay.badgeColor}`}
                >
                  {verifDisplay.statusLabel}
                </span>
              </div>
              <h3 className="text-lg font-black text-slate-900">
                {supplier.legalName || supplier.businessName}
              </h3>
              <p className="text-xs text-slate-500">
                ĐKKD: <strong>{supplier.businessRegistrationNumber || supplier.businessRegistration || 'Chưa cập nhật'}</strong>
                {' • '}Mã số thuế: <strong>{supplier.taxCode || 'Chưa cập nhật'}</strong>
                {' • '}Đại diện PL: <strong>{supplier.legalRepresentative || 'Chưa cập nhật'}</strong>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setIsEditingSupplierInfo((prev) => !prev)}
                className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition"
              >
                {isEditingSupplierInfo ? 'Đóng chỉnh sửa' : 'Cập nhật thông tin pháp lý'}
              </button>
              {onUploadDocument && (
                <button
                  type="button"
                  onClick={() => setIsDocModalOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-[#3155FF] hover:bg-[#3155FF] text-white text-white font-bold text-xs transition flex items-center gap-1.5 shadow-sm"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Nộp chứng từ tuân thủ ({myDocs.length})</span>
                </button>
              )}
            </div>
          </div>

          {isEditingSupplierInfo && (
            <form
              onSubmit={handleSaveSupplierLegal}
              className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3 text-xs"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tên pháp nhân / HKD</label>
                  <input
                    type="text"
                    value={legalName}
                    onChange={(e) => setLegalName(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Mã số ĐKKD</label>
                  <input
                    type="text"
                    value={regNumber}
                    onChange={(e) => setRegNumber(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Mã số thuế (Tax Code)</label>
                  <input
                    type="text"
                    value={taxCode}
                    onChange={(e) => setTaxCode(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Người đại diện pháp luật</label>
                  <input
                    type="text"
                    value={legalRep}
                    onChange={(e) => setLegalRep(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                  />
                </div>
                <div className="sm:col-span-2">
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-slate-700">Địa chỉ trụ sở kinh doanh</label>
                    <button
                      type="button"
                      onClick={() => setIsAddressModalOpen(true)}
                      className="text-[11px] font-bold text-[#0C0D10] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <MapPin className="w-3 h-3 text-[#0C0D10]" />
                      Chọn từ danh mục hành chính VN
                    </button>
                  </div>
                  <input
                    type="text"
                    value={businessAddress}
                    onChange={(e) => setBusinessAddress(e.target.value)}
                    placeholder="VD: Lô E2a-7 Khu Công Nghệ Cao, Phường Hiệp Phú, TP. Thủ Đức, TP.HCM"
                    className="w-full p-2 rounded-lg border border-slate-300 bg-white text-xs font-semibold"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="font-bold text-slate-700 block mb-1">
                    Đầu mối tiếp nhận khiếu nại (Complaint Contact)
                  </label>
                  <input
                    type="text"
                    value={complaintContact}
                    onChange={(e) => setComplaintContact(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                  />
                </div>
                <div className="sm:col-span-3">
                  <label className="font-bold text-slate-700 block mb-1">
                    Chính sách đổi trả & hoàn tiền (Return Policy)
                  </label>
                  <input
                    type="text"
                    value={returnPolicy}
                    onChange={(e) => setReturnPolicy(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs"
                >
                  Lưu thông tin pháp lý
                </button>
              </div>
            </form>
          )}

          {/* Supplier Address Selection Modal */}
          {isAddressModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
              <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 text-xs space-y-4 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-base font-black text-slate-900">
                    Chọn địa chỉ trụ sở kinh doanh (Vietnam Address Hierarchy)
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsAddressModalOpen(false)}
                    className="text-slate-400 hover:text-slate-700 cursor-pointer p-1"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <VietnamAddressSelector
                  onConfirmAddress={(vAddr) => {
                    if (vAddr.formattedAddress) {
                      setBusinessAddress(vAddr.formattedAddress);
                      setIsAddressModalOpen(false);
                    }
                  }}
                />
              </div>
            </div>
          )}


          {/* List of Uploaded Category Compliance Documents */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-slate-500 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#0C0D10]" />
                <span>Chứng từ xác minh & Hồ sơ tuân thủ theo danh mục ({myDocs.length})</span>
              </span>
              <span className="text-[11px] text-slate-400">
                🔒 Bảo mật: Người mua không thể xem tập tin gốc này (Req 1 & 35)
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {myDocs.map((d) => (
                <div
                  key={d.id}
                  className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-2 text-xs"
                >
                  <div>
                    <div className="font-bold text-slate-900">{d.documentTitle}</div>
                    <div className="text-[11px] text-slate-500">
                      Loại: <code>{d.documentType}</code> • Số hiệu: {d.documentNumber || 'N/A'}
                    </div>
                    {d.reviewNote && (
                      <div className="text-[11px] text-[#0C0D10] font-medium mt-0.5">
                        Ghi chú Admin: {d.reviewNote}
                      </div>
                    )}
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase shrink-0 ${
                      d.status === 'approved'
                        ? 'bg-[#F5FBD9] text-emerald-800'
                        : d.status === 'rejected'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {d.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. PRODUCT CATALOG & COMPLIANCE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Package className="w-6 h-6 text-amber-600" />
            <span>Quản lý danh mục Sản phẩm & Nhãn hàng hóa ({supplierProducts.length})</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Kê khai minh bạch thông tin nhãn hàng hóa theo Nghị định 111/2021/NĐ-CP và hồ sơ an toàn thực phẩm theo Nghị định 15/2018/NĐ-CP
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="self-start sm:self-auto px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center space-x-1.5 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm sản phẩm mới</span>
        </button>
      </div>

      {/* Product List Table */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold text-[10px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Sản phẩm & Xuất xứ</th>
                <th className="py-3.5 px-4">Ngành hàng</th>
                <th className="py-3.5 px-4">Nhãn tuân thủ (NĐ 111/2021)</th>
                <th className="py-3.5 px-4">Tồn kho</th>
                <th className="py-3.5 px-4">Chi phí ước tính (Nội bộ)</th>
                <th className="py-3.5 px-4">Phòng gom</th>
                <th className="py-3.5 px-4">Trạng thái</th>
                <th className="py-3.5 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {supplierProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    Chưa có sản phẩm nào. Bấm "Thêm sản phẩm mới" để bắt đầu.
                  </td>
                </tr>
              ) : (
                supplierProducts.map((prod) => {
                  const activeRoomsCount = rooms.filter(
                    (r) => r.productId === prod.id && r.status === 'active'
                  ).length;

                  return (
                    <tr key={prod.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                          />
                          <div>
                            <span className="font-bold text-slate-900 block leading-tight">
                              {prod.name}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              Quy cách: {prod.unit} • Xuất xứ: {prod.origin || 'Chưa kê khai'}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-600">{prod.category}</td>
                      <td className="py-3.5 px-4">
                        <div className="text-[11px] text-slate-600 space-y-0.5">
                          <div>
                            NSX: <strong>{prod.manufacturer || 'Chưa kê khai'}</strong>
                          </div>
                          <div>
                            Số lô: <code>{prod.batchNumber || 'N/A'}</code> • HSD:{' '}
                            {prod.expiryDate || 'N/A'}
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`font-bold ${
                            prod.stockQuantity < 10 ? 'text-rose-600' : 'text-slate-900'
                          }`}
                        >
                          {prod.stockQuantity} {prod.unit}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        {prod.unitCost ? (
                          <span className="inline-flex items-center gap-1 font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-lg">
                            <Lock className="w-3 h-3 text-slate-400" />
                            {formatVND(prod.unitCost)}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">Chưa nhập</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="bg-[#F5FBD9] text-[#0C0D10] border border-[#C7F000] text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {activeRoomsCount} phòng active
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            prod.status === 'active'
                              ? 'bg-[#F5FBD9] text-emerald-800'
                              : prod.status === 'temporarily_hidden' ||
                                prod.status === 'permanently_deactivated'
                              ? 'bg-rose-100 text-rose-800'
                              : prod.status === 'evidence_requested'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {prod.status === 'active'
                            ? 'Hoạt động'
                            : prod.status === 'temporarily_hidden'
                            ? 'Tạm ẩn (Admin)'
                            : prod.status === 'evidence_requested'
                            ? 'Yêu cầu chứng từ'
                            : prod.status === 'permanently_deactivated'
                            ? 'Ngưng vĩnh viễn'
                            : 'Tạm dừng'}
                        </span>
                        {prod.suspensionReason && (
                          <div className="text-[10px] text-rose-600 font-medium mt-0.5">
                            Lý do: {prod.suspensionReason}
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center space-x-2">
                          <button
                            onClick={() => handleOpenEdit(prod)}
                            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 transition"
                            title="Sửa thông tin & nhãn hàng hóa"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleToggleStatus(prod)}
                            className={`p-1.5 rounded-lg border transition ${
                              prod.status === 'active'
                                ? 'border-amber-200 text-amber-700 hover:bg-amber-50'
                                : 'border-[#C7F000] text-[#0C0D10] hover:bg-[#F5FBD9]'
                            }`}
                            title={prod.status === 'active' ? 'Tạm ngưng' : 'Kích hoạt'}
                          >
                            <Power className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* UPLOAD COMPLIANCE DOCUMENT MODAL (Req 4) */}
      {isDocModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-4 text-xs">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase text-[#0C0D10] block">
                  HỒ SƠ TUÂN THỦ NGÀNH HÀNG (CATEGORY COMPLIANCE DOCUMENTS)
                </span>
                <h3 className="text-base font-black text-slate-900">
                  Nộp chứng từ xác minh & công bố sản phẩm
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsDocModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleDocSubmit} className="space-y-3.5">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Loại tài liệu tuân thủ *</label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value as ComplianceDocumentType)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-semibold"
                >
                  {DOC_TYPE_LABELS.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Gắn với sản phẩm cụ thể (Tùy chọn theo ngành hàng)
                </label>
                <select
                  value={docProductId}
                  onChange={(e) => setDocProductId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="">-- Chứng từ chung của Nhà cung cấp --</option>
                  {supplierProducts.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.category})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Tên hồ sơ / chứng từ *</label>
                <input
                  type="text"
                  required
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  placeholder="VD: Bản tự công bố sản phẩm Sữa tươi tiệt trùng số 03/2026"
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Số hiệu văn bản</label>
                  <input
                    type="text"
                    value={docNumber}
                    onChange={(e) => setDocNumber(e.target.value)}
                    placeholder="VD: 03/2026/TCB-DEMO"
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Cơ quan / Đơn vị phát hành</label>
                  <input
                    type="text"
                    value={docIssuedBy}
                    onChange={(e) => setDocIssuedBy(e.target.value)}
                    placeholder="VD: Công ty TNHH Phân Phối Thực Phẩm A"
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Tên tập tin đính kèm (Metadata mô phỏng)
                </label>
                <input
                  type="text"
                  value={docFileName}
                  onChange={(e) => setDocFileName(e.target.value)}
                  placeholder="VD: Ho_So_Tu_Cong_Bo_DEMO.pdf"
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-[11px] text-slate-500">
                🔒 Tài liệu này sẽ được gửi tới Admin để kiểm duyệt theo ngành hàng. Không công khai tập tin riêng tư cho Người mua.
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsDocModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 font-bold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#3155FF] hover:bg-[#3155FF] text-white text-white font-bold"
                >
                  Nộp hồ sơ chờ Admin duyệt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE PRODUCT MODAL (With Decree 111/2021 Compliance Fields) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100 mb-4">
              <div>
                <span className="text-[11px] font-black uppercase text-amber-600 tracking-wider block">
                  NHÀ CUNG CẤP • TUÂN THỦ NHÃN HÀNG HÓA NĐ 111/2021/NĐ-CP
                </span>
                <h3 className="text-lg font-black text-slate-900">Thêm sản phẩm mới vào danh mục</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Tên sản phẩm *</label>
                <input
                  type="text"
                  required
                  placeholder="vd: Táo Rockit New Zealand ống 4 trái"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Ngành hàng</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="Thực phẩm">Thực phẩm</option>
                    <option value="Đồ gia dụng">Đồ gia dụng</option>
                    <option value="Đồ uống">Đồ uống</option>
                    <option value="Sinh viên">Sinh viên</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Thương hiệu</label>
                  <input
                    type="text"
                    placeholder="vd: BioFarm Demo"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Đơn vị / Quy cách *</label>
                  <input
                    type="text"
                    required
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              {/* Decree 111/2021 Mandatory Labeling Fields (Req 3) */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
                <div className="font-black text-slate-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#0C0D10]" />
                  <span>Thông tin nhãn hàng hóa bắt buộc (Nghị định 111/2021/NĐ-CP & NĐ 15/2018/NĐ-CP)</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Xuất xứ hàng hóa (Origin) *</label>
                    <input
                      type="text"
                      required
                      value={origin}
                      onChange={(e) => setOrigin(e.target.value)}
                      className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Nhà sản xuất (Manufacturer) *</label>
                    <input
                      type="text"
                      required
                      value={manufacturer}
                      onChange={(e) => setManufacturer(e.target.value)}
                      className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Tổ chức/cá nhân chịu trách nhiệm về hàng hóa *
                    </label>
                    <input
                      type="text"
                      required
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                      className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Địa chỉ tổ chức chịu trách nhiệm *
                    </label>
                    <input
                      type="text"
                      required
                      value={orgAddress}
                      onChange={(e) => setOrgAddress(e.target.value)}
                      className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Định lượng / Khối lượng tịnh (Quantity/Weight)
                    </label>
                    <input
                      type="text"
                      value={quantityOrWeight}
                      onChange={(e) => setQuantityOrWeight(e.target.value)}
                      className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Hạn sử dụng & Số lô (Expiry & Batch)
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                        placeholder="HSD"
                        className="p-2 rounded-lg border border-slate-300 bg-white"
                      />
                      <input
                        type="text"
                        value={batchNumber}
                        onChange={(e) => setBatchNumber(e.target.value)}
                        placeholder="Số lô"
                        className="p-2 rounded-lg border border-slate-300 bg-white"
                      />
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="font-bold text-slate-700 block mb-1">
                      Thành phần (Ingredients - nếu áp dụng)
                    </label>
                    <input
                      type="text"
                      value={ingredients}
                      onChange={(e) => setIngredients(e.target.value)}
                      placeholder="Kê khai thành phần nguyên liệu..."
                      className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Hướng dẫn sử dụng & bảo quản
                    </label>
                    <input
                      type="text"
                      value={usageInstructions}
                      onChange={(e) => setUsageInstructions(e.target.value)}
                      className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Thông tin cảnh báo an toàn (Warnings)
                    </label>
                    <input
                      type="text"
                      value={warnings}
                      onChange={(e) => setWarnings(e.target.value)}
                      className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tồn kho *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={stockQuantity}
                    onChange={(e) => setStockQuantity(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">MOQ</label>
                  <input
                    type="number"
                    min={1}
                    value={moq}
                    onChange={(e) => setMoq(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Chi phí nội bộ (VND)</label>
                  <input
                    type="number"
                    min={0}
                    value={unitCost}
                    onChange={(e) => setUnitCost(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-amber-300 bg-amber-50/40 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Mô tả sản phẩm (Không dùng từ ngữ quảng cáo tuyệt đối vô căn cứ)
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Mô tả trung thực đặc tính sản phẩm..."
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
                <span className="text-[10px] text-amber-700 flex items-center gap-1 mt-1">
                  <AlertTriangle className="w-3 h-3" /> Hệ thống tự động chặn các tuyên bố chưa kiểm chứng như "100%", "rẻ nhất", "tốt nhất", "an toàn nhất".
                </span>
              </div>

              <div className="pt-2 flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="w-1/3 py-3 rounded-xl border border-slate-300 font-bold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold transition shadow-md"
                >
                  LƯU SẢN PHẨM & NHÃN TUÂN THỦ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT PRODUCT MODAL */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100 mb-4">
              <div>
                <span className="text-[11px] font-black uppercase text-amber-600 tracking-wider block">
                  CHỈNH SỬA SẢN PHẨM & NHÃN HÀNG HÓA (NĐ 111/2021)
                </span>
                <h3 className="text-base font-black text-slate-900">{editingProduct.name}</h3>
              </div>
              <button
                onClick={() => setEditingProduct(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tồn kho khả dụng</label>
                  <input
                    type="number"
                    min={0}
                    value={stockQuantity}
                    onChange={(e) => setStockQuantity(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Chi phí ước tính / đơn vị</label>
                  <input
                    type="number"
                    min={0}
                    value={unitCost}
                    onChange={(e) => setUnitCost(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-amber-300 bg-amber-50/40 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Xuất xứ (Origin)</label>
                  <input
                    type="text"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nhà sản xuất</label>
                  <input
                    type="text"
                    value={manufacturer}
                    onChange={(e) => setManufacturer(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Đơn vị chịu trách nhiệm</label>
                  <input
                    type="text"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Hạn sử dụng / Số lô</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    <input
                      type="text"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      className="p-2 rounded-xl border border-slate-300"
                    />
                    <input
                      type="text"
                      value={batchNumber}
                      onChange={(e) => setBatchNumber(e.target.value)}
                      className="p-2 rounded-xl border border-slate-300"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Thành phần & Cảnh báo</label>
                <input
                  type="text"
                  value={warnings}
                  onChange={(e) => setWarnings(e.target.value)}
                  placeholder="Cảnh báo an toàn..."
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Mô tả sản phẩm</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div className="pt-2 flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="w-1/3 py-2.5 rounded-xl border border-slate-300 font-bold"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold transition shadow-md"
                >
                  CẬP NHẬT THAY ĐỔI
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
