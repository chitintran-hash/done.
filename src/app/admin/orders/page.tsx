import { createClient } from '@/lib/supabase/server';
import { ShoppingCart, Package } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminOrdersPage() {
  const supabase = await createClient();
  
  const { data: orders } = await supabase
    .from('orders')
    .select(`
      id, created_at, total_price, status, buyer_name_snapshot, shipping_address,
      profiles:buyer_id(full_name, email),
      order_items(id, quantity, price, status, products(name, image_url, description, category, profiles(store_name)))
    `)
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold">Quản lý Đơn hàng</h1>
          <p className="text-muted-foreground mt-2">Theo dõi toàn bộ đơn hàng (Master Orders) trên hệ thống.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        {(!orders || orders.length === 0) ? (
          <div className="p-16 text-center text-muted-foreground">
            <ShoppingCart className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
            <p>Chưa có đơn hàng nào trên hệ thống.</p>
          </div>
        ) : (
          <div className="space-y-4 p-6">
            {orders.map(order => (
              <div key={order.id} className="border border-border rounded-xl overflow-hidden">
                <div className="bg-muted/30 px-6 py-4 flex flex-wrap gap-6 items-center justify-between border-b border-border">
                  <div>
                    <p className="text-sm text-muted-foreground">Mã đơn hàng</p>
                    <p className="font-mono font-bold">#{order.id.split('-')[0].toUpperCase()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Ngày đặt</p>
                    <p className="font-medium">{new Date(order.created_at).toLocaleString('vi-VN')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Khách hàng</p>
                    <p className="font-medium">{(order.profiles as any)?.full_name || order.buyer_name_snapshot || 'Khách (Đã xóa)'}</p>
                    <p className="text-xs text-muted-foreground">{(order.profiles as any)?.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Tổng tiền</p>
                    <p className="font-bold text-accent">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.total_price)}</p>
                  </div>
                  <div>
                    <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-full ${
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      order.status === 'completed' ? 'bg-green-100 text-green-700' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {order.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="divide-y divide-border bg-white p-4">
                  <h4 className="font-bold text-sm mb-2 flex items-center gap-2"><Package className="w-4 h-4" /> Chi tiết Sub-orders (Cho từng Seller)</h4>
                  {order.order_items.map((item: any) => {
                    const isCustom = item.products?.category === 'custom';
                    let specs = null;
                    if (isCustom && item.products?.description) {
                      try {
                        specs = JSON.parse(item.products.description);
                      } catch (e) {}
                    }
                    
                    return (
                      <div key={item.id} className="py-4 flex gap-4 text-sm">
                        {item.products?.image_url && (
                          <div className="w-20 h-20 bg-[#EDECEA] rounded-lg border border-[#DDD8D2] flex items-center justify-center shrink-0 p-1">
                            <img src={item.products.image_url} alt="product" className="w-full h-full object-contain" />
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-bold text-[#201817] text-base">{item.products?.name || 'Sản phẩm đã xóa'}</div>
                              {!isCustom && <div className="text-[#6F625E] text-xs mt-0.5">Seller: {(item.products?.profiles as any)?.store_name || 'Không rõ'}</div>}
                              
                              {specs && (
                                <div className="mt-2 text-xs text-[#6F625E] bg-[#F7F6F2] p-2 rounded-md border border-[#DDD8D2]">
                                  <p><span className="font-bold">Loại ly:</span> {specs.modelType}</p>
                                  <p><span className="font-bold">Màu thân:</span> {specs.cupColor}</p>
                                  {specs.modelType === 'tumbler' && <p><span className="font-bold">Màu nắp:</span> {specs.lidColor}</p>}
                                  {specs.customText && <p><span className="font-bold">Nội dung in:</span> "{specs.customText}" (Màu: {specs.textColor})</p>}
                                  {(specs.sticker || specs.uploadedImage) && <p className="font-bold text-[#6B463D]">** Có dán ảnh/sticker tuỳ chỉnh **</p>}
                                </div>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-6">
                              <div className="text-right">
                                <div className="font-bold text-[#201817]">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)} x {item.quantity}</div>
                              </div>
                              <div className="w-24 text-right">
                                <span className={`px-2 py-1 text-xs font-bold rounded ${
                                  item.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                  item.status === 'shipped' ? 'bg-green-100 text-green-700' :
                                  'bg-muted text-muted-foreground'
                                }`}>
                                  {item.status}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
