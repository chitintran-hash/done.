import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <main className="min-h-screen bg-background pt-32 pb-24 font-sans">
      
      {/* 1. Hero Section */}
      <section className="container mx-auto px-6 mb-16">
        <div className="bg-primary rounded-3xl overflow-hidden relative min-h-[500px] flex items-center">
          <div className="absolute inset-0 z-0 opacity-40">
            {/* Background image placeholder */}
            <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=2040&auto=format&fit=crop')] bg-cover bg-center" />
          </div>
          <div className="relative z-10 p-12 lg:p-24 max-w-3xl text-white">
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tighter mb-6 leading-tight">
              Không biết <br /> tặng gì?
            </h1>
            <p className="text-xl lg:text-2xl mb-10 font-medium opacity-90 max-w-xl leading-relaxed">
              Khám phá những món quà phù hợp cho từng người, từng dịp và từng ngân sách.
            </p>
            <Link href="/gift-finder" className="inline-block bg-white text-primary px-8 py-4 rounded-full font-bold text-lg hover:bg-ug-cream transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              Tìm quà ngay
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Shop by Occasion */}
      <section className="container mx-auto px-6 mb-20">
        <h2 className="text-3xl font-bold text-center text-primary mb-10 tracking-tight">Quà cho dịp nào?</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {[
            { name: "Sinh nhật", img: "https://images.unsplash.com/photo-1530103862676-de8892ebeea6?w=400&q=80", link: "/products?occasion=sinh-nhat" },
            { name: "Kỷ niệm", img: "https://images.unsplash.com/photo-1518199268815-95a206b18cc6?w=400&q=80", link: "/products?occasion=ky-niem" },
            { name: "Tốt nghiệp", img: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&q=80", link: "/products?occasion=tot-nghiep" },
            { name: "Tân gia", img: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400&q=80", link: "/products?occasion=tan-gia" },
            { name: "Valentine", img: "https://images.unsplash.com/photo-1518199268815-95a206b18cc6?w=400&q=80", link: "/products?occasion=valentine" },
            { name: "Cảm ơn", img: "https://images.unsplash.com/photo-1606787620819-8bdf0c44c293?w=400&q=80", link: "/products?occasion=cam-on" }
          ].map((item, idx) => (
            <Link href={item.link} key={idx} className="group flex flex-col items-center">
              <div className="w-full aspect-square rounded-2xl overflow-hidden bg-ug-cream mb-4 relative shadow-sm group-hover:shadow-md transition-all">
                <Image src={item.img} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <span className="font-medium text-foreground group-hover:text-primary transition-colors text-lg">{item.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Shop by Recipient (Pastel background section) */}
      <section className="bg-ug-cream py-20 mb-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-primary mb-10 tracking-tight">Bạn đang tặng quà cho ai?</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { name: "Bạn gái / Vợ", link: "/products?recipient=ban-gai" },
              { name: "Bạn trai / Chồng", link: "/products?recipient=ban-trai" },
              { name: "Bạn thân", link: "/products?recipient=ban-than" },
              { name: "Mẹ", link: "/products?recipient=me" },
              { name: "Bố", link: "/products?recipient=bo" },
              { name: "Đồng nghiệp", link: "/products?recipient=dong-nghiep" },
              { name: "Thầy cô", link: "/products?recipient=thay-co" },
              { name: "Trẻ em", link: "/products?recipient=tre-em" }
            ].map((item, idx) => (
              <Link href={item.link} key={idx} className="bg-white hover:bg-primary hover:text-white text-primary font-bold px-8 py-4 rounded-full border border-primary/20 shadow-sm transition-all transform hover:-translate-y-1">
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Shop by Interest */}
      <section className="container mx-auto px-6 mb-20">
        <h2 className="text-3xl font-bold text-center text-primary mb-10 tracking-tight">Chọn quà theo sở thích</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[
            { name: "Công nghệ", img: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&q=80", link: "/products?interest=cong-nghe" },
            { name: "Gaming", img: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&q=80", link: "/products?interest=gaming" },
            { name: "Âm nhạc", img: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&q=80", link: "/products?interest=am-nhac" },
            { name: "Đọc sách", img: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&q=80", link: "/products?interest=doc-sach" },
            { name: "Làm đẹp", img: "https://images.unsplash.com/photo-1596462502278-27bf85033e5a?w=400&q=80", link: "/products?interest=lam-dep" },
            { name: "Thời trang", img: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&q=80", link: "/products?interest=thoi-trang" },
            { name: "Thể thao", img: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400&q=80", link: "/products?interest=the-thao" },
            { name: "Du lịch", img: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&q=80", link: "/products?interest=du-lich" },
            { name: "Decor", img: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400&q=80", link: "/products?interest=decor" },
            { name: "Nấu ăn", img: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400&q=80", link: "/products?interest=nau-an" },
            { name: "Thú cưng", img: "https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=400&q=80", link: "/products?interest=thu-cung" },
            { name: "Chụp ảnh", img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&q=80", link: "/products?interest=chup-anh" }
          ].map((item, idx) => (
            <Link href={item.link} key={idx} className="group relative rounded-2xl overflow-hidden h-32 flex items-center justify-center bg-gray-100">
              <Image src={item.img} alt={item.name} fill className="object-cover opacity-60 group-hover:opacity-80 group-hover:scale-110 transition-all duration-500" />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
              <span className="relative z-10 text-white font-bold text-lg drop-shadow-md">{item.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. Shop by Budget (Mint background section) */}
      <section className="bg-ug-mint py-20 mb-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-primary mb-10 tracking-tight">Quà theo ngân sách</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Dưới 200.000đ", link: "/products?budget=under-200k" },
              { name: "200.000đ - 500.000đ", link: "/products?budget=200k-500k" },
              { name: "500.000đ - 1.000.000đ", link: "/products?budget=500k-1m" },
              { name: "Trên 1.000.000đ", link: "/products?budget=over-1m" }
            ].map((item, idx) => (
              <Link href={item.link} key={idx} className="bg-white py-10 px-6 rounded-2xl text-center shadow-sm hover:shadow-xl border border-border/50 hover:border-primary/20 transition-all transform hover:-translate-y-2">
                <span className="text-xl font-bold text-primary">{item.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      {/* 6. Zodiac & Numerology */}
      <section className="container mx-auto px-6 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Link href="/products?zodiac=all" className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-12 text-center border border-indigo-100 hover:shadow-lg transition-all group">
            <h3 className="text-3xl font-bold text-indigo-900 mb-4 group-hover:scale-105 transition-transform">Cung Hoàng Đạo</h3>
            <p className="text-indigo-700/80 mb-6 font-medium">Khám phá món quà hoàn hảo cho tính cách của 12 chòm sao.</p>
            <span className="inline-block px-6 py-2 bg-indigo-100 text-indigo-800 font-bold rounded-full">Xem ngay</span>
          </Link>
          <Link href="/products?numerology=all" className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-3xl p-12 text-center border border-orange-100 hover:shadow-lg transition-all group">
            <h3 className="text-3xl font-bold text-orange-900 mb-4 group-hover:scale-105 transition-transform">Thần Số Học</h3>
            <p className="text-orange-700/80 mb-6 font-medium">Quà tặng tương ứng với năng lượng của các con số chủ đạo.</p>
            <span className="inline-block px-6 py-2 bg-orange-100 text-orange-800 font-bold rounded-full">Xem ngay</span>
          </Link>
        </div>
      </section>

    </main>
  );
}
