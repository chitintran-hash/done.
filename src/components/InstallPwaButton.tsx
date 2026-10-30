import React, { useState, useEffect } from 'react';
import { Smartphone } from 'lucide-react';

export const InstallPwaButton: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState<boolean>(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setIsInstallable(false);
      setDeferredPrompt(null);
      console.log('[FlashGroup PWA] Application successfully installed');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`[FlashGroup PWA] User response to install prompt: ${outcome}`);
    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  if (!isInstallable) return null;

  return (
    <button
      type="button"
      onClick={handleInstallClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#3155FF] hover:bg-[#3155FF] text-white font-black text-xs transition shadow-xs cursor-pointer active:scale-95 ${className}`}
      title="Cài đặt ứng dụng FlashGroup lên thiết bị của bạn"
    >
      <Smartphone className="w-3.5 h-3.5 text-[#C7F000]" />
      <span>CÀI FLASHGROUP</span>
    </button>
  );
};
