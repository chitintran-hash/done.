import React, { useState, useEffect } from 'react';
import { CheckCircle2, AlertTriangle, RefreshCw, X, ShieldCheck, Sparkles } from 'lucide-react';
import { GroupRoom, User, PickupPoint } from '../types';
import { demoScenarioService } from '../services/demoScenarioService';

interface DemoCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
  supabaseConnected: boolean;
  realtimeConnected: boolean;
  users: User[];
  rooms: GroupRoom[];
  pickupPoints: PickupPoint[];
  onResetDemo: () => void;
}

export const DemoCheckModal: React.FC<DemoCheckModalProps> = ({
  isOpen,
  onClose,
  supabaseConnected,
  realtimeConnected,
  users,
  rooms,
  pickupPoints,
  onResetDemo,
}) => {
  const [checklist, setChecklist] = useState<any[]>([]);
  const [isResetting, setIsResetting] = useState<boolean>(false);
  const [showConfirmReset, setShowConfirmReset] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      demoScenarioService
        .checkDemoReadiness({
          supabaseConnected,
          realtimeConnected,
          users,
          rooms,
          pickupPoints,
        })
        .then(setChecklist);
    }
  }, [isOpen, supabaseConnected, realtimeConnected, users, rooms, pickupPoints]);

  if (!isOpen) return null;

  const handleExecuteReset = () => {
    setIsResetting(true);
    setTimeout(() => {
      onResetDemo();
      setIsResetting(false);
      setShowConfirmReset(false);
      demoScenarioService
        .checkDemoReadiness({
          supabaseConnected,
          realtimeConnected,
          users,
          rooms,
          pickupPoints,
        })
        .then(setChecklist);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#000181]/60 backdrop-blur-xs animate-fade-in font-sans">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-[#E6E6EE] text-xs space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E6E6EE] pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#EFFBFF] text-[#006EE9] flex items-center justify-center border border-[#83E7FF]/40">
              <Sparkles className="w-5 h-5 text-[#006EE9]" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-[#006EE9] tracking-widest block">
                ADMIN DEMO SUITE (PHASE 11)
              </span>
              <h3 className="text-base font-black text-[#000181]">
                Kiểm Tra & Chuẩn Bị Demo Kịch Bản
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#53536A] hover:text-[#000181] p-1 rounded-xl cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Checklist */}
        <div className="space-y-2.5">
          <span className="text-[10px] font-black uppercase text-[#53536A] tracking-wider block">
            DEMO READINESS CHECKLIST (8 TIÊU CHÍ)
          </span>
          <div className="space-y-2">
            {checklist.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-2xl bg-[#FCFCF7] border border-[#E6E6EE] flex items-start justify-between gap-3 shadow-2xs"
              >
                <div className="space-y-0.5">
                  <div className="font-bold text-[#000181] text-xs">{item.title}</div>
                  <div className="text-[11px] text-[#53536A]">{item.detail}</div>
                </div>
                <div className="shrink-0 pt-0.5">
                  {item.status === 'ready' && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-black text-[#000181] bg-[#D0FFA4] px-2.5 py-0.5 rounded-full border border-[#000181]/20">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#000181]" />
                      SẴN SÀNG
                    </span>
                  )}
                  {item.status === 'fallback' && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-black text-[#000181] bg-[#83E7FF] px-2.5 py-0.5 rounded-full border border-[#006EE9]/30">
                      LOCAL DEMO
                    </span>
                  )}
                  {item.status === 'needs_reset' && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-black text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      CẦN RESET
                    </span>
                  )}
                  {item.status === 'missing' && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-black text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                      CHƯA CÓ
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Demo Reset Action Box */}
        <div className="p-4 rounded-2xl bg-[#F6F7FB] border border-[#E6E6EE] space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-black text-[#000181] text-xs uppercase flex items-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5 text-[#006EE9]" />
              Kịch bản kích hoạt nấc giá mới (19/20)
            </span>
            <span className="text-[10px] bg-[#006EE9] text-white px-2 py-0.5 rounded-md font-black">
              19 → 20 LƯỢT
            </span>
          </div>
          <p className="text-[11px] text-[#53536A] leading-relaxed">
            Đặt lại phòng gom "Dâu Tây Đà Lạt" về trạng thái 19/20 người. Khi người mua tiếp theo bấm tham gia, hệ thống sẽ mở khóa nấc giá <strong>99.000đ → 89.000đ</strong> và hiển thị modal mở khóa giá mới!
          </p>

          {!showConfirmReset ? (
            <button
              type="button"
              onClick={() => setShowConfirmReset(true)}
              className="w-full py-2.5 px-4 rounded-xl bg-[#006EE9] hover:bg-[#000181] text-white font-black text-xs transition shadow-md shadow-[#006EE9]/20 flex items-center justify-center gap-2 cursor-pointer active:scale-95 uppercase tracking-wider"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>RESET KỊCH BẢN DEMO (19/20)</span>
            </button>
          ) : (
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 space-y-2 animate-fade-in">
              <p className="text-[11px] font-bold text-amber-900">
                Xác nhận thiết lập lại kịch bản Demo? (Chỉ ảnh hưởng phòng demo <code>is_demo = true</code>)
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleExecuteReset}
                  disabled={isResetting}
                  className="flex-1 py-2 bg-amber-600 hover:bg-amber-700 text-white font-black text-xs rounded-lg transition"
                >
                  {isResetting ? 'Đang đặt lại...' : 'Đồng ý Reset'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowConfirmReset(false)}
                  className="px-3 py-2 bg-white text-slate-700 font-bold text-xs rounded-lg border border-slate-300"
                >
                  Hủy
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
