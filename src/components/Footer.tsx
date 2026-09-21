import Link from 'next/link';

import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  if (pathname === "/custom-cup") return null;
  return (
    <footer className="bg-muted border-t border-border pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-1">
          <Link href="/" className="text-3xl font-bold tracking-widest text-primary font-serif mb-4 block">
            CUPFY
          </Link>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Find your cup. Make it yours. <br />
            Những chiếc ly nhỏ xinh cho mọi khoảnh khắc hằng ngày của bạn.
          </p>
        </div>
        
        <div>
          <h4 className="font-bold mb-6 text-foreground tracking-wide uppercase text-sm">Shop</h4>
          <ul className="space-y-4">
            <li><Link href="/products?category=coffee" className="text-muted-foreground hover:text-primary text-sm transition-colors">Ly uống cà phê</Link></li>
            <li><Link href="/products?category=milktea" className="text-muted-foreground hover:text-primary text-sm transition-colors">Ly trà sữa</Link></li>
            <li><Link href="/products?category=glass" className="text-muted-foreground hover:text-primary text-sm transition-colors">Ly thủy tinh</Link></li>
            <li><Link href="/custom-cup" className="text-muted-foreground hover:text-primary text-sm transition-colors">Custom Cup</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-bold mb-6 text-foreground tracking-wide uppercase text-sm">Chăm sóc khách hàng</h4>
          <ul className="space-y-4">
            <li><Link href="/shipping" className="text-muted-foreground hover:text-primary text-sm transition-colors">Chính sách giao hàng</Link></li>
            <li><Link href="/returns" className="text-muted-foreground hover:text-primary text-sm transition-colors">Chính sách đổi trả</Link></li>
            <li><Link href="/faq" className="text-muted-foreground hover:text-primary text-sm transition-colors">Câu hỏi thường gặp</Link></li>
            <li><Link href="/contact" className="text-muted-foreground hover:text-primary text-sm transition-colors">Liên hệ</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-bold mb-6 text-foreground tracking-wide uppercase text-sm">Kết nối</h4>
          <ul className="space-y-4">
            <li><a href="#" className="text-muted-foreground hover:text-primary text-sm transition-colors">Instagram</a></li>
            <li><a href="#" className="text-muted-foreground hover:text-primary text-sm transition-colors">Facebook</a></li>
            <li><a href="#" className="text-muted-foreground hover:text-primary text-sm transition-colors">TikTok</a></li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 mt-16 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between">
        <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} CUPFY. All rights reserved.</p>
      </div>
    </footer>
  );
}
