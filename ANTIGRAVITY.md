# ANTIGRAVITY — HƯỚNG DẪN DỰ ÁN FLASHGROUP

## 1. THÔNG TIN DỰ ÁN
* **Tên dự án:** FlashGroup — Càng Đông, Càng Rẻ (Nền tảng Mua chung Siêu Cục Bộ & Smart Locker)
* **GitHub Repository:** `https://github.com/chitintran-hash/done.git` (Nhánh: `main`)
* **Production Web (Vercel CI/CD):** [https://cupfy.space](https://cupfy.space) & [https://www.cupfy.space](https://www.cupfy.space)
* **Cơ chế tự động:** Mỗi khi thực hiện `git push origin main`, Vercel sẽ tự động kích hoạt build pipeline và cập nhật phiên bản mới lên `https://cupfy.space` trong vòng 30 giây.

---

## 2. NGUYÊN TẮC BẤT BIẾN (INVARIANTS - KHÔNG ĐƯỢC PHÁ VỠ)
1. **Chế độ Demo mặc định (`useLocalDemoMode: true`):**
   * Trong `src/App.tsx`, luôn giữ `useLocalDemoMode: true` và `currentUser` mặc định là tài khoản Buyer (`buyer@flashgroup.demo` - Nguyễn Minh Anh).
   * Giúp ban giám khảo, thầy cô và người dùng truy cập web thực tế vào được trải nghiệm ngay mà không bị chặn bởi màn hình cấu hình Supabase.
2. **Kịch bản Demo cốt lõi (Core Presentation Flow):**
   * Deal Dâu Tây Đà Lạt (`room-dau-dalat`): Trạng thái ban đầu 19/20 suất, giá 99.000đ.
   * Khi Buyer tham gia thêm 1 suất $\to$ Nhóm đạt mốc 20/20 $\to$ Kích hoạt mức giá sỉ rẻ nhất: 89.000đ.
   * Phí vận chuyển chia sẻ: 60.000đ / 20 người = 3.000đ/người $\to$ Tổng thanh toán đơn hàng: 92.000đ.
   * Hoàn tất thanh toán demo $\to$ Tạo đơn hàng, mở khóa mã QR nhận hàng tại Tủ Smart Locker KTX Khu A.
3. **Presenter Panel (Thanh Trình Chiếu Nổi):**
   * Giữ nguyên thanh Presenter Panel góc màn hình cho người thuyết trình dễ dàng chuyển đổi mượt mà giữa 3 vai trò:
     * **Buyer** (Người mua)
     * **Supplier** (Nhà cung cấp - Nông Trại Xanh)
     * **Admin** (Quản trị viên sàn FlashGroup)

---

## 3. HỆ THỐNG MÀU SẮC THƯƠNG HIỆU CHUẨN
* **Night Skies (`#000181`):** Màu tối chủ đạo, tiêu đề cấp cao, thanh điều hướng, footer.
* **Blue Raspberry (`#006EE9`):** Nút kêu gọi hành động (CTA chính), liên kết, tab active.
* **Powdered Lime (`#D0FFA4`):** Mở khóa giá sỉ, nhóm gom thành công, badge ưu đãi. Luôn dùng chữ `#000181` trên nền lime.
* **Violet (`#E8A0FF`):** Khối chia sẻ bạn bè (Referral), điểm nhấn mạng xã hội. Luôn dùng chữ `#000181` trên nền violet.
* **Sunny Skies (`#83E7FF`):** FlashMap, định vị địa lý, thẻ trạm Smart Locker & Logistics. Luôn dùng chữ `#000181` trên nền sky.

---

## 4. QUY TRÌNH PHÁT TRIỂN & DEPLOYMENT
1. **Bước 1:** Chỉnh sửa mã nguồn theo yêu cầu công việc.
2. **Bước 2:** Chạy kiểm tra biên dịch nghiệm ngặt:
   ```bash
   npm run build
   ```
   (Yêu cầu `tsc -b && vite build` hoàn thành với **0 lỗi**).
3. **Bước 3:** Đẩy trực tiếp lên GitHub để Vercel deploy lên production:
   ```bash
   git add .
   git commit -m "Mô tả nội dung cập nhật"
   git push origin main
   ```
