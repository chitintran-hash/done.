-- ============================================================================
-- FLASHGROUP PHASE 6: SOCIAL COMMERCE, REFERRALS, ROOM CHAT, LOYALTY & VOUCHERS
-- ============================================================================
-- Idempotent migration script. Safe to run in Supabase SQL Editor.
-- Does NOT drop or remove any existing Buyer, Supplier, Admin, Order, or Finance data.

-- 1. EXTEND ORDERS TABLE FOR VOUCHER FINANCIAL TRACKING (Req 35, 36, 37, 38)
alter table public.orders
add column if not exists voucher_code text;

alter table public.orders
add column if not exists voucher_discount numeric default 0;

alter table public.orders
add column if not exists voucher_funded_by text default 'platform'
  check (voucher_funded_by in ('platform', 'supplier'));


-- 2. REFERRALS TABLE (Req 6, 7, 8, 9, 10)
create table if not exists public.referrals (
  id uuid primary key default gen_random_uuid(),

  referrer_user_id uuid not null
    references public.profiles(id)
    on delete cascade,

  referred_user_id uuid
    references public.profiles(id)
    on delete cascade,

  room_id uuid
    references public.group_rooms(id)
    on delete cascade,

  status text not null default 'clicked'
    check (
      status in (
        'clicked',
        'registered',
        'joined',
        'completed'
      )
    ),

  created_at timestamptz default now(),
  completed_at timestamptz,

  -- Prevent self-referral at DB level (Req 9)
  constraint referrals_no_self_referral check (
    referred_user_id is null or referrer_user_id <> referred_user_id
  )
);

-- Prevent duplicate referrals for the same referred user & room (Req 10)
create unique index if not exists idx_referrals_unique_user_room
  on public.referrals(referrer_user_id, referred_user_id, coalesce(room_id, '00000000-0000-0000-0000-000000000000'::uuid))
  where referred_user_id is not null;

create index if not exists idx_referrals_referrer on public.referrals(referrer_user_id);
create index if not exists idx_referrals_referred on public.referrals(referred_user_id);
create index if not exists idx_referrals_room on public.referrals(room_id);


-- 3. ROOM EVENTS / ACTIVITY FEED TABLE (Req 11, 12, 13, 14)
create table if not exists public.room_events (
  id uuid primary key default gen_random_uuid(),

  room_id uuid not null
    references public.group_rooms(id)
    on delete cascade,

  user_id uuid
    references public.profiles(id)
    on delete set null,

  event_type text not null
    check (
      event_type in (
        'joined',
        'quantity_added',
        'price_unlocked',
        'shared',
        'room_full',
        'room_closed'
      )
    ),

  metadata jsonb default '{}'::jsonb,

  created_at timestamptz default now()
);

create index if not exists idx_room_events_room_created
  on public.room_events(room_id, created_at desc);


-- 4. GROUP MESSAGES (LIGHTWEIGHT ROOM CHAT) TABLE (Req 15, 16, 17, 21)
create table if not exists public.group_messages (
  id uuid primary key default gen_random_uuid(),

  room_id uuid not null
    references public.group_rooms(id)
    on delete cascade,

  user_id uuid not null
    references public.profiles(id)
    on delete cascade,

  user_name text,

  message text not null
    check (
      char_length(message) between 1 and 300
    ),

  created_at timestamptz default now(),
  deleted_at timestamptz
);

create index if not exists idx_group_messages_room_created
  on public.group_messages(room_id, created_at asc);


-- 5. MESSAGE REACTIONS TABLE (Req 22, 23)
create table if not exists public.message_reactions (
  message_id uuid not null
    references public.group_messages(id)
    on delete cascade,

  user_id uuid not null
    references public.profiles(id)
    on delete cascade,

  reaction text not null
    check (reaction in ('👍', '🔥', '🎉', '❤️')),

  created_at timestamptz default now(),

  primary key (
    message_id,
    user_id,
    reaction
  )
);

create index if not exists idx_message_reactions_msg on public.message_reactions(message_id);


-- 6. LOYALTY TRANSACTIONS (FLASHPOINTS) TABLE (Req 25, 26, 27, 28)
create table if not exists public.loyalty_transactions (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null
    references public.profiles(id)
    on delete cascade,

  points integer not null,

  type text not null
    check (
      type in (
        'purchase',
        'referral',
        'review',
        'redeem',
        'adjustment'
      )
    ),

  reference_id text,
  description text,

  created_at timestamptz default now()
);

-- Prevent duplicate reward transactions for the same user, type, and reference_id (Req 41, 42, 43, 51)
create unique index if not exists idx_loyalty_unique_reference
  on public.loyalty_transactions(user_id, type, reference_id)
  where reference_id is not null;

create index if not exists idx_loyalty_user_created
  on public.loyalty_transactions(user_id, created_at desc);


-- 7. VOUCHERS TABLE (Req 30, 31, 37, 39, 40)
create table if not exists public.vouchers (
  id uuid primary key default gen_random_uuid(),

  code text not null unique,
  name text not null,

  type text not null
    check (
      type in (
        'fixed',
        'percentage'
      )
    ),

  value numeric not null,
  minimum_order numeric default 0,
  max_discount numeric,

  start_at timestamptz not null default (now() - interval '1 day'),
  end_at timestamptz not null default (now() + interval '90 days'),

  usage_limit integer,
  per_user_limit integer default 1,

  funded_by text not null default 'platform'
    check (
      funded_by in (
        'platform',
        'supplier'
      )
    ),

  status text not null default 'active'
    check (
      status in (
        'active',
        'inactive'
      )
    ),

  created_at timestamptz default now()
);


-- 8. VOUCHER USAGES TABLE (Req 32)
create table if not exists public.voucher_usages (
  id uuid primary key default gen_random_uuid(),

  voucher_id uuid not null
    references public.vouchers(id)
    on delete cascade,

  user_id uuid not null
    references public.profiles(id)
    on delete cascade,

  order_id uuid
    references public.orders(id)
    on delete set null,

  discount_amount numeric not null,

  created_at timestamptz default now()
);

create index if not exists idx_voucher_usages_voucher on public.voucher_usages(voucher_id);
create index if not exists idx_voucher_usages_user on public.voucher_usages(user_id);


-- 9. SEED DEMO VOUCHERS (Req 40)
insert into public.vouchers (
  code,
  name,
  type,
  value,
  minimum_order,
  max_discount,
  start_at,
  end_at,
  usage_limit,
  per_user_limit,
  funded_by,
  status
)
values
  (
    'FLASH10',
    'Ưu đãi Demo FlashGroup giảm 10.000đ (Đơn từ 80k)',
    'fixed',
    10000,
    80000,
    10000,
    now() - interval '7 days',
    now() + interval '180 days',
    500,
    3,
    'platform',
    'active'
  ),
  (
    'GROUP5',
    'Ưu đãi Mua Gom Demo giảm 5% (Tối đa 20.000đ)',
    'percentage',
    0.05,
    0,
    20000,
    now() - interval '7 days',
    now() + interval '180 days',
    500,
    3,
    'platform',
    'active'
  )
on conflict (code) do nothing;


-- 10. SERVER-SIDE REWARD RPC FUNCTIONS (Req 41, 42, 43, 51, 52)
-- Point values are strictly defined server-side (+10 purchase, +20 referral, +5 review)

create or replace function public.award_referral_points(p_referral_id uuid)
returns boolean
language plpgsql
security definer
as $$
declare
  v_ref record;
begin
  select * into v_ref
  from public.referrals
  where id = p_referral_id;

  if not found or v_ref.status <> 'completed' then
    return false;
  end if;

  if v_ref.referrer_user_id = v_ref.referred_user_id then
    return false;
  end if;

  insert into public.loyalty_transactions (
    user_id,
    points,
    type,
    reference_id,
    description
  )
  values (
    v_ref.referrer_user_id,
    20,
    'referral',
    p_referral_id::text,
    '+20 Referral thành công (Điểm thưởng demo)'
  )
  on conflict (user_id, type, reference_id) where reference_id is not null do nothing;

  return true;
end;
$$;

create or replace function public.award_purchase_points(p_order_id uuid)
returns boolean
language plpgsql
security definer
as $$
declare
  v_order record;
  v_ref record;
begin
  select * into v_order
  from public.orders
  where id = p_order_id;

  -- Only award when order reaches picked_up (Req 43 & 52)
  if not found or v_order.status <> 'picked_up' then
    return false;
  end if;

  -- 1. Award +10 FlashPoints to buyer
  insert into public.loyalty_transactions (
    user_id,
    points,
    type,
    reference_id,
    description
  )
  values (
    v_order.user_id,
    10,
    'purchase',
    p_order_id::text,
    '+10 Đơn ' || coalesce(v_order.pickup_code, left(p_order_id::text, 8)) || ' hoàn tất'
  )
  on conflict (user_id, type, reference_id) where reference_id is not null do nothing;

  -- 2. Safely complete any joined referral for this buyer and award +20 points to referrer (Req 41 & 52)
  for v_ref in
    select *
    from public.referrals
    where referred_user_id = v_order.user_id
      and status in ('registered', 'joined')
      and (room_id is null or room_id = v_order.room_id)
      and referrer_user_id <> v_order.user_id
  loop
    update public.referrals
    set status = 'completed',
        completed_at = now()
    where id = v_ref.id;

    perform public.award_referral_points(v_ref.id);
  end loop;

  return true;
end;
$$;

create or replace function public.award_review_points(p_order_id uuid)
returns boolean
language plpgsql
security definer
as $$
declare
  v_review record;
begin
  select * into v_review
  from public.reviews
  where order_id = p_order_id
  limit 1;

  if not found then
    return false;
  end if;

  insert into public.loyalty_transactions (
    user_id,
    points,
    type,
    reference_id,
    description
  )
  values (
    v_review.user_id,
    5,
    'review',
    'review-' || p_order_id::text,
    '+5 Đánh giá sản phẩm'
  )
  on conflict (user_id, type, reference_id) where reference_id is not null do nothing;

  return true;
end;
$$;


-- 11. ROW LEVEL SECURITY (RLS) POLICIES (Req 50)
alter table public.referrals enable row level security;
alter table public.room_events enable row level security;
alter table public.group_messages enable row level security;
alter table public.message_reactions enable row level security;
alter table public.loyalty_transactions enable row level security;
alter table public.vouchers enable row level security;
alter table public.voucher_usages enable row level security;

-- Referrals Policies
drop policy if exists "Users view own referrals or admin views all" on public.referrals;
create policy "Users view own referrals or admin views all"
on public.referrals for select
using (
  referrer_user_id = auth.uid()
  or referred_user_id = auth.uid()
  or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
);

drop policy if exists "Authenticated users can record referral clicks and joins" on public.referrals;
create policy "Authenticated users can record referral clicks and joins"
on public.referrals for insert
with check (
  status in ('clicked', 'registered', 'joined')
  and (referred_user_id is null or referrer_user_id <> referred_user_id)
);

drop policy if exists "Users can update own referral attribution up to joined" on public.referrals;
create policy "Users can update own referral attribution up to joined"
on public.referrals for update
using (
  referred_user_id = auth.uid()
  or referrer_user_id = auth.uid()
  or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
);

-- Room Events Policies
drop policy if exists "Anyone can read room events" on public.room_events;
create policy "Anyone can read room events"
on public.room_events for select
using (true);

drop policy if exists "Authenticated users can insert room events" on public.room_events;
create policy "Authenticated users can insert room events"
on public.room_events for insert
with check (auth.uid() is not null);

-- Group Messages Policies
drop policy if exists "Anyone can read group messages" on public.group_messages;
create policy "Anyone can read group messages"
on public.group_messages for select
using (true);

drop policy if exists "Authenticated users can insert own messages" on public.group_messages;
create policy "Authenticated users can insert own messages"
on public.group_messages for insert
with check (auth.uid() = user_id);

drop policy if exists "Supplier of room or admin can moderate messages" on public.group_messages;
create policy "Supplier of room or admin can moderate messages"
on public.group_messages for update
using (
  auth.uid() = user_id
  or exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  )
  or exists (
    select 1 from public.group_rooms gr
    join public.suppliers s on s.id = gr.supplier_id
    where gr.id = group_messages.room_id and s.user_id = auth.uid()
  )
);

-- Message Reactions Policies
drop policy if exists "Anyone can read message reactions" on public.message_reactions;
create policy "Anyone can read message reactions"
on public.message_reactions for select
using (true);

drop policy if exists "Authenticated users can insert own reactions" on public.message_reactions;
create policy "Authenticated users can insert own reactions"
on public.message_reactions for insert
with check (auth.uid() = user_id);

drop policy if exists "Authenticated users can delete own reactions" on public.message_reactions;
create policy "Authenticated users can delete own reactions"
on public.message_reactions for delete
using (auth.uid() = user_id);

-- Loyalty Transactions Policies (Users read own, Admin reads all)
drop policy if exists "Users read own loyalty history or admin reads all" on public.loyalty_transactions;
create policy "Users read own loyalty history or admin reads all"
on public.loyalty_transactions for select
using (
  user_id = auth.uid()
  or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
);

-- Vouchers Policies
drop policy if exists "Anyone can read vouchers" on public.vouchers;
create policy "Anyone can read vouchers"
on public.vouchers for select
using (true);

drop policy if exists "Admin manages vouchers" on public.vouchers;
create policy "Admin manages vouchers"
on public.vouchers for all
using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
);

-- Voucher Usages Policies
drop policy if exists "Users read own voucher usages or admin reads all" on public.voucher_usages;
create policy "Users read own voucher usages or admin reads all"
on public.voucher_usages for select
using (
  user_id = auth.uid()
  or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
);

drop policy if exists "Authenticated users insert own voucher usage" on public.voucher_usages;
create policy "Authenticated users insert own voucher usage"
on public.voucher_usages for insert
with check (auth.uid() = user_id);


-- 12. ENABLE REALTIME FOR SOCIAL TABLES (Req 14, 19, 49)
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and tablename = 'room_events'
  ) then
    alter publication supabase_realtime add table public.room_events;
  end if;

  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and tablename = 'group_messages'
  ) then
    alter publication supabase_realtime add table public.group_messages;
  end if;

  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and tablename = 'message_reactions'
  ) then
    alter publication supabase_realtime add table public.message_reactions;
  end if;

  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and tablename = 'referrals'
  ) then
    alter publication supabase_realtime add table public.referrals;
  end if;

  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and tablename = 'loyalty_transactions'
  ) then
    alter publication supabase_realtime add table public.loyalty_transactions;
  end if;

  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and tablename = 'vouchers'
  ) then
    alter publication supabase_realtime add table public.vouchers;
  end if;
end $$;
