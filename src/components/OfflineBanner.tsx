import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi, Sparkles, RefreshCw } from 'lucide-react';

export const OfflineBanner: React.FC = () => {
  const [isOffline, setIsOffline] = useState<boolean>(!navigator.onLine);
  const [showReconnected, setShowReconnected] = useState<boolean>(false);
  const [hasUpdate, setHasUpdate] = useState<boolean>(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      setShowReconnected(true);
      const timer = setTimeout(() => {
        setShowReconnected(false);
      }, 3500);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOffline(true);
      setShowReconnected(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Service Worker Update Listener (Requirement 23)
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then((reg) => {
        if (!reg) return;

        if (reg.waiting) {
          setHasUpdate(true);
          setWaitingWorker(reg.waiting);
        }

        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setHasUpdate(true);
                setWaitingWorker(newWorker);
              }
            });
          }
        });
      });
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleUpdateApp = () => {
    if (waitingWorker) {
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });
    }
    window.location.reload();
  };

  if (hasUpdate) {
    return (
      <div className="fixed top-0 left-0 right-0 z-50 bg-[#68415F] text-white py-2 px-4 text-center text-xs font-bold shadow-md flex items-center justify-center gap-3 animate-slide-down border-b border-white/20">
        <Sparkles className="w-3.5 h-3.5 text-[#F3B37A] shrink-0 animate-pulse" />
        <span>CÓ PHIÊN BẢN MỚI — Đã có bản cập nhật giao diện FlashGroup mới nhất.</span>
        <button
          type="button"
          onClick={handleUpdateApp}
          className="bg-[#F3B37A] hover:bg-[#E8957B] text-[#211A22] px-3 py-1 rounded-lg text-[11px] font-black tracking-wider uppercase transition cursor-pointer active:scale-95 shadow-xs"
        >
          CẬP NHẬT
        </button>
      </div>
    );
  }

  if (isOffline) {
    return (
      <div className="fixed top-0 left-0 right-0 z-50 bg-[#352B32] text-white py-2 px-4 text-center text-xs font-bold shadow-md flex items-center justify-center gap-2 animate-slide-down">
        <WifiOff className="w-3.5 h-3.5 text-[#E8957B] shrink-0 animate-pulse" />
        <span>BẠN ĐANG NGOẠI TUYẾN — Dữ liệu mới có thể chưa được cập nhật.</span>
      </div>
    );
  }

  if (showReconnected) {
    return (
      <div className="fixed top-0 left-0 right-0 z-50 bg-emerald-600 text-white py-2 px-4 text-center text-xs font-bold shadow-md flex items-center justify-center gap-2 animate-slide-down">
        <Wifi className="w-3.5 h-3.5 shrink-0" />
        <span>ĐÃ KẾT NỐI LẠI — Dữ liệu đã được đồng bộ trực tuyến.</span>
      </div>
    );
  }

  return null;
};
