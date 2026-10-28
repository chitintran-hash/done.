import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type {
  Referral,
  ReferralStatus,
  RoomEvent,
  RoomEventType,
  GroupMessage,
  MessageReaction,
  ReactionType,
  LoyaltyTransaction,
  LoyaltyTransactionType,
  Voucher,
  VoucherUsage,
} from '../types';

export const socialService = {
  // ==========================================
  // 1. REFERRALS (Req 6–10, 41, 52)
  // ==========================================
  async getReferrals(): Promise<Referral[]> {
    if (!isSupabaseConfigured || !supabase) return [];
    try {
      const { data, error } = await supabase
        .from('referrals')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !data) return [];

      return data.map((row: any) => ({
        id: row.id,
        referrerUserId: row.referrer_user_id,
        referredUserId: row.referred_user_id || undefined,
        roomId: row.room_id || undefined,
        status: (row.status || 'clicked') as ReferralStatus,
        createdAt: row.created_at,
        completedAt: row.completed_at || undefined,
      }));
    } catch {
      return [];
    }
  },

  async upsertReferral(params: {
    referrerUserId: string;
    referredUserId?: string;
    roomId?: string;
    status: ReferralStatus;
  }): Promise<Referral | null> {
    if (!isSupabaseConfigured || !supabase) return null;
    // Prevent self-referral (Req 9)
    if (params.referredUserId && params.referrerUserId === params.referredUserId) {
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('referrals')
        .insert({
          referrer_user_id: params.referrerUserId,
          referred_user_id: params.referredUserId || null,
          room_id: params.roomId || null,
          status: params.status,
        })
        .select()
        .single();

      if (error || !data) return null;

      return {
        id: data.id,
        referrerUserId: data.referrer_user_id,
        referredUserId: data.referred_user_id || undefined,
        roomId: data.room_id || undefined,
        status: data.status as ReferralStatus,
        createdAt: data.created_at,
        completedAt: data.completed_at || undefined,
      };
    } catch {
      return null;
    }
  },

  async updateReferralStatus(
    referralId: string,
    status: ReferralStatus,
    referredUserId?: string
  ): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;
    try {
      const updates: Record<string, any> = { status };
      if (referredUserId) updates.referred_user_id = referredUserId;
      if (status === 'completed') updates.completed_at = new Date().toISOString();

      const { error } = await supabase
        .from('referrals')
        .update(updates)
        .eq('id', referralId);

      return !error;
    } catch {
      return false;
    }
  },

  // ==========================================
  // 2. ROOM EVENTS / ACTIVITY FEED (Req 11–14)
  // ==========================================
  async getRoomEvents(roomId?: string): Promise<RoomEvent[]> {
    if (!isSupabaseConfigured || !supabase) return [];
    try {
      let query = supabase
        .from('room_events')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (roomId) {
        query = query.eq('room_id', roomId);
      }

      const { data, error } = await query;
      if (error || !data) return [];

      return data.map((row: any) => ({
        id: row.id,
        roomId: row.room_id,
        userId: row.user_id || undefined,
        eventType: row.event_type as RoomEventType,
        metadata: row.metadata || {},
        createdAt: row.created_at,
      }));
    } catch {
      return [];
    }
  },

  async createRoomEvent(params: {
    roomId: string;
    userId?: string;
    eventType: RoomEventType;
    metadata?: Record<string, unknown>;
  }): Promise<RoomEvent | null> {
    if (!isSupabaseConfigured || !supabase) return null;
    try {
      const { data, error } = await supabase
        .from('room_events')
        .insert({
          room_id: params.roomId,
          user_id: params.userId || null,
          event_type: params.eventType,
          metadata: params.metadata || {},
        })
        .select()
        .single();

      if (error || !data) return null;

      return {
        id: data.id,
        roomId: data.room_id,
        userId: data.user_id || undefined,
        eventType: data.event_type as RoomEventType,
        metadata: data.metadata || {},
        createdAt: data.created_at,
      };
    } catch {
      return null;
    }
  },

  // ==========================================
  // 3. GROUP CHAT & REACTIONS (Req 15–23)
  // ==========================================
  async getGroupMessages(roomId?: string): Promise<GroupMessage[]> {
    if (!isSupabaseConfigured || !supabase) return [];
    try {
      let query = supabase
        .from('group_messages')
        .select('*')
        .order('created_at', { ascending: true });

      if (roomId) {
        query = query.eq('room_id', roomId);
      }

      const { data, error } = await query;
      if (error || !data) return [];

      return data.map((row: any) => ({
        id: row.id,
        roomId: row.room_id,
        userId: row.user_id,
        userName: row.user_name || undefined,
        message: row.message,
        createdAt: row.created_at,
        deletedAt: row.deleted_at || undefined,
      }));
    } catch {
      return [];
    }
  },

  async sendGroupMessage(params: {
    roomId: string;
    userId: string;
    userName?: string;
    message: string;
  }): Promise<GroupMessage | null> {
    if (!isSupabaseConfigured || !supabase) return null;
    const cleanText = params.message.trim().slice(0, 300);
    if (!cleanText) return null;

    try {
      const { data, error } = await supabase
        .from('group_messages')
        .insert({
          room_id: params.roomId,
          user_id: params.userId,
          user_name: params.userName || null,
          message: cleanText,
        })
        .select()
        .single();

      if (error || !data) return null;

      return {
        id: data.id,
        roomId: data.room_id,
        userId: data.user_id,
        userName: data.user_name || params.userName,
        message: data.message,
        createdAt: data.created_at,
        deletedAt: data.deleted_at || undefined,
      };
    } catch {
      return null;
    }
  },

  async hideGroupMessage(messageId: string): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;
    try {
      const { error } = await supabase
        .from('group_messages')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', messageId);

      return !error;
    } catch {
      return false;
    }
  },

  async getMessageReactions(): Promise<MessageReaction[]> {
    if (!isSupabaseConfigured || !supabase) return [];
    try {
      const { data, error } = await supabase
        .from('message_reactions')
        .select('*');

      if (error || !data) return [];

      return data.map((row: any) => ({
        messageId: row.message_id,
        userId: row.user_id,
        reaction: row.reaction as ReactionType,
        createdAt: row.created_at,
      }));
    } catch {
      return [];
    }
  },

  async toggleMessageReaction(
    messageId: string,
    userId: string,
    reaction: ReactionType,
    isRemoving: boolean
  ): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;
    try {
      if (isRemoving) {
        const { error } = await supabase
          .from('message_reactions')
          .delete()
          .eq('message_id', messageId)
          .eq('user_id', userId)
          .eq('reaction', reaction);
        return !error;
      } else {
        const { error } = await supabase
          .from('message_reactions')
          .insert({
            message_id: messageId,
            user_id: userId,
            reaction,
          });
        return !error;
      }
    } catch {
      return false;
    }
  },

  // ==========================================
  // 4. LOYALTY POINTS / FLASHPOINTS (Req 25–29, 41–44, 51)
  // ==========================================
  async getLoyaltyTransactions(): Promise<LoyaltyTransaction[]> {
    if (!isSupabaseConfigured || !supabase) return [];
    try {
      const { data, error } = await supabase
        .from('loyalty_transactions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !data) return [];

      return data.map((row: any) => ({
        id: row.id,
        userId: row.user_id,
        points: Number(row.points),
        type: row.type as LoyaltyTransactionType,
        referenceId: row.reference_id || undefined,
        description: row.description || '',
        createdAt: row.created_at,
      }));
    } catch {
      return [];
    }
  },

  async awardPurchasePointsRpc(orderId: string): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;
    try {
      const { data, error } = await supabase.rpc('award_purchase_points', {
        p_order_id: orderId,
      });
      return !error && Boolean(data);
    } catch {
      return false;
    }
  },

  async awardReviewPointsRpc(orderId: string): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;
    try {
      const { data, error } = await supabase.rpc('award_review_points', {
        p_order_id: orderId,
      });
      return !error && Boolean(data);
    } catch {
      return false;
    }
  },

  async awardReferralPointsRpc(referralId: string): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;
    try {
      const { data, error } = await supabase.rpc('award_referral_points', {
        p_referral_id: referralId,
      });
      return !error && Boolean(data);
    } catch {
      return false;
    }
  },

  // ==========================================
  // 5. VOUCHERS & VOUCHER USAGES (Req 30–40)
  // ==========================================
  async getVouchers(): Promise<Voucher[]> {
    if (!isSupabaseConfigured || !supabase) return [];
    try {
      const { data, error } = await supabase
        .from('vouchers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !data) return [];

      return data.map((row: any) => ({
        id: row.id,
        code: row.code,
        name: row.name,
        type: row.type as 'fixed' | 'percentage',
        value: Number(row.value),
        minimumOrder: row.minimum_order !== null ? Number(row.minimum_order) : 0,
        maxDiscount: row.max_discount !== null ? Number(row.max_discount) : undefined,
        startAt: row.start_at,
        endAt: row.end_at,
        usageLimit: row.usage_limit !== null ? Number(row.usage_limit) : undefined,
        perUserLimit: row.per_user_limit !== null ? Number(row.per_user_limit) : 1,
        fundedBy: (row.funded_by || 'platform') as 'platform' | 'supplier',
        status: (row.status || 'active') as 'active' | 'inactive',
        createdAt: row.created_at,
      }));
    } catch {
      return [];
    }
  },

  async saveVoucher(voucher: Voucher): Promise<Voucher | null> {
    if (!isSupabaseConfigured || !supabase) return null;
    try {
      const payload = {
        code: voucher.code.trim().toUpperCase(),
        name: voucher.name.trim(),
        type: voucher.type,
        value: voucher.value,
        minimum_order: voucher.minimumOrder ?? 0,
        max_discount: voucher.maxDiscount ?? null,
        start_at: voucher.startAt,
        end_at: voucher.endAt,
        usage_limit: voucher.usageLimit ?? null,
        per_user_limit: voucher.perUserLimit ?? 1,
        funded_by: voucher.fundedBy || 'platform',
        status: voucher.status,
      };

      const { data, error } = await supabase
        .from('vouchers')
        .upsert(payload, { onConflict: 'code' })
        .select()
        .single();

      if (error || !data) return null;

      return {
        id: data.id,
        code: data.code,
        name: data.name,
        type: data.type,
        value: Number(data.value),
        minimumOrder: Number(data.minimum_order || 0),
        maxDiscount: data.max_discount !== null ? Number(data.max_discount) : undefined,
        startAt: data.start_at,
        endAt: data.end_at,
        usageLimit: data.usage_limit !== null ? Number(data.usage_limit) : undefined,
        perUserLimit: data.per_user_limit !== null ? Number(data.per_user_limit) : 1,
        fundedBy: data.funded_by || 'platform',
        status: data.status,
        createdAt: data.created_at,
      };
    } catch {
      return null;
    }
  },

  async getVoucherUsages(): Promise<VoucherUsage[]> {
    if (!isSupabaseConfigured || !supabase) return [];
    try {
      const { data, error } = await supabase
        .from('voucher_usages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !data) return [];

      return data.map((row: any) => ({
        id: row.id,
        voucherId: row.voucher_id,
        userId: row.user_id,
        orderId: row.order_id || undefined,
        discountAmount: Number(row.discount_amount),
        createdAt: row.created_at,
      }));
    } catch {
      return [];
    }
  },

  async recordVoucherUsage(usage: {
    voucherId: string;
    userId: string;
    orderId?: string;
    discountAmount: number;
  }): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;
    try {
      const { error } = await supabase.from('voucher_usages').insert({
        voucher_id: usage.voucherId,
        user_id: usage.userId,
        order_id: usage.orderId || null,
        discount_amount: usage.discountAmount,
      });
      return !error;
    } catch {
      return false;
    }
  },
};
