import { Metadata } from 'next';
import PolicyLayout from '@/components/PolicyLayout';
import { FileText, AlertCircle, Sparkles, Scale, DollarSign, XCircle, ShoppingBag } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Điều Khoản Sử Dụng | Cupfy',
  description: 'Điều khoản và điều kiện giao dịch mua bán, sử dụng công cụ thiết kế ly cá nhân hóa trên Cupfy.space.',
};

export default function TermsOfUsePage() {
  return (
    <PolicyLayout
      title="Điều Khoản Sử Dụng"
      subtitle="Quy định quyền và nghĩa vụ của khách hàng khi truy cập, đăng ký tài khoản, sử dụng công cụ thiết kế và thực hiện giao dịch mua hàng trên website Cupfy.space."
      effectiveDate="20/10/2026"
      currentSlug="terms"
    >
      {/* 2.1 */}
      <section className="space-y-3">
        <h2 className="text-lg md:text-xl font-bold text-[#3A211E] flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-[#FFF3A6] text-[#4A2A25] inline-flex items-center justify-center text-xs font-black shrink-0">2.1</span>
          Phạm vi áp dụng
        </h2>
        <p className="text-[#4A3E3D]">
          Điều khoản sử dụng quy định quyền và nghĩa vụ của khách hàng khi truy cập, đăng ký tài khoản, sử dụng công cụ thiết kế và thực hiện giao dịch mua hàng trên website <strong>Cupfy.space</strong>.
        </p>
        <p className="text-[#4A3E3D]">
          Cupfy là website thương mại điện tử kinh doanh trực tiếp các sản phẩm ly uống nước, tập trung vào ly thủy tinh, ly nhựa và những sản phẩm có thể cá nhân hóa theo nhu cầu của khách hàng.
        </p>
        <p className="text-[#4A3E3D]">
          Website cung cấp công cụ thiết kế trực tuyến nhằm hỗ trợ người dùng bổ sung chữ, hình ảnh, họa tiết và các thành phần trang trí lên sản phẩm trước khi đặt mua.
        </p>
        <p className="text-[#4A3E3D]">
          Việc sử dụng website đồng nghĩa với việc khách hàng có trách nhiệm tuân thủ những điều khoản được công bố và các quy định pháp luật có liên quan.
        </p>
      </section>

      {/* 2.2 */}
      <section className="space-y-3 pt-4 border-t border-[#DDD8D2]">
        <h2 className="text-lg md:text-xl font-bold text-[#3A211E] flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-[#FFF3A6] text-[#4A2A25] inline-flex items-center justify-center text-xs font-black shrink-0">2.2</span>
          Đăng ký và quản lý tài khoản
        </h2>
        <p className="text-[#4A3E3D]">
          Khách hàng cần đăng ký hoặc đăng nhập tài khoản để hoàn tất giao dịch mua hàng trên Cupfy.
        </p>
        <p className="text-[#4A3E3D]">
          Khi đăng ký, khách hàng có trách nhiệm cung cấp thông tin chính xác, đầy đủ và cập nhật khi có thay đổi. Khách hàng phải tự bảo vệ thông tin đăng nhập và không chia sẻ mật khẩu cho người khác.
        </p>
        <p className="text-[#4A3E3D]">
          Mọi hoạt động phát sinh từ tài khoản cần được khách hàng kiểm tra và quản lý. Trường hợp phát hiện dấu hiệu truy cập trái phép, khách hàng nên thông báo cho Cupfy để được hỗ trợ.
        </p>
        <p className="text-[#4A3E3D]">
          Cupfy có quyền áp dụng các biện pháp hạn chế hoặc tạm ngừng tài khoản khi phát hiện hành vi gian lận, xâm nhập trái phép hoặc vi phạm nghiêm trọng điều khoản sử dụng, phù hợp với quy định pháp luật.
        </p>
      </section>

      {/* 2.3 */}
      <section className="space-y-3 pt-4 border-t border-[#DDD8D2]">
        <h2 className="text-lg md:text-xl font-bold text-[#3A211E] flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-[#FFF3A6] text-[#4A2A25] inline-flex items-center justify-center text-xs font-black shrink-0">2.3</span>
          Thông tin sản phẩm
        </h2>
        <p className="text-[#4A3E3D]">
          Cupfy cung cấp thông tin về tên sản phẩm, hình ảnh, chất liệu, dung tích, giá bán và các lựa chọn cá nhân hóa nhằm hỗ trợ khách hàng đưa ra quyết định mua sắm.
        </p>
        <p className="text-[#4A3E3D]">
          Hình ảnh sản phẩm trên website có tính chất minh họa cho kiểu dáng và đặc điểm sản phẩm. Màu sắc thực tế có thể có sự khác biệt nhất định do điều kiện ánh sáng, thiết bị hiển thị và đặc tính vật liệu.
        </p>
        <p className="text-[#4A3E3D]">
          Đối với sản phẩm cá nhân hóa, hình ảnh xem trước giúp khách hàng hình dung bố cục thiết kế. Tuy nhiên, mức độ chính xác còn phụ thuộc vào chất lượng dữ liệu tải lên, phương pháp in và giới hạn kỹ thuật của từng loại ly.
        </p>
        <p className="text-[#4A3E3D]">
          Cupfy có trách nhiệm cung cấp thông tin trung thực về sản phẩm và thông báo cho khách hàng nếu thiết kế không đáp ứng điều kiện sản xuất.
        </p>
      </section>

      {/* 2.4 */}
      <section className="space-y-3 pt-4 border-t border-[#DDD8D2]">
        <h2 className="text-lg md:text-xl font-bold text-[#3A211E] flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-[#FFF3A6] text-[#4A2A25] inline-flex items-center justify-center text-xs font-black shrink-0">2.4</span>
          Quy định về thiết kế cá nhân hóa
        </h2>
        <p className="text-[#4A3E3D]">
          Khách hàng có thể sử dụng công cụ thiết kế Cupfy để bổ sung nội dung văn bản, hình ảnh, logo và các yếu tố trang trí phù hợp với khả năng hỗ trợ của hệ thống.
        </p>
        <p className="text-[#4A3E3D]">
          Khách hàng chịu trách nhiệm đối với nội dung do mình cung cấp, bao gồm quyền sử dụng hình ảnh, nhãn hiệu và các tài sản trí tuệ có liên quan.
        </p>
        <p className="text-[#4A3E3D]">
          Khách hàng không được tải lên hoặc yêu cầu sản xuất những nội dung vi phạm pháp luật, xâm phạm quyền sở hữu trí tuệ hoặc quyền và lợi ích hợp pháp của tổ chức, cá nhân khác.
        </p>
        <p className="text-[#4A3E3D]">
          Cupfy có quyền từ chối thực hiện thiết kế có dấu hiệu vi phạm pháp luật hoặc vượt quá khả năng sản xuất. Trong trường hợp đó, Cupfy sẽ thông báo để khách hàng điều chỉnh hoặc xử lý đơn hàng theo chính sách áp dụng.
        </p>
      </section>

      {/* 2.5 */}
      <section className="space-y-3 pt-4 border-t border-[#DDD8D2]">
        <h2 className="text-lg md:text-xl font-bold text-[#3A211E] flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-[#FFF3A6] text-[#4A2A25] inline-flex items-center justify-center text-xs font-black shrink-0">2.5</span>
          Đặt hàng và xác nhận đơn hàng
        </h2>
        <p className="text-[#4A3E3D]">
          Khách hàng cần kiểm tra đầy đủ sản phẩm, số lượng, thông tin cá nhân hóa, địa chỉ nhận hàng và tổng thanh toán trước khi xác nhận đặt hàng.
        </p>
        <p className="text-[#4A3E3D]">
          Sau khi khách hàng gửi yêu cầu đặt hàng, hệ thống sẽ ghi nhận đơn và cung cấp mã đơn hàng để theo dõi.
        </p>
        <p className="text-[#4A3E3D]">
          Việc hệ thống ghi nhận đơn hàng không đồng nghĩa với việc mọi thiết kế đều đã được phê duyệt sản xuất. Đối với sản phẩm cá nhân hóa, Cupfy có thể cần kiểm tra dữ liệu thiết kế và xác nhận khả năng thực hiện trước khi tiến hành sản xuất.
        </p>
        <p className="text-[#4A3E3D]">
          Nếu sản phẩm không còn khả dụng hoặc thiết kế không thể sản xuất theo yêu cầu, Cupfy sẽ liên hệ với khách hàng để thống nhất phương án xử lý.
        </p>
      </section>

      {/* 2.6 */}
      <section className="space-y-3 pt-4 border-t border-[#DDD8D2]">
        <h2 className="text-lg md:text-xl font-bold text-[#3A211E] flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-[#FFF3A6] text-[#4A2A25] inline-flex items-center justify-center text-xs font-black shrink-0">2.6</span>
          Giá bán và thanh toán
        </h2>
        <p className="text-[#4A3E3D]">
          Giá bán sản phẩm được hiển thị bằng đồng Việt Nam trên website.
        </p>
        <p className="text-[#4A3E3D]">
          Tổng thanh toán có thể bao gồm giá sản phẩm, chi phí cá nhân hóa, phụ kiện và phí giao hàng được công bố trước khi khách xác nhận đặt hàng.
        </p>
        <p className="text-[#4A3E3D]">
          Phương thức thanh toán hiện tại của Cupfy là <strong>thanh toán khi nhận hàng (COD)</strong>. Khách hàng thanh toán số tiền được xác nhận cho nhân viên giao hàng theo quy trình giao nhận.
        </p>
        <p className="text-[#4A3E3D]">
          Cupfy không yêu cầu khách hàng cung cấp thông tin thẻ ngân hàng để thực hiện thanh toán COD.
        </p>
      </section>

      {/* 2.7 */}
      <section className="space-y-3 pt-4 border-t border-[#DDD8D2]">
        <h2 className="text-lg md:text-xl font-bold text-[#3A211E] flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-[#FFF3A6] text-[#4A2A25] inline-flex items-center justify-center text-xs font-black shrink-0">2.7</span>
          Hủy đơn hàng
        </h2>
        <p className="text-[#4A3E3D]">
          Khách hàng có thể gửi yêu cầu hủy đơn hàng hoặc hủy từng sản phẩm khi đơn hàng còn đủ điều kiện xử lý.
        </p>
        <p className="text-[#4A3E3D]">
          Đối với sản phẩm thông thường, yêu cầu hủy được xem xét dựa trên trạng thái chuẩn bị và giao hàng.
        </p>
        <p className="text-[#4A3E3D]">
          Đối với sản phẩm cá nhân hóa, khả năng hủy phụ thuộc vào việc thiết kế đã được phê duyệt và sản phẩm đã bắt đầu sản xuất hay chưa.
        </p>
        <p className="text-[#4A3E3D]">
          Những yêu cầu hủy phát sinh sau khi sản phẩm cá nhân hóa đã được đưa vào sản xuất sẽ được Cupfy xem xét theo tình trạng thực tế, thỏa thuận với khách hàng và quy định pháp luật có liên quan.
        </p>
      </section>

      {/* 2.8 */}
      <section className="space-y-3 pt-4 border-t border-[#DDD8D2]">
        <h2 className="text-lg md:text-xl font-bold text-[#3A211E] flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-[#FFF3A6] text-[#4A2A25] inline-flex items-center justify-center text-xs font-black shrink-0">2.8</span>
          Quyền sở hữu trí tuệ
        </h2>
        <p className="text-[#4A3E3D]">
          Tên thương hiệu Cupfy, logo, giao diện website, nội dung giới thiệu và các thành phần thuộc quyền sở hữu hợp pháp của Cupfy hoặc bên cấp phép được bảo vệ theo quy định pháp luật.
        </p>
        <p className="text-[#4A3E3D]">
          Khách hàng không được sao chép, phân phối hoặc khai thác thương mại những nội dung này khi chưa được cho phép.
        </p>
        <p className="text-[#4A3E3D]">
          Đối với hình ảnh và thiết kế do khách hàng tự tạo hoặc tải lên, khách hàng tiếp tục sở hữu những quyền hợp pháp của mình. Việc sử dụng công cụ thiết kế Cupfy không đồng nghĩa với việc khách hàng chuyển giao toàn bộ quyền sở hữu trí tuệ cho Cupfy.
        </p>
        <p className="text-[#4A3E3D]">
          Khách hàng cho phép Cupfy xử lý nội dung thiết kế trong phạm vi cần thiết để cung cấp dịch vụ và thực hiện đơn hàng.
        </p>
      </section>

      {/* 2.9 */}
      <section className="space-y-3 pt-4 border-t border-[#DDD8D2]">
        <h2 className="text-lg md:text-xl font-bold text-[#3A211E] flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-[#FFF3A6] text-[#4A2A25] inline-flex items-center justify-center text-xs font-black shrink-0">2.9</span>
          Giải quyết khiếu nại và tranh chấp
        </h2>
        <p className="text-[#4A3E3D]">
          Khi phát sinh vấn đề liên quan đến sản phẩm, thanh toán, giao hàng hoặc chất lượng dịch vụ, khách hàng có thể liên hệ Cupfy thông qua kênh hỗ trợ chính thức trên website.
        </p>
        <p className="text-[#4A3E3D]">
          Cupfy ưu tiên giải quyết khiếu nại thông qua trao đổi, xác minh thông tin và thống nhất phương án phù hợp với quyền lợi hợp pháp của các bên.
        </p>
        <p className="text-[#4A3E3D]">
          Trường hợp không đạt được thỏa thuận, tranh chấp được giải quyết theo quy định pháp luật Việt Nam.
        </p>
      </section>

      {/* 2.10 */}
      <section className="space-y-3 pt-4 border-t border-[#DDD8D2]">
        <h2 className="text-lg md:text-xl font-bold text-[#3A211E] flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-[#FFF3A6] text-[#4A2A25] inline-flex items-center justify-center text-xs font-black shrink-0">2.10</span>
          Thay đổi điều khoản
        </h2>
        <p className="text-[#4A3E3D]">
          Cupfy có thể điều chỉnh điều khoản sử dụng để phù hợp với hoạt động kinh doanh và quy định pháp luật.
        </p>
        <p className="text-[#4A3E3D]">
          Các thay đổi sẽ được công bố trên website và áp dụng theo thời điểm có hiệu lực được thông báo.
        </p>
      </section>
    </PolicyLayout>
  );
}
