import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { RealtimeChannel } from '@supabase/supabase-js';

export type RealtimeCallbacks = {
  onRoomChange?: (payload: any) => void;
  onOrderChange?: (payload: any) => void;
  onNotificationChange?: (payload: any) => void;
  onParticipationChange?: (payload: any) => void;
  onProductChange?: (payload: any) => void;
  onPayoutChange?: (payload: any) => void;
  onSettingsChange?: (payload: any) => void;
  onRoomEventChange?: (payload: any) => void;
  onGroupMessageChange?: (payload: any) => void;
  onMessageReactionChange?: (payload: any) => void;
  onReferralChange?: (payload: any) => void;
  onLoyaltyChange?: (payload: any) => void;
  onVoucherChange?: (payload: any) => void;
  onPickupPointChange?: (payload: any) => void;
  onPickupSlotChange?: (payload: any) => void;
  onDeliveryBatchChange?: (payload: any) => void;
  onDeliveryEventChange?: (payload: any) => void;
  onDeliveryIssueChange?: (payload: any) => void;
};

export function subscribeToRealtimeChanges(callbacks: RealtimeCallbacks, currentUserId?: string): RealtimeChannel | null {
  if (!isSupabaseConfigured || !supabase) {
    return null;
  }

  const channelName = `flashgroup-realtime-${currentUserId || 'global'}-${Date.now()}`;
  const channel = supabase.channel(channelName);

  // 1. Group Rooms changes (Buyer join, tier unlock, room finalize, cancellation)
  channel.on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'group_rooms' },
    (payload) => {
      console.log('⚡ Realtime group_rooms change:', payload);
      callbacks.onRoomChange?.(payload);
    }
  );

  // 2. Orders changes (Supplier workflow: preparing, in_transit, ready_for_pickup, picked_up + earnings update)
  channel.on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'orders' },
    (payload) => {
      console.log('⚡ Realtime orders change:', payload);
      callbacks.onOrderChange?.(payload);
    }
  );

  // 3. Notifications changes (Filtered by current user if provided)
  const notifFilter = currentUserId ? `user_id=eq.${currentUserId}` : undefined;
  channel.on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'notifications',
      filter: notifFilter,
    },
    (payload) => {
      console.log('⚡ Realtime notification change:', payload);
      callbacks.onNotificationChange?.(payload);
    }
  );

  // 4. Participations changes
  channel.on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'group_participations' },
    (payload) => {
      console.log('⚡ Realtime group_participations change:', payload);
      callbacks.onParticipationChange?.(payload);
    }
  );

  // 5. Products changes
  channel.on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'products' },
    (payload) => {
      console.log('⚡ Realtime products change:', payload);
      callbacks.onProductChange?.(payload);
    }
  );

  // 6. Supplier Payouts changes (Req 31: Realtime Supplier Payout page updates)
  channel.on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'supplier_payouts' },
    (payload) => {
      console.log('⚡ Realtime supplier_payouts change:', payload);
      callbacks.onPayoutChange?.(payload);
    }
  );

  // 7. Platform Settings changes (Commission rate updates)
  channel.on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'platform_settings' },
    (payload) => {
      console.log('⚡ Realtime platform_settings change:', payload);
      callbacks.onSettingsChange?.(payload);
    }
  );

  // 8. Room Events / Activity Feed changes (Req 14)
  channel.on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'room_events' },
    (payload) => {
      console.log('⚡ Realtime room_events change:', payload);
      callbacks.onRoomEventChange?.(payload);
    }
  );

  // 9. Group Chat Messages changes (Req 19)
  channel.on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'group_messages' },
    (payload) => {
      console.log('⚡ Realtime group_messages change:', payload);
      callbacks.onGroupMessageChange?.(payload);
    }
  );

  // 10. Message Reactions changes (Req 22, 23)
  channel.on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'message_reactions' },
    (payload) => {
      console.log('⚡ Realtime message_reactions change:', payload);
      callbacks.onMessageReactionChange?.(payload);
    }
  );

  // 11. Referrals changes
  channel.on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'referrals' },
    (payload) => {
      console.log('⚡ Realtime referrals change:', payload);
      callbacks.onReferralChange?.(payload);
    }
  );

  // 12. Loyalty Transactions changes
  channel.on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'loyalty_transactions' },
    (payload) => {
      console.log('⚡ Realtime loyalty_transactions change:', payload);
      callbacks.onLoyaltyChange?.(payload);
    }
  );

  // 13. Vouchers changes
  channel.on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'vouchers' },
    (payload) => {
      console.log('⚡ Realtime vouchers change:', payload);
      callbacks.onVoucherChange?.(payload);
    }
  );

  // 14. Pickup Points changes (Phase 7: capacity & status)
  channel.on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'pickup_points' },
    (payload) => {
      console.log('⚡ Realtime pickup_points change:', payload);
      callbacks.onPickupPointChange?.(payload);
    }
  );

  // 15. Pickup Slots changes (Phase 7)
  channel.on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'pickup_slots' },
    (payload) => {
      console.log('⚡ Realtime pickup_slots change:', payload);
      callbacks.onPickupSlotChange?.(payload);
    }
  );

  // 16. Delivery Batches changes (Phase 7: status transitions)
  channel.on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'delivery_batches' },
    (payload) => {
      console.log('⚡ Realtime delivery_batches change:', payload);
      callbacks.onDeliveryBatchChange?.(payload);
    }
  );

  // 17. Delivery Events changes (Phase 7: live timeline)
  channel.on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'delivery_events' },
    (payload) => {
      console.log('⚡ Realtime delivery_events change:', payload);
      callbacks.onDeliveryEventChange?.(payload);
    }
  );

  // 18. Delivery Issues changes (Phase 7)
  channel.on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'delivery_issues' },
    (payload) => {
      console.log('⚡ Realtime delivery_issues change:', payload);
      callbacks.onDeliveryIssueChange?.(payload);
    }
  );

  channel.subscribe((status) => {
    console.log(`📡 Supabase Realtime channel [${channelName}] status:`, status);
  });

  return channel;
}
