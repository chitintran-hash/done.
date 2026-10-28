import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { SupplierPayout, PayoutStatus } from '../types';
import { DEFAULT_PLATFORM_COMMISSION_RATE } from '../utils/pricing';

export const financeService = {
  // Fetch platform commission rate from platform_settings table (Req 21 & 22)
  async getCommissionRate(): Promise<number> {
    if (!isSupabaseConfigured) return DEFAULT_PLATFORM_COMMISSION_RATE;

    try {
      const { data, error } = await supabase
        .from('platform_settings')
        .select('value')
        .eq('key', 'commission_rate')
        .maybeSingle();

      if (error || !data || !data.value) {
        return DEFAULT_PLATFORM_COMMISSION_RATE;
      }

      const rate = Number((data.value as any).rate);
      if (Number.isNaN(rate) || rate < 0 || rate > 0.2) {
        return DEFAULT_PLATFORM_COMMISSION_RATE;
      }
      return rate;
    } catch {
      return DEFAULT_PLATFORM_COMMISSION_RATE;
    }
  },

  // Update platform commission rate (0% - 20%) (Req 21 & 22)
  async updateCommissionRate(rate: number): Promise<{ success: boolean; error?: string }> {
    if (!isSupabaseConfigured) return { success: false, error: 'Chưa cấu hình Supabase' };
    const clampedRate = Math.max(0, Math.min(0.2, rate));

    try {
      const { error } = await supabase
        .from('platform_settings')
        .upsert({
          key: 'commission_rate',
          value: { rate: clampedRate },
          updated_at: new Date().toISOString(),
        });

      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  // Fetch all payouts (or supplier-specific payouts) along with included order IDs
  async getPayouts(supplierId?: string): Promise<SupplierPayout[]> {
    if (!isSupabaseConfigured) return [];

    try {
      let query = supabase
        .from('supplier_payouts')
        .select(`
          *,
          suppliers (business_name, user_id),
          payout_orders (order_id)
        `)
        .order('requested_at', { ascending: false });

      if (supplierId) {
        query = query.eq('supplier_id', supplierId);
      }

      const { data, error } = await query;
      if (error) {
        console.error('Error fetching supplier_payouts:', error);
        return [];
      }

      return (data || []).map((row: any) => ({
        id: row.id,
        supplierId: row.supplier_id,
        supplierName: row.suppliers?.business_name || 'Nhà cung cấp',
        amount: Number(row.amount || 0),
        status: (row.status as PayoutStatus) || 'pending',
        orderCount: Number(row.order_count || 0),
        orderIds: Array.isArray(row.payout_orders)
          ? row.payout_orders.map((po: any) => po.order_id)
          : [],
        periodStart: row.period_start || undefined,
        periodEnd: row.period_end || undefined,
        requestedAt: row.requested_at || new Date().toISOString(),
        approvedAt: row.approved_at || undefined,
        paidAt: row.paid_at || undefined,
        note: row.note || undefined,
      }));
    } catch (err) {
      console.error('getPayouts failed:', err);
      return [];
    }
  },

  // Create a payout request & record payout_orders to prevent double payout (Req 10, 11, 13)
  async createPayoutRequest(params: {
    supplierId: string;
    supplierName?: string;
    amount: number;
    orderIds: string[];
    periodStart?: string;
    periodEnd?: string;
    note?: string;
  }): Promise<{ payout: SupplierPayout | null; error?: string }> {
    if (!isSupabaseConfigured) return { payout: null, error: 'Chưa cấu hình Supabase' };

    try {
      const now = new Date().toISOString();
      const { data: payoutRow, error: payoutError } = await supabase
        .from('supplier_payouts')
        .insert({
          supplier_id: params.supplierId,
          amount: params.amount,
          status: 'pending',
          order_count: params.orderIds.length,
          period_start: params.periodStart || now,
          period_end: params.periodEnd || now,
          requested_at: now,
          note: params.note || 'Yêu cầu đối soát doanh thu từ đơn hàng đã nhận (picked_up)',
        })
        .select()
        .single();

      if (payoutError || !payoutRow) {
        return { payout: null, error: payoutError?.message || 'Không thể tạo yêu cầu đối soát' };
      }

      if (params.orderIds.length > 0) {
        const junctionRows = params.orderIds.map((oid) => ({
          payout_id: payoutRow.id,
          order_id: oid,
        }));
        await supabase.from('payout_orders').insert(junctionRows);
      }

      // Notify all Admin profiles (Req 13)
      const { data: admins } = await supabase
        .from('profiles')
        .select('id')
        .eq('role', 'admin');

      if (admins && admins.length > 0) {
        const notifs = admins.map((a: any) => ({
          user_id: a.id,
          type: 'payout',
          title: 'Nhà cung cấp đã gửi yêu cầu đối soát mới.',
          message: `Nhà cung cấp ${params.supplierName || ''} vừa gửi yêu cầu đối soát ${params.orderIds.length} đơn hàng.`,
        }));
        await supabase.from('notifications').insert(notifs);
      }

      return {
        payout: {
          id: payoutRow.id,
          supplierId: payoutRow.supplier_id,
          supplierName: params.supplierName,
          amount: Number(payoutRow.amount),
          status: payoutRow.status as PayoutStatus,
          orderCount: Number(payoutRow.order_count),
          orderIds: params.orderIds,
          periodStart: payoutRow.period_start,
          periodEnd: payoutRow.period_end,
          requestedAt: payoutRow.requested_at,
          note: payoutRow.note,
        },
      };
    } catch (err: any) {
      return { payout: null, error: err.message };
    }
  },

  // Admin updates payout status: pending -> approved -> paid (or rejected) (Req 12 & 13)
  async updatePayoutStatus(
    payoutId: string,
    newStatus: PayoutStatus,
    supplierUserId?: string
  ): Promise<{ success: boolean; error?: string }> {
    if (!isSupabaseConfigured) return { success: false, error: 'Chưa cấu hình Supabase' };

    try {
      const now = new Date().toISOString();
      const updates: Record<string, any> = { status: newStatus };
      if (newStatus === 'approved') updates.approved_at = now;
      if (newStatus === 'paid') updates.paid_at = now;

      const { error } = await supabase
        .from('supplier_payouts')
        .update(updates)
        .eq('id', payoutId);

      if (error) return { success: false, error: error.message };

      // Send notification to Supplier (Req 13)
      if (supplierUserId) {
        let title = '';
        let message = '';
        if (newStatus === 'approved') {
          title = 'Yêu cầu đối soát đã được duyệt.';
          message = `Yêu cầu đối soát #${payoutId.slice(0, 8)} đã được Admin phê duyệt và đang chờ giải ngân mô phỏng.`;
        } else if (newStatus === 'paid') {
          title = 'Khoản đối soát đã được đánh dấu hoàn tất.';
          message = `Khoản đối soát #${payoutId.slice(0, 8)} đã được giải ngân thành công (Mô phỏng).`;
        } else if (newStatus === 'rejected') {
          title = 'Yêu cầu đối soát bị từ chối';
          message = `Yêu cầu đối soát #${payoutId.slice(0, 8)} đã bị từ chối. Các đơn hàng khả dụng đã được hoàn lại số dư.`;
        }

        if (title) {
          await supabase.from('notifications').insert({
            user_id: supplierUserId,
            type: 'payout',
            title,
            message,
          });
        }
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },
};
