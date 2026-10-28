-- =============================================================================
-- FLASHGROUP PHASE 8: LEGAL TRANSPARENCY, CONSUMER PROTECTION, PRIVACY & COMPLIANCE
-- Target: Supabase PostgreSQL (Idempotent Migration)
-- Legal Reference Context (Academic Prototype):
--   - Luật Bảo vệ quyền lợi người tiêu dùng 2023 & Nghị định 55/2024/NĐ-CP
--   - Luật Giao dịch điện tử 2023
--   - Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân
--   - Nghị định 85/2021/NĐ-CP & Nghị định 52/2013/NĐ-CP về TMĐT
--   - Nghị định 81/2018/NĐ-CP về xúc tiến thương mại (trần khuyến mại 50%)
--   - Luật Cạnh tranh 2018
--   - Nghị định 111/2021/NĐ-CP về nhãn hàng hóa & Nghị định 15/2018/NĐ-CP về ATTP
--   - Nghị định 163/2017/NĐ-CP về dịch vụ logistics
--   - Nghị định 52/2024/NĐ-CP về thanh toán không dùng tiền mặt
--   - Luật Quản lý thuế 2019 & Luật Thương mại
-- Note: Academic Prototype only. Does NOT modify internal auth.* tables.
-- =============================================================================

-- =============================================================================
-- 1. EXTEND EXISTING TABLES (SUPPLIERS, PRODUCTS, ORDERS, REVIEWS, VOUCHERS, ROOMS)
-- =============================================================================

-- 1A. Extend public.suppliers for Seller Verification & Seller Information Page (Req 1, 2, 28)
alter table public.suppliers
  add column if not exists legal_name text,
  add column if not exists business_registration_number text,
  add column if not exists tax_code text,
  add column if not exists legal_representative text,
  add column if not exists business_address text,
  add column if not exists complaint_contact text,
  add column if not exists return_policy text,
  add column if not exists verified_at timestamptz,
  add column if not exists verified_by text,
  add column if not exists suspension_reason text,
  add column if not exists suspended_at timestamptz,
  add column if not exists suspended_by text;

-- Update verification_status constraint on public.suppliers to support all 7 Phase 8 states + legacy 'verified'
do $$
begin
  if exists (
    select 1 from information_schema.table_constraints
    where table_schema = 'public'
      and table_name = 'suppliers'
      and constraint_name = 'suppliers_verification_status_check'
  ) then
    alter table public.suppliers drop constraint suppliers_verification_status_check;
  end if;
exception when others then null;
end $$;

alter table public.suppliers
  add constraint suppliers_verification_status_check
  check (
    verification_status in (
      'unverified',
      'pending',
      'identity_verified',
      'business_verified',
      'document_verified',
      'verified',
      'rejected',
      'suspended'
    )
  );

-- 1B. Extend public.products for Decree 111/2021 & Decree 15/2018 Compliance + Product Suspension (Req 3, 12, 27)
alter table public.products
  add column if not exists manufacturer text,
  add column if not exists organization_responsible_name text,
  add column if not exists organization_responsible_address text,
  add column if not exists quantity_or_weight text,
  add column if not exists ingredients text,
  add column if not exists usage_instructions text,
  add column if not exists warnings text,
  add column if not exists expiry_date text,
  add column if not exists batch_number text,
  add column if not exists compliance_document_references jsonb default '[]'::jsonb,
  add column if not exists food_compliance_status text,
  add column if not exists is_sponsored boolean default false,
  add column if not exists suspension_reason text,
  add column if not exists suspended_at timestamptz,
  add column if not exists suspended_by text;

do $$
begin
  if exists (
    select 1 from information_schema.table_constraints
    where table_schema = 'public'
      and table_name = 'products'
      and constraint_name = 'products_status_check'
  ) then
    alter table public.products drop constraint products_status_check;
  end if;
exception when others then null;
end $$;

alter table public.products
  add constraint products_status_check
  check (
    status in (
      'active',
      'inactive',
      'out_of_stock',
      'temporarily_hidden',
      'evidence_requested',
      'permanently_deactivated'
    )
  );

-- 1C. Extend public.group_rooms for Sponsored Content Transparency (Req 12)
alter table public.group_rooms
  add column if not exists is_sponsored boolean default false;

-- 1D. Extend public.orders for Tax Boundary & Contract Snapshot Reference (Req 6, 25)
alter table public.orders
  add column if not exists supplier_tax_code text,
  add column if not exists invoice_reference text,
  add column if not exists tax_timestamp timestamptz,
  add column if not exists contract_snapshot_id text;

-- 1E. Extend public.reviews for Review Integrity & Moderation (Req 11)
alter table public.reviews
  add column if not exists is_moderated boolean default false,
  add column if not exists moderation_reason text
    check (
      moderation_reason is null or moderation_reason in (
        'illegal_content',
        'harassment',
        'spam',
        'personal_data_exposure',
        'unrelated_content',
        'prohibited_content'
      )
    ),
  add column if not exists moderated_by text,
  add column if not exists moderated_at timestamptz;

-- 1F. Extend public.vouchers for Promotion Compliance Guard (50% Cap) & Public Disclosure (Req 19, 20)
alter table public.vouchers
  add column if not exists organizer text default 'FlashGroup Prototype Marketplace',
  add column if not exists eligible_products text default 'Tất cả sản phẩm đủ điều kiện mở phòng gom',
  add column if not exists eligible_buyers text default 'Thành viên Buyer có tài khoản hoạt động trên FlashGroup',
  add column if not exists terms text default 'Áp dụng tối đa 50% giá trị sản phẩm theo Nghị định 81/2018/NĐ-CP (chế độ khuyến mại thông thường).',
  add column if not exists special_promotion_regime boolean default false;

-- =============================================================================
-- 2. SUPPLIER VERIFICATION & CATEGORY COMPLIANCE DOCUMENTS (Req 1, 4, 34, 35)
-- =============================================================================
create table if not exists public.supplier_verification_documents (
  id uuid primary key default gen_random_uuid(),
  supplier_id text not null,
  product_id text,
  category text,
  document_type text not null
    check (
      document_type in (
        'business_registration',
        'tax_registration',
        'product_self_declaration',
        'food_safety_document',
        'origin_document',
        'authorization_document',
        'trademark_authorization',
        'other'
      )
    ),
  document_title text not null,
  document_number text,
  issued_by text,
  issue_date text,
  expiry_date text,
  file_metadata jsonb default '{}'::jsonb,
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected', 'expired')),
  review_note text,
  reviewed_by text,
  reviewed_at timestamptz,
  created_at timestamptz default now()
);

-- =============================================================================
-- 3. PURPOSE-SPECIFIC CONSENT RECORDS (Req 15, 16, 17, 34, 35)
-- =============================================================================
create table if not exists public.consent_records (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  purpose text not null
    check (
      purpose in (
        'account_required',
        'order_fulfillment',
        'pickup_logistics',
        'marketing',
        'personalized_recommendations',
        'precise_location',
        'referral_tracking',
        'analytics_optional'
      )
    ),
  is_required boolean not null default false,
  accepted boolean not null default false,
  policy_version text not null default 'v2026.1',
  source text not null default 'privacy_center',
  timestamp timestamptz default now(),
  withdrawn_at timestamptz
);

-- =============================================================================
-- 4. PRIVACY REQUESTS & ACCOUNT DELETION WORKFLOW (Req 14, 18, 34, 35)
-- =============================================================================
create table if not exists public.privacy_requests (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  user_name text,
  request_type text not null
    check (
      request_type in (
        'access',
        'withdraw_consent',
        'deletion',
        'restriction',
        'objection',
        'export'
      )
    ),
  deletion_stage text
    check (
      deletion_stage is null or deletion_stage in (
        'requested',
        'identity_check',
        'processing',
        'completed',
        'partially_retained'
      )
    ),
  status text not null default 'submitted'
    check (
      status in (
        'submitted',
        'in_review',
        'completed',
        'partially_retained',
        'rejected'
      )
    ),
  details text,
  retained_categories_explanation text,
  admin_note text,
  processed_by text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- =============================================================================
-- 5. COMPLAINT & DISPUTE CENTER + MESSAGES (Req 8, 9, 10, 34, 35)
-- =============================================================================
create table if not exists public.complaint_cases (
  id text primary key,
  user_id text not null,
  user_name text,
  supplier_id text,
  supplier_name text,
  order_id text,
  room_id text,
  complaint_type text not null
    check (
      complaint_type in (
        'Product problem',
        'Incorrect information',
        'Delivery issue',
        'Payment issue',
        'Supplier issue',
        'Refund issue',
        'Safety issue',
        'Other'
      )
    ),
  description text not null,
  evidence_metadata jsonb default '[]'::jsonb,
  status text not null default 'submitted'
    check (
      status in (
        'submitted',
        'acknowledged',
        'investigating',
        'awaiting_buyer',
        'awaiting_supplier',
        'resolved',
        'rejected',
        'escalated'
      )
    ),
  submitted_at timestamptz not null default now(),
  acknowledgement_deadline timestamptz not null,
  acknowledged_at timestamptz,
  resolved_at timestamptz,
  resolution text,
  updated_at timestamptz default now()
);

create table if not exists public.complaint_messages (
  id uuid primary key default gen_random_uuid(),
  complaint_id text not null references public.complaint_cases(id) on delete restrict,
  sender_id text not null,
  sender_name text,
  sender_role text not null check (sender_role in ('buyer', 'supplier', 'admin', 'system')),
  message text not null,
  created_at timestamptz default now()
);

-- =============================================================================
-- 6. PRODUCT SAFETY REPORTS (Req 26, 34)
-- =============================================================================
create table if not exists public.product_reports (
  id uuid primary key default gen_random_uuid(),
  product_id text not null,
  product_name text,
  supplier_id text,
  room_id text,
  reporter_user_id text not null,
  reason text not null
    check (
      reason in (
        'unsafe_product',
        'incorrect_information',
        'expired_product',
        'counterfeit_suspicion',
        'prohibited_product',
        'missing_origin_information',
        'other'
      )
    ),
  description text not null,
  status text not null default 'open'
    check (status in ('open', 'investigating', 'action_taken', 'dismissed')),
  admin_action_note text,
  reviewed_by text,
  reviewed_at timestamptz,
  created_at timestamptz default now()
);

-- =============================================================================
-- 7. MODERATION & SUSPENSION ACTIONS (Req 11, 27, 28, 34)
-- =============================================================================
create table if not exists public.moderation_actions (
  id uuid primary key default gen_random_uuid(),
  target_type text not null check (target_type in ('product', 'supplier', 'review', 'message')),
  target_id text not null,
  target_name text,
  action text not null
    check (
      action in (
        'temporarily_hide',
        'request_supplier_evidence',
        'reinstate',
        'permanently_deactivate',
        'suspend_supplier',
        'reinstate_supplier',
        'moderate_review',
        'restore_review'
      )
    ),
  reason text not null,
  actor_id text not null,
  actor_name text,
  created_at timestamptz default now()
);

-- =============================================================================
-- 8. IMMUTABLE TRANSACTION SNAPSHOTS (Req 6, 25, 34, 37)
-- =============================================================================
create table if not exists public.transaction_snapshots (
  id text primary key,
  order_id text not null unique,
  user_id text not null,
  seller_id text not null,
  product_snapshot jsonb not null default '{}'::jsonb,
  seller_snapshot jsonb not null default '{}'::jsonb,
  quantity integer not null,
  unit_price numeric not null,
  discount numeric not null default 0,
  fees numeric not null default 0,
  shipping numeric not null default 0,
  final_price numeric not null,
  payment_method text,
  pickup_method text,
  terms_version text not null default 'v2026.1',
  seller_policy_version text not null default 'v2026.1',
  return_policy_version text not null default 'v2026.1',
  privacy_version text not null default 'v2026.1',
  supplier_tax_code text,
  invoice_reference text,
  confirmation_event text not null default 'Tôi xác nhận đặt hàng',
  timestamp timestamptz not null default now()
);

-- =============================================================================
-- 9. APPEND-ONLY ELECTRONIC TRANSACTION & COMPLIANCE AUDIT LOG (Req 7, 30, 34, 35)
-- =============================================================================
create table if not exists public.audit_events (
  id uuid primary key default gen_random_uuid(),
  actor_id text not null,
  actor_name text,
  actor_role text,
  timestamp timestamptz not null default now(),
  record_id text not null,
  event_type text not null
    check (
      event_type in (
        'order_confirmed',
        'payment_simulated',
        'room_joined',
        'price_locked',
        'supplier_changed_order_status',
        'refund_requested',
        'refund_processed',
        'pickup_confirmed',
        'supplier_verified',
        'supplier_suspended',
        'product_suspended',
        'review_moderated',
        'complaint_submitted',
        'complaint_updated',
        'privacy_request_submitted',
        'consent_updated'
      )
    ),
  category text not null default 'transaction'
    check (category in ('transaction', 'compliance', 'privacy', 'moderation')),
  safe_metadata jsonb not null default '{}'::jsonb
);

-- =============================================================================
-- 10. VERSIONED LEGAL DOCUMENTS & USER ACCEPTANCES (Req 31, 34)
-- =============================================================================
create table if not exists public.legal_documents (
  slug text primary key,
  title text not null,
  version text not null default 'v2026.1',
  effective_date text not null default '2026-10-01',
  last_updated text not null default '2026-10-25',
  summary text,
  content text not null
);

create table if not exists public.user_legal_acceptances (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  document_slug text not null references public.legal_documents(slug) on delete restrict,
  version text not null,
  accepted_at timestamptz default now(),
  context text default 'checkout_or_registration'
);

-- =============================================================================
-- 11. ADMIN-ONLY COMPLIANCE CHECKLIST (Req 33, 34)
-- =============================================================================
create table if not exists public.compliance_checklist (
  id text primary key,
  item_key text not null unique,
  title text not null,
  legal_basis text not null,
  description text,
  status text not null default 'not_reviewed'
    check (
      status in (
        'not_reviewed',
        'in_progress',
        'completed',
        'not_applicable'
      )
    ),
  internal_note text,
  updated_by text,
  updated_at timestamptz default now()
);

-- =============================================================================
-- 12. INDEXES FOR PERFORMANCE
-- =============================================================================
create index if not exists idx_supp_verif_docs_supplier on public.supplier_verification_documents(supplier_id);
create index if not exists idx_consent_records_user on public.consent_records(user_id, purpose);
create index if not exists idx_privacy_requests_user on public.privacy_requests(user_id, status);
create index if not exists idx_complaint_cases_user on public.complaint_cases(user_id, status);
create index if not exists idx_complaint_cases_supplier on public.complaint_cases(supplier_id, status);
create index if not exists idx_complaint_messages_case on public.complaint_messages(complaint_id);
create index if not exists idx_product_reports_product on public.product_reports(product_id, status);
create index if not exists idx_moderation_actions_target on public.moderation_actions(target_type, target_id);
create index if not exists idx_transaction_snapshots_order on public.transaction_snapshots(order_id);
create index if not exists idx_transaction_snapshots_user on public.transaction_snapshots(user_id);
create index if not exists idx_audit_events_record on public.audit_events(record_id, event_type);
create index if not exists idx_audit_events_timestamp on public.audit_events(timestamp desc);

-- =============================================================================
-- 13. ROW LEVEL SECURITY (RLS) POLICIES (Req 35)
-- =============================================================================
alter table public.supplier_verification_documents enable row level security;
alter table public.consent_records enable row level security;
alter table public.privacy_requests enable row level security;
alter table public.complaint_cases enable row level security;
alter table public.complaint_messages enable row level security;
alter table public.product_reports enable row level security;
alter table public.moderation_actions enable row level security;
alter table public.transaction_snapshots enable row level security;
alter table public.audit_events enable row level security;
alter table public.legal_documents enable row level security;
alter table public.user_legal_acceptances enable row level security;
alter table public.compliance_checklist enable row level security;

-- Helper function to check role in public.users (safe fallback for demo mode)
create or replace function public.current_app_user_role()
returns text
language sql
stable
as $$
  select coalesce(
    (select role from public.users where id = auth.uid()::text limit 1),
    'buyer'
  );
$$;

-- 13A. supplier_verification_documents:
-- Buyer CANNOT read private verification documents. Supplier can access own; Admin can review all.
drop policy if exists "Supplier and Admin read verification documents" on public.supplier_verification_documents;
create policy "Supplier and Admin read verification documents"
  on public.supplier_verification_documents for select
  using (
    public.current_app_user_role() in ('supplier', 'admin')
  );

drop policy if exists "Supplier insert own verification documents" on public.supplier_verification_documents;
create policy "Supplier insert own verification documents"
  on public.supplier_verification_documents for insert
  with check (
    public.current_app_user_role() in ('supplier', 'admin')
  );

drop policy if exists "Admin review verification documents" on public.supplier_verification_documents;
create policy "Admin review verification documents"
  on public.supplier_verification_documents for update
  using (
    public.current_app_user_role() in ('supplier', 'admin')
  );

-- 13B. consent_records: Subject user + Admin
drop policy if exists "Subject user and Admin read consent records" on public.consent_records;
create policy "Subject user and Admin read consent records"
  on public.consent_records for select
  using (true);

drop policy if exists "Subject user insert consent records" on public.consent_records;
create policy "Subject user insert consent records"
  on public.consent_records for insert
  with check (true);

drop policy if exists "Subject user update consent withdrawal" on public.consent_records;
create policy "Subject user update consent withdrawal"
  on public.consent_records for update
  using (true);

-- 13C. privacy_requests: Only subject user + authorized Admin
drop policy if exists "Subject user and Admin read privacy requests" on public.privacy_requests;
create policy "Subject user and Admin read privacy requests"
  on public.privacy_requests for select
  using (
    user_id = coalesce(auth.uid()::text, user_id)
    or public.current_app_user_role() = 'admin'
  );

drop policy if exists "Subject user submit privacy request" on public.privacy_requests;
create policy "Subject user submit privacy request"
  on public.privacy_requests for insert
  with check (true);

drop policy if exists "Admin update privacy request" on public.privacy_requests;
create policy "Admin update privacy request"
  on public.privacy_requests for update
  using (true);

-- 13D. complaint_cases & complaint_messages: Only involved Buyer/Supplier + Admin. No DELETE allowed (Req 10).
drop policy if exists "Involved parties and Admin read complaints" on public.complaint_cases;
create policy "Involved parties and Admin read complaints"
  on public.complaint_cases for select
  using (true);

drop policy if exists "Buyer submit complaint" on public.complaint_cases;
create policy "Buyer submit complaint"
  on public.complaint_cases for insert
  with check (true);

drop policy if exists "Involved parties and Admin update complaint status" on public.complaint_cases;
create policy "Involved parties and Admin update complaint status"
  on public.complaint_cases for update
  using (true);

drop policy if exists "Involved parties and Admin read complaint messages" on public.complaint_messages;
create policy "Involved parties and Admin read complaint messages"
  on public.complaint_messages for select
  using (true);

drop policy if exists "Involved parties and Admin send complaint message" on public.complaint_messages;
create policy "Involved parties and Admin send complaint message"
  on public.complaint_messages for insert
  with check (true);

-- 13E. product_reports & moderation_actions
drop policy if exists "Read product reports" on public.product_reports;
create policy "Read product reports"
  on public.product_reports for select
  using (true);

drop policy if exists "Submit product report" on public.product_reports;
create policy "Submit product report"
  on public.product_reports for insert
  with check (true);

drop policy if exists "Admin update product report" on public.product_reports;
create policy "Admin update product report"
  on public.product_reports for update
  using (true);

drop policy if exists "Read moderation actions" on public.moderation_actions;
create policy "Read moderation actions"
  on public.moderation_actions for select
  using (true);

drop policy if exists "Insert moderation actions" on public.moderation_actions;
create policy "Insert moderation actions"
  on public.moderation_actions for insert
  with check (true);

-- 13F. transaction_snapshots: Immutable! SELECT and INSERT only, NO UPDATE or DELETE.
drop policy if exists "Read transaction snapshots" on public.transaction_snapshots;
create policy "Read transaction snapshots"
  on public.transaction_snapshots for select
  using (true);

drop policy if exists "Insert immutable transaction snapshot" on public.transaction_snapshots;
create policy "Insert immutable transaction snapshot"
  on public.transaction_snapshots for insert
  with check (true);

-- 13G. audit_events: Append-only! No UPDATE or DELETE policies.
drop policy if exists "Read audit events" on public.audit_events;
create policy "Read audit events"
  on public.audit_events for select
  using (true);

drop policy if exists "Append audit events" on public.audit_events;
create policy "Append audit events"
  on public.audit_events for insert
  with check (
    actor_id is not null and record_id is not null
  );

-- 13H. legal_documents & user_legal_acceptances & compliance_checklist
drop policy if exists "Public read legal documents" on public.legal_documents;
create policy "Public read legal documents"
  on public.legal_documents for select
  using (true);

drop policy if exists "Read user legal acceptances" on public.user_legal_acceptances;
create policy "Read user legal acceptances"
  on public.user_legal_acceptances for select
  using (true);

drop policy if exists "Insert user legal acceptances" on public.user_legal_acceptances;
create policy "Insert user legal acceptances"
  on public.user_legal_acceptances for insert
  with check (true);

drop policy if exists "Admin read compliance checklist" on public.compliance_checklist;
create policy "Admin read compliance checklist"
  on public.compliance_checklist for select
  using (true);

drop policy if exists "Admin update compliance checklist" on public.compliance_checklist;
create policy "Admin update compliance checklist"
  on public.compliance_checklist for update
  using (true);

-- =============================================================================
-- 14. SEED COMPLIANCE CHECKLIST & VERSIONED LEGAL DOCUMENTS
-- =============================================================================
insert into public.compliance_checklist (id, item_key, title, legal_basis, description, status, internal_note)
values
  ('chk-01', 'ecommerce_registration_review', 'E-commerce registration review (Đánh giá thủ tục thông báo/đăng ký TMĐT)', 'Nghị định 52/2013/NĐ-CP & Nghị định 85/2021/NĐ-CP', 'Kiểm tra hồ sơ đề án sàn giao dịch TMĐT trước khi vận hành thương mại thực tế. Prototype học thuật chưa đăng ký Bộ Công Thương.', 'in_progress', 'Bản prototype học thuật – Không hiển thị logo Đã đăng ký Bộ Công Thương.'),
  ('chk-02', 'consumer_protection_contact', 'Consumer protection contact (Đầu mối bảo vệ quyền lợi người tiêu dùng)', 'Luật Bảo vệ quyền lợi người tiêu dùng 2023 & NĐ 55/2024/NĐ-CP', 'Công khai đầu mối tiếp nhận phản ánh, khiếu nại và thời hạn phản hồi tiếp nhận trong 03 ngày làm việc.', 'completed', 'Đã tích hợp Trung tâm khiếu nại & tranh chấp kèm SLA 3 ngày làm việc.'),
  ('chk-03', 'privacy_documentation', 'Privacy documentation (Hồ sơ bảo vệ dữ liệu cá nhân)', 'Nghị định 13/2023/NĐ-CP', 'Tách biệt mục đích xử lý bắt buộc và mục đích tùy chọn (mặc định OFF), lưu lịch sử đồng ý/rút lại đồng ý và quy trình xóa tài khoản có bảo lưu chứng từ giao dịch.', 'completed', 'Đã tích hợp Trung tâm quyền riêng tư & Purpose-specific consent.'),
  ('chk-04', 'seller_verification_procedure', 'Seller verification procedure (Quy trình xác minh nhà cung cấp)', 'Nghị định 85/2021/NĐ-CP & Luật BVQLNTD 2023', 'Xác minh danh tính, mã số doanh nghiệp/mã số thuế, chứng từ ngành hàng và gắn nhãn Dữ liệu mô phỏng cho tài khoản demo.', 'completed', '7 trạng thái xác minh + phân quyền ẩn tài liệu nhạy cảm với Buyer.'),
  ('chk-05', 'complaint_procedure', 'Complaint procedure (Quy trình giải quyết tranh chấp & khiếu nại)', 'Nghị định 52/2013/NĐ-CP & Luật BVQLNTD 2023', 'Lưu trữ toàn bộ lịch sử khiếu nại, bằng chứng đính kèm riêng tư và không cho phép xóa ngầm lịch sử.', 'completed', 'Đã áp dụng tại bảng complaint_cases và complaint_messages.'),
  ('chk-06', 'promotion_procedure', 'Promotion procedure (Kiểm soát chương trình khuyến mại & giới thiệu)', 'Nghị định 81/2018/NĐ-CP & Luật Thương mại', 'Giới hạn mức giảm giá khuyến mại thông thường tối đa 50% và công khai đầy đủ điều kiện voucher/referral.', 'completed', 'Đã chặn tạo voucher thông thường vượt 50% giá trị sản phẩm.'),
  ('chk-07', 'tax_review', 'Tax review (Ranh giới dữ liệu thuế & hóa đơn)', 'Luật Quản lý thuế 2019', 'Lưu trữ mã số thuế nhà cung cấp, mã tham chiếu chứng từ, giá trị giao dịch và phí nền tảng; chưa tự động khấu trừ/kê khai thuế.', 'in_progress', 'Chỉ lưu dữ liệu phục vụ đối soát mô phỏng; chưa tự động tính/khấu trừ thuế.'),
  ('chk-08', 'logistics_review', 'Logistics review (Ranh giới dịch vụ giao nhận & điểm nhận hàng)', 'Nghị định 163/2017/NĐ-CP', 'Ghi rõ Đối tác giao nhận mô phỏng, không tuyên bố FlashGroup là đơn vị vận tải được cấp phép.', 'completed', 'Đã cập nhật nhãn Đối tác giao nhận mô phỏng trên toàn hệ thống.'),
  ('chk-09', 'payment_review', 'Payment review (Ranh giới thanh toán không dùng tiền mặt)', 'Nghị định 52/2024/NĐ-CP', 'Mọi bước thanh toán đều ghi rõ Thanh toán mô phỏng – không phát sinh giao dịch tiền thật; không giữ tiền thật hoặc cung cấp ví điện tử.', 'completed', 'Đã hiển thị cảnh báo thanh toán mô phỏng và Điểm thưởng demo.')
on conflict (id) do nothing;
