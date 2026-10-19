export interface BlogArticle {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  author: string;
  category: string;
  readTime: string;
  coverImage: string;
  content: string[];
  callToActionText: string;
  callToActionLink: string;
}

export const BLOG_ARTICLES: BlogArticle[] = [
  {
    slug: 'cach-tu-thiet-ke-ly-ca-nhan-hoa-online',
    title: 'Cách Tự Thiết Kế Ly Cá Nhân Hóa Trực Tuyến Từ A-Z Trên Cupfy',
    excerpt: 'Hướng dẫn chi tiết từng bước sử dụng công cụ 3D Cup Design Studio tại Cupfy.space để tự thêm tên, thông điệp, hình ảnh và xem trước mô phỏng 360° trước khi đặt in.',
    publishedAt: '20/10/2026',
    author: 'Đội ngũ Thiết Kế Cupfy',
    category: 'Hướng Dẫn Thiết Kế',
    readTime: '4 phút đọc',
    coverImage: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=1000&q=80',
    content: [
      'Tự tay thiết kế một chiếc ly mang đậm phong cách cá nhân chưa bao giờ dễ dàng đến thế nhờ công nghệ mô phỏng 3D hiện đại của Cupfy. Dưới đây là quy trình 4 bước đơn giản giúp bạn sáng tạo chiếc ly ưng ý nhất:',
      '### Bước 1: Lựa chọn phôi ly phù hợp với nhu cầu',
      'Truy cập trang [Thiết Kế Ly](/custom-cup). Bạn có thể lựa chọn giữa ly thủy tinh cao cấp (dáng Highball, Rock, Can Glass, ly có quai) hoặc ly nhựa 2 lớp có nắp và ống hút tiện lợi. Mỗi loại ly đều có thông số dung tích và kích thước chi tiết.',
      '### Bước 2: Tùy biến màu sắc thân ly và nắp ly',
      'Đối với ly nhựa, bạn có thể tự do lựa chọn màu thân ly (trắng sứ, đen huyền, pastel...) và màu nắp đi kèm. Ly thủy tinh được giữ nguyên độ trong suốt quang học cao cấp giúp tôn màu đồ uống.',
      '### Bước 3: Thêm chữ, thông điệp và hình ảnh kỷ niệm',
      'Nhập câu quote bạn yêu thích, chọn trong hơn 20 font chữ tiếng Việt chuẩn đẹp, điều chỉnh kích thước và góc xoay. Bạn cũng có thể tải ảnh chân dung, hình thú cưng hoặc logo cá nhân lên.',
      '### Bước 4: Xoay 360° kiểm tra và bấm đặt in COD',
      'Kéo chuột để xoay chiếc ly 360 độ trong không gian 3D chân thật. Hệ thống sẽ kiểm tra vùng in an toàn và kết xuất bản in chuẩn xác cho máy in UV phẳng trước khi gửi hàng về tận tay bạn.'
    ],
    callToActionText: 'Trải nghiệm 3D Cup Design Studio ngay',
    callToActionLink: '/custom-cup',
  },
  {
    slug: 'ly-in-hinh-lam-qua-tang-sinh-nhat',
    title: 'Gợi Ý Mẫu Ly In Tên, In Hình Làm Quà Tặng Sinh Nhật Ý Nghĩa',
    excerpt: 'Khám phá những ý tưởng thiết kế ly cá nhân hóa độc đáo để làm quà tặng sinh nhật bất ngờ và ấm áp cho bạn thân, người yêu hoặc đồng nghiệp.',
    publishedAt: '20/10/2026',
    author: 'Biên Tập Viên Cupfy',
    category: 'Ý Tưởng Quà Tặng',
    readTime: '3 phút đọc',
    coverImage: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=1000&q=80',
    content: [
      'Sinh nhật luôn là dịp đặc biệt để gửi trao những món quà chan chứa yêu thương. Thay vì những món quà đại trà, một chiếc ly được in tên riêng, ngày sinh và hình ảnh kỷ niệm sẽ trở thành vật dụng gắn bó mỗi ngày.',
      '### 1. Ly in câu chúc ý nghĩa và biệt danh thân mật',
      'Một biệt danh đáng yêu cùng lời chúc ngắn gọn như "Uống đủ 2 lít nước mỗi ngày nhé!", "Always shine like a star ✨" đặt trên ly thủy tinh tối giản sẽ khiến người nhận mỉm cười mỗi khi uống nước.',
      '### 2. Ly in hình thú cưng hoặc khoảnh khắc đáng nhớ',
      'Nếu bạn bè là một "con sen" chính hiệu, việc in hình chú cún hoặc mèo cưng lên thân ly kèm sticker vui nhộn là món quà sinh nhật không thể tuyệt vời hơn.',
      '### 3. Đóng gói hộp quà cao cấp bảo hành bể vỡ',
      'Mỗi đơn hàng quà tặng tại [Cupfy Gifts](/gifts) đều được đóng gói tỉ mỉ trong hộp quà xinh xắn kèm lớp chống sốc đa tầng và cam kết bảo hành đổi mới 100% nếu có rủi ro vận chuyển.'
    ],
    callToActionText: 'Thiết kế món quà sinh nhật độc bản',
    callToActionLink: '/custom-cup',
  },
  {
    slug: 'bi-quyet-chon-hinh-anh-in-ly-dep',
    title: 'Bí Quyết Chọn Hình Ảnh & Logo Để In Lên Ly Đẹp Sắc Nét',
    excerpt: 'Tổng hợp kinh nghiệm chọn ảnh độ phân giải cao, cách xử lý ảnh tách nền PNG và lưu ý màu sắc để bản in UV trên ly đạt chất lượng tối đa.',
    publishedAt: '20/10/2026',
    author: 'Kỹ Thuật Viên Xưởng In Cupfy',
    category: 'Kinh Nghiệm In Ấn',
    readTime: '4 phút đọc',
    coverImage: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=1000&q=80',
    content: [
      'Chất lượng bản in trên ly phụ thuộc rất lớn vào chất lượng file ảnh đầu vào. Để sản phẩm in ra sắc nét và chuẩn màu như trên bản mô phỏng 3D, bạn nên lưu ý các tiêu chuẩn sau:',
      '### 1. Ưu tiên định dạng PNG tách nền trong suốt',
      'Nếu bạn in logo hoặc hình vẽ chibi, hãy sử dụng định dạng file PNG có nền trong suốt. Điều này giúp hình ảnh hòa quyện tự nhiên với màu thân ly mà không để lại khung viền chữ nhật thừa.',
      '### 2. Độ phân giải tối thiểu 1000px',
      'Kích thước khổ in phẳng thân ly tại Cupfy là 2048 × 1024 px. Do đó, hình ảnh có độ phân giải từ 1000px trở lên sẽ đảm bảo đường nét không bị mờ nhòe hay vỡ hạt sau khi in.',
      '### 3. Độ tương phản màu sắc',
      'Nếu bạn chọn ly thân trắng hoặc ly thủy tinh trong suốt, hãy chọn chữ hoặc họa tiết có màu sắc đậm (đen, đỏ, xanh đậm) hoặc có viền tương phản để hình in nổi bật rõ ràng.'
    ],
    callToActionText: 'Tải ảnh và thử nghiệm xem trước 3D',
    callToActionLink: '/custom-cup',
  },
  {
    slug: 'so-sanh-ly-thuy-tinh-va-ly-nhua',
    title: 'So Sánh Ly Thủy Tinh Và Ly Nhựa: Nên Chọn Loại Nào Cho Bạn?',
    excerpt: 'Phân tích ưu nhược điểm giữa ly thủy tinh chịu nhiệt và ly nhựa 2 lớp an toàn để bạn chọn được chiếc ly phù hợp nhất với thói quen uống nước.',
    publishedAt: '20/10/2026',
    author: 'Đội ngũ Tư Vấn Cupfy',
    category: 'Cẩm Nang Chọn Ly',
    readTime: '3 phút đọc',
    coverImage: 'https://images.unsplash.com/photo-1555529733-0e67056058e1?w=1000&q=80',
    content: [
      'Tại Cupfy, hai dòng ly được ưa chuộng nhất là ly thủy tinh pha lê và ly nhựa 2 lớp kèm nắp ống hút. Tùy theo không gian và thói quen sinh hoạt, bạn có thể lựa chọn loại ly tối ưu nhất:',
      '### Ly thủy tinh pha lê Borosilicate',
      '- **Ưu điểm:** Độ trong suốt cao, chịu nhiệt tốt từ nóng sang lạnh, không bám mùi, thích hợp cho cà phê, trà hoa, nước ép đặt tại bàn làm việc văn phòng hoặc quán cà phê.',
      '- **Cảm giác sử dụng:** Sang trọng, tinh tế và thân thiện với môi trường.',
      '### Ly nhựa 2 lớp có nắp & ống hút',
      '- **Ưu điểm:** Bền bỉ, chống rơi vỡ, trọng lượng nhẹ, có nắp đậy kín và ống hút tiện lợi khi di chuyển hoặc mang đi học, đi làm, đi tập thể thao.',
      '- **Cá nhân hóa:** Cho phép chọn màu sắc nắp ly và thân ly đa dạng hơn.'
    ],
    callToActionText: 'Xem tất cả mẫu ly tại Cửa hàng',
    callToActionLink: '/products',
  },
  {
    slug: 'thiet-ke-ly-in-logo-cho-quan-cafe',
    title: 'Thiết Kế Ly In Logo Nhận Diện Cho Quán Cà Phê, Trà Sữa',
    excerpt: 'Giải pháp in logo thương hiệu số lượng linh hoạt, tối ưu chi phí và tăng tính nhận diện chuyên nghiệp cho các quán đồ uống vừa và nhỏ.',
    publishedAt: '20/10/2026',
    author: 'Chuyên Viên Thương Hiệu Cupfy',
    category: 'Giải Pháp Doanh Nghiệp',
    readTime: '4 phút đọc',
    coverImage: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=1000&q=80',
    content: [
      'Một chiếc ly mang logo riêng không chỉ giúp thức uống trông hấp dẫn hơn mà còn là công cụ marketing truyền miệng vô cùng hiệu quả khi khách hàng chụp ảnh check-in.',
      '### Không giới hạn số lượng tối thiểu khắt khe',
      'Khác với các xưởng in truyền thống đòi hỏi số lượng từ vài nghìn chiếc, Cupfy hỗ trợ các quán cà phê, tiệm trà nhỏ thiết kế và in thử nghiệm số lượng linh hoạt với mức chi phí tối ưu.',
      '### Xem trước bản demo 3D trước khi duyệt in',
      'Chủ quán có thể tải logo của quán lên, điều chỉnh vị trí cân đối ở mặt trước và mặt sau, kiểm tra khoảng cách an toàn so với miệng ly và đáy ly trước khi chốt đơn sản xuất.',
      '### Hỗ trợ tư vấn giải pháp đồng bộ',
      'Cupfy cung cấp giải pháp trọn gói từ phôi ly chất lượng cao đến công nghệ in UV chống trầy xước, bền màu khi rửa bằng máy rửa bát.'
    ],
    callToActionText: 'Khám phá giải pháp ly doanh nghiệp',
    callToActionLink: '/gifts',
  }
];
