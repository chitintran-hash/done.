import { Metadata } from 'next';
import CommunityClient from './CommunityClient';
import { getPosts, checkIsAdmin } from '@/app/actions/posts';

export const metadata: Metadata = {
  title: {
    absolute: 'Cộng Đồng Sáng Tạo Ly Độc Bản | Cupfy',
  },
  description: 'Khám phá những thiết kế ly cá nhân hóa ấn tượng, hình ảnh thực tế và các câu chuyện sáng tạo từ cộng đồng khách hàng Cupfy.',
  alternates: {
    canonical: 'https://www.cupfy.space/community',
  },
  openGraph: {
    title: 'Cộng Đồng Sáng Tạo Ly Độc Bản | Cupfy',
    description: 'Khám phá những thiết kế ly cá nhân hóa ấn tượng, hình ảnh thực tế và các câu chuyện sáng tạo từ cộng đồng khách hàng Cupfy.',
    url: 'https://www.cupfy.space/community',
    siteName: 'Cupfy',
  },
};

export default async function CommunityPage() {
  const posts = await getPosts('community');
  const isAdmin = await checkIsAdmin();

  return (
    <CommunityClient initialPosts={posts} isAdmin={isAdmin} />
  );
}
