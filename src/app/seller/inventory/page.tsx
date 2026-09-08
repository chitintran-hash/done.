"use client";

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Package, Search, Save } from 'lucide-react';

export default function SellerInventoryPage() {
  const supabase = createClient();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('products')
      .select('id, name, sku, stock, is_available')
      .eq('seller_id', user.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setProducts(data);
    }
    setLoading(false);
  };

  const updateStock = async (id: string, newStock: number) => {
    setSavingId(id);
    await supabase.from('products').update({ stock: newStock }).eq('id', id);
    setSavingId(null);
    fetchInventory(); // Refresh to update derived status
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Quản lý Tồn kho</h1>
        <p className="text-muted-foreground mt-1">Cập nhật số lượng kho nhanh chóng để tránh hết hàng.</p>
      </div>

      <div className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Tìm theo SKU hoặc tên..." 
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-border focus:border-accent focus:outline-none"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-muted-foreground">Đang tải dữ liệu tồn kho...</div>
        ) : products.length === 0 ? (
          <div className="p-16 text-center text-muted-foreground">
            <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
            <p>Bạn chưa có sản phẩm nào trong kho.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border bg-muted/20 text-sm">
                  <th className="px-6 py-4 font-medium text-muted-foreground">SKU</th>
                  <th className="px-6 py-4 font-medium text-muted-foreground">Sản phẩm</th>
                  <th className="px-6 py-4 font-medium text-muted-foreground">Trạng thái kho</th>
                  <th className="px-6 py-4 font-medium text-muted-foreground">Cập nhật số lượng</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {products.map((product) => (
                  <tr key={product.id} className="border-b border-border hover:bg-muted/10 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs">{product.sku}</td>
                    <td className="px-6 py-4 font-bold">{product.name}</td>
                    <td className="px-6 py-4">
                      {product.stock > 10 ? (
                        <span className="px-2 py-1 text-xs font-bold rounded-md bg-green-100 text-green-700">In Stock</span>
                      ) : product.stock > 0 ? (
                        <span className="px-2 py-1 text-xs font-bold rounded-md bg-yellow-100 text-yellow-700">Low Stock</span>
                      ) : (
                        <span className="px-2 py-1 text-xs font-bold rounded-md bg-red-100 text-red-700">Out of Stock</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <input 
                          type="number" 
                          defaultValue={product.stock || 0}
                          className="w-20 p-2 rounded border border-border text-center"
                          onBlur={(e) => {
                            const newStock = parseInt(e.target.value);
                            if (!isNaN(newStock) && newStock !== product.stock) {
                              updateStock(product.id, newStock);
                            }
                          }}
                        />
                        {savingId === product.id && <span className="text-xs text-orange-600">Đang lưu...</span>}
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
