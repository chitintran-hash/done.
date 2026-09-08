"use client";

import { useState } from 'react';
import { Search, ShieldAlert, UserCheck, UserX, Trash2, Ban } from 'lucide-react';
import { suspendUser, activateUser, deleteUser } from '../../actions/admin';

export default function UsersClient({ initialUsers }: { initialUsers: any[] }) {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState('');
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const filteredUsers = users.filter(u => 
    u.email?.toLowerCase().includes(search.toLowerCase()) || 
    u.full_name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSuspend = async (id: string) => {
    if (!confirm('Bạn có chắc muốn KHÓA tài khoản này? Người dùng sẽ không thể đăng nhập.')) return;
    setLoadingAction(id);
    try {
      await suspendUser(id);
      setUsers(users.map(u => u.id === id ? { ...u, status: 'suspended' } : u));
    } catch (e: any) {
      alert('Lỗi: ' + e.message);
    }
    setLoadingAction(null);
  };

  const handleActivate = async (id: string) => {
    setLoadingAction(id);
    try {
      await activateUser(id);
      setUsers(users.map(u => u.id === id ? { ...u, status: 'active' } : u));
    } catch (e: any) {
      alert('Lỗi: ' + e.message);
    }
    setLoadingAction(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('CẢNH BÁO NGUY HIỂM: Bạn có chắc muốn XÓA VĨNH VIỄN tài khoản này?\nHành động này sẽ xóa quyền truy cập của người dùng khỏi DONE. Họ có thể đăng ký lại bằng email này sau.')) return;
    setLoadingAction(id);
    try {
      await deleteUser(id);
      setUsers(users.filter(u => u.id !== id));
    } catch (e: any) {
      alert('Lỗi: ' + e.message);
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
            placeholder="Tìm kiếm email người dùng..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-muted/50 rounded-lg border border-border focus:outline-none focus:border-accent"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border text-sm text-muted-foreground bg-muted/20">
              <th className="px-6 py-4 font-medium">Tài khoản (Email)</th>
              <th className="px-6 py-4 font-medium">Vai trò (Role)</th>
              <th className="px-6 py-4 font-medium">Trạng thái</th>
              <th className="px-6 py-4 font-medium">Lần đăng nhập cuối</th>
              <th className="px-6 py-4 font-medium text-right">Hành động</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                  Không tìm thấy người dùng nào.
                </td>
              </tr>
            ) : (
              filteredUsers.map((u) => (
                <tr key={u.id} className="border-b border-border hover:bg-muted/30">
                  <td className="px-6 py-4">
                    <div className="font-medium">{u.email}</div>
                    {u.full_name && <div className="text-xs text-muted-foreground">{u.full_name}</div>}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-bold rounded-md ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : u.role === 'seller' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                      {u.role.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {u.status === 'active' ? (
                      <div className="flex items-center gap-2 text-green-600 font-medium">
                        <UserCheck className="w-4 h-4" /> Hoạt động
                      </div>
                    ) : u.status === 'suspended' ? (
                      <div className="flex items-center gap-2 text-red-600 font-medium">
                        <Ban className="w-4 h-4" /> Bị khóa
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-yellow-600 font-medium">
                        {u.status}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {u.last_sign_in_at ? new Date(u.last_sign_in_at).toLocaleDateString('vi-VN') : 'Chưa đăng nhập'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      {u.status === 'suspended' ? (
                        <button 
                          onClick={() => handleActivate(u.id)}
                          disabled={loadingAction === u.id || u.email === 'tranchitin2006@gmail.com'}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Mở khóa"
                        >
                          <UserCheck className="w-4 h-4" />
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleSuspend(u.id)}
                          disabled={loadingAction === u.id || u.email === 'tranchitin2006@gmail.com'}
                          className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Khóa tài khoản"
                        >
                          <Ban className="w-4 h-4" />
                        </button>
                      )}
                      
                      <button 
                        onClick={() => handleDelete(u.id)}
                        disabled={loadingAction === u.id || u.email === 'tranchitin2006@gmail.com'}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Xóa tài khoản"
                      >
                        <Trash2 className="w-4 h-4" />
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
