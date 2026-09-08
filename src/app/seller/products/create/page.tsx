"use client";

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { UploadCloud, ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

const CATEGORIES = {
  furniture: [
    { id: 'desk', name: 'Bàn (Desk)' },
    { id: 'chair', name: 'Ghế (Chair)' },
    { id: 'drawer', name: 'Ngăn kéo bàn' },
    { id: 'cabinet', name: 'Tủ hoặc hộc bàn' },
    { id: 'desk_shelf', name: 'Kệ bàn' },
    { id: 'bookshelf', name: 'Kệ sách nhỏ' }
  ],
  display: [
    { id: 'monitor', name: 'Màn hình' },
    { id: 'monitor_arm', name: 'Monitor Arm' },
    { id: 'monitor_stand', name: 'Kệ màn hình' }
  ],
  accessories: [
    { id: 'keyboard', name: 'Bàn phím' },
    { id: 'mouse', name: 'Chuột' },
    { id: 'mouse_pad', name: 'Mouse Pad' },
    { id: 'laptop_stand', name: 'Laptop Stand' },
    { id: 'webcam', name: 'Webcam' },
    { id: 'microphone', name: 'Microphone' },
    { id: 'speaker', name: 'Loa' },
    { id: 'headphone', name: 'Tai nghe' }
  ],
  power_connectivity: [
    { id: 'docking_station', name: 'Docking Station' },
    { id: 'usb_hub', name: 'USB Hub' },
    { id: 'power_strip', name: 'Ổ cắm điện' },
    { id: 'charger', name: 'Sạc' },
    { id: 'cable', name: 'Cáp kết nối' }
  ],
  organization: [
    { id: 'cable_management', name: 'Quản lý dây' },
    { id: 'desk_organizer', name: 'Desk Organizer' }
  ],
  ergonomics: [
    { id: 'desk_lamp', name: 'Đèn bàn' },
    { id: 'footrest', name: 'Footrest' },
    { id: 'ergo_accessories', name: 'Các phụ kiện công thái học' }
  ]
};

export default function SellerCreateProductPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '', brand: '', category: 'desk', price: '', description: '',
    delivery_days: '3', stock: '10'
  });

  // Dynamic Specs State
  const [specs, setSpecs] = useState<Record<string, any>>({});

  const handleSpecChange = (key: string, value: any) => {
    setSpecs(prev => ({ ...prev, [key]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
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

      let imageUrl = '';
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('done-products')
          .upload(`products/${fileName}`, imageFile);

        if (uploadError) throw new Error('Lỗi upload ảnh (Có thể Bucket chưa được tạo): ' + uploadError.message);

        const { data: { publicUrl } } = supabase.storage
          .from('done-products')
          .getPublicUrl(`products/${fileName}`);
        
        imageUrl = publicUrl;
      }

      const parseNumber = (val: string) => val ? Number(val) : 0;
      const autoSku = generateSKU(formData.category);

      const productPayload = {
        name: formData.name,
        sku: autoSku, // Auto generated
        brand: formData.brand,
        category: formData.category,
        price: parseNumber(formData.price) || 0,
        description: formData.description,
        seller_id: user.id,
        delivery_days: parseNumber(formData.delivery_days) || 1,
        stock: parseNumber(formData.stock) || 0,
        image_url: imageUrl || 'https://via.placeholder.com/400',
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
        <InputField label="Các cổng đầu ra (Outputs)" val={specs.output_ports} onChange={(v) => handleSpecChange('output_ports', v)} placeholder="VD: 2x USB-A, 1x HDMI..." />
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
            <div>
              <label className="block text-sm font-medium mb-1">Thương hiệu *</label>
              <input required type="text" className="w-full p-3 bg-muted/50 rounded-xl border border-border" value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} />
            </div>
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
              <label className="block text-sm font-medium mb-1">Giá (VNĐ) *</label>
              <input required type="number" min={0} className="w-full p-3 bg-muted/50 rounded-xl border border-border" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
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
        <div className="space-y-4">
          <h2 className="text-xl font-bold border-b border-border pb-2">Hình ảnh sản phẩm *</h2>
          <div className="flex items-center gap-6">
            <div className="w-40 h-40 border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center bg-muted/20 relative overflow-hidden group">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <>
                  <UploadCloud className="w-8 h-8 text-muted-foreground mb-2" />
                  <span className="text-sm text-muted-foreground font-medium text-center">Tải ảnh lên<br/>(Bắt buộc)</span>
                </>
              )}
              <input required type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            </div>
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
