import { createClient } from '@/lib/supabase/server';
import SellersClient from './SellersClient';

export default async function AdminSellersPage() {
  const supabase = await createClient();
  
  const { data: sellers } = await supabase
    .from('profiles')
    .select('id, full_name, role, status, store_name, phone_number, created_at')
    .eq('role', 'seller')
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold">Quản lý Người Bán (Sellers)</h1>
          <p className="text-muted-foreground mt-2">Duyệt và theo dõi hoạt động của các cửa hàng trên hệ thống.</p>
        </div>
      </div>

      <SellersClient initialSellers={sellers || []} />
    </div>
  );
}
