import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Heart, Truck, ShieldCheck, Gift } from "lucide-react";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      {/* 1. Hero Section */}
      <section className="cupfy-hero">
        <div className="cupfy-hero-content container mx-auto">
          <h1 className="text-[56px] md:text-[72px] xl:text-[80px] leading-[1.1] font-bold mb-6 tracking-tight text-[#3B2725]" style={{ fontFamily: 'Nunito, Quicksand, sans-serif' }}>
            Find your cup.<br/>
            <span className="text-[#3B2725]">Make it yours.</span>
          </h1>
          
          <p className="text-[16px] md:text-[18px] mb-10 max-w-[420px] leading-relaxed font-medium text-[#6B4B4B]">
            Những chiếc ly nhỏ xinh cho cà phê, trà sữa, nước ép<br/>
            và mọi khoảnh khắc hằng ngày của bạn.
          </p>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-14">
            <Link href="/products" className="bg-[#D9788F] hover:bg-[#c2687d] text-[#FFFFFF] font-bold px-10 py-3.5 rounded-full transition-colors flex items-center justify-center gap-2 shadow-sm text-[16px] tracking-wide w-full sm:w-auto">
              Shop
            </Link>
            <Link href="/custom-cup" className="bg-transparent hover:bg-white/50 text-[#A84F66] border border-[#D9788F] font-bold px-8 py-3.5 rounded-full transition-colors flex items-center justify-center gap-2 text-[16px] w-full sm:w-auto">
              Explore Custom Cup
            </Link>
          </div>
        </div>

        {/* Mobile Image (Hidden on Desktop) */}
        <div className="hero-image-mobile hidden px-5 pb-5">
          <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-sm">
            <Image 
              src="/cupfy-hero.jpg" 
              alt="Cupfy aesthetic cups" 
              fill 
              className="object-cover object-right"
              priority
            />
          </div>
        </div>
      </section>

      {/* 2. Categories: Cups for every little moment */}
      <section className="py-24 container mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-center text-[#3B2725] mb-16">Cups for every little moment</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
          {[
            { name: "Ly uống cà phê", img: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&q=80", link: "/products?category=coffee" },
            { name: "Ly trà sữa", img: "https://images.unsplash.com/photo-1556881286-fc6915169721?w=600&q=80", link: "/products?category=milktea" },
            { name: "Ly thủy tinh", img: "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=600&q=80", link: "/products?category=glass" },
            { name: "Ly có ống hút", img: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&q=80", link: "/products?category=straw" },
            { name: "Ly giữ nhiệt", img: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&q=80", link: "/products?category=thermos" },
            { name: "Ly làm quà tặng", img: "https://images.unsplash.com/photo-1577937927133-66ef06acdf18?w=600&q=80", link: "/products?category=gift" },
            { name: "Ly văn phòng", img: "https://images.unsplash.com/photo-1505075954930-b3b4f6b643fa?w=600&q=80", link: "/products?category=office" },
            { name: "Phong cách tối giản", img: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=600&q=80", link: "/products?category=minimal" }
          ].map((item, idx) => (
            <Link href={item.link} key={idx} className="group flex flex-col items-center text-center">
              <div className="w-full aspect-[4/5] rounded-2xl overflow-hidden bg-muted mb-6 relative">
                <Image src={item.img} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out" />
              </div>
              <span className="font-medium text-[#6B4B4B] group-hover:text-[#D9788F] transition-colors text-lg">{item.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Best Selling Cups */}
      <section className="bg-muted/30 py-24">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#3B2725]">Best selling cups</h2>
            <Link href="/products?sort=bestseller" className="text-[#D9788F] font-medium hover:underline hidden sm:block">View all</Link>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
            {/* Demo Products */}
            {[
              { id: "1", name: "Cupfy Pink Glass", price: "89.000đ", img: "https://images.unsplash.com/photo-1544885896-01584c6c0b39?w=600&q=80", tags: ["New"] },
              { id: "2", name: "Cupfy Morning Coffee", price: "119.000đ", img: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&q=80", tags: ["Best Seller"] },
              { id: "3", name: "Cupfy Clear Straw", price: "149.000đ", img: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&q=80", tags: ["Customizable"] },
              { id: "4", name: "Cupfy Sweet Milk Tea", price: "179.000đ", img: "https://images.unsplash.com/photo-1556881286-fc6915169721?w=600&q=80", tags: [] }
            ].map((product, idx) => (
              <div key={idx} className="group relative flex flex-col">
                <Link href={`/products/${product.id}`} className="relative w-full aspect-square rounded-2xl overflow-hidden bg-white mb-4">
                  <Image src={product.img} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                  {product.tags.length > 0 && (
                    <div className="absolute top-3 left-3 flex flex-col gap-1">
                      {product.tags.map(tag => (
                        <span key={tag} className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-white/90 backdrop-blur-sm text-[#3B2725] rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
                <div className="flex flex-col flex-1">
                  <Link href={`/products/${product.id}`} className="font-bold text-lg text-[#3B2725] hover:text-[#D9788F] transition-colors mb-1">{product.name}</Link>
                  <span className="text-[#6B4B4B] font-medium">{product.price}</span>
                  <button className="mt-4 w-full py-3 rounded-full border border-[#D9788F] text-sm font-bold text-[#A84F66] hover:bg-[#D9788F] hover:text-white transition-all">
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Design your own cup */}
      <section className="py-24 container mx-auto px-6">
        <div className="bg-[#FFF3F6] rounded-3xl overflow-hidden flex flex-col md:flex-row items-stretch">
          <div className="w-full md:w-1/2 p-12 md:p-20 flex flex-col justify-center">
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#3B2725] mb-6">Design your own cup</h2>
            <p className="text-[#6B4B4B] text-lg mb-10 leading-relaxed max-w-md">
              Chọn mẫu ly bạn thích, thêm chữ, hình vẽ hoặc phong cách riêng của bạn. Cupfy sẽ biến ý tưởng đó thành chiếc ly dành riêng cho bạn.
            </p>
            <div>
              <Link href="/custom-cup" className="inline-flex bg-[#3B2725] hover:bg-[#201514] text-white font-bold px-8 py-4 rounded-full transition-all">
                Try Custom Cup
              </Link>
            </div>
          </div>
          <div className="w-full md:w-1/2 relative min-h-[400px]">
            <Image src="https://images.unsplash.com/photo-1610444391219-c90b633bfac8?w=800&q=80" alt="Design your own cup" fill className="object-cover" />
          </div>
        </div>
      </section>

      {/* 5. Shop by Mood Collections */}
      <section className="py-24 mb-10">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-center text-[#3B2725] mb-16">Shop by mood</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: "Pink Morning", desc: "Khởi đầu ngày mới với sắc hồng pastel ngọt ngào.", img: "https://images.unsplash.com/photo-1544885896-01584c6c0b39?w=600&q=80", link: "/products?collection=pink-morning" },
              { name: "Coffee Time", desc: "Dành cho những tâm hồn không thể thiếu cà phê.", img: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&q=80", link: "/products?collection=coffee-time" },
              { name: "Study Desk", desc: "Góc học tập gọn gàng với những chiếc ly truyền cảm hứng.", img: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=600&q=80", link: "/products?collection=study-desk" },
              { name: "Sweet Gift", desc: "Món quà dễ thương dành tặng người thương.", img: "https://images.unsplash.com/photo-1577937927133-66ef06acdf18?w=600&q=80", link: "/products?collection=sweet-gift" },
              { name: "Minimal Glass", desc: "Vẻ đẹp của sự trong trẻo và tối giản.", img: "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=600&q=80", link: "/products?collection=minimal-glass" },
              { name: "Summer Drink", desc: "Cho những thức uống mát lạnh xua tan mùa hè.", img: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&q=80", link: "/products?collection=summer-drink" }
            ].map((col, idx) => (
              <Link href={col.link} key={idx} className="group relative rounded-3xl overflow-hidden aspect-[4/3] flex flex-col justify-end p-8">
                <Image src={col.img} alt={col.name} fill className="object-cover transition-transform duration-1000 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#3B2725]/80 via-[#3B2725]/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
                <div className="relative z-10 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <h3 className="text-2xl font-serif font-bold text-white mb-2">{col.name}</h3>
                  <p className="text-white/90 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 font-medium">{col.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}
