"use client";

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { UploadCloud, ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

export default function CreateProductPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '', sku: '', brand: '', category: 'desk', price: '', description: '',
    seller_id: 'seller-internal', delivery_days: '3',
    // Specs
    width: '', depth: '', height: '', max_load: '', vesa_supported: '',
    supported_monitor_size: '', clamp_thickness_max: '', desk_thickness: '',
    style: ''
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = '';
      if (imageFile) {
        // 1. Upload to Supabase Storage
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('done-products')
          .upload(`products/${fileName}`, imageFile);

        if (uploadError) throw new Error('Lỗi upload ảnh: ' + uploadError.message);

        // 2. Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('done-products')
          .getPublicUrl(`products/${fileName}`);
        
        imageUrl = publicUrl;
      }

      // 3. Format data
      const parseNumber = (val: string) => val ? Number(val) : null;
      const parseArray = (val: string) => val ? val.split(',').map(s => s.trim()) : null;

      const productPayload = {
        name: formData.name,
        sku: formData.sku,
        brand: formData.brand,
        category: formData.category,
        price: parseNumber(formData.price) || 0,
        description: formData.description,
        seller_id: formData.seller_id,
        delivery_days: parseNumber(formData.delivery_days) || 1,
        image: imageUrl || 'https://via.placeholder.com/400',
        
        width: parseNumber(formData.width),
        depth: parseNumber(formData.depth),
        height: parseNumber(formData.height),
        max_load: parseNumber(formData.max_load),
        vesa_supported: parseArray(formData.vesa_supported),
        supported_monitor_size: parseNumber(formData.supported_monitor_size),
        clamp_thickness_max: parseNumber(formData.clamp_thickness_max),
        desk_thickness: parseNumber(formData.desk_thickness),
        style: parseArray(formData.style),
      };

      // 4. Insert into DB
      const { error: dbError } = await supabase
        .from('products')
        .insert([productPayload]);

      if (dbError) throw new Error('Lỗi lưu Database: ' + dbError.message);

      alert('Đăng sản phẩm thành công!');
      router.push('/admin/products');

    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/products" className="p-2 hover:bg-muted rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-3xl font-bold">Thêm Sản Phẩm Mới</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-3xl border border-border shadow-sm">
        {/* Basic Info */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold border-b border-border pb-2">Thông tin cơ bản</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Tên sản phẩm *</label>
              <input required type="text" className="w-full p-3 bg-muted/50 rounded-xl border border-border" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">SKU *</label>
              <input required type="text" className="w-full p-3 bg-muted/50 rounded-xl border border-border" value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Thương hiệu *</label>
              <input required type="text" className="w-full p-3 bg-muted/50 rounded-xl border border-border" value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Danh mục *</label>
              <select className="w-full p-3 bg-muted/50 rounded-xl border border-border" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                <option value="desk">Bàn (Desk)</option>
                <option value="chair">Ghế (Chair)</option>
                <option value="monitor_arm">Tay đỡ (Monitor Arm)</option>
                <option value="desk_lamp">Đèn (Desk Lamp)</option>
                <option value="cable_management">Quản lý dây (Cable)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Giá (VNĐ) *</label>
              <input required type="number" className="w-full p-3 bg-muted/50 rounded-xl border border-border" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Mô tả ngắn</label>
              <input type="text" className="w-full p-3 bg-muted/50 rounded-xl border border-border" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
            </div>
          </div>
        </div>

        {/* Image Upload */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold border-b border-border pb-2">Hình ảnh sản phẩm *</h2>
          <div className="flex items-center gap-6">
            <div className="w-40 h-40 border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center bg-muted/20 relative overflow-hidden group">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <>
                  <UploadCloud className="w-8 h-8 text-muted-foreground mb-2" />
                  <span className="text-sm text-muted-foreground font-medium">Tải ảnh lên</span>
                </>
              )}
              <input required type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            </div>
            <p className="text-sm text-muted-foreground flex-1">
              Hệ thống sẽ tự động tải ảnh này lên đám mây <b>Supabase Storage</b> (bucket: done-products) và lưu đường dẫn công khai vào cơ sở dữ liệu.
            </p>
          </div>
        </div>

        {/* Specs */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold border-b border-border pb-2">Thông số kỹ thuật (Dành cho Compatibility Engine)</h2>
          <p className="text-xs text-muted-foreground mb-4">Lưu ý: Bỏ trống nếu sản phẩm không có chỉ số này (Ví dụ: Đèn thì không có chuẩn VESA).</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Width (cm)</label>
              <input type="number" className="w-full p-3 bg-muted/50 rounded-xl border border-border" value={formData.width} onChange={e => setFormData({...formData, width: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Depth (cm)</label>
              <input type="number" className="w-full p-3 bg-muted/50 rounded-xl border border-border" value={formData.depth} onChange={e => setFormData({...formData, depth: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Height (cm)</label>
              <input type="number" className="w-full p-3 bg-muted/50 rounded-xl border border-border" value={formData.height} onChange={e => setFormData({...formData, height: e.target.value})} />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Độ dày mặt bàn (Desk Thickness) (cm)</label>
              <input type="number" className="w-full p-3 bg-muted/50 rounded-xl border border-border" value={formData.desk_thickness} onChange={e => setFormData({...formData, desk_thickness: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Ngàm kẹp tối đa (Clamp Max) (cm)</label>
              <input type="number" className="w-full p-3 bg-muted/50 rounded-xl border border-border" value={formData.clamp_thickness_max} onChange={e => setFormData({...formData, clamp_thickness_max: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tải trọng tối đa (Max Load) (kg)</label>
              <input type="number" className="w-full p-3 bg-muted/50 rounded-xl border border-border" value={formData.max_load} onChange={e => setFormData({...formData, max_load: e.target.value})} />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Màn hình tối đa (inches)</label>
              <input type="number" className="w-full p-3 bg-muted/50 rounded-xl border border-border" value={formData.supported_monitor_size} onChange={e => setFormData({...formData, supported_monitor_size: e.target.value})} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">VESA hỗ trợ (cách nhau dấu phẩy)</label>
              <input type="text" placeholder="VD: 75x75, 100x100" className="w-full p-3 bg-muted/50 rounded-xl border border-border" value={formData.vesa_supported} onChange={e => setFormData({...formData, vesa_supported: e.target.value})} />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-border">
          <button 
            type="submit" 
            disabled={loading}
            className="px-8 py-4 bg-foreground text-background rounded-full font-bold text-lg hover:bg-foreground/90 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? 'Đang lưu & Upload ảnh...' : (
              <>
                <Save className="w-5 h-5" />
                Lưu vào cơ sở dữ liệu
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
