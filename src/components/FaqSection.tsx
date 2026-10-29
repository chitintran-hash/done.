import React, { useState } from 'react';
import { SectionHeader } from './ui/SectionHeader';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Phòng gom hoạt động như thế nào khi chưa đủ người?',
      a: 'Nếu phòng gom chưa đạt mốc số lượng cao nhất khi hết thời gian, hệ thống sẽ chốt đơn ở mức giá tương ứng với số lượng thực tế đã gom được. Người mua vẫn được nhận hàng với mức giá nhóm tốt hơn giá bán lẻ.',
    },
    {
      q: 'Tôi nhận hàng tại đâu và có mất thêm phí ship không?',
      a: 'Bạn nhận hàng tại Điểm nhận hàng (Locker thông minh hoặc quầy đối tác KTX/khu dân cư) đã chọn khi tham gia. Phí vận chuyển được chia đều minh bạch cho tất cả người tham gia (thường chỉ 2.000đ – 4.000đ/người) và hiển thị rõ ràng tại bước thanh toán.',
    },
    {
      q: 'Nếu sản phẩm bị hư hỏng hoặc sai quy cách thì xử lý ra sao?',
      a: 'FlashGroup có Trung tâm khiếu nại & tranh chấp trực tuyến theo Luật Bảo vệ quyền lợi người tiêu dùng 2023. Bạn có thể gửi phản ánh kèm hình ảnh/video; đội ngũ hỗ trợ cam kết phản hồi tiếp nhận tối đa trong 03 ngày làm việc để hỗ trợ đổi trả hoặc hoàn tiền.',
    },
    {
      q: 'FlashGroup có phải nền tảng thương mại điện tử thực tế không?',
      a: 'FlashGroup là đồ án nguyên mẫu học thuật (Academic Prototype) nghiên cứu mô hình Hyperlocal Group Buying. Toàn bộ tính năng thanh toán, đổi điểm FlashPoints, voucher và vận chuyển đều được mô phỏng công nghệ, không phát sinh giao dịch tiền thật.',
    },
    {
      q: 'Nhà cung cấp cần những điều kiện gì để mở phòng gom?',
      a: 'Nhà cung cấp cần cung cấp thông tin pháp lý hợp lệ (Mã số thuế, ĐKKD, giấy tờ công bố ATTP nếu kinh doanh thực phẩm). Quản trị viên duyệt hồ sơ trước khi cấp huy hiệu "Đã xác minh" và cho phép mở phòng gom công khai.',
    },
  ];

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="py-12 px-6 sm:px-8 rounded-3xl bg-[#F6F7FB] border border-[#E6E6EE] my-8 shadow-xs">
      <SectionHeader
        badge="GIẢI ĐÁP THẮC MẮC"
        title="CÂU HỎI THƯỜNG GẶP"
        subtitle="Những câu hỏi phổ biến nhất về cơ chế mua gom, thanh toán mô phỏng và điểm nhận hàng tại FlashGroup."
        align="left"
      />

      <div className="max-w-4xl mx-auto space-y-3">
        {faqs.map((f, i) => {
          const isOpen = openIndex === i;
          return (
            <div
              key={i}
              className="bg-white rounded-2xl border border-[#E6E6EE] shadow-xs overflow-hidden transition-all duration-200"
            >
              <button
                type="button"
                onClick={() => toggle(i)}
                className="w-full px-6 py-4.5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-[#EFFBFF]/60 transition-colors"
              >
                <span className="font-extrabold text-[#000181] text-xs sm:text-sm leading-snug">
                  {f.q}
                </span>
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 bg-[#D0FFA4] text-[#000181]' : 'bg-[#FCFCF7] text-[#53536A]'
                  }`}
                >
                  <ChevronDown className="w-4 h-4" />
                </div>
              </button>

              {isOpen && (
                <div className="px-6 pb-5 pt-1 text-xs text-[#53536A] leading-relaxed border-t border-[#E6E6EE]/60 bg-[#FCFCF7]">
                  {f.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
