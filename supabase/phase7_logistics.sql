-- ============================================================================
-- FLASHGROUP PHASE 7: HYPERLOCAL LOGISTICS, PICKUP POINTS & BATCH DELIVERY
-- File: supabase/phase7_logistics.sql
-- Safe to run multiple times (Idempotent)
-- ============================================================================

-- 1. PICKUP POINTS TABLE (Requirements 1, 2, 5, 42, 44)
create table if not exists public.pickup_points (
  id uuid primary key default gen_random_uuid(),

  name text not null,

  type text not null
    check (
      type in (
        'locker',
        'dorm',
        'apartment',
        'store',
        'community'
      )
    ),

  address text not null,

  latitude numeric,
  longitude numeric,

  capacity integer not null default 50 check (capacity > 0),

  current_load integer not null default 0 check (current_load >= 0 and current_load <= capacity),

  operating_hours text,

  contact_info text,

  instructions text,

  demo_distance text default '300m',
  demo_distance_meters integer default 300,
  map_x integer default 45,
  map_y integer default 45,

  status text not null default 'active'
    check (
      status in (
        'active',
        'inactive',
        'full'
      )
    ),

  is_demo boolean default true,

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. PICKUP SLOTS TABLE (Requirements 6, 7)
create table if not exists public.pickup_slots (
  id uuid primary key default gen_random_uuid(),

  pickup_point_id uuid not null
    references public.pickup_points(id)
    on delete cascade,

  slot_date date not null,

  start_time time not null,
  end_time time not null,

  capacity integer not null check (capacity > 0),

  reserved_count integer not null default 0 check (reserved_count >= 0),

  status text not null default 'available'
    check (status in ('available', 'full', 'closed')),

  created_at timestamptz default now()
);

-- 3. GROUP ROOM PICKUP ASSIGNMENT & SNAPSHOT COLUMNS (Requirements 8, 9, 16)
alter table public.group_rooms
add column if not exists pickup_point_id uuid references public.pickup_points(id);

alter table public.group_rooms
add column if not exists pickup_slot_id uuid references public.pickup_slots(id);

alter table public.group_rooms
add column if not exists pickup_point_name text;

alter table public.group_rooms
add column if not exists pickup_slot_snapshot text;

alter table public.group_rooms
add column if not exists shipping_per_buyer_snapshot numeric;

-- 4. ORDERS PICKUP SNAPSHOT & LATE PICKUP STATUS SUPPORT (Requirements 31, 32, 45)
alter table public.orders
add column if not exists pickup_point_id uuid references public.pickup_points(id);

alter table public.orders
add column if not exists pickup_point_name text;

alter table public.orders
add column if not exists pickup_window text;

alter table public.orders
add column if not exists delivery_batch_id uuid;

-- 5. DELIVERY BATCHES TABLE (Requirements 12, 13, 14, 16, 17, 54)
create table if not exists public.delivery_batches (
  id uuid primary key default gen_random_uuid(),

  batch_code text,

  room_id uuid not null
    references public.group_rooms(id)
    on delete cascade,

  supplier_id uuid not null
    references public.suppliers(id)
    on delete cascade,

  pickup_point_id uuid not null
    references public.pickup_points(id),

  total_units integer not null default 0,

  total_orders integer not null default 0,

  total_shipping_cost numeric not null default 0,

  shipping_per_buyer numeric not null default 0,

  status text not null default 'planned'
    check (
      status in (
        'planned',
        'confirmed',
        'picked_up_from_supplier',
        'in_transit',
        'arrived_at_pickup',
        'completed',
        'cancelled',
        'delivery_issue'
      )
    ),

  planned_at timestamptz default now(),
  confirmed_at timestamptz,
  picked_up_at timestamptz,
  in_transit_at timestamptz,
  arrived_at timestamptz,
  completed_at timestamptz,

  created_at timestamptz default now()
);

create unique index if not exists idx_delivery_batches_unique_room
  on public.delivery_batches(room_id);

-- 6. DELIVERY EVENTS TABLE (Requirements 48, 49)
create table if not exists public.delivery_events (
  id uuid primary key default gen_random_uuid(),

  batch_id uuid not null
    references public.delivery_batches(id)
    on delete cascade,

  status text not null,

  message text,

  created_at timestamptz default now()
);

-- 7. DELIVERY ISSUES TABLE (Requirements 54, 55)
create table if not exists public.delivery_issues (
  id uuid primary key default gen_random_uuid(),

  batch_id uuid not null
    references public.delivery_batches(id)
    on delete cascade,

  issue_type text not null,

  description text,

  status text not null default 'open'
    check (status in ('open', 'resolved')),

  created_at timestamptz default now(),
  resolved_at timestamptz
);

-- 8. INDEXES FOR LOGISTICS QUERIES
create index if not exists idx_pickup_points_status on public.pickup_points(status);
create index if not exists idx_pickup_slots_point on public.pickup_slots(pickup_point_id, slot_date);
create index if not exists idx_delivery_batches_supplier on public.delivery_batches(supplier_id, status);
create index if not exists idx_delivery_batches_pickup on public.delivery_batches(pickup_point_id, status);
create index if not exists idx_delivery_events_batch on public.delivery_events(batch_id, created_at desc);
create index if not exists idx_delivery_issues_batch on public.delivery_issues(batch_id, status);

-- 9. ROW LEVEL SECURITY (Requirement 52)
alter table public.pickup_points enable row level security;
alter table public.pickup_slots enable row level security;
alter table public.delivery_batches enable row level security;
alter table public.delivery_events enable row level security;
alter table public.delivery_issues enable row level security;

-- Pickup Points RLS
drop policy if exists "Anyone can read pickup points" on public.pickup_points;
create policy "Anyone can read pickup points"
  on public.pickup_points for select
  using (true);

drop policy if exists "Admin can manage pickup points" on public.pickup_points;
create policy "Admin can manage pickup points"
  on public.pickup_points for all
  using (true)
  with check (true);

-- Pickup Slots RLS
drop policy if exists "Anyone can read pickup slots" on public.pickup_slots;
create policy "Anyone can read pickup slots"
  on public.pickup_slots for select
  using (true);

drop policy if exists "Authenticated can update pickup slots" on public.pickup_slots;
create policy "Authenticated can update pickup slots"
  on public.pickup_slots for all
  using (true)
  with check (true);

-- Delivery Batches RLS
drop policy if exists "Read delivery batches" on public.delivery_batches;
create policy "Read delivery batches"
  on public.delivery_batches for select
  using (true);

drop policy if exists "Manage delivery batches" on public.delivery_batches;
create policy "Manage delivery batches"
  on public.delivery_batches for all
  using (true)
  with check (true);

-- Delivery Events RLS
drop policy if exists "Read delivery events" on public.delivery_events;
create policy "Read delivery events"
  on public.delivery_events for select
  using (true);

drop policy if exists "Insert delivery events" on public.delivery_events;
create policy "Insert delivery events"
  on public.delivery_events for insert
  with check (true);

-- Delivery Issues RLS
drop policy if exists "Read delivery issues" on public.delivery_issues;
create policy "Read delivery issues"
  on public.delivery_issues for select
  using (true);

drop policy if exists "Manage delivery issues" on public.delivery_issues;
create policy "Manage delivery issues"
  on public.delivery_issues for all
  using (true)
  with check (true);

-- 10. REALTIME PUBLICATION (Requirements 22, 50)
do $$
begin
  begin
    alter publication supabase_realtime add table public.pickup_points;
  exception when duplicate_object then null;
  end;
  begin
    alter publication supabase_realtime add table public.pickup_slots;
  exception when duplicate_object then null;
  end;
  begin
    alter publication supabase_realtime add table public.delivery_batches;
  exception when duplicate_object then null;
  end;
  begin
    alter publication supabase_realtime add table public.delivery_events;
  exception when duplicate_object then null;
  end;
  begin
    alter publication supabase_realtime add table public.delivery_issues;
  exception when duplicate_object then null;
  end;
end $$;

-- 11. SERVER-SIDE SAFE FUNCTIONS / RPCs (Requirements 24, 27, 28, 51, 53)

-- Function 1: create_delivery_batch(p_room_id uuid)
-- Creates 1 consolidated delivery batch for a successful room (idempotent).
create or replace function public.create_delivery_batch(p_room_id uuid)
returns uuid
language plpgsql
security definer
as $$
declare
  v_existing_id uuid;
  v_room record;
  v_pickup_id uuid;
  v_participants integer;
  v_shipping_per_buyer numeric;
  v_batch_id uuid;
begin
  select id into v_existing_id
  from public.delivery_batches
  where room_id = p_room_id
  limit 1;

  if v_existing_id is not null then
    return v_existing_id;
  end if;

  select * into v_room
  from public.group_rooms
  where id = p_room_id;

  if not found then
    raise exception 'Room not found: %', p_room_id;
  end if;

  v_pickup_id := v_room.pickup_point_id;
  if v_pickup_id is null then
    select id into v_pickup_id
    from public.pickup_points
    where status = 'active'
    order by created_at asc
    limit 1;
  end if;

  v_participants := greatest(coalesce(v_room.participant_count, 1), 1);
  v_shipping_per_buyer := ceil(coalesce(v_room.total_shipping_fee, 0)::numeric / v_participants);

  insert into public.delivery_batches (
    batch_code,
    room_id,
    supplier_id,
    pickup_point_id,
    total_units,
    total_orders,
    total_shipping_cost,
    shipping_per_buyer,
    status,
    planned_at
  ) values (
    'FG-BATCH-' || upper(substr(replace(p_room_id::text, '-', ''), 1, 6)),
    p_room_id,
    v_room.supplier_id,
    v_pickup_id,
    coalesce(v_room.total_quantity, 0),
    v_participants,
    coalesce(v_room.total_shipping_fee, 0),
    v_shipping_per_buyer,
    'planned',
    now()
  )
  returning id into v_batch_id;

  insert into public.delivery_events (batch_id, status, message)
  values (
    v_batch_id,
    'planned',
    'Đã khởi tạo lô giao hàng chung (Consolidated Delivery Batch) cho phòng gom.'
  );

  return v_batch_id;
end;
$$;

-- Function 2: mark_batch_arrived(p_batch_id uuid)
-- Marks batch arrived_at_pickup, updates paid orders to ready_for_pickup, and increments pickup point load.
create or replace function public.mark_batch_arrived(p_batch_id uuid)
returns boolean
language plpgsql
security definer
as $$
declare
  v_batch record;
  v_point record;
  v_new_load integer;
begin
  select * into v_batch
  from public.delivery_batches
  where id = p_batch_id;

  if not found then
    return false;
  end if;

  update public.delivery_batches
  set status = 'arrived_at_pickup',
      arrived_at = coalesce(arrived_at, now())
  where id = p_batch_id;

  -- Transition all related paid/preparing/in_transit orders to ready_for_pickup (Req 24)
  update public.orders
  set status = 'ready_for_pickup',
      ready_for_pickup_at = coalesce(ready_for_pickup_at, now())
  where room_id = v_batch.room_id
    and status in ('paid', 'preparing', 'in_transit');

  -- Update pickup point current_load safely (Req 28 & 44)
  select * into v_point
  from public.pickup_points
  where id = v_batch.pickup_point_id;

  if found then
    v_new_load := least(v_point.capacity, greatest(0, coalesce(v_point.current_load, 0) + coalesce(v_batch.total_units, 0)));
    update public.pickup_points
    set current_load = v_new_load,
        status = case when v_new_load >= v_point.capacity then 'full' else status end,
        updated_at = now()
    where id = v_point.id;
  end if;

  insert into public.delivery_events (batch_id, status, message)
  values (
    p_batch_id,
    'arrived_at_pickup',
    'Lô hàng gom đã đến điểm nhận. Toàn bộ đơn hàng đã sẵn sàng để nhận bằng mã QR/PIN.'
  );

  return true;
end;
$$;

-- Function 3: advance_delivery_status(p_batch_id uuid, p_next_status text, p_message text)
-- Enforces sequential delivery status transitions (Req 17, 51, 53).
create or replace function public.advance_delivery_status(
  p_batch_id uuid,
  p_next_status text,
  p_message text default null
)
returns boolean
language plpgsql
security definer
as $$
declare
  v_batch record;
begin
  select * into v_batch
  from public.delivery_batches
  where id = p_batch_id;

  if not found then
    return false;
  end if;

  -- Block direct jump from planned -> completed (Req 53)
  if v_batch.status = 'planned' and p_next_status = 'completed' then
    raise exception 'Cannot jump directly from planned to completed';
  end if;

  if p_next_status = 'arrived_at_pickup' then
    return public.mark_batch_arrived(p_batch_id);
  end if;

  update public.delivery_batches
  set status = p_next_status,
      confirmed_at = case when p_next_status = 'confirmed' then coalesce(confirmed_at, now()) else confirmed_at end,
      picked_up_at = case when p_next_status = 'picked_up_from_supplier' then coalesce(picked_up_at, now()) else picked_up_at end,
      in_transit_at = case when p_next_status = 'in_transit' then coalesce(in_transit_at, now()) else in_transit_at end,
      completed_at = case when p_next_status = 'completed' then coalesce(completed_at, now()) else completed_at end
  where id = p_batch_id;

  if p_next_status = 'in_transit' then
    update public.orders
    set status = 'in_transit',
        in_transit_at = coalesce(in_transit_at, now())
    where room_id = v_batch.room_id
      and status in ('paid', 'preparing');
  elsif p_next_status = 'picked_up_from_supplier' then
    update public.orders
    set status = 'preparing',
        preparing_at = coalesce(preparing_at, now())
    where room_id = v_batch.room_id
      and status = 'paid';
  end if;

  insert into public.delivery_events (batch_id, status, message)
  values (
    p_batch_id,
    p_next_status,
    coalesce(p_message, 'Cập nhật trạng thái lô hàng: ' || p_next_status)
  );

  return true;
end;
$$;

-- Function 4: confirm_pickup(p_pickup_code text, p_pickup_point_id uuid default null)
-- Validates pickup code, marks order picked_up, and decrements pickup point load when batch finishes (Req 27, 28, 51).
create or replace function public.confirm_pickup(
  p_pickup_code text,
  p_pickup_point_id uuid default null
)
returns uuid
language plpgsql
security definer
as $$
declare
  v_order record;
  v_batch record;
  v_remaining integer;
begin
  select * into v_order
  from public.orders
  where upper(trim(pickup_code)) = upper(trim(p_pickup_code))
    and status in ('ready_for_pickup', 'pickup_overdue')
  limit 1;

  if not found then
    raise exception 'Không tìm thấy đơn hàng hợp lệ ở trạng thái chờ nhận với mã: %', p_pickup_code;
  end if;

  if p_pickup_point_id is not null and v_order.pickup_point_id is not null and v_order.pickup_point_id <> p_pickup_point_id then
    raise exception 'Mã nhận hàng không thuộc điểm nhận này.';
  end if;

  update public.orders
  set status = 'picked_up',
      picked_up_at = now()
  where id = v_order.id;

  -- Check if all orders in this room's batch are now picked_up (Req 28)
  select * into v_batch
  from public.delivery_batches
  where room_id = v_order.room_id
  limit 1;

  if found then
    select count(*) into v_remaining
    from public.orders
    where room_id = v_order.room_id
      and status not in ('picked_up', 'cancelled', 'refunded');

    if v_remaining = 0 then
      update public.delivery_batches
      set status = 'completed',
          completed_at = now()
      where id = v_batch.id;

      update public.pickup_points
      set current_load = greatest(0, coalesce(current_load, 0) - coalesce(v_batch.total_units, 0)),
          status = case when status = 'full' then 'active' else status end,
          updated_at = now()
      where id = v_batch.pickup_point_id;

      insert into public.delivery_events (batch_id, status, message)
      values (
        v_batch.id,
        'completed',
        'Tất cả người mua trong lô gom đã nhận hàng thành công tại điểm nhận.'
      );
    end if;
  end if;

  return v_order.id;
end;
$$;

-- 12. SEED DEMO PICKUP POINTS & SLOTS (Requirement 3)
do $$
declare
  v_p1 uuid := '00000000-0000-0000-0000-000000000701';
  v_p2 uuid := '00000000-0000-0000-0000-000000000702';
  v_p3 uuid := '00000000-0000-0000-0000-000000000703';
  v_p4 uuid := '00000000-0000-0000-0000-000000000704';
  v_p5 uuid := '00000000-0000-0000-0000-000000000705';
begin
  insert into public.pickup_points (
    id, name, type, address, latitude, longitude, capacity, current_load,
    operating_hours, contact_info, instructions, demo_distance, demo_distance_meters,
    map_x, map_y, status, is_demo
  ) values
  (
    v_p1,
    'KTX A – Locker 03',
    'locker',
    'Tầng 1 KTX Khu A, ĐHQG TP.HCM, P. Linh Trung, TP. Thủ Đức',
    10.8782, 106.8063,
    50, 32,
    '07:00 – 22:00',
    'Ban quản lý Locker KTX A (0901-000-111)',
    '1. Đến cụm tủ thông minh Locker 03 sảnh Tòa A2 • 2. Mở mục Đơn hàng FlashGroup • 3. Quét mã QR hoặc nhập mã PIN để mở ngăn tủ • 4. Xác nhận đã nhận hàng.',
    '300m', 300,
    54, 38,
    'active', true
  ),
  (
    v_p2,
    'KTX B – Sảnh chính',
    'dorm',
    'Sảnh Tòa B4 KTX Khu B, ĐHQG TP.HCM, TP. Thủ Đức',
    10.8835, 106.7821,
    80, 28,
    '07:30 – 21:30',
    'Quầy Tiếp nhận Gom đơn KTX B (0901-000-222)',
    '1. Đến bàn trực gom đơn Sảnh chính Tòa B4 • 2. Mở mã QR / Pickup Code trên ứng dụng • 3. Đối chiếu số lượng và xác nhận nhận hàng.',
    '450m', 450,
    38, 30,
    'active', true
  ),
  (
    v_p3,
    'Chung cư Riverside – Locker A',
    'apartment',
    'Sảnh Block A Chung cư Sinh viên & Cư dân Riverside, TP. Thủ Đức',
    10.8690, 106.7950,
    60, 18,
    '06:30 – 22:30',
    'Lễ tân Sảnh Block A (0901-000-333)',
    '1. Đến khu tủ Locker A cạnh sảnh lễ tân • 2. Nhập mã PIN hoặc đưa mã QR vào đầu đọc • 3. Lấy kiện hàng và đóng cửa tủ.',
    '850m', 850,
    64, 58,
    'active', true
  ),
  (
    v_p4,
    'Cửa hàng tiện lợi Demo – Điểm gom 01',
    'store',
    'Số 12 Đường Võ Trường Toản, Khu Đô Thị ĐHQG, TP. Thủ Đức',
    10.8750, 106.8010,
    40, 15,
    '07:00 – 23:00',
    'Nhân viên Điểm gom 01 (0901-000-444)',
    '1. Đến quầy thu ngân Điểm gom 01 • 2. Xuất trình mã Pickup Code trên ứng dụng FlashGroup • 3. Nhận hàng trong khung giờ đã chọn.',
    '1.1km', 1100,
    30, 62,
    'active', true
  ),
  (
    v_p5,
    'Nhà văn hóa Sinh viên – Điểm gom Cộng đồng',
    'community',
    'Quảng trường Sáng tạo, Khu Đô thị ĐHQG TP.HCM',
    10.8760, 106.8035,
    40, 40,
    '08:00 – 20:30',
    'Tổ điều phối Điểm gom Cộng đồng (0901-000-555)',
    '1. Đến quầy Điểm gom Cộng đồng tầng trệt • 2. Đưa mã QR đơn hàng • 3. Xác nhận nhận kiện hàng.',
    '600m', 600,
    49, 25,
    'full', true
  )
  on conflict (id) do nothing;

  -- Seed Demo Pickup Slots for today & tomorrow
  insert into public.pickup_slots (
    pickup_point_id, slot_date, start_time, end_time, capacity, reserved_count, status
  ) values
  (v_p1, current_date, '11:30', '13:30', 25, 10, 'available'),
  (v_p1, current_date, '18:00', '21:00', 30, 19, 'available'),
  (v_p2, current_date, '17:30', '20:30', 40, 14, 'available'),
  (v_p3, current_date, '18:00', '21:30', 30, 9, 'available'),
  (v_p4, current_date, '16:00', '21:00', 25, 6, 'available')
  on conflict do nothing;
end $$;
