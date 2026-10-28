import React, { useState, useEffect } from 'react';
import { CheckCircle2, AlertTriangle, RefreshCw, X, ShieldCheck, Sparkles, Database, Wifi } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in font-sans">
      <div className="bg-[#FFFCF8] rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-[#EADFE4] text-xs space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#EADFE4] pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#F2E8F0] text-[#68415F] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[#A15C78]" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-[#A15C78] tracking-widest block">
                ADMIN DEMO SUITE (PHASE 11)
              </span>
              <h3 className="text-base font-black text-[#211A22]">
                Kiểm Tra & Chuẩn Bị Demo Kịch Bản
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#756871] hover:text-[#211A22] p-1 rounded-xl cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Checklist */}
        <div className="space-y-2.5">
          <span className="text-[10px] font-black uppercase text-[#756871] tracking-wider block">
            DEMO READINESS CHECKLIST (8 TIÊU CHÍ)
          </span>
          <div className="space-y-2">
            {checklist.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-2xl bg-white border border-[#EADFE4] flex items-start justify-between gap-3 shadow-2xs"
              >
                <div className="space-y-0.5">
                  <div className="font-bold text-[#211A22] text-xs">{item.title}</div>
                  <div className="text-[11px] text-[#756871]">{item.detail}</div>
                </div>
                <div className="shrink-0 pt-0.5">
                  {item.status === 'ready' && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      SẴN SÀNG
                    </span>
                  )}
                  {item.status === 'fallback' && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-black text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                      LOCAL DEMO
                    </span>
                  )}
                  {item.status === 'needs_reset' && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-black text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
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
        <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EADFE4] space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-black text-[#211A22] text-xs uppercase flex items-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5 text-[#68415F]" />
              Kịch bản kích hoạt nấc giá mới (19/20)
            </span>
            <span className="text-[10px] bg-[#68415F] text-white px-2 py-0.5 rounded-md font-black">
              19 → 20 LƯỢT
            </span>
          </div>
          <p className="text-[11px] text-[#756871] leading-relaxed">
            Đặt lại phòng gom "Dâu Tây Đà Lạt" về trạng thái 19/20 người. Khi người mua tiếp theo bấm tham gia, hệ thống sẽ mở khóa nấc giá <strong>99.000đ → 89.000đ</strong> và hiển thị modal pháo hoa ăn mừng!
          </p>

          {!showConfirmReset ? (
            <button
              type="button"
              onClick={() => setShowConfirmReset(true)}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#68415F] to-[#A15C78] hover:from-[#3A2438] hover:to-[#68415F] text-white font-black text-xs transition shadow-md shadow-[#68415F]/20 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
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
