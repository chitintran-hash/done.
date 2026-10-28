import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { RefundRequest, RefundStatus } from '../types';

export const refundService = {
  async getRefundRequests(): Promise<RefundRequest[]> {
    if (!isSupabaseConfigured) return [];

    try {
      const { data, error } = await supabase
        .from('refund_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('getRefundRequests error:', error);
        return [];
      }

      return (data || []).map((row) => ({
        id: row.id,
        orderId: row.order_id,
        userId: row.user_id,
        reason: row.reason,
        status: (row.status === 'pending' ? 'requested' : row.status) as RefundStatus,
        createdAt: row.created_at,
        reviewedAt: row.resolved_at,
      }));
    } catch (err) {
      console.error('getRefundRequests failed:', err);
      return [];
    }
  },

  async createRefundRequest(orderId: string, userId: string, reason: string, details?: string): Promise<{ success: boolean; error?: string }> {
    if (!isSupabaseConfigured) return { success: false, error: 'Chưa cấu hình Supabase' };

    try {
      const { error } = await supabase.from('refund_requests').insert({
        order_id: orderId,
        user_id: userId,
        reason,
        details,
        status: 'pending',
      });

      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  async resolveRefundRequest(id: string, status: 'approved' | 'rejected', adminNote?: string): Promise<{ success: boolean; error?: string }> {
    if (!isSupabaseConfigured) return { success: false, error: 'Chưa cấu hình Supabase' };

    try {
      const { error } = await supabase
        .from('refund_requests')
        .update({
          status,
          admin_note: adminNote,
          resolved_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },
};
