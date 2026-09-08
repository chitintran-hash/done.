import Link from "next/link";
import { Store, TrendingUp, ShieldCheck, ArrowRight } from "lucide-react";

export default function SellerLandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-full font-bold text-sm">
              <Store className="w-4 h-4" /> Kênh Người Bán DONE.
            </div>
            <h1 className="text-5xl md:text-6xl font-black leading-tight">
              Kinh doanh nội thất <br/>
              <span className="text-orange-600">thông minh hơn.</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Trở thành đối tác của DONE. để tiếp cận hàng ngàn khách hàng đang tìm kiếm giải pháp xây dựng góc học tập và làm việc. Hệ thống Compatibility Engine của chúng tôi sẽ tự động đề xuất sản phẩm của bạn nếu chúng phù hợp.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/register" className="px-8 py-4 bg-orange-600 text-white rounded-full font-bold text-lg hover:bg-orange-700 transition-all flex items-center justify-center gap-2">
                Đăng ký Người Bán ngay
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/login" className="px-8 py-4 bg-muted text-foreground rounded-full font-bold text-lg hover:bg-border transition-all flex items-center justify-center">
                Đăng nhập
              </Link>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-orange-200 rounded-[3rem] transform rotate-3 scale-105 -z-10"></div>
            <div className="bg-white p-8 rounded-[3rem] border border-border shadow-xl space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Tiếp cận đúng tệp khách hàng</h3>
                  <p className="text-muted-foreground">Sản phẩm của bạn được đưa trực tiếp vào Solution của khách hàng khi họ có nhu cầu tương ứng, tỉ lệ chốt đơn cao gấp 3 lần.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center shrink-0">
                  <Store className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Hệ thống quản lý chuyên nghiệp</h3>
                  <p className="text-muted-foreground">Seller Center riêng biệt giúp bạn theo dõi doanh thu, quản lý tồn kho và xử lý đơn hàng dễ dàng.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Minh bạch & An toàn</h3>
                  <p className="text-muted-foreground">Mọi thanh toán và đối soát đều được thực hiện minh bạch, tự động hóa 100%.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
