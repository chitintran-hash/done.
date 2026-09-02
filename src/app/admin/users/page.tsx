"use client";

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Search, ShieldAlert, UserCheck } from 'lucide-react';

export default function AdminUsersPage() {
  const supabase = createClient();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Since we don't have the Service Role Key exposed to the client to fetch ALL auth users easily
  // without a backend route, we'll fetch from a generic public query or just show the current session's profile as a demo.
  // In a real app, we'd have a `profiles` table synced via Triggers.
  
  useEffect(() => {
    // For MVP, since we don't have a profiles table ready and we can't query auth.users directly from client,
    // we'll just show the mock data + current user.
    const fetchUsers = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      const mockUsers = [
        { id: '1', email: 'tranchitin2006@gmail.com', role: 'Admin', status: 'Active', last_sign_in: 'Vừa xong' },
        { id: '2', email: 'seller_gearvn@gmail.com', role: 'Seller', status: 'Active', last_sign_in: '2 giờ trước' },
        { id: '3', email: 'buyer_test@gmail.com', role: 'Buyer', status: 'Active', last_sign_in: '1 ngày trước' },
      ];

      if (user && user.email !== 'tranchitin2006@gmail.com') {
        mockUsers.push({ id: user.id, email: user.email || '', role: 'Buyer', status: 'Active', last_sign_in: 'Vừa xong' });
      }
      
      setUsers(mockUsers);
      setLoading(false);
    };

    fetchUsers();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold">Quản lý Tài Khoản</h1>
          <p className="text-muted-foreground mt-2">Theo dõi và phân quyền người dùng trong hệ thống DONE.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Tìm kiếm email người dùng..." 
              className="w-full pl-10 pr-4 py-2 bg-muted/50 rounded-lg border border-border"
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
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="border-b border-border hover:bg-muted/30">
                    <td className="px-6 py-4 font-medium">{u.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-bold rounded-md ${u.role === 'Admin' ? 'bg-purple-100 text-purple-700' : u.role === 'Seller' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-green-600 font-medium">
                        <UserCheck className="w-4 h-4" /> {u.status}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{u.last_sign_in}</td>
                    <td className="px-6 py-4 text-right">
                      <button className="px-3 py-1.5 bg-muted text-foreground hover:bg-border transition-colors rounded-lg text-xs font-medium">
                        Đổi quyền
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="p-4 bg-blue-50 text-blue-800 rounded-xl border border-blue-200 flex items-start gap-3 text-sm">
        <ShieldAlert className="w-5 h-5 shrink-0" />
        <div>
          <strong>Lưu ý bảo mật:</strong> Để xem toàn bộ danh sách User từ Supabase Auth thực tế, bạn cần thiết lập Webhook (Triggers) để đồng bộ User từ lược đồ <code>auth.users</code> sang lược đồ <code>public.profiles</code>. Danh sách trên là danh sách giả lập để đảm bảo an toàn bảo mật cho MVP.
        </div>
      </div>
    </div>
  );
}
