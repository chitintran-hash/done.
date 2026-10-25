import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const getSupabaseAdmin = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wedydazzjizgmlnmxtwu.supabase.co';
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  return createClient(url, key);
};

// GET: Lấy danh sách đối tác / doanh nghiệp
export async function GET() {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'seller')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const partners = (data || []).map((p: any) => ({
      id: p.id,
      name: p.store_name || p.full_name || 'Đối tác Trạm Nghỉ',
      ownerName: p.full_name || 'Chưa cập nhật',
      category: p.store_description?.includes('Ẩm thực') ? 'Ẩm Thực F&B' : p.store_description?.includes('Spa') ? 'Thư Giãn & Spa' : 'Studio Thủ Công',
      area: p.address?.split(',').slice(-2).join(',').trim() || 'TP. Hồ Chí Minh',
      address: p.address || 'Đang cập nhật địa chỉ',
      phone: p.phone_number || 'Chưa có SĐT',
      email: p.store_email || '',
      commission: 12,
      status: p.status || 'pending',
      createdDate: new Date(p.created_at).toLocaleDateString('vi-VN'),
      description: p.store_description || ''
    }));

    return NextResponse.json({ partners });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST: Đối tác nộp hồ sơ đăng ký doanh nghiệp mới
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { businessName, category, ownerName, phone, email, address, area, notes } = body;

    if (!businessName || !phone) {
      return NextResponse.json({ error: 'Tên cơ sở và số điện thoại là bắt buộc' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    // Tạo user ID giả định hoặc gắn với profile
    const partnerId = crypto.randomUUID();

    const { data, error } = await supabase.from('profiles').insert({
      id: partnerId,
      full_name: ownerName || businessName,
      role: 'seller',
      status: 'pending', // Chờ Admin phê duyệt
      store_name: businessName,
      store_description: `${category || 'Studio Thủ Công'}: ${notes || ''}`,
      phone_number: phone,
      address: `${address || ''}, ${area || 'TP.HCM'}`,
      store_email: email || ''
    }).select().single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, partner: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PATCH: Admin duyệt, từ chối hoặc tạm khóa đối tác
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'Mã đối tác và trạng thái là bắt buộc' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('profiles')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, partner: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
