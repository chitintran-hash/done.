import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type {
  PickupPoint,
  PickupSlot,
  DeliveryBatch,
  DeliveryBatchStatus,
  DeliveryEvent,
  DeliveryIssue,
} from '../types';

export function mapPickupPointRow(row: Record<string, unknown>): PickupPoint {
  return {
    id: String(row.id),
    name: String(row.name || ''),
    type: (row.type as PickupPoint['type']) || 'locker',
    address: String(row.address || ''),
    latitude: row.latitude !== null && row.latitude !== undefined ? Number(row.latitude) : undefined,
    longitude: row.longitude !== null && row.longitude !== undefined ? Number(row.longitude) : undefined,
    capacity: Number(row.capacity ?? 50),
    currentLoad: Number(row.current_load ?? 0),
    operatingHours: String(row.operating_hours || '07:00 – 22:00'),
    contactInfo: row.contact_info ? String(row.contact_info) : undefined,
    instructions: row.instructions ? String(row.instructions) : undefined,
    status: (row.status as PickupPoint['status']) || 'active',
    isDemo: Boolean(row.is_demo ?? true),
    distance: row.distance ? String(row.distance) : '350m',
    distanceMeters: row.distance_meters ? Number(row.distance_meters) : 350,
    createdAt: row.created_at ? String(row.created_at) : undefined,
  };
}

export function mapPickupSlotRow(row: Record<string, unknown>): PickupSlot {
  return {
    id: String(row.id),
    pickupPointId: String(row.pickup_point_id || ''),
    date: String(row.slot_date || ''),
    startTime: String(row.start_time || '18:00'),
    endTime: String(row.end_time || '21:00'),
    capacity: Number(row.capacity ?? 25),
    reservedCount: Number(row.reserved_count ?? 0),
    status: (row.status as PickupSlot['status']) || 'available',
    createdAt: row.created_at ? String(row.created_at) : undefined,
  };
}

export function mapDeliveryBatchRow(row: Record<string, unknown>): DeliveryBatch {
  return {
    id: String(row.id),
    roomId: String(row.room_id || ''),
    supplierId: String(row.supplier_id || ''),
    pickupPointId: String(row.pickup_point_id || ''),
    pickupSlotId: row.pickup_slot_id ? String(row.pickup_slot_id) : undefined,
    pickupPointName: row.pickup_point_name ? String(row.pickup_point_name) : undefined,
    pickupAddress: row.pickup_address ? String(row.pickup_address) : undefined,
    pickupWindow: row.pickup_window ? String(row.pickup_window) : undefined,
    totalOrders: Number(row.total_orders ?? 0),
    totalUnits: Number(row.total_units ?? 0),
    totalShippingFee: Number(row.total_shipping_fee ?? 0),
    shippingPerBuyer: Number(row.shipping_per_buyer ?? 0),
    status: (row.status as DeliveryBatchStatus) || 'planned',
    carrierName: String(row.carrier_name || 'FlashGroup Local Van (Simulated)'),
    trackingNote: row.tracking_note ? String(row.tracking_note) : undefined,
    dispatchedAt: row.dispatched_at ? String(row.dispatched_at) : undefined,
    arrivedAt: row.arrived_at ? String(row.arrived_at) : undefined,
    completedAt: row.completed_at ? String(row.completed_at) : undefined,
    createdAt: String(row.created_at || new Date().toISOString()),
  };
}

export function mapDeliveryEventRow(row: Record<string, unknown>): DeliveryEvent {
  return {
    id: String(row.id),
    batchId: String(row.batch_id || ''),
    status: String(row.status || ''),
    title: String(row.title || ''),
    description: row.description ? String(row.description) : undefined,
    createdAt: String(row.created_at || new Date().toISOString()),
  };
}

export function mapDeliveryIssueRow(row: Record<string, unknown>): DeliveryIssue {
  return {
    id: String(row.id),
    batchId: String(row.batch_id || ''),
    reportedBy: row.reported_by ? String(row.reported_by) : undefined,
    issueType: (row.issue_type as DeliveryIssue['issueType']) || 'Other',
    note: row.note ? String(row.note) : undefined,
    status: (row.status as DeliveryIssue['status']) || 'open',
    createdAt: String(row.created_at || new Date().toISOString()),
  };
}

export async function fetchPickupPointsFromDb(): Promise<PickupPoint[] | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    const { data, error } = await supabase
      .from('pickup_points')
      .select('*')
      .order('created_at', { ascending: true });
    if (error || !data) return null;
    return data.map(mapPickupPointRow);
  } catch {
    return null;
  }
}

export async function fetchPickupSlotsFromDb(): Promise<PickupSlot[] | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    const { data, error } = await supabase
      .from('pickup_slots')
      .select('*')
      .order('slot_date', { ascending: true });
    if (error || !data) return null;
    return data.map(mapPickupSlotRow);
  } catch {
    return null;
  }
}

export async function fetchDeliveryBatchesFromDb(): Promise<DeliveryBatch[] | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    const { data, error } = await supabase
      .from('delivery_batches')
      .select('*')
      .order('created_at', { ascending: false });
    if (error || !data) return null;
    return data.map(mapDeliveryBatchRow);
  } catch {
    return null;
  }
}

export async function fetchDeliveryEventsFromDb(): Promise<DeliveryEvent[] | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    const { data, error } = await supabase
      .from('delivery_events')
      .select('*')
      .order('created_at', { ascending: true });
    if (error || !data) return null;
    return data.map(mapDeliveryEventRow);
  } catch {
    return null;
  }
}

export async function fetchDeliveryIssuesFromDb(): Promise<DeliveryIssue[] | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    const { data, error } = await supabase
      .from('delivery_issues')
      .select('*')
      .order('created_at', { ascending: false });
    if (error || !data) return null;
    return data.map(mapDeliveryIssueRow);
  } catch {
    return null;
  }
}

export async function upsertPickupPointInDb(point: PickupPoint): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    await supabase.from('pickup_points').upsert({
      id: point.id,
      name: point.name,
      type: point.type,
      address: point.address,
      latitude: point.latitude ?? null,
      longitude: point.longitude ?? null,
      capacity: point.capacity,
      current_load: point.currentLoad,
      operating_hours: point.operatingHours,
      contact_info: point.contactInfo ?? null,
      instructions: point.instructions ?? null,
      status: point.status,
      is_demo: point.isDemo,
    });
  } catch {
    // Fallback to local state if DB table is not migrated yet
  }
}

export async function upsertPickupSlotInDb(slot: PickupSlot): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    await supabase.from('pickup_slots').upsert({
      id: slot.id,
      pickup_point_id: slot.pickupPointId,
      slot_date: slot.date,
      start_time: slot.startTime,
      end_time: slot.endTime,
      capacity: slot.capacity,
      reserved_count: slot.reservedCount,
      status: slot.status,
    });
  } catch {
    // Fallback to local state
  }
}

export async function createDeliveryBatchViaRpc(roomId: string): Promise<string | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    const { data, error } = await supabase.rpc('create_delivery_batch', {
      p_room_id: roomId,
    });
    if (error || !data) return null;
    return String(data);
  } catch {
    return null;
  }
}

export async function advanceDeliveryStatusViaRpc(
  batchId: string,
  nextStatus: DeliveryBatchStatus,
  title: string,
  description?: string
): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false;
  try {
    if (nextStatus === 'arrived_at_pickup') {
      const { error } = await supabase.rpc('mark_batch_arrived', {
        p_batch_id: batchId,
        p_note: description || null,
      });
      return !error;
    }
    const { error } = await supabase.rpc('advance_delivery_status', {
      p_batch_id: batchId,
      p_next_status: nextStatus,
      p_title: title,
      p_description: description || null,
    });
    return !error;
  } catch {
    return false;
  }
}

export async function confirmPickupViaRpc(
  pickupCode: string,
  pickupPointId?: string
): Promise<Record<string, unknown> | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    const { data, error } = await supabase.rpc('confirm_pickup', {
      p_pickup_code: pickupCode,
      p_pickup_point_id: pickupPointId || null,
    });
    if (error || !data) return null;
    return data as Record<string, unknown>;
  } catch {
    return null;
  }
}

export async function insertDeliveryIssueInDb(issue: DeliveryIssue): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    await supabase.from('delivery_issues').insert({
      batch_id: issue.batchId,
      issue_type: issue.issueType,
      note: issue.note ?? null,
      status: issue.status,
    });
  } catch {
    // Fallback to local state
  }
}
