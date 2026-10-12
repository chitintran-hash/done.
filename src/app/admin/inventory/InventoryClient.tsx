"use client";

import { useState } from 'react';
import { 
  Search, 
  Layers, 
  Plus, 
  ArrowUpRight, 
  ArrowDownRight, 
  Download, 
  SlidersHorizontal, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  History,
  X
} from 'lucide-react';
import { adjustInventoryStock, updateStockThreshold } from '@/app/actions/admin';

export default function InventoryClient({ 
  initialInventory, 
  initialLogs 
}: { 
  initialInventory: any[]; 
  initialLogs: any[]; 
}) {
  const [inventory, setInventory] = useState(initialInventory);
  const [logs, setLogs] = useState(initialLogs);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState<'inventory' | 'history'>('inventory');

  // Adjustment Modal State
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [adjustType, setAdjustType] = useState<'import' | 'export' | 'adjustment'>('import');
  const [adjustQty, setAdjustQty] = useState<number>(10);
  const [adjustReason, setAdjustReason] = useState<string>('');
  const [loadingAction, setLoadingAction] = useState(false);

  // Threshold Modal State
  const [thresholdProduct, setThresholdProduct] = useState<any | null>(null);
  const [newThreshold, setNewThreshold] = useState<number>(10);

  const formatVND = (num: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
  };

  const filteredInventory = inventory.filter(item => {
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const s = searchTerm.toLowerCase().trim();
    const matchesSearch = !s || item.name.toLowerCase().includes(s) || item.sku.toLowerCase().includes(s);
    return matchesStatus && matchesSearch;
  });

  const totalValue = inventory.reduce((sum, item) => sum + (item.inventoryValue || 0), 0);
  const totalPhysicalItems = inventory.reduce((sum, item) => sum + (item.physicalStock || 0), 0);

  const handleAdjustSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    if (adjustQty <= 0) {
      alert("Số lượng phải lớn hơn 0");
      return;
    }
    if (!adjustReason.trim()) {
      alert("Vui lòng nhập lý do điều chỉnh kho");
      return;
    }

    setLoadingAction(true);
    try {
      const res = await adjustInventoryStock({
        productId: selectedProduct.id,
        type: adjustType,
        quantity: adjustQty,
        reason: adjustReason,
        adminUser: 'Admin Cupfy'
      });

      setInventory(prev => prev.map(p => {
        if (p.id === selectedProduct.id) {
          const newPhysical = res.newStock;
          const newAvailable = Math.max(0, newPhysical - p.reservedStock);
          let newStatus = 'in_stock';
          if (newPhysical <= 0) newStatus = 'out_of_stock';
          else if (newPhysical <= p.threshold) newStatus = 'low_stock';

          return {
            ...p,
            physicalStock: newPhysical,
            availableStock: newAvailable,
            status: newStatus,
            inventoryValue: newPhysical * (p.costPrice > 0 ? p.costPrice : p.sellingPrice)
          };
        }
        return p;
      }));

      // Add to logs state
      setLogs(prev => [{
        id: Math.random().toString(),
        name: `Kho: ${adjustType.toUpperCase()}`,
        created_at: new Date().toISOString(),
        description: adjustReason,
        price: adjustQty,
        technical_specs: {
          movementType: adjustType,
          quantity: adjustQty,
          reason: adjustReason,
          newStock: res.newStock,
          adminUser: 'Admin Cupfy'
        }
      }, ...prev]);

      setSelectedProduct(null);
      setAdjustReason('');
      alert("Cập nhật kho hàng thành công!");
    } catch (e: any) {
      alert("Lỗi điều chỉnh kho: " + e.message);
    }
    setLoadingAction(false);
  };

  const handleUpdateThreshold = async () => {
    if (!thresholdProduct) return;
    try {
      await updateStockThreshold(thresholdProduct.id, newThreshold);
      setInventory(prev => prev.map(p => p.id === thresholdProduct.id ? { ...p, threshold: newThreshold } : p));
      setThresholdProduct(null);
      alert("Đã cập nhật ngưỡng cảnh báo!");
    } catch (e: any) {
      alert("Lỗi: " + e.message);
    }
  };

  const handleExportCSV = () => {
    const headers = [
      "SKU",
      "Tên Sản Phẩm",
      "Danh Mục",
      "Tồn Khả Dụng",
      "Đang Giữ Chỗ",
      "Tồn Vật Lý",
      "Giá Vốn (VNĐ)",
      "Giá Bán (VNĐ)",
      "Giá Trị Tồn Kho (VNĐ)",
      "Trạng Thái"
    ];

    const rows = filteredInventory.map(i => [
      `"${i.sku}"`,
      `"${i.name.replace(/"/g, '""')}"`,
      i.category,
      i.availableStock,
      i.reservedStock,
      i.physicalStock,
      i.costPrice,
      i.sellingPrice,
      i.inventoryValue,
      i.status === 'out_of_stock' ? 'Hết hàng' : i.status === 'low_stock' ? 'Sắp hết' : 'Còn hàng'
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Cupfy_Bao_Cao_Kho_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#DDD8D2] shadow-sm">
          <div className="text-xs font-semibold text-[#6F625E] uppercase tracking-wider">Tổng Hiện Vật Trong Kho</div>
          <div className="text-2xl font-black text-[#201817] mt-1">{totalPhysicalItems} chiếc</div>
          <p className="text-xs text-[#6F625E] mt-2">Bao gồm toàn bộ ly phôi và thành phẩm</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#DDD8D2] shadow-sm">
          <div className="text-xs font-semibold text-[#6F625E] uppercase tracking-wider">Tổng Giá Trị Tồn Kho</div>
          <div className="text-2xl font-black text-[#4A2A25] mt-1">{formatVND(totalValue)}</div>
          <p className="text-xs text-[#6F625E] mt-2">Tính theo giá vốn (hoặc giá bán nếu chưa có giá vốn)</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#DDD8D2] shadow-sm">
          <div className="text-xs font-semibold text-[#6F625E] uppercase tracking-wider">Cảnh Báo Tồn Kho</div>
          <div className="text-2xl font-black text-amber-700 mt-1">
            {inventory.filter(i => i.status !== 'in_stock').length} sản phẩm
          </div>
          <p className="text-xs text-[#6F625E] mt-2">Dưới ngưỡng an toàn hoặc đã hết hàng</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#DDD8D2] space-x-6">
        <button
          onClick={() => setActiveTab('inventory')}
          className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'inventory' 
              ? 'border-[#4A2A25] text-[#4A2A25]' 
              : 'border-transparent text-[#6F625E] hover:text-[#201817]'
          }`}
        >
          <Layers className="w-4 h-4" /> Danh Sách Tồn Kho ({inventory.length})
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'history' 
              ? 'border-[#4A2A25] text-[#4A2A25]' 
              : 'border-transparent text-[#6F625E] hover:text-[#201817]'
          }`}
        >
          <History className="w-4 h-4" /> Lịch Sử Biến Động Kho ({logs.length})
        </button>
      </div>

      {activeTab === 'inventory' ? (
        <>
          {/* Controls: Search, Filter, Export */}
          <div className="bg-white p-5 rounded-3xl border border-[#DDD8D2] shadow-sm flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
            <div className="flex flex-1 gap-3 items-center">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6F625E]" />
                <input 
                  type="text" 
                  placeholder="Tìm theo mã SKU, tên ly phôi..." 
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-[#F7F6F2] rounded-xl text-xs border border-[#DDD8D2] focus:outline-none focus:border-[#4A2A25]"
                />
              </div>

              <select 
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-[#F7F6F2] border border-[#DDD8D2] rounded-xl text-xs font-medium text-[#201817]"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="in_stock">Còn hàng</option>
                <option value="low_stock">Sắp hết hàng</option>
                <option value="out_of_stock">Hết hàng</option>
              </select>
            </div>

            <button 
              onClick={handleExportCSV}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-[#EDECEA] text-[#3A211E] rounded-xl text-xs font-bold hover:bg-[#DDD8D2] transition-colors shadow-sm"
            >
              <Download className="w-4 h-4" />
              Xuất Báo Cáo Kho
            </button>
          </div>

          {/* Inventory Table */}
          <div className="bg-white rounded-3xl border border-[#DDD8D2] shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F7F6F2] border-b border-[#DDD8D2] text-[#6F625E]">
                  <tr>
                    <th className="py-4 px-6 font-semibold">Mã SKU</th>
                    <th className="py-4 px-4 font-semibold">Tên Sản Phẩm</th>
                    <th className="py-4 px-4 font-semibold">Tồn Khả Dụng</th>
                    <th className="py-4 px-4 font-semibold">Đang Giữ Chỗ</th>
                    <th className="py-4 px-4 font-semibold">Tổng Vật Lý</th>
                    <th className="py-4 px-4 font-semibold">Giá Vốn</th>
                    <th className="py-4 px-4 font-semibold">Giá Trị Kho</th>
                    <th className="py-4 px-4 font-semibold">Trạng Thái</th>
                    <th className="py-4 px-6 font-semibold text-right">Điều Chỉnh</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DDD8D2]/60">
                  {filteredInventory.map(item => (
                    <tr key={item.id} className="hover:bg-[#F7F6F2]/40 transition-colors">
                      <td className="py-4 px-6 font-mono font-bold text-[#4A2A25]">
                        {item.sku}
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-bold text-[#201817] text-sm">{item.name}</div>
                        <div className="text-[11px] text-[#6F625E]">Danh mục: {item.category}</div>
                      </td>
                      <td className="py-4 px-4 font-bold text-sm text-[#201817]">
                        {item.availableStock}
                      </td>
                      <td className="py-4 px-4 text-[#6F625E] font-medium">
                        {item.reservedStock} (đang xử lý)
                      </td>
                      <td className="py-4 px-4 font-black text-[#4A2A25] text-sm">
                        {item.physicalStock}
                      </td>
                      <td className="py-4 px-4 text-[#6F625E]">
                        {item.costPrice > 0 ? formatVND(item.costPrice) : (
                          <span className="text-amber-700 font-semibold italic text-[11px]">Chưa nhập</span>
                        )}
                      </td>
                      <td className="py-4 px-4 font-bold text-[#201817]">
                        {formatVND(item.inventoryValue)}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                          item.status === 'out_of_stock' ? 'bg-rose-100 text-rose-800 border-rose-200' :
                          item.status === 'low_stock' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                          'bg-emerald-100 text-emerald-800 border-emerald-200'
                        }`}>
                          {item.status === 'out_of_stock' ? 'Hết hàng' :
                           item.status === 'low_stock' ? `Sắp hết (<= ${item.threshold})` : 'Còn hàng'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right space-x-2">
                        <button
                          onClick={() => {
                            setThresholdProduct(item);
                            setNewThreshold(item.threshold || 10);
                          }}
                          className="px-2.5 py-1.5 bg-[#EDECEA] text-[#3A211E] rounded-lg text-xs font-semibold hover:bg-[#DDD8D2]"
                          title="Đặt ngưỡng cảnh báo"
                        >
                          Ngưỡng
                        </button>
                        <button
                          onClick={() => {
                            setSelectedProduct(item);
                            setAdjustType('import');
                            setAdjustQty(10);
                            setAdjustReason('Nhập hàng mới từ xưởng');
                          }}
                          className="px-3 py-1.5 bg-[#4A2A25] text-white rounded-lg text-xs font-semibold hover:bg-[#3A211E]"
                        >
                          Nhập / Xuất
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        /* History Logs Tab */
        <div className="bg-white rounded-3xl border border-[#DDD8D2] shadow-sm overflow-hidden p-6 space-y-4">
          <div className="flex justify-between items-center mb-2">
            <div>
              <h3 className="font-bold text-[#3A211E] text-base">Nhật Ký Biến Động Kho Hàng</h3>
              <p className="text-xs text-[#6F625E]">Ghi nhận toàn bộ thao tác nhập, xuất và hủy đơn hàng</p>
            </div>
          </div>

          {logs.length === 0 ? (
            <div className="p-12 text-center text-[#6F625E]">Chưa có lịch sử biến động kho nào.</div>
          ) : (
            <div className="divide-y divide-[#DDD8D2]">
              {logs.map((log: any) => {
                const specs = log.technical_specs || {};
                return (
                  <div key={log.id} className="py-3.5 flex items-start justify-between text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded font-bold uppercase text-[10px] ${
                          specs.movementType === 'import' ? 'bg-emerald-100 text-emerald-800' :
                          specs.movementType === 'export' ? 'bg-rose-100 text-rose-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {specs.movementType || 'BIẾN ĐỘNG'}
                        </span>
                        <span className="font-bold text-[#201817] text-sm">
                          {specs.movementType === 'import' ? `+${specs.quantity}` : `-${specs.quantity}`} cái
                        </span>
                        <span className="text-[#6F625E]">
                          (Tồn mới: {specs.newStock} chiếc)
                        </span>
                      </div>
                      <div className="text-[#6F625E]">
                        <strong>Lý do:</strong> {specs.reason || log.description}
                      </div>
                      <div className="text-[11px] text-[#6F625E]">
                        Người thực hiện: {specs.adminUser || 'Hệ thống'}
                      </div>
                    </div>
                    <div className="text-right text-[#6F625E] font-mono">
                      {new Date(specs.timestamp || log.created_at).toLocaleString('vi-VN')}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ADJUSTMENT MODAL */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <form onSubmit={handleAdjustSubmit} className="bg-white rounded-3xl max-w-md w-full border border-[#DDD8D2] shadow-2xl p-6 space-y-4 text-xs">
            <div className="flex justify-between items-center border-b border-[#DDD8D2] pb-3">
              <h3 className="font-bold text-[#3A211E] text-base">Điều Chỉnh Kho: {selectedProduct.name}</h3>
              <button type="button" onClick={() => setSelectedProduct(null)} className="text-[#6F625E]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-[#F7F6F2] p-3 rounded-xl border border-[#DDD8D2] flex justify-between">
              <div>Tồn vật lý hiện tại: <strong>{selectedProduct.physicalStock} chiếc</strong></div>
              <div>Khả dụng: <strong>{selectedProduct.availableStock} chiếc</strong></div>
            </div>

            <div>
              <label className="font-bold text-[#201817] block mb-1">Loại thao tác:</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setAdjustType('import')}
                  className={`py-2 rounded-xl font-bold border transition-all ${adjustType === 'import' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white border-[#DDD8D2] text-[#201817]'}`}
                >
                  Nhập Kho (+)
                </button>
                <button
                  type="button"
                  onClick={() => setAdjustType('export')}
                  className={`py-2 rounded-xl font-bold border transition-all ${adjustType === 'export' ? 'bg-rose-600 text-white border-rose-600' : 'bg-white border-[#DDD8D2] text-[#201817]'}`}
                >
                  Xuất Kho (-)
                </button>
                <button
                  type="button"
                  onClick={() => setAdjustType('adjustment')}
                  className={`py-2 rounded-xl font-bold border transition-all ${adjustType === 'adjustment' ? 'bg-amber-600 text-white border-amber-600' : 'bg-white border-[#DDD8D2] text-[#201817]'}`}
                >
                  Kiểm Kê / Hư Hỏng
                </button>
              </div>
            </div>

            <div>
              <label className="font-bold text-[#201817] block mb-1">Số lượng thay đổi:</label>
              <input 
                type="number" 
                min="1"
                value={adjustQty}
                onChange={e => setAdjustQty(Number(e.target.value))}
                className="w-full p-2.5 bg-[#F7F6F2] border border-[#DDD8D2] rounded-xl text-sm font-bold"
                required
              />
            </div>

            <div>
              <label className="font-bold text-[#201817] block mb-1">Lý do điều chỉnh (Bắt buộc):</label>
              <textarea 
                rows={2}
                value={adjustReason}
                onChange={e => setAdjustReason(e.target.value)}
                placeholder="VD: Nhập thêm 100 phôi ly từ xưởng gốm, vỡ 2 chiếc trong kho..."
                className="w-full p-2.5 bg-[#F7F6F2] border border-[#DDD8D2] rounded-xl text-xs"
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#DDD8D2]">
              <button 
                type="button"
                onClick={() => setSelectedProduct(null)}
                className="px-4 py-2 bg-[#EDECEA] text-[#3A211E] rounded-xl font-bold"
              >
                Hủy
              </button>
              <button 
                type="submit"
                disabled={loadingAction}
                className="px-5 py-2 bg-[#4A2A25] text-white rounded-xl font-bold hover:bg-[#3A211E]"
              >
                {loadingAction ? 'Đang lưu...' : 'Xác Nhận'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* THRESHOLD MODAL */}
      {thresholdProduct && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full border border-[#DDD8D2] shadow-2xl p-6 space-y-4 text-xs">
            <h3 className="font-bold text-[#3A211E] text-base">Cài Đặt Ngưỡng Cảnh Báo</h3>
            <p className="text-[#6F625E]">
              Khi số lượng tồn kho của <strong>{thresholdProduct.name}</strong> giảm xuống dưới mức này, hệ thống sẽ tự động bật cảnh báo vàng/đỏ.
            </p>

            <div>
              <label className="font-bold text-[#201817] block mb-1">Số lượng tối thiểu:</label>
              <input 
                type="number" 
                min="1"
                value={newThreshold}
                onChange={e => setNewThreshold(Number(e.target.value))}
                className="w-full p-2.5 bg-[#F7F6F2] border border-[#DDD8D2] rounded-xl text-sm font-bold"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#DDD8D2]">
              <button 
                type="button"
                onClick={() => setThresholdProduct(null)}
                className="px-4 py-2 bg-[#EDECEA] text-[#3A211E] rounded-xl font-bold"
              >
                Hủy
              </button>
              <button 
                type="button"
                onClick={handleUpdateThreshold}
                className="px-5 py-2 bg-[#4A2A25] text-white rounded-xl font-bold hover:bg-[#3A211E]"
              >
                Lưu Ngưỡng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
