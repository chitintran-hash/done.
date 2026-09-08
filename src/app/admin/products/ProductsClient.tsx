"use client";

import { useState } from 'react';
import { Search, Check, X, ShieldAlert, EyeOff } from 'lucide-react';
import { approveProduct, rejectProduct, hideProduct } from '../../actions/admin';

export default function ProductsClient({ initialProducts }: { initialProducts: any[] }) {
  const [products, setProducts] = useState(initialProducts);
  const [filter, setFilter] = useState('all'); // all, pending, active, rejected, hidden
  const [search, setSearch] = useState('');
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const filteredProducts = products.filter(p => {
    const matchesFilter = filter === 'all' || p.approval_status === filter;
    const matchesSearch = p.name?.toLowerCase().includes(search.toLowerCase()) || 
                          p.profiles?.store_name?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleApprove = async (id: string) => {
    if (!confirm('Duyệt sản phẩm này lên cửa hàng?')) return;
    setLoadingAction(id);
    try {
      await approveProduct(id);
      setProducts(products.map(p => p.id === id ? { ...p, approval_status: 'active', is_available: true, rejection_reason: null } : p));
    } catch (e: any) { alert('Lỗi: ' + e.message); }
    setLoadingAction(null);
  };

  const handleReject = async (id: string) => {
    const reason = prompt('Nhập lý do từ chối (Seller sẽ thấy thông báo này):');
    if (!reason) return;
    setLoadingAction(id);
    try {
      await rejectProduct(id, reason);
      setProducts(products.map(p => p.id === id ? { ...p, approval_status: 'rejected', is_available: false, rejection_reason: reason } : p));
    } catch (e: any) { alert('Lỗi: ' + e.message); }
    setLoadingAction(null);
  };

  const handleHide = async (id: string) => {
    if (!confirm('Ẩn sản phẩm này khỏi cửa hàng do vi phạm?')) return;
    setLoadingAction(id);
    try {
      await hideProduct(id);
      setProducts(products.map(p => p.id === id ? { ...p, approval_status: 'hidden', is_available: false } : p));
    } catch (e: any) { alert('Lỗi: ' + e.message); }
    setLoadingAction(null);
  };

  return (
    <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
      <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex gap-2">
          {['all', 'pending', 'active', 'rejected', 'hidden'].map(f => (
            <button 
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 text-sm font-medium rounded-full capitalize ${filter === f ? 'bg-foreground text-background' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
            >
              {f === 'all' ? 'Tất cả' : f === 'pending' ? 'Chờ duyệt' : f === 'active' ? 'Đang bán' : f === 'rejected' ? 'Từ chối' : 'Đã ẩn'}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-auto max-w-sm flex-1">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Tìm kiếm sản phẩm, cửa hàng..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-muted/50 rounded-lg border border-border focus:border-accent focus:outline-none"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border text-sm text-muted-foreground bg-muted/20">
              <th className="px-6 py-4 font-medium">Sản phẩm</th>
              <th className="px-6 py-4 font-medium">Người Bán</th>
              <th className="px-6 py-4 font-medium">Thông số</th>
              <th className="px-6 py-4 font-medium">Trạng thái</th>
              <th className="px-6 py-4 font-medium text-right">Duyệt</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                  Không tìm thấy sản phẩm nào phù hợp.
                </td>
              </tr>
            ) : (
              filteredProducts.map((p) => (
                <tr key={p.id} className="border-b border-border hover:bg-muted/30">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={p.image_url || 'https://via.placeholder.com/150'} alt="" className="w-12 h-12 rounded object-cover border border-border bg-muted" />
                      <div>
                        <div className="font-bold text-foreground line-clamp-1">{p.name}</div>
                        <div className="text-xs text-muted-foreground">SKU: {p.sku} • {p.category}</div>
                        <div className="text-sm font-bold text-accent mt-0.5">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p.price)}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium">{p.profiles?.store_name || 'Không rõ'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs text-muted-foreground space-y-1">
                      {p.technical_specs && Object.keys(p.technical_specs).length > 0 ? (
                        Object.entries(p.technical_specs).map(([k, v]) => (
                          <div key={k} className="capitalize"><span className="font-medium">{k.replace(/_/g, ' ')}:</span> {String(v)}</div>
                        ))
                      ) : (
                        <div className="text-muted-foreground/50 italic">Không có</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {p.approval_status === 'active' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-bold rounded-md bg-green-100 text-green-700"><Check className="w-3 h-3" /> Duyệt</span>
                    ) : p.approval_status === 'pending' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-bold rounded-md bg-yellow-100 text-yellow-700"><ShieldAlert className="w-3 h-3" /> Chờ</span>
                    ) : p.approval_status === 'hidden' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-bold rounded-md bg-muted text-muted-foreground"><EyeOff className="w-3 h-3" /> Đã ẩn</span>
                    ) : (
                      <div>
                        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-bold rounded-md bg-red-100 text-red-700"><X className="w-3 h-3" /> Bị từ chối</span>
                        {p.rejection_reason && <div className="text-[10px] text-red-600 mt-1 max-w-[150px] line-clamp-2" title={p.rejection_reason}>Lý do: {p.rejection_reason}</div>}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleApprove(p.id)}
                        disabled={loadingAction === p.id || p.approval_status === 'active'}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Duyệt"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleReject(p.id)}
                        disabled={loadingAction === p.id || p.approval_status === 'rejected'}
                        className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Từ chối"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleHide(p.id)}
                        disabled={loadingAction === p.id || p.approval_status === 'hidden'}
                        className="p-2 text-muted-foreground hover:bg-muted rounded-lg transition-colors disabled:opacity-50"
                        title="Ẩn khỏi Store"
                      >
                        <EyeOff className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
