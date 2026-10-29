import type {
  PriceTier,
  GroupRoom,
  GroupParticipation,
  Order,
  Supplier,
  SupplierPayout,
  Voucher,
  VoucherUsage,
  VoucherFundedBy,
  LoyaltyTransaction,
  PickupPoint,
  PickupSlot,
  DeliveryBatchStatus,
  ComplaintCase,
} from '../types';

export const DEFAULT_PLATFORM_COMMISSION_RATE = 0.07;
// Req 19: Normal prototype promotion engine caps effective promotional discount at 50% (NĐ 81/2018/NĐ-CP)
export const MAX_NORMAL_PROMOTION_DISCOUNT_RATE = 0.5;

export const FLASHGROUP_V3_KEYS = [
  'flashgroup_v3_users',
  'flashgroup_v3_current_user',
  'flashgroup_v3_suppliers',
  'flashgroup_v3_products',
  'flashgroup_v3_rooms',
  'flashgroup_v3_participations',
  'flashgroup_v3_orders',
  'flashgroup_v3_notifications',
  'flashgroup_v3_reviews',
  'flashgroup_v3_refunds',
  'flashgroup_v3_favorites',
  'flashgroup_v3_payouts',
  'flashgroup_v3_commission_rate',
  'flashgroup_v3_referrals',
  'flashgroup_v3_room_events',
  'flashgroup_v3_group_messages',
  'flashgroup_v3_message_reactions',
  'flashgroup_v3_loyalty_transactions',
  'flashgroup_v3_vouchers',
  'flashgroup_v3_voucher_usages',
  'flashgroup_v3_pending_ref',
  'flashgroup_v3_pickup_points',
  'flashgroup_v3_pickup_slots',
  'flashgroup_v3_delivery_batches',
  'flashgroup_v3_delivery_events',
  'flashgroup_v3_delivery_issues',
  // Phase 8 Compliance & Privacy storage keys
  'flashgroup_v3_verification_documents',
  'flashgroup_v3_consent_records',
  'flashgroup_v3_privacy_requests',
  'flashgroup_v3_complaint_cases',
  'flashgroup_v3_complaint_messages',
  'flashgroup_v3_product_reports',
  'flashgroup_v3_moderation_actions',
  'flashgroup_v3_transaction_snapshots',
  'flashgroup_v3_audit_events',
  'flashgroup_v3_legal_documents',
  'flashgroup_v3_compliance_checklist',
];

// Retain alias for backwards compatibility if needed
export const FLASHGROUP_KEYS = FLASHGROUP_V3_KEYS;

export function safeParseStorage<T>(
  key: string,
  fallback: T
): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function getCurrentPrice(
  totalQuantity: number,
  tiers: PriceTier[]
): number {
  if (!tiers || tiers.length === 0) return 0;
  const sorted = [...tiers].sort(
    (a, b) => b.minQuantity - a.minQuantity
  );

  const tier = sorted.find(
    t => totalQuantity >= t.minQuantity
  );

  return tier?.price ?? tiers[0].price;
}

export function getNextTier(
  totalQuantity: number,
  tiers: PriceTier[]
) {
  if (!tiers || tiers.length === 0) return null;
  const sorted = [...tiers].sort(
    (a, b) => a.minQuantity - b.minQuantity
  );

  const currentPrice = getCurrentPrice(
    totalQuantity,
    tiers
  );

  const next = sorted.find(
    tier => tier.minQuantity > totalQuantity
  );

  if (!next) return null;

  return {
    nextPrice: next.price,
    requiredQuantity:
      next.minQuantity - totalQuantity,
    savingPerUnit:
      currentPrice - next.price
  };
}

export function getSharedShipping(
  totalShippingFee: number,
  participantCount: number
): number {
  if (participantCount <= 0) {
    return totalShippingFee;
  }

  // Requirement 15: shippingPerBuyer = Math.ceil(totalShippingCost / participantCount)
  return Math.ceil(
    totalShippingFee / participantCount
  );
}

// ==========================================
// PHASE 5 & PHASE 6: FINANCIAL & VOUCHER FORMULAS
// (Req 1, 2, 3, 20, 23, 24 & Phase 6 Req 34, 35, 36, 37, 38)
// ==========================================
export function calculateVoucherDiscount(
  voucher: Voucher | null | undefined,
  productSubtotal: number
): number {
  if (!voucher || productSubtotal <= 0) return 0;

  let discount = 0;
  if (voucher.type === 'fixed') {
    discount = Math.min(voucher.value, productSubtotal);
  } else {
    // Support both 0.05 (5%) and 5 (5%) input conventions safely
    const pct = voucher.value > 1 ? voucher.value / 100 : voucher.value;
    discount = Math.round(productSubtotal * pct);
    if (voucher.maxDiscount !== undefined && voucher.maxDiscount !== null && voucher.maxDiscount > 0) {
      discount = Math.min(discount, voucher.maxDiscount);
    }
    discount = Math.min(discount, productSubtotal);
  }

  // Req 19: Cap normal promotional discount at 50% of eligible product price unless special_promotion_regime is enabled
  if (!voucher.specialPromotionRegime) {
    const legalCap = Math.floor(productSubtotal * MAX_NORMAL_PROMOTION_DISCOUNT_RATE);
    discount = Math.min(discount, legalCap);
  }

  return Math.max(0, Math.round(discount));
}

// Req 19: Validate voucher creation against 50% normal promotion cap
export function validateVoucherPromotionCap(params: {
  type: 'fixed' | 'percentage';
  value: number;
  minimumOrder?: number;
  specialPromotionRegime?: boolean;
}): { allowed: boolean; error?: string } {
  if (params.specialPromotionRegime) {
    return {
      allowed: false,
      error:
        'Chế độ khuyến mại tập trung / đặc biệt (special_promotion_regime) đang tắt trong prototype do chưa có văn bản chấp thuận/căn cứ pháp lý riêng.',
    };
  }

  if (params.type === 'percentage') {
    const pct = params.value > 1 ? params.value / 100 : params.value;
    if (pct > MAX_NORMAL_PROMOTION_DISCOUNT_RATE) {
      return {
        allowed: false,
        error:
          'Vi phạm giới hạn khuyến mại thông thường (Nghị định 81/2018/NĐ-CP): Mức giảm giá không được vượt quá 50% giá trị hàng hóa/dịch vụ.',
      };
    }
  } else if (params.type === 'fixed') {
    const minOrder = Number(params.minimumOrder || 0);
    if (minOrder <= 0 || params.value > minOrder * MAX_NORMAL_PROMOTION_DISCOUNT_RATE) {
      return {
        allowed: false,
        error: `Vi phạm giới hạn khuyến mại 50% (Nghị định 81/2018/NĐ-CP): Voucher giảm tiền cố định ${formatVND(params.value)} bắt buộc phải có Đơn tối thiểu từ ${formatVND(params.value * 2)} trở lên để mức giảm không vượt 50%.`,
      };
    }
  }

  return { allowed: true };
}

export function validateVoucher(
  code: string,
  productSubtotal: number,
  userId: string,
  vouchers: Voucher[],
  voucherUsages: VoucherUsage[],
  nowMs: number = Date.now()
): { valid: boolean; voucher?: Voucher; discountAmount: number; error?: string } {
  const normalized = code.trim().toUpperCase();
  if (!normalized) {
    return { valid: false, discountAmount: 0, error: 'Vui lòng nhập mã voucher.' };
  }

  const found = vouchers.find((v) => v.code.toUpperCase() === normalized);
  if (!found) {
    return { valid: false, discountAmount: 0, error: 'Mã ưu đãi không tồn tại.' };
  }

  if (found.status !== 'active') {
    return { valid: false, discountAmount: 0, error: 'Mã ưu đãi hiện đang tạm ngưng hoạt động.' };
  }

  const startMs = new Date(found.startAt).getTime();
  const endMs = new Date(found.endAt).getTime();
  if (nowMs < startMs) {
    return { valid: false, discountAmount: 0, error: 'Mã ưu đãi chưa đến thời gian áp dụng.' };
  }
  if (nowMs > endMs) {
    return { valid: false, discountAmount: 0, error: 'Mã ưu đãi đã hết hạn sử dụng.' };
  }

  if (found.minimumOrder && productSubtotal < found.minimumOrder) {
    return {
      valid: false,
      discountAmount: 0,
      error: `Đơn hàng tối thiểu ${formatVND(found.minimumOrder)} để áp dụng mã ${found.code}.`,
    };
  }

  const totalUsed = voucherUsages.filter((u) => u.voucherId === found.id).length;
  if (found.usageLimit !== undefined && found.usageLimit !== null && totalUsed >= found.usageLimit) {
    return { valid: false, discountAmount: 0, error: 'Mã ưu đãi đã hết lượt sử dụng.' };
  }

  const userUsed = voucherUsages.filter((u) => u.voucherId === found.id && u.userId === userId).length;
  const perUserLimit = found.perUserLimit ?? 1;
  if (userUsed >= perUserLimit) {
    return {
      valid: false,
      discountAmount: 0,
      error: `Bạn đã dùng hết lượt áp dụng mã ${found.code} (${perUserLimit} lần/tài khoản).`,
    };
  }

  const discountAmount = calculateVoucherDiscount(found, productSubtotal);
  return { valid: true, voucher: found, discountAmount };
}

export function calculateOrderFinancials(
  finalUnitPrice: number,
  quantity: number,
  totalShippingFee: number,
  participantCount: number,
  commissionRate: number = DEFAULT_PLATFORM_COMMISSION_RATE,
  voucherDiscount: number = 0,
  voucherFundedBy: VoucherFundedBy = 'platform'
) {
  const productSubtotal = finalUnitPrice * quantity;
  const shippingFee = getSharedShipping(totalShippingFee, participantCount);
  const safeVoucherDiscount = Math.min(Math.max(0, Math.round(voucherDiscount)), productSubtotal);

  // Req 35: Commission applies to product amount AFTER voucher discount
  const commissionableAmount = Math.max(0, productSubtotal - safeVoucherDiscount);
  const platformCommission = Math.round(commissionableAmount * commissionRate);

  // Req 36: Buyer total = productSubtotal - voucherDiscount + shippingFee
  const buyerTotal = productSubtotal - safeVoucherDiscount + shippingFee;

  // Req 37 & 38: If platform-funded voucher, Supplier Gross = original product subtotal
  const supplierGross =
    voucherFundedBy === 'supplier' ? productSubtotal - safeVoucherDiscount : productSubtotal;
  const supplierNet = supplierGross - platformCommission;

  // Req 38: Platform Net Revenue after marketing voucher subsidy
  const platformNetAfterVoucher =
    voucherFundedBy === 'platform' ? platformCommission - safeVoucherDiscount : platformCommission;

  return {
    productSubtotal,
    shippingFee,
    voucherDiscount: safeVoucherDiscount,
    voucherFundedBy,
    commissionableAmount,
    buyerTotal,
    commissionRate,
    platformCommission,
    platformNetAfterVoucher,
    supplierGross,
    supplierNet,
  };
}

export function getOrderFinancialSnapshot(order: Order) {
  const rate =
    order.commissionRate !== undefined && order.commissionRate !== null
      ? Number(order.commissionRate)
      : DEFAULT_PLATFORM_COMMISSION_RATE;

  const voucherDiscount = Number(order.voucherDiscount || 0);
  const voucherFundedBy: VoucherFundedBy = order.voucherFundedBy || 'platform';

  const rawGross =
    order.supplierGross !== undefined && order.supplierGross !== null && order.supplierGross > 0
      ? Number(order.supplierGross)
      : voucherFundedBy === 'supplier'
      ? Math.max(0, Number(order.productSubtotal) - voucherDiscount)
      : Number(order.productSubtotal);

  const commissionableAmount = Math.max(0, Number(order.productSubtotal) - voucherDiscount);

  const rawCommission =
    order.platformCommission !== undefined && order.platformCommission !== null && order.platformCommission > 0
      ? Number(order.platformCommission)
      : Math.round(commissionableAmount * rate);

  const rawNet =
    order.supplierNet !== undefined && order.supplierNet !== null && order.supplierNet > 0
      ? Number(order.supplierNet)
      : rawGross - rawCommission;

  const rawPlatformNetAfterVoucher =
    voucherFundedBy === 'platform' ? rawCommission - voucherDiscount : rawCommission;

  const isReversed = order.status === 'cancelled' || order.status === 'refunded';

  return {
    commissionRate: rate,
    voucherDiscount,
    voucherFundedBy,
    rawGross,
    rawCommission,
    rawNet,
    rawPlatformNetAfterVoucher,
    // Effective values accounting for cancelled/refunded status (Req 23 & 24)
    effectiveGross: isReversed ? 0 : rawGross,
    effectiveCommission: isReversed ? 0 : rawCommission,
    effectiveNet: isReversed ? 0 : rawNet,
    effectiveVoucherCost: isReversed ? 0 : voucherFundedBy === 'platform' ? voucherDiscount : 0,
    effectivePlatformNetAfterVoucher: isReversed ? 0 : rawPlatformNetAfterVoucher,
    isReversed,
  };
}

export type OrderEarningClassification =
  | 'pending'
  | 'available'
  | 'in_payout_request'
  | 'paid_out'
  | 'reversed'
  | 'unpaid';

export function classifyOrderEarningStatus(
  order: Order,
  payouts: SupplierPayout[]
): OrderEarningClassification {
  if (order.status === 'cancelled' || order.status === 'refunded') {
    return 'reversed';
  }
  if (order.status === 'awaiting_payment') {
    return 'unpaid';
  }

  // Check if order is already in a paid payout
  const paidPayout = payouts.find(
    (p) => p.status === 'paid' && p.orderIds.includes(order.id)
  );
  if (paidPayout) {
    return 'paid_out';
  }

  // Check if order is in a pending or approved payout request (Req 11: protect against double payout)
  const activePayout = payouts.find(
    (p) => (p.status === 'pending' || p.status === 'approved') && p.orderIds.includes(order.id)
  );
  if (activePayout) {
    return 'in_payout_request';
  }

  // Req 6 & 8: Available ONLY when status is picked_up and not already included in a payout
  if (order.status === 'picked_up') {
    return 'available';
  }

  // Req 8: Pending when paid, preparing, in_transit, ready_for_pickup
  return 'pending';
}

export function getRemainingSeconds(
  endAt: string
): number {
  const remaining =
    new Date(endAt).getTime() -
    Date.now();

  return Math.max(
    0,
    Math.floor(remaining / 1000)
  );
}

export function canCheckout(
  room: GroupRoom,
  participation?: GroupParticipation
): boolean {
  if (!participation) return false;
  if (room.finalPrice === undefined) return false;
  if (room.status !== 'successful') return false;
  if (participation.status === 'paid') return false;
  return true;
}

export function formatVND(amount: number): string {
  return new Intl.NumberFormat('vi-VN').format(Math.round(amount || 0)) + 'đ';
}

export function formatTime(secs: number): string {
  if (secs <= 0) return '00:00';
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

// ==========================================
// PHASE 6: SOCIAL, SHARE URL & LOYALTY HELPERS
// ==========================================

// Req 28: Calculate loyalty balance strictly from sum(points)
export function calculateLoyaltyBalance(
  transactions: LoyaltyTransaction[],
  userId: string
): number {
  return transactions
    .filter((t) => t.userId === userId)
    .reduce((sum, t) => sum + Number(t.points || 0), 0);
}

// Req 11 & 20: Mask full name to display first name / safe masked name only
export function getSafeFirstName(fullName?: string): string {
  if (!fullName || !fullName.trim()) return 'Thành viên';
  const cleaned = fullName.replace(/–\s*Demo/gi, '').trim();
  const parts = cleaned.split(/\s+/);
  if (parts.length <= 2) return cleaned;
  return parts.slice(-2).join(' ');
}

// Req 2, 3, 47: Generate Shareable Room URL using window.location.origin
export function getRoomShareUrl(roomId: string, referrerUserId?: string): string {
  const origin =
    typeof window !== 'undefined' && window.location?.origin
      ? window.location.origin
      : '';
  const basePath = `${origin}/room/${encodeURIComponent(roomId)}`;
  if (referrerUserId) {
    return `${basePath}?ref=${encodeURIComponent(referrerUserId)}`;
  }
  return basePath;
}

// Req 46: Generic personal referral link
export function getPersonalReferralUrl(referrerUserId: string): string {
  const origin =
    typeof window !== 'undefined' && window.location?.origin
      ? window.location.origin
      : '';
  return `${origin}/register?ref=${encodeURIComponent(referrerUserId)}`;
}

// Req 5: Generate friendly Vietnamese share message (no "cheapest"/"best price" claims)
export function generateRoomShareMessage(
  room: GroupRoom,
  shareUrl: string
): string {
  const currentPrice = room.finalPrice ?? getCurrentPrice(room.totalQuantity, room.priceTiers);
  const nextTier = getNextTier(room.totalQuantity, room.priceTiers);

  if (nextTier) {
    return `Mình đang gom ${room.productName} trên FlashGroup ${room.emoji}\n\nHiện có ${room.totalQuantity}/${room.maxQuantity} sản phẩm.\n\nChỉ cần thêm ${nextTier.requiredQuantity} đơn nữa là cả nhóm được giảm từ ${formatVND(currentPrice)} xuống ${formatVND(nextTier.nextPrice)}.\n\nTham gia cùng mình:\n${shareUrl}`;
  }

  return `Mình đang gom ${room.productName} trên FlashGroup ${room.emoji}\n\nHiện có ${room.totalQuantity}/${room.maxQuantity} sản phẩm với mức giá nhóm ${formatVND(currentPrice)} tại ${room.pickupPoint}.\n\nTham gia cùng mình:\n${shareUrl}`;
}

// Relative time formatter for Activity Feed & Chat
export function formatRelativeTime(isoString: string, nowMs: number = Date.now()): string {
  const diffSec = Math.max(0, Math.floor((nowMs - new Date(isoString).getTime()) / 1000));
  if (diffSec < 30) return 'Vừa xong';
  if (diffSec < 60) return `${diffSec} giây trước`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} phút trước`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr} giờ trước`;
  const diffDay = Math.floor(diffHr / 24);
  return `${diffDay} ngày trước`;
}

// ==========================================
// PHASE 7: HYPERLOCAL LOGISTICS HELPERS
// ==========================================

export function formatCurrency(amount: number): string {
  return `${Math.round(amount || 0).toLocaleString('vi-VN')}đ`;
}

// Req 35: Simple heuristic recommendation score (distanceWeight + capacityWeight + activeRoomWeight)
export function calculatePickupPointScore(
  point: PickupPoint,
  roomsOrActiveCount: GroupRoom[] | number = []
): number {
  const distMeters = point.distanceMeters ?? point.demoDistanceMeters ?? 500;
  // Closer distance -> higher weight (0 to 40)
  const distanceWeight = Math.max(5, Math.round(40 - distMeters / 40));

  // More free capacity -> higher weight (0 to 40)
  const availableCapacity = Math.max(0, point.capacity - point.currentLoad);
  const freeRatio = point.capacity > 0 ? availableCapacity / point.capacity : 0;
  const capacityWeight = Math.round(freeRatio * 40);

  // Active group rooms at this pickup point -> community momentum weight (0 to 20)
  const activeRoomCount =
    typeof roomsOrActiveCount === 'number'
      ? roomsOrActiveCount
      : roomsOrActiveCount.filter(
          (r) =>
            r.status === 'active' &&
            (r.pickupPointId === point.id || r.pickupPoint === point.name)
        ).length;
  const activeRoomWeight = Math.min(20, activeRoomCount * 7);

  return point.status === 'active' && availableCapacity > 0
    ? distanceWeight + capacityWeight + activeRoomWeight
    : 0;
}

// Req 31: Format Pickup Slot window (e.g. "26 Oct • 18:00 – 21:00")
export function formatPickupSlotWindow(slot?: PickupSlot | null): string {
  if (!slot) return '18:00 – 21:00 (Hôm nay)';
  try {
    const dt = new Date(slot.date);
    const dayStr = isNaN(dt.getTime())
      ? slot.date
      : dt.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
    const start = slot.startTime.slice(0, 5);
    const end = slot.endTime.slice(0, 5);
    return `${dayStr} • ${start} – ${end}`;
  } catch {
    return `${slot.date} • ${slot.startTime.slice(0, 5)} – ${slot.endTime.slice(0, 5)}`;
  }
}

// Req 46 & 47: Mask buyer name for Batch Order List ("Nguyễn Minh Anh" -> "Minh A.")
export function getMaskedBuyerName(fullName?: string): string {
  if (!fullName || !fullName.trim()) return 'Khách M.';
  const parts = fullName.replace(/–\s*Demo/gi, '').trim().split(/\s+/);
  if (parts.length === 1) return parts[0];
  const last = parts[parts.length - 1];
  const prev = parts[parts.length - 2];
  return `${prev} ${last.charAt(0).toUpperCase()}.`;
}

// Req 25: Unique Pickup Code generator (e.g. "FG-A92K")
export function generateUniquePickupCode(existingCodes: string[] = []): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const existingSet = new Set(existingCodes.map((c) => c.toUpperCase()));
  for (let attempt = 0; attempt < 50; attempt++) {
    let suffix = '';
    for (let i = 0; i < 4; i++) {
      suffix += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const candidate = `FG-${suffix}`;
    if (!existingSet.has(candidate)) {
      return candidate;
    }
  }
  return `FG-${Math.floor(1000 + Math.random() * 9000)}`;
}

// Req 17 & 53: Sequential Delivery Status Validation (block planned -> completed directly)
export const DELIVERY_STATUS_ORDER: DeliveryBatchStatus[] = [
  'planned',
  'confirmed',
  'picked_up_from_supplier',
  'in_transit',
  'arrived_at_pickup',
  'completed',
];

export function canTransitionBatchStatus(
  current: DeliveryBatchStatus,
  next: DeliveryBatchStatus
): boolean {
  if (current === next) return false;
  if (next === 'cancelled' || next === 'delivery_issue') return current !== 'completed';
  // Never allow jumping directly from planned to completed (Req 53)
  if (current === 'planned' && next === 'completed') return false;
  if (current === 'delivery_issue') {
    return next === 'in_transit' || next === 'arrived_at_pickup';
  }
  const currIdx = DELIVERY_STATUS_ORDER.indexOf(current);
  const nextIdx = DELIVERY_STATUS_ORDER.indexOf(next);
  if (currIdx === -1 || nextIdx === -1) return false;
  // Allow advancing 1 step (or Supplier/Admin moving confirmed/picked_up -> in_transit -> arrived_at_pickup)
  return nextIdx > currIdx;
}

// ==========================================
// PHASE 8: LEGAL TRANSPARENCY & COMPLIANCE HELPERS
// ==========================================

// Req 8: Calculate acknowledgement deadline as 3 working days (excluding Saturday & Sunday)
export function calculateWorkingDaysDeadline(
  submittedAtIso: string,
  workingDays: number = 3
): string {
  const start = new Date(submittedAtIso);
  const cursor = new Date(isNaN(start.getTime()) ? Date.now() : start.getTime());
  let added = 0;

  while (added < workingDays) {
    cursor.setDate(cursor.getDate() + 1);
    const dayOfWeek = cursor.getDay(); // 0 = Sun, 6 = Sat
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      added += 1;
    }
  }

  return cursor.toISOString();
}

// Req 8 & 29: Check if a complaint is at SLA risk (unacknowledged and within 24h of deadline or overdue)
export function isComplaintSlaRisk(complaint: ComplaintCase, nowMs: number = Date.now()): boolean {
  if (complaint.status === 'resolved' || complaint.status === 'rejected') return false;
  if (complaint.acknowledgedAt && complaint.status !== 'submitted') return false;
  const deadlineMs = new Date(complaint.acknowledgementDeadline).getTime();
  return deadlineMs - nowMs <= 24 * 3600 * 1000;
}

// Req 1 & 2: Seller Verification badge & status label helper
export function getSupplierVerificationDisplay(supplier?: Supplier | null): {
  statusLabel: string;
  buyerBadgeLabel: string;
  isAdminVerified: boolean;
  isDemoSupplier: boolean;
  badgeColor: string;
} {
  if (!supplier) {
    return {
      statusLabel: 'Chưa xác minh',
      buyerBadgeLabel: 'Dữ liệu mô phỏng',
      isAdminVerified: false,
      isDemoSupplier: true,
      badgeColor: 'bg-slate-100 text-slate-700 border-slate-300',
    };
  }

  const statusMap: Record<Supplier['verificationStatus'], string> = {
    unverified: 'Chưa xác minh (unverified)',
    pending: 'Đang chờ duyệt (pending)',
    identity_verified: 'Đã xác minh danh tính (identity_verified)',
    business_verified: 'Đã xác minh ĐKKD/MST (business_verified)',
    document_verified: 'Đã xác minh hồ sơ ngành hàng (document_verified)',
    verified: 'Đã duyệt xác minh nội bộ (verified)',
    rejected: 'Bị từ chối xác minh (rejected)',
    suspended: 'Tạm ngưng hoạt động (suspended)',
  };

  const isAdminApproved =
    Boolean(supplier.verifiedBy && supplier.verifiedAt) &&
    (supplier.verificationStatus === 'identity_verified' ||
      supplier.verificationStatus === 'business_verified' ||
      supplier.verificationStatus === 'document_verified' ||
      supplier.verificationStatus === 'verified');

  // Req 1: Buyer-facing badge must only show "Đã xác minh" after Admin has actually approved the verification record.
  // For demo suppliers show "Dữ liệu mô phỏng" (never fake government verification).
  let buyerBadgeLabel = supplier.isDemo ? 'Dữ liệu mô phỏng' : 'Chưa xác minh';
  let badgeColor = 'bg-slate-100 text-slate-700 border-slate-300';

  if (supplier.verificationStatus === 'suspended') {
    buyerBadgeLabel = 'Tạm ngưng hoạt động';
    badgeColor = 'bg-rose-100 text-rose-800 border-rose-300';
  } else if (isAdminApproved) {
    buyerBadgeLabel = supplier.isDemo ? 'Đã xác minh • Dữ liệu mô phỏng' : 'Đã xác minh';
    badgeColor = 'bg-[#F4FFE8] text-emerald-800 border-[#D0FFA4]';
  } else if (supplier.isDemo) {
    buyerBadgeLabel = 'Dữ liệu mô phỏng';
    badgeColor = 'bg-amber-50 text-amber-800 border-amber-200';
  }

  return {
    statusLabel: statusMap[supplier.verificationStatus] || supplier.verificationStatus,
    buyerBadgeLabel,
    isAdminVerified: isAdminApproved,
    isDemoSupplier: Boolean(supplier.isDemo),
    badgeColor,
  };
}

// Req 13: Ranking transparency explanation ("Vì sao tôi thấy sản phẩm này?")
export function getRankingExplanation(
  room: GroupRoom,
  sortBy: string = 'ending_soon',
  selectedCategory: string = 'Tất cả'
): { summary: string; factors: string[] } {
  const factors: string[] = [];

  if (room.isSponsored) {
    factors.push('Được tài trợ: Phòng gom có gắn nhãn ưu tiên hiển thị có tài trợ (Sponsored).');
  }
  if (selectedCategory !== 'Tất cả' && room.category === selectedCategory) {
    factors.push(`Khớp danh mục (Category match): Thuộc ngành hàng "${room.category}" bạn đang chọn.`);
  }
  factors.push(
    `Khoảng cách địa lý (Distance): Cách điểm nhận khu vực của bạn khoảng ${room.distance} (${room.pickupPoint}).`
  );

  if (sortBy === 'ending_soon') {
    factors.push('Sắp kết thúc (Ending soon): Sắp xếp theo thời hạn đóng phòng gom gần nhất.');
  } else if (sortBy === 'popular' || room.participantCount >= 10) {
    factors.push(
      `Độ phổ biến (Popularity): Đang có ${room.participantCount} thành viên tham gia (${room.totalQuantity}/${room.maxQuantity} đơn vị).`
    );
  } else if (sortBy === 'distance') {
    factors.push('Ưu tiên khoảng cách gần nhất tới điểm nhận hàng.');
  } else if (sortBy === 'price_asc') {
    factors.push('Sắp xếp theo mức giá nhóm hiện tại từ thấp đến cao.');
  }

  return {
    summary: room.isSponsored
      ? 'Hiển thị do vị trí Được tài trợ kết hợp bộ lọc khoảng cách & danh mục'
      : 'Hiển thị theo thuật toán sắp xếp cơ học (khoảng cách, thời gian đóng phòng, danh mục & số lượng gom) – Không sử dụng AI cá nhân hóa ngầm.',
    factors,
  };
}


