import type {
  GroupRoom,
  Order,
  Voucher,
  VoucherUsage,
  Referral,
  RefundRequest,
  FlashMatchDemand,
  DealHealthInfo,
  UnitEconomicsReport,
  GrowthFeatureFlags,
} from '../types';

export const DEFAULT_GROWTH_FLAGS: GrowthFeatureFlags = {
  flashMatchEnabled: true,
  flashRepeatEnabled: true,
  flashRescueEnabled: true,
  flashWholesaleEnabled: true,
  flashMergeEnabled: true,
  flashBundleEnabled: true,
  flashCommitEnabled: true,
  flashNearEnabled: true,
  flashInsightEnabled: true,
  flashBoostEnabled: true,
  unitEconomicsEnabled: true,
};

/**
 * Calculates rule-based Deal Health Score (Phần Y)
 * Không dùng AI giả tạo, hoàn toàn minh bạch bằng công thức toán học
 */
export function calculateDealHealthScore(room: GroupRoom): DealHealthInfo {
  const percentFilled = Math.min(100, (room.totalQuantity / (room.maxQuantity || 20)) * 100);
  
  // Hours remaining
  const now = Date.now();
  const end = new Date(room.endAt).getTime();
  const timeRemainingHours = Math.max(0, (end - now) / (1000 * 60 * 60));
  
  // Rate of progress
  const timeProgressScore = Math.min(40, (percentFilled / 100) * 40);
  const urgencyBonus = percentFilled >= 75 ? 30 : percentFilled >= 50 ? 20 : 10;
  const timeFactor = timeRemainingHours > 24 ? 20 : timeRemainingHours > 6 ? 15 : 5;
  const shippingEfficiency = Math.round(((room.normalShippingEstimate || 25000) / Math.max(1, room.totalShippingFee / Math.max(1, room.participantCount))) * 10);

  const rawScore = Math.min(100, Math.round(timeProgressScore + urgencyBonus + timeFactor));
  const status: 'healthy' | 'at_risk' = rawScore >= 65 ? 'healthy' : 'at_risk';

  const recommendations: string[] = [];
  if (percentFilled < 50 && timeRemainingHours < 24) {
    recommendations.push('Kích hoạt FlashBoost để tăng hiển thị tới Buyer cùng khu vực');
    recommendations.push('Đề xuất gộp nhu cầu (FlashMerge) với phòng cùng danh mục');
  } else if (percentFilled >= 75) {
    recommendations.push('Đang ở mốc cận kề: Gửi thông báo FlashMomentum còn thiếu vài suất');
  } else {
    recommendations.push('Chia sẻ liên kết phòng gom tới các FlashClub lân cận');
  }

  return {
    score: rawScore,
    status,
    factors: {
      quantityProgress: Math.round(percentFilled),
      timeRemainingHours: Math.round(timeRemainingHours),
      conversionRate: Math.round(percentFilled * 0.85),
      shippingEfficiency: Math.min(100, shippingEfficiency * 10),
    },
    recommendations,
  };
}

/**
 * Unit Economics Dashboard Calculator (Phần X)
 * Platform Revenue = Commission + Pro + Boost + Logistics + Locker
 * Variable Cost = Voucher Subsidy + Referral Rewards + Logistics Subsidy + Refund Costs
 * Net Contribution = Revenue - Variable Cost
 */
export function calculateUnitEconomics(
  orders: Order[],
  voucherUsages: VoucherUsage[] = [],
  vouchers: Voucher[] = [],
  referrals: Referral[] = [],
  refunds: RefundRequest[] = [],
  proSuppliersCount: number = 2,
  boostCampaignsCount: number = 3,
  batchesCount: number = 4
): UnitEconomicsReport {
  // 1. GMV by Source
  const paidOrders = orders.filter(
    (o) => o.status !== 'awaiting_payment' && o.status !== 'cancelled_before_payment'
  );

  const gmvBySource = {
    standard: 0,
    flashmatch: 0,
    repeat: 0,
    rescue: 0,
    wholesale: 0,
    bundle: 0,
  };

  let totalGmv = 0;
  let commissionRevenue = 0;

  paidOrders.forEach((o) => {
    const isRefunded = o.status === 'refunded';
    const subtotal = isRefunded ? 0 : o.productSubtotal;
    const comm = isRefunded ? 0 : (o.platformCommission || subtotal * 0.07);

    totalGmv += subtotal;
    commissionRevenue += comm;

    const source = o.transactionSource || 'standard';
    if (source in gmvBySource) {
      gmvBySource[source] += subtotal;
    } else {
      gmvBySource.standard += subtotal;
    }
  });

  // 2. Auxiliary Revenue Streams (Phần V)
  const supplierProRevenue = proSuppliersCount * 299000; // 299.000đ/tháng/supplier
  const flashBoostRevenue = boostCampaignsCount * 150000; // 150.000đ/campaign
  const flashLogisticsRevenue = batchesCount * 25000; // 25.000đ/batch coordination
  const smartLockerRevenue = paidOrders.length * 2000; // 2.000đ/order locker maintenance

  const totalPlatformRevenue =
    commissionRevenue +
    supplierProRevenue +
    flashBoostRevenue +
    flashLogisticsRevenue +
    smartLockerRevenue;

  // 3. Platform Variable Costs (Phần X)
  // Voucher subsidies funded by platform
  const voucherSubsidy = voucherUsages.reduce((sum, u) => {
    const v = vouchers.find((voc) => voc.id === u.voucherId);
    if (v && v.fundedBy !== 'supplier') {
      return sum + u.discountAmount;
    }
    return sum;
  }, 0);

  // Referral costs: 20.000đ per completed referral
  const completedReferrals = referrals.filter((r) => r.status === 'completed').length;
  const referralRewardsCost = completedReferrals * 20000;

  // Logistics & delivery coordination subsidy
  const logisticsSubsidy = batchesCount * 10000;

  // Refund processing overheads (3% of refund volume)
  const refundCosts = refunds
    .filter((r) => r.status === 'refunded')
    .reduce((sum, r) => {
      const ord = orders.find((o) => o.id === r.orderId);
      return sum + (ord?.totalAmount || 0) * 0.03;
    }, 0);

  const totalVariableCosts = voucherSubsidy + referralRewardsCost + logisticsSubsidy + refundCosts;
  const netContribution = totalPlatformRevenue - totalVariableCosts;
  const contributionMarginPercent =
    totalPlatformRevenue > 0
      ? Math.round((netContribution / totalPlatformRevenue) * 100)
      : 0;

  return {
    totalGmv,
    revenue: {
      commission: commissionRevenue,
      supplierPro: supplierProRevenue,
      flashBoost: flashBoostRevenue,
      flashLogistics: flashLogisticsRevenue,
      smartLocker: smartLockerRevenue,
      total: totalPlatformRevenue,
    },
    variableCosts: {
      voucherSubsidy,
      referralRewards: referralRewardsCost,
      logisticsSubsidy,
      refundCosts,
      total: totalVariableCosts,
    },
    netContribution,
    contributionMarginPercent,
    gmvBySource,
  };
}

/**
 * Demand curve aggregation for FlashCommit (Phần B)
 * Supplier sees quantity signals at price thresholds without seeing personal buyer identities
 */
export function aggregateDemandCurve(demand: FlashMatchDemand) {
  const commitments = demand.commitments || [];
  const interestedCount = commitments.filter((c) => c.commitmentType === 'interested').length;
  const committedList = commitments.filter((c) => c.commitmentType === 'committed');

  const brackets: { maxPrice: number; quantity: number; buyerCount: number }[] = [];

  committedList.forEach((c) => {
    const price = c.maxTargetPrice || 0;
    const existing = brackets.find((b) => b.maxPrice === price);
    if (existing) {
      existing.quantity += c.quantity;
      existing.buyerCount += 1;
    } else {
      brackets.push({ maxPrice: price, quantity: c.quantity, buyerCount: 1 });
    }
  });

  brackets.sort((a, b) => b.maxPrice - a.maxPrice);

  return {
    totalQuantity: demand.currentQuantity,
    interestedCount,
    committedCount: committedList.length,
    committedQuantity: committedList.reduce((sum, c) => sum + c.quantity, 0),
    priceBrackets: brackets,
  };
}

/**
 * Detects if a FlashMatch demand is similar to an existing room (Phần E: FlashAutoMatch)
 */
export function findAutoMatchRoom(
  demandTitle: string,
  category: string,
  rooms: GroupRoom[]
): GroupRoom | null {
  const normalizedTitle = demandTitle.toLowerCase().trim();
  if (!normalizedTitle) return null;

  return (
    rooms.find((r) => {
      if (r.status !== 'active') return false;
      const roomTitle = r.productName.toLowerCase();
      // Keyword matching
      const keywords = normalizedTitle.split(' ').filter((w) => w.length > 2);
      const matches = keywords.filter((kw) => roomTitle.includes(kw));
      return (matches.length >= 2 || (matches.length >= 1 && r.category === category));
    }) || null
  );
}

/**
 * Detects mergeable demands in same area & category (Phần Z: FlashMerge)
 */
export function findMergeableDemands(
  currentDemand: FlashMatchDemand,
  allDemands: FlashMatchDemand[]
): FlashMatchDemand[] {
  return allDemands.filter(
    (d) =>
      d.id !== currentDemand.id &&
      d.status === 'gathering' &&
      d.category === currentDemand.category &&
      d.area === currentDemand.area
  );
}
