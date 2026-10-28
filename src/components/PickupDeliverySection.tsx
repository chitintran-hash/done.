import React from 'react';
import { SectionHeader } from './ui/SectionHeader';
import { Truck, MapPin, Box, QrCode, ShieldCheck, Clock } from 'lucide-react';

interface PickupDeliverySectionProps {
  onOpenMap?: () => void;
}

export const PickupDeliverySection: React.FC<PickupDeliverySectionProps> = ({ onOpenMap }) => {
  const cards = [
    {
      icon: <Truck className="w-5 h-5 text-blue-600" />,
      title: 'MỘT CHUYẾN GIAO CHUNG DUY NHẤT',
      description:
        'Thay vì mỗi người gọi một shipper riêng lẻ tốn 20.000đ – 30.000đ/đơn, toàn bộ đơn trong phòng gom được gộp vào 1 lô chuyển thẳng từ kho nhà cung cấp.',
      highlight: 'Chia đều cước ship',
    },
    {
      icon: <Box className="w-5 h-5 text-blue-600" />,
      title: 'MẠNG LƯỚI PICKUP POINT & LOCKER',
      description:
        'Tủ Locker thông minh và quầy đại lý đối tác đặt ngay tại sảnh KTX, chung cư hoặc cửa hàng tiện lợi, thuận tiện nhận đồ khi đi học, đi làm về.',
      highlight: 'Locker thông minh',
    },
    {
      icon: <QrCode className="w-5 h-5 text-blue-600" />,
      title: 'MÃ QR & MÃ NHẬN HÀNG RIÊNG TƯ',
      description:
        'Mỗi người mua có mã nhận hàng 6 ký tự và QR code được mã hóa an toàn, không lo thất lạc hay nhầm lẫn sản phẩm.',
      highlight: 'Mã hóa an toàn',
    },
    {
      icon: <Clock className="w-5 h-5 text-blue-600" />,
      title: 'KHUNG GIỜ NHẬN LINH HOẠT 24H',
      description:
        'Hàng được lưu an toàn tại ngăn tủ hoặc điểm nhận tối đa 24 giờ. Người mua chủ động sắp xếp thời gian nhận hàng mà không cần chờ đợi shipper gọi.',
      highlight: 'Chủ động thời gian',
    },
  ];

  return (
    <section className="py-8">
      <SectionHeader
        badge="LOGISTICS SIÊU CỤC BỘ"
        title="ĐIỂM NHẬN HÀNG & GIAO HÀNG CHUNG"
        subtitle="Mô hình giao hàng tập trung theo lô giúp giảm đến 85% chi phí vận chuyển mỗi đơn và bảo vệ môi trường nhờ giảm phát thải xe máy giao hàng lẻ."
        action={
          onOpenMap && (
            <button
              type="button"
              onClick={onOpenMap}
              className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-extrabold text-xs transition cursor-pointer shadow-xs"
            >
              <MapPin className="w-4 h-4 text-cyan-400" />
              <span>Xem FlashMap điểm nhận</span>
            </button>
          )
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {cards.map((c, i) => (
          <div
            key={i}
            className="bg-white rounded-3xl p-6 border border-light-border shadow-xs hover:border-blue-400 hover:shadow-sm transition-all duration-200 flex items-start gap-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200/60 flex items-center justify-center shrink-0">
              {c.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <h4 className="font-extrabold text-brand-dark text-xs sm:text-sm uppercase tracking-tight">
                  {c.title}
                </h4>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-light-blue-accent text-sky-900 border border-sky-200 shrink-0">
                  {c.highlight}
                </span>
              </div>
              <p className="text-xs text-neutral-text font-normal leading-relaxed">
                {c.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
