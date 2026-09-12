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

const TAG_OPTIONS = {
  recipient: [
    { id: 'ban-gai', label: 'Bạn gái / Vợ' },
    { id: 'ban-trai', label: 'Bạn trai / Chồng' },
    { id: 'ban-than', label: 'Bạn thân' },
    { id: 'me', label: 'Mẹ' },
    { id: 'bo', label: 'Bố' },
    { id: 'tre-em', label: 'Trẻ em' }
  ],
  occasion: [
    { id: 'sinh-nhat', label: 'Sinh nhật' },
    { id: 'ky-niem', label: 'Kỷ niệm' },
    { id: 'valentine', label: 'Valentine' },
    { id: 'tot-nghiep', label: 'Tốt nghiệp' },
    { id: 'tan-gia', label: 'Tân gia' }
  ],
  interest: [
    { id: 'cong-nghe', label: 'Công nghệ' },
    { id: 'gaming', label: 'Gaming' },
    { id: 'lam-dep', label: 'Làm đẹp' },
    { id: 'du-lich', label: 'Du lịch' },
    { id: 'decor', label: 'Decor' },
    { id: 'doc-sach', label: 'Đọc sách' }
  ],
  style: [
    { id: 'de-thuong', label: 'Dễ thương' },
    { id: 'y-nghia', label: 'Ý nghĩa' },
    { id: 'thiet-thuc', label: 'Thiết thực' },
    { id: 'hai-huoc', label: 'Hài hước' },
    { id: 'doc-la', label: 'Độc lạ' },
    { id: 'sang-trong', label: 'Sang trọng' }
  ]
};

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
    delivery_days: '3',
    recipient_tags: [] as string[],
    occasion_tags: [] as string[],
    interest_tags: [] as string[],
    style_tags: [] as string[],
    zodiac_tags: [] as string[],
    numerology_tags: [] as string[]
  });

  const handleTagToggle = (category: keyof typeof formData, value: string) => {
    setFormData(prev => {
      const currentTags = prev[category] as string[];
      if (currentTags.includes(value)) {
        return { ...prev, [category]: currentTags.filter(t => t !== value) };
      } else {
        return { ...prev, [category]: [...currentTags, value] };
      }
    });
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
        image_url: prev.image_url || newUrls[0]
      }));
    } catch (error: any) {
      alert('Lỗi upload ảnh: ' + error.message);
    } finally {
      setUploading(false);
    }
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
        sku: autoSku,
        brand: formData.brand,
        category: formData.category,
        price: parseVND(formData.price),
        description: formData.description,
        seller_id: user.id,
        delivery_days: parseInt(formData.delivery_days) || 1,
        stock: parseInt(formData.stock) || 0,
        image_url: formData.image_url,
        image_urls: formData.image_urls,
        approval_status: 'pending',
        is_available: false,
        recipient_tags: formData.recipient_tags,
        occasion_tags: formData.occasion_tags,
        interest_tags: formData.interest_tags,
        style_tags: formData.style_tags,
        zodiac_tags: formData.zodiac_tags,
        numerology_tags: formData.numerology_tags
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

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/seller/products" className="p-2 hover:bg-muted rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-3xl font-bold">Thêm Sản Phẩm Quà Tặng Mới</h1>
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
            <div>
              <label className="block text-sm font-medium mb-2">Thương hiệu</label>
              <input type="text" className="w-full p-3 bg-muted/50 rounded-xl border border-border" value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

        {/* Gift Tags */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold border-b border-border pb-2 flex justify-between items-center">
            Phân loại Quà Tặng (Tags)
            <span className="text-sm font-normal text-muted-foreground">Giúp khách hàng dễ dàng tìm thấy món quà này</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-muted/10 p-6 rounded-2xl border border-border/50">
            {/* Người nhận */}
            <div>
              <h3 className="font-bold text-sm mb-3">Người nhận</h3>
              <div className="flex flex-wrap gap-2">
                {TAG_OPTIONS.recipient.map(tag => (
                  <label key={tag.id} className={`px-4 py-2 rounded-full border cursor-pointer text-sm font-medium transition-colors ${formData.recipient_tags.includes(tag.id) ? 'bg-primary text-white border-primary' : 'bg-white text-foreground hover:bg-muted'}`}>
                    <input type="checkbox" className="hidden" checked={formData.recipient_tags.includes(tag.id)} onChange={() => handleTagToggle('recipient_tags', tag.id)} />
                    {tag.label}
                  </label>
                ))}
              </div>
            </div>

            {/* Dịp */}
            <div>
              <h3 className="font-bold text-sm mb-3">Dịp tặng</h3>
              <div className="flex flex-wrap gap-2">
                {TAG_OPTIONS.occasion.map(tag => (
                  <label key={tag.id} className={`px-4 py-2 rounded-full border cursor-pointer text-sm font-medium transition-colors ${formData.occasion_tags.includes(tag.id) ? 'bg-primary text-white border-primary' : 'bg-white text-foreground hover:bg-muted'}`}>
                    <input type="checkbox" className="hidden" checked={formData.occasion_tags.includes(tag.id)} onChange={() => handleTagToggle('occasion_tags', tag.id)} />
                    {tag.label}
                  </label>
                ))}
              </div>
            </div>

            {/* Sở thích */}
            <div>
              <h3 className="font-bold text-sm mb-3">Sở thích</h3>
              <div className="flex flex-wrap gap-2">
                {TAG_OPTIONS.interest.map(tag => (
                  <label key={tag.id} className={`px-4 py-2 rounded-full border cursor-pointer text-sm font-medium transition-colors ${formData.interest_tags.includes(tag.id) ? 'bg-primary text-white border-primary' : 'bg-white text-foreground hover:bg-muted'}`}>
                    <input type="checkbox" className="hidden" checked={formData.interest_tags.includes(tag.id)} onChange={() => handleTagToggle('interest_tags', tag.id)} />
                    {tag.label}
                  </label>
                ))}
              </div>
            </div>

            {/* Phong cách */}
            <div>
              <h3 className="font-bold text-sm mb-3">Phong cách</h3>
              <div className="flex flex-wrap gap-2">
                {TAG_OPTIONS.style.map(tag => (
                  <label key={tag.id} className={`px-4 py-2 rounded-full border cursor-pointer text-sm font-medium transition-colors ${formData.style_tags.includes(tag.id) ? 'bg-primary text-white border-primary' : 'bg-white text-foreground hover:bg-muted'}`}>
                    <input type="checkbox" className="hidden" checked={formData.style_tags.includes(tag.id)} onChange={() => handleTagToggle('style_tags', tag.id)} />
                    {tag.label}
                  </label>
                ))}
              </div>
            </div>

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
