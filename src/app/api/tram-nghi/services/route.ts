import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const getSupabaseAdmin = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wedydazzjizgmlnmxtwu.supabase.co';
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  return createClient(url, key);
};

// GET: Lấy danh sách dịch vụ / workshop từ Supabase
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'active';
    const partnerId = searchParams.get('partner_id');

    const supabase = getSupabaseAdmin();
    let query = supabase.from('products').select('*').like('category', 'workshop%');

    if (status === 'active') {
      query = query.eq('approval_status', 'active').eq('is_available', true);
    } else if (status === 'pending') {
      query = query.eq('approval_status', 'pending');
    }

    if (partnerId) {
      query = query.eq('seller_id', partnerId);
    }

    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Format theo chuẩn Trạm Nghỉ
    const formatted = (data || []).map((item: any) => ({
      id: item.id,
      seller_id: item.seller_id,
      name: item.name,
      category: item.category,
      type: item.technical_specs?.type || (item.category.includes('gom') ? 'Gốm' : item.category.includes('ve') ? 'Vẽ' : 'Nến'),
      price: item.price,
      duration: item.technical_specs?.duration || '2 giờ',
      area: item.technical_specs?.area || 'Thảo Điền',
      studio: item.technical_specs?.studio || 'Nhà Gốm Nhỏ',
      image: item.image_url || '/assets/pottery.jpg',
      tag: item.technical_specs?.tag || 'Một chút chậm lại',
      desc: item.description || '',
      moods: item.technical_specs?.moods || ['quiet', 'creative'],
      capacity: item.stock || 8,
      includes: item.technical_specs?.includes || ['Dụng cụ đầy đủ', 'Người hướng dẫn tận tâm'],
      note: item.technical_specs?.note || '',
      approval_status: item.approval_status || 'active',
      is_available: item.is_available ?? true
    }));

    return NextResponse.json({ services: formatted });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST: Partner hoặc Admin đăng dịch vụ mới
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, type, price, duration, capacity, area, studio, includes, description, is_admin, seller_id } = body;

    if (!name || !price) {
      return NextResponse.json({ error: 'Tên và giá dịch vụ là bắt buộc' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const serviceId = crypto.randomUUID();
    const defaultSellerId = seller_id || '2b4c8e99-38ca-4853-8b31-04dbcdb4aeee';

    const category = type === 'Vẽ' ? 'workshop_ve' : type === 'Nến' ? 'workshop_nen' : 'workshop_gom';
    const image = type === 'Vẽ' ? '/assets/art.jpg' : type === 'Nến' ? '/assets/candle.jpg' : '/assets/pottery.jpg';

    // Nếu Admin đăng -> Duyệt luôn (active). Nếu Partner đăng -> Chờ duyệt (pending)
    const approval_status = is_admin ? 'active' : 'pending';
    const is_available = is_admin ? true : false;

    const { data, error } = await supabase.from('products').insert({
      id: serviceId,
      seller_id: defaultSellerId,
      name,
      category,
      price: Number(price),
      stock: Number(capacity) || 8,
      is_available,
      approval_status,
      description: description || `Buổi trải nghiệm ${name} thư giãn và sáng tạo.`,
      image_url: image,
      technical_specs: {
        type,
        duration: duration || '2 giờ',
        area: area || 'Thảo Điền, TP. Thủ Đức',
        studio: studio || 'Studio Đối Tác',
        capacity: Number(capacity) || 8,
        includes: Array.isArray(includes) ? includes : [includes || 'Đầy đủ vật liệu và hướng dẫn'],
        note: 'Dịch vụ được cập nhật trên hệ thống Trạm Nghỉ.'
      }
    }).select().single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, service: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PATCH: Admin duyệt/từ chối hoặc Partner bật/tắt mở bán
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, approval_status, is_available, rejection_reason } = body;

    if (!id) {
      return NextResponse.json({ error: 'Mã dịch vụ là bắt buộc' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const updatePayload: any = {};

    if (approval_status) {
      updatePayload.approval_status = approval_status;
      if (approval_status === 'active') {
        updatePayload.is_available = true;
      } else if (approval_status === 'rejected') {
        updatePayload.is_available = false;
        if (rejection_reason) updatePayload.rejection_reason = rejection_reason;
      }
    }

    if (typeof is_available === 'boolean') {
      updatePayload.is_available = is_available;
    }

    const { data, error } = await supabase
      .from('products')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, service: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
