"use client";

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Plus, Edit2, Trash2, Search, Loader2, Box, Layers, DollarSign } from 'lucide-react';
import { deleteProduct, saveProduct, uploadAdminFile } from '@/app/actions/admin';

export default function AdminProductsPage() {
  const supabase = createClient();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    price: 0,
    cost_price: 0,
    category: 'glass',
    description: '',
    image_url: '',
    images: [] as string[],
    stock: 0,
    low_stock_threshold: 10,
    material: '',
    capacity: '',
    color: '',
    is_customizable: false
  });

  const fetchProducts = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('products')
      .select('*')
      .neq('category', 'user_custom')
      .not('category', 'like', 'admin_%')
      .neq('approval_status', 'archived')
      .order('created_at', { ascending: false });
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
        sku: product.sku || '',
        price: product.price || 0,
        cost_price: product.technical_specs?.cost_price || 0,
        category: product.category || 'glass',
        description: product.description || '',
        image_url: product.image_url || '',
        images: product.technical_specs?.images || (product.image_url ? [product.image_url] : []),
        stock: product.stock || 0,
        low_stock_threshold: product.technical_specs?.low_stock_threshold || 10,
        material: product.technical_specs?.material || '',
        capacity: product.technical_specs?.capacity || '',
        color: product.technical_specs?.color || '',
        is_customizable: product.technical_specs?.is_customizable || false
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        sku: `CUP-${Math.floor(1000 + Math.random() * 9000)}`,
        price: 0,
        cost_price: 0,
        category: 'glass',
        description: '',
        image_url: '',
        images: [],
        stock: 50,
        low_stock_threshold: 10,
        material: '',
        capacity: '',
        color: '',
        is_customizable: false
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
      images: formData.images,
      cost_price: Number(formData.cost_price) || 0,
      low_stock_threshold: Number(formData.low_stock_threshold) || 10
    };

    const payload = {
      name: formData.name,
      sku: formData.sku,
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

  const handleDelete = async (id: string, name?: string) => {
    if (!confirm(`Bạn có chắc chắn muốn XÓA VĨNH VIỄN sản phẩm "${name || id}" khỏi hệ thống?`)) return;
    setLoading(true);
    const result = await deleteProduct(id);
    if (!result.success) {
      alert("Không thể xoá sản phẩm: " + result.error);
    } else {
      setProducts(prev => prev.filter(p => p.id !== id));
      alert("Đã xóa sản phẩm thành công!");
    }
    await fetchProducts();
    setLoading(false);
  };

  const filteredProducts = products.filter(p => {
    const matchSearch = p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = selectedCategory === 'all'
      ? true
      : selectedCategory === 'gift_box'
      ? (p.category === 'gift_box' || p.category === 'gift')
      : p.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  const formatVND = (num: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Page Title */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-[#DDD8D2] shadow-sm flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#4A2A25] tracking-wide uppercase bg-[#FFF3A6] px-3 py-1 rounded-full w-fit mb-3 border border-[#DDD8D2]">
            Catalog & Price Architecture
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-[#3A211E] tracking-tight">
            Quản Lý Danh Mục Sản Phẩm
          </h1>
          <p className="text-sm text-[#6F625E] mt-1.5">
            Cấu hình giá bán, giá vốn (COGS), mã SKU, tồn kho và các tùy chọn in ấn thiết kế 3D.
          </p>
        </div>

        <button 
          onClick={() => handleOpenModal()} 
          className="flex items-center gap-2 px-5 py-2.5 bg-[#4A2A25] text-white rounded-xl text-xs font-bold hover:bg-[#3A211E] transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" /> Thêm Sản Phẩm Mới
        </button>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-3xl border border-[#DDD8D2] shadow-sm overflow-hidden">
        <div className="p-4 border-b border-[#DDD8D2] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="relative max-w-md w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6F625E]" />
            <input 
              type="text" 
              placeholder="Tìm theo tên sản phẩm, mã SKU..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#F7F6F2] rounded-xl text-xs border border-[#DDD8D2] focus:outline-none focus:border-[#4A2A25]"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 text-xs">
            {[
              { id: 'all', label: 'Tất cả', count: products.length },
              { id: 'glass', label: 'Ly thủy tinh', count: products.filter(p => p.category === 'glass').length },
              { id: 'plastic', label: 'Ly nhựa', count: products.filter(p => p.category === 'plastic').length },
              { id: 'gift_box', label: '🎁 Hộp quà tặng', count: products.filter(p => p.category === 'gift_box' || p.category === 'gift').length },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  selectedCategory === tab.id
                    ? 'bg-[#4A2A25] text-white shadow-xs'
                    : 'bg-[#F7F6F2] text-[#6F625E] hover:bg-[#EDECEA]'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  selectedCategory === tab.id ? 'bg-white/20 text-white' : 'bg-black/5 text-[#6F625E]'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="p-16 flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-[#4A2A25]" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7F6F2] border-b border-[#DDD8D2] text-[#6F625E]">
                <tr>
                  <th className="py-4 px-6 font-semibold">Sản Phẩm</th>
                  <th className="py-4 px-4 font-semibold">SKU</th>
                  <th className="py-4 px-4 font-semibold">Giá Bán</th>
                  <th className="py-4 px-4 font-semibold">Giá Vốn (COGS)</th>
                  <th className="py-4 px-4 font-semibold">Danh Mục</th>
                  <th className="py-4 px-4 font-semibold">Tồn Kho</th>
                  <th className="py-4 px-6 font-semibold text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DDD8D2]/60">
                {filteredProducts.map(p => {
                  const costPrice = p.technical_specs?.cost_price;
                  return (
                    <tr key={p.id} className="hover:bg-[#F7F6F2]/40 transition-colors">
                      <td className="py-4 px-6 flex items-center gap-3">
                        <img 
                          src={p.image_url || 'https://via.placeholder.com/50'} 
                          alt="" 
                          className="w-12 h-12 rounded-xl object-contain bg-[#EDECEA] border border-[#DDD8D2] p-1" 
                        />
                        <div>
                          <div className="font-bold text-[#201817] text-sm">{p.name}</div>
                          {p.technical_specs?.is_customizable && (
                            <span className="text-[10px] font-bold text-[#4A2A25] bg-[#FFF3A6] px-2 py-0.5 rounded-full border border-[#DDD8D2]">
                              Custom Studio ✨
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4 font-mono font-bold text-[#4A2A25]">
                        {p.sku || `CUP-${p.id.slice(0, 6)}`}
                      </td>
                      <td className="py-4 px-4 font-bold text-[#201817] text-sm">
                        {formatVND(p.price)}
                      </td>
                      <td className="py-4 px-4 text-[#6F625E]">
                        {costPrice ? formatVND(costPrice) : (
                          <span className="text-amber-700 italic font-semibold text-[11px]">Chưa nhập</span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          p.category === 'gift_box' || p.category === 'gift'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-[#EDECEA] text-[#3A211E]'
                        }`}>
                          {p.category === 'glass' ? 'Ly thủy tinh' :
                           p.category === 'thermos' ? 'Ly giữ nhiệt' :
                           p.category === 'plastic' ? 'Ly nhựa' :
                           p.category === 'custom' ? 'Ly custom phôi' :
                           p.category === 'gift_box' || p.category === 'gift' ? '🎁 Hộp quà' : p.category}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-black ${
                          Number(p.stock) <= 0 ? 'bg-rose-100 text-rose-800' :
                          Number(p.stock) <= (p.technical_specs?.low_stock_threshold || 10) ? 'bg-amber-100 text-amber-800' :
                          'bg-emerald-100 text-emerald-800'
                        }`}>
                          {p.stock} cái
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right space-x-2">
                        <button 
                          onClick={() => handleOpenModal(p)} 
                          className="px-3 py-1.5 bg-[#EDECEA] text-[#3A211E] rounded-xl text-xs font-semibold hover:bg-[#DDD8D2]"
                        >
                          Sửa
                        </button>
                        <button 
                          onClick={() => handleDelete(p.id, p.name)} 
                          className="px-3 py-1.5 bg-rose-50 text-rose-700 rounded-xl text-xs font-semibold hover:bg-rose-100 border border-rose-200"
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* PRODUCT FORM MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-[#DDD8D2] shadow-2xl space-y-5 text-xs">
            <h2 className="text-xl font-bold text-[#3A211E]">
              {editingProduct ? 'Chỉnh Sửa Sản Phẩm' : 'Thêm Sản Phẩm Mới'}
            </h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-[#201817] block mb-1">Tên sản phẩm *</label>
                  <input 
                    required 
                    type="text" 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})} 
                    className="w-full p-2.5 bg-[#F7F6F2] border border-[#DDD8D2] rounded-xl" 
                  />
                </div>
                <div>
                  <label className="font-bold text-[#201817] block mb-1">Mã SKU *</label>
                  <input 
                    required 
                    type="text" 
                    value={formData.sku} 
                    onChange={e => setFormData({...formData, sku: e.target.value})} 
                    className="w-full p-2.5 bg-[#F7F6F2] border border-[#DDD8D2] rounded-xl font-mono" 
                  />
                </div>
                <div>
                  <label className="font-bold text-[#201817] block mb-1">Giá bán lẻ (VNĐ) *</label>
                  <input 
                    required 
                    type="number" 
                    value={formData.price} 
                    onChange={e => setFormData({...formData, price: Number(e.target.value)})} 
                    className="w-full p-2.5 bg-[#F7F6F2] border border-[#DDD8D2] rounded-xl font-bold" 
                  />
                </div>
                <div>
                  <label className="font-bold text-[#201817] block mb-1">Giá vốn COGS (VNĐ - Dùng tính lợi nhuận)</label>
                  <input 
                    type="number" 
                    value={formData.cost_price} 
                    onChange={e => setFormData({...formData, cost_price: Number(e.target.value)})} 
                    placeholder="VD: 25000"
                    className="w-full p-2.5 bg-[#F7F6F2] border border-[#DDD8D2] rounded-xl font-bold text-[#4A2A25]" 
                  />
                </div>
                <div>
                  <label className="font-bold text-[#201817] block mb-1">Danh mục *</label>
                  <select 
                    required 
                    value={formData.category} 
                    onChange={e => setFormData({...formData, category: e.target.value})} 
                    className="w-full p-2.5 bg-[#F7F6F2] border border-[#DDD8D2] rounded-xl font-medium"
                  >
                    <option value="glass">Ly thủy tinh</option>
                    <option value="plastic">Ly nhựa</option>
                    <option value="gift_box">🎁 Hộp quà tặng (Phụ kiện mua kèm)</option>
                    <option value="custom">Ly custom phôi</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-[#201817] block mb-1">Tồn kho ban đầu</label>
                  <input 
                    type="number" 
                    value={formData.stock} 
                    onChange={e => setFormData({...formData, stock: Number(e.target.value)})} 
                    className="w-full p-2.5 bg-[#F7F6F2] border border-[#DDD8D2] rounded-xl font-bold" 
                  />
                </div>
              </div>
              
              {/* Image upload */}
              <div>
                <label className="font-bold text-[#201817] block mb-2">Hình ảnh sản phẩm</label>
                <div className="flex flex-wrap gap-3 mb-2">
                  {formData.images.map((url, idx) => (
                    <div key={idx} className="relative w-20 h-20 border border-[#DDD8D2] rounded-2xl overflow-hidden group bg-[#F7F6F2] p-1">
                      <img src={url} className="w-full h-full object-contain" />
                      <button 
                        type="button" 
                        onClick={() => {
                          const newImages = formData.images.filter((_, i) => i !== idx);
                          setFormData({
                            ...formData, 
                            images: newImages, 
                            image_url: formData.image_url === url ? (newImages[0] || '') : formData.image_url
                          });
                        }} 
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  <label className="w-20 h-20 border-2 border-dashed border-[#DDD8D2] rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-[#F7F6F2] transition-colors text-center p-1">
                    <Plus className="w-5 h-5 text-[#6F625E]" />
                    <span className="text-[10px] text-[#6F625E]">Thêm ảnh</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      multiple 
                      className="hidden" 
                      onChange={async (e) => {
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
                        setFormData({
                          ...formData, 
                          images: newUrls, 
                          image_url: formData.image_url || newUrls[0] || ''
                        });
                        setLoading(false);
                      }} 
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="font-bold text-[#201817] block mb-1">Mô tả sản phẩm</label>
                <textarea 
                  rows={3} 
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})} 
                  className="w-full p-2.5 bg-[#F7F6F2] border border-[#DDD8D2] rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-[#DDD8D2]">
                <div>
                  <label className="font-bold text-[#201817] block mb-1">Chất liệu</label>
                  <input 
                    type="text" 
                    value={formData.material} 
                    onChange={e => setFormData({...formData, material: e.target.value})} 
                    placeholder="VD: Thủy tinh Borosilicate, Inox 304..."
                    className="w-full p-2 bg-[#F7F6F2] border border-[#DDD8D2] rounded-xl text-xs" 
                  />
                </div>
                <div>
                  <label className="font-bold text-[#201817] block mb-1">Dung tích (ml)</label>
                  <input 
                    type="text" 
                    value={formData.capacity} 
                    onChange={e => setFormData({...formData, capacity: e.target.value})} 
                    placeholder="VD: 350ml, 500ml..."
                    className="w-full p-2 bg-[#F7F6F2] border border-[#DDD8D2] rounded-xl text-xs" 
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input 
                  type="checkbox" 
                  checked={formData.is_customizable} 
                  onChange={e => setFormData({...formData, is_customizable: e.target.checked})} 
                  className="w-4 h-4 accent-[#4A2A25]" 
                  id="customCheck" 
                />
                <label htmlFor="customCheck" className="font-bold text-[#201817] cursor-pointer">
                  Mở tính năng Custom Cup 3D Studio cho mẫu ly này
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-[#DDD8D2]">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)} 
                  className="px-4 py-2 bg-[#EDECEA] text-[#3A211E] rounded-xl font-bold"
                >
                  Hủy
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 bg-[#4A2A25] text-white rounded-xl font-bold hover:bg-[#3A211E]"
                >
                  Lưu Sản Phẩm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
