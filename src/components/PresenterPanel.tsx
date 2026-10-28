import React, { useState } from 'react';
import {
  Presentation,
  UserCheck,
  Building2,
  Shield,
  RotateCcw,
  Sparkles,
  Camera,
  Play,
  X,
  Minimize2,
  Maximize2,
  ChevronRight,
  HelpCircle,
} from 'lucide-react';
import { User } from '../types';

interface PresenterPanelProps {
  currentUser: User | null;
  onSwitchRole: (role: 'buyer' | 'supplier' | 'admin') => void;
  onResetDemo: () => void;
  onOpenChecklist: () => void;
  onStartGuidedDemo: () => void;
  isGuidedDemoActive: boolean;
  isScreenshotMode: boolean;
  onToggleScreenshotMode: () => void;
  onClose?: () => void;
}

export const PresenterPanel: React.FC<PresenterPanelProps> = ({
  currentUser,
  onSwitchRole,
  onResetDemo,
  onOpenChecklist,
  onStartGuidedDemo,
  isGuidedDemoActive,
  isScreenshotMode,
  onToggleScreenshotMode,
  onClose,
}) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  // If in screenshot mode, presenter panel hides itself completely
  if (isScreenshotMode) {
    return (
      <div className="fixed bottom-3 right-3 z-50">
        <button
          type="button"
          onClick={onToggleScreenshotMode}
          className="bg-black/80 hover:bg-black text-white text-[11px] font-bold px-3 py-1.5 rounded-full shadow-lg border border-white/20 flex items-center gap-1.5 transition active:scale-95 cursor-pointer backdrop-blur-md"
          title="Thoát chế độ chụp màn hình"
        >
          <Camera className="w-3.5 h-3.5 text-[#F3B37A]" />
          <span>Thoát Chụp Màn Hình</span>
        </button>
      </div>
    );
  }

  if (isCollapsed) {
    return (
      <div className="fixed bottom-20 md:bottom-6 right-4 z-50 animate-fade-in">
        <button
          type="button"
          onClick={() => setIsCollapsed(false)}
          className="bg-gradient-to-r from-[#3A2438] via-[#68415F] to-[#C77C86] text-white p-3 rounded-2xl shadow-2xl flex items-center gap-2 border border-white/20 hover:scale-105 active:scale-95 transition cursor-pointer"
          title="Mở Bảng Điều Khiển Trình Bày"
        >
          <Presentation className="w-5 h-5 text-[#F3B37A]" />
          <span className="text-xs font-black tracking-wider uppercase hidden sm:inline">
            TRÌNH BÀY DEMO
          </span>
        </button>
      </div>
    );
  }

  return (
    <aside
      aria-label="Presenter Control Panel"
      className="fixed bottom-20 md:bottom-6 right-4 z-50 w-80 sm:w-96 bg-[#211A22]/95 backdrop-blur-md text-[#FFF8F1] rounded-3xl border border-white/15 shadow-2xl overflow-hidden animate-slide-up transition-all font-sans"
    >
      {/* Header */}
      <div className="p-3.5 bg-gradient-to-r from-[#3A2438] to-[#68415F] border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-white/10 text-[#F3B37A]">
            <Presentation className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-white">
              BẢNG ĐIỀU KHIỂN TRÌNH BÀY
            </h4>
            <span className="text-[10px] text-[#F3B37A] font-bold block leading-none">
              VITE_APP_MODE = DEMO
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setIsCollapsed(true)}
            className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition cursor-pointer"
            title="Thu nhỏ bảng"
          >
            <Minimize2 className="w-4 h-4" />
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition cursor-pointer"
              title="Đóng chế độ trình bày"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="p-4 space-y-4 text-xs">
        {/* Current Active Role */}
        <div className="bg-white/5 rounded-2xl p-2.5 border border-white/10 flex items-center justify-between">
          <span className="text-[11px] text-[#CBBFC6] font-semibold">Vai trò đang xem:</span>
          <span className="px-2.5 py-0.5 rounded-full bg-[#68415F] text-[#FFF8F1] font-black uppercase tracking-wider text-[10px] border border-white/20">
            {currentUser?.role?.toUpperCase() || 'CHƯA ĐĂNG NHẬP'}
          </span>
        </div>

        {/* 1. ROLE SWITCHER */}
        <div>
          <label className="text-[10px] font-black uppercase tracking-widest text-[#F3B37A] block mb-2">
            CHUYỂN NHANH VAI TRÒ (DEMO ONLY)
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => onSwitchRole('buyer')}
              className={`p-2 rounded-xl border flex flex-col items-center justify-center gap-1 transition cursor-pointer ${
                currentUser?.role === 'buyer'
                  ? 'bg-gradient-to-b from-[#68415F] to-[#3A2438] border-[#F3B37A] text-white shadow-md'
                  : 'bg-white/5 border-white/10 hover:bg-white/10 text-[#CBBFC6]'
              }`}
            >
              <UserCheck className="w-4 h-4 text-[#F3B37A]" />
              <span className="text-[10px] font-black uppercase">DEMO BUYER</span>
            </button>

            <button
              type="button"
              onClick={() => onSwitchRole('supplier')}
              className={`p-2 rounded-xl border flex flex-col items-center justify-center gap-1 transition cursor-pointer ${
                currentUser?.role === 'supplier'
                  ? 'bg-gradient-to-b from-[#68415F] to-[#3A2438] border-[#F3B37A] text-white shadow-md'
                  : 'bg-white/5 border-white/10 hover:bg-white/10 text-[#CBBFC6]'
              }`}
            >
              <Building2 className="w-4 h-4 text-[#C58B52]" />
              <span className="text-[10px] font-black uppercase">DEMO NCC</span>
            </button>

            <button
              type="button"
              onClick={() => onSwitchRole('admin')}
              className={`p-2 rounded-xl border flex flex-col items-center justify-center gap-1 transition cursor-pointer ${
                currentUser?.role === 'admin'
                  ? 'bg-gradient-to-b from-[#68415F] to-[#3A2438] border-[#F3B37A] text-white shadow-md'
                  : 'bg-white/5 border-white/10 hover:bg-white/10 text-[#CBBFC6]'
              }`}
            >
              <Shield className="w-4 h-4 text-[#E8957B]" />
              <span className="text-[10px] font-black uppercase">DEMO ADMIN</span>
            </button>
          </div>
        </div>

        {/* 2. DEMO ACTIONS */}
        <div className="space-y-2 pt-1 border-t border-white/10">
          <button
            type="button"
            onClick={onStartGuidedDemo}
            className={`w-full py-2.5 px-3.5 rounded-xl font-black text-xs flex items-center justify-between transition cursor-pointer ${
              isGuidedDemoActive
                ? 'bg-[#F3B37A] text-[#211A22] shadow-md'
                : 'bg-gradient-to-r from-[#68415F] to-[#C77C86] hover:from-[#3A2438] hover:to-[#68415F] text-white'
            }`}
          >
            <span className="flex items-center gap-2">
              <Play className="w-4 h-4 fill-current" />
              <span>{isGuidedDemoActive ? 'ĐANG CHẠY HƯỚNG DẪN DEMO' : 'BẮT ĐẦU KỊCH BẢN DEMO'}</span>
            </span>
            <ChevronRight className="w-4 h-4" />
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={onResetDemo}
              className="py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-[#FFF8F1] font-bold text-[11px] flex items-center justify-center gap-1.5 transition cursor-pointer border border-white/10"
              title="Khôi phục trạng thái chuẩn: Phòng Dâu 19/20 người"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#F3B37A]" />
              <span>RESET DEMO</span>
            </button>

            <button
              type="button"
              onClick={onOpenChecklist}
              className="py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-[#FFF8F1] font-bold text-[11px] flex items-center justify-center gap-1.5 transition cursor-pointer border border-white/10"
              title="Kiểm tra độ sẵn sàng của 7 thành phần hệ thống"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#E8957B]" />
              <span>KIỂM TRA HỆ THỐNG</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onToggleScreenshotMode}
            className="w-full py-1.5 px-3 rounded-xl bg-transparent hover:bg-white/5 text-[#CBBFC6] hover:text-white font-bold text-[10px] flex items-center justify-center gap-1.5 transition cursor-pointer border border-dashed border-white/20"
          >
            <Camera className="w-3 h-3 text-[#F3B37A]" />
            <span>CHẾ ĐỘ CHỤP MÀN HÌNH (ẨN DEBUG / PANEL)</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
