import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { Review } from '../types';

export const reviewService = {
  async getReviews(supplierId?: string): Promise<Review[]> {
    if (!isSupabaseConfigured) return [];

    try {
      let query = supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (supplierId) {
        query = query.eq('supplier_id', supplierId);
      }

      const { data, error } = await query;
      if (error) {
        console.error('getReviews error:', error);
        return [];
      }

      return (data || []).map((row) => ({
        id: row.id,
        orderId: row.order_id,
        userId: row.user_id,
        supplierId: row.supplier_id,
        productRating: row.product_rating,
        supplierRating: row.service_rating,
        pickupRating: row.delivery_rating,
        comment: row.comment || '',
        createdAt: row.created_at,
      }));
    } catch (err) {
      console.error('getReviews failed:', err);
      return [];
    }
  },

  async createReview(review: {
    orderId: string;
    userId: string;
    supplierId: string;
    productRating: number;
    supplierRating: number;
    pickupRating: number;
    comment?: string;
  }): Promise<{ success: boolean; error?: string }> {
    if (!isSupabaseConfigured) return { success: false, error: 'Chưa cấu hình Supabase' };

    try {
      const { error } = await supabase.from('reviews').insert({
        order_id: review.orderId,
        user_id: review.userId,
        supplier_id: review.supplierId,
        product_rating: review.productRating,
        delivery_rating: review.pickupRating,
        service_rating: review.supplierRating,
        comment: review.comment,
      });

      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },
};
