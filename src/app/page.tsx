import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Heart, Truck, ShieldCheck, Gift } from "lucide-react";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen pt-24">
      {/* 1. Hero Section */}
      <section className="relative w-full h-[600px] xl:h-[700px] overflow-hidden bg-[#fedce0]">
        {/* Background Image (Mockup) */}
        <div 
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: "url('/hero-cupfy.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "right center",
            backgroundRepeat: "no-repeat",
          }}
        ></div>

                

        <div className="relative z-10 max-w-[1400px] mx-auto px-6 h-full flex flex-col justify-center">
          <div className="max-w-xl xl:max-w-2xl mt-8">
            <h1 className="text-[64px] xl:text-[80px] leading-[1.1] font-bold text-[#5c4a43] mb-6 tracking-tight drop-shadow-md" style={{ fontFamily: 'Nunito, Quicksand, sans-serif' }}>
              Find your cup.<br/>
              <span className="text-[#e3506c]" style={{ textShadow: "0 2px 10px rgba(255,255,255,0.8)" }}>Make it yours. <span className="font-normal text-[#ff6b8b]">♡</span></span>
            </h1>
            
            <p className="text-[17px] text-[#5c4a43] mb-10 max-w-[420px] leading-relaxed font-semibold drop-shadow-sm">
              Những chiếc ly nhỏ xinh cho cà phê, trà sữa, nước ép<br/>
              và mọi khoảnh khắc hằng ngày của bạn.
            </p>
            
            <div className="flex items-center gap-4 mb-14">
              <Link href="/products" className="bg-[#c85666] hover:bg-[#a63c4a] text-white font-bold px-10 py-3.5 rounded-full transition-colors flex items-center justify-center gap-2 shadow-md text-[15px] tracking-wide">
                Shop
              </Link>
              <Link href="/custom-cup" className="bg-transparent hover:bg-white/50 text-[#5c4a43] border border-[#5c4a43] font-medium px-8 py-3.5 rounded-full transition-colors flex items-center justify-center gap-2 text-[15px]">
                Explore Custom Cup
              </Link>
            </div>

            </div>
        </div>
      </section>

      {/* 2. Categories: Cups for every little moment */}
      <section className="py-24 container mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-center text-foreground mb-16">Cups for every little moment</h2>
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
              <span className="font-medium text-foreground group-hover:text-primary transition-colors text-lg">{item.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Best Selling Cups */}
      <section className="bg-muted/50 py-24">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground">Best selling cups</h2>
            <Link href="/products?sort=bestseller" className="text-primary font-medium hover:underline hidden sm:block">View all</Link>
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
                        <span key={tag} className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-white/90 backdrop-blur-sm text-foreground rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
                <div className="flex flex-col flex-1">
                  <Link href={`/products/${product.id}`} className="font-medium text-lg text-foreground hover:text-primary transition-colors mb-1">{product.name}</Link>
                  <span className="text-muted-foreground">{product.price}</span>
                  <button className="mt-4 w-full py-3 rounded-full border border-border text-sm font-medium text-foreground hover:bg-primary hover:text-white hover:border-primary transition-all">
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
        <div className="bg-accent/40 rounded-3xl overflow-hidden flex flex-col md:flex-row items-stretch">
          <div className="w-full md:w-1/2 p-12 md:p-20 flex flex-col justify-center">
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground mb-6">Design your own cup</h2>
            <p className="text-muted-foreground text-lg mb-10 leading-relaxed max-w-md">
              Chọn mẫu ly bạn thích, thêm chữ, hình vẽ hoặc phong cách riêng của bạn. Cupfy sẽ biến ý tưởng đó thành chiếc ly dành riêng cho bạn.
            </p>
            <div>
              <Link href="/custom-cup" className="inline-flex bg-foreground hover:bg-black text-white font-medium px-8 py-4 rounded-full transition-all">
                Try Custom Cup
              </Link>
            </div>
          </div>
          <div className="w-full md:w-1/2 relative min-h-[400px]">
            <Image src="https://images.unsplash.com/photo-1610444391219-c90b633bfac8?w=800&q=80" alt="Design your own cup" fill className="object-cover" />
          </div>
        </div>
      </section>
    </main>
  );
}
