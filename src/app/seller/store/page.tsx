"use client";

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Save, Store } from 'lucide-react';

export default function StoreProfilePage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    store_name: '',
    store_description: '',
    phone_number: '',
    full_name: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.user_metadata) {
        setFormData({
          store_name: user.user_metadata.store_name || '',
          store_description: user.user_metadata.store_description || '',
          phone_number: user.user_metadata.phone_number || '',
          full_name: user.user_metadata.full_name || ''
        });
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      data: {
        store_name: formData.store_name,
        store_description: formData.store_description,
        phone_number: formData.phone_number,
        full_name: formData.full_name
      }
    });

    if (error) {
      alert('Lỗi cập nhật: ' + error.message);
    } else {
      alert('Cập nhật thông tin cửa hàng thành công!');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Hồ sơ Cửa hàng</h1>
        <p className="text-muted-foreground mt-1">Quản lý thông tin hiển thị của cửa hàng bạn trên hệ thống DONE.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-border rounded-2xl shadow-sm p-8 space-y-6">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center">
            <Store className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-bold">{formData.store_name || 'Cửa hàng của bạn'}</h2>
            <p className="text-sm text-muted-foreground">Nhà bán hàng DONE.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Tên cửa hàng</label>
            <input 
              type="text" 
              required
              value={formData.store_name}
              onChange={e => setFormData({...formData, store_name: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border border-border focus:border-accent focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Số điện thoại liên hệ</label>
            <input 
              type="text" 
              required
              value={formData.phone_number}
              onChange={e => setFormData({...formData, phone_number: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border border-border focus:border-accent focus:outline-none"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Mô tả cửa hàng</label>
            <textarea 
              rows={4}
              value={formData.store_description}
              onChange={e => setFormData({...formData, store_description: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border border-border focus:border-accent focus:outline-none"
            />
          </div>
        </div>

        <div className="pt-6 border-t border-border">
          <h3 className="font-bold mb-4">Thông tin người đại diện</h3>
          <div>
            <label className="block text-sm font-medium mb-2">Họ và tên</label>
            <input 
              type="text" 
              required
              value={formData.full_name}
              onChange={e => setFormData({...formData, full_name: e.target.value})}
              className="w-full md:w-1/2 px-4 py-3 rounded-xl border border-border focus:border-accent focus:outline-none"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button 
            type="submit" 
            disabled={loading}
            className="px-8 py-3 bg-orange-600 text-white rounded-full font-bold hover:bg-orange-700 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? 'Đang lưu...' : (
              <>
                <Save className="w-5 h-5" />
                Lưu thay đổi
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
