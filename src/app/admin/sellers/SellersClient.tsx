"use client";

import { useState } from 'react';
import { Search, Store, ShieldCheck, ShieldAlert, Check, X } from 'lucide-react';
import { approveSeller, rejectSeller } from '../../actions/admin';

export default function SellersClient({ initialSellers }: { initialSellers: any[] }) {
  const [sellers, setSellers] = useState(initialSellers);
  const [search, setSearch] = useState('');
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const filteredSellers = sellers.filter(s => 
    (s.store_name?.toLowerCase().includes(search.toLowerCase()) || '') ||
    (s.full_name?.toLowerCase().includes(search.toLowerCase()) || '')
  );

  const handleApprove = async (id: string) => {
    if (!confirm('Duyệt người bán này?')) return;
    setLoadingAction(id);
    try {
      await approveSeller(id);
      setSellers(sellers.map(s => s.id === id ? { ...s, status: 'active' } : s));
    } catch (error: any) {
      alert('Lỗi: ' + error.message);
    }
    setLoadingAction(null);
  };

  const handleReject = async (id: string) => {
    if (!confirm('Từ chối người bán này?')) return;
    setLoadingAction(id);
    try {
      await rejectSeller(id);
      setSellers(sellers.map(s => s.id === id ? { ...s, status: 'rejected' } : s));
    } catch (error: any) {
      alert('Lỗi: ' + error.message);
    }
    setLoadingAction(null);
  };

  return (
    <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
      <div className="p-4 border-b border-border flex gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Tìm kiếm theo tên cửa hàng..." 
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
              <th className="px-6 py-4 font-medium">Cửa hàng</th>
              <th className="px-6 py-4 font-medium">Người đại diện</th>
              <th className="px-6 py-4 font-medium">Số điện thoại</th>
              <th className="px-6 py-4 font-medium">Trạng thái</th>
              <th className="px-6 py-4 font-medium text-right">Duyệt</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {filteredSellers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                  Không có cửa hàng nào.
                </td>
              </tr>
            ) : (
              filteredSellers.map((s) => (
                <tr key={s.id} className="border-b border-border hover:bg-muted/30">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center">
                        <Store className="w-5 h-5" />
                      </div>
                      <span className="font-bold text-foreground">{s.store_name || 'Chưa cập nhật'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{s.full_name || 'Chưa cập nhật'}</td>
                  <td className="px-6 py-4">{s.phone_number || 'Chưa có'}</td>
                  <td className="px-6 py-4">
                    {s.status === 'active' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-bold rounded-md bg-green-100 text-green-700">
                        <ShieldCheck className="w-3 h-3" />
                        Đã duyệt
                      </span>
                    ) : s.status === 'pending' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-bold rounded-md bg-yellow-100 text-yellow-700">
                        <ShieldAlert className="w-3 h-3" />
                        Chờ duyệt
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-bold rounded-md bg-red-100 text-red-700">
                        <X className="w-3 h-3" />
                        Từ chối
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleApprove(s.id)}
                        disabled={loadingAction === s.id || s.status === 'active'}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Duyệt"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleReject(s.id)}
                        disabled={loadingAction === s.id || s.status === 'rejected'}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Từ chối"
                      >
                        <X className="w-4 h-4" />
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
