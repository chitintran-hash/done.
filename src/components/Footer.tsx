import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-background border-t border-border pt-16 pb-8 mt-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="space-y-4">
            <h2 className="text-2xl font-black tracking-tight">DONE.</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              DONE. là nền tảng cung cấp giải pháp không gian làm việc toàn diện. Chúng tôi kết nối bạn với những nhà bán lẻ nội thất hàng đầu để xây dựng góc làm việc tối ưu nhất.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="#" className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-accent hover:text-white transition-colors text-sm font-bold">
                IN
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-accent hover:text-white transition-colors text-sm font-bold">
                TW
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-accent hover:text-white transition-colors text-sm font-bold">
                FB
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-accent hover:text-white transition-colors text-sm font-bold">
                IG
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-sm tracking-wider uppercase mb-4">Sản Phẩm</h3>
            <ul className="space-y-3">
              <li><Link href="/build" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Xây dựng Solution</Link></li>
              <li><Link href="/shop" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Mua lẻ thiết bị</Link></li>
              <li><Link href="/b2b" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Dành cho Doanh nghiệp</Link></li>
              <li><Link href="/brands" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Thương hiệu đối tác</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-sm tracking-wider uppercase mb-4">Liên Hệ</h3>
            <ul className="space-y-3">
              <li className="text-sm text-muted-foreground">hello@done.vn</li>
              <li className="text-sm text-muted-foreground">+84 987 654 321</li>
              <li><Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Về chúng tôi</Link></li>
              <li><Link href="/careers" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Tuyển dụng</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-sm tracking-wider uppercase mb-4">Pháp Lý</h3>
            <ul className="space-y-3">
              <li><Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Chính sách Bảo mật</Link></li>
              <li><Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Điều khoản Dịch vụ</Link></li>
              <li><Link href="/shipping" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Chính sách Giao hàng</Link></li>
              <li><Link href="/refund" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Chính sách Hoàn tiền</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            © 2026 DONE. Inc. Bảo lưu mọi quyền.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Chính sách Bảo mật</Link>
            <Link href="/terms" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Điều khoản Dịch vụ</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
