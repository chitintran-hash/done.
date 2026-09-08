"use client";

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Search, Store, ShieldCheck } from 'lucide-react';

export default function AdminSellersPage() {
  const supabase = createClient();
  const [sellers, setSellers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSellers();
  }, []);

  const fetchSellers = async () => {
    // Thử fetch từ bảng profiles nếu user đã tạo bằng SQL
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'seller');
    
    if (!error && data && data.length > 0) {
      setSellers(data);
    } else {
      // Fallback mock data nếu bảng profiles trống hoặc chưa tạo
      setSellers([
        {
          id: 'mock-1',
          store_name: 'GearVN',
          email: 'seller@gearvn.com',
          phone_number: '0987654321',
          store_address: 'Hồ Chí Minh'
        }
      ]);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold">Quản lý Nhà Bán (Sellers)</h1>
          <p className="text-muted-foreground mt-2">Duyệt và theo dõi hoạt động của các cửa hàng trên hệ thống.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Tìm kiếm theo tên cửa hàng hoặc email..." 
              className="w-full pl-10 pr-4 py-2 bg-muted/50 rounded-lg border border-border focus:border-accent focus:outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border text-sm text-muted-foreground bg-muted/20">
                <th className="px-6 py-4 font-medium">Cửa hàng</th>
                <th className="px-6 py-4 font-medium">Email</th>
                <th className="px-6 py-4 font-medium">Số điện thoại</th>
                <th className="px-6 py-4 font-medium text-right">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : sellers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                    Không có cửa hàng nào.
                  </td>
                </tr>
              ) : (
                sellers.map((s) => (
                  <tr key={s.id} className="border-b border-border hover:bg-muted/30">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center">
                          <Store className="w-5 h-5" />
                        </div>
                        <span className="font-bold">{s.store_name || 'Chưa cập nhật'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">{s.email}</td>
                    <td className="px-6 py-4">{s.phone_number || 'Chưa có'}</td>
                    <td className="px-6 py-4 text-right">
                      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-bold rounded-md bg-green-100 text-green-700">
                        <ShieldCheck className="w-3 h-3" />
                        Active
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
