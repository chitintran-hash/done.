"use client";

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function SellerProductsPage() {
  const supabase = createClient();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('seller_id', user.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setProducts(data);
    }
    setLoading(false);
  };

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    await supabase.from('products').update({ is_available: !currentStatus }).eq('id', id);
    fetchProducts();
  };

  const deleteProduct = async (id: string) => {
    if (confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
      await supabase.from('products').delete().eq('id', id);
      fetchProducts();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Sản phẩm của tôi</h1>
          <p className="text-muted-foreground mt-1">Quản lý danh sách sản phẩm bạn đang bán</p>
        </div>
        <Link 
          href="/seller/products/create"
          className="flex items-center gap-2 bg-foreground text-background px-4 py-2 rounded-lg font-medium hover:bg-foreground/90 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Đăng sản phẩm mới
        </Link>
      </div>

      <div className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Tìm kiếm sản phẩm..." 
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-border focus:border-accent focus:outline-none"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-muted-foreground">Đang tải dữ liệu...</div>
        ) : products.length === 0 ? (
          <div className="p-16 text-center text-muted-foreground">
            <p>Bạn chưa có sản phẩm nào.</p>
            <Link href="/seller/products/create" className="text-orange-600 font-medium hover:underline mt-2 inline-block">Đăng sản phẩm đầu tiên</Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border bg-muted/20 text-sm">
                  <th className="px-6 py-4 font-medium text-muted-foreground">Sản phẩm</th>
                  <th className="px-6 py-4 font-medium text-muted-foreground">Giá</th>
                  <th className="px-6 py-4 font-medium text-muted-foreground">Tồn kho</th>
                  <th className="px-6 py-4 font-medium text-muted-foreground">Trạng thái</th>
                  <th className="px-6 py-4 font-medium text-muted-foreground text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {products.map((product) => (
                  <tr key={product.id} className="border-b border-border hover:bg-muted/10 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        {product.image_url ? (
                          <img src={product.image_url} alt={product.name} className="w-12 h-12 rounded-lg object-cover bg-muted" />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center text-xs">No img</div>
                        )}
                        <div>
                          <p className="font-bold text-foreground">{product.name}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{product.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                    </td>
                    <td className="px-6 py-4">
                      {product.stock || 0}
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => toggleStatus(product.id, product.is_available)}
                        className={`px-3 py-1 text-xs font-bold rounded-full ${
                          product.is_available 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {product.is_available ? 'Đang bán' : 'Tạm ẩn'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 hover:bg-muted rounded-lg text-muted-foreground transition-colors" title="Sửa">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => deleteProduct(product.id)}
                          className="p-2 hover:bg-red-50 hover:text-red-600 rounded-lg text-muted-foreground transition-colors" 
                          title="Xóa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
