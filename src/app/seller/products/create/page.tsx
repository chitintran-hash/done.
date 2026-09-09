"use client";

import { useState, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { UploadCloud, ArrowLeft, Save, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { parseVND, formatInputVND } from '@/lib/utils/currency';
import { CATEGORIES } from '@/lib/constants';

function generateSKU(category: string) {
  return category.toUpperCase().substring(0, 3) + '-' + Math.floor(10000 + Math.random() * 90000);
}

export default function SellerCreateProductPage() {
  const router = useRouter();
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: 'furniture',
    price: '',
    description: '',
    image_url: '',
    image_urls: [] as string[],
    stock: '',
    delivery_days: '3'
  });

  // Dynamic Specs State
  const [specs, setSpecs] = useState<Record<string, any>>({});

  const handleSpecChange = (key: string, value: any) => {
    setSpecs(prev => ({ ...prev, [key]: value }));
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    if (formData.image_urls.length + files.length > 5) {
      alert("Chỉ được tải lên tối đa 5 ảnh.");
      return;
    }
    
    setUploading(true);
    try {
      const newUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
        
        const { error } = await supabase.storage.from('done-products').upload(`products/${fileName}`, file);
        if (error) throw error;
        
        const { data: { publicUrl } } = supabase.storage.from('done-products').getPublicUrl(`products/${fileName}`);
        newUrls.push(publicUrl);
      }
      
      setFormData(prev => ({ 
        ...prev, 
        image_urls: [...prev.image_urls, ...newUrls],
        image_url: prev.image_url || newUrls[0] // Set first image as main if empty
      }));
    } catch (error: any) {
      alert('Lỗi upload ảnh: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const generateSKU = (category: string) => {
    const prefix = category.substring(0, 3).toUpperCase();
    const timePart = Date.now().toString(36).toUpperCase();
    const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}-${timePart}-${randomPart}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Vui lòng đăng nhập.');

      if (formData.image_urls.length === 0) throw new Error('Vui lòng tải lên ít nhất 1 ảnh sản phẩm.');

      const autoSku = generateSKU(formData.category);

      const productPayload = {
        name: formData.name,
        sku: autoSku, // Auto generated
        brand: formData.brand,
        category: formData.category,
        price: parseVND(formData.price),
        description: formData.description,
        seller_id: user.id,
        delivery_days: parseInt(formData.delivery_days) || 1,
        stock: parseInt(formData.stock) || 0,
        image_url: formData.image_url,
        image_urls: formData.image_urls,
        approval_status: 'pending', // Pending Admin review
        is_available: false,
        technical_specs: specs, // JSONB
      };

      const { error: dbError } = await supabase
        .from('products')
        .insert([productPayload]);

      if (dbError) throw new Error('Lỗi lưu Database: ' + dbError.message);

      alert('Đăng sản phẩm thành công! Sản phẩm đang chờ Admin duyệt.');
      router.push('/seller/products');

    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Render Dynamic Form based on Category
  const renderDynamicSpecs = () => {
    const c = formData.category;

    if (c === 'monitor') return (
      <>
        <InputField label="Kích thước màn hình (inch)" type="number" val={specs.screen_size} onChange={(v) => handleSpecChange('screen_size', v)} />
        <InputField label="Độ phân giải (VD: 4K, 2K, FHD)" val={specs.resolution} onChange={(v) => handleSpecChange('resolution', v)} />
        <InputField label="Tần số quét (Hz)" type="number" val={specs.refresh_rate} onChange={(v) => handleSpecChange('refresh_rate', v)} />
        <InputField label="Trọng lượng (kg)" type="number" val={specs.weight} onChange={(v) => handleSpecChange('weight', v)} />
        <InputField label="Chuẩn VESA hỗ trợ (VD: 75x75, 100x100)" val={specs.vesa_supported} onChange={(v) => handleSpecChange('vesa_supported', v)} placeholder="Cách nhau bằng dấu phẩy" />
      </>
    );

    if (c === 'monitor_arm') return (
      <>
        <InputField label="Chuẩn VESA hỗ trợ (VD: 75x75, 100x100)" val={specs.vesa_supported} onChange={(v) => handleSpecChange('vesa_supported', v)} />
        <InputField label="Tải trọng tối thiểu (kg)" type="number" val={specs.min_load} onChange={(v) => handleSpecChange('min_load', v)} />
        <InputField label="Tải trọng tối đa (kg)" type="number" val={specs.max_load} onChange={(v) => handleSpecChange('max_load', v)} />
        <InputField label="Kích thước màn hình hỗ trợ (inch)" type="number" val={specs.supported_monitor_size} onChange={(v) => handleSpecChange('supported_monitor_size', v)} />
        <InputField label="Độ dày bàn hỗ trợ (cm)" type="number" val={specs.clamp_thickness_max} onChange={(v) => handleSpecChange('clamp_thickness_max', v)} />
        <InputField label="Kiểu gắn (Kẹp bàn / Xuyên lỗ)" val={specs.mount_type} onChange={(v) => handleSpecChange('mount_type', v)} />
      </>
    );

    if (c === 'desk') return (
      <>
        <InputField label="Chiều rộng (cm)" type="number" val={specs.width} onChange={(v) => handleSpecChange('width', v)} />
        <InputField label="Chiều sâu (cm)" type="number" val={specs.depth} onChange={(v) => handleSpecChange('depth', v)} />
        <InputField label="Chiều cao (cm)" type="number" val={specs.height} onChange={(v) => handleSpecChange('height', v)} />
        <InputField label="Độ dày mặt bàn (cm)" type="number" val={specs.desk_thickness} onChange={(v) => handleSpecChange('desk_thickness', v)} />
        <InputField label="Tải trọng tối đa (kg)" type="number" val={specs.max_load} onChange={(v) => handleSpecChange('max_load', v)} />
      </>
    );

    if (c === 'chair') return (
      <>
        <InputField label="Tải trọng tối đa (kg)" type="number" val={specs.max_load} onChange={(v) => handleSpecChange('max_load', v)} />
        <InputField label="Chiều cao ghế tối đa (cm)" type="number" val={specs.height} onChange={(v) => handleSpecChange('height', v)} />
        <div className="flex gap-4 items-center h-full pt-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={specs.has_armrest || false} onChange={(e) => handleSpecChange('has_armrest', e.target.checked)} />
            <span className="text-sm">Có tay vịn (Armrest)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={specs.has_lumbar_support || false} onChange={(e) => handleSpecChange('has_lumbar_support', e.target.checked)} />
            <span className="text-sm">Hỗ trợ thắt lưng (Lumbar)</span>
          </label>
        </div>
      </>
    );

    if (c === 'desk_lamp') return (
      <>
        <InputField label="Công suất (W)" type="number" val={specs.power} onChange={(v) => handleSpecChange('power', v)} />
        <InputField label="Nhiệt độ màu (K)" val={specs.color_temperature} onChange={(v) => handleSpecChange('color_temperature', v)} placeholder="VD: 3000K-6000K" />
        <InputField label="Kiểu gắn (Để bàn / Kẹp bàn)" val={specs.mount_type} onChange={(v) => handleSpecChange('mount_type', v)} />
      </>
    );

    if (c === 'laptop_stand') return (
      <>
        <InputField label="Kích thước laptop hỗ trợ (inch)" type="number" val={specs.supported_laptop_size} onChange={(v) => handleSpecChange('supported_laptop_size', v)} />
        <InputField label="Tải trọng (kg)" type="number" val={specs.max_load} onChange={(v) => handleSpecChange('max_load', v)} />
        <InputField label="Chiều cao (cm)" type="number" val={specs.height} onChange={(v) => handleSpecChange('height', v)} />
        <label className="flex items-center gap-2 pt-6 cursor-pointer">
          <input type="checkbox" checked={specs.adjustable || false} onChange={(e) => handleSpecChange('adjustable', e.target.checked)} />
          <span className="text-sm">Khả năng điều chỉnh (Adjustable)</span>
        </label>
      </>
    );

    if (c === 'docking_station' || c === 'usb_hub') return (
      <>
        <InputField label="Loại cổng kết nối đầu vào (Host)" val={specs.input_ports} onChange={(v) => handleSpecChange('input_ports', v)} />
        <InputField label="Các cổng đầu ra (Outputs)" val={specs.output_ports} placeholder="VD: 2x USB-A, 1x HDMI..." onChange={(v) => handleSpecChange('output_ports', v)} />
        <InputField label="Công suất Power Delivery (W)" type="number" val={specs.power_delivery} onChange={(v) => handleSpecChange('power_delivery', v)} />
      </>
    );

    // Default for accessories
    return (
      <div className="md:col-span-3">
        <p className="text-muted-foreground text-sm">Danh mục này không yêu cầu thông số kỹ thuật đặc biệt. Bạn có thể bỏ qua phần này.</p>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/seller/products" className="p-2 hover:bg-muted rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-3xl font-bold">Thêm Sản Phẩm Mới</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-3xl border border-border shadow-sm">
        {/* Basic Info */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold border-b border-border pb-2">Thông tin cơ bản</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Tên sản phẩm *</label>
              <input required type="text" className="w-full p-3 bg-muted/50 rounded-xl border border-border" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Giá (VNĐ) *</label>
              <input 
                required 
                type="text" 
                className="w-full border border-border rounded-lg px-4 py-3 bg-background" 
                placeholder="VD: 1,500,000"
                value={formData.price} 
                onChange={e => setFormData({...formData, price: formatInputVND(e.target.value)})} 
              />
            </div>
            <InputField label="Thương hiệu" val={formData.brand} onChange={e => setFormData({...formData, brand: e})} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Danh mục *</label>
              <select required className="w-full p-3 bg-muted/50 rounded-xl border border-border" value={formData.category} onChange={e => { setFormData({...formData, category: e.target.value}); setSpecs({}); }}>
                <optgroup label="Nội thất (Furniture)">
                  {CATEGORIES.furniture.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </optgroup>
                <optgroup label="Hiển thị (Display)">
                  {CATEGORIES.display.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </optgroup>
                <optgroup label="Phụ kiện & Thiết bị ngoại vi">
                  {CATEGORIES.accessories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </optgroup>
                <optgroup label="Nguồn & Kết nối">
                  {CATEGORIES.power_connectivity.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </optgroup>
                <optgroup label="Quản lý & Tổ chức">
                  {CATEGORIES.organization.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </optgroup>
                <optgroup label="Công thái học">
                  {CATEGORIES.ergonomics.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </optgroup>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tồn kho ban đầu *</label>
              <input required type="number" min={0} className="w-full p-3 bg-muted/50 rounded-xl border border-border" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Mô tả chi tiết</label>
              <textarea rows={4} className="w-full p-3 bg-muted/50 rounded-xl border border-border" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
            </div>
          </div>
        </div>

        {/* Image Upload */}
        <div className="bg-white border border-border p-6 rounded-2xl shadow-sm mb-6">
          <h2 className="text-xl font-bold mb-4 border-b border-border pb-2">Hình ảnh sản phẩm</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {formData.image_urls.map((url, idx) => (
              <div key={idx} className="aspect-square rounded-xl border border-border relative overflow-hidden group">
                <img src={url} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                <button 
                  type="button"
                  onClick={() => {
                    const newUrls = formData.image_urls.filter((_, i) => i !== idx);
                    setFormData({...formData, image_urls: newUrls, image_url: newUrls[0] || ''});
                  }}
                  className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  &times;
                </button>
                {formData.image_url === url && (
                  <div className="absolute bottom-0 left-0 right-0 bg-accent text-white text-xs text-center py-1 font-medium">Ảnh chính</div>
                )}
              </div>
            ))}
            
            {formData.image_urls.length < 5 && (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-accent hover:bg-accent/5 transition-colors"
              >
                {uploading ? <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /> : (
                  <>
                    <UploadCloud className="w-8 h-8 text-muted-foreground mb-2" />
                    <span className="text-xs text-muted-foreground text-center px-2">Tải ảnh lên<br/>(Tối đa 5)</span>
                  </>
                )}
                <input type="file" hidden accept="image/*" multiple ref={fileInputRef} onChange={handleUpload} />
              </div>
            )}
          </div>
        </div>
        {/* Specs */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold border-b border-border pb-2 flex justify-between items-center">
            Thông số kỹ thuật
            <span className="text-sm font-normal text-muted-foreground">Tự động điều chỉnh theo Danh mục</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-muted/10 p-6 rounded-2xl border border-border/50">
            {renderDynamicSpecs()}
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-border">
          <button 
            type="submit" 
            disabled={loading}
            className="px-8 py-4 bg-orange-600 text-white rounded-full font-bold text-lg hover:bg-orange-700 transition-all flex items-center gap-2 disabled:opacity-50 shadow-md hover:shadow-lg"
          >
            {loading ? 'Đang xử lý...' : (
              <>
                <Save className="w-5 h-5" />
                Gửi yêu cầu duyệt
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

function InputField({ label, type = "text", val, onChange, placeholder = "" }: { label: string, type?: string, val: any, onChange: (val: string) => void, placeholder?: string }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input 
        type={type} 
        placeholder={placeholder}
        className="w-full p-3 bg-white rounded-xl border border-border focus:border-orange-500 focus:outline-none transition-all" 
        value={val || ''} 
        onChange={e => onChange(e.target.value)} 
      />
    </div>
  );
}
