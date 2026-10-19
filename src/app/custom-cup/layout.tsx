import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    absolute: 'Tự Thiết Kế Ly Online, Xem Trước 3D | Cupfy',
  },
  description: 'Tự thiết kế ly cá nhân hóa tại Cupfy. Thêm tên, hình ảnh, logo và họa tiết yêu thích, xem trước mẫu ly 3D và đặt hàng trực tiếp trên website.',
  alternates: {
    canonical: 'https://www.cupfy.space/custom-cup',
  },
  openGraph: {
    title: 'Tự Thiết Kế Ly Online, Xem Trước 3D | Cupfy',
    description: 'Tự thiết kế ly cá nhân hóa tại Cupfy. Thêm tên, hình ảnh, logo và họa tiết yêu thích, xem trước mẫu ly 3D và đặt hàng trực tiếp trên website.',
    url: 'https://www.cupfy.space/custom-cup',
    siteName: 'Cupfy',
    locale: 'vi_VN',
    type: 'website',
  },
};

export default function CustomCupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
