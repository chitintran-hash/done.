"use client";

import { useState } from 'react';
import { 
  Paintbrush, 
  CheckCircle2, 
  XCircle, 
  Download, 
  ExternalLink, 
  Eye, 
  Printer, 
  Clock, 
  RotateCw,
  X,
  FileImage,
  AlertCircle,
  Trash2
} from 'lucide-react';
import { updateCustomRequestStatus, deleteCustomRequest } from '@/app/actions/admin';

export default function CustomRequestsClient({ initialRequests }: { initialRequests: any[] }) {
  const [requests, setRequests] = useState(initialRequests);
  const [selectedReq, setSelectedReq] = useState<any | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [filter, setFilter] = useState('all');

  const formatVND = (num: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
  };

  const handleDeleteRequest = async (itemId: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa yêu cầu thiết kế này khỏi danh sách?')) return;
    setLoadingId(itemId);
    try {
      await deleteCustomRequest(itemId);
      setRequests(prev => prev.filter(r => r.itemId !== itemId));
      if (selectedReq?.itemId === itemId) setSelectedReq(null);
      alert("Đã xóa yêu cầu thiết kế thành công!");
    } catch (e: any) {
      alert("Lỗi xóa yêu cầu: " + e.message);
    }
    setLoadingId(null);
  };

  const handleStatusChange = async (itemId: string, status: string) => {
    setLoadingId(itemId);
    try {
      await updateCustomRequestStatus(itemId, status);
      setRequests(prev => prev.map(r => r.itemId === itemId ? { ...r, itemStatus: status } : r));
      if (selectedReq && selectedReq.itemId === itemId) {
        setSelectedReq((prev: any) => ({ ...prev, itemStatus: status }));
      }
      alert("Đã cập nhật trạng thái thiết kế thành công!");
    } catch (e: any) {
      alert("Lỗi: " + e.message);
    }
    setLoadingId(null);
  };

  const filteredRequests = requests.filter(r => {
    if (filter === 'all') return true;
    return r.itemStatus === filter;
  });

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex border-b border-[#DDD8D2] space-x-3 md:space-x-6 overflow-x-auto">
        {[
          { key: 'all', label: `Tất Cả Yêu Cầu (${requests.length})` },
          { key: 'pending', label: 'Chờ Duyệt Thiết Kế' },
          { key: 'approved', label: 'Đã Duyệt (Sẵn Sàng In)' },
          { key: 'in_printing', label: 'Đang Sản Xuất / In' },
          { key: 'completed', label: 'Đã Hoàn Thành In' },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setFilter(t.key)}
            className={`pb-3 text-xs md:text-sm font-bold whitespace-nowrap border-b-2 transition-colors ${
              filter === t.key 
                ? 'border-[#4A2A25] text-[#4A2A25]' 
                : 'border-transparent text-[#6F625E] hover:text-[#201817]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Requests Grid */}
      {filteredRequests.length === 0 ? (
        <div className="p-16 text-center text-[#6F625E] bg-white rounded-3xl border border-[#DDD8D2]">
          <Paintbrush className="w-12 h-12 mx-auto mb-3 opacity-30 text-[#4A2A25]" />
          <div className="font-bold text-sm text-[#201817]">Không có yêu cầu thiết kế nào</div>
          <p className="text-xs text-[#6F625E] mt-1">Các mẫu ly khách hàng tự thiết kế từ Custom Cup Studio sẽ hiển thị tại đây.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRequests.map(req => (
            <div 
              key={req.itemId} 
              className="bg-white rounded-3xl border border-[#DDD8D2] shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col justify-between"
            >
              {/* Cup Image Preview */}
              <div className="p-6 bg-[#F7F6F2] border-b border-[#DDD8D2] flex flex-col items-center justify-center relative min-h-[220px]">
                {req.cupImage ? (
                  <img 
                    src={req.cupImage} 
                    alt="Custom design preview" 
                    className="w-40 h-40 object-contain drop-shadow-md"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-2xl bg-white border border-[#DDD8D2] flex items-center justify-center font-bold text-xs text-[#6F625E]">
                    Preview 3D
                  </div>
                )}

                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-[11px] font-bold text-[#4A2A25] border border-[#DDD8D2]">
                  {req.modelName || (req.modelType === 'glass_tall' ? 'Ly Thuỷ Tinh Cao' : req.modelType === 'glass_mug' ? 'Ly Thuỷ Tinh Có Quai' : req.modelType === 'glass_can' ? 'Ly Thuỷ Tinh Cỡ Trung' : req.modelType === 'glass_rocks' ? 'Ly Thuỷ Tinh Thấp' : req.modelType === 'plastic_boba' ? 'Ly Nhựa Có Nắp' : 'Ly Custom')}
                </div>

                <div className="absolute top-4 right-4">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                    req.itemStatus === 'approved' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
                    req.itemStatus === 'in_printing' ? 'bg-indigo-100 text-indigo-800 border-indigo-200' :
                    req.itemStatus === 'completed' ? 'bg-teal-100 text-teal-800 border-teal-200' :
                    'bg-amber-100 text-amber-800 border-amber-200'
                  }`}>
                    {req.itemStatus === 'approved' ? 'Đã duyệt' :
                     req.itemStatus === 'in_printing' ? 'Đang in' :
                     req.itemStatus === 'completed' ? 'Hoàn thành' : 'Chờ kiểm tra'}
                  </span>
                </div>
              </div>

              {/* Request Info */}
              <div className="p-5 space-y-3 flex-1 text-xs">
                <div>
                  <div className="font-bold text-[#201817] text-sm">{req.customerName}</div>
                  <div className="text-[11px] text-[#6F625E] font-mono">Đơn: #{req.orderId.slice(0, 8).toUpperCase()}</div>
                </div>

                <div className="space-y-1 bg-[#F7F6F2] p-3 rounded-2xl border border-[#DDD8D2] text-[11px]">
                  <div><strong>Màu thân ly:</strong> <span className="inline-block w-3 h-3 rounded-full border border-black/20 align-middle ml-1" style={{ backgroundColor: req.cupColor }}></span> ({req.cupColor})</div>
                  {req.modelType === 'tumbler' && (
                    <div><strong>Màu nắp ly:</strong> <span className="inline-block w-3 h-3 rounded-full border border-black/20 align-middle ml-1" style={{ backgroundColor: req.lidColor }}></span> ({req.lidColor})</div>
                  )}
                  {req.customText && (
                    <div><strong>Nội dung chữ:</strong> "{req.customText}" (Màu: {req.textColor})</div>
                  )}
                  {req.uploadedImage && (
                    <div className="text-[#4A2A25] font-bold flex items-center gap-1 mt-1">
                      <FileImage className="w-3.5 h-3.5" /> Có file in khách tải lên
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center text-xs pt-1">
                  <span className="text-[#6F625E]">Giá custom:</span>
                  <span className="font-black text-sm text-[#4A2A25]">{formatVND(req.price * req.quantity)}</span>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="p-4 border-t border-[#DDD8D2] bg-white flex gap-2">
                <button
                  onClick={() => setSelectedReq(req)}
                  className="flex-1 py-2 px-3 bg-[#EDECEA] text-[#3A211E] rounded-xl text-xs font-bold hover:bg-[#DDD8D2] transition-colors"
                >
                  Xem Bản In
                </button>

                {req.itemStatus === 'pending' && (
                  <button
                    onClick={() => handleStatusChange(req.itemId, 'approved')}
                    className="flex-1 py-2 px-3 bg-[#4A2A25] text-white rounded-xl text-xs font-bold hover:bg-[#3A211E] transition-colors shadow-sm"
                  >
                    Duyệt In
                  </button>
                )}

                {req.itemStatus === 'approved' && (
                  <button
                    onClick={() => handleStatusChange(req.itemId, 'in_printing')}
                    className="flex-1 py-2 px-3 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors shadow-sm"
                  >
                    Bắt Đầu In
                  </button>
                )}

                {req.itemStatus === 'in_printing' && (
                  <button
                    onClick={() => handleStatusChange(req.itemId, 'completed')}
                    className="flex-1 py-2 px-3 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors shadow-sm"
                  >
                    Đã In Xong
                  </button>
                )}

                <button
                  onClick={() => handleDeleteRequest(req.itemId)}
                  disabled={loadingId === req.itemId}
                  className="py-2 px-2.5 bg-rose-50 text-rose-700 rounded-xl text-xs font-bold hover:bg-rose-100 transition-colors border border-rose-200"
                  title="Xóa yêu cầu thiết kế này"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* DETAIL INSPECTION MODAL */}
      {selectedReq && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-[#DDD8D2] shadow-2xl p-6 space-y-5 text-xs">
            <div className="flex justify-between items-center border-b border-[#DDD8D2] pb-3">
              <h3 className="font-bold text-[#3A211E] text-base">Hồ Sơ In Ấn & Xuất File Sản Xuất</h3>
              <button onClick={() => setSelectedReq(null)} className="text-[#6F625E]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex gap-4 items-center p-3 bg-[#F7F6F2] rounded-2xl border border-[#DDD8D2]">
              {selectedReq.cupImage && (
                <img src={selectedReq.cupImage} alt="" className="w-20 h-20 object-contain shrink-0" />
              )}
              <div>
                <div className="font-bold text-sm text-[#201817]">{selectedReq.customerName}</div>
                <div className="text-[11px] text-[#6F625E]">Email: {selectedReq.customerEmail}</div>
                <div className="text-[11px] font-mono text-[#4A2A25]">Đơn: #{selectedReq.orderId}</div>
              </div>
            </div>

            {/* Print Elements Specs */}
            <div className="space-y-2">
              <div className="font-bold text-[#3A211E]">Quy Cách In Ấn:</div>
              <div className="bg-[#F7F6F2] p-3 rounded-2xl border border-[#DDD8D2] space-y-1.5 leading-relaxed">
                <div>- <strong>Phôi ly cơ sở:</strong> {selectedReq.modelName || (selectedReq.modelType === 'glass_tall' ? 'Ly Thuỷ Tinh Cao 350ml' : selectedReq.modelType === 'glass_mug' ? 'Ly Thuỷ Tinh Có Quai 400ml' : selectedReq.modelType === 'glass_can' ? 'Ly Thuỷ Tinh Cỡ Trung 380ml' : selectedReq.modelType === 'glass_rocks' ? 'Ly Thuỷ Tinh Thấp 250ml' : selectedReq.modelType === 'plastic_boba' ? 'Ly Nhựa Có Nắp & Ống Hút 500ml' : 'Ly Custom Studio')}</div>
                <div>- <strong>Mã màu thân ly:</strong> <code className="bg-white px-1 rounded border border-[#DDD8D2]">{selectedReq.cupColor}</code></div>
                {selectedReq.lidColor && (
                  <div>- <strong>Mã màu nắp:</strong> <code className="bg-white px-1 rounded border border-[#DDD8D2]">{selectedReq.lidColor}</code></div>
                )}
                <div>- <strong>Phông chữ in:</strong> {selectedReq.fontFamily}</div>
                {selectedReq.customText && (
                  <div>- <strong>Chữ khắc / in trên thân:</strong> <span className="font-bold text-base text-[#4A2A25]">"{selectedReq.customText}"</span></div>
                )}
                {selectedReq.textColor && (
                  <div>- <strong>Màu mực in chữ:</strong> {selectedReq.textColor}</div>
                )}
              </div>
            </div>

            {/* Flat Printable Sheet (2D Unrolled Texture ready for UV Flatbed Printer) */}
            {selectedReq.printableTexture && (
              <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-2xl space-y-2">
                <div className="font-bold text-indigo-950 flex items-center justify-between">
                  <span>Bản in trải phẳng (Dành cho máy in UV / Laser):</span>
                  <a
                    href={selectedReq.printableTexture}
                    target="_blank"
                    rel="noopener noreferrer"
                    download={`ban-in-cupfy-${selectedReq.orderId}.png`}
                    className="flex items-center gap-1.5 px-3 py-1 bg-indigo-700 text-white rounded-lg text-xs font-bold hover:bg-indigo-800 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" /> Tải Bản In Phẳng
                  </a>
                </div>
                <div className="max-h-36 overflow-hidden rounded-xl border border-indigo-200 bg-white p-2 flex items-center justify-center">
                  <img src={selectedReq.printableTexture} alt="Printable sheet" className="max-h-32 object-contain" />
                </div>
              </div>
            )}

            {/* Customer Uploaded High-Res Asset */}
            {selectedReq.uploadedImage ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2">
                <div className="font-bold text-emerald-950 flex items-center justify-between">
                  <span>File ảnh khách hàng tải lên để in:</span>
                  <a 
                    href={selectedReq.uploadedImage} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    download
                    className="flex items-center gap-1.5 px-3 py-1 bg-emerald-700 text-white rounded-lg text-xs font-bold hover:bg-emerald-800 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" /> Tải File Gốc
                  </a>
                </div>
                <div className="max-h-40 overflow-hidden rounded-xl border border-emerald-200 bg-white p-2 flex items-center justify-center">
                  <img src={selectedReq.uploadedImage} alt="Customer upload" className="max-h-36 object-contain" />
                </div>
              </div>
            ) : (
              <div className="p-3 bg-[#F7F6F2] border border-[#DDD8D2] rounded-xl text-center text-[#6F625E]">
                Khách hàng chỉ in chữ tùy chỉnh, không tải ảnh ngoài.
              </div>
            )}

            {/* Action Bar */}
            <div className="flex justify-between items-center pt-3 border-t border-[#DDD8D2]">
              <button 
                type="button"
                onClick={() => setSelectedReq(null)}
                className="px-4 py-2 bg-[#EDECEA] text-[#3A211E] rounded-xl font-bold"
              >
                Đóng
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleStatusChange(selectedReq.itemId, 'rejected')}
                  className="px-3.5 py-2 bg-rose-100 text-rose-800 rounded-xl font-bold hover:bg-rose-200"
                >
                  Yêu Cầu Sửa
                </button>
                <button
                  type="button"
                  onClick={() => handleStatusChange(selectedReq.itemId, 'approved')}
                  className="px-4 py-2 bg-[#4A2A25] text-white rounded-xl font-bold hover:bg-[#3A211E]"
                >
                  Duyệt Thiết Kế
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
