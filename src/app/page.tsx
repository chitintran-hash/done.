import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      {/* 1. Hero Section */}
      <section className="relative w-full h-[80vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden bg-accent/30">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-accent/50 to-transparent"></div>
        <h1 className="text-5xl md:text-7xl font-serif font-bold text-foreground mb-6 tracking-tight">
          Find your cup.<br/>
          <span className="text-primary">Make it yours.</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl font-medium">
          Những chiếc ly nhỏ xinh cho cà phê, trà sữa, nước ép và mọi khoảnh khắc hằng ngày của bạn.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/products" className="bg-primary hover:bg-primary/90 text-white font-medium px-8 py-4 rounded-full transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
            Shop Cups <ArrowRight className="w-5 h-5" />
          </Link>
          <Link href="/custom-cup" className="bg-white hover:bg-gray-50 text-foreground border border-border font-medium px-8 py-4 rounded-full transition-all flex items-center justify-center gap-2">
            Explore Custom Cup
          </Link>
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

      {/* 5. Shop by Mood Collections */}
      <section className="py-24 mb-10">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-center text-foreground mb-16">Shop by mood</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: "Pink Morning", desc: "Khởi đầu ngày mới với sắc hồng pastel ngọt ngào.", img: "https://images.unsplash.com/photo-1544885896-01584c6c0b39?w=600&q=80", link: "/products?collection=pink-morning" },
              { name: "Coffee Time", desc: "Dành cho những tâm hồn không thể thiếu cà phê.", img: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&q=80", link: "/products?collection=coffee-time" },
              { name: "Study Desk", desc: "Góc học tập gọn gàng với những chiếc ly truyền cảm hứng.", img: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=600&q=80", link: "/products?collection=study-desk" },
              { name: "Sweet Gift", desc: "Món quà dễ thương dành tặng người thương.", img: "https://images.unsplash.com/photo-1577937927133-66ef06acdf18?w=600&q=80", link: "/products?collection=sweet-gift" },
              { name: "Minimal Glass", desc: "Vẻ đẹp của sự trong trẻo và tối giản.", img: "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=600&q=80", link: "/products?collection=minimal-glass" },
              { name: "Summer Drink", desc: "Cho những thức uống mát lạnh xua tan mùa hè.", img: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&q=80", link: "/products?collection=summer-drink" }
            ].map((col, idx) => (
              <Link href={col.link} key={idx} className="group relative rounded-3xl overflow-hidden aspect-square flex flex-col justify-end p-8">
                <Image src={col.img} alt={col.name} fill className="object-cover transition-transform duration-1000 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
                <div className="relative z-10 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <h3 className="text-2xl font-serif font-bold text-white mb-2">{col.name}</h3>
                  <p className="text-white/80 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">{col.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}
