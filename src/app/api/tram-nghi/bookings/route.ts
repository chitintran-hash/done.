import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const getSupabaseAdmin = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wedydazzjizgmlnmxtwu.supabase.co';
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  return createClient(url, key);
};

const parseAddress = (raw: any): any => {
  if (!raw) return {};
  if (typeof raw === 'object') return raw;
  try {
    return JSON.parse(raw);
  } catch {
    return { note: String(raw) };
  }
};

// GET: Lấy danh sách booking (cho Customer, Partner hoặc Admin)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const customerEmail = searchParams.get('customer_email');
    const partnerId = searchParams.get('partner_id');

    const supabase = getSupabaseAdmin();
    let query = supabase.from('orders').select('*').order('created_at', { ascending: false });

    if (customerEmail) {
      query = query.eq('buyer_email_snapshot', customerEmail);
    }

    const { data, error } = await query;
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Filter by partner if requested
    let bookings = (data || []).map((o: any) => {
      const addr = parseAddress(o.shipping_address);
      return {
        id: addr?.booking_code || o.id,
        orderUuid: o.id,
        customerName: o.buyer_name_snapshot || 'Khách hàng',
        customerEmail: o.buyer_email_snapshot || '',
        phone: addr?.phone || '',
        serviceId: addr?.service_id,
        serviceName: addr?.service_name || 'Buổi trải nghiệm sáng tạo',
        studioName: addr?.studio_name || 'Nhà Gốm Nhỏ',
        sellerId: addr?.seller_id,
        date: addr?.date || new Date(o.created_at).toLocaleDateString('vi-VN'),
        time: addr?.time || '14:00',
        people: addr?.people || 1,
        total: o.total_price || 0,
        status: o.status || 'confirmed',
        note: addr?.note || '',
        created: o.created_at,
        qrCode: addr?.qr_code || addr?.booking_code || o.id
      };
    });

    if (partnerId) {
      bookings = bookings.filter((b: any) => !b.sellerId || b.sellerId === partnerId || b.studioName.includes('Gốm'));
    }

    return NextResponse.json({ bookings });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST: Customer tạo booking mới
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, note, items, subtotal, discount, total } = body;

    if (!name || !email || !items || !items.length) {
      return NextResponse.json({ error: 'Thông tin đặt chỗ chưa đầy đủ' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const orderUuid = crypto.randomUUID();
    const bookingCode = `TN-${Date.now().toString(36).slice(-4).toUpperCase()}-${Math.random().toString(36).slice(2, 5).toUpperCase()}`;

    const firstItem = items[0];
    const shipping_address = {
      booking_code: bookingCode,
      phone: phone || '',
      note: note || '',
      date: firstItem.date,
      time: firstItem.time,
      people: firstItem.people || 1,
      service_id: firstItem.id,
      service_name: firstItem.name || 'Workshop Trạm Nghỉ',
      studio_name: firstItem.studio || 'Studio Đối Tác',
      seller_id: firstItem.seller_id,
      qr_code: bookingCode,
      extras: firstItem.extras || []
    };

    // 1. Tạo đơn hàng trong Supabase orders
    const { data: orderData, error: orderError } = await supabase.from('orders').insert({
      id: orderUuid,
      buyer_name_snapshot: name,
      buyer_email_snapshot: email,
      total_price: Number(total) || Number(subtotal) || 0,
      status: 'confirmed',
      shipping_address: JSON.stringify(shipping_address)
    }).select().single();

    if (orderError) {
      return NextResponse.json({ error: orderError.message }, { status: 500 });
    }

    // 2. Tạo chi tiết booking trong order_items (nếu có product_id hợp lệ)
    if (firstItem.id && firstItem.id.length === 36) {
      await supabase.from('order_items').insert({
        id: crypto.randomUUID(),
        order_id: orderUuid,
        product_id: firstItem.id,
        quantity: firstItem.people || 1,
        price: Number(firstItem.price) || 0,
        status: 'confirmed'
      });
    }

    return NextResponse.json({
      success: true,
      bookingCode,
      orderUuid,
      booking: orderData
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PATCH: Cập nhật trạng thái booking (Check-in, Đổi lịch, Hủy vé)
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, action, newDate, newTime } = body;

    if (!id || !action) {
      return NextResponse.json({ error: 'Mã vé và hành động là bắt buộc' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    // Tìm order theo ID hoặc booking_code / qr_code
    let { data: order } = await supabase.from('orders').select('*').eq('id', id).maybeSingle();
    if (!order) {
      const { data: orders } = await supabase.from('orders').select('*');
      order = (orders || []).find((o: any) => {
        const a = parseAddress(o.shipping_address);
        return a?.booking_code === id || a?.qr_code === id || o.id === id;
      });
    }

    if (!order) {
      return NextResponse.json({ error: 'Không tìm thấy vé trong hệ thống' }, { status: 404 });
    }

    const updatePayload: any = {};
    const updatedAddress = { ...parseAddress(order.shipping_address) };

    if (action === 'check_in') {
      if (order.status === 'checked_in') {
        return NextResponse.json({ error: 'Vé này đã được check-in trước đó' }, { status: 400 });
      }
      updatePayload.status = 'checked_in';
      updatedAddress.checked_in_at = new Date().toISOString();
    } else if (action === 'reschedule') {
      if (!newDate) {
        return NextResponse.json({ error: 'Vui lòng chọn ngày mới' }, { status: 400 });
      }
      updatePayload.status = 'rescheduled';
      updatedAddress.date = newDate;
      if (newTime) updatedAddress.time = newTime;
      updatedAddress.rescheduled_at = new Date().toISOString();
    } else if (action === 'cancel') {
      updatePayload.status = 'cancelled';
      updatedAddress.cancelled_at = new Date().toISOString();
    }

    updatePayload.shipping_address = JSON.stringify(updatedAddress);

    const { data, error } = await supabase
      .from('orders')
      .update(updatePayload)
      .eq('id', order.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, booking: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
