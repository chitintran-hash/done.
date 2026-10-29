import React, { useState, useMemo } from 'react';
import {
  User,
  Supplier,
  Product,
  GroupRoom,
  Order,
  RefundRequest,
  Review,
  SupplierPayout,
  PayoutStatus,
  Voucher,
  VoucherUsage,
  Referral,
  LoyaltyTransaction,
  RoomEvent,
  PickupPoint,
  PickupPointType,
  PickupPointStatus,
  PickupSlot,
  DeliveryBatch,
  DeliveryBatchStatus,
  DeliveryEvent,
  DeliveryIssue,
  DeliveryIssueType,
  SupplierVerificationDocument,
  ProductReport,
  ComplaintCase,
  ComplaintMessage,
  ComplaintStatus,
  PrivacyRequest,
  AccountDeletionStage,
  ReviewModerationReason,
  ModerationAction,
  AuditEvent,
  ComplianceChecklistItem,
  ComplianceChecklistStatus,
} from '../types';
import {
  formatVND,
  getOrderFinancialSnapshot,
  getMaskedBuyerName,
  validateVoucherPromotionCap,
} from '../utils/pricing';
import { StatusBadge } from './StatusBadge';
import { VietnamAddressSelector } from './VietnamAddressSelector';
import { VietnamAddress } from '../types/address';

import { AdminComplianceTab } from './AdminComplianceTab';
import {
  Shield,
  Users,
  Store,
  Layers,
  ShoppingBag,
  RotateCcw,
  BarChart3,
  AlertTriangle,
  Wallet,
  DollarSign,
  Percent,
  CheckCircle2,
  HelpCircle,
  Lock,
  Ticket,
  TrendingUp,
  Award,
  Plus,
  Edit2,
  Truck,
  MapPin,
  Box,
  Sparkles,
  Eye,
  X
} from 'lucide-react';

interface AdminDashboardProps {
  currentAdminTab: string;
  users: User[];
  suppliers: Supplier[];
  products: Product[];
  rooms: GroupRoom[];
  orders: Order[];
  refunds: RefundRequest[];
  reviews: Review[];
  payouts: SupplierPayout[];
  commissionRate: number;
  vouchers?: Voucher[];
  voucherUsages?: VoucherUsage[];
  referrals?: Referral[];
  loyaltyTransactions?: LoyaltyTransaction[];
  roomEvents?: RoomEvent[];
  pickupPoints?: PickupPoint[];
  pickupSlots?: PickupSlot[];
  deliveryBatches?: DeliveryBatch[];
  deliveryEvents?: DeliveryEvent[];
  deliveryIssues?: DeliveryIssue[];
  onSavePickupPoint?: (point: PickupPoint) => void;
  onTogglePickupPointStatus?: (pointId: string) => void;
  onAdvanceBatchStatus?: (
    batchId: string,
    nextStatus: DeliveryBatchStatus,
    title: string,
    description?: string
  ) => void;
  onReportDeliveryIssue?: (
    batchId: string,
    issueType: DeliveryIssueType,
    note: string
  ) => void;
  onSaveVoucher?: (voucher: Voucher) => void;
  onToggleVoucherStatus?: (voucherId: string) => void;
  onUpdateCommissionRate: (newRate: number) => void;
  onUpdatePayoutStatus: (payoutId: string, newStatus: PayoutStatus) => void;
  onToggleUserStatus: (userId: string) => void;
  onUpdateSupplierVerification: (
    supplierId: string,
    status: Supplier['verificationStatus'],
    reason?: string
  ) => void;
  onToggleProductStatus: (productId: string) => void;
  onForceCloseRoom: (roomId: string) => void;
  onApproveRefund: (refundId: string) => void;
  onSimulateRefund: (refundId: string) => void;
  onOpenBusinessModel?: () => void;
  // Phase 8 Compliance Props
  verificationDocuments?: SupplierVerificationDocument[];
  productReports?: ProductReport[];
  complaints?: ComplaintCase[];
  complaintMessages?: ComplaintMessage[];
  privacyRequests?: PrivacyRequest[];
  moderationActions?: ModerationAction[];
  auditEvents?: AuditEvent[];
  complianceChecklist?: ComplianceChecklistItem[];
  onReviewDocument?: (docId: string, status: 'approved' | 'rejected', note: string) => void;
  onModerateProduct?: (
    productId: string,
    action: 'temporarily_hide' | 'request_supplier_evidence' | 'reinstate' | 'permanently_deactivate',
    reason: string
  ) => void;
  onResolveProductReport?: (
    reportId: string,
    status: ProductReport['status'],
    note: string
  ) => void;
  onAdminUpdateComplaint?: (
    complaintId: string,
    status: ComplaintStatus,
    message?: string,
    resolution?: string
  ) => void;
  onAdminUpdatePrivacyRequest?: (
    requestId: string,
    status: PrivacyRequest['status'],
    deletionStage?: AccountDeletionStage,
    adminNote?: string
  ) => void;
  onModerateReview?: (
    reviewId: string,
    isModerated: boolean,
    reason?: ReviewModerationReason
  ) => void;
  onUpdateChecklistItem?: (
    itemId: string,
    status: ComplianceChecklistStatus,
    internalNote: string
  ) => void;
  showToast: (msg: string) => void;
}

export const AdminDashboardView: React.FC<AdminDashboardProps> = ({
  currentAdminTab,
  users,
  suppliers,
  products,
  rooms,
  orders,
  reviews = [],
  refunds,
  payouts,
  commissionRate,
  vouchers = [],
  voucherUsages = [],
  referrals = [],
  loyaltyTransactions = [],
  roomEvents = [],
  pickupPoints = [],
  deliveryBatches = [],
  deliveryEvents = [],
  deliveryIssues = [],
  onSavePickupPoint,
  onTogglePickupPointStatus,
  onAdvanceBatchStatus,
  onReportDeliveryIssue,
  onSaveVoucher,
  onToggleVoucherStatus,
  onUpdateCommissionRate,
  onUpdatePayoutStatus,
  onToggleUserStatus,
  onUpdateSupplierVerification,
  onToggleProductStatus,
  onForceCloseRoom,
  onApproveRefund,
  onSimulateRefund,
  onOpenBusinessModel,
  verificationDocuments = [],
  productReports = [],
  complaints = [],
  complaintMessages = [],
  privacyRequests = [],
  moderationActions = [],
  auditEvents = [],
  complianceChecklist = [],
  onReviewDocument,
  onModerateProduct,
  onResolveProductReport,
  onAdminUpdateComplaint,
  onAdminUpdatePrivacyRequest,
  onModerateReview,
  onUpdateChecklistItem,
  showToast,
}) => {
  const [forceCloseModalRoomId, setForceCloseModalRoomId] = useState<string | null>(null);
  const [rateDraftPct, setRateDraftPct] = useState<number>(Math.round(commissionRate * 100));

  // Phase 7: Admin Pickup Point CRUD & Batch Management state
  const [isPointModalOpen, setIsPointModalOpen] = useState<boolean>(false);
  const [editingPoint, setEditingPoint] = useState<PickupPoint | null>(null);
  const [ptName, setPtName] = useState<string>('');
  const [ptType, setPtType] = useState<PickupPointType>('locker');
  const [ptAddress, setPtAddress] = useState<string>('');
  const [ptCapacity, setPtCapacity] = useState<number>(50);
  const [ptCurrentLoad, setPtCurrentLoad] = useState<number>(0);
  const [ptHours, setPtHours] = useState<string>('07:00 – 22:00');
  const [ptContact, setPtContact] = useState<string>('');
  const [ptInstructions, setPtInstructions] = useState<string>(
    '1. Đến điểm nhận hàng\n2. Đưa mã QR hoặc mã nhận hàng\n3. Kiểm tra sản phẩm'
  );
  const [ptStatus, setPtStatus] = useState<PickupPointStatus>('active');
  const [ptDistance, setPtDistance] = useState<number>(350);
  const [ptProvince, setPtProvince] = useState<string>('TP. Hồ Chí Minh');
  const [ptDistrict, setPtDistrict] = useState<string>('TP. Thủ Đức');
  const [ptWard, setPtWard] = useState<string>('Phường Linh Trung');
  const [ptStreet, setPtStreet] = useState<string>('');
  const [ptHouseNumber, setPtHouseNumber] = useState<string>('');
  const [ptLat, setPtLat] = useState<number>(10.8495);
  const [ptLng, setPtLng] = useState<number>(106.7725);

  // Batch confirmation modal & detail modal (Req 20, 46, 55)
  const [pendingBatchTransition, setPendingBatchTransition] = useState<{
    batch: DeliveryBatch;
    nextStatus: DeliveryBatchStatus;
    title: string;
    description: string;
  } | null>(null);
  const [inspectingBatch, setInspectingBatch] = useState<DeliveryBatch | null>(null);
  const [issueBatch, setIssueBatch] = useState<DeliveryBatch | null>(null);
  const [adminIssueType, setAdminIssueType] = useState<DeliveryIssueType>('Delayed');
  const [adminIssueNote, setAdminIssueNote] = useState<string>('');

  const openCreatePointModal = () => {
    setEditingPoint(null);
    setPtName('');
    setPtType('locker');
    setPtAddress('');
    setPtProvince('TP. Hồ Chí Minh');
    setPtDistrict('TP. Thủ Đức');
    setPtWard('Phường Linh Trung');
    setPtStreet('');
    setPtHouseNumber('');
    setPtLat(10.8495);
    setPtLng(106.7725);
    setPtCapacity(50);
    setPtCurrentLoad(0);
    setPtHours('07:00 – 22:00');
    setPtContact('Hotline: 0909 111 222');
    setPtInstructions(
      '1. Đến điểm nhận hàng\n2. Đưa mã QR hoặc mã nhận hàng\n3. Kiểm tra sản phẩm'
    );
    setPtStatus('active');
    setPtDistance(350);
    setIsPointModalOpen(true);
  };

  const openEditPointModal = (pt: PickupPoint) => {
    setEditingPoint(pt);
    setPtName(pt.name);
    setPtType(pt.type);
    setPtAddress(pt.address);
    setPtProvince(pt.provinceOrCity || 'TP. Hồ Chí Minh');
    setPtDistrict(pt.district || pt.area || 'TP. Thủ Đức');
    setPtWard(pt.ward || pt.locality || 'Phường Linh Trung');
    setPtStreet(pt.street || '');
    setPtHouseNumber(pt.houseNumber || '');
    setPtLat(pt.latitude || 10.8495);
    setPtLng(pt.longitude || 106.7725);
    setPtCapacity(pt.capacity);
    setPtCurrentLoad(pt.currentLoad);
    setPtHours(pt.operatingHours);
    setPtContact(pt.contactInfo || '');
    setPtInstructions(
      pt.instructions ||
        '1. Đến điểm nhận hàng\n2. Đưa mã QR hoặc mã nhận hàng\n3. Kiểm tra sản phẩm'
    );
    setPtStatus(pt.status);
    setPtDistance(pt.distanceMeters || 350);
    setIsPointModalOpen(true);
  };

  const handleSavePointForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ptName.trim() || !ptAddress.trim()) {
      showToast('Vui lòng nhập đầy đủ Tên và Địa chỉ điểm nhận hàng.');
      return;
    }
    const computedStatus: PickupPointStatus =
      ptStatus === 'inactive'
        ? 'inactive'
        : ptCurrentLoad >= ptCapacity
        ? 'full'
        : 'active';

    const savedPoint: PickupPoint = {
      id: editingPoint?.id || `pp-${Date.now()}`,
      name: ptName.trim(),
      type: ptType,
      address: ptAddress.trim(),
      country: 'Việt Nam',
      provinceOrCity: ptProvince.trim(),
      area: ptDistrict.trim(),
      district: ptDistrict.trim(),
      ward: ptWard.trim(),
      locality: ptWard.trim(),
      street: ptStreet.trim() || undefined,
      houseNumber: ptHouseNumber.trim() || undefined,
      latitude: Number(ptLat),
      longitude: Number(ptLng),
      capacity: Math.max(1, Number(ptCapacity)),
      currentLoad: Math.max(0, Number(ptCurrentLoad)),
      operatingHours: ptHours.trim() || '07:00 – 22:00',
      contactInfo: ptContact.trim() || undefined,
      instructions: ptInstructions.trim() || undefined,
      status: computedStatus,
      isDemo: true,
      distance: `${ptDistance}m`,
      distanceMeters: Number(ptDistance),
      mapCoords: editingPoint?.mapCoords || {
        x: Math.floor(25 + Math.random() * 50),
        y: Math.floor(25 + Math.random() * 50),
      },
      createdAt: editingPoint?.createdAt || new Date().toISOString(),
    };
    onSavePickupPoint?.(savedPoint);
    setIsPointModalOpen(false);
    showToast(
      editingPoint
        ? `Đã cập nhật điểm nhận "${savedPoint.name}".`
        : `Đã thêm điểm nhận mới "${savedPoint.name}".`
    );
  };

  // Voucher Editor Form state (Req 39)
  const [editingVoucher, setEditingVoucher] = useState<Voucher | null>(null);
  const [isVoucherFormOpen, setIsVoucherFormOpen] = useState<boolean>(false);
  const [vCode, setVCode] = useState<string>('');
  const [vName, setVName] = useState<string>('');
  const [vType, setVType] = useState<'fixed' | 'percentage'>('fixed');
  const [vValue, setVValue] = useState<number>(10000);
  const [vMinOrder, setVMinOrder] = useState<number>(80000);
  const [vMaxDiscount, setVMaxDiscount] = useState<number>(10000);
  const [vStartAt, setVStartAt] = useState<string>(() => new Date().toISOString().slice(0, 10));
  const [vEndAt, setVEndAt] = useState<string>(() =>
    new Date(Date.now() + 90 * 86400000).toISOString().slice(0, 10)
  );
  const [vUsageLimit, setVUsageLimit] = useState<number>(100);
  const [vPerUserLimit, setVPerUserLimit] = useState<number>(1);
  const [vFundedBy, setVFundedBy] = useState<'platform' | 'supplier'>('platform');
  const [vStatus, setVStatus] = useState<'active' | 'inactive'>('active');

  const openCreateVoucherModal = () => {
    setEditingVoucher(null);
    setVCode('');
    setVName('');
    setVType('fixed');
    setVValue(10000);
    setVMinOrder(80000);
    setVMaxDiscount(10000);
    setVStartAt(new Date().toISOString().slice(0, 10));
    setVEndAt(new Date(Date.now() + 90 * 86400000).toISOString().slice(0, 10));
    setVUsageLimit(100);
    setVPerUserLimit(1);
    setVFundedBy('platform');
    setVStatus('active');
    setIsVoucherFormOpen(true);
  };

  const openEditVoucherModal = (v: Voucher) => {
    setEditingVoucher(v);
    setVCode(v.code);
    setVName(v.name);
    setVType(v.type);
    setVValue(v.type === 'percentage' && v.value <= 1 ? Math.round(v.value * 100) : v.value);
    setVMinOrder(v.minimumOrder ?? 0);
    setVMaxDiscount(v.maxDiscount ?? 0);
    setVStartAt(new Date(v.startAt).toISOString().slice(0, 10));
    setVEndAt(new Date(v.endAt).toISOString().slice(0, 10));
    setVUsageLimit(v.usageLimit ?? 100);
    setVPerUserLimit(v.perUserLimit ?? 1);
    setVFundedBy(v.fundedBy || 'platform');
    setVStatus(v.status);
    setIsVoucherFormOpen(true);
  };

  const handleSaveVoucherForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vCode.trim() || !vName.trim()) {
      showToast('Vui lòng nhập đầy đủ mã và tên voucher.');
      return;
    }
    const normalizedVal =
      vType === 'percentage' ? (vValue > 1 ? vValue / 100 : vValue) : Number(vValue);

    // Req 19: Promotion Compliance Guard (50% cap under normal regime)
    const capCheck = validateVoucherPromotionCap({
      type: vType,
      value: normalizedVal,
      minimumOrder: Number(vMinOrder || 0),
      specialPromotionRegime: false,
    });
    if (!capCheck.allowed) {
      showToast(capCheck.error || 'Mức giảm giá vượt trần khuyến mại 50% theo Nghị định 81/2018/NĐ-CP.');
      return;
    }

    const saved: Voucher = {
      id: editingVoucher?.id || `voucher-${Date.now()}`,
      code: vCode.trim().toUpperCase(),
      name: vName.trim(),
      type: vType,
      value: normalizedVal,
      minimumOrder: Number(vMinOrder || 0),
      maxDiscount: vMaxDiscount > 0 ? Number(vMaxDiscount) : undefined,
      startAt: new Date(vStartAt).toISOString(),
      endAt: new Date(vEndAt).toISOString(),
      usageLimit: vUsageLimit > 0 ? Number(vUsageLimit) : undefined,
      perUserLimit: vPerUserLimit > 0 ? Number(vPerUserLimit) : 1,
      fundedBy: vFundedBy,
      organizer: 'FlashGroup Academic Prototype Marketplace',
      eligibleProducts: 'Tất cả sản phẩm mở phòng gom đủ điều kiện đơn tối thiểu',
      eligibleBuyers: 'Thành viên Buyer có tài khoản hoạt động trên hệ thống',
      terms:
        'Áp dụng tối đa 50% giá trị sản phẩm theo Nghị định 81/2018/NĐ-CP (special_promotion_regime = false). Không quy đổi thành tiền mặt.',
      specialPromotionRegime: false,
      status: vStatus,
      createdAt: editingVoucher?.createdAt || new Date().toISOString(),
    };

    onSaveVoucher?.(saved);
    setIsVoucherFormOpen(false);
    showToast(
      editingVoucher
        ? `Đã cập nhật mã ưu đãi ${saved.code} (Tuân thủ trần 50% NĐ 81/2018).`
        : `Đã tạo mã ưu đãi mới ${saved.code} (Tuân thủ trần 50% NĐ 81/2018).`
    );
  };

  // Valid orders (paid / preparing / in_transit / ready_for_pickup / picked_up)
  const validOrders = useMemo(
    () =>
      orders.filter(
        (o) =>
          o.status !== 'cancelled' &&
          o.status !== 'refunded' &&
          o.status !== 'awaiting_payment'
      ),
    [orders]
  );

  const refundedOrders = useMemo(
    () => orders.filter((o) => o.status === 'refunded'),
    [orders]
  );

  // Requirement 14: Admin Platform Revenue formulas
  // GMV = sum(productSubtotal) for valid successful orders only
  // Platform Revenue = sum(platformCommission) for valid successful orders only
  const gmv = useMemo(
    () => validOrders.reduce((acc, o) => acc + o.productSubtotal, 0),
    [validOrders]
  );

  const platformRevenue = useMemo(
    () => validOrders.reduce((acc, o) => acc + getOrderFinancialSnapshot(o).effectiveCommission, 0),
    [validOrders]
  );

  const supplierNetProceeds = useMemo(
    () => validOrders.reduce((acc, o) => acc + getOrderFinancialSnapshot(o).effectiveNet, 0),
    [validOrders]
  );

  const shippingVolume = useMemo(
    () => validOrders.reduce((acc, o) => acc + o.shippingFee, 0),
    [validOrders]
  );

  const refundedGmv = useMemo(
    () => refundedOrders.reduce((acc, o) => acc + o.productSubtotal, 0),
    [refundedOrders]
  );

  // Payout totals (Req 15)
  const pendingPayoutsAmount = useMemo(
    () =>
      payouts
        .filter((p) => p.status === 'pending' || p.status === 'approved')
        .reduce((acc, p) => acc + p.amount, 0),
    [payouts]
  );

  const completedPayoutsAmount = useMemo(
    () =>
      payouts
        .filter((p) => p.status === 'paid')
        .reduce((acc, p) => acc + p.amount, 0),
    [payouts]
  );

  // Requirement 23: Detect if any refunded order was already included in a PAID payout
  const refundedAfterPaidOrders = useMemo(() => {
    const paidOrderIds = new Set<string>();
    payouts
      .filter((p) => p.status === 'paid')
      .forEach((p) => p.orderIds.forEach((oid) => paidOrderIds.add(oid)));
    return refundedOrders.filter((o) => paidOrderIds.has(o.id));
  }, [payouts, refundedOrders]);

  // General Admin Metrics
  const totalBuyers = users.filter((u) => u.role === 'buyer').length;
  const totalSuppliers = suppliers.length;
  const verifiedSuppliers = suppliers.filter((s) => s.verificationStatus === 'verified').length;
  const activeRooms = rooms.filter((r) => r.status === 'active').length;
  const successfulRooms = rooms.filter((r) => r.status === 'successful').length;
  const pendingRefunds = refunds.filter((r) => r.status === 'requested').length;

  // Analytics metrics (Req 26)
  const successRate = rooms.length > 0 ? ((successfulRooms / rooms.length) * 100).toFixed(1) : '0';
  const totalParticipants = rooms.reduce((acc, r) => acc + r.participantCount, 0);
  const avgGroupSize = rooms.length > 0 ? (totalParticipants / rooms.length).toFixed(1) : '0';

  const avgCommissionPerOrder =
    validOrders.length > 0 ? Math.round(platformRevenue / validOrders.length) : 0;

  const totalSavings = validOrders.reduce((acc, ord) => {
    const room = rooms.find((r) => r.id === ord.roomId);
    if (!room) return acc;
    const savingPerUnit = Math.max(0, room.initialPrice - ord.unitPrice);
    return acc + savingPerUnit * ord.quantity;
  }, 0);
  const avgSavingPerOrder = validOrders.length > 0 ? Math.round(totalSavings / validOrders.length) : 0;

  const nonCancelledOrdersCount = orders.filter((o) => o.status !== 'cancelled').length;
  const refundRate =
    nonCancelledOrdersCount > 0
      ? ((refundedOrders.length / nonCancelledOrdersCount) * 100).toFixed(1)
      : '0.0';

  // Monthly breakdown for Finance page (Req 15)
  const monthlyFinanceBreakdown = useMemo(() => {
    const buckets: Record<string, { month: string; gmv: number; fee: number; net: number; ordersCount: number }> = {};

    validOrders.forEach((o) => {
      const d = new Date(o.paidAt || o.createdAt);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const label = `Tháng ${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
      const snap = getOrderFinancialSnapshot(o);

      if (!buckets[key]) {
        buckets[key] = { month: label, gmv: 0, fee: 0, net: 0, ordersCount: 0 };
      }
      buckets[key].gmv += o.productSubtotal;
      buckets[key].fee += snap.effectiveCommission;
      buckets[key].net += snap.effectiveNet;
      buckets[key].ordersCount += 1;
    });

    const list = Object.entries(buckets)
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([, val]) => val);

    if (list.length === 0) {
      const now = new Date();
      return [
        {
          month: `Tháng ${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`,
          gmv: 0,
          fee: 0,
          net: 0,
          ordersCount: 0,
        },
      ];
    }
    return list;
  }, [validOrders]);

  const handleSaveCommissionRate = () => {
    const clamped = Math.max(0, Math.min(20, Number(rateDraftPct)));
    setRateDraftPct(clamped);
    onUpdateCommissionRate(clamped / 100);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Admin Notice */}
      <div className="bg-indigo-900 text-white rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-md">
        <div className="flex items-center space-x-3">
          <Shield className="w-5 h-5 text-indigo-300 shrink-0" />
          <span className="text-xs font-bold">
            FlashGroup Control Center (Admin Portal) • Giám sát dòng tiền sàn, đối soát Supplier và điều phối giao dịch
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-[10px] font-bold bg-indigo-800 text-indigo-200 px-2.5 py-1 rounded-full border border-indigo-700">
            Phí nền tảng demo: {Math.round(commissionRate * 100)}%
          </span>
          {onOpenBusinessModel && (
            <button
              onClick={onOpenBusinessModel}
              className="text-[10px] font-bold bg-white/10 hover:bg-white/20 text-white px-2.5 py-1 rounded-full transition flex items-center gap-1"
            >
              <HelpCircle className="w-3 h-3" /> Mô hình phí
            </button>
          )}
        </div>
      </div>

      {/* Requirement 23: Warning if Refund occurred after Payout was already paid */}
      {refundedAfterPaidOrders.length > 0 && (
        <div className="bg-rose-50 border-2 border-rose-400 rounded-2xl p-4 flex items-start space-x-3 text-xs text-rose-900 shadow-sm">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <div className="font-black uppercase tracking-wide text-rose-700">
              Refund after payout – manual reconciliation required.
            </div>
            <p className="mt-0.5 text-rose-800">
              Phát hiện {refundedAfterPaidOrders.length} đơn hàng ({refundedAfterPaidOrders.map((o) => o.id).join(', ')}) đã hoàn tiền sau khi khoản đối soát của Supplier đã được đánh dấu PAID. Cần đối soát bù trừ thủ công ở kỳ tiếp theo (Mô phỏng prototype).
            </p>
          </div>
        </div>
      )}

      {/* VIEW: OVERVIEW (With Requirement 14 Platform Revenue Cards) */}
      {currentAdminTab === 'overview' && (
        <div className="space-y-6">
          {/* Operational KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs text-slate-400 font-semibold flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#000181]" /> Total Buyers
              </span>
              <div className="text-2xl font-black text-slate-900 mt-1">{totalBuyers}</div>
              <span className="text-[11px] text-slate-400 mt-0.5 block">Tài khoản người mua</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs text-slate-400 font-semibold flex items-center gap-1.5">
                <Store className="w-3.5 h-3.5 text-amber-600" /> Verified Suppliers
              </span>
              <div className="text-2xl font-black text-slate-900 mt-1">
                {verifiedSuppliers} <span className="text-xs text-slate-400 font-normal">/ {totalSuppliers}</span>
              </div>
              <span className="text-[11px] text-[#000181] font-bold mt-0.5 block">Đã xét duyệt</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs text-slate-400 font-semibold flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#006EE9]" /> Active / Success Rooms
              </span>
              <div className="text-2xl font-black text-slate-900 mt-1">
                {activeRooms} <span className="text-xs text-slate-400 font-normal">/ {successfulRooms}</span>
              </div>
              <span className="text-[11px] text-slate-400 mt-0.5 block">Đang mở / Thành công</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs text-slate-400 font-semibold flex items-center gap-1.5">
                <RotateCcw className="w-3.5 h-3.5 text-rose-600" /> Pending Refunds
              </span>
              <div className="text-2xl font-black text-rose-600 mt-1">{pendingRefunds}</div>
              <span className="text-[11px] text-slate-400 mt-0.5 block">Yêu cầu hoàn tiền chờ duyệt</span>
            </div>
          </div>

          {/* Requirement 14: ADMIN PLATFORM REVENUE CARDS */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                <DollarSign className="w-4 h-4 text-[#000181]" />
                <span>Tổng quan Doanh thu Sàn & Dòng tiền (Admin Platform Revenue)</span>
              </h3>
              <span className="text-[11px] font-bold text-[#000181] bg-[#EFFBFF] px-2.5 py-1 rounded-full border border-indigo-200">
                Phí nền tảng demo: {Math.round(commissionRate * 100)}% (Chỉ tính trên đơn hợp lệ, không tính phí ship)
              </span>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <span className="text-[11px] font-bold text-slate-500 uppercase">GMV (Product Subtotal)</span>
                <div className="text-lg sm:text-xl font-black text-slate-900 mt-1">{formatVND(gmv)}</div>
                <span className="text-[10px] text-slate-400 mt-0.5 block">Tổng tiền hàng hợp lệ</span>
              </div>

              <div className="bg-[#EFFBFF]/70 p-4 rounded-2xl border border-indigo-200">
                <span className="text-[11px] font-bold text-[#000181] uppercase">Platform Revenue</span>
                <div className="text-lg sm:text-xl font-black text-[#000181] mt-1">{formatVND(platformRevenue)}</div>
                <span className="text-[10px] text-[#006EE9] font-semibold mt-0.5 block">
                  Doanh thu hoa hồng sàn
                </span>
              </div>

              <div className="bg-[#F4FFE8]/70 p-4 rounded-2xl border border-[#D0FFA4]">
                <span className="text-[11px] font-bold text-emerald-800 uppercase">Supplier Net Proceeds</span>
                <div className="text-lg sm:text-xl font-black text-[#000181] mt-1">
                  {formatVND(supplierNetProceeds)}
                </div>
                <span className="text-[10px] text-[#000181] mt-0.5 block">Doanh thu ròng về Supplier</span>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Shipping Volume</span>
                <div className="text-lg sm:text-xl font-black text-slate-800 mt-1">{formatVND(shippingVolume)}</div>
                <span className="text-[10px] text-slate-400 mt-0.5 block">Tổng cước giao chia sẻ</span>
              </div>

              <div className="bg-rose-50/60 p-4 rounded-2xl border border-rose-200">
                <span className="text-[11px] font-bold text-rose-700 uppercase">Refunded GMV</span>
                <div className="text-lg sm:text-xl font-black text-rose-600 mt-1">{formatVND(refundedGmv)}</div>
                <span className="text-[10px] text-rose-500 mt-0.5 block">Đã loại khỏi doanh thu sàn</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                <ShoppingBag className="w-4 h-4 text-[#000181]" />
                <span>Đơn hàng & Đối soát</span>
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <span className="text-xs text-slate-400">Đơn hàng hợp lệ</span>
                  <div className="text-xl font-black text-slate-900 mt-1">{validOrders.length} đơn</div>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <span className="text-xs text-slate-400">Chờ đối soát Supplier</span>
                  <div className="text-xl font-black text-amber-600 mt-1">{formatVND(pendingPayoutsAmount)}</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                <BarChart3 className="w-4 h-4 text-[#006EE9]" />
                <span>Hiệu suất gom đơn Siêu cục bộ</span>
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <span className="text-xs text-slate-400">Tỉ lệ gom thành công</span>
                  <div className="text-xl font-black text-teal-700 mt-1">{successRate}%</div>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <span className="text-xs text-slate-400">Quy mô nhóm trung bình</span>
                  <div className="text-xl font-black text-slate-900 mt-1">{avgGroupSize} người</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW: FINANCE (Requirement 15 & Requirement 21 Commission Settings) */}
      {currentAdminTab === 'finance' && (
        <div className="space-y-6">
          {/* 6 Finance Summary Cards (Req 15) */}
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Total GMV</span>
              <div className="text-lg sm:text-xl font-black text-slate-900 mt-1">{formatVND(gmv)}</div>
              <span className="text-[10px] text-slate-400 mt-1 block">Tổng tiền hàng hợp lệ</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-indigo-200 bg-[#EFFBFF]/30 shadow-sm">
              <span className="text-[11px] font-bold text-[#000181] uppercase">Platform Fees</span>
              <div className="text-lg sm:text-xl font-black text-[#000181] mt-1">{formatVND(platformRevenue)}</div>
              <span className="text-[10px] text-[#006EE9] mt-1 block">Doanh thu phí nền tảng</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#D0FFA4] bg-[#F4FFE8]/30 shadow-sm">
              <span className="text-[11px] font-bold text-emerald-800 uppercase">Supplier Earnings</span>
              <div className="text-lg sm:text-xl font-black text-[#000181] mt-1">
                {formatVND(supplierNetProceeds)}
              </div>
              <span className="text-[10px] text-[#000181] mt-1 block">Tổng phần chia Supplier</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-amber-200 bg-amber-50/30 shadow-sm">
              <span className="text-[11px] font-bold text-amber-800 uppercase">Pending Payouts</span>
              <div className="text-lg sm:text-xl font-black text-amber-700 mt-1">
                {formatVND(pendingPayoutsAmount)}
              </div>
              <span className="text-[10px] text-amber-700 mt-1 block">Đang chờ duyệt / chi</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-teal-200 bg-teal-50/30 shadow-sm">
              <span className="text-[11px] font-bold text-teal-800 uppercase">Completed Payouts</span>
              <div className="text-lg sm:text-xl font-black text-teal-700 mt-1">
                {formatVND(completedPayoutsAmount)}
              </div>
              <span className="text-[10px] text-teal-700 mt-1 block">Đã đối soát hoàn tất</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-rose-200 bg-rose-50/30 shadow-sm">
              <span className="text-[11px] font-bold text-rose-700 uppercase">Refunded Amount</span>
              <div className="text-lg sm:text-xl font-black text-rose-600 mt-1">{formatVND(refundedGmv)}</div>
              <span className="text-[10px] text-rose-500 mt-1 block">{refundedOrders.length} đơn đã hoàn</span>
            </div>
          </div>

          {/* Phase 6 Req 35, 37, 38: Platform Voucher Subsidy & Net Campaign Revenue */}
          {(() => {
            const totalVoucherSubsidy = validOrders.reduce(
              (acc, o) => acc + getOrderFinancialSnapshot(o).effectiveVoucherCost,
              0
            );
            const netPlatformAfterVoucher = platformRevenue - totalVoucherSubsidy;

            return (
              <div className="bg-white rounded-3xl border border-indigo-200 p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                <div className="space-y-1">
                  <div className="font-black text-slate-900 flex items-center gap-2">
                    <Ticket className="w-4 h-4 text-[#006EE9]" />
                    <span>Hạch toán Voucher Tài trợ bởi Sàn (Platform-Funded Voucher Accounting)</span>
                  </div>
                  <p className="text-slate-500">
                    Công thức: <code className="bg-slate-100 px-1.5 py-0.5 rounded">Commission = (ProductSubtotal - VoucherDiscount) × Rate</code> •{' '}
                    <code className="bg-slate-100 px-1.5 py-0.5 rounded">Supplier Gross = Original Product Subtotal</code> •{' '}
                    <code className="bg-slate-100 px-1.5 py-0.5 rounded">Platform Net = Commission - VoucherDiscount</code>
                  </p>
                </div>
                <div className="flex items-center space-x-4 shrink-0">
                  <div className="text-right">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Trợ giá Voucher</span>
                    <span className="text-sm font-black text-amber-600">-{formatVND(totalVoucherSubsidy)}</span>
                  </div>
                  <div className="text-right pl-4 border-l border-slate-200">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">
                      Platform Net (Sau trợ giá)
                    </span>
                    <span
                      className={`text-base font-black ${
                        netPlatformAfterVoucher < 0 ? 'text-rose-600' : 'text-[#000181]'
                      }`}
                    >
                      {formatVND(netPlatformAfterVoucher)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })()}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Requirement 21: Platform Commission Rate Setting (0% - 20%) */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Percent className="w-4 h-4 text-[#006EE9]" />
                  <span>Cấu hình Platform Commission Rate</span>
                </h3>
                <span className="bg-[#FAF0FF] text-indigo-800 font-black text-[11px] px-2.5 py-0.5 rounded-full">
                  Phí nền tảng demo: {Math.round(commissionRate * 100)}%
                </span>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed">
                Thiết lập mức phí hoa hồng nền tảng (từ <strong>0% – 20%</strong>, mặc định <strong>7%</strong>). Mức phí mới chỉ áp dụng cho các đơn hàng thanh toán trong tương lai; các đơn hàng đã thanh toán trước đó giữ nguyên mức phí lịch sử (Historical Snapshot Integrity).
              </p>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span>Mức phí chọn ({rateDraftPct}%):</span>
                  <span className="text-lg font-black text-[#006EE9]">{rateDraftPct}%</span>
                </div>

                <input
                  type="range"
                  min={0}
                  max={20}
                  step={1}
                  value={rateDraftPct}
                  onChange={(e) => setRateDraftPct(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />

                <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                  <span>0%</span>
                  <span>7% (Default Demo)</span>
                  <span>15%</span>
                  <span>20% (Max)</span>
                </div>
              </div>

              <button
                onClick={handleSaveCommissionRate}
                className="w-full py-3 rounded-xl bg-[#006EE9] hover:bg-[#000181] text-white text-white font-bold text-xs transition shadow-md"
              >
                Lưu mức phí nền tảng ({rateDraftPct}%)
              </button>
            </div>

            {/* Requirement 15: Simple Monthly Breakdown (CSS/SVG bars) */}
            <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Báo cáo Dòng tiền theo Tháng (Monthly Financial Breakdown)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Tổng hợp GMV, Phí nền tảng và Doanh thu ròng của Nhà cung cấp theo kỳ
                </p>
              </div>

              <div className="space-y-4 pt-2">
                {monthlyFinanceBreakdown.map((item) => {
                  const maxGmv = Math.max(...monthlyFinanceBreakdown.map((m) => m.gmv), 1);
                  const barWidth = Math.max(8, Math.round((item.gmv / maxGmv) * 100));

                  return (
                    <div key={item.month} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-black text-slate-900">{item.month} ({item.ordersCount} đơn)</span>
                        <div className="flex items-center space-x-4">
                          <span className="text-slate-600">
                            GMV: <strong className="text-slate-900">{formatVND(item.gmv)}</strong>
                          </span>
                          <span className="text-[#000181]">
                            Phí sàn: <strong>{formatVND(item.fee)}</strong>
                          </span>
                          <span className="text-[#000181]">
                            Supplier Net: <strong>{formatVND(item.net)}</strong>
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden flex">
                        <div
                          className="bg-emerald-500 h-full transition-all duration-500"
                          style={{ width: `${Math.round(barWidth * 0.93)}%` }}
                          title="Supplier Net"
                        />
                        <div
                          className="bg-[#006EE9] h-full transition-all duration-500"
                          style={{ width: `${Math.max(2, Math.round(barWidth * 0.07))}%` }}
                          title="Platform Fee"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW: PAYOUTS (Requirement 12: Admin Payout Management) */}
      {currentAdminTab === 'payouts' && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Wallet className="w-4 h-4 text-[#006EE9]" />
                <span>Quản lý Đối soát & Giải ngân Nhà cung cấp (Supplier Payouts: {payouts.length})</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Quy trình xét duyệt: Pending → Approved → Paid (Mô phỏng chuyển khoản đối soát)
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Supplier</th>
                  <th className="py-3.5 px-4">Requested Amount</th>
                  <th className="py-3.5 px-4">Orders</th>
                  <th className="py-3.5 px-4">Period</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Requested Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payouts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      Chưa có yêu cầu đối soát nào từ Nhà cung cấp.
                    </td>
                  </tr>
                ) : (
                  payouts.map((po) => {
                    const supp = suppliers.find((s) => s.id === po.supplierId);
                    const supplierDisplay = po.supplierName || supp?.businessName || po.supplierId;

                    return (
                      <tr key={po.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-slate-900 block">{supplierDisplay}</span>
                          <span className="font-mono text-[10px] text-slate-400">#{po.id.slice(0, 10)}</span>
                        </td>
                        <td className="py-3.5 px-4 font-black text-[#000181] text-sm">
                          {formatVND(po.amount)}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-slate-800">
                          {po.orderCount} đơn
                        </td>
                        <td className="py-3.5 px-4 text-slate-500">
                          {po.periodStart ? new Date(po.periodStart).toLocaleDateString('vi-VN') : '—'} →{' '}
                          {po.periodEnd ? new Date(po.periodEnd).toLocaleDateString('vi-VN') : '—'}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase border ${
                              po.status === 'paid'
                                ? 'bg-teal-100 text-teal-800 border-teal-300'
                                : po.status === 'approved'
                                ? 'bg-[#D0FFA4]/40 text-emerald-800 border-[#D0FFA4]'
                                : po.status === 'rejected'
                                ? 'bg-rose-100 text-rose-800 border-rose-300'
                                : 'bg-amber-100 text-amber-800 border-amber-300'
                            }`}
                          >
                            {po.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-500">
                          {new Date(po.requestedAt).toLocaleString('vi-VN')}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="inline-flex items-center space-x-2">
                            {po.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => onUpdatePayoutStatus(po.id, 'approved')}
                                  className="px-3 py-1.5 rounded-lg bg-[#006EE9] hover:bg-[#000181] text-white text-white font-bold text-xs transition"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => onUpdatePayoutStatus(po.id, 'rejected')}
                                  className="px-3 py-1.5 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-700 font-bold text-xs transition"
                                >
                                  Reject
                                </button>
                              </>
                            )}
                            {po.status === 'approved' && (
                              <button
                                onClick={() => onUpdatePayoutStatus(po.id, 'paid')}
                                className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition flex items-center space-x-1"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Simulate Paid</span>
                              </button>
                            )}
                            {po.status === 'paid' && (
                              <span className="text-[11px] font-bold text-teal-700">✓ Đã giải ngân</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW: USERS */}
      {currentAdminTab === 'users' && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">Danh sách Tài khoản người dùng ({users.length})</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold text-[10px]">
                <tr>
                  <th className="py-3 px-4">Tên</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Vai trò</th>
                  <th className="py-3 px-4">Ngày tạo</th>
                  <th className="py-3 px-4">Trạng thái</th>
                  <th className="py-3 px-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{u.name}</td>
                    <td className="py-3.5 px-4 text-slate-600">{u.email}</td>
                    <td className="py-3.5 px-4">
                      <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      {new Date(u.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          u.status === 'active'
                            ? 'bg-[#D0FFA4]/40 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {u.status === 'active' ? 'Hoạt động' : 'Tạm khóa'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {u.role === 'buyer' && (
                        <button
                          onClick={() => onToggleUserStatus(u.id)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition border ${
                            u.status === 'active'
                              ? 'border-rose-200 text-rose-600 hover:bg-rose-50'
                              : 'border-[#D0FFA4] text-[#000181] hover:bg-[#F4FFE8]'
                          }`}
                        >
                          {u.status === 'active' ? 'Khóa tài khoản' : 'Mở khóa'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW: SUPPLIERS */}
      {currentAdminTab === 'suppliers' && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-5 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm">Quản lý Nhà cung cấp ({suppliers.length})</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold text-[10px]">
                <tr>
                  <th className="py-3 px-4">Doanh nghiệp</th>
                  <th className="py-3 px-4">Loại hình</th>
                  <th className="py-3 px-4">Xác minh</th>
                  <th className="py-3 px-4">Sản phẩm</th>
                  <th className="py-3 px-4">Phòng gom</th>
                  <th className="py-3 px-4">Đánh giá</th>
                  <th className="py-3 px-4 text-right">Hành động duyệt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {suppliers.map((s) => {
                  const prodCount = products.filter((p) => p.supplierId === s.id).length;
                  const roomCount = rooms.filter((r) => r.supplierId === s.id).length;

                  return (
                    <tr key={s.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        <div>{s.businessName}</div>
                        <span className="text-[10px] text-slate-400 font-normal">{s.sourceDescription}</span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">{s.supplierType}</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            s.verificationStatus === 'verified'
                              ? 'bg-[#D0FFA4]/40 text-emerald-800'
                              : s.verificationStatus === 'pending'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {s.verificationStatus}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-semibold">{prodCount} sp</td>
                      <td className="py-3.5 px-4 font-semibold">{roomCount} phòng</td>
                      <td className="py-3.5 px-4 font-bold text-amber-600">{s.rating.toFixed(1)} ★</td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center space-x-1.5">
                          {s.verificationStatus === 'pending' && (
                            <>
                              <button
                                onClick={() => onUpdateSupplierVerification(s.id, 'verified')}
                                className="px-2.5 py-1 bg-[#006EE9] text-white rounded-lg text-xs font-bold hover:bg-[#000181]"
                              >
                                Duyệt (Verify)
                              </button>
                              <button
                                onClick={() => onUpdateSupplierVerification(s.id, 'rejected')}
                                className="px-2.5 py-1 bg-rose-100 text-rose-700 rounded-lg text-xs font-bold hover:bg-rose-200"
                              >
                                Từ chối
                              </button>
                            </>
                          )}
                          {s.verificationStatus === 'verified' && (
                            <button
                              onClick={() => onUpdateSupplierVerification(s.id, 'suspended')}
                              className="px-2.5 py-1 border border-slate-300 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-100"
                            >
                              Đình chỉ
                            </button>
                          )}
                          {s.verificationStatus === 'suspended' && (
                            <button
                              onClick={() => onUpdateSupplierVerification(s.id, 'verified')}
                              className="px-2.5 py-1 border border-[#D0FFA4] text-[#000181] rounded-lg text-xs font-bold hover:bg-[#F4FFE8]"
                            >
                              Kích hoạt lại
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW: PRODUCTS */}
      {currentAdminTab === 'products' && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-5 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm">Danh mục Toàn bộ Sản phẩm ({products.length})</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold text-[10px]">
                <tr>
                  <th className="py-3 px-4">Sản phẩm</th>
                  <th className="py-3 px-4">Nhà cung cấp</th>
                  <th className="py-3 px-4">Ngành hàng</th>
                  <th className="py-3 px-4">Tồn kho</th>
                  <th className="py-3 px-4">Chi phí nội bộ</th>
                  <th className="py-3 px-4">Trạng thái</th>
                  <th className="py-3 px-4 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((p) => {
                  const supp = suppliers.find((s) => s.id === p.supplierId);
                  return (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-4 font-bold text-slate-900">{p.name}</td>
                      <td className="py-3 px-4 text-slate-600">{supp?.businessName || p.supplierId}</td>
                      <td className="py-3 px-4 text-slate-600">{p.category}</td>
                      <td className="py-3 px-4 font-semibold">{p.stockQuantity} {p.unit}</td>
                      <td className="py-3 px-4">
                        {p.unitCost ? (
                          <span className="inline-flex items-center gap-1 font-bold text-slate-700">
                            <Lock className="w-3 h-3 text-slate-400" />
                            {formatVND(p.unitCost)}
                          </span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            p.status === 'active' ? 'bg-[#D0FFA4]/40 text-emerald-800' : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => onToggleProductStatus(p.id)}
                          className="px-3 py-1 rounded-lg border border-slate-300 font-bold hover:bg-slate-100 text-xs text-slate-700"
                        >
                          {p.status === 'active' ? 'Vô hiệu hóa (Deactivate)' : 'Kích hoạt'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW: ROOMS */}
      {currentAdminTab === 'rooms' && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-5 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm">Toàn bộ Phòng gom trên nền tảng ({rooms.length})</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold text-[10px]">
                <tr>
                  <th className="py-3 px-4">Phòng gom</th>
                  <th className="py-3 px-4">Người tham gia</th>
                  <th className="py-3 px-4">Đã gom</th>
                  <th className="py-3 px-4">Trạng thái</th>
                  <th className="py-3 px-4">Giá chốt</th>
                  <th className="py-3 px-4 text-right">Hành động can thiệp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rooms.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-900 block">{r.productName}</span>
                      <span className="text-[11px] text-slate-400">ID: {r.id}</span>
                    </td>
                    <td className="py-3.5 px-4 font-bold">{r.participantCount} / {r.maxParticipants}</td>
                    <td className="py-3.5 px-4 font-bold">{r.totalQuantity} / {r.maxQuantity}</td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={r.status} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#000181]">
                      {r.finalPrice !== undefined ? formatVND(r.finalPrice) : 'Chưa chốt'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {r.status === 'active' && (
                        <button
                          onClick={() => setForceCloseModalRoomId(r.id)}
                          className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold transition"
                        >
                          Chốt phòng ngay (Force Close)
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW: ORDERS */}
      {currentAdminTab === 'orders' && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-5 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm">Lịch sử Giao dịch Đơn hàng & Snapshot Tài chính ({orders.length})</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold text-[10px]">
                <tr>
                  <th className="py-3 px-4">Mã đơn</th>
                  <th className="py-3 px-4">Sản phẩm</th>
                  <th className="py-3 px-4">Tiền hàng (GMV)</th>
                  <th className="py-3 px-4">Ship chia sẻ</th>
                  <th className="py-3 px-4">Buyer trả</th>
                  <th className="py-3 px-4">Phí sàn (Snapshot)</th>
                  <th className="py-3 px-4">Supplier Net</th>
                  <th className="py-3 px-4">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((o) => {
                  const snap = getOrderFinancialSnapshot(o);
                  return (
                    <tr key={o.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{o.id}</td>
                      <td className="py-3.5 px-4 font-bold">
                        {o.productName} ({o.quantity} sp)
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">{formatVND(o.productSubtotal)}</td>
                      <td className="py-3.5 px-4 text-slate-500">{formatVND(o.shippingFee)}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-800">{formatVND(o.totalAmount)}</td>
                      <td className="py-3.5 px-4 font-bold text-[#006EE9]">
                        {snap.isReversed
                          ? '0đ'
                          : `${formatVND(snap.effectiveCommission)} (${Math.round(snap.commissionRate * 100)}%)`}
                      </td>
                      <td className="py-3.5 px-4 font-black text-[#000181]">
                        {snap.isReversed ? '0đ' : formatVND(snap.effectiveNet)}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                          {o.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW: REFUNDS */}
      {currentAdminTab === 'refunds' && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-5 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm">Xử lý Yêu cầu Hoàn tiền ({refunds.length})</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold text-[10px]">
                <tr>
                  <th className="py-3 px-4">Mã yêu cầu</th>
                  <th className="py-3 px-4">Đơn hàng</th>
                  <th className="py-3 px-4">Người mua</th>
                  <th className="py-3 px-4">Lý do</th>
                  <th className="py-3 px-4">Trạng thái</th>
                  <th className="py-3 px-4 text-right">Thao tác duyệt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {refunds.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-slate-400">
                      Không có yêu cầu hoàn tiền nào đang chờ
                    </td>
                  </tr>
                ) : (
                  refunds.map((rf) => {
                    const isAlreadyPaidOut = payouts.some(
                      (p) => p.status === 'paid' && p.orderIds.includes(rf.orderId)
                    );

                    return (
                      <tr key={rf.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{rf.id}</td>
                        <td className="py-3.5 px-4 font-bold">
                          <div>{rf.orderId}</div>
                          {isAlreadyPaidOut && (
                            <span className="text-[10px] text-rose-600 font-bold block">
                              ⚠️ Refund after payout – manual reconciliation required.
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">{rf.userId}</td>
                        <td className="py-3.5 px-4 text-slate-700 max-w-xs">{rf.reason}</td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                              rf.status === 'refunded'
                                ? 'bg-teal-100 text-teal-800'
                                : rf.status === 'approved'
                                ? 'bg-[#D0FFA4]/40 text-emerald-800'
                                : rf.status === 'rejected'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {rf.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="inline-flex items-center space-x-2">
                            {rf.status === 'requested' && (
                              <button
                                onClick={() => onApproveRefund(rf.id)}
                                className="px-3 py-1 bg-[#006EE9] text-white rounded-lg text-xs font-bold hover:bg-[#000181]"
                              >
                                Phê duyệt (Approve)
                              </button>
                            )}
                            {rf.status === 'approved' && (
                              <button
                                onClick={() => onSimulateRefund(rf.id)}
                                className="px-3 py-1 bg-teal-600 text-white rounded-lg text-xs font-bold hover:bg-teal-700"
                              >
                                Mô phỏng hoàn tiền (Simulate Refund)
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW: VOUCHERS (Requirement 39 & 40: Admin Voucher Management) */}
      {currentAdminTab === 'vouchers' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Ticket className="w-5 h-5 text-[#006EE9]" />
                <span>Quản lý Mã ưu đãi & Chiến dịch Voucher ({vouchers.length})</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Phí nền tảng được tính trên giá trị sản phẩm sau voucher (`commissionableAmount = productSubtotal - voucherDiscount`). Nếu tài trợ bởi Platform (`platform`), Supplier vẫn nhận đủ doanh thu trên giá gốc.
              </p>
            </div>
            <button
              onClick={openCreateVoucherModal}
              className="px-4 py-2.5 rounded-xl bg-[#006EE9] hover:bg-[#000181] text-white text-white font-bold text-xs flex items-center space-x-1.5 shadow-md transition shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Tạo Voucher mới</span>
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold text-[10px]">
                  <tr>
                    <th className="py-3.5 px-4">Code</th>
                    <th className="py-3.5 px-4">Tên chương trình</th>
                    <th className="py-3.5 px-4">Loại / Giá trị</th>
                    <th className="py-3.5 px-4">Đơn tối thiểu / Giảm tối đa</th>
                    <th className="py-3.5 px-4">Nguồn tài trợ</th>
                    <th className="py-3.5 px-4">Lượt dùng</th>
                    <th className="py-3.5 px-4">Trạng thái</th>
                    <th className="py-3.5 px-4 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {vouchers.map((v) => {
                    const usedCount = voucherUsages.filter((u) => u.voucherId === v.id || u.voucherCode === v.code).length;
                    const totalDiscountGiven = voucherUsages
                      .filter((u) => u.voucherId === v.id || u.voucherCode === v.code)
                      .reduce((sum, u) => sum + u.discountAmount, 0);

                    return (
                      <tr key={v.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3.5 px-4">
                          <span className="font-mono font-black text-[#000181] bg-[#EFFBFF] border border-indigo-200 px-2.5 py-1 rounded-lg">
                            {v.code}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900">{v.name}</div>
                          <div className="text-[10px] text-slate-400">
                            {new Date(v.startAt).toLocaleDateString('vi-VN')} →{' '}
                            {new Date(v.endAt).toLocaleDateString('vi-VN')}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-[#000181]">
                          {v.type === 'fixed'
                            ? `Giảm ${formatVND(v.value)}`
                            : `Giảm ${Math.round((v.value <= 1 ? v.value * 100 : v.value))}%`}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">
                          <div>Min: <strong>{formatVND(v.minimumOrder || 0)}</strong></div>
                          {v.maxDiscount ? (
                            <div className="text-[10px] text-slate-400">Max: {formatVND(v.maxDiscount)}</div>
                          ) : null}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                              (v.fundedBy || 'platform') === 'platform'
                                ? 'bg-[#FAF0FF] text-indigo-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {v.fundedBy || 'platform'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-800">
                            {usedCount} / {v.usageLimit ?? '∞'} ({v.perUserLimit ?? 1}/user)
                          </div>
                          {totalDiscountGiven > 0 && (
                            <div className="text-[10px] text-[#000181] font-semibold">
                              Đã trợ giá: {formatVND(totalDiscountGiven)}
                            </div>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                              v.status === 'active'
                                ? 'bg-[#D0FFA4]/40 text-emerald-800'
                                : 'bg-slate-200 text-slate-600'
                            }`}
                          >
                            {v.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="inline-flex items-center space-x-1.5">
                            <button
                              onClick={() => openEditVoucherModal(v)}
                              className="px-2.5 py-1 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold inline-flex items-center gap-1"
                            >
                              <Edit2 className="w-3 h-3" />
                              <span>Sửa</span>
                            </button>
                            <button
                              onClick={() => onToggleVoucherStatus?.(v.id)}
                              className={`px-2.5 py-1 rounded-lg font-bold ${
                                v.status === 'active'
                                  ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                                  : 'bg-[#006EE9] text-white hover:bg-[#000181]'
                              }`}
                            >
                              {v.status === 'active' ? 'Deactivate' : 'Activate'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Voucher Usage History (Req 39) */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-3">
            <h4 className="font-bold text-slate-900 text-sm">
              Lịch sử Sử dụng Voucher (Voucher Redemptions: {voucherUsages.length})
            </h4>
            {voucherUsages.length === 0 ? (
              <p className="text-xs text-slate-400">Chưa có lượt áp dụng mã ưu đãi nào.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold text-[10px]">
                    <tr>
                      <th className="py-2.5 px-3">Mã Voucher</th>
                      <th className="py-2.5 px-3">User ID</th>
                      <th className="py-2.5 px-3">Order ID</th>
                      <th className="py-2.5 px-3">Số tiền giảm</th>
                      <th className="py-2.5 px-3">Thời gian</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {voucherUsages.map((u) => {
                      const v = vouchers.find((item) => item.id === u.voucherId);
                      return (
                        <tr key={u.id}>
                          <td className="py-2.5 px-3 font-mono font-bold text-[#000181]">
                            {u.voucherCode || v?.code || u.voucherId}
                          </td>
                          <td className="py-2.5 px-3 text-slate-600">{u.userId}</td>
                          <td className="py-2.5 px-3 font-mono text-slate-800">{u.orderId || '—'}</td>
                          <td className="py-2.5 px-3 font-bold text-[#000181]">
                            -{formatVND(u.discountAmount)}
                          </td>
                          <td className="py-2.5 px-3 text-slate-400">
                            {new Date(u.createdAt).toLocaleString('vi-VN')}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW: GROWTH & LOYALTY DASHBOARD (Requirements 44 & 45) */}
      {currentAdminTab === 'growth' && (() => {
        const shareEventsCount = roomEvents.filter((e) => e.eventType === 'shared').length;
        const inviteLinksCreated = Math.max(shareEventsCount + referrals.length, referrals.length);
        const referralClicks = referrals.length;
        const referralJoins = referrals.filter(
          (r) => r.status === 'joined' || r.status === 'completed'
        ).length;
        const completedReferralsCount = referrals.filter((r) => r.status === 'completed').length;
        const referralConversionRate =
          referralClicks > 0 ? Math.round((completedReferralsCount / referralClicks) * 100) : 0;
        const voucherRedemptionsCount = voucherUsages.length;
        const totalPointsIssued = loyaltyTransactions
          .filter((t) => t.points > 0)
          .reduce((sum, t) => sum + t.points, 0);

        const pointsByPurchase = loyaltyTransactions
          .filter((t) => t.type === 'purchase')
          .reduce((sum, t) => sum + t.points, 0);
        const pointsByReferral = loyaltyTransactions
          .filter((t) => t.type === 'referral')
          .reduce((sum, t) => sum + t.points, 0);
        const pointsByReview = loyaltyTransactions
          .filter((t) => t.type === 'review')
          .reduce((sum, t) => sum + t.points, 0);

        // Top active users by loyalty points
        const userPointsMap = new Map<string, number>();
        loyaltyTransactions.forEach((t) => {
          userPointsMap.set(t.userId, (userPointsMap.get(t.userId) || 0) + t.points);
        });
        const topActiveUsers = Array.from(userPointsMap.entries())
          .map(([userId, points]) => {
            const u = users.find((usr) => usr.id === userId);
            return { userId, name: u?.name || userId, email: u?.email || '', points };
          })
          .sort((a, b) => b.points - a.points)
          .slice(0, 5);

        return (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#000181]" />
                  <span>Growth & Social Commerce Dashboard</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Đo lường hiệu quả lan truyền phòng gom (Referral Funnel), sử dụng Voucher và điểm thưởng FlashPoints
                </p>
              </div>

              {/* 7 Growth Metrics Cards (Req 45) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-xs">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">
                    Invite links created
                  </span>
                  <div className="text-xl font-black text-slate-900 mt-1">{inviteLinksCreated}</div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">
                    Referral clicks
                  </span>
                  <div className="text-xl font-black text-slate-900 mt-1">{referralClicks}</div>
                </div>
                <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200">
                  <span className="text-[10px] font-bold text-blue-700 uppercase block">
                    Referral joins
                  </span>
                  <div className="text-xl font-black text-blue-700 mt-1">{referralJoins}</div>
                </div>
                <div className="p-4 rounded-2xl bg-[#F4FFE8]/80 border border-[#D0FFA4]">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase block">
                    Completed referrals
                  </span>
                  <div className="text-xl font-black text-[#000181] mt-1">
                    {completedReferralsCount}
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-teal-50/80 border border-teal-200">
                  <span className="text-[10px] font-bold text-teal-800 uppercase block">
                    Conversion rate
                  </span>
                  <div className="text-xl font-black text-teal-700 mt-1">
                    {referralConversionRate}%
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-[#EFFBFF]/80 border border-indigo-200">
                  <span className="text-[10px] font-bold text-indigo-800 uppercase block">
                    Voucher redemptions
                  </span>
                  <div className="text-xl font-black text-[#000181] mt-1">
                    {voucherRedemptionsCount}
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 col-span-2 sm:col-span-1">
                  <span className="text-[10px] font-bold text-amber-800 uppercase block">
                    Loyalty points issued
                  </span>
                  <div className="text-xl font-black text-amber-700 mt-1">
                    {totalPointsIssued} đ
                  </div>
                </div>
              </div>
            </div>

            {/* Admin Loyalty Breakdown & Top Active Users (Req 44) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-500" />
                  <span>Phân bổ Điểm thưởng FlashPoints theo Lý do (Points by Reason)</span>
                </h4>
                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                    <span>Hoàn tất nhận hàng (`purchase` • +10 điểm/đơn)</span>
                    <strong className="text-[#000181] font-black">{pointsByPurchase} điểm</strong>
                  </div>
                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                    <span>Giới thiệu bạn bè hoàn tất (`referral` • +20 điểm/lượt)</span>
                    <strong className="text-[#000181] font-black">{pointsByReferral} điểm</strong>
                  </div>
                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                    <span>Đánh giá đơn hàng (`review` • +5 điểm/đơn)</span>
                    <strong className="text-[#000181] font-black">{pointsByReview} điểm</strong>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#006EE9]" />
                  <span>Top Thành viên Tích cực (Top Active Users)</span>
                </h4>
                {topActiveUsers.length === 0 ? (
                  <p className="text-xs text-slate-400">Chưa có dữ liệu điểm thưởng.</p>
                ) : (
                  <div className="space-y-2.5 text-xs">
                    {topActiveUsers.map((u, idx) => (
                      <div
                        key={u.userId}
                        className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100"
                      >
                        <div className="flex items-center space-x-2.5">
                          <span className="w-6 h-6 rounded-lg bg-[#FAF0FF] text-indigo-800 font-black flex items-center justify-center text-[11px]">
                            #{idx + 1}
                          </span>
                          <div>
                            <div className="font-bold text-slate-900">{u.name}</div>
                            <div className="text-[10px] text-slate-400">{u.email}</div>
                          </div>
                        </div>
                        <span className="font-black text-amber-600 text-sm">{u.points} điểm</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {/* VOUCHER CREATE / EDIT MODAL (Req 39) */}
      {isVoucherFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 text-xs space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900">
                {editingVoucher ? `Chỉnh sửa Voucher ${editingVoucher.code}` : 'Tạo Mã ưu đãi (Voucher) mới'}
              </h3>
              <button
                type="button"
                onClick={() => setIsVoucherFormOpen(false)}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                Đóng
              </button>
            </div>

            <form onSubmit={handleSaveVoucherForm} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Mã Voucher (Code)</label>
                  <input
                    type="text"
                    required
                    value={vCode}
                    onChange={(e) => setVCode(e.target.value.toUpperCase())}
                    placeholder="VD: FLASH10"
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-mono uppercase"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Loại giảm giá (Type)</label>
                  <select
                    value={vType}
                    onChange={(e) => setVType(e.target.value as 'fixed' | 'percentage')}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="fixed">Số tiền cố định (VND)</option>
                    <option value="percentage">Phần trăm (%)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Tên chương trình (Name)</label>
                <input
                  type="text"
                  required
                  value={vName}
                  onChange={(e) => setVName(e.target.value)}
                  placeholder="VD: Ưu đãi Demo giảm 10.000đ"
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    {vType === 'fixed' ? 'Mức giảm (VND)' : 'Mức giảm (%)'}
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={vValue}
                    onChange={(e) => setVValue(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Đơn tối thiểu (VND)</label>
                  <input
                    type="number"
                    min={0}
                    value={vMinOrder}
                    onChange={(e) => setVMinOrder(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Giảm tối đa (VND)</label>
                  <input
                    type="number"
                    min={0}
                    value={vMaxDiscount}
                    onChange={(e) => setVMaxDiscount(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Ngày bắt đầu</label>
                  <input
                    type="date"
                    value={vStartAt}
                    onChange={(e) => setVStartAt(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Ngày kết thúc</label>
                  <input
                    type="date"
                    value={vEndAt}
                    onChange={(e) => setVEndAt(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tổng lượt dùng</label>
                  <input
                    type="number"
                    min={1}
                    value={vUsageLimit}
                    onChange={(e) => setVUsageLimit(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Giới hạn / User</label>
                  <input
                    type="number"
                    min={1}
                    value={vPerUserLimit}
                    onChange={(e) => setVPerUserLimit(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tài trợ bởi (Funded By)</label>
                  <select
                    value={vFundedBy}
                    onChange={(e) => setVFundedBy(e.target.value as 'platform' | 'supplier')}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="platform">Platform (Sàn)</option>
                    <option value="supplier">Supplier (NCC)</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsVoucherFormOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 font-bold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#006EE9] hover:bg-[#000181] text-white text-white font-bold shadow-md"
                >
                  Lưu Voucher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW: LOGISTICS & PICKUP POINT NETWORK (Phase 7 Req 19, 20, 36-42, 46, 53-55) */}
      {currentAdminTab === 'logistics' && (
        <div className="space-y-6">
          {(() => {
            const activeBatchesCount = deliveryBatches.filter(
              (b) => b.status !== 'completed' && b.status !== 'cancelled'
            ).length;
            const unitsInTransit = deliveryBatches
              .filter(
                (b) =>
                  b.status === 'picked_up_from_supplier' ||
                  b.status === 'in_transit' ||
                  b.status === 'arrived_at_pickup'
              )
              .reduce((sum, b) => sum + b.totalUnits, 0);
            const totalCap = pickupPoints.reduce((sum, p) => sum + p.capacity, 0);
            const totalLoad = pickupPoints.reduce((sum, p) => sum + p.currentLoad, 0);
            const capUtilization =
              totalCap > 0 ? Math.round((totalLoad / totalCap) * 100) : 0;
            const avgShipPerBuyer =
              deliveryBatches.length > 0
                ? Math.round(
                    deliveryBatches.reduce((sum, b) => sum + b.shippingPerBuyer, 0) /
                      deliveryBatches.length
                  )
                : 3000;
            const completedDeliveries = deliveryBatches.filter(
              (b) => b.status === 'completed' || b.status === 'arrived_at_pickup'
            ).length;

            // Req 36, 37, 38: Batch Efficiency & Simulated Logistics Savings
            const totalPooledOrders =
              deliveryBatches.reduce((sum, b) => sum + b.totalOrders, 0) ||
              validOrders.length;
            const totalBatchTrips = Math.max(1, deliveryBatches.length);
            const avoidedTrips = Math.max(0, totalPooledOrders - totalBatchTrips);
            const estIndividualShipping = totalPooledOrders * 20000;
            const actualSharedShipping = deliveryBatches.reduce(
              (sum, b) => sum + b.totalShippingFee,
              0
            );
            const estSaving = Math.max(0, estIndividualShipping - actualSharedShipping);

            return (
              <>
                {/* 6 Logistics KPI Cards (Req 19) */}
                <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                    <span className="text-[10px] font-bold uppercase text-slate-400">
                      Active Batches
                    </span>
                    <div className="text-xl font-black text-[#000181] mt-1">
                      {activeBatchesCount}
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      Lô giao đang điều phối
                    </span>
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                    <span className="text-[10px] font-bold uppercase text-slate-400">
                      Units In Transit
                    </span>
                    <div className="text-xl font-black text-[#000181] mt-1">
                      {unitsInTransit}
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      Đơn vị hàng đang giao
                    </span>
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                    <span className="text-[10px] font-bold uppercase text-slate-400">
                      Pickup Points
                    </span>
                    <div className="text-xl font-black text-slate-900 mt-1">
                      {pickupPoints.filter((p) => p.status !== 'inactive').length} /{' '}
                      {pickupPoints.length}
                    </div>
                    <span className="text-[10px] text-[#000181] font-bold block mt-0.5">
                      Điểm nhận đang hoạt động
                    </span>
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                    <span className="text-[10px] font-bold uppercase text-slate-400">
                      Pickup Capacity Utilization
                    </span>
                    <div className="text-xl font-black text-amber-600 mt-1">
                      {capUtilization}%
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      {totalLoad} / {totalCap} ngăn tủ đã lấp
                    </span>
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                    <span className="text-[10px] font-bold uppercase text-slate-400">
                      Average Shipping / Buyer
                    </span>
                    <div className="text-xl font-black text-[#000181] mt-1">
                      {formatVND(avgShipPerBuyer)}
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      Cước chia sẻ bình quân
                    </span>
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                    <span className="text-[10px] font-bold uppercase text-slate-400">
                      Completed Deliveries
                    </span>
                    <div className="text-xl font-black text-teal-700 mt-1">
                      {completedDeliveries}
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      Chuyến giao đến điểm nhận
                    </span>
                  </div>
                </div>

                {/* Batch Efficiency & Simulated Logistics Savings Banner (Req 36, 37, 38) */}
                <div className="bg-gradient-to-r from-indigo-50 via-emerald-50 to-teal-50 rounded-3xl border border-indigo-200 p-5 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-slate-900 text-sm flex items-center gap-1.5">
                        <Truck className="w-4 h-4 text-[#006EE9]" />
                        Hiệu suất Gom Đơn Vận Chuyển (Consolidated Last-Mile Analytics)
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-white text-[#000181] px-2.5 py-0.5 rounded-full border border-indigo-200">
                        <Sparkles className="w-3 h-3" />
                        Ước tính mô phỏng
                      </span>
                    </div>
                    <p className="text-slate-600">
                      Individual orders: <strong>{totalPooledOrders}</strong> → Batch deliveries:{' '}
                      <strong>{totalBatchTrips}</strong> •{' '}
                      <strong>Estimated Individual deliveries avoided: {avoidedTrips} chuyến</strong>
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 shrink-0">
                    <div className="bg-white px-4 py-2.5 rounded-2xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">
                        Est. Individual Shipping
                      </span>
                      <span className="text-sm font-bold text-slate-500 line-through">
                        {formatVND(estIndividualShipping)}
                      </span>
                    </div>
                    <div className="bg-white px-4 py-2.5 rounded-2xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">
                        Shared Shipping
                      </span>
                      <span className="text-sm font-black text-[#000181]">
                        {formatVND(actualSharedShipping)}
                      </span>
                    </div>
                    <div className="bg-[#006EE9] text-white px-4 py-2.5 rounded-2xl shadow-sm">
                      <span className="text-[10px] text-emerald-100 font-bold uppercase block">
                        Estimated Logistics Saving
                      </span>
                      <span className="text-base font-black">{formatVND(estSaving)}</span>
                    </div>
                  </div>
                </div>
              </>
            );
          })()}

          {/* Consolidated Delivery Batches Management Table (Req 20, 46, 53-55) */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#006EE9]" />
                  <span>
                    Điều phối Lô Giao Hàng Chung (Admin Batch Management: {deliveryBatches.length})
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Cập nhật trạng thái tuần tự có xác nhận: Confirmed → Picked Up → In Transit → Arrived → Completed
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold text-[10px]">
                  <tr>
                    <th className="py-3.5 px-4">Delivery Batch</th>
                    <th className="py-3.5 px-4">Product & Room</th>
                    <th className="py-3.5 px-4">Orders / Units</th>
                    <th className="py-3.5 px-4">Pickup Point & Slot</th>
                    <th className="py-3.5 px-4">Shared Shipping</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Admin Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {deliveryBatches.map((batch) => {
                    const room = rooms.find((r) => r.id === batch.roomId);
                    const batchIssues = deliveryIssues.filter((i) => i.batchId === batch.id);

                    return (
                      <tr key={batch.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3.5 px-4">
                          <span className="font-mono font-black text-slate-900 block">
                            #{batch.id}
                          </span>
                          <span className="text-[10px] text-slate-400">{batch.carrierName}</span>
                          {batchIssues.length > 0 && (
                            <span className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-rose-100 text-rose-700">
                              <AlertTriangle className="w-2.5 h-2.5" />
                              {batchIssues[0].issueType}
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-slate-900 block">
                            {batch.productName || room?.productName || 'Sản phẩm phòng gom'}
                          </span>
                          <span className="text-[10px] text-slate-400">Room: {batch.roomId}</span>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-slate-800">
                          {batch.totalOrders} đơn ({batch.totalUnits} sp)
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-slate-800 block">
                            {batch.pickupPointName || room?.pickupPoint}
                          </span>
                          <span className="text-[10px] text-[#006EE9] font-semibold">
                            {batch.pickupWindow || room?.pickupSlotSnapshot || '26 Oct • 18:00 – 21:00'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-black text-[#000181] block">
                            {formatVND(batch.shippingPerBuyer)} / buyer
                          </span>
                          <span className="text-[10px] text-slate-400">
                            Tổng chuyến: {formatVND(batch.totalShippingFee)}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase border ${
                              batch.status === 'completed'
                                ? 'bg-teal-100 text-teal-800 border-teal-300'
                                : batch.status === 'arrived_at_pickup'
                                ? 'bg-[#D0FFA4]/40 text-emerald-800 border-[#D0FFA4]'
                                : batch.status === 'in_transit'
                                ? 'bg-[#FAF0FF] text-purple-800 border-purple-300'
                                : batch.status === 'delivery_issue'
                                ? 'bg-rose-100 text-rose-800 border-rose-300'
                                : 'bg-amber-100 text-amber-800 border-amber-300'
                            }`}
                          >
                            {batch.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="inline-flex flex-wrap items-center justify-end gap-1.5">
                            {batch.status === 'planned' && (
                              <button
                                onClick={() =>
                                  setPendingBatchTransition({
                                    batch,
                                    nextStatus: 'confirmed',
                                    title: 'Admin xác nhận lô giao hàng chung',
                                    description: `Xác nhận đóng gói ${batch.totalUnits} sản phẩm cho ${batch.totalOrders} đơn`,
                                  })
                                }
                                className="px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] cursor-pointer"
                              >
                                Confirmed
                              </button>
                            )}
                            {batch.status === 'confirmed' && (
                              <button
                                onClick={() =>
                                  setPendingBatchTransition({
                                    batch,
                                    nextStatus: 'picked_up_from_supplier',
                                    title: 'Đã bàn giao cho xe giao hàng chung',
                                    description: `${batch.carrierName} đã nhận kiện hàng từ Nhà cung cấp`,
                                  })
                                }
                                className="px-2.5 py-1.5 rounded-lg bg-[#006EE9] hover:bg-[#000181] text-white text-white font-bold text-[11px] cursor-pointer"
                              >
                                Picked Up
                              </button>
                            )}
                            {batch.status === 'picked_up_from_supplier' && (
                              <button
                                onClick={() =>
                                  setPendingBatchTransition({
                                    batch,
                                    nextStatus: 'in_transit',
                                    title: 'Đang vận chuyển đến điểm nhận',
                                    description: `Xe tải nhẹ đang di chuyển tới ${batch.pickupPointName}`,
                                  })
                                }
                                className="px-2.5 py-1.5 rounded-lg bg-[#E8A0FF] hover:bg-[#D0FFA4] text-[#000181] text-white font-bold text-[11px] cursor-pointer"
                              >
                                In Transit
                              </button>
                            )}
                            {batch.status === 'in_transit' && (
                              <button
                                onClick={() =>
                                  setPendingBatchTransition({
                                    batch,
                                    nextStatus: 'arrived_at_pickup',
                                    title: `Đã đến điểm nhận ${batch.pickupPointName}`,
                                    description:
                                      'Tất cả đơn hàng trong lô được mở khóa trạng thái Sẵn sàng nhận hàng (Ready for pickup)',
                                  })
                                }
                                className="px-2.5 py-1.5 rounded-lg bg-[#006EE9] hover:bg-[#000181] text-white text-white font-bold text-[11px] cursor-pointer"
                              >
                                Arrived
                              </button>
                            )}
                            {batch.status === 'arrived_at_pickup' && (
                              <button
                                onClick={() =>
                                  setPendingBatchTransition({
                                    batch,
                                    nextStatus: 'completed',
                                    title: 'Hoàn tất lô giao hàng chung',
                                    description:
                                      'Toàn bộ đơn hàng trong lô đã hoàn tất bàn giao và giải phóng sức chứa tủ Locker',
                                  })
                                }
                                className="px-2.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-[11px] cursor-pointer"
                              >
                                Completed
                              </button>
                            )}
                            <button
                              onClick={() => setInspectingBatch(batch)}
                              className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                            >
                              <Eye className="w-3 h-3" />
                              Đơn gộp
                            </button>
                            {batch.status !== 'completed' && batch.status !== 'cancelled' && (
                              <button
                                onClick={() => setIssueBatch(batch)}
                                className="px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-[11px] cursor-pointer"
                              >
                                Issue
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pickup Point Network Management Table (Req 40, 41, 42, 44) */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#000181]" />
                  <span>
                    Mạng lưới Điểm Nhận Hàng & Locker (Pickup Point Network: {pickupPoints.length})
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Chỉ Admin được tạo và quản lý điểm nhận; Nhà cung cấp chỉ được chọn từ các điểm nhận đang hoạt động.
                </p>
              </div>
              <button
                onClick={openCreatePointModal}
                className="px-4 py-2 rounded-xl bg-[#006EE9] hover:bg-[#000181] text-white text-white font-bold text-xs flex items-center gap-1.5 shadow-sm self-start sm:self-auto cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Thêm Điểm Nhận (Create Pickup Point)
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold text-[10px]">
                  <tr>
                    <th className="py-3.5 px-4">Pickup Point</th>
                    <th className="py-3.5 px-4">Type</th>
                    <th className="py-3.5 px-4">Operating Hours</th>
                    <th className="py-3.5 px-4">Capacity Utilization</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pickupPoints.map((pt) => {
                    const pct = Math.min(
                      100,
                      Math.round((pt.currentLoad / Math.max(1, pt.capacity)) * 100)
                    );
                    return (
                      <tr key={pt.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-slate-900 block">{pt.name}</span>
                          <span className="text-[11px] text-slate-400">{pt.address}</span>
                        </td>
                        <td className="py-3.5 px-4 uppercase font-bold text-[10px] text-slate-600">
                          {pt.type}
                        </td>
                        <td className="py-3.5 px-4 font-medium text-slate-700">
                          {pt.operatingHours}
                        </td>
                        <td className="py-3.5 px-4 w-56">
                          <div className="flex justify-between text-[11px] font-bold mb-1">
                            <span>
                              {pt.currentLoad} / {pt.capacity} occupied
                            </span>
                            <span>{pct}%</span>
                          </div>
                          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                pct >= 100
                                  ? 'bg-rose-500'
                                  : pct >= 75
                                  ? 'bg-amber-500'
                                  : 'bg-emerald-500'
                              }`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase ${
                              pt.status === 'active'
                                ? 'bg-[#D0FFA4]/40 text-[#000181]'
                                : pt.status === 'full'
                                ? 'bg-rose-100 text-rose-700'
                                : 'bg-slate-200 text-slate-600'
                            }`}
                          >
                            {pt.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="inline-flex items-center gap-2">
                            <button
                              onClick={() => openEditPointModal(pt)}
                              className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                            >
                              <Edit2 className="w-3 h-3" />
                              Edit
                            </button>
                            <button
                              onClick={() => onTogglePickupPointStatus?.(pt.id)}
                              className={`px-2.5 py-1.5 rounded-lg font-bold text-[11px] cursor-pointer ${
                                pt.status === 'inactive'
                                  ? 'bg-[#006EE9] text-white'
                                  : 'bg-slate-100 text-slate-700 hover:bg-rose-50 hover:text-rose-700'
                              }`}
                            >
                              {pt.status === 'inactive' ? 'Activate' : 'Deactivate'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ADMIN BATCH STATUS CONFIRMATION MODAL (Req 20, 55) */}
      {pendingBatchTransition && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900">
                Xác nhận cập nhật trạng thái Lô giao hàng?
              </h3>
              <button
                onClick={() => setPendingBatchTransition(null)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <div>
                Lô giao hàng: <strong>#{pendingBatchTransition.batch.id}</strong>
              </div>
              <div>
                Chuyển từ: <strong className="uppercase">{pendingBatchTransition.batch.status}</strong> →{' '}
                <strong className="uppercase text-[#000181]">
                  {pendingBatchTransition.nextStatus}
                </strong>
              </div>
              <div className="text-slate-600 pt-1">{pendingBatchTransition.description}</div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setPendingBatchTransition(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 font-bold cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={() => {
                  onAdvanceBatchStatus?.(
                    pendingBatchTransition.batch.id,
                    pendingBatchTransition.nextStatus,
                    pendingBatchTransition.title,
                    pendingBatchTransition.description
                  );
                  setPendingBatchTransition(null);
                }}
                className="px-4 py-2 rounded-xl bg-[#006EE9] hover:bg-[#000181] text-white text-white font-bold cursor-pointer"
              >
                Xác nhận cập nhật
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADMIN BATCH DETAIL & MASKED ORDER LIST MODAL (Req 46, 54) */}
      {inspectingBatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[88vh] overflow-y-auto p-6 shadow-2xl border border-slate-200 text-xs space-y-4">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase text-[#006EE9]">
                  BATCH ORDER LIST & TIMELINE
                </span>
                <h3 className="text-base font-black text-slate-900">
                  Lô giao #{inspectingBatch.id} • {inspectingBatch.pickupPointName}
                </h3>
              </div>
              <button
                onClick={() => setInspectingBatch(null)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="border border-slate-200 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold text-[10px]">
                  <tr>
                    <th className="py-2.5 px-3">Order ID</th>
                    <th className="py-2.5 px-3">Buyer (Masked)</th>
                    <th className="py-2.5 px-3">Quantity</th>
                    <th className="py-2.5 px-3">Pickup Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders
                    .filter(
                      (o) =>
                        (o.deliveryBatchId === inspectingBatch.id ||
                          o.roomId === inspectingBatch.roomId) &&
                        o.status !== 'cancelled'
                    )
                    .map((o) => {
                      const buyer = users.find((u) => u.id === o.userId);
                      return (
                        <tr key={o.id}>
                          <td className="py-2.5 px-3 font-mono font-bold">{o.id}</td>
                          <td className="py-2.5 px-3 font-semibold">
                            {getMaskedBuyerName(buyer?.name || 'Nguyễn Minh Anh')}
                          </td>
                          <td className="py-2.5 px-3 font-bold">{o.quantity}</td>
                          <td className="py-2.5 px-3 uppercase font-bold text-[10px] text-[#000181]">
                            {o.status}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>

            <div className="space-y-2">
              <div className="font-bold text-slate-800">Nhật ký sự kiện (Delivery Events):</div>
              {deliveryEvents
                .filter((e) => e.batchId === inspectingBatch.id)
                .map((ev) => (
                  <div
                    key={ev.id}
                    className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex justify-between gap-2"
                  >
                    <div>
                      <div className="font-bold text-slate-900">{ev.title}</div>
                      {ev.description && (
                        <div className="text-[11px] text-slate-500">{ev.description}</div>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 shrink-0">
                      {new Date(ev.createdAt).toLocaleTimeString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* ADMIN REPORT ISSUE MODAL (Req 39) */}
      {issueBatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onReportDeliveryIssue?.(
                issueBatch.id,
                adminIssueType,
                adminIssueNote.trim() || `Sự cố: ${adminIssueType}`
              );
              setIssueBatch(null);
              setAdminIssueNote('');
            }}
            className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-xs space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900">
                Ghi nhận sự cố Lô #{issueBatch.id}
              </h3>
              <button
                type="button"
                onClick={() => setIssueBatch(null)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Loại sự cố</label>
              <select
                value={adminIssueType}
                onChange={(e) => setAdminIssueType(e.target.value as DeliveryIssueType)}
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-semibold"
              >
                <option value="Delayed">Delayed</option>
                <option value="Damaged shipment">Damaged shipment</option>
                <option value="Pickup point unavailable">Pickup point unavailable</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Ghi chú xử lý</label>
              <textarea
                rows={3}
                value={adminIssueNote}
                onChange={(e) => setAdminIssueNote(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIssueBatch(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 font-bold cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-rose-600 text-white font-bold cursor-pointer"
              >
                Lưu sự cố
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ADMIN CREATE / EDIT PICKUP POINT MODAL (Req 40, 41) */}
      {isPointModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <form
            onSubmit={handleSavePointForm}
            className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 text-xs space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase text-[#006EE9] block">
                  PICKUP POINT NETWORK MANAGEMENT
                </span>
                <h3 className="text-base font-black text-slate-900">
                  {editingPoint ? 'Chỉnh sửa Điểm Nhận Hàng' : 'Tạo Điểm Nhận Hàng Mới'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsPointModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Tên điểm nhận *</label>
                <input
                  type="text"
                  required
                  value={ptName}
                  onChange={(e) => setPtName(e.target.value)}
                  placeholder="VD: KTX A – Locker 03"
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Loại hình (Type) *</label>
                <select
                  value={ptType}
                  onChange={(e) => setPtType(e.target.value as PickupPointType)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-semibold"
                >
                  <option value="locker">Locker (Tủ thông minh)</option>
                  <option value="dorm">Dorm (Sảnh Ký túc xá)</option>
                  <option value="apartment">Apartment (Sảnh Chung cư)</option>
                  <option value="store">Store (Cửa hàng tiện lợi)</option>
                  <option value="community">Community (Điểm cộng đồng)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Địa chỉ hiển thị *</label>
              <input
                type="text"
                required
                value={ptAddress}
                onChange={(e) => setPtAddress(e.target.value)}
                placeholder="VD: 105 Nguyễn Hữu Thọ, Phường Tân Phong, Quận 7, TP.HCM"
                className="w-full p-2.5 rounded-xl border border-slate-300"
              />
            </div>

            {/* Requirement 21: Admin Pickup Address Selection via VietnamAddressSelector */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <span className="text-[10px] font-black uppercase text-[#006EE9] tracking-wider block">
                ĐỊA LÝ & TỌA ĐỘ BẢN ĐỒ (VIETNAM ADDRESS SELECTOR)
              </span>
              <VietnamAddressSelector
                initialAddress={{
                  provinceName: ptProvince,
                  districtName: ptDistrict,
                  wardName: ptWard,
                  street: ptStreet,
                  houseNumber: ptHouseNumber,
                }}
                onAddressChange={(vAddr) => {
                  if (vAddr.provinceName) setPtProvince(vAddr.provinceName);
                  if (vAddr.districtName) setPtDistrict(vAddr.districtName);
                  if (vAddr.wardName) setPtWard(vAddr.wardName);
                  if (vAddr.street !== undefined) setPtStreet(vAddr.street);
                  if (vAddr.houseNumber !== undefined) setPtHouseNumber(vAddr.houseNumber);
                  if (vAddr.formattedAddress) setPtAddress(vAddr.formattedAddress);
                  if (vAddr.latitude) setPtLat(vAddr.latitude);
                  if (vAddr.longitude) setPtLng(vAddr.longitude);
                }}
                onConfirmAddress={(vAddr, geocoded) => {
                  if (vAddr.provinceName) setPtProvince(vAddr.provinceName);
                  if (vAddr.districtName) setPtDistrict(vAddr.districtName);
                  if (vAddr.wardName) setPtWard(vAddr.wardName);
                  if (vAddr.street !== undefined) setPtStreet(vAddr.street);
                  if (vAddr.houseNumber !== undefined) setPtHouseNumber(vAddr.houseNumber);
                  if (vAddr.formattedAddress) setPtAddress(vAddr.formattedAddress);
                  if (geocoded) {
                    setPtLat(geocoded.latitude);
                    setPtLng(geocoded.longitude);
                  }
                }}
                compact={true}
                className="border-0 p-0 shadow-none bg-transparent"
              />

              <div className="grid grid-cols-2 gap-2.5 pt-1 border-t border-slate-200">
                <div>
                  <label className="text-[10px] font-bold text-slate-600 block mb-0.5">Vĩ độ (Latitude)</label>
                  <input
                    type="number"
                    step="0.000001"
                    value={ptLat}
                    onChange={(e) => setPtLat(Number(e.target.value))}
                    className="w-full p-2 rounded-lg border border-slate-300 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-600 block mb-0.5">Kinh độ (Longitude)</label>
                  <input
                    type="number"
                    step="0.000001"
                    value={ptLng}
                    onChange={(e) => setPtLng(Number(e.target.value))}
                    className="w-full p-2 rounded-lg border border-slate-300 text-xs font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Sức chứa (Capacity)</label>
                <input
                  type="number"
                  min={1}
                  value={ptCapacity}
                  onChange={(e) => setPtCapacity(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Đang chứa (Load)</label>
                <input
                  type="number"
                  min={0}
                  value={ptCurrentLoad}
                  onChange={(e) => setPtCurrentLoad(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Khoảng cách (m)</label>
                <input
                  type="number"
                  min={50}
                  value={ptDistance}
                  onChange={(e) => setPtDistance(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Giờ mở cửa</label>
                <input
                  type="text"
                  value={ptHours}
                  onChange={(e) => setPtHours(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Liên hệ</label>
                <input
                  type="text"
                  value={ptContact}
                  onChange={(e) => setPtContact(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Hướng dẫn nhận hàng (Cách nhận hàng)
              </label>
              <textarea
                rows={3}
                value={ptInstructions}
                onChange={(e) => setPtInstructions(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsPointModalOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 font-bold cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#006EE9] hover:bg-[#000181] text-white text-white font-bold shadow-md cursor-pointer"
              >
                Lưu Điểm Nhận
              </button>
            </div>
          </form>
        </div>
      )}

      {/* VIEW: COMPLIANCE (Phase 8 Req 29, 30, 33) */}
      {currentAdminTab === 'compliance' && (
        <AdminComplianceTab
          suppliers={suppliers}
          verificationDocuments={verificationDocuments}
          products={products}
          productReports={productReports}
          complaints={complaints}
          complaintMessages={complaintMessages}
          privacyRequests={privacyRequests}
          reviews={reviews}
          moderationActions={moderationActions}
          auditEvents={auditEvents}
          complianceChecklist={complianceChecklist}
          onUpdateSupplierVerification={onUpdateSupplierVerification}
          onReviewDocument={(docId, st, note) => onReviewDocument?.(docId, st, note)}
          onModerateProduct={(prodId, act, rsn) => onModerateProduct?.(prodId, act, rsn)}
          onResolveProductReport={(repId, st, note) => onResolveProductReport?.(repId, st, note)}
          onAdminUpdateComplaint={(cmpId, st, msg, res) =>
            onAdminUpdateComplaint?.(cmpId, st, msg, res)
          }
          onAdminUpdatePrivacyRequest={(reqId, st, stage, note) =>
            onAdminUpdatePrivacyRequest?.(reqId, st, stage, note)
          }
          onModerateReview={(revId, isMod, rsn) => onModerateReview?.(revId, isMod, rsn)}
          onUpdateChecklistItem={(itemId, st, note) =>
            onUpdateChecklistItem?.(itemId, st, note)
          }
        />
      )}

      {/* VIEW: REPORTS (Requirement 26: Admin Analytics) */}
      {currentAdminTab === 'reports' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              Báo cáo Phân tích Thị trường & Tài chính (Admin Analytics)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Dữ liệu tổng hợp thực tế từ toàn bộ chu trình gom đơn, phí nền tảng và đối soát
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-slate-400">GMV (Tổng tiền hàng hợp lệ)</span>
              <div className="text-lg font-black text-slate-900">{formatVND(gmv)}</div>
            </div>
            <div className="p-4 rounded-2xl bg-[#EFFBFF]/70 border border-indigo-100 space-y-1">
              <span className="text-[#000181] font-semibold">Platform Revenue (Phí sàn)</span>
              <div className="text-lg font-black text-[#000181]">{formatVND(platformRevenue)}</div>
            </div>
            <div className="p-4 rounded-2xl bg-[#F4FFE8]/70 border border-emerald-100 space-y-1">
              <span className="text-emerald-800 font-semibold">Supplier Payouts (Đã giải ngân)</span>
              <div className="text-lg font-black text-[#000181]">{formatVND(completedPayoutsAmount)}</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-slate-400">Average Commission / Order</span>
              <div className="text-lg font-black text-[#006EE9]">{formatVND(avgCommissionPerOrder)}</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-slate-400">Average Buyer Savings</span>
              <div className="text-lg font-black text-[#000181]">{formatVND(avgSavingPerOrder)} / đơn</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-slate-400">Successful Group Rate</span>
              <div className="text-lg font-black text-teal-700">{successRate}%</div>
            </div>
            <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-100 space-y-1">
              <span className="text-rose-700 font-semibold">Refund Rate (Tỉ lệ hoàn tiền)</span>
              <div className="text-lg font-black text-rose-600">{refundRate}%</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-slate-400">Quy mô nhóm bình quân</span>
              <div className="text-lg font-black text-slate-900">{avgGroupSize} người / phòng</div>
            </div>
          </div>
        </div>
      )}

      {/* FORCE CLOSE ROOM MODAL */}
      {forceCloseModalRoomId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 text-xs space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="text-base font-black text-slate-900">Xác nhận Can thiệp Chốt phòng?</h3>
              <p className="text-slate-500 mt-1">
                Phòng gom sẽ kết thúc ngay lập tức và khóa mức giá cuối cùng (finalPrice) dựa trên số lượng gom thực tế hiện tại.
              </p>
            </div>
            <div className="pt-2 flex items-center space-x-3">
              <button
                type="button"
                onClick={() => setForceCloseModalRoomId(null)}
                className="w-1/2 py-2.5 rounded-xl border border-slate-300 font-bold"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={() => {
                  onForceCloseRoom(forceCloseModalRoomId);
                  setForceCloseModalRoomId(null);
                  showToast('Đã chốt phòng gom thành công.');
                }}
                className="w-1/2 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold transition shadow-md"
              >
                CHỐT PHÒNG NGAY
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
