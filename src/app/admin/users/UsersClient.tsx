"use client";

import { useState } from 'react';
import { 
  Search, 
  Users, 
  Lock, 
  Unlock, 
  Trash2, 
  ShoppingBag, 
  Calendar, 
  Eye, 
  X,
  CreditCard,
  Mail,
  Phone
} from 'lucide-react';
import { toggleCustomerStatus, deleteCustomerAccount } from '@/app/actions/admin';

export default function UsersClient({ initialUsers }: { initialUsers: any[] }) {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const formatVND = (num: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
  };

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(search.toLowerCase()) || 
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.phoneNumber?.includes(search)
  );

  const handleToggleStatus = async (user: any) => {
    const actionName = user.status === 'active' ? 'KHÓA' : 'MỞ KHÓA';
    if (!confirm(`Bạn có chắc muốn ${actionName} tài khoản ${user.name}?`)) return;

    setLoadingId(user.id);
    try {
      const res = await toggleCustomerStatus(user.id, user.status);
      setUsers(users.map(u => u.id === user.id ? { ...u, status: res.nextStatus } : u));
      if (selectedCustomer && selectedCustomer.id === user.id) {
        setSelectedCustomer((prev: any) => ({ ...prev, status: res.nextStatus }));
      }
    } catch (e: any) {
      alert("Lỗi: " + e.message);
    }
    setLoadingId(null);
  };

  const handleDeleteCustomer = async (user: any) => {
    if (!confirm(`Bạn có chắc chắn muốn XÓA VĨNH VIỄN tài khoản ${user.name} (${user.email}) khỏi hệ thống?`)) return;

    setLoadingId(user.id);
    try {
      await deleteCustomerAccount(user.id);
      setUsers(prev => prev.filter(u => u.id !== user.id));
      if (selectedCustomer?.id === user.id) setSelectedCustomer(null);
      alert("Đã xóa tài khoản khách hàng thành công!");
    } catch (e: any) {
      alert("Lỗi xóa tài khoản: " + e.message);
    }
    setLoadingId(null);
  };

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="bg-white p-5 rounded-3xl border border-[#DDD8D2] shadow-sm flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6F625E]" />
          <input 
            type="text" 
            placeholder="Tìm theo tên khách, email, số điện thoại..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#F7F6F2] rounded-xl text-xs border border-[#DDD8D2] focus:outline-none focus:border-[#4A2A25]"
          />
        </div>

        <div className="text-xs text-[#6F625E]">
          Tổng cộng: <strong>{filteredUsers.length}</strong> khách hàng
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-3xl border border-[#DDD8D2] shadow-sm overflow-hidden">
        {filteredUsers.length === 0 ? (
          <div className="p-16 text-center text-[#6F625E]">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-30 text-[#4A2A25]" />
            <div className="font-bold text-sm text-[#201817]">Không tìm thấy khách hàng nào</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7F6F2] border-b border-[#DDD8D2] text-[#6F625E]">
                <tr>
                  <th className="py-4 px-6 font-semibold">Khách Hàng</th>
                  <th className="py-4 px-4 font-semibold">Liên Hệ</th>
                  <th className="py-4 px-4 font-semibold">Ngày Đăng Ký</th>
                  <th className="py-4 px-4 font-semibold">Đơn Hàng</th>
                  <th className="py-4 px-4 font-semibold">Tổng Chi Tiêu (LTV)</th>
                  <th className="py-4 px-4 font-semibold">Trạng Thái</th>
                  <th className="py-4 px-6 font-semibold text-right">Hành Động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DDD8D2]/60">
                {filteredUsers.map(user => (
                  <tr key={user.id} className="hover:bg-[#F7F6F2]/40 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-bold text-[#201817] text-sm">{user.name}</div>
                      <div className="text-[11px] text-[#6F625E] font-mono">ID: {user.id.slice(0, 8)}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-[#201817] font-medium">{user.email}</div>
                      <div className="text-[11px] text-[#6F625E]">{user.phoneNumber}</div>
                    </td>
                    <td className="py-4 px-4 text-[#6F625E]">
                      {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="py-4 px-4 font-bold text-sm text-[#201817]">
                      {user.totalOrders} đơn
                    </td>
                    <td className="py-4 px-4 font-black text-sm text-[#4A2A25]">
                      {formatVND(user.totalSpent)}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                        user.status === 'active' 
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-200' 
                          : 'bg-rose-100 text-rose-800 border-rose-200'
                      }`}>
                        {user.status === 'active' ? 'Đang hoạt động' : 'Đã khóa'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        onClick={() => setSelectedCustomer(user)}
                        className="px-3 py-1.5 bg-[#EDECEA] text-[#3A211E] rounded-xl text-xs font-semibold hover:bg-[#DDD8D2]"
                      >
                        Lịch Sử
                      </button>
                      <button
                        onClick={() => handleToggleStatus(user)}
                        disabled={loadingId === user.id}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                          user.status === 'active'
                            ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                            : 'bg-emerald-600 text-white hover:bg-emerald-700'
                        }`}
                      >
                        {user.status === 'active' ? 'Khóa' : 'Mở Khóa'}
                      </button>
                      <button
                        onClick={() => handleDeleteCustomer(user)}
                        disabled={loadingId === user.id}
                        className="px-3 py-1.5 bg-rose-100 text-rose-800 rounded-xl text-xs font-semibold hover:bg-rose-200 transition-colors border border-rose-200 inline-flex items-center gap-1"
                        title="Xóa vĩnh viễn tài khoản"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CUSTOMER ORDER HISTORY MODAL */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-[#DDD8D2] shadow-2xl p-6 space-y-5 text-xs">
            <div className="flex justify-between items-center border-b border-[#DDD8D2] pb-3">
              <div>
                <h3 className="font-bold text-[#3A211E] text-base">{selectedCustomer.name}</h3>
                <div className="text-[11px] text-[#6F625E]">{selectedCustomer.email}</div>
              </div>
              <button onClick={() => setSelectedCustomer(null)} className="text-[#6F625E]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 bg-[#F7F6F2] p-4 rounded-2xl border border-[#DDD8D2]">
              <div>
                <div className="text-[#6F625E]">Tổng đơn hàng:</div>
                <div className="font-bold text-base text-[#201817]">{selectedCustomer.totalOrders} đơn</div>
              </div>
              <div>
                <div className="text-[#6F625E]">Tổng chi tiêu:</div>
                <div className="font-black text-base text-[#4A2A25]">{formatVND(selectedCustomer.totalSpent)}</div>
              </div>
            </div>

            <div>
              <div className="font-bold text-[#3A211E] mb-2">Lịch Sử Các Đơn Hàng Đã Mua:</div>
              {selectedCustomer.orders.length === 0 ? (
                <div className="p-8 text-center text-[#6F625E] bg-[#F7F6F2] rounded-xl">
                  Khách hàng này chưa có đơn hàng nào được ghi nhận.
                </div>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {selectedCustomer.orders.map((o: any) => (
                    <div key={o.id} className="p-3 rounded-xl bg-[#F7F6F2] border border-[#DDD8D2] flex justify-between items-center">
                      <div>
                        <div className="font-mono font-bold text-[#4A2A25]">#{o.id.slice(0, 8).toUpperCase()}</div>
                        <div className="text-[11px] text-[#6F625E]">
                          {new Date(o.created_at).toLocaleDateString('vi-VN')} - Trạng thái: {o.status}
                        </div>
                      </div>
                      <div className="font-black text-sm text-[#201817]">
                        {formatVND(o.total_price)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2 border-t border-[#DDD8D2]">
              <button 
                onClick={() => setSelectedCustomer(null)}
                className="px-5 py-2 bg-[#EDECEA] text-[#3A211E] rounded-xl font-bold"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
