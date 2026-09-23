"use client";
import { deleteProduct, saveProduct, uploadAdminFile } from '@/app/actions/admin';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Plus, Edit2, Trash2, Search, Loader2 } from 'lucide-react';

export default function AdminProductsPage() {
  const supabase = createClient();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    category: 'coffee',
    description: '',
    image_url: '',
    images: [] as string[],
    stock: 0,
    material: '',
    capacity: '',
    color: '',
    is_customizable: false
  });

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('products').select('*').neq('category', 'user_custom').order('created_at', { ascending: false });
    if (data) setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenModal = (product: any = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name || '',
        price: product.price || 0,
        category: product.category || 'glass',
        description: product.description || '',
        image_url: product.image_url || '',
        images: product.technical_specs?.images || (product.image_url ? [product.image_url] : []),
        stock: product.stock || 0,
        material: product.technical_specs?.material || '',
        capacity: product.technical_specs?.capacity || '',
        color: product.technical_specs?.color || '',
        is_customizable: product.technical_specs?.is_customizable || false
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '', price: 0, category: 'glass', description: '', image_url: '', images: [], stock: 0, material: '', capacity: '', color: '', is_customizable: false
      });
    }
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const specs = {
      material: formData.material,
      capacity: formData.capacity,
      color: formData.color,
      is_customizable: formData.is_customizable,
      images: formData.images
    };

    const payload = {
      name: formData.name,
      price: formData.price,
      category: formData.category,
      description: formData.description,
      image_url: formData.image_url,
      stock: formData.stock,
      technical_specs: specs,
      is_available: true,
      approval_status: 'active'
    };

    const result = await saveProduct(payload, editingProduct ? editingProduct.id : undefined);
    if (!result.success) {
      alert("Lỗi lưu sản phẩm: " + result.error);
    } else {
      setShowModal(false);
      await fetchProducts();
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) return;
    setLoading(true);
    const result = await deleteProduct(id);
    if (!result.success) {
      alert("Không thể xoá sản phẩm: " + result.error);
    }
    await fetchProducts();
  };

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-foreground">Quản lý Sản phẩm</h1>
        <button onClick={() => handleOpenModal()} className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary/90">
          <Plus className="w-5 h-5" /> Thêm sản phẩm mới
        </button>
      </div>

      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border">
          <div className="relative max-w-md">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Tìm kiếm sản phẩm..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-muted/50 rounded-lg border border-border focus:border-primary focus:outline-none"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border bg-muted/20 text-sm text-muted-foreground">
                <th className="px-6 py-4 font-medium">Sản phẩm</th>
                <th className="px-6 py-4 font-medium">Giá</th>
                <th className="px-6 py-4 font-medium">Danh mục</th>
                <th className="px-6 py-4 font-medium">Tồn kho</th>
                <th className="px-6 py-4 font-medium text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(p => (
                <tr key={p.id} className="border-b border-border hover:bg-muted/10">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <img src={p.image_url || 'https://via.placeholder.com/50'} alt="" className="w-12 h-12 rounded-lg object-cover bg-muted" />
                    <span className="font-medium text-foreground">{p.name}</span>
                  </td>
                  <td className="px-6 py-4">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p.price)}</td>
                  <td className="px-6 py-4 capitalize">{p.category}</td>
                  <td className="px-6 py-4">{p.stock}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleOpenModal(p)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg mr-2"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(p.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-6">{editingProduct ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Tên sản phẩm *</label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-2 border rounded-lg focus:border-primary outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Giá (VNĐ) *</label>
                  <input required type="text" value={formData.price ? new Intl.NumberFormat('vi-VN').format(formData.price) : ''} onChange={e => { const val = e.target.value.replace(/\D/g, ''); setFormData({...formData, price: val ? parseInt(val, 10) : 0}); }} className="w-full p-2 border rounded-lg focus:border-primary outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Danh mục *</label>
                  <select required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full p-2 border rounded-lg focus:border-primary outline-none">
                    <option value="glass">Ly thủy tinh</option>
                    <option value="thermos">Ly giữ nhiệt</option>
                    <option value="plastic">Ly nhựa</option>
                    <option value="custom">Ly custom</option>
                    <option value="Coffee">Coffee (Cũ)</option>
                    <option value="coffee">Coffee (Cũ)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Tồn kho</label>
                  <input type="number" value={formData.stock} onChange={e => setFormData({...formData, stock: Number(e.target.value)})} className="w-full p-2 border rounded-lg focus:border-primary outline-none" />
                </div>
              </div>
              
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-2">Hình ảnh Sản phẩm (Hỗ trợ nhiều ảnh)</label>
                <div className="flex flex-wrap gap-4 mb-2">
                  {formData.images.map((url, idx) => (
                    <div key={idx} className="relative w-24 h-24 border rounded-xl overflow-hidden group">
                      <img src={url} className="w-full h-full object-cover" />
                      <button type="button" onClick={() => {
                        const newImages = formData.images.filter((_, i) => i !== idx);
                        setFormData({...formData, images: newImages, image_url: formData.image_url === url ? (newImages[0] || '') : formData.image_url});
                      }} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-3 h-3" /></button>
                      {formData.image_url === url && <span className="absolute bottom-0 left-0 right-0 bg-primary/90 text-primary-foreground text-[10px] text-center py-0.5">Ảnh chính</span>}
                      {formData.image_url !== url && <button type="button" onClick={() => setFormData({...formData, image_url: url})} className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] text-center py-0.5 opacity-0 group-hover:opacity-100">Đặt làm ảnh chính</button>}
                    </div>
                  ))}
                  <label className="w-24 h-24 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors">
                    <Plus className="w-6 h-6 text-muted-foreground mb-1" />
                    <span className="text-[10px] text-muted-foreground">Thêm ảnh</span>
                    <input type="file" accept="image/*" multiple className="hidden" onChange={async (e) => {
                      if (!e.target.files) return;
                      setLoading(true);
                      const newUrls = [...formData.images];
                      for (const file of Array.from(e.target.files)) {
                        const fd = new FormData();
                        fd.append('file', file);
                        const result = await uploadAdminFile(fd);
                        if (result.success && result.url) {
                          newUrls.push(result.url);
                        } else {
                          alert("Lỗi tải ảnh: " + result.error);
                        }
                      }
                      setFormData({...formData, images: newUrls, image_url: formData.image_url || newUrls[0] || ''});
                      setLoading(false);
                    }} />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Mô tả ngắn</label>
                <textarea rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-2 border rounded-lg focus:border-primary outline-none"></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                <div>
                  <label className="block text-sm font-medium mb-1">Chất liệu</label>
                  <input type="text" value={formData.material} onChange={e => setFormData({...formData, material: e.target.value})} className="w-full p-2 border rounded-lg focus:border-primary outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Dung tích (ml)</label>
                  <input type="text" value={formData.capacity} onChange={e => setFormData({...formData, capacity: e.target.value})} className="w-full p-2 border rounded-lg focus:border-primary outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Màu sắc</label>
                  <input type="text" value={formData.color} onChange={e => setFormData({...formData, color: e.target.value})} className="w-full p-2 border rounded-lg focus:border-primary outline-none" />
                </div>
                <div className="flex items-center gap-2 mt-6">
                  <input type="checkbox" checked={formData.is_customizable} onChange={e => setFormData({...formData, is_customizable: e.target.checked})} className="w-4 h-4 accent-primary" id="customCheck" />
                  <label htmlFor="customCheck" className="text-sm font-medium cursor-pointer">Cho phép Custom</label>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6 pt-6">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-lg hover:bg-muted">Hủy</button>
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">Lưu sản phẩm</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
