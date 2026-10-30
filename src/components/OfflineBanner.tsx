import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi, Sparkles, RefreshCw, X } from 'lucide-react';

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

    // Service Worker Update Listener
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

  const [isDismissed, setIsDismissed] = useState<boolean>(false);

  const handleUpdateApp = async () => {
    if ('caches' in window) {
      try {
        const keys = await caches.keys();
        await Promise.all(keys.map((k) => caches.delete(k)));
      } catch (err) {
        console.warn('Cache purge error:', err);
      }
    }
    if (waitingWorker) {
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });
    }
    setTimeout(() => {
      window.location.reload();
    }, 200);
  };

  if (isDismissed) {
    return null;
  }

  if (hasUpdate) {
    return (
      <div className="relative z-50 w-full bg-[#3155FF] text-white py-2 px-4 text-center text-xs font-bold shadow-md flex items-center justify-between gap-3 border-b border-white/20">
        <div className="flex-1 flex items-center justify-center gap-2.5">
          <Sparkles className="w-4 h-4 text-[#3155FF] shrink-0 animate-pulse" />
          <span>CÓ PHIÊN BẢN MỚI — Đã có bản cập nhật giao diện FlashGroup mới nhất.</span>
          <button
            type="button"
            onClick={handleUpdateApp}
            className="ml-2 bg-[#C7F000] hover:bg-[#EEF1FF] text-[#0C0D10] px-3.5 py-1 rounded-lg text-[11px] font-black tracking-wider uppercase transition cursor-pointer active:scale-95 shadow-xs"
          >
            CẬP NHẬT
          </button>
        </div>
        <button
          type="button"
          onClick={() => setIsDismissed(true)}
          className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition cursor-pointer shrink-0"
          title="Đóng thông báo"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  if (isOffline) {
    return (
      <div className="relative z-50 w-full bg-[#3155FF] text-white py-2 px-4 text-center text-xs font-bold shadow-md flex items-center justify-between gap-2 border-b border-white/20">
        <div className="flex-1 flex items-center justify-center gap-2">
          <WifiOff className="w-4 h-4 text-[#3155FF] shrink-0 animate-pulse" />
          <span>BẠN ĐANG NGOẠI TUYẾN — Dữ liệu mới có thể chưa được cập nhật.</span>
        </div>
        <button
          type="button"
          onClick={() => setIsDismissed(true)}
          className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition cursor-pointer shrink-0"
          title="Đóng thông báo"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  if (showReconnected) {
    return (
      <div className="relative z-50 w-full bg-[#C7F000] text-[#0C0D10] py-2 px-4 text-center text-xs font-black shadow-md flex items-center justify-between gap-2 border-b border-[#3155FF]/20">
        <div className="flex-1 flex items-center justify-center gap-2">
          <Wifi className="w-4 h-4 text-[#0C0D10] shrink-0" />
          <span>ĐÃ KẾT NỐI LẠI — Dữ liệu đã được đồng bộ trực tuyến.</span>
        </div>
        <button
          type="button"
          onClick={() => setIsDismissed(true)}
          className="text-[#0C0D10]/70 hover:text-[#0C0D10] p-1 rounded-lg hover:bg-black/5 transition cursor-pointer shrink-0"
          title="Đóng thông báo"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return null;
};
