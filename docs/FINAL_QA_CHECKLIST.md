# FlashGroup — Bảng Kiểm Tra Chất Lượng Sản Phẩm Cuối Cùng (Final QA Checklist)

**Dự án:** FlashGroup — Nền Tảng Mua Gom Siêu Cục Bộ  
**Phiên bản kiểm định:** Phase 12 Final Polish (Presentation & Submission Ready)  
**Trạng thái kiểm tra:** **ĐẠT (PASSED) 10/10 LĨNH VỰC**

---

## 1. BUYER (Trải nghiệm Người Mua)

- [x] **Khám phá phòng gom (Discovery):**
  - Tải danh sách phòng gom theo khoảng cách siêu cục bộ và danh mục.
  - Tìm kiếm sản phẩm không giật lag nhờ Debounce 350ms (`useDebounce`).
  - Empty state hiển thị lịch sự kèm nút đặt lại khi không khớp kết quả tìm kiếm.
- [x] **Tham gia phòng gom (Join Room):**
  - Stepper chọn số lượng 1–5 sản phẩm.
  - Dự báo mức giá mở khóa ngay trong modal khi số lượng tăng.
  - Nút bấm có trạng thái `isSubmitting` chống click đúp tạo đơn trùng lặp.
  - Đạt ngưỡng phòng: Tự động tính lại giá sỉ cho toàn bộ thành viên trong nhóm.
- [x] **Xác lập hợp đồng từ xa & Thanh toán (Checkout):**
  - Checkbox bắt buộc: người mua chủ động tích chọn xác nhận điều khoản giao dịch từ xa (không tích sẵn).
  - Chọn địa chỉ nhà riêng qua bộ chọn địa chỉ phân cấp 5 cấp hành chính chuẩn Việt Nam hoặc nhận tại Smart Locker.
  - Mã ưu đãi (Voucher): Kiểm tra tính hợp lệ, thời hạn, hạn mức tối thiểu, không giảm giá ảo.
  - Phí giao hàng chia sẻ hiển thị minh bạch (tổng cước chia đều số người tham gia).
  - Lưu hồ sơ Snapshot hợp đồng bất biến theo thời gian thực.
- [x] **Quản lý đơn hàng & Nhận hàng (Orders & Pickup):**
  - Danh sách đơn hàng cá nhân với trạng thái rõ ràng: Chờ gom, Đã chốt giá, Đang vận chuyển, Sẵn sàng nhận tại Locker, Đã nhận.
  - Mã QR nhận hàng độc bản tại điểm Smart Locker.
  - Gửi đánh giá trung thực (không thể xóa đánh giá của người mua).
  - Khiếu nại & Tranh chấp: Tạo hồ sơ khiếu nại theo mã đơn kèm đồng hồ SLA 3 ngày làm việc.

---

## 2. SUPPLIER (Trải nghiệm Nhà Cung Cấp)

- [x] **Xác minh tư cách pháp lý (Verification):**
  - Trạng thái xác minh: Chỉ nhà cung cấp được Admin phê duyệt mới hiển thị huy hiệu “ĐÃ XÁC MINH”.
  - Tài khoản chờ duyệt: Các phòng gom mới tạo tự động lưu ở dạng Bản nháp (Draft).
  - Cảnh báo vi phạm nội dung: Bộ lọc tự động chặn các tuyên bố không căn cứ như "100%", "rẻ nhất", "tốt nhất".
- [x] **Quản lý phòng gom & Sản phẩm:**
  - Thiết lập bảng giá sỉ bậc thang linh hoạt theo ngưỡng số lượng tối thiểu.
  - Giá bán không tự giảm theo đồng hồ đếm ngược; chỉ giảm khi lượng mua đạt bậc.
- [x] **Vận chuyển gom lô (Consolidated Logistics):**
  - Đóng gói toàn bộ sản phẩm của phòng thành một lô hàng duy nhất chuyển về Smart Locker.
  - Cập nhật chặng giao hàng: Đã tiếp nhận → Đang vận chuyển → Đã đến Locker.
- [x] **Doanh thu & Đối soát tài chính (Payouts):**
  - Báo cáo doanh thu minh bạch: GMV hàng hóa, hoa hồng sàn (7%), phí vận chuyển không tính hoa hồng.
  - Thực nhận ròng được tính chính xác (Ví dụ: Lô Dâu 20 hộp = 1.780.000đ - 124.600đ hoa hồng = 1.655.400đ).
  - Nút gửi yêu cầu đối soát định kỳ kèm lịch sử giao dịch.

---

## 3. ADMIN (Trang Giám Sát & Quản Trị)

- [x] **Tổng quan vận hành (Overview):**
  - Bảng thống kê người dùng, nhà cung cấp, phòng gom, doanh thu GMV và hoa hồng.
  - Tất cả số liệu demo đều gắn nhãn rõ ràng: `DỮ LIỆU DEMO`.
- [x] **Phê duyệt & Hậu kiểm (Moderation & Compliance):**
  - Phê duyệt hồ sơ pháp lý nhà cung cấp (Giấy phép kinh doanh, ATTP).
  - Rà soát các báo cáo sản phẩm vi phạm từ cộng đồng.
  - Phê duyệt hoặc từ chối các yêu cầu đối soát thanh toán của nhà cung cấp.
- [x] **Nhật ký kiểm toán bất biến (Immutable Audit Trail):**
  - Ghi nhận đầy đủ mã sự kiện, người thực hiện, thời gian timestamp và chi tiết payload cho mọi hành động trọng yếu (chốt giá, thanh toán, hoàn tiền, đổi trạng thái hồ sơ).

---

## 4. REALTIME (Đồng Bộ Dữ Liệu Thời Gian Thực)

- [x] **Kiểm thử đồng bộ hai trình duyệt (Two-Browser Sync Test):**
  - **Trình duyệt A (Buyer):** Nhấn tham gia sản phẩm thứ 20 phòng Dâu.
  - **Trình duyệt B (Viewer):** Số lượng nhảy ngay lập tức từ `19 → 20`, mức giá chuyển từ `99.000đ → 89.000đ` mà **không cần bấm F5 tải lại trang**.
- [x] **Chat phòng gom thời gian thực:**
  - Tin nhắn gửi từ thành viên hiển thị lập tức trong panel thảo luận của phòng.
  - Không xuất hiện tin nhắn trùng lặp nhờ cơ chế khử trùng lặp khóa ID.
- [x] **Thông báo thời gian thực:**
  - Nhận thông báo tức thì khi mở khóa nấc giá mới, cập nhật trạng thái giao hàng hoặc có phản hồi khiếu nại.

---

## 5. MAP (Bản Đồ FlashMap Đường Phố Tương Tác)

- [x] **Basemap đường phố tương tác:**
  - Bản đồ Vector mượt mà, phóng to, thu nhỏ, xoay, kéo rê mượt mà.
  - Hiển thị đầy đủ đường phố, khu dân cư, công viên, sông ngòi và POI đô thị.
  - Không gặp lỗi màn hình bản đồ trắng (Blank Map).
- [x] **Địa danh & Chủ quyền Việt Nam:**
  - Hiển thị đúng và chuẩn mực nhãn Tiếng Việt: **QUẦN ĐẢO HOÀNG SA**, **QUẦN ĐẢO TRƯỜNG SA**.
  - Không có nhãn ngoại ngữ gây tranh chấp trên lãnh hải Việt Nam.
  - Không đè nhãn trùng lặp.
- [x] **Bộ lọc địa lý & Định vị:**
  - Lựa chọn Tỉnh/Thành phố, Quận/Huyện, Phường/Xã trực quan.
  - Nút định vị GPS vị trí hiện tại: xin quyền và xử lý từ chối quyền định vị an toàn.
  - Marker phòng gom, Smart Locker tương tác mở popup thông tin và tính khoảng cách chính xác.

---

## 6. MOBILE (Trải Nghiệm Thiết Bị Di Động)

- [x] **Khả năng tương thích kích thước màn hình (Responsive):**
  - Đã kiểm tra và hiển thị hoàn hảo ở các kích thước chuẩn:
    - 320 × 568 (iPhone SE gen 1)
    - 360 × 800 (Android phổ thông)
    - 390 × 844 (iPhone 12 / 13 / 14)
    - 430 × 932 (iPhone 15 / 16 Pro Max)
    - 768 × 1024 (iPad)
    - 1440 × 900 (Desktop)
  - Hoàn toàn không bị tràn ngang (No horizontal scrolling bug).
- [x] **Thanh điều hướng dưới đáy (Mobile Bottom Navigation):**
  - Cố định ở mép dưới gồm 5 nút: KHÁM PHÁ, FLASHMAP, PHÒNG, ĐƠN HÀNG, TÀI KHOẢN.
  - Khung nội dung chính có đệm lề an toàn (`pb-20 md:pb-0`), không bị che khuất nút bấm hoặc footer.

---

## 7. SECURITY (An Ninh & Quyền Riêng Tư)

- [x] **Bảo vệ tọa độ và địa chỉ nhà riêng:**
  - Người mua khác tuyệt đối không thể xem được số nhà riêng, số điện thoại, email hoặc tọa độ GPS chính xác của Buyer.
- [x] **Kiểm toán Supabase RLS:**
  - Đầy đủ chính sách Row Level Security cho `buyer_addresses`, `orders`, `supplier_payouts`, `loyalty_transactions`, `users`.
  - Supplier không thể tự duyệt đối soát của chính mình.
  - User không thể tự đổi vai trò của mình thành Admin.
- [x] **Môi trường & Biến bí mật:**
  - Không lưu cứng API key, Service Role key hay mật khẩu người dùng trong mã nguồn Frontend.

---

## 8. COMPLIANCE (Tuân Thủ Pháp Lý Thương Mại Điện Tử)

- [x] **Công bố mô hình prototype:**
  - Luôn hiển thị nhãn rõ ràng: `PROTOTYPE HỌC THUẬT` & `DỮ LIỆU MÔ PHỎNG`.
  - Không mạo danh đã được Bộ Công Thương đăng ký, cấp phép ví điện tử hay giấy phép bưu chính chuyển phát.
- [x] **Chính sách pháp lý đầy đủ:**
  - 12 tài liệu quy chế và chính sách: Điều khoản sử dụng, Quyền riêng tư, Quy chế hoạt động sàn, Chính sách nhà cung cấp, Chính sách đổi trả/hoàn tiền, Quy tắc đánh giá trung thực.
  - Chân trang Footer có liên kết truy cập đầy đủ, không để đường dẫn chết (`#`).

---

## 9. PWA (Ứng Dụng Web Cấp Tiến)

- [x] **Manifest & Cài đặt ứng dụng:**
  - Tệp `manifest.json` đầy đủ biểu tượng SVG, màu nền `#FFFCF8` và theme `#68415F`.
  - Nút cài đặt ứng dụng xuất hiện mượt mà khi trình duyệt đủ điều kiện PWA.
- [x] **Service Worker & Cập nhật phiên bản:**
  - `public/sw.js` lưu đệm App Shell tĩnh, không lưu đệm cứng các API động, thanh toán hay Realtime.
  - Khi có bản dựng mới: Tự động hiển thị thanh thông báo: *“CÓ PHIÊN BẢN MỚI”* kèm nút *“CẬP NHẬT”*.
- [x] **Chế độ Ngoại tuyến (Offline Handling):**
  - Tự động hiển thị thanh cảnh báo ngoại tuyến khi mất mạng.
  - Khóa các thao tác nhạy cảm yêu cầu máy chủ xác nhận (Tham gia phòng, Thanh toán, Hoàn tiền, Rút tiền) với thông báo: *“CẦN KẾT NỐI MẠNG ĐỂ THỰC HIỆN THAO TÁC NÀY”*.

---

## 10. DEPLOYMENT (Đóng Gói & Triển Khai)

- [x] **Biên dịch mã nguồn (Production Build):**
  - Lệnh `npm run build` chạy thành công tuyệt đối, **0 lỗi TypeScript**.
  - Tách bundle tối ưu: `vendor-maplibre`, `vendor-supabase`, `vendor-icons`, `vendor-react`.
- [x] **Định tuyến máy chủ (SPA Routing):**
  - Tệp `vercel.json` cấu hình rewrite `/* -> /index.html` ngăn chặn lỗi 404 khi người dùng truy cập trực tiếp URL hoặc tải lại trang F5.
- [x] **Màn hình bắt lỗi toàn cục (Global Error Boundary):**
  - Mọi lỗi ngoại lệ runtime không lường trước đều được bắt gọn và hiển thị màn hình hỗ trợ tải lại trang thay vì màn hình trắng.
