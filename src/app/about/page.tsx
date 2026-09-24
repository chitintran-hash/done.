import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-[120px] pb-24 bg-[#F7F6F2]">
      <div className="container mx-auto px-6">
        
        <div className="max-w-4xl mx-auto bg-white rounded-[3rem] p-8 md:p-16 shadow-sm border border-border">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#3B2725] mb-6">Câu chuyện của Cupfy</h1>
            <p className="text-[#6F625E] text-lg max-w-2xl mx-auto">
              Chúng tôi tin rằng, mỗi chiếc ly không chỉ để đựng nước, mà còn là nơi lưu giữ những khoảnh khắc, cảm xúc và cá tính của riêng bạn.
            </p>
          </div>

          <div className="relative w-full aspect-video rounded-3xl overflow-hidden mb-16">
            <Image src="https://images.unsplash.com/photo-1555529733-0e67056058e1?w=1200&q=80" alt="Cupfy Workshop" fill className="object-cover" />
          </div>

          <div className="space-y-12 text-[#3B2725] leading-relaxed">
            <div>
              <h2 className="text-2xl font-serif font-bold mb-4">Sứ mệnh của chúng tôi</h2>
              <p>
                Ra đời từ niềm đam mê với những vật dụng nhỏ bé nhưng mang lại niềm vui lớn, Cupfy là không gian sáng tạo nơi bất kỳ ai cũng có thể tự tay thiết kế nên chiếc ly mơ ước của mình. Chúng tôi muốn biến việc uống nước mỗi ngày trở thành một trải nghiệm đầy màu sắc và cảm hứng.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-[#F7F6F2] p-8 rounded-2xl">
                <h3 className="font-bold text-xl mb-3">Chất lượng hàng đầu</h3>
                <p className="text-[#6F625E] text-sm">Từ phôi ly thủy tinh chịu nhiệt Borosilicate đến công nghệ in decal nung nhiệt độ cao, mọi sản phẩm của Cupfy đều được kiểm tra nghiêm ngặt để đảm bảo an toàn tuyệt đối cho sức khỏe người dùng.</p>
              </div>
              <div className="bg-[#FFF3A6] p-8 rounded-2xl">
                <h3 className="font-bold text-xl mb-3">Sáng tạo không giới hạn</h3>
                <p className="text-[#6F625E] text-sm">Giao diện thiết kế 3D trực quan giúp bạn dễ dàng thêm chữ, hình ảnh, thay đổi màu sắc và xem trước sản phẩm thực tế ở mọi góc độ một cách chân thực nhất.</p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-serif font-bold mb-4">Cam kết bền vững</h2>
              <p>
                Sử dụng ly cá nhân là một hành động tuyệt vời để giảm thiểu rác thải nhựa. Cupfy cam kết sử dụng bao bì đóng gói thân thiện với môi trường và liên tục tối ưu quy trình sản xuất để góp phần bảo vệ hành tinh xanh của chúng ta.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
