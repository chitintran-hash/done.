import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { Notification, NotificationType } from '../types';

export const notificationService = {
  async getUserNotifications(userId: string): Promise<Notification[]> {
    if (!isSupabaseConfigured) return [];

    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching notifications:', error);
        return [];
      }

      return (data || []).map((row) => ({
        id: row.id,
        userId: row.user_id,
        type: row.type as NotificationType,
        title: row.title,
        message: row.message,
        roomId: row.room_id,
        orderId: row.order_id,
        read: Boolean(row.read),
        createdAt: row.created_at,
      }));
    } catch (err) {
      console.error('getUserNotifications error:', err);
      return [];
    }
  },

  async markAsRead(notificationId: string): Promise<boolean> {
    if (!isSupabaseConfigured) return false;

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

      return !error;
    } catch (err) {
      return false;
    }
  },

  async markAllAsRead(userId: string): Promise<boolean> {
    if (!isSupabaseConfigured) return false;

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', userId)
        .eq('read', false);

      return !error;
    } catch (err) {
      return false;
    }
  },

  async createNotification(
    userId: string,
    type: NotificationType,
    title: string,
    message: string,
    roomId?: string,
    orderId?: string
  ): Promise<boolean> {
    if (!isSupabaseConfigured) return false;

    try {
      const { error } = await supabase.from('notifications').insert({
        user_id: userId,
        type,
        title,
        message,
        room_id: roomId,
        order_id: orderId,
        read: false,
      });

      return !error;
    } catch (err) {
      return false;
    }
  },
};
