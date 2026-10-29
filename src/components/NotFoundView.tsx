import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Compass } from 'lucide-react';

interface NotFoundViewProps {
  onGoHome?: () => void;
  onGoMarketplace?: () => void;
}

export const NotFoundView: React.FC<NotFoundViewProps> = ({ onGoHome, onGoMarketplace }) => {
  const navigate = useNavigate();

  const handleHome = () => {
    if (onGoHome) onGoHome();
    else navigate('/');
  };

  const handleMarketplace = () => {
    if (onGoMarketplace) onGoMarketplace();
    else navigate('/marketplace');
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6 text-center animate-fade-in font-sans">
      <div className="bg-white rounded-3xl border border-[#E6E6EE] p-8 sm:p-12 max-w-lg w-full shadow-lg space-y-5">
        <div className="w-20 h-20 rounded-3xl bg-[#EFFBFF] text-[#006EE9] mx-auto flex items-center justify-center border border-[#83E7FF]/40">
          <span className="text-3xl font-black text-[#006EE9]">404</span>
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-black uppercase text-[#006EE9] tracking-widest block">
            TRANG KHÔNG TỒN TẠI
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-[#000181]">
            KHÔNG TÌM THẤY TRANG
          </h2>
          <p className="text-xs text-[#53536A] max-w-sm mx-auto leading-relaxed">
            Đường dẫn bạn đang tìm kiếm không tồn tại, đã bị xóa hoặc tạm thời không khả dụng trên hệ thống FlashGroup.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="button"
            onClick={handleHome}
            className="flex-1 py-3 px-4 rounded-xl bg-[#006EE9] hover:bg-[#000181] text-white font-black text-xs transition shadow-md shadow-[#006EE9]/20 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <Home className="w-4 h-4" />
            <span>VỀ TRANG CHỦ</span>
          </button>

          <button
            type="button"
            onClick={handleMarketplace}
            className="flex-1 py-3 px-4 rounded-xl bg-transparent hover:bg-[#E8A0FF] text-[#000181] border-[1.5px] border-[#000181] font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Compass className="w-4 h-4 text-[#000181]" />
            <span>KHÁM PHÁ PHÒNG GOM</span>
          </button>
        </div>
      </div>
    </div>
  );
};
