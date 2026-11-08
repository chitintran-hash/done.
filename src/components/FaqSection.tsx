import React, { useState } from 'react';
import { SectionHeader } from './ui/SectionHeader';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Tại sao nên chọn FlashGroup thay vì các sàn thương mại điện tử hiện có?',
      a: 'FlashGroup không hướng đến việc rẻ hơn mọi sàn thương mại điện tử trong mọi trường hợp. FlashGroup tạo giá trị khi nhiều người trong cùng một khu vực (KTX, chung cư, văn phòng) có cùng nhu cầu về các sản phẩm như nông sản tươi, thực phẩm, hàng tiêu dùng theo mùa hoặc sản phẩm từ nguồn cung trực tiếp. Khi đó, nhà cung cấp có thể chiết khấu khi đơn hàng xử lý theo lô và gom toàn bộ đơn vào 1 chuyến giao duy nhất về Smart Locker / Điểm nhận, giúp người mua chia sẻ chi phí giao nhận (chỉ 2.000đ – 4.000đ/người thay vì 20.000đ – 35.000đ khi giao riêng lẻ). Nếu một kênh khác có tổng chi phí thấp hơn hoặc cần giao gấp từng món lẻ, người mua hoàn toàn có thể lựa chọn kênh phù hợp hơn.',
    },
    {
      q: 'FlashGroup phù hợp khi nào và khi nào không nên dùng?',
      a: 'FlashGroup phù hợp nhất khi: (1) Nhiều người ở gần nhau cần cùng một sản phẩm, (2) Nhà cung cấp có khả năng giảm giá theo số lượng, (3) Có thể giao theo nhóm đến điểm nhận thuận tiện và (4) Tổng chi phí mua chung thấp hơn hoặc hợp lý hơn mua riêng lẻ. Ngược lại, không nên dùng FlashGroup nếu giá bán lẻ trên thị trường đã rẻ hơn, hoặc đơn hàng cần giao gấp riêng biệt trong 1–2 giờ mà việc gom đơn không tạo thêm lợi ích về giá hay giao nhận.',
    },
    {
      q: 'Vì sao Nhà cung cấp có thể giảm giá khi số lượng tăng?',
      a: 'Khi tổng số lượng tăng, nhà cung cấp có thể xử lý đơn theo lô, giảm chi phí xử lý trên mỗi đơn và tối ưu hóa vận chuyển một chuyến thay vì đóng gói phân tán. Phần tiết kiệm chi phí vận hành này có thể được chuyển thành các mức giá mua chung thấp hơn theo từng bậc số lượng do chính nhà cung cấp thiết lập.',
    },
    {
      q: 'Phòng gom hoạt động như thế nào khi chưa đủ số lượng mục tiêu cao nhất?',
      a: 'Nếu phòng gom chưa đạt mốc số lượng cao nhất khi hết thời gian, hệ thống sẽ chốt đơn ở mức giá tương ứng với bậc số lượng cao nhất mà nhóm đã thực tế đạt được (highest unlocked tier). Người mua được quyền xem màn hình xác nhận giá cuối cùng và lựa chọn: [Tiếp tục thanh toán] hoặc [Không tiếp tục] mà không bị trừ tiền tự động hay mất phí.',
    },
    {
      q: 'Tôi nhận hàng tại đâu và cước giao được tính như thế nào?',
      a: 'Bạn nhận hàng tại Điểm nhận hàng (Locker thông minh hoặc quầy đối tác KTX/khu dân cư) đã chọn khi tham gia. Phí vận chuyển được chia đều minh bạch cho tất cả người tham gia (thường chỉ 2.000đ – 4.000đ/người) và hiển thị rõ ràng tại bước thanh toán. Tổng thanh toán = Giá sản phẩm theo bậc + Phí giao chia sẻ.',
    },
    {
      q: 'Nếu sản phẩm bị hư hỏng hoặc sai quy cách thì xử lý ra sao?',
      a: 'FlashGroup có Trung tâm khiếu nại & tranh chấp trực tuyến theo Luật Bảo vệ quyền lợi người tiêu dùng 2023. Bạn có thể gửi phản ánh kèm hình ảnh/video; đội ngũ hỗ trợ cam kết phản hồi tiếp nhận tối đa trong 03 ngày làm việc để hỗ trợ đổi trả hoặc hoàn tiền.',
    },
    {
      q: 'FlashGroup có phải nền tảng thương mại điện tử thực tế không?',
      a: 'FlashGroup là đồ án nguyên mẫu học thuật (Academic Prototype) nghiên cứu mô hình Hyperlocal Group Buying. Toàn bộ tính năng thanh toán, đổi điểm FlashPoints, voucher và vận chuyển đều được mô phỏng công nghệ phục vụ nghiên cứu, không phát sinh giao dịch tài chính thật.',
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
    <section className="py-12 px-6 sm:px-8 rounded-3xl bg-[#F6F7FC] border border-[#E4E8F0] my-8 shadow-xs">
      <SectionHeader
        badge="GIẢI ĐÁP THẮC MẮC"
        title="CÂU HỎI THƯỜNG GẶP"
        subtitle="Những câu hỏi phổ biến nhất về định vị mô hình mua chung, tính kinh tế và điểm nhận hàng tại FlashGroup."
        align="left"
      />

      <div className="max-w-4xl mx-auto space-y-3">
        {faqs.map((f, i) => {
          const isOpen = openIndex === i;
          return (
            <div
              key={i}
              className="bg-white rounded-2xl border border-[#E4E8F0] shadow-xs overflow-hidden transition-all duration-200"
            >
              <button
                type="button"
                onClick={() => toggle(i)}
                className="w-full px-6 py-4.5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-[#EEF1FF]/60 transition-colors"
              >
                <span className="font-extrabold text-[#0C0D10] text-xs sm:text-sm leading-snug">
                  {f.q}
                </span>
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 bg-[#C7F000] text-[#0C0D10]' : 'bg-[#F6F7FC] text-[#596273]'
                  }`}
                >
                  <ChevronDown className="w-4 h-4" />
                </div>
              </button>

              {isOpen && (
                <div className="px-6 pb-5 pt-1 text-xs text-[#596273] leading-relaxed border-t border-[#E4E8F0]/60 bg-[#F6F7FC]">
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
