import React from 'react';
import { MapPin, Building2, Users, ArrowRight } from 'lucide-react';
import { SectionHeader } from './ui/SectionHeader';

interface AreaExplorerSectionProps {
  selectedCity: string;
  selectedArea: string;
  onSelectArea: (city: string, area: string) => void;
}

export const AreaExplorerSection: React.FC<AreaExplorerSectionProps> = ({
  selectedCity,
  selectedArea,
  onSelectArea,
}) => {
  const AREA_CARDS = [
    {
      city: 'TP. Hồ Chí Minh',
      area: 'TP. Thủ Đức',
      label: 'TP. THỦ ĐỨC',
      sublabel: 'Vinhomes Grand Park, Làng Đại học, Khu Công nghệ cao',
      badge: '18 phòng gom',
      icon: '🏙️',
    },
    {
      city: 'TP. Hồ Chí Minh',
      area: 'Quận 1',
      label: 'QUẬN 1 & QUẬN 3',
      sublabel: 'Tòa nhà văn phòng Bến Nghé, Đa Kao, Nguyễn Thị Minh Khai',
      badge: '12 phòng gom',
      icon: '🏢',
    },
    {
      city: 'TP. Hồ Chí Minh',
      area: 'Bình Thạnh',
      label: 'BÌNH THẠNH',
      sublabel: 'Cụm chung cư Landmark Plus, Vinhomes Central Park, Điện Biên Phủ',
      badge: '15 phòng gom',
      icon: '🏘️',
    },
    {
      city: 'TP. Hồ Chí Minh',
      area: 'Quận 7',
      label: 'QUẬN 7 (PHÚ MỸ HƯNG)',
      sublabel: 'Khu đô thị Phú Mỹ Hưng, Happy Valley, Nam Sài Gòn',
      badge: '9 phòng gom',
      icon: '🌴',
    },
    {
      city: 'Hà Nội',
      area: 'Cầu Giấy',
      label: 'CẦU GIẤY (HÀ NỘI)',
      sublabel: 'Cụm văn phòng Duy Tân, Tòa CMC, Dịch Vọng Hậu',
      badge: '14 phòng gom',
      icon: '🏛️',
    },
    {
      city: 'Hà Nội',
      area: 'Hai Bà Trưng',
      label: 'HAI BÀ TRƯNG (HÀ NỘI)',
      sublabel: 'Khu đô thị Times City, Park Hill, Minh Khai',
      badge: '11 phòng gom',
      icon: '🏬',
    },
  ];

  return (
    <section className="space-y-6 pt-4">
      <SectionHeader
        title="KHÁM PHÁ THEO KHU VỰC"
        subtitle="Chọn khu vực dân cư, tòa nhà văn phòng hoặc chung cư gần bạn để xem phòng gom và điểm Smart Locker tương ứng"
        badge="MÔ HÌNH TOÀN ĐÔ THỊ"
        action={
          <span className="text-xs font-bold text-slate-500 bg-white px-3 py-1.5 rounded-full border border-slate-200">
            Dữ liệu demo 2 thành phố
          </span>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {AREA_CARDS.map((item) => {
          const isSelected = selectedArea === item.area;
          return (
            <div
              key={item.area}
              onClick={() => onSelectArea(item.city, item.area)}
              className={`p-5 rounded-3xl border transition-all duration-300 cursor-pointer flex flex-col justify-between group ${
                isSelected
                  ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-500 ring-2 ring-blue-400/20 shadow-md scale-[1.01]'
                  : 'bg-white border-slate-200/80 hover:border-blue-400 hover:shadow-lg'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">{item.icon}</span>
                  <span
                    className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                      isSelected
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                </div>
                <h3 className="font-black text-sm uppercase text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
                  {item.label}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed font-normal">{item.sublabel}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-600 group-hover:text-blue-600 transition-colors">
                <span>{item.city}</span>
                <div className="flex items-center gap-1">
                  <span>{isSelected ? 'Đang chọn' : 'Xem phòng'}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
