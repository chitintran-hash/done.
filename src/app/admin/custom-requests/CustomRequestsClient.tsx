"use client";

import { useState } from 'react';
import { 
  Paintbrush, 
  CheckCircle2, 
  Download, 
  Eye, 
  Printer, 
  FileImage, 
  Trash2,
  Sparkles
} from 'lucide-react';
import { updateCustomRequestStatus, deleteCustomRequest } from '@/app/actions/admin';
import CustomCupViewerModal from '@/components/studio/CustomCupViewerModal';

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
                    className="w-40 h-40 object-contain drop-shadow-md cursor-pointer hover:scale-105 transition-transform"
                    onClick={() => setSelectedReq(req)}
                  />
                ) : (
                  <div 
                    onClick={() => setSelectedReq(req)}
                    className="w-32 h-32 rounded-2xl bg-white border border-[#DDD8D2] flex items-center justify-center font-bold text-xs text-[#6F625E] cursor-pointer hover:bg-slate-50 transition-colors"
                  >
                    Mô hình 3D
                  </div>
                )}

                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full text-[11px] font-bold text-[#4A2A25] border border-[#DDD8D2] shadow-xs">
                  {req.modelName || (req.modelType === 'glass_tall' ? 'Ly Thuỷ Tinh Cao' : req.modelType === 'glass_mug' ? 'Ly Thuỷ Tinh Có Quai' : req.modelType === 'glass_can' ? 'Ly Thuỷ Tinh Cỡ Trung' : req.modelType === 'glass_rocks' ? 'Ly Thuỷ Tinh Thấp' : req.modelType === 'plastic_boba' ? 'Ly Nhựa Có Nắp' : 'Ly Custom')}
                </div>

                <div className="absolute top-4 right-4">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                    req.itemStatus === 'approved' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
                    req.itemStatus === 'in_printing' ? 'bg-indigo-100 text-indigo-800 border-indigo-200' :
                    req.itemStatus === 'completed' ? 'bg-teal-100 text-teal-800 border-teal-200' :
                    'bg-amber-100 text-amber-800 border-amber-200'
                  }`}>
                    {req.itemStatus === 'approved' ? 'Đã duyệt in' :
                     req.itemStatus === 'in_printing' ? 'Đang in' :
                     req.itemStatus === 'completed' ? 'Hoàn thành' : 'Chờ kiểm tra'}
                  </span>
                </div>
              </div>

              {/* Request Info */}
              <div className="p-5 space-y-3 flex-1 text-xs">
                <div>
                  <div className="font-bold text-[#201817] text-sm">{req.customerName}</div>
                  <div className="text-[11px] text-[#6F625E] font-mono">Đơn: #{req.orderId ? req.orderId.slice(0, 8).toUpperCase() : 'N/A'}</div>
                </div>

                <div className="space-y-1.5 bg-[#F7F6F2] p-3 rounded-2xl border border-[#DDD8D2] text-[11px]">
                  <div className="flex items-center justify-between">
                    <span><strong>Màu thân ly:</strong></span>
                    <span className="flex items-center gap-1 font-mono">
                      <span className="inline-block w-3 h-3 rounded-full border border-black/20" style={{ backgroundColor: req.cupColor }}></span>
                      {req.cupColor}
                    </span>
                  </div>
                  {req.modelType === 'plastic_boba' && req.lidColor && (
                    <div className="flex items-center justify-between">
                      <span><strong>Màu nắp ly:</strong></span>
                      <span className="flex items-center gap-1 font-mono">
                        <span className="inline-block w-3 h-3 rounded-full border border-black/20" style={{ backgroundColor: req.lidColor }}></span>
                        {req.lidColor}
                      </span>
                    </div>
                  )}
                  {req.customText && (
                    <div className="flex items-center justify-between pt-1 border-t border-[#DDD8D2]/60">
                      <span className="truncate max-w-[170px]"><strong>Chữ in:</strong> "{req.customText}"</span>
                      <span 
                        className="px-1.5 py-0.5 rounded text-[10px] bg-slate-900 border border-slate-700 font-mono shrink-0 ml-1"
                        style={{ color: req.textColor }}
                      >
                        {req.textColor}
                      </span>
                    </div>
                  )}
                  {req.uploadedImage && (
                    <div className="text-[#4A2A25] font-bold flex items-center gap-1 mt-1 pt-1 border-t border-[#DDD8D2]/60">
                      <FileImage className="w-3.5 h-3.5 text-emerald-700" /> Có file in ngoài khách tải lên
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center text-xs pt-1">
                  <span className="text-[#6F625E]">Giá custom:</span>
                  <span className="font-black text-sm text-[#4A2A25]">{formatVND(req.price * (req.quantity || 1))}</span>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="p-4 border-t border-[#DDD8D2] bg-white flex gap-2">
                <button
                  onClick={() => setSelectedReq(req)}
                  className="flex-1 py-2 px-3 bg-[#EDECEA] text-[#3A211E] rounded-xl text-xs font-bold hover:bg-[#DDD8D2] transition-colors flex items-center justify-center gap-1.5"
                  title="Mở hồ sơ xem 3D toàn bộ ly và bản in trải phẳng"
                >
                  <Eye className="w-3.5 h-3.5 text-[#4A2A25]" />
                  Xem Toàn Bộ Ly & File In
                </button>

                {req.itemStatus === 'pending' && (
                  <button
                    onClick={() => handleStatusChange(req.itemId, 'approved')}
                    className="py-2 px-3 bg-[#4A2A25] text-white rounded-xl text-xs font-bold hover:bg-[#3A211E] transition-colors shadow-sm"
                  >
                    Duyệt In
                  </button>
                )}

                {req.itemStatus === 'approved' && (
                  <button
                    onClick={() => handleStatusChange(req.itemId, 'in_printing')}
                    className="py-2 px-3 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors shadow-sm"
                  >
                    Bắt Đầu In
                  </button>
                )}

                {req.itemStatus === 'in_printing' && (
                  <button
                    onClick={() => handleStatusChange(req.itemId, 'completed')}
                    className="py-2 px-3 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors shadow-sm"
                  >
                    Đã Xong
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

      {/* FULL CUP 3D & 2D DIE-LINE INSPECTION MODAL */}
      <CustomCupViewerModal
        isOpen={!!selectedReq}
        onClose={() => setSelectedReq(null)}
        item={selectedReq}
        mode="admin"
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}
