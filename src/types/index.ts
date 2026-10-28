// ==========================================
// FLASHGROUP V3/V5 TYPES & DATA MODELS
// ==========================================

// 1. User & Auth Models
export type UserRole = 'buyer' | 'supplier' | 'admin';

export type UserStatus = 'active' | 'suspended';

export type User = {
  id: string;
  name: string;
  email: string;
  password: string; // Demo auth only - not for production
  role: UserRole;
  avatar?: string;
  phone?: string;
  preferredPickupPoint?: string;
  status: UserStatus;
  createdAt: string;
};

// 2. Supplier Models
export type SupplierType =
  | 'manufacturer'
  | 'official_distributor'
  | 'local_retailer'
  | 'wholesaler';

export type SupplierVerificationStatus =
  | 'unverified'
  | 'pending'
  | 'identity_verified'
  | 'business_verified'
  | 'document_verified'
  | 'verified'
  | 'rejected'
  | 'suspended';

export type Supplier = {
  id: string;
  userId: string;
  businessName: string;
  legalName?: string;
  supplierType: SupplierType;
  verificationStatus: SupplierVerificationStatus;
  businessRegistration?: string;
  businessRegistrationNumber?: string;
  taxCode?: string;
  legalRepresentative?: string;
  businessAddress?: string;
  contactPhone?: string;
  email?: string;
  location?: string;
  complaintContact?: string;
  returnPolicy?: string;
  sourceDescription: string;
  rating: number;
  totalReviews: number;
  verifiedAt?: string;
  verifiedBy?: string;
  suspensionReason?: string;
  suspendedAt?: string;
  suspendedBy?: string;
  createdAt: string;
  isDemo: boolean;
};

// 3. Product Models
export type ProductStatus =
  | 'active'
  | 'inactive'
  | 'out_of_stock'
  | 'temporarily_hidden'
  | 'evidence_requested'
  | 'permanently_deactivated';

export type Product = {
  id: string;
  supplierId: string;
  name: string;
  category: string;
  brand?: string;
  unit: string;
  description: string;
  image: string;
  origin?: string;
  manufacturer?: string;
  organizationResponsibleName?: string;
  organizationResponsibleAddress?: string;
  quantityOrWeight?: string;
  ingredients?: string;
  usageInstructions?: string;
  warnings?: string;
  expiryDate?: string;
  batchNumber?: string;
  complianceDocumentReferences?: string[];
  foodComplianceStatus?: string;
  stockQuantity: number;
  minimumOrderQuantity: number;
  unitCost?: number; // Private to Supplier/Admin only (Req 16)
  warranty?: string;
  sourceNote: string;
  isSponsored?: boolean;
  suspensionReason?: string;
  suspendedAt?: string;
  suspendedBy?: string;
  status: ProductStatus;
  isDemo: boolean;
  createdAt: string;
  updatedAt: string;
};

// 4. Group Room & Pricing Models
export type GroupRoomStatus =
  | 'draft'
  | 'active'
  | 'full'
  | 'closed'
  | 'successful'
  | 'cancelled';

export type PriceTier = {
  minQuantity: number;
  maxQuantity?: number;
  price: number;
};

export type GroupRoom = {
  id: string;
  productId: string;
  supplierId: string;

  productName: string;
  category: string;
  productImage: string;
  unit: string;

  supplierName: string;

  participantCount: number;
  totalQuantity: number;

  maxParticipants: number;
  maxQuantity: number;

  priceTiers: PriceTier[];
  initialPrice: number;

  startAt: string;
  endAt: string;

  finalPrice?: number;
  finalQuantity?: number;
  closedAt?: string;

  pickupPoint: string;
  pickupAddress: string;

  // Phase 7 Logistics & Pickup Assignment / Snapshot Fields (Req 8, 9, 16, 37)
  pickupPointId?: string;
  pickupSlotId?: string;
  pickupPointName?: string;
  pickupSlotSnapshot?: string;
  shippingPerBuyerSnapshot?: number;
  normalShippingEstimate?: number;

  totalShippingFee: number;

  // Geographic & Location Hierarchy (Phase 9 Refinement)
  country?: string;
  provinceOrCity?: string;
  area?: string;
  locality?: string;
  latitude?: number;
  longitude?: number;

  distance: string;
  distanceMeters: number;

  mapCoords: {
    x: number;
    y: number;
  };

  emoji: string;
  description: string;
  isSponsored?: boolean;

  status: GroupRoomStatus;
};

// 5. Participation Model
export type GroupParticipation = {
  id: string;
  roomId: string;
  userId: string;

  quantity: number;

  joinedAt: string;

  status:
    | 'reserved'
    | 'awaiting_payment'
    | 'paid'
    | 'cancelled';
};

// 6. Order Models
export type OrderStatus =
  | 'awaiting_payment'
  | 'paid'
  | 'preparing'
  | 'in_transit'
  | 'ready_for_pickup'
  | 'picked_up'
  | 'pickup_overdue'
  | 'cancelled'
  | 'refunded';

export type Order = {
  id: string;

  roomId: string;
  participationId: string;
  userId: string;
  supplierId?: string;

  productName: string;
  unit?: string;
  quantity: number;

  unitPrice: number;
  productSubtotal: number;

  shippingFee: number;

  totalAmount: number;

  // Phase 5 Financial Snapshot Fields (Req 4 & Req 20)
  commissionRate?: number;
  platformCommission?: number;
  supplierGross?: number;
  supplierNet?: number;

  // Phase 6 Voucher Financial Snapshot Fields (Req 35, 36, 37, 38)
  voucherCode?: string;
  voucherDiscount?: number;
  voucherFundedBy?: 'platform' | 'supplier';

  pickupPoint: string;
  pickupAddress: string;

  // Phase 7 Order Pickup Snapshot Fields (Req 31, 45)
  pickupPointId?: string;
  pickupPointName?: string;
  pickupWindow?: string;
  deliveryBatchId?: string;

  // Phase 8 Tax Boundary & Contract Snapshot Fields (Req 6, 25)
  supplierTaxCode?: string;
  invoiceReference?: string;
  taxTimestamp?: string;
  contractSnapshotId?: string;

  pickupCode: string;

  status: OrderStatus;

  paymentMethod?: string;

  createdAt: string;
  paidAt?: string;
  preparingAt?: string;
  inTransitAt?: string;
  readyForPickupAt?: string;
  pickedUpAt?: string;
};

// 7. Notification Models
export type NotificationType =
  | 'price_unlock'
  | 'room_ending'
  | 'room_closed'
  | 'payment'
  | 'order_update'
  | 'pickup_ready'
  | 'refund'
  | 'payout'
  | 'system';

export type Notification = {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  roomId?: string;
  orderId?: string;
  read: boolean;
  createdAt: string;
  eventKey?: string; // For deduplication
};

// 8. Review Model
export type ReviewModerationReason =
  | 'illegal_content'
  | 'harassment'
  | 'spam'
  | 'personal_data_exposure'
  | 'unrelated_content'
  | 'prohibited_content';

export type Review = {
  id: string;
  orderId: string;
  userId: string;
  supplierId: string;
  productRating: number;
  supplierRating: number;
  pickupRating: number;
  comment?: string;
  isModerated?: boolean;
  moderationReason?: ReviewModerationReason;
  moderatedBy?: string;
  moderatedAt?: string;
  createdAt: string;
};

// 9. Refund Models
export type RefundStatus =
  | 'requested'
  | 'approved'
  | 'rejected'
  | 'refunded';

export type RefundRequest = {
  id: string;
  orderId: string;
  userId: string;
  reason: string;
  status: RefundStatus;
  createdAt: string;
  reviewedAt?: string;
};

  // 10. Phase 5: Supplier Payout & Finance Models (Req 5 & 11)
export type PayoutStatus =
  | 'pending'
  | 'approved'
  | 'paid'
  | 'rejected';

export type SupplierPayout = {
  id: string;
  supplierId: string;
  supplierName?: string;
  amount: number;
  status: PayoutStatus;
  orderCount: number;
  orderIds: string[];
  periodStart?: string;
  periodEnd?: string;
  requestedAt: string;
  approvedAt?: string;
  paidAt?: string;
  note?: string;
};

// ==========================================
// 11. PHASE 6: SOCIAL COMMERCE MODELS
// ==========================================

// Referral Model (Req 6)
export type ReferralStatus =
  | 'clicked'
  | 'registered'
  | 'joined'
  | 'completed';

export type Referral = {
  id: string;
  referrerUserId: string;
  referredUserId?: string;
  referredUserName?: string;
  roomId?: string;
  status: ReferralStatus;
  createdAt: string;
  completedAt?: string;
};

// Room Event Model (Req 12)
export type RoomEventType =
  | 'joined'
  | 'quantity_added'
  | 'price_unlocked'
  | 'shared'
  | 'room_full'
  | 'room_closed';

export type RoomEvent = {
  id: string;
  roomId: string;
  userId?: string;
  eventType: RoomEventType;
  metadata?: Record<string, unknown>;
  createdAt: string;
};

// Group Chat & Reactions Models (Req 16, 22, 23)
export type ReactionType = '👍' | '🔥' | '🎉' | '❤️';

export type MessageReaction = {
  messageId: string;
  userId: string;
  reaction: ReactionType;
  createdAt: string;
};

export type GroupMessage = {
  id: string;
  roomId: string;
  userId: string;
  userName?: string;
  message: string;
  createdAt: string;
  deletedAt?: string;
};

// Loyalty Points (FlashPoints) Model (Req 26)
export type LoyaltyTransactionType =
  | 'purchase'
  | 'referral'
  | 'review'
  | 'redeem'
  | 'adjustment';

export type LoyaltyTransaction = {
  id: string;
  userId: string;
  points: number;
  type: LoyaltyTransactionType;
  referenceId?: string;
  description: string;
  createdAt: string;
};

// Voucher & Voucher Usage Models (Req 30, 32, 37)
export type VoucherFundedBy = 'platform' | 'supplier';

export type Voucher = {
  id: string;
  code: string;
  name: string;
  type: 'fixed' | 'percentage';
  value: number;
  minimumOrder?: number;
  maxDiscount?: number;
  startAt: string;
  endAt: string;
  usageLimit?: number;
  perUserLimit?: number;
  fundedBy?: VoucherFundedBy;
  organizer?: string;
  eligibleProducts?: string;
  eligibleBuyers?: string;
  terms?: string;
  specialPromotionRegime?: boolean;
  status: 'active' | 'inactive';
  createdAt?: string;
};

export type VoucherUsage = {
  id: string;
  voucherId: string;
  voucherCode?: string;
  userId: string;
  orderId?: string;
  discountAmount: number;
  createdAt: string;
};

// ==========================================
// 12. PHASE 7: HYPERLOCAL LOGISTICS MODELS
// ==========================================

// Pickup Point Model (Req 1)
export type PickupPointType =
  | 'locker'
  | 'dorm'
  | 'apartment'
  | 'store'
  | 'community';

export type PickupPointStatus =
  | 'active'
  | 'inactive'
  | 'full';

export type PickupPoint = {
  id: string;

  name: string;

  type: PickupPointType;

  address: string;

  country?: string;
  provinceOrCity?: string;
  area?: string;
  district?: string;
  ward?: string;
  locality?: string;
  street?: string;
  houseNumber?: string;

  latitude?: number;
  longitude?: number;

  capacity: number;

  currentLoad: number;

  operatingHours: string;

  contactInfo?: string;

  instructions?: string;

  distance?: string;
  distanceMeters?: number;
  demoDistance?: string;
  demoDistanceMeters?: number;

  mapCoords?: {
    x: number;
    y: number;
  };

  status: PickupPointStatus;

  isDemo: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type LocationModel = {
  country: string;
  provinceOrCity: string;
  area: string;
  locality?: string;
  pickupPoint?: string;
  latitude: number;
  longitude: number;
};

// Pickup Slot Model (Req 6)
export type PickupSlot = {
  id: string;

  pickupPointId: string;

  date: string;

  startTime: string;
  endTime: string;

  capacity: number;
  reservedCount: number;

  status:
    | 'available'
    | 'full'
    | 'closed';
  createdAt?: string;
};

// Shared Delivery Batch Model (Req 12, 17, 54)
export type DeliveryBatchStatus =
  | 'planned'
  | 'confirmed'
  | 'picked_up_from_supplier'
  | 'in_transit'
  | 'arrived_at_pickup'
  | 'completed'
  | 'cancelled'
  | 'delivery_issue';

export type DeliveryBatch = {
  id: string;

  batchCode?: string;

  roomId: string;
  supplierId: string;

  pickupPointId: string;
  pickupSlotId?: string;
  pickupPointName?: string;
  pickupAddress?: string;
  pickupWindow?: string;
  productName?: string;
  carrierName?: string;
  trackingNote?: string;

  totalUnits: number;
  totalOrders: number;

  totalShippingCost?: number;
  totalShippingFee: number;

  shippingPerBuyer: number;

  status: DeliveryBatchStatus;

  plannedAt?: string;
  confirmedAt?: string;
  pickedUpAt?: string;
  dispatchedAt?: string;
  inTransitAt?: string;
  arrivedAt?: string;
  completedAt?: string;
  createdAt?: string;
};

// Delivery Event Model (Req 48)
export type DeliveryEvent = {
  id: string;

  batchId: string;

  status: string;

  message?: string;
  title?: string;
  description?: string;

  createdAt: string;
};

// Logistics Issue Model (Req 54, 55)
export type DeliveryIssueType =
  | 'Delayed'
  | 'Damaged shipment'
  | 'Pickup point unavailable'
  | 'Other';

export type DeliveryIssue = {
  id: string;
  batchId: string;
  type?: DeliveryIssueType | string;
  issueType?: DeliveryIssueType | string;
  description?: string;
  note?: string;
  reportedBy?: string;
  status: 'open' | 'resolved';
  createdAt: string;
  resolvedAt?: string;
};

// ==========================================
// 13. PHASE 8: LEGAL TRANSPARENCY, PRIVACY & COMPLIANCE MODELS
// ==========================================

// Supplier Verification & Category Compliance Documents (Req 1, 4, 34, 35)
export type ComplianceDocumentType =
  | 'business_registration'
  | 'tax_registration'
  | 'product_self_declaration'
  | 'food_safety_document'
  | 'origin_document'
  | 'authorization_document'
  | 'trademark_authorization'
  | 'other';

export type SupplierVerificationDocument = {
  id: string;
  supplierId: string;
  productId?: string;
  category?: string;
  documentType: ComplianceDocumentType;
  documentTitle: string;
  documentNumber?: string;
  issuedBy?: string;
  issueDate?: string;
  expiryDate?: string;
  fileMetadata?: {
    fileName?: string;
    fileSize?: string;
    mimeType?: string;
    note?: string;
  };
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  reviewNote?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
};

// Purpose-Specific Consent Records (Req 15, 16, 17)
export type ConsentPurpose =
  | 'account_required'
  | 'order_fulfillment'
  | 'pickup_logistics'
  | 'marketing'
  | 'personalized_recommendations'
  | 'precise_location'
  | 'referral_tracking'
  | 'analytics_optional';

export type ConsentRecord = {
  id: string;
  userId: string;
  purpose: ConsentPurpose;
  isRequired: boolean;
  accepted: boolean;
  policyVersion: string;
  source: string;
  timestamp: string;
  withdrawnAt?: string;
};

// Privacy Requests & Account Deletion Workflow (Req 14, 18)
export type PrivacyRequestType =
  | 'access'
  | 'withdraw_consent'
  | 'deletion'
  | 'restriction'
  | 'objection'
  | 'export';

export type AccountDeletionStage =
  | 'requested'
  | 'identity_check'
  | 'processing'
  | 'completed'
  | 'partially_retained';

export type PrivacyRequest = {
  id: string;
  userId: string;
  userName?: string;
  requestType: PrivacyRequestType;
  deletionStage?: AccountDeletionStage;
  status: 'submitted' | 'in_review' | 'completed' | 'partially_retained' | 'rejected';
  details: string;
  retainedCategoriesExplanation?: string;
  adminNote?: string;
  processedBy?: string;
  createdAt: string;
  updatedAt?: string;
};

// Complaint & Dispute Center (Req 8, 9, 10)
export type ComplaintType =
  | 'Product problem'
  | 'Incorrect information'
  | 'Delivery issue'
  | 'Payment issue'
  | 'Supplier issue'
  | 'Refund issue'
  | 'Safety issue'
  | 'Other';

export type ComplaintStatus =
  | 'submitted'
  | 'acknowledged'
  | 'investigating'
  | 'awaiting_buyer'
  | 'awaiting_supplier'
  | 'resolved'
  | 'rejected'
  | 'escalated';

export type ComplaintEvidenceItem = {
  id: string;
  fileName: string;
  fileType: string;
  description?: string;
  uploadedAt: string;
};

export type ComplaintCase = {
  id: string;
  userId: string;
  userName?: string;
  supplierId?: string;
  supplierName?: string;
  orderId?: string;
  roomId?: string;
  complaintType: ComplaintType;
  description: string;
  evidenceMetadata: ComplaintEvidenceItem[];
  status: ComplaintStatus;
  submittedAt: string;
  acknowledgementDeadline: string;
  acknowledgedAt?: string;
  resolvedAt?: string;
  resolution?: string;
  updatedAt?: string;
};

export type ComplaintMessage = {
  id: string;
  complaintId: string;
  senderId: string;
  senderName: string;
  senderRole: 'buyer' | 'supplier' | 'admin' | 'system';
  message: string;
  createdAt: string;
};

// Product Safety Reporting (Req 26)
export type ProductReportReason =
  | 'unsafe_product'
  | 'incorrect_information'
  | 'expired_product'
  | 'counterfeit_suspicion'
  | 'prohibited_product'
  | 'missing_origin_information'
  | 'other';

export type ProductReport = {
  id: string;
  productId: string;
  productName: string;
  supplierId?: string;
  roomId?: string;
  reporterUserId: string;
  reason: ProductReportReason;
  description: string;
  status: 'open' | 'investigating' | 'action_taken' | 'dismissed';
  adminActionNote?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
};

// Moderation & Suspension Actions (Req 11, 27, 28)
export type ModerationActionType =
  | 'temporarily_hide'
  | 'request_supplier_evidence'
  | 'reinstate'
  | 'permanently_deactivate'
  | 'suspend_supplier'
  | 'reinstate_supplier'
  | 'moderate_review'
  | 'restore_review';

export type ModerationAction = {
  id: string;
  targetType: 'product' | 'supplier' | 'review' | 'message';
  targetId: string;
  targetName?: string;
  action: ModerationActionType;
  reason: string;
  actorId: string;
  actorName: string;
  createdAt: string;
};

// Immutable Transaction Contract Snapshot (Req 6, 25, 37)
export type TransactionSnapshot = {
  id: string;
  orderId: string;
  userId: string;
  sellerId: string;
  productSnapshot: {
    id: string;
    name: string;
    unit: string;
    origin?: string;
    manufacturer?: string;
    organizationResponsibleName?: string;
    organizationResponsibleAddress?: string;
    quantityOrWeight?: string;
    warranty?: string;
    expiryDate?: string;
    batchNumber?: string;
  };
  sellerSnapshot: {
    id: string;
    businessName: string;
    legalName?: string;
    taxCode?: string;
    businessRegistrationNumber?: string;
    businessAddress?: string;
    contactPhone?: string;
    complaintContact?: string;
    returnPolicy?: string;
  };
  quantity: number;
  unitPrice: number;
  discount: number;
  fees: number;
  shipping: number;
  finalPrice: number;
  paymentMethod: string;
  pickupMethod: string;
  termsVersion: string;
  sellerPolicyVersion: string;
  returnPolicyVersion: string;
  privacyVersion: string;
  supplierTaxCode?: string;
  invoiceReference: string;
  confirmationEvent: string;
  timestamp: string;
};

// Append-Only Electronic Transaction & Compliance Audit Trail (Req 7, 30)
export type AuditEventType =
  | 'order_confirmed'
  | 'payment_simulated'
  | 'room_joined'
  | 'price_locked'
  | 'supplier_changed_order_status'
  | 'refund_requested'
  | 'refund_processed'
  | 'pickup_confirmed'
  | 'supplier_verified'
  | 'supplier_suspended'
  | 'product_suspended'
  | 'review_moderated'
  | 'complaint_submitted'
  | 'complaint_updated'
  | 'privacy_request_submitted'
  | 'consent_updated';

export type AuditEvent = {
  id: string;
  actorId: string;
  actorName?: string;
  actorRole?: string;
  timestamp: string;
  recordId: string;
  eventType: AuditEventType;
  category: 'transaction' | 'compliance' | 'privacy' | 'moderation';
  safeMetadata: Record<string, unknown>;
};

// Versioned Legal Documents (Req 31)
export type LegalDocumentSlug =
  | 'terms_of_use'
  | 'privacy_policy'
  | 'marketplace_operating_rules'
  | 'seller_policy'
  | 'transaction_policy'
  | 'return_refund_policy'
  | 'complaint_dispute_policy'
  | 'shipping_pickup_policy'
  | 'promotion_voucher_terms'
  | 'referral_program_terms'
  | 'community_review_rules';

export type LegalDocument = {
  slug: LegalDocumentSlug;
  title: string;
  version: string;
  effectiveDate: string;
  lastUpdated: string;
  summary: string;
  content: string;
};

// Internal Compliance Checklist (Req 33)
export type ComplianceChecklistStatus =
  | 'not_reviewed'
  | 'in_progress'
  | 'completed'
  | 'not_applicable';

export type ComplianceChecklistItem = {
  id: string;
  itemKey: string;
  title: string;
  legalBasis: string;
  description: string;
  status: ComplianceChecklistStatus;
  internalNote?: string;
  updatedBy?: string;
  updatedAt: string;
};

// Re-export Vietnam Administrative & Address Types
export * from './address';



