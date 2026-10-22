# BÁO CÁO ĐỒ ÁN MÔN THƯƠNG MẠI ĐIỆN TỬ
## ĐỀ TÀI: XÂY DỰNG NỀN TẢNG THƯƠNG MẠI ĐIỆN TỬ D2C CÁ NHÂN HÓA SẢN PHẨM TRỰC TUYẾN - CUPFY.SPACE

---

* **Tên thương hiệu:** Cupfy
* **Tên miền dự án:** `Cupfy.space`
* **Slogan:** *"Your cup. Your vibe. Your story."*
* **Môn học:** Thương mại điện tử (E-Commerce)
* **Mô hình triển khai:** D2C (Direct-to-Consumer) kết hợp Mass Customization (Cá nhân hóa quy mô lớn)

---

## MỤC LỤC TỔNG QUAN

1. [CHƯƠNG 1: TỔNG QUAN DỰ ÁN & MÔ HÌNH KINH DOANH](#chương-1-tổng-quan-dự-án--mô-hình-kinh-doanh)
2. [CHƯƠNG 2: KIẾN TRÚC KỸ THUẬT & CƠ SỞ DỮ LIỆU](#chương-2-kiến-trúc-kỹ-thuật--cơ-sở-dữ-liệu)
3. [CHƯƠNG 3: LUỒNG NGƯỜI MUA (BUYER EXPERIENCE / CUSTOMER FLOW)](#chương-3-luồng-người-mua-buyer-experience--customer-flow)
4. [CHƯƠNG 4: TÍNH NĂNG TẶNG QUÀ TƯƠNG TÁC 3D (PHIÊN BẢN DEMO)](#chương-4-tính-năng-tặng-quà-tương-tác-3d-phiên-bản-demo)
5. [CHƯƠNG 5: LUỒNG NGƯỜI BÁN & QUẢN TRỊ VIÊN (SELLER / ADMIN FLOW)](#chương-5-luồng-người-bán--quản-trị-viên-seller--admin-flow)
6. [CHƯƠNG 6: ĐÁNH GIÁ ĐIỂM NỔI BẬT & KẾT LUẬN ĐỒ ÁN](#chương-6-đánh-giá-điểm-nổi-bật--kết-luận-đồ-án)

---

## CHƯƠNG 1: TỔNG QUAN DỰ ÁN & MÔ HÌNH KINH DOANH

### 1.1. Giới thiệu thương hiệu Cupfy
**Cupfy** là thương hiệu kinh doanh ly uống nước và giải pháp cá nhân hóa sản phẩm trực tuyến tại Việt Nam. Thông qua nền tảng thương mại điện tử **Cupfy.space**, khách hàng có thể dễ dàng lựa chọn các dòng ly thủy tinh chịu nhiệt Borosilicate cao cấp, ly nhựa 2 lớp cách nhiệt, ly sứ hoặc tự tay sáng tạo chiếc ly độc bản cho riêng mình với công nghệ mô phỏng 3D thời gian thực.

Sản phẩm của Cupfy hướng đến:
- Người tiêu dùng cá nhân (sử dụng hàng ngày, học tập, làm việc, thể hiện phong cách sống).
- Nhu cầu quà tặng cá nhân hóa cho bạn bè, người thân vào các dịp kỷ niệm, sinh nhật, lễ Tết.
- Khách hàng doanh nghiệp vừa và nhỏ, các thương hiệu cà phê, trà sữa có nhu cầu in logo nhận diện thương hiệu với số lượng linh hoạt.

### 1.2. Mục tiêu của đồ án
Dự án được xây dựng nhằm đáp ứng 2 mục tiêu lớn trong môn Thương mại điện tử:

1. **Mục tiêu 1 - Xây dựng hệ sinh thái TMĐT D2C cá nhân hóa hoàn chỉnh:**
   - Ứng dụng công nghệ đồ họa 3D WebGL trực tiếp trên trình duyệt, cho phép người mua tự thiết kế, xoay 360 độ xem trước thành phẩm trước khi đặt hàng.
   - Hoàn thiện toàn bộ quy trình mua hàng chuẩn: Tìm kiếm $\to$ Tùy biến $\to$ Giỏ hàng $\to$ Thanh toán an toàn (COD / VietQR tự động) $\to$ Theo dõi trạng thái đơn hàng thời gian thực.
   - Xây dựng hệ thống bảng điều khiển quản trị (Admin Dashboard) toàn diện cho người bán: Quản lý đơn hàng, quản lý kho, theo dõi sản phẩm, cấu hình vận chuyển, bóc tách doanh thu các tùy chọn thiết kế và tính toán lợi nhuận.

2. **Mục tiêu 2 - Phát triển tính năng Tặng quà tương tác ảo (Phiên bản Demo thử nghiệm):**
   - **LƯU Ý:** Đây là **tính năng DEMO thử nghiệm** nhằm phục vụ bài tập lớn / đồ án môn Thương mại điện tử, chưa phải là dịch vụ tặng quà và giao vận chính thức có tính phí thật.
   - **Mục đích:** Trình diễn giải pháp nâng cao trải nghiệm khách hàng số (Digital Customer Experience). Cho phép người gửi tự thiết kế ly, chọn hộp quà ảo, viết thiệp chúc và tạo liên kết gửi cho bạn bè. Người nhận có thể mở hộp quà 3D, chiêm ngưỡng chiếc ly được thiết kế riêng cùng hiệu ứng pháo hoa giấy và đọc lời nhắn nhủ chân thành. Tính năng này hoạt động thực tế trên website để mô phỏng tương tác, nhưng không phát sinh giao dịch tài chính thật.

### 1.3. Mô hình kinh doanh & Phân khúc thị trường
- **Mô hình cốt lõi:** **D2C (Direct to Consumer)** cắt giảm các khâu trung gian, kết nối trực tiếp từ xưởng in đến tay người tiêu dùng cuối cùng.
- **Chiến lược giá trị:** Kết hợp giữa bán sản phẩm có sẵn (Ready-to-use Drinkware) và bán dịch vụ tùy biến theo yêu cầu (On-Demand Customization & UV Printing).
- **Phân khúc khách hàng mục tiêu:**
  - Gen Z, sinh viên và nhân viên văn phòng yêu thích đồ dùng cá nhân độc lạ, thẩm mỹ cao.
  - Các cặp đôi, bạn bè có nhu cầu gửi gắm tình cảm qua quà tặng kỷ niệm mang dấu ấn riêng.
  - Các quán cà phê, startup trẻ cần sản xuất ly in thương hiệu số lượng từ ít đến vừa.

---

## CHƯƠNG 2: KIẾN TRÚC KỸ THUẬT & CƠ SỞ DỮ LIỆU

### 2.1. Ngăn xếp công nghệ (Technology Stack)
Nền tảng Cupfy được phát triển dựa trên các công nghệ web hiện đại nhất hiện nay:
- **Framework nền tảng:** Next.js 16 (App Router), React 19, TypeScript.
- **Đồ họa không gian 3D:** Three.js, React Three Fiber (`@react-three/fiber`), React Three Drei (`@react-three/drei`), Canvas 2D Dynamic Texture.
- **Giao diện & Chuyển động:** Tailwind CSS v4, Framer Motion, Lucide Icons.
- **Backend & Cơ sở dữ liệu:** Supabase (PostgreSQL, Supabase Auth, Row Level Security, Supabase Storage).
- **Quản lý trạng thái Client:** Zustand (`useCartStore`, `useLanguageStore`).
- **Thanh toán:** Tích hợp VietQR chuẩn NAPAS 247 và Thanh toán khi nhận hàng (COD).
- **Quốc tế hóa:** Hệ thống song ngữ Tiếng Việt & Tiếng Anh.

### 2.2. Sơ đồ kiến trúc tổng thể

```
[ Khách hàng / Buyer ]  <====== HTTPS ======>  [ Trình duyệt Web (Next.js 16) ]
                                                     │
                                       ┌─────────────┴─────────────┐
                                       ▼                           ▼
                           [ Giao diện Khách hàng ]     [ 3D Studio WebGL Engine ]
                           - Cửa hàng & Tìm kiếm        - Three.js / Canvas Texture
                           - Giỏ hàng & Thanh toán      - Tự động bóc tách maquette
                           - Mở quà Demo 3D             - Bảng báo giá Real-time
                                       │                           │
                                       └─────────────┬─────────────┘
                                                     ▼
                                          [ Server Actions (Node.js) ]
                                                     │
                       ┌─────────────────────────────┼─────────────────────────────┐
                       ▼                             ▼                             ▼
              [ Supabase Auth ]            [ PostgreSQL Database ]        [ Supabase Storage ]
              - Quản lý phiên đăng nhập     - orders, products, profiles  - Lưu trữ ảnh sản phẩm,
              - Phân quyền Admin / Buyer    - inventory, reviews, gifts   - File in ấn độ nét cao
                       │
                       ▼
         [ Bảng Quản Trị / Admin ]
         - KPI, Doanh thu, Lợi nhuận
         - Đơn hàng, Kho vận, Xưởng in
```

---

## CHƯƠNG 3: LUỒNG NGƯỜI MUA (BUYER EXPERIENCE / CUSTOMER FLOW)

Toàn bộ trải nghiệm của người mua được thiết kế liền mạch từ lúc khám phá đến khi nhận hàng:

```
[ Khám Phá & Tìm Kiếm ] ──> [ Xem Chi Tiết / Chọn Mẫu ] ──> [ 3D Studio Tùy Biến ]
                                                                     │
┌────────────────────────────────────────────────────────────────────┘
│
└──> [ Thêm Giỏ Hàng ] ──> [ Nhập Địa Chỉ & Chọn COD/VietQR ] ──> [ Theo Dõi Đơn Hàng ]
```

### 3.1. Khám phá, Tìm kiếm & Lọc sản phẩm
- **Trang chủ (`/`):**
  - Banner Hero tương tác với khẩu hiệu *"Customize Your Cup"*.
  - Khối cam kết dịch vụ: Mô phỏng 3D 360°, In UV sắc nét bền màu, Đóng hộp quà sang trọng, Giao hàng toàn quốc.
  - Khu vực trưng bày **Mẫu có sẵn nổi bật (Featured Templates)** và **Sản phẩm mới bán chạy**.
  - Banner giới thiệu trải nghiệm tặng quà ảo tương tác.
- **Cửa hàng (`/products`):**
  - Danh mục bộ lọc thông minh: Lọc theo chất liệu (Thủy tinh Borosilicate chịu nhiệt, Ly nhựa PP 2 lớp), dung tích (350ml, 400ml, 500ml), mức giá và trạng thái còn hàng.
  - **Thanh tìm kiếm Live Search:** Xử lý từ khóa tiếng Việt không dấu và có dấu tức thì (ví dụ: gõ `thuy tinh`, `brainrot`, `ly quai` đều trả về đúng kết quả dưới 200ms).
- **Trang chi tiết sản phẩm (`/products/[id]`):**
  - Trình xem ảnh sắc nét, thông số kích thước, khả năng chịu nhiệt.
  - Đánh giá sao và nhận xét từ khách hàng thực tế.
  - Nút **"Thêm vào giỏ"** (mua bản tiêu chuẩn) hoặc **"Tùy biến với 3D Studio"** (đưa phôi ly vào xưởng thiết kế).
- **Thư viện mẫu có sẵn (`/templates`):**
  - Bộ sưu tập các mẫu thiết kế sẵn theo xu hướng: *Brainrot Edition*, *Classic Facet*, *Dáng cao công sở*, *Ly quai đôi bạn thân*...
  - Khách có thể mua trực tiếp hoặc bấm **"Tùy biến mẫu này"** để đưa vào Studio tiếp tục cá nhân hóa.

### 3.2. Studio Thiết Kế Ly 3D Trực Quan (`/custom-cup`)
Trái tim công nghệ của Cupfy với các tính năng vượt trội:
1. **Mô phỏng 3D thời gian thực:**
   - Xoay 360 độ tự do, phóng to, thu nhỏ và thay đổi góc nhìn.
   - 3 Chế độ nền: *Studio Bàn Trắng* (có bóng đổ mềm), *Nền Trắng Tinh*, *Nền Trong Suốt*.
   - Công tắc bật/tắt **Đường viền vùng in an toàn (Safe Zone)** giúp khách căn chỉnh chữ và hình ảnh chuẩn xác, không bị tràn ra ngoài vùng in của xưởng.
2. **Lựa chọn phôi ly linh hoạt:**
   - Đổi dáng ly (Dáng cao, dáng lùn, có quai cầm...). Giá gốc của phôi ly được cập nhật đồng bộ với kho hàng thực tế.
   - Tùy chỉnh màu phôi ly và độ trong suốt chất liệu.
3. **Thêm chữ & Khắc tên (Text Layer):**
   - Hỗ trợ đầy đủ font chữ Việt hóa độc đáo.
   - Tùy biến màu chữ, kích thước, độ mờ đục, căn lề, góc xoay.
4. **Tải ảnh cá nhân & Logo (Upload Layer):**
   - Cho phép tải ảnh cá nhân, ảnh gia đình, logo công ty (PNG, JPG).
   - Tự do di chuyển, kéo dãn tỉ lệ và xoay ảnh trực tiếp trên thân ly.
5. **Kho Sticker phong phú:**
   - Hàng chục mẫu sticker theo chủ đề: đồ uống, bánh ngọt, biểu tượng cảm xúc, quote tạo động lực.
   - **Cơ chế tự động hóa:** Khi khách bấm thêm sticker, hệ thống tự động xóa dòng chữ placeholder *"YOUR LOGO"*, giữ ly luôn sạch đẹp và không tính thừa phí in chữ.
6. **Lựa chọn phụ kiện đóng gói:**
   - Hộp quà sang trọng (`+25.000đ`), Thiệp mừng viết lời chúc (`+10.000đ`), Túi giấy kraft quai vải (`+15.000đ`).
7. **Bảng báo giá thời gian thực minh bạch:**
   - Tách bạch rõ ràng từng hạng mục: `Giá phôi ly` + `Phí in chữ (15.000đ)` + `Phí in ảnh (20.000đ)` + `Phí sticker (Miễn phí kèm in chữ / 15.000đ khi dán riêng)` + `Phụ kiện quà tặng` = `Tổng thanh toán`.

### 3.3. Giỏ hàng & Quy trình Đặt hàng - Thanh toán
- **Giỏ hàng (`/cart`):**
  - Quản lý số lượng từng món đồ.
  - Với sản phẩm Custom: Hiển thị hình ảnh render chân thật của thiết kế và danh mục các phụ kiện kèm theo.
  - Ô nhập mã giảm giá (Voucher) chiết khấu trực tiếp vào hóa đơn.
- **Thanh toán bảo mật (`/checkout`):**
  - **Yêu cầu đăng nhập tài khoản:** Đảm bảo dữ liệu khách hàng chính xác và bảo vệ lịch sử đơn hàng.
  - **Biểu mẫu nhận hàng chuẩn TMĐT:** Xác thực chặt chẽ số điện thoại (10 chữ số bắt đầu bằng 0), email và địa chỉ hành chính 3 cấp (*Tỉnh/Thành* $\to$ *Quận/Huyện* $\to$ *Phường/Xã*).
  - **Phương thức thanh toán:**
    - **COD (Thanh toán khi nhận hàng):** Khách nhận hàng, kiểm tra và thanh toán tiền mặt.
    - **Chuyển khoản ngân hàng VietQR tự động:** Hệ thống tự động sinh mã QR NAPAS247 kèm chính xác số tài khoản shop, số tiền và mã đơn hàng, loại bỏ hoàn toàn sai sót khi nhập tay.
- **Xác nhận đơn hàng (`/order-confirmation`):** Cung cấp mã đơn hàng, tóm tắt chi phí và trạng thái xác nhận.

### 3.4. Quản lý Tài khoản & Theo dõi Đơn hàng
- **Hồ sơ cá nhân (`/account`):** Quản lý thông tin liên hệ và địa chỉ giao hàng.
- **Theo dõi đơn hàng thời gian thực (`/orders/[id]`):**
  - Khách hàng xem tiến độ đơn hàng qua thanh trạng thái trực quan:
    *Chờ xác nhận* $\longrightarrow$ *Xưởng in đang xử lý* $\longrightarrow$ *Đang giao hàng* $\longrightarrow$ *Giao thành công*.
  - Xem lại chi tiết từng món hàng và các thông số thiết kế chiếc ly đã đặt.

### 3.5. Cộng đồng, Blog & Câu chuyện xưởng ly
- **Cộng đồng Cupfy (`/community`):** Nơi khách hàng và admin chia sẻ những mẫu ly sáng tạo, truyền cảm hứng cho người dùng khác.
- **Blog phong cách sống (`/blog`):** Cung cấp cẩm nang sử dụng ly thủy tinh đúng cách, mẹo bảo quản hình in UV và gợi ý quà tặng.
- **Giới thiệu & Nhật ký xưởng (`/about`):** Kể về câu chuyện thương hiệu và đăng tải hình ảnh hoạt động sản xuất thực tế tại xưởng.

---

## CHƯƠNG 4: TÍNH NĂNG TẶNG QUÀ TƯƠNG TÁC 3D (PHIÊN BẢN DEMO)

> [!NOTE]
> **THÔNG TIN QUAN TRỌNG:**
> Tính năng **Tặng quà tương tác (Interactive Gift Experience)** là **tính năng DEMO thử nghiệm** phục vụ đồ án môn Thương mại điện tử, chưa phải chức năng tặng quà và giao hàng chính thức. Mục đích là cho phép khách hàng trải nghiệm quá trình tự thiết kế ly, chọn hộp quà, viết lời nhắn và gửi một liên kết mở quà ảo cho bạn bè. Người nhận có thể truy cập liên kết, mở hộp quà và xem chiếc ly đã được thiết kế riêng. Tính năng này hoạt động thực tế trên website để mô phỏng tương tác khách hàng, nhưng không phát sinh đơn hàng hoặc giao dịch tài chính thật.

### 4.1. Quy trình dành cho người gửi quà (Sender Flow)
1. **Thiết kế ly trong Studio 3D:** Khách thiết kế chiếc ly với câu quote, tên người nhận hoặc hình ảnh kỷ niệm.
2. **Kích hoạt tính năng:** Bấm nút **"Gửi tặng bạn bè (Demo)"** trên thanh công cụ Studio.
3. **Tùy biến hộp quà ảo:**
   - Chọn màu sắc & phong cách hộp quà (Hộp Kraft Vintage, Hộp Đen Sang Trọng, Hộp Pastel Ngọt Ngào...).
   - Nhập họ tên người nhận và viết lời chúc mừng.
4. **Tạo liên kết mở quà:** Hệ thống khởi tạo một mã liên kết độc bản duy nhất (Ví dụ: `Cupfy.space/gift/[giftToken]`). Người gửi có thể sao chép liên kết này gửi qua Zalo, Messenger, SMS...

### 4.2. Trải nghiệm dành cho người nhận quà (Recipient Flow)
1. **Mở liên kết:** Người nhận truy cập vào liên kết được tặng trên điện thoại hoặc máy tính.
2. **Hoạt cảnh hộp quà 3D:** Màn hình hiển thị hộp quà 3D thắt nơ ruy băng đung đưa đầy bất ngờ.
3. **Mở hộp quà (Unboxing):** Khi người nhận bấm vào hộp, nắp hộp quà tự động mở bung kết hợp cùng hiệu ứng **pháo hoa giấy rực rỡ (Confetti)**.
4. **Chiêm ngưỡng sản phẩm:** Chiếc ly 3D do người gửi tự thiết kế từ từ bay lên từ lòng hộp và tự động xoay 360 độ để người nhận ngắm nhìn từng chi tiết.
5. **Đọc thiệp chúc mừng:** Tấm thiệp mở ra hiển thị lời nhắn nhủ ấm áp và tên của người tặng.

---

## CHƯƠNG 5: LUỒNG NGƯỜI BÁN & QUẢN TRỊ VIÊN (SELLER / ADMIN FLOW)

Bảng điều khiển quản trị tập trung tại phân hệ `/admin` với đầy đủ 12 công cụ chuyên nghiệp phục vụ quản lý kinh doanh D2C:

```
                                  [ HỆ THỐNG QUẢN TRỊ ADMIN CUPFY ]
                                                 │
        ┌──────────────┬──────────────┬──────────┴───┬──────────────┬──────────────┐
        ▼              ▼              ▼              ▼              ▼              ▼
  [ Tổng quan ]  [ Phân tích ]  [ Đơn hàng ]   [ Sản phẩm ]   [ Kho hàng ]   [ Vận chuyển ]
     (KPI)       (Analytics)      (Orders)      (Products)    (Inventory)     (Shipping)
        │              │              │              │              │              │
        ▼              ▼              ▼              ▼              ▼              ▼
  [ Xưởng in ]  [ Khách hàng ] [ Doanh thu ]   [ Chi phí ]    [ Báo cáo ]    [ Cài đặt ]
   (Custom)        (Users)       (Revenue)       (Profit)      (Reports)      (Settings)
```

---

### 5.1. Dashboard Tổng quan (`/admin`)
- **4 Thẻ chỉ số KPI cốt lõi:**
  - *Tổng doanh thu lũy kế (VND)*.
  - *Lợi nhuận gộp thực tế (VND)*.
  - *Tổng số đơn hàng phát sinh*.
  - *Tổng số khách hàng đăng ký*.
- **Biểu đồ doanh số:** Trực quan hóa tăng trưởng doanh thu theo ngày/tuần/tháng.
- **Biểu đồ cơ cấu sản phẩm:** Đánh giá tỷ trọng doanh số giữa các dòng ly và phụ kiện.
- **Danh sách đơn hàng mới:** Cảnh báo các đơn hàng vừa phát sinh để xưởng tiến hành xử lý kịp thời.

---

### 5.2. Phân tích Truy cập & Hiệu suất (`/admin/analytics`)
- Thống kê lượt xem trang (Pageviews), lượng người truy cập độc lập (Unique Visitors).
- Tỷ lệ chuyển đổi đơn hàng (Conversion Rate %).
- Thống kê tỷ lệ thiết bị người dùng (Di động vs Máy tính để bàn) và thời gian phiên truy cập trung bình.

---

### 5.3. Quản lý Đơn hàng Toàn diện (`/admin/orders`)
- **Bộ lọc đa trạng thái:** Phân loại đơn hàng theo tiến độ (*Chờ xác nhận*, *Đang xử lý*, *Đang giao hàng*, *Đã giao thành công*, *Đã hủy*).
- **Chi tiết đơn hàng chuyên sâu:**
  - Thông tin người nhận: Họ tên, số điện thoại, địa chỉ chi tiết, ghi chú đơn hàng.
  - Phương thức thanh toán: COD hoặc VietQR (kèm trạng thái đã thanh toán/chưa thanh toán).
  - **Thông số in ấn ly Custom:** Trực quan hóa ảnh render phẳng (2D canvas texture), chi tiết nội dung chữ, tên font, mã màu chữ, file ảnh logo gốc và danh sách phụ kiện đóng gói đi kèm.
  - **Cập nhật trạng thái:** Khi Admin đổi trạng thái đơn, hệ thống sẽ tự động cập nhật ngay trên trang tra cứu đơn hàng của người mua.

---

### 5.4. Quản lý Sản phẩm & Mẫu có sẵn (`/admin/products`)
- Danh sách sản phẩm đầy đủ kèm công cụ tìm kiếm và lọc theo danh mục.
- **Thêm mới / Sửa sản phẩm:**
  - Tên sản phẩm, mã SKU, danh mục hàng hóa.
  - Giá bán lẻ (Price) và Giá vốn nhập hàng (Cost Price) phục vụ tính toán lợi nhuận tự động.
  - Tải ảnh sản phẩm lên máy chủ lưu trữ (Supabase Storage).
  - Nhập thông số kỹ thuật (Dung tích, chất liệu, khả năng chịu nhiệt).
  - **Cờ đánh dấu "Mẫu có sẵn":** Khi kích hoạt cờ này, sản phẩm sẽ tự động hiển thị trong Thư viện mẫu (`/templates`) của khách hàng.

---

### 5.5. Quản lý Kho hàng & Tồn kho (`/admin/inventory`)
- Quản lý định mức tồn kho cho từng loại phôi ly, nắp ly, ống hút, hộp quà và thiệp.
- **Cảnh báo tồn kho an toàn (Low stock alert):** Tự động phát hiện và cảnh báo khi số lượng phôi ly xuống dưới ngưỡng quy định.
- Lịch sử xuất nhập kho rõ ràng, minh bạch.

---

### 5.6. Quản lý Vận chuyển & Giao vận (`/admin/shipping`)
- Thiết lập bảng giá cước vận chuyển theo khu vực địa lý (Nội thành, Ngoại thành, Các tỉnh thành khác).
- Cài đặt chính sách Miễn phí vận chuyển (Freeship) khi tổng đơn hàng đạt giá trị tối thiểu.
- Cấu hình thời gian giao hàng dự kiến để hiển thị cho khách hàng ở bước Thanh toán.

---

### 5.7. Phân hệ Xưởng in & Yêu cầu thiết kế (`/admin/custom-requests`)
- Khu vực chuyên biệt phục vụ cho bộ phận kỹ thuật xưởng in UV:
  - Tổng hợp toàn bộ các đơn hàng có thiết kế riêng.
  - Tải xuống file ảnh gốc chất lượng cao của khách hàng để nạp vào máy in phẳng công nghiệp.
  - Xem trước bản mô phỏng 3D để đối chiếu vị trí in, độ nghiêng và màu sắc trước khi xuất xưởng.

---

### 5.8. Quản trị Khách hàng (`/admin/users`)
- Danh sách toàn bộ tài khoản người dùng đã đăng ký trên hệ thống.
- Thống kê lịch sử đơn hàng của từng tài khoản.
- Tính toán Giá trị vòng đời khách hàng (Customer Lifetime Value - CLV) để nhận diện khách hàng thân thiết và triển khai chính sách chăm sóc phù hợp.

---

### 5.9. Quản trị Doanh thu & Bóc tách Tùy chọn Custom (`/admin/revenue`)
- **Bộ lọc thời gian phản hồi tức thì:** Cho phép chọn xem *Hôm nay*, *7 ngày qua*, *30 ngày qua*, *90 ngày qua*, *Năm nay*, *Toàn bộ thời gian* (xử lý bất đồng bộ qua Server Action, dữ liệu cập nhật dưới 100ms mà không làm tải lại trang).
- **Thẻ bóc tách doanh thu Tùy chọn thiết kế ly (Custom Studio):**
  - *Doanh thu Phôi ly gốc*.
  - *Doanh thu Phí in chữ / Khắc tên (+15.000đ/vị trí)*.
  - *Doanh thu Phí in ảnh màu / Logo (+20.000đ/ảnh)*.
  - *Doanh thu Phí sticker trang trí*.
  - *Doanh thu Hộp quà & Phụ kiện đóng gói*.
  - *Tổng doanh thu phân hệ ly tùy biến*.
- **Xuất dữ liệu kế toán:** Hỗ trợ xuất file báo cáo **CSV / Excel** chi tiết theo mốc thời gian đã chọn.

---

### 5.10. Quản lý Chi phí & Lợi nhuận ròng (`/admin/profit`)
- Tự động đối soát Giá vốn hàng bán (COGS) dựa trên giá nhập phôi ly, chi phí mực in UV và chi phí phụ kiện đóng gói.
- Tính toán Lợi nhuận gộp (Gross Profit) và Tỷ suất biên lợi nhuận ròng (Net Margin %) trên từng đơn hàng và toàn bộ hệ thống.

---

### 5.11. Báo cáo Kinh doanh Định kỳ (`/admin/reports`)
- Tổng hợp báo cáo kết quả hoạt động kinh doanh theo tháng, quý, năm.
- Bảng xếp hạng Top 5 sản phẩm bán chạy nhất và Top 5 khách hàng có giá trị đơn hàng cao nhất.

---

### 5.12. Cài đặt Cửa hàng & Cấu hình Hệ thống (`/admin/settings`)
- Thiết lập thông tin thương hiệu Cupfy: Tên xưởng, hotline, địa chỉ kho hàng, email hỗ trợ.
- **Cấu hình Cổng thanh toán VietQR:** Nhập thông tin tài khoản ngân hàng (Ngân hàng, Số tài khoản, Tên chủ tài khoản) để tự động sinh mã VietQR chuẩn trên trang thanh toán của khách.

---

### 5.13. Quản trị Nội dung Website (CMS)
- Đăng tải bài viết và hình ảnh hoạt động sản xuất xưởng trong trang `/about`.
- Kiểm duyệt và quản trị bài chia sẻ trong trang `/community`.
- Soạn thảo và xuất bản bài viết cẩm nang tại trang `/blog`.

---

## CHƯƠNG 6: ĐÁNH GIÁ ĐIỂM NỔI BẬT & KẾT LUẬN ĐỒ ÁN

### 6.1. Bảng so sánh ưu thế cạnh tranh của Cupfy

| Tiêu chí so sánh | Cửa hàng ly truyền thống / Sàn TMĐT (Shopee, TikTok) | Nền tảng Cupfy.space |
| :--- | :--- | :--- |
| **Xem trước sản phẩm** | Chỉ có ảnh chụp tĩnh 2D, khó hình dung sản phẩm thực tế. | **Mô phỏng 3D 360° tương tác thời gian thực** mọi góc cạnh. |
| **Quy trình cá nhân hóa** | Nhắn tin riêng cho shop duyệt mẫu thủ công mất 1-2 ngày. | **Tự thiết kế trực tiếp** trên web, xem kết quả và duyệt giá ngay. |
| **Minh bạch chi phí** | Báo giá gộp chung chung, dễ phát sinh phụ phí sau chốt đơn. | **Bảng giá thời gian thực**, tách rõ tiền phôi, tiền in, tiền hộp quà. |
| **Trải nghiệm quà tặng** | Đóng gói thông thường, thiếu sự bất ngờ cá nhân. | **Tính năng Tặng quà tương tác Demo 3D**, người nhận được đập hộp và ngắm ly ảo trước. |
| **Xử lý đơn xưởng in** | Dễ nhầm lẫn file in ấn qua tin nhắn chat rời rạc. | **Đồng bộ ảnh texture phẳng và thông số kỹ thuật** thẳng vào đơn hàng Admin. |
| **Quản trị tài chính** | Thống kê thủ công trên sổ sách hoặc Excel ngoài. | **Hệ thống bóc tách doanh thu tự động** chi tiết từng loại phụ phí in. |

### 6.2. Kết luận đánh giá đồ án
Dự án **Cupfy.space** đã hoàn thành xuất sắc các yêu cầu của một đồ án môn Thương mại điện tử:
1. **Tính hoàn thiện quy trình TMĐT:** Xây dựng đầy đủ chuỗi giá trị từ Marketing tiếp cận, Trải nghiệm sản phẩm số, Thanh toán an toàn, Quản trị đơn hàng xưởng in đến Báo cáo tài chính.
2. **Tính công nghệ & Sáng tạo:** Ứng dụng thành công công nghệ 3D WebGL (Three.js/React Three Fiber) trực tiếp trên web cùng tính năng Tặng quà tương tác ảo Demo độc đáo.
3. **Tính khả thi và thương mại hóa:** Nền tảng sở hữu cơ sở dữ liệu chặt chẽ, bảo mật cao với Supabase RLS, giao diện mượt mà trên mọi thiết bị và hoàn toàn sẵn sàng kết nối với dây chuyền sản xuất thực tế tại Việt Nam.

---
*Tài liệu được tổng hợp và xuất bản phục vụ nộp báo cáo đồ án môn Thương mại điện tử.*
