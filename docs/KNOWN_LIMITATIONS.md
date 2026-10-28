# FlashGroup — Tài Liệu Giới Hạn Kỹ Thuật & Phạm Vi Mô Phỏng (Known Limitations)

**Phiên bản:** Phase 12 Final Polish (Academic Prototype)  
**Phạm vi áp dụng:** Báo cáo đồ án, buổi thuyết trình môn học và đánh giá nguyên mẫu sản phẩm.

---

## 1. Bản Chất Sản Phẩm (Prototype Disclaimer)

FlashGroup là một **Nguyên mẫu Ứng dụng Học thuật (Academic Prototype)** được phát triển nhằm mục đích nghiên cứu, trình diễn và đánh giá giải pháp thương mại điện tử mua gom siêu cục bộ (Hyper-local Group Buying) kết hợp mô hình điểm nhận hàng thông minh (Smart Locker).

Hệ thống **KHÔNG PHẢI** là dịch vụ thương mại đại chúng đang hoạt động thực tế trên thị trường.

---

## 2. Các Giới Hạn Cụ Thể Cần Lưu Ý

### 2.1. Thanh toán mô phỏng (Simulated Payment)
- Các cổng thanh toán (Ví MoMo, VNPay QR, Thẻ ATM/Visa, Chuyển khoản ngân hàng) hiển thị trong ứng dụng là **giao diện mô phỏng quy trình thanh toán từ xa**.
- Hệ thống không kết nối với Merchant Gateway tiền thật và không khấu trừ tiền từ tài khoản ngân hàng thực tế của người dùng.
- Mọi giao dịch thành công đều nhằm phục vụ mục đích kiểm thử luồng lưu vết hợp đồng điện tử theo Nghị định 55/2024/NĐ-CP.

### 2.2. Vận chuyển & Tủ nhận hàng mô phỏng (Simulated Logistics & Smart Locker)
- Quy trình vận chuyển gom lô hàng và mã nhận hàng Locker (Locker PIN / QR Code) hoạt động dựa trên cơ sở dữ liệu mô phỏng logic trạng thái.
- Hệ thống không kết nối với phần cứng tủ Locker vật lý ngoài đời thực và không tích hợp API trực tiếp với các đơn vị bưu chính chuyển phát (GHN, Viettel Post, v.v.).

### 2.3. Khẳng định Pháp lý & Giấy phép (Legal & Certification Boundaries)
- Dự án **KHÔNG TUYÊN BỐ** đã đăng ký thiết lập website thương mại điện tử với Bộ Công Thương.
- Dự án **KHÔNG TUYÊN BỐ** sở hữu giấy phép cung ứng dịch vụ trung gian thanh toán của Ngân hàng Nhà nước hay giấy phép hoạt động bưu chính.
- Tất cả các quy chế, điều khoản mẫu và danh mục kiểm tra tuân thủ được xây dựng theo chuẩn quy định pháp luật Việt Nam (Luật BVNTD 2023, Nghị định 52/2013, Nghị định 85/2021, Nghị định 55/2024) phục vụ mục tiêu học thuật.

### 2.4. Bản đồ & Tọa độ Địa lý (Map & Geocoding Dependencies)
- Bản đồ FlashMap sử dụng MapLibre GL JS kết hợp nguồn Vector Tiles đường phố OpenStreetMap / CARTO mở.
- Độ chính xác của tên đường phố, ranh giới và số nhà phụ thuộc vào dữ liệu mở OpenStreetMap của cộng đồng tại thời điểm tải.
- Tọa độ các điểm Smart Locker và phòng gom trong kịch bản là dữ liệu demo được gắn tọa độ thực tế tại khu vực ĐHQG TP.HCM, Quận 1 và Quận 7 nhằm đảm bảo trải nghiệm trực quan.

### 2.5. Dữ liệu Người dùng & Reset Demo (Demo Data & Idempotency)
- Hệ thống được trang bị bộ dữ liệu mẫu (Initial Seed Data) với 3 vai trò: Buyer (Minh Anh), Supplier (HTX Nông Sản Đà Lạt), Admin (Ban Quản Trị FlashGroup).
- Tính năng "Reset Demo" chỉ khôi phục các bản ghi mẫu có cờ định danh `is_demo = true` hoặc khóa lưu trữ cục bộ, không làm ảnh hưởng đến dữ liệu sản xuất thực tế trên Supabase.

---

## 3. Khuyến Nghị Cho Đánh Giá Viên

- Khi đánh giá tính năng thời gian thực (Realtime Sync): Khuyến nghị mở 2 cửa sổ trình duyệt (hoặc 1 cửa sổ Ẩn danh và 1 cửa sổ Thường) để trải nghiệm việc cập nhật tức thì khi nấc giá 20/20 được mở khóa.
- Khi đánh giá giao diện trên điện thoại di động: Khuyến nghị dùng chế độ Device Toolbar (F12) với kích thước iPhone 14/15 (390 × 844) hoặc cài đặt PWA trực tiếp lên thiết bị di động để trải nghiệm mượt mà nhất.
