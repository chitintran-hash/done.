import React, { useState, useRef, useEffect } from 'react';
import { User, Notification } from '../types';
import {
  Zap,
  MapPin,
  Users,
  Package,
  Bell,
  Heart,
  User as UserIcon,
  LogOut,
  ChevronDown,
  HelpCircle,
  ShieldCheck,
  MessageSquare,
  Lock,
  Search,
  Menu,
  X,
  RotateCcw,
  BookOpen,
  FileText,
  PhoneCall,
  LayoutDashboard,
  Boxes,
  Wallet,
  Sparkles,
  Presentation,
} from 'lucide-react';
import { InstallPwaButton } from './InstallPwaButton';

interface NavbarProps {
  currentUser: User | null;
  currentTab: string;
  onNavigate: (tab: any) => void;
  notifications: Notification[];
  onMarkNotificationAsRead: (id: string) => void;
  onMarkAllNotificationsAsRead: () => void;
  onSelectNotificationItem: (roomId?: string, orderId?: string) => void;
  onLogout: () => void;
  onResetDemo: () => void;
  onOpenDemoCheckModal?: () => void;
  onTogglePresentationMode?: () => void;
  isPresentationMode?: boolean;
  onOpenBusinessModel?: () => void;
  joinedRoomsCount: number;
  ordersCount: number;
  favoritesCount: number;
  onOpenSearch?: () => void;
  onOpenLogin?: () => void;
  onOpenRegister?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  currentTab,
  onNavigate,
  notifications,
  onMarkNotificationAsRead,
  onMarkAllNotificationsAsRead,
  onSelectNotificationItem,
  onLogout,
  onResetDemo,
  onOpenDemoCheckModal,
  onTogglePresentationMode,
  isPresentationMode,
  onOpenBusinessModel,
  joinedRoomsCount,
  ordersCount,
  favoritesCount,
  onOpenSearch,
  onOpenLogin,
  onOpenRegister,
}) => {
  // Dropdown States
  const [isNotifOpen, setIsNotifOpen] = useState<boolean>(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState<boolean>(false);
  const [isSupportMenuOpen, setIsSupportMenuOpen] = useState<boolean>(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState<boolean>(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const supportMenuRef = useRef<HTMLDivElement>(null);

  const userNotifications = currentUser ? notifications.filter((n) => n.userId === currentUser.id) : [];
  const unreadCount = userNotifications.filter((n) => !n.read).length;
  const recentNotifications = [...userNotifications]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (supportMenuRef.current && !supportMenuRef.current.contains(event.target as Node)) {
        setIsSupportMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const roleBadgeConfig = currentUser ? {
    buyer: { label: 'BUYER', bg: 'bg-[#F3EEFF]', text: 'text-[#7B3FF2]', border: 'border-[#7B3FF2]/30' },
    supplier: { label: 'SUPPLIER', bg: 'bg-[#F5FBD9]', text: 'text-[#0C0D10]', border: 'border-[#C7F000]' },
    admin: { label: 'ADMIN', bg: 'bg-[#0C0D10]', text: 'text-white', border: 'border-white/20' },
  }[currentUser.role] : { label: 'GUEST', bg: 'bg-[#F6F7FC]', text: 'text-[#596273]', border: 'border-[#E4E8F0]' };

  return (
    <>
      {/* 1. TOP HEADER (Height 72-80px: h-20, Cobalt #3155FF, border #2444DC) */}
      <header className="sticky top-0 z-40 bg-[#3155FF] border-b border-[#2444DC] shadow-md h-20 transition-all text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          {/* LEFT: LOGO (FLASH white + GROUP #C7F000 + Spark #C7F000) */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => onNavigate(!currentUser || currentUser.role === 'buyer' ? 'discovery' : currentUser.role === 'supplier' ? 'dashboard' : 'discovery')}
              className="flex items-center space-x-3 text-left group shrink-0 cursor-pointer"
            >
              <div className="w-11 h-11 rounded-2xl bg-white flex items-center justify-center text-[#3155FF] shadow-md shadow-black/10 group-hover:scale-105 transition-transform duration-200">
                <Zap className="w-6 h-6 fill-[#C7F000] stroke-[#3155FF]" />
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-black tracking-tight text-white block leading-none">
                  FLASH<span className="text-[#C7F000]">GROUP</span>
                </span>
                <span className="block text-[10px] text-white/80 font-bold uppercase tracking-wider mt-0.5">
                  CÀNG ĐÔNG, CÀNG RẺ
                </span>
              </div>
            </button>
          </div>

          {/* CENTER: DESKTOP CLEAN NAVIGATION (ALL UPPERCASE, FONT 700) */}
          <nav className="hidden lg:flex items-center space-x-2">
            {!currentUser || currentUser.role === 'buyer' ? (
              <>
                {/* 1. KHÁM PHÁ */}
                <button
                  onClick={() => onNavigate('discovery')}
                  className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-150 cursor-pointer ${
                    currentTab === 'discovery'
                      ? 'bg-white text-[#3155FF] shadow-xs'
                      : 'text-white/90 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  KHÁM PHÁ
                </button>

                {/* 2. FLASHMAP */}
                <button
                  onClick={() => onNavigate('flashmap')}
                  className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-150 flex items-center space-x-1.5 cursor-pointer ${
                    currentTab === 'flashmap'
                      ? 'bg-white text-[#3155FF] shadow-xs'
                      : 'text-white/90 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <MapPin className={`w-3.5 h-3.5 ${currentTab === 'flashmap' ? 'text-[#3155FF]' : 'text-white/90'}`} />
                  <span>FLASHMAP</span>
                </button>

                {currentUser && (
                  <>
                {/* 3. PHÒNG CỦA TÔI */}
                <button
                  onClick={() => currentUser ? onNavigate('myrooms') : onOpenLogin?.()}
                  className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-150 flex items-center space-x-1.5 cursor-pointer ${
                    currentTab === 'myrooms'
                      ? 'bg-white text-[#3155FF] shadow-xs'
                      : 'text-white/90 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Users className={`w-3.5 h-3.5 ${currentTab === 'myrooms' ? 'text-[#3155FF]' : 'text-white/90'}`} />
                  <span>PHÒNG CỦA TÔI</span>
                  {joinedRoomsCount > 0 && (
                    <span className="bg-[#C7F000] text-[#0C0D10] text-[10px] font-black px-1.5 py-0.2 rounded-full">
                      {joinedRoomsCount}
                    </span>
                  )}
                </button>

                {/* 4. ĐƠN HÀNG */}
                <button
                  onClick={() => currentUser ? onNavigate('orders') : onOpenLogin?.()}
                  className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-150 flex items-center space-x-1.5 cursor-pointer ${
                    currentTab === 'orders'
                      ? 'bg-white text-[#3155FF] shadow-xs'
                      : 'text-white/90 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Package className={`w-3.5 h-3.5 ${currentTab === 'orders' ? 'text-[#3155FF]' : 'text-white/90'}`} />
                  <span>ĐƠN HÀNG</span>
                  {ordersCount > 0 && (
                    <span className="bg-white/20 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                      {ordersCount}
                    </span>
                  )}
                </button>

                </>
                )}
                {/* 5. HỖ TRỢ */}
                <div className="relative" ref={supportMenuRef}>
                  <button
                    onClick={() => setIsSupportMenuOpen((prev) => !prev)}
                    className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-150 flex items-center space-x-1 cursor-pointer ${
                      isSupportMenuOpen
                        ? 'bg-white text-[#3155FF]'
                        : 'text-white/90 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span>HỖ TRỢ</span>
                    <ChevronDown className={`w-3.5 h-3.5 ${isSupportMenuOpen ? 'text-[#3155FF]' : 'text-white/80'}`} />
                  </button>

                  {isSupportMenuOpen && (
                    <div className="absolute left-0 mt-2 w-60 bg-[#FFFFFF] rounded-2xl shadow-xl border border-[#E4E8F0] z-50 overflow-hidden py-1.5 animate-fade-in text-xs font-bold text-[#0C0D10]">
                      <button
                        onClick={() => {
                          onNavigate('help');
                          setIsSupportMenuOpen(false);
                        }}
                        className="w-full px-4 py-2.5 text-left hover:bg-[#EEF1FF] flex items-center space-x-2.5 text-[#0C0D10] transition"
                      >
                        <HelpCircle className="w-4 h-4 text-[#3155FF]" />
                        <span>TRUNG TÂM TRỢ GIÚP</span>
                      </button>

                      <button
                        onClick={() => {
                          onNavigate('complaints');
                          setIsSupportMenuOpen(false);
                        }}
                        className="w-full px-4 py-2.5 text-left hover:bg-[#EEF1FF] flex items-center space-x-2.5 text-[#0C0D10] transition"
                      >
                        <MessageSquare className="w-4 h-4 text-[#7B3FF2]" />
                        <span>KHIẾU NẠI & TRANH CHẤP</span>
                      </button>

                      <button
                        onClick={() => {
                          onNavigate('refund-policy');
                          setIsSupportMenuOpen(false);
                        }}
                        className="w-full px-4 py-2.5 text-left hover:bg-[#EEF1FF] flex items-center space-x-2.5 text-[#0C0D10] transition"
                      >
                        <FileText className="w-4 h-4 text-[#596273]" />
                        <span>ĐỔI TRẢ & HOÀN TIỀN</span>
                      </button>

                      <button
                        onClick={() => {
                          onNavigate('contact');
                          setIsSupportMenuOpen(false);
                        }}
                        className="w-full px-4 py-2.5 text-left hover:bg-[#EEF1FF] flex items-center space-x-2.5 text-[#0C0D10] transition border-t border-[#E4E8F0]"
                      >
                        <PhoneCall className="w-4 h-4 text-[#3155FF]" />
                        <span>LIÊN HỆ</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : currentUser.role === 'supplier' ? (
              <>
                <button
                  onClick={() => onNavigate('dashboard')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition ${
                    currentTab === 'dashboard' ? 'bg-white text-[#3155FF] shadow-xs' : 'text-white/90 hover:bg-white/10'
                  }`}
                >
                  TỔNG QUAN
                </button>
                <button
                  onClick={() => onNavigate('products')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition ${
                    currentTab === 'products' ? 'bg-white text-[#3155FF] shadow-xs' : 'text-white/90 hover:bg-white/10'
                  }`}
                >
                  SẢN PHẨM
                </button>
                <button
                  onClick={() => onNavigate('rooms')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition ${
                    currentTab === 'rooms' ? 'bg-white text-[#3155FF] shadow-xs' : 'text-white/90 hover:bg-white/10'
                  }`}
                >
                  PHÒNG GOM
                </button>
                <button
                  onClick={() => onNavigate('orders')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition ${
                    currentTab === 'orders' ? 'bg-white text-[#3155FF] shadow-xs' : 'text-white/90 hover:bg-white/10'
                  }`}
                >
                  ĐƠN HÀNG
                </button>
                <button
                  onClick={() => onNavigate('earnings')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition ${
                    currentTab === 'earnings' ? 'bg-white text-[#3155FF] shadow-xs' : 'text-white/90 hover:bg-white/10'
                  }`}
                >
                  DOANH THU
                </button>
              </>
            ) : (
              <>
                {/* ADMIN HOMEPAGE & FLASHMAP SHORTCUTS */}
                <button
                  onClick={() => onNavigate('discovery')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer flex items-center gap-1.5 ${
                    currentTab === 'discovery' ? 'bg-white text-[#3155FF] shadow-xs' : 'text-white/90 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span>TRANG CHỦ</span>
                </button>

                <button
                  onClick={() => onNavigate('flashmap')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer flex items-center gap-1.5 ${
                    currentTab === 'flashmap' ? 'bg-white text-[#3155FF] shadow-xs' : 'text-white/90 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>FLASHMAP</span>
                </button>

                <div className="h-4 w-[1px] bg-white/20 mx-1" />

                <button
                  onClick={() => onNavigate('overview')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer ${
                    currentTab === 'overview' ? 'bg-white text-[#3155FF] shadow-xs' : 'text-white/90 hover:bg-white/10'
                  }`}
                >
                  OVERVIEW
                </button>
                <button
                  onClick={() => onNavigate('users')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer ${
                    currentTab === 'users' ? 'bg-white text-[#3155FF] shadow-xs' : 'text-white/90 hover:bg-white/10'
                  }`}
                >
                  USERS
                </button>
                <button
                  onClick={() => onNavigate('suppliers')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer ${
                    currentTab === 'suppliers' ? 'bg-white text-[#3155FF] shadow-xs' : 'text-white/90 hover:bg-white/10'
                  }`}
                >
                  SUPPLIERS
                </button>
                <button
                  onClick={() => onNavigate('finance')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer ${
                    currentTab === 'finance' ? 'bg-white text-[#3155FF] shadow-xs' : 'text-white/90 hover:bg-white/10'
                  }`}
                >
                  FINANCE
                </button>
                <button
                  onClick={() => onNavigate('compliance')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer ${
                    currentTab === 'compliance' ? 'bg-white text-[#3155FF] shadow-xs' : 'text-white/90 hover:bg-white/10'
                  }`}
                >
                  COMPLIANCE
                </button>
              </>
            )}
          </nav>

          {/* RIGHT: SEARCH ICON, NOTIFICATION, USER AVATAR */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Quick Search Button */}
            <button
              onClick={() => {
                if (onOpenSearch) onOpenSearch();
                else onNavigate('flashmap');
              }}
              title="Tìm kiếm phòng gom, điểm nhận..."
              className="p-2.5 rounded-xl text-white hover:bg-white/10 transition cursor-pointer"
            >
              <Search className="w-5 h-5 text-white" />
            </button>

            {/* PWA Install Button */}
            <InstallPwaButton className="hidden md:inline-flex mr-1" />

            {!currentUser ? (
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={onOpenLogin}
                  className="px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider text-white hover:bg-white/10 transition cursor-pointer"
                >
                  Đăng nhập
                </button>
                <button
                  type="button"
                  onClick={onOpenRegister}
                  className="px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider bg-[#C7F000] text-[#0C0D10] hover:bg-[#B6DC00] shadow-sm transition cursor-pointer"
                >
                  Đăng ký
                </button>
              </div>
            ) : (
              <>
              {/* Notification Bell with Badge & Dropdown */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setIsNotifOpen((prev) => !prev)}
                className="relative p-2.5 rounded-xl text-white hover:bg-white/10 transition cursor-pointer"
                title="Thông báo"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#C7F000] text-[#0C0D10] text-[10px] font-black flex items-center justify-center ring-2 ring-[#3155FF]">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#FFFFFF] rounded-2xl shadow-2xl border border-[#E4E8F0] z-50 overflow-hidden animate-fade-in text-[#0C0D10]">
                  <div className="p-3.5 bg-[#F6F7FC] border-b border-[#E4E8F0] flex items-center justify-between">
                    <span className="font-black text-xs uppercase tracking-wider text-[#0C0D10]">
                      THÔNG BÁO ({unreadCount} CHƯA ĐỌC)
                    </span>
                    {unreadCount > 0 && (
                      <button
                        onClick={() => onMarkAllNotificationsAsRead()}
                        className="text-[11px] font-bold text-[#3155FF] hover:underline cursor-pointer"
                      >
                        Đọc tất cả
                      </button>
                    )}
                  </div>

                  <div className="divide-y divide-[#E4E8F0]/60 max-h-80 overflow-y-auto">
                    {recentNotifications.length === 0 ? (
                      <div className="p-6 text-center text-xs text-[#596273]">
                        Không có thông báo mới nào
                      </div>
                    ) : (
                      recentNotifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => {
                            onMarkNotificationAsRead(notif.id);
                            if (notif.roomId || notif.orderId) {
                              onSelectNotificationItem(notif.roomId, notif.orderId);
                            }
                            setIsNotifOpen(false);
                          }}
                          className={`p-3 text-xs transition cursor-pointer hover:bg-[#EEF1FF] flex items-start space-x-2.5 ${
                            !notif.read ? 'bg-[#F3EEFF] font-semibold' : 'text-[#596273]'
                          }`}
                        >
                          <div className="w-2 h-2 rounded-full bg-[#3155FF] shrink-0 mt-1.5 opacity-80" />
                          <div className="flex-1">
                            <h5 className="font-bold text-[#0C0D10] text-xs">{notif.title}</h5>
                            <p className="text-[11px] text-[#596273] line-clamp-2 mt-0.5">{notif.message}</p>
                            <span className="text-[10px] text-[#596273]/70 mt-1 block">
                              {new Date(notif.createdAt).toLocaleTimeString('vi-VN', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="p-2.5 bg-[#F6F7FC] border-t border-[#E4E8F0] text-center">
                    <button
                      onClick={() => {
                        onNavigate('notifications');
                        setIsNotifOpen(false);
                      }}
                      className="text-xs font-bold text-[#3155FF] hover:underline cursor-pointer"
                    >
                      Xem toàn bộ thông báo &rarr;
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Dropdown */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen((prev) => !prev)}
                className="flex items-center space-x-2 p-1.5 rounded-2xl hover:bg-white/10 transition text-left cursor-pointer border border-transparent hover:border-white/20 text-white"
              >
                <div className="w-9 h-9 rounded-xl bg-white text-[#3155FF] font-black flex items-center justify-center text-xs shadow-sm overflow-hidden">
                  {currentUser.avatar ? (
                    <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                  ) : (
                    currentUser.name.slice(0, 2).toUpperCase()
                  )}
                </div>
                <div className="hidden sm:block">
                  <span className="text-xs font-black text-white block leading-tight truncate max-w-[120px]">
                    {currentUser.name}
                  </span>
                  <span className={`inline-block text-[9px] font-black px-1.5 py-0.2 rounded border ${roleBadgeConfig.bg} ${roleBadgeConfig.text} ${roleBadgeConfig.border} mt-0.5`}>
                    {roleBadgeConfig.label}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-white/80" />
              </button>

              {/* Profile Menu Dropdown */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-[#FFFFFF] rounded-2xl shadow-2xl border border-[#E4E8F0] z-50 overflow-hidden py-1.5 animate-fade-in text-xs font-bold text-[#0C0D10]">
                  {/* Header: User Info */}
                  <div className="px-4 py-3 bg-[#F6F7FC] border-b border-[#E4E8F0]">
                    <div className="font-black text-[#0C0D10] text-sm">{currentUser.name}</div>
                    <div className="text-[11px] text-[#596273] font-medium truncate">{currentUser.email}</div>
                    <div className="mt-1.5">
                      <span className={`inline-block text-[10px] font-black px-2 py-0.5 rounded border ${roleBadgeConfig.bg} ${roleBadgeConfig.text} ${roleBadgeConfig.border}`}>
                        {roleBadgeConfig.label}
                      </span>
                    </div>
                  </div>

                  {/* Main Profile Links */}
                  <div className="py-1">
                    {currentUser.role === 'admin' && (
                      <div className="p-2 border-b border-[#E4E8F0] bg-[#EEF1FF]/60 space-y-1 mb-1">
                        <button
                          onClick={() => {
                            onNavigate('discovery');
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full px-3 py-2 rounded-xl text-left bg-white hover:bg-[#3155FF] hover:text-white flex items-center space-x-2 text-xs font-black text-[#3155FF] border border-[#3155FF]/20 transition cursor-pointer"
                        >
                          <Zap className="w-4 h-4 text-[#C7F000] fill-[#C7F000]" />
                          <span>XEM TRANG CHỦ & PHÒNG GOM</span>
                        </button>
                        <button
                          onClick={() => {
                            onNavigate('flashmap');
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full px-3 py-2 rounded-xl text-left bg-white hover:bg-[#3155FF] hover:text-white flex items-center space-x-2 text-xs font-black text-[#3155FF] border border-[#3155FF]/20 transition cursor-pointer"
                        >
                          <MapPin className="w-4 h-4" />
                          <span>XEM BẢN ĐỒ FLASHMAP</span>
                        </button>
                        <button
                          onClick={() => {
                            onNavigate('overview');
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full px-3 py-2 rounded-xl text-left hover:bg-white flex items-center space-x-2 text-xs font-black text-[#0C0D10] transition cursor-pointer"
                        >
                          <LayoutDashboard className="w-4 h-4 text-[#7B3FF2]" />
                          <span>VỀ BẢNG QUẢN TRỊ ADMIN</span>
                        </button>
                      </div>
                    )}

                    <button
                      onClick={() => {
                        onNavigate('profile');
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-[#EEF1FF] flex items-center space-x-2.5 text-[#0C0D10]"
                    >
                      <UserIcon className="w-4 h-4 text-[#596273]" />
                      <span>TÀI KHOẢN CỦA TÔI</span>
                    </button>

                    <button
                      onClick={() => {
                        onNavigate('orders');
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-[#EEF1FF] flex items-center space-x-2.5 text-[#0C0D10]"
                    >
                      <Package className="w-4 h-4 text-[#596273]" />
                      <span>ĐƠN HÀNG ({ordersCount})</span>
                    </button>

                    <button
                      onClick={() => {
                        onNavigate('myrooms');
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-[#EEF1FF] flex items-center space-x-2.5 text-[#0C0D10]"
                    >
                      <Users className="w-4 h-4 text-[#596273]" />
                      <span>PHÒNG CỦA TÔI ({joinedRoomsCount})</span>
                    </button>

                    <button
                      onClick={() => {
                        onNavigate('favorites');
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-[#EEF1FF] flex items-center space-x-2.5 text-[#0C0D10]"
                    >
                      <Heart className="w-4 h-4 text-[#FF4FA3]" />
                      <span>ĐÃ LƯU ({favoritesCount})</span>
                    </button>

                    <button
                      onClick={() => {
                        onNavigate('complaints');
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-[#EEF1FF] flex items-center space-x-2.5 text-[#0C0D10]"
                    >
                      <MessageSquare className="w-4 h-4 text-[#7B3FF2]" />
                      <span>KHIẾU NẠI & TRANH CHẤP</span>
                    </button>

                    <button
                      onClick={() => {
                        onNavigate('privacy');
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-[#EEF1FF] flex items-center space-x-2.5 text-[#0C0D10]"
                    >
                      <Lock className="w-4 h-4 text-[#3155FF]" />
                      <span>QUYỀN RIÊNG TƯ</span>
                    </button>
                  </div>

                  {/* Divider & Business Model */}
                  <div className="border-t border-[#E4E8F0] py-1">
                    {onOpenBusinessModel && (
                      <button
                        onClick={() => {
                          onOpenBusinessModel();
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-[#EEF1FF] flex items-center space-x-2.5 text-[#3155FF]"
                      >
                        <HelpCircle className="w-4 h-4 text-[#3155FF]" />
                        <span>MÔ HÌNH FLASHGROUP</span>
                      </button>
                    )}

                    {/* Phase 12: Presentation Mode Toggle */}
                    {onTogglePresentationMode && (
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          onTogglePresentationMode();
                        }}
                        title="Bật/tắt Bảng điều khiển trình bày kịch bản Demo"
                        className="w-full px-4 py-1.5 text-left hover:bg-[#EEF1FF] flex items-center space-x-2 text-[11px] font-black text-[#0C0D10] hover:text-[#3155FF]"
                      >
                        <Presentation className="w-3.5 h-3.5 text-[#7B3FF2]" />
                        <span>{isPresentationMode ? 'Ẩn Bảng Trình Bày' : 'CHẾ ĐỘ TRÌNH BÀY'}</span>
                      </button>
                    )}

                    {/* Developer Discreet Reset Demo & Scenario Check */}
                    {onOpenDemoCheckModal && (
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          onOpenDemoCheckModal();
                        }}
                        title="Kiểm tra kịch bản & độ sẵn sàng Demo"
                        className="w-full px-4 py-1.5 text-left hover:bg-[#EEF1FF] flex items-center space-x-2 text-[11px] font-semibold text-[#3155FF] hover:text-[#0C0D10]"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-[#3155FF]" />
                        <span>Kịch bản Demo (19/20 Dâu Đà Lạt)</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onResetDemo();
                      }}
                      title="Khôi phục trạng thái dữ liệu demo"
                      className="w-full px-4 py-1.5 text-left hover:bg-[#EEF1FF] flex items-center space-x-2 text-[11px] font-semibold text-[#596273] hover:text-[#0C0D10]"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Khôi phục dữ liệu Demo</span>
                    </button>
                  </div>

                  {/* Divider & Logout */}
                  <div className="border-t border-[#E4E8F0] pt-1">
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onLogout();
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-rose-50 text-rose-600 font-black flex items-center space-x-2"
                    >
                      <LogOut className="w-4 h-4 text-rose-500" />
                      <span>ĐĂNG XUẤT</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

              </>
            )}
            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsMobileDrawerOpen(true)}
              className="lg:hidden p-2 rounded-xl text-white hover:bg-white/10 transition cursor-pointer"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. MOBILE DRAWER SLIDE-OVER */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            onClick={() => setIsMobileDrawerOpen(false)}
            className="fixed inset-0 bg-[#0C0D10]/50 backdrop-blur-xs transition-opacity"
          />

          {/* Drawer Menu */}
          <div className="fixed top-0 right-0 bottom-0 w-80 bg-[#F6F7FC] shadow-2xl p-6 flex flex-col justify-between overflow-y-auto animate-fade-in border-l border-[#E4E8F0]">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#E4E8F0]">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#3155FF] flex items-center justify-center text-[#C7F000]">
                    <Zap className="w-5 h-5 fill-[#C7F000] stroke-[#3155FF]" />
                  </div>
                  <span className="font-black text-lg text-[#0C0D10]">
                    FLASH<span className="text-[#3155FF]">GROUP</span>
                  </span>
                </div>
                <button
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="p-1 rounded-lg text-[#596273] hover:text-[#0C0D10]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Items */}
              <nav className="space-y-1.5 font-bold text-xs uppercase tracking-wider text-[#0C0D10]">
                <button
                  onClick={() => {
                    onNavigate('discovery');
                    setIsMobileDrawerOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl transition ${
                    currentTab === 'discovery' ? 'bg-[#3155FF] text-white font-black' : 'hover:bg-[#EEF1FF]'
                  }`}
                >
                  KHÁM PHÁ
                </button>

                <button
                  onClick={() => {
                    onNavigate('flashmap');
                    setIsMobileDrawerOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl transition flex items-center space-x-2 ${
                    currentTab === 'flashmap' ? 'bg-[#3155FF] text-white font-black' : 'hover:bg-[#EEF1FF]'
                  }`}
                >
                  <MapPin className="w-4 h-4 text-[#3155FF]" />
                  <span>FLASHMAP BẢN ĐỒ</span>
                </button>

                <button
                  onClick={() => {
                    onNavigate('myrooms');
                    setIsMobileDrawerOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl transition flex items-center justify-between ${
                    currentTab === 'myrooms' ? 'bg-[#3155FF] text-white font-black' : 'hover:bg-[#EEF1FF]'
                  }`}
                >
                  <span>PHÒNG CỦA TÔI</span>
                  {joinedRoomsCount > 0 && (
                    <span className="bg-[#C7F000] text-[#0C0D10] text-[10px] px-2 py-0.5 rounded-full font-black">
                      {joinedRoomsCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => {
                    onNavigate('orders');
                    setIsMobileDrawerOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl transition flex items-center justify-between ${
                    currentTab === 'orders' ? 'bg-[#3155FF] text-white font-black' : 'hover:bg-[#EEF1FF]'
                  }`}
                >
                  <span>ĐƠN HÀNG</span>
                  {ordersCount > 0 && (
                    <span className="bg-[#E4E8F0] text-[#0C0D10] text-[10px] px-2 py-0.5 rounded-full">
                      {ordersCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => {
                    onNavigate('favorites');
                    setIsMobileDrawerOpen(false);
                  }}
                  className="w-full text-left px-3.5 py-2.5 rounded-xl hover:bg-[#EEF1FF] transition"
                >
                  ĐÃ LƯU ({favoritesCount})
                </button>

                <button
                  onClick={() => {
                    onNavigate('complaints');
                    setIsMobileDrawerOpen(false);
                  }}
                  className="w-full text-left px-3.5 py-2.5 rounded-xl hover:bg-[#EEF1FF] transition"
                >
                  KHIẾU NẠI & TRANH CHẤP
                </button>

                <button
                  onClick={() => {
                    onNavigate('privacy');
                    setIsMobileDrawerOpen(false);
                  }}
                  className="w-full text-left px-3.5 py-2.5 rounded-xl hover:bg-[#EEF1FF] transition text-[#3155FF]"
                >
                  TRUNG TÂM QUYỀN RIÊNG TƯ
                </button>

                {currentUser?.role === 'admin' && (
                  <div className="pt-2 border-t border-[#E4E8F0] space-y-1">
                    <div className="text-[10px] font-black text-[#596273] px-3.5 py-1 uppercase">Bảng Quản Trị Hệ Thống</div>
                    <button
                      onClick={() => {
                        onNavigate('overview');
                        setIsMobileDrawerOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2.5 rounded-xl transition ${
                        currentTab === 'overview' ? 'bg-[#3155FF] text-white font-black' : 'hover:bg-[#EEF1FF]'
                      }`}
                    >
                      TỔNG QUAN QUẢN TRỊ
                    </button>
                    <button
                      onClick={() => {
                        onNavigate('users');
                        setIsMobileDrawerOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2.5 rounded-xl transition ${
                        currentTab === 'users' ? 'bg-[#3155FF] text-white font-black' : 'hover:bg-[#EEF1FF]'
                      }`}
                    >
                      QUẢN LÝ NGƯỜI DÙNG
                    </button>
                    <button
                      onClick={() => {
                        onNavigate('suppliers');
                        setIsMobileDrawerOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2.5 rounded-xl transition ${
                        currentTab === 'suppliers' ? 'bg-[#3155FF] text-white font-black' : 'hover:bg-[#EEF1FF]'
                      }`}
                    >
                      DUYỆT NHÀ CUNG CẤP
                    </button>
                  </div>
                )}
              </nav>
            </div>

            <div className="pt-4 border-t border-[#E4E8F0] space-y-3">
              <button
                onClick={() => {
                  setIsMobileDrawerOpen(false);
                  onLogout();
                }}
                className="w-full py-2.5 bg-rose-50 text-rose-600 font-black text-xs uppercase tracking-wider rounded-xl transition text-center"
              >
                ĐĂNG XUẤT
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. MOBILE BOTTOM NAVIGATION */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FFFFFF] border-t border-[#E4E8F0] py-1 px-2 shadow-2xl flex items-center justify-around">
        {/* 1. KHÁM PHÁ */}
        <button
          onClick={() => onNavigate('discovery')}
          className={`flex flex-col items-center py-1 px-2 rounded-xl transition cursor-pointer relative ${
            currentTab === 'discovery' ? 'text-[#3155FF] font-black' : 'text-[#596273] font-medium'
          }`}
        >
          <Zap className={`w-5 h-5 ${currentTab === 'discovery' ? 'fill-[#3155FF]' : ''}`} />
          <span className="text-[10px] mt-0.5 tracking-tight uppercase">KHÁM PHÁ</span>
          {currentTab === 'discovery' && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#C7F000] ring-2 ring-[#3155FF] mt-0.5" />
          )}
        </button>

        {/* 2. FLASHMAP */}
        <button
          onClick={() => onNavigate('flashmap')}
          className={`flex flex-col items-center py-1 px-2 rounded-xl transition cursor-pointer relative ${
            currentTab === 'flashmap' ? 'text-[#3155FF] font-black' : 'text-[#596273] font-medium'
          }`}
        >
          <MapPin className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 tracking-tight uppercase">FLASHMAP</span>
          {currentTab === 'flashmap' && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#C7F000] ring-2 ring-[#3155FF] mt-0.5" />
          )}
        </button>

        {/* 3. PHÒNG */}
        <button
          onClick={() => onNavigate('myrooms')}
          className={`flex flex-col items-center py-1 px-2 rounded-xl transition cursor-pointer relative ${
            currentTab === 'myrooms' ? 'text-[#3155FF] font-black' : 'text-[#596273] font-medium'
          }`}
        >
          <Users className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 tracking-tight uppercase">PHÒNG</span>
          {joinedRoomsCount > 0 && (
            <span className="absolute top-0 right-1 w-2 h-2 rounded-full bg-[#C7F000] ring-1 ring-[#3155FF]"></span>
          )}
          {currentTab === 'myrooms' && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#C7F000] ring-2 ring-[#3155FF] mt-0.5" />
          )}
        </button>

        {/* 4. ĐƠN HÀNG */}
        <button
          onClick={() => onNavigate('orders')}
          className={`flex flex-col items-center py-1 px-2 rounded-xl transition cursor-pointer relative ${
            currentTab === 'orders' ? 'text-[#3155FF] font-black' : 'text-[#596273] font-medium'
          }`}
        >
          <Package className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 tracking-tight uppercase">ĐƠN HÀNG</span>
          {ordersCount > 0 && (
            <span className="absolute top-0 right-1 w-2 h-2 rounded-full bg-[#3155FF] ring-1 ring-white"></span>
          )}
          {currentTab === 'orders' && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#C7F000] ring-2 ring-[#3155FF] mt-0.5" />
          )}
        </button>

        {/* 5. TÀI KHOẢN */}
        <button
          onClick={() => currentUser ? onNavigate('profile') : onOpenLogin?.()}
          className={`flex flex-col items-center py-1 px-2 rounded-xl transition cursor-pointer relative ${
            currentTab === 'profile' ? 'text-[#3155FF] font-black' : 'text-[#596273] font-medium'
          }`}
        >
          <UserIcon className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 tracking-tight uppercase">TÀI KHOẢN</span>
          {currentTab === 'profile' && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#C7F000] ring-2 ring-[#3155FF] mt-0.5" />
          )}
        </button>
      </nav>
    </>
  );
};
