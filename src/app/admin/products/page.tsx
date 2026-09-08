import { createClient } from '@/lib/supabase/server';
import ProductsClient from './ProductsClient';

export default async function AdminProductsPage() {
  const supabase = await createClient();
  
  // Fetch products with their seller information
  const { data: products } = await supabase
    .from('products')
    .select('*, profiles!products_seller_id_fkey(store_name, full_name)')
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold">Duyệt Sản Phẩm</h1>
          <p className="text-muted-foreground mt-2">Kiểm tra thông số Compatibility và nội dung sản phẩm do Seller đăng.</p>
        </div>
      </div>

      <ProductsClient initialProducts={products || []} />
    </div>
  );
}
