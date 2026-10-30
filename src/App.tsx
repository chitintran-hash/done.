import React, { useState, useEffect, useMemo } from 'react';
import {
  Zap,
  MapPin,
  Clock,
  Users,
  ShieldCheck,
  Share2,
  CheckCircle2,
  Lock,
  Bell,
  MessageSquare,
  ArrowRight,
  TrendingDown,
  ShoppingBag,
  Sparkles,
  Copy,
  ChevronRight,
  Package,
  Layers,
  RefreshCw,
  X,
  CreditCard,
  Truck,
  Heart,
  Star,
  RotateCcw,
  AlertTriangle,
  Loader2,
  Receipt,
  HelpCircle,
  Ticket,
  MessageCircle,
  Flame,
  Scale,
  Flag,
  Building2,
  FileCheck,
  Info,
  EyeOff,
  Home,
  Plus,
} from 'lucide-react';

import {
  User,
  UserStatus,
  Supplier,
  SupplierVerificationDocument,
  Product,
  GroupRoom,
  GroupParticipation,
  Order,
  OrderStatus,
  Notification,
  Review,
  ReviewModerationReason,
  RefundRequest,
  SupplierPayout,
  PayoutStatus,
  Referral,
  RoomEvent,
  RoomEventType,
  GroupMessage,
  MessageReaction,
  ReactionType,
  LoyaltyTransaction,
  LoyaltyTransactionType,
  Voucher,
  VoucherUsage,
  PickupPoint,
  PickupSlot,
  DeliveryBatch,
  DeliveryBatchStatus,
  DeliveryEvent,
  DeliveryIssue,
  DeliveryIssueType,
  ConsentPurpose,
  ConsentRecord,
  PrivacyRequest,
  PrivacyRequestType,
  AccountDeletionStage,
  ComplaintCase,
  ComplaintType,
  ComplaintStatus,
  ComplaintEvidenceItem,
  ComplaintMessage,
  ProductReport,
  ProductReportReason,
  ModerationAction,
  TransactionSnapshot,
  AuditEvent,
  AuditEventType,
  LegalDocument,
  LegalDocumentSlug,
  ComplianceChecklistItem,
  ComplianceChecklistStatus
} from './types';
import {
  getCurrentPrice,
  getNextTier,
  getSharedShipping,
  getRemainingSeconds,
  canCheckout,
  formatVND,
  formatTime,
  safeParseStorage,
  FLASHGROUP_V3_KEYS,
  DEFAULT_PLATFORM_COMMISSION_RATE,
  calculateOrderFinancials,
  validateVoucher,
  getSafeFirstName,
  generateUniquePickupCode,
  canTransitionBatchStatus,
  getSupplierVerificationDisplay,
  getRankingExplanation,
  calculateWorkingDaysDeadline
} from './utils/pricing';
import {
  createInitialUsers,
  createInitialSuppliers,
  createInitialProducts,
  createInitialRooms,
  createInitialParticipations,
  createInitialOrders,
  createInitialPayouts,
  createInitialNotifications,
  createInitialReviews,
  createInitialRefunds,
  createInitialVouchers,
  createInitialRoomEvents,
  createInitialGroupMessages,
  createInitialMessageReactions,
  createInitialLoyaltyTransactions,
  createInitialReferrals,
  createInitialPickupPoints,
  createInitialPickupSlots,
  createInitialDeliveryBatches,
  createInitialDeliveryEvents,
  createInitialDeliveryIssues,
  createInitialVerificationDocuments,
  createInitialConsentRecords,
  createInitialPrivacyRequests,
  createInitialComplaintCases,
  createInitialComplaintMessages,
  createInitialProductReports,
  createInitialModerationActions,
  createInitialTransactionSnapshots,
  createInitialAuditEvents,
  createInitialLegalDocuments,
  createInitialComplianceChecklist
} from './data/initialData';

import { StatusBadge } from './components/StatusBadge';
import { JoinModal } from './components/JoinModal';
import { UnlockModal } from './components/UnlockModal';
import { AuthModalOrPage } from './components/AuthModalOrPage';
import { Navbar } from './components/Navbar';
import { NotificationCenter } from './components/NotificationCenter';
import { BuyerProfileView } from './components/BuyerProfileView';
import { FavoritesView } from './components/FavoritesView';
import { ReviewModal } from './components/ReviewModal';
import { RefundModal } from './components/RefundModal';
import { SupplierProductsView } from './components/SupplierProductsView';
import { SupplierGroupRoomsView } from './components/SupplierGroupRoomsView';
import { SupplierOrdersView } from './components/SupplierOrdersView';
import { SupplierPickupView } from './components/SupplierPickupView';
import { SupplierLogisticsView } from './components/SupplierLogisticsView';
import { SupplierAnalyticsView } from './components/SupplierAnalyticsView';
import { SupplierEarningsView } from './components/SupplierEarningsView';
import { AdminDashboardView } from './components/AdminDashboardView';
import { SearchFilterBar, FilterState } from './components/SearchFilterBar';
import { SupabaseSetupScreen } from './components/SupabaseSetupScreen';
import { BusinessModelModal } from './components/BusinessModelModal';
import { BuyerReceiptModal } from './components/BuyerReceiptModal';
import { ShareRoomModal } from './components/ShareRoomModal';
import { RoomSocialPanel } from './components/RoomSocialPanel';
import { Footer } from './components/Footer';
import { LegalCenterModal } from './components/LegalCenterModal';
import { SellerInfoModal } from './components/SellerInfoModal';
import { ProductReportModal } from './components/ProductReportModal';
import { TransactionSnapshotModal } from './components/TransactionSnapshotModal';
import { PrivacyCenterView } from './components/PrivacyCenterView';
import { ComplaintCenterView } from './components/ComplaintCenterView';
import { SectionHeader } from './components/ui/SectionHeader';
import { CTAButton } from './components/ui/CTAButton';
import { TrustHighlightStrip } from './components/TrustHighlightStrip';
import { HowItWorksSection } from './components/HowItWorksSection';
import { PickupDeliverySection } from './components/PickupDeliverySection';
import { SupplierValueSection } from './components/SupplierValueSection';
import { FaqSection } from './components/FaqSection';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { InteractiveFlashMap } from './components/InteractiveFlashMap';
import {
  LegalPolicyPageView,
  HowItWorksPage,
  PickupPointsDirectoryPage,
  SuppliersDirectoryPage,
  HelpCenterPage,
  ContactPage,
} from './components/InformationalPages';
import { SmartMatchingSection } from './components/SmartMatchingSection';
import { AreaExplorerSection } from './components/AreaExplorerSection';

import { isSupabaseConfigured, supabase } from './lib/supabase';
import { authService } from './services/authService';
import { roomService } from './services/roomService';
import { productService } from './services/productService';
import { orderService } from './services/orderService';
import { notificationService } from './services/notificationService';
import { supplierService } from './services/supplierService';
import { reviewService } from './services/reviewService';
import { refundService } from './services/refundService';
import { financeService } from './services/financeService';
import { socialService } from './services/socialService';
import { complianceService } from './services/complianceService';
import {
  fetchPickupPointsFromDb,
  fetchPickupSlotsFromDb,
  fetchDeliveryBatchesFromDb,
  fetchDeliveryEventsFromDb,
  fetchDeliveryIssuesFromDb,
  upsertPickupPointInDb,
  createDeliveryBatchViaRpc,
  advanceDeliveryStatusViaRpc,
  confirmPickupViaRpc,
  insertDeliveryIssueInDb
} from './services/logisticsService';
import { subscribeToRealtimeChanges } from './services/realtimeService';
import { VietnamAddressSelector } from './components/VietnamAddressSelector';
import { savedBuyerAddressService } from './services/vietnamAddressService';
import { SavedBuyerAddress, VietnamAddress } from './types/address';
import { OfflineBanner } from './components/OfflineBanner';
import { MobileBottomNav } from './components/MobileBottomNav';
import { ToastContainer, ToastMessage, ToastType } from './components/ToastContainer';
import { NotFoundView } from './components/NotFoundView';
import { DemoCheckModal } from './components/DemoCheckModal';
import { EmptyState } from './components/ui/EmptyState';
import { useDebounce } from './utils/useDebounce';
import { SkeletonRoom } from './components/ui/Skeleton';
import { PresenterPanel } from './components/PresenterPanel';
import { GuidedDemoOverlay, GUIDED_DEMO_STEPS } from './components/GuidedDemoOverlay';


export * from './types';
export * from './utils/pricing';

export default function FlashGroupApp() {
  const location = useLocation();
  const navigate = useNavigate();

  // ==========================================
  // 0️⃣  AUTH & CONFIG INITIALIZATION
  // ==========================================
  const [loading, setLoading] = useState<boolean>(true);
  // Dual-mode state (Supabase online vs Local prototype fallback) - default true for seamless presentation
  const [useLocalDemoMode, setUseLocalDemoMode] = useState<boolean>(true);

  useEffect(() => {
    // Initialise Supabase auth session (if configured and not in local demo mode)
    const initAuth = async () => {
      try {
        if (isSupabaseConfigured && !useLocalDemoMode) {
          const { data: { session }, error } = await supabase.auth.getSession();
          if (error) {
            console.error('Supabase auth session error:', error);
          }
          if (session?.user) {
            // Fetch full profile via authService
            const user = await authService.getCurrentUser();
            if (user) setAuthenticatedUser(user);
          }
        }
      } catch (e) {
        console.error('Auth initialization failed:', e);
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, [isSupabaseConfigured, useLocalDemoMode]);

  const [isDataLoaded, setIsDataLoaded] = useState<boolean>(!isSupabaseConfigured);
  // ==========================================
  // 1. STATE MANAGEMENT & LOCALSTORAGE V3
  // ==========================================

  // Users & Auth
  const [users, setUsers] = useState<User[]>(() => {
    const list = safeParseStorage<User[]>('flashgroup_v3_users', createInitialUsers());
    let normalized = [...list];

    // 1. Ensure tranchitin2006@gmail.com is present & admin
    const tinIdx = normalized.findIndex((u) => u.email.toLowerCase() === 'tranchitin2006@gmail.com');
    if (tinIdx >= 0) {
      normalized[tinIdx] = {
        ...normalized[tinIdx],
        role: 'admin',
        password: '123456',
        status: 'active',
        name: normalized[tinIdx].name || 'Trần Chí Tín (Admin)',
      };
    } else {
      normalized.unshift({
        id: 'admin-tranchitin',
        name: 'Trần Chí Tín (Admin)',
        email: 'tranchitin2006@gmail.com',
        password: '123456',
        role: 'admin',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
        phone: '0909123456',
        status: 'active',
        createdAt: new Date().toISOString(),
      });
    }

    // 2. Ensure tutrungkien2006@gmail.com is present & admin
    const kienIdx = normalized.findIndex((u) => u.email.toLowerCase() === 'tutrungkien2006@gmail.com');
    if (kienIdx >= 0) {
      normalized[kienIdx] = {
        ...normalized[kienIdx],
        role: 'admin',
        password: '123456',
        status: 'active',
        name: normalized[kienIdx].name || 'Từ Trung Kiên (Admin)',
      };
    } else {
      normalized.unshift({
        id: 'admin-tutrungkien',
        name: 'Từ Trung Kiên (Admin)',
        email: 'tutrungkien2006@gmail.com',
        password: '123456',
        role: 'admin',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
        phone: '0906025608',
        status: 'active',
        createdAt: new Date().toISOString(),
      });
    }

    try {
      localStorage.setItem('flashgroup_v3_users', JSON.stringify(normalized));
    } catch {
      // ignore
    }
    return normalized;
  });

  const [authenticatedUser, setAuthenticatedUser] = useState<User | null>(() => {
    return safeParseStorage<User | null>('flashgroup_v3_auth_user', null);
  });

  const [presentedDemoUser, setPresentedDemoUser] = useState<User | null>(() => {
    if (typeof window !== 'undefined' && (window.location.search.includes('presentation=true') || window.location.search.includes('demo=true'))) {
      return createInitialUsers()[0];
    }
    return null;
  });

  // Current active user for view rendering: demo persona override if active, else real authenticated user
  const currentUser: User | null = presentedDemoUser || authenticatedUser;

  // Presentation permission: Owner Admin (tranchitin2006@gmail.com with role: admin) or query param
  const isPresentationAllowed = Boolean(
    (authenticatedUser && authenticatedUser.role === 'admin') ||
    (typeof window !== 'undefined' && (window.location.search.includes('presentation=true') || window.location.search.includes('demo=true')))
  );

  // Auth modal state for public visitor login/register
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | 'forgot_password'>('login');
  const [authModalRole, setAuthModalRole] = useState<'buyer' | 'supplier'>('buyer');

  const openLoginModal = (roleOrEvent?: 'buyer' | 'supplier' | React.MouseEvent | unknown) => {
    setAuthModalMode('login');
    if (typeof roleOrEvent === 'string' && (roleOrEvent === 'buyer' || roleOrEvent === 'supplier')) {
      setAuthModalRole(roleOrEvent);
    } else {
      setAuthModalRole('buyer');
    }
    setIsAuthModalOpen(true);
  };

  const openRegisterModal = (initialRole: 'buyer' | 'supplier' = 'buyer') => {
    setAuthModalMode('register');
    setAuthModalRole(initialRole);
    setIsAuthModalOpen(true);
  };

  // Suppliers & Products
  const [suppliers, setSuppliers] = useState<Supplier[]>(() => {
    return safeParseStorage<Supplier[]>('flashgroup_v3_suppliers', createInitialSuppliers());
  });

  const [products, setProducts] = useState<Product[]>(() => {
    return safeParseStorage<Product[]>('flashgroup_v3_products', createInitialProducts());
  });

  // Group Rooms & Participations
  const [rooms, setRooms] = useState<GroupRoom[]>(() => {
    return safeParseStorage<GroupRoom[]>('flashgroup_v3_rooms', createInitialRooms());
  });

  const [participations, setParticipations] = useState<GroupParticipation[]>(() => {
    const stored = safeParseStorage<GroupParticipation[]>('flashgroup_v3_participations', []);
    return stored && stored.length > 0 ? stored : createInitialParticipations();
  });

  // Orders, Notifications, Reviews, Refunds, Favorites, Payouts & Commission Rate
  const [orders, setOrders] = useState<Order[]>(() => {
    const stored = safeParseStorage<Order[]>('flashgroup_v3_orders', []);
    return stored && stored.length > 0 ? stored : createInitialOrders();
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    return safeParseStorage<Notification[]>('flashgroup_v3_notifications', createInitialNotifications());
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    return safeParseStorage<Review[]>('flashgroup_v3_reviews', createInitialReviews());
  });

  const [refunds, setRefunds] = useState<RefundRequest[]>(() => {
    return safeParseStorage<RefundRequest[]>('flashgroup_v3_refunds', createInitialRefunds());
  });

  const [favoriteRoomIds, setFavoriteRoomIds] = useState<string[]>(() => {
    return safeParseStorage<string[]>('flashgroup_v3_favorites', []);
  });

  const [payouts, setPayouts] = useState<SupplierPayout[]>(() => {
    const stored = safeParseStorage<SupplierPayout[]>('flashgroup_v3_payouts', []);
    return stored && stored.length > 0 ? stored : createInitialPayouts();
  });

  const [commissionRate, setCommissionRate] = useState<number>(() => {
    return safeParseStorage<number>('flashgroup_v3_commission_rate', DEFAULT_PLATFORM_COMMISSION_RATE);
  });

  // Phase 6: Social Commerce, Referrals, Activity Feed, Chat, Loyalty & Vouchers
  const [referrals, setReferrals] = useState<Referral[]>(() => {
    return safeParseStorage<Referral[]>('flashgroup_v3_referrals', createInitialReferrals());
  });

  const [roomEvents, setRoomEvents] = useState<RoomEvent[]>(() => {
    return safeParseStorage<RoomEvent[]>('flashgroup_v3_room_events', createInitialRoomEvents());
  });

  const [groupMessages, setGroupMessages] = useState<GroupMessage[]>(() => {
    return safeParseStorage<GroupMessage[]>('flashgroup_v3_group_messages', createInitialGroupMessages());
  });

  const [messageReactions, setMessageReactions] = useState<MessageReaction[]>(() => {
    return safeParseStorage<MessageReaction[]>('flashgroup_v3_message_reactions', createInitialMessageReactions());
  });

  const [loyaltyTransactions, setLoyaltyTransactions] = useState<LoyaltyTransaction[]>(() => {
    return safeParseStorage<LoyaltyTransaction[]>('flashgroup_v3_loyalty_transactions', createInitialLoyaltyTransactions());
  });

  const [vouchers, setVouchers] = useState<Voucher[]>(() => {
    return safeParseStorage<Voucher[]>('flashgroup_v3_vouchers', createInitialVouchers());
  });

  const [voucherUsages, setVoucherUsages] = useState<VoucherUsage[]>(() => {
    return safeParseStorage<VoucherUsage[]>('flashgroup_v3_voucher_usages', []);
  });

  // Phase 7: Hyperlocal Logistics, Pickup Points, Pickup Slots, Consolidated Batches & Events
  const [pickupPoints, setPickupPoints] = useState<PickupPoint[]>(() => {
    return safeParseStorage<PickupPoint[]>('flashgroup_v3_pickup_points', createInitialPickupPoints());
  });

  const [pickupSlots, setPickupSlots] = useState<PickupSlot[]>(() => {
    return safeParseStorage<PickupSlot[]>('flashgroup_v3_pickup_slots', createInitialPickupSlots());
  });

  const [deliveryBatches, setDeliveryBatches] = useState<DeliveryBatch[]>(() => {
    return safeParseStorage<DeliveryBatch[]>('flashgroup_v3_delivery_batches', createInitialDeliveryBatches());
  });

  const [deliveryEvents, setDeliveryEvents] = useState<DeliveryEvent[]>(() => {
    return safeParseStorage<DeliveryEvent[]>('flashgroup_v3_delivery_events', createInitialDeliveryEvents());
  });

  const [deliveryIssues, setDeliveryIssues] = useState<DeliveryIssue[]>(() => {
    return safeParseStorage<DeliveryIssue[]>('flashgroup_v3_delivery_issues', createInitialDeliveryIssues());
  });

  // Phase 8: Legal Transparency, Consumer Protection, Personal Data Privacy & Marketplace Compliance
  const [verificationDocuments, setVerificationDocuments] = useState<SupplierVerificationDocument[]>(() => {
    return safeParseStorage<SupplierVerificationDocument[]>(
      'flashgroup_v3_verification_documents',
      createInitialVerificationDocuments()
    );
  });

  const [consentRecords, setConsentRecords] = useState<ConsentRecord[]>(() => {
    return safeParseStorage<ConsentRecord[]>('flashgroup_v3_consent_records', createInitialConsentRecords());
  });

  const [privacyRequests, setPrivacyRequests] = useState<PrivacyRequest[]>(() => {
    return safeParseStorage<PrivacyRequest[]>('flashgroup_v3_privacy_requests', createInitialPrivacyRequests());
  });

  const [complaintCases, setComplaintCases] = useState<ComplaintCase[]>(() => {
    return safeParseStorage<ComplaintCase[]>('flashgroup_v3_complaint_cases', createInitialComplaintCases());
  });

  const [complaintMessages, setComplaintMessages] = useState<ComplaintMessage[]>(() => {
    return safeParseStorage<ComplaintMessage[]>('flashgroup_v3_complaint_messages', createInitialComplaintMessages());
  });

  const [productReports, setProductReports] = useState<ProductReport[]>(() => {
    return safeParseStorage<ProductReport[]>('flashgroup_v3_product_reports', createInitialProductReports());
  });

  const [moderationActions, setModerationActions] = useState<ModerationAction[]>(() => {
    return safeParseStorage<ModerationAction[]>('flashgroup_v3_moderation_actions', createInitialModerationActions());
  });

  const [transactionSnapshots, setTransactionSnapshots] = useState<TransactionSnapshot[]>(() => {
    return safeParseStorage<TransactionSnapshot[]>(
      'flashgroup_v3_transaction_snapshots',
      createInitialTransactionSnapshots()
    );
  });

  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>(() => {
    return safeParseStorage<AuditEvent[]>('flashgroup_v3_audit_events', createInitialAuditEvents());
  });

  const [legalDocuments, setLegalDocuments] = useState<LegalDocument[]>(() => {
    return safeParseStorage<LegalDocument[]>('flashgroup_v3_legal_documents', createInitialLegalDocuments());
  });

  const [complianceChecklist, setComplianceChecklist] = useState<ComplianceChecklistItem[]>(() => {
    return safeParseStorage<ComplianceChecklistItem[]>(
      'flashgroup_v3_compliance_checklist',
      createInitialComplianceChecklist()
    );
  });

  // Navigation tab state
  const [buyerTab, setBuyerTab] = useState<'discovery' | 'flashmap' | 'myrooms' | 'orders' | 'favorites' | 'complaints' | 'privacy' | 'notifications' | 'profile'>('discovery');
  const [supplierTab, setSupplierTab] = useState<'dashboard' | 'products' | 'rooms' | 'orders' | 'pickup' | 'logistics' | 'earnings' | 'analytics' | 'notifications' | 'profile'>('dashboard');
  const [adminTab, setAdminTab] = useState<'overview' | 'users' | 'suppliers' | 'products' | 'rooms' | 'orders' | 'refunds' | 'vouchers' | 'growth' | 'logistics' | 'finance' | 'payouts' | 'compliance' | 'reports'>('overview');

  // Drilldown selection states
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      const match = window.location.pathname.match(/^\/room\/([^/?#]+)/);
      if (match && match[1]) return decodeURIComponent(match[1]);
    }
    return null;
  });
  const [checkoutRoomId, setCheckoutRoomId] = useState<string | null>(null);
  const [joinModalRoomId, setJoinModalRoomId] = useState<string | null>(null);
  const [shareModalRoomId, setShareModalRoomId] = useState<string | null>(null);
  const [reviewOrderModal, setReviewOrderModal] = useState<Order | null>(null);
  const [refundOrderModal, setRefundOrderModal] = useState<Order | null>(null);
  const [receiptOrderModal, setReceiptOrderModal] = useState<Order | null>(null);
  const [isBusinessModelOpen, setIsBusinessModelOpen] = useState<boolean>(false);

  // Phase 8 Modal States
  const [sellerInfoModalSupplierId, setSellerInfoModalSupplierId] = useState<string | null>(null);
  const [reportProductModalProductId, setReportProductModalProductId] = useState<string | null>(null);
  const [snapshotModalOrder, setSnapshotModalOrder] = useState<Order | null>(null);
  const [legalModalSlug, setLegalModalSlug] = useState<LegalDocumentSlug | null>(null);
  const [complaintInitialOrderId, setComplaintInitialOrderId] = useState<string | undefined>(undefined);

  const [unlockedPriceNotification, setUnlockedPriceNotification] = useState<{
    newPrice: number;
    savedPerUnit: number;
    roomName: string;
    unit: string;
  } | null>(null);

  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isDemoCheckModalOpen, setIsDemoCheckModalOpen] = useState<boolean>(false);

  // Phase 12: Presentation, Screenshot & Guided Demo State
  const [isPresentationMode, setIsPresentationMode] = useState<boolean>(() => {
    return (
      (typeof window !== 'undefined' && (window.location.search.includes('presentation=true') || window.location.search.includes('demo=true')))
    );
  });
  const [isScreenshotMode, setIsScreenshotMode] = useState<boolean>(false);
  const [isGuidedDemoActive, setIsGuidedDemoActive] = useState<boolean>(false);
  const [guidedStepIndex, setGuidedStepIndex] = useState<number>(0);

  // Search & Filter state for Buyer Discovery
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    category: 'all',
    maxDistanceMeters: 10000,
    status: 'all',
    pickupPoint: 'all',
    maxPrice: 1000000,
    sortBy: 'near_me',
  });
  const debouncedSearch = useDebounce(filters.searchQuery, 350);
  const [selectedQuickChip, setSelectedQuickChip] = useState<'all' | 'fast_delivery' | 'dorm_pickup' | 'farm_produce' | 'hot_deal'>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedArea, setSelectedArea] = useState<string>('all');

  // Current reactive timestamp
  const [now, setNow] = useState<number>(Date.now());

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('flashgroup_v3_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (authenticatedUser) {
      localStorage.setItem('flashgroup_v3_auth_user', JSON.stringify(authenticatedUser));
      localStorage.setItem('flashgroup_v3_current_user', JSON.stringify(authenticatedUser));
    } else {
      localStorage.removeItem('flashgroup_v3_auth_user');
      localStorage.removeItem('flashgroup_v3_current_user');
    }
  }, [authenticatedUser]);

  useEffect(() => {
    try {
      localStorage.setItem('flashgroup_v3_users', JSON.stringify(users));
    } catch {}
  }, [users]);

  useEffect(() => {
    localStorage.setItem('flashgroup_v3_suppliers', JSON.stringify(suppliers));
  }, [suppliers]);

  useEffect(() => {
    localStorage.setItem('flashgroup_v3_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('flashgroup_v3_rooms', JSON.stringify(rooms));
  }, [rooms]);

  useEffect(() => {
    localStorage.setItem('flashgroup_v3_participations', JSON.stringify(participations));
  }, [participations]);

  useEffect(() => {
    localStorage.setItem('flashgroup_v3_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('flashgroup_v3_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('flashgroup_v3_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('flashgroup_v3_refunds', JSON.stringify(refunds));
  }, [refunds]);

  useEffect(() => {
    localStorage.setItem('flashgroup_v3_favorites', JSON.stringify(favoriteRoomIds));
  }, [favoriteRoomIds]);

  useEffect(() => {
    localStorage.setItem('flashgroup_v3_payouts', JSON.stringify(payouts));
  }, [payouts]);

  useEffect(() => {
    localStorage.setItem('flashgroup_v3_commission_rate', JSON.stringify(commissionRate));
  }, [commissionRate]);

  useEffect(() => {
    localStorage.setItem('flashgroup_v3_referrals', JSON.stringify(referrals));
  }, [referrals]);

  useEffect(() => {
    localStorage.setItem('flashgroup_v3_room_events', JSON.stringify(roomEvents));
  }, [roomEvents]);

  useEffect(() => {
    localStorage.setItem('flashgroup_v3_group_messages', JSON.stringify(groupMessages));
  }, [groupMessages]);

  useEffect(() => {
    localStorage.setItem('flashgroup_v3_message_reactions', JSON.stringify(messageReactions));
  }, [messageReactions]);

  useEffect(() => {
    localStorage.setItem('flashgroup_v3_loyalty_transactions', JSON.stringify(loyaltyTransactions));
  }, [loyaltyTransactions]);

  useEffect(() => {
    localStorage.setItem('flashgroup_v3_vouchers', JSON.stringify(vouchers));
  }, [vouchers]);

  useEffect(() => {
    localStorage.setItem('flashgroup_v3_voucher_usages', JSON.stringify(voucherUsages));
  }, [voucherUsages]);

  useEffect(() => {
    localStorage.setItem('flashgroup_v3_pickup_points', JSON.stringify(pickupPoints));
  }, [pickupPoints]);

  useEffect(() => {
    localStorage.setItem('flashgroup_v3_pickup_slots', JSON.stringify(pickupSlots));
  }, [pickupSlots]);

  useEffect(() => {
    localStorage.setItem('flashgroup_v3_delivery_batches', JSON.stringify(deliveryBatches));
  }, [deliveryBatches]);

  useEffect(() => {
    localStorage.setItem('flashgroup_v3_delivery_events', JSON.stringify(deliveryEvents));
  }, [deliveryEvents]);

  useEffect(() => {
    localStorage.setItem('flashgroup_v3_delivery_issues', JSON.stringify(deliveryIssues));
  }, [deliveryIssues]);

  useEffect(() => {
    localStorage.setItem('flashgroup_v3_verification_documents', JSON.stringify(verificationDocuments));
  }, [verificationDocuments]);

  useEffect(() => {
    localStorage.setItem('flashgroup_v3_consent_records', JSON.stringify(consentRecords));
  }, [consentRecords]);

  useEffect(() => {
    localStorage.setItem('flashgroup_v3_privacy_requests', JSON.stringify(privacyRequests));
  }, [privacyRequests]);

  useEffect(() => {
    localStorage.setItem('flashgroup_v3_complaint_cases', JSON.stringify(complaintCases));
  }, [complaintCases]);

  useEffect(() => {
    localStorage.setItem('flashgroup_v3_complaint_messages', JSON.stringify(complaintMessages));
  }, [complaintMessages]);

  useEffect(() => {
    localStorage.setItem('flashgroup_v3_product_reports', JSON.stringify(productReports));
  }, [productReports]);

  useEffect(() => {
    localStorage.setItem('flashgroup_v3_moderation_actions', JSON.stringify(moderationActions));
  }, [moderationActions]);

  useEffect(() => {
    localStorage.setItem('flashgroup_v3_transaction_snapshots', JSON.stringify(transactionSnapshots));
  }, [transactionSnapshots]);

  useEffect(() => {
    localStorage.setItem('flashgroup_v3_audit_events', JSON.stringify(auditEvents));
  }, [auditEvents]);

  useEffect(() => {
    localStorage.setItem('flashgroup_v3_legal_documents', JSON.stringify(legalDocuments));
  }, [legalDocuments]);

  useEffect(() => {
    localStorage.setItem('flashgroup_v3_compliance_checklist', JSON.stringify(complianceChecklist));
  }, [complianceChecklist]);

  // Shareable Room URL & Referral Tracking (Requirements 2, 3, 6-10, 47, 53)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleLocationParse = () => {
      const pathMatch = window.location.pathname.match(/^\/room\/([^/?#]+)/);
      const roomIdFromPath = pathMatch && pathMatch[1] ? decodeURIComponent(pathMatch[1]) : null;
      if (roomIdFromPath) {
        setSelectedRoomId(roomIdFromPath);
      }

      const params = new URLSearchParams(window.location.search);
      const refUserId = params.get('ref');
      if (refUserId) {
        // Prevent self-referral if already logged in as the referrer
        if (currentUser && currentUser.id === refUserId) return;

        localStorage.setItem(
          'flashgroup_v3_pending_ref',
          JSON.stringify({
            referrerUserId: refUserId,
            roomId: roomIdFromPath || undefined,
            capturedAt: new Date().toISOString(),
          })
        );

        setReferrals((prev) => {
          // Avoid duplicate clicked record for same referrer + room
          const exists = prev.some(
            (r) =>
              r.referrerUserId === refUserId &&
              (r.roomId || '') === (roomIdFromPath || '') &&
              (!currentUser || !r.referredUserId || r.referredUserId === currentUser.id)
          );
          if (exists) return prev;

          const newRef: Referral = {
            id: `ref-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            referrerUserId: refUserId,
            referredUserId: currentUser && currentUser.id !== refUserId ? currentUser.id : undefined,
            referredUserName: currentUser && currentUser.id !== refUserId ? getSafeFirstName(currentUser.name) : undefined,
            roomId: roomIdFromPath || undefined,
            status: currentUser && currentUser.id !== refUserId ? 'registered' : 'clicked',
            createdAt: new Date().toISOString(),
          };
          if (isSupabaseConfigured && !useLocalDemoMode) {
            socialService.upsertReferral({
              referrerUserId: newRef.referrerUserId,
              referredUserId: newRef.referredUserId,
              roomId: newRef.roomId,
              status: newRef.status,
            }).catch(console.error);
          }
          return [newRef, ...prev];
        });
      }
    };

    handleLocationParse();
    window.addEventListener('popstate', handleLocationParse);
    return () => window.removeEventListener('popstate', handleLocationParse);
  }, []);

  // Sync browser URL when selectedRoomId changes (Requirement 2)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const currentPath = window.location.pathname;
    if (selectedRoomId) {
      const targetPath = `/room/${encodeURIComponent(selectedRoomId)}`;
      if (currentPath !== targetPath) {
        window.history.pushState({}, '', `${targetPath}${window.location.search}`);
      }
    } else if (currentPath.startsWith('/room/')) {
      window.history.pushState({}, '', '/');
    }
  }, [selectedRoomId]);

  // Dynamic Document Title based on Route / State (Phase 11 SEO & UX)
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const titles: Record<string, string> = {
      '/': 'FlashGroup — Càng Đông, Càng Rẻ | Mua Gom Siêu Cục Bộ',
      '/marketplace': 'Thị Trường Mua Gom Siêu Cục Bộ — FlashGroup',
      '/flashmap': 'FlashMap — Bản Đồ Phòng Gom & Điểm Nhận Hàng Siêu Cục Bộ',
      '/how-it-works': 'Cách Thức Hoạt Động — FlashGroup',
      '/pickup-points': 'Danh Sách Điểm Nhận Hàng Smart Locker — FlashGroup',
      '/suppliers': 'Mạng Lưới Nhà Cung Cấp Xác Minh — FlashGroup',
      '/help': 'Trung Tâm Trợ Giúp & FAQ — FlashGroup',
      '/contact': 'Liên Hệ Hỗ Trợ — FlashGroup',
      '/orders': 'Đơn Hàng Của Tôi — FlashGroup',
      '/complaints': 'Trung Tâm Khiếu Nại & Bảo Vệ Người Tiêu Dùng — FlashGroup',
      '/privacy-center': 'Trung Tâm Quyền Riêng Tư & Dữ Liệu — FlashGroup',
      '/refund-policy': 'Chính Sách Hoàn Tiền 100% — FlashGroup',
      '/my-rooms': 'Phòng Gom Của Tôi — FlashGroup',
      '/profile': 'Hồ Sơ Cá Nhân — FlashGroup',
    };
    if (selectedRoomId) {
      const currentRoom = rooms.find((r) => r.id === selectedRoomId);
      if (currentRoom) {
        document.title = `${currentRoom.productName} — Gom Mua Chung | FlashGroup`;
        return;
      }
    }
    document.title = titles[location.pathname] || 'FlashGroup — Càng Đông, Càng Rẻ';
  }, [location.pathname, selectedRoomId, rooms]);

  // Attribute pending referral when user logs in or registers (Requirements 8, 9, 10)
  useEffect(() => {
    if (!currentUser) return;
    const rawPending = localStorage.getItem('flashgroup_v3_pending_ref');
    if (!rawPending) return;
    try {
      const pending = JSON.parse(rawPending) as { referrerUserId: string; roomId?: string };
      if (!pending.referrerUserId || pending.referrerUserId === currentUser.id) {
        // Prevent self-referral
        localStorage.removeItem('flashgroup_v3_pending_ref');
        return;
      }

      setReferrals((prev) => {
        const alreadyAttributed = prev.some(
          (r) =>
            r.referrerUserId === pending.referrerUserId &&
            r.referredUserId === currentUser.id &&
            (r.roomId || '') === (pending.roomId || '')
        );
        if (alreadyAttributed) return prev;

        // Upgrade an existing clicked referral or create registered referral
        const clickedIdx = prev.findIndex(
          (r) =>
            r.referrerUserId === pending.referrerUserId &&
            !r.referredUserId &&
            (r.roomId || '') === (pending.roomId || '')
        );

        if (clickedIdx >= 0) {
          const updated = [...prev];
          const target: Referral = {
            ...updated[clickedIdx],
            referredUserId: currentUser.id,
            referredUserName: getSafeFirstName(currentUser.name),
            status: 'registered',
          };
          updated[clickedIdx] = target;
          if (isSupabaseConfigured && !useLocalDemoMode) {
            socialService
              .updateReferralStatus(target.id, 'registered', currentUser.id)
              .catch(console.error);
          }
          return updated;
        }

        const created: Referral = {
          id: `ref-${Date.now()}`,
          referrerUserId: pending.referrerUserId,
          referredUserId: currentUser.id,
          referredUserName: getSafeFirstName(currentUser.name),
          roomId: pending.roomId,
          status: 'registered',
          createdAt: new Date().toISOString(),
        };
        if (isSupabaseConfigured && !useLocalDemoMode) {
          socialService.upsertReferral({
            referrerUserId: created.referrerUserId,
            referredUserId: created.referredUserId,
            roomId: created.roomId,
            status: created.status,
          }).catch(console.error);
        }
        return [created, ...prev];
      });
    } catch (e) {
      console.warn('Failed to parse pending referral:', e);
    }
  }, [currentUser?.id]);

  // Supabase Initial Sync & Realtime Subscriptions (Requirement 31 & Phase 6 Req 55)
  useEffect(() => {
    if (!isSupabaseConfigured || useLocalDemoMode) return;

    const loadSupabaseFinanceAndRealtime = async () => {
      try {
        const [
          remoteRate,
          remotePayouts,
          remoteOrders,
          remoteVouchers,
          remoteUsages,
          remoteReferrals,
          remoteEvents,
          remoteLoyalty,
          remotePickupPoints,
          remotePickupSlots,
          remoteBatches,
          remoteDeliveryEvents,
          remoteDeliveryIssues,
        ] = await Promise.all([
          financeService.getCommissionRate(),
          financeService.getPayouts(),
          orderService.getOrders(),
          socialService.getVouchers(),
          socialService.getVoucherUsages(),
          socialService.getReferrals(),
          socialService.getRoomEvents(),
          socialService.getLoyaltyTransactions(),
          fetchPickupPointsFromDb(),
          fetchPickupSlotsFromDb(),
          fetchDeliveryBatchesFromDb(),
          fetchDeliveryEventsFromDb(),
          fetchDeliveryIssuesFromDb(),
        ]);

        if (typeof remoteRate === 'number' && !isNaN(remoteRate)) {
          setCommissionRate(remoteRate);
        }
        if (remotePayouts && remotePayouts.length > 0) {
          setPayouts(remotePayouts);
        }
        if (remoteOrders && remoteOrders.length > 0) {
          setOrders(remoteOrders);
        }
        if (remoteVouchers && remoteVouchers.length > 0) {
          setVouchers(remoteVouchers);
        }
        if (remoteUsages && remoteUsages.length > 0) {
          setVoucherUsages(remoteUsages);
        }
        if (remoteReferrals && remoteReferrals.length > 0) {
          setReferrals(remoteReferrals);
        }
        if (remoteEvents && remoteEvents.length > 0) {
          setRoomEvents(remoteEvents);
        }
        if (remoteLoyalty && remoteLoyalty.length > 0) {
          setLoyaltyTransactions(remoteLoyalty);
        }
        if (remotePickupPoints && remotePickupPoints.length > 0) {
          setPickupPoints(remotePickupPoints);
        }
        if (remotePickupSlots && remotePickupSlots.length > 0) {
          setPickupSlots(remotePickupSlots);
        }
        if (remoteBatches && remoteBatches.length > 0) {
          setDeliveryBatches(remoteBatches);
        }
        if (remoteDeliveryEvents && remoteDeliveryEvents.length > 0) {
          setDeliveryEvents(remoteDeliveryEvents);
        }
        if (remoteDeliveryIssues && remoteDeliveryIssues.length > 0) {
          setDeliveryIssues(remoteDeliveryIssues);
        }
      } catch (err) {
        console.warn('Supabase sync skipped (table may not be migrated yet):', err);
      } finally {
        setIsDataLoaded(true);
      }
    };

    loadSupabaseFinanceAndRealtime();

    const channel = subscribeToRealtimeChanges({
      onRoomChange: async () => {
        const remoteRooms = await roomService.getRooms();
        if (remoteRooms.length > 0) setRooms(remoteRooms);
      },
      onParticipationChange: async () => {
        const remoteRooms = await roomService.getRooms();
        if (remoteRooms.length > 0) setRooms(remoteRooms);
      },
      onOrderChange: async () => {
        const remoteOrders = await orderService.getOrders();
        if (remoteOrders.length > 0) setOrders(remoteOrders);
      },
      onNotificationChange: async () => {
        if (currentUser?.id) {
          const remoteNotifs = await notificationService.getUserNotifications(currentUser.id);
          if (remoteNotifs.length > 0) setNotifications(remoteNotifs);
        }
      },
      onPayoutChange: async () => {
        const remotePayouts = await financeService.getPayouts();
        if (remotePayouts.length > 0) setPayouts(remotePayouts);
      },
      onSettingsChange: async () => {
        const rate = await financeService.getCommissionRate();
        setCommissionRate(rate);
      },
      onRoomEventChange: async () => {
        const remoteEvents = await socialService.getRoomEvents();
        if (remoteEvents.length > 0) setRoomEvents(remoteEvents);
      },
      onGroupMessageChange: async () => {
        if (selectedRoomId) {
          const remoteMsgs = await socialService.getGroupMessages(selectedRoomId);
          if (remoteMsgs.length > 0) {
            setGroupMessages((prev) => {
              const other = prev.filter((m) => m.roomId !== selectedRoomId);
              return [...other, ...remoteMsgs];
            });
          }
        }
      },
      onMessageReactionChange: async () => {
        const remoteReacts = await socialService.getMessageReactions();
        if (remoteReacts.length > 0) setMessageReactions(remoteReacts);
      },
      onReferralChange: async () => {
        const remoteRefs = await socialService.getReferrals();
        if (remoteRefs.length > 0) setReferrals(remoteRefs);
      },
      onLoyaltyChange: async () => {
        const remoteLoyalty = await socialService.getLoyaltyTransactions();
        if (remoteLoyalty.length > 0) setLoyaltyTransactions(remoteLoyalty);
      },
      onVoucherChange: async () => {
        const [remoteVouchers, remoteUsages] = await Promise.all([
          socialService.getVouchers(),
          socialService.getVoucherUsages(),
        ]);
        if (remoteVouchers.length > 0) setVouchers(remoteVouchers);
        if (remoteUsages.length > 0) setVoucherUsages(remoteUsages);
      },
      onPickupPointChange: async () => {
        const remotePts = await fetchPickupPointsFromDb();
        if (remotePts && remotePts.length > 0) setPickupPoints(remotePts);
      },
      onPickupSlotChange: async () => {
        const remoteSlots = await fetchPickupSlotsFromDb();
        if (remoteSlots && remoteSlots.length > 0) setPickupSlots(remoteSlots);
      },
      onDeliveryBatchChange: async () => {
        const remoteBatches = await fetchDeliveryBatchesFromDb();
        if (remoteBatches && remoteBatches.length > 0) setDeliveryBatches(remoteBatches);
      },
      onDeliveryEventChange: async () => {
        const remoteEvts = await fetchDeliveryEventsFromDb();
        if (remoteEvts && remoteEvts.length > 0) setDeliveryEvents(remoteEvts);
      },
      onDeliveryIssueChange: async () => {
        const remoteIssues = await fetchDeliveryIssuesFromDb();
        if (remoteIssues && remoteIssues.length > 0) setDeliveryIssues(remoteIssues);
      },
    });

    return () => {
      if (channel && supabase) {
        supabase.removeChannel(channel);
      }
    };
  }, [isSupabaseConfigured, useLocalDemoMode, currentUser?.id, selectedRoomId]);

  const showToast = (msg: string, type: ToastType = 'SUCCESS') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    let resolvedType = type;
    const lower = msg.toLowerCase();
    if (type === 'SUCCESS') {
      if (
        lower.includes('thất bại') ||
        lower.includes('lỗi') ||
        lower.includes('không thể') ||
        lower.includes('từ chối') ||
        lower.includes('hủy')
      ) {
        resolvedType = 'ERROR';
      } else if (
        lower.includes('cảnh báo') ||
        lower.includes('quá hạn') ||
        lower.includes('chú ý') ||
        lower.includes('chờ')
      ) {
        resolvedType = 'WARNING';
      } else if (lower.includes('thông báo') || lower.includes('đang')) {
        resolvedType = 'INFO';
      }
    }
    setToasts((prev) => [...prev.slice(-3), { id, type: resolvedType, message: msg }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Helper: Push Notification with deduplication key (Requirement 46)
  const pushNotification = (
    userId: string,
    type: Notification['type'],
    title: string,
    message: string,
    eventKey?: string,
    roomId?: string,
    orderId?: string
  ) => {
    setNotifications((prev) => {
      if (eventKey && prev.some((n) => n.eventKey === eventKey && n.userId === userId)) {
        return prev; // Deduplicated
      }
      const newNotif: Notification = {
        id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        userId,
        type,
        title,
        message,
        read: false,
        createdAt: new Date().toISOString(),
        eventKey,
        roomId,
        orderId,
      };
      return [newNotif, ...prev];
    });
  };

  // 1-second interval timer for countdown & auto-notifications (Requirements 10, 11, 46)
  useEffect(() => {
    const timer = setInterval(() => {
      const currentTime = Date.now();
      setNow(currentTime);

      setRooms((prevRooms) => {
        let hasChanges = false;
        const nextRooms = prevRooms.map((room) => {
          const remainingSecs = Math.max(0, Math.floor((new Date(room.endAt).getTime() - currentTime) / 1000));

          // Auto Notification: Room ending soon (<= 5 mins / 300s)
          if (room.status === 'active' && remainingSecs <= 300 && remainingSecs > 0) {
            // Find buyers who joined this room
            const joinedBuyers = participations.filter((p) => p.roomId === room.id).map((p) => p.userId);
            joinedBuyers.forEach((bId) => {
              pushNotification(
                bId,
                'room_ending',
                'Phòng gom sắp kết thúc!',
                `Phòng "${room.productName}" chỉ còn 5 phút để gom đủ số lượng và đạt mức giá tiếp theo.`,
                `ending-${room.id}-${bId}`,
                room.id
              );
            });
          }

          // Auto-close check: room is active but endAt reached
          if (room.status === 'active' && currentTime >= new Date(room.endAt).getTime()) {
            hasChanges = true;
            const finalPrice = getCurrentPrice(room.totalQuantity, room.priceTiers);
            const isSuccessful = room.totalQuantity > 0;

            // Notify joined buyers
            const joinedBuyers = participations.filter((p) => p.roomId === room.id).map((p) => p.userId);
            joinedBuyers.forEach((bId) => {
              pushNotification(
                bId,
                'room_closed',
                'Phòng gom đã kết thúc',
                `Phòng "${room.productName}" đã chốt giá ở mức ${formatVND(finalPrice)}. Bạn có thể tiến hành thanh toán.`,
                `closed-${room.id}-${bId}`,
                room.id
              );
            });

            return {
              ...room,
              status: isSuccessful ? ('successful' as const) : ('cancelled' as const),
              finalPrice,
              finalQuantity: room.totalQuantity,
              closedAt: new Date(currentTime).toISOString(),
            };
          }
          return room;
        });

        return hasChanges ? nextRooms : prevRooms;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [participations]);

  const getSecondsLeft = (endAt: string) => {
    const remaining = new Date(endAt).getTime() - now;
    return Math.max(0, Math.floor(remaining / 1000));
  };

  // Phase 8 Req 7 & 30: Append-only Electronic Transaction & Compliance Audit Log
  const appendAuditLog = (
    eventType: AuditEventType,
    categoryOrTarget: string,
    recordId: string,
    safeMetadata?: Record<string, unknown>
  ) => {
    const category: AuditEvent['category'] =
      categoryOrTarget === 'privacy' ||
      categoryOrTarget === 'privacy_request' ||
      categoryOrTarget === 'consent'
        ? 'privacy'
        : categoryOrTarget === 'moderation' ||
          categoryOrTarget === 'product' ||
          categoryOrTarget === 'review'
        ? 'moderation'
        : categoryOrTarget === 'compliance' ||
          categoryOrTarget === 'supplier' ||
          categoryOrTarget === 'complaint'
        ? 'compliance'
        : 'transaction';

    const newAudit: AuditEvent = {
      id: `audit-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      actorId: currentUser?.id || 'system',
      actorName: currentUser?.name || 'System',
      actorRole: currentUser?.role || 'system',
      timestamp: new Date().toISOString(),
      recordId,
      eventType,
      category,
      safeMetadata: safeMetadata || {},
    };
    setAuditEvents((prev) => [newAudit, ...prev]);
    if (isSupabaseConfigured && !useLocalDemoMode) {
      complianceService.appendAuditEvent(newAudit).catch(console.error);
    }
  };

  // Helper: Emit Room Event (Requirements 11, 12, 49)
  const emitRoomEvent = (
    roomId: string,
    eventType: RoomEventType,
    opts?: {
      actorUserId?: string;
      actorName?: string;
      payload?: Record<string, any>;
    }
  ) => {
    const metadata: Record<string, unknown> = {
      ...(opts?.payload || {}),
      ...(opts?.actorName ? { userName: getSafeFirstName(opts.actorName) } : {}),
    };
    const newEvt: RoomEvent = {
      id: `evt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      roomId,
      userId: opts?.actorUserId,
      eventType,
      metadata,
      createdAt: new Date().toISOString(),
    };
    setRoomEvents((prev) => [newEvt, ...prev]);
    if (isSupabaseConfigured && !useLocalDemoMode) {
      socialService
        .createRoomEvent({
          roomId,
          userId: opts?.actorUserId,
          eventType,
          metadata,
        })
        .catch(console.error);
    }
  };

  // Helper: Award Loyalty Points idempotently (Requirements 26, 27, 41-43, 51)
  const awardLoyaltyPoints = (
    userId: string,
    points: number,
    type: LoyaltyTransactionType,
    description: string,
    referenceId: string
  ) => {
    setLoyaltyTransactions((prev) => {
      if (prev.some((t) => t.userId === userId && t.type === type && t.referenceId === referenceId)) {
        return prev; // Deduplicated
      }
      const newTx: LoyaltyTransaction = {
        id: `loy-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        userId,
        points,
        type,
        description,
        referenceId,
        createdAt: new Date().toISOString(),
      };
      return [newTx, ...prev];
    });
  };

  // Phase 7: Ensure 1 Group Room = 1 Consolidated DeliveryBatch when room becomes successful (Req 9, 14, 16, 45, 57)
  const ensureBatchCreatedForRoom = (room: GroupRoom, finalParticipantCount?: number, finalTotalQty?: number) => {
    const pCount = Math.max(1, finalParticipantCount ?? room.participantCount);
    const tQty = Math.max(1, finalTotalQty ?? room.totalQuantity);
    const lockedShippingPerBuyer = getSharedShipping(room.totalShippingFee, pCount);
    const point = pickupPoints.find(
      (pt) => pt.id === room.pickupPointId || pt.name === room.pickupPoint
    );
    const pointName = room.pickupPointName || point?.name || room.pickupPoint;
    const pointAddr = room.pickupAddress || point?.address || '';
    const slotWindow = room.pickupSlotSnapshot || '26 Oct • 18:00 – 21:00';
    const nowIso = new Date().toISOString();

    setDeliveryBatches((prev) => {
      if (prev.some((b) => b.roomId === room.id)) return prev;
      const newBatchId = `FG-BATCH-${Math.floor(100 + Math.random() * 900)}`;
      const createdBatch: DeliveryBatch = {
        id: newBatchId,
        roomId: room.id,
        supplierId: room.supplierId,
        pickupPointId: point?.id || room.pickupPointId || '00000000-0000-0000-0000-000000000701',
        pickupSlotId: room.pickupSlotId,
        pickupPointName: pointName,
        pickupAddress: pointAddr,
        pickupWindow: slotWindow,
        productName: room.productName,
        totalOrders: pCount,
        totalUnits: tQty,
        totalShippingFee: room.totalShippingFee,
        shippingPerBuyer: lockedShippingPerBuyer,
        status: 'planned',
        carrierName: 'Đối tác giao nhận mô phỏng',
        trackingNote: `Lô giao chung gom ${pCount} đơn (${tQty} ${room.unit}) về ${pointName}`,
        createdAt: nowIso,
      };

      setDeliveryEvents((evPrev) => [
        ...evPrev,
        {
          id: `devt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          batchId: newBatchId,
          status: 'planned',
          title: 'Phòng gom đạt mục tiêu & khởi tạo lô giao chung',
          description: `Đã gộp ${pCount} đơn (${tQty} ${room.unit}) giao chung về ${pointName}`,
          createdAt: nowIso,
        },
      ]);

      return [createdBatch, ...prev];
    });

    if (isSupabaseConfigured && !useLocalDemoMode) {
      createDeliveryBatchViaRpc(room.id).catch(console.error);
    }
  };

  // Finalize Room
  const finalizeRoom = (roomId: string) => {
    const targetRoom = rooms.find((r) => r.id === roomId);
    setRooms((prev) =>
      prev.map((r) => {
        if (r.id !== roomId || r.finalPrice !== undefined) return r;
        const finalPrice = getCurrentPrice(r.totalQuantity, r.priceTiers);
        const isSuccessful = r.totalQuantity > 0;
        const lockedShip = getSharedShipping(r.totalShippingFee, r.participantCount);
        return {
          ...r,
          status: isSuccessful ? 'successful' : 'cancelled',
          finalPrice,
          finalQuantity: r.totalQuantity,
          shippingPerBuyerSnapshot: lockedShip,
          pickupPointName: r.pickupPointName || r.pickupPoint,
          pickupSlotSnapshot: r.pickupSlotSnapshot || '26 Oct • 18:00 – 21:00',
          closedAt: new Date().toISOString(),
        };
      })
    );

    if (targetRoom && targetRoom.finalPrice === undefined) {
      const lockedFinalPrice = getCurrentPrice(targetRoom.totalQuantity, targetRoom.priceTiers);
      emitRoomEvent(roomId, 'room_closed', {
        payload: { finalPrice: lockedFinalPrice },
      });
      appendAuditLog('price_locked', 'room', roomId, {
        finalPrice: lockedFinalPrice,
        finalQuantity: targetRoom.totalQuantity,
      });
      if (targetRoom.totalQuantity > 0) {
        ensureBatchCreatedForRoom(targetRoom);
      }
    }

    setParticipations((prev) =>
      prev.map((p) => {
        if (p.roomId === roomId && p.status === 'reserved') {
          return { ...p, status: 'awaiting_payment' };
        }
        return p;
      })
    );
  };

  // Join Room Handler
  const handleJoinGroup = (roomId: string, quantity: number) => {
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      showToast('CẦN KẾT NỐI MẠNG ĐỂ THỰC HIỆN THAO TÁC NÀY', 'WARNING');
      return;
    }
    if (!currentUser) return;
    const room = rooms.find((r) => r.id === roomId);
    if (!room) return;

    if (room.status !== 'active') {
      showToast('Phòng gom hiện không ở trạng thái mở!');
      return;
    }
    if (room.participantCount >= room.maxParticipants) {
      showToast('Phòng gom đã đạt tối đa số người tham gia!');
      return;
    }
    if (room.totalQuantity + quantity > room.maxQuantity) {
      showToast(`Không thể vượt quá số lượng tối đa của phòng (${room.maxQuantity})!`);
      return;
    }
    const alreadyJoined = participations.some(
      (p) => p.roomId === roomId && p.userId === currentUser.id && p.status !== 'cancelled'
    );
    if (alreadyJoined) {
      showToast('Bạn đã tham gia phòng gom này rồi!');
      return;
    }

    const oldPrice = getCurrentPrice(room.totalQuantity, room.priceTiers);
    const newParticipantCount = room.participantCount + 1;
    const newTotalQuantity = room.totalQuantity + quantity;
    const newPrice = getCurrentPrice(newTotalQuantity, room.priceTiers);

    const isFull =
      newTotalQuantity >= room.maxQuantity || newParticipantCount >= room.maxParticipants;

    const newParticipation: GroupParticipation = {
      id: `part-${Date.now()}`,
      roomId: room.id,
      userId: currentUser.id,
      quantity,
      joinedAt: new Date().toISOString(),
      status: isFull ? 'awaiting_payment' : 'reserved',
    };

    setParticipations((prev) => [...prev, newParticipation]);

    let updatedRoom: GroupRoom = {
      ...room,
      participantCount: newParticipantCount,
      totalQuantity: newTotalQuantity,
    };

    if (isFull) {
      const finalPrice = getCurrentPrice(newTotalQuantity, room.priceTiers);
      const lockedShip = getSharedShipping(room.totalShippingFee, newParticipantCount);
      updatedRoom = {
        ...updatedRoom,
        status: 'successful',
        finalPrice,
        finalQuantity: newTotalQuantity,
        shippingPerBuyerSnapshot: lockedShip,
        pickupPointName: room.pickupPointName || room.pickupPoint,
        pickupSlotSnapshot: room.pickupSlotSnapshot || '26 Oct • 18:00 – 21:00',
        closedAt: new Date().toISOString(),
      };
      ensureBatchCreatedForRoom(updatedRoom, newParticipantCount, newTotalQuantity);
    }

    setRooms((prev) => prev.map((r) => (r.id === roomId ? updatedRoom : r)));
    setJoinModalRoomId(null);
    showToast(`Đã tham gia phòng gom "${room.productName}" (${quantity} ${room.unit}) thành công!`);

    // Emit Room Activity Event (Requirements 11, 12, 49)
    emitRoomEvent(room.id, 'joined', {
      actorUserId: currentUser.id,
      actorName: currentUser.name,
      payload: { quantity, unit: room.unit },
    });

    // Phase 8 Req 7: Append audit event for room_joined (and price_locked if room became full)
    appendAuditLog('room_joined', 'room', room.id, {
      userId: currentUser.id,
      quantity,
      unit: room.unit,
      newTotalQuantity,
    });
    if (isFull && updatedRoom.finalPrice !== undefined) {
      appendAuditLog('price_locked', 'room', room.id, {
        finalPrice: updatedRoom.finalPrice,
        finalQuantity: newTotalQuantity,
      });
    }

    // Referral status transition: registered -> joined (Requirement 8)
    setReferrals((prev) =>
      prev.map((ref) => {
        if (
          ref.referredUserId === currentUser.id &&
          ref.referrerUserId !== currentUser.id &&
          ref.status !== 'completed' &&
          (!ref.roomId || ref.roomId === room.id)
        ) {
          const updatedRef: Referral = {
            ...ref,
            roomId: ref.roomId || room.id,
            status: 'joined',
          };
          if (isSupabaseConfigured && !useLocalDemoMode) {
            socialService.updateReferralStatus(ref.id, 'joined').catch(console.error);
          }
          return updatedRef;
        }
        return ref;
      })
    );

    // Price unlock alert & notification (Requirement 11)
    if (newPrice < oldPrice) {
      emitRoomEvent(room.id, 'price_unlocked', {
        actorUserId: currentUser.id,
        actorName: currentUser.name,
        payload: { newPrice, oldPrice, savedPerUnit: oldPrice - newPrice },
      });

      setUnlockedPriceNotification({
        newPrice,
        savedPerUnit: oldPrice - newPrice,
        roomName: room.productName,
        unit: room.unit,
      });

      // Notify all participants
      const participantsList = [...participations.filter((p) => p.roomId === room.id).map((p) => p.userId), currentUser.id];
      participantsList.forEach((uid) => {
        pushNotification(
          uid,
          'price_unlock',
          'Mức giá mới được mở khóa!',
          `Phòng "${room.productName}" vừa mở khóa mức giá ${formatVND(newPrice)}/${room.unit}. Tiết kiệm thêm ${formatVND(oldPrice - newPrice)}!`,
          `unlock-${room.id}-${newPrice}-${uid}`,
          room.id
        );
      });
    }

    if (isFull) {
      emitRoomEvent(room.id, 'room_full', {
        actorUserId: currentUser.id,
        actorName: currentUser.name,
        payload: { finalPrice: updatedRoom.finalPrice },
      });
    }
  };

  // Phase 12: Role Switcher for Presenter Demo Mode
  const handleSwitchRole = (targetRole: 'buyer' | 'supplier' | 'admin') => {
    if (targetRole === 'admin') {
      // Revert persona override so genuine admin authenticated account is active
      setPresentedDemoUser(null);
      setAdminTab('overview');
      navigate('/');
      showToast('Đã trở lại bảng quản trị Admin của bạn', 'INFO');
    } else {
      const demoUser = users.find((u) => u.role === targetRole) || createInitialUsers().find((u) => u.role === targetRole);
      if (demoUser) {
        setPresentedDemoUser(demoUser);
        setSelectedRoomId(null);
        setCheckoutRoomId(null);
        if (targetRole === 'buyer') {
          setBuyerTab('discovery');
          navigate('/marketplace');
        } else {
          setSupplierTab('dashboard');
          navigate('/');
        }
        showToast(`Đã chuyển demo sang ${targetRole.toUpperCase()}: ${demoUser.name}`, 'INFO');
      }
    }
  };

  // Reset Demo (Requirements 53 & 54, Phase 12 Idempotent Scenario Reset)
  const handleResetData = (keepCurrentUser: boolean = false) => {
    FLASHGROUP_V3_KEYS.forEach((key) => localStorage.removeItem(key));
    localStorage.removeItem('flashgroup_v3_pending_ref');
    const initialUsersList = createInitialUsers();
    setUsers(initialUsersList);
    if (!keepCurrentUser) {
      setAuthenticatedUser(null);
      setPresentedDemoUser(null);
    }
    setSuppliers(createInitialSuppliers());
    setProducts(createInitialProducts());
    setRooms(createInitialRooms());
    setParticipations(createInitialParticipations());
    setOrders(createInitialOrders());
    setNotifications(createInitialNotifications());
    setReviews(createInitialReviews());
    setRefunds(createInitialRefunds());
    setFavoriteRoomIds([]);
    setPayouts(createInitialPayouts());
    setCommissionRate(DEFAULT_PLATFORM_COMMISSION_RATE);
    setReferrals(createInitialReferrals());
    setRoomEvents(createInitialRoomEvents());
    setGroupMessages(createInitialGroupMessages());
    setMessageReactions(createInitialMessageReactions());
    setLoyaltyTransactions(createInitialLoyaltyTransactions());
    setVouchers(createInitialVouchers());
    setVoucherUsages([]);
    setPickupPoints(createInitialPickupPoints());
    setPickupSlots(createInitialPickupSlots());
    setDeliveryBatches(createInitialDeliveryBatches());
    setDeliveryEvents(createInitialDeliveryEvents());
    setDeliveryIssues(createInitialDeliveryIssues());
    setVerificationDocuments(createInitialVerificationDocuments());
    setConsentRecords(createInitialConsentRecords());
    setPrivacyRequests(createInitialPrivacyRequests());
    setComplaintCases(createInitialComplaintCases());
    setComplaintMessages(createInitialComplaintMessages());
    setProductReports(createInitialProductReports());
    setModerationActions(createInitialModerationActions());
    setTransactionSnapshots(createInitialTransactionSnapshots());
    setAuditEvents(createInitialAuditEvents());
    setLegalDocuments(createInitialLegalDocuments());
    setComplianceChecklist(createInitialComplianceChecklist());

    setSelectedRoomId(null);
    setCheckoutRoomId(null);
    setJoinModalRoomId(null);
    setShareModalRoomId(null);
    setReviewOrderModal(null);
    setRefundOrderModal(null);
    setReceiptOrderModal(null);
    setSellerInfoModalSupplierId(null);
    setReportProductModalProductId(null);
    setSnapshotModalOrder(null);
    setLegalModalSlug(null);
    setComplaintInitialOrderId(undefined);
    showToast('Đã khôi phục dữ liệu ban đầu cho bản demo!');
  };

  // Logout (Requirement 6 & Production Auth Flow)
  const handleLogout = async () => {
    if (isSupabaseConfigured && !useLocalDemoMode) {
      try {
        await authService.signOut();
      } catch (err) {
        console.error('Supabase signOut error:', err);
      }
    }
    localStorage.removeItem('flashgroup_v3_current_user');
    localStorage.removeItem('flashgroup_v3_auth_user');
    setAuthenticatedUser(null);
    setPresentedDemoUser(null);
    setSelectedRoomId(null);
    setCheckoutRoomId(null);
    setBuyerTab('discovery');
    showToast('Đã đăng xuất phiên làm việc.');
  };

  // Favorites toggle (Requirement 8)
  const handleToggleFavorite = (roomId: string) => {
    setFavoriteRoomIds((prev) => {
      const isFav = prev.includes(roomId);
      if (isFav) {
        showToast('Đã xóa khỏi danh sách yêu thích.');
        return prev.filter((id) => id !== roomId);
      } else {
        showToast('Đã lưu phòng gom vào danh sách yêu thích!');
        return [...prev, roomId];
      }
    });
  };

  // Sequential Order Status Transitions (Requirement 23 & Phase 6 Req 8, 41, 43, 51, 52)
  const handleUpdateOrderStatus = (orderId: string, nextStatus: OrderStatus) => {
    const nowIso = new Date().toISOString();
    const targetOrder = orders.find((o) => o.id === orderId);

    appendAuditLog(
      nextStatus === 'picked_up' ? 'pickup_confirmed' : 'supplier_changed_order_status',
      'order',
      orderId,
      { previousStatus: targetOrder?.status, nextStatus }
    );

    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        const updated = { ...o, status: nextStatus };
        if (nextStatus === 'preparing') {
          updated.preparingAt = nowIso;
          pushNotification(
            o.userId,
            'order_update',
            'Đơn hàng đang chuẩn bị',
            `Nhà cung cấp đang chuẩn bị kiện hàng cho đơn ${o.id}.`,
            undefined,
            undefined,
            o.id
          );
        } else if (nextStatus === 'in_transit') {
          updated.inTransitAt = nowIso;
          pushNotification(
            o.userId,
            'order_update',
            'Đơn hàng đang xuất kho',
            `Kiện hàng ${o.id} đang trên đường giao đến điểm nhận ${o.pickupPoint}.`,
            undefined,
            undefined,
            o.id
          );
        } else if (nextStatus === 'ready_for_pickup') {
          updated.readyForPickupAt = nowIso;
          pushNotification(
            o.userId,
            'pickup_ready',
            'Đơn hàng sẵn sàng tại Locker!',
            `Đơn hàng đã sẵn sàng tại ${o.pickupPoint}. Mã PIN mở tủ: ${o.pickupCode}.`,
            undefined,
            undefined,
            o.id
          );
        } else if (nextStatus === 'picked_up') {
          updated.pickedUpAt = nowIso;
          pushNotification(
            o.userId,
            'order_update',
            'Giao hàng thành công (+10 FlashPoints)',
            `Bạn đã nhận hàng thành công tại Locker và được cộng +10 FlashPoints. Cảm ơn bạn đã tham gia gom đơn!`,
            undefined,
            undefined,
            o.id
          );
        }
        return updated;
      })
    );

    // Phase 6: Award +10 FlashPoints on picked_up & complete referral (+20 FlashPoints to referrer)
    if (nextStatus === 'picked_up' && targetOrder) {
      awardLoyaltyPoints(
        targetOrder.userId,
        10,
        'purchase',
        `Hoàn tất nhận đơn hàng #${targetOrder.id}`,
        targetOrder.id
      );

      setReferrals((prev) =>
        prev.map((ref) => {
          if (
            ref.referredUserId === targetOrder.userId &&
            ref.referrerUserId !== targetOrder.userId &&
            ref.status !== 'completed' &&
            (!ref.roomId || ref.roomId === targetOrder.roomId)
          ) {
            const completedRef: Referral = {
              ...ref,
              status: 'completed',
              completedAt: nowIso,
            };
            awardLoyaltyPoints(
              ref.referrerUserId,
              20,
              'referral',
              `Giới thiệu bạn bè hoàn tất đơn hàng gom`,
              ref.id
            );
            pushNotification(
              ref.referrerUserId,
              'system',
              'Nhận +20 FlashPoints giới thiệu bạn bè!',
              `Người bạn được bạn mời vừa hoàn tất nhận đơn gom. Bạn nhận được +20 FlashPoints!`,
              `ref-complete-${ref.id}`
            );
            if (isSupabaseConfigured && !useLocalDemoMode) {
              socialService.awardReferralPointsRpc(ref.id).catch(console.error);
            }
            return completedRef;
          }
          return ref;
        })
      );

      if (isSupabaseConfigured && !useLocalDemoMode) {
        socialService.awardPurchasePointsRpc(orderId).catch(console.error);
        confirmPickupViaRpc(targetOrder.pickupCode, targetOrder.pickupPointId).catch(console.error);
      }

      // Phase 7 Req 24: When all orders in a batch become picked_up, batch becomes completed and pickup point currentLoad decreases
      const batchId = targetOrder.deliveryBatchId;
      const roomId = targetOrder.roomId;
      const relatedBatch = deliveryBatches.find(
        (b) => (batchId && b.id === batchId) || b.roomId === roomId
      );
      if (relatedBatch && relatedBatch.status !== 'completed') {
        const batchOrders = orders.filter(
          (o) =>
            (o.deliveryBatchId === relatedBatch.id || o.roomId === relatedBatch.roomId) &&
            o.status !== 'cancelled' &&
            o.status !== 'refunded'
        );
        const allPickedUp =
          batchOrders.length > 0 &&
          batchOrders.every((o) => o.id === orderId || o.status === 'picked_up');

        if (allPickedUp) {
          setDeliveryBatches((prev) =>
            prev.map((b) =>
              b.id === relatedBatch.id
                ? { ...b, status: 'completed', completedAt: nowIso }
                : b
            )
          );
          setDeliveryEvents((prev) => [
            ...prev,
            {
              id: `devt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
              batchId: relatedBatch.id,
              status: 'completed',
              title: 'Hoàn tất giao nhận toàn bộ đơn trong lô',
              description: `Tất cả người mua thuộc lô #${relatedBatch.id} đã nhận hàng thành công tại ${relatedBatch.pickupPointName}.`,
              createdAt: nowIso,
            },
          ]);
          setPickupPoints((prev) =>
            prev.map((pt) => {
              if (pt.id !== relatedBatch.pickupPointId && pt.name !== relatedBatch.pickupPointName) {
                return pt;
              }
              const nextLoad = Math.max(0, pt.currentLoad - Math.max(1, batchOrders.length));
              const nextStatus: PickupPoint['status'] =
                pt.status === 'inactive'
                  ? 'inactive'
                  : nextLoad >= pt.capacity
                  ? 'full'
                  : 'active';
              return { ...pt, currentLoad: nextLoad, status: nextStatus };
            })
          );
        }
      }
    }

    if (isSupabaseConfigured && !useLocalDemoMode) {
      orderService.updateOrderStatus(orderId, nextStatus).catch(console.error);
    }

    showToast(`Đã chuyển đơn hàng sang trạng thái: ${nextStatus.toUpperCase()}`);
  };

  // Phase 7: Advance Consolidated Delivery Batch Status (Req 15, 22, 23, 24, 28, 43, 50)
  const handleAdvanceBatchStatus = (
    batchId: string,
    nextStatus: DeliveryBatchStatus,
    title: string,
    description?: string
  ) => {
    const targetBatch = deliveryBatches.find((b) => b.id === batchId);
    if (!targetBatch) return;

    // Req 28: Enforce sequential status transitions
    if (!canTransitionBatchStatus(targetBatch.status, nextStatus)) {
      showToast(
        `Không thể chuyển trực tiếp từ "${targetBatch.status}" sang "${nextStatus}". Vui lòng thực hiện tuần tự!`
      );
      return;
    }

    const nowIso = new Date().toISOString();
    const point = pickupPoints.find(
      (pt) => pt.id === targetBatch.pickupPointId || pt.name === targetBatch.pickupPointName
    );
    const pointName = targetBatch.pickupPointName || point?.name || 'KTX A – Locker 03';

    setDeliveryBatches((prev) =>
      prev.map((b) => {
        if (b.id !== batchId) return b;
        return {
          ...b,
          status: nextStatus,
          dispatchedAt:
            nextStatus === 'picked_up_from_supplier' || nextStatus === 'in_transit'
              ? b.dispatchedAt || nowIso
              : b.dispatchedAt,
          arrivedAt: nextStatus === 'arrived_at_pickup' ? nowIso : b.arrivedAt,
          completedAt: nextStatus === 'completed' ? nowIso : b.completedAt,
        };
      })
    );

    setDeliveryEvents((prev) => [
      ...prev,
      {
        id: `devt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        batchId,
        status: nextStatus,
        title,
        description,
        createdAt: nowIso,
      },
    ]);

    // Find all buyers in the room/batch for notifications (Req 23)
    const batchOrders = orders.filter(
      (o) =>
        (o.deliveryBatchId === batchId || o.roomId === targetBatch.roomId) &&
        o.status !== 'cancelled' &&
        o.status !== 'refunded'
    );
    const buyerIds = Array.from(
      new Set([
        ...batchOrders.map((o) => o.userId),
        ...participations
          .filter((p) => p.roomId === targetBatch.roomId && p.status !== 'cancelled')
          .map((p) => p.userId),
      ])
    );

    if (nextStatus === 'in_transit') {
      buyerIds.forEach((uid) => {
        pushNotification(
          uid,
          'order_update',
          'Đơn gom đang vận chuyển',
          'Đơn gom của bạn đang được vận chuyển.',
          `batch-transit-${batchId}-${uid}`,
          targetBatch.roomId
        );
      });
      setOrders((prev) =>
        prev.map((o) => {
          if (
            (o.deliveryBatchId === batchId || o.roomId === targetBatch.roomId) &&
            (o.status === 'paid' || o.status === 'preparing')
          ) {
            return { ...o, status: 'in_transit', inTransitAt: nowIso, deliveryBatchId: batchId };
          }
          return o;
        })
      );
    } else if (nextStatus === 'arrived_at_pickup') {
      // Req 23 & 24: Notify buyers, set all paid/preparing/in_transit orders to ready_for_pickup, and increase pickup point currentLoad
      buyerIds.forEach((uid) => {
        pushNotification(
          uid,
          'pickup_ready',
          `Đơn đã đến ${pointName}`,
          `Đơn đã đến ${pointName}. Bạn có thể đến nhận hàng.`,
          `batch-arrived-${batchId}-${uid}`,
          targetBatch.roomId
        );
      });

      setOrders((prev) =>
        prev.map((o) => {
          if (
            (o.deliveryBatchId === batchId || o.roomId === targetBatch.roomId) &&
            (o.status === 'paid' || o.status === 'preparing' || o.status === 'in_transit')
          ) {
            return {
              ...o,
              status: 'ready_for_pickup',
              readyForPickupAt: nowIso,
              deliveryBatchId: batchId,
            };
          }
          return o;
        })
      );

      const loadDelta = Math.max(1, batchOrders.length || targetBatch.totalOrders);
      setPickupPoints((prev) =>
        prev.map((pt) => {
          if (pt.id !== targetBatch.pickupPointId && pt.name !== targetBatch.pickupPointName) {
            return pt;
          }
          const nextLoad = Math.min(pt.capacity, pt.currentLoad + loadDelta);
          const nextPtStatus: PickupPoint['status'] =
            pt.status === 'inactive'
              ? 'inactive'
              : nextLoad >= pt.capacity
              ? 'full'
              : 'active';
          return { ...pt, currentLoad: nextLoad, status: nextPtStatus };
        })
      );
    } else if (nextStatus === 'completed') {
      // Req 24 & 43: Release pickup point capacity (never < 0)
      const loadDelta = Math.max(1, batchOrders.length || targetBatch.totalOrders);
      setPickupPoints((prev) =>
        prev.map((pt) => {
          if (pt.id !== targetBatch.pickupPointId && pt.name !== targetBatch.pickupPointName) {
            return pt;
          }
          const nextLoad = Math.max(0, pt.currentLoad - loadDelta);
          const nextPtStatus: PickupPoint['status'] =
            pt.status === 'inactive'
              ? 'inactive'
              : nextLoad >= pt.capacity
              ? 'full'
              : 'active';
          return { ...pt, currentLoad: nextLoad, status: nextPtStatus };
        })
      );
    }

    if (isSupabaseConfigured && !useLocalDemoMode) {
      advanceDeliveryStatusViaRpc(batchId, nextStatus, title, description).catch(console.error);
    }

    showToast(`Lô #${batchId} đã chuyển sang trạng thái: ${nextStatus.toUpperCase()}`);
  };

  // Phase 7: Report Delivery Issue (Req 39)
  const handleReportDeliveryIssue = (
    batchId: string,
    issueType: DeliveryIssueType,
    note: string
  ) => {
    const nowIso = new Date().toISOString();
    const newIssue: DeliveryIssue = {
      id: `iss-${Date.now()}`,
      batchId,
      reportedBy: currentUser?.id,
      issueType,
      note,
      status: 'open',
      createdAt: nowIso,
    };
    setDeliveryIssues((prev) => [newIssue, ...prev]);
    setDeliveryBatches((prev) =>
      prev.map((b) => (b.id === batchId ? { ...b, status: 'delivery_issue' } : b))
    );
    setDeliveryEvents((prev) => [
      ...prev,
      {
        id: `devt-${Date.now()}`,
        batchId,
        status: 'delivery_issue',
        title: `Cảnh báo sự cố vận chuyển: ${issueType}`,
        description: note,
        createdAt: nowIso,
      },
    ]);
    if (isSupabaseConfigured && !useLocalDemoMode) {
      insertDeliveryIssueInDb(newIssue).catch(console.error);
    }
    showToast(`Đã ghi nhận sự cố "${issueType}" cho lô #${batchId}.`);
  };

  // Phase 7: Admin Pickup Point CRUD (Req 40, 41, 42)
  const handleSavePickupPoint = (point: PickupPoint) => {
    setPickupPoints((prev) => {
      const exists = prev.some((p) => p.id === point.id);
      if (exists) {
        return prev.map((p) => (p.id === point.id ? point : p));
      }
      return [...prev, point];
    });
    if (isSupabaseConfigured && !useLocalDemoMode) {
      upsertPickupPointInDb(point).catch(console.error);
    }
  };

  const handleTogglePickupPointStatus = (pointId: string) => {
    setPickupPoints((prev) =>
      prev.map((pt) => {
        if (pt.id !== pointId) return pt;
        const nextStatus: PickupPoint['status'] =
          pt.status === 'inactive'
            ? pt.currentLoad >= pt.capacity
              ? 'full'
              : 'active'
            : 'inactive';
        const updated = { ...pt, status: nextStatus };
        if (isSupabaseConfigured && !useLocalDemoMode) {
          upsertPickupPointInDb(updated).catch(console.error);
        }
        showToast(
          `Điểm nhận "${pt.name}" đã chuyển sang trạng thái ${nextStatus.toUpperCase()}.`
        );
        return updated;
      })
    );
  };

  // Phase 7: Late Pickup Overdue simulation (Req 32)
  const handleMarkOrderOverdue = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: 'pickup_overdue' } : o))
    );
    const ord = orders.find((o) => o.id === orderId);
    if (ord) {
      pushNotification(
        ord.userId,
        'pickup_ready',
        'Quá thời gian nhận hàng',
        'Quá thời gian nhận hàng. Vui lòng liên hệ điểm nhận.',
        `overdue-${ord.id}`,
        ord.roomId,
        ord.id
      );
    }
    showToast(`Đã đánh dấu đơn #${orderId} quá hạn nhận hàng (pickup_overdue).`);
  };

  // Supplier Payout Request Handler (Requirements 10, 11, 13)
  const handleRequestPayout = async (params: {
    amount: number;
    orderIds: string[];
    periodStart: string;
    periodEnd: string;
    note?: string;
  }) => {
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      showToast('CẦN KẾT NỐI MẠNG ĐỂ THỰC HIỆN THAO TÁC NÀY', 'WARNING');
      return;
    }
    const { amount, orderIds, periodStart, periodEnd, note } = params;
    if (!currentSupplier || amount <= 0 || orderIds.length === 0) return;

    const newPayout: SupplierPayout = {
      id: `PAYOUT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      supplierId: currentSupplier.id,
      supplierName: currentSupplier.businessName,
      amount,
      status: 'pending',
      orderCount: orderIds.length,
      orderIds,
      periodStart,
      periodEnd,
      requestedAt: new Date().toISOString(),
      note,
    };

    setPayouts((prev) => [newPayout, ...prev]);

    // Notify all Admin users (Requirement 13)
    const adminUsers = users.filter((u) => u.role === 'admin');
    adminUsers.forEach((admin) => {
      pushNotification(
        admin.id,
        'payout',
        'Yêu cầu đối soát mới',
        'Nhà cung cấp đã gửi yêu cầu đối soát mới.',
        `payout-req-${newPayout.id}-${admin.id}`
      );
    });

    if (isSupabaseConfigured && !useLocalDemoMode) {
      await financeService
        .createPayoutRequest({
          supplierId: currentSupplier.id,
          supplierName: currentSupplier.businessName,
          amount,
          orderIds,
          periodStart,
          periodEnd,
          note,
        })
        .catch(console.error);
    }

    showToast(`Đã gửi yêu cầu đối soát ${formatVND(amount)} (${orderIds.length} đơn) thành công!`);
  };

  // Admin Payout Status Transition Handler (Requirements 12 & 13)
  const handleUpdatePayoutStatus = (payoutId: string, status: PayoutStatus) => {
    const targetPayout = payouts.find((p) => p.id === payoutId);
    if (!targetPayout) return;

    const nowIso = new Date().toISOString();
    const targetSupplier = suppliers.find((s) => s.id === targetPayout.supplierId);

    setPayouts((prev) =>
      prev.map((p) => {
        if (p.id !== payoutId) return p;
        const updated: SupplierPayout = { ...p, status };
        if (status === 'approved') updated.approvedAt = nowIso;
        if (status === 'paid') updated.paidAt = nowIso;
        return updated;
      })
    );

    if (targetSupplier?.userId) {
      if (status === 'approved') {
        pushNotification(
          targetSupplier.userId,
          'payout',
          'Yêu cầu đối soát đã được duyệt',
          'Yêu cầu đối soát đã được duyệt.',
          `payout-app-${payoutId}`
        );
      } else if (status === 'paid') {
        pushNotification(
          targetSupplier.userId,
          'payout',
          'Đã hoàn tất thanh toán đối soát',
          'Khoản đối soát đã được đánh dấu hoàn tất.',
          `payout-paid-${payoutId}`
        );
      } else if (status === 'rejected') {
        pushNotification(
          targetSupplier.userId,
          'payout',
          'Yêu cầu đối soát bị từ chối',
          'Yêu cầu đối soát của bạn đã bị từ chối. Các đơn hàng đã mở khóa lại.',
          `payout-rej-${payoutId}`
        );
      }
    }

    if (isSupabaseConfigured && !useLocalDemoMode) {
      financeService
        .updatePayoutStatus(payoutId, status, targetSupplier?.userId)
        .catch(console.error);
    }

    showToast(
      status === 'approved'
        ? 'Đã phê duyệt yêu cầu đối soát.'
        : status === 'paid'
        ? 'Đã mô phỏng chi trả đối soát (Simulate Paid) thành công!'
        : 'Đã từ chối yêu cầu đối soát.'
    );
  };

  // Admin Platform Commission Rate Handler (Requirement 22)
  const handleUpdateCommissionRate = (newRate: number) => {
    setCommissionRate(newRate);
    if (isSupabaseConfigured && !useLocalDemoMode) {
      financeService.updateCommissionRate(newRate).catch(console.error);
    }
  };

  // Review submission (Requirements 27, 28, 29 & Phase 6 Req 42, 51)
  const handleSubmitReview = (newReview: Review) => {
    const alreadyReviewedForOrder = reviews.some((r) => r.orderId === newReview.orderId);
    setReviews((prev) => [newReview, ...prev]);

    // Recalculate supplier rating
    setSuppliers((prev) =>
      prev.map((s) => {
        if (s.id !== newReview.supplierId) return s;
        const existingSupplierReviews = reviews.filter((r) => r.supplierId === s.id);
        const totalRatingPoints =
          existingSupplierReviews.reduce((acc, r) => acc + r.supplierRating, 0) + newReview.supplierRating;
        const newTotalReviews = existingSupplierReviews.length + 1;
        const newAvg = totalRatingPoints / newTotalReviews;

        return {
          ...s,
          rating: Number(newAvg.toFixed(1)),
          totalReviews: newTotalReviews,
        };
      })
    );

    if (!alreadyReviewedForOrder) {
      awardLoyaltyPoints(
        newReview.userId,
        5,
        'review',
        `Đánh giá đơn hàng #${newReview.orderId}`,
        `review-${newReview.orderId}`
      );
      if (isSupabaseConfigured && !useLocalDemoMode) {
        socialService.awardReviewPointsRpc(newReview.orderId).catch(console.error);
      }
    }

    setReviewOrderModal(null);
    showToast('Cảm ơn bạn đã gửi đánh giá! Bạn nhận được +5 FlashPoints.');
  };

  // Phase 6: Group Room Chat, Moderation, Reactions & Share Handlers (Req 15-23, 49)
  const handleSendRoomMessage = (roomId: string, text: string) => {
    if (!currentUser) return;
    const trimmed = text.trim().slice(0, 300);
    if (!trimmed) return;

    const newMsg: GroupMessage = {
      id: `msg-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      roomId,
      userId: currentUser.id,
      userName: getSafeFirstName(currentUser.name),
      message: trimmed,
      createdAt: new Date().toISOString(),
    };

    setGroupMessages((prev) => [...prev, newMsg]);
    if (isSupabaseConfigured && !useLocalDemoMode) {
      socialService.sendGroupMessage(newMsg).catch(console.error);
    }
  };

  const handleModerateHideMessage = (messageId: string) => {
    const nowIso = new Date().toISOString();
    setGroupMessages((prev) =>
      prev.map((m) => (m.id === messageId ? { ...m, deletedAt: nowIso } : m))
    );
    if (isSupabaseConfigured && !useLocalDemoMode) {
      socialService.hideGroupMessage(messageId).catch(console.error);
    }
    showToast('Đã ẩn tin nhắn khỏi phòng gom.');
  };

  const handleToggleReaction = (messageId: string, reaction: ReactionType) => {
    if (!currentUser) return;
    const isRemoving = messageReactions.some(
      (r) => r.messageId === messageId && r.userId === currentUser.id && r.reaction === reaction
    );
    setMessageReactions((prev) => {
      if (isRemoving) {
        return prev.filter(
          (r) => !(r.messageId === messageId && r.userId === currentUser.id && r.reaction === reaction)
        );
      }
      const newReaction: MessageReaction = {
        messageId,
        userId: currentUser.id,
        reaction,
        createdAt: new Date().toISOString(),
      };
      return [...prev, newReaction];
    });

    if (isSupabaseConfigured && !useLocalDemoMode) {
      socialService.toggleMessageReaction(messageId, currentUser.id, reaction, isRemoving).catch(console.error);
    }
  };

  const handleRoomShared = (roomId: string) => {
    emitRoomEvent(roomId, 'shared', {
      actorUserId: currentUser?.id,
      actorName: currentUser?.name,
    });
  };

  // Phase 6: Admin Voucher Management Handlers (Requirement 39)
  const handleSaveVoucher = (voucher: Voucher) => {
    setVouchers((prev) => {
      const exists = prev.some((v) => v.id === voucher.id);
      if (exists) {
        return prev.map((v) => (v.id === voucher.id ? voucher : v));
      }
      return [voucher, ...prev];
    });
    if (isSupabaseConfigured && !useLocalDemoMode) {
      socialService.saveVoucher(voucher).catch(console.error);
    }
  };

  const handleToggleVoucherStatus = (voucherId: string) => {
    setVouchers((prev) =>
      prev.map((v) => {
        if (v.id !== voucherId) return v;
        const nextStatus: Voucher['status'] = v.status === 'active' ? 'inactive' : 'active';
        if (isSupabaseConfigured && !useLocalDemoMode) {
          socialService.saveVoucher({ ...v, status: nextStatus }).catch(console.error);
        }
        showToast(`Đã ${nextStatus === 'active' ? 'kích hoạt' : 'vô hiệu hóa'} mã ưu đãi ${v.code}.`);
        return { ...v, status: nextStatus };
      })
    );
  };

  // Refund submission (Requirements 38, 39, 40)
  const handleSubmitRefund = (newRefund: RefundRequest) => {
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      showToast('CẦN KẾT NỐI MẠNG ĐỂ THỰC HIỆN THAO TÁC NÀY', 'WARNING');
      return;
    }
    setRefunds((prev) => [newRefund, ...prev]);
    appendAuditLog('refund_requested', 'refund', newRefund.id, {
      orderId: newRefund.orderId,
      reason: newRefund.reason,
    });
    setRefundOrderModal(null);
    showToast('Đã gửi yêu cầu hoàn tiền. Quản trị viên sẽ xem xét đối soát.');
  };

  // Supplier cancel room (Requirement 22)
  const handleSupplierCancelRoom = (roomId: string, reason: string) => {
    const targetRoom = rooms.find((r) => r.id === roomId);
    if (!targetRoom) return;

    setRooms((prev) =>
      prev.map((r) => (r.id === roomId ? { ...r, status: 'cancelled' } : r))
    );

    // Notify all buyers
    const buyers = participations.filter((p) => p.roomId === roomId).map((p) => p.userId);
    buyers.forEach((bId) => {
      pushNotification(
        bId,
        'refund',
        'Phòng gom đã bị hủy',
        `Nhà cung cấp đã hủy phòng "${targetRoom.productName}". Lý do: ${reason}.`,
        undefined,
        roomId
      );
    });

    showToast(`Đã hủy phòng gom "${targetRoom.productName}".`);
  };

  // ==========================================
  // PHASE 8: COMPLIANCE, PRIVACY, COMPLAINTS & MODERATION HANDLERS
  // ==========================================

  // Req 1 & 2: Update Supplier Legal Info
  const handleUpdateSupplierLegalInfo = (updatedSupplier: Supplier) => {
    setSuppliers((prev) => prev.map((s) => (s.id === updatedSupplier.id ? updatedSupplier : s)));
    appendAuditLog('supplier_verified', 'supplier', updatedSupplier.id, {
      action: 'supplier_legal_info_updated',
      legalName: updatedSupplier.legalName,
      taxCode: updatedSupplier.taxCode,
    });
    showToast('Đã cập nhật hồ sơ pháp lý nhà cung cấp.');
  };

  // Req 4: Add Category Compliance Document
  const handleAddVerificationDocument = (
    docInput: Omit<SupplierVerificationDocument, 'id' | 'createdAt' | 'status'>
  ) => {
    const newDoc: SupplierVerificationDocument = {
      ...docInput,
      id: `vdoc-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    setVerificationDocuments((prev) => [newDoc, ...prev]);
    if (isSupabaseConfigured && !useLocalDemoMode) {
      complianceService.createVerificationDocument(newDoc).catch(console.error);
    }
    showToast('Đã tải lên hồ sơ pháp lý / tài liệu công bố.');
  };

  // Req 1 & 4: Admin Review Verification Document
  const handleReviewVerificationDocument = (
    docId: string,
    status: 'approved' | 'rejected',
    note: string
  ) => {
    const nowIso = new Date().toISOString();
    setVerificationDocuments((prev) =>
      prev.map((d) =>
        d.id === docId
          ? {
              ...d,
              status,
              reviewNote: note,
              reviewedBy: currentUser?.id,
              reviewedAt: nowIso,
            }
          : d
      )
    );
    if (isSupabaseConfigured && !useLocalDemoMode && currentUser) {
      complianceService
        .updateVerificationDocumentStatus(docId, status, currentUser.id, note)
        .catch(console.error);
    }
    showToast(
      `Đã cập nhật trạng thái tài liệu: ${status === 'approved' ? 'ĐÃ DUYỆT' : 'TỪ CHỐI'}.`
    );
  };

  // Req 8, 9, 10: Submit Complaint Case with 3-Working-Day SLA & Immediate Acknowledgement Notification
  const handleSubmitComplaint = (params: {
    complaintType: ComplaintType;
    orderId?: string;
    supplierId?: string;
    description: string;
    evidenceMetadata: ComplaintEvidenceItem[];
  }) => {
    if (!currentUser) return;
    const nowIso = new Date().toISOString();
    const targetOrd = params.orderId ? orders.find((o) => o.id === params.orderId) : undefined;
    const suppId = params.supplierId || targetOrd?.supplierId;
    const targetSupp = suppId ? suppliers.find((s) => s.id === suppId) : undefined;
    const complaintId = `CMP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const deadlineIso = calculateWorkingDaysDeadline(nowIso, 3);

    const newComplaint: ComplaintCase = {
      id: complaintId,
      userId: currentUser.id,
      userName: currentUser.name,
      supplierId: suppId,
      supplierName: targetSupp?.businessName,
      orderId: params.orderId,
      roomId: targetOrd?.roomId,
      complaintType: params.complaintType,
      description: params.description,
      evidenceMetadata: params.evidenceMetadata,
      status: 'submitted',
      submittedAt: nowIso,
      acknowledgementDeadline: deadlineIso,
      updatedAt: nowIso,
    };

    const initialMessage: ComplaintMessage = {
      id: `cmsg-${Date.now()}`,
      complaintId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentUser.role,
      message: params.description,
      createdAt: nowIso,
    };

    setComplaintCases((prev) => [newComplaint, ...prev]);
    setComplaintMessages((prev) => [...prev, initialMessage]);
    appendAuditLog('complaint_submitted', 'complaint', newComplaint.id, {
      complaintType: newComplaint.complaintType,
      orderId: newComplaint.orderId,
      acknowledgementDeadline: newComplaint.acknowledgementDeadline,
    });
    pushNotification(
      newComplaint.userId,
      'system',
      `Đã tiếp nhận khiếu nại #${newComplaint.id}`,
      `Yêu cầu khiếu nại của bạn đã được hệ thống ghi nhận. Hạn cam kết phản hồi tiếp nhận tối đa 03 ngày làm việc (trước ${new Date(
        newComplaint.acknowledgementDeadline
      ).toLocaleDateString('vi-VN')}).`,
      `complaint-ack-${newComplaint.id}`,
      newComplaint.roomId,
      newComplaint.orderId
    );
    if (isSupabaseConfigured && !useLocalDemoMode) {
      complianceService.createComplaintCase(newComplaint).catch(console.error);
      complianceService.insertComplaintMessage(initialMessage).catch(console.error);
    }
    showToast('Đã gửi hồ sơ khiếu nại & cấp mã theo dõi SLA 3 ngày làm việc!');
  };

  const handleReplyComplaint = (
    complaintId: string,
    messageText: string,
    nextStatus?: ComplaintStatus
  ) => {
    if (!currentUser) return;
    const nowIso = new Date().toISOString();
    const msg: ComplaintMessage = {
      id: `cmsg-${Date.now()}`,
      complaintId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentUser.role,
      message: messageText,
      createdAt: nowIso,
    };
    setComplaintMessages((prev) => [...prev, msg]);
    if (isSupabaseConfigured && !useLocalDemoMode) {
      complianceService.insertComplaintMessage(msg).catch(console.error);
    }
    if (nextStatus) {
      handleAdminUpdateComplaint(complaintId, nextStatus, undefined, undefined);
    } else {
      showToast('Đã gửi phản hồi vào hồ sơ khiếu nại.');
    }
  };

  const handleAdminUpdateComplaint = (
    complaintId: string,
    status: ComplaintStatus,
    messageText?: string,
    resolution?: string
  ) => {
    const nowIso = new Date().toISOString();
    const targetCase = complaintCases.find((c) => c.id === complaintId);
    setComplaintCases((prev) =>
      prev.map((c) => {
        if (c.id !== complaintId) return c;
        return {
          ...c,
          status,
          acknowledgedAt:
            status === 'acknowledged' || c.acknowledgedAt ? c.acknowledgedAt || nowIso : undefined,
          resolvedAt:
            status === 'resolved' || status === 'rejected' ? nowIso : c.resolvedAt,
          resolution: resolution || c.resolution,
          updatedAt: nowIso,
        };
      })
    );

    if ((messageText || resolution) && currentUser) {
      const sysMsg: ComplaintMessage = {
        id: `cmsg-${Date.now()}`,
        complaintId,
        senderId: currentUser.id,
        senderName: currentUser.name,
        senderRole: currentUser.role,
        message: messageText || `[Cập nhật trạng thái: ${status}] ${resolution}`,
        createdAt: nowIso,
      };
      setComplaintMessages((prev) => [...prev, sysMsg]);
      if (isSupabaseConfigured && !useLocalDemoMode) {
        complianceService.insertComplaintMessage(sysMsg).catch(console.error);
      }
    }

    if (targetCase) {
      pushNotification(
        targetCase.userId,
        'system',
        `Cập nhật hồ sơ khiếu nại #${complaintId}`,
        `Khiếu nại của bạn đã chuyển sang trạng thái: ${status.toUpperCase()}.${
          resolution ? ` Ghi chú: ${resolution}` : ''
        }`,
        `complaint-status-${complaintId}-${status}`,
        targetCase.roomId,
        targetCase.orderId
      );
    }

    appendAuditLog('complaint_updated', 'complaint', complaintId, {
      status,
      resolution,
    });

    if (isSupabaseConfigured && !useLocalDemoMode) {
      complianceService
        .updateComplaintCase(complaintId, {
          status,
          acknowledgedAt: status === 'acknowledged' ? nowIso : undefined,
          resolvedAt: status === 'resolved' || status === 'rejected' ? nowIso : undefined,
          resolution,
        })
        .catch(console.error);
    }

    showToast(`Đã cập nhật trạng thái khiếu nại #${complaintId} sang ${status.toUpperCase()}.`);
  };

  // Req 15 & 16: Toggle Purpose-Specific Personal Data Consent
  const handleToggleConsent = (purpose: ConsentPurpose, accepted: boolean) => {
    if (!currentUser) return;
    const nowIso = new Date().toISOString();
    const isReq =
      purpose === 'account_required' ||
      purpose === 'order_fulfillment' ||
      purpose === 'pickup_logistics';
    const record: ConsentRecord = {
      id: `consent-${currentUser.id}-${purpose}-${Date.now()}`,
      userId: currentUser.id,
      purpose,
      isRequired: isReq,
      accepted,
      policyVersion: 'v2026.1',
      source: 'privacy_center',
      timestamp: nowIso,
      withdrawnAt: !accepted ? nowIso : undefined,
    };

    setConsentRecords((prev) => {
      const exists = prev.some((r) => r.userId === currentUser.id && r.purpose === purpose);
      if (exists) {
        return prev.map((r) =>
          r.userId === currentUser.id && r.purpose === purpose ? record : r
        );
      }
      return [record, ...prev];
    });

    appendAuditLog('consent_updated', 'consent', record.id, {
      purpose,
      accepted,
      policyVersion: record.policyVersion,
    });

    if (isSupabaseConfigured && !useLocalDemoMode) {
      complianceService.insertConsentRecord(record).catch(console.error);
    }

    showToast(
      accepted
        ? `Đã cấp sự đồng ý cho mục đích: ${purpose}`
        : `Đã rút lại sự đồng ý cho mục đích: ${purpose}`
    );
  };

  const handleWithdrawAllOptionalConsent = () => {
    if (!currentUser) return;
    const optionalPurposes: ConsentPurpose[] = [
      'marketing',
      'personalized_recommendations',
      'precise_location',
      'referral_tracking',
      'analytics_optional',
    ];
    optionalPurposes.forEach((p) => handleToggleConsent(p, false));
    showToast('Đã rút lại toàn bộ sự đồng ý cho các mục đích tùy chọn.');
  };

  // Req 14 & 18: Submit Privacy Request & 5-Stage Admin Workflow
  const handleSubmitPrivacyRequest = (
    requestType: PrivacyRequestType,
    details: string,
    retainedExplanation?: string
  ) => {
    if (!currentUser) return;
    const nowIso = new Date().toISOString();
    const newReq: PrivacyRequest = {
      id: `priv-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      requestType,
      deletionStage: requestType === 'deletion' ? 'requested' : undefined,
      status: 'submitted',
      details,
      retainedCategoriesExplanation:
        retainedExplanation ||
        (requestType === 'deletion'
          ? 'Theo Luật Giao dịch điện tử 2023 và Luật Kế toán, hồ sơ đơn hàng và chứng từ đối soát kế toán đã phát sinh được lưu trữ tối thiểu theo thời hạn luật định; dữ liệu định danh tiếp thị và hồ sơ công khai sẽ được ẩn danh.'
          : undefined),
      createdAt: nowIso,
      updatedAt: nowIso,
    };
    setPrivacyRequests((prev) => [newReq, ...prev]);
    appendAuditLog('privacy_request_submitted', 'privacy_request', newReq.id, {
      requestType,
      deletionStage: newReq.deletionStage,
    });
    if (isSupabaseConfigured && !useLocalDemoMode) {
      complianceService.createPrivacyRequest(newReq).catch(console.error);
    }
    showToast('Đã gửi yêu cầu quyền chủ thể dữ liệu đến bộ phận Bảo vệ dữ liệu cá nhân.');
  };

  const handleAdminUpdatePrivacyRequest = (
    requestId: string,
    status: PrivacyRequest['status'],
    deletionStage?: AccountDeletionStage,
    adminNote?: string
  ) => {
    const nowIso = new Date().toISOString();
    setPrivacyRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? {
              ...r,
              status,
              deletionStage: deletionStage || r.deletionStage,
              adminNote: adminNote || r.adminNote,
              processedBy: currentUser?.id,
              updatedAt: nowIso,
            }
          : r
      )
    );
    appendAuditLog('privacy_request_submitted', 'privacy_request', requestId, {
      status,
      deletionStage,
      adminNote,
    });
    if (isSupabaseConfigured && !useLocalDemoMode) {
      complianceService
        .updatePrivacyRequest(requestId, {
          status,
          deletionStage,
          adminNote,
          processedBy: currentUser?.id,
        })
        .catch(console.error);
    }
    showToast(`Đã cập nhật yêu cầu quyền riêng tư #${requestId} sang trạng thái: ${status}.`);
  };

  // Req 26, 27, 28: Product Safety Reporting & Moderation
  const handleSubmitProductReportFromModal = (
    reason: ProductReportReason,
    description: string
  ) => {
    if (!currentUser || !reportProductModalProductId) return;
    const targetProd = products.find((p) => p.id === reportProductModalProductId);
    const report: ProductReport = {
      id: `prep-${Date.now()}`,
      productId: reportProductModalProductId,
      productName: targetProd?.name || 'Sản phẩm',
      supplierId: targetProd?.supplierId,
      roomId: activeRoom?.id,
      reporterUserId: currentUser.id,
      reason,
      description,
      status: 'open',
      createdAt: new Date().toISOString(),
    };
    setProductReports((prev) => [report, ...prev]);
    appendAuditLog('product_suspended', 'product', report.productId, {
      action: 'product_reported',
      reportId: report.id,
      reason: report.reason,
    });
    if (isSupabaseConfigured && !useLocalDemoMode) {
      complianceService.createProductReport(report).catch(console.error);
    }
    setReportProductModalProductId(null);
    showToast('Đã gửi báo cáo an toàn / nhãn hàng hóa cho Quản trị viên.');
  };

  const handleResolveProductReport = (
    reportId: string,
    status: ProductReport['status'],
    note: string
  ) => {
    const nowIso = new Date().toISOString();
    setProductReports((prev) =>
      prev.map((r) =>
        r.id === reportId
          ? {
              ...r,
              status,
              adminActionNote: note,
              reviewedBy: currentUser?.id,
              reviewedAt: nowIso,
            }
          : r
      )
    );
    if (isSupabaseConfigured && !useLocalDemoMode && currentUser) {
      complianceService
        .updateProductReport(reportId, status, currentUser.id, note)
        .catch(console.error);
    }
    showToast(`Đã cập nhật trạng thái báo cáo #${reportId} sang ${status}.`);
  };

  const handleModerateProduct = (
    productId: string,
    action: 'temporarily_hide' | 'request_supplier_evidence' | 'reinstate' | 'permanently_deactivate',
    reason: string
  ) => {
    const nowIso = new Date().toISOString();
    const targetProduct = products.find((p) => p.id === productId);
    const nextStatus: Product['status'] =
      action === 'temporarily_hide'
        ? 'temporarily_hidden'
        : action === 'request_supplier_evidence'
        ? 'evidence_requested'
        : action === 'permanently_deactivate'
        ? 'permanently_deactivated'
        : 'active';

    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? {
              ...p,
              status: nextStatus,
              moderationNote: reason,
            }
          : p
      )
    );

    const modRecord: ModerationAction = {
      id: `mod-${Date.now()}`,
      targetType: 'product',
      targetId: productId,
      targetName: targetProduct?.name,
      action,
      reason,
      actorId: currentUser?.id || 'admin-1',
      actorName: currentUser?.name || 'Admin Compliance',
      createdAt: nowIso,
    };
    setModerationActions((prev) => [modRecord, ...prev]);
    appendAuditLog('product_suspended', 'product', productId, {
      action,
      nextStatus,
      reason,
    });

    if (isSupabaseConfigured && !useLocalDemoMode) {
      complianceService.insertModerationAction(modRecord).catch(console.error);
    }

    showToast(`Đã áp dụng biện pháp kiểm duyệt "${action}" đối với sản phẩm.`);
  };

  // Req 11: Review Integrity Moderation (never hide solely because of low rating)
  const handleModerateReview = (
    reviewId: string,
    isModerated: boolean,
    reason?: ReviewModerationReason
  ) => {
    const nowIso = new Date().toISOString();
    setReviews((prev) =>
      prev.map((r) =>
        r.id === reviewId
          ? {
              ...r,
              isModerated,
              moderationReason: isModerated ? reason : undefined,
              moderatedBy: isModerated ? currentUser?.id : undefined,
              moderatedAt: isModerated ? nowIso : undefined,
            }
          : r
      )
    );
    appendAuditLog('review_moderated', 'review', reviewId, {
      isModerated,
      reason,
    });
    showToast(
      isModerated
        ? 'Đã ẩn nội dung đánh giá vi phạm quy định (vẫn giữ nguyên điểm sao trung thực).'
        : 'Đã khôi phục hiển thị nội dung đánh giá.'
    );
  };

  // Req 33: Internal Compliance Checklist Update
  const handleUpdateChecklistItem = (
    itemId: string,
    status: ComplianceChecklistStatus,
    internalNote: string
  ) => {
    const nowIso = new Date().toISOString();
    setComplianceChecklist((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              status,
              internalNote,
              updatedBy: currentUser?.name || 'Admin Compliance',
              updatedAt: nowIso,
            }
          : item
      )
    );
    if (isSupabaseConfigured && !useLocalDemoMode && currentUser) {
      complianceService
        .updateChecklistItem(itemId, status, currentUser.id, internalNote)
        .catch(console.error);
    }
    showToast('Đã cập nhật trạng thái danh mục tự kiểm tra tuân thủ.');
  };

  // ==========================================
  // 2. ACTIVE DRILLDOWNS & DATA MEMOS
  // ==========================================
  const activeRoom = useMemo(() => {
    return rooms.find((r) => r.id === selectedRoomId);
  }, [rooms, selectedRoomId]);

  const activeRoomParticipation = useMemo(() => {
    if (!selectedRoomId || !currentUser) return undefined;
    return participations.find(
      (p) => p.roomId === selectedRoomId && p.userId === currentUser.id && p.status !== 'cancelled'
    );
  }, [participations, selectedRoomId, currentUser]);

  const joinModalRoom = useMemo(() => {
    return rooms.find((r) => r.id === joinModalRoomId);
  }, [rooms, joinModalRoomId]);

  const shareModalRoom = useMemo(() => {
    return rooms.find((r) => r.id === shareModalRoomId) || null;
  }, [rooms, shareModalRoomId]);

  const currentSupplier = useMemo(() => {
    if (!currentUser || currentUser.role !== 'supplier') return suppliers[0];
    return suppliers.find((s) => s.userId === currentUser.id) || suppliers[0];
  }, [currentUser, suppliers]);

  const myJoinedRoomIds = useMemo(() => {
    if (!currentUser) return [];
    return participations
      .filter((p) => p.userId === currentUser.id && p.status !== 'cancelled')
      .map((p) => p.roomId);
  }, [participations, currentUser]);

  // Filtered & Sorted Rooms for Discovery
  const categoriesList = ['Tất cả', 'Thực phẩm', 'Đồ gia dụng', 'Đồ uống', 'Sinh viên'];

  const filteredDiscoveryRooms = useMemo(() => {
    let result = rooms.filter((r) => {
      // Phase 8 Req 27 & 29: Hide rooms whose product is temporarily hidden / permanently deactivated or whose supplier is suspended
      const roomProduct = products.find((p) => p.id === r.productId);
      if (
        roomProduct &&
        (roomProduct.status === 'temporarily_hidden' ||
          roomProduct.status === 'permanently_deactivated')
      ) {
        return false;
      }
      const roomSupplier = suppliers.find((s) => s.id === r.supplierId);
      if (roomSupplier && roomSupplier.verificationStatus === 'suspended') {
        return false;
      }

      // Search query (Requirement 41 & Phase 11 debouncing)
      if (debouncedSearch.trim()) {
        const q = debouncedSearch.toLowerCase();
        const matchName = r.productName.toLowerCase().includes(q);
        const matchSupplier = r.supplierName.toLowerCase().includes(q);
        const matchCat = r.category.toLowerCase().includes(q);
        if (!matchName && !matchSupplier && !matchCat) return false;
      }
      // Category filter
      if (filters.category !== 'all' && r.category !== filters.category) return false;
      // Distance filter
      if (r.distanceMeters > filters.maxDistanceMeters) return false;
      // Status filter
      if (filters.status !== 'all' && r.status !== filters.status) return false;
      // Pickup point filter
      if (filters.pickupPoint !== 'all' && !r.pickupPoint.includes(filters.pickupPoint)) return false;

      // City & Area Geographic Filter (Phase 9 Refinement)
      if (selectedCity !== 'all' && r.provinceOrCity && r.provinceOrCity !== selectedCity) return false;
      if (selectedArea !== 'all' && r.area && r.area !== selectedArea) return false;

      // Quick Highlight Chip Filter (Phase 9)
      if (selectedQuickChip === 'fast_delivery') {
        if (r.distanceMeters > 3000) return false;
      } else if (selectedQuickChip === 'dorm_pickup') {
        const pLower = r.pickupPoint.toLowerCase();
        if (!pLower.includes('ktx') && !pLower.includes('locker') && !pLower.includes('sảnh')) return false;
      } else if (selectedQuickChip === 'farm_produce') {
        const isFarmCat = r.category === 'Thực phẩm';
        const nameLower = r.productName.toLowerCase();
        const hasFarmKeyword = /trái cây|bơ|trứng|gạo|xoài|cam|rau|thịt|cá|khoai|chuối|sữa/.test(nameLower);
        if (!isFarmCat && !hasFarmKeyword) return false;
      } else if (selectedQuickChip === 'hot_deal') {
        const currentP = r.finalPrice ?? getCurrentPrice(r.totalQuantity, r.priceTiers);
        const isHot = r.isSponsored || r.participantCount >= 5 || (r.initialPrice - currentP) >= 8000;
        if (!isHot) return false;
      }

      return true;
    });

    // Sort (Requirement 43)
    result = [...result].sort((a, b) => {
      if (filters.sortBy === 'near_me') {
        return a.distanceMeters - b.distanceMeters;
      }
      if (filters.sortBy === 'ending_soon') {
        return getSecondsLeft(a.endAt) - getSecondsLeft(b.endAt);
      }
      if (filters.sortBy === 'lowest_price') {
        const priceA = a.finalPrice ?? getCurrentPrice(a.totalQuantity, a.priceTiers);
        const priceB = b.finalPrice ?? getCurrentPrice(b.totalQuantity, b.priceTiers);
        return priceA - priceB;
      }
      if (filters.sortBy === 'highest_discount') {
        const priceA = a.finalPrice ?? getCurrentPrice(a.totalQuantity, a.priceTiers);
        const priceB = b.finalPrice ?? getCurrentPrice(b.totalQuantity, b.priceTiers);
        const discountA = a.initialPrice - priceA;
        const discountB = b.initialPrice - priceB;
        return discountB - discountA;
      }
      if (filters.sortBy === 'most_popular') {
        return b.participantCount - a.participantCount;
      }
      if (filters.sortBy === 'newest') {
        return new Date(b.startAt).getTime() - new Date(a.startAt).getTime();
      }
      return 0;
    });

    return result;
  }, [rooms, products, suppliers, filters.category, filters.maxDistanceMeters, filters.status, filters.pickupPoint, filters.sortBy, debouncedSearch, now, selectedQuickChip, selectedCity, selectedArea]);

  const featuredRoom = useMemo(() => {
    return [...rooms].sort((a, b) => b.participantCount - a.participantCount)[0] || rooms[0];
  }, [rooms]);

  // ==========================================
  // 3. AUTH SCREEN (IF NOT LOGGED IN)
  // ==========================================
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F6F7FC] p-6 max-w-7xl mx-auto space-y-6">
        <div className="h-16 bg-[#F2E8F0] rounded-2xl w-full animate-pulse" />
        <div className="h-64 bg-[#E4E8F0]/50 rounded-3xl w-full animate-pulse flex items-center justify-center">
          <div className="text-center space-y-2">
            <Loader2 className="w-8 h-8 text-[#3155FF] animate-spin mx-auto" />
            <p className="text-xs font-bold text-[#596273]">Đang đồng bộ dữ liệu FlashGroup...</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <SkeletonRoom />
          <SkeletonRoom />
          <SkeletonRoom />
        </div>
      </div>
    );
  }

  if (!isSupabaseConfigured && !useLocalDemoMode) {
    return (
      <SupabaseSetupScreen onEnableLocalDemoMode={() => setUseLocalDemoMode(true)} />
    );
  }

  // ==========================================
  // 4. MAIN MARKETPLACE APP (LOGGED IN)
  // ==========================================
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-[#C7F000]/40 selection:text-emerald-900 flex flex-col justify-between pb-20 md:pb-0">
      <div>
        {/* TOP OFFLINE DETECTION BANNER (Phase 11) */}
        <OfflineBanner />

        {/* AUTH MODAL (MODAL OVERLAY FOR PUBLIC VISITORS) */}
        {isAuthModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="relative w-full max-w-lg my-8">
              <AuthModalOrPage
                initialMode={authModalMode}
                initialRole={authModalRole}
                onClose={() => setIsAuthModalOpen(false)}
                isSupabaseMode={isSupabaseConfigured && !useLocalDemoMode}
                onLogin={async (email: string, password: string, rememberMe: boolean = true) => {
                  const cleanEmail = email.trim().toLowerCase();
                  // Guaranteed Admin credentials: tranchitin2006@gmail.com or tutrungkien2006@gmail.com / 123456
                  const isGuaranteedAdmin =
                    (cleanEmail === 'tranchitin2006@gmail.com' || cleanEmail === 'tutrungkien2006@gmail.com') &&
                    password === '123456';

                  if (isGuaranteedAdmin) {
                    const isTin = cleanEmail === 'tranchitin2006@gmail.com';
                    const adminAccount: User = {
                      id: isTin ? 'admin-tranchitin' : 'admin-tutrungkien',
                      name: isTin ? 'Trần Chí Tín (Admin)' : 'Từ Trung Kiên (Admin)',
                      email: cleanEmail,
                      password: '123456',
                      role: 'admin',
                      avatar: isTin
                        ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80'
                        : 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
                      phone: isTin ? '0909123456' : '0906025608',
                      status: 'active',
                      createdAt: new Date().toISOString(),
                    };
                    setUsers((prev) => {
                      const exists = prev.some((u) => u.email.toLowerCase() === cleanEmail);
                      const updated = exists
                        ? prev.map((u) =>
                            u.email.toLowerCase() === cleanEmail
                              ? { ...u, role: 'admin' as const, password: '123456', status: 'active' as const, name: adminAccount.name }
                              : u
                          )
                        : [adminAccount, ...prev];
                      try {
                        localStorage.setItem('flashgroup_v3_users', JSON.stringify(updated));
                      } catch {}
                      return updated;
                    });
                    if (rememberMe) {
                      localStorage.setItem('flashgroup_v3_auth_user', JSON.stringify(adminAccount));
                      localStorage.setItem('flashgroup_v3_current_user', JSON.stringify(adminAccount));
                    }
                    setAuthenticatedUser(adminAccount);
                    setPresentedDemoUser(null);
                    setIsAuthModalOpen(false);
                    setAdminTab('overview');
                    navigate('/');
                    showToast(`Đăng nhập thành công với vai trò QUẢN TRỊ VIÊN (ADMIN)! Chào mừng ${adminAccount.name}.`);
                    return { success: true };
                  }

                  if (isSupabaseConfigured && !useLocalDemoMode) {
                    const result = await authService.signIn(email, password);
                    if (result.error || !result.user) {
                      const rawErr = result.error || '';
                      const friendlyErr = rawErr.toLowerCase().includes('invalid') || rawErr.toLowerCase().includes('credentials')
                        ? 'Email hoặc mật khẩu chưa chính xác.'
                        : rawErr.toLowerCase().includes('network')
                        ? 'Không thể kết nối. Vui lòng kiểm tra mạng và thử lại.'
                        : rawErr || 'Đăng nhập không thành công.';
                      return { success: false, error: friendlyErr };
                    }
                    if (rememberMe) {
                      localStorage.setItem('flashgroup_v3_auth_user', JSON.stringify(result.user));
                      localStorage.setItem('flashgroup_v3_current_user', JSON.stringify(result.user));
                    }
                    setAuthenticatedUser(result.user);
                    setPresentedDemoUser(null);
                    setIsAuthModalOpen(false);
                    if (result.user.role === 'supplier') {
                      setSupplierTab('dashboard');
                      navigate('/');
                    } else if (result.user.role === 'admin') {
                      setAdminTab('overview');
                      navigate('/');
                    } else {
                      setBuyerTab('discovery');
                      navigate('/marketplace');
                    }
                    showToast(`Đăng nhập thành công với vai trò ${result.user.role.toUpperCase()}!`);
                    return { success: true };
                  } else {
                    const found = users.find(
                      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
                    );
                    if (!found) {
                      return { success: false, error: 'Email hoặc mật khẩu chưa chính xác.' };
                    }
                    if (rememberMe) {
                      localStorage.setItem('flashgroup_v3_auth_user', JSON.stringify(found));
                      localStorage.setItem('flashgroup_v3_current_user', JSON.stringify(found));
                    }
                    setAuthenticatedUser(found);
                    setPresentedDemoUser(null);
                    setIsAuthModalOpen(false);
                    if (found.role === 'supplier') {
                      setSupplierTab('dashboard');
                      navigate('/');
                    } else if (found.role === 'admin') {
                      setAdminTab('overview');
                      navigate('/');
                    } else {
                      setBuyerTab('discovery');
                      navigate('/marketplace');
                    }
                    showToast(`Đăng nhập thành công với vai trò ${found.role.toUpperCase()}!`);
                    return { success: true };
                  }
                }}
                onRegister={async (payload) => {
                  const targetRole = payload.role === 'supplier' ? 'supplier' : 'buyer';
                  if (isSupabaseConfigured && !useLocalDemoMode) {
                    const result = await authService.signUp(payload);
                    if (result.error || !result.user) {
                      return { success: false, error: result.error || 'Đăng ký không thành công.' };
                    }
                    const userWithStatus: User = {
                      ...result.user,
                      status: targetRole === 'supplier' ? 'pending' : 'active',
                    };
                    setUsers((prev) => {
                      const exists = prev.some((u) => u.email.toLowerCase() === userWithStatus.email.toLowerCase());
                      const updated = exists
                        ? prev.map((u) => (u.email.toLowerCase() === userWithStatus.email.toLowerCase() ? userWithStatus : u))
                        : [userWithStatus, ...prev];
                      try {
                        localStorage.setItem('flashgroup_v3_users', JSON.stringify(updated));
                      } catch {}
                      return updated;
                    });
                    if (targetRole === 'supplier') {
                      const newSupplierRecord: Supplier = {
                        id: `sup-${Date.now()}`,
                        userId: userWithStatus.id,
                        businessName: payload.businessName || payload.name,
                        supplierType: (payload.businessType as any) || 'local_retailer',
                        verificationStatus: 'pending',
                        contactPhone: payload.phone,
                        email: payload.email,
                        businessAddress: payload.businessAddress,
                        sourceDescription: payload.operatingRegion || 'Hộ kinh doanh / Nhà phân phối địa phương',
                        rating: 5.0,
                        totalReviews: 0,
                        isDemo: false,
                        createdAt: new Date().toISOString(),
                      };
                      setSuppliers((prev) => {
                        const updated = [newSupplierRecord, ...prev];
                        try {
                          localStorage.setItem('flashgroup_v3_suppliers', JSON.stringify(updated));
                        } catch {}
                        return updated;
                      });
                    }
                    localStorage.setItem('flashgroup_v3_auth_user', JSON.stringify(userWithStatus));
                    localStorage.setItem('flashgroup_v3_current_user', JSON.stringify(userWithStatus));
                    setAuthenticatedUser(userWithStatus);
                    setPresentedDemoUser(null);
                    setIsAuthModalOpen(false);
                    if (result.user.role === 'supplier') {
                      setSupplierTab('dashboard');
                      navigate('/');
                      showToast('Đăng ký tài khoản Nhà cung cấp thành công! Hồ sơ của bạn đang chờ Quản trị viên duyệt.');
                    } else {
                      setBuyerTab('discovery');
                      navigate('/marketplace');
                      showToast('Đăng ký tài khoản Người mua thành công! Hãy bắt đầu khám phá phòng gom.');
                    }
                    return { success: true };
                  } else {
                    const duplicate = users.find((u) => u.email.toLowerCase() === payload.email.toLowerCase());
                    if (duplicate) {
                      return { success: false, error: 'Email này đã được sử dụng.' };
                    }
                    const newUserId = `${targetRole}-${Date.now()}`;
                    const initialStatus: UserStatus = targetRole === 'supplier' ? 'pending' : 'active';
                    const newUser: User = {
                      id: newUserId,
                      name: payload.name,
                      email: payload.email,
                      password: payload.password,
                      role: targetRole,
                      phone: payload.phone,
                      preferredPickupPoint: payload.preferredPickupPoint,
                      status: initialStatus,
                      createdAt: new Date().toISOString(),
                    };
                    setUsers((prev) => {
                      const updated = [newUser, ...prev];
                      try {
                        localStorage.setItem('flashgroup_v3_users', JSON.stringify(updated));
                      } catch {}
                      return updated;
                    });

                    if (targetRole === 'supplier') {
                      const newSupplierRecord: Supplier = {
                        id: `sup-${Date.now()}`,
                        userId: newUserId,
                        businessName: payload.businessName || payload.name,
                        supplierType: (payload.businessType as any) || 'local_retailer',
                        verificationStatus: 'pending',
                        contactPhone: payload.phone,
                        email: payload.email,
                        businessAddress: payload.businessAddress,
                        sourceDescription: payload.operatingRegion || 'Hộ kinh doanh / Nhà phân phối địa phương',
                        rating: 5.0,
                        totalReviews: 0,
                        isDemo: false,
                        createdAt: new Date().toISOString(),
                      };
                      setSuppliers((prev) => {
                        const updated = [newSupplierRecord, ...prev];
                        try {
                          localStorage.setItem('flashgroup_v3_suppliers', JSON.stringify(updated));
                        } catch {}
                        return updated;
                      });
                      localStorage.setItem('flashgroup_v3_auth_user', JSON.stringify(newUser));
                      localStorage.setItem('flashgroup_v3_current_user', JSON.stringify(newUser));
                      setAuthenticatedUser(newUser);
                      setPresentedDemoUser(null);
                      setIsAuthModalOpen(false);
                      setSupplierTab('dashboard');
                      navigate('/');
                      showToast('Đăng ký tài khoản Nhà cung cấp thành công! Hồ sơ của bạn đang chờ Quản trị viên duyệt.');
                    } else {
                      localStorage.setItem('flashgroup_v3_auth_user', JSON.stringify(newUser));
                      localStorage.setItem('flashgroup_v3_current_user', JSON.stringify(newUser));
                      setAuthenticatedUser(newUser);
                      setPresentedDemoUser(null);
                      setIsAuthModalOpen(false);
                      setBuyerTab('discovery');
                      navigate('/marketplace');
                      showToast('Đăng ký tài khoản Người mua thành công! Hãy bắt đầu khám phá phòng gom.');
                    }
                    return { success: true };
                  }
                }}
                onResetPassword={async (email) => {
                  return await authService.resetPassword(email);
                }}
                onUpdatePassword={async (email, newPass) => {
                  const targetUser = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
                  if (!targetUser) {
                    return { success: false, error: 'Không tìm thấy tài khoản với email này trên hệ thống.' };
                  }
                  setUsers((prev) => {
                    const updated = prev.map((u) => (u.id === targetUser.id ? { ...u, password: newPass } : u));
                    localStorage.setItem('flashgroup_v3_users', JSON.stringify(updated));
                    return updated;
                  });
                  showToast(`Đặt lại mật khẩu thành công cho ${email}!`);
                  return { success: true };
                }}
              />
            </div>
          </div>
        )}

        {/* UNIFIED TOAST CONTAINER (Phase 11) */}
        <ToastContainer toasts={toasts} onDismiss={dismissToast} />

        {/* CELEBRATION UNLOCK MODAL */}
        {unlockedPriceNotification && (
          <UnlockModal
            isOpen={Boolean(unlockedPriceNotification)}
            onClose={() => setUnlockedPriceNotification(null)}
            newPrice={unlockedPriceNotification.newPrice}
            savedPerUnit={unlockedPriceNotification.savedPerUnit}
            roomName={unlockedPriceNotification.roomName}
            unit={unlockedPriceNotification.unit}
          />
        )}

        {/* JOIN GROUP MODAL */}
        {joinModalRoom && (
          <JoinModal
            room={joinModalRoom}
            isOpen={Boolean(joinModalRoom)}
            onClose={() => setJoinModalRoomId(null)}
            onConfirm={(qty) => handleJoinGroup(joinModalRoom.id, qty)}
            hasAlreadyJoined={myJoinedRoomIds.includes(joinModalRoom.id)}
          />
        )}

        {/* REVIEW MODAL */}
        {reviewOrderModal && (
          <ReviewModal
            order={reviewOrderModal}
            isOpen={Boolean(reviewOrderModal)}
            onClose={() => setReviewOrderModal(null)}
            onSubmitReview={handleSubmitReview}
          />
        )}

        {/* REFUND MODAL */}
        {refundOrderModal && (
          <RefundModal
            order={refundOrderModal}
            isOpen={Boolean(refundOrderModal)}
            onClose={() => setRefundOrderModal(null)}
            onSubmitRefund={handleSubmitRefund}
          />
        )}

        {/* BUYER RECEIPT MODAL (Requirement 19) */}
        {receiptOrderModal && (
          <BuyerReceiptModal
            order={receiptOrderModal}
            isOpen={Boolean(receiptOrderModal)}
            onClose={() => setReceiptOrderModal(null)}
          />
        )}

        {/* SHARE ROOM MODAL (Requirements 4, 5, 48) */}
        <ShareRoomModal
          room={shareModalRoom}
          currentUserId={currentUser ? currentUser.id : "guest"}
          isOpen={Boolean(shareModalRoom)}
          onClose={() => setShareModalRoomId(null)}
          onRoomShared={handleRoomShared}
          showToast={showToast}
        />

        {/* BUSINESS MODEL INFO MODAL (Requirements 27, 28, 29, 32) */}
        <BusinessModelModal
          isOpen={isBusinessModelOpen}
          onClose={() => setIsBusinessModelOpen(false)}
          commissionRate={commissionRate}
        />

        {/* PHASE 8: LEGAL CENTER MODAL (Req 20, 21, 31) */}
        <LegalCenterModal
          isOpen={Boolean(legalModalSlug)}
          initialSlug={legalModalSlug || 'terms_of_use'}
          documents={legalDocuments}
          vouchers={vouchers}
          onClose={() => setLegalModalSlug(null)}
        />

        {/* PHASE 8: SELLER LEGAL INFORMATION MODAL (Req 1 & 2) */}
        <SellerInfoModal
          supplier={suppliers.find((s) => s.id === sellerInfoModalSupplierId) || null}
          isOpen={Boolean(sellerInfoModalSupplierId)}
          onClose={() => setSellerInfoModalSupplierId(null)}
          onOpenComplaint={() => {
            setSellerInfoModalSupplierId(null);
            setSelectedRoomId(null);
            setCheckoutRoomId(null);
            if (!currentUser || currentUser.role === 'buyer') {
              setBuyerTab('complaints');
            }
          }}
        />

        {/* PHASE 8: PRODUCT SAFETY REPORT MODAL (Req 26) */}
        <ProductReportModal
          product={products.find((p) => p.id === reportProductModalProductId) || null}
          roomId={activeRoom?.id}
          isOpen={Boolean(reportProductModalProductId)}
          onClose={() => setReportProductModalProductId(null)}
          onSubmitReport={handleSubmitProductReportFromModal}
        />

        {/* PHASE 8: TRANSACTION CONTRACT SNAPSHOT MODAL (Req 6 & 37) */}
        <TransactionSnapshotModal
          order={snapshotModalOrder}
          snapshot={
            snapshotModalOrder
              ? transactionSnapshots.find((s) => s.orderId === snapshotModalOrder.id) || null
              : null
          }
          fallbackSupplier={
            snapshotModalOrder
              ? suppliers.find((s) => s.id === snapshotModalOrder.supplierId) || null
              : null
          }
          fallbackProduct={
            snapshotModalOrder
              ? products.find((p) => {
                  const rm = rooms.find((r) => r.id === snapshotModalOrder.roomId);
                  return rm ? p.id === rm.productId : p.name === snapshotModalOrder.productName;
                }) || null
              : null
          }
          isOpen={Boolean(snapshotModalOrder)}
          onClose={() => setSnapshotModalOrder(null)}
        />

        {/* ROLE-BASED NAVBAR */}
        <Navbar
          currentUser={currentUser}
          onOpenLogin={openLoginModal}
          onOpenRegister={() => openRegisterModal('buyer')}
          currentTab={
            !currentUser || currentUser.role === 'buyer'
              ? buyerTab
              : currentUser.role === 'supplier'
              ? supplierTab
              : adminTab
          }
          onNavigate={(tab) => {
            setSelectedRoomId(null);
            setCheckoutRoomId(null);
            if (!currentUser || currentUser.role === 'buyer') {
              setBuyerTab(tab);
              if (tab === 'discovery') navigate('/marketplace');
              else if (tab === 'flashmap') navigate('/flashmap');
              else if (tab === 'orders') {
                if (!currentUser) openLoginModal();
                else navigate('/orders');
              }
              else if (tab === 'complaints') navigate('/complaints');
              else if (tab === 'privacy') navigate('/privacy-center');
              else if (tab === 'help') navigate('/help');
              else if (tab === 'refund-policy') navigate('/refund-policy');
              else if (tab === 'contact') navigate('/contact');
              else navigate('/');
            } else if (currentUser.role === 'supplier') {
              setSupplierTab(tab);
              navigate('/');
            } else {
              setAdminTab(tab);
              navigate('/');
            }
          }}
          notifications={notifications}
          onMarkNotificationAsRead={(id) => {
            setNotifications((prev) =>
              prev.map((n) => (n.id === id ? { ...n, read: true } : n))
            );
          }}
          onMarkAllNotificationsAsRead={() => {
            if (!currentUser) return;
            setNotifications((prev) =>
              prev.map((n) => (n.userId === currentUser.id ? { ...n, read: true } : n))
            );
            showToast('Đã đánh dấu toàn bộ thông báo là đã đọc.');
          }}
          onSelectNotificationItem={(roomId, orderId) => {
            if (roomId) {
              setSelectedRoomId(roomId);
              setCheckoutRoomId(null);
            } else if (orderId) {
              if (!currentUser || currentUser.role === 'buyer') setBuyerTab('orders');
              else if (currentUser.role === 'supplier') setSupplierTab('orders');
            }
          }}
          onLogout={handleLogout}
          onResetDemo={() => handleResetData(true)}
          onOpenDemoCheckModal={() => setIsDemoCheckModalOpen(true)}
          onTogglePresentationMode={() => setIsPresentationMode((prev) => !prev)}
          isPresentationMode={isPresentationMode}
          onOpenBusinessModel={() => setIsBusinessModelOpen(true)}
          joinedRoomsCount={myJoinedRoomIds.length}
          ordersCount={currentUser ? orders.filter((o) => o.userId === currentUser.id).length : 0}
          favoritesCount={favoriteRoomIds.length}
        />

        {/* SUPPLIER VERIFICATION BANNER (Requirement 35 & Phase 8 Req 1 & 29) */}
        {currentUser && currentUser.role === 'supplier' && currentSupplier &&
          (currentSupplier.verificationStatus === 'pending' ||
            currentSupplier.verificationStatus === 'unverified' ||
            currentSupplier.verificationStatus === 'rejected' ||
            currentSupplier.verificationStatus === 'suspended') && (
            <div
              className={`${
                currentSupplier.verificationStatus === 'suspended' ||
                currentSupplier.verificationStatus === 'rejected'
                  ? 'bg-rose-600'
                  : 'bg-amber-500'
              } text-white px-4 py-2.5 text-xs text-center font-bold flex items-center justify-center space-x-2`}
            >
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>
                {currentSupplier.verificationStatus === 'suspended'
                  ? `Tài khoản nhà cung cấp đang bị TẠM ĐÌNH CHỈ. Lý do: ${
                      currentSupplier.suspensionReason || 'Đang rà soát tuân thủ.'
                    }`
                  : currentSupplier.verificationStatus === 'rejected'
                  ? 'Hồ sơ xác minh nhà cung cấp cần bổ sung. Vui lòng cập nhật tại tab Sản phẩm & Hồ sơ pháp lý.'
                  : 'Your supplier account is pending verification. Tài khoản của bạn đang chờ quản trị viên phê duyệt. Các phòng gom mới tạo sẽ tạm lưu ở dạng Bản nháp (Draft).'}
              </span>
            </div>
          )}

        {/* VIEW CONTAINER */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          {/* ======================================================== */}
          {/* BUYER ROLE VIEWS                                         */}
          {/* ======================================================== */}
          {(!currentUser || currentUser.role === 'buyer') && (
            <>
              {checkoutRoomId && currentUser ? (
                <CheckoutView
                  roomId={checkoutRoomId}
                  rooms={rooms}
                  suppliers={suppliers}
                  products={products}
                  participations={participations}
                  orders={orders}
                  vouchers={vouchers}
                  voucherUsages={voucherUsages}
                  deliveryBatches={deliveryBatches}
                  currentUser={currentUser}
                  commissionRate={commissionRate}
                  onBack={() => setCheckoutRoomId(null)}
                  onOpenLegalDoc={(slug) => setLegalModalSlug(slug)}
                  showToast={showToast}
                  onSuccess={(newOrder, snapshot, appliedVoucher) => {
                    setOrders((prev) => [newOrder, ...prev]);
                    setTransactionSnapshots((prev) => [snapshot, ...prev]);
                    setParticipations((prev) =>
                      prev.map((p) =>
                        p.id === newOrder.participationId ? { ...p, status: 'paid' } : p
                      )
                    );
                    appendAuditLog('order_confirmed', 'order', newOrder.id, {
                      roomId: newOrder.roomId,
                      totalAmount: newOrder.totalAmount,
                      unitPrice: newOrder.unitPrice,
                      quantity: newOrder.quantity,
                      contractSnapshotId: newOrder.contractSnapshotId,
                    });
                    appendAuditLog('payment_simulated', 'order', newOrder.id, {
                      paymentMethod: newOrder.paymentMethod,
                      totalAmount: newOrder.totalAmount,
                      snapshotId: snapshot.id,
                      termsVersion: snapshot.termsVersion,
                    });

                    if (appliedVoucher && newOrder.voucherDiscount && newOrder.voucherDiscount > 0) {
                      const newUsage: VoucherUsage = {
                        id: `vuse-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                        voucherId: appliedVoucher.id,
                        voucherCode: appliedVoucher.code,
                        userId: currentUser.id,
                        orderId: newOrder.id,
                        discountAmount: newOrder.voucherDiscount,
                        createdAt: new Date().toISOString(),
                      };
                      setVoucherUsages((prev) => [newUsage, ...prev]);
                      if (isSupabaseConfigured && !useLocalDemoMode) {
                        socialService.recordVoucherUsage(newUsage).catch(console.error);
                      }
                    }
                    pushNotification(
                      currentUser.id,
                      'payment',
                      'Thanh toán thành công!',
                      `Thanh toán đơn ${newOrder.id} thành công. Mã nhận hàng Locker: ${newOrder.pickupCode}.`,
                      `pay-${newOrder.id}`,
                      newOrder.roomId,
                      newOrder.id
                    );
                    if (isSupabaseConfigured && !useLocalDemoMode) {
                      orderService.createOrder(newOrder).catch(console.error);
                      complianceService.createTransactionSnapshot(snapshot).catch(console.error);
                    }
                    setCheckoutRoomId(null);
                    setSelectedRoomId(null);
                    setBuyerTab('orders');
                    setReceiptOrderModal(newOrder);
                    showToast('Đặt hàng & lưu hồ sơ hợp đồng giao dịch thành công!');
                  }}
                />
              ) : selectedRoomId && activeRoom ? (
                <GroupRoomView
                  room={activeRoom}
                  supplier={suppliers.find((s) => s.id === activeRoom.supplierId)}
                  product={products.find((p) => p.id === activeRoom.productId)}
                  reviews={reviews.filter((r) => r.supplierId === activeRoom.supplierId)}
                  participation={activeRoomParticipation}
                  currentUser={currentUser}
                  isRoomSupplier={false}
                  pickupPoints={pickupPoints}
                  events={roomEvents}
                  messages={groupMessages}
                  reactions={messageReactions}
                  onOpenJoinModal={() => setJoinModalRoomId(activeRoom.id)}
                  onOpenShareModal={() => setShareModalRoomId(activeRoom.id)}
                  onOpenSellerInfo={() => setSellerInfoModalSupplierId(activeRoom.supplierId)}
                  onOpenReportProduct={() => setReportProductModalProductId(activeRoom.productId)}
                  onSendMessage={(text) => handleSendRoomMessage(activeRoom.id, text)}
                  onModerateHideMessage={handleModerateHideMessage}
                  onToggleReaction={handleToggleReaction}
                  onBack={() => setSelectedRoomId(null)}
                  onGoCheckout={() => setCheckoutRoomId(activeRoom.id)}
                  onFinalizeNow={() => finalizeRoom(activeRoom.id)}
                  isFavorite={favoriteRoomIds.includes(activeRoom.id)}
                  onToggleFavorite={() => handleToggleFavorite(activeRoom.id)}
                  getSecondsLeft={getSecondsLeft}
                  nowMs={now}
                  showToast={showToast}
                />
              ) : location.pathname === '/flashmap' || buyerTab === 'flashmap' ? (
                <FlashMapView
                  rooms={rooms}
                  pickupPoints={pickupPoints}
                  onSelectRoom={(id) => {
                    setSelectedRoomId(id);
                    navigate(`/room/${encodeURIComponent(id)}`);
                  }}
                />
              ) : location.pathname === '/how-it-works' ? (
                <HowItWorksPage />
              ) : location.pathname === '/pickup-points' ? (
                <PickupPointsDirectoryPage pickupPoints={pickupPoints} />
              ) : location.pathname === '/suppliers' ? (
                <SuppliersDirectoryPage suppliers={suppliers} />
              ) : location.pathname === '/help' ? (
                <HelpCenterPage />
              ) : location.pathname === '/contact' ? (
                <ContactPage />
              ) : location.pathname === '/refund-policy' ? (
                <LegalPolicyPageView slug="return_refund_policy" documents={legalDocuments} />
              ) : location.pathname === '/legal' ? (
                <LegalPolicyPageView slug="legal" documents={legalDocuments} />
              ) : location.pathname === '/terms' ? (
                <LegalPolicyPageView slug="terms_of_use" documents={legalDocuments} />
              ) : location.pathname === '/privacy' ? (
                <LegalPolicyPageView slug="privacy_policy" documents={legalDocuments} />
              ) : location.pathname === '/marketplace-rules' ? (
                <LegalPolicyPageView slug="marketplace_operating_rules" documents={legalDocuments} />
              ) : location.pathname === '/seller-policy' ? (
                <LegalPolicyPageView slug="seller_policy" documents={legalDocuments} />
              ) : location.pathname === '/transaction-policy' ? (
                <LegalPolicyPageView slug="transaction_policy" documents={legalDocuments} />
              ) : location.pathname === '/shipping-policy' ? (
                <LegalPolicyPageView slug="shipping_pickup_policy" documents={legalDocuments} />
              ) : location.pathname === '/promotion-terms' ? (
                <LegalPolicyPageView slug="promotion_voucher_terms" documents={legalDocuments} />
              ) : location.pathname === '/referral-terms' ? (
                <LegalPolicyPageView slug="referral_program_terms" documents={legalDocuments} />
              ) : location.pathname === '/community-rules' ? (
                <LegalPolicyPageView slug="community_review_rules" documents={legalDocuments} />
              ) : buyerTab === 'myrooms' || location.pathname === '/my-rooms' ? (
                !currentUser ? (
                  <div className="min-h-[50vh] flex items-center justify-center p-6 text-center animate-fade-in">
                    <div className="bg-white rounded-3xl border border-[#E4E8F0] p-8 max-w-md w-full shadow-lg space-y-4">
                      <div className="w-14 h-14 rounded-2xl bg-[#EEF1FF] text-[#3155FF] mx-auto flex items-center justify-center">
                        <Users className="w-7 h-7" />
                      </div>
                      <h3 className="text-base font-black text-[#0C0D10]">BẠN CHƯA ĐĂNG NHẬP</h3>
                      <p className="text-xs text-[#596273] leading-relaxed">
                        Vui lòng đăng nhập để theo dõi danh sách các phòng mua chung bạn đã tham gia.
                      </p>
                      <button
                        type="button"
                        onClick={openLoginModal}
                        className="w-full py-2.5 px-4 rounded-xl bg-[#3155FF] hover:bg-[#2444DC] text-white font-black text-xs transition cursor-pointer"
                      >
                        Đăng nhập ngay
                      </button>
                    </div>
                  </div>
                ) : (
                  <MyRoomsView
                    rooms={rooms}
                    participations={participations}
                    orders={orders}
                    currentUserId={currentUser.id}
                    onSelectRoom={(id) => setSelectedRoomId(id)}
                    onGoCheckout={(id) => setCheckoutRoomId(id)}
                    onExplore={() => setBuyerTab('discovery')}
                    getSecondsLeft={getSecondsLeft}
                  />
                )
              ) : location.pathname === '/orders' || buyerTab === 'orders' ? (
                !currentUser ? (
                  <div className="min-h-[50vh] flex items-center justify-center p-6 text-center animate-fade-in">
                    <div className="bg-white rounded-3xl border border-[#E4E8F0] p-8 max-w-md w-full shadow-lg space-y-4">
                      <div className="w-14 h-14 rounded-2xl bg-[#EEF1FF] text-[#3155FF] mx-auto flex items-center justify-center">
                        <Package className="w-7 h-7" />
                      </div>
                      <h3 className="text-base font-black text-[#0C0D10]">BẠN CHƯA ĐĂNG NHẬP</h3>
                      <p className="text-xs text-[#596273] leading-relaxed">
                        Vui lòng đăng nhập để xem lịch sử và quản lý đơn hàng của bạn.
                      </p>
                      <button
                        type="button"
                        onClick={openLoginModal}
                        className="w-full py-2.5 px-4 rounded-xl bg-[#3155FF] hover:bg-[#2444DC] text-white font-black text-xs transition cursor-pointer"
                      >
                        Đăng nhập ngay
                      </button>
                    </div>
                  </div>
                ) : (
                  <OrdersView
                    orders={orders.filter((o) => o.userId === currentUser.id)}
                    rooms={rooms}
                    pickupPoints={pickupPoints}
                    deliveryBatches={deliveryBatches}
                    deliveryEvents={deliveryEvents}
                    reviews={reviews}
                    refunds={refunds}
                    onOpenReview={(order) => setReviewOrderModal(order)}
                    onOpenRefund={(order) => setRefundOrderModal(order)}
                    onOpenReceipt={(order) => setReceiptOrderModal(order)}
                    onOpenSnapshot={(order) => setSnapshotModalOrder(order)}
                    onOpenComplaint={(order) => {
                      setComplaintInitialOrderId(order.id);
                      navigate('/complaints');
                    }}
                    onExplore={() => navigate('/marketplace')}
                  />
                )
              ) : location.pathname === '/complaints' || buyerTab === 'complaints' ? (
                !currentUser ? (
                  <div className="min-h-[50vh] flex items-center justify-center p-6 text-center animate-fade-in">
                    <div className="bg-white rounded-3xl border border-[#E4E8F0] p-8 max-w-md w-full shadow-lg space-y-4">
                      <div className="w-14 h-14 rounded-2xl bg-[#EEF1FF] text-[#3155FF] mx-auto flex items-center justify-center">
                        <MessageSquare className="w-7 h-7 text-[#3155FF]" />
                      </div>
                      <h3 className="text-base font-black text-[#0C0D10]">BẠN CHƯA ĐĂNG NHẬP</h3>
                      <p className="text-xs text-[#596273] leading-relaxed">
                        Vui lòng đăng nhập để gửi và theo dõi khiếu nại, phản hồi của bạn.
                      </p>
                      <button
                        type="button"
                        onClick={openLoginModal}
                        className="w-full py-2.5 px-4 rounded-xl bg-[#3155FF] hover:bg-[#2444DC] text-white font-black text-xs transition cursor-pointer"
                      >
                        Đăng nhập ngay
                      </button>
                    </div>
                  </div>
                ) : (
                <ComplaintCenterView
                  currentUser={currentUser}
                  orders={orders}
                  suppliers={suppliers}
                  complaints={complaintCases}
                  messages={complaintMessages}
                  initialOrderId={complaintInitialOrderId}
                  onSubmitComplaint={handleSubmitComplaint}
                  onReplyComplaint={handleReplyComplaint}
                  showToast={showToast}
                />
              )
            ) : location.pathname.startsWith('/privacy-center') || buyerTab === 'privacy' ? (
                !currentUser ? (
                  <div className="min-h-[50vh] flex items-center justify-center p-6 text-center animate-fade-in">
                    <div className="bg-white rounded-3xl border border-[#E4E8F0] p-8 max-w-md w-full shadow-lg space-y-4">
                      <div className="w-14 h-14 rounded-2xl bg-[#EEF1FF] text-[#3155FF] mx-auto flex items-center justify-center">
                        <Lock className="w-7 h-7 text-[#3155FF]" />
                      </div>
                      <h3 className="text-base font-black text-[#0C0D10]">BẠN CHƯA ĐĂNG NHẬP</h3>
                      <p className="text-xs text-[#596273] leading-relaxed">
                        Vui lòng đăng nhập để xem và quản lý thiết lập quyền riêng tư dữ liệu của bạn.
                      </p>
                      <button
                        type="button"
                        onClick={openLoginModal}
                        className="w-full py-2.5 px-4 rounded-xl bg-[#3155FF] hover:bg-[#2444DC] text-white font-black text-xs transition cursor-pointer"
                      >
                        Đăng nhập ngay
                      </button>
                    </div>
                  </div>
                ) : (
                <PrivacyCenterView
                  currentUser={currentUser}
                  orders={orders}
                  consentRecords={consentRecords}
                  privacyRequests={privacyRequests}
                  onToggleOptionalConsent={handleToggleConsent}
                  onWithdrawAllOptionalConsent={handleWithdrawAllOptionalConsent}
                  onSubmitPrivacyRequest={handleSubmitPrivacyRequest}
                  onOpenLegalDoc={(slug) => setLegalModalSlug(slug)}
                  showToast={showToast}
                />
              )
            ) : buyerTab === 'favorites' ? (
                <FavoritesView
                  favoriteRoomIds={favoriteRoomIds}
                  rooms={rooms}
                  onToggleFavorite={handleToggleFavorite}
                  onSelectRoom={(id) => setSelectedRoomId(id)}
                  onExplore={() => setBuyerTab('discovery')}
                  getSecondsLeft={getSecondsLeft}
                />
              ) : buyerTab === 'notifications' ? (
                !currentUser ? (
                  <div className="min-h-[50vh] flex items-center justify-center p-6 text-center animate-fade-in">
                    <div className="bg-white rounded-3xl border border-[#E4E8F0] p-8 max-w-md w-full shadow-lg space-y-4">
                      <div className="w-14 h-14 rounded-2xl bg-[#EEF1FF] text-[#3155FF] mx-auto flex items-center justify-center">
                        <Bell className="w-7 h-7 text-[#3155FF]" />
                      </div>
                      <h3 className="text-base font-black text-[#0C0D10]">BẠN CHƯA ĐĂNG NHẬP</h3>
                      <p className="text-xs text-[#596273] leading-relaxed">
                        Vui lòng đăng nhập để xem tất cả thông báo của bạn.
                      </p>
                      <button
                        type="button"
                        onClick={openLoginModal}
                        className="w-full py-2.5 px-4 rounded-xl bg-[#3155FF] hover:bg-[#2444DC] text-white font-black text-xs transition cursor-pointer"
                      >
                        Đăng nhập ngay
                      </button>
                    </div>
                  </div>
                ) : (
                <NotificationCenter
                  notifications={notifications}
                  currentUserId={currentUser.id}
                  onMarkAsRead={(id) => {
                    setNotifications((prev) =>
                      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
                    );
                  }}
                  onMarkAllAsRead={() => {
                    setNotifications((prev) =>
                      prev.map((n) => (n.userId === currentUser.id ? { ...n, read: true } : n))
                    );
                    showToast('Đã đánh dấu đã đọc tất cả thông báo.');
                  }}
                  onSelectItem={(roomId, orderId) => {
                    if (roomId) setSelectedRoomId(roomId);
                    else if (orderId) setBuyerTab('orders');
                  }}
                />
              )
            ) : buyerTab === 'profile' || location.pathname === '/profile' ? (
                !currentUser ? (
                  <div className="min-h-[50vh] flex items-center justify-center p-6 text-center animate-fade-in">
                    <div className="bg-white rounded-3xl border border-[#E4E8F0] p-8 max-w-md w-full shadow-lg space-y-4">
                      <div className="w-14 h-14 rounded-2xl bg-[#EEF1FF] text-[#3155FF] mx-auto flex items-center justify-center">
                        <Users className="w-7 h-7 text-[#3155FF]" />
                      </div>
                      <h3 className="text-base font-black text-[#0C0D10]">BẠN CHƯA ĐĂNG NHẬP</h3>
                      <p className="text-xs text-[#596273] leading-relaxed">
                        Vui lòng đăng nhập để xem và quản lý thông tin tài khoản của bạn.
                      </p>
                      <button
                        type="button"
                        onClick={openLoginModal}
                        className="w-full py-2.5 px-4 rounded-xl bg-[#3155FF] hover:bg-[#2444DC] text-white font-black text-xs transition cursor-pointer"
                      >
                        Đăng nhập ngay
                      </button>
                    </div>
                  </div>
                ) : (
                  <BuyerProfileView
                    currentUser={currentUser}
                    orders={orders}
                    participations={participations}
                    rooms={rooms}
                    reviews={reviews}
                    loyaltyTransactions={loyaltyTransactions}
                    referrals={referrals}
                    onUpdateProfile={(updatedData) => {
                      if (authenticatedUser) {
                        setAuthenticatedUser({ ...authenticatedUser, ...updatedData });
                      }
                      setUsers((prev) =>
                        prev.map((u) => (u.id === currentUser.id ? { ...u, ...updatedData } : u))
                      );
                    }}
                    showToast={showToast}
                  />
                )
              ) : location.pathname === '/' || location.pathname === '/marketplace' || buyerTab === 'discovery' ? (
                /* DISCOVERY VIEW (Phase 9 Editorial Rebuild) */
                <div className="space-y-12">
                  {/* 1. HERO SECTION (Warm Premium Plum/Dusty Rose/Coral System) */}
                  <div
                    style={{
                      background: 'linear-gradient(120deg, #2444DC 0%, #3155FF 60%, #6336D6 100%)',
                    }}
                    className="relative rounded-3xl text-white p-8 sm:p-12 overflow-hidden shadow-2xl border border-white/10"
                  >
                    <div className="absolute top-0 right-0 translate-x-16 -translate-y-12 opacity-15 pointer-events-none">
                      <Zap className="w-96 h-96 text-white/10 fill-white/5" />
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
                      <div className="lg:col-span-7 space-y-6">
                        <div className="inline-flex items-center space-x-2 bg-white/15 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold text-white border border-white/20">
                          <Sparkles className="w-4 h-4 text-[#C7F000]" />
                          <span>MÔ HÌNH MUA GOM SIÊU CỤC BỘ • TIẾT KIỆM ĐẾN 35%</span>
                        </div>
                        <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight uppercase">
                          CÀNG ĐÔNG, CÀNG RẺ. <br className="hidden sm:inline" />
                          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#EEF1FF] to-[#C7F000]">
                            GIAO CHUNG MỘT ĐIỂM.
                          </span>
                        </h1>
                        <p className="text-base sm:text-lg text-slate-100 font-normal max-w-xl leading-relaxed">
                          FlashGroup kết nối người mua gần nhau tại khu dân cư, chung cư, văn phòng và KTX để mở khóa bảng giá sỉ theo mốc số lượng và tối ưu 100% phí vận chuyển.
                        </p>

                        <div className="flex flex-wrap items-center gap-3 pt-2">
                          <CTAButton
                            variant="hero"
                            size="lg"
                            icon={ArrowRight}
                            onClick={() => {
                              const el = document.getElementById('deals-nearby');
                              if (el) el.scrollIntoView({ behavior: 'smooth' });
                            }}
                          >
                            KHÁM PHÁ PHÒNG GOM
                          </CTAButton>
                          <button onClick={() => navigate('/seller-policy')} className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl font-black text-sm sm:text-base bg-transparent hover:bg-white/10 hover:text-white text-white border-2 border-white transition cursor-pointer active:scale-98 uppercase"><span>DÀNH CHO NHÀ CUNG CẤP</span><Building2 className="w-5 h-5" /></button>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 pt-4 text-xs font-semibold text-white/90 border-t border-white/15">
                          <span className="flex items-center gap-1.5">
                            <ShieldCheck className="w-4 h-4 text-[#C7F000]" />
                            Minh bạch pháp lý Nghị định 55/2024
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Lock className="w-4 h-4 text-[#C7F000]" />
                            Nhận hàng Locker bảo mật QR
                          </span>
                          <span className="flex items-center gap-1.5">
                            <RotateCcw className="w-4 h-4 text-[#C7F000]" />
                            Hoàn tiền 100% nếu không đủ nhóm
                          </span>
                        </div>
                      </div>

                      {/* Live Interactive Preview Summary Card */}
                      {featuredRoom && (
                        <div className="lg:col-span-5">
                          <div
                            onClick={() => setSelectedRoomId(featuredRoom.id)}
                            className="bg-white/95 backdrop-blur-md rounded-2xl p-5 text-slate-800 shadow-xl border border-white/40 cursor-pointer hover:shadow-2xl hover:scale-[1.02] transition-all duration-300"
                          >
                            <div className="flex items-center justify-between gap-2 mb-3">
                              <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                                <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                                PHÒNG ĐANG SÔI NỔI NHẤT
                              </span>
                              <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                                {featuredRoom.distance}
                              </span>
                            </div>

                            <div className="flex gap-4 items-center mb-4">
                              <img
                                src={featuredRoom.productImage}
                                alt={featuredRoom.productName}
                                className="w-20 h-20 rounded-xl object-cover shrink-0 border border-slate-200"
                              />
                              <div className="min-w-0 flex-1">
                                <div className="text-xs text-slate-400 font-medium truncate mb-0.5">
                                  {featuredRoom.supplierName}
                                </div>
                                <h4 className="font-extrabold text-slate-900 text-base line-clamp-1">
                                  {featuredRoom.emoji} {featuredRoom.productName}
                                </h4>
                                <div className="mt-1 flex items-baseline gap-2">
                                  <span className="text-lg font-black text-[#3155FF]">
                                    {formatVND(
                                      featuredRoom.finalPrice ??
                                        getCurrentPrice(featuredRoom.totalQuantity, featuredRoom.priceTiers)
                                    )}
                                  </span>
                                  <span className="text-xs line-through text-slate-400">
                                    {formatVND(featuredRoom.initialPrice)}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-1.5 mb-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
                              <div className="flex justify-between text-xs font-semibold text-slate-700">
                                <span className="flex items-center gap-1">
                                  <Users className="w-3.5 h-3.5 text-[#3155FF]" />
                                  {featuredRoom.participantCount} người tham gia
                                </span>
                                <span>
                                  {featuredRoom.totalQuantity} / {featuredRoom.maxQuantity} {featuredRoom.unit}
                                </span>
                              </div>
                              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                                <div
                                  className="bg-[#3155FF] h-full rounded-full transition-all duration-500"
                                  style={{
                                    width: `${Math.min(
                                      100,
                                      Math.round((featuredRoom.totalQuantity / featuredRoom.maxQuantity) * 100)
                                    )}%`,
                                  }}
                                />
                              </div>
                              <div className="text-[11px] text-right font-medium text-[#0C0D10]">
                                Điểm gom: <strong>{featuredRoom.pickupPoint}</strong>
                              </div>
                            </div>

                            <div className="w-full py-2.5 rounded-xl font-bold text-xs bg-slate-900 hover:bg-blue-600 text-white transition flex items-center justify-center space-x-1.5 shadow-md">
                              <span>XEM VÀ THAM GIA NGAY</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 2. TRUST HIGHLIGHT STRIP */}
                  <TrustHighlightStrip />

                  {/* 3. KHÁM PHÁ THEO KHU VỰC (Requirement 14) */}
                  <AreaExplorerSection
                    selectedCity={selectedCity}
                    selectedArea={selectedArea}
                    onSelectArea={(c, a) => {
                      setSelectedCity(c);
                      setSelectedArea(a);
                      const el = document.getElementById('deals-nearby');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                  />

                  {/* 4. GỢI Ý THÔNG MINH (SMART MATCHING - Requirement 16) */}
                  <SmartMatchingSection
                    rooms={rooms}
                    selectedArea={selectedArea}
                    onSelectRoom={(id) => setSelectedRoomId(id)}
                    onJoinRoom={(id) => setJoinModalRoomId(id)}
                  />

                  {/* 3. FEATURED ROOMS SECTION */}
                  <div id="deals-nearby" className="space-y-6 pt-2">
                    <SectionHeader
                      title="PHÒNG GOM NỔI BẬT"
                      subtitle="Tham gia cùng cộng đồng xung quanh để kích hoạt mức giá sỉ và gom chung một chuyến xe"
                      badge="ƯU ĐÃI KHU VỰC BẠN"
                      action={
                        <span className="text-xs font-bold text-slate-600 bg-white px-3.5 py-1.5 rounded-full border border-slate-200 shadow-sm">
                          {filteredDiscoveryRooms.length} phòng đang mở
                        </span>
                      }
                    />

                    {/* SearchFilterBar */}
                    <SearchFilterBar
                      filters={filters}
                      onChangeFilters={(newFilters) => setFilters(newFilters)}
                      onResetFilters={() => {
                        setFilters({
                          searchQuery: '',
                          category: 'all',
                          maxDistanceMeters: 10000,
                          status: 'all',
                          pickupPoint: 'all',
                          maxPrice: 1000000,
                          sortBy: 'near_me',
                        });
                        setSelectedQuickChip('all');
                      }}
                      categories={categoriesList}
                    />

                    {/* Quick Highlight Chips + Category Pill Bar */}
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
                        {[
                          { id: 'all', label: 'Tất cả' },
                          { id: 'fast_delivery', label: '⚡ Giao nhanh (<3km)' },
                          { id: 'dorm_pickup', label: '📍 Smart Locker & Hub' },
                          { id: 'farm_produce', label: '🍓 Nông sản & Thực phẩm' },
                          { id: 'hot_deal', label: '🔥 Giá tốt hôm nay' },
                        ].map((chip) => (
                          <button
                            key={chip.id}
                            onClick={() => setSelectedQuickChip(chip.id as any)}
                            className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all shadow-sm ${
                              selectedQuickChip === chip.id
                                ? 'bg-blue-600 text-white shadow-blue-600/20'
                                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                            }`}
                          >
                            {chip.label}
                          </button>
                        ))}
                      </div>

                      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
                        {categoriesList.map((cat) => (
                          <button
                            key={cat}
                            onClick={() => setFilters({ ...filters, category: cat === 'Tất cả' ? 'all' : cat })}
                            className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                              (cat === 'Tất cả' && filters.category === 'all') || filters.category === cat
                                ? 'bg-slate-900 text-white shadow-sm'
                                : 'bg-white/80 text-slate-500 hover:bg-slate-100 border border-slate-200/80'
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>

                      {/* Geographic Area Active Filter Chip */}
                      {selectedArea !== 'all' && (
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-xl">
                          <span>📍 Đang lọc theo khu vực: <strong>{selectedArea}</strong></span>
                          <button
                            onClick={() => {
                              setSelectedArea('all');
                              setSelectedCity('all');
                            }}
                            className="text-xs text-blue-800 underline hover:text-blue-950 ml-auto cursor-pointer"
                          >
                            Xem tất cả khu vực
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Room Grid or Friendly Empty State */}
                    {filteredDiscoveryRooms.length === 0 ? (
                      <EmptyState
                        icon={Package}
                        badge="BỘ LỌC HIỆN TẠI"
                        title="KHÔNG TÌM THẤY PHÒNG GOM PHÙ HỢP"
                        description="Hãy thử nới lỏng bán kính khoảng cách, chọn danh mục khác hoặc xóa từ khóa tìm kiếm để khám phá nhiều phòng hơn."
                        actionLabel="Đặt lại tất cả bộ lọc"
                        onAction={() => {
                          setFilters({
                            searchQuery: '',
                            category: 'all',
                            maxDistanceMeters: 10000,
                            status: 'all',
                            pickupPoint: 'all',
                            maxPrice: 1000000,
                            sortBy: 'near_me',
                          });
                          setSelectedQuickChip('all');
                        }}
                      />
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredDiscoveryRooms.map((room) => {
                          const secondsLeft = getSecondsLeft(room.endAt);
                          const isClosedOrEnded = room.status !== 'active' || secondsLeft <= 0;
                          const currentPrice = room.finalPrice ?? getCurrentPrice(room.totalQuantity, room.priceTiers);
                          const lowestTier = room.priceTiers[room.priceTiers.length - 1];
                          const lowestPrice = lowestTier.price;
                          const nextTierInfo = getNextTier(room.totalQuantity, room.priceTiers);
                          const percentFilled = Math.min(100, Math.round((room.totalQuantity / room.maxQuantity) * 100));
                          const isUrgent = room.status === 'active' && secondsLeft < 300 && secondsLeft > 0;
                          const isJoined = myJoinedRoomIds.includes(room.id);
                          const isFav = favoriteRoomIds.includes(room.id);
                          const roomSupplier = suppliers.find((s) => s.id === room.supplierId);
                          const verifDisplay = getSupplierVerificationDisplay(roomSupplier);
                          const rankingReason = getRankingExplanation(room, filters.sortBy);

                          // Phase 9: Dynamic Status Badge
                          const roomBadgeStatus: Parameters<typeof StatusBadge>[0]['status'] =
                            room.status === 'active'
                              ? percentFilled >= 85
                                ? 'almost_full'
                                : nextTierInfo && nextTierInfo.requiredQuantity <= 3
                                ? 'near_target'
                                : room.participantCount >= 8
                                ? 'popular'
                                : 'active'
                              : room.status;

                          // Social Proof backed by actual room_events data (Requirement 24)
                          const recentJoinEventsCount = roomEvents.filter(
                            (evt) =>
                              evt.roomId === room.id &&
                              (evt.eventType === 'joined' || evt.eventType === 'quantity_added') &&
                              now - new Date(evt.createdAt).getTime() <= 10 * 60 * 1000
                          ).length;
                          const roomTotalEventsCount = roomEvents.filter((evt) => evt.roomId === room.id).length;

                          return (
                            <div
                              key={room.id}
                              onClick={() => setSelectedRoomId(room.id)}
                              className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group cursor-pointer hover:-translate-y-1"
                            >
                              <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                                <img
                                  src={room.productImage}
                                  alt={room.productName}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
                                  <span className="bg-white/95 backdrop-blur-md text-slate-800 text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-sm border border-slate-200/50 flex items-center space-x-1">
                                    <MapPin className="w-3 h-3 text-[#0C0D10]" />
                                    <span>{room.distance}</span>
                                  </span>
                                  <StatusBadge status={roomBadgeStatus} size="sm" />
                                  {room.isSponsored && (
                                    <span
                                      title="Phòng gom được tài trợ hiển thị bởi Nhà cung cấp"
                                      className="bg-amber-100/95 text-amber-900 border border-amber-300 text-[10px] font-black px-2 py-0.5 rounded-md shadow-sm"
                                    >
                                      Được tài trợ
                                    </span>
                                  )}
                                </div>

                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleToggleFavorite(room.id);
                                  }}
                                  className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md transition ${
                                    isFav
                                      ? 'bg-rose-500 text-white shadow-md'
                                      : 'bg-white/80 text-slate-600 hover:bg-white hover:text-rose-500'
                                  }`}
                                  title={isFav ? 'Đã lưu' : 'Lưu phòng'}
                                >
                                  <Heart className={`w-4 h-4 ${isFav ? 'fill-white' : ''}`} />
                                </button>

                                {/* Social Proof Badge */}
                                {(recentJoinEventsCount > 0 || (room.participantCount >= 15 && roomTotalEventsCount > 0)) && (
                                  <div className="absolute bottom-3 left-3 bg-amber-500/95 text-slate-950 text-[10px] font-black px-2.5 py-1 rounded-lg shadow-sm flex items-center space-x-1 max-w-[62%] truncate">
                                    <Flame className="w-3 h-3 shrink-0 fill-slate-950" />
                                    <span className="truncate">
                                      {recentJoinEventsCount > 0
                                        ? `${recentJoinEventsCount} người tham gia gần đây`
                                        : '🔥 Đang được quan tâm'}
                                    </span>
                                  </div>
                                )}

                                <div
                                  className={`absolute bottom-3 right-3 text-xs font-bold px-2.5 py-1 rounded-lg backdrop-blur-md shadow-sm flex items-center space-x-1 ${
                                    isClosedOrEnded
                                      ? 'bg-slate-900/90 text-slate-300'
                                      : isUrgent
                                      ? 'bg-rose-500/90 text-white animate-pulse'
                                      : 'bg-slate-900/85 text-white'
                                  }`}
                                >
                                  <Clock className="w-3.5 h-3.5" />
                                  <span>
                                    {room.status === 'successful'
                                      ? 'ĐÃ CHỐT'
                                      : room.status === 'closed' || room.status === 'cancelled' || secondsLeft <= 0
                                      ? 'ĐÃ ĐÓNG'
                                      : formatTime(secondsLeft)}
                                  </span>
                                </div>
                              </div>

                              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                                <div>
                                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1 gap-1">
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSellerInfoModalSupplierId(room.supplierId);
                                      }}
                                      className="truncate max-w-[160px] hover:text-[#0C0D10] hover:underline font-medium text-left"
                                      title="Xem hồ sơ pháp lý nhà cung cấp"
                                    >
                                      {room.supplierName}
                                    </button>
                                    <span
                                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded border shrink-0 ${
                                        verifDisplay.isAdminVerified
                                          ? 'bg-[#F5FBD9] text-[#0C0D10] border-[#C7F000]'
                                          : 'bg-slate-100 text-slate-600 border-slate-200'
                                      }`}
                                    >
                                      {verifDisplay.buyerBadgeLabel}
                                    </span>
                                  </div>
                                  <h3 className="font-bold text-slate-900 text-base line-clamp-1 group-hover:text-[#0C0D10] transition">
                                    {room.emoji} {room.productName}
                                  </h3>
                                </div>

                                <div className="bg-gradient-to-r from-cream-bg to-warm-beige p-3 rounded-xl border border-amber-200/50">
                                  <div className="flex items-baseline justify-between mb-1">
                                    <div className="text-xs text-slate-500 font-medium">
                                      {room.finalPrice !== undefined ? 'Giá chốt cuối:' : 'Giá hiện tại:'}
                                    </div>
                                    <div className="text-lg font-black text-slate-900">{formatVND(currentPrice)}</div>
                                  </div>
                                  <div className="flex items-center justify-between text-xs">
                                    <div className="text-[#0C0D10] font-semibold flex items-center gap-1">
                                      <TrendingDown className="w-3.5 h-3.5" />
                                      Mục tiêu giá thấp nhất:
                                    </div>
                                    <div className="font-extrabold text-[#0C0D10]">{formatVND(lowestPrice)}</div>
                                  </div>
                                </div>

                                <div className="space-y-1.5">
                                  <div className="flex justify-between text-xs font-medium text-slate-600">
                                    <span className="flex items-center gap-1">
                                      <Users className="w-3.5 h-3.5 text-slate-400" />
                                      <strong>{room.participantCount}</strong> người tham gia
                                    </span>
                                    <span>
                                      <strong>{room.totalQuantity}</strong> / {room.maxQuantity} {room.unit}
                                    </span>
                                  </div>

                                  <div className="text-[11px] text-right font-medium">
                                    {nextTierInfo && room.status === 'active' ? (
                                      <span className="text-amber-700 font-bold">
                                        Còn {nextTierInfo.requiredQuantity} sp để mở khóa {formatVND(nextTierInfo.nextPrice)}
                                      </span>
                                    ) : room.finalPrice !== undefined ? (
                                      <span className="text-[#0C0D10] font-bold">
                                        ✓ Đã chốt mức giá: {formatVND(room.finalPrice)}
                                      </span>
                                    ) : (
                                      <span className="text-[#0C0D10] font-bold">✓ Đã đạt mức giá mục tiêu tối ưu!</span>
                                    )}
                                  </div>

                                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                                    <div
                                      className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                                      style={{ width: `${percentFilled}%` }}
                                    />
                                  </div>
                                </div>

                                <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-100">
                                  <span className="truncate">Pickup: <strong>{room.pickupPoint}</strong></span>
                                  <span className="text-slate-400 shrink-0">
                                    Ship: {formatVND(getSharedShipping(room.totalShippingFee, room.participantCount))}/người
                                  </span>
                                </div>

                                {/* Ranking Transparency ("Vì sao tôi thấy sản phẩm này?") */}
                                <div
                                  onClick={(e) => e.stopPropagation()}
                                  className="text-[10px] text-slate-500 bg-slate-50/80 border border-slate-100 rounded-lg px-2.5 py-1.5"
                                >
                                  <details className="cursor-pointer">
                                    <summary className="font-semibold text-slate-600 hover:text-slate-900">
                                      Vì sao tôi thấy sản phẩm này?
                                    </summary>
                                    <p className="mt-1 text-[10px] text-slate-600 leading-relaxed">
                                      {rankingReason.summary} ({rankingReason.factors.join(' • ')})
                                    </p>
                                  </details>
                                </div>

                                <div className="pt-1">
                                  {isJoined ? (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedRoomId(room.id);
                                      }}
                                      className="w-full py-2.5 rounded-xl font-bold text-xs transition flex items-center justify-center space-x-1.5 shadow-sm bg-[#C7F000]/40 text-emerald-800 border border-[#C7F000]"
                                    >
                                      <CheckCircle2 className="w-4 h-4 text-[#0C0D10]" />
                                      <span>Bạn đã tham gia • Xem phòng</span>
                                    </button>
                                  ) : room.status !== 'active' ? (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedRoomId(room.id);
                                      }}
                                      className="w-full py-2.5 rounded-xl font-bold text-xs transition flex items-center justify-center space-x-1.5 shadow-sm bg-slate-100 text-slate-600 border border-slate-200"
                                    >
                                      <span>Xem chi tiết kết quả</span>
                                    </button>
                                  ) : (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setJoinModalRoomId(room.id);
                                      }}
                                      className="w-full py-2.5 rounded-xl font-bold text-xs transition flex items-center justify-center space-x-1.5 shadow-sm bg-[#3155FF] hover:bg-[#2444DC] text-white shadow-md shadow-[#3155FF]/20 cursor-pointer"
                                    >
                                      <span>THAM GIA GOM</span>
                                      <ArrowRight className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* 4. HOW IT WORKS SECTION */}
                  <HowItWorksSection
                    onExplore={() => {
                      const el = document.getElementById('deals-nearby');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                  />

                  {/* 5. PICKUP & CONSOLIDATED LOGISTICS SECTION */}
                  <PickupDeliverySection onOpenMap={() => setBuyerTab('flashmap')} />

                  {/* 6. SUPPLIER VALUE PROPOSITION SECTION */}
                  <SupplierValueSection onLearnMore={() => setLegalModalSlug('seller_policy')} />

                  {/* 7. FAQ SECTION */}
                  <FaqSection />
                </div>
              ) : (
                /* PHASE 11: 404 NOT FOUND VIEW */
                <NotFoundView
                  onGoHome={() => {
                    setBuyerTab('discovery');
                    navigate('/');
                  }}
                  onGoMarketplace={() => {
                    setBuyerTab('discovery');
                    navigate('/marketplace');
                  }}
                />
              )}
            </>
          )}

          {/* ======================================================== */}
          {/* SUPPLIER ROLE VIEWS                                      */}
          {/* ======================================================== */}
          {currentUser && currentUser.role === 'supplier' && (
            <>
              {selectedRoomId && activeRoom ? (
                <GroupRoomView
                  room={activeRoom}
                  supplier={suppliers.find((s) => s.id === activeRoom.supplierId)}
                  product={products.find((p) => p.id === activeRoom.productId)}
                  reviews={reviews.filter((r) => r.supplierId === activeRoom.supplierId)}
                  participation={activeRoomParticipation}
                  currentUser={currentUser}
                  isRoomSupplier={activeRoom.supplierId === currentSupplier.id}
                  pickupPoints={pickupPoints}
                  events={roomEvents}
                  messages={groupMessages}
                  reactions={messageReactions}
                  onOpenJoinModal={() => showToast('Tài khoản Nhà cung cấp đang ở chế độ xem & quản trị phòng gom.')}
                  onOpenShareModal={() => setShareModalRoomId(activeRoom.id)}
                  onOpenSellerInfo={() => setSellerInfoModalSupplierId(activeRoom.supplierId)}
                  onOpenReportProduct={() => setReportProductModalProductId(activeRoom.productId)}
                  onSendMessage={(text) => handleSendRoomMessage(activeRoom.id, text)}
                  onModerateHideMessage={handleModerateHideMessage}
                  onToggleReaction={handleToggleReaction}
                  onBack={() => setSelectedRoomId(null)}
                  onGoCheckout={() => {}}
                  onFinalizeNow={() => finalizeRoom(activeRoom.id)}
                  isFavorite={favoriteRoomIds.includes(activeRoom.id)}
                  onToggleFavorite={() => handleToggleFavorite(activeRoom.id)}
                  getSecondsLeft={getSecondsLeft}
                  nowMs={now}
                  showToast={showToast}
                />
              ) : supplierTab === 'products' ? (
                <SupplierProductsView
                  products={products}
                  rooms={rooms}
                  supplier={currentSupplier}
                  supplierId={currentSupplier.id}
                  verificationDocuments={verificationDocuments}
                  onAddProduct={(newProd) => setProducts((prev) => [newProd, ...prev])}
                  onUpdateProduct={(updated) =>
                    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))
                  }
                  onUpdateSupplier={handleUpdateSupplierLegalInfo}
                  onUploadDocument={handleAddVerificationDocument}
                  showToast={showToast}
                />
              ) : supplierTab === 'rooms' ? (
                <SupplierGroupRoomsView
                  rooms={rooms}
                  products={products.filter((p) => p.supplierId === currentSupplier.id && p.status === 'active')}
                  supplier={currentSupplier}
                  pickupPoints={pickupPoints}
                  pickupSlots={pickupSlots}
                  commissionRate={commissionRate}
                  onAddRoom={(newRoom) => setRooms((prev) => [newRoom, ...prev])}
                  onUpdateRoom={(updated) =>
                    setRooms((prev) => prev.map((r) => (r.id === updated.id ? updated : r)))
                  }
                  onCancelRoom={handleSupplierCancelRoom}
                  onSelectRoom={(id) => {
                    setSelectedRoomId(id);
                  }}
                  getSecondsLeft={getSecondsLeft}
                  showToast={showToast}
                />
              ) : supplierTab === 'orders' ? (
                <SupplierOrdersView
                  orders={orders}
                  onUpdateOrderStatus={handleUpdateOrderStatus}
                  showToast={showToast}
                />
              ) : supplierTab === 'pickup' ? (
                <SupplierPickupView
                  orders={orders}
                  pickupPoints={pickupPoints}
                  onSimulatePickupScan={(orderId) => {
                    handleUpdateOrderStatus(orderId, 'picked_up');
                    showToast('Đã quét mã nhận hàng QR thành công!');
                  }}
                  onMarkOrderOverdue={handleMarkOrderOverdue}
                  showToast={showToast}
                />
              ) : supplierTab === 'logistics' ? (
                <SupplierLogisticsView
                  supplierId={currentSupplier.id}
                  batches={deliveryBatches}
                  events={deliveryEvents}
                  issues={deliveryIssues}
                  rooms={rooms}
                  orders={orders}
                  pickupPoints={pickupPoints}
                  users={users}
                  onAdvanceBatchStatus={handleAdvanceBatchStatus}
                  onReportIssue={handleReportDeliveryIssue}
                />
              ) : supplierTab === 'earnings' ? (
                <SupplierEarningsView
                  supplier={currentSupplier}
                  orders={orders}
                  payouts={payouts}
                  commissionRate={commissionRate}
                  onRequestPayout={handleRequestPayout}
                  onOpenBusinessModel={() => setIsBusinessModelOpen(true)}
                  showToast={showToast}
                />
              ) : supplierTab === 'analytics' || supplierTab === 'dashboard' ? (
                <SupplierAnalyticsView
                  supplier={currentSupplier}
                  rooms={rooms}
                  orders={orders}
                  reviews={reviews}
                  batches={deliveryBatches}
                />
              ) : supplierTab === 'notifications' ? (
                <NotificationCenter
                  notifications={notifications}
                  currentUserId={currentUser.id}
                  onMarkAsRead={(id) => {
                    setNotifications((prev) =>
                      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
                    );
                  }}
                  onMarkAllAsRead={() => {
                    setNotifications((prev) =>
                      prev.map((n) => (n.userId === currentUser.id ? { ...n, read: true } : n))
                    );
                    showToast('Đã đánh dấu đã đọc tất cả thông báo.');
                  }}
                  onSelectItem={(roomId, orderId) => {
                    if (roomId) setSupplierTab('rooms');
                    else if (orderId) setSupplierTab('orders');
                  }}
                />
              ) : (
                /* SUPPLIER PROFILE VIEW */
                <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4">
                  <h3 className="text-lg font-black text-slate-900">Hồ sơ Pháp lý Nhà cung cấp</h3>
                  <div className="space-y-2 text-xs">
                    <div>Tên hiển thị: <strong>{currentSupplier.businessName}</strong></div>
                    <div>Tên pháp nhân / HKD: <strong>{currentSupplier.legalName || currentSupplier.businessName}</strong></div>
                    <div>Mã số ĐKKD: <strong>{currentSupplier.businessRegistrationNumber || 'Chưa cập nhật'}</strong></div>
                    <div>Mã số thuế: <strong>{currentSupplier.taxCode || 'Chưa cập nhật'}</strong></div>
                    <div>Người đại diện pháp luật: <strong>{currentSupplier.legalRepresentative || 'Chưa cập nhật'}</strong></div>
                    <div>Loại hình: <strong>{currentSupplier.supplierType}</strong></div>
                    <div>Trạng thái xác minh: <strong>{currentSupplier.verificationStatus}</strong></div>
                    <div>Địa chỉ trụ sở / kho gom: {currentSupplier.businessAddress || currentSupplier.location || 'TP.HCM'}</div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* ======================================================== */}
          {/* ADMIN ROLE VIEWS                                         */}
          {/* ======================================================== */}
          {currentUser && currentUser.role === 'admin' && (
            selectedRoomId && activeRoom ? (
              <GroupRoomView
                room={activeRoom}
                supplier={suppliers.find((s) => s.id === activeRoom.supplierId)}
                product={products.find((p) => p.id === activeRoom.productId)}
                reviews={reviews.filter((r) => r.supplierId === activeRoom.supplierId)}
                participation={activeRoomParticipation}
                currentUser={currentUser}
                isRoomSupplier={false}
                pickupPoints={pickupPoints}
                events={roomEvents}
                messages={groupMessages}
                reactions={messageReactions}
                onOpenJoinModal={() => showToast('Quản trị viên đang ở chế độ giám sát phòng gom.')}
                onOpenShareModal={() => setShareModalRoomId(activeRoom.id)}
                onOpenSellerInfo={() => setSellerInfoModalSupplierId(activeRoom.supplierId)}
                onOpenReportProduct={() => setReportProductModalProductId(activeRoom.productId)}
                onSendMessage={(text) => handleSendRoomMessage(activeRoom.id, text)}
                onModerateHideMessage={handleModerateHideMessage}
                onToggleReaction={handleToggleReaction}
                onBack={() => setSelectedRoomId(null)}
                onGoCheckout={() => {}}
                onFinalizeNow={() => finalizeRoom(activeRoom.id)}
                isFavorite={favoriteRoomIds.includes(activeRoom.id)}
                onToggleFavorite={() => handleToggleFavorite(activeRoom.id)}
                getSecondsLeft={getSecondsLeft}
                nowMs={now}
                showToast={showToast}
              />
            ) : (
              <AdminDashboardView
                currentAdminTab={adminTab}
                onSelectTab={(tab) => setAdminTab(tab as any)}
                users={users}
                suppliers={suppliers}
                products={products}
                rooms={rooms}
                orders={orders}
                refunds={refunds}
                reviews={reviews}
                payouts={payouts}
                commissionRate={commissionRate}
                vouchers={vouchers}
                voucherUsages={voucherUsages}
                referrals={referrals}
                loyaltyTransactions={loyaltyTransactions}
                roomEvents={roomEvents}
                pickupPoints={pickupPoints}
                pickupSlots={pickupSlots}
                deliveryBatches={deliveryBatches}
                deliveryEvents={deliveryEvents}
                deliveryIssues={deliveryIssues}
                verificationDocuments={verificationDocuments}
                complaints={complaintCases}
                complaintMessages={complaintMessages}
                productReports={productReports}
                moderationActions={moderationActions}
                privacyRequests={privacyRequests}
                auditEvents={auditEvents}
                complianceChecklist={complianceChecklist}
                onReviewDocument={handleReviewVerificationDocument}
                onAdminUpdateComplaint={handleAdminUpdateComplaint}
                onResolveProductReport={handleResolveProductReport}
                onModerateProduct={handleModerateProduct}
                onModerateReview={handleModerateReview}
                onAdminUpdatePrivacyRequest={handleAdminUpdatePrivacyRequest}
                onUpdateChecklistItem={handleUpdateChecklistItem}
                onSavePickupPoint={handleSavePickupPoint}
                onTogglePickupPointStatus={handleTogglePickupPointStatus}
                onAdvanceBatchStatus={handleAdvanceBatchStatus}
                onReportDeliveryIssue={handleReportDeliveryIssue}
                onSaveVoucher={handleSaveVoucher}
                onToggleVoucherStatus={handleToggleVoucherStatus}
                onUpdateCommissionRate={handleUpdateCommissionRate}
                onUpdatePayoutStatus={handleUpdatePayoutStatus}
                onOpenBusinessModel={() => setIsBusinessModelOpen(true)}
                onToggleUserStatus={(uId) => {
                  setUsers((prev) => {
                    const updated = prev.map((u) => {
                      if (u.id !== uId) return u;
                      const nextStatus: UserStatus = u.status === 'active' ? 'suspended' : 'active';
                      showToast(`Tài khoản ${u.name} đã được chuyển sang ${nextStatus === 'active' ? 'HOẠT ĐỘNG' : 'TẠM KHÓA'}`);
                      return { ...u, status: nextStatus };
                    });
                    try {
                      localStorage.setItem('flashgroup_v3_users', JSON.stringify(updated));
                    } catch {}
                    return updated;
                  });
                }}
                onApproveUser={(uId) => {
                  let targetUser: User | undefined;
                  setUsers((prev) => {
                    const updated = prev.map((u) => {
                      if (u.id !== uId) return u;
                      targetUser = u;
                      return { ...u, status: 'active' as const };
                    });
                    try {
                      localStorage.setItem('flashgroup_v3_users', JSON.stringify(updated));
                    } catch {}
                    return updated;
                  });

                  setSuppliers((prev) => {
                    const updated = prev.map((s) => {
                      if (s.userId === uId || s.id === uId || (targetUser && s.email && s.email.toLowerCase() === targetUser.email.toLowerCase())) {
                        return {
                          ...s,
                          verificationStatus: 'verified' as const,
                          verifiedAt: new Date().toISOString(),
                          verifiedBy: currentUser?.id || 'admin',
                        };
                      }
                      return s;
                    });
                    try {
                      localStorage.setItem('flashgroup_v3_suppliers', JSON.stringify(updated));
                    } catch {}
                    return updated;
                  });

                  if (targetUser) {
                    pushNotification(
                      uId,
                      'system',
                      'Tài khoản đã được Admin phê duyệt',
                      `Chào mừng ${targetUser.name}! Tài khoản của bạn đã được Admin phê duyệt và kích hoạt đầy đủ quyền hạn trên FlashGroup.`,
                      `approved-${uId}-${Date.now()}`
                    );
                    showToast(`Đã duyệt và kích hoạt thành công tài khoản: ${targetUser.name}`);
                  }
                }}
                onRejectUser={(uId) => {
                  let targetUser: User | undefined;
                  setUsers((prev) => {
                    const updated = prev.map((u) => {
                      if (u.id !== uId) return u;
                      targetUser = u;
                      return { ...u, status: 'rejected' as const };
                    });
                    try {
                      localStorage.setItem('flashgroup_v3_users', JSON.stringify(updated));
                    } catch {}
                    return updated;
                  });
                  if (targetUser) {
                    showToast(`Đã từ chối kích hoạt tài khoản: ${targetUser.name}`);
                  }
                }}
                onDeleteUser={(uId) => {
                  const target = users.find((u) => u.id === uId);
                  if (target && target.role === 'admin') {
                    showToast('Không thể xóa tài khoản Quản trị viên hệ thống.');
                    return;
                  }
                  setUsers((prev) => {
                    const updated = prev.filter((u) => u.id !== uId);
                    try {
                      localStorage.setItem('flashgroup_v3_users', JSON.stringify(updated));
                    } catch {}
                    return updated;
                  });
                  setSuppliers((prev) => {
                    const updated = prev.filter((s) => s.userId !== uId && s.id !== uId);
                    try {
                      localStorage.setItem('flashgroup_v3_suppliers', JSON.stringify(updated));
                    } catch {}
                    return updated;
                  });
                  showToast(`Đã xóa tài khoản "${target?.name || ''}" khỏi hệ thống.`);
                }}
                onUpdateSupplierVerification={(suppId, newStatus, note) => {
                  const nowIso = new Date().toISOString();
                  const isApprovedState =
                    newStatus === 'verified' ||
                    newStatus === 'identity_verified' ||
                    newStatus === 'business_verified' ||
                    newStatus === 'document_verified';

                  setSuppliers((prev) =>
                    prev.map((s) => {
                      if (s.id !== suppId) return s;
                      if (isApprovedState) {
                        pushNotification(
                          s.userId,
                          'system',
                          'Hồ sơ nhà cung cấp đã được Admin phê duyệt',
                          `Trạng thái xác minh hiện tại: ${newStatus.toUpperCase()}. Huy hiệu "Đã xác minh" đã được kích hoạt.`,
                          `verified-${s.id}-${newStatus}`
                        );
                        setUsers((uPrev) => {
                          const uUpdated = uPrev.map((u) => {
                            if (u.id === s.userId || (s.email && u.email.toLowerCase() === s.email.toLowerCase())) {
                              return { ...u, status: 'active' as const };
                            }
                            return u;
                          });
                          try {
                            localStorage.setItem('flashgroup_v3_users', JSON.stringify(uUpdated));
                          } catch {}
                          return uUpdated;
                        });
                      } else if (newStatus === 'suspended') {
                        pushNotification(
                          s.userId,
                          'system',
                          'Tài khoản nhà cung cấp bị tạm đình chỉ',
                          `Tài khoản của bạn đã bị tạm đình chỉ tạo phòng gom mới. Lý do: ${
                            note || 'Vi phạm quy định tuân thủ sàn.'
                          }`,
                          `suspended-${s.id}-${Date.now()}`
                        );
                      }
                      return {
                        ...s,
                        verificationStatus: newStatus,
                        verifiedAt: isApprovedState ? nowIso : s.verifiedAt,
                        verifiedBy: isApprovedState ? (currentUser?.id || 'admin') : s.verifiedBy,
                        suspensionReason: newStatus === 'suspended' ? note : undefined,
                      };
                    })
                  );

                  appendAuditLog(
                    newStatus === 'suspended' ? 'supplier_suspended' : 'supplier_verified',
                    'supplier',
                    suppId,
                    { newStatus, note }
                  );

                  showToast(
                    `Đã cập nhật trạng thái xác minh nhà cung cấp thành: ${newStatus.toUpperCase()}`
                  );
                }}
                onToggleProductStatus={(prodId) => {
                  setProducts((prev) =>
                    prev.map((p) => {
                      if (p.id !== prodId) return p;
                      const next = p.status === 'active' ? 'inactive' : 'active';
                      showToast(`Đã chuyển sản phẩm ${p.name} sang ${next}`);
                      return { ...p, status: next };
                    })
                  );
                }}
                onForceCloseRoom={(roomId) => {
                  finalizeRoom(roomId);
                  showToast('Đã can thiệp chốt phòng gom ngay lập tức.');
                }}
                onApproveRefund={(refundId) => {
                  setRefunds((prev) =>
                    prev.map((r) =>
                      r.id === refundId
                        ? { ...r, status: 'approved', reviewedAt: new Date().toISOString() }
                        : r
                    )
                  );
                  showToast('Đã phê duyệt yêu cầu hoàn tiền.');
                }}
                onSimulateRefund={(refundId) => {
                  const targetRef = refunds.find((r) => r.id === refundId);
                  if (!targetRef) return;

                  setRefunds((prev) =>
                    prev.map((r) => (r.id === refundId ? { ...r, status: 'refunded' } : r))
                  );

                  setOrders((prev) =>
                    prev.map((o) => (o.id === targetRef.orderId ? { ...o, status: 'refunded' } : o))
                  );

                  appendAuditLog('refund_processed', 'refund', refundId, {
                    orderId: targetRef.orderId,
                    reason: targetRef.reason,
                  });

                  pushNotification(
                    targetRef.userId,
                    'refund',
                    'Hoàn tiền thành công (Mô phỏng)',
                    `Yêu cầu hoàn tiền cho đơn ${targetRef.orderId} đã được xử lý hoàn tất.`,
                    undefined,
                    undefined,
                    targetRef.orderId
                  );

                  showToast('Đã mô phỏng hoàn tiền thành công.');
                }}
                showToast={showToast}
              />
            )
          )}
        </main>
      </div>

      {/* PHASE 8 REQ 32: GLOBAL MARKETPLACE COMPLIANCE FOOTER */}
      <Footer
        onNavigateTab={(tab) => {
          setSelectedRoomId(null);
          setCheckoutRoomId(null);
          if (!currentUser || currentUser.role === 'buyer') setBuyerTab(tab as any);
          else if (currentUser.role === 'supplier') setSupplierTab(tab as any);
          else setAdminTab(tab as any);
        }}
        onOpenLegalDoc={(slug) => setLegalModalSlug(slug)}
        onOpenBusinessModel={() => setIsBusinessModelOpen(true)}
      />

      {/* PHASE 11: MOBILE APP BOTTOM NAVIGATION BAR */}
      <MobileBottomNav
        isAuthenticated={Boolean(currentUser)}
        onOpenAuth={openLoginModal}
      />

      {/* PHASE 11: DEMO READINESS & SCENARIO CHECK MODAL */}
      <DemoCheckModal
        isOpen={isDemoCheckModalOpen}
        onClose={() => setIsDemoCheckModalOpen(false)}
        supabaseConnected={isSupabaseConfigured && !useLocalDemoMode}
        realtimeConnected={isSupabaseConfigured && !useLocalDemoMode}
        users={users}
        rooms={rooms}
        pickupPoints={pickupPoints}
        onResetDemo={() => handleResetData(true)}
      />

      {/* PHASE 12: PRESENTER CONTROL PANEL (OWNER ADMIN OR PRESENTATION PARAM ONLY) */}
      {isPresentationAllowed && isPresentationMode && (
        <PresenterPanel
          currentUser={currentUser}
          onSwitchRole={handleSwitchRole}
          onResetDemo={() => handleResetData(true)}
          onOpenChecklist={() => setIsDemoCheckModalOpen(true)}
          onStartGuidedDemo={() => {
            setIsGuidedDemoActive((prev) => !prev);
            setGuidedStepIndex(0);
          }}
          isGuidedDemoActive={isGuidedDemoActive}
          isScreenshotMode={isScreenshotMode}
          onToggleScreenshotMode={() => setIsScreenshotMode((prev) => !prev)}
          onClose={() => setIsPresentationMode(false)}
        />
      )}

      {/* PHASE 12: GUIDED DEMO OVERLAY (DO NOT AUTO-CLICK) */}
      {isGuidedDemoActive && !isScreenshotMode && (
        <GuidedDemoOverlay
          currentStepIndex={guidedStepIndex}
          onNextStep={() => {
            if (guidedStepIndex < GUIDED_DEMO_STEPS.length - 1) {
              setGuidedStepIndex((prev) => prev + 1);
            } else {
              setIsGuidedDemoActive(false);
              showToast('Đã hoàn thành toàn bộ kịch bản Hướng dẫn Demo FlashGroup!', 'SUCCESS');
            }
          }}
          onPrevStep={() => {
            if (guidedStepIndex > 0) {
              setGuidedStepIndex((prev) => prev - 1);
            }
          }}
          onJumpToStep={(idx) => setGuidedStepIndex(idx)}
          onClose={() => setIsGuidedDemoActive(false)}
        />
      )}
    </div>
  );
}

// ========================================================
// SUB-VIEWS: GROUP ROOM, CHECKOUT, ORDERS, MY ROOMS, MAP
// ========================================================

function GroupRoomView({
  room,
  supplier,
  product,
  reviews = [],
  participation,
  currentUser,
  isRoomSupplier,
  pickupPoints = [],
  events,
  messages,
  reactions,
  onOpenJoinModal,
  onOpenShareModal,
  onOpenSellerInfo,
  onOpenReportProduct,
  onSendMessage,
  onModerateHideMessage,
  onToggleReaction,
  onBack,
  onGoCheckout,
  onFinalizeNow,
  isFavorite,
  onToggleFavorite,
  getSecondsLeft,
  nowMs,
}: {
  room: GroupRoom;
  supplier?: Supplier;
  product?: Product;
  reviews?: Review[];
  participation?: GroupParticipation;
  currentUser: User | null;
  isRoomSupplier: boolean;
  pickupPoints?: PickupPoint[];
  events: RoomEvent[];
  messages: GroupMessage[];
  reactions: MessageReaction[];
  onOpenJoinModal: () => void;
  onOpenShareModal: () => void;
  onOpenSellerInfo?: () => void;
  onOpenReportProduct?: () => void;
  onSendMessage: (text: string) => void;
  onModerateHideMessage: (messageId: string) => void;
  onToggleReaction: (messageId: string, reaction: ReactionType) => void;
  onBack: () => void;
  onGoCheckout: () => void;
  onFinalizeNow: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  getSecondsLeft: (endAt: string) => number;
  nowMs: number;
  showToast: (m: string, type?: ToastType) => void;
}) {
  const secondsLeft = getSecondsLeft(room.endAt);
  const isJoined = Boolean(participation);
  const isEligibleForCheckout = canCheckout(room, participation);

  const currentPrice = room.finalPrice ?? getCurrentPrice(room.totalQuantity, room.priceTiers);
  const nextTier = getNextTier(room.totalQuantity, room.priceTiers);
  const percentFilled = Math.min(100, Math.round((room.totalQuantity / room.maxQuantity) * 100));
  const shippingPerPerson =
    room.shippingPerBuyerSnapshot ??
    getSharedShipping(room.totalShippingFee, room.participantCount);
  const normalShippingEst = room.normalShippingEstimate || 20000;
  const shippingSaved = Math.max(0, normalShippingEst - shippingPerPerson);
  const roomPickupPoint = pickupPoints.find(
    (p) => p.id === room.pickupPointId || p.name === room.pickupPoint
  );
  const isUrgent = room.status === 'active' && secondsLeft < 300 && secondsLeft > 0;
  const verifDisplay = getSupplierVerificationDisplay(supplier);

  const scrollToSocialSection = () => {
    const el = document.getElementById('room-social-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-24 sm:pb-12">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <button
          onClick={onBack}
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-3 py-2 rounded-xl border border-slate-200 transition"
        >
          <ChevronRight className="w-4 h-4 rotate-180" />
          <span>Quay lại danh sách phòng</span>
        </button>

        <div className="flex flex-wrap items-center gap-2">
          {/* Requirement 4: Rủ bạn cùng mua button */}
          <button
            onClick={onOpenShareModal}
            className="px-3.5 py-2 rounded-xl bg-[#3155FF] hover:bg-emerald-500 text-white text-xs font-black transition flex items-center space-x-1.5 shadow-sm shadow-emerald-600/20"
          >
            <Share2 className="w-4 h-4" />
            <span>Rủ bạn cùng mua</span>
          </button>

          {/* Phase 8 Req 2: Seller Legal Info button */}
          {onOpenSellerInfo && (
            <button
              onClick={onOpenSellerInfo}
              className="px-3 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold transition flex items-center space-x-1.5"
            >
              <Building2 className="w-4 h-4 text-[#0C0D10]" />
              <span>Hồ sơ pháp lý NCC</span>
            </button>
          )}

          {/* Phase 8 Req 26: Báo cáo sản phẩm button */}
          {onOpenReportProduct && (
            <button
              onClick={onOpenReportProduct}
              className="px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-bold transition flex items-center space-x-1.5"
            >
              <Flag className="w-3.5 h-3.5" />
              <span>Báo cáo sản phẩm</span>
            </button>
          )}

          <button
            onClick={onToggleFavorite}
            className={`px-3 py-2 rounded-xl border text-xs font-bold transition flex items-center space-x-1.5 ${
              isFavorite
                ? 'bg-rose-50 border-rose-300 text-rose-600'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
            <span>{isFavorite ? 'Đã lưu phòng' : 'Lưu phòng'}</span>
          </button>

          {room.status === 'active' && (
            <button
              onClick={onFinalizeNow}
              title="Kiểm thử kịch bản chốt phòng khi hết thời gian"
              className="text-[11px] font-bold text-slate-500 hover:text-slate-800 bg-slate-100 px-3 py-2 rounded-xl border border-slate-200"
            >
              Chốt phòng ngay (Test Finalize)
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        <div className="bg-slate-900 text-white px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{room.emoji}</span>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs uppercase tracking-widest text-emerald-400 font-bold block">
                  PHÒNG GOM SIÊU CỤC BỘ #{room.id.toUpperCase()}
                </span>
                <StatusBadge status={room.status} size="sm" />
                {room.isSponsored && (
                  <span className="text-[10px] font-black px-2 py-0.5 rounded bg-amber-400 text-slate-950">
                    Được tài trợ
                  </span>
                )}
              </div>
              <h1 className="text-lg sm:text-xl font-extrabold text-white">{room.productName}</h1>
            </div>
          </div>

          <div
            className={`px-4 py-2 rounded-xl font-mono text-sm font-bold flex items-center space-x-2 border ${
              room.status === 'successful'
                ? 'bg-teal-950 text-teal-300 border-teal-800'
                : room.status !== 'active' || secondsLeft <= 0
                ? 'bg-slate-800 text-slate-400 border-slate-700'
                : isUrgent
                ? 'bg-rose-500 text-white border-rose-400 animate-pulse'
                : 'bg-emerald-950 text-emerald-400 border-emerald-800'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>
              {room.status === 'successful'
                ? 'PHÒNG ĐÃ CHỐT GIÁ'
                : room.status !== 'active' || secondsLeft <= 0
                ? 'PHÒNG ĐÃ ĐÓNG'
                : `Còn lại: ${formatTime(secondsLeft)}`}
            </span>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="relative rounded-2xl overflow-hidden h-72 bg-slate-100 shadow-inner">
              <img src={room.productImage} alt={room.productName} className="w-full h-full object-cover" />
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs font-bold text-slate-800 shadow flex items-center gap-2">
                <span>{room.unit} • {room.supplierName}</span>
                <span
                  className={`text-[10px] font-black px-2 py-0.5 rounded ${
                    verifDisplay.isAdminVerified
                      ? 'bg-[#C7F000]/40 text-emerald-800'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {verifDisplay.buyerBadgeLabel}
                </span>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <div className="text-xs text-slate-400 font-semibold mb-1">
                  {room.finalPrice !== undefined
                    ? 'MỨC GIÁ CHỐT CUỐI CÙNG (ĐÃ KHÓA):'
                    : 'GIÁ HIỆN TẠI MỞ KHÓA CHO CẢ NHÓM:'}
                </div>
                <div className="flex items-baseline space-x-3">
                  <span className="text-4xl sm:text-5xl font-black text-[#0C0D10] tracking-tight">
                    {formatVND(currentPrice)}
                  </span>
                  <span className="text-slate-400 line-through text-lg">{formatVND(room.initialPrice)}</span>
                </div>
                <p className="text-xs text-slate-500 mt-1 font-medium">{room.description}</p>
              </div>

              {nextTier && room.status === 'active' ? (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-amber-800 uppercase tracking-wide flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      Mức giá tiếp theo
                    </span>
                    <span className="text-lg font-black text-amber-700">{formatVND(nextTier.nextPrice)}</span>
                  </div>
                  <p className="text-xs text-amber-900">
                    Chỉ cần cả nhóm gom thêm{' '}
                    <strong className="text-base text-amber-950 font-black">
                      {nextTier.requiredQuantity} {room.unit}
                    </strong>{' '}
                    nữa để mỗi thành viên cùng tiết kiệm thêm{' '}
                    <strong>{formatVND(nextTier.savingPerUnit)}/{room.unit}</strong>!
                  </p>
                </div>
              ) : room.finalPrice !== undefined ? (
                <div className="bg-teal-50 border border-teal-300 rounded-2xl p-4 text-teal-900 text-xs font-bold flex items-center space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" />
                  <span>
                    Phòng gom đã chốt thành công ở mức <strong>{formatVND(room.finalPrice)}/{room.unit}</strong>.
                    Mức giá đã được khóa vĩnh viễn cho tất cả người tham gia.
                  </span>
                </div>
              ) : (
                <div className="bg-[#F5FBD9] border border-[#C7F000] rounded-2xl p-4 text-emerald-900 text-xs font-bold flex items-center space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-[#0C0D10] shrink-0" />
                  <span>
                    Cả nhóm đã đạt mốc số lượng cao nhất! Toàn bộ người tham gia nhận mức giá tối ưu {formatVND(currentPrice)}.
                  </span>
                </div>
              )}

              {/* Phase 7 Req 16, 17: Shared Shipping Calculation & Savings Breakdown */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs space-y-2">
                <div className="flex items-center justify-between text-slate-700 font-bold">
                  <span className="flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-[#0C0D10]" />
                    Shared group shipping ({room.participantCount} người cùng chia):
                  </span>
                  <span className="text-[#0C0D10] font-black text-sm">
                    {formatVND(shippingPerPerson)}/người
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 pt-1.5 border-t border-slate-200/80 text-[11px]">
                  <div>
                    <span className="text-slate-400 block">Normal individual shipping (estimated):</span>
                    <span className="font-bold text-slate-500 line-through">
                      {formatVND(normalShippingEst)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Shared group shipping:</span>
                    <span className="font-black text-slate-900">{formatVND(shippingPerPerson)}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[#0C0D10] font-bold block">You save (Ship):</span>
                    <span className="font-black text-[#0C0D10]">{formatVND(shippingSaved)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* PHASE 8 REQ 1, 2, 3, 4: SELLER TRANSPARENCY & PRODUCT LABELING COMPLIANCE (NGHỊ ĐỊNH 111/2021 & 15/2018) */}
          <div className="bg-slate-50/90 border border-slate-200 rounded-2xl p-5 grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            {/* Seller Legal Summary */}
            <div className="space-y-2 bg-white rounded-xl p-4 border border-slate-200">
              <div className="flex items-center justify-between">
                <span className="font-black text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-[#0C0D10]" />
                  Định danh Nhà cung cấp (Nghị định 85/2021)
                </span>
                <span
                  className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                    verifDisplay.isAdminVerified
                      ? 'bg-[#F5FBD9] text-emerald-800 border-[#C7F000]'
                      : 'bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  {verifDisplay.buyerBadgeLabel}
                </span>
              </div>
              <div className="font-bold text-slate-900 text-sm">
                {supplier?.legalName || supplier?.businessName || room.supplierName}
              </div>
              <div className="text-slate-600 space-y-1 text-[11px]">
                <div>
                  Mã số ĐKKD: <strong>{supplier?.businessRegistrationNumber || 'Chưa cung cấp'}</strong> • MST:{' '}
                  <strong>{supplier?.taxCode || 'Chưa cung cấp'}</strong>
                </div>
                <div>
                  Địa chỉ kinh doanh:{' '}
                  <strong>{supplier?.businessAddress || supplier?.location || 'Chưa cung cấp'}</strong>
                </div>
                <div>
                  Đầu mối tiếp nhận khiếu nại:{' '}
                  <strong>{supplier?.complaintContact || supplier?.email || 'Chưa cung cấp'}</strong>
                </div>
                <div>
                  Chính sách đổi trả:{' '}
                  <span className="text-slate-700">
                    {supplier?.returnPolicy || 'Theo chính sách hoàn tiền & đổi trả tại điểm nhận.'}
                  </span>
                </div>
              </div>
              {onOpenSellerInfo && (
                <button
                  type="button"
                  onClick={onOpenSellerInfo}
                  className="mt-1 inline-flex items-center space-x-1 text-[#0C0D10] hover:text-emerald-800 font-bold text-[11px] underline"
                >
                  <span>Xem đầy đủ hồ sơ pháp lý nhà cung cấp</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Product Mandatory Labeling Info (Decree 111/2021 & Decree 15/2018) */}
            <div className="space-y-2 bg-white rounded-xl p-4 border border-slate-200">
              <div className="flex items-center justify-between">
                <span className="font-black text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <FileCheck className="w-4 h-4 text-[#0C0D10]" />
                  Thông tin Nhãn hàng hóa & ATTP (NĐ 111/2021)
                </span>
                {product?.foodComplianceStatus && product.foodComplianceStatus !== 'not_applicable' && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200">
                    ATTP: {product.foodComplianceStatus}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] text-slate-600">
                <div>
                  Xuất xứ: <strong className="text-slate-900">{product?.origin || 'Đang cập nhật'}</strong>
                </div>
                <div>
                  Định lượng: <strong className="text-slate-900">{product?.quantityOrWeight || room.unit}</strong>
                </div>
                <div className="col-span-2">
                  Tổ chức chịu trách nhiệm:{' '}
                  <strong className="text-slate-900">
                    {product?.organizationResponsibleName || supplier?.legalName || room.supplierName}
                  </strong>
                </div>
                {product?.organizationResponsibleAddress && (
                  <div className="col-span-2">
                    Địa chỉ ghi nhãn: <span className="text-slate-800">{product.organizationResponsibleAddress}</span>
                  </div>
                )}
                {product?.ingredients && (
                  <div className="col-span-2">
                    Thành phần: <span className="text-slate-800">{product.ingredients}</span>
                  </div>
                )}
                {product?.usageInstructions && (
                  <div className="col-span-2">
                    HDSD & Bảo quản: <span className="text-slate-800">{product.usageInstructions}</span>
                  </div>
                )}
                {product?.warnings && (
                  <div className="col-span-2 text-amber-800 font-semibold">
                    Cảnh báo an toàn: {product.warnings}
                  </div>
                )}
                <div>
                  Hạn sử dụng / Bảo hành:{' '}
                  <strong className="text-slate-800">
                    {product?.expiryDate || product?.warranty || 'Xem trên bao bì'}
                  </strong>
                </div>
                <div>
                  Số lô (Batch): <strong className="text-slate-800">{product?.batchNumber || 'N/A'}</strong>
                </div>
                {product?.complianceDocumentReferences && product.complianceDocumentReferences.length > 0 && (
                  <div className="col-span-2 pt-1 text-[10px] text-emerald-800 font-mono">
                    Mã hồ sơ công bố: {product.complianceDocumentReferences.join(' • ')}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Phase 7 Req 4, 29, 30, 31: Pickup Point Details, Locker Capacity & Cách nhận hàng */}
          <div className="bg-slate-50/90 border border-slate-200 rounded-2xl p-5 grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-black text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#0C0D10]" />
                  Điểm nhận hàng chung (Pickup Point)
                </span>
                <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase bg-[#C7F000]/40 text-emerald-800 border border-[#C7F000]">
                  {roomPickupPoint?.status || 'active'}
                </span>
              </div>
              <div className="font-bold text-slate-900 text-sm">
                {room.pickupPointName || room.pickupPoint}
              </div>
              <div className="text-slate-600">
                Địa chỉ: <strong>{room.pickupAddress || roomPickupPoint?.address}</strong> • Cách{' '}
                <strong>{room.distance}</strong>
              </div>
              <div className="text-slate-600">
                Giờ mở cửa:{' '}
                <strong>{roomPickupPoint?.operatingHours || '07:00 – 22:00'}</strong> • Khung giờ
                nhận dự kiến:{' '}
                <strong className="text-[#0C0D10]">
                  {room.pickupSlotSnapshot || '26 Oct • 18:00 – 21:00'}
                </strong>
              </div>
              <div className="pt-1">
                <div className="flex justify-between text-[11px] font-bold text-slate-700 mb-1">
                  <span>
                    Locker Capacity:{' '}
                    {roomPickupPoint
                      ? `${roomPickupPoint.currentLoad} / ${roomPickupPoint.capacity}`
                      : '32 / 50'}{' '}
                    occupied
                  </span>
                  <span className="text-[#0C0D10]">Available</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{
                      width: `${
                        roomPickupPoint
                          ? Math.min(
                              100,
                              Math.round(
                                (roomPickupPoint.currentLoad /
                                  Math.max(1, roomPickupPoint.capacity)) *
                                  100
                              )
                            )
                          : 64
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 border border-slate-200 space-y-1.5">
              <div className="font-black text-slate-900 text-xs flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#0C0D10]" />
                Cách nhận hàng (Pickup Instructions)
              </div>
              <div className="text-slate-600 whitespace-pre-line leading-relaxed text-[11px]">
                {roomPickupPoint?.instructions ||
                  `1. Đến ${room.pickupPointName || room.pickupPoint}\n2. Đưa mã QR hoặc mã nhận hàng\n3. Kiểm tra sản phẩm`}
              </div>
            </div>
          </div>

          <div className="space-y-2 bg-slate-50 p-6 rounded-2xl border border-slate-200">
            <div className="flex justify-between items-center text-xs font-bold text-slate-700">
              <span className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#0C0D10]" />
                <span>{room.participantCount} người tham gia</span>
                <span>•</span>
                <span>
                  {room.totalQuantity} / {room.maxQuantity} {room.unit} đã gom
                </span>
              </span>
              <span>{percentFilled}% hoàn thành</span>
            </div>
            <div className="w-full bg-slate-200 h-4 rounded-full overflow-hidden p-0.5">
              <div
                className="h-full rounded-full transition-all duration-700 shadow-sm"
                style={{
                  width: `${percentFilled}%`,
                  background:
                    percentFilled >= 100
                      ? "#C7F000"
                      : percentFilled >= 80
                      ? "linear-gradient(90deg, #3155FF 0%, #C7F000 100%)"
                      : "linear-gradient(90deg, #2444DC 0%, #3155FF 100%)"
                }}
              />
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <Layers className="w-4 h-4 text-[#0C0D10]" />
              <span>Bậc thang giá theo số lượng sản phẩm (Price Ladder)</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {room.priceTiers.map((tier, idx) => {
                const isUnlocked = room.totalQuantity >= tier.minQuantity;
                const isCurrent =
                  room.totalQuantity >= tier.minQuantity &&
                  (tier.maxQuantity === undefined || room.totalQuantity <= tier.maxQuantity);

                const isFinalPriceLock = room.finalPrice !== undefined && room.finalPrice === tier.price;

                const isNextTier = !isUnlocked && nextTier && nextTier.nextPrice === tier.price;

                return (
                  <div
                    key={idx}
                    className={`rounded-2xl p-4 border transition-all text-center relative ${
                      isFinalPriceLock || isCurrent
                        ? 'bg-[#F5FBD9] border-2 border-[#C7F000] text-[#0C0D10] shadow-md ring-2 ring-[#3155FF]/15'
                        : isNextTier
                        ? 'bg-[#FFF0F7] border-2 border-[#7B3FF2]/30 text-[#0C0D10] shadow-xs'
                        : isUnlocked
                        ? 'bg-[#EEF1FF] border border-[#3155FF]/30 text-[#0C0D10]'
                        : 'bg-[#F6F7FC] border border-[#E4E8F0] text-[#596273] opacity-70'
                    }`}
                  >
                    {isFinalPriceLock ? (
                      <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-[#3155FF] text-[#C7F000] text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                        FINAL PRICE
                      </span>
                    ) : isCurrent ? (
                      <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-[#3155FF] text-[#C7F000] text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                        CURRENT TIER
                      </span>
                    ) : isNextTier ? (
                      <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-[#FF4FA3] text-[#0C0D10] text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                        NEXT TIER
                      </span>
                    ) : null}

                    <div className="text-xs font-bold mb-1">
                      {tier.maxQuantity
                        ? `${tier.minQuantity} – ${tier.maxQuantity} ${room.unit}`
                        : `${tier.minQuantity}+ ${room.unit}`}
                    </div>
                    <div
                      className={`text-lg font-black ${
                        isFinalPriceLock || isCurrent
                          ? 'text-[#0C0D10]'
                          : isNextTier
                          ? 'text-[#0C0D10]'
                          : isUnlocked
                          ? 'text-[#3155FF]'
                          : 'text-[#596273]'
                      }`}
                    >
                      {formatVND(tier.price)}
                    </div>

                    <div className="mt-2 text-[11px] font-bold flex items-center justify-center space-x-1">
                      {isFinalPriceLock ? (
                        <span className="text-[#0C0D10] flex items-center gap-1 font-black">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Mức giá chốt
                        </span>
                      ) : isCurrent ? (
                        <span className="text-[#0C0D10] flex items-center gap-1 font-black">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Mức hiện tại
                        </span>
                      ) : isNextTier ? (
                        <span className="text-[#0C0D10] flex items-center gap-1 font-black">
                          ★ Nấc tiếp theo
                        </span>
                      ) : isUnlocked ? (
                        <span className="text-[#3155FF] flex items-center gap-1 font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#3155FF]" /> Đã mở khóa
                        </span>
                      ) : (
                        <span className="text-[#596273] flex items-center gap-1 font-medium">
                          <Lock className="w-3 h-3" /> Chưa mở
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-[#F3EEFF] border border-[#7B3FF2]/30 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-[#0C0D10] text-sm flex items-center gap-1.5">
                <Share2 className="w-4 h-4 text-[#3155FF]" />
                Rủ bạn cùng mua – Càng đông, càng rẻ!
              </h4>
              <p className="text-xs text-slate-600 mt-0.5">
                Chia sẻ link giới thiệu cho bạn bè tại {room.pickupPoint} để nhanh chóng gom đủ số lượng, hạ giá xuống bậc tiếp theo và nhận +20 FlashPoints (Điểm thưởng demo)!
              </p>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <button
                onClick={onOpenShareModal}
                className="bg-slate-900 hover:bg-blue-600 text-white font-black px-4 py-2.5 rounded-xl text-xs flex items-center space-x-1.5 transition shadow-sm"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Rủ bạn cùng mua</span>
              </button>
            </div>
          </div>

          {/* Action Join / Checkout Bar */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center gap-4">
            {!participation ? (
              <button
                onClick={onOpenJoinModal}
                disabled={room.status !== 'active' || secondsLeft <= 0}
                className="w-full sm:flex-1 bg-[#3155FF] hover:bg-[#2444DC] text-white font-black py-4 px-8 rounded-2xl transition shadow-xl shadow-[#3155FF]/25 text-base active:scale-98 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Zap className="w-5 h-5 fill-white" />
                <span>THAM GIA GOM (MỞ KHÓA GIÁ RẺ)</span>
              </button>
            ) : participation.status === 'paid' ? (
              <div className="w-full bg-blue-50 border border-blue-200 p-4 rounded-2xl flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs font-bold text-blue-900">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
                  <span>
                    Bạn đã thanh toán thành công ({participation.quantity} {room.unit}). Vui lòng kiểm tra mã QR nhận hàng tại mục "Đơn hàng".
                  </span>
                </div>
              </div>
            ) : isEligibleForCheckout ? (
              <div className="w-full flex flex-col sm:flex-row items-center gap-3">
                <div className="w-full sm:w-auto bg-[#EEF1FF] text-indigo-900 border border-indigo-200 px-5 py-3.5 rounded-2xl text-xs font-bold flex items-center justify-center space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-[#3155FF]" />
                  <span>
                    Đã chốt giá: {formatVND(room.finalPrice!)} • {participation.quantity} {room.unit}
                  </span>
                </div>
                <button
                  onClick={onGoCheckout}
                  className="w-full sm:flex-1 bg-[#3155FF] hover:bg-[#2444DC] text-white font-black py-3.5 px-6 rounded-2xl transition shadow-lg shadow-[#3155FF]/25 text-sm flex items-center justify-center space-x-2 active:scale-98 cursor-pointer"
                >
                  <span>TIẾP TỤC THANH TOÁN ({formatVND(room.finalPrice! * participation.quantity + shippingPerPerson)})</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="w-full flex flex-col sm:flex-row items-center gap-3">
                <div className="w-full sm:flex-1 bg-slate-100 text-slate-800 border border-slate-300 px-5 py-3.5 rounded-2xl text-xs font-bold flex items-center justify-center space-x-2">
                  <Clock className="w-5 h-5 text-amber-600" />
                  <span>
                    ĐÃ THAM GIA ({participation.quantity} {room.unit}) • ĐANG CHỜ CHỐT GIÁ
                  </span>
                </div>
                <span className="text-xs text-slate-500 font-medium">
                  (Cổng thanh toán sẽ mở ngay khi phòng đủ số lượng hoặc kết thúc đợt gom)
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* PHASE 8 REQ 11: REVIEW INTEGRITY SECTION (NEVER HIDE NEGATIVE REVIEWS) */}
      {reviews.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>Đánh giá từ người mua đã xác thực ({reviews.length})</span>
              </h3>
              <p className="text-[11px] text-slate-500">
                Chính sách trung thực đánh giá (Luật BVNTD 2023): Sàn không ẩn/xóa đánh giá chỉ vì số sao thấp.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">Người mua #{rev.userId.slice(-4)}</span>
                  <div className="flex items-center gap-1 text-amber-500 font-black">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < rev.productRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                {rev.isModerated ? (
                  <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] font-semibold flex items-center gap-1.5">
                    <EyeOff className="w-3.5 h-3.5 shrink-0 text-amber-700" />
                    <span>Nội dung đã được ẩn do vi phạm quy định ({rev.moderationReason})</span>
                  </div>
                ) : (
                  <p className="text-slate-700 leading-relaxed">{rev.comment}</p>
                )}
                <div className="text-[10px] text-slate-400">
                  {new Date(rev.createdAt).toLocaleDateString('vi-VN')} • Đơn hàng #{rev.orderId}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Phase 6: Group Activity Feed & Lightweight Group Chat (Requirements 11-23) */}
      <div id="room-social-section">
        <RoomSocialPanel
          room={room}
          currentUser={currentUser}
          isJoinedBuyer={isJoined}
          isRoomSupplier={isRoomSupplier}
          events={events}
          messages={messages}
          reactions={reactions}
          onSendMessage={onSendMessage}
          onModerateHideMessage={onModerateHideMessage}
          onToggleReaction={onToggleReaction}
          nowMs={nowMs}
        />
      </div>

      {/* Requirement 54: Mobile Sticky Social Action Bar (Tham gia • Chia sẻ • Chat) */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-2.5 shadow-2xl flex items-center gap-2">
        {!isJoined ? (
          <button
            onClick={onOpenJoinModal}
            disabled={room.status !== 'active' || secondsLeft <= 0}
            className="flex-1 bg-[#3155FF] hover:bg-[#2444DC] disabled:opacity-50 text-white font-black py-2.5 px-3 rounded-xl text-xs flex items-center justify-center space-x-1.5 shadow-sm"
          >
            <Zap className="w-3.5 h-3.5 fill-white" />
            <span>Tham gia</span>
          </button>
        ) : isEligibleForCheckout ? (
          <button
            onClick={onGoCheckout}
            className="flex-1 bg-[#3155FF] hover:bg-[#2444DC] text-white font-black py-2.5 px-3 rounded-xl text-xs flex items-center justify-center space-x-1.5 shadow-sm cursor-pointer"
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Thanh toán</span>
          </button>
        ) : (
          <div className="flex-1 bg-[#C7F000] text-[#0C0D10] border border-[#3155FF]/20 font-black py-2.5 px-3 rounded-xl text-[11px] text-center truncate">
            ✓ Đã tham gia
          </div>
        )}
        <button
          onClick={onOpenShareModal}
          className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 px-3.5 rounded-xl text-xs flex items-center space-x-1"
        >
          <Share2 className="w-3.5 h-3.5 text-cyan-400" />
          <span>Chia sẻ</span>
        </button>
        <button
          onClick={scrollToSocialSection}
          className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2.5 px-3.5 rounded-xl text-xs flex items-center space-x-1 border border-slate-200"
        >
          <MessageCircle className="w-3.5 h-3.5 text-[#0C0D10]" />
          <span>Chat</span>
        </button>
      </div>
    </div>
  );
}

function CheckoutView({
  roomId,
  rooms,
  suppliers = [],
  products = [],
  participations,
  orders,
  vouchers,
  voucherUsages,
  deliveryBatches = [],
  currentUser,
  commissionRate,
  onBack,
  onOpenLegalDoc,
  onSuccess,
  showToast,
}: {
  roomId: string;
  rooms: GroupRoom[];
  suppliers?: Supplier[];
  products?: Product[];
  participations: GroupParticipation[];
  orders: Order[];
  vouchers: Voucher[];
  voucherUsages: VoucherUsage[];
  deliveryBatches?: DeliveryBatch[];
  currentUser: User;
  commissionRate: number;
  onBack: () => void;
  onOpenLegalDoc?: (slug: LegalDocumentSlug) => void;
  onSuccess: (order: Order, snapshot: TransactionSnapshot, appliedVoucher?: Voucher) => void;
  showToast: (m: string, type?: ToastType) => void;
}) {
  const room = rooms.find((r) => r.id === roomId);
  const participation = participations.find((p) => p.roomId === roomId && p.status !== 'cancelled');
  const [selectedPayment, setSelectedPayment] = useState<string>('momo');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Phase 8 Req 5: Explicit Remote Transaction Pre-Contract Confirmation Checkbox (MUST NOT be pre-checked)
  const [confirmedRemoteContract, setConfirmedRemoteContract] = useState<boolean>(false);

  // Requirement 20: Checkout Delivery Modes: NHẬN TẠI ĐIỂM GOM (Mặc định) vs GIAO ĐẾN ĐỊA CHỈ
  const [deliveryMode, setDeliveryMode] = useState<'pickup' | 'home'>('pickup');
  const [savedAddresses, setSavedAddresses] = useState<SavedBuyerAddress[]>(() =>
    savedBuyerAddressService.getSavedAddresses(currentUser.id)
  );
  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    savedBuyerAddressService.getSavedAddresses(currentUser.id).find((a) => a.isDefault)?.id ||
      savedBuyerAddressService.getSavedAddresses(currentUser.id)[0]?.id ||
      ''
  );
  const [showAddressSelectorModal, setShowAddressSelectorModal] = useState<boolean>(false);

  // Phase 6: Voucher Checkout State (Requirements 33-38, 59)
  const [voucherInput, setVoucherInput] = useState<string>('');
  const [appliedVoucher, setAppliedVoucher] = useState<Voucher | null>(null);
  const [voucherError, setVoucherError] = useState<string | null>(null);

  if (!room || !participation) return null;

  const supplier = suppliers.find((s) => s.id === room.supplierId);
  const product = products.find((p) => p.id === room.productId);

  const finalUnitPrice = room.finalPrice ?? getCurrentPrice(room.totalQuantity, room.priceTiers);
  const quantity = participation.quantity;
  const rawProductSubtotal = finalUnitPrice * quantity;

  // Validate currently applied voucher if any
  const validationResult = appliedVoucher
    ? validateVoucher(
        appliedVoucher.code,
        rawProductSubtotal,
        currentUser.id,
        vouchers,
        voucherUsages
      )
    : null;

  const activeVoucherDiscount =
    validationResult && validationResult.valid ? validationResult.discountAmount : 0;
  const activeVoucherFundedBy =
    validationResult && validationResult.valid && validationResult.voucher
      ? validationResult.voucher.fundedBy || 'platform'
      : 'platform';

  const fin = calculateOrderFinancials(
    finalUnitPrice,
    quantity,
    room.totalShippingFee,
    room.participantCount,
    commissionRate,
    activeVoucherDiscount,
    activeVoucherFundedBy
  );
  const productSubtotal = fin.productSubtotal;
  const sharedShipping = fin.shippingFee;
  const grandTotal = fin.buyerTotal;

  const handleApplyVoucherCode = (codeToTry?: string) => {
    const rawCode = (codeToTry !== undefined ? codeToTry : voucherInput).trim().toUpperCase();
    if (!rawCode) {
      setVoucherError('Vui lòng nhập mã ưu đãi.');
      return;
    }
    const res = validateVoucher(
      rawCode,
      rawProductSubtotal,
      currentUser.id,
      vouchers,
      voucherUsages
    );
    if (!res.valid || !res.voucher) {
      setAppliedVoucher(null);
      setVoucherError(res.error || 'Mã ưu đãi không hợp lệ.');
      return;
    }
    setVoucherInput(res.voucher.code);
    setAppliedVoucher(res.voucher);
    setVoucherError(null);
    showToast(`Đã áp dụng mã ${res.voucher.code} (-${formatVND(res.discountAmount)})!`);
  };

  const handlePay = () => {
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      showToast('CẦN KẾT NỐI MẠNG ĐỂ THỰC HIỆN THAO TÁC NÀY', 'WARNING');
      return;
    }
    if (!confirmedRemoteContract) {
      showToast('Vui lòng tích chọn xác nhận thông tin giao dịch từ xa trước khi đặt hàng!');
      return;
    }

    const alreadyPaid = orders.some(
      (o) => o.participationId === participation.id && o.status === 'paid'
    );
    if (alreadyPaid) {
      showToast('Bạn đã thanh toán cho phòng gom này.');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      const nowIso = new Date().toISOString();
      const orderId = `FG-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
      const snapshotId = `SNAP-${orderId}`;
      const roomBatch = deliveryBatches.find((b) => b.roomId === room.id);
      const uniquePickupCode = generateUniquePickupCode(orders.map((o) => o.pickupCode));
      const pickupWindowStr =
        room.pickupSlotSnapshot || roomBatch?.pickupWindow || '26 Oct • 18:00 – 21:00';

      // Phase 8 Req 6 & 37: Create Immutable Transaction Contract Snapshot
      const currentSelectedAddr = savedAddresses.find((a) => a.id === selectedAddressId);
      const effectiveMethodString =
        deliveryMode === 'home'
          ? `Giao tận nơi: ${currentSelectedAddr?.address.formattedAddress || 'Địa chỉ riêng tư'}`
          : `${room.pickupPointName || room.pickupPoint} (${pickupWindowStr})`;
      const effectiveAddressString =
        deliveryMode === 'home'
          ? currentSelectedAddr?.address.formattedAddress || room.pickupAddress
          : room.pickupAddress;

      const snapshot: TransactionSnapshot = {
        id: snapshotId,
        orderId,
        userId: currentUser.id,
        sellerId: room.supplierId,
        productSnapshot: {
          id: product?.id || room.productId,
          name: room.productName,
          unit: room.unit,
          origin: product?.origin || 'Việt Nam',
          manufacturer: product?.manufacturer,
          organizationResponsibleName:
            product?.organizationResponsibleName || supplier?.legalName || room.supplierName,
          organizationResponsibleAddress:
            product?.organizationResponsibleAddress || supplier?.businessAddress,
          quantityOrWeight: product?.quantityOrWeight || room.unit,
          warranty: product?.warranty,
          expiryDate: product?.expiryDate,
          batchNumber: product?.batchNumber,
        },
        sellerSnapshot: {
          id: room.supplierId,
          businessName: supplier?.businessName || room.supplierName,
          legalName: supplier?.legalName,
          taxCode: supplier?.taxCode,
          businessRegistrationNumber: supplier?.businessRegistrationNumber,
          businessAddress: supplier?.businessAddress || supplier?.location,
          contactPhone: supplier?.contactPhone,
          complaintContact: supplier?.complaintContact || supplier?.email,
          returnPolicy: supplier?.returnPolicy,
        },
        quantity,
        unitPrice: finalUnitPrice,
        discount: fin.voucherDiscount,
        fees: 0,
        shipping: room.shippingPerBuyerSnapshot ?? sharedShipping,
        finalPrice: grandTotal,
        paymentMethod: `${selectedPayment.toUpperCase()} (Thanh toán mô phỏng – không phát sinh giao dịch tiền thật)`,
        pickupMethod: effectiveMethodString,
        termsVersion: 'v2026.1',
        sellerPolicyVersion: 'v2026.1',
        returnPolicyVersion: 'v2026.1',
        privacyVersion: 'v2026.1',
        supplierTaxCode: supplier?.taxCode,
        invoiceReference: `INV-SIM-${orderId}`,
        confirmationEvent: 'Tôi xác nhận đặt hàng',
        timestamp: nowIso,
      };

      // Requirement 2 & 20 & Phase 6 Req 36-38 & Phase 7 Req 9, 26, 31, 45 & Phase 8 Req 6, 25: Save immutable Order Financial, Tax Boundary & Contract Snapshot
      const newOrder: Order = {
        id: orderId,
        roomId: room.id,
        participationId: participation.id,
        userId: participation.userId,
        supplierId: room.supplierId,
        productName: room.productName,
        unit: room.unit,
        quantity: quantity,
        unitPrice: finalUnitPrice,
        productSubtotal,
        shippingFee: room.shippingPerBuyerSnapshot ?? sharedShipping,
        voucherCode:
          validationResult?.valid && validationResult.voucher
            ? validationResult.voucher.code
            : undefined,
        voucherDiscount: fin.voucherDiscount,
        voucherFundedBy:
          fin.voucherDiscount > 0 ? fin.voucherFundedBy : undefined,
        totalAmount: grandTotal,
        commissionRate: fin.commissionRate,
        platformCommission: fin.platformCommission,
        supplierGross: fin.supplierGross,
        supplierNet: fin.supplierNet,
        pickupPoint: deliveryMode === 'home' ? 'Giao hàng tận nơi' : (room.pickupPointName || room.pickupPoint),
        pickupAddress: effectiveAddressString,
        pickupPointId: deliveryMode === 'home' ? undefined : room.pickupPointId,
        pickupPointName: deliveryMode === 'home' ? 'Giao hàng tận nơi' : (room.pickupPointName || room.pickupPoint),
        pickupWindow: pickupWindowStr,
        deliveryBatchId: roomBatch?.id,
        pickupCode: uniquePickupCode,
        status: 'paid',
        paymentMethod: selectedPayment.toUpperCase(),
        contractSnapshotId: snapshotId,
        supplierTaxCode: supplier?.taxCode,
        invoiceReference: `INV-SIM-${orderId}`,
        taxTimestamp: nowIso,
        createdAt: nowIso,
        paidAt: nowIso,
      };
      setIsProcessing(false);
      onSuccess(
        newOrder,
        snapshot,
        validationResult?.valid ? validationResult.voucher : undefined
      );
    }, 900);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in pb-12">
      <button
        onClick={onBack}
        className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-3 py-2 rounded-xl border border-slate-200 transition"
      >
        <ChevronRight className="w-4 h-4 rotate-180" />
        <span>Quay lại chi tiết phòng</span>
      </button>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8 space-y-6">
        <div className="border-b border-slate-200 pb-4">
          <span className="text-xs uppercase font-extrabold text-[#0C0D10] tracking-wider">
            KIỂM TRA ĐƠN HÀNG & CÔNG BỐ GIAO DỊCH TỪ XA (FINAL CHECKOUT)
          </span>
          <h2 className="text-2xl font-black text-slate-900 mt-1">Rà soát hợp đồng & Thanh toán</h2>
        </div>

        {/* REQUIREMENT 20: EXPLICIT DELIVERY METHOD (NHẬN TẠI ĐIỂM GOM vs GIAO ĐẾN ĐỊA CHỈ) */}
        <div className="space-y-3">
          <label className="text-xs font-black uppercase text-slate-800 tracking-wider flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-[#0C0D10]" />
            <span>Phương thức giao nhận (Logistics Mode)</span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Mode 1: NHẬN TẠI ĐIỂM GOM (Default) */}
            <button
              type="button"
              onClick={() => setDeliveryMode('pickup')}
              className={`p-4 rounded-2xl text-left border transition cursor-pointer relative ${
                deliveryMode === 'pickup'
                  ? 'bg-[#EEF1FF] border-2 border-[#3155FF] ring-2 ring-[#3155FF]/15'
                  : 'bg-white border-[#E4E8F0] hover:border-[#3155FF]/30'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-[#0C0D10] flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#3155FF]" />
                  NHẬN TẠI ĐIỂM GOM
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#C7F000] text-[#0C0D10] text-[9px] font-black uppercase border border-[#3155FF]/20">
                  MẶC ĐỊNH
                </span>
              </div>
              <p className="text-[11px] text-[#596273] mt-1.5 leading-relaxed">
                Tối ưu chi phí bằng cách gom chung về Smart Locker / Điểm nhận gần bạn.
              </p>
              <div className="mt-2 text-xs font-bold text-[#0C0D10] bg-white p-2 rounded-xl border border-[#3155FF]/30">
                {room.pickupPointName || room.pickupPoint}
              </div>
            </button>

            {/* Mode 2: GIAO ĐẾN ĐỊA CHỈ */}
            <button
              type="button"
              onClick={() => setDeliveryMode('home')}
              className={`p-4 rounded-2xl text-left border transition cursor-pointer relative ${
                deliveryMode === 'home'
                  ? 'bg-[#EEF1FF] border-2 border-[#3155FF] ring-2 ring-[#3155FF]/15'
                  : 'bg-white border-[#E4E8F0] hover:border-[#3155FF]/30'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-[#0C0D10] flex items-center gap-1.5">
                  <Home className="w-3.5 h-3.5 text-[#3155FF]" />
                  GIAO ĐẾN ĐỊA CHỈ
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#F6F7FC] text-[#0C0D10] text-[9px] font-black uppercase border border-[#E4E8F0]">
                  TẬN NƠI
                </span>
              </div>
              <p className="text-[11px] text-[#596273] mt-1.5 leading-relaxed">
                Giao hàng đến địa chỉ nhà riêng hoặc văn phòng của bạn tại Việt Nam.
              </p>
              <div className="mt-2 text-xs font-bold text-[#0C0D10] bg-white p-2 rounded-xl border border-[#E4E8F0] truncate">
                {savedAddresses.find((a) => a.id === selectedAddressId)?.address.formattedAddress ||
                  'Chọn hoặc thêm địa chỉ'}
              </div>
            </button>
          </div>

          {/* Delivery Home Address Details & Switcher */}
          {deliveryMode === 'home' && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 animate-fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Chọn địa chỉ nhận hàng của bạn:</span>
                <button
                  type="button"
                  onClick={() => setShowAddressSelectorModal(true)}
                  className="text-xs font-bold text-[#0C0D10] hover:underline cursor-pointer flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  Thêm địa chỉ mới
                </button>
              </div>

              {savedAddresses.length === 0 ? (
                <div className="p-3 text-center text-xs text-slate-500 bg-white rounded-xl border border-dashed border-slate-300">
                  Chưa có địa chỉ nào được lưu.{' '}
                  <button
                    type="button"
                    onClick={() => setShowAddressSelectorModal(true)}
                    className="text-[#0C0D10] font-bold underline ml-1"
                  >
                    Tạo địa chỉ giao hàng
                  </button>
                </div>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {savedAddresses.map((addr) => (
                    <label
                      key={addr.id}
                      className={`flex items-start gap-3 p-3 rounded-xl border transition cursor-pointer ${
                        selectedAddressId === addr.id
                          ? 'bg-white border-[#C7F000] shadow-xs'
                          : 'bg-white/60 border-slate-200 hover:bg-white'
                      }`}
                    >
                      <input
                        type="radio"
                        name="checkoutSavedAddress"
                        checked={selectedAddressId === addr.id}
                        onChange={() => setSelectedAddressId(addr.id)}
                        className="mt-0.5 text-[#0C0D10] focus:ring-emerald-500"
                      />
                      <div className="text-xs flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{addr.label}</span>
                          <span className="text-slate-500">• {addr.recipientName} ({addr.recipientPhone})</span>
                          {addr.isDefault && (
                            <span className="text-[9px] bg-[#C7F000]/40 text-emerald-800 font-black px-1.5 py-0.2 rounded uppercase">
                              Mặc định
                            </span>
                          )}
                        </div>
                        <div className="text-slate-600 mt-0.5 leading-relaxed font-medium">
                          {addr.address.formattedAddress}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Address Selection Modal inside Checkout */}
        {showAddressSelectorModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
            <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 text-xs space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-black text-slate-900">
                  Thêm địa chỉ giao hàng tận nơi
                </h3>
                <button
                  type="button"
                  onClick={() => setShowAddressSelectorModal(false)}
                  className="text-slate-400 hover:text-slate-700 cursor-pointer p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <VietnamAddressSelector
                showRecipientFields={true}
                recipientName={currentUser.name}
                recipientPhone={currentUser.phone || ''}
                onConfirmAddress={(vAddr) => {
                  if (vAddr.formattedAddress) {
                    const created = savedBuyerAddressService.saveAddress({
                      userId: currentUser.id,
                      label: 'NHÀ',
                      recipientName: currentUser.name,
                      recipientPhone: currentUser.phone || '0901234567',
                      isDefault: false,
                      address: vAddr,
                    });
                    const updated = savedBuyerAddressService.getSavedAddresses(currentUser.id);
                    setSavedAddresses(updated);
                    setSelectedAddressId(created.id);
                    setShowAddressSelectorModal(false);
                    showToast('Đã lưu địa chỉ giao hàng mới!');
                  }
                }}
              />
            </div>
          </div>
        )}


        {/* Phase 6: Mã ưu đãi / Voucher Section (Requirements 33, 34, 35 & Phase 8 Req 19, 20) */}
        <div className="bg-[#F5FBD9]/60 rounded-2xl p-4 border border-[#C7F000] space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black text-slate-800 flex items-center gap-1.5">
              <Ticket className="w-4 h-4 text-[#0C0D10]" />
              <span>Mã ưu đãi (Giới hạn khuyến mại tối đa 50% theo NĐ 81/2018/NĐ-CP)</span>
            </label>
            {onOpenLegalDoc && (
              <button
                type="button"
                onClick={() => onOpenLegalDoc('promotion_voucher_terms')}
                className="text-[11px] font-bold text-[#0C0D10] hover:underline"
              >
                 thể lệ ưu đãi
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={voucherInput}
              onChange={(e) => {
                setVoucherInput(e.target.value.toUpperCase());
                setVoucherError(null);
              }}
              placeholder="Nhập mã voucher"
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-mono font-bold uppercase focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            {appliedVoucher ? (
              <button
                type="button"
                onClick={() => {
                  setAppliedVoucher(null);
                  setVoucherInput('');
                  setVoucherError(null);
                  showToast('Đã gỡ mã ưu đãi.');
                }}
                className="px-4 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs transition"
              >
                Gỡ mã
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleApplyVoucherCode()}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs transition shadow-sm"
              >
                Áp dụng
              </button>
            )}
          </div>

          {voucherError && (
            <div className="text-[11px] font-bold text-rose-600 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              <span>{voucherError}</span>
            </div>
          )}

          {appliedVoucher && fin.voucherDiscount > 0 && (
            <div className="bg-[#C7F000]/40/80 border border-[#C7F000] rounded-xl px-3 py-2 flex items-center justify-between text-xs">
              <span className="font-bold text-emerald-900">
                ✓ Đã áp dụng <strong>{appliedVoucher.code}</strong>: giảm {formatVND(fin.voucherDiscount)}
              </span>
              <span className="text-[10px] font-bold text-[#0C0D10] uppercase">
                Tài trợ: {appliedVoucher.fundedBy === 'platform' ? 'Sàn FlashGroup' : 'Nhà cung cấp'}
              </span>
            </div>
          )}

          {/* Quick select available demo vouchers */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[11px] text-slate-500 font-medium">Mã gợi ý:</span>
            {vouchers
              .filter((v) => v.status === 'active')
              .map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => handleApplyVoucherCode(v.code)}
                  className={`text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg border transition ${
                    appliedVoucher?.code === v.code
                      ? 'bg-[#3155FF] text-white border-emerald-600'
                      : 'bg-white text-emerald-800 border-[#C7F000] hover:bg-[#C7F000]/40'
                  }`}
                >
                  {v.code} ({v.type === 'fixed' ? `-${formatVND(v.value)}` : `-${v.value}%`}, đơn từ {formatVND(v.minimumOrder ?? 0)})
                </button>
              ))}
          </div>
        </div>

        {/* PHASE 8 REQ 5: PRE-CHECKOUT REMOTE TRANSACTION DISCLOSURE (LUẬT BVNTD 2023 & NGHỊ ĐỊNH 55/2024/NĐ-CP) */}
        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">{room.emoji}</span>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">{room.productName}</h4>
                <div className="text-xs text-slate-500">
                  Số lượng mua: <strong className="text-slate-800">{quantity} {room.unit}</strong> • Xuất xứ:{' '}
                  <strong className="text-slate-800">{product?.origin || 'Việt Nam'}</strong>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-base font-black text-slate-900">{formatVND(finalUnitPrice)}/{room.unit}</div>
              <div className="text-[11px] text-teal-700 font-bold bg-teal-100 px-2 py-0.5 rounded-md inline-block mt-0.5">
                Giá gom chốt (Giá gốc: {formatVND(room.initialPrice)})
              </div>
            </div>
          </div>

          {/* Mandatory Seller & Transaction Terms Disclosure */}
          <div className="bg-white rounded-xl p-3.5 border border-slate-200/90 text-[11px] text-slate-600 space-y-1.5">
            <div className="font-black text-slate-900 uppercase tracking-wider text-[10px] flex items-center gap-1.5 text-emerald-800">
              <Scale className="w-3.5 h-3.5 text-[#0C0D10]" />
              Thông tin bắt buộc trong giao dịch từ xa (Điều 37 Luật BVNTD 2023)
            </div>
            <div>
              • <strong>Đơn vị bán hàng (Nhà cung cấp):</strong>{' '}
              {supplier?.legalName || supplier?.businessName || room.supplierName} (MST:{' '}
              {supplier?.taxCode || 'Đang cập nhật'})
            </div>
            <div>
              • <strong>Địa chỉ & Liên hệ NCC:</strong>{' '}
              {supplier?.businessAddress || supplier?.location || 'TP.HCM'} • ĐT:{' '}
              {supplier?.contactPhone || '0909000111'}
            </div>
            <div>
              • <strong>Phương thức giao nhận:</strong> Giao hàng gom chung qua{' '}
              <strong>Đối tác giao nhận mô phỏng</strong> về điểm nhận{' '}
              <strong>{room.pickupPointName || room.pickupPoint}</strong> ({room.pickupAddress}).
            </div>
            <div>
              • <strong>Điều kiện đổi trả & bảo hành:</strong>{' '}
              {supplier?.returnPolicy ||
                'Kiểm tra hàng trực tiếp tại điểm nhận; hoàn tiền/đổi trả nếu sai quy cách hoặc hư hỏng.'}{' '}
              ({product?.warranty || 'Bảo đảm chất lượng theo công bố'}).
            </div>
            <div>
              • <strong>Quy trình giải quyết khiếu nại:</strong> Gửi yêu cầu tại Trung tâm khiếu nại & tranh chấp; cam kết phản hồi tiếp nhận trong vòng <strong>03 ngày làm việc</strong>.
            </div>
            <div>
              • <strong>Thời hạn hiệu lực mức giá chốt:</strong> Trong vòng 24 giờ kể từ thời điểm phòng gom chốt giá thành công.
            </div>
          </div>

          <div className="space-y-2 text-xs pt-1">
            <div className="flex justify-between text-slate-600">
              <span>Tiền sản phẩm ({quantity} × {formatVND(finalUnitPrice)}):</span>
              <span className="font-bold text-slate-800">{formatVND(productSubtotal)}</span>
            </div>
            {fin.voucherDiscount > 0 && (
              <div className="flex justify-between text-[#0C0D10] font-bold">
                <span>Voucher ({appliedVoucher?.code}):</span>
                <span>-{formatVND(fin.voucherDiscount)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-600">
              <span>Cước giao chia đều ({formatVND(room.totalShippingFee)} / {room.participantCount} người):</span>
              <span className="font-bold text-slate-800">{formatVND(sharedShipping)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Thông tin thuế & phí khác:</span>
              <span className="font-semibold text-slate-700">Đã bao gồm trong giá bán NCC (0đ phụ phí ẩn)</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Điểm nhận hàng (Pickup Point):</span>
              <span className="font-bold text-emerald-800">{room.pickupPointName || room.pickupPoint}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Khung giờ nhận hàng (Pickup Window):</span>
              <span className="font-bold text-[#0C0D10]">
                {room.pickupSlotSnapshot || '26 Oct • 18:00 – 21:00'}
              </span>
            </div>
          </div>

          <div className="border-t border-[#E4E8F0] pt-3 flex justify-between items-baseline">
            <div>
              <span className="text-sm font-bold text-[#0C0D10] block">Tổng số tiền thanh toán cuối cùng:</span>
              <span className="text-[11px] text-[#596273]">
                (Tiền hàng {formatVND(productSubtotal)}
                {fin.voucherDiscount > 0 ? ` - Voucher ${formatVND(fin.voucherDiscount)}` : ''} + Ship chia sẻ {formatVND(sharedShipping)})
              </span>
            </div>
            <span className="text-3xl font-black text-[#0C0D10]">{formatVND(grandTotal)}</span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-[#0C0D10] uppercase tracking-wider block">
              Chọn phương thức thanh toán
            </label>
            <span className="text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-lg">
              Thanh toán mô phỏng – không phát sinh giao dịch tiền thật.
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: 'momo', label: 'Ví MoMo (Mô phỏng)', icon: '🟣' },
              { id: 'vnpay', label: 'VNPay QR (Mô phỏng)', icon: '🔴' },
              { id: 'bank', label: 'Chuyển khoản NH (Mô phỏng)', icon: '🏦' },
              { id: 'card', label: 'Thẻ ATM / Quốc tế (Mô phỏng)', icon: '💳' },
            ].map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelectedPayment(p.id)}
                className={`p-3.5 rounded-2xl border text-left flex items-center space-x-3 transition cursor-pointer ${
                  selectedPayment === p.id
                    ? 'border-2 border-[#3155FF] bg-[#EEF1FF] shadow-xs'
                    : 'border-[#E4E8F0] hover:bg-[#F6F7FC]'
                }`}
              >
                <span className="text-xl">{p.icon}</span>
                <span className="text-xs font-bold text-[#0C0D10]">{p.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Phase 8 Req 5: Explicit Unchecked Pre-Contract Consent Checkbox */}
        <label className="flex items-start space-x-3 p-4 rounded-2xl bg-[#F6F7FC] border border-[#E4E8F0] cursor-pointer select-none">
          <input
            type="checkbox"
            checked={confirmedRemoteContract}
            onChange={(e) => setConfirmedRemoteContract(e.target.checked)}
            className="mt-0.5 w-4 h-4 rounded border-[#E4E8F0] text-[#3155FF] focus:ring-[#3155FF]"
          />
          <span className="text-xs text-[#596273] leading-relaxed">
            Tôi đã kiểm tra đầy đủ thông tin Nhà cung cấp, sản phẩm, giá gom cuối cùng ({formatVND(finalUnitPrice)}), phí giao hàng chia sẻ ({formatVND(sharedShipping)}), điều kiện nhận hàng tại Locker, chính sách đổi trả/hoàn tiền và đồng ý xác lập giao dịch điện tử này.
          </span>
        </label>

        <button
          onClick={handlePay}
          disabled={isProcessing || !confirmedRemoteContract}
          className="w-full bg-[#3155FF] hover:bg-[#2444DC] disabled:opacity-50 disabled:cursor-not-allowed text-white font-black py-4 px-6 rounded-2xl transition shadow-xl shadow-[#3155FF]/25 text-base active:scale-98 flex items-center justify-center space-x-2 cursor-pointer"
        >
          {isProcessing ? (
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Đang khởi tạo Hồ sơ giao dịch & thanh toán mô phỏng...</span>
            </div>
          ) : (
            <>
              <CreditCard className="w-5 h-5" />
              <span>Tôi xác nhận đặt hàng ({formatVND(grandTotal)})</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function OrdersView({
  orders,
  rooms = [],
  pickupPoints = [],
  deliveryBatches = [],
  deliveryEvents = [],
  reviews,
  refunds,
  onOpenReview,
  onOpenRefund,
  onOpenReceipt,
  onOpenSnapshot,
  onOpenComplaint,
  onExplore,
}: {
  orders: Order[];
  rooms?: GroupRoom[];
  pickupPoints?: PickupPoint[];
  deliveryBatches?: DeliveryBatch[];
  deliveryEvents?: DeliveryEvent[];
  reviews: Review[];
  refunds: RefundRequest[];
  onOpenReview: (order: Order) => void;
  onOpenRefund: (order: Order) => void;
  onOpenReceipt: (order: Order) => void;
  onOpenSnapshot?: (order: Order) => void;
  onOpenComplaint?: (order: Order) => void;
  onExplore: () => void;
}) {
  const [selectedOrderForQR, setSelectedOrderForQR] = useState<Order | null>(orders[0] || null);

  useEffect(() => {
    if (orders.length > 0 && !selectedOrderForQR) {
      setSelectedOrderForQR(orders[0]);
    }
  }, [orders, selectedOrderForQR]);

  if (orders.length === 0) {
    return (
      <EmptyState
        icon={Package}
        badge="ĐƠN HÀNG CỦA TÔI"
        title="Chưa có đơn hàng nào"
        description="Hãy tham gia một phòng gom để nhận mức giá tối ưu và mã QR nhận hàng tại điểm Locker nhé!"
        actionLabel="Khám phá phòng gom ngay"
        onAction={onExplore}
      />
    );
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto pb-12">
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2 uppercase">
          <Package className="w-6 h-6 text-blue-600" />
          <span>ĐƠN HÀNG CỦA TÔI & THEO DÕI GIAO HÀNG CHUNG ({orders.length})</span>
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Theo dõi tiến trình vận chuyển lô hàng gom chung, tải Hồ sơ hợp đồng giao dịch và quét mã QR nhận hàng tại điểm nhận
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          {orders.map((ord) => {
            const isSelected = selectedOrderForQR?.id === ord.id;
            const hasReviewed = reviews.some((r) => r.orderId === ord.id);
            const refundReq = refunds.find((r) => r.orderId === ord.id);
            const batch = deliveryBatches.find(
              (b) => b.id === ord.deliveryBatchId || b.roomId === ord.roomId
            );
            const room = rooms.find((r) => r.id === ord.roomId);
            const point = pickupPoints.find(
              (p) =>
                p.id === ord.pickupPointId ||
                p.name === ord.pickupPointName ||
                p.name === ord.pickupPoint
            );

            // Phase 7 Req 21: 6-step visual timeline for "Theo dõi giao hàng chung"
            const batchSt = batch?.status;
            const isPickedUp = ord.status === 'picked_up' || batchSt === 'completed';
            const isArrived =
              isPickedUp ||
              ord.status === 'ready_for_pickup' ||
              ord.status === 'pickup_overdue' ||
              batchSt === 'arrived_at_pickup';
            const isInTransit =
              isArrived || ord.status === 'in_transit' || batchSt === 'in_transit';
            const isHandedOver =
              isInTransit ||
              ord.status === 'preparing' ||
              batchSt === 'picked_up_from_supplier';
            const isConsolidated =
              isHandedOver ||
              Boolean(batch) ||
              batchSt === 'planned' ||
              batchSt === 'confirmed';

            const trackingSteps = [
              { label: 'Phòng gom thành công', done: true },
              { label: 'Đã gom đơn', done: isConsolidated },
              { label: 'Nhà cung cấp bàn giao', done: isHandedOver },
              { label: 'Đang vận chuyển', done: isInTransit },
              { label: 'Đã đến điểm nhận', done: isArrived },
              { label: 'Đã nhận hàng', done: isPickedUp },
            ];

            const batchTimelineEvents = batch
              ? deliveryEvents.filter((e) => e.batchId === batch.id)
              : [];

            return (
              <div
                key={ord.id}
                onClick={() => setSelectedOrderForQR(ord)}
                className={`p-5 rounded-2xl border transition cursor-pointer flex flex-col justify-between space-y-4 ${
                  isSelected
                    ? 'bg-white border-2 border-[#3155FF] shadow-md ring-2 ring-[#3155FF]/15'
                    : 'bg-white border-[#E4E8F0] hover:border-[#3155FF]/30'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[11px] font-mono font-bold text-[#596273] block">
                      {ord.id} {batch ? `• Batch #${batch.id}` : ''}
                    </span>
                    <h4 className="font-bold text-[#0C0D10] text-base">{ord.productName}</h4>
                    <span className="text-xs text-[#596273] font-medium">
                      Số lượng: <strong className="text-[#0C0D10]">{ord.quantity}</strong> ({formatVND(ord.unitPrice)}/sp)
                    </span>
                  </div>
                  <div className="text-right">
                    <span
                      className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase border ${
                        ord.status === 'pickup_overdue' || ord.status === 'cancelled'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : ord.status === 'ready_for_pickup'
                          ? 'bg-[#F5FBD9] text-[#0C0D10] border-[#C7F000]'
                          : ord.status === 'in_transit' || ord.status === 'preparing'
                          ? 'bg-[#EEF1FF] text-[#0C0D10] border-[#3155FF]/30'
                          : ord.status === 'awaiting_payment'
                          ? 'bg-[#F3EEFF] text-[#0C0D10] border-[#7B3FF2]/30'
                          : 'bg-[#C7F000] text-[#0C0D10] border-[#3155FF]/20'
                      }`}
                    >
                      {ord.status}
                    </span>
                    <div className="text-base font-black text-[#0C0D10] mt-1">
                      {formatVND(ord.totalAmount)}
                    </div>
                  </div>
                </div>

                {/* Req 32: Late Pickup Overdue Alert */}
                {ord.status === 'pickup_overdue' && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>Quá thời gian nhận hàng. Vui lòng liên hệ điểm nhận.</span>
                  </div>
                )}

                {/* Phase 7 Req 21 & 50: Theo dõi giao hàng chung (6-step visual timeline) */}
                <div className="bg-[#F6F7FC] rounded-2xl p-4 border border-[#E4E8F0] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-[#0C0D10] flex items-center gap-1.5">
                      <Truck className="w-4 h-4 text-[#3155FF]" />
                      Theo dõi giao hàng chung ({batch?.carrierName || 'Đối tác giao nhận mô phỏng'})
                    </span>
                    <span className="text-[11px] font-bold text-[#3155FF]">
                      Khung giờ nhận: {ord.pickupWindow || batch?.pickupWindow || room?.pickupSlotSnapshot || '26 Oct • 18:00 – 21:00'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 pt-1">
                    {trackingSteps.map((st, idx) => (
                      <div
                        key={idx}
                        className={`p-2 rounded-xl border text-center transition ${
                          st.done
                            ? 'bg-[#EEF1FF] border-[#3155FF]/30 text-[#0C0D10]'
                            : 'bg-white border-[#E4E8F0] text-[#596273]'
                        }`}
                      >
                        <div className="flex items-center justify-center mb-1">
                          {st.done ? (
                            <CheckCircle2 className="w-4 h-4 text-[#3155FF]" />
                          ) : (
                            <Clock className="w-4 h-4 text-slate-300" />
                          )}
                        </div>
                        <div className="text-[10px] font-bold leading-tight">{st.label}</div>
                      </div>
                    ))}
                  </div>

                  {batchTimelineEvents.length > 0 && (
                    <div className="pt-2 border-t border-slate-200/70 space-y-1">
                      <div className="text-[10px] font-bold uppercase text-slate-400">
                        Cập nhật mới nhất ({batch?.carrierName || 'Đối tác giao nhận mô phỏng'}):
                      </div>
                      {batchTimelineEvents.slice(-2).map((ev) => (
                        <div
                          key={ev.id}
                          className="text-[11px] text-slate-600 flex items-center justify-between gap-2"
                        >
                          <span className="font-semibold text-slate-800">• {ev.title}</span>
                          <span className="text-[10px] text-slate-400 shrink-0">
                            {new Date(ev.createdAt).toLocaleTimeString('vi-VN', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Req 30: Cách nhận hàng instructions */}
                <div className="bg-[#F5FBD9]/50 rounded-xl p-3 border border-emerald-100 text-[11px] text-slate-600">
                  <div className="font-bold text-slate-800 mb-0.5">
                    Cách nhận hàng tại {ord.pickupPointName || ord.pickupPoint}:
                  </div>
                  <div className="whitespace-pre-line">
                    {point?.instructions ||
                      `1. Đến ${ord.pickupPointName || ord.pickupPoint}\n2. Đưa mã QR hoặc mã nhận hàng (${ord.pickupCode})\n3. Kiểm tra sản phẩm`}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-[#0C0D10]" />
                    <span className="font-semibold text-slate-700">
                      {ord.pickupPointName || ord.pickupPoint}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenReceipt(ord);
                      }}
                      className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[#F5FBD9] text-[#0C0D10] hover:bg-[#C7F000]/40 border border-[#C7F000] transition flex items-center space-x-1"
                    >
                      <Receipt className="w-3.5 h-3.5" />
                      <span>Chi tiết thanh toán</span>
                    </button>

                    {/* Phase 8 Req 6 & 37: Tải hồ sơ giao dịch */}
                    {onOpenSnapshot && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenSnapshot(ord);
                        }}
                        className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[#EEF1FF] text-[#0C0D10] hover:bg-[#F3EEFF] border border-indigo-200 transition flex items-center space-x-1"
                      >
                        <FileCheck className="w-3.5 h-3.5" />
                        <span>Tải hồ sơ giao dịch</span>
                      </button>
                    )}

                    {/* Phase 8 Req 8: Khiếu nại button */}
                    {onOpenComplaint && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenComplaint(ord);
                        }}
                        className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200 transition flex items-center space-x-1"
                      >
                        <Scale className="w-3.5 h-3.5" />
                        <span>Khiếu nại</span>
                      </button>
                    )}

                    {ord.status === 'picked_up' && (
                      <button
                        disabled={hasReviewed}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!hasReviewed) onOpenReview(ord);
                        }}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center space-x-1 ${
                          hasReviewed
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            : 'bg-amber-500 text-white hover:bg-amber-600 shadow-sm'
                        }`}
                      >
                        <Star className="w-3 h-3 fill-current" />
                        <span>{hasReviewed ? 'Đã đánh giá' : 'Đánh giá'}</span>
                      </button>
                    )}

                    {ord.status !== 'cancelled' && ord.status !== 'refunded' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!refundReq) onOpenRefund(ord);
                        }}
                        disabled={Boolean(refundReq)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                          refundReq
                            ? 'bg-rose-50 text-rose-700 cursor-not-allowed'
                            : 'border border-slate-200 text-slate-500 hover:text-rose-600 hover:bg-rose-50'
                        }`}
                      >
                        {refundReq ? `Hoàn tiền: ${refundReq.status.toUpperCase()}` : 'Hoàn tiền'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Phase 7 Req 26 & 56: Mobile-friendly Pickup QR & Pickup Code Card */}
        {selectedOrderForQR && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xl text-center space-y-4 h-fit sticky top-24">
            <span className="text-xs uppercase font-extrabold text-[#0C0D10] tracking-wider block">
              THẺ NHẬN HÀNG TẠI LOCKER / ĐIỂM GOM
            </span>

            <div
              title={JSON.stringify({
                orderId: selectedOrderForQR.id,
                pickupCode: selectedOrderForQR.pickupCode,
              })}
              className="w-48 h-48 mx-auto bg-slate-900 p-3 rounded-2xl shadow-inner flex items-center justify-center relative"
            >
              <svg className="w-full h-full text-white" viewBox="0 0 100 100" fill="currentColor">
                <rect x="10" y="10" width="25" height="25" rx="3" fill="#10b981" />
                <rect x="15" y="15" width="15" height="15" rx="2" fill="#0f172a" />
                <rect x="19" y="19" width="7" height="7" fill="#10b981" />

                <rect x="65" y="10" width="25" height="25" rx="3" fill="#10b981" />
                <rect x="70" y="15" width="15" height="15" rx="2" fill="#0f172a" />
                <rect x="74" y="19" width="7" height="7" fill="#10b981" />

                <rect x="10" y="65" width="25" height="25" rx="3" fill="#10b981" />
                <rect x="15" y="70" width="15" height="15" rx="2" fill="#0f172a" />
                <rect x="19" y="74" width="7" height="7" fill="#10b981" />

                <rect x="42" y="15" width="6" height="6" />
                <rect x="52" y="25" width="6" height="6" />
                <rect x="42" y="45" width="16" height="16" rx="2" fill="#10b981" />
                <rect x="70" y="55" width="8" height="8" />
                <rect x="65" y="75" width="10" height="10" />
                <rect x="45" y="75" width="8" height="8" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-slate-950 p-1.5 rounded-lg border border-[#C7F000]/50">
                  <Zap className="w-4 h-4 text-emerald-400 fill-emerald-400" />
                </div>
              </div>
            </div>

            <div className="bg-[#F5FBD9] border border-[#C7F000] p-3 rounded-xl font-mono text-sm font-black text-emerald-900">
              Pickup Code: {selectedOrderForQR.pickupCode}
            </div>

            <div className="text-left text-xs space-y-1.5 pt-2 border-t border-slate-100">
              <div className="text-slate-500">
                Pickup Point:{' '}
                <strong className="text-slate-900">
                  {selectedOrderForQR.pickupPointName || selectedOrderForQR.pickupPoint}
                </strong>
              </div>
              <div className="text-slate-500">
                Pickup Time:{' '}
                <strong className="text-[#0C0D10]">
                  {selectedOrderForQR.pickupWindow || '26 Oct • 18:00 – 21:00'}
                </strong>
              </div>
              <div className="text-slate-500">
                Delivery Status:{' '}
                <strong className="uppercase text-[#0C0D10]">{selectedOrderForQR.status}</strong>
              </div>
              <div className="text-slate-500">
                Mã đơn: <strong className="text-slate-800">{selectedOrderForQR.id}</strong>
              </div>
              <div className="text-slate-500">Địa chỉ: {selectedOrderForQR.pickupAddress}</div>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => onOpenReceipt(selectedOrderForQR)}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center space-x-1.5 transition"
              >
                <Receipt className="w-3.5 h-3.5 text-emerald-400" />
                <span>Xem Chi tiết thanh toán</span>
              </button>

              {onOpenSnapshot && (
                <button
                  onClick={() => onOpenSnapshot(selectedOrderForQR)}
                  className="w-full py-2.5 rounded-xl bg-[#3155FF] hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center space-x-1.5 transition"
                >
                  <FileCheck className="w-3.5 h-3.5" />
                  <span>Tải hồ sơ giao dịch (Hợp đồng)</span>
                </button>
              )}
            </div>

            <p className="text-[11px] text-emerald-800 font-semibold bg-[#F5FBD9] p-2 rounded-xl">
              Quét mã QR hoặc nhập Pickup Code tại điểm nhận để xác thực nhận hàng!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function MyRoomsView({
  rooms,
  participations,
  orders,
  currentUserId,
  onSelectRoom,
  onGoCheckout,
  onExplore,
  getSecondsLeft,
}: {
  rooms: GroupRoom[];
  participations: GroupParticipation[];
  orders: Order[];
  currentUserId: string;
  onSelectRoom: (id: string) => void;
  onGoCheckout: (id: string) => void;
  onExplore: () => void;
  getSecondsLeft: (endAt: string) => number;
}) {
  const [tab, setTab] = useState<'active' | 'waiting' | 'ready_checkout' | 'completed'>('active');

  const myParticipations = useMemo(() => {
    return participations.filter((p) => p.userId === currentUserId && p.status !== 'cancelled');
  }, [participations, currentUserId]);

  const joinedItems = useMemo(() => {
    return myParticipations
      .map((part) => {
        const room = rooms.find((r) => r.id === part.roomId);
        if (!room) return null;
        return { room, part };
      })
      .filter((item): item is { room: GroupRoom; part: GroupParticipation } => item !== null);
  }, [myParticipations, rooms]);

  const activeItems = joinedItems.filter(
    (item) => item.room.status === 'active' && item.part.status !== 'paid'
  );

  const waitingItems = joinedItems.filter(
    (item) =>
      item.part.status !== 'paid' &&
      (item.room.status === 'full' || (item.room.status === 'active' && item.room.finalPrice === undefined))
  );

  const readyCheckoutItems = joinedItems.filter(
    (item) =>
      item.room.status === 'successful' &&
      item.room.finalPrice !== undefined &&
      item.part.status !== 'paid'
  );

  const completedItems = joinedItems.filter((item) => item.part.status === 'paid');

  const currentList =
    tab === 'active'
      ? activeItems
      : tab === 'waiting'
      ? waitingItems
      : tab === 'ready_checkout'
      ? readyCheckoutItems
      : completedItems;

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2 uppercase">
            <Users className="w-6 h-6 text-blue-600" />
            <span>PHÒNG GOM CỦA TÔI</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Quản lý tiến độ gom, trạng thái chốt giá và thanh toán các phòng bạn đang tham gia
          </p>
        </div>

        <div className="flex bg-white p-1 rounded-xl border border-slate-200 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setTab('active')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition ${
              tab === 'active' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Đang tham gia ({activeItems.length})
          </button>
          <button
            onClick={() => setTab('waiting')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition ${
              tab === 'waiting' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Chờ chốt giá ({waitingItems.length})
          </button>
          <button
            onClick={() => setTab('ready_checkout')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition ${
              tab === 'ready_checkout' ? 'bg-[#3155FF] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sẵn sàng thanh toán ({readyCheckoutItems.length})
          </button>
          <button
            onClick={() => setTab('completed')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition ${
              tab === 'completed' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Đã hoàn tất ({completedItems.length})
          </button>
        </div>
      </div>

      {currentList.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          badge="PHÒNG CỦA TÔI"
          title="Không có phòng gom nào trong danh mục này"
          description="Hãy khám phá các deal lân cận để tham gia mở khóa mức giá ưu đãi nhóm!"
          actionLabel="Khám phá phòng ngay"
          onAction={onExplore}
        />
      ) : (
        <div className="space-y-4">
          {currentList.map(({ room, part }) => {
            const secondsLeft = getSecondsLeft(room.endAt);
            const currentPrice = room.finalPrice ?? getCurrentPrice(room.totalQuantity, room.priceTiers);
            const savings = room.initialPrice - currentPrice;
            const percentFilled = Math.min(100, Math.round((room.totalQuantity / room.maxQuantity) * 100));
            const isCanCheckout = canCheckout(room, part);

            return (
              <div
                key={room.id}
                onClick={() => onSelectRoom(room.id)}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition cursor-pointer flex flex-col sm:flex-row items-center justify-between gap-6"
              >
                <div className="flex items-center space-x-4 w-full sm:w-auto">
                  <div className="w-16 h-16 rounded-2xl bg-slate-100 overflow-hidden shrink-0">
                    <img src={room.productImage} alt={room.productName} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-bold text-slate-900 text-base">{room.productName}</h4>
                      <StatusBadge status={room.status} size="sm" />
                    </div>
                    <div className="text-xs text-slate-500 flex items-center space-x-2 mt-0.5">
                      <span>Bạn đã gom: <strong>{part.quantity} {room.unit}</strong></span>
                      <span>•</span>
                      <span>{room.pickupPoint}</span>
                    </div>
                    <div className="mt-2 text-xs font-bold text-[#0C0D10] bg-[#F5FBD9] px-2.5 py-0.5 rounded-lg inline-block">
                      Đã giảm: {formatVND(savings)}/{room.unit}
                    </div>
                  </div>
                </div>

                <div className="w-full sm:w-80 space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-600">
                      {room.participantCount} người • {room.totalQuantity}/{room.maxQuantity} {room.unit}
                    </span>
                    <span className="text-slate-900 font-mono">
                      {room.status === 'successful'
                        ? 'ĐÃ CHỐT GIÁ'
                        : room.status !== 'active' || secondsLeft <= 0
                        ? 'ĐÃ ĐÓNG'
                        : `Còn: ${formatTime(secondsLeft)}`}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${percentFilled}%` }} />
                  </div>
                  <div className="flex justify-between items-baseline pt-1">
                    <span className="text-xs text-slate-400">
                      {room.finalPrice !== undefined ? 'Giá chốt:' : 'Giá hiện tại:'}
                    </span>
                    <span className="text-lg font-black text-slate-900">{formatVND(currentPrice)}</span>
                  </div>

                  {isCanCheckout && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onGoCheckout(room.id);
                      }}
                      className="w-full mt-2 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition shadow flex items-center justify-center space-x-1"
                    >
                      <span>Thanh toán ngay ({formatVND(currentPrice * part.quantity)})</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function FlashMapView({
  rooms,
  pickupPoints = [],
  onSelectRoom,
}: {
  rooms: GroupRoom[];
  pickupPoints?: PickupPoint[];
  onSelectRoom: (id: string) => void;
}) {
  return (
    <InteractiveFlashMap
      rooms={rooms}
      pickupPoints={pickupPoints}
      onSelectRoom={onSelectRoom}
    />
  );
}