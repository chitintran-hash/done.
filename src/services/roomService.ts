import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { GroupRoom, GroupRoomStatus, PriceTier } from '../types';

export type JoinRoomRpcResult = {
  participant_count: number;
  total_quantity: number;
  old_price: number;
  new_price: number;
  price_unlocked: boolean;
  room_status: GroupRoomStatus;
  final_price?: number;
  participation_id: string;
};

export const roomService = {
  // Fetch all group rooms along with price tiers, product info, and supplier info
  async getRooms(): Promise<GroupRoom[]> {
    if (!isSupabaseConfigured) return [];

    try {
      const { data, error } = await supabase
        .from('group_rooms')
        .select(`
          *,
          products (*),
          suppliers (*),
          price_tiers (*)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching rooms:', error);
        return [];
      }

      return (data || []).map((row: any) => {
        const product = row.products;
        const supplier = row.suppliers;
        const rawTiers = row.price_tiers || [];

        const tiers: PriceTier[] = rawTiers
          .map((t: any) => ({
            minQuantity: Number(t.min_quantity),
            maxQuantity: t.max_quantity ? Number(t.max_quantity) : undefined,
            price: Number(t.price),
          }))
          .sort((a: PriceTier, b: PriceTier) => a.minQuantity - b.minQuantity);

        const initialPrice = tiers[0]?.price || 100000;

        return {
          id: row.id,
          productId: row.product_id,
          supplierId: row.supplier_id,
          productName: product?.name || 'Sản phẩm gom chung',
          category: product?.category || 'Chung',
          productImage: product?.image || '📦',
          unit: product?.unit || 'Hộp',
          supplierName: supplier?.business_name || 'Nhà cung cấp đối tác',
          participantCount: row.participant_count,
          totalQuantity: row.total_quantity,
          maxParticipants: row.max_participants,
          maxQuantity: row.max_quantity,
          priceTiers: tiers,
          initialPrice,
          startAt: row.start_at,
          endAt: row.end_at,
          finalPrice: row.final_price ? Number(row.final_price) : undefined,
          finalQuantity: row.final_quantity ? Number(row.final_quantity) : undefined,
          closedAt: row.closed_at,
          pickupPoint: row.pickup_point_name || row.pickup_point,
          pickupAddress: row.pickup_address || '',
          pickupPointId: row.pickup_point_id || undefined,
          pickupSlotId: row.pickup_slot_id || undefined,
          pickupPointName: row.pickup_point_name || row.pickup_point,
          pickupSlotSnapshot: row.pickup_slot_snapshot || undefined,
          shippingPerBuyerSnapshot: row.shipping_per_buyer_snapshot ? Number(row.shipping_per_buyer_snapshot) : undefined,
          normalShippingEstimate: row.normal_shipping_estimate ? Number(row.normal_shipping_estimate) : 20000,
          totalShippingFee: Number(row.total_shipping_fee || 0),
          distance: `${row.distance_meters || 450}m`,
          distanceMeters: row.distance_meters || 450,
          mapCoords: {
            x: 45 + (row.distance_meters ? (row.distance_meters % 30) : 10),
            y: 50 + (row.distance_meters ? (row.distance_meters % 25) : 15),
          },
          emoji: product?.image || '📦',
          description: product?.description || '',
          status: row.status as GroupRoomStatus,
        };
      });
    } catch (err) {
      console.error('getRooms failed:', err);
      return [];
    }
  },

  // Atomic Join Room Transaction RPC
  async joinRoomRpc(roomId: string, quantity: number): Promise<{ data: JoinRoomRpcResult | null; error?: string }> {
    if (!isSupabaseConfigured) {
      return { data: null, error: 'Chưa cấu hình Supabase' };
    }

    try {
      const { data, error } = await supabase.rpc('join_group_room', {
        p_room_id: roomId,
        p_quantity: quantity,
      });

      if (error) {
        return { data: null, error: error.message };
      }

      return { data: data as JoinRoomRpcResult };
    } catch (err: any) {
      return { data: null, error: err.message || 'Lỗi xử lý tham gia phòng gom.' };
    }
  },

  // Create new group room with tiers
  async createRoom(
    roomData: {
      productId: string;
      supplierId: string;
      maxParticipants: number;
      maxQuantity: number;
      totalShippingFee: number;
      pickupPoint: string;
      pickupAddress: string;
      pickupPointId?: string;
      pickupSlotId?: string;
      pickupPointName?: string;
      pickupSlotSnapshot?: string;
      startAt: string;
      endAt: string;
      distanceMeters?: number;
    },
    tiers: PriceTier[]
  ): Promise<{ room: GroupRoom | null; error?: string }> {
    if (!isSupabaseConfigured) return { room: null, error: 'Chưa cấu hình Supabase' };

    try {
      // 1. Insert room
      const { data: newRoom, error: roomError } = await supabase
        .from('group_rooms')
        .insert({
          product_id: roomData.productId,
          supplier_id: roomData.supplierId,
          participant_count: 0,
          total_quantity: 0,
          max_participants: roomData.maxParticipants,
          max_quantity: roomData.maxQuantity,
          total_shipping_fee: roomData.totalShippingFee,
          pickup_point: roomData.pickupPointName || roomData.pickupPoint,
          pickup_address: roomData.pickupAddress,
          pickup_point_id: roomData.pickupPointId || null,
          pickup_slot_id: roomData.pickupSlotId || null,
          pickup_point_name: roomData.pickupPointName || roomData.pickupPoint,
          pickup_slot_snapshot: roomData.pickupSlotSnapshot || null,
          start_at: roomData.startAt,
          end_at: roomData.endAt,
          status: 'active',
          distance_meters: roomData.distanceMeters || 450,
        })
        .select()
        .single();

      if (roomError || !newRoom) {
        return { room: null, error: roomError?.message || 'Không thể tạo phòng' };
      }

      // 2. Insert price tiers
      const tiersToInsert = tiers.map((t) => ({
        room_id: newRoom.id,
        min_quantity: t.minQuantity,
        max_quantity: t.maxQuantity,
        price: t.price,
      }));

      const { error: tierError } = await supabase
        .from('price_tiers')
        .insert(tiersToInsert);

      if (tierError) {
        console.error('Error inserting tiers:', tierError);
      }

      const rooms = await this.getRooms();
      const created = rooms.find((r) => r.id === newRoom.id) || null;
      return { room: created };
    } catch (err: any) {
      return { room: null, error: err.message };
    }
  },

  // Cancel room (supplier or admin)
  async cancelRoom(roomId: string): Promise<{ success: boolean; error?: string }> {
    if (!isSupabaseConfigured) return { success: false, error: 'Chưa cấu hình Supabase' };

    try {
      const { error } = await supabase
        .from('group_rooms')
        .update({ status: 'cancelled' })
        .eq('id', roomId);

      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  // Check and finalize expired rooms via server RPC
  async finalizeExpiredRoomsRpc(): Promise<number> {
    if (!isSupabaseConfigured) return 0;
    try {
      const { data, error } = await supabase.rpc('finalize_expired_rooms');
      if (error) {
        console.error('finalize_expired_rooms error:', error);
        return 0;
      }
      return Number(data || 0);
    } catch (err) {
      console.error('finalize_expired_rooms failed:', err);
      return 0;
    }
  },
};
