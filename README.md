# FlashGroup — Càng Đông, Càng Rẻ

Nền tảng Mua chung Trực tuyến Siêu Cục Bộ (Social Group Buying Marketplace) kết hợp Điểm nhận hàng thông minh qua Smart Locker.

🌐 **Website chính thức:** [https://cupfy.space](https://cupfy.space) (hoặc [https://www.cupfy.space](https://www.cupfy.space))  
💻 **Hướng dẫn dành riêng cho Antigravity / AI Agent:** Xem chi tiết tại [ANTIGRAVITY.md](./ANTIGRAVITY.md).

---

## 🚀 Hướng Dẫn Phát Triển Cho Thành Viên Nhóm

### 1. Kéo mã nguồn mới nhất về máy
```bash
git pull origin main
npm install
```

### 2. Khởi chạy môi trường thử nghiệm trên máy (Local)
```bash
npm run dev
```
Truy cập địa chỉ hiển thị trong terminal (mặc định: `http://localhost:5173`).

### 3. Kiểm tra lỗi & Build mã nguồn
```bash
npm run build
```

### 4. Đẩy cập nhật lên Website thật (`cupfy.space`)
Mỗi khi bạn `git push` lên nhánh `main`, hệ thống Vercel sẽ **tự động build và cập nhật** lên `cupfy.space` sau ~30 giây:
```bash
git add .
git commit -m "Mô tả tính năng hoặc lỗi vừa sửa"
git push origin main
```

---

## 🍓 Kịch Bản Demo Trọng Tâm (Thuyết Trình & Chấm Điểm)
1. **Deal Dâu Tây Đà Lạt (room-dau-dalat):** Đang ở mức 19/20 suất (giá 99.000đ).
2. Người mua tham gia thêm 1 suất -> Đạt mốc 20/20 suất -> Kích hoạt bảng giá sỉ **89.000đ**.
3. Phí vận chuyển chia sẻ: 60.000đ / 20 suất = **3.000đ/người**.
4. Tổng thanh toán: **92.000đ** -> Nhận mã QR mở tủ Smart Locker tại KTX Khu A.
5. Thanh điều khiển Presenter Panel góc màn hình cho phép chuyển nhanh qua vai trò **Nhà cung cấp (Supplier)** và **Quản trị viên (Admin)** để demo đầy đủ quy trình.
