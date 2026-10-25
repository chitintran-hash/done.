import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const getSupabaseAdmin = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wedydazzjizgmlnmxtwu.supabase.co';
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  return createClient(url, key);
};

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();

    // 1. Thống kê Partners
    const { data: partners } = await supabase
      .from('profiles')
      .select('id, status')
      .eq('role', 'seller');

    const totalPartners = partners?.length || 0;
    const activePartners = partners?.filter(p => p.status === 'active').length || 0;
    const pendingPartners = partners?.filter(p => p.status === 'pending').length || 0;

    // 2. Thống kê Services
    const { data: services } = await supabase
      .from('products')
      .select('id, approval_status, is_available')
      .like('category', 'workshop%');

    const totalServices = services?.length || 0;
    const activeServices = services?.filter(s => s.approval_status === 'active' && s.is_available).length || 0;
    const pendingServices = services?.filter(s => s.approval_status === 'pending').length || 0;

    // 3. Thống kê Bookings & GMV
    const { data: orders } = await supabase
      .from('orders')
      .select('id, total_price, status, created_at');

    const totalBookings = orders?.length || 0;
    const confirmedBookings = orders?.filter(o => o.status === 'confirmed' || o.status === 'checked_in' || o.status === 'rescheduled').length || 0;
    const cancelledBookings = orders?.filter(o => o.status === 'cancelled').length || 0;

    const gmv = (orders || [])
      .filter(o => o.status !== 'cancelled')
      .reduce((sum, o) => sum + (Number(o.total_price) || 0), 0);

    const commission = Math.round(gmv * 0.12); // Hoa hồng sàn 12%

    return NextResponse.json({
      stats: {
        totalPartners,
        activePartners,
        pendingPartners,
        totalServices,
        activeServices,
        pendingServices,
        totalBookings,
        confirmedBookings,
        cancelledBookings,
        gmv,
        commission,
        occupancyRate: confirmedBookings > 0 ? Math.min(95, Math.round((confirmedBookings / (totalServices * 4 || 1)) * 100)) : 0
      }
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
