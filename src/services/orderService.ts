import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { Order, OrderStatus } from '../types';
import { DEFAULT_PLATFORM_COMMISSION_RATE } from '../utils/pricing';

export const orderService = {
  // Fetch orders with room & product details + Phase 5 financial snapshot fields
  async getOrders(userId?: string, supplierId?: string): Promise<Order[]> {
    if (!isSupabaseConfigured) return [];

    try {
      let query = supabase
        .from('orders')
        .select(`
          *,
          group_rooms (
            id,
            product_id,
            supplier_id,
            products (name, unit)
          )
        `)
        .order('created_at', { ascending: false });

      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data, error } = await query;
      if (error) {
        console.error('Error fetching orders:', error);
        return [];
      }

      let results: Order[] = (data || []).map((row: any) => {
        const room = row.group_rooms;
        const productName = room?.products?.name || 'Sản phẩm gom';
        const unit = room?.products?.unit || 'sp';
        const productSubtotal = Number(row.product_subtotal);
        const commissionRate =
          row.commission_rate !== null && row.commission_rate !== undefined
            ? Number(row.commission_rate)
            : DEFAULT_PLATFORM_COMMISSION_RATE;
        const platformCommission =
          row.platform_commission !== null && row.platform_commission !== undefined && Number(row.platform_commission) > 0
            ? Number(row.platform_commission)
            : Math.round(productSubtotal * commissionRate);
        const supplierGross =
          row.supplier_gross !== null && row.supplier_gross !== undefined && Number(row.supplier_gross) > 0
            ? Number(row.supplier_gross)
            : productSubtotal;
        const supplierNet =
          row.supplier_net !== null && row.supplier_net !== undefined && Number(row.supplier_net) > 0
            ? Number(row.supplier_net)
            : supplierGross - platformCommission;

        return {
          id: row.id,
          roomId: row.room_id,
          participationId: row.participation_id,
          userId: row.user_id,
          supplierId: room?.supplier_id,
          productName,
          unit,
          quantity: row.quantity,
          unitPrice: Number(row.unit_price),
          productSubtotal,
          shippingFee: Number(row.shipping_fee),
          totalAmount: Number(row.total_amount),
          commissionRate,
          platformCommission,
          supplierGross,
          supplierNet,
          voucherCode: row.voucher_code || undefined,
          voucherDiscount: row.voucher_discount ? Number(row.voucher_discount) : 0,
          voucherFundedBy: row.voucher_funded_by || 'platform',
          pickupPoint: row.pickup_point_name || row.pickup_point || '',
          pickupAddress: row.pickup_address || '',
          pickupPointId: row.pickup_point_id || undefined,
          pickupPointName: row.pickup_point_name || row.pickup_point || '',
          pickupWindow: row.pickup_window || undefined,
          deliveryBatchId: row.delivery_batch_id || undefined,
          pickupCode: row.pickup_code || `FG-${row.id.slice(0, 6).toUpperCase()}`,
          status: row.status as OrderStatus,
          paymentMethod: row.payment_method,
          createdAt: row.created_at,
          paidAt: row.paid_at,
          pickedUpAt: row.picked_up_at,
        };
      });

      if (supplierId) {
        results = results.filter((o) => o.supplierId === supplierId);
      }

      return results;
    } catch (err) {
      console.error('getOrders failed:', err);
      return [];
    }
  },

  // Create a paid order with financial snapshot (Req 20)
  async createOrder(orderData: {
    roomId: string;
    participationId: string;
    userId: string;
    supplierId?: string;
    productName?: string;
    unit?: string;
    quantity: number;
    unitPrice: number;
    productSubtotal: number;
    shippingFee: number;
    totalAmount: number;
    commissionRate?: number;
    platformCommission?: number;
    supplierGross?: number;
    supplierNet?: number;
    voucherCode?: string;
    voucherDiscount?: number;
    voucherFundedBy?: 'platform' | 'supplier';
    pickupPoint: string;
    pickupAddress: string;
    pickupPointId?: string;
    pickupPointName?: string;
    pickupWindow?: string;
    deliveryBatchId?: string;
    pickupCode: string;
    status?: OrderStatus;
    paymentMethod?: string;
  }): Promise<{ order: Order | null; error?: string }> {
    if (!isSupabaseConfigured) return { order: null, error: 'Chưa cấu hình Supabase' };

    try {
      const rate = orderData.commissionRate ?? DEFAULT_PLATFORM_COMMISSION_RATE;
      const gross = orderData.supplierGross ?? orderData.productSubtotal;
      const commission = orderData.platformCommission ?? Math.round(gross * rate);
      const net = orderData.supplierNet ?? gross - commission;
      const status = orderData.status || 'paid';
      const now = new Date().toISOString();

      const insertPayload: Record<string, any> = {
        room_id: orderData.roomId,
        participation_id: orderData.participationId,
        user_id: orderData.userId,
        quantity: orderData.quantity,
        unit_price: orderData.unitPrice,
        product_subtotal: orderData.productSubtotal,
        shipping_fee: orderData.shippingFee,
        total_amount: orderData.totalAmount,
        commission_rate: rate,
        platform_commission: commission,
        supplier_gross: gross,
        supplier_net: net,
        voucher_code: orderData.voucherCode || null,
        voucher_discount: orderData.voucherDiscount || 0,
        voucher_funded_by: orderData.voucherFundedBy || 'platform',
        pickup_point: orderData.pickupPointName || orderData.pickupPoint,
        pickup_address: orderData.pickupAddress,
        pickup_point_id: orderData.pickupPointId || null,
        pickup_point_name: orderData.pickupPointName || orderData.pickupPoint,
        pickup_window: orderData.pickupWindow || null,
        delivery_batch_id: orderData.deliveryBatchId || null,
        pickup_code: orderData.pickupCode,
        status,
        payment_method: orderData.paymentMethod,
        paid_at: status === 'paid' ? now : null,
      };

      const { data, error } = await supabase
        .from('orders')
        .insert(insertPayload)
        .select()
        .single();

      if (error) {
        return { order: null, error: error.message };
      }

      // Also mark group_participation as paid if order is paid
      if (status === 'paid' && orderData.participationId) {
        await supabase
          .from('group_participations')
          .update({ status: 'paid' })
          .eq('id', orderData.participationId);
      }

      return {
        order: {
          id: data.id,
          roomId: data.room_id,
          participationId: data.participation_id,
          userId: data.user_id,
          supplierId: orderData.supplierId,
          productName: orderData.productName || 'Sản phẩm gom',
          unit: orderData.unit,
          quantity: data.quantity,
          unitPrice: Number(data.unit_price),
          productSubtotal: Number(data.product_subtotal),
          shippingFee: Number(data.shipping_fee),
          totalAmount: Number(data.total_amount),
          commissionRate: Number(data.commission_rate ?? rate),
          platformCommission: Number(data.platform_commission ?? commission),
          supplierGross: Number(data.supplier_gross ?? gross),
          supplierNet: Number(data.supplier_net ?? net),
          voucherCode: data.voucher_code || orderData.voucherCode,
          voucherDiscount: Number(data.voucher_discount ?? orderData.voucherDiscount ?? 0),
          voucherFundedBy: data.voucher_funded_by || orderData.voucherFundedBy || 'platform',
          pickupPoint: data.pickup_point || '',
          pickupAddress: data.pickup_address || '',
          pickupCode: data.pickup_code,
          status: data.status as OrderStatus,
          paymentMethod: data.payment_method,
          createdAt: data.created_at,
          paidAt: data.paid_at,
        },
      };
    } catch (err: any) {
      return { order: null, error: err.message };
    }
  },

  // Simulated Payment with financial snapshot (Req 20)
  async simulatePayment(
    orderId: string,
    paymentMethod: string = 'Demo Banking (Chuyển khoản QR)',
    commissionRate: number = DEFAULT_PLATFORM_COMMISSION_RATE
  ): Promise<{ success: boolean; error?: string }> {
    if (!isSupabaseConfigured) return { success: false, error: 'Chưa cấu hình Supabase' };

    try {
      const now = new Date().toISOString();
      const { data: existing } = await supabase
        .from('orders')
        .select('product_subtotal')
        .eq('id', orderId)
        .single();

      const subtotal = Number(existing?.product_subtotal || 0);
      const commission = Math.round(subtotal * commissionRate);
      const net = subtotal - commission;

      const { data: order, error } = await supabase
        .from('orders')
        .update({
          status: 'paid',
          paid_at: now,
          payment_method: paymentMethod,
          commission_rate: commissionRate,
          platform_commission: commission,
          supplier_gross: subtotal,
          supplier_net: net,
        })
        .eq('id', orderId)
        .select('*, group_rooms(product_id, products(name))')
        .single();

      if (error) return { success: false, error: error.message };

      if (order) {
        await supabase.from('notifications').insert({
          user_id: order.user_id,
          type: 'payment',
          title: 'Thanh toán thành công (Mô phỏng Demo)',
          message: `Đơn hàng #${order.pickup_code || order.id.slice(0, 8)} đã thanh toán thành công. Nhà cung cấp đang chuẩn bị hàng.`,
          order_id: order.id,
          room_id: order.room_id,
        });
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  // Supplier advances order status (paid -> preparing -> in_transit -> ready_for_pickup -> picked_up)
  async updateOrderStatus(orderId: string, newStatus: OrderStatus): Promise<{ success: boolean; error?: string }> {
    if (!isSupabaseConfigured) return { success: false, error: 'Chưa cấu hình Supabase' };

    try {
      const updates: Record<string, any> = { status: newStatus };
      const now = new Date().toISOString();

      if (newStatus === 'paid') updates.paid_at = now;
      if (newStatus === 'picked_up') updates.picked_up_at = now;

      const { data: order, error } = await supabase
        .from('orders')
        .update(updates)
        .eq('id', orderId)
        .select()
        .single();

      if (error) return { success: false, error: error.message };

      if (order) {
        let notifTitle = '';
        let notifMsg = '';
        let notifType = 'order_update';

        if (newStatus === 'preparing') {
          notifTitle = 'Đang chuẩn bị hàng';
          notifMsg = 'Nhà cung cấp đã tiếp nhận và đang đóng gói đơn hàng của bạn.';
        } else if (newStatus === 'in_transit') {
          notifTitle = 'Đang vận chuyển gom chung';
          notifMsg = 'Kiện hàng đang trên xe chuyển đến điểm nhận hàng (Locker/Hub).';
        } else if (newStatus === 'ready_for_pickup') {
          notifType = 'pickup_ready';
          notifTitle = 'Hàng đã sẵn sàng nhận!';
          notifMsg = `Đơn hàng đã tới ${order.pickup_point || 'điểm nhận'}. Mã nhận hàng: ${order.pickup_code}.`;
        } else if (newStatus === 'picked_up') {
          notifTitle = 'Nhận hàng thành công';
          notifMsg = 'Bạn đã nhận hàng thành công. Hãy để lại đánh giá cho nhà cung cấp nhé!';
        }

        if (notifTitle) {
          await supabase.from('notifications').insert({
            user_id: order.user_id,
            type: notifType,
            title: notifTitle,
            message: notifMsg,
            order_id: order.id,
            room_id: order.room_id,
          });
        }
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  async simulateQrPickup(orderId: string): Promise<{ success: boolean; error?: string }> {
    return this.updateOrderStatus(orderId, 'picked_up');
  },
};
