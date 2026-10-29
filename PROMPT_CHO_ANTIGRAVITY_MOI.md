# HƯỚNG DẪN & PROMPT GỬI CHO ANTIGRAVITY KHÁC ĐỂ BUILD LẠI WEB 100%

Tài liệu này được tạo ra để bạn có thể gửi cho một Antigravity (hoặc AI agent) khác để dựng lại toàn bộ dự án **FlashGroup** với độ chính xác **100%**, giữ nguyên toàn bộ tính năng Phase 1 đến Phase 12.

---

## 📦 CÁC FILE ĐÃ ĐƯỢC ĐÓNG GÓI SẴN TRONG THƯ MỤC DỰ ÁN

Tôi đã đóng gói sẵn toàn bộ mã nguồn của dự án thành 3 định dạng cực kỳ thuận tiện:

1. **`flashgroup_source_code.zip`** *(Dung lượng: ~550 KB)*
   - File nén ZIP chuẩn chứa toàn bộ thư mục: `src/`, `public/`, `supabase/`, `docs/`, `package.json`, `vite.config.ts`, `tailwind.config.js`, `tsconfig.json`, `index.html`, v.v.
   - Không chứa thư mục rác `node_modules` hay `dist`.

2. **`restore_flashgroup.cjs`** *(Dung lượng: ~2.19 MB)*
   - Script tự động giải nén (Self-extracting). Bạn chỉ cần gửi file này, Antigravity mới chỉ cần gõ lệnh `node restore_flashgroup.cjs` là toàn bộ 117 file source code được tự sinh ra đầy đủ 100%!

3. **`flashgroup_complete_bundle.json`** *(Dung lượng: ~2.19 MB)*
   - File JSON chứa cấu trúc mảng tất cả các file kèm đường dẫn tương đối và nội dung tương ứng.

---

## 📝 PROMPT COPY-PASTE ĐỂ GỬI CHO ANTIGRAVITY MỚI

> *Bạn hãy copy toàn bộ đoạn trong khung bên dưới và gửi trực tiếp cho Antigravity ở workspace mới:*

```text
Chào bạn, tôi muốn bạn tái tạo và chạy lại 100% dự án FlashGroup — Nền tảng Mua chung Trực tuyến theo khu vực (Social Group Buying Marketplace) từ mã nguồn đã được đóng gói sẵn.

Tôi đã gửi kèm cho bạn file mã nguồn (chọn một trong hai cách dưới đây):

[CÁCH 1: Nếu tôi gửi file flashgroup_source_code.zip]
Hãy giải nén file flashgroup_source_code.zip vào thư mục làm việc hiện tại của bạn.

[CÁCH 2: Nếu tôi gửi file restore_flashgroup.cjs]
Hãy chạy lệnh:
node restore_flashgroup.cjs
để tự động giải phóng toàn bộ 117 file mã nguồn vào đúng cấu trúc thư mục.

Sau khi các file đã được bung ra, hãy thực hiện các bước sau:
1. Chạy lệnh cài đặt thư viện:
   npm install

2. Kiểm tra bản build TypeScript & Vite:
   npm run build

3. Khởi động máy chủ phát triển:
   npm run dev -- --host

4. Kiểm tra các chức năng trọng yếu:
   - Bản đồ Vector FlashMap (MapLibre GL JS với nhãn tiếng Việt)
   - Bộ chọn địa chỉ hành chính Việt Nam (Tỉnh/Thành -> Quận/Huyện -> Phường/Xã -> Đường -> Số nhà)
   - Kịch bản Demo Dâu Tây Đà Lạt (room-dau-dalat):
     * Trước khi tham gia: 19/20 suất, giá 99.000đ
     * Người mua thêm 1 suất: Đạt 20/20 suất, giá kích hoạt mức 89.000đ
     * Toán tài chính: GMV 1.780.000đ, Phí sàn 7% = 124.600đ, Doanh thu ròng NCC = 1.655.400đ, Ship chia sẻ 3.000đ/người.
   - Bộ chuyển đổi vai trò nhanh trên Presenter Panel (Buyer / Supplier / Admin)
   - Chức năng Reset Demo Scenario không trùng lặp (idempotent)
   - Quyền riêng tư vị trí (Bảo vệ thông tin người mua, chỉ hiển thị điểm gom công cộng)

Hãy kiểm tra và xác nhận trang web chạy hoàn hảo 100% không có bất kỳ lỗi nào!
```

---

## 🛠 DANH MỤC THƯ VIỆN & CÔNG NGHỆ CHÍNH ĐÃ CẤU HÌNH

- **Framework & Build:** React 18, TypeScript, Vite 5, Tailwind CSS
- **Routing & State:** React Router DOM v6, LocalStorage fallback + Supabase Realtime
- **Bản đồ:** MapLibre GL JS (`maplibre-gl`), Leaflet & React Leaflet
- **Icons & UI:** Lucide React, Custom Tailwind styling, Responsive Mobile Bottom Nav
- **Cơ sở dữ liệu & Backend:** Supabase JS v2, Row Level Security (RLS) migrations trong `supabase/`
- **PWA:** Service Worker (`public/sw.js`), Web App Manifest (`public/manifest.json`), Offline banner & update notification
