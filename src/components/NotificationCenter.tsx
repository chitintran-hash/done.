import React, { useState } from 'react';
import { Notification } from '../types';
import { Bell, CheckCircle2, TrendingDown, Package, Shield, Clock, ArrowRight, Check } from 'lucide-react';

interface NotificationCenterProps {
  notifications: Notification[];
  currentUserId: string;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onSelectItem: (roomId?: string, orderId?: string) => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  currentUserId,
  onMarkAsRead,
  onMarkAllAsRead,
  onSelectItem,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'price' | 'orders' | 'system'>('all');

  const userNotifs = notifications.filter((n) => n.userId === currentUserId);

  const filteredNotifs = userNotifs.filter((n) => {
    if (activeTab === 'unread') return !n.read;
    if (activeTab === 'price') return n.type === 'price_unlock';
    if (activeTab === 'orders')
      return (
        n.type === 'order_update' ||
        n.type === 'payment' ||
        n.type === 'pickup_ready' ||
        n.type === 'refund'
      );
    if (activeTab === 'system') return n.type === 'system' || n.type === 'room_ending' || n.type === 'room_closed';
    return true;
  });

  const getIconForType = (type: Notification['type']) => {
    switch (type) {
      case 'price_unlock':
        return <TrendingDown className="w-5 h-5 text-[#0C0D10]" />;
      case 'pickup_ready':
        return <CheckCircle2 className="w-5 h-5 text-teal-600" />;
      case 'payment':
      case 'order_update':
        return <Package className="w-5 h-5 text-blue-600" />;
      case 'room_ending':
        return <Clock className="w-5 h-5 text-amber-600" />;
      default:
        return <Bell className="w-5 h-5 text-slate-500" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Bell className="w-6 h-6 text-[#0C0D10]" />
            <span>Trung tâm thông báo</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Cập nhật biến động giá nhóm, tiến độ giao hàng và sự kiện hệ thống
          </p>
        </div>

        {userNotifs.some((n) => !n.read) && (
          <button
            onClick={onMarkAllAsRead}
            className="self-start sm:self-auto px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl shadow-sm transition flex items-center space-x-1.5"
          >
            <Check className="w-4 h-4 text-[#0C0D10]" />
            <span>Đánh dấu đã đọc tất cả</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex bg-white p-1 rounded-2xl border border-slate-200 overflow-x-auto scrollbar-none">
        {[
          { id: 'all', label: `Tất cả (${userNotifs.length})` },
          { id: 'unread', label: `Chưa đọc (${userNotifs.filter((n) => !n.read).length})` },
          { id: 'price', label: 'Biến động giá' },
          { id: 'orders', label: 'Đơn hàng & Pickup' },
          { id: 'system', label: 'Hệ thống' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
              activeTab === t.id ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Notification List */}
      {filteredNotifs.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
            <Bell className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-800">Không có thông báo nào trong mục này</h3>
          <p className="text-xs text-slate-400 mt-1">Các thông báo mới sẽ xuất hiện tại đây</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotifs.map((notif) => (
            <div
              key={notif.id}
              onClick={() => {
                onMarkAsRead(notif.id);
                if (notif.roomId || notif.orderId) {
                  onSelectItem(notif.roomId, notif.orderId);
                }
              }}
              className={`p-5 rounded-2xl border transition cursor-pointer flex items-start justify-between gap-4 ${
                !notif.read
                  ? 'bg-[#F5FBD9]/50 border-[#C7F000] shadow-sm'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start space-x-3.5">
                <div className="p-2.5 rounded-xl bg-white border border-slate-100 shadow-sm shrink-0">
                  {getIconForType(notif.type)}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="font-bold text-slate-900 text-sm">{notif.title}</h4>
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{notif.message}</p>
                  <span className="text-[11px] text-slate-400 mt-2 block font-medium">
                    {new Date(notif.createdAt).toLocaleDateString('vi-VN')} •{' '}
                    {new Date(notif.createdAt).toLocaleTimeString('vi-VN', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>

              {(notif.roomId || notif.orderId) && (
                <div className="shrink-0 flex items-center text-xs font-bold text-[#0C0D10] space-x-1 pt-1">
                  <span>Xem chi tiết</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
