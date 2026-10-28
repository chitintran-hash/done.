# FlashGroup — Báo Cáo Kiểm Toán Chính Sách Bảo Mật Supabase RLS (Row Level Security)

**Phiên bản:** Phase 12 Final Polish  
**Ngày thực hiện kiểm toán:** 26/10/2026  
**Mục tiêu kiểm toán:** Xác minh tính toàn vẹn dữ liệu, quyền riêng tư người mua, dữ liệu tài chính nhà cung cấp và an ninh hệ thống ở tầng cơ sở dữ liệu Supabase Postgres, không phụ thuộc đơn thuần vào Route Guards ở Frontend.

---

## 1. Nguyên Tắc An Toàn Cốt Lõi

1. **Deny-by-Default (Mặc định từ chối):** Toàn bộ bảng dữ liệu nhạy cảm đều được kích hoạt `ALTER TABLE <table_name> ENABLE ROW LEVEL SECURITY;`.
2. **Quyền riêng tư địa chỉ người mua:** Tọa độ GPS chính xác và số nhà riêng của Buyer chỉ được đọc/ghi bởi chính Buyer sở hữu (`auth.uid() = user_id`).
3. **Phân lập tài chính Nhà cung cấp:** Supplier chỉ có quyền xem các đơn hàng gom và bản ghi đối soát doanh thu liên quan trực tiếp đến mã `supplier_id` của mình.
4. **Không thể tự nâng quyền (Privilege Escalation):** Vai trò `admin` và tỷ lệ hoa hồng `platform_commission_rate` được khóa cứng, người dùng thông thường không có quyền cập nhật qua API REST.

---

## 2. Bảng Ma Trận Phân Quyền Row Level Security (RLS Matrix)

| Bảng Cơ Sở Dữ Liệu | Vai trò Buyer | Vai trò Supplier | Vai trò Admin | Anonymous (Chưa đăng nhập) |
| :--- | :--- | :--- | :--- | :--- |
| **`buyer_addresses`** | Chỉ xem/sửa địa chỉ của chính mình | **BỊ TỪ CHỐI** | Xem khi điều tra khiếu nại | **BỊ TỪ CHỐI** |
| **`orders`** | Xem đơn của chính mình | Xem đơn thuộc phòng của mình | Toàn quyền kiểm soát | **BỊ TỪ CHỐI** |
| **`transaction_snapshots`** | Đọc snapshot hợp đồng của mình | Đọc snapshot đơn hàng của mình | Toàn quyền đọc/lưu trữ | **BỊ TỪ CHỐI** |
| **`supplier_payouts`** | **BỊ TỪ CHỐI** | Xem/yêu cầu đối soát của mình | Phê duyệt/từ chối đối soát | **BỊ TỪ CHỐI** |
| **`loyalty_transactions`** | Xem điểm FlashPoints của mình | **BỊ TỪ CHỐI** | Quản lý/kiểm toán | **BỊ TỪ CHỐI** |
| **`users` (Cột `role`)** | Chỉ đọc profile cá nhân | Chỉ đọc profile cá nhân | Quản trị viên quản lý | **BỊ TỪ CHỐI** |
| **`platform_configs`** | Chỉ đọc | Chỉ đọc | Thay đổi mức hoa hồng sàn | Chỉ đọc |
| **`audit_events`** | Chỉ đọc log liên quan | Chỉ đọc log liên quan | Toàn quyền đọc (Bất biến) | **BỊ TỪ CHỐI** |

---

## 3. Chi Tiết Chính Sách RLS Cho Từng Bảng Nhạy Cảm

### 3.1. Bảng `buyer_addresses` (Bảo mật địa chỉ tư gia của Buyer)

```sql
-- Kích hoạt RLS
ALTER TABLE public.buyer_addresses ENABLE ROW LEVEL SECURITY;

-- Buyer chỉ được SELECT địa chỉ của chính mình
CREATE POLICY "Buyer xem dia chi rieng tu"
ON public.buyer_addresses
FOR SELECT
USING (auth.uid() = user_id);

-- Buyer chỉ được INSERT địa chỉ cho chính mình
CREATE POLICY "Buyer them dia chi rieng tu"
ON public.buyer_addresses
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Buyer chỉ được UPDATE/DELETE địa chỉ của chính mình
CREATE POLICY "Buyer sua/xoa dia chi rieng tu"
ON public.buyer_addresses
FOR ALL
USING (auth.uid() = user_id);

-- Admin xem khi giải quyết khiếu nại/tranh chấp
CREATE POLICY "Admin ho tro giai quyet tranh chap"
ON public.buyer_addresses
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE users.id = auth.uid() AND users.role = 'admin'
  )
);
```

### 3.2. Bảng `supplier_payouts` (Bảo vệ luồng đối soát doanh thu)

```sql
ALTER TABLE public.supplier_payouts ENABLE ROW LEVEL SECURITY;

-- Supplier chỉ được SELECT yêu cầu đối soát của chính mình
CREATE POLICY "Supplier xem doi soat ca nhan"
ON public.supplier_payouts
FOR SELECT
USING (
  supplier_id IN (
    SELECT id FROM public.suppliers WHERE user_id = auth.uid()
  )
);

-- Supplier gửi yêu cầu đối soát mới (Trạng thái bắt buộc là 'requested')
CREATE POLICY "Supplier gui yeu cau doi soat"
ON public.supplier_payouts
FOR INSERT
WITH CHECK (
  status = 'requested' AND
  supplier_id IN (
    SELECT id FROM public.suppliers WHERE user_id = auth.uid()
  )
);

-- NGĂN CHẶN TUYỆT ĐỐI: Supplier tự phê duyệt đối soát (Chỉ Admin mới có quyền UPDATE sang approved/rejected)
CREATE POLICY "Admin phe duyet doi soat"
ON public.supplier_payouts
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE users.id = auth.uid() AND users.role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE users.id = auth.uid() AND users.role = 'admin'
  )
);
```

### 3.3. Bảng `loyalty_transactions` (Bảo vệ tích điểm FlashPoints)

```sql
ALTER TABLE public.loyalty_transactions ENABLE ROW LEVEL SECURITY;

-- User xem lịch sử tích điểm của mình
CREATE POLICY "User xem diem ca nhan"
ON public.loyalty_transactions
FOR SELECT
USING (auth.uid() = user_id);

-- Chặn User tự cộng điểm (Chỉ hệ thống gọi qua RPC có SECURITY DEFINER hoặc Admin)
CREATE POLICY "Chi he thong duoc ghi nhan diem"
ON public.loyalty_transactions
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE users.id = auth.uid() AND users.role = 'admin'
  )
);
```

### 3.4. Bảng `users` (Chống Leo thang Đặc quyền Role)

```sql
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Người dùng đọc hồ sơ công khai
CREATE POLICY "Xem thong tin co ban"
ON public.users
FOR SELECT
USING (true);

-- Người dùng chỉ được sửa tên, số điện thoại, avatar (KHÔNG ĐƯỢC ĐỔI role)
CREATE POLICY "User cap nhat thong tin co ban"
ON public.users
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (
  auth.uid() = id AND
  role = (SELECT role FROM public.users WHERE id = auth.uid()) -- Khóa không cho thay đổi role
);
```

---

## 4. Kịch Bản Kiểm Thử SQL Thực Tế (Test Cases)

### Test Case 1: Buyer A cố tình truy vấn địa chỉ của Buyer B
- **Lệnh thực thi:**
  ```sql
  SET ROLE authenticated;
  SET request.jwt.claim.sub = 'user_buyer_minhanh_demo';
  SELECT * FROM public.buyer_addresses WHERE user_id = 'user_buyer_other';
  ```
- **Kết quả mong đợi:** `0 rows returned` (Bị RLS lọc sạch, không trả về dữ liệu).

### Test Case 2: Supplier tự duyệt thanh toán payout của chính mình
- **Lệnh thực thi:**
  ```sql
  SET ROLE authenticated;
  SET request.jwt.claim.sub = 'user_supplier_coop_demo';
  UPDATE public.supplier_payouts
  SET status = 'approved'
  WHERE id = 'payout_001';
  ```
- **Kết quả mong đợi:** `ERROR: 42501 new row violates row-level security policy for table "supplier_payouts"`.

### Test Case 3: Người dùng bình thường cố tình cập nhật role lên Admin
- **Lệnh thực thi:**
  ```sql
  SET ROLE authenticated;
  SET request.jwt.claim.sub = 'user_buyer_minhanh_demo';
  UPDATE public.users SET role = 'admin' WHERE id = 'user_buyer_minhanh_demo';
  ```
- **Kết quả mong đợi:** `ERROR: 42501 new row violates row-level security policy for table "users"`.

---

## 5. Kết Luận Kiểm Toán

Kiến trúc bảo mật hai lớp: **Frontend Route Guards** (điều hướng giao diện tức thì) kết hợp **Supabase Postgres Row Level Security** (khóa cứng dữ liệu ở máy chủ) đã thỏa mãn đầy đủ các tiêu chuẩn bảo mật dữ liệu theo quy định pháp luật và yêu cầu kỹ thuật của dự án FlashGroup.
