import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mua Ly Thủy Tinh, Ly Nhựa Đẹp | Cupfy',
  description: 'Khám phá các mẫu ly thủy tinh và ly nhựa tại Cupfy. Lựa chọn sản phẩm phù hợp với nhu cầu sử dụng hoặc tự thiết kế chiếc ly mang phong cách riêng.',
  alternates: {
    canonical: 'https://www.cupfy.space/products',
  },
  openGraph: {
    title: 'Mua Ly Thủy Tinh, Ly Nhựa Đẹp | Cupfy',
    description: 'Khám phá các mẫu ly thủy tinh và ly nhựa tại Cupfy. Lựa chọn sản phẩm phù hợp với nhu cầu sử dụng hoặc tự thiết kế chiếc ly mang phong cách riêng.',
    url: 'https://www.cupfy.space/products',
    siteName: 'Cupfy',
    locale: 'vi_VN',
    type: 'website',
  },
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
