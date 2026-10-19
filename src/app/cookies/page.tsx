import { Metadata } from 'next';
import PolicyLayout from '@/components/PolicyLayout';
import { Cookie, Settings, BarChart2, Megaphone, Shield, CheckCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Chính Sách Cookie | Cupfy',
  description: 'Chính sách sử dụng Cookie và các công nghệ lưu trữ dữ liệu tại Cupfy.space.',
};

export default function CookiePolicyPage() {
  return (
    <PolicyLayout
      title="Chính Sách Cookie"
      subtitle="Giải thích mục đích sử dụng Cookie và các công nghệ lưu trữ tương tự nhằm hỗ trợ vận hành website, duy trì giỏ hàng và bảo vệ phiên làm việc của khách hàng."
      effectiveDate="20/10/2026"
      currentSlug="cookies"
    >
      {/* 3.1 */}
      <section className="space-y-3">
        <h2 className="text-lg md:text-xl font-bold text-[#3A211E] flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-[#FFF3A6] text-[#4A2A25] inline-flex items-center justify-center text-xs font-black shrink-0">3.1</span>
          Giới thiệu
        </h2>
        <p className="text-[#4A3E3D]">
          Cupfy sử dụng Cookie và các công nghệ lưu trữ tương tự nhằm hỗ trợ hoạt động của website, duy trì trải nghiệm mua sắm và cải thiện chất lượng dịch vụ.
        </p>
        <p className="text-[#4A3E3D]">
          Cookie là những tệp dữ liệu nhỏ được lưu trên trình duyệt hoặc thiết bị khi người dùng truy cập website. Những tệp này có thể giúp website ghi nhớ một số thông tin cần thiết trong quá trình sử dụng.
        </p>
        <p className="text-[#4A3E3D]">
          Chính sách này giải thích mục đích sử dụng Cookie và cách khách hàng có thể quản lý các lựa chọn liên quan.
        </p>
      </section>

      {/* 3.2 */}
      <section className="space-y-3 pt-4 border-t border-[#DDD8D2]">
        <h2 className="text-lg md:text-xl font-bold text-[#3A211E] flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-[#FFF3A6] text-[#4A2A25] inline-flex items-center justify-center text-xs font-black shrink-0">3.2</span>
          Cookie cần thiết
        </h2>
        <p className="text-[#4A3E3D]">
          Cookie cần thiết được sử dụng để hỗ trợ những chức năng cơ bản của website như duy trì phiên đăng nhập, bảo đảm an toàn tài khoản, quản lý giỏ hàng và hỗ trợ quá trình thanh toán.
        </p>
        <p className="text-[#4A3E3D]">
          Một số dữ liệu lưu trữ tương tự cũng có thể được sử dụng để ghi nhớ trạng thái làm việc trong công cụ thiết kế ly, giúp hạn chế việc mất thông tin khi khách hàng chuyển giữa các bước.
        </p>
        <p className="text-[#4A3E3D]">
          Những công nghệ lưu trữ thực sự cần thiết cho hoạt động của website có thể được sử dụng theo cơ sở pháp lý phù hợp.
        </p>
      </section>

      {/* 3.3 */}
      <section className="space-y-3 pt-4 border-t border-[#DDD8D2]">
        <h2 className="text-lg md:text-xl font-bold text-[#3A211E] flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-[#FFF3A6] text-[#4A2A25] inline-flex items-center justify-center text-xs font-black shrink-0">3.3</span>
          Cookie chức năng
        </h2>
        <p className="text-[#4A3E3D]">
          Cookie chức năng giúp Cupfy ghi nhớ những lựa chọn của khách hàng nhằm tạo ra trải nghiệm thuận tiện hơn trong những lần truy cập tiếp theo.
        </p>
        <p className="text-[#4A3E3D]">
          Các lựa chọn có thể bao gồm ngôn ngữ hiển thị, tùy chọn giao diện và một số thiết lập sử dụng website.
        </p>
        <p className="text-[#4A3E3D]">
          Việc sử dụng Cookie chức năng phụ thuộc vào cấu hình thực tế của hệ thống và lựa chọn của người dùng khi pháp luật yêu cầu.
        </p>
      </section>

      {/* 3.4 */}
      <section className="space-y-3 pt-4 border-t border-[#DDD8D2]">
        <h2 className="text-lg md:text-xl font-bold text-[#3A211E] flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-[#FFF3A6] text-[#4A2A25] inline-flex items-center justify-center text-xs font-black shrink-0">3.4</span>
          Cookie phân tích
        </h2>
        <p className="text-[#4A3E3D]">
          Cupfy có thể sử dụng Cookie phân tích để tìm hiểu cách khách hàng tương tác với website, chẳng hạn như số lượt truy cập, thời gian sử dụng, những trang được xem và các lỗi phát sinh trong quá trình thao tác.
        </p>
        <p className="text-[#4A3E3D]">
          Dữ liệu phân tích giúp Cupfy đánh giá hiệu quả hoạt động, phát hiện những điểm chưa thuận tiện và cải thiện trải nghiệm mua sắm.
        </p>
        <p className="text-[#4A3E3D]">
          Đối với các Cookie phân tích không thực sự cần thiết, Cupfy sẽ áp dụng cơ chế thông báo và lựa chọn phù hợp với quy định pháp luật.
        </p>
      </section>

      {/* 3.5 */}
      <section className="space-y-3 pt-4 border-t border-[#DDD8D2]">
        <h2 className="text-lg md:text-xl font-bold text-[#3A211E] flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-[#FFF3A6] text-[#4A2A25] inline-flex items-center justify-center text-xs font-black shrink-0">3.5</span>
          Cookie tiếp thị
        </h2>
        <p className="text-[#4A3E3D]">
          Trong trường hợp triển khai các hoạt động quảng cáo trực tuyến, Cupfy có thể sử dụng Cookie hoặc công nghệ tương tự để đo lường hiệu quả chiến dịch và hỗ trợ cung cấp nội dung tiếp thị phù hợp.
        </p>
        <p className="text-[#4A3E3D]">
          Những công nghệ này chỉ được triển khai khi đáp ứng yêu cầu về thông báo, sự đồng ý và các điều kiện xử lý dữ liệu cá nhân có liên quan.
        </p>
        <p className="text-[#4A3E3D]">
          Khách hàng có thể từ chối Cookie tiếp thị mà không làm mất khả năng truy cập các chức năng mua sắm cơ bản của website.
        </p>
      </section>

      {/* 3.6 */}
      <section className="space-y-3 pt-4 border-t border-[#DDD8D2]">
        <h2 className="text-lg md:text-xl font-bold text-[#3A211E] flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-[#FFF3A6] text-[#4A2A25] inline-flex items-center justify-center text-xs font-black shrink-0">3.6</span>
          Cookie từ bên thứ ba
        </h2>
        <p className="text-[#4A3E3D]">
          Một số dịch vụ công nghệ được tích hợp vào Cupfy có thể sử dụng Cookie riêng để cung cấp chức năng, phân tích hoạt động hoặc hỗ trợ bảo mật.
        </p>
        <p className="text-[#4A3E3D]">
          Các nhà cung cấp này có thể áp dụng chính sách quyền riêng tư riêng đối với dữ liệu được xử lý trong phạm vi dịch vụ của họ.
        </p>
        <p className="text-[#4A3E3D]">
          Cupfy có trách nhiệm lựa chọn và quản lý các dịch vụ được tích hợp phù hợp với mục đích hoạt động của website.
        </p>
      </section>

      {/* 3.7 */}
      <section className="space-y-3 pt-4 border-t border-[#DDD8D2]">
        <h2 className="text-lg md:text-xl font-bold text-[#3A211E] flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-[#FFF3A6] text-[#4A2A25] inline-flex items-center justify-center text-xs font-black shrink-0">3.7</span>
          Quản lý Cookie
        </h2>
        <p className="text-[#4A3E3D]">
          Khách hàng có thể kiểm tra, hạn chế hoặc xóa Cookie thông qua phần cài đặt quyền riêng tư của trình duyệt.
        </p>
        <p className="text-[#4A3E3D]">
          Đối với các Cookie không cần thiết, khách hàng có thể điều chỉnh lựa chọn thông qua công cụ quản lý Cookie của Cupfy khi chức năng này được triển khai.
        </p>
        <p className="text-[#4A3E3D]">
          Việc vô hiệu hóa một số Cookie cần thiết có thể ảnh hưởng đến khả năng đăng nhập, lưu giỏ hàng hoặc sử dụng một số tính năng của website.
        </p>
      </section>

      {/* 3.8 */}
      <section className="space-y-3 pt-4 border-t border-[#DDD8D2]">
        <h2 className="text-lg md:text-xl font-bold text-[#3A211E] flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-[#FFF3A6] text-[#4A2A25] inline-flex items-center justify-center text-xs font-black shrink-0">3.8</span>
          Thay đổi chính sách
        </h2>
        <p className="text-[#4A3E3D]">
          Cupfy có thể cập nhật chính sách Cookie khi thay đổi công nghệ, công cụ phân tích hoặc phương thức xử lý dữ liệu.
        </p>
        <p className="text-[#4A3E3D]">
          Những thay đổi quan trọng sẽ được công bố trên website cùng thời điểm cập nhật.
        </p>
      </section>
    </PolicyLayout>
  );
}
