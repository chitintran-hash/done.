"use client";

import { useEffect, useState, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Save, Store, UploadCloud, ImageIcon, Loader2 } from 'lucide-react';

export default function StoreProfilePage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    store_name: '',
    store_description: '',
    phone_number: '',
    full_name: '',
    address: '',
    pickup_address: '',
    logo_url: '',
    cover_url: '',
    store_email: ''
  });
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.user_metadata) {
        setFormData({
          store_name: user.user_metadata.store_name || '',
          store_description: user.user_metadata.store_description || '',
          phone_number: user.user_metadata.phone_number || '',
          full_name: user.user_metadata.full_name || '',
          address: user.user_metadata.address || '',
          pickup_address: user.user_metadata.pickup_address || '',
          logo_url: user.user_metadata.logo_url || '',
          cover_url: user.user_metadata.cover_url || '',
          store_email: user.user_metadata.store_email || ''
        });
      }
    };
    fetchProfile();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'cover') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === 'logo') setUploadingLogo(true);
    else setUploadingCover(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('done-stores')
        .upload(`${type}s/${fileName}`, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('done-stores')
        .getPublicUrl(`${type}s/${fileName}`);

      if (type === 'logo') {
        setFormData(prev => ({ ...prev, logo_url: publicUrl }));
      } else {
        setFormData(prev => ({ ...prev, cover_url: publicUrl }));
      }
    } catch (error: any) {
      alert(`Lỗi tải ảnh: ${error.message}`);
    } finally {
      if (type === 'logo') setUploadingLogo(false);
      else setUploadingCover(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error: authError } = await supabase.auth.updateUser({
      data: {
        store_name: formData.store_name,
        store_description: formData.store_description,
        phone_number: formData.phone_number,
        full_name: formData.full_name,
        address: formData.address,
        pickup_address: formData.pickup_address,
        logo_url: formData.logo_url,
        cover_url: formData.cover_url,
        store_email: formData.store_email
      }
    });

    if (authError) {
      alert('Lỗi cập nhật metadata: ' + authError.message);
      setLoading(false);
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { error: dbError } = await supabase
        .from('profiles')
        .update({
          store_name: formData.store_name,
          store_description: formData.store_description,
          phone_number: formData.phone_number,
          address: formData.address,
          pickup_address: formData.pickup_address,
          logo_url: formData.logo_url,
          cover_url: formData.cover_url,
          store_email: formData.store_email
        })
        .eq('id', user.id);
        
      if (dbError) {
        alert('Lỗi lưu CSDL profiles (Bạn đã chạy tệp SQL để tạo cột chưa?): ' + dbError.message);
        setLoading(false);
        return;
      }
    }
    alert('Cập nhật hồ sơ cửa hàng thành công!');
    setLoading(false);
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Hồ sơ Cửa hàng</h1>
        <p className="text-muted-foreground mt-1">Quản lý thông tin hiển thị của cửa hàng bạn trên hệ thống DONE.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-border rounded-2xl shadow-sm p-8 space-y-6">
        <div className="flex items-center gap-6 mb-8">
          <div className="relative group cursor-pointer" onClick={() => logoInputRef.current?.click()}>
            <div className="w-24 h-24 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center overflow-hidden border-2 border-border group-hover:border-accent transition-colors">
              {uploadingLogo ? (
                <Loader2 className="w-8 h-8 animate-spin" />
              ) : formData.logo_url ? (
                <img src={formData.logo_url} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <Store className="w-10 h-10" />
              )}
            </div>
            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <UploadCloud className="w-6 h-6 text-white" />
            </div>
            <input type="file" hidden accept="image/*" ref={logoInputRef} onChange={e => handleUpload(e, 'logo')} />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{formData.store_name || 'Cửa hàng của bạn'}</h2>
            <p className="text-sm text-muted-foreground mt-1">Cập nhật Logo để người mua nhận diện thương hiệu.</p>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Ảnh bìa cửa hàng (Cover)</label>
          <div 
            onClick={() => coverInputRef.current?.click()}
            className="w-full h-40 bg-muted/30 border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-accent hover:bg-muted/50 transition-colors overflow-hidden relative"
          >
            {uploadingCover ? (
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            ) : formData.cover_url ? (
              <img src={formData.cover_url} alt="Cover" className="w-full h-full object-cover" />
            ) : (
              <>
                <ImageIcon className="w-8 h-8 text-muted-foreground mb-2" />
                <span className="text-sm text-muted-foreground">Nhấn để tải lên ảnh bìa (Tỷ lệ 16:9)</span>
              </>
            )}
            <input type="file" hidden accept="image/*" ref={coverInputRef} onChange={e => handleUpload(e, 'cover')} />
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
            <label className="block text-sm font-medium mb-2">Số điện thoại cửa hàng</label>
            <input 
              type="text" 
              required
              value={formData.phone_number}
              onChange={e => setFormData({...formData, phone_number: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border border-border focus:border-accent focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email cửa hàng (Hiển thị công khai)</label>
            <input 
              type="email" 
              value={formData.store_email}
              onChange={e => setFormData({...formData, store_email: e.target.value})}
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
          <div>
            <label className="block text-sm font-medium mb-2">Địa chỉ cửa hàng</label>
            <input 
              type="text" 
              value={formData.address}
              onChange={e => setFormData({...formData, address: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border border-border focus:border-accent focus:outline-none"
              placeholder="Ví dụ: 123 Đường A, Quận B, TP.HCM"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Địa chỉ lấy hàng (Kho)</label>
            <input 
              type="text" 
              value={formData.pickup_address}
              onChange={e => setFormData({...formData, pickup_address: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border border-border focus:border-accent focus:outline-none"
              placeholder="Để trống nếu giống địa chỉ cửa hàng"
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
