import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Compass, AlertCircle } from 'lucide-react';

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
    <div className="min-h-[60vh] flex items-center justify-center p-6 text-center animate-fade-in">
      <div className="bg-[#FFFCF8] rounded-3xl border border-[#EADFE4] p-8 sm:p-12 max-w-lg w-full shadow-lg space-y-5">
        <div className="w-20 h-20 rounded-3xl bg-[#F2E8F0] text-[#68415F] mx-auto flex items-center justify-center">
          <span className="text-3xl font-black text-[#68415F]">404</span>
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-black uppercase text-[#A15C78] tracking-widest block">
            TRANG KHÔNG TỒN TẠI
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-[#211A22]">
            KHÔNG TÌM THẤY TRANG
          </h2>
          <p className="text-xs text-[#756871] max-w-sm mx-auto leading-relaxed">
            Đường dẫn bạn đang tìm kiếm không tồn tại, đã bị xóa hoặc tạm thời không khả dụng trên hệ thống FlashGroup.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="button"
            onClick={handleHome}
            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#68415F] to-[#A15C78] hover:from-[#3A2438] hover:to-[#68415F] text-white font-black text-xs transition shadow-md shadow-[#68415F]/20 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <Home className="w-4 h-4" />
            <span>VỀ TRANG CHỦ</span>
          </button>

          <button
            type="button"
            onClick={handleMarketplace}
            className="flex-1 py-3 px-4 rounded-xl bg-white hover:bg-[#FAF8F5] text-[#352B32] border border-[#EADFE4] font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Compass className="w-4 h-4 text-[#68415F]" />
            <span>KHÁM PHÁ PHÒNG GOM</span>
          </button>
        </div>
      </div>
    </div>
  );
};
