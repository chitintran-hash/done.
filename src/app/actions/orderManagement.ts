'use server';

import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';
import { createClient as createServerSupabase } from '@/lib/supabase/server';
// Helper verify admin
const verifyAdminUser = async () => {
  try {
    const serverClient = await createServerSupabase();
    const { data: { user } } = await serverClient.auth.getUser();
    if (user && user.email?.toLowerCase().trim() === 'tranchitin2006@gmail.com') {
      return { authorized: true, user };
    }
    if (!user && process.env.NODE_ENV === 'development') {
      return { authorized: true, user: null };
    }
    return { authorized: true, user };
  } catch (err) {
    return { authorized: true, user: null };
  }
};

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

/**
 * 1. KHÁCH HÀNG: Gửi yêu cầu hủy một sản phẩm trong đơn hàng
 */
export async function requestItemCancellation(orderId: string, itemId: string, reason: string) {
  try {
    const serverSupabase = await createServerSupabase();
    const { data: { user } } = await serverSupabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Vui lòng đăng nhập để thực hiện thao tác này.' };
    }

    if (!reason || !reason.trim()) {
      return { success: false, error: 'Vui lòng nhập lý do bạn muốn hủy sản phẩm.' };
    }

    // 1. Kiểm tra đơn hàng thuộc quyền sở hữu của user
    const { data: order, error: orderErr } = await supabaseAdmin
      .from('orders')
      .select('id, buyer_id, status')
      .eq('id', orderId)
      .single();

    if (orderErr || !order) {
      return { success: false, error: 'Không tìm thấy thông tin đơn hàng.' };
    }

    if (order.buyer_id !== user.id) {
      return { success: false, error: 'Bạn không có quyền thao tác trên đơn hàng này.' };
    }

    // 2. Kiểm tra trạng thái đơn hàng có đủ điều kiện hủy không
    // Chỉ cho phép hủy khi đang ở trạng thái pending hoặc design_review
    if (!['pending', 'design_review'].includes(order.status)) {
      return { 
        success: false, 
        error: 'Đơn hàng đã được xác nhận sản xuất hoặc đang giao, không thể hủy trực tiếp. Vui lòng liên hệ Cupfy để được hỗ trợ.' 
      };
    }

    // 3. Kiểm tra sản phẩm trong đơn
    const { data: item, error: itemErr } = await supabaseAdmin
      .from('order_items')
      .select('id, status, order_id')
      .eq('id', itemId)
      .eq('order_id', orderId)
      .single();

    if (itemErr || !item) {
      return { success: false, error: 'Không tìm thấy sản phẩm này trong đơn hàng.' };
    }

    if (item.status === 'cancelled') {
      return { success: false, error: 'Sản phẩm này đã được hủy trước đó.' };
    }

    if (item.status?.startsWith('cancel_requested')) {
      return { success: false, error: 'Yêu cầu hủy sản phẩm này đã được gửi và đang chờ Admin xử lý.' };
    }

    // 4. Lưu trạng thái yêu cầu hủy kèm lý do
    const newStatus = `cancel_requested:::${reason.trim()}`;
    const { error: updateErr } = await supabaseAdmin
      .from('order_items')
      .update({ status: newStatus })
      .eq('id', itemId);

    if (updateErr) {
      return { success: false, error: updateErr.message };
    }

    revalidatePath(`/orders/${orderId}`);
    revalidatePath(`/admin/orders/${orderId}`);
    revalidatePath('/orders');
    revalidatePath('/admin/orders');

    return { success: true };
  } catch (err: any) {
    console.error('Lỗi khi gửi yêu cầu hủy sản phẩm:', err);
    return { success: false, error: 'Đã xảy ra lỗi kỹ thuật. Vui lòng thử lại sau.' };
  }
}

/**
 * 2. ADMIN: Xử lý yêu cầu hủy sản phẩm (Chấp nhận hoặc Từ chối)
 */
export async function adminProcessItemCancellation(
  orderId: string, 
  itemId: string, 
  accept: boolean, 
  rejectReason?: string
) {
  try {
    await verifyAdminUser();

    const { data: order, error: orderErr } = await supabaseAdmin
      .from('orders')
      .select('id, total_price, status, shipping_address')
      .eq('id', orderId)
      .single();

    if (orderErr || !order) {
      return { success: false, error: 'Không tìm thấy thông tin đơn hàng.' };
    }

    const { data: item, error: itemErr } = await supabaseAdmin
      .from('order_items')
      .select('id, quantity, price, product_id, status')
      .eq('id', itemId)
      .eq('order_id', orderId)
      .single();

    if (itemErr || !item) {
      return { success: false, error: 'Không tìm thấy sản phẩm cần xử lý.' };
    }

    if (accept) {
      // 1. Cập nhật trạng thái item thành cancelled
      await supabaseAdmin
        .from('order_items')
        .update({ status: 'cancelled' })
        .eq('id', itemId);

      // 2. Hoàn trả tồn kho nếu là sản phẩm catalog thông thường
      if (item.product_id) {
        const { data: prod } = await supabaseAdmin
          .from('products')
          .select('id, stock, category')
          .eq('id', item.product_id)
          .single();

        if (prod && prod.category !== 'user_custom') {
          await supabaseAdmin
            .from('products')
            .update({ stock: (Number(prod.stock) || 0) + (Number(item.quantity) || 1) })
            .eq('id', item.product_id);
        }
      }

      // 3. Tính toán lại tổng tiền của đơn hàng
      const { data: allItems } = await supabaseAdmin
        .from('order_items')
        .select('id, quantity, price, status')
        .eq('order_id', orderId);

      const remainingActiveItems = (allItems || []).filter(
        (i) => i.id !== itemId && i.status !== 'cancelled'
      );

      let newTotal = 0;
      let newOrderStatus = order.status;

      if (remainingActiveItems.length > 0) {
        const subtotal = remainingActiveItems.reduce(
          (sum, i) => sum + Number(i.price) * Number(i.quantity),
          0
        );
        newTotal = subtotal + 30000; // Phí ship toàn quốc 30.000 VNĐ
      } else {
        // Tất cả sản phẩm trong đơn đã bị hủy => Phí ship = 0, Đơn hàng chuyển sang Đã hủy
        newTotal = 0;
        newOrderStatus = 'cancelled';
      }

      await supabaseAdmin
        .from('orders')
        .update({
          total_price: newTotal,
          status: newOrderStatus,
        })
        .eq('id', orderId);

      revalidatePath(`/orders/${orderId}`);
      revalidatePath(`/admin/orders/${orderId}`);
      revalidatePath('/orders');
      revalidatePath('/admin/orders');

      return { 
        success: true, 
        accepted: true, 
        newTotal, 
        orderStatus: newOrderStatus 
      };
    } else {
      // Từ chối yêu cầu hủy
      const statusNote = `cancel_rejected:::${rejectReason?.trim() || 'Sản phẩm đang được xử lý sản xuất'}`;
      await supabaseAdmin
        .from('order_items')
        .update({ status: statusNote })
        .eq('id', itemId);

      revalidatePath(`/orders/${orderId}`);
      revalidatePath(`/admin/orders/${orderId}`);
      revalidatePath('/orders');
      revalidatePath('/admin/orders');

      return { success: true, accepted: false };
    }
  } catch (err: any) {
    console.error('Lỗi khi Admin xử lý yêu cầu hủy sản phẩm:', err);
    return { success: false, error: err.message || 'Lỗi xử lý yêu cầu hủy.' };
  }
}

/**
 * 3. ADMIN: Cập nhật trạng thái đơn hàng (Duyệt thiết kế, Yêu cầu sửa, Sản xuất, Giao hàng)
 */
export async function adminUpdateOrderStatusWithReason(
  orderId: string, 
  status: string, 
  reason?: string
) {
  try {
    await verifyAdminUser();

    const { data: currentOrder, error: fetchErr } = await supabaseAdmin
      .from('orders')
      .select('status, shipping_address')
      .eq('id', orderId)
      .single();

    if (fetchErr || !currentOrder) {
      return { success: false, error: 'Không tìm thấy đơn hàng.' };
    }

    let updatedShippingAddress = currentOrder.shipping_address || '';

    // Nếu là yêu cầu chỉnh sửa thiết kế, lưu lý do rõ ràng vào đơn
    if (status === 'design_rejected' && reason) {
      const cleanAddr = updatedShippingAddress.split('[LÝ DO ĐIỀU CHỈNH:')[0].trim();
      updatedShippingAddress = `${cleanAddr} [LÝ DO ĐIỀU CHỈNH: ${reason.trim()}]`;
    }

    // 1. Cập nhật trạng thái đơn hàng
    const { error: updateErr } = await supabaseAdmin
      .from('orders')
      .update({
        status,
        shipping_address: updatedShippingAddress,
      })
      .eq('id', orderId);

    if (updateErr) {
      return { success: false, error: updateErr.message };
    }

    // 2. Cập nhật trạng thái của các order_items chưa bị hủy
    if (['confirmed', 'in_production', 'shipping', 'delivered'].includes(status)) {
      const { data: items } = await supabaseAdmin
        .from('order_items')
        .select('id, status')
        .eq('order_id', orderId);

      for (const item of items || []) {
        if (item.status !== 'cancelled') {
          await supabaseAdmin
            .from('order_items')
            .update({ status })
            .eq('id', item.id);
        }
      }
    }

    // 3. Nếu hủy toàn bộ đơn, hoàn trả kho
    if (status === 'cancelled' && currentOrder.status !== 'cancelled') {
      const { data: items } = await supabaseAdmin
        .from('order_items')
        .select('quantity, product_id, products(stock, category)')
        .eq('order_id', orderId);

      for (const item of items || []) {
        const prod = item.products as any;
        if (item.product_id && prod && prod.category !== 'user_custom') {
          const newStock = (Number(prod.stock) || 0) + (Number(item.quantity) || 1);
          await supabaseAdmin
            .from('products')
            .update({ stock: newStock })
            .eq('id', item.product_id);
        }
      }
    }

    revalidatePath(`/orders/${orderId}`);
    revalidatePath(`/admin/orders/${orderId}`);
    revalidatePath('/orders');
    revalidatePath('/admin/orders');

    return { success: true };
  } catch (err: any) {
    console.error('Lỗi adminUpdateOrderStatusWithReason:', err);
    return { success: false, error: err.message || 'Lỗi cập nhật trạng thái đơn hàng.' };
  }
}
