import { Metadata } from 'next';
import PolicyLayout from '@/components/PolicyLayout';
import { Truck, MapPin, DollarSign, Clock, PackageCheck, AlertTriangle, ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Chính Sách Giao Hàng | Cupfy',
  description: 'Chính sách vận chuyển, phí giao hàng toàn quốc 30.000đ và quy trình giao nhận ly tại Cupfy.space.',
};

export default function ShippingPolicyPage() {
  return (
    <PolicyLayout
      title="Chính Sách Giao Hàng"
      subtitle="Quy định về phạm vi giao hàng, cước phí cố định 30.000đ toàn quốc, thời gian xử lý và hướng dẫn kiểm tra hàng khi nhận từ đối tác vận chuyển của Cupfy."
      effectiveDate="20/10/2026"
      currentSlug="shipping"
    >
      {/* 4.1 */}
      <section className="space-y-3">
        <h2 className="text-lg md:text-xl font-bold text-[#3A211E] flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-[#FFF3C4] text-[#3A211E] inline-flex items-center justify-center text-xs font-black shrink-0">4.1</span>
          Phạm vi giao hàng
        </h2>
        <p className="text-[#4A3E3D]">
          Cupfy cung cấp dịch vụ giao hàng đến các địa chỉ nhận hàng hợp lệ trên phạm vi toàn quốc, tùy thuộc vào khả năng phục vụ của đơn vị vận chuyển.
        </p>
        <p className="text-[#4A3E3D]">
          Khách hàng có trách nhiệm cung cấp đầy đủ thông tin người nhận, số điện thoại và địa chỉ giao hàng để Cupfy có thể xử lý đơn hàng chính xác.
        </p>
        <p className="text-[#4A3E3D]">
          Đối với những khu vực mà đơn vị vận chuyển chưa hỗ trợ, Cupfy sẽ thông báo và trao đổi với khách hàng để tìm phương án phù hợp.
        </p>
      </section>

      {/* 4.2 */}
      <section className="space-y-3 pt-4 border-t border-[#E8DFD8]">
        <h2 className="text-lg md:text-xl font-bold text-[#3A211E] flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-[#FFF3C4] text-[#3A211E] inline-flex items-center justify-center text-xs font-black shrink-0">4.2</span>
          Phí giao hàng
        </h2>
        <div className="p-4 bg-[#FFF3C4]/60 rounded-2xl border border-[#E8DFD8] flex items-center justify-between">
          <div>
            <div className="font-bold text-[#3A211E] text-base">Cước phí giao hàng toàn quốc: 30.000 VNĐ</div>
            <p className="text-xs text-[#765B52] mt-0.5">Áp dụng cố định cho toàn bộ đơn hàng (không tính theo từng chiếc ly)</p>
          </div>
          <span className="px-3 py-1 rounded-full bg-[#3A211E] text-white text-xs font-bold shrink-0">
            Cố định 30.000đ
          </span>
        </div>
        <p className="text-[#4A3E3D]">
          Cupfy áp dụng mức phí giao hàng dự kiến là <strong>30.000 đồng</strong> cho mỗi đơn hàng trên toàn quốc.
        </p>
        <p className="text-[#4A3E3D]">
          Phí giao hàng được hiển thị trong phần tóm tắt đơn hàng trước khi khách hàng xác nhận thanh toán.
        </p>
        <p className="text-[#4A3E3D]">
          Mức phí này được tính cho toàn bộ đơn hàng, không áp dụng riêng cho từng sản phẩm.
        </p>
        <p className="text-[#4A3E3D]">
          Trường hợp phát sinh điều kiện giao nhận đặc biệt hoặc có thay đổi về chính sách vận chuyển, Cupfy sẽ thông báo mức phí áp dụng trước khi khách hàng xác nhận giao dịch.
        </p>
      </section>

      {/* 4.3 */}
      <section className="space-y-3 pt-4 border-t border-[#E8DFD8]">
        <h2 className="text-lg md:text-xl font-bold text-[#3A211E] flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-[#FFF3C4] text-[#3A211E] inline-flex items-center justify-center text-xs font-black shrink-0">4.3</span>
          Thời gian xử lý đơn hàng
        </h2>
        <p className="text-[#4A3E3D]">
          Sau khi khách hàng hoàn tất đặt hàng, Cupfy tiến hành tiếp nhận và kiểm tra thông tin đơn hàng.
        </p>
        <p className="text-[#4A3E3D]">
          Đối với sản phẩm có sẵn, đơn hàng được chuyển sang giai đoạn chuẩn bị sau khi được xác nhận.
        </p>
        <p className="text-[#4A3E3D]">
          Đối với sản phẩm cá nhân hóa, Cupfy cần kiểm tra nội dung thiết kế, chất lượng hình ảnh và khả năng thực hiện trước khi tiến hành sản xuất.
        </p>
        <p className="text-[#4A3E3D]">
          Thời gian xử lý sản phẩm cá nhân hóa có thể dài hơn sản phẩm thông thường do cần thực hiện thêm công đoạn thiết kế, in ấn hoặc hoàn thiện sản phẩm.
        </p>
        <p className="text-[#4A3E3D]">
          Cupfy sẽ thông báo thời gian xử lý dự kiến khi xác nhận đơn hàng hoặc thông qua kênh hỗ trợ phù hợp.
        </p>
      </section>

      {/* 4.4 */}
      <section className="space-y-3 pt-4 border-t border-[#E8DFD8]">
        <h2 className="text-lg md:text-xl font-bold text-[#3A211E] flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-[#FFF3C4] text-[#3A211E] inline-flex items-center justify-center text-xs font-black shrink-0">4.4</span>
          Thời gian giao hàng
        </h2>
        <p className="text-[#4A3E3D]">
          Thời gian giao hàng phụ thuộc vào địa chỉ nhận hàng, thời điểm hoàn tất sản xuất và năng lực vận chuyển của đơn vị giao nhận.
        </p>
        <p className="text-[#4A3E3D]">
          Đối với sản phẩm có sẵn, thời gian giao hàng dự kiến là từ <strong>2 đến 5 ngày làm việc</strong> sau khi đơn hàng được bàn giao cho đơn vị vận chuyển.
        </p>
        <p className="text-[#4A3E3D]">
          Đối với sản phẩm cá nhân hóa, thời gian sản xuất được tính riêng và sẽ được thông báo tùy theo mức độ phức tạp của thiết kế.
        </p>
        <p className="text-[#4A3E3D]">
          Thời gian trên chỉ mang tính dự kiến và có thể thay đổi do điều kiện thời tiết, ngày lễ, tình trạng vận chuyển hoặc các yếu tố khách quan khác.
        </p>
        <p className="text-[#4A3E3D]">
          Trong trường hợp phát sinh chậm trễ đáng kể, Cupfy sẽ cố gắng thông báo để khách hàng chủ động sắp xếp việc nhận hàng.
        </p>
      </section>

      {/* 4.5 */}
      <section className="space-y-3 pt-4 border-t border-[#E8DFD8]">
        <h2 className="text-lg md:text-xl font-bold text-[#3A211E] flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-[#FFF3C4] text-[#3A211E] inline-flex items-center justify-center text-xs font-black shrink-0">4.5</span>
          Quy trình giao nhận
        </h2>
        <p className="text-[#4A3E3D]">
          Sau khi đơn hàng được xác nhận và hoàn tất khâu chuẩn bị, Cupfy tiến hành đóng gói và bàn giao sản phẩm cho đơn vị vận chuyển.
        </p>
        <p className="text-[#4A3E3D]">
          Đơn hàng được cập nhật qua các trạng thái xử lý phù hợp với hệ thống, bao gồm chờ xác nhận, đã xác nhận, đang giao hàng và đã giao hàng.
        </p>
        <p className="text-[#4A3E3D]">
          Đối với sản phẩm cá nhân hóa, khách hàng có thể được cung cấp thêm thông tin về quá trình kiểm tra thiết kế hoặc sản xuất.
        </p>
        <p className="text-[#4A3E3D]">
          Khách hàng có thể theo dõi trạng thái đơn hàng thông qua tài khoản Cupfy.
        </p>
        <p className="text-[#4A3E3D]">
          Các trạng thái hiển thị phản ánh tiến độ xử lý được cập nhật trên hệ thống và không đồng nghĩa với việc website cung cấp chức năng định vị trực tiếp nhân viên giao hàng.
        </p>
      </section>

      {/* 4.6 */}
      <section className="space-y-3 pt-4 border-t border-[#E8DFD8]">
        <h2 className="text-lg md:text-xl font-bold text-[#3A211E] flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-[#FFF3C4] text-[#3A211E] inline-flex items-center justify-center text-xs font-black shrink-0">4.6</span>
          Thanh toán khi nhận hàng
        </h2>
        <p className="text-[#4A3E3D]">
          Cupfy áp dụng phương thức <strong>thanh toán khi nhận hàng (COD)</strong>.
        </p>
        <p className="text-[#4A3E3D]">
          Khách hàng thanh toán số tiền được xác nhận trong đơn hàng cho nhân viên giao hàng theo quy trình giao nhận.
        </p>
        <p className="text-[#4A3E3D]">
          Số tiền COD bao gồm giá trị sản phẩm và phí giao hàng được thông báo trước khi đặt hàng.
        </p>
        <p className="text-[#4A3E3D]">
          Nếu đơn hàng được điều chỉnh do hủy một hoặc nhiều sản phẩm và yêu cầu hủy đã được Cupfy chấp thuận, tổng tiền COD cần được cập nhật trước khi giao hàng.
        </p>
      </section>

      {/* 4.7 */}
      <section className="space-y-3 pt-4 border-t border-[#E8DFD8]">
        <h2 className="text-lg md:text-xl font-bold text-[#3A211E] flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-[#FFF3C4] text-[#3A211E] inline-flex items-center justify-center text-xs font-black shrink-0">4.7</span>
          Kiểm tra hàng khi nhận
        </h2>
        <p className="text-[#4A3E3D]">
          Khi nhận hàng, khách hàng nên kiểm tra tình trạng bên ngoài của bưu kiện, số lượng sản phẩm và những dấu hiệu hư hỏng có thể quan sát được.
        </p>
        <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200 text-rose-950 text-xs md:text-sm font-medium flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
          <span>
            <strong>Đặc biệt lưu ý với sản phẩm ly thủy tinh:</strong> Khách hàng cần lưu ý tình trạng nứt, vỡ hoặc hư hỏng do va đập trong quá trình vận chuyển. Nếu phát hiện dấu hiệu bất thường, khách hàng nên quay video hoặc chụp ảnh mở hộp và liên hệ ngay Cupfy để được hỗ trợ 100%.
          </span>
        </div>
        <p className="text-[#4A3E3D]">
          Việc mở và kiểm tra hàng trước khi thanh toán phụ thuộc vào chính sách của đơn vị vận chuyển và thỏa thuận giao nhận áp dụng.
        </p>
        <p className="text-[#4A3E3D]">
          Nếu phát hiện dấu hiệu bất thường, khách hàng nên ghi nhận hình ảnh hoặc video và liên hệ Cupfy để được hỗ trợ.
        </p>
      </section>

      {/* 4.8 */}
      <section className="space-y-3 pt-4 border-t border-[#E8DFD8]">
        <h2 className="text-lg md:text-xl font-bold text-[#3A211E] flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-[#FFF3C4] text-[#3A211E] inline-flex items-center justify-center text-xs font-black shrink-0">4.8</span>
          Giao hàng không thành công
        </h2>
        <p className="text-[#4A3E3D]">
          Đơn hàng có thể không được giao thành công khi địa chỉ không chính xác, người nhận không thể liên lạc hoặc khách hàng từ chối nhận hàng.
        </p>
        <p className="text-[#4A3E3D]">
          Trong những trường hợp này, Cupfy có thể phối hợp với đơn vị vận chuyển để liên hệ lại và thống nhất phương án giao nhận phù hợp.
        </p>
        <p className="text-[#4A3E3D]">
          Đối với sản phẩm cá nhân hóa đã hoàn tất sản xuất, việc từ chối nhận hàng có thể phát sinh chi phí và ảnh hưởng đến khả năng xử lý đơn hàng. Các vấn đề liên quan sẽ được xem xét theo điều khoản giao dịch, thỏa thuận với khách hàng và quy định pháp luật.
        </p>
      </section>

      {/* 4.9 */}
      <section className="space-y-3 pt-4 border-t border-[#E8DFD8]">
        <h2 className="text-lg md:text-xl font-bold text-[#3A211E] flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-[#FFF3C4] text-[#3A211E] inline-flex items-center justify-center text-xs font-black shrink-0">4.9</span>
          Trách nhiệm khi hàng hóa bị hư hỏng
        </h2>
        <p className="text-[#4A3E3D]">
          Cupfy có trách nhiệm phối hợp xác minh và xử lý khi sản phẩm bị nứt, vỡ, thất lạc hoặc hư hỏng trong quá trình giao hàng theo phạm vi trách nhiệm của mình.
        </p>
        <p className="text-[#4A3E3D]">
          Khách hàng nên cung cấp mã đơn hàng, hình ảnh sản phẩm và thông tin liên quan để hỗ trợ quá trình kiểm tra.
        </p>
        <p className="text-[#4A3E3D]">
          Nếu xác định sản phẩm bị hư hỏng trước khi đến tay khách hàng hoặc trong quá trình vận chuyển thuộc trách nhiệm của bên bán, Cupfy sẽ áp dụng phương án đổi sản phẩm, giao bổ sung hoặc hoàn tiền phù hợp.
        </p>
      </section>
    </PolicyLayout>
  );
}
