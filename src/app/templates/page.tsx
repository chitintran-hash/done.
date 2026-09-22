import Image from 'next/image';
import Link from 'next/link';

export default function TemplatesPage() {
  const templates = [
    { id: 1, name: "Birthday Vibe", img: "https://images.unsplash.com/photo-1530103862676-de8892ebe6d9?w=600&q=80", color: "#FFEDA8" },
    { id: 2, name: "Minimalist Art", img: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=600&q=80", color: "#EAE7DE" },
    { id: 3, name: "Summer Fresh", img: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&q=80", color: "#FFD1D1" },
    { id: 4, name: "Coffee Lover", img: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&q=80", color: "#E0D5C1" },
    { id: 5, name: "Pet Friendly", img: "https://images.unsplash.com/photo-1544885896-01584c6c0b39?w=600&q=80", color: "#E8F3FF" },
    { id: 6, name: "Gradient Magic", img: "https://images.unsplash.com/photo-1556881286-fc6915169721?w=600&q=80", color: "#FFE4F8" },
  ];

  return (
    <div className="min-h-screen pt-[120px] pb-24 bg-[#FFF9E8]">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#3B2725] mb-6">Mẫu thiết kế (Templates)</h1>
          <p className="text-[#6B4B4B] text-lg">
            Khởi đầu nhanh chóng với hàng loạt mẫu thiết kế đẹp mắt được tạo sẵn. Chọn mẫu bạn thích và bắt đầu tuỳ chỉnh theo ý muốn!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {templates.map(template => (
            <div key={template.id} className="group flex flex-col bg-white rounded-3xl p-6 shadow-sm border border-border hover:shadow-lg transition-all">
              <div 
                className="w-full aspect-square rounded-2xl overflow-hidden mb-6 relative"
                style={{ backgroundColor: template.color }}
              >
                <Image 
                  src={template.img} 
                  alt={template.name} 
                  fill 
                  className="object-cover mix-blend-multiply opacity-90 group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <h3 className="font-bold text-xl text-[#3B2725] mb-2">{template.name}</h3>
              <p className="text-muted-foreground mb-6">Chỉnh sửa màu sắc, thêm chữ, thay đổi sticker...</p>
              
              <Link href="/custom-cup" className="mt-auto block text-center w-full bg-[#FFF9E8] text-[#3B2725] border border-[#EAE7DE] py-3 rounded-full font-bold hover:bg-[#FFEDA8] transition-colors">
                Dùng mẫu này
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
