import { Package, Plus } from 'lucide-react';
import Link from 'next/link';

export default function MySetupPage() {
  return (
    <div className="min-h-screen bg-background p-6 lg:p-12">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-bold">Góc thiết lập của tôi</h1>
            <p className="text-muted-foreground mt-2">Quản lý các thiết bị bạn đang sở hữu và theo dõi tiến độ đơn hàng mới.</p>
          </div>
          <Link href="/build" className="px-6 py-3 bg-foreground text-background rounded-full font-medium flex items-center gap-2 hover:bg-foreground/90 transition-all">
            <Plus className="w-5 h-5" /> Xây dựng góc mới
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-3xl border border-border p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Package className="w-6 h-6 text-accent" />
              Thiết bị đã đặt mua (Sub-orders)
            </h2>
            <div className="space-y-4">
              <div className="p-4 bg-muted/30 rounded-xl border border-border">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium text-sm">#SUB-1092-A (Seller: SiliconZ)</span>
                  <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded">Chờ giao hàng</span>
                </div>
                <h4 className="font-bold">Bàn Nâng Hạ Ergonomic Sihoo</h4>
              </div>
              <div className="p-4 bg-muted/30 rounded-xl border border-border">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium text-sm">#SUB-1093-C (Seller: GearVN)</span>
                  <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded">Chờ giao hàng</span>
                </div>
                <h4 className="font-bold">Giá đỡ màn hình NB F80</h4>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-border p-8">
            <h2 className="text-2xl font-bold mb-6">Thiết bị đang sở hữu</h2>
            <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-border rounded-xl text-muted-foreground bg-muted/10">
              Chưa có thiết bị nào được lưu trước đó.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
