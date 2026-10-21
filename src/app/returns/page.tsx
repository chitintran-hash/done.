import { Metadata } from 'next';
import PolicyLayout from '@/components/PolicyLayout';
import { RotateCcw, CheckCircle2, AlertCircle, Clock, DollarSign, Truck, Sparkles, RefreshCw } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Chính Sách Đổi Trả & Hoàn Tiền | Cupfy',
  description: 'Chính sách đổi trả, hoàn tiền và bảo hành đối với ly thông thường và ly thiết kế cá nhân hóa tại Cupfy.space.',
};

export default function ReturnsPolicyPage() {
  return (
    <PolicyLayout
      title="Chính Sách Đổi Trả Và Hoàn Tiền"
      subtitle="Bảo vệ quyền lợi khách hàng, quy định minh bạch về thời hạn 7 ngày, quy trình đổi trả và hoàn tiền đối với sản phẩm ly thông thường và ly thiết kế cá nhân hóa."
      effectiveDate="20/10/2026"
      currentSlug="returns"
    >
      {/* 5.1 */}
      <section className="space-y-3">
        <h2 className="text-lg md:text-xl font-bold text-[#3A211E] flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-[#FFF3C4] text-[#3A211E] inline-flex items-center justify-center text-xs font-black shrink-0">5.1</span>
          Mục đích và phạm vi áp dụng
        </h2>
        <p className="text-[#4A3E3D]">
          Cupfy xây dựng chính sách đổi trả và hoàn tiền nhằm bảo vệ quyền lợi hợp pháp của khách hàng, đồng thời bảo đảm tính minh bạch trong quá trình kinh doanh sản phẩm ly uống nước.
        </p>
        <p className="text-[#4A3E3D]">
          Chính sách áp dụng đối với những sản phẩm được mua trực tiếp trên website <strong>Cupfy.space</strong>, bao gồm ly thông thường và ly được thiết kế cá nhân hóa theo yêu cầu.
        </p>
        <p className="text-[#4A3E3D]">
          Do đặc điểm sản xuất khác nhau, điều kiện đổi trả đối với sản phẩm thông thường và sản phẩm cá nhân hóa có thể không hoàn toàn giống nhau.
        </p>
      </section>

      {/* 5.2 */}
      <section className="space-y-3 pt-4 border-t border-[#E8DFD8]">
        <h2 className="text-lg md:text-xl font-bold text-[#3A211E] flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-[#FFF3C4] text-[#3A211E] inline-flex items-center justify-center text-xs font-black shrink-0">5.2</span>
          Các trường hợp được hỗ trợ đổi trả
        </h2>
        <p className="text-[#4A3E3D]">
          Cupfy tiếp nhận yêu cầu đổi trả khi sản phẩm được giao không đúng với thông tin đơn hàng đã xác nhận hoặc phát sinh lỗi thuộc trách nhiệm của Cupfy.
        </p>
        <div className="bg-[#FFF9E8] p-4 rounded-2xl border border-[#E8DFD8] space-y-2 text-xs md:text-sm">
          <div className="font-bold text-[#3A211E]">Các trường hợp được tiếp nhận đổi trả bao gồm:</div>
          <ul className="list-disc list-inside space-y-1.5 text-[#4A3E3D]">
            <li>Sản phẩm bị nứt, vỡ, sứt mẻ hoặc hư hỏng khi nhận hàng.</li>
            <li>Giao sai mẫu ly, sai màu sắc, sai dung tích hoặc thiếu số lượng.</li>
            <li>Sản phẩm có lỗi sản xuất ảnh hưởng đến khả năng sử dụng.</li>
            <li>Nội dung cá nhân hóa bị in sai so với thiết kế đã được xác nhận.</li>
            <li>Chất lượng in có lỗi rõ ràng do quá trình sản xuất.</li>
          </ul>
        </div>
        <p className="text-[#4A3E3D]">
          Đối với sản phẩm cá nhân hóa, Cupfy sẽ đối chiếu sản phẩm thực tế với dữ liệu thiết kế được lưu tại thời điểm đặt hàng để xác định nguyên nhân và trách nhiệm xử lý.
        </p>
      </section>

      {/* 5.3 */}
      <section className="space-y-3 pt-4 border-t border-[#E8DFD8]">
        <h2 className="text-lg md:text-xl font-bold text-[#3A211E] flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-[#FFF3C4] text-[#3A211E] inline-flex items-center justify-center text-xs font-black shrink-0">5.3</span>
          Thời hạn yêu cầu đổi trả
        </h2>
        <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-950 text-xs md:text-sm font-medium flex items-center gap-3">
          <Clock className="w-5 h-5 text-emerald-700 shrink-0" />
          <span>
            Khách hàng được khuyến nghị gửi yêu cầu đổi trả <strong>trong vòng 7 ngày</strong> kể từ ngày nhận hàng để Cupfy có thể kiểm tra và xử lý kịp thời nhất.
          </span>
        </div>
        <p className="text-[#4A3E3D]">
          Đối với sản phẩm bị nứt, vỡ hoặc hư hỏng do vận chuyển, khách hàng nên thông báo sớm nhất có thể sau khi nhận hàng và cung cấp hình ảnh hoặc video ghi nhận tình trạng sản phẩm.
        </p>
        <p className="text-[#4A3E3D]">
          Thời hạn tiếp nhận nêu trên không làm hạn chế những quyền khiếu nại, bảo hành hoặc yêu cầu bồi thường mà khách hàng được hưởng theo quy định pháp luật.
        </p>
      </section>

      {/* 5.4 */}
      <section className="space-y-3 pt-4 border-t border-[#E8DFD8]">
        <h2 className="text-lg md:text-xl font-bold text-[#3A211E] flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-[#FFF3C4] text-[#3A211E] inline-flex items-center justify-center text-xs font-black shrink-0">5.4</span>
          Điều kiện đổi trả đối với sản phẩm thông thường
        </h2>
        <p className="text-[#4A3E3D]">
          Đối với ly thông thường không có nội dung cá nhân hóa, Cupfy có thể xem xét yêu cầu đổi trả khi sản phẩm đáp ứng các điều kiện phù hợp với chính sách được công bố và quy định pháp luật.
        </p>
        <p className="text-[#4A3E3D]">
          Sản phẩm cần được bảo quản trong tình trạng phù hợp để kiểm tra, kèm theo thông tin đơn hàng hoặc bằng chứng mua hàng.
        </p>
        <p className="text-[#4A3E3D]">
          Trường hợp khách hàng muốn đổi sản phẩm do thay đổi sở thích cá nhân, Cupfy sẽ xem xét dựa trên tình trạng sản phẩm, thời điểm yêu cầu và điều kiện đổi trả tự nguyện được công bố tại thời điểm mua hàng.
        </p>
        <p className="text-[#4A3E3D]">
          Những trường hợp sản phẩm có lỗi hoặc không đúng mô tả vẫn được giải quyết theo trách nhiệm của bên bán và quy định pháp luật.
        </p>
      </section>

      {/* 5.5 */}
      <section className="space-y-3 pt-4 border-t border-[#E8DFD8]">
        <h2 className="text-lg md:text-xl font-bold text-[#3A211E] flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-[#FFF3C4] text-[#3A211E] inline-flex items-center justify-center text-xs font-black shrink-0">5.5</span>
          Điều kiện đổi trả đối với sản phẩm cá nhân hóa
        </h2>
        <p className="text-[#4A3E3D]">
          Sản phẩm cá nhân hóa được sản xuất dựa trên những lựa chọn riêng của khách hàng như tên, chữ, hình ảnh, logo, màu sắc hoặc bố cục thiết kế.
        </p>
        <p className="text-[#4A3E3D]">
          Vì vậy, Cupfy có thể không chấp nhận yêu cầu đổi trả chỉ vì khách hàng thay đổi sở thích sau khi sản phẩm đã được sản xuất đúng theo thiết kế được xác nhận, trừ trường hợp pháp luật có quy định khác hoặc Cupfy có thỏa thuận hỗ trợ riêng.
        </p>
        <p className="text-[#4A3E3D]">
          Tuy nhiên, Cupfy vẫn có trách nhiệm tiếp nhận và xử lý khi sản phẩm cá nhân hóa có lỗi sản xuất, bị hư hỏng, giao sai sản phẩm hoặc không phù hợp với nội dung thiết kế đã được xác nhận do lỗi của Cupfy hoặc đối tác thực hiện.
        </p>
        <p className="text-[#4A3E3D]">
          Việc sản phẩm được cá nhân hóa không loại trừ các quyền hợp pháp của khách hàng đối với hàng hóa bị lỗi hoặc không phù hợp với giao dịch.
        </p>
      </section>

      {/* 5.6 */}
      <section className="space-y-3 pt-4 border-t border-[#E8DFD8]">
        <h2 className="text-lg md:text-xl font-bold text-[#3A211E] flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-[#FFF3C4] text-[#3A211E] inline-flex items-center justify-center text-xs font-black shrink-0">5.6</span>
          Các trường hợp cần được xác minh thêm
        </h2>
        <p className="text-[#4A3E3D]">
          Cupfy có thể cần kiểm tra thêm đối với những trường hợp hình ảnh do khách hàng tải lên có độ phân giải thấp, nội dung thiết kế nằm ngoài vùng in được hướng dẫn hoặc sản phẩm có sự khác biệt nhỏ do đặc tính kỹ thuật của phương pháp in.
        </p>
        <p className="text-[#4A3E3D]">
          Việc xác định trách nhiệm phải căn cứ vào thông tin đã được cung cấp trước khi đặt hàng, cảnh báo của hệ thống, thiết kế được xác nhận và chất lượng sản phẩm thực tế.
        </p>
        <p className="text-[#4A3E3D]">
          Cupfy không mặc nhiên từ chối trách nhiệm chỉ vì khách hàng đã tải lên hình ảnh hoặc sử dụng công cụ thiết kế trực tuyến.
        </p>
        <p className="text-[#4A3E3D]">
          Nếu hệ thống không cảnh báo rõ giới hạn kỹ thuật hoặc sản phẩm thực tế có lỗi vượt ngoài những khác biệt đã được thông báo, Cupfy sẽ xem xét trách nhiệm của mình và phương án hỗ trợ phù hợp.
        </p>
      </section>

      {/* 5.7 */}
      <section className="space-y-3 pt-4 border-t border-[#E8DFD8]">
        <h2 className="text-lg md:text-xl font-bold text-[#3A211E] flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-[#FFF3C4] text-[#3A211E] inline-flex items-center justify-center text-xs font-black shrink-0">5.7</span>
          Quy trình yêu cầu đổi trả
        </h2>
        <p className="text-[#4A3E3D]">
          Khi cần đổi trả sản phẩm, khách hàng có thể liên hệ Cupfy thông qua kênh hỗ trợ được công bố trên website.
        </p>
        <p className="text-[#4A3E3D]">
          Khách hàng nên cung cấp mã đơn hàng, tên sản phẩm, mô tả vấn đề gặp phải và hình ảnh hoặc video thể hiện tình trạng sản phẩm.
        </p>
        <p className="text-[#4A3E3D]">
          Sau khi tiếp nhận, Cupfy sẽ kiểm tra thông tin đơn hàng, xác minh nguyên nhân và phản hồi về phương án xử lý.
        </p>
        <p className="text-[#4A3E3D]">
          Tùy từng trường hợp, Cupfy có thể yêu cầu khách hàng cung cấp thêm thông tin hoặc gửi lại sản phẩm để kiểm tra. Việc hoàn trả sản phẩm cần được hướng dẫn cụ thể nhằm hạn chế nguy cơ hư hỏng trong quá trình vận chuyển.
        </p>
      </section>

      {/* 5.8 */}
      <section className="space-y-3 pt-4 border-t border-[#E8DFD8]">
        <h2 className="text-lg md:text-xl font-bold text-[#3A211E] flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-[#FFF3C4] text-[#3A211E] inline-flex items-center justify-center text-xs font-black shrink-0">5.8</span>
          Phương án xử lý đổi trả
        </h2>
        <p className="text-[#4A3E3D]">
          Sau khi xác minh, Cupfy có thể áp dụng một trong những phương án phù hợp, bao gồm đổi sản phẩm cùng loại, sản xuất lại sản phẩm cá nhân hóa, giao bổ sung sản phẩm còn thiếu hoặc hoàn lại khoản tiền tương ứng.
        </p>
        <p className="text-[#4A3E3D]">
          Phương án xử lý được xác định dựa trên nguyên nhân phát sinh, tình trạng sản phẩm, khả năng khắc phục và quyền lợi hợp pháp của khách hàng.
        </p>
        <p className="text-[#4A3E3D]">
          Đối với sản phẩm cá nhân hóa bị in sai do lỗi sản xuất, Cupfy ưu tiên trao đổi với khách hàng về việc sản xuất lại đúng thiết kế đã được xác nhận.
        </p>
        <p className="text-[#4A3E3D]">
          Trường hợp không thể cung cấp sản phẩm thay thế phù hợp, Cupfy sẽ xem xét hoàn tiền theo quy định áp dụng.
        </p>
      </section>

      {/* 5.9 */}
      <section className="space-y-3 pt-4 border-t border-[#E8DFD8]">
        <h2 className="text-lg md:text-xl font-bold text-[#3A211E] flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-[#FFF3C4] text-[#3A211E] inline-flex items-center justify-center text-xs font-black shrink-0">5.9</span>
          Chính sách hoàn tiền
        </h2>
        <p className="text-[#4A3E3D]">
          Đối với đơn hàng thanh toán COD, việc hoàn tiền được thực hiện sau khi Cupfy xác minh yêu cầu và thống nhất phương án xử lý với khách hàng.
        </p>
        <p className="text-[#4A3E3D]">
          Hình thức hoàn tiền có thể là chuyển khoản ngân hàng hoặc phương thức hợp pháp khác được hai bên thống nhất.
        </p>
        <p className="text-[#4A3E3D]">
          Thời gian hoàn tiền dự kiến từ <strong>5 đến 7 ngày làm việc</strong> kể từ khi yêu cầu được chấp thuận và Cupfy đã nhận đủ thông tin cần thiết để thực hiện hoàn tiền.
        </p>
        <p className="text-[#4A3E3D]">
          Trong trường hợp việc hoàn tiền phát sinh do lỗi của Cupfy hoặc sản phẩm không phù hợp với giao dịch, chi phí liên quan được xử lý theo trách nhiệm của bên bán và quy định pháp luật.
        </p>
      </section>

      {/* 5.10 */}
      <section className="space-y-3 pt-4 border-t border-[#E8DFD8]">
        <h2 className="text-lg md:text-xl font-bold text-[#3A211E] flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-[#FFF3C4] text-[#3A211E] inline-flex items-center justify-center text-xs font-black shrink-0">5.10</span>
          Chi phí vận chuyển khi đổi trả
        </h2>
        <p className="text-[#4A3E3D]">
          Nếu yêu cầu đổi trả phát sinh do giao sai sản phẩm, lỗi sản xuất hoặc hư hỏng thuộc trách nhiệm của Cupfy, <strong>khách hàng không phải chịu chi phí vận chuyển đổi trả</strong> hợp lý phát sinh từ lỗi đó.
        </p>
        <p className="text-[#4A3E3D]">
          Đối với yêu cầu đổi trả tự nguyện không xuất phát từ lỗi của Cupfy, chi phí vận chuyển sẽ được thông báo và thống nhất với khách hàng trước khi thực hiện.
        </p>
        <p className="text-[#4A3E3D]">
          Cupfy không tự ý thu thêm chi phí chưa được công bố hoặc chưa có cơ sở áp dụng phù hợp.
        </p>
      </section>

      {/* 5.11 */}
      <section className="space-y-3 pt-4 border-t border-[#E8DFD8]">
        <h2 className="text-lg md:text-xl font-bold text-[#3A211E] flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-[#FFF3C4] text-[#3A211E] inline-flex items-center justify-center text-xs font-black shrink-0">5.11</span>
          Hủy đơn hàng trước khi giao
        </h2>
        <p className="text-[#4A3E3D]">
          Khách hàng có thể gửi yêu cầu hủy toàn bộ đơn hàng hoặc một sản phẩm trong đơn hàng thông qua chức năng quản lý đơn hàng nếu hệ thống hỗ trợ.
        </p>
        <p className="text-[#4A3E3D]">
          Đối với sản phẩm thông thường chưa được giao, Cupfy sẽ xem xét yêu cầu dựa trên trạng thái xử lý thực tế.
        </p>
        <p className="text-[#4A3E3D]">
          Đối với sản phẩm cá nhân hóa, khách hàng nên gửi yêu cầu hủy trước khi thiết kế được phê duyệt và đưa vào sản xuất.
        </p>
        <p className="text-[#4A3E3D]">
          Nếu sản phẩm đã bắt đầu sản xuất, Cupfy sẽ thông báo tình trạng thực tế và trao đổi phương án giải quyết phù hợp. Việc xử lý phải bảo đảm các quyền của khách hàng theo quy định pháp luật.
        </p>
        <p className="text-[#4A3E3D]">
          Khi yêu cầu hủy một phần đơn hàng được chấp thuận, Cupfy sẽ cập nhật lại giá trị đơn hàng và tổng số tiền COD cần thanh toán.
        </p>
      </section>

      {/* 5.12 */}
      <section className="space-y-3 pt-4 border-t border-[#E8DFD8]">
        <h2 className="text-lg md:text-xl font-bold text-[#3A211E] flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-[#FFF3C4] text-[#3A211E] inline-flex items-center justify-center text-xs font-black shrink-0">5.12</span>
          Cam kết giải quyết khiếu nại
        </h2>
        <p className="text-[#4A3E3D]">
          Cupfy cam kết tiếp nhận phản hồi của khách hàng một cách minh bạch, tôn trọng và có trách nhiệm.
        </p>
        <p className="text-[#4A3E3D]">
          Mọi yêu cầu đổi trả hoặc hoàn tiền sẽ được xem xét dựa trên thông tin đơn hàng, tình trạng sản phẩm, dữ liệu thiết kế được lưu trữ và các bằng chứng liên quan.
        </p>
        <p className="text-[#4A3E3D]">
          Cupfy ưu tiên giải quyết vấn đề thông qua trao đổi trực tiếp với khách hàng, bảo đảm quyền lợi hợp pháp của các bên và tuân thủ quy định pháp luật Việt Nam.
        </p>
      </section>
    </PolicyLayout>
  );
}
