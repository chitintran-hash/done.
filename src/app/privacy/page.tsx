import { Metadata } from 'next';
import PolicyLayout from '@/components/PolicyLayout';
import { ShieldCheck, Lock, Eye, Database, FileText, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Chính Sách Bảo Mật | Cupfy',
  description: 'Chính sách bảo mật thông tin cá nhân và dữ liệu thiết kế ly tại Cupfy.space.',
};

export default function PrivacyPolicyPage() {
  return (
    <PolicyLayout
      title="Chính Sách Bảo Mật"
      subtitle="Quy định về việc thu thập, sử dụng, lưu trữ và bảo vệ dữ liệu cá nhân cũng như bản quyền thiết kế ly cá nhân hóa của khách hàng trên website Cupfy.space."
      effectiveDate="20/10/2026"
      currentSlug="privacy"
    >
      {/* 1.1 */}
      <section className="space-y-3">
        <h2 className="text-lg md:text-xl font-bold text-[#3A211E] flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-[#FFF3A6] text-[#4A2A25] inline-flex items-center justify-center text-xs font-black shrink-0">1.1</span>
          Giới thiệu chung
        </h2>
        <p className="text-[#4A3E3D]">
          Cupfy tôn trọng quyền riêng tư của khách hàng và cam kết bảo vệ thông tin cá nhân được cung cấp trong quá trình truy cập, đăng ký tài khoản, sử dụng công cụ thiết kế ly và mua sắm trên website <strong>Cupfy.space</strong>.
        </p>
        <p className="text-[#4A3E3D]">
          Chính sách bảo mật này được xây dựng nhằm giúp khách hàng hiểu rõ cách Cupfy thu thập, sử dụng, lưu trữ và bảo vệ thông tin cá nhân. Đồng thời, chính sách quy định quyền của khách hàng đối với dữ liệu của mình và trách nhiệm của Cupfy trong quá trình xử lý thông tin.
        </p>
        <p className="text-[#4A3E3D]">
          Cupfy chỉ thu thập những thông tin cần thiết nhằm phục vụ hoạt động thương mại điện tử, xử lý đơn hàng, hỗ trợ khách hàng và cải thiện chất lượng dịch vụ.
        </p>
      </section>

      {/* 1.2 */}
      <section className="space-y-3 pt-4 border-t border-[#DDD8D2]">
        <h2 className="text-lg md:text-xl font-bold text-[#3A211E] flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-[#FFF3A6] text-[#4A2A25] inline-flex items-center justify-center text-xs font-black shrink-0">1.2</span>
          Thông tin cá nhân được thu thập
        </h2>
        <p className="text-[#4A3E3D]">
          Trong quá trình sử dụng website, Cupfy có thể thu thập những thông tin do khách hàng chủ động cung cấp, bao gồm họ và tên, địa chỉ email, số điện thoại, địa chỉ nhận hàng và các thông tin cần thiết khác để tạo tài khoản hoặc hoàn tất giao dịch.
        </p>
        <p className="text-[#4A3E3D]">
          Đối với khách hàng sử dụng công cụ thiết kế ly trực tuyến, Cupfy có thể tiếp nhận và lưu trữ nội dung thiết kế như văn bản, hình ảnh, logo, họa tiết, màu sắc và những dữ liệu liên quan đến quá trình cá nhân hóa sản phẩm.
        </p>
        <p className="text-[#4A3E3D]">
          Ngoài ra, website có thể tự động ghi nhận một số dữ liệu kỹ thuật như địa chỉ IP, loại thiết bị, trình duyệt, thời gian truy cập, các trang được xem và hoạt động tương tác nhằm hỗ trợ vận hành, bảo mật và cải thiện trải nghiệm người dùng.
        </p>
        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 text-xs md:text-sm font-medium flex items-start gap-2.5">
          <Lock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <span>
            <strong>Lưu ý an toàn:</strong> Cupfy không yêu cầu khách hàng cung cấp thông tin thẻ ngân hàng hoặc mật khẩu tài khoản ngân hàng để thực hiện giao dịch thanh toán khi nhận hàng (COD).
          </span>
        </div>
      </section>

      {/* 1.3 */}
      <section className="space-y-3 pt-4 border-t border-[#DDD8D2]">
        <h2 className="text-lg md:text-xl font-bold text-[#3A211E] flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-[#FFF3A6] text-[#4A2A25] inline-flex items-center justify-center text-xs font-black shrink-0">1.3</span>
          Mục đích sử dụng thông tin
        </h2>
        <p className="text-[#4A3E3D]">
          Thông tin cá nhân được Cupfy sử dụng để quản lý tài khoản khách hàng, xác nhận và xử lý đơn hàng, liên hệ khi cần thiết, tổ chức giao nhận sản phẩm và hỗ trợ giải quyết các vấn đề phát sinh trong quá trình mua sắm.
        </p>
        <p className="text-[#4A3E3D]">
          Đối với sản phẩm cá nhân hóa, dữ liệu thiết kế được sử dụng để hiển thị bản xem trước, kiểm tra khả năng sản xuất, thực hiện đơn hàng và hỗ trợ khách hàng xem lại hoặc đặt mua sản phẩm theo thiết kế đã lưu.
        </p>
        <p className="text-[#4A3E3D]">
          Cupfy cũng có thể sử dụng dữ liệu hoạt động trên website để phân tích hiệu quả vận hành, phát hiện lỗi kỹ thuật, ngăn chặn hành vi gian lận và nâng cao chất lượng dịch vụ.
        </p>
        <p className="text-[#4A3E3D]">
          Việc sử dụng thông tin cá nhân cho mục đích quảng cáo hoặc tiếp thị sẽ được thực hiện trên cơ sở phù hợp với quy định pháp luật và lựa chọn của khách hàng.
        </p>
      </section>

      {/* 1.4 */}
      <section className="space-y-3 pt-4 border-t border-[#DDD8D2]">
        <h2 className="text-lg md:text-xl font-bold text-[#3A211E] flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-[#FFF3A6] text-[#4A2A25] inline-flex items-center justify-center text-xs font-black shrink-0">1.4</span>
          Phạm vi chia sẻ thông tin
        </h2>
        <p className="text-[#4A3E3D]">
          Cupfy không bán hoặc trao đổi thông tin cá nhân của khách hàng cho bên thứ ba vì mục đích thương mại trái với quy định pháp luật.
        </p>
        <p className="text-[#4A3E3D]">
          Trong phạm vi cần thiết để thực hiện đơn hàng, Cupfy có thể chia sẻ thông tin người nhận, số điện thoại và địa chỉ giao hàng với đơn vị vận chuyển. Đối với sản phẩm cá nhân hóa, dữ liệu thiết kế có thể được cung cấp cho đối tác sản xuất nhằm bảo đảm sản phẩm được thực hiện đúng yêu cầu.
        </p>
        <p className="text-[#4A3E3D]">
          Cupfy cũng có thể sử dụng các nhà cung cấp dịch vụ công nghệ để vận hành website, lưu trữ dữ liệu và bảo đảm an toàn hệ thống. Việc chia sẻ dữ liệu phải được giới hạn theo mục đích cần thiết và tuân thủ các yêu cầu bảo vệ thông tin cá nhân.
        </p>
        <p className="text-[#4A3E3D]">
          Thông tin có thể được cung cấp cho cơ quan nhà nước có thẩm quyền khi có yêu cầu hợp pháp.
        </p>
      </section>

      {/* 1.5 */}
      <section className="space-y-3 pt-4 border-t border-[#DDD8D2]">
        <h2 className="text-lg md:text-xl font-bold text-[#3A211E] flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-[#FFF3A6] text-[#4A2A25] inline-flex items-center justify-center text-xs font-black shrink-0">1.5</span>
          Lưu trữ và bảo vệ thông tin
        </h2>
        <p className="text-[#4A3E3D]">
          Cupfy áp dụng các biện pháp kỹ thuật và quản lý phù hợp nhằm hạn chế nguy cơ truy cập trái phép, mất mát, tiết lộ hoặc sử dụng sai mục đích thông tin cá nhân.
        </p>
        <p className="text-[#4A3E3D]">
          Thông tin tài khoản, đơn hàng và dữ liệu thiết kế được lưu trữ trong hệ thống phục vụ hoạt động của website. Thời gian lưu trữ được xác định dựa trên mục đích xử lý dữ liệu, yêu cầu vận hành và nghĩa vụ pháp lý có liên quan.
        </p>
        <p className="text-[#4A3E3D]">
          Cupfy không cam kết loại bỏ hoàn toàn mọi rủi ro an ninh mạng nhưng có trách nhiệm thực hiện các biện pháp hợp lý để bảo vệ thông tin và xử lý sự cố khi phát hiện.
        </p>
      </section>

      {/* 1.6 */}
      <section className="space-y-3 pt-4 border-t border-[#DDD8D2]">
        <h2 className="text-lg md:text-xl font-bold text-[#3A211E] flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-[#FFF3A6] text-[#4A2A25] inline-flex items-center justify-center text-xs font-black shrink-0">1.6</span>
          Quyền của khách hàng
        </h2>
        <p className="text-[#4A3E3D]">
          Khách hàng có quyền yêu cầu được cung cấp thông tin về hoạt động xử lý dữ liệu cá nhân của mình, đề nghị chỉnh sửa thông tin không chính xác và thực hiện các quyền khác theo quy định pháp luật.
        </p>
        <p className="text-[#4A3E3D]">
          Trong phạm vi hệ thống hỗ trợ, khách hàng có thể cập nhật thông tin tài khoản, xem lịch sử đơn hàng và quản lý những thiết kế đã lưu.
        </p>
        <p className="text-[#4A3E3D]">
          Khách hàng có thể gửi yêu cầu liên quan đến việc truy cập, chỉnh sửa, rút lại sự đồng ý hoặc xóa dữ liệu cá nhân thông qua kênh hỗ trợ chính thức của Cupfy. Một số dữ liệu có thể cần tiếp tục được lưu trữ để thực hiện nghĩa vụ pháp lý hoặc giải quyết giao dịch chưa hoàn tất.
        </p>
      </section>

      {/* 1.7 */}
      <section className="space-y-3 pt-4 border-t border-[#DDD8D2]">
        <h2 className="text-lg md:text-xl font-bold text-[#3A211E] flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-[#FFF3A6] text-[#4A2A25] inline-flex items-center justify-center text-xs font-black shrink-0">1.7</span>
          Bảo mật dữ liệu thiết kế cá nhân hóa
        </h2>
        <p className="text-[#4A3E3D]">
          Các hình ảnh, logo và nội dung do khách hàng tải lên trong quá trình thiết kế ly được sử dụng nhằm phục vụ hoạt động cá nhân hóa và thực hiện đơn hàng.
        </p>
        <p className="text-[#4A3E3D]">
          Cupfy không tự ý công khai thiết kế riêng tư của khách hàng trên website, mạng xã hội hoặc các tài liệu quảng cáo khi chưa có cơ sở pháp lý phù hợp.
        </p>
        <p className="text-[#4A3E3D]">
          Trường hợp khách hàng chủ động chia sẻ thiết kế tại khu vực cộng đồng, nội dung được công khai theo phạm vi hiển thị và quyền riêng tư của tính năng đó.
        </p>
        <p className="text-[#4A3E3D]">
          Khách hàng có trách nhiệm bảo đảm mình có quyền sử dụng những hình ảnh, logo và nội dung được tải lên hệ thống.
        </p>
      </section>

      {/* 1.8 */}
      <section className="space-y-3 pt-4 border-t border-[#DDD8D2]">
        <h2 className="text-lg md:text-xl font-bold text-[#3A211E] flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-[#FFF3A6] text-[#4A2A25] inline-flex items-center justify-center text-xs font-black shrink-0">1.8</span>
          Thay đổi chính sách
        </h2>
        <p className="text-[#4A3E3D]">
          Cupfy có quyền cập nhật chính sách bảo mật khi có sự thay đổi về hoạt động kinh doanh, công nghệ hoặc quy định pháp luật.
        </p>
        <p className="text-[#4A3E3D]">
          Những thay đổi quan trọng sẽ được thông báo bằng phương thức phù hợp. Phiên bản mới sẽ thể hiện ngày cập nhật để khách hàng có thể theo dõi.
        </p>
      </section>
    </PolicyLayout>
  );
}
