import React, { useState } from 'react';
import {
  GroupRoom,
  User,
  RoomEvent,
  GroupMessage,
  MessageReaction,
  ReactionType,
} from '../types';
import {
  formatVND,
  getSafeFirstName,
  formatRelativeTime,
} from '../utils/pricing';
import {
  Activity,
  MessageCircle,
  Send,
  EyeOff,
  Sparkles,
  Share2,
  UserPlus,
  ShoppingBag,
  CheckCircle2,
  Clock,
} from 'lucide-react';

interface RoomSocialPanelProps {
  room: GroupRoom;
  currentUser: User | null;
  isJoinedBuyer: boolean;
  isRoomSupplier: boolean;
  events: RoomEvent[];
  messages: GroupMessage[];
  reactions: MessageReaction[];
  onSendMessage: (text: string) => void;
  onModerateHideMessage: (messageId: string) => void;
  onToggleReaction: (messageId: string, reaction: ReactionType) => void;
  nowMs: number;
}

const REACTION_OPTIONS: ReactionType[] = ['👍', '🔥', '🎉', '❤️'];

export const RoomSocialPanel: React.FC<RoomSocialPanelProps> = ({
  room,
  currentUser,
  isJoinedBuyer,
  isRoomSupplier,
  events,
  messages,
  reactions,
  onSendMessage,
  onModerateHideMessage,
  onToggleReaction,
  nowMs,
}) => {
  const [messageInput, setMessageInput] = useState<string>('');

  const canModerate = Boolean(
    currentUser && (currentUser.role === 'admin' || isRoomSupplier)
  );

  // Req 18: Prefer joined Buyers, Supplier responsible for room, or Admin; allow authenticated users
  const canSendChat = Boolean(
    currentUser &&
      (isJoinedBuyer || isRoomSupplier || currentUser.role === 'admin' || currentUser.role === 'buyer')
  );

  const handleSubmitChat = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = messageInput.trim();
    if (!trimmed || trimmed.length > 300) return;
    onSendMessage(trimmed);
    setMessageInput('');
  };

  const renderEventContent = (ev: RoomEvent) => {
    const meta = (ev.metadata || {}) as Record<string, any>;
    const firstName = getSafeFirstName(meta.firstName as string);
    const qty = Number(meta.quantity || 1);
    const unit = (meta.unit as string) || room.unit;

    switch (ev.eventType) {
      case 'joined':
        return {
          icon: <UserPlus className="w-3.5 h-3.5 text-[#0C0D10]" />,
          bg: 'bg-[#F5FBD9] border-[#C7F000]',
          text: (
            <span>
              <strong className="text-slate-900">{firstName}</strong> vừa tham gia phòng gom ({qty} {unit})
            </span>
          ),
        };
      case 'quantity_added':
        return {
          icon: <ShoppingBag className="w-3.5 h-3.5 text-blue-600" />,
          bg: 'bg-blue-50 border-blue-200',
          text: (
            <span>
              <strong className="text-slate-900">{firstName || 'Một thành viên'}</strong> vừa mua {qty} {unit}
            </span>
          ),
        };
      case 'price_unlocked':
        return {
          icon: <Sparkles className="w-3.5 h-3.5 text-amber-600" />,
          bg: 'bg-amber-50 border-amber-300',
          text: (
            <span className="font-bold text-amber-950">
              🎉 Phòng vừa mở khóa mức giá {formatVND(Number(meta.newPrice || 0))}
            </span>
          ),
        };
      case 'shared':
        return {
          icon: <Share2 className="w-3.5 h-3.5 text-teal-600" />,
          bg: 'bg-teal-50 border-teal-200',
          text: (
            <span>
              <strong className="text-slate-900">{firstName}</strong> vừa chia sẻ phòng gom
            </span>
          ),
        };
      case 'room_full':
        return {
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-[#0C0D10]" />,
          bg: 'bg-[#F5FBD9] border-[#C7F000]',
          text: (
            <span className="font-bold text-emerald-900">
              🎯 Phòng đã gom đủ số lượng mục tiêu ({room.maxQuantity} {room.unit})!
            </span>
          ),
        };
      case 'room_closed':
      default:
        return {
          icon: <Clock className="w-3.5 h-3.5 text-slate-600" />,
          bg: 'bg-slate-100 border-slate-200',
          text: (
            <span>
              Phòng gom đã kết thúc và chốt giá{' '}
              <strong>{formatVND(Number(meta.finalPrice || room.finalPrice || 0))}</strong>
            </span>
          ),
        };
    }
  };

  return (
    <div id="room-social-section" className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
      {/* ======================================================== */}
      {/* LEFT: GROUP ACTIVITY FEED (Hoạt động phòng gom - Req 11) */}
      {/* ======================================================== */}
      <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 flex flex-col justify-between space-y-4 shadow-sm">
        <div>
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
            <h3 className="text-sm font-black text-slate-900 flex items-center space-x-2">
              <Activity className="w-4 h-4 text-[#0C0D10]" />
              <span>Hoạt động phòng gom</span>
            </h3>
            <span className="inline-flex items-center space-x-1 text-[10px] font-bold text-[#0C0D10] bg-[#F5FBD9] px-2 py-0.5 rounded-full border border-[#C7F000]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              <span>Realtime</span>
            </span>
          </div>

          {events.length === 0 ? (
            <div className="text-center py-10 px-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <Activity className="w-7 h-7 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-500">Chưa có hoạt động trong phòng.</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Khi có thành viên tham gia, mở khóa mức giá mới hoặc chia sẻ phòng, hoạt động sẽ hiển thị tại đây.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
              {events.map((ev) => {
                const info = renderEventContent(ev);
                return (
                  <div
                    key={ev.id}
                    className={`p-3 rounded-xl border text-xs flex items-start space-x-2.5 transition ${info.bg}`}
                  >
                    <div className="mt-0.5 shrink-0">{info.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-slate-700 leading-snug">{info.text}</div>
                      <div className="text-[10px] text-slate-400 font-medium mt-0.5">
                        {formatRelativeTime(ev.createdAt, nowMs)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="text-[11px] text-slate-400 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
          Chỉ hiển thị tên gọi / thông tin ẩn danh nhằm bảo mật quyền riêng tư của thành viên.
        </div>
      </div>

      {/* ======================================================== */}
      {/* RIGHT: LIGHTWEIGHT GROUP CHAT & REACTIONS (Req 15–23)     */}
      {/* ======================================================== */}
      <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 flex flex-col justify-between space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-black text-slate-900 flex items-center space-x-2">
              <MessageCircle className="w-4 h-4 text-[#0C0D10]" />
              <span>Chat phòng gom</span>
              <span className="text-xs font-bold text-slate-400">({messages.length})</span>
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Trao đổi nhanh điểm nhận hàng tại {room.pickupPoint} và rủ nhau đạt bậc giá tiếp theo
            </p>
          </div>
          {canModerate && (
            <span className="text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-lg">
              Quyền kiểm duyệt (Ẩn tin nhắn)
            </span>
          )}
        </div>

        {/* Message List */}
        {messages.length === 0 ? (
          <div className="text-center py-12 px-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200 my-2">
            <MessageCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-600">Chưa có tin nhắn nào.</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Hãy bắt đầu cuộc trò chuyện.</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-80 overflow-y-auto pr-1 py-1">
            {messages.map((msg) => {
              const isMe = currentUser?.id === msg.userId;
              const isHidden = Boolean(msg.deletedAt);
              const firstName = getSafeFirstName(msg.userName);
              const initials = firstName.slice(0, 2).toUpperCase();
              const msgReactions = reactions.filter((r) => r.messageId === msg.id);

              return (
                <div
                  key={msg.id}
                  className={`flex items-start space-x-2.5 ${
                    isMe ? 'flex-row-reverse space-x-reverse' : ''
                  }`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-8 h-8 rounded-xl font-black text-[11px] flex items-center justify-center shrink-0 ${
                      isMe
                        ? 'bg-[#3155FF] text-white'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {initials}
                  </div>

                  {/* Message Bubble + Reactions */}
                  <div className={`max-w-[82%] space-y-1 ${isMe ? 'items-end' : 'items-start'}`}>
                    <div
                      className={`rounded-2xl px-3.5 py-2.5 text-xs border ${
                        isHidden
                          ? 'bg-slate-100 border-slate-200 text-slate-400 italic'
                          : isMe
                          ? 'bg-[#F5FBD9] border-[#C7F000] text-slate-900'
                          : 'bg-slate-50 border-slate-200/80 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3 mb-1">
                        <span className="font-bold text-[11px] text-slate-700">
                          {firstName}
                          {isMe ? ' (Bạn)' : ''}
                        </span>
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] text-slate-400">
                            {formatRelativeTime(msg.createdAt, nowMs)}
                          </span>
                          {!isHidden && canModerate && (
                            <button
                              type="button"
                              onClick={() => onModerateHideMessage(msg.id)}
                              title="Ẩn tin nhắn này"
                              className="text-slate-400 hover:text-rose-600 transition flex items-center space-x-0.5 text-[10px] font-bold"
                            >
                              <EyeOff className="w-3 h-3" />
                              <span>Ẩn</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Safe plain text rendering (Req 18 & 21) */}
                      {isHidden ? (
                        <span>Tin nhắn đã được ẩn.</span>
                      ) : (
                        <p className="whitespace-pre-wrap break-words leading-relaxed">{msg.message}</p>
                      )}
                    </div>

                    {/* Reaction Bar (Req 22) */}
                    {!isHidden && (
                      <div
                        className={`flex flex-wrap items-center gap-1 ${
                          isMe ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        {REACTION_OPTIONS.map((emoji) => {
                          const count = msgReactions.filter((r) => r.reaction === emoji).length;
                          const hasReacted = Boolean(
                            currentUser &&
                              msgReactions.some(
                                (r) => r.reaction === emoji && r.userId === currentUser.id
                              )
                          );

                          return (
                            <button
                              key={emoji}
                              type="button"
                              onClick={() => onToggleReaction(msg.id, emoji)}
                              className={`px-2 py-0.5 rounded-full text-[11px] border transition flex items-center space-x-1 ${
                                hasReacted
                                  ? 'bg-[#F5FBD9] border-emerald-400 text-emerald-900 font-bold'
                                  : count > 0
                                  ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                                  : 'bg-transparent border-transparent text-slate-400 hover:bg-slate-100 hover:border-slate-200 opacity-75 hover:opacity-100'
                              }`}
                            >
                              <span>{emoji}</span>
                              {count > 0 && <span className="text-[10px]">{count}</span>}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Chat Input Form (Req 20) */}
        <form onSubmit={handleSubmitChat} className="pt-2 border-t border-slate-100 space-y-1.5">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              maxLength={300}
              disabled={!canSendChat}
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Nhắn vào phòng gom..."
              className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:border-[#C7F000] focus:bg-white disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!canSendChat || !messageInput.trim()}
              className="px-4 py-2.5 rounded-xl bg-[#3155FF] hover:bg-[#3155FF] text-white disabled:opacity-40 text-white font-bold text-xs flex items-center space-x-1.5 transition shrink-0 shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Gửi</span>
            </button>
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-400 px-1">
            <span>
              {isJoinedBuyer
                ? '✓ Bạn là thành viên trong phòng gom này'
                : 'Mẹo: Tham gia phòng gom để cùng mở khóa mức giá thấp hơn'}
            </span>
            <span>{messageInput.length}/300 ký tự</span>
          </div>
        </form>
      </div>
    </div>
  );
};
