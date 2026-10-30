import React from 'react';
import { GroupRoom } from '../types';
import { getCurrentPrice, formatVND, formatTime } from '../utils/pricing';
import { StatusBadge } from './StatusBadge';
import { Heart, MapPin, Clock, ArrowRight, Trash2, ShoppingBag } from 'lucide-react';

interface FavoritesViewProps {
  favoriteRoomIds: string[];
  rooms: GroupRoom[];
  onToggleFavorite: (roomId: string) => void;
  onSelectRoom: (roomId: string) => void;
  onExplore: () => void;
  getSecondsLeft: (endAt: string) => number;
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({
  favoriteRoomIds,
  rooms,
  onToggleFavorite,
  onSelectRoom,
  onExplore,
  getSecondsLeft,
}) => {
  const favoriteRooms = rooms.filter((r) => favoriteRoomIds.includes(r.id));

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-12">
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
          <span>Phòng gom đã lưu ({favoriteRooms.length})</span>
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Danh sách các phòng gom bạn đang theo dõi tiến độ và mức giá
        </p>
      </div>

      {favoriteRooms.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8">
          <div className="w-16 h-16 bg-rose-50 text-rose-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-800">Bạn chưa lưu phòng gom nào</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto mb-6">
            Bấm vào biểu tượng trái tim tại chi tiết phòng để lưu và theo dõi tiến độ gom mở khóa mức giá mới!
          </p>
          <button
            onClick={onExplore}
            className="bg-[#3155FF] hover:bg-emerald-500 text-white font-bold px-6 py-3 rounded-xl text-xs shadow-lg shadow-emerald-600/20"
          >
            Khám phá phòng ngay
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {favoriteRooms.map((room) => {
            const secondsLeft = getSecondsLeft(room.endAt);
            const currentPrice = room.finalPrice ?? getCurrentPrice(room.totalQuantity, room.priceTiers);

            return (
              <div
                key={room.id}
                onClick={() => onSelectRoom(room.id)}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <span className="text-3xl">{room.emoji}</span>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm group-hover:text-[#0C0D10] transition">
                          {room.productName}
                        </h4>
                        <span className="text-xs text-slate-400">{room.unit} • {room.pickupPoint}</span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(room.id);
                      }}
                      className="text-rose-500 hover:text-rose-700 p-1.5 rounded-lg hover:bg-rose-50 transition"
                      title="Bỏ lưu"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center space-x-2 mb-3">
                    <StatusBadge status={room.status} size="sm" />
                    <span className="text-[11px] text-slate-400 flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{room.status === 'active' ? formatTime(secondsLeft) : 'Đã đóng'}</span>
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-400 block">Giá hiện tại:</span>
                    <span className="text-base font-black text-slate-900">{formatVND(currentPrice)}</span>
                  </div>

                  <div className="flex items-center text-xs font-bold text-[#0C0D10] space-x-1">
                    <span>Xem phòng</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
